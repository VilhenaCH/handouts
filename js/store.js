// Estado do app + persistência.
// Textos/estilo/camadas → localStorage. Imagens (dataURL) → IndexedDB. Tudo em try/catch:
// em aba anônima ou com armazenamento bloqueado o app continua funcionando, só não salva.
window.Store = (function () {
  const KEY = 'adc2.state';
  const LAYER_IDS = ['paper', 'content', 'notes', 'stamps', 'media', 'uv'];
  const imgs = H.ctx.imgs; // id -> dataURL (memória)

  let S = {
    tpl: null, mode: 'jogador', theme: 'dark', tab: 'content',
    fmt: 'png', scale: 2, page: 'orig', docs: {},
  };

  const getTpl = (id) => window.TEMPLATES.find((t) => t.id === id);

  function newDoc(t) {
    const values = {};
    for (const f of t.fields) values[f.key] = f.default ?? '';
    const layers = {};
    for (const id of LAYER_IDS) layers[id] = { on: id !== 'uv', op: 100 };
    return {
      title: '',
      values,
      style: {
        body: null, hand: null, title: null, ink: null, paper: null,
        wear: t.wear ?? 40, tilt: 0, assim: 0, intruder: 'ELES',
        seed: Math.floor(Math.random() * 1e9),
      },
      layers,
      atts: [],
    };
  }

  // Garante campos novos quando o template ganha campos depois do salvamento.
  function heal(doc, t) {
    const base = newDoc(t);
    for (const k of Object.keys(base.values)) if (!(k in doc.values)) doc.values[k] = base.values[k];
    doc.style = Object.assign({}, base.style, doc.style || {});
    doc.layers = Object.assign({}, base.layers, doc.layers || {});
    for (const id of LAYER_IDS) doc.layers[id] = Object.assign({ on: true, op: 100 }, doc.layers[id]);
    doc.atts = Array.isArray(doc.atts) ? doc.atts : [];
    return doc;
  }

  function doc(id) {
    id = id || S.tpl;
    const t = getTpl(id);
    if (!S.docs[id]) S.docs[id] = newDoc(t);
    else heal(S.docs[id], t);
    return S.docs[id];
  }

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  /* ---------- localStorage ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) Object.assign(S, JSON.parse(raw));
    } catch (e) { /* sem armazenamento: segue com o padrão */ }
    if (!getTpl(S.tpl)) S.tpl = window.TEMPLATES[0].id;
    try { if (!localStorage.getItem(KEY) && matchMedia('(prefers-color-scheme: light)').matches) S.theme = 'light'; } catch (e) { /* */ }
  }

  let timer = null;
  function save() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* cheio ou bloqueado */ }
    }, 250);
  }

  /* ---------- IndexedDB (imagens) ---------- */
  let db = null;
  function idbOpen() {
    return new Promise((resolve) => {
      try {
        const rq = indexedDB.open('adc2-img', 1);
        rq.onupgradeneeded = () => rq.result.createObjectStore('img');
        rq.onsuccess = () => resolve(rq.result);
        rq.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }
  async function initImages() {
    db = await idbOpen();
    if (!db) return;
    await new Promise((resolve) => {
      try {
        const tx = db.transaction('img', 'readonly');
        const st = tx.objectStore('img');
        const rq = st.openCursor();
        rq.onsuccess = () => {
          const c = rq.result;
          if (c) { imgs[c.key] = c.value; c.continue(); } else resolve();
        };
        rq.onerror = () => resolve();
      } catch (e) { resolve(); }
    });
  }
  function putImage(id, data) {
    imgs[id] = data;
    if (!db) return;
    try { db.transaction('img', 'readwrite').objectStore('img').put(data, id); } catch (e) { /* */ }
  }
  function delImage(id) {
    delete imgs[id];
    if (!db) return;
    try { db.transaction('img', 'readwrite').objectStore('img').delete(id); } catch (e) { /* */ }
  }

  // Lê o arquivo, reduz para no máximo `max` px e devolve dataURL.
  async function fileToDataURL(file, max = 1600) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error('Não consegui abrir essa imagem. Use JPG, PNG, WebP ou GIF.'));
        i.src = url;
      });
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * k));
      const h = Math.max(1, Math.round(img.naturalHeight * k));
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      const keepAlpha = /png|gif|webp|svg/.test(file.type);
      return { data: c.toDataURL(keepAlpha ? 'image/png' : 'image/jpeg', 0.88), w, h };
    } finally { URL.revokeObjectURL(url); }
  }

  async function addImage(file) {
    const { data, w, h } = await fileToDataURL(file);
    const id = uid();
    putImage(id, data);
    return { id, w, h };
  }

  /* ---------- projeto (.json) ---------- */
  function exportProject() {
    const used = new Set();
    for (const d of Object.values(S.docs)) {
      for (const a of d.atts) used.add(a.img);
      for (const v of Object.values(d.values)) if (typeof v === 'string' && imgs[v]) used.add(v);
    }
    const out = { app: 'arquivo-do-caso', v: 2, state: S, imgs: {} };
    for (const id of used) if (imgs[id]) out.imgs[id] = imgs[id];
    return JSON.stringify(out);
  }
  function importProject(text) {
    const o = JSON.parse(text);
    if (!o || o.app !== 'arquivo-do-caso' || !o.state) throw new Error('Esse arquivo não é um projeto do Arquivo do Caso.');
    Object.assign(S, o.state);
    for (const [id, data] of Object.entries(o.imgs || {})) putImage(id, data);
    if (!getTpl(S.tpl)) S.tpl = window.TEMPLATES[0].id;
    save();
  }

  function resetDoc() { delete S.docs[S.tpl]; save(); }

  return {
    get S() { return S; }, LAYER_IDS, getTpl, doc, uid, load, save, initImages,
    putImage, delImage, addImage, imgs, exportProject, importProject, resetDoc,
  };
})();

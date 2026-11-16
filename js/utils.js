// Utilitários compartilhados pelos templates (window.H).
// Cada template recebe `h` no render(v, h): escape, markup (~~tarja~~, {{nota}}, [[uv]]),
// corrupção "Assimilação", efeitos de papel e imagens.
window.TEMPLATES = window.TEMPLATES || [];

window.H = (function () {
  const ctx = { mode: 'jogador', assim: 0, seed: 1, intruder: 'ELES', imgs: {} };

  const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // PRNG determinístico (mulberry32): a corrupção é sempre a mesma para o mesmo texto/seed.
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const GLYPHS = '▓▒░█#%&§¤¿?';

  function matchCase(word, model) {
    if (model === model.toUpperCase()) return word.toUpperCase();
    if (model[0] === model[0].toUpperCase()) return word[0].toUpperCase() + word.slice(1).toLowerCase();
    return word.toLowerCase();
  }

  // "Assimilação": troca palavras por um intruso, gagueja, espelha e suja letras.
  // Nunca altera o dado salvo — só o que é desenhado.
  function corrupt(text) {
    const level = ctx.assim;
    if (!level || !text) return text;
    const r = rng(ctx.seed ^ hash(text));
    const pw = Math.pow(level / 100, 1.6) * 0.32;
    const pl = (level / 100) * 0.09;
    return text.replace(/[\p{L}]+/gu, (w) => {
      if (w.length > 2 && r() < pw) {
        const m = r();
        if (m < 0.45) return matchCase(ctx.intruder || 'ELES', w);
        if (m < 0.75) return w + ' ' + w;
        return Array.from(w).reverse().join('');
      }
      return Array.from(w).map((c) => (r() < pl ? GLYPHS[Math.floor(r() * GLYPHS.length)] : c)).join('');
    });
  }

  const plain = (s) => esc(corrupt(s));

  // Texto simples (sem markup), com corrupção.
  const t = (s) => plain(String(s ?? ''));

  // Texto rico: ~~tarja~~ (camada Conteúdo), {{nota de margem}} (Anotações), [[tinta UV]] (Camada oculta).
  function rt(raw) {
    const src = String(raw ?? '');
    const re = /~~([\s\S]+?)~~|\{\{([\s\S]+?)\}\}|\[\[([\s\S]+?)\]\]/g;
    let out = '', last = 0, m;
    while ((m = re.exec(src))) {
      out += plain(src.slice(last, m.index));
      if (m[1] !== undefined) {
        out += ctx.mode === 'mestre'
          ? `<span class="tj tj-m">${plain(m[1])}</span>`
          : `<span class="tj"><span class="tj-t">${plain(m[1])}</span></span>`;
      } else if (m[2] !== undefined) {
        out += `<span class="nota" data-layer="notes">${plain(m[2])}</span>`;
      } else {
        out += `<span class="uv" data-layer="uv">${plain(m[3])}</span>`;
      }
      last = re.lastIndex;
    }
    return out + plain(src.slice(last));
  }

  // Efeitos de papel (camada "Papel e desgaste"): grão, manchas, dobras, vinheta.
  // A intensidade vem de --wear (0–100) no elemento raiz do documento.
  function fx() {
    return '<div class="fx" data-layer="paper" aria-hidden="true">' +
      '<svg class="fx-g" width="100%" height="100%"><filter id="fxn" x="0" y="0" width="100%" height="100%">' +
      '<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"></feTurbulence>' +
      '<feColorMatrix values="0 0 0 0 .1  0 0 0 0 .08  0 0 0 0 .05  0 0 0 .9 0"></feColorMatrix></filter>' +
      '<rect width="100%" height="100%" filter="url(#fxn)"></rect></svg>' +
      '<i class="fx-s1"></i><i class="fx-s2"></i><i class="fx-f1"></i><i class="fx-f2"></i><i class="fx-v"></i></div>';
  }

  // Imagem principal de um slot do template (ou placeholder rotulado).
  function slot(id, cls, label) {
    const src = ctx.imgs[id];
    return src
      ? `<img class="${cls}" src="${src}" alt="">`
      : `<div class="${cls} ph"><span>${esc(label || 'sem imagem')}</span></div>`;
  }

  // Quebra de linha → <br> respeitando markup.
  const br = (html) => html.replace(/\n/g, '<br>');

  // Linhas "chave: valor" → array; usado por tabelas/listas.
  function lines(raw) { return String(raw ?? '').split('\n').map((l) => l.trimEnd()).filter((l) => l.trim()); }

  // Cena de reserva (corredor escuro com porta e uma silhueta) para quando ainda não há foto.
  function scene(cls, style) {
    return `<svg class="${cls}" style="${style || ''}" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` +
      '<defs><linearGradient id="scW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46443e"/><stop offset="1" stop-color="#25241f"/></linearGradient>' +
      '<linearGradient id="scF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2a25"/><stop offset="1" stop-color="#121210"/></linearGradient>' +
      '<radialGradient id="scL" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#d9d2b8" stop-opacity=".55"/><stop offset="1" stop-color="#d9d2b8" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="400" height="300" fill="url(#scW)"/><polygon points="0,210 400,196 400,300 0,300" fill="url(#scF)"/>' +
      '<rect x="64" y="64" width="86" height="148" fill="#8d8774"/><rect x="72" y="72" width="70" height="140" fill="#cfc8ad"/><rect x="64" y="64" width="86" height="148" fill="url(#scL)"/>' +
      '<rect x="262" y="40" width="70" height="52" fill="#9ba39a" opacity=".5"/>' +
      '<g fill="#0b0b0a"><ellipse cx="270" cy="112" rx="15" ry="19"/><path d="M246 140q24-14 48 0l8 76h-64z"/><rect x="254" y="214" width="14" height="52"/><rect x="272" y="214" width="14" height="52"/></g></svg>';
  }

  return { ctx, esc, t, rt, br, fx, slot, lines, corrupt, rng, hash, scene };
})();

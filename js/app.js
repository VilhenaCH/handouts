// Interface do Arquivo do Caso: lista de modelos, bancada, inspetor (Conteúdo · Estilo · Anexos · Camadas)
// e exportação. Vanilla JS, sem build. Funciona em desktop e celular.
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = H.esc;
  const S = Store.S;

  const GROUPS = ['Polícia', 'Perícia', 'Imprensa', 'Ordem', 'Pessoal', 'Digital', 'Objetos'];
  const LAYERS = [
    ['uv', 'Camada oculta', 'Tinta UV: aparece no estado Mestre ou se ligada'],
    ['media', 'Anexos', 'Imagens livres, fitas e molduras'],
    ['stamps', 'Carimbos e fitas', 'Carimbos, selos e fitas do modelo'],
    ['notes', 'Anotações', 'Escrita à mão na margem'],
    ['content', 'Conteúdo', 'Texto do modelo e tarjas'],
    ['paper', 'Papel e desgaste', 'Manchas, dobras, grão e vinheta'],
  ];
  const FILTERS = [['original', 'Original'], ['pb', 'P&B'], ['xerox', 'Xerox'], ['sepia', 'Sépia'], ['cftv', 'CFTV'], ['halftone', 'Meio-tom']];
  const FRAMES = [['none', 'Nenhuma'], ['tape', 'Fita'], ['clip', 'Clipe'], ['polaroid', 'Polaroid']];
  const FONTS = {
    body: ['Courier Prime', 'Special Elite', 'Cutive Mono', 'IBM Plex Mono', 'Share Tech Mono', 'VT323', 'Source Serif 4', 'PT Serif', 'Libre Baskerville', 'Public Sans', 'Roboto'],
    hand: ['Caveat', 'Reenie Beanie', 'Nothing You Could Do', 'La Belle Aurore', 'Homemade Apple', 'Covered By Your Grace', 'Gochi Hand', 'Kalam', 'Shadows Into Light', 'Permanent Marker', 'Rock Salt', 'Cedarville Cursive'],
    title: ['Barlow Condensed', 'Anton', 'Bebas Neue', 'Oswald', 'Alfa Slab One', 'Playfair Display', 'Old Standard TT', 'UnifrakturMaguntia', 'Cinzel', 'IM Fell English', 'Cormorant Garamond'],
  };
  const SLOT_LABEL = { body: 'Fonte do texto', hand: 'Fonte manuscrita', title: 'Fonte dos títulos' };
  const INKS = ['#111111', '#1f2f99', '#5a3fa8', '#5b4326', '#8a1a1a', '#1d3f9a'];
  const PAPERS = ['#ffffff', '#f4f1e6', '#e9e3d3', '#d9d2bd', '#efe6cf', '#d6dcd9'];
  const stack = (f) => `'${f}', 'Courier New', monospace`;

  const ICON = {
    models: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>',
    content: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/></svg>',
    style: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19L10 5l6 14"/><path d="M6.5 14h7"/><path d="M18 9v10M15 12h6"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4l9 5-9 5-9-5z"/><path d="M3 14l9 5 9-5"/></svg>',
    export: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/></svg>',
    eyeOn: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 4-.9"/></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  };

  let selAtt = null;          // anexo selecionado (não persiste)
  let pendingKey = null;      // campo de imagem aguardando arquivo
  let zoom = null;            // null = ajustar à tela
  let scale = 1;
  let busy = false;
  let query = '';

  const tpl = () => Store.getTpl(S.tpl);
  const doc = () => Store.doc();

  /* ====================== utilitários de UI ====================== */
  let toastTimer;
  function toast(msg, err) {
    const el = $('#toast');
    el.textContent = msg; el.hidden = false; el.className = err ? 'err' : '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, err ? 7000 : 3200);
  }
  const pressed = (v) => (v ? 'true' : 'false');
  const fontsFor = (t, d) => {
    const out = [...(t.usesFonts || [])];
    for (const k of ['body', 'hand', 'title']) if (t.fonts && t.fonts[k]) out.push(d.style[k] || t.fonts[k]);
    return out;
  };
  function ensureCss(t) {
    if (document.querySelector(`style[data-tpl="${t.id}"]`)) return;
    const st = document.createElement('style');
    st.dataset.tpl = t.id; st.textContent = t.css || '';
    document.head.appendChild(st);
  }

  /* ====================== documento ====================== */
  function attHtml(a) {
    const src = H.ctx.imgs[a.img];
    if (!src) return '';
    const on = a.id === selAtt;
    return `<div class="att f-${a.filter} fr-${a.frame}${on ? ' sel' : ''}" data-att="${a.id}" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;transform:rotate(${a.rot}deg);z-index:${a.z}"><img src="${src}" alt="" draggable="false">${on ? '<i class="att-h" data-ui data-handle></i>' : ''}</div>`;
  }

  function sheetHtml(t, d) {
    H.ctx.mode = S.mode; H.ctx.assim = d.style.assim; H.ctx.seed = d.style.seed; H.ctx.intruder = d.style.intruder;
    const inner = t.render(d.values, H);
    const cls = [];
    for (const id of Store.LAYER_IDS) {
      if (id === 'uv') { if (!(S.mode === 'mestre' || d.layers.uv.on)) cls.push('off-uv'); }
      else if (!d.layers[id].on) cls.push('off-' + id);
    }
    const st = d.style;
    const vars = [
      `--f-body:${stack(st.body || t.fonts.body || 'Courier Prime')}`,
      `--f-hand:'${st.hand || t.fonts.hand || 'Caveat'}', cursive`,
      `--f-title:'${st.title || t.fonts.title || 'Barlow Condensed'}', sans-serif`,
      `--wear:${st.wear}`, `--tilt:${st.tilt}deg`,
    ];
    if (st.ink) vars.push(`--u-ink:${st.ink}`, `--note:${st.ink}`);
    if (st.paper) vars.push(`--u-paper:${st.paper}`);
    for (const id of Store.LAYER_IDS) vars.push(`--op-${id}:${d.layers[id].op / 100}`);
    const bleed = (t.bleed || 0) + Math.ceil(Math.abs(st.tilt) * 10);
    const h = t.height ? `min-height:${t.height}px;` : '';
    return `<div class="sheet ${cls.join(' ')} m-${S.mode}" id="sheet" style="${vars.join(';')};padding:${bleed}px"><div class="doc" style="width:${t.width}px;${h}">${inner}<div class="att-layer" data-layer="media">${d.atts.map(attHtml).join('')}</div></div></div>`;
  }

  function renderDoc() {
    const t = tpl(), d = doc();
    ensureCss(t);
    $('#host').innerHTML = sheetHtml(t, d);
    $('#cap').textContent = `${t.name} · ${t.width} px · estado ${S.mode === 'mestre' ? 'Mestre' : 'Jogador'}`;
    fit();
  }

  function fit() {
    const sheet = $('#sheet'); if (!sheet) return;
    const vp = $('#vp');
    const w = sheet.offsetWidth, h = sheet.offsetHeight;
    const cs = getComputedStyle(vp);
    const aw = vp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const ah = vp.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    let s = zoom != null ? zoom : Math.min(aw / w, ah / h, 1.25);
    s = Math.max(0.15, Math.min(3, s || 1));
    scale = s;
    const sc = $('#scaler');
    sc.style.width = w * s + 'px'; sc.style.height = h * s + 'px';
    sc.classList.toggle('flat', !(tpl().bleed) && doc().style.tilt === 0);
    $('#host').style.transform = `scale(${s})`;
    $('#zoomLbl').textContent = Math.round(s * 100) + '%';
  }

  /* ====================== barra superior / modelos / barra inferior ====================== */
  function renderTop() {
    $('#modeSeg').innerHTML =
      `<button type="button" data-act="mode" data-v="jogador" aria-pressed="${pressed(S.mode === 'jogador')}">Jogador</button>` +
      `<button type="button" data-act="mode" data-v="mestre" aria-pressed="${pressed(S.mode === 'mestre')}">Mestre</button>`;
    $('#themeBtn').innerHTML = S.theme === 'dark' ? ICON.sun : ICON.moon;
    document.documentElement.dataset.theme = S.theme;
  }

  function renderModels() {
    const q = query.trim().toLowerCase();
    let html = `<label class="fld"><span class="lbl">Buscar modelo</span><input type="search" id="q" placeholder="carta, laudo, cftv…" value="${esc(query)}" autocomplete="off"></label><div>`;
    let any = false;
    const groups = GROUPS.concat([...new Set(window.TEMPLATES.map((t) => t.category))].filter((c) => !GROUPS.includes(c)));
    for (const g of groups) {
      const items = window.TEMPLATES.filter((t) => t.category === g && (!q || (t.name + ' ' + g).toLowerCase().includes(q)));
      if (!items.length) continue;
      any = true;
      html += `<div class="grp-t">${g}</div>` + items.map((t) =>
        `<button class="row" type="button" data-act="tpl" data-id="${t.id}" aria-current="${pressed(t.id === S.tpl)}"><span class="sw" style="background:${t.paper}"></span><span>${esc(t.name)}</span></button>`).join('');
    }
    if (!any) html += '<div class="empty">Nenhum modelo com esse nome.</div>';
    $('#models').innerHTML = html + '</div>';
    const qi = $('#q');
    if (qi) qi.addEventListener('input', (e) => {
      query = e.target.value; const pos = e.target.selectionStart; renderModels();
      const n = $('#q'); n.focus(); n.setSelectionRange(pos, pos);
    });
  }

  function renderBar() {
    const sheet = document.body.classList.contains('sh-models') ? 'models' : document.body.classList.contains('sh-insp') ? S.tab : null;
    const b = (id, label, ic) => `<button type="button" data-act="bar" data-v="${id}" aria-pressed="${pressed(sheet === id)}">${ICON[ic]}<span>${label}</span></button>`;
    $('#bar').innerHTML = b('models', 'Modelos', 'models') + b('content', 'Conteúdo', 'content') + b('style', 'Estilo', 'style') + b('layers', 'Camadas', 'layers') + b('export', 'Exportar', 'export');
  }

  /* ====================== inspetor ====================== */
  function renderTabs() {
    const tabs = [['content', 'Conteúdo'], ['style', 'Estilo'], ['media', 'Anexos'], ['layers', 'Camadas'], ['export', 'Exportar']];
    $('#tabs').innerHTML = tabs.map(([id, n]) =>
      `<button type="button" role="tab" data-act="tab" data-v="${id}" class="${id === 'export' ? 't-export' : ''}" aria-selected="${pressed(S.tab === id)}">${n}</button>`).join('');
  }

  function fieldHtml(f, v) {
    const id = 'f-' + f.key;
    const hint = f.hint ? `<p class="hint">${f.hint}</p>` : '';
    if (f.type === 'textarea') {
      const mk = f.markup === false ? '' : '<span class="mk"><button type="button" data-act="mk" data-k="~~">Tarjar</button><button type="button" data-act="mk" data-k="{{">Nota</button><button type="button" data-act="mk" data-k="[[">UV</button></span>';
      return `<div class="fld"><div class="fld-h"><label for="${id}">${esc(f.label)}</label>${mk}</div><textarea id="${id}" data-f="${f.key}" rows="${f.rows || 6}">${esc(v)}</textarea>${hint}</div>`;
    }
    if (f.type === 'select') {
      return `<div class="fld"><label for="${id}">${esc(f.label)}</label><select id="${id}" data-f="${f.key}">${f.options.map((o) => `<option value="${esc(o)}"${o === v ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>${hint}</div>`;
    }
    if (f.type === 'range') {
      return `<div class="fld"><label for="${id}" class="val"><span>${esc(f.label)}</span><output>${esc(v)}</output></label><input type="range" id="${id}" data-f="${f.key}" data-out min="${f.min}" max="${f.max}" step="${f.step || 1}" value="${esc(v)}">${hint}</div>`;
    }
    if (f.type === 'color') {
      return `<div class="fld"><label for="${id}">${esc(f.label)}</label><input type="color" id="${id}" data-f="${f.key}" value="${esc(v)}"></div>`;
    }
    if (f.type === 'image') {
      const src = H.ctx.imgs[v];
      return `<div class="fld"><label>${esc(f.label)}</label><div class="imgf">${src ? `<img class="thumb" src="${src}" alt="">` : '<div class="thumb"></div>'}<button class="btn sm" type="button" data-act="img-pick" data-key="${f.key}">${src ? 'Trocar' : 'Escolher imagem'}</button>${src ? `<button class="btn sm" type="button" data-act="img-clear" data-key="${f.key}">Remover</button>` : ''}</div>${hint}</div>`;
    }
    return `<div class="fld"><label for="${id}">${esc(f.label)}</label><input type="text" id="${id}" data-f="${f.key}" value="${esc(v)}">${hint}</div>`;
  }

  function panelContent(t, d) {
    return `<div class="fld"><label for="docTitle">Nome do arquivo</label><input type="text" id="docTitle" data-doc="title" value="${esc(d.title)}" placeholder="${esc(t.name)}"></div>` +
      t.fields.map((f) => fieldHtml(f, d.values[f.key])).join('') +
      `<p class="hint">Marcas no texto: ~~assim~~ tarja o trecho (some no estado Jogador) · {{assim}} vira nota à mão · [[assim]] vai para a camada oculta (tinta UV).</p>` +
      `<div class="xrow d-only-flex"><button class="btn sm" type="button" data-act="proj-save">Salvar projeto</button><button class="btn sm" type="button" data-act="proj-open">Abrir projeto</button><button class="btn sm" type="button" data-act="reset-doc">Restaurar modelo</button></div>`;
  }

  function swatches(list, cur, act) {
    return list.map((c) => `<button class="dot" type="button" style="background:${c}" data-act="${act}" data-v="${c}" aria-label="${c}" aria-pressed="${pressed(cur === c)}"></button>`).join('');
  }

  function panelStyle(t, d) {
    const st = d.style;
    let h = '';
    for (const slot of ['body', 'hand', 'title']) {
      if (!t.fonts[slot]) continue;
      const cur = st[slot] || t.fonts[slot];
      h += `<div class="fld"><label for="s-${slot}">${SLOT_LABEL[slot]}</label><select id="s-${slot}" data-s="${slot}">${FONTS[slot].map((n) => `<option value="${n}" style="font-family:'${n}'"${n === cur ? ' selected' : ''}>${n}${n === t.fonts[slot] ? ' (padrão)' : ''}</option>`).join('')}</select></div>`;
    }
    h += `<div class="fld"><span class="lbl">Cor da tinta</span><div class="dots">${swatches([t.ink, ...INKS], st.ink || t.ink, 'ink')}<input type="color" aria-label="Outra cor de tinta" data-s="ink" value="${st.ink || t.ink}"></div></div>`;
    h += `<div class="fld"><span class="lbl">Cor do papel</span><div class="dots">${swatches([t.paper, ...PAPERS], st.paper || t.paper, 'paper')}<input type="color" aria-label="Outra cor de papel" data-s="paper" value="${st.paper || t.paper}"></div></div>`;
    h += `<div class="fld"><label for="s-wear" class="val"><span>Desgaste do papel</span><output>${st.wear}</output></label><input type="range" id="s-wear" data-s="wear" data-out min="0" max="100" value="${st.wear}"></div>`;
    h += `<div class="fld"><label for="s-tilt" class="val"><span>Inclinação</span><output>${st.tilt}°</output></label><input type="range" id="s-tilt" data-s="tilt" data-out data-unit="°" min="-6" max="6" step="0.5" value="${st.tilt}"></div>`;
    h += `<div class="fld"><label for="s-assim" class="val"><span>Assimilação</span><output>${st.assim}</output></label><input type="range" id="s-assim" data-s="assim" data-out min="0" max="100" value="${st.assim}"><p class="hint">Troca letras e palavras por ruído e por um intruso. O texto original continua salvo.</p>` +
      `<div class="xrow"><input type="text" data-s="intruder" aria-label="Palavra intrusa" value="${esc(st.intruder)}" style="flex:1 1 120px;width:auto"><button class="btn sm" type="button" data-act="shuffle">Embaralhar</button></div></div>`;
    return h;
  }

  function panelMedia(t, d) {
    let h = `<button class="drop" type="button" data-act="att-add"><b>Adicionar imagem</b><span class="lbl">ou arraste, cole (Ctrl+V) ou tire uma foto</span></button>`;
    if (d.atts.length) {
      h += '<div class="list">' + d.atts.map((a, i) => `<div class="li${a.id === selAtt ? ' cur' : ''}"><button class="pick" type="button" data-act="att-sel" data-id="${a.id}"><img class="thumb" style="width:36px;height:44px;flex-basis:36px" src="${H.ctx.imgs[a.img] || ''}" alt=""><span>Imagem ${i + 1}</span></button></div>`).join('') + '</div>';
    } else {
      h += '<p class="hint">Cada imagem vira um item solto no documento: arraste na bancada para mover e use a alça redonda para mudar o tamanho.</p>';
    }
    const a = d.atts.find((x) => x.id === selAtt);
    if (a) {
      h += `<div class="fld"><label for="a-w" class="val"><span>Tamanho</span><output>${Math.round(a.w)}</output></label><input type="range" id="a-w" data-at="w" data-out min="40" max="${Math.round(t.width * 1.3)}" value="${Math.round(a.w)}"></div>`;
      h += `<div class="fld"><label for="a-r" class="val"><span>Rotação</span><output>${a.rot}°</output></label><input type="range" id="a-r" data-at="rot" data-out data-unit="°" min="-45" max="45" step="1" value="${a.rot}"></div>`;
      h += `<div class="fld"><span class="lbl">Filtro</span><div class="chips">${FILTERS.map(([k, n]) => `<button class="chip" type="button" data-act="filter" data-v="${k}" aria-pressed="${pressed(a.filter === k)}">${n}</button>`).join('')}</div></div>`;
      h += `<div class="fld"><span class="lbl">Moldura</span><div class="chips">${FRAMES.map(([k, n]) => `<button class="chip" type="button" data-act="frame" data-v="${k}" aria-pressed="${pressed(a.frame === k)}">${n}</button>`).join('')}</div></div>`;
      h += `<div class="xrow"><button class="btn sm" type="button" data-act="att-front">Trazer para frente</button><button class="btn sm" type="button" data-act="att-back">Enviar para trás</button><button class="btn sm" type="button" data-act="att-del">Remover</button></div>`;
    }
    return h;
  }

  function panelLayers(d) {
    const note = S.mode === 'mestre' ? 'Mestre: texto sob as tarjas e tinta UV visíveis.' : 'Jogador: tarjas fechadas, tinta UV oculta.';
    let h = `<div class="xrow"><div class="seg" role="group" aria-label="Estado de revelação"><button type="button" data-act="mode" data-v="jogador" aria-pressed="${pressed(S.mode === 'jogador')}">Jogador</button><button type="button" data-act="mode" data-v="mestre" aria-pressed="${pressed(S.mode === 'mestre')}">Mestre</button></div></div><p class="hint" style="margin-top:-6px">${note}</p>`;
    h += '<div class="list">' + LAYERS.map(([id, name, desc]) => {
      const L = d.layers[id];
      const on = id === 'uv' ? (S.mode === 'mestre' || L.on) : L.on;
      return `<div class="li${on ? '' : ' off'}"><button class="eye" type="button" data-act="layer" data-v="${id}" aria-pressed="${pressed(on)}" aria-label="${on ? 'Ocultar' : 'Mostrar'} ${name}">${on ? ICON.eyeOn : ICON.eyeOff}</button><div class="tx"><span style="font-weight:600">${name}</span><small>${desc}</small></div><input class="op" type="range" min="10" max="100" value="${L.op}" data-la="${id}" aria-label="Opacidade de ${name}"></div>`;
    }).join('') + '</div>';
    return h;
  }

  function xblockHtml() {
    const png = S.fmt === 'png';
    const canShare = typeof navigator.canShare === 'function';
    const d = doc(), t = tpl();
    const name = fileName(png ? 'png' : 'pdf');
    return `<div class="xrow"><div class="seg" role="group" aria-label="Formato"><button type="button" data-act="fmt" data-v="png" aria-pressed="${pressed(png)}">PNG</button><button type="button" data-act="fmt" data-v="pdf" aria-pressed="${pressed(!png)}">PDF</button></div>` +
      `<div class="seg" role="group" aria-label="Escala">${[1, 2, 3].map((n) => `<button type="button" data-act="scale" data-v="${n}" aria-pressed="${pressed(S.scale === n)}">${n}×</button>`).join('')}</div></div>` +
      (png ? '' : `<div class="seg" role="group" aria-label="Página do PDF"><button type="button" data-act="page" data-v="orig" aria-pressed="${pressed(S.page === 'orig')}">Tamanho original</button><button type="button" data-act="page" data-v="a4" aria-pressed="${pressed(S.page === 'a4')}">A4</button></div>`) +
      `<button class="btn primary" type="button" data-act="go" style="height:44px;font-size:15px"${busy ? ' disabled' : ''}>${busy ? 'Gerando…' : 'Baixar ' + (png ? 'PNG' : 'PDF')}</button>` +
      (canShare ? `<button class="btn" type="button" data-act="share"${busy ? ' disabled' : ''}>Compartilhar</button>` : '') +
      `<div class="hint" style="margin:0">${esc(name)} · o arquivo é uma imagem: texto sob tarja não fica no arquivo.</div>`;
  }

  function renderPanel() {
    const t = tpl(), d = doc();
    renderTabs();
    let h = '';
    if (S.tab === 'content') h = panelContent(t, d);
    else if (S.tab === 'style') h = panelStyle(t, d);
    else if (S.tab === 'media') h = panelMedia(t, d);
    else if (S.tab === 'layers') h = panelLayers(d);
    else h = xblockHtml();
    $('#panel').innerHTML = h;
    $('#xblock').innerHTML = xblockHtml();
    renderBar();
  }

  function renderX() {
    $('#xblock').innerHTML = xblockHtml();
    if (S.tab === 'export') $('#panel').innerHTML = xblockHtml();
    const top = $('#topExport'); if (top) top.disabled = busy;
  }

  function renderAll() { renderTop(); renderModels(); renderPanel(); renderDoc(); }

  /* ====================== exportação ====================== */
  function fileName(ext) {
    const t = tpl(), d = doc();
    const base = Exporter.slug(d.title || t.name) || 'handout';
    return `${base}-${S.mode}${ext === 'png' ? '@' + S.scale + 'x' : ''}.${ext}`;
  }

  async function doExport(shareIt) {
    if (busy) return;
    busy = true; renderX();
    try {
      const t = tpl(), d = doc();
      const families = fontsFor(t, d);
      const sheet = $('#sheet');
      const r = S.fmt === 'png'
        ? await Exporter.png(sheet, { scale: S.scale, families })
        : await Exporter.pdf(sheet, { scale: S.scale, families, page: S.page });
      const name = fileName(r.ext);
      if (shareIt) {
        const ok = await Exporter.share(r.blob, name).catch(() => false);
        if (!ok) Exporter.download(r.blob, name);
      } else Exporter.download(r.blob, name);
      window.__lastExport = { name, bytes: r.blob.size, w: r.w, h: r.h, pages: r.pages || 1 };
      toast('Pronto: ' + name);
    } catch (err) {
      console.error(err);
      window.__lastExport = { error: String(err && err.message || err) };
      toast('Não deu para exportar: ' + (err && err.message ? err.message : err), true);
    } finally { busy = false; renderX(); }
  }

  /* ====================== ações ====================== */
  const getAtt = (id) => doc().atts.find((a) => a.id === id);
  const persist = () => Store.save();

  function setSheet(which) {
    const b = document.body;
    b.classList.remove('sh-models', 'sh-insp');
    if (which === 'models') b.classList.add('sh-models');
    else if (which) b.classList.add('sh-insp');
    syncSheet();
  }

  // No celular a folha de baixo cobre parte do palco: reserva esse espaço e reencaixa o documento acima dela.
  function syncSheet() {
    const b = document.body;
    const el = b.classList.contains('sh-models') ? $('#models') : b.classList.contains('sh-insp') ? $('#insp') : null;
    const mobile = window.matchMedia('(max-width:1023px)').matches;
    b.style.setProperty('--sheet-h', (el && mobile ? el.offsetHeight : 0) + 'px');
    fit();
  }

  async function addFiles(files, asAtt, key) {
    const list = [...files].filter((f) => /^image\//.test(f.type));
    if (!list.length) { toast('Escolha um arquivo de imagem (JPG, PNG, WebP ou GIF).', true); return; }
    const t = tpl(), d = doc();
    try {
      if (!asAtt) {
        const { id } = await Store.addImage(list[0]);
        d.values[key] = id;
      } else {
        for (const f of list) {
          const { id, w, h } = await Store.addImage(f);
          const aw = Math.round(Math.min(260, t.width * 0.4));
          const n = d.atts.length;
          const a = { id: Store.uid(), img: id, x: Math.round((t.width - aw) / 2 + n * 18), y: 120 + n * 24, w: aw, rot: 0, filter: 'original', frame: 'none', z: 10 + n, ratio: h / w };
          d.atts.push(a); selAtt = a.id;
        }
        if (S.tab !== 'media') S.tab = 'media';
      }
      persist(); renderPanel(); renderDoc();
    } catch (err) { toast(err.message || String(err), true); }
  }

  const MK = { '~~': ['~~', '~~', 'trecho'], '{{': ['{{', '}}', 'nota'], '[[': ['[[', ']]', 'texto oculto'] };
  function wrapSelection(k) {
    const ta = document.activeElement && document.activeElement.tagName === 'TEXTAREA' ? document.activeElement : $('#panel textarea');
    if (!ta) return;
    const [a, b, ph] = MK[k];
    const s = ta.selectionStart ?? ta.value.length, e = ta.selectionEnd ?? s;
    const sel = ta.value.slice(s, e) || ph;
    ta.value = ta.value.slice(0, s) + a + sel + b + ta.value.slice(e);
    ta.focus(); ta.setSelectionRange(s + a.length, s + a.length + sel.length);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function onClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act, v = el.dataset.v, d = doc(), t = tpl();
    switch (act) {
      case 'tpl': S.tpl = el.dataset.id; selAtt = null; zoom = null; persist(); setSheet(null); renderAll(); break;
      case 'mode': S.mode = v; persist(); renderTop(); renderDoc(); if (S.tab === 'layers') renderPanel(); break;
      case 'theme': S.theme = S.theme === 'dark' ? 'light' : 'dark'; persist(); renderTop(); break;
      case 'tab': S.tab = v; persist(); renderPanel(); break;
      case 'bar': {
        const open = document.body.classList.contains('sh-models') ? 'models' : document.body.classList.contains('sh-insp') ? S.tab : null;
        if (open === v) { setSheet(null); renderBar(); break; }
        if (v === 'models') setSheet('models'); else { S.tab = v; setSheet('insp'); renderPanel(); }
        renderBar(); break;
      }
      case 'fmt': S.fmt = v; persist(); renderPanel(); break;
      case 'scale': S.scale = +v; persist(); renderPanel(); break;
      case 'page': S.page = v; persist(); renderPanel(); break;
      case 'go': if (window.matchMedia('(max-width:1023px)').matches && !el.closest('#panel,#xblock')) { S.tab = 'export'; setSheet('insp'); renderPanel(); } else doExport(false); break;
      case 'share': doExport(true); break;
      case 'mk': wrapSelection(el.dataset.k); break;
      case 'img-pick': pendingKey = el.dataset.key; $('#fileSlot').click(); break;
      case 'img-clear': { const id = d.values[el.dataset.key]; d.values[el.dataset.key] = ''; if (id) Store.delImage(id); persist(); renderPanel(); renderDoc(); break; }
      case 'att-add': $('#fileAtt').click(); break;
      case 'att-sel': selAtt = el.dataset.id; renderPanel(); renderDoc(); break;
      case 'att-del': { const a = getAtt(selAtt); if (a) { Store.delImage(a.img); d.atts = d.atts.filter((x) => x !== a); selAtt = null; persist(); renderPanel(); renderDoc(); } break; }
      case 'att-front': { const a = getAtt(selAtt); if (a) { a.z = Math.max(...d.atts.map((x) => x.z)) + 1; persist(); renderDoc(); } break; }
      case 'att-back': { const a = getAtt(selAtt); if (a) { a.z = Math.min(...d.atts.map((x) => x.z)) - 1; persist(); renderDoc(); } break; }
      case 'filter': { const a = getAtt(selAtt); if (a) { a.filter = v; persist(); renderPanel(); renderDoc(); } break; }
      case 'frame': { const a = getAtt(selAtt); if (a) { a.frame = v; persist(); renderPanel(); renderDoc(); } break; }
      case 'layer': d.layers[v].on = !(v === 'uv' && S.mode === 'mestre' ? true : d.layers[v].on); persist(); renderPanel(); renderDoc(); break;
      case 'ink': d.style.ink = v === t.ink ? null : v; persist(); renderPanel(); renderDoc(); break;
      case 'paper': d.style.paper = v === t.paper ? null : v; persist(); renderPanel(); renderDoc(); break;
      case 'shuffle': d.style.seed = Math.floor(Math.random() * 1e9); persist(); renderDoc(); break;
      case 'reset-doc': if (confirm('Voltar este modelo ao texto e ao estilo originais? Os anexos deste modelo também saem.')) { Store.resetDoc(); selAtt = null; renderAll(); } break;
      case 'proj-save': {
        try {
          const blob = new Blob([Store.exportProject()], { type: 'application/json' });
          Exporter.download(blob, 'arquivo-do-caso-projeto.json'); toast('Projeto salvo: arquivo-do-caso-projeto.json');
        } catch (err) { toast('Não consegui salvar o projeto: ' + err.message, true); }
        break;
      }
      case 'proj-open': $('#fileProj').click(); break;
      case 'zoom-in': zoom = Math.min(3, (zoom || scale) * 1.15); fit(); break;
      case 'zoom-out': zoom = Math.max(0.15, (zoom || scale) / 1.15); fit(); break;
      case 'zoom-fit': zoom = null; fit(); break;
      default: break;
    }
  }

  function onInput(e) {
    const el = e.target, d = doc();
    if (el.dataset.f !== undefined) {
      const f = tpl().fields.find((x) => x.key === el.dataset.f);
      d.values[el.dataset.f] = f && f.type === 'range' ? +el.value : el.value;
      if (el.dataset.out !== undefined) { const o = el.closest('.fld').querySelector('output'); if (o) o.textContent = el.value; }
      persist(); renderDoc();
    } else if (el.dataset.doc !== undefined) {
      d.title = el.value; persist();
    } else if (el.dataset.s !== undefined) {
      const k = el.dataset.s;
      let val = el.value;
      if (['wear', 'assim'].includes(k)) val = +val;
      if (k === 'tilt') val = +val;
      if (k === 'ink' || k === 'paper') { /* cor livre */ }
      d.style[k] = val;
      if (el.dataset.out !== undefined) { const o = el.closest('.fld').querySelector('output'); if (o) o.textContent = val + (el.dataset.unit || ''); }
      persist(); renderDoc();
      if (k === 'ink' || k === 'paper') { /* mantém o seletor aberto: não re-renderiza o painel */ }
    } else if (el.dataset.la !== undefined) {
      d.layers[el.dataset.la].op = +el.value; persist(); renderDoc();
    } else if (el.dataset.at !== undefined) {
      const a = getAtt(selAtt); if (!a) return;
      a[el.dataset.at] = +el.value;
      if (el.dataset.out !== undefined) { const o = el.closest('.fld').querySelector('output'); if (o) o.textContent = el.value + (el.dataset.unit || ''); }
      persist(); renderDoc();
    }
  }

  // Selects mudam com "change" (alguns navegadores móveis não disparam "input" a tempo).
  function onChange(e) {
    const el = e.target;
    if (el.tagName === 'SELECT' && (el.dataset.f !== undefined || el.dataset.s !== undefined)) onInput(e);
  }

  /* ----- arrastar e redimensionar anexos (mouse e toque) ----- */
  let drag = null;
  function onPointerDown(e) {
    const handle = e.target.closest('[data-handle]');
    const el = e.target.closest('.att');
    if (!el) {
      if (selAtt && !e.target.closest('#insp,.zoom')) { selAtt = null; document.querySelectorAll('.att.sel').forEach((n) => { n.classList.remove('sel'); n.querySelectorAll('[data-ui]').forEach((u) => u.remove()); }); if (S.tab === 'media') renderPanel(); }
      return;
    }
    const a = getAtt(el.dataset.att); if (!a) return;
    if (selAtt !== a.id) {
      document.querySelectorAll('.att.sel').forEach((n) => { n.classList.remove('sel'); n.querySelectorAll('[data-ui]').forEach((u) => u.remove()); });
      selAtt = a.id; el.classList.add('sel');
      if (!el.querySelector('[data-handle]')) el.insertAdjacentHTML('beforeend', '<i class="att-h" data-ui data-handle></i>');
      if (S.tab === 'media') renderPanel();
    }
    drag = { type: handle ? 'resize' : 'move', a, el, sx: e.clientX, sy: e.clientY, ox: a.x, oy: a.y, ow: a.w };
    (handle || el).setPointerCapture && (handle || el).setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function onPointerMove(e) {
    if (!drag) return;
    const dx = (e.clientX - drag.sx) / scale, dy = (e.clientY - drag.sy) / scale;
    if (drag.type === 'move') { drag.a.x = Math.round(drag.ox + dx); drag.a.y = Math.round(drag.oy + dy); drag.el.style.left = drag.a.x + 'px'; drag.el.style.top = drag.a.y + 'px'; }
    else { drag.a.w = Math.max(40, Math.round(drag.ow + dx)); drag.el.style.width = drag.a.w + 'px'; }
  }
  function onPointerUp() { if (drag) { drag = null; persist(); if (S.tab === 'media') renderPanel(); } }

  /* ====================== inicialização ====================== */
  async function init() {
    Store.load();
    await Store.initImages();
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onChange);
    $('#stage').addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    $('#fileSlot').addEventListener('change', (e) => { if (e.target.files.length && pendingKey) addFiles(e.target.files, false, pendingKey); e.target.value = ''; });
    $('#fileAtt').addEventListener('change', (e) => { if (e.target.files.length) addFiles(e.target.files, true); e.target.value = ''; });
    $('#fileProj').addEventListener('change', async (e) => {
      const f = e.target.files[0]; e.target.value = ''; if (!f) return;
      try { Store.importProject(await f.text()); selAtt = null; renderAll(); toast('Projeto aberto.'); } catch (err) { toast(err.message || 'Não consegui abrir esse arquivo.', true); }
    });
    document.addEventListener('paste', (e) => {
      const files = [...(e.clipboardData ? e.clipboardData.files : [])];
      if (files.some((f) => /^image\//.test(f.type))) { e.preventDefault(); addFiles(files, true); }
    });
    const stage = $('#stage');
    stage.addEventListener('dragover', (e) => { e.preventDefault(); });
    stage.addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files.length) addFiles(e.dataTransfer.files, true); });
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selAtt && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        const a = getAtt(selAtt); if (a) { Store.delImage(a.img); doc().atts = doc().atts.filter((x) => x !== a); selAtt = null; persist(); renderPanel(); renderDoc(); }
      }
      if (e.key === 'Escape') setSheet(null), renderBar();
    });
    if (window.ResizeObserver) {
      new ResizeObserver(() => fit()).observe($('#vp'));
      const ro = new ResizeObserver(() => syncSheet());
      ro.observe($('#insp')); ro.observe($('#models'));
    }
    window.addEventListener('resize', syncSheet);
    renderAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    // ganchos para teste automatizado
    window.App = { select: (id) => { S.tpl = id; selAtt = null; zoom = null; renderAll(); }, S, renderAll, doExport };
  }

  init();
})();

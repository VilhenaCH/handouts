// Desaparecido / Procurado — fotocópia xerox: preto e branco, ruído, foto em alto contraste, abas destacáveis.
(function () {
  window.TEMPLATES.push({
    id: 'ficha-procurado', name: 'Desaparecido', category: 'Polícia',
    width: 640, height: 900, bleed: 0, paper: '#ffffff', ink: '#111111', wear: 52,
    fonts: { body: 'Courier Prime', title: 'Anton' },
    usesFonts: [],
    fields: [
      { key: 'stampWord', label: 'Palavra principal', type: 'text', default: 'DESAPARECIDO' },
      { key: 'name', label: 'Nome', type: 'text', default: 'Roberto Almeida Dias' },
      { key: 'alias', label: 'Conhecido como', type: 'text', default: '“Beto da Acácias”' },
      { key: 'age', label: 'Idade', type: 'text', default: '52 anos' },
      { key: 'height', label: 'Altura', type: 'text', default: '1,78 m' },
      { key: 'lastSeen', label: 'Visto pela última vez', type: 'textarea', rows: 3, default: 'Rua das Acácias, 220, em 03/09, por volta das 23h40. Uma vizinha o viu na janela e na calçada ao mesmo tempo.' },
      { key: 'features', label: 'Sinais particulares', type: 'textarea', rows: 3, default: 'Cicatriz na sobrancelha esquerda. Camisa xadrez azul. Responde quando chamado pelo nome, mesmo estando ausente.' },
      { key: 'contact', label: 'Telefone', type: 'text', default: '(11) 4002-0417' },
      { key: 'tabs', label: 'Abas restantes', type: 'range', min: 0, max: 8, step: 1, default: 5 },
      { key: 'photo', label: 'Foto', type: 'image' },
    ],
    css: `
.fp{--ink:var(--u-ink,#111);--paper:var(--u-paper,#fff);background:var(--paper);color:var(--ink);font-family:var(--f-body);padding:26px 34px 0;display:flex;flex-direction:column;gap:14px;overflow:hidden}
.fp-word{font-family:var(--f-title);font-size:112px;line-height:1;text-align:center;letter-spacing:.01em;margin:0 -10px;text-shadow:2px 0 0 var(--ink)}
.fp-mid{display:flex;gap:22px;align-items:flex-start}
.fp-photo{flex:0 0 270px;width:270px;height:330px;border:6px solid var(--ink);object-fit:cover;display:block;filter:grayscale(1) contrast(2.4) brightness(1.1)}
.fp-photo.ph{filter:none;background:repeating-linear-gradient(135deg,#999 0 2px,#fff 2px 9px);color:#222}
.fp-tab{width:100%;border-collapse:collapse;font-size:15px;line-height:20px}
.fp-tab th{font-family:var(--f-body);font-weight:700;text-align:left;padding:7px 8px 7px 0;width:104px;vertical-align:top;border-top:2px solid var(--ink)}
.fp-tab td{padding:7px 0;vertical-align:top;border-top:2px solid var(--ink)}
.fp-q{font-family:var(--f-title);font-size:44px;line-height:46px;text-align:center;border-top:6px solid var(--ink);border-bottom:6px solid var(--ink);padding:8px 0 4px}
.fp-tel{font-family:var(--f-title);font-size:54px;line-height:56px;text-align:center;letter-spacing:.02em}
.fp-tabs{display:flex;margin:0 -34px;border-top:2px dashed var(--ink);height:176px;margin-top:auto}
.fp-tabs div{flex:1 1 0;border-left:1.5px dashed var(--ink);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;writing-mode:vertical-rl;transform:rotate(180deg);padding:6px 0;letter-spacing:.04em}
.fp-tabs div:first-child{border-left:0}
.fp-tabs div.torn{border-left-style:none;background:transparent;color:transparent}
.fp-toner{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.6),transparent 5%),linear-gradient(0deg,rgba(0,0,0,.35),transparent 4%),linear-gradient(180deg,rgba(0,0,0,.18),transparent 2.5%)}
`,
    render(v, h) {
      const n = Math.max(0, Math.min(8, +v.tabs || 0));
      const rng = H.rng(H.ctx.seed ^ 77);
      const torn = new Set();
      while (torn.size < 8 - n) torn.add(Math.floor(rng() * 8));
      const tabs = Array.from({ length: 8 }, (_, i) => `<div class="${torn.has(i) ? 'torn' : ''}">${torn.has(i) ? '' : h.t(v.contact)}</div>`).join('');
      const photo = H.ctx.imgs[v.photo] ? `<img class="fp-photo" src="${H.ctx.imgs[v.photo]}" alt="">` : `<div class="fp-photo ph"><span>foto aqui</span></div>`;
      return `<div class="tpl fp">
  ${h.fx()}<div class="fp-toner" data-layer="paper"></div>
  <div data-layer="content" style="display:contents">
  <div class="fp-word" style="font-size:${Math.max(44, Math.min(112, Math.floor(580 / (Math.max(String(v.stampWord || '').length, 4) * 0.52))))}px">${h.t(v.stampWord)}</div>
  <div class="fp-mid">${photo}
    <table class="fp-tab"><tr><th>Nome</th><td>${h.rt(v.name)}</td></tr><tr><th>Vulgo</th><td>${h.t(v.alias)}</td></tr><tr><th>Idade</th><td>${h.t(v.age)}</td></tr><tr><th>Altura</th><td>${h.t(v.height)}</td></tr><tr><th>Sinais</th><td>${h.rt(v.features)}</td></tr></table></div>
  <div style="font-size:15px;line-height:21px"><b>Visto pela última vez:</b> ${h.rt(v.lastSeen)}</div>
  <div class="fp-q">VIU ESTA PESSOA?</div>
  <div class="fp-tel">${h.t(v.contact)}</div>
  <div class="fp-tabs">${tabs}</div>
  </div>
</div>`;
    },
  });
})();

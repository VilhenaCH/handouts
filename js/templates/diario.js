// Diário — caderno de capa dura com grade pontilhada. O campo "Degradação" faz o texto se deteriorar do começo ao fim da página.
(function () {
  window.TEMPLATES.push({
    id: 'diario', name: 'Diário', category: 'Pessoal',
    width: 700, height: 960, bleed: 0, paper: '#efe9da', ink: '#232733', wear: 48,
    fonts: { body: 'Kalam', title: 'Cormorant Garamond', hand: 'Reenie Beanie' },
    usesFonts: [],
    fields: [
      { key: 'date', label: 'Data da entrada', type: 'text', default: '14 de setembro' },
      { key: 'mood', label: 'Cabeçalho curto', type: 'text', default: 'Dia 9 na casa nova' },
      {
        key: 'body', label: 'Texto (parágrafos separados por linha em branco)', type: 'textarea', rows: 12,
        default: 'Hoje acordei cedo e o café já estava pronto. Eu moro sozinho. Achei engraçado, até reparar que a xícara era a mesma que quebrei na semana passada.\n\nÀ tarde fui ao mercado. O caixa me chamou pelo nome sem que eu me apresentasse. Disse que eu tinha passado ali de manhã, que comprei sal e fiquei olhando para a porta por vinte minutos.\n\nÀ noite escutei a minha própria voz no quarto de baixo, lendo este diário em voz alta, uma página na frente de mim. Eu ainda não escrevi a próxima.\n\nFiquei sentado na escada até amanhecer. Quando os passos pararam, a voz também parou, mas a porta do quarto de baixo continuou aberta. Dentro, a cama estava arrumada do meu jeito, com a marca do meu corpo.\n\n[[eles aprendem a escrever mais rápido que eu]]',
      },
      { key: 'degr', label: 'Degradação ao longo da página', type: 'range', min: 0, max: 100, step: 5, default: 55, hint: 'Aumenta a assimilação a cada parágrafo; o primeiro fica quase limpo e o último, bem pior.' },
      { key: 'page', label: 'Número da página', type: 'text', default: '47' },
      { key: 'scribble', label: 'Anotação na margem', type: 'text', default: 'não fui eu' },
    ],
    css: `
.dr{--ink:var(--u-ink,#232733);--paper:var(--u-paper,#efe9da);background-color:var(--paper);color:var(--ink);font-family:var(--f-body);padding:56px 58px 44px 88px;display:flex;flex-direction:column;gap:6px;overflow:hidden;
  background-image:radial-gradient(circle,color-mix(in srgb,var(--ink),transparent 68%) 1.1px,transparent 1.6px);background-size:24px 24px;background-position:88px 38px}
.dr-bind{position:absolute;left:0;top:0;bottom:0;width:62px;background:linear-gradient(90deg,rgba(40,28,16,.5),rgba(40,28,16,.14) 40%,transparent);pointer-events:none}
.dr-stitch{position:absolute;left:52px;top:0;bottom:0;border-left:2px dashed rgba(60,40,20,.45)}
.dr-top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1.5px solid var(--ink);padding-bottom:6px;margin-bottom:12px}
.dr-date{font-family:var(--f-title);font-size:30px;font-style:italic;line-height:34px}
.dr-mood{font-family:var(--f-hand);font-size:30px;line-height:30px}
.dr-body p{margin:0 0 26px;line-height:30px;transform-origin:left center;white-space:pre-wrap}
.dr-pg{margin-top:auto;text-align:center;font-family:var(--f-title);font-size:17px}
.dr-rib{position:absolute;right:14px;top:-4px;width:24px;height:150px;background:#8a1d1d;clip-path:polygon(0 0,100% 0,100% 100%,50% 86%,0 100%);box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
.dr-scr{position:absolute;right:44px;top:800px;transform:rotate(-6deg);font-family:var(--f-hand);font-size:38px;line-height:38px;color:#b3261e;white-space:nowrap}
`,
    render(v, h) {
      const base = H.ctx.assim, deg = Math.max(0, Math.min(100, +v.degr || 0));
      const paras = String(v.body || '').split(/\n\s*\n/).filter((s) => s.trim());
      let html = '';
      try {
        html = paras.map((p, i) => {
          const f = paras.length > 1 ? i / (paras.length - 1) : 1;
          H.ctx.assim = Math.min(100, base + deg * f);
          const rot = ((H.rng(H.hash(p) ^ H.ctx.seed)() - 0.5) * (deg / 100) * 3.4).toFixed(2);
          const size = (25 * (1 + f * (deg / 100) * 0.22)).toFixed(1);
          const spacing = (f * (deg / 100) * 0.9).toFixed(2);
          return `<p style="transform:rotate(${rot}deg);font-size:${size}px;letter-spacing:${spacing}px">${h.rt(p.replace(/\n/g, ' '))}</p>`;
        }).join('');
      } finally { H.ctx.assim = base; }
      return `<div class="tpl dr">
  ${h.fx()}<div class="dr-bind" data-layer="paper"></div><div class="dr-stitch" data-layer="paper"></div><div class="dr-rib" data-layer="paper"></div>
  <div data-layer="content" style="display:contents">
  <div class="dr-top"><div class="dr-date">${h.t(v.date)}</div><div class="dr-mood">${h.t(v.mood)}</div></div>
  <div class="dr-body">${html}</div>
  <div class="dr-pg">${h.t(v.page)}</div>
  </div>
  ${v.scribble ? `<div class="dr-scr" data-layer="notes">${h.t(v.scribble)}</div>` : ''}
</div>`;
    },
  });
})();

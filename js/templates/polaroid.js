// Polaroid — moldura de filme instantâneo, imprint laranja da data, legenda à mão e régua forense em L.
(function () {
  const ruler = () => {
    const ticks = Array.from({ length: 21 }, (_, i) => `<line x1="${6 + i * 9}" y1="30" x2="${6 + i * 9}" y2="${i % 5 === 0 ? 14 : 22}"/>`).join('') +
      Array.from({ length: 16 }, (_, i) => `<line x1="30" y1="${6 + i * 9 + 24}" x2="${i % 5 === 0 ? 14 : 22}" y2="${6 + i * 9 + 24}"/>`).join('');
    return `<svg class="pl-ruler" viewBox="0 0 200 180" aria-hidden="true"><path d="M2 2H200V32H32V180H2Z" fill="#f0ece0" stroke="#111" stroke-width="2"/><g stroke="#111" stroke-width="1.5">${ticks}</g><text x="110" y="24" font-family="Share Tech Mono, monospace" font-size="10" fill="#111">cm</text></svg>`;
  };

  window.TEMPLATES.push({
    id: 'polaroid', name: 'Polaroid', category: 'Pessoal',
    width: 480, height: 620, bleed: 30, paper: '#f4f1ea', ink: '#23211f', wear: 24,
    fonts: { body: 'Share Tech Mono', title: 'Caveat', hand: 'Reenie Beanie' },
    usesFonts: ['Share Tech Mono', 'VT323'],
    fields: [
      { key: 'photo', label: 'Foto', type: 'image' },
      { key: 'caption', label: 'Legenda à mão', type: 'text', default: 'sala de estar · antes' },
      { key: 'stamp', label: 'Data impressa', type: 'text', default: "'26  9  3" },
      { key: 'scale', label: 'Régua forense', type: 'select', options: ['Sem régua', 'Com régua'], default: 'Sem régua' },
      { key: 'fade', label: 'Desbotado', type: 'range', min: 0, max: 100, step: 5, default: 25 },
      { key: 'note', label: 'Anotação no verso (aparece pelo avesso)', type: 'text', default: 'quem é o terceiro?' },
    ],
    css: `
.pl{--ink:var(--u-ink,#23211f);--paper:var(--u-paper,#f4f1ea);background:var(--paper);color:var(--ink);padding:26px 26px 0;display:flex;flex-direction:column;box-shadow:0 14px 28px rgba(30,20,10,.38),0 2px 4px rgba(30,20,10,.3);overflow:hidden}
.pl-win{position:relative;width:428px;height:428px;background:#1c1b1a;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(0,0,0,.4)}
.pl-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.pl-ph{background:linear-gradient(160deg,#4a463f,#1d1c1a)}
.pl-leak{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 100% 0%,rgba(255,120,40,.34),transparent 45%),radial-gradient(ellipse at 0% 100%,rgba(255,200,90,.16),transparent 40%);mix-blend-mode:screen}
.pl-date{position:absolute;right:16px;bottom:14px;font-family:'VT323',monospace;font-size:30px;line-height:30px;color:#ff8a1f;text-shadow:0 0 6px rgba(255,120,20,.9),0 0 1px #ff8a1f;letter-spacing:.06em;white-space:pre}
.pl-ruler{position:absolute;left:10px;top:10px;width:150px;height:auto;opacity:.92}
.pl-cap{font-family:var(--f-title);font-size:36px;line-height:40px;text-align:center;margin:auto 0;padding:10px 6px 0;transform:rotate(-1.5deg)}
.pl-bot{flex:1 1 auto;display:flex;align-items:center;justify-content:center;min-height:138px;position:relative}
.pl-sheen{position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.2) 48%,transparent 56%)}
`,
    render(v, h) {
      const fade = Math.max(0, Math.min(100, +v.fade || 0)) / 100;
      const filt = `saturate(${(1 - fade * 0.55).toFixed(2)}) sepia(${(fade * 0.5).toFixed(2)}) contrast(${(1 - fade * 0.2).toFixed(2)}) brightness(${(1 + fade * 0.1).toFixed(2)})`;
      const src = H.ctx.imgs[v.photo];
      const img = src ? `<img class="pl-img" style="filter:${filt}" src="${src}" alt="">` : H.scene('pl-img', `filter:${filt}`);
      return `<div class="tpl pl">
  ${h.fx()}
  <div class="pl-win">${img}<div class="pl-leak" data-layer="paper"></div>
    ${v.scale === 'Com régua' ? `<div data-layer="media" style="display:contents">${ruler()}</div>` : ''}
    <div class="pl-date" data-layer="stamps">${H.esc(v.stamp)}</div></div>
  <div class="pl-bot"><div data-layer="content" style="display:contents"><div class="pl-cap">${h.t(v.caption)}</div></div>${v.note ? `<span class="nota" data-layer="notes" style="position:absolute;right:6px;bottom:8px;font-size:20px;transform:rotate(-4deg)">${h.t(v.note)}</span>` : ''}</div>
  <div class="pl-sheen" data-layer="paper"></div>
</div>`;
    },
  });
})();

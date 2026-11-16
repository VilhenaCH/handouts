// Frame de CFTV — imagem esverdeada de baixa qualidade, scanlines, vinheta, REC, timestamp em VT323 e faixa de tracking.
(function () {
  window.TEMPLATES.push({
    id: 'frame-cftv', name: 'Frame de câmera (CFTV)', category: 'Digital',
    width: 760, height: 520, bleed: 0, paper: '#0b0f0c', ink: '#d8ffe4', wear: 20,
    fonts: { body: 'VT323', title: 'VT323', hand: 'Caveat' },
    usesFonts: [],
    fields: [
      { key: 'photo', label: 'Imagem da câmera', type: 'image' },
      { key: 'cam', label: 'Câmera', type: 'text', default: 'CAM 03 · ENTRADA SUL' },
      { key: 'date', label: 'Data', type: 'text', default: '2026-09-03' },
      { key: 'time', label: 'Hora', type: 'text', default: '23:40:17' },
      { key: 'rec', label: 'Gravação', type: 'select', options: ['REC', 'PAUSA', 'SEM SINAL'], default: 'REC' },
      { key: 'glitch', label: 'Faixa de tracking', type: 'range', min: 0, max: 100, step: 5, default: 55 },
      { key: 'tint', label: 'Cor da imagem', type: 'select', options: ['Verde', 'Cinza', 'Azulada'], default: 'Verde' },
      { key: 'note', label: 'Nota do analista', type: 'text', default: 'repare no canto direito, 23:40:17' },
    ],
    css: `
.cf{--ink:var(--u-ink,#d8ffe4);--paper:var(--u-paper,#0b0f0c);background:var(--paper);color:var(--ink);font-family:var(--f-body);position:relative;overflow:hidden}
.cf-img{position:absolute;left:0;top:0;width:760px;height:520px;object-fit:cover;display:block}
.cf-ph{background:radial-gradient(ellipse at 60% 55%,#4b5c50 0,#222b25 55%,#0f1411 100%)}
.cf-band{position:absolute;left:0;width:100%;overflow:hidden}
.cf-band .cf-img{left:0}
.cf-scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(0,0,0,.32) 0 1px,transparent 1px 3px);mix-blend-mode:multiply}
.cf-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.65))}
.cf-noise{position:absolute;inset:0;pointer-events:none;opacity:.2;mix-blend-mode:screen}
.cf-ov{position:absolute;text-shadow:0 0 2px rgba(0,0,0,.9),1px 1px 0 #000;font-size:30px;line-height:30px;letter-spacing:.05em;white-space:pre}
.cf-rec{display:flex;align-items:center;gap:10px}
.cf-rec i{width:16px;height:16px;border-radius:50%;background:#ff2a2a;box-shadow:0 0 8px #ff2a2a}
.cf-frm{position:absolute;inset:14px;border:2px solid rgba(216,255,228,.22);pointer-events:none}
.cf-n{position:absolute;right:30px;bottom:66px;color:#ffe45e;font-family:var(--f-hand);font-size:30px;transform:rotate(-4deg);max-width:260px;text-align:right;line-height:30px}
`,
    render(v, h) {
      const tintF = { Verde: 'grayscale(.75) sepia(.35) hue-rotate(62deg) saturate(1.5) contrast(1.15) brightness(.82)', Cinza: 'grayscale(1) contrast(1.2) brightness(.85)', Azulada: 'grayscale(.8) sepia(.3) hue-rotate(160deg) saturate(1.4) contrast(1.1) brightness(.85)' }[v.tint] || '';
      const src = H.ctx.imgs[v.photo];
      const mk = (extra) => (src ? `<img class="cf-img" style="filter:${tintF};${extra || ''}" src="${src}" alt="">` : H.scene('cf-img', `filter:${tintF};${extra || ''}`));
      const g = Math.max(0, Math.min(100, +v.glitch || 0));
      const r = H.rng(H.ctx.seed ^ 909);
      const bh = Math.round(14 + (g / 100) * 54), bt = Math.round(90 + r() * 260), shift = Math.round(8 + (g / 100) * 26);
      const band = g > 0 ? `<div class="cf-band" style="top:${bt}px;height:${bh}px">${mk(`top:${-bt}px;transform:translateX(${shift}px);filter:${tintF} brightness(1.3)`)}</div>` : '';
      const noise = `<svg class="cf-noise" width="100%" height="100%"><filter id="cfn"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="${(H.ctx.seed % 90) + 1}"/><feColorMatrix values="0 0 0 0 .8  0 0 0 0 1  0 0 0 0 .85  0 0 0 .7 0"/></filter><rect width="100%" height="100%" filter="url(#cfn)"/></svg>`;
      const dead = v.rec === 'SEM SINAL';
      return `<div class="tpl cf">
  <div data-layer="media" style="display:contents">${dead ? '<div class="cf-img" style="background:#101312"></div>' : mk()}${dead ? '' : band}</div>
  <div data-layer="paper" style="display:contents">${noise}<div class="cf-scan"></div><div class="cf-vig"></div><div class="cf-frm"></div></div>
  <div data-layer="content" style="display:contents">
    <div class="cf-ov" style="left:34px;top:30px">${h.t(v.cam)}</div>
    <div class="cf-ov cf-rec" style="right:34px;top:30px">${v.rec === 'REC' ? '<i></i>' : ''}${h.t(v.rec)}</div>
    <div class="cf-ov" style="left:34px;bottom:30px">${H.esc(v.date)}  ${H.esc(v.time)}</div>
    <div class="cf-ov" style="right:34px;bottom:30px;font-size:22px">DVR-04 · 1080i</div>
  </div>
  ${v.note ? `<div class="cf-n" data-layer="notes">${h.t(v.note)}</div>` : ''}
</div>`;
    },
  });
})();

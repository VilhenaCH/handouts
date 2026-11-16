// Ritual / grimório — pergaminho com círculo ritual em SVG: anel de texto, estrela de N pontas, selo central.
(function () {
  const TAU = Math.PI * 2;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  function star(n, R, cx, cy, rot) {
    const k = n < 5 ? 1 : Math.floor((n - 1) / 2);
    const d = gcd(n, k), len = n / d;
    const pt = (i) => [cx + R * Math.cos(rot + (i * TAU) / n), cy + R * Math.sin(rot + (i * TAU) / n)];
    let out = '';
    for (let s = 0; s < d; s++) {
      let i = s;
      for (let j = 0; j < len; j++) {
        const [x, y] = pt(i);
        out += (j ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        i = (i + k) % n;
      }
      out += 'Z';
    }
    return out;
  }

  function ringText(raw, cx, cy, r, size) {
    const src = H.corrupt(String(raw || '').trim() || 'VERITAS');
    const unit = size * 0.74;
    const cap = Math.max(8, Math.floor((TAU * r) / unit));
    const seg = Array.from(src + '  ✦  ');
    const reps = Math.max(1, Math.round(cap / seg.length));
    const all = [];
    for (let k = 0; k < reps; k++) all.push(...seg);
    const N = all.length; // N letras distribuídas igualmente: o anel fecha sem cortar palavra
    return all.map((ch, i) => {
      if (ch === ' ') return '';
      const a = (i / N) * 360;
      return `<text x="${cx}" y="${cy - r}" transform="rotate(${a.toFixed(2)} ${cx} ${cy})" text-anchor="middle">${H.esc(ch)}</text>`;
    }).join('');
  }

  window.TEMPLATES.push({
    id: 'ritual-grimorio', name: 'Ritual (grimório)', category: 'Ordem',
    width: 760, height: 980, bleed: 0, paper: '#d8c59b', ink: '#2a1a10', wear: 70,
    fonts: { body: 'IM Fell English', title: 'Cinzel', hand: 'Cedarville Cursive' },
    usesFonts: [],
    fields: [
      { key: 'title', label: 'Nome do ritual', type: 'text', default: 'Ritual do Eco Vazio' },
      { key: 'sub', label: 'Subtítulo', type: 'text', default: 'para chamar o que já foi chamado' },
      { key: 'inscription', label: 'Inscrição do anel', type: 'text', default: 'NIHIL EST QUOD ERAT · REDEUNT UMBRAE' },
      { key: 'points', label: 'Pontas da estrela', type: 'range', min: 3, max: 12, step: 1, default: 7 },
      { key: 'components', label: 'Componentes (um por linha)', type: 'textarea', rows: 6, default: 'Sete velas de sebo negro\nSal de cozinha, uma mão cheia\nUm espelho sem moldura\nO nome completo de quem foi levado\n[[Uma gota de sangue de quem chamou]]' },
      { key: 'steps', label: 'Procedimento (um passo por linha)', type: 'textarea', rows: 7, default: 'Desenhe o círculo com sal, sem interromper o traço.\nPosicione uma vela em cada ponta da estrela.\nColoque o espelho voltado para o centro.\nDiga o nome três vezes, sem pausa.\n~~Não responda~~ ao que responder.\nApague as velas na ordem inversa.' },
      { key: 'warning', label: 'Aviso', type: 'text', default: 'Quem entra pelo eco não volta com a própria voz.' },
      { key: 'scribble', label: 'Anotação à mão', type: 'text', default: 'funcionou. mas veio outro.' },
    ],
    css: `
.rg{--ink:var(--u-ink,#2a1a10);--paper:var(--u-paper,#d8c59b);--pig:#7a1e14;background:var(--paper);color:var(--ink);font-family:var(--f-body);padding:44px 52px 38px;display:flex;flex-direction:column;gap:14px;overflow:hidden}
.rg-frame{position:absolute;inset:18px;border:3px double var(--ink);pointer-events:none;opacity:.85}
.rg-title{font-family:var(--f-title);font-weight:700;font-size:40px;line-height:44px;text-align:center;letter-spacing:.07em}
.rg-sub{text-align:center;font-style:italic;font-size:18px;margin-top:-8px}
.rg-orn{text-align:center;color:var(--pig);letter-spacing:.6em;font-size:14px;margin:-4px 0}
.rg-circ{align-self:center;width:520px;height:520px;display:block;overflow:visible}
.rg-circ text{font-family:var(--f-title);font-weight:600;font-size:17px;fill:var(--pig)}
.rg-2{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:28px}
.rg-h{font-family:var(--f-title);font-weight:600;font-size:16px;letter-spacing:.14em;color:var(--pig);border-bottom:1px solid var(--pig);margin-bottom:6px;padding-bottom:2px}
.rg-l{margin:0;padding:0;list-style:none;font-size:16px;line-height:23px}
.rg-l li{padding-left:18px;position:relative}
.rg-l li::before{content:"✦";position:absolute;left:0;color:var(--pig);font-size:11px;top:1px}
.rg-o{margin:0;padding:0;list-style:none;font-size:16px;line-height:23px}
.rg-o li{padding-left:30px;position:relative}
.rg-o li i{position:absolute;left:0;top:2px;font-style:normal;font-family:var(--f-title);font-size:13px;color:var(--pig)}
.rg-w{margin-top:auto;text-align:center;font-style:italic;font-size:18px;color:var(--pig);border-top:1px solid var(--pig);padding-top:8px}
.rg-scr{position:absolute;left:62px;bottom:98px;transform:rotate(-6deg);font-family:var(--f-hand);font-size:27px;line-height:30px;color:#26308a;max-width:230px;text-align:center}
`,
    render(v, h) {
      const n = Math.max(3, Math.min(12, +v.points || 7));
      const C = 260;
      const rot = -Math.PI / 2;
      const dots = Array.from({ length: n }, (_, i) => {
        const a = rot + (i * TAU) / n, x = C + 196 * Math.cos(a), y = C + 196 * Math.sin(a);
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="var(--paper)" stroke="var(--pig)" stroke-width="2"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="var(--pig)"/>`;
      }).join('');
      const ticks = Array.from({ length: 72 }, (_, i) => {
        const a = (i / 72) * TAU, r1 = 213, r2 = i % 6 === 0 ? 205 : 209;
        return `<line x1="${(C + r1 * Math.cos(a)).toFixed(1)}" y1="${(C + r1 * Math.sin(a)).toFixed(1)}" x2="${(C + r2 * Math.cos(a)).toFixed(1)}" y2="${(C + r2 * Math.sin(a)).toFixed(1)}"/>`;
      }).join('');
      const svg = `<svg class="rg-circ" viewBox="0 0 520 520" role="img" aria-label="Círculo ritual de ${n} pontas">
<g fill="none" stroke="var(--pig)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<circle cx="${C}" cy="${C}" r="254" stroke-width="3.5"/><circle cx="${C}" cy="${C}" r="222"/><circle cx="${C}" cy="${C}" r="216"/>${ticks}
<path d="${star(n, 196, C, C, rot)}" stroke-width="2.6"/>
<circle cx="${C}" cy="${C}" r="104"/><circle cx="${C}" cy="${C}" r="98" stroke-dasharray="2 6"/>
<path d="${star(Math.max(3, n - 2), 98, C, C, rot + Math.PI / n)}" stroke-width="1.6"/>
<circle cx="${C}" cy="${C}" r="34"/><path d="M${C - 22} ${C}Q${C} ${C - 15} ${C + 22} ${C}Q${C} ${C + 15} ${C - 22} ${C}Z"/>
</g><circle cx="${C}" cy="${C}" r="5" fill="var(--pig)"/>${dots}
<g>${ringText(v.inscription, C, C, 229, 17)}</g></svg>`;
      const comps = H.lines(v.components).map((l) => `<li>${h.rt(l)}</li>`).join('');
      const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
      const steps = H.lines(v.steps).map((l, i) => `<li><i>${ROM[i] || i + 1}.</i>${h.rt(l)}</li>`).join('');
      return `<div class="tpl rg">
  ${h.fx()}<div class="rg-frame" data-layer="paper"></div>
  <div data-layer="content" style="display:contents">
  <div class="rg-title">${h.t(v.title)}</div><div class="rg-sub">${h.t(v.sub)}</div><div class="rg-orn" aria-hidden="true">✦ ✦ ✦</div>
  ${svg}
  <div class="rg-2"><div><div class="rg-h">Componentes</div><ul class="rg-l">${comps}</ul></div><div><div class="rg-h">Procedimento</div><ol class="rg-o">${steps}</ol></div></div>
  <div class="rg-w">${h.rt(v.warning)}</div>
  </div>
  ${v.scribble ? `<div class="rg-scr" data-layer="notes">${h.t(v.scribble)}</div>` : ''}
</div>`;
    },
  });
})();

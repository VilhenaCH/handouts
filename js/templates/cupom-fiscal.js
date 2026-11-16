// Cupom fiscal — papel térmico estreito, bordas serrilhadas, total calculado das linhas, horário suspeito (03:12).
(function () {
  function code128(s) {
    const vals = Array.from(String(s)).map((c) => Math.min(94, Math.max(0, c.charCodeAt(0) - 32)));
    let sum = 104; vals.forEach((v, i) => { sum += v * (i + 1); });
    const ch = (v) => String.fromCharCode(v < 95 ? v + 32 : v + 100);
    return ch(104) + vals.map(ch).join('') + ch(sum % 103) + ch(106);
  }
  const num = (s) => { const n = parseFloat(String(s).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')); return isNaN(n) ? 0 : n; };
  const money = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function zig(teeth, amp) {
    const p = [];
    for (let i = 0; i <= teeth; i++) p.push(`${((i * 100) / teeth).toFixed(2)}% ${i % 2 ? 0 : amp}%`);
    const bottom = [];
    for (let i = teeth; i >= 0; i--) bottom.push(`${((i * 100) / teeth).toFixed(2)}% ${i % 2 ? 100 : 100 - amp}%`);
    return `polygon(${p.concat(bottom).join(',')})`;
  }

  // Pseudo-QR determinístico (só visual): 3 marcadores de canto + módulos pseudo-aleatórios.
  function qr(seedStr) {
    const N = 25, r = H.rng(H.hash(seedStr) ^ 4242), cells = [];
    const inFinder = (x, y) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inFinder(x, y) && r() > 0.52) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    const fnd = (ox, oy) => `<rect x="${ox}" y="${oy}" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1"/><rect x="${ox + 2}" y="${oy + 2}" width="3" height="3"/>`;
    return `<svg class="cp-qr" viewBox="-1 -1 ${N + 2} ${N + 2}" fill="currentColor" aria-hidden="true" shape-rendering="crispEdges">${cells.join('')}${fnd(0.5, 0.5).replace(/x="0.5"/, 'x="0.5"')}${fnd(N - 7.5, 0.5)}${fnd(0.5, N - 7.5)}</svg>`;
  }

  window.TEMPLATES.push({
    id: 'cupom-fiscal', name: 'Cupom fiscal', category: 'Objetos',
    width: 340, height: 760, bleed: 10, paper: '#f4f2ec', ink: '#2a2a2c', wear: 28,
    fonts: { body: 'Share Tech Mono', title: 'Share Tech Mono', hand: 'Reenie Beanie' },
    usesFonts: ['Libre Barcode 128 Text'],
    fields: [
      { key: 'store', label: 'Estabelecimento', type: 'text', default: 'MERCADO DOIS IRMÃOS' },
      { key: 'addr', label: 'Endereço', type: 'textarea', rows: 2, markup: false, default: 'R. das Acácias, 214 · Centro\nCNPJ 00.000.000/0001-00' },
      { key: 'date', label: 'Data', type: 'text', default: '04/09/2026' },
      { key: 'time', label: 'Hora', type: 'text', default: '03:12:44' },
      { key: 'coo', label: 'COO', type: 'text', default: '004170' },
      { key: 'items', label: 'Itens (qtd x nome | valor)', type: 'textarea', rows: 7, markup: false, default: '1x Sal grosso 1kg | 4,90\n7x Vela branca | 16,10\n1x Espelho de mão | 29,90\n1x Fita adesiva | 6,50\n2x Café solúvel | 18,00' },
      { key: 'pay', label: 'Pagamento', type: 'text', default: 'DINHEIRO' },
      { key: 'cpf', label: 'Consumidor', type: 'text', default: 'CPF: ~~123.456.789-00~~' },
      { key: 'foot', label: 'Rodapé', type: 'textarea', rows: 3, default: 'Obrigado pela preferência.\nVolte sempre.\n[[ele já voltou três vezes hoje]]' },
    ],
    css: `
.cp{--ink:var(--u-ink,#2a2a2c);--paper:var(--u-paper,#f4f2ec);display:flex;flex-direction:column;color:var(--ink);font-family:var(--f-body)}
.cp-p{position:relative;flex:1 1 auto;background:var(--paper);padding:34px 22px 32px;display:flex;flex-direction:column;gap:7px;overflow:hidden;filter:drop-shadow(0 4px 6px rgba(30,20,10,.25))}
.cp-st{text-align:center;font-size:17px;line-height:21px;font-weight:700;letter-spacing:.05em}
.cp-ad{text-align:center;font-size:11.5px;line-height:15px;white-space:pre-line}
.cp-hr{border:0;border-top:1.5px dashed var(--ink);margin:3px 0;opacity:.7}
.cp-ln{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;line-height:17px}
.cp-ln span:first-child{flex:1 1 auto;min-width:0}
.cp-tot{display:flex;justify-content:space-between;font-size:17px;font-weight:700;line-height:24px;padding-top:2px}
.cp-ft{text-align:center;font-size:12px;line-height:16px;white-space:pre-line;margin-top:4px}
.cp-bc{font-family:'Libre Barcode 128 Text',monospace;font-size:50px;line-height:52px;text-align:center;margin-top:auto;white-space:nowrap;overflow:hidden}
.cp-qr{width:118px;height:118px;align-self:center;margin-top:10px;display:block}
.cp-sm{font-size:11px;line-height:15px;text-align:center;opacity:.8;word-break:break-all}
.cp-fade{position:absolute;left:0;right:0;top:40%;height:90px;background:linear-gradient(transparent,rgba(255,255,255,.48),transparent);pointer-events:none}
.cp-c{position:absolute;right:18px;top:38px;font-family:var(--f-hand);font-size:36px;color:#b3261e;transform:rotate(-8deg);line-height:34px;text-align:center}
`,
    render(v, h) {
      const items = H.lines(v.items).map((l) => {
        const [name, price] = l.split('|');
        return { name: (name || '').trim(), price: num(price) };
      });
      const total = items.reduce((s, i) => s + i.price, 0);
      const lines = items.map((it, i) => `<div class="cp-ln"><span>${String(i + 1).padStart(2, '0')} ${h.t(it.name)}</span><span>${money(it.price)}</span></div>`).join('');
      const bc = code128(String(v.coo || '0') + String(v.time || '').replace(/\D/g, ''));
      return `<div class="tpl cp">
  <div class="cp-p" style="clip-path:${zig(26, 1.0)}">
    ${h.fx()}<div class="cp-fade" data-layer="paper"></div>
    <div data-layer="content" style="display:contents">
    <div class="cp-st">${h.t(v.store)}</div><div class="cp-ad">${h.t(v.addr)}</div><hr class="cp-hr">
    <div class="cp-ln"><span>CUPOM FISCAL ELETRÔNICO</span></div>
    <div class="cp-ln"><span>${h.t(v.date)}  ${h.t(v.time)}</span><span>COO ${h.t(v.coo)}</span></div><hr class="cp-hr">
    ${lines}<hr class="cp-hr">
    <div class="cp-tot"><span>TOTAL R$</span><span>${money(total)}</span></div>
    <div class="cp-ln"><span>${h.t(v.pay)}</span><span>${money(total)}</span></div><hr class="cp-hr">
    <div class="cp-ln"><span>${h.rt(v.cpf)}</span></div>
    <div class="cp-ln"><span>Tributos aprox. (Lei 12.741)</span><span>${money(total * 0.312)}</span></div>
    <div class="cp-ln"><span>Operador: CX-03 · Terminal 02</span></div><hr class="cp-hr">
    <div class="cp-ft">${h.rt(v.foot)}</div>
    ${qr(String(v.coo) + String(v.time))}
    <div class="cp-sm">${H.esc(String(v.date || '').replace(/\D/g, ''))}${H.esc(String(v.coo || ''))}0417 3520 8812</div>
    <div class="cp-bc" aria-hidden="true">${H.esc(bc)}</div>
    </div>
  </div>
</div>`;
    },
  });
})();

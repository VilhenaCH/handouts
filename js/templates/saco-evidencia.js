// Saco de evidência — plástico transparente com zíper, fita vermelha de lacre, etiqueta com código de barras e cadeia de custódia.
(function () {
  window.TEMPLATES.push({
    id: 'saco-evidencia', name: 'Saco de evidência', category: 'Perícia',
    width: 520, height: 760, bleed: 0, paper: '#cdd5d6', ink: '#17191c', wear: 34,
    fonts: { body: 'Share Tech Mono', title: 'Oswald', hand: 'Permanent Marker' },
    usesFonts: ['Libre Barcode 39 Text'],
    fields: [
      { key: 'photo', label: 'Foto do item', type: 'image' },
      { key: 'tape', label: 'Texto da fita', type: 'text', default: 'EVIDÊNCIA · NÃO ABRIR · EVIDÊNCIA · NÃO ABRIR · ' },
      { key: 'caseNo', label: 'Caso', type: 'text', default: '0417/26' },
      { key: 'itemNo', label: 'Item nº', type: 'text', default: '09' },
      { key: 'desc', label: 'Descrição do item', type: 'textarea', rows: 3, default: 'Espelho de mão, moldura de latão, 1 rachadura diagonal. Encontrado voltado para a parede, ~~sem reflexo~~.' },
      { key: 'who', label: 'Coletado por', type: 'text', default: 'Ag. Letícia Moura' },
      { key: 'where', label: 'Local e data', type: 'text', default: 'Rua das Acácias, 220 — 04/09/2026' },
      { key: 'custody', label: 'Cadeia de custódia (data | quem | ação)', type: 'textarea', rows: 4, markup: false, default: '04/09 | L. Moura | Coleta\n04/09 | Almox. 2 | Lacre\n05/09 | Dr. Menezes | Perícia\n05/09 | ??? | Retirada' },
      { key: 'code', label: 'Código de barras', type: 'text', default: 'OP0417N09' },
      { key: 'scribble', label: 'Escrito à caneta', type: 'text', default: 'NÃO OLHAR' },
    ],
    css: `
.sg{--ink:var(--u-ink,#17191c);--paper:var(--u-paper,#cdd5d6);color:var(--ink);font-family:var(--f-body);position:relative;overflow:hidden;display:flex;flex-direction:column;
  background:linear-gradient(105deg,rgba(255,255,255,.55) 0,transparent 22%,transparent 70%,rgba(255,255,255,.3) 88%,transparent),var(--paper);border:2px solid rgba(60,70,72,.45)}
.sg-zip{height:46px;flex:0 0 46px;border-bottom:2px solid rgba(60,70,72,.55);background:repeating-linear-gradient(90deg,rgba(60,70,72,.55) 0 2px,transparent 2px 6px);background-size:100% 14px;background-repeat:no-repeat;background-position:0 20px}
.sg-tape{position:absolute;left:-10px;right:-10px;top:72px;height:44px;transform:rotate(-1.2deg);background:#c0201f;color:#fff;font-family:var(--f-title);font-weight:700;font-size:21px;line-height:44px;letter-spacing:.2em;white-space:nowrap;overflow:hidden;text-indent:26px;box-shadow:0 2px 3px rgba(0,0,0,.3);border-top:3px solid #fff;border-bottom:3px solid #fff;box-sizing:border-box}
.sg-lab{margin:96px 26px 0;background:#f6f6f1;border:1.5px solid var(--ink);padding:12px 14px 8px;position:relative;z-index:1}
.sg-lab h2{margin:0 0 6px;font-family:var(--f-title);font-weight:600;font-size:22px;letter-spacing:.08em;display:flex;justify-content:space-between;border-bottom:2px solid var(--ink);padding-bottom:3px}
.sg-d{font-size:12.5px;line-height:17px;margin:2px 0}.sg-d b{font-weight:400;opacity:.65;margin-right:6px}
.sg-bc{font-family:'Libre Barcode 39 Text',monospace;font-size:50px;line-height:52px;text-align:center;margin-top:6px}
.sg-img{margin:16px auto 0;width:300px;height:210px;object-fit:cover;display:block;border:1px solid rgba(60,70,72,.5);filter:contrast(1.05) saturate(.9);transform:rotate(-1deg)}
.sg-img.ph{background:repeating-linear-gradient(135deg,rgba(70,80,82,.28) 0 2px,transparent 2px 9px)}
.sg-cu{margin:12px 26px 0;background:#f6f6f1;border:1.5px solid var(--ink);padding:0;border-collapse:collapse;width:468px;font-size:11.5px;position:relative;z-index:1}
.sg-cu th,.sg-cu td{border:1px solid var(--ink);padding:3px 7px;text-align:left}
.sg-cu th{font-family:var(--f-title);font-weight:600;letter-spacing:.08em;font-size:12px}
.sg-wr{position:absolute;left:92px;top:498px;transform:rotate(-7deg);z-index:2;text-shadow:0 0 1px rgba(255,255,255,.6);font-family:var(--f-hand);font-size:44px;line-height:44px;color:#12306e;opacity:.92}
.sg-gl{position:absolute;inset:0;pointer-events:none;background:linear-gradient(95deg,transparent 40%,rgba(255,255,255,.4) 44%,transparent 49%),radial-gradient(ellipse at 20% 90%,rgba(255,255,255,.3),transparent 40%)}
`,
    render(v, h) {
      const src = H.ctx.imgs[v.photo];
      const photo = src ? `<img class="sg-img" src="${src}" alt="">` : `<div class="sg-img ph"></div>`;
      const rows = H.lines(v.custody).map((l) => {
        const c = l.split('|').map((s) => s.trim());
        return `<tr><td>${h.t(c[0] || '')}</td><td>${h.t(c[1] || '')}</td><td>${h.t(c[2] || '')}</td></tr>`;
      }).join('');
      const code = '*' + String(v.code || '').toUpperCase().replace(/[^A-Z0-9\-. $/+%]/g, '') + '*';
      return `<div class="tpl sg">
  <div class="sg-zip" data-layer="paper"></div>
  ${h.fx()}
  <div class="sg-tape" data-layer="stamps">${H.esc(v.tape)}${H.esc(v.tape)}</div>
  <div data-layer="content" style="display:contents">
  <div class="sg-lab"><h2><span>EVIDÊNCIA</span><span>ITEM ${h.t(v.itemNo)}</span></h2>
    <div class="sg-d"><b>CASO</b>${h.t(v.caseNo)}</div><div class="sg-d"><b>ITEM</b>${h.rt(v.desc)}</div><div class="sg-d"><b>COLETA</b>${h.t(v.who)}</div><div class="sg-d"><b>LOCAL</b>${h.t(v.where)}</div>
    <div class="sg-bc" aria-hidden="true">${H.esc(code)}</div></div>
  </div>
  <div data-layer="media" style="display:contents">${photo}</div>
  <div data-layer="content" style="display:contents"><table class="sg-cu"><tr><th>DATA</th><th>QUEM</th><th>AÇÃO</th></tr>${rows}</table></div>
  ${v.scribble ? `<div class="sg-wr" data-layer="notes">${h.t(v.scribble)}</div>` : ''}
  <div class="sg-gl" data-layer="paper"></div>
</div>`;
    },
  });
})();

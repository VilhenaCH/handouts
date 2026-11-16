// Print de conversa — captura de tela de mensageiro em modo escuro. Linhas "eu:" são enviadas; "-- Hoje" cria divisor;
// "(apagada)" e "(digitando)" viram estados especiais; o slider "Glitch" corrompe só a última mensagem recebida.
(function () {
  window.TEMPLATES.push({
    id: 'print-conversa', name: 'Print de conversa', category: 'Digital',
    width: 420, height: 820, bleed: 0, paper: '#0e1317', ink: '#e7eef1', wear: 6,
    fonts: { body: 'Roboto', title: 'Roboto', hand: 'Caveat' },
    usesFonts: [],
    fields: [
      { key: 'contact', label: 'Contato', type: 'text', default: 'Mãe' },
      { key: 'status', label: 'Status', type: 'text', default: 'online' },
      { key: 'clock', label: 'Hora do aparelho', type: 'text', default: '03:12' },
      { key: 'battery', label: 'Bateria (%)', type: 'range', min: 1, max: 100, step: 1, default: 14 },
      {
        key: 'chat', label: 'Conversa', type: 'textarea', rows: 12, hint: 'Formato: eu: texto (enviada) · nome: texto (recebida) · -- Hoje (divisor) · (apagada) · (digitando)',
        default: '-- Ontem\nMãe: Filho, já chegou?\neu: Cheguei faz tempo, mãe. Tô em casa.\nMãe: Em qual casa?\neu: A de sempre. Por quê?\n-- Hoje\nMãe: Estou olhando pra você agora pela janela.\neu: Eu moro no quarto andar.\nMãe: (apagada)\nMãe: Atende a porta, [[ele]] está na ~~rua Quatro, 220~~\neu: Mãe, quem tá aí com você?\nMãe: (digitando)',
      },
      { key: 'glitch', label: 'Glitch na última mensagem', type: 'range', min: 0, max: 100, step: 5, default: 40 },
    ],
    css: `
.pc{--ink:var(--u-ink,#e7eef1);--paper:var(--u-paper,#0e1317);background:var(--paper);color:var(--ink);font-family:var(--f-body);display:flex;flex-direction:column;overflow:hidden;position:relative}
.pc-sb{display:flex;justify-content:space-between;align-items:center;padding:10px 20px 4px;font-size:13px;font-weight:500;color:color-mix(in srgb,var(--ink),transparent 15%)}
.pc-bat{display:flex;align-items:center;gap:5px}
.pc-bat i{display:inline-block;width:22px;height:11px;border:1.5px solid currentColor;border-radius:3px;position:relative;padding:1px;box-sizing:border-box}
.pc-bat i::before{content:"";display:block;height:100%;width:var(--b,50%);background:currentColor;border-radius:1px}
.pc-bat i::after{content:"";position:absolute;right:-4px;top:2.5px;width:2px;height:4px;background:currentColor;border-radius:0 1px 1px 0}
.pc-hd{display:flex;align-items:center;gap:12px;padding:8px 14px 10px;background:color-mix(in srgb,var(--paper),#fff 7%);border-bottom:1px solid rgba(255,255,255,.07)}
.pc-av{width:40px;height:40px;border-radius:50%;background:#3a4a52;display:grid;place-items:center;font-weight:500;font-size:18px}
.pc-nm{font-size:17px;font-weight:500;line-height:20px}.pc-st{font-size:12.5px;opacity:.65;line-height:15px}
.pc-msgs{flex:1 1 auto;padding:14px 12px 10px;display:flex;flex-direction:column;gap:5px;background-image:radial-gradient(rgba(255,255,255,.035) 1px,transparent 1.5px);background-size:22px 22px}
.pc-d{align-self:center;margin:8px 0;font-size:12px;padding:3px 12px;border-radius:12px;background:rgba(255,255,255,.08);opacity:.85}
.pc-b{max-width:78%;padding:7px 11px 6px;border-radius:12px;font-size:15.5px;line-height:21px;word-break:break-word;position:relative}
.pc-b.r{align-self:flex-start;background:#212b31;border-top-left-radius:3px}
.pc-b.s{align-self:flex-end;background:#2a5b52;border-top-right-radius:3px}
.pc-b small{display:block;text-align:right;font-size:10.5px;opacity:.55;margin-top:1px;line-height:12px}
.pc-b.x{font-style:italic;opacity:.6;font-size:14.5px}
.pc-t{display:flex;gap:4px;padding:11px 14px}.pc-t i{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.55}.pc-t i:nth-child(2){opacity:.8}.pc-t i:nth-child(3){opacity:.35}
.pc-in{display:flex;gap:10px;padding:10px 12px 18px;background:color-mix(in srgb,var(--paper),#fff 5%)}
.pc-in div{flex:1;background:#1f2a30;border-radius:22px;padding:10px 16px;font-size:15px;opacity:.7}
.pc-in b{width:42px;height:42px;border-radius:50%;background:#2a5b52;flex:0 0 42px}
.pc-glare{position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,transparent 55%,rgba(255,255,255,.03) 62%,transparent 70%)}
`,
    render(v, h) {
      const lines = String(v.chat || '').split('\n').map((l) => l.trim()).filter(Boolean);
      const lastR = (() => { for (let i = lines.length - 1; i >= 0; i--) if (!/^(--|eu\s*:)/i.test(lines[i]) && !/\(digitando\)\s*$/i.test(lines[i]) && !/\(apagada\)\s*$/i.test(lines[i])) return i; return -1; })();
      const base = H.ctx.assim;
      const clock = H.esc(v.clock);
      // Cada mensagem ganha um horário ligeiramente posterior ao da anterior (a partir do relógio do aparelho).
      const cm = String(v.clock || '').match(/^(\d{1,2}):(\d{2})/);
      let tick = 0;
      const stamp = () => {
        if (!cm) return clock;
        const tot = (+cm[1] * 60 + +cm[2] - 6 + Math.floor(tick++ / 2)) % 1440;
        const t = (tot + 1440) % 1440;
        return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
      };
      const out = lines.map((l, i) => {
        if (/^--/.test(l)) return `<div class="pc-d">${h.t(l.replace(/^--\s*/, ''))}</div>`;
        const m = l.match(/^([^:]{1,24}):\s*(.*)$/);
        const mine = m && /^eu$/i.test(m[1].trim());
        const txt = m ? m[2] : l;
        const cls = mine ? 's' : 'r';
        if (/^\(digitando\)$/i.test(txt)) return `<div class="pc-b ${cls} pc-t"><i></i><i></i><i></i></div>`;
        if (/^\(apagada\)$/i.test(txt)) return `<div class="pc-b ${cls} x">${mine ? 'Você apagou esta mensagem.' : 'Esta mensagem foi apagada.'}</div>`;
        let body;
        if (i === lastR) { try { H.ctx.assim = Math.min(100, base + (+v.glitch || 0)); body = h.rt(txt); } finally { H.ctx.assim = base; } } else body = h.rt(txt);
        return `<div class="pc-b ${cls}">${body}<small>${stamp()}</small></div>`;
      }).join('');
      const bat = Math.max(1, Math.min(100, +v.battery || 1));
      const initial = H.esc(String(v.contact || '?').trim().charAt(0).toUpperCase());
      return `<div class="tpl pc">
  <div data-layer="content" style="display:contents">
  <div class="pc-sb"><span>${clock}</span><span class="pc-bat">${bat}% <i style="--b:${bat}%"></i></span></div>
  <div class="pc-hd"><div class="pc-av">${initial}</div><div><div class="pc-nm">${h.t(v.contact)}</div><div class="pc-st">${h.t(v.status)}</div></div></div>
  <div class="pc-msgs">${out}</div>
  <div class="pc-in"><div>Mensagem</div><b></b></div>
  </div>
  <div class="pc-glare" data-layer="paper"></div>
</div>`;
    },
  });
})();

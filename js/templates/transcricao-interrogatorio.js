// Transcrição de interrogatório — papel pautado de tribunal: linhas numeradas, régua dupla vermelha, marcas de tempo.
(function () {
  const LINE = 28;
  window.TEMPLATES.push({
    id: 'transcricao-interrogatorio', name: 'Transcrição de interrogatório', category: 'Polícia',
    width: 700, height: 980, bleed: 0, paper: '#ece8da', ink: '#1a1a1a', wear: 34,
    fonts: { body: 'Courier Prime', hand: 'Caveat', title: 'Barlow Condensed' },
    usesFonts: [],
    fields: [
      { key: 'header', label: 'Cabeçalho', type: 'text', default: 'DELEGACIA DE HOMICÍDIOS E DESAPARECIMENTOS' },
      { key: 'room', label: 'Sala', type: 'text', default: 'Sala de oitiva 3' },
      { key: 'caseNumber', label: 'Caso', type: 'text', default: '0417/26' },
      { key: 'tapeRef', label: 'Fita', type: 'text', default: 'Fita 12-B · lado A' },
      { key: 'date', label: 'Data', type: 'text', default: '04/09/2026' },
      { key: 'interviewer', label: 'Interrogador(a)', type: 'text', default: 'Del. Márcia Tavares' },
      { key: 'interviewee', label: 'Interrogado', type: 'text', default: 'Roberto A. Dias' },
      { key: 'page', label: 'Página', type: 'text', default: 'pág. 3 de 9' },
      {
        key: 'transcript', label: 'Transcrição', type: 'textarea', rows: 12,
        hint: 'Uma fala por linha: [00:14:32] P: pergunta — R: resposta. Linhas sem P:/R: continuam a fala anterior.',
        default: '[00:14:32] P: Seu nome completo, por favor.\nR: Roberto Almeida Dias.\nP: O senhor sabe por que está aqui?\nR: Porque a Elisa disse que me viu na janela. Eu estava na calçada.\nP: Às 23h40.\nR: Às 23h40. Na calçada. {{ele disse janela}}\nP: Quem estava na janela, Roberto?\nR: Eu.\n[00:15:09] P: O senhor estava na calçada ou na janela?\nR: Nos dois lugares. Ninguém me pergunta isso direito. ~~Ele~~ também respondia quando ela chamava.\nP: “Ele” quem?\nR: Eu. [[Eu não sei qual dos dois está aqui agora.]]',
      },
      { key: 'stamp', label: 'Carimbo', type: 'text', default: 'CÓPIA DO ÁUDIO' },
    ],
    css: `
.tx{--ink:var(--u-ink,#1a1a1a);--paper:var(--u-paper,#ece8da);background:var(--paper);font-family:var(--f-body);color:var(--ink);padding:34px 40px 26px;display:flex;flex-direction:column;gap:16px;overflow:hidden}
.tx-head{display:flex;flex-direction:column;gap:2px}
.tx-org{font-family:var(--f-title);font-weight:700;font-size:21px;letter-spacing:.06em;line-height:24px}
.tx-sub{font-size:13px;line-height:18px}
.tx-title{font-family:var(--f-title);font-weight:600;font-size:34px;line-height:36px;letter-spacing:.03em;margin-top:8px}
.tx-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;border-top:2px solid var(--ink);border-bottom:1px solid var(--ink)}
.tx-meta div{padding:6px 8px 7px;border-right:1px solid color-mix(in srgb,var(--ink),transparent 65%);font-size:13px;line-height:17px}
.tx-meta div:nth-child(3n){border-right:0}
.tx-meta small{display:block;font-family:var(--f-title);font-size:11.5px;letter-spacing:.05em;opacity:.7}
.tx-body{position:relative;padding-left:76px;flex:1 1 auto;min-height:${LINE * 23}px;
  background-image:repeating-linear-gradient(to bottom,transparent 0,transparent ${LINE - 1}px,rgba(60,95,160,.34) ${LINE - 1}px,rgba(60,95,160,.34) ${LINE}px)}
.tx-body::before,.tx-body::after{content:"";position:absolute;top:-6px;bottom:0;width:1.5px;background:#b8423a;opacity:.85}
.tx-body::before{left:62px}.tx-body::after{left:67px}
.tx-gut{position:absolute;left:0;top:0;width:52px;overflow:hidden;height:100%;text-align:right;font-size:13px;color:color-mix(in srgb,var(--ink),transparent 45%)}
.tx-gut span{display:block;height:${LINE}px;line-height:${LINE}px}
.tx-r{font-size:15px;line-height:${LINE}px;margin:0;display:flex;gap:1ch}
.tx-r>span{white-space:pre-wrap;min-width:0;flex:1 1 auto}
.tx-r>b{flex:0 0 2ch;font-weight:700}
.tx-r.n{padding-left:3ch}
.tx-r .nota{margin-left:.7ch}
.tx-ts{font-size:12px;color:color-mix(in srgb,var(--ink),transparent 40%);margin-right:.8ch;white-space:nowrap}
.tx-foot{display:flex;justify-content:space-between;font-size:13px;padding-top:2px}
.tx-stamp{position:absolute;right:46px;top:34px;transform:rotate(6deg);border:2.5px solid #2f4a7a;color:#2f4a7a;padding:3px 12px 1px;font-family:var(--f-title);font-weight:700;font-size:22px;letter-spacing:.1em;opacity:.8;mix-blend-mode:multiply}
`,
    render(v, h) {
      const rows = String(v.transcript || '').split('\n').filter((l) => l.trim()).map((l) => {
        const m = l.match(/^(?:\[(\d\d:\d\d:\d\d)\]\s*)?(P|R)\s*:\s*(.*)$/i);
        if (!m) return `<p class="tx-r n"><span>${h.rt(l)}</span></p>`;
        const who = m[2].toUpperCase();
        return `<p class="tx-r"><b>${who}:</b><span>${m[1] ? `<i class="tx-ts">[${m[1]}]</i>` : ''}${h.rt(m[3])}</span></p>`;
      }).join('');
      const gut = Array.from({ length: 40 }, (_, i) => `<span>${i + 1}</span>`).join('');
      return `<div class="tpl tx">
  ${h.fx()}
  <div data-layer="content" style="display:contents">
  <div class="tx-head"><div class="tx-org">${h.t(v.header)}</div><div class="tx-sub">${h.t(v.room)} · Caso nº ${h.t(v.caseNumber)}</div><div class="tx-title">Transcrição de interrogatório</div></div>
  <div class="tx-meta"><div><small>Fita</small>${h.t(v.tapeRef)}</div><div><small>Data</small>${h.t(v.date)}</div><div><small>Caso</small>${h.t(v.caseNumber)}</div><div><small>Interrogador(a)</small>${h.t(v.interviewer)}</div><div><small>Interrogado</small>${h.t(v.interviewee)}</div><div><small>Local</small>${h.t(v.room)}</div></div>
  <div class="tx-body"><div class="tx-gut" aria-hidden="true">${gut}</div>${rows}</div>
  <div class="tx-foot"><span>Transcrição a partir de áudio. Não revisada.</span><span>${h.t(v.page)}</span></div>
  </div>
  ${v.stamp ? `<div class="tx-stamp" data-layer="stamps">${h.t(v.stamp)}</div>` : ''}
</div>`;
    },
  });
})();

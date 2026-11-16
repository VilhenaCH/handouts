// Memorando confidencial — cópia mimeografada (tinta violeta, bordas macias), faixas de classificação e sigilo próprio.
(function () {
  const sigil = (cls) => `<svg class="${cls}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<circle cx="32" cy="32" r="29"/><circle cx="32" cy="32" r="24" stroke-dasharray="1 4.2"/>
<path d="M8 32Q32 11 56 32Q32 53 8 32Z"/><circle cx="32" cy="32" r="8"/><circle cx="32" cy="32" r="2.6" fill="currentColor"/>
<path d="M32 3v10M32 51v10M3 32h10M51 32h10"/></svg>`;

  window.TEMPLATES.push({
    id: 'memorando-confidencial', name: 'Memorando confidencial', category: 'Ordem',
    width: 700, height: 980, bleed: 0, paper: '#eeeaf0', ink: '#503391', wear: 36,
    fonts: { body: 'Cutive Mono', title: 'Special Elite', hand: 'Reenie Beanie' },
    usesFonts: [],
    fields: [
      { key: 'band', label: 'Faixa de classificação', type: 'text', default: 'CONFIDENCIAL · NÍVEL 3 · NÃO COPIAR' },
      { key: 'org', label: 'Organização', type: 'text', default: 'ORDO REALITAS · CÉLULA REGIONAL' },
      { key: 'memoNo', label: 'Memorando nº', type: 'text', default: 'MEM/117-B/2026' },
      { key: 'to', label: 'Para', type: 'text', default: 'Agentes de campo — equipe Vale' },
      { key: 'from', label: 'De', type: 'text', default: 'Coordenação de Análise' },
      { key: 'date', label: 'Data', type: 'text', default: '06 de setembro de 2026' },
      { key: 'subject', label: 'Assunto', type: 'text', default: 'Ocorrências de duplicação — rua das Acácias' },
      {
        key: 'body', label: 'Corpo', type: 'textarea', rows: 12,
        default: 'Em atenção aos relatos coletados nos últimos 5 dias, determina-se:\n\n1. Nenhum agente deve ficar a sós com o alvo, ~~Roberto A. Dias~~, em qualquer circunstância.\n2. Registrar horário e local de TODA interação, inclusive as que parecerem repetidas.\n3. Em caso de duas pessoas idênticas, não tentar identificar a original. Isolar ambas.\n4. {{testar a palavra de segurança em cada um}} A palavra de segurança desta semana é ~~SALINA~~.\n\nAs evidências indicam atividade de assimilação em estágio inicial. [[Eles já sabem que estamos olhando.]]\n\nEste memorando deve ser destruído após a leitura.',
      },
      { key: 'dist', label: 'Distribuição', type: 'text', default: 'Cópias 1 a 12 · Arquivo morto: não' },
      { key: 'copy', label: 'Cópia', type: 'text', default: 'CÓPIA 07 / 12' },
      { key: 'scribble', label: 'Anotação à mão', type: 'text', default: 'não é a letra do Fábio' },
    ],
    css: `
.mm{--ink:var(--u-ink,#503391);--paper:var(--u-paper,#eeeaf0);background:var(--paper);color:var(--ink);font-family:var(--f-body);padding:0;display:flex;flex-direction:column;overflow:hidden}
.mm-band{background:var(--ink);color:var(--paper);font-family:var(--f-title);font-size:19px;letter-spacing:.2em;text-align:center;padding:9px 12px 6px;line-height:22px}
.mm-in{flex:1 1 auto;padding:30px 46px 22px;display:flex;flex-direction:column;gap:18px;text-shadow:0 0 1.3px color-mix(in srgb,var(--ink),transparent 35%);position:relative}
.mm-head{display:flex;gap:18px;align-items:center;border-bottom:2px solid var(--ink);padding-bottom:14px}
.mm-sig{width:70px;height:70px;flex:0 0 70px}
.mm-org{font-family:var(--f-title);font-size:21px;line-height:25px;letter-spacing:.06em}
.mm-no{font-size:13px;margin-top:3px}
.mm-title{font-family:var(--f-title);font-size:40px;line-height:42px;letter-spacing:.12em}
.mm-tab{display:grid;grid-template-columns:92px 1fr;row-gap:6px;font-size:14.5px;line-height:20px}
.mm-tab b{font-weight:400;letter-spacing:.04em}
.mm-tab span{border-bottom:1px dotted var(--ink)}
.mm-body{font-size:15px;line-height:23px;white-space:pre-wrap;border-top:2px solid var(--ink);padding-top:16px}
.mm-foot{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;font-size:12.5px;border-top:1px solid var(--ink);padding-top:8px}
.mm-copy{border:2px solid var(--ink);padding:4px 10px 2px;font-family:var(--f-title);letter-spacing:.1em;font-size:16px}
.mm-wm{position:absolute;right:-60px;top:260px;width:420px;height:420px;color:var(--ink);opacity:.07;pointer-events:none}
.mm-scr{position:absolute;right:56px;bottom:112px;transform:rotate(-5deg);font-family:var(--f-hand);font-size:36px;line-height:36px;color:#b3261e;text-shadow:none;max-width:210px;text-align:center}
`,
    render(v, h) {
      return `<div class="tpl mm">
  <div data-layer="content" style="display:contents"><div class="mm-band">${h.t(v.band)}</div></div>
  <div class="mm-in">
    ${h.fx()}
    <div data-layer="paper" style="display:contents">${sigil('mm-wm')}</div>
    <div data-layer="content" style="display:contents">
    <div class="mm-head">${sigil('mm-sig')}<div><div class="mm-org">${h.t(v.org)}</div><div class="mm-no">${h.t(v.memoNo)}</div></div></div>
    <div class="mm-title">MEMORANDO</div>
    <div class="mm-tab"><b>PARA:</b><span>${h.t(v.to)}</span><b>DE:</b><span>${h.t(v.from)}</span><b>DATA:</b><span>${h.t(v.date)}</span><b>ASSUNTO:</b><span>${h.rt(v.subject)}</span></div>
    <div class="mm-body">${h.rt(v.body)}</div>
    <div class="mm-foot"><span>${h.t(v.dist)}</span><span class="mm-copy">${h.t(v.copy)}</span></div>
    </div>
    ${v.scribble ? `<div class="mm-scr" data-layer="notes">${h.t(v.scribble)}</div>` : ''}
  </div>
  <div data-layer="content" style="display:contents"><div class="mm-band">${h.t(v.band)}</div></div>
</div>`;
    },
  });
})();

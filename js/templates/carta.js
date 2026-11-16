// Carta — papel de carta com borda de correio aéreo, selo, carimbo postal circular e letra de mão.
(function () {
  const postmark = (city, date) => {
    const txt = H.esc(String(city || '').toUpperCase().slice(0, 18));
    const chars = Array.from(txt.length ? String(city).toUpperCase().slice(0, 18) : ' ');
    const N = Math.max(chars.length, 1), span = 200;
    const arc = chars.map((c, i) => {
      const a = -100 + (N > 1 ? (i / (N - 1)) * span : 100);
      return `<text x="50" y="12" transform="rotate(${a.toFixed(1)} 50 50)" text-anchor="middle">${H.esc(c)}</text>`;
    }).join('');
    return `<svg class="ct-pm" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="30"/></g>
<g fill="currentColor" font-family="Cutive Mono, monospace" font-size="9">${arc}</g>
<text x="50" y="53" text-anchor="middle" font-family="Cutive Mono, monospace" font-size="9" fill="currentColor">${H.esc(date)}</text></svg>
<svg class="ct-wave" viewBox="0 0 120 30" aria-hidden="true"><path d="M0 5q10 -6 20 0t20 0t20 0t20 0t20 0t20 0M0 12q10 -6 20 0t20 0t20 0t20 0t20 0t20 0M0 19q10 -6 20 0t20 0t20 0t20 0t20 0t20 0" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
  };

  window.TEMPLATES.push({
    id: 'carta', name: 'Carta', category: 'Pessoal',
    width: 640, height: 860, bleed: 0, paper: '#f3ebd7', ink: '#22304f', wear: 46,
    fonts: { body: 'Kalam', title: 'Cormorant Garamond', hand: 'Cedarville Cursive' },
    usesFonts: ['Cutive Mono'],
    fields: [
      { key: 'place', label: 'Local e data', type: 'text', default: 'Pensão Aurora, 28 de agosto' },
      { key: 'greeting', label: 'Saudação', type: 'text', default: 'Querida Elisa,' },
      {
        key: 'body', label: 'Texto', type: 'textarea', rows: 11,
        default: 'Escrevo depressa porque ele pode voltar a qualquer momento. Não use o telefone, eles escutam. Se alguém bater na porta com a minha voz, não abra.\n\nA casa nova é como a descrevi: silenciosa demais. À noite escuto passos no corredor que andam exatamente no meu ritmo. Já tentei parar de repente e eles também param, só um pouco depois.\n\nNão me procure. Se eu aparecer, {{quem aparece não sou eu}} lembre da frase que combinamos. ~~A do cais.~~',
      },
      { key: 'closing', label: 'Despedida', type: 'text', default: 'Com todo o carinho que ainda sobrou,' },
      { key: 'signature', label: 'Assinatura', type: 'text', default: 'Roberto' },
      { key: 'ps', label: 'P.S.', type: 'text', default: 'P.S.: [[Eu não escrevi o parágrafo do meio.]]' },
      { key: 'pmCity', label: 'Cidade do carimbo', type: 'text', default: 'SÃO PAULO' },
      { key: 'pmDate', label: 'Data do carimbo', type: 'text', default: '29 AGO 26' },
    ],
    css: `
.ct{--ink:var(--u-ink,#22304f);--paper:var(--u-paper,#f3ebd7);position:relative;box-sizing:border-box;padding:16px;
  background:repeating-linear-gradient(-45deg,#c24134 0 15px,#f4efe2 15px 30px,#27478c 30px 45px,#f4efe2 45px 60px)}
.ct-in{position:relative;background:var(--paper);height:100%;min-height:828px;color:var(--ink);font-family:var(--f-body);padding:46px 56px 34px;display:flex;flex-direction:column;overflow:hidden;text-shadow:0 0 .4px color-mix(in srgb,var(--ink),transparent 40%)}
.ct-place{font-family:var(--f-title);font-style:italic;font-size:21px;line-height:26px;text-align:left;max-width:360px}
.ct-gr{font-size:25px;line-height:32px;margin-top:38px}
.ct-body{font-size:21px;line-height:32px;margin-top:6px;white-space:pre-line;background:repeating-linear-gradient(to bottom,transparent 0 31px,color-mix(in srgb,var(--ink),transparent 85%) 31px 32px);background-position:0 5px}
.ct-body p{margin:0 0 32px}
.ct-cl{font-size:21px;line-height:32px;margin-top:2px}
.ct-sg{font-family:var(--f-hand);font-size:44px;line-height:50px;margin:4px 0 0 40px}
.ct-ps{font-size:19px;line-height:28px;margin-top:auto;padding-top:10px}
.ct-stamp{position:absolute;right:42px;top:34px;width:74px;height:94px;background:#b8453a;transform:rotate(3deg);outline:5px dotted var(--paper);outline-offset:-2px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f3ebd7;font-family:var(--f-title);text-shadow:none;box-shadow:inset 0 0 0 5px #b8453a,inset 0 0 0 7px rgba(243,235,215,.8)}
.ct-stamp b{font-size:26px;line-height:28px}.ct-stamp span{font-size:11px;letter-spacing:.14em}
.ct-pmw{position:absolute;right:22px;top:30px;width:150px;height:110px;color:#2a2a2a;opacity:.72;mix-blend-mode:multiply;transform:rotate(-12deg)}
.ct-pm{position:absolute;left:0;top:0;width:96px;height:96px}
.ct-wave{position:absolute;left:84px;top:34px;width:66px;height:auto}
`,
    render(v, h) {
      const paras = String(v.body || '').split(/\n\s*\n/).filter((s) => s.trim()).map((s) => `<p>${h.rt(s.replace(/\n/g, ' '))}</p>`).join('');
      return `<div class="tpl ct">
  <div class="ct-in">
    ${h.fx()}
    <div data-layer="content" style="display:contents">
    <div class="ct-place">${h.t(v.place)}</div>
    <div class="ct-gr">${h.t(v.greeting)}</div>
    <div class="ct-body">${paras}</div>
    <div class="ct-cl">${h.t(v.closing)}</div>
    <div class="ct-sg">${h.t(v.signature)}</div>
    <div class="ct-ps">${h.rt(v.ps)}</div>
    </div>
    <div data-layer="stamps" style="display:contents"><div class="ct-stamp"><span>BRASIL</span><b>1,80</b><span>AÉREO</span></div><div class="ct-pmw">${postmark(v.pmCity, v.pmDate)}</div></div>
  </div>
</div>`;
    },
  });
})();

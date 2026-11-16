// Papel rasgado — folha de caderno espiral arrancada com pressa: borda esfiapada, grafite, mancha de café e fita adesiva.
(function () {
  function tear(seed) {
    const r = H.rng(seed), p = [], f = (n) => n.toFixed(2);
    p.push('0% 0%');
    for (let i = 0; i <= 30; i++) p.push(`${f(i % 2 ? r() * 1.4 : 2 + r() * 2.6)}% ${f((i * 100) / 30)}%`);
    for (let i = 1; i <= 8; i++) p.push(`${f((i * 100) / 8)}% ${f(100 - r() * 0.6)}%`);
    for (let i = 29; i >= 0; i--) p.push(`${f(100 - r() * 0.5)}% ${f((i * 100) / 30)}%`);
    for (let i = 7; i >= 1; i--) p.push(`${f((i * 100) / 8)}% ${f(r() * 0.5)}%`);
    return `polygon(${p.join(',')})`;
  }

  window.TEMPLATES.push({
    id: 'papel-rasgado', name: 'Papel rasgado', category: 'Pessoal',
    width: 480, height: 560, bleed: 20, paper: '#f2f0e8', ink: '#34363d', wear: 58,
    fonts: { body: 'Nothing You Could Do', title: 'Reenie Beanie', hand: 'Reenie Beanie' },
    usesFonts: [],
    fields: [
      { key: 'title', label: 'Primeira linha', type: 'text', default: 'se você achou isso' },
      {
        key: 'body', label: 'Texto', type: 'textarea', rows: 8,
        default: 'não vá para o porão.\nele não é meu irmão.\nficou na casa antes de eu sair.\nsó respondo em voz alta quando tem certeza que sou eu.\n~~Pelo amor de Deus~~ confira os dentes dele.',
      },
      { key: 'sign', label: 'Assinatura', type: 'text', default: 'T.' },
      { key: 'scribble', label: 'Rabisco no canto', type: 'text', default: '03:12' },
    ],
    css: `
.pp{--ink:var(--u-ink,#34363d);--paper:var(--u-paper,#f2f0e8);display:flex;flex-direction:column;color:var(--ink);font-family:var(--f-body)}
.pp-p{position:relative;flex:1 1 auto;background-color:var(--paper);padding:46px 36px 30px 66px;overflow:hidden;
  background-image:repeating-linear-gradient(to bottom,transparent 0 31px,rgba(70,110,170,.4) 31px 32px);background-position:0 54px;filter:drop-shadow(0 6px 10px rgba(30,20,10,.28))}
.pp-mg{position:absolute;left:52px;top:0;bottom:0;border-left:1.5px solid rgba(200,60,60,.55)}
.pp-t{font-family:var(--f-title);font-size:40px;line-height:44px;margin-bottom:12px}
.pp-b{font-size:19px;line-height:32px;white-space:pre-wrap;text-shadow:0 0 .7px rgba(40,40,50,.8);opacity:.93}
.pp-s{font-family:var(--f-title);font-size:44px;line-height:44px;text-align:right;margin-top:14px}
.pp-ring{position:absolute;right:30px;bottom:44px;width:128px;height:128px;border-radius:50%;border:7px solid rgba(110,70,35,.28);box-shadow:inset 0 0 10px rgba(110,70,35,.22),0 0 6px rgba(110,70,35,.14);transform:rotate(12deg);clip-path:polygon(0 0,100% 0,100% 72%,86% 62%,60% 100%,0 100%)}
.pp-tape{position:absolute;left:112px;top:-8px;width:130px;height:40px;background:rgba(222,208,150,.65);transform:rotate(-4deg);box-shadow:0 1px 2px rgba(0,0,0,.18);clip-path:polygon(0 8%,4% 0,8% 10%,12% 0,100% 0,96% 50%,100% 100%,8% 100%,0 90%,3% 50%)}
.pp-scr{position:absolute;right:46px;top:50px;transform:rotate(9deg);font-family:var(--f-title);font-size:46px;line-height:46px;color:#b3261e}
`,
    render(v, h) {
      return `<div class="tpl pp">
  <div class="pp-p" style="clip-path:${tear(H.ctx.seed ^ 515)}">
    ${h.fx()}<div class="pp-mg" data-layer="paper"></div><div class="pp-ring" data-layer="paper"></div>
    <div data-layer="content" style="display:contents">
    <div class="pp-t">${h.t(v.title)}</div>
    <div class="pp-b">${h.rt(v.body)}</div>
    <div class="pp-s">${h.t(v.sign)}</div>
    </div>
    ${v.scribble ? `<div class="pp-scr" data-layer="notes">${h.t(v.scribble)}</div>` : ''}
  </div>
  <div class="pp-tape" data-layer="stamps"></div>
</div>`;
    },
  });
})();

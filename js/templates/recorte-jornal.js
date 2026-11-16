// Recorte de jornal sensacionalista — papel-jornal amarelado, bordas rasgadas (clip-path), foto em retícula, 3 colunas.
(function () {
  // Borda rasgada determinística: perturba cada lado do retângulo.
  function torn(seed) {
    const r = H.rng(seed), p = [];
    const f = (n) => n.toFixed(2);
    for (let i = 0; i <= 44; i++) p.push(`${f((i * 100) / 44)}% ${f(r() * 1.5)}%`);
    for (let i = 1; i <= 36; i++) p.push(`${f(100 - r() * 1.3)}% ${f((i * 100) / 36)}%`);
    for (let i = 44; i >= 0; i--) p.push(`${f((i * 100) / 44)}% ${f(100 - r() * 1.7)}%`);
    for (let i = 35; i >= 1; i--) p.push(`${f(r() * 1.3)}% ${f((i * 100) / 36)}%`);
    return `polygon(${p.join(',')})`;
  }

  window.TEMPLATES.push({
    id: 'recorte-jornal', name: 'Recorte de jornal', category: 'Imprensa',
    width: 760, height: 800, bleed: 18, paper: '#e4d9b9', ink: '#1b1812', wear: 62,
    fonts: { body: 'PT Serif', title: 'Alfa Slab One', hand: 'Permanent Marker' },
    usesFonts: ['UnifrakturMaguntia'],
    fields: [
      { key: 'masthead', label: 'Nome do jornal', type: 'text', default: 'A Gazeta do Vale' },
      { key: 'date', label: 'Data', type: 'text', default: 'Quinta-feira, 5 de setembro de 2026' },
      { key: 'edition', label: 'Edição / preço', type: 'text', default: 'Edição de plantão · R$ 4,50' },
      { key: 'section', label: 'Editoria', type: 'text', default: 'POLÍCIA' },
      { key: 'headline', label: 'Manchete', type: 'text', default: 'Vizinhos juram ter visto o mesmo homem em dois lugares' },
      { key: 'deck', label: 'Linha fina', type: 'text', default: 'Desaparecido da rua das Acácias aparece em duas gravações, com 40 minutos de diferença e a mesma camisa.' },
      { key: 'byline', label: 'Assinatura', type: 'text', default: 'Por Helena Prado, da Redação' },
      {
        key: 'body', label: 'Texto (parágrafos separados por linha em branco)', type: 'textarea', rows: 12,
        default: 'A polícia investiga o desaparecimento de Roberto Almeida Dias, 52 anos, visto pela última vez na noite de terça-feira. Segundo moradores, ele estava ao mesmo tempo na calçada e na janela do segundo andar do número 220.\n\n“Eu acenei para ele de cima e ele acenou de volta. Depois desci e ele continuava na calçada, parado”, afirmou uma vizinha, que pediu para não ser identificada.\n\nO delegado responsável pelo caso, ~~Cláudio Ferraz~~, disse que “não há indício de crime” e que as imagens das câmeras da rua “estão sendo analisadas com cautela”. Nenhuma das duas gravações foi divulgada.\n\n{{perguntar de novo sobre a câmera da padaria}} Na manhã de ontem, a família recebeu uma ligação. Do outro lado da linha, de acordo com a irmã, havia apenas a respiração de alguém repetindo o nome da rua. [[Ele ainda está lá dentro.]]',
      },
      { key: 'photo', label: 'Foto', type: 'image' },
      { key: 'caption', label: 'Legenda', type: 'text', default: 'Fachada do número 220, na rua das Acácias. Foto: Arquivo.' },
      { key: 'cont', label: 'Rodapé', type: 'text', default: 'Continua na página 7' },
      { key: 'scribble', label: 'Anotação à mão', type: 'text', default: 'ver as duas fitas!!' },
    ],
    css: `
.rc{--ink:var(--u-ink,#1b1812);--paper:var(--u-paper,#e4d9b9);display:flex;flex-direction:column;color:var(--ink);font-family:var(--f-body)}
.rc-p{position:relative;flex:1 1 auto;display:flex;flex-direction:column;gap:12px;background:var(--paper);padding:34px 40px 28px;overflow:hidden;text-shadow:0 0 .7px rgba(20,14,8,.45)}
.rc-mast{font-family:'UnifrakturMaguntia',serif;font-size:58px;line-height:60px;text-align:center;border-bottom:3px double var(--ink);padding-bottom:6px}
.rc-info{display:flex;justify-content:space-between;font-size:12.5px;line-height:16px;border-bottom:1px solid var(--ink);padding-bottom:5px;margin-top:-4px}
.rc-sec{align-self:flex-start;background:var(--ink);color:var(--paper);font-family:var(--f-title);font-size:14px;line-height:16px;padding:3px 10px 2px;letter-spacing:.06em;text-shadow:none}
.rc-h{font-family:var(--f-title);font-size:46px;line-height:49px;margin:0;letter-spacing:-.005em}
.rc-top{display:flex;gap:20px;align-items:flex-start}
.rc-fig{flex:0 0 292px;margin:0}
.rc-ph{position:relative;width:292px;height:196px;object-fit:cover;display:block;filter:grayscale(1) contrast(1.7) brightness(.95);border:1px solid var(--ink)}
.rc-ph.ph{filter:none;background:repeating-linear-gradient(135deg,rgba(0,0,0,.35) 0 2px,transparent 2px 8px)}
.rc-fig .scr{position:relative}
.rc-fig .scr::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle,transparent 0 .9px,var(--paper) 1.7px) 0 0/3.2px 3.2px;opacity:.82}
.rc-cap{font-size:11.5px;line-height:15px;font-style:italic;margin-top:4px}
.rc-side{flex:1 1 auto}
.rc-deck{font-size:17px;line-height:23px;font-style:italic;margin:0 0 8px}
.rc-by{font-size:12.5px;font-weight:700;border-top:1px solid var(--ink);padding-top:5px}
.rc-cols{column-count:3;column-gap:20px;column-rule:1px solid color-mix(in srgb,var(--ink),transparent 55%);font-size:13.2px;line-height:18px;text-align:justify;hyphens:auto}
.rc-cols p{margin:0 0 9px}
.rc-cols p:first-child::first-letter{font-family:var(--f-title);font-size:44px;line-height:36px;float:left;padding:3px 5px 0 0}
.rc-cont{margin-top:auto;border-top:1px solid var(--ink);padding-top:5px;font-size:12px;font-style:italic;text-align:right}
.rc-scr{position:absolute;right:70px;top:462px;transform:rotate(-7deg);font-family:var(--f-hand);font-size:30px;color:#b3261e;text-shadow:none;max-width:200px;line-height:32px;text-align:center}
`,
    render(v, h) {
      const paras = String(v.body || '').split(/\n\s*\n/).filter((s) => s.trim()).map((s) => `<p>${h.rt(s.replace(/\n/g, ' '))}</p>`).join('');
      const src = H.ctx.imgs[v.photo];
      const photo = src ? `<img class="rc-ph" src="${src}" alt="">` : `<div class="rc-ph ph"></div>`;
      return `<div class="tpl rc">
  <div class="rc-p" style="clip-path:${torn(H.ctx.seed ^ 311)}">
    ${h.fx()}
    <div data-layer="content" style="display:contents">
    <div class="rc-mast">${h.t(v.masthead)}</div>
    <div class="rc-info"><span>${h.t(v.date)}</span><span>${h.t(v.edition)}</span></div>
    <div class="rc-sec">${h.t(v.section)}</div>
    <h1 class="rc-h">${h.rt(v.headline)}</h1>
    <div class="rc-top"><figure class="rc-fig"><div class="scr">${photo}</div><figcaption class="rc-cap">${h.t(v.caption)}</figcaption></figure>
      <div class="rc-side"><p class="rc-deck">${h.rt(v.deck)}</p><div class="rc-by">${h.t(v.byline)}</div></div></div>
    <div class="rc-cols">${paras}</div>
    <div class="rc-cont">${h.t(v.cont)}</div>
    </div>
    ${v.scribble ? `<div class="rc-scr" data-layer="notes">${h.t(v.scribble)}</div>` : ''}
  </div>
</div>`;
    },
  });
})();

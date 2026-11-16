// Relatório de ocorrência paranormal — a cor e o glifo mudam com o elemento; medidor de ameaça 0–5; código de barras.
(function () {
  const EL = {
    Sangue: { c: '#8f1d1d', g: '<path d="M32 6C24 20 14 29 14 41a18 18 0 0036 0C50 29 40 20 32 6z"/><path d="M25 43a8 8 0 008 8"/>' },
    Morte: { c: '#3b3b3b', g: '<circle cx="32" cy="32" r="22"/><path d="M32 4v56M22 14h20"/>' },
    Conhecimento: { c: '#946a10', g: '<path d="M4 32Q32 6 60 32Q32 58 4 32Z"/><circle cx="32" cy="32" r="9"/><circle cx="32" cy="32" r="2.6" fill="currentColor"/>' },
    Energia: { c: '#5d2f9a', g: '<path d="M37 4L14 36h15l-5 24 26-34H35z"/>' },
    Medo: { c: '#16161a', g: '<path d="M32 32m0 0a3 3 0 016 0a8 8 0 01-16 0a13 13 0 0126 0a18 18 0 01-36 0a23 23 0 0146 0"/>' },
    Nenhum: { c: '#3b5568', g: '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="3.5"/>' },
  };
  const THREAT = ['Nenhuma', 'Baixa', 'Moderada', 'Alta', 'Severa', 'Crítica'];

  // Code 128-B para a fonte Libre Barcode 128 Text (início, valores, checksum, fim).
  function code128(s) {
    const vals = Array.from(String(s)).map((c) => Math.min(94, Math.max(0, c.charCodeAt(0) - 32)));
    let sum = 104; vals.forEach((v, i) => { sum += v * (i + 1); });
    const toCh = (v) => String.fromCharCode(v < 95 ? v + 32 : v + 100);
    return toCh(104) + vals.map(toCh).join('') + toCh(sum % 103) + toCh(106);
  }

  window.TEMPLATES.push({
    id: 'relatorio-paranormal', name: 'Relatório paranormal', category: 'Ordem',
    width: 700, height: 980, bleed: 0, paper: '#ecebe6', ink: '#1a1a1a', wear: 30,
    fonts: { body: 'Public Sans', title: 'Oswald', hand: 'Reenie Beanie' },
    usesFonts: ['Share Tech Mono', 'Libre Barcode 128 Text'],
    fields: [
      { key: 'element', label: 'Elemento', type: 'select', options: Object.keys(EL), default: 'Sangue' },
      { key: 'threat', label: 'Grau de ameaça (0–5)', type: 'range', min: 0, max: 5, step: 1, default: 3 },
      { key: 'org', label: 'Organização', type: 'text', default: 'ORDO REALITAS — DIVISÃO DE CAMPO' },
      { key: 'code', label: 'Código do registro', type: 'text', default: 'OP-0417-B7' },
      { key: 'place', label: 'Local', type: 'text', default: 'Rua das Acácias, 220 — segundo andar' },
      { key: 'when', label: 'Data e hora', type: 'text', default: '03/09/2026 · 23:40' },
      { key: 'agent', label: 'Agente responsável', type: 'text', default: 'Ag. Letícia Moura' },
      { key: 'entity', label: 'Entidade / fenômeno', type: 'text', default: 'Duplicação de hospedeiro (assimilação inicial)' },
      { key: 'desc', label: 'Descrição do fenômeno', type: 'textarea', rows: 5, default: 'O alvo foi observado simultaneamente em dois pontos separados por 8 metros. Ambos respondem ao mesmo nome e reproduzem os mesmos gestos com atraso de aproximadamente 2 segundos. Nenhum deles projeta sombra sob luz direta.' },
      { key: 'effects', label: 'Efeitos observados', type: 'textarea', rows: 4, default: 'Distorção de fala em testemunhas (repetição involuntária de palavras)\nQueda de temperatura localizada\n~~Perda de memória recente~~ em 3 de 5 agentes' },
      { key: 'contain', label: 'Contenção recomendada', type: 'textarea', rows: 4, default: 'Isolamento imediato dos dois indivíduos em ambientes distintos. Sem contato visual entre eles. {{sal grosso nas soleiras}} Aguardar equipe de extração.' },
      { key: 'photo', label: 'Foto de campo', type: 'image' },
    ],
    css: `
.rp{--ink:var(--u-ink,#1a1a1a);--paper:var(--u-paper,#ecebe6);background:var(--paper);color:var(--ink);font-family:var(--f-body);padding:0;display:flex;flex-direction:column;overflow:hidden}
.rp-top{background:var(--acc);color:#fff;display:flex;gap:22px;align-items:center;padding:26px 40px 22px}
.rp-glyph{flex:0 0 104px;width:104px;height:104px;border:3px solid #fff;padding:12px;box-sizing:border-box}
.rp-glyph svg{width:100%;height:100%;display:block}
.rp-org{font-family:'Share Tech Mono',monospace;font-size:13px;letter-spacing:.1em;opacity:.9}
.rp-title{font-family:var(--f-title);font-weight:600;font-size:38px;line-height:40px;letter-spacing:.02em;margin:5px 0}
.rp-code{font-family:'Share Tech Mono',monospace;font-size:14px}
.rp-in{flex:1 1 auto;padding:24px 40px 22px;display:flex;flex-direction:column;gap:14px;position:relative}
.rp-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);border:2px solid var(--ink)}
.rp-grid div{padding:7px 12px 9px;border-right:1px solid var(--ink);border-bottom:1px solid var(--ink);font-size:14.5px;line-height:19px}
.rp-grid div:nth-child(2n){border-right:0}
.rp-grid div:nth-last-child(-n+2){border-bottom:0}
.rp-grid small{display:block;font-family:'Share Tech Mono',monospace;font-size:11.5px;letter-spacing:.06em;color:var(--acc);margin-bottom:2px}
.rp-meter{display:flex;gap:5px;margin-top:4px}
.rp-meter i{flex:1 1 0;height:14px;border:1.5px solid var(--ink)}
.rp-meter i.on{background:var(--acc);border-color:var(--acc)}
.rp-h{font-family:var(--f-title);font-weight:600;font-size:17px;letter-spacing:.08em;color:var(--acc);border-bottom:2px solid var(--acc);margin-bottom:6px;padding-bottom:2px}
.rp-t{font-size:14.5px;line-height:22px;white-space:pre-line}
.rp-2{display:flex;gap:20px}
.rp-ph{flex:0 0 220px;width:220px;height:170px;object-fit:cover;border:2px solid var(--ink);display:block;filter:grayscale(.85) contrast(1.15)}
.rp-ph.ph{filter:none;background:repeating-linear-gradient(135deg,rgba(0,0,0,.18) 0 2px,transparent 2px 9px)}
.rp-bar{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;border-top:2px solid var(--ink);padding-top:6px}
.rp-bc{font-family:'Libre Barcode 128 Text',monospace;font-size:62px;line-height:62px}
.rp-stamp{position:absolute;right:46px;top:782px;border:3px solid var(--acc);color:var(--acc);padding:3px 14px 1px;transform:rotate(-8deg);font-family:var(--f-title);font-weight:700;font-size:26px;letter-spacing:.1em;opacity:.82;mix-blend-mode:multiply}
`,
    render(v, h) {
      const e = EL[v.element] || EL.Nenhum;
      const n = Math.max(0, Math.min(5, +v.threat || 0));
      const meter = Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
      const effects = H.lines(v.effects).map((l) => `<div>— ${h.rt(l)}</div>`).join('');
      const src = H.ctx.imgs[v.photo];
      const photo = src ? `<img class="rp-ph" src="${src}" alt="">` : `<div class="rp-ph ph"></div>`;
      return `<div class="tpl rp" style="--acc:${e.c}">
  ${h.fx()}
  <div data-layer="content" style="display:contents">
  <div class="rp-top"><div class="rp-glyph"><svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e.g}</svg></div>
    <div><div class="rp-org">${h.t(v.org)}</div><div class="rp-title">Relatório de ocorrência paranormal</div><div class="rp-code">REGISTRO ${h.t(v.code)}</div></div></div>
  <div class="rp-in">
    <div class="rp-grid"><div><small>LOCAL</small>${h.t(v.place)}</div><div><small>DATA E HORA</small>${h.t(v.when)}</div><div><small>AGENTE</small>${h.t(v.agent)}</div><div><small>ELEMENTO</small>${h.t(v.element)}</div><div><small>ENTIDADE / FENÔMENO</small>${h.rt(v.entity)}</div><div><small>AMEAÇA: ${h.t(THREAT[n].toUpperCase())}</small><div class="rp-meter" role="img" aria-label="Ameaça ${n} de 5">${meter}</div></div></div>
    <div class="rp-2"><div style="flex:1 1 auto"><div class="rp-h">Descrição</div><div class="rp-t">${h.rt(v.desc)}</div></div>${photo}</div>
    <div><div class="rp-h">Efeitos observados</div><div class="rp-t">${effects}</div></div>
    <div><div class="rp-h">Contenção recomendada</div><div class="rp-t">${h.rt(v.contain)}</div></div>
    <div class="rp-bar"><div class="rp-bc" aria-hidden="true">${H.esc(code128(v.code || '0'))}</div><div style="font-family:'Share Tech Mono',monospace;font-size:12px;text-align:right">USO RESTRITO<br>VIDA ÚTIL: ATÉ A PRÓXIMA OCORRÊNCIA</div></div>
  </div>
  </div>
  <div class="rp-stamp" data-layer="stamps">${h.t(String(v.element).toUpperCase())}</div>
</div>`;
    },
  });
})();

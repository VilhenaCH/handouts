// Laudo do IML — clínico gelado: papel cinza-esverdeado, silhueta corporal com marcadores numerados ligados aos achados.
(function () {
  // posições (x,y em unidades do viewBox 0 0 100 260) dos marcadores na figura da frente
  const SLOTS = [[50, 20], [50, 76], [50, 118], [20, 104], [60, 214], [82, 104]];
  const figure = (back) => `
<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
  <circle cx="50" cy="20" r="13"/><path d="M44 32v8h12v-8"/>
  <path d="M30 42c8-4 32-4 40 0l6 30-4 40-6 4H34l-6-4-4-40z"/>
  <path d="M30 44l-12 46-4 30M70 44l12 46 4 30"/>
  <path d="M38 116l-4 70-2 60M62 116l4 70 2 60"/>
  ${back ? '<path d="M50 40v76" stroke-dasharray="2 3"/><path d="M38 52c4 6 8 8 12 8M62 52c-4 6-8 8-12 8"/>' : ''}
</g>`;

  window.TEMPLATES.push({
    id: 'laudo-iml', name: 'Laudo do IML', category: 'Perícia',
    width: 700, height: 980, bleed: 0, paper: '#e6ebe8', ink: '#1a1d1f', wear: 30,
    fonts: { body: 'Source Serif 4', title: 'Barlow Condensed', hand: 'La Belle Aurore' },
    usesFonts: ['IBM Plex Mono'],
    fields: [
      { key: 'institution', label: 'Instituição', type: 'text', default: 'INSTITUTO MÉDICO LEGAL — NÚCLEO REGIONAL' },
      { key: 'department', label: 'Divisão', type: 'text', default: 'Divisão de perícias antropológicas' },
      { key: 'caseNumber', label: 'Caso', type: 'text', default: '0417/26' },
      { key: 'laudoNumber', label: 'Nº do laudo', type: 'text', default: 'IML-2026/08812' },
      { key: 'examDate', label: 'Data do exame', type: 'text', default: '05/09/2026' },
      { key: 'examTime', label: 'Hora', type: 'text', default: '09:40' },
      { key: 'subjectName', label: 'Examinado', type: 'text', default: 'Não identificado (identificação datiloscópica: ~~Roberto Almeida Dias~~)' },
      { key: 'examiner', label: 'Perito', type: 'text', default: 'Dr. Álvaro Menezes — CRM 118.204' },
      {
        key: 'findings', label: 'Achados (um por linha)', type: 'textarea', rows: 8,
        hint: 'Cada linha vira um achado numerado; os marcadores seguem a ordem: cabeça, tórax, abdômen, braço, perna, mão.',
        default: 'Cabeça: sem lesões externas. Pupilas fixas, dilatação máxima. Odor adocicado persistente.\nTórax: cicatriz cirúrgica antiga de 12 cm sobre o esterno. Não consta no prontuário do desaparecido.\nAbdômen: sem lesões. Temperatura interna incompatível com o horário estimado do óbito.\nBraço direito: marca circular de 3 cm na face interna, de origem não conhecida.\nPerna esquerda: ~~sinais de reconstituição tecidual~~ [[idêntica à perna direita do segundo corpo]]',
      },
      { key: 'conclusion', label: 'Conclusão', type: 'textarea', rows: 4, default: 'Causa da morte indeterminada. As impressões digitais coincidem com as de pessoa registrada como viva e em local diverso. Recomenda-se nova coleta e comparação por segundo perito.' },
      { key: 'seal', label: 'Selo do perito', type: 'text', default: 'IML · PERITO' },
    ],
    css: `
.lm{--ink:var(--u-ink,#1a1d1f);--paper:var(--u-paper,#e6ebe8);--acc:#35495c;background:var(--paper);color:var(--ink);font-family:var(--f-body);padding:40px 44px 36px;display:flex;flex-direction:column;gap:16px;overflow:hidden}
.lm-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px double var(--acc);padding-bottom:12px;gap:16px}
.lm-org{font-family:var(--f-title);font-weight:700;font-size:23px;line-height:26px;letter-spacing:.05em;color:var(--acc)}
.lm-dep{font-size:13px;line-height:18px}
.lm-no{font-family:'IBM Plex Mono',monospace;font-size:13px;text-align:right;white-space:nowrap}
.lm-title{font-family:var(--f-title);font-weight:600;font-size:36px;line-height:38px;letter-spacing:.02em}
.lm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border:1px solid var(--acc)}
.lm-grid div{padding:6px 10px 8px;border-right:1px solid var(--acc);border-bottom:1px solid var(--acc);font-family:'IBM Plex Mono',monospace;font-size:12.5px;line-height:17px}
.lm-grid div:nth-child(2n){border-right:0}
.lm-grid small{display:block;font-family:var(--f-title);font-size:12px;letter-spacing:.04em;color:var(--acc);margin-bottom:1px}
.lm-mid{display:flex;gap:26px}
.lm-fig{flex:0 0 226px;display:flex;gap:8px;color:var(--acc);border:1px solid var(--acc);padding:10px 8px 6px}
.lm-fig figure{margin:0;flex:1 1 0}
.lm-fig figcaption{text-align:center;font-family:var(--f-title);font-size:12px;letter-spacing:.06em}
.lm-fig svg{width:100%;height:auto;display:block}
.lm-list{flex:1 1 auto;margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:9px;font-size:14px;line-height:20px}
.lm-list li{display:flex;gap:10px}
.lm-n{flex:0 0 22px;height:22px;border-radius:50%;background:var(--acc);color:var(--paper);font-family:'IBM Plex Mono',monospace;font-size:12px;display:grid;place-items:center;margin-top:1px}
.lm-h{font-family:var(--f-title);font-weight:600;font-size:16px;letter-spacing:.06em;color:var(--acc);margin-bottom:4px}
.lm-concl{border:1px solid var(--acc);padding:10px 14px 12px;font-size:14.5px;line-height:22px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 21px,color-mix(in srgb,var(--acc),transparent 70%) 21px,color-mix(in srgb,var(--acc),transparent 70%) 22px);background-position:0 11px}
.lm-sign{display:flex;justify-content:space-between;align-items:flex-end;margin-top:auto;font-size:13px}
.lm-sig{font-family:var(--f-hand);font-size:34px;line-height:34px}
.lm-seal{position:absolute;right:60px;bottom:96px;width:112px;height:112px;border:3px solid #35495c;border-radius:50%;display:grid;place-items:center;text-align:center;font-family:var(--f-title);font-weight:700;font-size:18px;letter-spacing:.08em;color:#35495c;opacity:.75;transform:rotate(-12deg);mix-blend-mode:multiply;padding:0 14px;line-height:20px}
`,
    render(v, h) {
      const items = H.lines(v.findings);
      const marks = items.slice(0, SLOTS.length).map((_, i) => `<g><circle cx="${SLOTS[i][0]}" cy="${SLOTS[i][1]}" r="7.5" fill="#35495c"/><text x="${SLOTS[i][0]}" y="${SLOTS[i][1] + 3.6}" text-anchor="middle" font-size="9.5" font-family="IBM Plex Mono, monospace" fill="#e6ebe8">${i + 1}</text></g>`).join('');
      const list = items.map((t, i) => {
        const k = t.indexOf(':');
        const head = k > 0 && k < 30 ? `<b>${h.t(t.slice(0, k))}:</b>` + h.rt(t.slice(k + 1)) : h.rt(t);
        return `<li><span class="lm-n">${i + 1}</span><span>${head}</span></li>`;
      }).join('');
      return `<div class="tpl lm">
  ${h.fx()}
  <div data-layer="content" style="display:contents">
  <div class="lm-head"><div><div class="lm-org">${h.t(v.institution)}</div><div class="lm-dep">${h.t(v.department)}</div></div><div class="lm-no">LAUDO ${h.t(v.laudoNumber)}<br>CASO ${h.t(v.caseNumber)}</div></div>
  <div class="lm-title">Laudo de exame cadavérico</div>
  <div class="lm-grid"><div><small>Examinado</small>${h.rt(v.subjectName)}</div><div><small>Perito</small>${h.t(v.examiner)}</div><div><small>Data</small>${h.t(v.examDate)}</div><div><small>Hora</small>${h.t(v.examTime)}</div></div>
  <div class="lm-mid">
    <div class="lm-fig"><figure><svg viewBox="0 0 100 260" role="img" aria-label="Figura corporal, frente">${figure(false)}${marks}</svg><figcaption>Frente</figcaption></figure><figure><svg viewBox="0 0 100 260" role="img" aria-label="Figura corporal, costas">${figure(true)}</svg><figcaption>Costas</figcaption></figure></div>
    <div style="flex:1 1 auto"><div class="lm-h">Achados</div><ol class="lm-list" style="padding:0">${list}</ol></div>
  </div>
  <div><div class="lm-h">Conclusão</div><div class="lm-concl">${h.rt(v.conclusion)}</div></div>
  <div class="lm-sign"><div><div class="lm-sig">${h.t((v.examiner || '').split('—')[0].trim())}</div><div>${h.t(v.examiner)}</div></div><div>Este laudo tem 1 página.</div></div>
  </div>
  ${v.seal ? `<div class="lm-seal" data-layer="stamps">${h.t(v.seal)}</div>` : ''}
</div>`;
    },
  });
})();

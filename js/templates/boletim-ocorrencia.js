// Boletim de ocorrência — formulário contínuo zebrado, furos de tração, texto digitado em azul-carbono.
(function () {
  window.TEMPLATES.push({
    id: 'boletim-ocorrencia', name: 'Boletim de ocorrência', category: 'Polícia',
    width: 700, height: 980, bleed: 0, paper: '#f7f9ef', ink: '#1f2f99', wear: 38,
    fonts: { body: 'Courier Prime', hand: 'Caveat', title: 'Barlow Condensed' },
    usesFonts: [],
    fields: [
      { key: 'orgName', label: 'Secretaria', type: 'text', default: 'SECRETARIA DE SEGURANÇA PÚBLICA' },
      { key: 'orgSub', label: 'Unidade (cabeçalho)', type: 'text', default: 'POLÍCIA CIVIL — 14º DISTRITO POLICIAL' },
      { key: 'orgLine', label: 'Linha do plantão', type: 'text', default: 'Vila Norte · plantão de desaparecimentos' },
      { key: 'boNumber', label: 'Nº do boletim', type: 'text', default: '0417/26' },
      { key: 'registeredAt', label: 'Registrado em', type: 'text', default: '04/09/2026 06:12' },
      { key: 'unit', label: 'Unidade', type: 'text', default: '14º DP — Vila Norte' },
      { key: 'nature', label: 'Natureza da ocorrência', type: 'text', default: 'Desaparecimento de pessoa' },
      { key: 'date', label: 'Data do fato', type: 'text', default: '03/09/2026' },
      { key: 'time', label: 'Hora', type: 'text', default: '23:40 aprox.' },
      { key: 'location', label: 'Local do fato', type: 'text', default: 'Rua das Acácias, 220 — Vila Norte (residência, 2 pavimentos)' },
      { key: 'communicant', label: 'Comunicante', type: 'text', default: 'Elisa Marques Vieira, 34 anos, vizinha (nº 218)' },
      { key: 'victim', label: 'Desaparecido', type: 'text', default: '~~Roberto Almeida Dias~~, 52 anos', hint: 'Use ~~ ~~ para tarjar o nome.' },
      {
        key: 'narrative', label: 'Histórico', type: 'textarea', rows: 10,
        default: 'A comunicante compareceu a esta unidade às 06h12 e relata que, na noite de 03/09, por volta das 23h40, ouviu móveis sendo arrastados na residência vizinha (nº 220), onde mora sozinho o Sr. ~~Roberto Almeida Dias~~. Afirma tê-lo visto na janela do segundo andar, “parado, de costas, sem se mexer”.\n\nMinutos depois, o Sr. Roberto a chamou pelo nome, da calçada em frente à sua porta. A comunicante declara que, no mesmo instante, a voz dele ainda vinha de dentro da casa.\n\nInforma que o Sr. Roberto ~~não possui irmãos~~. Ainda assim, descreve dois homens idênticos, um na janela e outro na calçada. Registro encaminhado à equipe de investigações para diligências.',
      },
      { key: 'measures', label: 'Providências', type: 'textarea', rows: 3, markup: false, default: 'Local isolado às 07h40. Equipe de investigações acionada. Comunicante deve permanecer à disposição.' },
      { key: 'signComm', label: 'Assinatura do comunicante', type: 'text', default: 'E. Vieira' },
      { key: 'signClerk', label: 'Escrivão', type: 'text', default: 'Esc. Pol. M. Tavares · mat. 48.213' },
      { key: 'stamp', label: 'Carimbo', type: 'text', default: 'EM ABERTO' },
      { key: 'note', label: 'Anotação à mão (rodapé)', type: 'text', default: 'mora sozinho. conferir com o síndico' },
      { key: 'uvText', label: 'Tinta UV (camada oculta)', type: 'text', default: 'NINGUÉM ENTROU. NINGUÉM SAIU. HAVIA DOIS.' },
      { key: 'photo', label: 'Foto anexa (canto superior)', type: 'image' },
      { key: 'photoCap', label: 'Legenda da foto', type: 'text', default: 'nº 220 — 23h41' },
    ],
    css: `
.bo{--ink:var(--u-ink,#1f2f99);--paper:var(--u-paper,#f7f9ef);--form:#3b5a50;--rule:#86a094;
  --band:color-mix(in srgb,var(--paper),#8fb88a 24%);
  background-color:var(--paper);font-family:var(--f-body);color:var(--ink);overflow:hidden}
.bo-bars{position:absolute;left:38px;right:38px;top:0;bottom:0;background-image:repeating-linear-gradient(to bottom,var(--paper) 0,var(--paper) 72px,var(--band) 72px,var(--band) 144px)}
.bo-strip{position:absolute;top:0;bottom:0;width:38px;background-color:color-mix(in srgb,var(--paper),#c9c9b8 40%);
  background-image:radial-gradient(circle at 19px 12px,#26261f 0,#26261f 5.5px,rgba(0,0,0,.28) 5.5px,rgba(0,0,0,.28) 7px,transparent 7.5px);background-size:38px 24px}
.bo-strip.l{left:0;border-right:1.5px dashed #aab5a0}.bo-strip.r{right:0;border-left:1.5px dashed #aab5a0}
.bo-main{position:absolute;left:38px;right:38px;top:0;bottom:0;padding:22px 28px 0;display:flex;flex-direction:column;gap:9px}
.bo-lab{font-family:var(--f-title);color:var(--form);font-size:11.5px;letter-spacing:.04em;line-height:14px}
.bo-val{font-size:13.5px;line-height:19px;color:var(--ink);text-shadow:.6px .3px 0 color-mix(in srgb,var(--ink),transparent 55%)}
.bo-org{display:flex;flex-direction:column;gap:1px;width:400px}
.bo-org .bo-lab{font-size:13px;font-weight:600;letter-spacing:.08em}
.bo-title{font-family:var(--f-title);font-weight:700;font-size:46px;line-height:46px;color:var(--ink);text-shadow:1px 0 0 color-mix(in srgb,var(--ink),transparent 45%),-.5px .5px 0 color-mix(in srgb,var(--ink),transparent 75%)}
.bo-sec{display:flex;align-items:center;gap:8px;margin-bottom:-2px}
.bo-num{width:18px;height:18px;background:var(--form);color:var(--paper);font-family:var(--f-title);font-weight:600;font-size:12px;display:flex;align-items:center;justify-content:center}
.bo-sec-t{font-family:var(--f-title);font-weight:600;font-size:13px;letter-spacing:.06em;color:var(--form)}
.bo-grid{display:grid;border-top:1px solid var(--rule);border-left:1px solid var(--rule);background:color-mix(in srgb,var(--paper),transparent 28%)}
.bo-cell{padding:5px 8px 6px;border-right:1px solid var(--rule);border-bottom:1px solid var(--rule);min-width:0}
.bo-narr{margin:0 0 9px;font-size:13px;line-height:21px;white-space:pre-line;color:var(--ink);text-shadow:.6px .3px 0 color-mix(in srgb,var(--ink),transparent 55%)}
.bo-sign{font-family:var(--f-hand);font-weight:700;font-size:22px;line-height:20px;color:var(--ink)}
.bo-stamp{position:absolute;left:330px;top:20px;transform:rotate(-7deg);border:3px solid #b3261e;border-radius:4px;padding:2px 12px 0;font-family:var(--f-title);font-weight:700;font-size:30px;line-height:34px;letter-spacing:.1em;color:#b3261e;mix-blend-mode:multiply;opacity:.88}
.bo-note{position:absolute;left:92px;bottom:52px;transform:rotate(-2deg);font-family:var(--f-hand);font-weight:700;font-size:25px;line-height:26px;color:var(--note,#b3261e)}
.bo-note svg{display:block}
.bo-uv{position:absolute;right:66px;bottom:18px;width:300px;text-align:right;transform:rotate(-1.5deg);font-family:var(--f-hand);font-size:25px;line-height:27px;letter-spacing:.03em;color:#6a3dff;text-shadow:0 0 8px rgba(122,77,255,.85),0 0 2px #fff}
.bo-photo{position:absolute;right:56px;top:16px;width:116px;height:142px;transform:rotate(3deg);background:#f5f3ea;padding:6px 6px 24px;box-shadow:0 2px 6px rgba(0,0,0,.35)}
.bo-photo>img{width:100%;height:100%;object-fit:cover;display:block}
.bo-scene{position:relative;width:100%;height:100%;overflow:hidden;background:linear-gradient(#1d2532,#0d1119)}
.bo-scene i{position:absolute;display:block}
.bo-pcap{position:absolute;left:0;right:0;bottom:3px;text-align:center;font-family:var(--f-hand);font-weight:700;font-size:15px;line-height:17px;color:#222}
.bo-tape{position:absolute;left:38px;top:-9px;width:40px;height:16px;background:rgba(235,230,200,.72);transform:rotate(-4deg)}
`,
    render(v, h) {
      const photo = v.photo && H.ctx.imgs[v.photo]
        ? `<img src="${H.ctx.imgs[v.photo]}" alt="">`
        : `<div class="bo-scene"><i style="left:30px;top:22px;width:44px;height:58px;background:linear-gradient(#f4c66a,#c9822a);box-shadow:0 0 14px rgba(244,198,106,.55)"></i><i style="left:46px;top:42px;width:12px;height:12px;border-radius:50%;background:#14100c"></i><i style="left:39px;top:55px;width:26px;height:25px;border-radius:13px 13px 0 0;background:#14100c"></i><i style="left:10px;top:86px;width:8px;height:24px;border-radius:4px 4px 0 0;background:rgba(255,255,255,.28)"></i></div>`;
      const narr = String(v.narrative || '').split(/\n{2,}/).map((p) => `<p class="bo-narr">${h.rt(p)}</p>`).join('');
      const cell = (lab, val, extra) => `<div class="bo-cell"${extra || ''}><div class="bo-lab">${h.t(lab)}</div><div class="bo-val">${val}</div></div>`;
      return `<div class="tpl bo">
  <div class="bo-bars"></div>
  <div class="bo-strip l" data-layer="paper"></div><div class="bo-strip r" data-layer="paper"></div>
  ${h.fx()}
  <div class="bo-main" data-layer="content">
    <div class="bo-org"><div class="bo-lab">${h.t(v.orgName)}</div><div class="bo-lab">${h.t(v.orgSub)}</div><div class="bo-lab" style="font-size:12px;font-weight:400;letter-spacing:.04em">${h.t(v.orgLine)}</div></div>
    <div style="display:flex;flex-direction:column;gap:2px;width:400px"><div class="bo-title">Boletim de Ocorrência</div><div class="bo-val">Nº ${h.t(v.boNumber)} · 2ª via — Delegacia</div></div>
    <div><div class="bo-sec"><span class="bo-num">1</span><span class="bo-sec-t">Registro</span></div>
      <div class="bo-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${cell('Nº do boletim', h.t(v.boNumber))}${cell('Registrado em', h.t(v.registeredAt))}${cell('Unidade', h.t(v.unit))}</div></div>
    <div><div class="bo-sec"><span class="bo-num">2</span><span class="bo-sec-t">Fato</span></div>
      <div class="bo-grid" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr) minmax(0,1fr)">${cell('Natureza da ocorrência', h.t(v.nature))}${cell('Data do fato', h.t(v.date))}${cell('Hora', h.t(v.time))}${cell('Local do fato', h.t(v.location), ' style="grid-column:1 / span 3"')}</div></div>
    <div><div class="bo-sec"><span class="bo-num">3</span><span class="bo-sec-t">Envolvidos</span></div>
      <div class="bo-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${cell('Comunicante', h.t(v.communicant))}${cell('Desaparecido', h.rt(v.victim))}</div></div>
    <div><div class="bo-sec"><span class="bo-num">4</span><span class="bo-sec-t">Histórico</span></div>
      <div class="bo-grid" style="grid-template-columns:minmax(0,1fr)"><div class="bo-cell" style="padding:8px 12px 2px">${narr}</div></div></div>
    <div><div class="bo-sec"><span class="bo-num">5</span><span class="bo-sec-t">Providências e assinaturas</span></div>
      <div class="bo-grid" style="grid-template-columns:minmax(0,3fr) minmax(0,2fr)">
        <div class="bo-cell" style="min-height:82px"><div class="bo-lab">Providências</div><div class="bo-val">${h.rt(v.measures)}</div></div>
        <div class="bo-cell" style="display:flex;flex-direction:column;gap:10px;min-height:82px">
          <div><div class="bo-sign">${h.t(v.signComm)}</div><div class="bo-lab" style="border-top:1px solid var(--rule);padding-top:1px">Comunicante</div></div>
          <div><div class="bo-val" style="font-size:12px;line-height:16px">${h.t(v.signClerk)}</div><div class="bo-lab" style="border-top:1px solid var(--rule);padding-top:1px">Escrivão</div></div>
        </div></div></div>
  </div>
  ${v.note ? `<div class="bo-note" data-layer="notes">${h.t(v.note)}<svg width="270" height="10" viewBox="0 0 270 10" aria-hidden="true"><path d="M2 6 C 14 1, 22 9, 34 5 S 56 2, 68 6 S 92 9, 104 4 S 128 2, 140 6 S 164 9, 176 4 S 200 2, 212 6 S 236 9, 248 5 S 262 3, 268 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>` : ''}
  ${v.stamp ? `<div class="bo-stamp" data-layer="stamps">${h.t(v.stamp)}</div>` : ''}
  <div class="bo-photo" data-layer="media">${photo}<div class="bo-pcap">${h.t(v.photoCap)}</div><i class="bo-tape"></i></div>
  ${v.uvText ? `<div class="bo-uv" data-layer="uv">${h.t(v.uvText)}</div>` : ''}
</div>`;
    },
  });
})();

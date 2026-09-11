// Cada arquivo de template se auto-registra em window.TEMPLATES.
// Pra adicionar um template novo: copie este arquivo, mude o "id", os
// "fields" e a função "render", crie o CSS correspondente em
// css/templates/<id>.css, e inclua os dois <link>/<script> no index.html.
(function () {
  const { escapeHtml, parseMarkup } = window.HandoutUtils;

  window.TEMPLATES = window.TEMPLATES || [];

  window.TEMPLATES.push({
    id: 'boletim-ocorrencia',
    name: 'Boletim de Ocorrência',
    category: 'policial',

    fields: [
      { key: 'caseNumber', label: 'Número do caso (aba)', type: 'text', default: 'CASO Nº 0417 — EM ABERTO' },
      { key: 'orgName', label: 'Órgão', type: 'text', default: 'DELEGACIA DE HOMICÍDIOS' },
      { key: 'orgSub', label: 'Divisão', type: 'text', default: 'DIVISÃO DE INVESTIGAÇÕES ESPECIAIS' },
      { key: 'boNumber', label: 'Nº do B.O.', type: 'text', default: 'B.O. Nº 0417/26' },
      { key: 'circunscricao', label: 'Circunscrição', type: 'text', default: '14ª CIRCUNSCRIÇÃO' },
      { key: 'date', label: 'Data do fato', type: 'text', default: '03 / 09 / 2026' },
      { key: 'time', label: 'Horário', type: 'text', default: '23:40h aprox.' },
      { key: 'location', label: 'Local', type: 'text', default: 'Rua das Acácias, 218 — bairro Vila Norte' },
      { key: 'nature', label: 'Natureza', type: 'text', default: 'Desaparecimento / suspeita de crime' },
      { key: 'communicant', label: 'Comunicante', type: 'text', default: 'Elisa Marques Vieira, 34 anos, vizinha' },
      {
        key: 'narrative',
        label: 'Relato (use ~~texto~~ pra redigir, {{nota}} pra anotação de margem)',
        type: 'textarea',
        default:
          'A comunicante afirma não ver o vizinho, Sr. ~~Roberto Dantas Filho~~, desde a noite de quinta-feira. Relata ter ouvido "um barulho de móvel sendo arrastado" por volta das 23h30, seguido de silêncio.\n\nPorta dos fundos encontrada entreaberta. Sem sinais de arrombamento na fachada. ~~Manchas não identificadas~~ no batente foram fotografadas e encaminhadas à perícia.{{verificar câmeras do 220}}',
      },
      { key: 'registeredBy', label: 'Registrado por', type: 'text', default: 'Insp. C. Aldana — mat. 5521' },
      { key: 'pageInfo', label: 'Folhas', type: 'text', default: 'fls. 01/03' },
      { key: 'stampText', label: 'Texto do carimbo', type: 'textarea', default: 'CONFIDENCIAL\nUSO INTERNO' },
      { key: 'accentColor', label: 'Cor do carimbo/redação', type: 'color', default: '#a32020' },
    ],

    render(v) {
      const e = escapeHtml;
      const narrative = parseMarkup(e(v.narrative), 'bo-redacted', 'bo-margin-note');

      return `
        <div class="bo-folder" style="--accent:${e(v.accentColor)}">
          <div class="bo-tab">${e(v.caseNumber)}</div>
          <div class="bo-doc">
            <div class="bo-header">
              <div class="bo-org">
                ${e(v.orgName)}
                <small>${e(v.orgSub)}</small>
              </div>
              <div class="bo-number">${e(v.boNumber)}\n${e(v.circunscricao)}</div>
            </div>

            <h1 class="bo-title">Boletim de Ocorrência</h1>

            <div class="bo-field-grid">
              <div class="bo-field"><label>Data do fato</label><div class="bo-value">${e(v.date)}</div></div>
              <div class="bo-field"><label>Horário</label><div class="bo-value">${e(v.time)}</div></div>
              <div class="bo-field"><label>Local</label><div class="bo-value">${e(v.location)}</div></div>
              <div class="bo-field"><label>Natureza</label><div class="bo-value">${e(v.nature)}</div></div>
            </div>

            <div class="bo-field-grid full">
              <div class="bo-field"><label>Comunicante</label><div class="bo-value">${e(v.communicant)}</div></div>
            </div>

            <div class="bo-field-grid full">
              <div class="bo-field" style="border-bottom:none;padding-bottom:0">
                <label>Relato</label>
                <div class="bo-narrative">${narrative}</div>
              </div>
            </div>

            <div class="bo-footer">
              <span>Registrado por: ${e(v.registeredBy)}</span>
              <span>${e(v.pageInfo)}</span>
            </div>

            <div class="bo-stamp">${e(v.stampText)}</div>
          </div>
        </div>
      `;
    },
  });
})();

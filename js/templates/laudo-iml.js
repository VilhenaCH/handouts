(function () {
  const { escapeHtml, parseMarkup } = window.HandoutUtils;
  const rt = (v) => parseMarkup(escapeHtml(v), 'iml-redacted', 'iml-margin-note');

  window.TEMPLATES = window.TEMPLATES || [];

  window.TEMPLATES.push({
    id: 'laudo-iml',
    name: 'Laudo do IML',
    category: 'perícia',

    fields: [
      { key: 'caseNumber', label: 'Número do caso (aba)', type: 'text', default: 'CASO Nº 0417 — EXAME PENDENTE' },
      { key: 'institution', label: 'Instituição', type: 'text', default: 'INSTITUTO MÉDICO LEGAL' },
      { key: 'department', label: 'Núcleo/Departamento', type: 'text', default: 'NÚCLEO DE PATOLOGIA FORENSE' },
      { key: 'laudoNumber', label: 'Nº do laudo', type: 'text', default: 'LAUDO Nº 0289-IML/26' },
      { key: 'examDate', label: 'Data do exame', type: 'text', default: '05/09/2026' },
      { key: 'examTime', label: 'Horário', type: 'text', default: '07:15h' },
      { key: 'subjectName', label: 'Identificação (use ~~texto~~ pra redigir)', type: 'text', default: '~~Roberto Dantas Filho~~, sexo masculino, 41 anos' },
      { key: 'examiner', label: 'Perito responsável', type: 'text', default: 'Dra. Helena Brito — legista, CRM 44.812' },
      {
        key: 'observations',
        label: 'Exame / observações (~~texto~~ redige, {{nota}} anotação do perito)',
        type: 'textarea',
        default:
          'Corpo em estado de conservação compatível com óbito recente, aproximadamente 36 a 48 horas. ~~Hematomas na região cervical~~ sugerem constrição manual anterior ao óbito.{{padrão não compatível com enforcamento}}\n\nAmostras de tecido encaminhadas ao setor de toxicologia. Aguarda-se resultado complementar.',
      },
      {
        key: 'conclusion',
        label: 'Conclusão',
        type: 'textarea',
        default: 'Causa da morte: asfixia mecânica por constrição do pescoço. Circunstâncias sob investigação — exame complementar solicitado.',
      },
      { key: 'accentColor', label: 'Cor institucional', type: 'color', default: '#35495c' },
    ],

    render(v) {
      const e = escapeHtml;
      return `
        <div class="iml-folder" style="--accent:${e(v.accentColor)}">
          <div class="iml-tab">${e(v.caseNumber)}</div>
          <div class="iml-doc">
            <div class="iml-band">
              <div>
                <div class="iml-institution">${e(v.institution)}</div>
                <div class="iml-department">${e(v.department)}</div>
              </div>
              <div class="iml-ref">${e(v.laudoNumber)}<br>${e(v.examDate)} · ${e(v.examTime)}</div>
            </div>

            <div class="iml-section">
              <h2>Identificação</h2>
              <p class="iml-text">${rt(v.subjectName)}</p>
            </div>

            <div class="iml-section">
              <h2>Exame</h2>
              <p class="iml-text">${rt(v.observations)}</p>
            </div>

            <div class="iml-conclusion">
              <h2>Conclusão</h2>
              <p class="iml-text">${rt(v.conclusion)}</p>
            </div>

            <div class="iml-footer">
              <span>${e(v.examiner)}</span>
            </div>

            <div class="iml-stamp">RESERVADO</div>
          </div>
        </div>
      `;
    },
  });
})();

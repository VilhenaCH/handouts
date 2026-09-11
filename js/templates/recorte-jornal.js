(function () {
  const { escapeHtml, parseMarkup } = window.HandoutUtils;
  const rt = (v) => parseMarkup(escapeHtml(v), 'nw-redacted', 'nw-margin-note');

  window.TEMPLATES = window.TEMPLATES || [];

  window.TEMPLATES.push({
    id: 'recorte-jornal',
    name: 'Recorte de Jornal',
    category: 'imprensa',

    fields: [
      { key: 'masthead', label: 'Nome do jornal', type: 'text', default: 'O CORREIO DA MANHÃ' },
      { key: 'dateline', label: 'Data/edição', type: 'text', default: 'Edição de 04 de setembro de 2026 — Seção Policial' },
      { key: 'headline', label: 'Manchete', type: 'text', default: 'Moradora relata desaparecimento de vizinho na Vila Norte' },
      { key: 'byline', label: 'Assinatura', type: 'text', default: 'Da redação' },
      {
        key: 'body',
        label: 'Corpo da matéria (~~texto~~ redige, {{nota}} anotação de investigador)',
        type: 'textarea',
        default:
          'A Delegacia de Homicídios confirmou a abertura de inquérito após denúncia de desaparecimento registrada na madrugada de quinta-feira. Segundo boletim de ocorrência, o último contato com a vítima teria sido por volta das 23h30.\n\nVizinhos relatam ter ouvido ruídos incomuns vindos da residência momentos antes. ~~Fontes ligadas à investigação~~ afirmam que peritos já estiveram no local e recolheram material para análise.{{checar identidade da fonte}}\n\nA polícia pede que testemunhas entrem em contato através do disque-denúncia.',
      },
      { key: 'accentColor', label: 'Cor de destaque', type: 'color', default: '#8b1a1a' },
    ],

    render(v) {
      const e = escapeHtml;
      return `
        <div class="nw-clip" style="--accent:${e(v.accentColor)}">
          <div class="nw-masthead">
            <span class="nw-masthead-name">${e(v.masthead)}</span>
            <span class="nw-dateline">${e(v.dateline)}</span>
          </div>
          <h1 class="nw-headline">${e(v.headline)}</h1>
          <div class="nw-byline">${e(v.byline)}</div>
          <div class="nw-body">${rt(v.body)}</div>
        </div>
      `;
    },
  });
})();

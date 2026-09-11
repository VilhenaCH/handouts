(function () {
  const { escapeHtml, parseMarkup } = window.HandoutUtils;
  const rt = (v) => parseMarkup(escapeHtml(v), 'fc-redacted', 'fc-margin-note');

  window.TEMPLATES = window.TEMPLATES || [];

  window.TEMPLATES.push({
    id: 'ficha-procurado',
    name: 'Ficha de Procurado/Desaparecido',
    category: 'policial',

    fields: [
      { key: 'stampWord', label: 'Palavra do carimbo', type: 'text', default: 'DESAPARECIDO' },
      { key: 'name', label: 'Nome', type: 'text', default: 'Roberto Dantas Filho' },
      { key: 'alias', label: 'Alcunha/apelido (opcional)', type: 'text', default: '' },
      { key: 'age', label: 'Idade', type: 'text', default: '41 anos' },
      { key: 'height', label: 'Altura', type: 'text', default: '1,78m' },
      { key: 'lastSeen', label: 'Última vez visto', type: 'text', default: 'Rua das Acácias, 218 — 03/09/2026, 23h30' },
      {
        key: 'notes',
        label: 'Observações (~~texto~~ redige, {{nota}} anotação)',
        type: 'textarea',
        default: 'Visto pela última vez usando jaqueta escura. Possui cicatriz na mão direita. ~~Histórico de disputas com vizinhos~~ sob apuração.{{checar antecedentes}}',
      },
      { key: 'contact', label: 'Contato', type: 'text', default: 'Disque-denúncia: 181' },
      { key: 'accentColor', label: 'Cor do carimbo', type: 'color', default: '#a32020' },
    ],

    render(v) {
      const e = escapeHtml;
      return `
        <div class="fc-card" style="--accent:${e(v.accentColor)}">
          <div class="fc-photo">
            <span>FOTO</span>
          </div>
          <div class="fc-body">
            <div class="fc-name">${e(v.name)}</div>
            ${v.alias ? `<div class="fc-alias">"${e(v.alias)}"</div>` : ''}

            <div class="fc-grid">
              <div><label>Idade</label><span>${e(v.age)}</span></div>
              <div><label>Altura</label><span>${e(v.height)}</span></div>
            </div>

            <div class="fc-field">
              <label>Última vez visto</label>
              <span>${e(v.lastSeen)}</span>
            </div>

            <div class="fc-field">
              <label>Observações</label>
              <p>${rt(v.notes)}</p>
            </div>

            <div class="fc-contact">${e(v.contact)}</div>
          </div>

          <div class="fc-stamp">${e(v.stampWord)}</div>
        </div>
      `;
    },
  });
})();

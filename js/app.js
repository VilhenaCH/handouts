(function () {
  const state = {
    templateId: window.TEMPLATES[0].id,
    valuesByTemplate: {},
  };

  // Inicializa valores default de cada template
  for (const t of window.TEMPLATES) {
    state.valuesByTemplate[t.id] = {};
    for (const f of t.fields) state.valuesByTemplate[t.id][f.key] = f.default;
  }

  const templateListEl = document.getElementById('template-list');
  const fieldPanelEl = document.getElementById('field-panel');
  const previewEl = document.getElementById('doc-preview');
  const exportBtn = document.getElementById('export-btn');

  function getActiveTemplate() {
    return window.TEMPLATES.find((t) => t.id === state.templateId);
  }

  function renderTemplateList() {
    templateListEl.innerHTML = '';
    for (const t of window.TEMPLATES) {
      const li = document.createElement('li');
      li.className = 'template-item' + (t.id === state.templateId ? ' active' : '');
      li.innerHTML = `${t.name}<span class="cat">${t.category}</span>`;
      li.addEventListener('click', () => {
        state.templateId = t.id;
        renderTemplateList();
        renderFieldPanel();
        renderPreview();
      });
      templateListEl.appendChild(li);
    }
  }

  function renderFieldPanel() {
    const t = getActiveTemplate();
    const values = state.valuesByTemplate[t.id];
    fieldPanelEl.innerHTML = '';

    for (const field of t.fields) {
      const wrapper = document.createElement('label');
      wrapper.className = 'field-row';

      const labelEl = document.createElement('span');
      labelEl.className = 'field-row-label';
      labelEl.textContent = field.label;
      wrapper.appendChild(labelEl);

      let inputEl;
      if (field.type === 'textarea') {
        inputEl = document.createElement('textarea');
        inputEl.rows = 7;
      } else if (field.type === 'color') {
        inputEl = document.createElement('input');
        inputEl.type = 'color';
        inputEl.className = 'field-color';
      } else {
        inputEl = document.createElement('input');
        inputEl.type = 'text';
      }
      inputEl.value = values[field.key];

      inputEl.addEventListener('input', (e) => {
        values[field.key] = e.target.value;
        renderPreview();
      });

      wrapper.appendChild(inputEl);
      fieldPanelEl.appendChild(wrapper);
    }
  }

  function renderPreview() {
    const t = getActiveTemplate();
    const values = state.valuesByTemplate[t.id];
    previewEl.innerHTML = t.render(values);
  }

  exportBtn.addEventListener('click', () => window.print());

  renderTemplateList();
  renderFieldPanel();
  renderPreview();
})();

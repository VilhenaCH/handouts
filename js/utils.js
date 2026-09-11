// Funções compartilhadas que qualquer template pode usar.
// Carregado antes dos arquivos de template — ver ordem no index.html.
window.HandoutUtils = (function () {

  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  // Converte "~~texto~~" em trecho redigido e "{{nota}}" em anotação de
  // margem manuscrita. Espera receber texto já escapado (escapeHtml).
  function parseMarkup(escapedText, redactedClass, marginClass) {
    return escapedText
      .replace(/~~(.+?)~~/g, (_, t) => `<span class="${redactedClass}">${t}</span>`)
      .replace(/\{\{(.+?)\}\}/g, (_, t) => `<span class="${marginClass}">${t}</span>`);
  }

  return { escapeHtml, parseMarkup };
})();

// Exportação PNG/PDF.
// Motor: modern-screenshot (SVG foreignObject) — o próprio navegador desenha o documento,
// então clip-path, colunas, filtros e blend modes saem iguais ao que se vê na tela.
// As fontes vão embutidas em base64 (fonts/embed/*.js), sem fetch: funciona em file://.
// O arquivo final é sempre uma IMAGEM: texto sob tarja NUNCA vai como texto selecionável.
window.Exporter = (function () {
  const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Falha ao carregar ' + src));
      document.head.appendChild(s);
    });
  }

  async function fontCss(families) {
    window.FONT_EMBED = window.FONT_EMBED || {};
    const todo = [...new Set(families)].filter((f) => f && !window.FONT_EMBED[f]);
    await Promise.all(todo.map((f) => loadScript('fonts/embed/' + slug(f) + '.js').catch(() => null)));
    return [...new Set(families)].map((f) => window.FONT_EMBED[f] || '').join('\n');
  }

  // Desenha uma cópia do documento em escala 1, fora da tela, e devolve um canvas.
  async function toCanvas(sheet, { scale = 2, bg = null, families = [] }) {
    if (!window.modernScreenshot) throw new Error('A biblioteca de exportação não carregou. Recarregue a página.');
    const css = await fontCss(families);
    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:fixed;left:-30000px;top:0;pointer-events:none;';
    const clone = sheet.cloneNode(true);
    clone.querySelectorAll('[data-ui]').forEach((n) => n.remove());
    clone.querySelectorAll('.sel').forEach((n) => n.classList.remove('sel'));
    clone.style.transform = 'none';
    clone.style.margin = '0';
    host.appendChild(clone);
    document.body.appendChild(host);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      await Promise.all([...clone.querySelectorAll('img')].map((i) => (i.complete ? null : i.decode().catch(() => null))));
      const w = clone.offsetWidth, h = clone.offsetHeight;
      const opts = {
        scale, width: w, height: h, backgroundColor: bg, timeout: 30000,
        font: css ? { cssText: css } : false,
        style: { transform: 'none', margin: '0' },
      };
      // Primeira renderização em miniatura "aquece" fontes e imagens (Safari e Firefox
      // costumam devolver a primeira imagem incompleta).
      await window.modernScreenshot.domToCanvas(clone, Object.assign({}, opts, { scale: 0.1 }));
      const canvas = await window.modernScreenshot.domToCanvas(clone, opts);
      return { canvas, w, h };
    } finally { host.remove(); }
  }

  const toBlob = (canvas, type, q) => new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('O navegador não conseguiu gerar o arquivo. Tente uma escala menor (1× ou 2×).'))), type, q);
  });

  async function png(sheet, { scale, families }) {
    const { canvas, w, h } = await toCanvas(sheet, { scale, families });
    return { blob: await toBlob(canvas, 'image/png'), w, h, ext: 'png' };
  }

  // PDF: "orig" = uma página do tamanho do documento; "a4" = A4 centralizado, documento alto vira várias páginas.
  async function pdf(sheet, { scale, families, page }) {
    if (!window.jspdf) throw new Error('A biblioteca de PDF não carregou. Recarregue a página.');
    const { canvas, w, h } = await toCanvas(sheet, { scale, bg: '#ffffff', families });
    const { jsPDF } = window.jspdf;
    const k = 0.75; // px → pt
    const wpt = w * k, hpt = h * k;
    let doc;
    if (page === 'a4') {
      const PW = 595.28, PH = 841.89, M = 28;
      const aw = PW - 2 * M, ah = PH - 2 * M;
      const s = Math.min(aw / wpt, 1.5);
      const dw = wpt * s, dh = hpt * s, x = (PW - dw) / 2;
      doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
      if (dh <= ah) {
        doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', x, M, dw, dh);
      } else {
        const pxPerPt = canvas.width / wpt;
        const sliceH = Math.floor((ah / s) * pxPerPt);
        let y0 = 0, first = true;
        while (y0 < canvas.height) {
          const hh = Math.min(sliceH, canvas.height - y0);
          const c = document.createElement('canvas');
          c.width = canvas.width; c.height = hh;
          const cx = c.getContext('2d');
          cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, hh);
          cx.drawImage(canvas, 0, y0, canvas.width, hh, 0, 0, canvas.width, hh);
          if (!first) doc.addPage('a4');
          doc.addImage(c.toDataURL('image/jpeg', 0.92), 'JPEG', x, M, dw, (hh / pxPerPt) * s);
          y0 += hh; first = false;
        }
      }
    } else {
      doc = new jsPDF({ unit: 'pt', format: [wpt, hpt], orientation: wpt > hpt ? 'l' : 'p', compress: true });
      doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, wpt, hpt);
    }
    return { blob: doc.output('blob'), w, h, ext: 'pdf', pages: doc.getNumberOfPages() };
  }

  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }

  async function share(blob, name) {
    const file = new File([blob], name, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: name });
      return true;
    }
    return false;
  }

  return { png, pdf, download, share, slug };
})();

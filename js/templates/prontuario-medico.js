// Prontuário — ficha hospitalar azul-pálido com grade; gráfico de temperatura (SVG a partir dos valores) e rabiscos do médico.
(function () {
  window.TEMPLATES.push({
    id: 'prontuario-medico', name: 'Prontuário', category: 'Perícia',
    width: 700, height: 980, bleed: 0, paper: '#eaf1f4', ink: '#17323f', wear: 30,
    fonts: { body: 'Public Sans', hand: 'Caveat', title: 'Barlow Condensed' },
    usesFonts: ['IBM Plex Mono'],
    fields: [
      { key: 'hospital', label: 'Hospital', type: 'text', default: 'HOSPITAL REGIONAL SANTA CLARA' },
      { key: 'sector', label: 'Setor', type: 'text', default: 'Ala B · Observação · Leito 12' },
      { key: 'record', label: 'Prontuário nº', type: 'text', default: '88.210-4' },
      { key: 'patient', label: 'Paciente', type: 'text', default: 'Roberto A. Dias, 52 anos' },
      { key: 'admission', label: 'Admissão', type: 'text', default: '04/09/2026 · 01:17' },
      { key: 'complaint', label: 'Queixa / diagnóstico', type: 'textarea', rows: 4, default: 'Trazido por desconhecido, sem documentos. Orientado, afebril na triagem. Relata “ter saído de casa e continuar lá”. Exame neurológico sem alterações.' },
      { key: 'temps', label: 'Temperatura (°C, separadas por vírgula)', type: 'text', default: '36.8, 37.1, 38.6, 36.2, 35.1, 35.1', hint: 'Um valor a cada 4 h. O gráfico se ajusta sozinho.' },
      { key: 'vitals', label: 'Sinais vitais (uma linha: horário | PA | FC | SpO₂)', type: 'textarea', rows: 4, markup: false, default: '02:00 | 120x80 | 78 | 98%\n06:00 | 118x76 | 80 | 97%\n10:00 | 0x0 | 0 | --\n14:00 | 120x80 | 78 | 98%' },
      { key: 'orders', label: 'Prescrição / conduta', type: 'textarea', rows: 4, default: 'Observação contínua.\nNão administrar sedativos.\nManter acompanhante fora do quarto durante a madrugada.' },
      { key: 'doctor', label: 'Anotação do médico (à mão)', type: 'text', default: 'paciente chama por “ele” desde a admissão. quem?' },
      { key: 'seal', label: 'Carimbo', type: 'text', default: 'OBSERVAÇÃO' },
    ],
    css: `
.pr{--ink:var(--u-ink,#17323f);--paper:var(--u-paper,#eaf1f4);--grid:#9fc0cc;background-color:var(--paper);color:var(--ink);font-family:var(--f-body);padding:38px 42px;display:flex;flex-direction:column;gap:14px;overflow:hidden;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:20px 20px;background-position:-1px -1px}
.pr>div{position:relative}
.pr-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;background:var(--paper);border:2px solid var(--ink);padding:10px 14px}
.pr-hos{font-family:var(--f-title);font-weight:700;font-size:26px;line-height:28px;letter-spacing:.04em}
.pr-sub{font-size:13px;line-height:18px}
.pr-rec{font-family:'IBM Plex Mono',monospace;font-size:13px;text-align:right;white-space:nowrap}
.pr-box{background:color-mix(in srgb,var(--paper),#fff 35%);border:1.5px solid var(--ink);padding:8px 12px 10px}
.pr-h{font-family:var(--f-title);font-weight:600;font-size:15px;letter-spacing:.06em;margin-bottom:4px;border-bottom:1px solid var(--ink)}
.pr-2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}
.pr-txt{font-size:13.5px;line-height:20px;white-space:pre-line}
.pr-vt{width:100%;border-collapse:collapse;font-family:'IBM Plex Mono',monospace;font-size:12.5px}
.pr-vt td,.pr-vt th{border:1px solid var(--ink);padding:3px 6px;text-align:left}
.pr-vt th{font-family:var(--f-title);font-weight:600;letter-spacing:.05em;font-size:12px}
.pr-chart svg{width:100%;height:auto;display:block}
.pr-evo{flex:1 1 auto;min-height:140px;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 33px,color-mix(in srgb,var(--ink),transparent 70%) 33px,color-mix(in srgb,var(--ink),transparent 70%) 34px);background-position:0 8px}
.pr-doc{font-family:var(--f-hand);font-size:29px;line-height:34px;transform:rotate(-1.2deg);color:#26308a;margin:2px 0 0 4px}
.pr>.pr-seal{position:absolute;right:56px;bottom:74px;transform:rotate(8deg);border:3px solid #26308a;color:#26308a;padding:2px 14px 0;font-family:var(--f-title);font-weight:700;font-size:28px;letter-spacing:.12em;opacity:.78;mix-blend-mode:multiply}
`,
    render(v, h) {
      const temps = String(v.temps || '').split(/[,;\s]+/).map(parseFloat).filter((n) => !isNaN(n));
      const W = 300, Hh = 130, pad = 22;
      const lo = Math.min(35, ...(temps.length ? temps : [35])), hi = Math.max(39, ...(temps.length ? temps : [39]));
      const X = (i) => pad + (temps.length > 1 ? (i * (W - pad * 1.6)) / (temps.length - 1) : 0);
      const Y = (t) => 10 + (1 - (t - lo) / (hi - lo)) * (Hh - 34);
      const grid = [];
      for (let t = Math.ceil(lo); t <= hi; t++) grid.push(`<line x1="${pad}" x2="${W - 8}" y1="${Y(t)}" y2="${Y(t)}" stroke="#9fc0cc" stroke-width="${t === 37 ? 1.6 : 0.8}"/><text x="${pad - 4}" y="${Y(t) + 3}" font-size="8" text-anchor="end" fill="#17323f" font-family="IBM Plex Mono, monospace">${t}</text>`);
      const pts = temps.map((t, i) => `${X(i).toFixed(1)},${Y(t).toFixed(1)}`).join(' ');
      const dots = temps.map((t, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(t).toFixed(1)}" r="2.6" fill="#17323f"/>`).join('');
      const hrs = temps.map((_, i) => `<text x="${X(i).toFixed(1)}" y="${Hh - 6}" font-size="8" text-anchor="middle" fill="#17323f" font-family="IBM Plex Mono, monospace">${String((i * 4) % 24).padStart(2, '0')}h</text>`).join('');
      const vit = H.lines(v.vitals).map((l) => '<tr>' + l.split('|').slice(0, 4).map((c) => `<td>${h.t(c.trim())}</td>`).join('') + '</tr>').join('');
      return `<div class="tpl pr">
  ${h.fx()}
  <div data-layer="content" style="display:contents">
  <div class="pr-head"><div><div class="pr-hos">${h.t(v.hospital)}</div><div class="pr-sub">${h.t(v.sector)}</div></div><div class="pr-rec">PRONTUÁRIO<br>${h.t(v.record)}</div></div>
  <div class="pr-2"><div class="pr-box"><div class="pr-h">Paciente</div><div class="pr-txt">${h.rt(v.patient)}</div></div><div class="pr-box"><div class="pr-h">Admissão</div><div class="pr-txt">${h.t(v.admission)}</div></div></div>
  <div class="pr-box"><div class="pr-h">Queixa e diagnóstico</div><div class="pr-txt">${h.rt(v.complaint)}</div></div>
  <div class="pr-2">
    <div class="pr-box pr-chart"><div class="pr-h">Temperatura (°C)</div><svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Gráfico de temperatura">${grid.join('')}<polyline points="${pts}" fill="none" stroke="#17323f" stroke-width="1.8" stroke-linejoin="round"/>${dots}${hrs}</svg></div>
    <div class="pr-box"><div class="pr-h">Sinais vitais</div><table class="pr-vt"><tr><th>Hora</th><th>PA</th><th>FC</th><th>SpO₂</th></tr>${vit}</table></div>
  </div>
  <div class="pr-box"><div class="pr-h">Prescrição e conduta</div><div class="pr-txt">${h.rt(v.orders)}</div></div>
  <div class="pr-box pr-evo"><div class="pr-h">Evolução médica</div><div class="pr-doc" data-layer="notes">${h.t(v.doctor)}</div></div>
  </div>
  ${v.seal ? `<div class="pr-seal" data-layer="stamps">${h.t(v.seal)}</div>` : ''}
</div>`;
    },
  });
})();

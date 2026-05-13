// js/informe/builder.js — compone secciones HTML + abre ventana print-ready
// Cada sección es una función que devuelve HTML string.
// API: INF.register('id', fn(atleta, ev)→html); INF.generate([...ids], atleta)

(function(){
'use strict';

const INF = window.INF = {
  _sections: {},

  register(id, fn){
    this._sections[id] = fn;
  },

  // catálogo descripciones para selector
  CATALOG: {
    'portada':              { label:'Portada', icon:'🎯', always:true },
    'intro':                { label:'Evaluaciones realizadas (intro)', icon:'📋' },
    'calidad-movimiento':   { label:'Calidad de Movimiento (OHS + SLS)', icon:'🎬' },
    'movilidad-tobillo':    { label:'Movilidad Tobillo (Lunge)', icon:'🦶' },
    'movilidad-cadera':     { label:'Movilidad Cadera (TROM)', icon:'🦵' },
    'movilidad-hombro':     { label:'Movilidad Hombro (RI/RE/TROM)', icon:'💪' },
    'movilidad-toracica':   { label:'Movilidad Torácica', icon:'🌀' },
    'y-balance':            { label:'Y-Balance Test', icon:'⚖️' },
    'drop-navicular':       { label:'Drop Navicular', icon:'👣' },
    'adductor-squeeze':     { label:'Adductor Squeeze Test', icon:'🤏' },
    'dinamometria':         { label:'Dinamometría Cuádriceps', icon:'⚡' },
    'vmp-sentadilla':       { label:'VMP Sentadilla', icon:'🏋️' },
    'vmp-press':            { label:'VMP Press Banca', icon:'🏋️' },
    'vmp-pm':               { label:'VMP Peso Muerto', icon:'🏋️' },
    'saltabilidad':         { label:'Saltabilidad (CMJ + Hop + Broad)', icon:'🦘' },
    'cierre':               { label:'Cierre + contacto', icon:'✅', always:true },
  },

  generate(sectionIds, atleta, evalData){
    if (!atleta) { alert('Sin atleta seleccionado'); return; }
    const sections = sectionIds
      .map(id => this._sections[id])
      .filter(Boolean)
      .map(fn => fn(atleta, evalData || {}));
    const css = this._cssLink();
    const toolbar = `
      <div class="rpt-toolbar">
        <h1>INFORME · ${atleta.nombre || 'Atleta'}</h1>
        <button onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
        <button class="ghost" onclick="window.close()">✕ Cerrar</button>
      </div>`;
    const html = `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8">
<title>Informe · ${(atleta.nombre||'').replace(/</g,'')} · MoveMetrics</title>
${css}
</head><body>
${toolbar}
${sections.join('\n')}
</body></html>`;
    const w = window.open('', '_blank');
    if (!w){ alert('Bloqueador de popups activo. Permití popups para este sitio.'); return; }
    w.document.write(html);
    w.document.close();
  },

  _cssLink(){
    // serve as inline <link> resolved from origin
    const here = location.origin + location.pathname.replace(/[^/]*$/, '');
    return `<link rel="stylesheet" href="${here}js/informe/template.css">`;
  },

  // utilidades comunes para secciones
  semaforo(level){
    return `<span class="rpt-semaforo">
      <span class="${level==='red'   ?'on red'  :''}"></span>
      <span class="${level==='amber' ?'on amber':''}"></span>
      <span class="${level==='green' ?'on green':''}"></span>
    </span>`;
  },

  semaforoFromVal(v, redLt, amberLt){
    if (v == null) return 'none';
    if (v < redLt) return 'red';
    if (v < amberLt) return 'amber';
    return 'green';
  },

  pageFooter(pageNum){
    return `<div class="rpt-footer">
      <span class="brand">MOVEMETRICS · THE MOVE CLUB</span>
      <span>${new Date().toLocaleDateString('es-AR')} · Pág ${pageNum||''}</span>
    </div>`;
  },

  fmt(v, dec){
    if (v == null || isNaN(v)) return '—';
    return Number(v).toFixed(dec ?? 1);
  },

  pctDiff(a, b){
    if (a == null || b == null) return null;
    const mx = Math.max(a, b), mn = Math.min(a, b);
    return mx ? ((mx - mn) / mx * 100) : 0;
  }
};

})();

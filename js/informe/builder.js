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
    'composicion-corporal': { label:'Composición Corporal (NEW)', icon:'⚖️' },
    'wellness':             { label:'Wellness · Hooper (NEW)', icon:'🌿' },
    'analisis-ai':          { label:'Análisis Movimiento AI (NEW)', icon:'🤖' },
    'cierre':               { label:'Cierre + contacto', icon:'✅', always:true },
  },

  // coords overrides desde localStorage
  loadCoords(){
    try { return JSON.parse(localStorage.getItem('inf-coords') || '{}'); } catch(e){ return {}; }
  },
  saveCoord(key, left, top){
    const c = this.loadCoords();
    c[key] = { left: +left.toFixed(2), top: +top.toFixed(2) };
    localStorage.setItem('inf-coords', JSON.stringify(c));
  },

  generate(sectionIds, atleta, evalData){
    if (!atleta) { alert('Sin atleta seleccionado'); return; }
    const sections = sectionIds
      .map(id => this._sections[id])
      .filter(Boolean)
      .map(fn => fn(atleta, evalData || {}));
    const css = this._cssLink();
    const coords = JSON.stringify(this.loadCoords());
    const toolbar = `
      <div class="rpt-toolbar">
        <h1>INFORME · ${atleta.nombre || 'Atleta'}</h1>
        <button id="rpt-cal-btn" class="ghost" onclick="window._toggleCal()">🎯 Calibrar</button>
        <button onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
        <button class="ghost" onclick="window.close()">✕ Cerrar</button>
      </div>`;
    const calScript = `
<script>
const COORDS = ${coords};
let CAL_MODE = false;
function applyCoords(){
  document.querySelectorAll('.rpt-cal[data-key]').forEach(el => {
    const k = el.dataset.key;
    if (COORDS[k]){
      el.style.left = COORDS[k].left + '%';
      el.style.top  = COORDS[k].top  + '%';
    }
  });
}
window._toggleCal = function(){
  CAL_MODE = !CAL_MODE;
  document.body.classList.toggle('cal-mode', CAL_MODE);
  document.getElementById('rpt-cal-btn').textContent = CAL_MODE ? '✅ Guardar coords' : '🎯 Calibrar';
  document.getElementById('rpt-cal-btn').className = CAL_MODE ? '' : 'ghost';
  if (!CAL_MODE){
    // dump coords y enviar al opener para persistir
    if (window.opener && window.opener.INF){
      const all = {};
      document.querySelectorAll('.rpt-cal[data-key]').forEach(el => {
        const k = el.dataset.key;
        const p = el.parentElement.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const left = (r.left - p.left) / p.width * 100;
        const top  = (r.top  - p.top)  / p.height * 100;
        all[k] = { left:+left.toFixed(2), top:+top.toFixed(2) };
      });
      try {
        const merged = Object.assign(window.opener.INF.loadCoords(), all);
        window.opener.localStorage.setItem('inf-coords', JSON.stringify(merged));
        alert('Coords guardadas. La próxima vez aparecen en la posición correcta.');
      } catch(e){ console.warn(e); }
    }
  }
};
// drag logic
let DRAG = null;
document.addEventListener('mousedown', e => {
  if (!CAL_MODE) return;
  const el = e.target.closest('.rpt-cal[data-key]'); if (!el) return;
  e.preventDefault();
  const p = el.parentElement.getBoundingClientRect();
  DRAG = { el, p, offX: e.clientX - el.getBoundingClientRect().left, offY: e.clientY - el.getBoundingClientRect().top };
});
document.addEventListener('mousemove', e => {
  if (!DRAG) return;
  const x = e.clientX - DRAG.p.left - DRAG.offX;
  const y = e.clientY - DRAG.p.top  - DRAG.offY;
  DRAG.el.style.left = (x / DRAG.p.width  * 100) + '%';
  DRAG.el.style.top  = (y / DRAG.p.height * 100) + '%';
});
document.addEventListener('mouseup', () => { DRAG = null; });
window.addEventListener('load', applyCoords);
applyCoords();
</script>
<style>
.cal-mode .rpt-cal { cursor: move !important; outline: 2px dashed #ffb020 !important; outline-offset: 1px; background: rgba(255,176,32,.1) !important; }
.cal-mode .rpt-cal:hover { outline-color: #39FF7A !important; background: rgba(57,255,122,.2) !important; }
</style>`;
    const html = `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8">
<title>Informe · ${(atleta.nombre||'').replace(/</g,'')} · MoveMetrics</title>
${css}
</head><body>
${toolbar}
${sections.join('\n')}
${calScript}
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

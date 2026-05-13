// js/informe/generators/movilidad-tobillo.js
// PILOTO Fase 1: rellena Lunge Test (página 5, idx 4) del template
// COORDS: provisorias - ajustar visualmente tras primer test

(function(){
'use strict';

// coords iniciales para Lunge Test - página index 4 (0-based)
// formato pdf-lib: Y desde abajo. Origen 0,0 = bottom-left.
const FIELDS = {
  lunge_D:    { page:4, x:120, y:480, size:14, bold:true },
  lunge_I:    { page:4, x:120, y:450, size:14, bold:true },
  lunge_pct:  { page:4, x:215, y:465, size:12 },
};

// genera informe piloto solo con lunge test
async function generarInformeMovilidadTobillo(){
  if (typeof TPL === 'undefined'){
    alert('Falta cargar template-filler.js');
    return;
  }
  try {
    await TPL.load();
    await TPL.reset();

    // leer data del atleta actual
    const cur = window.cur;
    const ev = cur?.evals?.movilidad?.[cur?.evals?.movilidad?.length-1] || cur?.movilidad;
    const lungeD = ev?.lungeD ?? cur?.lungeD ?? null;
    const lungeI = ev?.lungeI ?? cur?.lungeI ?? null;

    if (lungeD == null && lungeI == null){
      // intentar leer directo del DOM
      const d = parseFloat(document.getElementById('lunge-d')?.value || document.getElementById('mov-tobillo-d')?.value);
      const i = parseFloat(document.getElementById('lunge-i')?.value || document.getElementById('mov-tobillo-i')?.value);
      if (isNaN(d) && isNaN(i)){
        alert('No hay datos de Lunge Test. Cargá los valores primero.');
        return;
      }
      drawLungeData(d, i);
    } else {
      drawLungeData(lungeD, lungeI);
    }

    const bytes = await TPL.save();
    const nombre = (cur?.nombre || 'atleta').replace(/\s+/g,'-').toLowerCase();
    TPL.download(bytes, `informe-tobillo-${nombre}-${Date.now()}.pdf`);
  } catch(e){
    console.error('[informe-tobillo]', e);
    alert('Error: ' + e.message);
  }
}

function drawLungeData(d, i){
  if (d != null && !isNaN(d)) TPL.drawText(d.toFixed(1) + '°', FIELDS.lunge_D);
  if (i != null && !isNaN(i)) TPL.drawText(i.toFixed(1) + '°', FIELDS.lunge_I);
  if (d != null && i != null && !isNaN(d) && !isNaN(i)){
    const max = Math.max(d, i), min = Math.min(d, i);
    const pct = max ? ((max - min) / max * 100) : 0;
    const color = pct < 5 ? [0.22, 1, 0.48] : pct < 10 ? [1, 0.7, 0.13] : [1, 0.25, 0.25];
    TPL.drawText(pct.toFixed(1) + '%', { ...FIELDS.lunge_pct, color });
  }
}

window.generarInformeMovilidadTobillo = generarInformeMovilidadTobillo;

})();

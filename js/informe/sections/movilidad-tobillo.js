// js/informe/sections/movilidad-tobillo.js — Lunge Test
(function(){
  if (typeof INF === 'undefined') return;
  INF.register('movilidad-tobillo', (a, ev) => {
    // data path: cur.lungeD/lungeI directo, o última eval movilidad
    let lD = a.lungeD ?? null;
    let lI = a.lungeI ?? null;
    if (lD == null && a.evals){
      const lastMov = Object.values(a.evals).filter(e => e?.lungeD != null).pop();
      if (lastMov){ lD = lastMov.lungeD; lI = lastMov.lungeI; }
    }
    const pct = INF.pctDiff(lD, lI);

    const semaforo = v => INF.semaforoFromVal(v, 35, 40);
    const cell = (v, lvl) => v == null
      ? '<td class="rpt-val-bad">—</td>'
      : `<td class="rpt-val-${lvl==='green'?'good':lvl==='amber'?'warn':'bad'}">${v.toFixed(1)}°</td>`;

    const lvlD = semaforo(lD), lvlI = semaforo(lI);
    const pctCls = pct == null ? '' : pct < 5 ? 'rpt-val-good' : pct < 10 ? 'rpt-val-warn' : 'rpt-val-bad';
    const pctStr = pct == null ? '—' : pct.toFixed(1) + '%';

    return `
    <div class="rpt-page">
      <div class="rpt-section-title"><div class="num">01</div><h2>MOVILIDAD ARTICULAR · TOBILLO</h2></div>

      <div class="rpt-card">
        <h3 style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#39FF7A;letter-spacing:.04em;margin-bottom:12px">LUNGE TEST · Dorsiflexión</h3>
        <table class="rpt-table">
          <thead><tr><th>Lado</th><th>Valor</th><th>Semáforo</th></tr></thead>
          <tbody>
            <tr><td><b>Derecha</b></td>${cell(lD, lvlD)}<td>${INF.semaforo(lvlD)}</td></tr>
            <tr><td><b>Izquierda</b></td>${cell(lI, lvlI)}<td>${INF.semaforo(lvlI)}</td></tr>
            <tr><td><b>% Diferencia</b></td><td class="${pctCls}">${pctStr}</td><td>${pct!=null?INF.semaforo(pct<5?'green':pct<10?'amber':'red'):''}</td></tr>
          </tbody>
        </table>
        <div style="display:flex;gap:8px;font-size:10px;color:#888;margin-top:8px;flex-wrap:wrap">
          <span><b style="color:#ff4060">●</b> &lt;35°</span>
          <span><b style="color:#ffb020">●</b> 35-40°</span>
          <span><b style="color:#39FF7A">●</b> &gt;40°</span>
        </div>
      </div>

      <div class="rpt-analysis">
        <b>Análisis Lunge Test.</b> Se evalúa la dorsiflexión de tobillo en ambos lados. Valores óptimos: &gt;40°.
        La diferencia entre lados debe ser &lt;10% para indicar simetría adecuada. Restricciones en este rango pueden
        asociarse a compensaciones en cadena cinética inferior, valgo dinámico de rodilla, déficit en absorción de cargas
        y mayor riesgo de lesión.
        <br><br>
        <b>Cálculo asimetría:</b> % Diferencia = (Lado Mayor − Lado Menor) / Lado Mayor × 100
      </div>

      ${INF.pageFooter()}
    </div>`;
  });
})();

// js/informe/sections/cierre.js
(function(){
  if (typeof INF === 'undefined') return;
  INF.register('cierre', (a) => {
    return `
    <div class="rpt-page" style="display:flex;flex-direction:column;justify-content:center;text-align:center">
      <div class="rpt-h1"><span class="accent">FIN</span> DE LA EVALUACIÓN</div>
      <div class="rpt-sub">Realizado por equipo · THE MOVE CLUB</div>

      <div style="margin:40px auto;max-width:520px;text-align:left">
        <div class="rpt-card">
          <p style="font-size:13px;color:#ccc;line-height:1.8;margin-bottom:10px">
            <b style="color:#39FF7A">Evaluación de Rendimiento</b> para optimizar el desempeño deportivo.
          </p>
          <p style="font-size:12px;color:#aaa;line-height:1.7;margin-bottom:8px">• Análisis detallado de calidad de movimiento, movilidad, saltabilidad y fuerza.</p>
          <p style="font-size:12px;color:#aaa;line-height:1.7;margin-bottom:8px">• Implementación de estrategias personalizadas para mejorar resultados.</p>
          <p style="font-size:12px;color:#aaa;line-height:1.7">• Comprometido en guiar a los atletas hacia su máximo potencial.</p>
        </div>

        <div class="rpt-card" style="margin-top:14px">
          <h3 style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#39FF7A;letter-spacing:.04em;margin-bottom:10px">CONTACTO</h3>
          <p style="font-size:12px;color:#ccc;margin-bottom:5px">📞 Tel: 2944-701014</p>
          <p style="font-size:12px;color:#ccc;margin-bottom:5px">📷 @the.move.club</p>
          <p style="font-size:12px;color:#ccc">📍 Av. los Arrayanes, Lago Puelo, Chubut, Argentina</p>
        </div>
      </div>

      ${INF.pageFooter()}
    </div>`;
  });
})();

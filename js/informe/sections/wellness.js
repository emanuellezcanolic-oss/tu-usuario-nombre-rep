// wellness.js — Hooper Index + HRV + RPE
(function(){
  if (typeof INF === 'undefined') return;

  INF.register('wellness', (a) => {
    const w = a.wellness?.[a.wellness?.length-1] || a.fatiga || a.wellness || {};
    const hooper = (w.sueno||0)+(w.estres||0)+(w.fatiga||0)+(w.doms||0);
    const hCol = hooper < 12 ? '#39FF7A' : hooper < 18 ? '#ffb020' : '#ff4060';
    const fmt = v => v == null ? '—' : v;

    const gauge = (label, val, color) => `
      <div style="background:#0f0f0f;border:1px solid #1a1a1a;border-left:4px solid ${color};border-radius:6px;padding:14px;text-align:center">
        <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;font-weight:700">${label}</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;font-weight:900;color:${color};line-height:1">${fmt(val)}<span style="font-size:14px;color:#666;margin-left:4px;font-weight:400">/7</span></div>
      </div>`;

    return `
    <div class="rpt-page" style="background:linear-gradient(135deg,#000 0%,#0a0a0a 50%,#000 100%);overflow:hidden">
      <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1200 675" preserveAspectRatio="none">
        <polygon points="0,0 280,0 200,675 0,675" fill="#39FF7A" opacity="0.08"/>
        <line x1="0" y1="120" x2="1200" y2="120" stroke="#39FF7A" stroke-width="2" opacity="0.4"/>
        <line x1="0" y1="615" x2="1200" y2="615" stroke="#39FF7A" stroke-width="2" opacity="0.4"/>
      </svg>

      <div style="position:absolute;left:4%;top:5%;width:92%;display:flex;align-items:center;gap:18px">
        <div style="background:#39FF7A;color:#000;width:64px;height:64px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:30px;border-radius:8px;font-family:'Bebas Neue',sans-serif">05</div>
        <div style="flex:1">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;font-weight:900;color:#fff;letter-spacing:.04em;line-height:1">WELLNESS<span style="color:#39FF7A"> · HOOPER</span></div>
          <div style="font-size:11px;color:#888;letter-spacing:.18em;text-transform:uppercase;margin-top:4px">Sueño · Estrés · Fatiga · DOMS</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.1em">The Move Club</div>
          <div style="font-size:9px;color:#39FF7A;font-family:monospace">${new Date().toLocaleDateString('es-AR')}</div>
        </div>
      </div>

      <!-- 4 gauges -->
      <div style="position:absolute;left:4%;top:26%;right:4%;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
        ${gauge('Sueño', w.sueno, '#39FF7A')}
        ${gauge('Estrés', w.estres, '#5dd4ff')}
        ${gauge('Fatiga', w.fatiga, '#ffb020')}
        ${gauge('DOMS', w.doms, '#ff4060')}
      </div>

      <!-- Hooper total + análisis -->
      <div style="position:absolute;left:4%;top:55%;right:50%;background:#0f0f0f;border:2px solid ${hCol};border-radius:8px;padding:20px;text-align:center">
        <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.12em;font-weight:700">HOOPER INDEX TOTAL</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:96px;color:${hCol};font-weight:900;line-height:1;margin:6px 0">${hooper}<span style="font-size:24px;color:#666;font-weight:400">/28</span></div>
        <div style="font-size:13px;color:${hCol};font-weight:700">${hooper < 12 ? 'ÓPTIMO' : hooper < 18 ? 'MODERADO' : 'ALERTA'}</div>
      </div>

      <div style="position:absolute;left:52%;top:55%;right:4%;background:#0f0f0f;border-left:3px solid #ffb020;padding:14px 18px;border-radius:4px">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#ffb020;letter-spacing:.06em;margin-bottom:8px">INTERPRETACIÓN</div>
        <div style="font-size:11px;color:#ccc;line-height:1.65">
          <b style="color:#fff">&lt;12:</b> Estado óptimo. Carga de entrenamiento bien tolerada.<br>
          <b style="color:#fff">12-18:</b> Fatiga moderada. Ajustar volumen/intensidad próximas sesiones.<br>
          <b style="color:#fff">&gt;18:</b> Riesgo overreaching. Descarga obligatoria + dormir más.
          <br><br>
          <span style="color:#888;font-size:10px">Hooper et al. 1995. Escala 1-7 por ítem. Aplicar diariamente AM antes de entrenar.</span>
        </div>
      </div>

      <div style="position:absolute;bottom:2.5%;left:4%;right:4%;display:flex;justify-content:space-between;font-size:9px;color:#444;letter-spacing:.1em;text-transform:uppercase;border-top:1px solid #1a1a1a;padding-top:6px">
        <span style="color:#39FF7A;font-weight:700">MOVEMETRICS · ${(a.nombre||'').toUpperCase()}</span>
        <span>05 · Wellness Hooper</span>
      </div>
    </div>`;
  });
})();

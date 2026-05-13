// analisis-ai.js — Análisis Movimiento AI (MediaPipe) - resumen test + flags
(function(){
  if (typeof INF === 'undefined') return;

  INF.register('analisis-ai', (a) => {
    const ma = a.movimiento?.[a.movimiento?.length-1] || {};
    const ex = ma.exercise || '—';
    const view = ma.view || '—';
    const kpis = ma.kpis || {};
    const flags = ma.flags || [];

    const flagItem = f => {
      const ic = f.lvl === 'red' ? '🔴' : f.lvl === 'amber' ? '🟡' : '🟢';
      const col = f.lvl === 'red' ? '#ff4060' : f.lvl === 'amber' ? '#ffb020' : '#39FF7A';
      return `<div style="display:flex;gap:8px;padding:6px 10px;background:rgba(0,0,0,.4);border-left:3px solid ${col};border-radius:3px;margin-bottom:5px"><span>${ic}</span><span style="font-size:11px;color:#ddd">${f.msg}</span></div>`;
    };
    const kpiItem = (k, v) => `
      <div style="background:#0f0f0f;border:1px solid #1a1a1a;border-left:3px solid #39FF7A;padding:10px 12px;border-radius:4px">
        <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.1em;font-weight:700">${k}</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#39FF7A;font-weight:900;line-height:1;margin-top:4px">${v}</div>
      </div>`;

    return `
    <div class="rpt-page" style="background:linear-gradient(135deg,#000 0%,#0a0a0a 50%,#000 100%);overflow:hidden">
      <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1200 675" preserveAspectRatio="none">
        <polygon points="0,0 280,0 200,675 0,675" fill="#39FF7A" opacity="0.08"/>
        <line x1="0" y1="120" x2="1200" y2="120" stroke="#39FF7A" stroke-width="2" opacity="0.4"/>
        <line x1="0" y1="615" x2="1200" y2="615" stroke="#39FF7A" stroke-width="2" opacity="0.4"/>
      </svg>

      <div style="position:absolute;left:4%;top:5%;width:92%;display:flex;align-items:center;gap:18px">
        <div style="background:#39FF7A;color:#000;width:64px;height:64px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:30px;border-radius:8px;font-family:'Bebas Neue',sans-serif">06</div>
        <div style="flex:1">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;font-weight:900;color:#fff;letter-spacing:.04em;line-height:1">ANÁLISIS<span style="color:#39FF7A"> MOVIMIENTO AI</span></div>
          <div style="font-size:11px;color:#888;letter-spacing:.18em;text-transform:uppercase;margin-top:4px">MediaPipe Pose · ${ex} · vista ${view}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.1em">The Move Club</div>
          <div style="font-size:9px;color:#39FF7A;font-family:monospace">${ma.ts ? new Date(ma.ts).toLocaleDateString('es-AR') : '—'}</div>
        </div>
      </div>

      <!-- KPIs -->
      <div style="position:absolute;left:4%;top:24%;right:4%">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#39FF7A;letter-spacing:.06em;margin-bottom:10px">MÉTRICAS DETECTADAS</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px">
          ${Object.entries(kpis).slice(0,8).map(([k,v]) => kpiItem(k, v)).join('')}
          ${!Object.keys(kpis).length ? '<div style="padding:20px;color:#888;text-align:center;background:#0f0f0f;border-radius:4px">Sin análisis AI guardado todavía. Subí un video en Calidad Mov. → Analizar → Guardar.</div>' : ''}
        </div>
      </div>

      <!-- FLAGS -->
      <div style="position:absolute;left:4%;top:62%;right:4%;bottom:8%;overflow:hidden">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#ffb020;letter-spacing:.06em;margin-bottom:10px">OBSERVACIONES / FLAGS</div>
        ${flags.length ? flags.slice(0, 6).map(flagItem).join('') : '<div style="padding:14px;color:#39FF7A;background:rgba(57,255,122,.08);border:1px solid #39FF7A;border-radius:4px;font-size:12px;text-align:center">✅ Sin alertas detectadas. Patrón motor correcto.</div>'}
      </div>

      <div style="position:absolute;bottom:2.5%;left:4%;right:4%;display:flex;justify-content:space-between;font-size:9px;color:#444;letter-spacing:.1em;text-transform:uppercase;border-top:1px solid #1a1a1a;padding-top:6px">
        <span style="color:#39FF7A;font-weight:700">MOVEMETRICS · ${(a.nombre||'').toUpperCase()}</span>
        <span>06 · Análisis AI</span>
      </div>
    </div>`;
  });
})();

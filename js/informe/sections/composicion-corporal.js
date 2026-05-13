// composicion-corporal.js — template propio Move Club style (SVG inline, no PNG)
// Datos: peso, talla, %graso (Faulkner/Yuhasz/JP7), masa magra/grasa, perímetros, ICC, somatotipo

(function(){
  if (typeof INF === 'undefined') return;

  INF.register('composicion-corporal', (a) => {
    const cc = a.composicion?.[a.composicion?.length-1] || a.composicion || {};
    const peso = a.peso ?? cc.peso ?? null;
    const talla = a.talla ?? cc.talla ?? null;
    const imc = (peso && talla) ? (peso / ((talla/100)**2)) : null;
    const cintura = cc.cintura ?? null;
    const cadera = cc.cadera ?? null;
    const icc = (cintura && cadera) ? cintura/cadera : null;
    const grasa = cc.fatPctFaulkner ?? cc.fatPctYuhasz ?? cc.fatPctJP7 ?? null;
    const mlg = (peso && grasa) ? peso * (1 - grasa/100) : null;
    const mg  = (peso && grasa) ? peso * (grasa/100) : null;

    const fmt = (v, d) => v == null ? '—' : Number(v).toFixed(d ?? 1);
    const semIMC = v => v == null ? '#888' : v < 18.5 ? '#ffb020' : v < 25 ? '#39FF7A' : v < 30 ? '#ffb020' : '#ff4060';
    const semGrasa = v => v == null ? '#888' : v < 12 ? '#39FF7A' : v < 20 ? '#ffb020' : '#ff4060';
    const semICC = v => v == null ? '#888' : v < 0.85 ? '#39FF7A' : v < 0.95 ? '#ffb020' : '#ff4060';

    return `
    <div class="rpt-page" style="background:linear-gradient(135deg,#000 0%,#0a0a0a 50%,#000 100%);overflow:hidden">

      <!-- diagonal accent fondo -->
      <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1200 675" preserveAspectRatio="none">
        <polygon points="0,0 280,0 200,675 0,675" fill="#39FF7A" opacity="0.08"/>
        <polygon points="900,0 1200,0 1200,675 1000,675" fill="#39FF7A" opacity="0.06"/>
        <line x1="0" y1="120" x2="1200" y2="120" stroke="#39FF7A" stroke-width="2" opacity="0.4"/>
        <line x1="0" y1="615" x2="1200" y2="615" stroke="#39FF7A" stroke-width="2" opacity="0.4"/>
      </svg>

      <!-- TITULO header -->
      <div style="position:absolute;left:4%;top:5%;width:92%;display:flex;align-items:center;gap:18px">
        <div style="background:#39FF7A;color:#000;width:64px;height:64px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:30px;border-radius:8px;font-family:'Bebas Neue',sans-serif">04</div>
        <div style="flex:1">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;font-weight:900;color:#fff;letter-spacing:.04em;line-height:1">COMPOSICIÓN<span style="color:#39FF7A"> CORPORAL</span></div>
          <div style="font-size:11px;color:#888;letter-spacing:.18em;text-transform:uppercase;margin-top:4px">Antropometría · Pliegues · Perímetros · Somatotipo</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.1em">The Move Club</div>
          <div style="font-size:9px;color:#39FF7A;font-family:monospace">${new Date().toLocaleDateString('es-AR')}</div>
        </div>
      </div>

      <!-- KPIs grid -->
      <div style="position:absolute;left:4%;top:24%;right:4%;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
        ${kpiCard('PESO', fmt(peso), 'kg', '#fff')}
        ${kpiCard('TALLA', fmt(talla, 0), 'cm', '#fff')}
        ${kpiCard('IMC', fmt(imc), '', semIMC(imc))}
        ${kpiCard('% GRASA', fmt(grasa), '%', semGrasa(grasa))}
      </div>

      <div style="position:absolute;left:4%;top:42%;right:4%;display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
        ${kpiCard('MASA MAGRA', fmt(mlg), 'kg', '#39FF7A')}
        ${kpiCard('MASA GRASA', fmt(mg), 'kg', '#ffb020')}
        ${kpiCard('ICC', fmt(icc, 2), '', semICC(icc))}
      </div>

      <!-- Perímetros tabla -->
      <div style="position:absolute;left:4%;top:60%;right:50%;background:#0f0f0f;border-left:3px solid #39FF7A;padding:12px 16px;border-radius:4px">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#39FF7A;letter-spacing:.06em;margin-bottom:8px">PERÍMETROS (cm)</div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;color:#ccc">
          ${peri('Cuello', cc.cuello)}
          ${peri('Tórax', cc.torax)}
          ${peri('Cintura', cintura)}
          ${peri('Cadera', cadera)}
          ${peri('Muslo', cc.muslo)}
          ${peri('Brazo flex.', cc.brazoFlex)}
        </table>
      </div>

      <!-- Somatotipo + análisis -->
      <div style="position:absolute;left:52%;top:60%;right:4%;background:#0f0f0f;border-left:3px solid #ffb020;padding:12px 16px;border-radius:4px">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#ffb020;letter-spacing:.06em;margin-bottom:8px">ANÁLISIS</div>
        <div style="font-size:11px;color:#ccc;line-height:1.65">
          <b style="color:#fff">IMC:</b> ${imc == null ? '—' : imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Peso normal' : imc < 30 ? 'Sobrepeso' : 'Obesidad'}<br>
          <b style="color:#fff">ICC:</b> ${icc == null ? '—' : icc < 0.85 ? 'Bajo riesgo cardiovascular' : icc < 0.95 ? 'Riesgo moderado' : 'Riesgo elevado'}<br>
          <b style="color:#fff">% Graso:</b> ${grasa == null ? '—' : grasa < 12 ? 'Óptimo deportivo' : grasa < 20 ? 'Adecuado' : 'Por encima del rango deportivo'}<br>
          <br>
          <span style="color:#888;font-size:10px">Fórmulas: Faulkner (deportistas), Yuhasz (atletas), Jackson-Pollock 7 pliegues. Comparar con normas por deporte/sexo/edad.</span>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="position:absolute;bottom:2.5%;left:4%;right:4%;display:flex;justify-content:space-between;font-size:9px;color:#444;letter-spacing:.1em;text-transform:uppercase;border-top:1px solid #1a1a1a;padding-top:6px">
        <span style="color:#39FF7A;font-weight:700">MOVEMETRICS · ${(a.nombre||'').toUpperCase()}</span>
        <span>04 · Composición Corporal</span>
      </div>
    </div>`;
  });

  function kpiCard(label, val, unit, color){
    return `
    <div style="background:#0f0f0f;border:1px solid #1a1a1a;border-bottom:3px solid ${color};border-radius:6px;padding:14px 16px">
      <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.12em;font-weight:700">${label}</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:38px;color:${color};font-weight:900;line-height:1;margin-top:6px">${val}<span style="font-size:14px;color:#888;font-family:'Inter',sans-serif;font-weight:400;margin-left:4px">${unit}</span></div>
    </div>`;
  }

  function peri(label, v){
    return `<tr><td style="padding:4px 0;color:#888">${label}</td><td style="text-align:right;color:#fff;font-family:monospace;font-weight:700">${v == null ? '—' : Number(v).toFixed(1)}</td></tr>`;
  }

})();

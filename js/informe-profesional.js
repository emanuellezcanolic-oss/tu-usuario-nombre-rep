// ========================================================
// INFORME PROFESIONAL - Estilo "The Move Club"
// ========================================================

async function generarInformeProfesional() {
  if (!cur) {
    alert('Seleccioná un atleta primero');
    return;
  }

  // Mostrar loading
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'informe-loading-overlay';
  loadingDiv.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:20000;display:flex;align-items:center;justify-content:center;flex-direction:column';
  loadingDiv.innerHTML = '<div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div><div style="margin-top:20px;color:#39FF7A">Generando informe profesional...</div>';
  document.body.appendChild(loadingDiv);

  try {
    const htmlContent = construirHTMLInforme();
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '800px';
    iframe.style.height = '600px';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Informe MoveMetrics</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: #0a0a0a;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #fff;
            padding: 40px;
            width: 800px;
            margin: 0 auto;
          }
          .page {
            background: #0f0f0f;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 0 30px rgba(57,255,122,.1);
            border: 1px solid rgba(57,255,122,.2);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #39FF7A;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #39FF7A;
            font-size: 28px;
            letter-spacing: 2px;
          }
          .header p {
            color: #888;
            font-size: 12px;
            margin-top: 5px;
          }
          .section-title {
            font-size: 18px;
            color: #39FF7A;
            border-left: 4px solid #39FF7A;
            padding-left: 12px;
            margin: 25px 0 15px 0;
          }
          .section-title2 {
            font-size: 16px;
            color: #4D9EFF;
            margin: 20px 0 10px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          th {
            background: #1a1a1a;
            color: #39FF7A;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
          }
          .badge-green { background: rgba(57,255,122,.2); color: #39FF7A; }
          .badge-red { background: rgba(255,59,59,.2); color: #FF3B3B; }
          .badge-yellow { background: rgba(255,176,32,.2); color: #FFB020; }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #222;
            font-size: 10px;
            color: #555;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin: 20px 0;
          }
          .kpi-card {
            background: #141414;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            border: 1px solid #2a2a2a;
          }
          .kpi-value {
            font-size: 28px;
            font-weight: bold;
            color: #39FF7A;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    iframeDoc.close();
    
    await new Promise(r => setTimeout(r, 500));
    
    const canvas = await html2canvas(iframe.contentDocument.body, {
      scale: 2,
      backgroundColor: '#0a0a0a',
      logging: false,
      useCORS: true
    });
    
    const { jsPDF } = window.jspdf;
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`MoveMetrics_${cur.nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    iframe.remove();
    loadingDiv.remove();
    
  } catch (error) {
    console.error('Error:', error);
    loadingDiv.remove();
    alert('Error al generar el informe: ' + error.message);
  }
}

function construirHTMLInforme() {
  const s = cur;
  const saltoData = getLastEval('saltos');
  const fvData = s.lastFV;
  
  let fuerzaRelativa = '--';
  let nivelFuerza = '';
  if (fvData?.oneRM && s.peso) {
    const fr = (fvData.oneRM / parseFloat(s.peso)).toFixed(2);
    fuerzaRelativa = `${fr} × PC`;
    if (fr >= 1.5) nivelFuerza = '<span class="badge badge-green">ALTO (Elite)</span>';
    else if (fr >= 1.0) nivelFuerza = '<span class="badge badge-yellow">MEDIO</span>';
    else nivelFuerza = '<span class="badge badge-red">BAJO (Déficit)</span>';
  }
  
  let lsi = '--';
  let lsiClass = '';
  if (saltoData?.avg?.shD && saltoData?.avg?.shI) {
    const lsiVal = (Math.min(saltoData.avg.shD, saltoData.avg.shI) / Math.max(saltoData.avg.shD, saltoData.avg.shI) * 100).toFixed(1);
    lsi = `${lsiVal}%`;
    lsiClass = lsiVal >= 90 ? 'badge-green' : (lsiVal >= 80 ? 'badge-yellow' : 'badge-red');
  }
  
  const fmsData = getLastEval('fms');
  const ohsCriterios = fmsData?.ohs?.criterios || [];
  const ohsScore = ohsCriterios.filter(c => c === 'si').length;
  
  return `
    <div class="page">
      <div class="header">
        <h1>∧ MOVEMETRICS</h1>
        <p>INFORME DE EVALUACIÓN FUNCIONAL</p>
        <p style="font-size:10px">${new Date().toLocaleDateString('es-AR')} · ${s.nombre}</p>
      </div>
      
      <div style="background:#1a1a1a; border-radius:12px; padding:15px; margin-bottom:20px">
        <table style="border:none">
          <tr><td style="border:none"><strong>Nombre:</strong> ${s.nombre}</td><td style="border:none"><strong>Deporte:</strong> ${s.deporte || '--'}</td></tr>
          <tr><td style="border:none"><strong>Edad:</strong> ${s.edad || '--'} años</td><td style="border:none"><strong>Peso:</strong> ${s.peso || '--'} kg</td></tr>
          <tr><td style="border:none"><strong>Nivel:</strong> ${s.nivel || '--'}</td><td style="border:none"><strong>Objetivo:</strong> ${s.objetivo || '--'}</td></tr>
        </table>
      </div>
      
      <div class="kpi-grid">
        <div class="kpi-card">
          <div style="font-size:10px; color:#888">FUERZA RELATIVA</div>
          <div class="kpi-value">${fuerzaRelativa}</div>
          <div style="margin-top:5px">${nivelFuerza}</div>
        </div>
        <div class="kpi-card">
          <div style="font-size:10px; color:#888">1RM ESTIMADO</div>
          <div class="kpi-value">${fvData?.oneRM ? fvData.oneRM.toFixed(0) : '--'} kg</div>
          <div style="font-size:10px; color:#666">${fvData?.ejercicio || '--'}</div>
        </div>
        <div class="kpi-card">
          <div style="font-size:10px; color:#888">CMJ</div>
          <div class="kpi-value">${s.lastCMJ ? s.lastCMJ.toFixed(1) : '--'} cm</div>
        </div>
        <div class="kpi-card">
          <div style="font-size:10px; color:#888">LSI (Single Hop)</div>
          <div class="kpi-value" style="color:${lsiClass === 'badge-green' ? '#39FF7A' : lsiClass === 'badge-yellow' ? '#FFB020' : '#FF3B3B'}">${lsi}</div>
          <div class="badge ${lsiClass}">${lsiClass === 'badge-green' ? 'SIMÉTRICO' : lsiClass === 'badge-yellow' ? 'ASIMETRÍA LEVE' : 'ASIMETRÍA CRÍTICA'}</div>
        </div>
      </div>
      
      <div class="section-title">🎯 CALIDAD DE MOVIMIENTO</div>
      <div style="background:#141414; border-radius:12px; padding:15px">
        <div><strong>Sentadilla Overhead (OHS)</strong> - Puntuación: ${ohsScore}/4 (${(ohsScore/4*100).toFixed(0)}%)</div>
        <table style="margin-top:10px">
          <tr><th>Criterio</th><th>Estado</th></tr>
          <tr><td>Rodillas alineadas con los pies</td><td>${ohsCriterios[0] === 'si' ? '✅ CUMPLE' : '❌ NO CUMPLE'}</td></tr>
          <tr><td>Fémur debajo de la horizontal</td><td>${ohsCriterios[1] === 'si' ? '✅ CUMPLE' : '❌ NO CUMPLE'}</td></tr>
          <tr><td>Torso paralelo a la tibia</td><td>${ohsCriterios[2] === 'si' ? '✅ CUMPLE' : '❌ NO CUMPLE'}</td></tr>
          <tr><td>Barra alineada con los pies</td><td>${ohsCriterios[3] === 'si' ? '✅ CUMPLE' : '❌ NO CUMPLE'}</td></tr>
        </table>
      </div>
      
      <div class="section-title">📐 MOVILIDAD ARTICULAR</div>
      <div style="background:#141414; border-radius:12px; padding:15px">
        <table>
          <tr><th>Prueba</th><th>Derecho</th><th>Izquierdo</th><th>Estado</th></tr>
          <tr><td>Lunge Test (tobillo)</td><td>${s.lungeD || '--'}°</td><td>${s.lungeI || '--'}°</td><td>${s.lungeI >= 40 ? '🟢 Óptimo' : (s.lungeI >= 35 ? '🟡 Límite' : '🔴 Déficit')}</td></tr>
          <tr><td>TROM Cadera</td><td>${s.tromCadD || '--'}°</td><td>${s.tromCadI || '--'}°</td><td>${s.tromCadD >= 85 ? '🟢 Óptimo' : (s.tromCadD >= 70 ? '🟡 Límite' : '🔴 Déficit')}</td></tr>
        </table>
      </div>
      
      <div class="section-title">🦘 SALTABILIDAD</div>
      <div style="background:#141414; border-radius:12px; padding:15px">
        <table>
          <tr><th>Prueba</th><th>Valor</th><th>Referencia</th><th>Estado</th></tr>
          <tr><td>Broad Jump</td><td>${saltoData?.avg?.bj || '--'} cm</td><td>>200 cm (Elite)</td><td>${saltoData?.avg?.bj >= 200 ? '🟢 Elite' : (saltoData?.avg?.bj >= 160 ? '🟡 Normal' : '🔴 Bajo')}</td></tr>
          <tr><td>Single Hop (LSI)</td><td colspan="3">${lsi} ${lsiClass === 'badge-green' ? '✅' : (lsiClass === 'badge-yellow' ? '⚠️' : '🔴')}</td></tr>
        </table>
        ${saltoData?.avg?.bj && s.peso ? `<div style="margin-top:10px; font-size:11px; color:#888">Unidades de salto (AU): ${((saltoData.avg.bj / 100) * s.peso).toFixed(1)} kg·m</div>` : ''}
      </div>
      
      <div class="section-title">💪 PERFIL DE FUERZA RELATIVA</div>
      <div style="background:#141414; border-radius:12px; padding:15px">
        <div><strong>Ejercicio:</strong> ${fvData?.ejercicio || '--'}</div>
        <div><strong>1RM Estimado:</strong> ${fvData?.oneRM ? fvData.oneRM.toFixed(0) : '--'} kg</div>
        <div><strong>Fuerza Relativa:</strong> ${fuerzaRelativa}</div>
        <div style="margin-top:10px">${nivelFuerza}</div>
      </div>
      
      <div class="section-title">📋 PLAN DE ACCIÓN</div>
      <div style="background:#141414; border-radius:12px; padding:15px">
        <ul style="margin-left:20px; line-height:1.8">
          ${s.lungeI < 40 ? '<li>🔴 <strong>Movilidad de tobillo:</strong> Realizar dorsiflexiones con banda elástica (diario, 3x30")</li>' : ''}
          ${lsiClass === 'badge-red' ? '<li>🔴 <strong>Asimetría funcional:</strong> Trabajo unilateral específico para pierna izquierda (sentadillas búlgaras, split squats)</li>' : ''}
          ${fuerzaRelativa.includes('BAJO') ? '<li>🔴 <strong>Fuerza máxima:</strong> Trabajo de sentadilla con sobrecarga progresiva (3-5 rep al 80-85% 1RM)</li>' : ''}
          ${(s.lungeI >= 40 && lsiClass !== 'badge-red' && !fuerzaRelativa.includes('BAJO')) ? '<li>🟢 Mantener plan actual, enfocarse en técnica y prevención</li>' : ''}
        </ul>
      </div>
      
      <div class="footer">
        <p>Informe generado por MoveMetrics v12 · THE MOVE CLUB</p>
        <p>Av. los Arrayanes, Lago Puelo, Chubut, Argentina · @the.move.club</p>
      </div>
    </div>
  `;
}

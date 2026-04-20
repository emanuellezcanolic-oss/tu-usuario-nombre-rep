// ── GLOBALS (compartidos entre módulos) ──
// cur, atletas, kineState, etc. se definen en app.js
// Este archivo asume que app.js ya fue cargado

function addFVRow() {
  fvRowCount++;
  const wrap = document.getElementById('fv-rows-wrap');
  const row = document.createElement('div');
  row.className = 'fv-data-row';
  row.style.cssText = 'display:grid;grid-template-columns:60px 1fr 1fr 24px;gap:6px;margin-bottom:6px;align-items:center';
  row.innerHTML = `<span style="font-family:var(--mono);font-size:10px;color:var(--text3)">Par ${fvRowCount}</span>
    <input class="inp inp-mono fv-carga" type="number" step=".5" placeholder="60" style="font-size:12px">
    <input class="inp inp-mono fv-vmp"   type="number" step=".001" placeholder="0.650" style="font-size:12px">
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text3);font-size:16px;cursor:pointer;padding:2px;line-height:1">×</button>`;
  wrap.appendChild(row);
}

function onFvEjChange() {
  const newEj = document.getElementById('fv-ej')?.value;
  if (_lastFvEj && _lastFvEj !== newEj) {
    const pairs = [...document.querySelectorAll('.fv-data-row')]
      .map(r => ({ c: +r.querySelector('.fv-carga').value, v: +r.querySelector('.fv-vmp').value }))
      .filter(p => p.c > 0 && p.v > 0);
    if (pairs.length >= 3 && cur) { calcFV(); setTimeout(() => { document.getElementById('fv-rows-wrap').innerHTML = ''; fvRowCount = 0; for (let i = 0; i < 5; i++) addFVRow(); document.getElementById('fv-output').classList.add('hidden'); }, 200); }
  }
  _lastFvEj = newEj;
  renderFVHist();
}

function calcFV() {
  if (!cur) { alert('Seleccioná un atleta'); return; }
  const rows = [...document.querySelectorAll('.fv-data-row')];
  const pairs = rows.map(r => ({ c: +r.querySelector('.fv-carga').value, v: +r.querySelector('.fv-vmp').value })).filter(p => p.c > 0 && p.v > 0);
  if (pairs.length < 3) { alert('Mínimo 3 pares carga/VMP'); return; }
  const cargas = pairs.map(p => p.c), vmps = pairs.map(p => p.v);
  const n = cargas.length;
  const sumX = cargas.reduce((a,b)=>a+b,0), sumY = vmps.reduce((a,b)=>a+b,0);
  const sumXY = cargas.reduce((s,x,i)=>s+x*vmps[i],0), sumX2 = cargas.reduce((s,x)=>s+x*x,0);
  const b = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
  const a = sumY/n - b*sumX/n;
  const meanY = sumY/n;
  const ssTot = vmps.reduce((s,y)=>s+(y-meanY)**2,0);
  const ssRes = cargas.reduce((s,x,i)=>s+(vmps[i]-(a+b*x))**2,0);
  const r2 = 1 - ssRes/ssTot;
  const F0 = b < 0 ? (-a/b) : null;
  const V0 = a;
  const Pmax = F0 && V0 ? (F0*V0/4) : null;
  const ejId = document.getElementById('fv-ej').value;
  const vmpRef = VMP_REF[ejId] || 0.18;
  const oneRM = b < 0 ? ((vmpRef-a)/b) : null;
  const fiab = r2 >= 0.99 ? 'Alta' : r2 >= 0.95 ? 'Aceptable' : 'Baja';
  const r2Color = r2 >= 0.99 ? 'var(--neon)' : r2 >= 0.95 ? 'var(--amber)' : 'var(--red)';
  const ejName = document.getElementById('fv-ej').options[document.getElementById('fv-ej').selectedIndex].text;
  // Chart
  document.getElementById('fv-output').classList.remove('hidden');
  const minC = Math.min(...cargas)*0.9, maxC = Math.max(...cargas)*1.1;
  const curvX = [], curvY = [];
  for (let i=0;i<=30;i++){const x=minC+(maxC-minC)*i/30;curvX.push(+x.toFixed(1));curvY.push(Math.max(0,+(a+b*x).toFixed(4)));}
  const ctx = document.getElementById('fv-chart').getContext('2d');
  if (fvChart) fvChart.destroy();
  fvChart = new Chart(ctx, { type:'line',
    data:{ labels:curvX, datasets:[
      { label:'Curva F-V', data:curvY, borderColor:'#39FF7A', backgroundColor:'rgba(57,255,122,.04)', borderWidth:2, pointRadius:0, tension:0 },
      { label:'Datos', data:cargas.map((c,i)=>({x:c,y:vmps[i]})), borderColor:'#4D9EFF', backgroundColor:'#4D9EFF', type:'scatter', pointRadius:6, showLine:false, xAxisID:'x' }
    ]},
    options:{ responsive:true, plugins:{ legend:{ labels:{ color:'#666', font:{ family:'JetBrains Mono', size:10 } } } },
      scales:{ x:{type:'linear',grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#444',font:{family:'JetBrains Mono',size:9}},title:{display:true,text:'Carga (kg)',color:'#555'}},
               y:{grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#444',font:{family:'JetBrains Mono',size:9}},title:{display:true,text:'VMP (m/s)',color:'#555'}} } }
  });
  const badge = document.getElementById('fv-r2-badge');
  badge.textContent = `R² = ${r2.toFixed(4)} -- ${fiab}`;
  badge.className = 'tag ' + (r2>=0.99?'tag-g':r2>=0.95?'tag-y':'tag-r');
  document.getElementById('fv-res-table').innerHTML = `
    <div class="flex-b mb-8"><span style="font-size:12px;color:var(--text2)">Ejercicio</span><span style="font-family:var(--mono);font-weight:700">${ejName}</span></div>
    <div class="flex-b mb-8"><span style="font-size:12px;color:var(--text2)">V₀</span><span style="font-family:var(--mono);font-weight:700;color:var(--neon)">${V0.toFixed(4)} m/s</span></div>
    ${F0?`<div class="flex-b mb-8"><span style="font-size:12px;color:var(--text2)">F₀ (VMP=0)</span><span style="font-family:var(--mono);font-weight:700;color:var(--blue)">${F0.toFixed(1)} kg</span></div>`:''}
    ${Pmax?`<div class="flex-b mb-8"><span style="font-size:12px;color:var(--text2)">Pmax estimada</span><span style="font-family:var(--mono);font-weight:700;color:var(--amber)">${Pmax.toFixed(1)} W</span></div>`:''}
    ${oneRM?`<div class="flex-b mb-8"><span style="font-size:12px;color:var(--text2)">1RM (VMP ${vmpRef})</span><span style="font-family:var(--mono);font-weight:700;color:var(--purple)">${oneRM.toFixed(1)} kg</span></div>`:''}
    <div class="flex-b"><span style="font-size:12px;color:var(--text2)">Fórmula</span><span style="font-family:var(--mono);font-size:11px">VMP = ${V0.toFixed(3)} + ${b.toFixed(5)}×C</span></div>`;
  const pcts = [100,95,90,85,80,75,70,65,60,55,50];
  document.getElementById('fv-pct-table').innerHTML = pcts.map(p => {
    const load = oneRM ? (oneRM*p/100) : null; const vmp = load ? (a+b*load) : null; const ok = vmp && vmp > 0;
    return `<tr><td class="mono-cell">${p}%</td><td class="mono-cell">${load?load.toFixed(1):'--'}</td><td class="mono-cell" style="color:${ok?'var(--neon)':'var(--text3)'}">${ok?vmp.toFixed(3):'--'}</td></tr>`;
  }).join('');
  // Save
  const evalIdx = document.getElementById('fv-eval-num')?.value || '0';
  const fechaFV = document.getElementById('fv-fecha').value || new Date().toISOString().split('T')[0];
  if (!cur.evals) cur.evals = {};
  cur.evals['fv_' + ejId + '_' + evalIdx] = { a, b, r2, F0, V0, Pmax, oneRM, vmpRef, ejercicio:ejName, ejId, fecha:fechaFV, cargas, vmps };
  if (!cur.evalsByDate) cur.evalsByDate = {};
  if (!cur.evalsByDate[fechaFV]) cur.evalsByDate[fechaFV] = {};
  cur.evalsByDate[fechaFV][ejId] = { a, b, r2, F0, V0, Pmax, oneRM, cargas, vmps, ejercicio:ejName };
  cur.lastFV = { a, b, r2, F0, V0, Pmax, oneRM, vmpRef, ejercicio:ejName, ejId, cargas, vmps };
  if (oneRM) cur.last1RM = oneRM;
  atletas = atletas.map(a => a.id === cur.id ? cur : a);
  saveData();
  renderDashSemaforos();
  renderProfileHero();
}

function renderFVHist() {
  if (!cur) return;
  const ejId = document.getElementById('fv-ej')?.value || 'sentadilla';
  const ejName = document.getElementById('fv-ej')?.options[document.getElementById('fv-ej')?.selectedIndex]?.text || ejId;
  const titleEl = document.getElementById('fv-hist-title');
  if (titleEl) titleEl.textContent = ejName;
  const area = document.getElementById('fv-hist-table'); if (!area) return;
  const entries = Object.entries(cur.evals || {})
    .filter(([k]) => k.startsWith('fv_' + ejId + '_'))
    .map(([k, v]) => ({ evalN: +k.split('_').slice(-1)[0]+1, ...v }))
    .sort((a, b) => new Date(b.fecha||0) - new Date(a.fecha||0));
  if (!entries.length) { area.innerHTML = '<p style="font-size:12px;color:var(--text3)">Sin historial para este ejercicio.</p>'; return; }
  area.innerHTML = `<table class="data-table"><thead><tr><th>Eval #</th><th>Fecha</th><th>1RM (kg)</th><th>Fza.Rel.</th><th>R²</th><th>V₀ m/s</th></tr></thead><tbody>` +
    entries.map(e => {
      const fr = e.oneRM && cur.peso ? (e.oneRM/+cur.peso).toFixed(2) : '--';
      const frC = fr !== '--' ? (+fr>=1.5?'var(--neon)':+fr>=1.0?'var(--amber)':'var(--red)') : 'var(--text3)';
      return `<tr><td class="mono-cell">${e.evalN}ra</td><td>${e.fecha||'--'}</td><td class="mono-cell text-neon">${e.oneRM?.toFixed(1)||'--'}</td><td class="mono-cell" style="color:${frC}">${fr}×PC</td><td class="mono-cell ${e.r2>=0.99?'text-neon':e.r2>=0.95?'text-amber':'text-red'}">${e.r2?.toFixed(4)||'--'}</td><td class="mono-cell">${e.V0?.toFixed(3)||'--'}</td></tr>`;
    }).join('') + '</tbody></table>';
}


// ════════════════════════════════════════
//  CMJ CON VELOCIDAD DE DESPEGUE — Perfil F-V balístico
// ════════════════════════════════════════

let _cmjvdCount = 0;

function addCMJVDRow() {
  const tbody = document.getElementById('cmjvd-rows');
  if (!tbody) return;
  const i = _cmjvdCount++;
  const cargas  = [0, 15, 30, 45];
  const defaults = [3.12, 2.9, 2.6, 2.33];
  const tr = document.createElement('tr');
  tr.id = 'cmjvd-row-' + i;
  tr.style.borderBottom = '1px solid var(--border)';
  tr.innerHTML = `
    <td style="padding:4px">
      <input class="inp inp-mono" type="number" step="1" id="cmjvd-kg-${i}"
        placeholder="${cargas[i] ?? i*15}" value="${i < 4 ? cargas[i] : ''}"
        style="font-size:12px;padding:6px 8px" oninput="calcCMJVD()">
    </td>
    <td style="padding:4px">
      <input class="inp inp-mono" type="number" step=".01" id="cmjvd-vd-${i}"
        placeholder="${defaults[i] ?? '0.00'}"
        style="font-size:12px;padding:6px 8px" oninput="calcCMJVD()">
    </td>
    <td style="font-family:var(--mono);font-size:13px;font-weight:700;color:var(--blue);padding:8px 6px" id="cmjvd-jh-${i}">—</td>
    <td style="font-family:var(--mono);font-size:13px;color:var(--amber);padding:8px 6px" id="cmjvd-mom-r-${i}">—</td>
  `;
  tbody.appendChild(tr);
  calcCMJVD();
}

function calcCMJVD() {
  const mc  = parseFloat(document.getElementById('cmjvd-mc')?.value) || 0;
  const resEl = document.getElementById('cmjvd-results');
  if (!mc || !resEl) return;

  const g = 9.81;
  let data = [];

  for (let i = 0; i < _cmjvdCount; i++) {
    const kg = parseFloat(document.getElementById('cmjvd-kg-' + i)?.value);
    const vd = parseFloat(document.getElementById('cmjvd-vd-' + i)?.value);
    const jhEl  = document.getElementById('cmjvd-jh-' + i);
    const momEl = document.getElementById('cmjvd-mom-r-' + i);

    if (!isNaN(kg) && !isNaN(vd) && vd > 0) {
      const jh  = +(vd * vd / (2 * g) * 100).toFixed(1);  // cm
      const totalMc = mc + kg;
      const mom = +(totalMc * vd).toFixed(1);              // kg·m/s
      if (jhEl)  jhEl.textContent  = jh;
      if (momEl) momEl.textContent = mom;
      data.push({ kg, vd, jh, mom, totalMc });
    } else {
      if (jhEl)  jhEl.textContent  = '—';
      if (momEl) momEl.textContent = '—';
    }
  }

  if (data.length < 2) { resEl.style.display = 'none'; return; }

  // Regresión lineal: VD ~ carga extra (kg)
  const n    = data.length;
  const sumX = data.reduce((a, d) => a + d.kg,    0);
  const sumY = data.reduce((a, d) => a + d.vd,    0);
  const sumXY= data.reduce((a, d) => a + d.kg * d.vd, 0);
  const sumX2= data.reduce((a, d) => a + d.kg * d.kg, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const inter = (sumY - slope * sumX) / n;

  // V0 = VD sin carga extra = inter
  // Carga en V=0: kg donde vd = 0 → kg = -inter/slope
  const kgAt0  = +(-inter / slope).toFixed(1);
  // Carga óptima al 2 m/s (umbral potencia balística)
  const kgAt2  = slope !== 0 ? +((2 - inter) / slope).toFixed(1) : null;
  // R²
  const meanY  = sumY / n;
  const ssTot  = data.reduce((a, d) => a + Math.pow(d.vd - meanY, 2), 0);
  const ssRes  = data.reduce((a, d) => a + Math.pow(d.vd - (inter + slope * d.kg), 2), 0);
  const r2     = +(1 - ssRes / ssTot).toFixed(4);

  resEl.style.display = 'block';

  const mkK = (label, val, unit, c) =>
    `<div style="background:var(--bg4);border:1px solid ${c||'var(--neon)'}33;border-radius:10px;padding:10px;text-align:center">
      <div style="font-family:var(--mono);font-size:9px;color:var(--text2);text-transform:uppercase;margin-bottom:3px">${label}</div>
      <div style="font-family:var(--mono);font-size:20px;font-weight:800;color:${c||'var(--neon)'}"> ${val ?? '—'}</div>
      <div style="font-size:9px;color:var(--text3);margin-top:2px">${unit}</div>
    </div>`;

  document.getElementById('cmjvd-kpis').innerHTML =
    mkK('V0 (sin carga)',       inter.toFixed(2),          'm/s', 'var(--neon)') +
    mkK('Carga en V=0',         kgAt0 > 0 ? kgAt0 : '—', 'kg', 'var(--red)') +
    (kgAt2 !== null && kgAt2 > 0 ? mkK('Carga óptima 2m/s', kgAt2, 'kg extra', 'var(--amber)') : '') +
    mkK('R²', r2, r2 >= 0.95 ? '✓ Excelente ajuste' : r2 >= 0.90 ? 'Buen ajuste' : 'Revisar datos', r2 >= 0.95 ? 'var(--neon)' : r2 >= 0.90 ? 'var(--amber)' : 'var(--red)');

  document.getElementById('cmjvd-pendiente').textContent    = slope.toFixed(4);
  document.getElementById('cmjvd-interseccion').textContent = inter.toFixed(4);

  // Tabla % → carga → VD estimada
  const pcts = [40, 50, 60, 70, 80, 90, 100];
  const maxKg = kgAt0 > 0 ? kgAt0 : 100;
  let thtml = `<thead><tr style="border-bottom:1px solid var(--border)">
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">% carga máx</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">Carga extra (kg)</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--neon)">VD estimada (m/s)</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--blue)">Altura estimada (cm)</th>
  </tr></thead><tbody>`;

  pcts.forEach(pct => {
    const kg  = +(maxKg * pct / 100).toFixed(1);
    const vdE = +(inter + slope * kg).toFixed(2);
    const jhE = vdE > 0 ? +(vdE * vdE / (2 * 9.81) * 100).toFixed(1) : 0;
    const col = vdE >= 2 ? 'var(--neon)' : vdE >= 1.5 ? 'var(--amber)' : 'var(--red)';
    thtml += `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:5px;font-family:var(--mono);font-weight:600;color:var(--text2)">${pct}%</td>
      <td style="padding:5px;font-family:var(--mono)">${kg}</td>
      <td style="padding:5px;font-family:var(--mono);font-weight:700;color:${col}">${vdE > 0 ? vdE : '—'}</td>
      <td style="padding:5px;font-family:var(--mono);color:var(--blue)">${jhE > 0 ? jhE : '—'}</td>
    </tr>`;
  });
  thtml += '</tbody>';
  document.getElementById('cmjvd-pct-table').innerHTML = thtml;
}

// ════════════════════════════════════════
//  CARGA LANZAMIENTOS PRESS BANCA
// ════════════════════════════════════════

let _pbCount = 0;

function addJugadorPB() {
  const tbody = document.getElementById('pb-rows');
  if (!tbody) return;
  const i = _pbCount++;
  const pct = +document.getElementById('pb-pct')?.value || 40;
  const tr = document.createElement('tr');
  tr.id = 'pb-row-' + i;
  tr.style.borderBottom = '1px solid var(--border)';
  tr.innerHTML = `
    <td style="padding:6px;font-family:var(--mono);font-weight:600;color:var(--text2)">${i + 1}</td>
    <td style="padding:4px">
      <input class="inp inp-mono" type="number" step=".5" id="pb-rm-${i}"
        placeholder="90" style="font-size:12px;padding:6px 8px" oninput="calcLanzamientosPB()">
    </td>
    <td style="font-family:var(--mono);font-size:13px;color:var(--amber);padding:8px 6px" id="pb-pct-r-${i}">—</td>
    <td style="font-family:var(--mono);font-size:16px;font-weight:700;color:var(--neon);padding:8px 6px" id="pb-carga-${i}">—</td>
  `;
  tbody.appendChild(tr);
}

function calcLanzamientosPB() {
  const pct = +document.getElementById('pb-pct')?.value || 40;
  let rms = [], cargas = [];

  for (let i = 0; i < _pbCount; i++) {
    const rm = parseFloat(document.getElementById('pb-rm-' + i)?.value);
    const pctEl   = document.getElementById('pb-pct-r-' + i);
    const cargaEl = document.getElementById('pb-carga-' + i);
    if (!isNaN(rm) && rm > 0) {
      const carga = Math.round(rm * pct / 100);
      if (pctEl)   pctEl.textContent   = pct + '%';
      if (cargaEl) { cargaEl.textContent = carga; cargaEl.style.color = 'var(--neon)'; }
      rms.push(rm); cargas.push(carga);
    } else {
      if (pctEl)   pctEl.textContent   = '—';
      if (cargaEl) cargaEl.textContent = '—';
    }
  }

  const sumEl = document.getElementById('pb-summary');
  const kpiEl = document.getElementById('pb-kpis');
  if (!sumEl || !kpiEl || rms.length === 0) { if(sumEl) sumEl.style.display='none'; return; }

  sumEl.style.display = 'block';
  const rmMax  = Math.max(...rms).toFixed(1);
  const rmMin  = Math.min(...rms).toFixed(1);
  const rmProm = (rms.reduce((a,b)=>a+b,0) / rms.length).toFixed(1);
  const cMax   = Math.max(...cargas);
  const cMin   = Math.min(...cargas);
  const cProm  = Math.round(cargas.reduce((a,b)=>a+b,0) / cargas.length);

  const mkK = (label, val, unit, c) =>
    `<div style="background:var(--bg4);border:1px solid ${c||'var(--neon)'}33;border-radius:10px;padding:10px;text-align:center">
      <div style="font-family:var(--mono);font-size:9px;color:var(--text2);text-transform:uppercase;margin-bottom:3px">${label}</div>
      <div style="font-family:var(--mono);font-size:18px;font-weight:800;color:${c||'var(--neon)'}"> ${val}</div>
      <div style="font-size:9px;color:var(--text3);margin-top:2px">${unit}</div>
    </div>`;

  kpiEl.innerHTML =
    mkK('Jugadores', rms.length, 'con RM cargado', 'var(--text2)') +
    mkK('RM promedio', rmProm, 'kg', 'var(--blue)') +
    mkK('RM máx / mín', rmMax + ' / ' + rmMin, 'kg', 'var(--text2)') +
    mkK('Carga ' + pct + '% promedio', cProm, 'kg', 'var(--neon)') +
    mkK('Rango cargas', cMin + '–' + cMax, 'kg', 'var(--amber)');
}

// Init: arrancar con filas vacías al abrir la tab
function initFVTools() {
  if (_cmjvdCount === 0) { for (let i = 0; i < 4; i++) addCMJVDRow(); }
  if (_pbCount === 0)    { for (let i = 0; i < 5; i++) addJugadorPB(); }
}

// ══════════════════════════════════════════════════════
//  SALTOS
// ══════════════════════════════════════════════════════

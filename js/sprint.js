// ── GLOBALS (compartidos entre módulos) ──
// cur, atletas, kineState, etc. se definen en app.js
// Este archivo asume que app.js ya fue cargado

function calcSprintBench(){
  const sp10=+document.getElementById('sp-10')?.value||0;
  const sp30=+document.getElementById('sp-30')?.value||0;
  const d505=+document.getElementById('sp-505d')?.value||0,i505=+document.getElementById('sp-505i')?.value||0;
  if(d505&&i505){const a=Math.abs(d505-i505)/Math.max(d505,i505)*100;const c=a>10?'var(--red)':a>5?'var(--amber)':'var(--neon)';document.getElementById('sp-505-asim').innerHTML=`<div style="margin-top:8px;font-size:12px;color:${c}">Asimetría 505: ${a.toFixed(1)}% ${a>10?'🔴':a>5?'⚠️':'✓'}</div>`;}
  const area=document.getElementById('sprint-bench-area'); if(!cur||!area)return;
  const deporte=cur.deporte||'',puesto=cur.puesto||'';
  const rd=RUGBY[puesto];
  const norms=SPRINT_NORMS[deporte]?.[rd?.tipo||'general']||SPRINT_NORMS[deporte]?.general;
  if(!norms){area.innerHTML='<div class="card"><div class="card-body" style="font-size:12px;color:var(--text3)">Sin benchmarks para este deporte. Disponibles: Rugby, Fútbol, Básquet.</div></div>';return;}
  const cats=['Amateur','Competitivo','Elite'];
  let html=`<div class="card"><div class="card-header"><h3>Benchmark -- ${deporte}${puesto?' · '+puesto:''}</h3></div><div class="card-body">`;
  if(sp10&&norms.sp10){
    html+=`<div class="mb-12"><div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:8px;font-family:var(--mono);text-transform:uppercase">10m Sprint · ${sp10}s</div>`;
    norms.sp10.forEach((ref,i)=>{const delta=(sp10-ref).toFixed(2);const b=sp10<=ref;const c=b?'var(--neon)':i===2?'var(--red)':'var(--amber)';html+=`<div class="flex-b mb-4"><span style="font-size:11px;color:var(--text2)">${cats[i]}: ${ref}s</span><span style="font-family:var(--mono);color:${c};font-size:11px;font-weight:700">${b?'✓ ':'+'}${delta}s</span></div><div class="prog-wrap"><div class="prog-bar" style="width:${Math.min(100,ref/sp10*100).toFixed(0)}%;background:${c}"></div></div>`;});
    const eliteRef=norms.sp10[2];
    html+=`<div style="margin-top:8px;padding:10px;background:var(--bg4);border-radius:var(--r);border:1px solid var(--border)"><div style="font-size:11px;font-weight:700;margin-bottom:4px">${sp10<=eliteRef?'✅ Supera el estándar elite':'Distancia al nivel elite'}</div><div style="font-family:var(--mono);color:${sp10<=eliteRef?'var(--neon)':'var(--amber)'};font-size:20px;font-weight:800">${sp10<=eliteRef?'−':'+'} ${Math.abs(sp10-eliteRef).toFixed(2)}s</div></div></div>`;
  }
  html+='</div></div>';area.innerHTML=html;
}

function saveSprint(){
  if(!cur)return;
  const evalIdx=document.getElementById('sprint-eval-num').value;
  const fecha=document.getElementById('sprint-fecha').value||new Date().toISOString().split('T')[0];
  if(!cur.evals)cur.evals={};
  cur.evals['sprint_'+evalIdx]={sp10:+document.getElementById('sp-10').value||null,sp20:+document.getElementById('sp-20').value||null,sp30:+document.getElementById('sp-30').value||null,vmax:+document.getElementById('sp-vmax').value||null,ttest:+document.getElementById('sp-ttest').value||null,d505:+document.getElementById('sp-505d').value||null,i505:+document.getElementById('sp-505i').value||null,fecha};
  atletas=atletas.map(a=>a.id===cur.id?cur:a);saveData();
}

// ══════════════════════════════════════════════════════
//  FMS -- CALIDAD DE MOVIMIENTO
// ══════════════════════════════════════════════════════

function loadSlot(input,slotId){
  if(!input.files.length)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const slot=document.getElementById(slotId); if(!slot)return;
    let img=slot.querySelector('img');
    if(!img){img=document.createElement('img');slot.appendChild(img);}
    img.src=e.target.result;img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit';
    slot.style.border='1px solid var(--neon)';
    const txt=slot.querySelector('div');if(txt)txt.style.display='none';
  };
  reader.readAsDataURL(input.files[0]);
}

function setFMS(btn,type){
  btn.parentElement.querySelectorAll('.fms-btn').forEach(b=>{b.classList.remove('yes','no');});
  btn.classList.add(type);
  ['ohs','sd'].forEach(id=>{
    const container=document.getElementById(id+'-checks');if(!container)return;
    const yesCount=container.querySelectorAll('.fms-btn.yes').length;
    const total=container.querySelectorAll('.fms-check').length;
    const scored=[...container.querySelectorAll('.fms-check')].filter(r=>r.querySelector('.fms-btn.yes')||r.querySelector('.fms-btn.no')).length;
    const scoreEl=document.getElementById(id+'-score');
    if(scoreEl&&scored>0){
      const pct=(yesCount/total*100).toFixed(0);
      const c=+pct>=80?'var(--neon)':+pct>=50?'var(--amber)':'var(--red)';
      scoreEl.innerHTML=`<div style="display:flex;align-items:center;gap:10px;padding:10px;background:${c}11;border:1px solid ${c}33;border-radius:var(--r)"><div style="font-family:var(--mono);font-size:22px;font-weight:800;color:${c}">${yesCount}/${total}</div><div style="font-size:12px;color:${c};font-weight:700">${+pct>=80?'✅ Buena calidad':+pct>=50?'⚠️ Compensaciones':'🔴 Déficits significativos'}</div></div>`;
    }
  });
}

function calcValgo(){
  const d=+document.getElementById('valgo-d')?.value||0,i=+document.getElementById('valgo-i')?.value||0;
  const el=document.getElementById('valgo-result');if(!el)return;
  const parts=[];
  if(d)parts.push(`D: <b style="color:${d>10?'var(--red)':'var(--neon)'}">${d}°</b> ${d>10?'⚠️ >10°':''}`);
  if(i)parts.push(`I: <b style="color:${i>10?'var(--red)':'var(--neon)'}">${i}°</b> ${i>10?'⚠️ >10°':''}`);
  el.innerHTML=`<div style="font-size:12px;margin-top:8px">${parts.join(' · ')}</div>`;
}

function saveFMS(){
  if(!cur)return;
  const ohsCriterios=[...document.getElementById('ohs-checks')?.querySelectorAll('.fms-btn.yes,.fms-btn.no')||[]].map(b=>b.classList.contains('yes')?'si':'no');
  const sdCriterios=[...document.getElementById('sd-checks')?.querySelectorAll('.fms-btn.yes,.fms-btn.no')||[]].map(b=>b.classList.contains('yes')?'si':'no');
  const fecha=new Date().toISOString().split('T')[0];
  if(!cur.evals)cur.evals={};
  cur.evals['fms_'+fecha]={fecha,ohs:{criterios:ohsCriterios,obs:document.getElementById('ohs-obs')?.value},sd:{criterios:sdCriterios,valgoD:+document.getElementById('valgo-d')?.value||0,valgoI:+document.getElementById('valgo-i')?.value||0,obs:document.getElementById('sd-obs')?.value}};
  atletas=atletas.map(a=>a.id===cur.id?cur:a);saveData();
}

// ══════════════════════════════════════════════════════
//  FATIGA
// ══════════════════════════════════════════════════════

// ════════════════════════════════════════
//  TRINEO — Perfil F-V Horizontal
// ════════════════════════════════════════

let _trineoCargaCount = 0;
let _trineoCargas = []; // [{kg, tiempo}]

function addTrineoCarga() {
  const tbody = document.getElementById('trineo-rows');
  if (!tbody) return;
  const i = _trineoCargaCount++;
  const isFirst = i === 0;
  const tr = document.createElement('tr');
  tr.id = 'trineo-row-' + i;
  tr.style.borderBottom = '1px solid var(--border)';
  tr.innerHTML = `
    <td style="padding:4px">
      <input class="inp inp-mono" type="number" step="1" id="trineo-kg-${i}" placeholder="${isFirst ? '0' : i*15}"
        value="${isFirst ? 0 : ''}"
        style="font-size:12px;padding:6px 8px" oninput="calcTrineo()">
    </td>
    <td style="padding:4px">
      <input class="inp inp-mono" type="number" step=".01" id="trineo-t-${i}" placeholder="${isFirst ? '1.80' : (1.8 + i*0.5).toFixed(2)}"
        style="font-size:12px;padding:6px 8px" oninput="calcTrineo()">
    </td>
    <td style="font-family:var(--mono);font-size:13px;font-weight:700;color:var(--neon);padding:8px 6px" id="trineo-vel-${i}">—</td>
    <td style="font-family:var(--mono);font-size:13px;padding:8px 6px" id="trineo-per-${i}">—</td>
    <td style="font-family:var(--mono);font-size:13px;color:var(--blue);padding:8px 6px" id="trineo-etto-${i}">—</td>
  `;
  tbody.appendChild(tr);
  calcTrineo();
}

function calcTrineo() {
  const dist = +document.getElementById('trineo-dist')?.value || 10;
  const mc   = +document.getElementById('trineo-mc')?.value || 0;

  // Collect all rows
  let data = [];
  for (let i = 0; i < _trineoCargaCount; i++) {
    const kg = parseFloat(document.getElementById('trineo-kg-' + i)?.value);
    const t  = parseFloat(document.getElementById('trineo-t-'  + i)?.value);
    if (!isNaN(kg) && !isNaN(t) && t > 0) {
      const vel = +(dist / t).toFixed(3);
      data.push({ kg, t, vel, i });
    }
  }

  // Update velocity cells
  const v0row = data.find(d => d.kg === 0);
  const v0    = v0row ? v0row.vel : null;

  data.forEach(d => {
    const velEl = document.getElementById('trineo-vel-' + d.i);
    const perEl = document.getElementById('trineo-per-' + d.i);
    const ettoEl= document.getElementById('trineo-etto-'+ d.i);
    if (velEl) velEl.textContent = d.vel.toFixed(2);

    if (v0 && d.kg > 0) {
      const pct = +((1 - d.vel / v0) * 100).toFixed(1);
      const col = pct <= 10 ? 'var(--neon)' : pct <= 25 ? 'var(--amber)' : 'var(--red)';
      if (perEl)  { perEl.textContent = pct + '%'; perEl.style.color = col; }
      // Vel etto = vel a % pérdida específico — aquí mostramos vel real
      if (ettoEl) ettoEl.textContent = d.vel.toFixed(2);
    } else {
      if (perEl)  perEl.textContent = v0 ? '—' : '';
      if (ettoEl) ettoEl.textContent = v0 ? d.vel.toFixed(2) : '';
    }
  });

  const resEl = document.getElementById('trineo-results');
  if (!resEl || data.length < 2) { if(resEl) resEl.style.display='none'; return; }

  // Regresión lineal velocidad ~ carga
  const n   = data.length;
  const sumX = data.reduce((a, d) => a + d.kg, 0);
  const sumY = data.reduce((a, d) => a + d.vel, 0);
  const sumXY= data.reduce((a, d) => a + d.kg * d.vel, 0);
  const sumX2= data.reduce((a, d) => a + d.kg * d.kg, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const inter = (sumY - slope * sumX) / n;

  // F0 y V0 del perfil F-V horizontal
  // V0 = velocidad sin carga (extrapolada)
  // F0 = fuerza en V=0 → F0 = masa * (inter / |slope|) approx
  // Pmax = F0 * V0 / 4
  const V0est = inter; // m/s — velocidad extrapolada sin carga
  // Usando la lógica de Samozino: carga óptima ≈ -inter/slope * 0.5
  const kgV0  = +(- inter / slope).toFixed(1); // kg en que vel = 0
  const Pmax  = mc ? +(mc * V0est * Math.abs(slope) * V0est / 4).toFixed(0) : null;
  const optKg = +(kgV0 / 2).toFixed(1); // carga óptima ≈ mitad de kgV0

  resEl.style.display = 'block';

  // KPIs
  const mkK = (label, val, unit, c) =>
    `<div style="background:var(--bg4);border:1px solid ${c||'var(--neon)'}33;border-radius:10px;padding:10px;text-align:center">
      <div style="font-family:var(--mono);font-size:9px;color:var(--text2);text-transform:uppercase;margin-bottom:3px">${label}</div>
      <div style="font-family:var(--mono);font-size:20px;font-weight:800;color:${c||'var(--neon)'}"> ${val ?? '—'}</div>
      <div style="font-size:9px;color:var(--text3);margin-top:2px">${unit}</div>
    </div>`;

  document.getElementById('trineo-kpis').innerHTML =
    mkK('V0 (sin carga)', V0est.toFixed(2), 'm/s', 'var(--neon)') +
    mkK('Kg en V=0', kgV0 > 0 ? kgV0 : '—', 'kg', 'var(--red)') +
    mkK('Carga óptima', optKg > 0 ? optKg : '—', 'kg', 'var(--amber)') +
    (Pmax ? mkK('Pmax aprox.', Pmax, 'W', 'var(--blue)') : '');

  document.getElementById('trineo-pendiente').textContent    = slope.toFixed(4);
  document.getElementById('trineo-interseccion').textContent = inter.toFixed(4);

  // Tabla % pérdida de velocidad → kg sugeridos (5%, 10%, 15%, 20%, 25%, 35%)
  const pcts = [5, 10, 15, 20, 25, 35];
  const labels = { 5:'baja', 10:'baja', 15:'media', 20:'media', 25:'alta', 35:'alta' };
  let thtml = `<div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:var(--text2);margin-bottom:6px">Kg por % pérdida de velocidad</div>
    <table style="border-collapse:collapse;font-size:11px;width:100%">
    <thead><tr style="border-bottom:1px solid var(--border)">
      <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">% pér. vel</th>
      <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">Vel etto (m/s)</th>
      <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">Carga trineo (kg)</th>
      <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">Zona</th>
    </tr></thead><tbody>`;

  pcts.forEach(pct => {
    const velEtto = +(V0est * (1 - pct/100)).toFixed(2);
    const kgTrineo= Math.max(0, +((velEtto - inter) / slope).toFixed(1));
    const zona = pct <= 10 ? 'baja' : pct <= 20 ? 'media' : 'alta';
    const colZ = pct <= 10 ? 'var(--neon)' : pct <= 20 ? 'var(--amber)' : 'var(--red)';
    thtml += `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:5px;font-family:var(--mono);font-weight:700;color:${colZ}">${pct}%</td>
      <td style="padding:5px;font-family:var(--mono)">${velEtto}</td>
      <td style="padding:5px;font-family:var(--mono);color:var(--blue)">${kgTrineo}</td>
      <td style="padding:5px;font-size:10px;color:${colZ}">${zona}</td>
    </tr>`;
  });
  thtml += '</tbody></table>';
  document.getElementById('trineo-tabla-pct').innerHTML = thtml;
}

// Init trineo con 4 filas vacías al llamar desde HTML
function initTrineo() {
  if (_trineoCargaCount > 0) return;
  for (let i = 0; i < 4; i++) addTrineoCarga();
}

// ════════════════════════════════════════
//  ASR HIIT
// ════════════════════════════════════════

function setHIITTab(tab, btn) {
  document.getElementById('hiit-asr').style.display = tab === 'asr' ? 'block' : 'none';
  document.getElementById('hiit-ift').style.display = tab === 'ift' ? 'block' : 'none';
  document.querySelectorAll('#hiit-tab-asr-btn, #hiit-tab-ift-btn').forEach(b => {
    b.className = 'btn btn-ghost btn-sm'; b.style.fontSize = '11px';
  });
  btn.className = 'btn btn-neon btn-sm'; btn.style.fontSize = '11px';
  if (tab === 'ift') buildIFTRefTable();
}

function calcASR() {
  const distSp  = +document.getElementById('asr-dist')?.value      || 10;
  const tSp     = +document.getElementById('asr-tiempo')?.value    || 0;
  const distVO2 = +document.getElementById('asr-dist-vo2')?.value  || 0;
  const tVO2    = +document.getElementById('asr-tiempo-vo2')?.value || 0;
  const pctLoss = +document.getElementById('asr-pct-loss')?.value  || 35;
  const resEl   = document.getElementById('asr-results');
  if (!tSp || !distVO2 || !tVO2 || !resEl) { if(resEl) resEl.style.display='none'; return; }

  const velMax  = +(distSp / tSp).toFixed(3);          // m/s
  const velMaxKmh = +(velMax * 3.6).toFixed(2);         // km/h
  const vVO2    = +(distVO2 / tVO2).toFixed(3);          // m/s
  const ASR     = +(velMax - vVO2).toFixed(3);           // m/s — diferencia
  const pctASR  = +(ASR / velMax * 100).toFixed(1);      // %ASR
  const velEtto = +(velMax * (1 - pctLoss/100)).toFixed(3); // velocidad de entrenamiento

  resEl.style.display = 'block';

  const mkK = (label, val, unit, c) =>
    `<div style="background:var(--bg4);border:1px solid ${c||'var(--neon)'}33;border-radius:10px;padding:10px;text-align:center">
      <div style="font-family:var(--mono);font-size:9px;color:var(--text2);text-transform:uppercase;margin-bottom:3px">${label}</div>
      <div style="font-family:var(--mono);font-size:20px;font-weight:800;color:${c||'var(--neon)'}"> ${val}</div>
      <div style="font-size:9px;color:var(--text3);margin-top:2px">${unit}</div>
    </div>`;

  document.getElementById('asr-kpis').innerHTML =
    mkK('Vel máx sprint', velMax.toFixed(2), 'm/s · ' + velMaxKmh + ' km/h', 'var(--neon)') +
    mkK('vVO2 máx', vVO2.toFixed(2), 'm/s', 'var(--blue)') +
    mkK('ASR', ASR.toFixed(2), 'm/s', 'var(--amber)') +
    mkK('%ASR', pctASR, '% de vel máx', 'var(--amber)') +
    mkK('Vel etto (' + pctLoss + '% pér.)', velEtto.toFixed(2), 'm/s', 'var(--red)');

  // Tabla de prescripción — tipos HIIT
  const tipos = [
    { tipo: 'HIIT corto', formato: 'extensivo',  pctIFT: 85,  pctASR: 5,  dens: '1.5:1', ej: '15 × 10s', series: '4–8', vol: '1000–2000' },
    { tipo: 'HIIT normal', formato: 'normal',    pctIFT: 100, pctASR: 15, dens: '1:1',   ej: '12 × 12s', series: '2–4', vol: '1200–2000' },
    { tipo: 'HIIT intensivo', formato: 'intensivo', pctIFT: 110, pctASR: 25, dens: '1:2', ej: '10 × 20s', series: '2–3', vol: '1000–1500' },
    { tipo: 'Tempo', formato: 'tempo',            pctIFT: 120, pctASR: 35, dens: '1:3',  ej: '10 × 30s', series: '1–2', vol: '800–1200'  },
  ];

  let thtml = `<thead><tr style="border-bottom:1px solid var(--border)">
    <th style="text-align:left;padding:6px;font-size:9px;color:var(--text3)">Tipo</th>
    <th style="text-align:left;padding:6px;font-size:9px;color:var(--text3)">% IFT</th>
    <th style="text-align:left;padding:6px;font-size:9px;color:var(--neon)">Vel etto (m/s)</th>
    <th style="text-align:left;padding:6px;font-size:9px;color:var(--text3)">% ASR</th>
    <th style="text-align:left;padding:6px;font-size:9px;color:var(--text3)">Densidad</th>
    <th style="text-align:left;padding:6px;font-size:9px;color:var(--text3)">Ej. formato</th>
    <th style="text-align:left;padding:6px;font-size:9px;color:var(--text3)">Series</th>
    <th style="text-align:left;padding:6px;font-size:9px;color:var(--text3)">Vol (m)</th>
  </tr></thead><tbody>`;

  tipos.forEach(t => {
    const velT = +(vVO2 * t.pctIFT / 100).toFixed(2);
    const cols = t.pctIFT <= 90 ? 'var(--neon)' : t.pctIFT <= 110 ? 'var(--amber)' : 'var(--red)';
    thtml += `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:6px;font-weight:600;font-size:11px">${t.tipo}</td>
      <td style="padding:6px;font-family:var(--mono);color:${cols}">${t.pctIFT}%</td>
      <td style="padding:6px;font-family:var(--mono);font-weight:700;color:var(--neon)">${velT}</td>
      <td style="padding:6px;font-family:var(--mono)">${t.pctASR}%</td>
      <td style="padding:6px;font-family:var(--mono)">${t.dens}</td>
      <td style="padding:6px;font-size:10px">${t.ej}</td>
      <td style="padding:6px;font-size:10px">${t.series}</td>
      <td style="padding:6px;font-family:var(--mono)">${t.vol}</td>
    </tr>`;
  });
  thtml += '</tbody>';
  document.getElementById('asr-plan-table').innerHTML = thtml;

  // Referencia de intensidades
  const refs = [
    { tipo: 'HIIT corto extensivo', pctIFT: 85, pctASR: 5, dens: '1.5:1' },
    { tipo: 'Normal',               pctIFT: 100, pctASR: 15, dens: '1:1' },
    { tipo: 'Intensivo',            pctIFT: 110, pctASR: 25, dens: '1:2' },
    { tipo: 'Tempo',                pctIFT: 120, pctASR: 35, dens: '1:3' },
  ];
  document.getElementById('asr-ref-grid').innerHTML = refs.map(r =>
    `<div style="padding:6px 8px;background:var(--bg3);border-radius:6px">
      <div style="font-weight:600;font-size:11px">${r.tipo}</div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--text2)">${r.pctIFT}% IFT · ${r.pctASR}% ASR · Dens ${r.dens}</div>
    </div>`
  ).join('');
}

// ════════════════════════════════════════
//  IFT HIIT
// ════════════════════════════════════════

function calcIFT() {
  const nivel   = +document.getElementById('ift-nivel')?.value  || 0;
  const pct     = +document.getElementById('ift-pct')?.value    || 115;
  const tiempo  = +document.getElementById('ift-tiempo')?.value || 10;
  const pausa   = +document.getElementById('ift-pausa')?.value  || 25;
  const reps    = +document.getElementById('ift-reps')?.value   || 15;
  const series  = +document.getElementById('ift-series')?.value || 1;
  const resEl   = document.getElementById('ift-results');
  if (!nivel || !resEl) { if(resEl) resEl.style.display='none'; return; }

  // VIFT ≈ nivel * 0.5 * (1/3) + base
  // Fórmula empírica IFT Leger-Lambert: VIFT (km/h) = 6 + 0.5 * nivel  → en m/s
  const vIFTkmh  = 6 + 0.5 * nivel;                          // km/h aproximado
  const vIFT     = +(vIFTkmh / 3.6).toFixed(3);              // m/s
  const velEtto  = +(vIFT * pct / 100).toFixed(3);           // m/s al %
  const distEtto = +(velEtto * tiempo).toFixed(1);            // m por rep
  const macroS   = +(tiempo + pausa).toFixed(0);              // s macro (1 rep)
  const segSerie = +(macroS * reps).toFixed(0);               // s por serie
  const volSerie = +(distEtto * reps).toFixed(0);             // m por serie
  const volTotal = +(volSerie * series).toFixed(0);            // m total
  const tTotal   = +((segSerie * series) / 60).toFixed(2);    // min total

  resEl.style.display = 'block';

  const mkK = (label, val, unit, c) =>
    `<div style="background:var(--bg4);border:1px solid ${c||'var(--neon)'}33;border-radius:10px;padding:10px;text-align:center">
      <div style="font-family:var(--mono);font-size:9px;color:var(--text2);text-transform:uppercase;margin-bottom:3px">${label}</div>
      <div style="font-family:var(--mono);font-size:18px;font-weight:800;color:${c||'var(--neon)'}"> ${val}</div>
      <div style="font-size:9px;color:var(--text3);margin-top:2px">${unit}</div>
    </div>`;

  document.getElementById('ift-kpis').innerHTML =
    mkK('VIFT',        vIFT.toFixed(2),   'm/s · ' + vIFTkmh.toFixed(1) + ' km/h', 'var(--blue)') +
    mkK('Vel etto',    velEtto.toFixed(2), 'm/s al ' + pct + '%', 'var(--neon)') +
    mkK('Dist/rep',    distEtto,           'm', 'var(--neon)') +
    mkK('Seg/serie',   segSerie,           's (' + (segSerie/60).toFixed(1) + ' min)', 'var(--text2)') +
    mkK('Vol/serie',   volSerie,           'm', 'var(--amber)') +
    mkK('Vol total',   volTotal,           'm · ' + tTotal + ' min', 'var(--amber)');

  document.getElementById('ift-macro').innerHTML =
    `Macro: ${macroS}s · ${reps} rep/serie · ${series} serie(s) · Vol total: ${volTotal}m en ${tTotal} min`;
}

function buildIFTRefTable() {
  const el = document.getElementById('ift-ref-table'); if(!el || el.innerHTML) return;
  const niveles = [13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5];
  let html = `<thead><tr style="border-bottom:1px solid var(--border)">
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">Nivel</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">% VIFT</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--neon)">Vel etto (m/s)</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">Tiempo (s)</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">Dist (m)</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">Pausa</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--amber)">Seg/serie</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--amber)">Vol (m)</th>
    <th style="text-align:left;padding:5px;font-size:9px;color:var(--text3)">T total (min)</th>
  </tr></thead><tbody>`;

  niveles.forEach(n => {
    const vIFT  = (6 + 0.5 * n) / 3.6;
    const vel   = +(vIFT * 1.15).toFixed(2);
    const dist  = +(vel * 10).toFixed(1);
    const macro = 10 + 25;
    const seg   = macro * 15;
    const vol   = +(dist * 15).toFixed(0);
    const tMin  = (seg / 60).toFixed(2);
    html += `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:5px;font-family:var(--mono);font-weight:600;color:var(--neon)">${n}</td>
      <td style="padding:5px;font-family:var(--mono)">115</td>
      <td style="padding:5px;font-family:var(--mono);font-weight:700;color:var(--neon)">${vel}</td>
      <td style="padding:5px;font-family:var(--mono)">10</td>
      <td style="padding:5px;font-family:var(--mono)">${dist}</td>
      <td style="padding:5px;font-family:var(--mono)">25</td>
      <td style="padding:5px;font-family:var(--mono);color:var(--amber)">${seg}</td>
      <td style="padding:5px;font-family:var(--mono);color:var(--amber)">${vol}</td>
      <td style="padding:5px;font-family:var(--mono)">${tMin}</td>
    </tr>`;
  });
  html += '</tbody>';
  el.innerHTML = html;
}

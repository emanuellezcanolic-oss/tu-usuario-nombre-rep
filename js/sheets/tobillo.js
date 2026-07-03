// sheets/tobillo.js v2 — Tobillo módulo completo
// Tabs: Esguince | Sindesmosis | Aquiles | Funcional | Escalas | Informe

// ─── ESGUINCE ───────────────────────────────────────────────────────────────
function buildTobilloEsguince() {
  const lat = document.getElementById('tob-esguince-lat');
  if (!lat || lat.innerHTML) return;

  const cardHTML = arr => arr.map(t => `
    <div class="card mb-8">
      <div class="card-header">
        <h3>${t.name}</h3>
        <span class="tag tag-r" style="font-size:9px">${t.sub}</span>
      </div>
      <div class="card-body">
        <div style="font-size:9px;color:var(--text3);margin-bottom:6px">${t.ref}</div>
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D</div><div style="display:flex;gap:6px">
            <button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button>
            <button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button>
          </div></div>
          <div><div class="il mb-4">I</div><div style="display:flex;gap:6px">
            <button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button>
            <button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button>
          </div></div>
        </div>
      </div>
    </div>`).join('');

  lat.innerHTML = cardHTML(TOBILLO_LIG_LAT);

  const med = document.getElementById('tob-esguince-med');
  if (med) med.innerHTML = cardHTML(TOBILLO_LIG_MED);

  const ott = document.getElementById('tob-ottawa-items');
  if (ott) ott.innerHTML = TOBILLO_OTTAWA_ITEMS.map(item => `
    <label style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;cursor:pointer;font-size:11px;border-bottom:1px solid var(--border)">
      <input type="checkbox" id="${item.id}" style="margin-top:2px;flex-shrink:0" onchange="_updateOttawa()">
      <span><strong style="font-size:9px;color:var(--text3)">[${item.zona.toUpperCase()}]</strong> ${item.label}</span>
    </label>`).join('');
}

function _updateOttawa() {
  const tobItems = TOBILLO_OTTAWA_ITEMS.filter(i => i.zona === 'tobillo' && document.getElementById(i.id)?.checked);
  const pieItems = TOBILLO_OTTAWA_ITEMS.filter(i => i.zona === 'pie' && document.getElementById(i.id)?.checked);
  const res = document.getElementById('tob-ottawa-result');
  if (!res) return;
  if (!tobItems.length && !pieItems.length) {
    res.innerHTML = '<span style="color:var(--text3)">Marcar ítems para interpretar</span>';
    return;
  }
  let html = '';
  if (tobItems.length) html += `<div style="color:var(--red);font-weight:700">⚠️ Rx TOBILLO indicada — Polzer 2012 Sn 98%</div>`;
  if (pieItems.length) html += `<div style="color:var(--red);font-weight:700;margin-top:4px">⚠️ Rx PIE indicada (navicular/5°MT)</div>`;
  if (!tobItems.length && !pieItems.length) html = '<span style="color:var(--neon)">✓ Ottawa negativo</span>';
  res.innerHTML = html;
}

// ─── SINDESMOSIS ─────────────────────────────────────────────────────────────
function buildTobilloSindesmosis() {
  const c = document.getElementById('tob-sindes-fields');
  if (!c || c.innerHTML) return;
  c.innerHTML = TOBILLO_SINDES_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header">
        <h3>${t.name}</h3>
        <span class="tag tag-r" style="font-size:9px">${t.sub}</span>
      </div>
      <div class="card-body">
        <div style="font-size:9px;color:var(--text3);margin-bottom:6px">${t.ref}</div>
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D</div><div style="display:flex;gap:6px">
            <button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button>
            <button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button>
          </div></div>
          <div><div class="il mb-4">I</div><div style="display:flex;gap:6px">
            <button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button>
            <button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button>
          </div></div>
        </div>
      </div>
    </div>`).join('');
}

// ─── AQUILES ─────────────────────────────────────────────────────────────────
function buildTobilloAquiles() {
  const c = document.getElementById('tob-aquiles-fields');
  if (!c || c.innerHTML) return;
  c.innerHTML = TOBILLO_AQUILES_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header">
        <h3>${t.name}</h3>
        <span class="tag tag-r" style="font-size:9px">${t.sub}</span>
      </div>
      <div class="card-body">
        <div style="font-size:9px;color:var(--text3);margin-bottom:6px">${t.ref}</div>
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D</div><div style="display:flex;gap:6px">
            <button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button>
            <button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button>
          </div></div>
          <div><div class="il mb-4">I</div><div style="display:flex;gap:6px">
            <button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button>
            <button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button>
          </div></div>
        </div>
      </div>
    </div>`).join('');
}

function _calcSHR() {
  const d = parseInt(document.getElementById('tob-shr-d')?.value) || 0;
  const i = parseInt(document.getElementById('tob-shr-i')?.value) || 0;
  const el = document.getElementById('tob-shr-result');
  if (!el || (!d && !i)) return;
  const getC = v => v >= 25 ? 'var(--neon)' : v >= 15 ? 'var(--amber)' : 'var(--red)';
  const getS = v => v >= 25 ? '✓ Normal' : v >= 15 ? '⚠️ Déficit leve' : '🔴 Déficit severo';
  let txt = '';
  if (d) txt += `D: <span style="color:${getC(d)};font-weight:700">${d} reps — ${getS(d)}</span>`;
  if (d && i) txt += '  ·  ';
  if (i) txt += `I: <span style="color:${getC(i)};font-weight:700">${i} reps — ${getS(i)}</span>`;
  if (d && i) {
    const diff = Math.abs(d - i);
    const asimC = diff > 3 ? 'var(--amber)' : 'var(--neon)';
    txt += `  ·  <span style="color:${asimC}">Asimetría ${diff} reps${diff > 3 ? ' ⚠️' : ' ✓'}</span>`;
  }
  el.innerHTML = txt;
}

// ─── FUNCIONAL ───────────────────────────────────────────────────────────────
function calcDropNavicular(side) {
  const desc = +document.getElementById('nav-desc-'+side)?.value||0;
  const carg = +document.getElementById('nav-carg-'+side)?.value||0;
  const drop = carg - desc;
  const el = document.getElementById('nav-result-'+side); if(!el) return;
  const c = drop>10?'var(--red)':drop>6?'var(--amber)':'var(--neon)';
  el.innerHTML = `Drop ${side.toUpperCase()}: <span style="font-family:var(--mono);font-weight:700;color:${c}">${drop}mm</span> ${drop>10?'⚠️ Pronación excesiva':drop>6?'⚠️ Límite':'✓ Normal'}`;
}

function calcLungeTob() {
  const d = +document.getElementById('tob-lunge-d')?.value;
  const i = +document.getElementById('tob-lunge-i')?.value;
  const getS = v => !v?'':`<span style="color:${v<35?'var(--red)':v<=40?'var(--amber)':'var(--neon)'}">${v<35?'🔴 <35°':v<=40?'🟡 35–40°':'🟢 >40°'}</span>`;
  const elD = document.getElementById('tob-lunge-d-sema'); if(elD) elD.innerHTML=getS(d);
  const elI = document.getElementById('tob-lunge-i-sema'); if(elI) elI.innerHTML=getS(i);
  const elA = document.getElementById('tob-lunge-asim');
  if(elA && d && i) {
    const diff = Math.abs(d-i);
    const c = diff>5?'var(--amber)':'var(--neon)';
    elA.innerHTML = `Asimetría: <span style="font-family:var(--mono);font-weight:700;color:${c}">${diff}°</span> ${diff>5?'⚠️ >5° clínicamente significativo':'✓ Simétrico'}`;
  }
}

function calcCadencia() {
  const val = +document.getElementById('cadencia-actual')?.value;
  const el = document.getElementById('cadencia-result'); if(!val||!el) return;
  const c = val>=170&&val<=180?'var(--neon)':val>=160?'var(--amber)':'var(--red)';
  el.innerHTML = `<span style="color:${c};font-weight:700">${val<170?'⚠️':'✓'} ${val} pasos/min</span><br>
    <span style="font-size:10px;color:var(--text3)">+5%: ${Math.round(val*1.05)} · +10%: ${Math.round(val*1.10)} · Objetivo: 170–180</span>`;
}

function buildSEBT() {
  const c = document.getElementById('sebt-sheet-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = ['Anterior','Posteromedial','Posterolateral'].map(dir => `
    <div style="margin-bottom:8px">
      <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px">${dir}</div>
      <div class="grid-2" style="gap:6px">
        <div class="ig"><label class="il">D (cm)</label><input class="inp inp-mono" type="number" placeholder="0"></div>
        <div class="ig"><label class="il">I (cm)</label><input class="inp inp-mono" type="number" placeholder="0"></div>
      </div>
    </div>`).join('');
}

function buildTobilloHopTests() {
  const c = document.getElementById('tob-hop-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = TOBILLO_HOP_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header">
        <h3>${t.name}</h3>
        <span class="tag tag-b" style="font-size:9px">${t.sub}</span>
      </div>
      <div class="card-body">
        <div style="font-size:9px;color:var(--text3);margin-bottom:6px">${t.ref}</div>
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">D (${t.unit})</label>
            <input class="inp inp-mono" type="number" step="0.01" placeholder="0" id="hop-${t.id}-d" oninput="_calcHop('${t.id}')">
          </div>
          <div class="ig"><label class="il">I (${t.unit})</label>
            <input class="inp inp-mono" type="number" step="0.01" placeholder="0" id="hop-${t.id}-i" oninput="_calcHop('${t.id}')">
          </div>
        </div>
        <div id="hop-${t.id}-result" style="font-size:11px;margin-top:6px"></div>
      </div>
    </div>`).join('');
}

function _calcHop(id) {
  const test = TOBILLO_HOP_TESTS.find(t => t.id === id); if(!test) return;
  const d = parseFloat(document.getElementById('hop-'+id+'-d')?.value);
  const i = parseFloat(document.getElementById('hop-'+id+'-i')?.value);
  const el = document.getElementById('hop-'+id+'-result'); if(!el) return;
  const worse = test.worse; // 'mayor' = higher is worse (time), 'menor' = lower is worse (LSI)
  const cut = test.cut;
  let txt = '';
  const getColor = (v) => worse === 'mayor' ? (v > cut ? 'var(--red)' : 'var(--neon)') : (v < cut ? 'var(--red)' : 'var(--neon)');
  const getLabel = (v) => worse === 'mayor' ? (v > cut ? `⚠️ >${cut}${test.unit}` : `✓ <${cut}${test.unit}`) : (v < cut ? `⚠️ <${cut}${test.unit}` : `✓ ≥${cut}${test.unit}`);
  if (!isNaN(d)) txt += `D: <span style="color:${getColor(d)};font-weight:700">${d} — ${getLabel(d)}</span>`;
  if (!isNaN(d) && !isNaN(i)) txt += '  ·  ';
  if (!isNaN(i)) txt += `I: <span style="color:${getColor(i)};font-weight:700">${i} — ${getLabel(i)}</span>`;
  el.innerHTML = txt;
}

// ─── ESCALAS ─────────────────────────────────────────────────────────────────
function buildCAIT2() {
  const c = document.getElementById('cait-sheet-fields'); if(!c || c.innerHTML) return;
  caitVals2 = new Array(9).fill(null);
  c.innerHTML = CAIT_ITEMS2.map((item,i) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:12px;font-weight:600;margin-bottom:6px">${i+1}. ${item.q}</div>
      ${item.ops.map((op,j) => `
        <label style="display:flex;align-items:center;gap:8px;padding:3px 0;cursor:pointer;font-size:11px">
          <input type="radio" name="cait2-${i}" value="${item.vals[j]}" onchange="caitVals2[${i}]=${item.vals[j]};calcCAIT2()">
          ${op}
        </label>`).join('')}
    </div>`).join('');
}

function calcCAIT2() {
  const filled = caitVals2.filter(v=>v!==null);
  if(filled.length===9){
    const total = caitVals2.reduce((a,b)=>a+b,0);
    const el = document.getElementById('cait-sheet-total');
    const interp = document.getElementById('cait-sheet-interp');
    if(el){ el.textContent=total; el.style.color=total<=27?'var(--red)':'var(--neon)'; }
    if(interp) interp.innerHTML=`<span style="color:${total<=27?'var(--red)':'var(--neon)'}">${total<=27?'⚠️ IAC (CAIT <28)':'✓ Sin IAC'}</span>`;
  }
}

function buildFAAM2() {
  const avd = document.getElementById('faam-avd-sheet'); if(!avd || avd.innerHTML) return;
  faamAvdVals = new Array(21).fill(null);
  faamDepVals = new Array(8).fill(null);
  avd.innerHTML = FAAM_AVD_ITEMS.map((item,i) => `
    <div style="padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;margin-bottom:4px">${item}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${[4,3,2,1,0].map((v,j)=>`<button class="ot-btn" style="flex:1;min-width:55px;font-size:10px"
          onclick="this.parentElement.querySelectorAll('.ot-btn').forEach(b=>{b.className='ot-btn';b.style='flex:1;min-width:55px;font-size:10px'});this.classList.add('pos');faamAvdVals[${i}]=${v};calcFAAM2('avd')"
          >${['Sin dif.','Ligera','Moder.','Extrema','Impos.'][j]}</button>`).join('')}
      </div>
    </div>`).join('');
  const dep = document.getElementById('faam-dep-sheet');
  if (dep) dep.innerHTML = FAAM_DEP_ITEMS.map((item,i) => `
    <div style="padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;margin-bottom:4px">${item}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${[4,3,2,1,0].map((v,j)=>`<button class="ot-btn" style="flex:1;font-size:10px"
          onclick="this.parentElement.querySelectorAll('.ot-btn').forEach(b=>{b.className='ot-btn';b.style.flex='1';b.style.fontSize='10px'});this.classList.add('pos');faamDepVals[${i}]=${v};calcFAAM2('dep')"
          >${['Sin dif.','Ligera','Moder.','Extrema','Impos.'][j]}</button>`).join('')}
      </div>
    </div>`).join('');
}

function calcFAAM2(type) {
  if(type==='avd'){
    const filled = faamAvdVals.filter(v=>v!==null);
    const max = filled.length*4; const sum = filled.reduce((a,b)=>a+b,0);
    const el = document.getElementById('faam-avd-sheet-total');
    if(el) el.textContent = filled.length===21?(sum/max*100).toFixed(1)+'%':sum+'/'+max;
  } else {
    const filled = faamDepVals.filter(v=>v!==null);
    const max = filled.length*4; const sum = filled.reduce((a,b)=>a+b,0);
    const el = document.getElementById('faam-dep-sheet-total');
    if(el) el.textContent = filled.length===8?(sum/max*100).toFixed(1)+'%':sum+'/'+max;
  }
}

function buildVISAA() {
  const c = document.getElementById('visaa-fields'); if(!c || c.innerHTML) return;
  visaaVals = new Array(8).fill(null);
  c.innerHTML = VISAA_ITEMS.map((item,i) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:12px;margin-bottom:6px">${i+1}. ${item.q}</div>
      <input type="range" class="eva-slider" min="0" max="10" value="0"
        oninput="visaaVals[${i}]=+this.value;this.nextElementSibling.textContent=this.value;calcVISAA()">
      <div style="font-family:var(--mono);font-size:14px;text-align:center;color:var(--teal)">0</div>
    </div>`).join('');
}

function calcVISAA() {
  const total = visaaVals.reduce((a,b)=>a+(b||0),0);
  const el = document.getElementById('visaa-total');
  if(el){ el.textContent=total; el.style.color=total>=75?'var(--neon)':total>=50?'var(--amber)':'var(--red)'; }
}

// ─── INFORME ─────────────────────────────────────────────────────────────────
function _tob_getPosTests(containerId) {
  const c = document.getElementById(containerId); if(!c) return [];
  const pos = [];
  c.querySelectorAll('.card').forEach(card => {
    const h3 = card.querySelector('h3');
    if (h3 && card.querySelector('.ot-btn.pos')) pos.push(h3.textContent.trim());
  });
  return pos;
}

function generarInformeTobillo() {
  const container = document.getElementById('tob-informe-container'); if(!container) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Generando informe...</div>';

  const ottawaPos = TOBILLO_OTTAWA_ITEMS.filter(item => document.getElementById(item.id)?.checked);
  const esguinceLat = _tob_getPosTests('tob-esguince-lat');
  const esguinceMed = _tob_getPosTests('tob-esguince-med');
  const sindes = _tob_getPosTests('tob-sindes-fields');
  const aquiles = _tob_getPosTests('tob-aquiles-fields');

  const caitEl = document.getElementById('cait-sheet-total');
  const caitScore = caitEl ? parseInt(caitEl.textContent) : NaN;
  const visaaEl = document.getElementById('visaa-total');
  const visaaScore = visaaEl ? parseInt(visaaEl.textContent) : NaN;
  const lungeD = parseFloat(document.getElementById('tob-lunge-d')?.value)||0;
  const lungeI = parseFloat(document.getElementById('tob-lunge-i')?.value)||0;
  const shrD = parseInt(document.getElementById('tob-shr-d')?.value)||0;
  const shrI = parseInt(document.getElementById('tob-shr-i')?.value)||0;

  // Diagnostic logic
  const diagnoses = [];
  if (ottawaPos.length) diagnoses.push('ottawa-positivo');
  const thompsonPos = aquiles.some(t => t.includes('Thompson'));
  const matlesPos = aquiles.some(t => t.includes('Matles'));
  if (thompsonPos || matlesPos) diagnoses.push('ruptura-aquiles');
  if (sindes.length >= 2) diagnoses.push('lesion-sindesmosial');
  const hasAquilesSymptoms = (!isNaN(visaaScore) && visaaScore < 75) || aquiles.some(t => t.includes('Royal London') || t.includes('Arc'));
  if (hasAquilesSymptoms && !diagnoses.includes('ruptura-aquiles')) {
    const arcPos = aquiles.some(t => t.includes('Arc'));
    diagnoses.push(arcPos ? 'tendinopatia-aquiles-ins' : 'tendinopatia-aquiles-mid');
  }
  const drawerPos = esguinceLat.some(t => t.includes('Drawer'));
  const talarPos = esguinceLat.some(t => t.includes('Talar'));
  if (drawerPos || talarPos || (!isNaN(caitScore) && caitScore <= 27)) {
    if (!isNaN(caitScore) && caitScore <= 27) diagnoses.push('esguince-lateral-cronico');
    else diagnoses.push('esguince-agudo-lateral');
  }
  if (aquiles.some(t => t.includes('Silfverskiöld'))) diagnoses.push('contractura-gastrocnemio');

  const validDxs = [...new Set(diagnoses)].map(id => TOBILLO_RULES.find(r => r.id === id)).filter(Boolean);
  const now = new Date().toLocaleDateString('es-AR');
  const patName = typeof cur !== 'undefined' && cur?.nombre ? cur.nombre : '—';

  let html = `<div style="font-family:var(--sans);color:var(--text1)">`;

  // Header
  html += `<div style="background:var(--bg3);border-radius:10px;padding:12px 14px;margin-bottom:12px">
    <div style="font-size:15px;font-weight:800">Informe Evaluación Tobillo</div>
    <div style="font-size:11px;color:var(--text2)">${patName} · ${now}</div>
  </div>`;

  // Ottawa alert
  if (ottawaPos.length) {
    html += `<div style="background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.4);border-radius:8px;padding:10px 12px;margin-bottom:12px">
      <div style="font-size:13px;font-weight:800;color:var(--red)">⚠️ OTTAWA POSITIVO — DERIVAR A IMAGEN</div>
      <div style="font-size:10px;color:var(--text2);margin-top:4px">${ottawaPos.map(i=>i.label).join('<br>')}</div>
      <div style="font-size:9px;color:var(--text3);margin-top:6px">Stiell Lancet 1992 · Polzer Orthop Rev 2012 (Sn 96–98%)</div>
    </div>`;
  }

  // Tests positivos
  const allPos = [...esguinceLat, ...esguinceMed, ...sindes, ...aquiles];
  if (allPos.length) {
    html += `<div class="card mb-10"><div class="card-header"><h3>Tests positivos</h3></div><div class="card-body">`;
    if (esguinceLat.length || esguinceMed.length) {
      html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Ligamentos</div>
        <div style="font-size:11px;margin-bottom:8px">${[...esguinceLat,...esguinceMed].join(' · ')}</div>`;
    }
    if (sindes.length) {
      html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Sindesmosis (${sindes.length}/${TOBILLO_SINDES_TESTS.length} tests)</div>
        <div style="font-size:11px;margin-bottom:8px">${sindes.join(' · ')}</div>`;
    }
    if (aquiles.length) {
      html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Aquiles</div>
        <div style="font-size:11px">${aquiles.join(' · ')}</div>`;
    }
    html += `</div></div>`;
  }

  // Scores
  const hasScores = !isNaN(caitScore) || !isNaN(visaaScore) || lungeD || lungeI || shrD || shrI;
  if (hasScores) {
    html += `<div class="card mb-10"><div class="card-header"><h3>Escalas y medidas funcionales</h3></div>
      <div class="card-body" style="display:flex;flex-wrap:wrap;gap:8px">`;
    if (!isNaN(caitScore)) {
      const cc = caitScore <= 27 ? 'var(--red)' : 'var(--neon)';
      html += `<div style="background:var(--bg3);border-radius:8px;padding:8px 10px;min-width:75px;text-align:center">
        <div style="font-size:9px;color:var(--text2)">CAIT</div>
        <div style="font-size:22px;font-weight:800;font-family:var(--mono);color:${cc}">${caitScore}</div>
        <div style="font-size:9px;color:${cc}">${caitScore<=27?'⚠️ IAC':'✓ Normal'}</div></div>`;
    }
    if (!isNaN(visaaScore)) {
      const vc = visaaScore>=75?'var(--neon)':visaaScore>=50?'var(--amber)':'var(--red)';
      html += `<div style="background:var(--bg3);border-radius:8px;padding:8px 10px;min-width:75px;text-align:center">
        <div style="font-size:9px;color:var(--text2)">VISA-A</div>
        <div style="font-size:22px;font-weight:800;font-family:var(--mono);color:${vc}">${visaaScore}</div>
        <div style="font-size:9px;color:${vc}">${visaaScore>=75?'✓ OK':visaaScore>=50?'⚠️ Moder.':'🔴 Severo'}</div></div>`;
    }
    const lC = v => v<35?'var(--red)':v<=40?'var(--amber)':'var(--neon)';
    if (lungeD) html += `<div style="background:var(--bg3);border-radius:8px;padding:8px 10px;min-width:75px;text-align:center">
      <div style="font-size:9px;color:var(--text2)">Lunge D</div>
      <div style="font-size:22px;font-weight:800;font-family:var(--mono);color:${lC(lungeD)}">${lungeD}°</div></div>`;
    if (lungeI) html += `<div style="background:var(--bg3);border-radius:8px;padding:8px 10px;min-width:75px;text-align:center">
      <div style="font-size:9px;color:var(--text2)">Lunge I</div>
      <div style="font-size:22px;font-weight:800;font-family:var(--mono);color:${lC(lungeI)}">${lungeI}°</div></div>`;
    const sC = v => v>=25?'var(--neon)':v>=15?'var(--amber)':'var(--red)';
    if (shrD) html += `<div style="background:var(--bg3);border-radius:8px;padding:8px 10px;min-width:75px;text-align:center">
      <div style="font-size:9px;color:var(--text2)">SHR D</div>
      <div style="font-size:22px;font-weight:800;font-family:var(--mono);color:${sC(shrD)}">${shrD}</div>
      <div style="font-size:9px;color:var(--text2)">reps</div></div>`;
    if (shrI) html += `<div style="background:var(--bg3);border-radius:8px;padding:8px 10px;min-width:75px;text-align:center">
      <div style="font-size:9px;color:var(--text2)">SHR I</div>
      <div style="font-size:22px;font-weight:800;font-family:var(--mono);color:${sC(shrI)}">${shrI}</div>
      <div style="font-size:9px;color:var(--text2)">reps</div></div>`;
    html += `</div></div>`;
  }

  // Diagnoses + recommendations
  if (!validDxs.length) {
    html += `<div style="text-align:center;color:var(--text3);padding:20px;font-size:12px">Completar evaluación para generar diagnósticos presuntivos.</div>`;
  } else {
    validDxs.forEach(dx => {
      const recom = TOBILLO_RECOM[dx.id];
      html += `<div class="card mb-10" style="border-left:3px solid ${dx.color||'var(--border)'}">
        <div class="card-header"><h3 style="color:${dx.color||'var(--text1)'}">${dx.label}</h3></div>
        <div class="card-body">`;
      if (dx.criterios) html += `<div style="font-size:10px;color:var(--text2);margin-bottom:8px">${dx.criterios.join(' · ')}</div>`;
      if (recom) {
        html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px">Plan de tratamiento EBM</div>`;
        recom.fases.forEach(f => {
          html += `<div style="margin-bottom:10px">
            <div style="font-size:11px;font-weight:700;color:${f.color};margin-bottom:4px">${f.label}</div>
            <ul style="margin:0;padding-left:16px">${f.items.map(item=>`<li style="font-size:11px;margin-bottom:3px">${item}</li>`).join('')}</ul>
            ${f.ref?`<div style="font-size:9px;color:var(--text3);margin-top:3px;font-style:italic">${f.ref}</div>`:''}
          </div>`;
        });
        html += `<div style="font-size:9px;color:var(--text3);margin-top:6px;padding-top:6px;border-top:1px solid var(--border)">${recom.ref}</div>`;
      } else if (dx.tratamiento) {
        html += `<div style="font-size:11px">${dx.tratamiento}</div>`;
      }
      html += `</div></div>`;
    });
  }

  html += `<div style="font-size:9px;color:var(--text3);text-align:center;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
    MoveMetrics Clinical Assessment · Tobillo v2 · ${now}<br>
    Polzer 2012 · Vuurberg BJSM 2018 · Doherty BJSports Med 2017 · Alfredson AJSM 1998 · Torre SEMCPT 2019 · Meredith 2025 · Galleher CPG 2020
  </div></div>`;

  container.innerHTML = html;
}

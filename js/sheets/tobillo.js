// sheets/tobillo.js v4 — Tobillo módulo completo + nuevos tests Aquiles (Hutchison 2013 / Chimenti 2024)
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
  const dirs = ['Anterior','Posteromedial','Posterolateral'];
  const ids  = ['ant','pm','pl'];
  c.innerHTML = dirs.map((dir, idx) => `
    <div style="margin-bottom:8px">
      <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px">${dir}</div>
      <div class="grid-2" style="gap:6px">
        <div class="ig"><label class="il">D (cm)</label><input class="inp inp-mono" type="number" id="sebt-${ids[idx]}-d" placeholder="0" oninput="_calcSEBT()"></div>
        <div class="ig"><label class="il">I (cm)</label><input class="inp inp-mono" type="number" id="sebt-${ids[idx]}-i" placeholder="0" oninput="_calcSEBT()"></div>
      </div>
    </div>`).join('');
}

function _calcSEBT() {
  const llm = parseFloat(document.getElementById('sebt-llm')?.value) || 0;
  const g = id => parseFloat(document.getElementById(id)?.value) || 0;
  const antD=g('sebt-ant-d'), pmD=g('sebt-pm-d'), plD=g('sebt-pl-d');
  const antI=g('sebt-ant-i'), pmI=g('sebt-pm-i'), plI=g('sebt-pl-i');
  const el = document.getElementById('sebt-composite-result'); if(!el) return;
  let html = '';
  const dirs = ['Ant','PM','PL'];
  const diffs = [Math.abs(antD-antI), Math.abs(pmD-pmI), Math.abs(plD-plI)];
  const hasDiffs = diffs.some(d => d > 0);
  if (hasDiffs) {
    const maxAsim = Math.max(...diffs);
    const asimC = maxAsim > 4 ? 'var(--red)' : 'var(--neon)';
    const detail = diffs.map((d,i) => d > 0 ? `${dirs[i]} ${d.toFixed(1)} cm` : '').filter(Boolean).join(' · ');
    html += `<div style="font-size:11px">Asimetría: <span style="font-weight:700;color:${asimC}">${maxAsim.toFixed(1)} cm máx</span> ${maxAsim>4?'⚠️ >4 cm':'✓ <4 cm'}<br><span style="color:var(--text3)">${detail}</span></div>`;
  }
  if (llm > 0) {
    if (antD && pmD && plD) {
      const cD = ((antD+pmD+plD)/(3*llm)*100).toFixed(1);
      html += `<div style="font-size:11px;margin-top:4px">Composite D: <span style="font-weight:700;font-family:var(--mono);color:${parseFloat(cD)<89?'var(--amber)':'var(--neon)'}">${cD}%</span> ${parseFloat(cD)<89?'⚠️ <89%':'✓'}</div>`;
    }
    if (antI && pmI && plI) {
      const cI = ((antI+pmI+plI)/(3*llm)*100).toFixed(1);
      html += `<div style="font-size:11px;margin-top:2px">Composite I: <span style="font-weight:700;font-family:var(--mono);color:${parseFloat(cI)<89?'var(--amber)':'var(--neon)'}">${cI}%</span> ${parseFloat(cI)<89?'⚠️ <89%':'✓'}</div>`;
    }
  }
  el.innerHTML = html || '<span style="color:var(--text3);font-size:11px">Ingresar valores y largo miembro para composite score</span>';
}

// ─── FASCIOPATÍA PLANTAR ──────────────────────────────────────────────────────
function buildFascitisPlantar() {
  const c = document.getElementById('tob-fascitis-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = TOBILLO_PIE_TESTS.map(t => `
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

function _scaleChip(label, value, interp, color) {
  return `<div style="background:var(--bg3);border-radius:8px;padding:8px 10px;min-width:75px;text-align:center">
    <div style="font-size:9px;color:var(--text2)">${label}</div>
    <div style="font-size:20px;font-weight:800;font-family:var(--mono);color:${color}">${value}</div>
    <div style="font-size:9px;color:${color}">${interp}</div></div>`;
}

function generarInformeTobillo() {
  // ── Recolección de datos (sin cambios) ──
  const ottawaPos  = TOBILLO_OTTAWA_ITEMS.filter(item => document.getElementById(item.id)?.checked);
  const esguinceLat = _tob_getPosTests('tob-esguince-lat');
  const esguinceMed = _tob_getPosTests('tob-esguince-med');
  const sindes      = _tob_getPosTests('tob-sindes-fields');
  const aquiles     = _tob_getPosTests('tob-aquiles-fields');
  const fascitis    = _tob_getPosTests('tob-fascitis-fields');

  const caitRaw   = document.getElementById('cait-sheet-total')?.textContent;
  const caitScore = caitRaw && caitRaw !== '—' ? parseInt(caitRaw) : NaN;
  const visaaRaw  = document.getElementById('visaa-total')?.textContent;
  const visaaScore = visaaRaw && visaaRaw !== '—' ? parseInt(visaaRaw) : NaN;
  const faamAvdRaw = document.getElementById('faam-avd-sheet-total')?.textContent;
  const faamDepRaw = document.getElementById('faam-dep-sheet-total')?.textContent;
  const faamAvdHas = faamAvdRaw && faamAvdRaw !== '—';
  const faamDepHas = faamDepRaw && faamDepRaw !== '—';

  const lungeD = parseFloat(document.getElementById('tob-lunge-d')?.value)||0;
  const lungeI = parseFloat(document.getElementById('tob-lunge-i')?.value)||0;
  const shrD   = parseInt(document.getElementById('tob-shr-d')?.value)||0;
  const shrI   = parseInt(document.getElementById('tob-shr-i')?.value)||0;
  const navDrop_d = (+document.getElementById('nav-carg-d')?.value||0) - (+document.getElementById('nav-desc-d')?.value||0);
  const navDrop_i = (+document.getElementById('nav-carg-i')?.value||0) - (+document.getElementById('nav-desc-i')?.value||0);
  const navHasData = document.getElementById('nav-carg-d')?.value || document.getElementById('nav-carg-i')?.value;

  const hopResults = TOBILLO_HOP_TESTS.map(t => {
    const d = parseFloat(document.getElementById('hop-'+t.id+'-d')?.value);
    const i = parseFloat(document.getElementById('hop-'+t.id+'-i')?.value);
    return { t, d: isNaN(d)?null:d, i: isNaN(i)?null:i };
  }).filter(r => r.d !== null || r.i !== null);

  const llm = parseFloat(document.getElementById('sebt-llm')?.value)||0;
  const sg = id => parseFloat(document.getElementById(id)?.value)||0;
  const sebtAntD=sg('sebt-ant-d'),sebtPmD=sg('sebt-pm-d'),sebtPlD=sg('sebt-pl-d');
  const sebtAntI=sg('sebt-ant-i'),sebtPmI=sg('sebt-pm-i'),sebtPlI=sg('sebt-pl-i');
  const sebtCompD = llm>0&&sebtAntD&&sebtPmD&&sebtPlD ? ((sebtAntD+sebtPmD+sebtPlD)/(3*llm)*100).toFixed(1) : null;
  const sebtCompI = llm>0&&sebtAntI&&sebtPmI&&sebtPlI ? ((sebtAntI+sebtPmI+sebtPlI)/(3*llm)*100).toFixed(1) : null;

  // ── Lógica diagnóstica (sin cambios) ──
  const diagnoses = [];
  if (ottawaPos.length) diagnoses.push('ottawa-positivo');
  const thompsonPos = aquiles.some(t => t.includes('Thompson'));
  const matlesPos   = aquiles.some(t => t.includes('Matles'));
  if (thompsonPos || matlesPos) diagnoses.push('ruptura-aquiles');
  if (sindes.length >= 2) diagnoses.push('lesion-sindesmosial');
  const aquilesTendinopathyTests = ['Royal London','Arc','Palpación porción','Rigidez matinal','Dolor con carga'];
  const hasAquilesSymptoms = (!isNaN(visaaScore) && visaaScore < 75) ||
    aquiles.some(t => aquilesTendinopathyTests.some(k => t.includes(k)));
  if (hasAquilesSymptoms && !diagnoses.includes('ruptura-aquiles')) {
    const arcPos = aquiles.some(t => t.includes('Arc'));
    const royalPos = aquiles.some(t => t.includes('Royal London'));
    const isInsercional = arcPos && !royalPos;
    diagnoses.push(isInsercional ? 'tendinopatia-aquiles-ins' : 'tendinopatia-aquiles-mid');
  }
  const drawerPos = esguinceLat.some(t => t.includes('Drawer'));
  const talarPos  = esguinceLat.some(t => t.includes('Talar'));
  if (drawerPos || talarPos || (!isNaN(caitScore) && caitScore <= 27)) {
    diagnoses.push((!isNaN(caitScore) && caitScore <= 27) ? 'esguince-lateral-cronico' : 'esguince-agudo-lateral');
  }
  if (aquiles.some(t => t.includes('Silfverskiöld'))) diagnoses.push('contractura-gastrocnemio');
  if (sebtCompD && parseFloat(sebtCompD) < 89 || sebtCompI && parseFloat(sebtCompI) < 89) diagnoses.push('sebt-deficit');
  if (fascitis.some(t => t.includes('Windlass') || t.includes('calcánea') || t.includes('primer paso'))) diagnoses.push('fasciopatia-plantar');

  let esguinceGrade = '';
  if (drawerPos && talarPos) esguinceGrade = 'Grado III (ATFL + CFL)';
  else if (drawerPos) esguinceGrade = 'Grado II (ATFL parcial-completo)';
  else if (esguinceLat.length || esguinceMed.length) esguinceGrade = 'Grado I (estable)';

  const validDxs = [...new Set(diagnoses)].map(id => TOBILLO_RULES.find(r => r.id === id)).filter(Boolean);

  // ── Datos del paciente ──
  const profNombre = 'Lic. Emanuel Lezcano';
  const profMP = '';
  const profInst = 'The Move Club';
  const fecha = new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'long',year:'numeric'});
  const nombre  = typeof cur!=='undefined'?(cur?.nombre||'—'):'—';
  const edad    = typeof cur!=='undefined'?(cur?.edad||''):'';
  const sexo    = typeof cur!=='undefined'?(cur?.sexo||''):'';
  const peso    = typeof cur!=='undefined'?(cur?.peso||''):'';
  const talla   = typeof cur!=='undefined'?(cur?.talla||''):'';
  const deporte = typeof cur!=='undefined'?(cur?.deporte||''):'';
  const nivel   = typeof cur!=='undefined'?(cur?.nivel||''):'';
  const objetivo= typeof cur!=='undefined'?(cur?.objetivo||''):'';
  const lesionMC= typeof cur!=='undefined'?(cur?.lesion||''):'';
  const allPos = [...esguinceLat,...esguinceMed,...sindes,...aquiles,...fascitis];

  // ── CSS ──
  const css = typeof _tmcCSS!=='undefined' ? _tmcCSS() : 'body{font-family:Arial,sans-serif;font-size:12px}table{width:100%;border-collapse:collapse}th{background:#798254;color:#fff;padding:6px}td{padding:5px;border-bottom:1px solid #ddd}';

  // helper row
  const _R = (k,v) => typeof _tmcRow!=='undefined' ? _tmcRow(k,v) : `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee;font-size:11px"><span style="color:#555">${k}</span><span style="font-weight:600">${v||'—'}</span></div>`;

  // ── SEC 01 — Perfil ──
  const sec01 = `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">01</span><span class="sec-title">Perfil del Atleta</span></div>
    <div class="sec-desc">Identificación del paciente y contexto clínico de la consulta. Datos de referencia para correlación longitudinal.</div>
    <div class="grid-2">
      <div class="card-data"><div class="card-label">Datos del Paciente</div>
        ${_R('Nombre',nombre)}
        ${edad?_R('Edad',edad+(sexo?' · '+sexo:'')):(sexo?_R('Sexo',sexo):'')}
        ${(peso||talla)?_R('Morfología',[peso?peso+' kg':'',talla?talla+' cm':''].filter(Boolean).join(' / ')):''}
        ${deporte?_R('Deporte',deporte+(nivel?' — '+nivel:'')):''}
        ${objetivo?_R('Objetivo',objetivo):''}
        ${lesionMC?_R('Motivo de consulta',lesionMC):''}
        ${_R('Fecha evaluación',fecha)}
      </div>
      <div class="card-data"><div class="card-label">Resumen Clínico</div>
        ${!isNaN(caitScore)?_R('CAIT Score',caitScore+'/30 — '+(caitScore<=27?'Inestabilidad crónica (IAC)':'Normal')):''}
        ${!isNaN(visaaScore)?_R('VISA-A Score',visaaScore+'/100 — '+(visaaScore>=80?'OK':visaaScore>=50?'Moderado':'Severo')):''}
        ${faamAvdHas?_R('FAAM AVD',faamAvdRaw):''}
        ${faamDepHas?_R('FAAM Deportivo',faamDepRaw):''}
        ${lungeD?_R('Lunge Test D',lungeD+'°'):''}
        ${lungeI?_R('Lunge Test I',lungeI+'°'):''}
        ${validDxs.length?_R('Presunto Dx',validDxs.map(d=>d.label).join(' · ')):''}
      </div>
    </div></div>`;

  // ── SEC 02 — Screening Ottawa ──
  const sec02ottawa = ottawaPos.length ? `
    <div class="sec-wrap" style="border-left:4px solid #c03030">
      <div class="sec-head"><span class="sec-badge" style="background:#c03030">02</span><span class="sec-title" style="color:#c03030">⚠ SCREENING OTTAWA — POSITIVO</span></div>
      <div class="sec-desc" style="color:#c03030;font-weight:600">Ottawa Ankle/Foot Rules positivo — DERIVAR A IMAGEN. Sensibilidad 96–98% para fractura (Stiell Lancet 1992 · Polzer 2012).</div>
      <div style="background:#fff5f5;border:1.5px solid #f0b0b0;border-radius:6px;padding:10px 14px;margin-bottom:8px">
        ${ottawaPos.map(i=>`<div style="font-size:11px;padding:3px 0;border-bottom:1px solid #f0cccc;color:#8b2020">⚠ ${i.label}</div>`).join('')}
      </div>
      <div style="background:#fff8f0;border:1px solid #f0d0a0;border-radius:6px;padding:9px 12px;font-size:11px;color:#7a4000">
        <strong>Conducta recomendada:</strong> No iniciar carga ni rehabilitación hasta descartar fractura por imagen. Radiografía tobillo y/o pie según zona de sensibilidad ósea. Inmovilización provisional + crioterapia + elevación.
      </div>
    </div>` : '';

  // ── SEC 03 — Tests ortopédicos ──
  const sec03 = allPos.length ? `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">03</span><span class="sec-title">Tests Ortopédicos de Provocación</span></div>
    <div class="sec-desc">Maniobras clínicas para identificar estructuras comprometidas. Cada test reproduce síntomas o genera respuesta anormal en la estructura evaluada. Referencia: Vuurberg BJSM 2018 · Doherty BJSM 2017.</div>
    <table>
      <tr><th>Grupo</th><th>Tests Positivos</th><th>Graduación / Observaciones</th></tr>
      ${esguinceLat.length||esguinceMed.length?`<tr>
        <td><strong>Ligamentos Tobillo</strong><br><span style="font-size:9px;color:#888">ATFL · CFL · Deltoides</span></td>
        <td>${[...esguinceLat,...esguinceMed].join('<br>')}</td>
        <td class="${esguinceGrade.includes('III')?'alerta':esguinceGrade.includes('II')?'limite':'ok'}">${esguinceGrade||'—'}</td>
      </tr>`:''}
      ${sindes.length?`<tr>
        <td><strong>Sindesmosis</strong><br><span style="font-size:9px;color:#888">Lesión sindesmosial</span></td>
        <td>${sindes.join('<br>')}</td>
        <td class="${sindes.length>=2?'alerta':'limite'}">${sindes.length}/${typeof TOBILLO_SINDES_TESTS!=='undefined'?TOBILLO_SINDES_TESTS.length:'?'} tests · ${sindes.length>=2?'⚠ Sospecha lesión':'1 test'}</td>
      </tr>`:''}
      ${aquiles.length?`<tr>
        <td><strong>Tendón Aquiles</strong><br><span style="font-size:9px;color:#888">Thompson · Matles · VISA-A</span></td>
        <td>${aquiles.join('<br>')}</td>
        <td class="${thompsonPos||matlesPos?'alerta':'limite'}">${thompsonPos||matlesPos?'⚠ Posible ruptura':'Tendinopatía'}</td>
      </tr>`:''}
      ${fascitis.length?`<tr>
        <td><strong>Fascia Plantar</strong><br><span style="font-size:9px;color:#888">Windlass · Calc. · 1.er paso</span></td>
        <td>${fascitis.join('<br>')}</td>
        <td class="alerta">Tests positivos FP</td>
      </tr>`:''}
    </table></div>` : `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">03</span><span class="sec-title">Tests Ortopédicos de Provocación</span></div>
    <div style="padding:12px;background:#f6f8ee;border-radius:8px;font-size:11px;color:#888">Sin tests positivos registrados. Completar evaluación ortopédica para orientar diagnóstico.</div></div>`;

  // ── SEC 04 — ROM y medidas funcionales ──
  const hasROM = lungeD||lungeI||navHasData||shrD||shrI;
  const romRadarItems = [
    (lungeD||lungeI)?{label:'Lunge Test',D:lungeD,I:lungeI,max:50,ref:35}:null,
    (shrD||shrI)?{label:'SHR',D:shrD,I:shrI,max:40,ref:25}:null,
    navHasData?{label:'Nav.Drop (inv)',D:navDrop_d?Math.max(0,15-navDrop_d):0,I:navDrop_i?Math.max(0,15-navDrop_i):0,max:15,ref:10}:null,
  ].filter(Boolean);
  const _romRadar = (typeof _tmcRadarChart!=='undefined' && romRadarItems.length>=3)
    ? _tmcRadarChart(romRadarItems,{title:'Perfil Funcional Tobillo',size:270})
    : '';
  const sec04 = hasROM ? `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">04</span><span class="sec-title">ROM y Evaluaciones Funcionales</span></div>
    <div class="sec-desc">Dorsiflexión (Lunge Test), control neuromuscular (SHR) y alineamiento (Navicular Drop). Parámetros clave para FP, tendinopatía y esguince crónico. Ref: Doherty 2017 · Granado 2025.</div>
    <table>
      <tr><th>Medición</th><th>Referencia</th><th>D</th><th>I</th><th>Interpretación</th></tr>
      ${lungeD||lungeI?`<tr><td><strong>Lunge Test</strong></td><td>≥35°</td>
        <td class="${lungeD&&lungeD<35?'alerta':lungeD&&lungeD<=40?'limite':'ok'}">${lungeD?lungeD+'°':'—'}</td>
        <td class="${lungeI&&lungeI<35?'alerta':lungeI&&lungeI<=40?'limite':'ok'}">${lungeI?lungeI+'°':'—'}</td>
        <td style="font-size:10px">${[lungeD,lungeI].filter(v=>v&&v<35).length?'⚠ Déficit dorsiflexión':[lungeD,lungeI].filter(v=>v&&v<=40).length?'Límite':'✓ Normal'}</td></tr>`:''}
      ${shrD||shrI?`<tr><td><strong>SHR (Single Heel Rise)</strong></td><td>≥25 reps</td>
        <td class="${shrD&&shrD<25?'alerta':shrD&&shrD<15?'alerta':'ok'}">${shrD?shrD+' reps':'—'}</td>
        <td class="${shrI&&shrI<25?'alerta':shrI&&shrI<15?'alerta':'ok'}">${shrI?shrI+' reps':'—'}</td>
        <td style="font-size:10px">${[shrD,shrI].filter(v=>v&&v<15).length?'⚠ Severo':[shrD,shrI].filter(v=>v&&v<25).length?'⚠ Déficit':'✓ Normal'}</td></tr>`:''}
      ${navHasData?`<tr><td><strong>Navicular Drop</strong></td><td>≤10 mm</td>
        <td class="${navDrop_d>10?'alerta':navDrop_d>6?'limite':'ok'}">${document.getElementById('nav-carg-d')?.value?navDrop_d+' mm':'—'}</td>
        <td class="${navDrop_i>10?'alerta':navDrop_i>6?'limite':'ok'}">${document.getElementById('nav-carg-i')?.value?navDrop_i+' mm':'—'}</td>
        <td style="font-size:10px">${[navDrop_d,navDrop_i].some(v=>v>10)?'⚠ Pronación excesiva':[navDrop_d,navDrop_i].some(v=>v>6)?'Límite':'✓ Normal'}</td></tr>`:''}
    </table>${_romRadar}</div>` : '';

  // ── SEC 05 — Hop tests y SEBT ──
  const hasHopSEBT = hopResults.length||sebtCompD||sebtCompI;
  const _hopBarItems = hopResults.filter(r=>r.d!==null&&r.i!==null).map(r=>({
    label: r.t.name.length>20?r.t.name.substring(0,20):r.t.name,
    D: r.d, I: r.i, unit: r.t.unit, ref: r.t.cut, asim: r.d&&r.i?((Math.abs(r.d-r.i)/Math.max(r.d,r.i))*100).toFixed(1):null,
  }));
  const _hopBar = (typeof _tmcBarChart!=='undefined' && _hopBarItems.length>0)
    ? _tmcBarChart(_hopBarItems,{title:'Hop Tests — D vs I (IAC)'})
    : '';
  const sec05 = hasHopSEBT ? `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">05</span><span class="sec-title">Tests Funcionales — Hop y SEBT</span></div>
    <div class="sec-desc">Hop Tests evalúan potencia, simetría y control neuromuscular en IAC. SEBT composite score: déficit <89% predice re-lesión (Granado AJSM 2025). Ref: Meredith 2025 · Doherty 2017.</div>
    ${hopResults.length?`<table>
      <tr><th>Test</th><th>Criterio</th><th>D</th><th>I</th><th>LSI</th><th>Interpretación</th></tr>
      ${hopResults.map(r=>{
        const lsi = r.d&&r.i?(Math.min(r.d,r.i)/Math.max(r.d,r.i)*100).toFixed(1):null;
        const fail = r.t.worse==='mayor'?(r.d>r.t.cut||r.i>r.t.cut):(r.d<r.t.cut||r.i<r.t.cut);
        return `<tr>
          <td><strong>${r.t.name}</strong></td>
          <td>${r.t.worse==='menor'?'≥':'≤'}${r.t.cut}${r.t.unit}</td>
          <td class="${r.d!==null&&(r.t.worse==='menor'?r.d<r.t.cut:r.d>r.t.cut)?'alerta':'ok'}">${r.d!==null?r.d+r.t.unit:'—'}</td>
          <td class="${r.i!==null&&(r.t.worse==='menor'?r.i<r.t.cut:r.i>r.t.cut)?'alerta':'ok'}">${r.i!==null?r.i+r.t.unit:'—'}</td>
          <td class="${lsi&&+lsi<90?'alerta':'ok'}">${lsi?lsi+'%':'—'}</td>
          <td style="font-size:10px">${fail?'⚠ Déficit':'✓ OK'}</td>
        </tr>`;
      }).join('')}
    </table>`:''
    }${_hopBar}
    ${sebtCompD||sebtCompI?`<div style="margin-top:12px"><table>
      <tr><th>SEBT Composite</th><th>Criterio</th><th>Score</th><th>Interpretación</th></tr>
      ${sebtCompD?`<tr><td><strong>SEBT Composite D</strong></td><td>≥89%</td>
        <td class="${+sebtCompD<89?'alerta':'ok'}">${sebtCompD}%</td>
        <td>${+sebtCompD<89?'⚠ Déficit — riesgo re-lesión':'✓ Normal'}</td></tr>`:''}
      ${sebtCompI?`<tr><td><strong>SEBT Composite I</strong></td><td>≥89%</td>
        <td class="${+sebtCompI<89?'alerta':'ok'}">${sebtCompI}%</td>
        <td>${+sebtCompI<89?'⚠ Déficit — riesgo re-lesión':'✓ Normal'}</td></tr>`:''}
    </table></div>`:''}
    </div>` : '';

  // ── SEC 06 — Dashboard gauges ──
  const hasDashboard = !isNaN(caitScore)||!isNaN(visaaScore)||faamAvdHas||faamDepHas;
  const _caitGauge = (typeof _tmcGauge!=='undefined' && !isNaN(caitScore))
    ? _tmcGauge(caitScore,30,{label:'CAIT',sub:caitScore<=27?'Inestabilidad crónica':'Normal',size:140,colorFn:(v)=>v<=27?'#c03030':v<=28?'#b06000':'#798254'})
    : '';
  const _visaaGauge = (typeof _tmcGauge!=='undefined' && !isNaN(visaaScore))
    ? _tmcGauge(visaaScore,100,{label:'VISA-A',sub:visaaScore>=80?'OK':visaaScore>=50?'Moderado':'Severo',size:140})
    : '';
  const dashboard = hasDashboard ? `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">06</span><span class="sec-title">Dashboard — Escalas Funcionales</span></div>
    <div class="sec-desc">CAIT 0–30 (≤27 = IAC, MCID: 3 pts). VISA-A 0–100 (≥80 = RTS tendinopatía). FAAM AVD y Deportivo evalúan función percibida por el paciente. Ref: Galleher CPG 2020 · Torre SEMCPT 2019.</div>
    <div style="display:flex;gap:28px;justify-content:center;margin:16px 0 12px;flex-wrap:wrap">${_caitGauge}${_visaaGauge}</div>
    ${faamAvdHas||faamDepHas?`<table style="margin-top:8px">
      <tr><th>Escala</th><th>Score</th><th>MCID</th><th>Interpretación</th></tr>
      ${faamAvdHas?`<tr><td><strong>FAAM AVD</strong><br><span style="font-size:9px;color:#888">Foot & Ankle Ability Measure — Actividades Vida Diaria · Martin 2005</span></td>
        <td><strong>${faamAvdRaw}</strong></td><td>8 pts</td><td style="font-size:10px">Mayor = mejor función</td></tr>`:''}
      ${faamDepHas?`<tr><td><strong>FAAM Deportivo</strong><br><span style="font-size:9px;color:#888">Subescala Deportiva — Actividades de alta demanda</span></td>
        <td><strong>${faamDepRaw}</strong></td><td>9 pts</td><td style="font-size:10px">RTS objetivo: ≥90</td></tr>`:''}
    </table>`:''}
    </div>` : '';

  // ── SEC 07 — Diagnóstico presuntivo ──
  let dxHTML = '';
  if (validDxs.length) {
    validDxs.forEach((dx,i) => {
      const recom = TOBILLO_RECOM[dx.id];
      dxHTML += `<div style="border:1.5px solid #b0c070;border-radius:8px;overflow:hidden;margin-bottom:12px">
        <div style="background:#798254;padding:10px 14px">
          <div style="font-size:9px;letter-spacing:1px;color:rgba(255,255,255,.65);margin-bottom:2px">DIAGNÓSTICO ${i===0?'PRINCIPAL':'DIFERENCIAL'} — EBM</div>
          <div style="font-size:13px;font-weight:900;color:#fff">${dx.label}</div>
        </div>
        <div style="padding:12px 14px">
          ${dx.criterios?`<div style="font-size:10px;color:#555;margin-bottom:10px;padding:8px;background:#f6f8ee;border-radius:5px">${dx.criterios.join(' · ')}</div>`:''}
          ${recom?`<div style="font-size:10px;font-weight:700;color:#444;margin-bottom:8px;text-transform:uppercase">Plan de Tratamiento EBM:</div>
          ${recom.fases.map(f=>`<div style="margin-bottom:8px">
            <div style="font-size:10px;font-weight:700;color:${f.color||'#798254'};margin-bottom:3px">${f.label}</div>
            <ul style="margin:0;padding-left:16px">${f.items.map(item=>`<li style="font-size:10px;margin-bottom:3px">${item}</li>`).join('')}</ul>
            ${f.ref?`<div style="font-size:9px;color:#aaa;font-style:italic;margin-top:3px">${f.ref}</div>`:''}
          </div>`).join('')}
          <div style="font-size:9px;color:#aaa;font-style:italic;text-align:right;margin-top:6px">${recom.ref}</div>` :
          (dx.tratamiento?`<div style="font-size:11px;color:#444">${dx.tratamiento}</div>`:'')}
        </div>
      </div>`;
    });
  } else {
    dxHTML = `<div style="padding:12px;background:#f6f8ee;border-radius:8px;font-size:11px;color:#888">Completar evaluación para generar diagnósticos presuntivos EBM.</div>`;
  }
  const sec07 = `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">07</span><span class="sec-title">Diagnóstico Kinesiológico Presuntivo</span></div>
    <div class="sec-desc">Diagnóstico presuntivo basado en criterios EBM validados por guías CPG. Requiere correlación con imagen y juicio médico para confirmación definitiva. Ref: Polzer 2012 · Vuurberg BJSM 2018.</div>
    ${dxHTML}
    <div style="font-size:9px;color:#aaa;font-style:italic;text-align:right;margin-top:4px">Polzer 2012 · Vuurberg BJSM 2018 · Doherty 2017 · Alfredson AJSM 1998 · Torre SEMCPT 2019 · Galleher CPG 2020 · Martin JOSPT CPG 2014</div>
    </div>`;

  // ── FIRMA ──
  const firma = typeof _tmcFirma!=='undefined'
    ? _tmcFirma({profNombre,profMP,profInst})
    : `<div style="margin-top:32px;padding-top:16px;border-top:2px solid #dde5c4;text-align:right">
        <div style="width:140px;border-top:1.5px solid #1e1e1b;margin-left:auto;margin-bottom:5px"></div>
        <div style="font-size:11px;font-weight:700">${profNombre}</div>
        <div style="font-size:10px;color:#666">${profInst}</div>
      </div>`;

  // ── ASSEMBLE HTML ──
  const bodyContent = sec01+sec02ottawa+sec03+sec04+sec05+dashboard+sec07+firma;
  const headerHTML = typeof _tmcHeader!=='undefined'
    ? _tmcHeader({profNombre,profMP,profInst,fecha,refs:'Basado en evidencia · Vuurberg BJSM 2018 · Polzer 2012 · Galleher CPG 2020'})
    : `<header style="background:#1e1e1b;padding:24px 40px;display:flex;justify-content:space-between"><div style="color:#96a566;font-size:24px;font-weight:900">THE MOVE CLUB</div><div style="color:#fff;text-align:right"><div style="font-size:15px;font-weight:700;color:#96a566">${fecha}</div><div>${profNombre}</div></div></header>`;
  const footerHTML = typeof _tmcFooter!=='undefined'
    ? _tmcFooter('Tobillo','Vuurberg BJSM 2018 · Polzer 2012 · Galleher CPG 2020')
    : `<footer style="background:#1e1e1b;color:rgba(255,255,255,.35);padding:10px 44px;display:flex;justify-content:space-between;font-size:9px"><span>THE MOVE CLUB</span><span>Informe Tobillo · EBM</span></footer>`;
  const toolbar = typeof _tmcToolbar!=='undefined'
    ? _tmcToolbar
    : `<div class="no-print" style="background:#1e1e1b;padding:10px 20px;display:flex;gap:8px"><button onclick="window.print()" style="background:#798254;color:#fff;border:none;border-radius:4px;padding:8px 18px;font-weight:700;cursor:pointer">🖨 Imprimir / PDF</button></div>`;

  const fullHTML = `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Informe Tobillo — ${nombre} — ${fecha}</title>
<style>${css}</style>
</head><body>
${toolbar}
${headerHTML}
<main id="report-body" style="padding:8px 44px 32px;max-width:820px;margin:0 auto">${bodyContent}</main>
${footerHTML}
</body></html>`;

  // ── Abrir ventana ──
  const win = window.open('','_blank','width=980,height=860,resizable=yes,scrollbars=yes');
  if (!win) { alert('Habilitá popups para este sitio para abrir el informe.'); return; }
  win.document.write(fullHTML);
  win.document.close();

  // ── Actualizar modal con resumen ──
  const container = document.getElementById('tob-informe-container');
  if (container) {
    const dxNames = validDxs.map(d=>d.label).join(', ');
    container.innerHTML = `
      <div style="font-family:var(--mono);font-size:11px;line-height:1.7">
        <div style="font-size:13px;font-weight:700;color:var(--neon);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--verde20)">✓ Informe generado — se abrió en nueva ventana</div>
        <div style="padding:10px;background:var(--verde04);border:1px solid var(--verde20);border-radius:8px;margin-bottom:12px;font-size:11px">
          ${ottawaPos.length?`<div style="color:var(--red);font-weight:700">⚠ Ottawa POSITIVO — derivar a imagen</div>`:''}
          ${!isNaN(caitScore)?`<div><b>CAIT:</b> ${caitScore}/30${caitScore<=27?' — IAC':''}</div>`:''}
          ${!isNaN(visaaScore)?`<div><b>VISA-A:</b> ${visaaScore}/100</div>`:''}
          ${allPos.length?`<div><b>Tests (+):</b> ${allPos.join(' · ')}</div>`:''}
          ${dxNames?`<div><b>Presunto Dx:</b> ${dxNames}</div>`:''}
        </div>
        <button onclick="generarInformeTobillo()" class="btn btn-neon btn-sm" style="font-size:10px">🔄 Regenerar informe</button>
      </div>`;
  }
}

function imprimirInformeTobillo() {
  generarInformeTobillo();
}

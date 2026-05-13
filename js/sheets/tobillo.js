// sheets/tobillo.js — Lig, SEBT, CAIT, FAAM, VISAA, drop nav, lunge, cadencia
function buildTobilloLig() {
  const c = document.getElementById('tobillo-lig-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = TOBILLO_LIG.map(t => `
    <div class="card mb-8">
      <div class="card-header"><h3>${t.name}</h3><span class="tag tag-r" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
          <div><div class="il mb-4">I</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
        </div>
      </div>
    </div>
  `).join('');
}

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
  c.innerHTML = SEBT_DIRS.map(dir => `
    <div style="margin-bottom:8px">
      <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px">${dir}</div>
      <div class="grid-2" style="gap:6px">
        <div class="ig"><label class="il">D (cm)</label><input class="inp inp-mono" type="number" placeholder="0"></div>
        <div class="ig"><label class="il">I (cm)</label><input class="inp inp-mono" type="number" placeholder="0"></div>
      </div>
    </div>
  `).join('');
}

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
        </label>
      `).join('')}
    </div>
  `).join('');
}
function calcCAIT2() {
  const filled = caitVals2.filter(v=>v!==null);
  if(filled.length===9){
    const total = caitVals2.reduce((a,b)=>a+b,0);
    const el = document.getElementById('cait-sheet-total');
    const interp = document.getElementById('cait-sheet-interp');
    if(el){ el.textContent=total; el.style.color=total<=27?'var(--red)':'var(--neon)'; }
    if(interp) interp.innerHTML=`<span style="color:${total<=27?'var(--red)':'var(--neon)'}">${total<=27?'⚠️ IAC sugerida':'✓ Sin IAC'}</span>`;
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
    </div>
  `).join('');
  const dep = document.getElementById('faam-dep-sheet');
  dep.innerHTML = FAAM_DEP_ITEMS.map((item,i) => `
    <div style="padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;margin-bottom:4px">${item}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${[4,3,2,1,0].map((v,j)=>`<button class="ot-btn" style="flex:1;font-size:10px"
          onclick="this.parentElement.querySelectorAll('.ot-btn').forEach(b=>{b.className='ot-btn';b.style.flex='1';b.style.fontSize='10px'});this.classList.add('pos');faamDepVals[${i}]=${v};calcFAAM2('dep')"
          >${['Sin dif.','Ligera','Moder.','Extrema','Impos.'][j]}</button>`).join('')}
      </div>
    </div>
  `).join('');
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
    </div>
  `).join('');
}
function calcVISAA() {
  const total = visaaVals.reduce((a,b)=>a+(b||0),0);
  const el = document.getElementById('visaa-total');
  if(el){ el.textContent=total; el.style.color=total>=75?'var(--neon)':total>=50?'var(--amber)':'var(--red)'; }
}


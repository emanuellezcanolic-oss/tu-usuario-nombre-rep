// sheets/codo.js — ROM, tests, fuerza, PRTEE, QDASH
// ══════════════════════════════════════════════════════
//  CODO SHEET
// ══════════════════════════════════════════════════════

const CODO_ROM = [
  { id:'flex-codo',  label:'Flexión codo',         ref:'0–145°',  mdc:'5°' },
  { id:'ext-codo',   label:'Extensión codo',        ref:'0°',      mdc:'5°' },
  { id:'sup-codo',   label:'Supinación antebrazo',  ref:'0–90°',   mdc:'ICC 0.86–0.98' },
  { id:'pron-codo',  label:'Pronación antebrazo',   ref:'0–90°',   mdc:'ICC 0.86–0.98' },
  { id:'flex-mun',   label:'Flexión muñeca',        ref:'0–80°',   mdc:'MDC90 ~5°' },
  { id:'ext-mun',    label:'Extensión muñeca',      ref:'0–70°',   mdc:'MDC90 ~5°' },
  { id:'dev-rad',    label:'Desv. radial muñeca',   ref:'0–20°',   mdc:'MDC90 ~5°' },
  { id:'dev-cub',    label:'Desv. cubital muñeca',  ref:'0–40°',   mdc:'MDC90 ~5°' }
];

const PRTEE_DOLOR = [
  'En su peor momento',
  'Al cerrar el puño',
  'Al dar la mano',
  'Al girar un picaporte o perilla',
  'Al cargar una bolsa o maletín'
];
const PRTEE_ACTIV = [
  'Girar una perilla o llave',
  'Cargar una bolsa pesada',
  'Levantar una taza llena hacia la boca',
  'Empujar una puerta pesada',
  'Sostener un plato lleno',
  'Retorcer una toalla'
];
const PRTEE_USUAL = [
  'Actividades personales (vestirse, higiene)',
  'Trabajo del hogar',
  'Trabajo / empleo',
  'Actividades recreativas o deportivas'
];

const QDASH_ITEMS = [
  'Abrir una jarra apretada o nuevo',
  'Tareas domésticas pesadas (limpiar pisos, paredes)',
  'Cargar una bolsa de compras',
  'Lavar la espalda',
  'Usar un cuchillo para cortar alimentos',
  'Actividades que requieren esfuerzo (golf, martillar)',
  'Actividad social (interferencia del hombro/brazo)',
  'Dificultad con el trabajo (limitación en el trabajo)',
  'Hormigueo (agujas) en brazo, hombro o mano',
  'Dificultad para dormir por dolor en brazo/hombro/mano',
  'Sensación de debilidad en brazo, hombro o mano'
];

let prteeDolorVals = new Array(5).fill(null);
let prteeActivVals = new Array(6).fill(null);
let prteeUsualVals = new Array(4).fill(null);
let codoQDashVals  = new Array(11).fill(null);

function showCTab(tab, btn) {
  ['obs','rom','tests','fuerza','esc'].forEach(t => {
    const el = document.getElementById('ctab-' + t); if(el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-codo .btn').forEach(b => {
    if(b.id && b.id.startsWith('ctab-')) { b.className = 'btn btn-ghost btn-sm'; b.style.whiteSpace='nowrap'; b.style.fontSize='10px'; }
  });
  if(btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace='nowrap'; btn.style.fontSize='10px'; }
}

function initCodoSheet() {
  buildCodoROM();
  buildCodoTests();
  buildCodoPRTEE();
  buildCodoQDASH();
}

function buildCodoROM() {
  const c = document.getElementById('codo-rom-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = CODO_ROM.map(m => `
    <div class="card mb-8">
      <div class="card-header"><h3>${m.label}</h3><span class="tag tag-b" style="font-size:9px">Ref: ${m.ref} · ${m.mdc}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">Activo D (°)</label><input class="inp inp-mono" type="number" id="crom-${m.id}-act-d" placeholder="0" oninput="calcCodoROM('${m.id}')"></div>
          <div class="ig"><label class="il">Activo I (°)</label><input class="inp inp-mono" type="number" id="crom-${m.id}-act-i" placeholder="0" oninput="calcCodoROM('${m.id}')"></div>
          <div class="ig"><label class="il">Pasivo D (°)</label><input class="inp inp-mono" type="number" id="crom-${m.id}-pas-d" placeholder="0"></div>
          <div class="ig"><label class="il">Pasivo I (°)</label><input class="inp inp-mono" type="number" id="crom-${m.id}-pas-i" placeholder="0"></div>
        </div>
        <div id="crom-${m.id}-result" style="font-family:var(--mono);font-size:11px;margin-top:6px;color:var(--text3)"></div>
      </div>
    </div>
  `).join('');
}

function calcCodoROM(id) {
  const d = +document.getElementById('crom-'+id+'-act-d')?.value||0;
  const i = +document.getElementById('crom-'+id+'-act-i')?.value||0;
  const el = document.getElementById('crom-'+id+'-result');
  if(!el || (!d && !i)) return;
  const diff = Math.abs(d-i);
  const c = diff>=20?'var(--red)':diff>=10?'var(--amber)':'var(--neon)';
  el.innerHTML = `Asimetría: <span style="color:${c};font-weight:700">${diff}°</span> ${diff>=10?'⚠️ Clínicamente relevante':'✓'}`;
}

function buildCodoTests() {
  _buildCodoTestGroup('codo-tests-lateral',    CODO_TESTS_LATERAL);
  _buildCodoTestGroup('codo-tests-medial',     CODO_TESTS_MEDIAL);
  _buildCodoTestGroup('codo-tests-neural',     CODO_TESTS_NEURAL);
}

function _buildCodoTestGroup(containerId, tests) {
  const c = document.getElementById(containerId); if(!c || c.innerHTML) return;
  c.innerHTML = tests.map(t => `
    <div class="card mb-8">
      <div class="card-header"><h3>${t.name}</h3><span class="tag ${t.tag}" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:8px">${t.ref}</div>
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
          <div><div class="il mb-4">I</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
        </div>
        <div class="ig mt-8"><label class="il">EVA D</label><input type="range" class="eva-slider" min="0" max="10" value="0" oninput="this.nextElementSibling.textContent=this.value"><span style="font-family:var(--mono);font-size:14px;display:block;text-align:center">0</span></div>
      </div>
    </div>
  `).join('');
}

function calcCodoFuerza() {
  const calcAsim = (d, i, elId, mcid) => {
    const el = document.getElementById(elId); if(!el) return;
    if(!d || !i) { el.textContent = 'Ingresá ambos lados'; el.style.color='var(--text3)'; return; }
    const asim = Math.abs(d-i)/Math.max(d,i)*100;
    const diff = Math.abs(d-i);
    const c = asim>=20?'var(--red)':asim>=10?'var(--amber)':'var(--neon)';
    const label = asim>=20?'⚠️ Déficit significativo':asim>=10?'⚡ Déficit leve':'✓ Simétrico';
    el.innerHTML = `D: <strong>${d}</strong> kg · I: <strong>${i}</strong> kg · Asimetría: <span style="color:${c};font-weight:700">${asim.toFixed(1)}%</span> · Δ ${diff.toFixed(1)} kg ${mcid?'(MCID '+mcid+'kg)':''} — <span style="color:${c}">${label}</span>`;
  };
  const pD = +document.getElementById('pfgs-d')?.value||0;
  const pI = +document.getElementById('pfgs-i')?.value||0;
  calcAsim(pD, pI, 'pfgs-result', 7);
  const gD = +document.getElementById('grip-max-d')?.value||0;
  const gI = +document.getElementById('grip-max-i')?.value||0;
  calcAsim(gD, gI, 'grip-max-result', null);
  const ppD = +document.getElementById('ppt-d')?.value||0;
  const ppI = +document.getElementById('ppt-i')?.value||0;
  const pptEl = document.getElementById('ppt-result'); if(pptEl && ppD && ppI) {
    const ratio = Math.min(ppD,ppI)/Math.max(ppD,ppI);
    const bilat = (ppD+ppI)/2;
    const c = ratio<0.7?'var(--red)':ratio<0.85?'var(--amber)':'var(--neon)';
    pptEl.innerHTML = `D: <strong>${ppD}</strong> · I: <strong>${ppI}</strong> kg/cm² · Ratio: <span style="color:${c};font-weight:700">${ratio.toFixed(2)}</span> ${ratio<0.7?'⚠️ Asimetría marcada — posible sensibilización':'✓'}`;
  }
}

function buildCodoPRTEE() {
  const buildList = (items, prefix, containerId) => {
    const c = document.getElementById(containerId); if(!c || c.innerHTML) return;
    c.innerHTML = items.map((item, i) => `
      <div style="padding:6px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:11px;margin-bottom:5px">${item}</div>
        <div style="display:flex;gap:3px;flex-wrap:wrap">
          ${[0,1,2,3,4,5,6,7,8,9,10].map(v=>`<button class="ot-btn" style="min-width:24px;font-size:10px;padding:2px 4px"
            onclick="selectPRTEE(this,'${prefix}',${i},${v})">${v}</button>`).join('')}
        </div>
      </div>
    `).join('');
  };
  buildList(PRTEE_DOLOR, 'dolor', 'prtee-dolor-list');
  buildList(PRTEE_ACTIV, 'activ', 'prtee-activ-list');
  buildList(PRTEE_USUAL, 'usual', 'prtee-usual-list');
}

function selectPRTEE(btn, prefix, idx, val) {
  btn.parentElement.querySelectorAll('.ot-btn').forEach(b => {
    b.className = 'ot-btn'; b.style.minWidth='24px'; b.style.fontSize='10px'; b.style.padding='2px 4px';
  });
  btn.classList.add('pos');
  if(prefix==='dolor') prteeDolorVals[idx]=val;
  else if(prefix==='activ') prteeActivVals[idx]=val;
  else if(prefix==='usual') prteeUsualVals[idx]=val;
  const score = calcPRTEEScore();
  const el = document.getElementById('prtee-total');
  const eb = document.getElementById('prtee-breakdown');
  const ei = document.getElementById('prtee-interp');
  if(score !== null && el) {
    const dolorFilled = prteeDolorVals.filter(v=>v!==null);
    const funcFilled = [...prteeActivVals,...prteeUsualVals].filter(v=>v!==null);
    const pSub = dolorFilled.length===5 ? dolorFilled.reduce((a,b)=>a+b,0) : null;
    const fSub = funcFilled.length===10 ? funcFilled.reduce((a,b)=>a+b,0)/2 : null;
    el.textContent = score;
    const c = score<=20?'var(--neon)':score<=50?'var(--amber)':'var(--red)';
    el.style.color = c;
    if(eb) eb.textContent = `Dolor: ${pSub??'—'} · Función: ${fSub??'—'}`;
    if(ei) ei.textContent = score<=20?'✓ Leve — buen pronóstico':score<=50?'⚡ Moderado — supervisar':score<=75?'⚠️ Severo — plan intensivo':'🔴 Muy severo';
  }
}

function calcPRTEEScore() {
  const dFilled = prteeDolorVals.filter(v=>v!==null);
  const aFilled = prteeActivVals.filter(v=>v!==null);
  const uFilled = prteeUsualVals.filter(v=>v!==null);
  if(dFilled.length<5 || aFilled.length<6 || uFilled.length<4) return null;
  const pain = dFilled.reduce((a,b)=>a+b,0);
  const func = ([...prteeActivVals,...prteeUsualVals].reduce((a,b)=>a+b,0))/2;
  return Math.round(pain + func);
}

function buildCodoQDASH() {
  const c = document.getElementById('codo-qdash-list'); if(!c || c.innerHTML) return;
  codoQDashVals = new Array(11).fill(null);
  c.innerHTML = QDASH_ITEMS.map((item,i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:11px;flex:1">${item}</span>
      <div style="display:flex;gap:3px;margin-left:6px">
        ${[1,2,3,4,5].map(v=>`<button class="ot-btn" style="min-width:22px;font-size:10px;padding:3px"
          onclick="selectCodoQDASH(this,${i},${v})">${v}</button>`).join('')}
      </div>
    </div>
  `).join('');
}

function selectCodoQDASH(btn, idx, val) {
  btn.parentElement.querySelectorAll('.ot-btn').forEach(b=>{b.className='ot-btn';b.style.minWidth='22px';b.style.fontSize='10px';b.style.padding='3px';});
  btn.classList.add('pos');
  codoQDashVals[idx]=val;
  const score = calcCodoQDASH();
  if(score !== null) {
    const el = document.getElementById('codo-qdash-total');
    if(el) { el.textContent=score; el.style.color=score<=20?'var(--neon)':score<=50?'var(--amber)':'var(--red)'; }
  }
}

function calcCodoQDASH() {
  const filled = codoQDashVals.filter(v=>v!==null);
  if(filled.length < 11) return null;
  return +((filled.reduce((a,b)=>a+b,0)/filled.length - 1)/4*100).toFixed(1);
}

function checkCodoRedFlags() {
  const cbs = document.querySelectorAll('.codo-redflag');
  const any = [...cbs].some(c=>c.checked);
  const el = document.getElementById('codo-redflag-alert'); if(el) el.style.display=any?'block':'none';
}


// sheets/mano.js v1
// Tabs: STC | Tendones | CMC+Neuro | Fuerza | Escalas | Informe
// Evidencia: JOSPT CPG 2019 (STC) · HANDGUIDE 2014 (De Quervain/Trigger) · EULAR 2018 (OA)
//            HANDGUIDE 2013 (Guyon/Dupuytren) · Chávez Delgado UNAM 2024 · Lluch Bergadà UNIA 2020

// ── QDASH mano (11 ítems, escala 1-5) ────────────────────────────────────────
const MANO_QDASH_ITEMS = [
  'Abrir una jarra apretada o nuevo',
  'Tareas domésticas pesadas (limpiar pisos, paredes)',
  'Cargar una bolsa de compras',
  'Lavarse la espalda',
  'Usar un cuchillo para cortar alimentos',
  'Actividades que requieren esfuerzo o impacto (martillar, golf)',
  'Actividad social (interferencia del brazo/mano)',
  'Dificultad con el trabajo (limitación en el trabajo)',
  'Hormigueo (agujas) en brazo, hombro o mano',
  'Dificultad para dormir por dolor en brazo/hombro/mano',
  'Sensación de debilidad en brazo, hombro o mano'
];

// ── PRWE (Patient-Rated Wrist Evaluation) — 15 ítems, 0–10 cada uno ─────────
const MANO_PRWE_DOLOR = [
  'Dolor en su peor momento',
  'Dolor con movimientos repetitivos de muñeca',
  'Al levantar objetos pesados',
  'Al empujar o presionar con la mano',
  'Dolor (frecuencia del dolor actual)'
];
const MANO_PRWE_FUNCION_ESP = [
  'Girar una perilla o llave',
  'Cortar alimentos con cuchillo',
  'Abrocharse botones de ropa',
  'Levantarse apoyando las manos',
  'Cargar una bolsa de 5 kg',
  'Bañarse o ducharse'
];
const MANO_PRWE_FUNCION_USUAL = [
  'Actividades personales (higiene, vestirse)',
  'Tareas del hogar',
  'Trabajo / empleo habitual',
  'Actividades recreativas o deportivas'
];

let manoQDashVals = new Array(11).fill(null);
let manoPrewDolorVals = new Array(5).fill(null);
let manoPrewFuncEspVals = new Array(6).fill(null);
let manoPrewFuncUsualVals = new Array(4).fill(null);

// ── TAB SWITCHER ──────────────────────────────────────────────────────────────
function showMTab(tab, btn) {
  ['stc','tendones','cmc','fuerza','escalas','minforme'].forEach(t => {
    const el = document.getElementById('mtab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-mano .btn').forEach(b => {
    if (b.id && b.id.startsWith('mtab-')) {
      b.className = 'btn btn-ghost btn-sm';
      b.style.whiteSpace = 'nowrap';
      b.style.fontSize = '10px';
    }
  });
  if (btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace = 'nowrap'; btn.style.fontSize = '10px'; }
}

// ── HELPER: colectar tests positivos en un contenedor ────────────────────────
function _mano_getPosTests(containerId) {
  const c = document.getElementById(containerId); if (!c) return [];
  const results = [];
  c.querySelectorAll('.ot-btn.pos').forEach(btn => {
    const card = btn.closest('.card');
    const name = card?.querySelector('h3')?.textContent || '';
    // Side label is the .il element inside the same grid cell as the button
    const gridCell = btn.closest('.grid-2 > div');
    const side = gridCell?.querySelector('.il')?.textContent?.trim() || '';
    if (name) results.push(side ? `${name} (${side})` : name);
  });
  return [...new Map(results.map(r => [r, r])).values()];
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function initManoSheet() {
  buildManoSTC();
  buildManoTendones();
  buildManoCMCNeuro();
  buildManoFuerza();
  buildManoQDASH();
  buildManoPRWE();
}

// ── CARD BUILDER HELPER ───────────────────────────────────────────────────────
function _manoCardHTML(tests) {
  return tests.map(t => `
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

// ─── TAB: STC ────────────────────────────────────────────────────────────────
function buildManoSTC() {
  const c = document.getElementById('mano-stc-fields');
  if (!c || c.innerHTML) return;

  c.innerHTML = _manoCardHTML(MANO_STC_TESTS);
}

// ─── TAB: TENDONES ────────────────────────────────────────────────────────────
function buildManoTendones() {
  const dq = document.getElementById('mano-dequervain-fields');
  if (!dq || dq.innerHTML) return;

  dq.innerHTML = _manoCardHTML(MANO_DEQUERVAIN_TESTS);

  const gat = document.getElementById('mano-gatillo-fields');
  if (gat) gat.innerHTML = _manoCardHTML(MANO_GATILLO_TESTS) + `
    <div class="card mb-8" style="border-color:rgba(245,158,11,.3)">
      <div class="card-header"><h3>Clasificación Quinnell (Trigger Finger)</h3><span class="tag" style="background:rgba(245,158,11,.12);color:var(--amber)">I → IV</span></div>
      <div class="card-body">
        <div style="font-size:9px;color:var(--text3);margin-bottom:6px">HANDGUIDE 2014 — factor clave para elección de tratamiento</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${['I — Dolor sin disparador','II — Disparador activo (snap)','III — Bloqueo pasivo corregible','IV — Contractura fija'].map((g,i) =>
            `<button class="btn btn-ghost btn-sm" id="quinnell-g${i+1}" onclick="_setQuinnell(${i+1})" style="font-size:10px">${g}</button>`
          ).join('')}
        </div>
        <div id="quinnell-result" style="font-size:11px;margin-top:8px;color:var(--text3)">Seleccionar grado</div>
      </div>
    </div>`;
}

function _setQuinnell(grade) {
  [1,2,3,4].forEach(g => {
    const b = document.getElementById('quinnell-g'+g);
    if (b) b.className = g === grade ? 'btn btn-neon btn-sm' : 'btn btn-ghost btn-sm';
  });
  const recom = ['', 'Grado I: modificación actividad + ortesis', 'Grado II: inyección corticosteroide o cirugía', 'Grado III: inyección + cirugía percutánea', 'Grado IV: cirugía abierta'];
  const el = document.getElementById('quinnell-result');
  if (el) el.innerHTML = `<span style="color:var(--neon);font-weight:700">Quinnell Grado ${grade}</span> — ${recom[grade]}`;
}

// ─── TAB: CMC + NEURO ────────────────────────────────────────────────────────
function buildManoCMCNeuro() {
  const cmc = document.getElementById('mano-cmc-fields');
  if (!cmc || cmc.innerHTML) return;

  cmc.innerHTML = _manoCardHTML(MANO_CMC_TESTS);

  const neuro = document.getElementById('mano-neuro-fields');
  if (neuro) neuro.innerHTML = _manoCardHTML(MANO_NEURO_TESTS);
}

// ─── TAB: FUERZA ─────────────────────────────────────────────────────────────
function buildManoFuerza() {
  const c = document.getElementById('mano-fuerza-fields');
  if (!c || c.innerHTML) return;

  c.innerHTML = `
    <!-- Grip strength -->
    <div class="card mb-8">
      <div class="card-header"><h3>Dinamometría de puño (Grip strength)</h3><span class="tag tag-b">Asimetría >10% = déficit</span></div>
      <div class="card-body">
        <div style="font-size:9px;color:var(--text3);margin-bottom:8px">Ref. aprox.: ♂ 35–55 kg · ♀ 20–35 kg (30–50a). 2° posición mango · media 3 intentos · codo 90° — Chávez Delgado UNAM Rev Fac Med 2024</div>
        <div class="grid-2" style="gap:8px;margin-bottom:6px">
          <div class="ig"><label class="il">Grip D (kg)</label><input class="inp inp-mono" type="number" step="0.1" id="grip-d-mano" placeholder="0" oninput="_calcGripMano()"></div>
          <div class="ig"><label class="il">Grip I (kg)</label><input class="inp inp-mono" type="number" step="0.1" id="grip-i-mano" placeholder="0" oninput="_calcGripMano()"></div>
        </div>
        <div id="grip-mano-result" style="font-size:11px;color:var(--text3)">Ingresar valores para calcular asimetría</div>
      </div>
    </div>
    <!-- Pinch -->
    <div class="card mb-8">
      <div class="card-header"><h3>Fuerza de pinza (Pinch)</h3><span class="tag tag-b">Lateral · Trípode · Pulpejo</span></div>
      <div class="card-body">
        <div style="font-size:9px;color:var(--text3);margin-bottom:8px">Ref. aprox.: Lateral ♂ 8–11 kg / ♀ 5–8 kg · Trípode ♂ 7–9 kg / ♀ 5–7 kg — Chávez Delgado UNAM 2024</div>
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">Lateral D (kg)</label><input class="inp inp-mono" type="number" step="0.1" id="pinch-lat-d" placeholder="0"></div>
          <div class="ig"><label class="il">Lateral I (kg)</label><input class="inp inp-mono" type="number" step="0.1" id="pinch-lat-i" placeholder="0"></div>
          <div class="ig"><label class="il">Trípode D (kg)</label><input class="inp inp-mono" type="number" step="0.1" id="pinch-trip-d" placeholder="0"></div>
          <div class="ig"><label class="il">Trípode I (kg)</label><input class="inp inp-mono" type="number" step="0.1" id="pinch-trip-i" placeholder="0"></div>
          <div class="ig"><label class="il">Pulpejo D (kg)</label><input class="inp inp-mono" type="number" step="0.1" id="pinch-tip-d" placeholder="0"></div>
          <div class="ig"><label class="il">Pulpejo I (kg)</label><input class="inp inp-mono" type="number" step="0.1" id="pinch-tip-i" placeholder="0"></div>
        </div>
      </div>
    </div>
    <!-- ROM muñeca -->
    <div class="card mb-8">
      <div class="card-header"><h3>ROM Muñeca</h3><span class="tag tag-b">Goniometría activa</span></div>
      <div class="card-body">
        <div style="font-size:9px;color:var(--text3);margin-bottom:8px">Valores normales — Lluch Bergadà UNIA 2020 · Exploración física muñeca-mano (Iglesia Peralta)</div>
        <div class="grid-2" style="gap:8px">
          ${[
            ['rom-flex-mun','Flexión muñeca','0–80°','D'],
            ['rom-flex-mun-i','','','I'],
            ['rom-ext-mun','Extensión muñeca','0–70°','D'],
            ['rom-ext-mun-i','','','I'],
            ['rom-dev-rad','Desv. radial','0–20°','D'],
            ['rom-dev-rad-i','','','I'],
            ['rom-dev-cub','Desv. cubital','0–30°','D'],
            ['rom-dev-cub-i','','','I'],
            ['rom-pron-mun','Pronación','0–90°','D'],
            ['rom-pron-mun-i','','','I'],
            ['rom-sup-mun','Supinación','0–90°','D'],
            ['rom-sup-mun-i','','','I']
          ].filter(([,label,,]) => label).map(([id,label,ref,side]) => `
            <div class="ig"><label class="il">${label} (${side}) <span style="color:var(--text3)">${ref}</span></label>
            <input class="inp inp-mono" type="number" id="${id}" placeholder="0"></div>`).join('')}
        </div>
      </div>
    </div>
    <!-- TAM dedos -->
    <div class="card">
      <div class="card-header"><h3>TAM — Total Active Motion dedos</h3><span class="tag tag-b">Normal: TAM = 260°</span></div>
      <div class="card-body">
        <div style="font-size:9px;color:var(--text3);margin-bottom:8px">TAM = Σ MCF + IFP + IFD activa − déficit extensión · Normal por dedo: MCF 0-90° + IFP 0-100° + IFD 0-70° — Chávez Delgado UNAM 2024</div>
        <div class="grid-2" style="gap:8px">
          ${['I (pulgar)','II (índice)','III (medio)','IV (anular)','V (meñique)'].map((d,i) => `
            <div class="ig"><label class="il">TAM ${d} D (°)</label><input class="inp inp-mono" type="number" id="tam-${i+1}-d" placeholder="260"></div>
            <div class="ig"><label class="il">TAM ${d} I (°)</label><input class="inp inp-mono" type="number" id="tam-${i+1}-i" placeholder="260"></div>`).join('')}
        </div>
      </div>
    </div>`;
}

function _calcGripMano() {
  const d = parseFloat(document.getElementById('grip-d-mano')?.value);
  const i = parseFloat(document.getElementById('grip-i-mano')?.value);
  const el = document.getElementById('grip-mano-result');
  if (!el) return;
  if (isNaN(d) || isNaN(i) || !d || !i) { el.textContent = 'Ingresar valores para calcular asimetría'; return; }
  const mayor = Math.max(d,i), menor = Math.min(d,i);
  const asim = ((mayor - menor) / mayor * 100).toFixed(1);
  const color = +asim > 10 ? 'var(--red)' : +asim > 5 ? 'var(--amber)' : 'var(--neon)';
  el.innerHTML = `Asimetría: <strong style="color:${color}">${asim}%</strong> · D: ${d} kg · I: ${i} kg${+asim > 10 ? ' — <span style="color:var(--amber)">déficit clínicamente relevante (>10%)</span>' : ''}`;
}

// ─── TAB: QuickDASH ───────────────────────────────────────────────────────────
function buildManoQDASH() {
  const c = document.getElementById('mano-qdash-fields');
  if (!c || c.innerHTML) return;

  c.innerHTML = `
    <div style="font-size:11px;color:var(--text2);margin-bottom:10px">
      Califique su dificultad (última semana): <strong>1=Sin dificultad · 2=Poca · 3=Moderada · 4=Bastante · 5=No podía hacerlo</strong>
    </div>
    ${MANO_QDASH_ITEMS.map((item, i) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;margin-bottom:6px">${i+1}. ${item}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${[1,2,3,4,5].map(v => `<button class="btn btn-ghost btn-sm" id="mqdash-${i}-${v}" onclick="_setMQDash(${i},${v})" style="font-size:10px;min-width:28px">${v}</button>`).join('')}
      </div>
    </div>`).join('')}
    <div id="mano-qdash-result" style="margin-top:12px;padding:10px;background:var(--bg3);border-radius:8px;font-size:12px;text-align:center;color:var(--text3)">
      Completar todos los ítems para calcular score
    </div>`;
}

function _setMQDash(idx, val) {
  manoQDashVals[idx] = val;
  [1,2,3,4,5].forEach(v => {
    const b = document.getElementById(`mqdash-${idx}-${v}`);
    if (b) b.className = v === val ? 'btn btn-neon btn-sm' : 'btn btn-ghost btn-sm';
  });
  _calcManoQDASH();
}

function _calcManoQDASH() {
  const filled = manoQDashVals.filter(v => v !== null);
  const el = document.getElementById('mano-qdash-result');
  if (!el) return;
  if (filled.length < 11) { el.textContent = `Completar todos los ítems (${filled.length}/11)`; return; }
  const score = ((manoQDashVals.reduce((a,b)=>a+b,0) - 11) / 44 * 100).toFixed(1);
  const color = +score < 30 ? 'var(--neon)' : +score < 60 ? 'var(--amber)' : 'var(--red)';
  const sev = +score < 30 ? 'Leve' : +score < 60 ? 'Moderado' : 'Severo';
  el.innerHTML = `<span style="font-size:18px;font-weight:800;color:${color}">${score}</span>/100 · <strong style="color:${color}">${sev}</strong><br><span style="font-size:9px;color:var(--text3)">QuickDASH — 0=sin discapacidad · 100=máxima discapacidad · JOSPT CPG 2019 Grade A</span>`;
}

// ─── TAB: PRWE ────────────────────────────────────────────────────────────────
function buildManoPRWE() {
  const c = document.getElementById('mano-prwe-fields');
  if (!c || c.innerHTML) return;

  const makeRow = (label, idx, arr, prefix) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;margin-bottom:5px">${idx+1}. ${label}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${[0,1,2,3,4,5,6,7,8,9,10].map(v =>
          `<button class="btn btn-ghost" id="${prefix}-${idx}-${v}" onclick="_setPRWE_mano('${prefix}',${idx},${v},${arr.length})"
           style="font-size:9px;min-width:24px;padding:2px 4px;border-radius:4px">${v}</button>`
        ).join('')}
      </div>
    </div>`;

  c.innerHTML = `
    <div style="font-size:9px;color:var(--text3);margin-bottom:8px">PRWE — Escala 0 (sin dolor/sin dificultad) → 10 (peor dolor/incapaz de hacerlo). Score 0–100: mayor = peor. Referencia: PRWE validation, MacDermid 1996.</div>
    <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px">Dolor (5 ítems)</div>
    ${MANO_PRWE_DOLOR.map((l,i) => makeRow(l, i, MANO_PRWE_DOLOR, 'prwe-d')).join('')}
    <div style="font-size:11px;font-weight:700;color:var(--text2);margin:12px 0 6px;text-transform:uppercase;letter-spacing:.4px">Función — Actividades específicas (6 ítems)</div>
    ${MANO_PRWE_FUNCION_ESP.map((l,i) => makeRow(l, i, MANO_PRWE_FUNCION_ESP, 'prwe-fe')).join('')}
    <div style="font-size:11px;font-weight:700;color:var(--text2);margin:12px 0 6px;text-transform:uppercase;letter-spacing:.4px">Función — Actividades habituales (4 ítems)</div>
    ${MANO_PRWE_FUNCION_USUAL.map((l,i) => makeRow(l, i, MANO_PRWE_FUNCION_USUAL, 'prwe-fu')).join('')}
    <div id="mano-prwe-result" style="margin-top:12px;padding:10px;background:var(--bg3);border-radius:8px;font-size:12px;text-align:center;color:var(--text3)">
      Completar todos los ítems para calcular PRWE
    </div>`;
}

function _setPRWE_mano(prefix, idx, val, len) {
  if (prefix === 'prwe-d') manoPrewDolorVals[idx] = val;
  else if (prefix === 'prwe-fe') manoPrewFuncEspVals[idx] = val;
  else if (prefix === 'prwe-fu') manoPrewFuncUsualVals[idx] = val;
  for (let v = 0; v <= 10; v++) {
    const b = document.getElementById(`${prefix}-${idx}-${v}`);
    if (b) b.className = v === val ? 'btn btn-neon' : 'btn btn-ghost';
    if (b) b.style.cssText = `font-size:9px;min-width:24px;padding:2px 4px;border-radius:4px`;
  }
  _calcManoPRWE();
}

function _calcManoPRWE() {
  const el = document.getElementById('mano-prwe-result');
  if (!el) return;
  const dFilled = manoPrewDolorVals.filter(v => v !== null).length;
  const feFilled = manoPrewFuncEspVals.filter(v => v !== null).length;
  const fuFilled = manoPrewFuncUsualVals.filter(v => v !== null).length;
  if (dFilled < 5 || feFilled < 6 || fuFilled < 4) {
    el.textContent = `Completar: dolor ${dFilled}/5 · func.esp. ${feFilled}/6 · func.usual ${fuFilled}/4`;
    return;
  }
  const painScore = manoPrewDolorVals.reduce((a,b)=>a+b,0); // 0-50
  const funcScore = (manoPrewFuncEspVals.reduce((a,b)=>a+b,0) + manoPrewFuncUsualVals.reduce((a,b)=>a+b,0)) / 2; // 0-50
  const total = Math.round(painScore + funcScore);
  const color = total < 30 ? 'var(--neon)' : total < 55 ? 'var(--amber)' : 'var(--red)';
  const sev = total < 30 ? 'Leve' : total < 55 ? 'Moderado' : 'Severo';
  el.innerHTML = `<span style="font-size:18px;font-weight:800;color:${color}">${total}</span>/100 · <strong style="color:${color}">${sev}</strong><br>
    <span style="font-size:9px;color:var(--text3)">Dolor: ${painScore}/50 · Función: ${Math.round(funcScore)}/50 · PRWE — 0=sin limitación, 100=máxima limitación · MacDermid 1996</span>`;
}

// ─── INFORME ──────────────────────────────────────────────────────────────────
function generarInformeMano() {
  if (!cur) { alert('Abrí la ficha del paciente primero'); return; }

  const nombre  = cur?.nombre  || '—';
  const edad    = cur?.edad    || '';
  const deporte = cur?.deporte || '';
  const fecha   = new Date().toLocaleDateString('es-AR', {day:'2-digit',month:'long',year:'numeric'});

  const stcPos   = _mano_getPosTests('mano-stc-fields');
  const dqPos    = _mano_getPosTests('mano-dequervain-fields');
  const gatPos   = _mano_getPosTests('mano-gatillo-fields');
  const cmcPos   = _mano_getPosTests('mano-cmc-fields');
  const neuroPos = _mano_getPosTests('mano-neuro-fields');
  const allPos   = [...stcPos, ...dqPos, ...gatPos, ...cmcPos, ...neuroPos];

  const gripD = parseFloat(document.getElementById('grip-d-mano')?.value) || 0;
  const gripI = parseFloat(document.getElementById('grip-i-mano')?.value) || 0;

  const diagnoses = [];
  const durkanPos  = stcPos.some(t => t.includes('Durkan') || t.includes('Compresión'));
  const phalenPos  = stcPos.some(t => t.includes('Phalen') && !t.includes('invertido'));
  const tinelTCPos = stcPos.some(t => t.includes('Tinel') && t.includes('túnel'));
  if (durkanPos || (phalenPos && tinelTCPos)) diagnoses.push('stc');
  if (dqPos.some(t => t.includes('Finkelstein') || t.includes('Muckard') || t.includes('1er compartimento'))) diagnoses.push('dequervain');
  if (gatPos.some(t => t.includes('polea') || t.includes('resorte') || t.includes('Bloqueo'))) diagnoses.push('trigger-finger');
  if (cmcPos.some(t => t.includes('Grind'))) diagnoses.push('rizartrosis');
  if (cmcPos.some(t => t.includes('Heberden') || t.includes('Bouchard'))) diagnoses.push('oa-mano');
  if (neuroPos.some(t => t.includes('Guyon') || t.includes('Froment') || t.includes('Wartenberg'))) diagnoses.push('guyon');
  if (neuroPos.some(t => t.includes('Dupuytren') || t.includes('Table') || t.includes('Hueston'))) diagnoses.push('dupuytren');

  const validDxs = [...new Set(diagnoses)].map(id => MANO_RULES.find(r => r.id === id)).filter(Boolean);

  const qdashScore = manoQDashVals.filter(v=>v!==null).length === 11
    ? +((manoQDashVals.reduce((a,b)=>a+b,0) - 11) / 44 * 100).toFixed(1)
    : null;
  const prweD  = manoPrewDolorVals.filter(v=>v!==null).length === 5;
  const prweFE = manoPrewFuncEspVals.filter(v=>v!==null).length === 6;
  const prweFU = manoPrewFuncUsualVals.filter(v=>v!==null).length === 4;
  const prweTotal = (prweD && prweFE && prweFU)
    ? Math.round(manoPrewDolorVals.reduce((a,b)=>a+b,0) + (manoPrewFuncEspVals.reduce((a,b)=>a+b,0) + manoPrewFuncUsualVals.reduce((a,b)=>a+b,0)) / 2)
    : null;

  const css = typeof _tmcCSS !== 'undefined' ? _tmcCSS() : '';
  const _msec = (num, title) => typeof _tmcSecHead !== 'undefined'
    ? _tmcSecHead(num, title)
    : `<div class="sec-head"><span class="sec-badge">${num}</span><span class="sec-title">${title}</span></div>`;

  // Charts
  const _mGripBar = (typeof _tmcBarChart !== 'undefined' && (gripD || gripI))
    ? _tmcBarChart([{label:'Puño',D:gripD,I:gripI,unit:'kg',ref:40,asim:gripD&&gripI?Math.abs(gripD-gripI)/Math.max(gripD,gripI)*100:0}], {title:'Fuerza de Puño D vs I (kg)'})
    : '';
  const _mQdashG = (typeof _tmcGauge !== 'undefined' && qdashScore !== null)
    ? _tmcGauge(qdashScore, 100, {label:'QuickDASH', sub:'/100 · 0=sin discapacidad', size:140, colorFn: v=>v<30?'#2d7a2d':v<60?'#798254':'#cc3333'}) : '';
  const _mPrweG  = (typeof _tmcGauge !== 'undefined' && prweTotal !== null)
    ? _tmcGauge(prweTotal,  100, {label:'PRWE',      sub:'/100 · 0=sin discapacidad', size:140, colorFn: v=>v<30?'#2d7a2d':v<55?'#798254':'#cc3333'}) : '';

  // Sec 01 — Perfil
  const sec01 = _msec('01','Perfil del paciente') + `
    <div class="intro-box">Datos de identificación registrados al inicio de la evaluación de mano y muñeca.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#f6f8ee;border-radius:6px;padding:12px;border:1px solid #dde5c4">
        <div style="font-size:9px;text-transform:uppercase;color:#798254;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos del Paciente</div>
        ${nombre?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Nombre:</span> <strong>${nombre}</strong></div>`:''}
        ${edad?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Edad:</span> ${edad} años</div>`:''}
        ${deporte?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Deporte:</span> ${deporte}</div>`:''}
        <div><span style="font-size:10px;color:#888">Fecha:</span> ${fecha}</div>
      </div>
      <div style="background:#f6f8ee;border-radius:6px;padding:12px;border:1px solid #dde5c4">
        <div style="font-size:9px;text-transform:uppercase;color:#798254;font-weight:700;letter-spacing:1px;margin-bottom:8px">Hallazgos</div>
        <div style="font-size:11px;color:#1e1e1b"><strong>${allPos.length}</strong> tests positivos registrados</div>
        <div style="font-size:11px;color:#1e1e1b;margin-top:4px"><strong>${validDxs.length}</strong> diagnósticos presuntivos</div>
        ${gripD||gripI?`<div style="margin-top:4px;font-size:10px;color:#888">Grip D: ${gripD} kg · I: ${gripI} kg</div>`:''}
      </div>
    </div>`;

  // Sec 02 — Tests positivos
  const sec02 = allPos.length ? _msec('02','Tests ortopédicos positivos') + `
    <div class="intro-box">Tests estandarizados con resultado POSITIVO. Fuentes: JOSPT CPG 2019 · HANDGUIDE 2014 · EULAR 2018.</div>
    <table>
      <tr><th>Sección</th><th>Tests positivos</th></tr>
      ${stcPos.length?`<tr><td><strong>Síndrome Túnel Carpiano</strong></td><td>${stcPos.join(' · ')}</td></tr>`:''}
      ${dqPos.length?`<tr><td><strong>De Quervain</strong></td><td>${dqPos.join(' · ')}</td></tr>`:''}
      ${gatPos.length?`<tr><td><strong>Dedo en Gatillo</strong></td><td>${gatPos.join(' · ')}</td></tr>`:''}
      ${cmcPos.length?`<tr><td><strong>CMC / OA Mano</strong></td><td>${cmcPos.join(' · ')}</td></tr>`:''}
      ${neuroPos.length?`<tr><td><strong>Neuropatía / Otros</strong></td><td>${neuroPos.join(' · ')}</td></tr>`:''}
    </table>` : '';

  // Sec 03 — Fuerza de puño
  const asim = gripD && gripI ? ((Math.abs(gripD-gripI)/Math.max(gripD,gripI))*100).toFixed(1) : null;
  const sec03 = (gripD || gripI) ? _msec('03','Fuerza de puño') + `
    <div class="intro-box">Dinamometría manual. Referencia ≥ 35 kg adulto activo. Asimetría &gt;10% = déficit clínicamente relevante (Chávez Delgado 2024).</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;text-align:center">
      <div style="background:#f6f8ee;border-radius:6px;padding:10px;border:1px solid #dde5c4">
        <div style="font-size:9px;color:#798254;font-weight:700;text-transform:uppercase;margin-bottom:4px">Derecho</div>
        <div style="font-size:22px;font-weight:900;color:#1e1e1b">${gripD}<span style="font-size:12px;color:#888"> kg</span></div>
      </div>
      <div style="background:#f6f8ee;border-radius:6px;padding:10px;border:1px solid #dde5c4">
        <div style="font-size:9px;color:#798254;font-weight:700;text-transform:uppercase;margin-bottom:4px">Izquierdo</div>
        <div style="font-size:22px;font-weight:900;color:#1e1e1b">${gripI}<span style="font-size:12px;color:#888"> kg</span></div>
      </div>
      <div style="background:#f6f8ee;border-radius:6px;padding:10px;border:1px solid #dde5c4">
        <div style="font-size:9px;color:#798254;font-weight:700;text-transform:uppercase;margin-bottom:4px">Asimetría</div>
        <div style="font-size:22px;font-weight:900;color:${asim&&+asim>10?'#cc3333':asim&&+asim>5?'#c65a00':'#2d7a2d'}">${asim||'—'}<span style="font-size:12px;color:#888">%</span></div>
      </div>
    </div>
    ${_mGripBar}` : '';

  // Sec 04 — Diagnósticos
  const sec04 = validDxs.length ? _msec('04','Diagnósticos presuntivos') + `
    <div class="intro-box">Motor diagnóstico basado en: JOSPT CPG 2019 (STC) · HANDGUIDE 2014 · EULAR Ann Rheum Dis 2019 · Doha Consensus BJSM 2013–2015. No reemplaza el juicio clínico.</div>
    ${validDxs.map((rule,i) => `
    <div class="dx-card" style="${i===0?'border-color:#798254;border-width:2px':''}">
      <div class="dx-head"><span style="font-size:12px;font-weight:800;color:#798254">${i===0?'🏆 ':''}${rule.label}</span></div>
      <div class="dx-body">
        <div style="font-size:10px;font-weight:700;color:#798254;text-transform:uppercase;margin-bottom:6px">Criterios diagnósticos</div>
        <ul style="margin:0 0 10px;padding-left:16px;font-size:10px;line-height:1.7;color:#444">
          ${rule.criterios.map(c=>`<li>${c}</li>`).join('')}
        </ul>
        ${rule.recom.map(fase=>`
        <div style="margin-top:8px;padding:8px 12px;border-left:3px solid #798254;background:#f6f8ee;border-radius:0 5px 5px 0">
          <div style="font-size:10px;font-weight:800;color:#1e1e1b;text-transform:uppercase;margin-bottom:4px">${fase.fase}</div>
          <ul style="margin:0;padding-left:16px;font-size:10px;line-height:1.7;color:#333">
            ${fase.items.map(it=>`<li>${it}</li>`).join('')}
          </ul>
        </div>`).join('')}
      </div>
    </div>`).join('')}` : '';

  // Sec 05 — Escalas
  const sec05 = (qdashScore !== null || prweTotal !== null) ? _msec('05','Escalas funcionales') + `
    <div class="intro-box">QuickDASH: Discapacidad miembro superior · MCID 15 pts · 0=sin discapacidad. PRWE: Dolor y función muñeca · MacDermid 1996 · 0=sin limitación.</div>
    <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-top:14px">
      ${_mQdashG}${_mPrweG}
    </div>` : '';

  const _manoBody = [sec01, sec02, sec03, sec04, sec05].join('');

  const _profNmMano = cur?.kine || 'Lic. Emanuel Lezcano';
  const _hMano = typeof _tmcHeader  !== 'undefined' ? _tmcHeader({profNombre:_profNmMano,subtitulo:'EVALUACIÓN KINESIOLÓGICA — MANO Y MUÑECA',refs:'JOSPT CPG 2019 · HANDGUIDE 2014 · EULAR 2018'}) : '';
  const _fMano = typeof _tmcFooter  !== 'undefined' ? _tmcFooter('Mano','JOSPT CPG 2019 · HANDGUIDE 2014 · MacDermid 1996') : '';
  const _firmaMano = typeof _tmcFirma !== 'undefined' ? _tmcFirma({profNombre:_profNmMano}) : '';
  const _tbMano = typeof _tmcToolbar !== 'undefined' ? _tmcToolbar : '';

  const fullHTML = `<!DOCTYPE html><html lang="es"><head>
  <meta charset="UTF-8"><title>Informe Mano — ${nombre}</title>
  <style>${css}</style></head><body>
  ${_tbMano}${_hMano}
  <div id="report-body" style="padding:32px 44px;max-width:920px;margin:0 auto">
    ${_manoBody}${_firmaMano}
  </div>
  ${_fMano}
  </body></html>`;

  if (typeof _tmcOpenWindow !== 'undefined') { _tmcOpenWindow(fullHTML, `Informe Mano — ${nombre}`); }
  else { const w=window.open('','_blank','width=980,height=880,resizable=yes,scrollbars=yes'); if(w){w.document.write(fullHTML);w.document.close();} }
}

function imprimirInformeMano() {
  generarInformeMano();
}

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
  const container = document.getElementById('mano-informe-container');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Generando informe...</div>';

  // Recolectar tests positivos por sección
  const stcPos     = _mano_getPosTests('mano-stc-fields');
  const dqPos      = _mano_getPosTests('mano-dequervain-fields');
  const gatPos     = _mano_getPosTests('mano-gatillo-fields');
  const cmcPos     = _mano_getPosTests('mano-cmc-fields');
  const neuroPos   = _mano_getPosTests('mano-neuro-fields');
  const allPos     = [...stcPos, ...dqPos, ...gatPos, ...cmcPos, ...neuroPos];

  // Grip y PRWE/QuickDASH scores
  const gripD = parseFloat(document.getElementById('grip-d-mano')?.value) || 0;
  const gripI = parseFloat(document.getElementById('grip-i-mano')?.value) || 0;
  const qdashRaw = document.getElementById('mano-qdash-result')?.textContent || '';
  const prweRaw  = document.getElementById('mano-prwe-result')?.textContent || '';

  // ── Lógica diagnóstica ──────────────────────────────────────────────────────
  const diagnoses = [];

  // STC: Durkan o (Phalen + Tinel)
  const durkanPos  = stcPos.some(t => t.includes('Durkan') || t.includes('Compresión'));
  const phalenPos  = stcPos.some(t => t.includes('Phalen') && !t.includes('invertido'));
  const tinelTCPos = stcPos.some(t => t.includes('Tinel') && t.includes('túnel'));
  if (durkanPos || (phalenPos && tinelTCPos)) diagnoses.push('stc');

  // De Quervain: Finkelstein o Muckard
  if (dqPos.some(t => t.includes('Finkelstein') || t.includes('Muckard') || t.includes('1er compartimento'))) diagnoses.push('dequervain');

  // Dedo en gatillo: polea A1 o bloqueo
  if (gatPos.some(t => t.includes('polea') || t.includes('resorte') || t.includes('Bloqueo'))) diagnoses.push('trigger-finger');

  // Rizartrosis: Grind CMC
  if (cmcPos.some(t => t.includes('Grind'))) diagnoses.push('rizartrosis');

  // OA mano: Heberden o Bouchard
  if (cmcPos.some(t => t.includes('Heberden') || t.includes('Bouchard'))) diagnoses.push('oa-mano');

  // Guyon/neuropatía cubital: Tinel Guyon, Froment o Wartenberg
  if (neuroPos.some(t => t.includes('Guyon') || t.includes('Froment') || t.includes('Wartenberg'))) diagnoses.push('guyon');

  // Dupuytren: cuerda palpable o table test
  if (neuroPos.some(t => t.includes('Dupuytren') || t.includes('Table') || t.includes('Hueston'))) diagnoses.push('dupuytren');

  const validDxs = [...new Set(diagnoses)].map(id => MANO_RULES.find(r => r.id === id)).filter(Boolean);
  const now = new Date().toLocaleDateString('es-AR');
  const patName = typeof cur !== 'undefined' && cur?.nombre ? cur.nombre : '—';

  let html = `<div style="font-family:var(--sans);color:var(--text1)">`;

  // Encabezado
  html += `<div style="background:var(--bg3);border-radius:10px;padding:12px 14px;margin-bottom:12px">
    <div style="font-size:15px;font-weight:800">✋ Informe Evaluación Mano / Muñeca</div>
    <div style="font-size:11px;color:var(--text2)">${patName} · ${now}</div>
  </div>`;

  // Tests positivos
  if (allPos.length) {
    html += `<div class="card mb-10"><div class="card-header"><h3>Tests positivos</h3><span class="tag tag-r">${allPos.length} hallazgos</span></div><div class="card-body">`;
    if (stcPos.length)   html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:3px;text-transform:uppercase">STC</div><div style="font-size:11px;margin-bottom:8px">${stcPos.join(' · ')}</div>`;
    if (dqPos.length)    html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:3px;text-transform:uppercase">De Quervain</div><div style="font-size:11px;margin-bottom:8px">${dqPos.join(' · ')}</div>`;
    if (gatPos.length)   html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:3px;text-transform:uppercase">Dedo en Gatillo</div><div style="font-size:11px;margin-bottom:8px">${gatPos.join(' · ')}</div>`;
    if (cmcPos.length)   html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:3px;text-transform:uppercase">CMC / OA</div><div style="font-size:11px;margin-bottom:8px">${cmcPos.join(' · ')}</div>`;
    if (neuroPos.length) html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:3px;text-transform:uppercase">Neuropatía</div><div style="font-size:11px">${neuroPos.join(' · ')}</div>`;
    html += `</div></div>`;
  }

  // Fuerza
  if (gripD || gripI) {
    const mayor = Math.max(gripD, gripI), menor = Math.min(gripD, gripI);
    const asim = mayor > 0 ? ((mayor - menor) / mayor * 100).toFixed(1) : 0;
    const color = +asim > 10 ? 'var(--red)' : +asim > 5 ? 'var(--amber)' : 'var(--neon)';
    html += `<div class="card mb-10"><div class="card-header"><h3>Fuerza de puño</h3></div><div class="card-body">
      <div style="font-size:12px">D: <strong>${gripD} kg</strong> · I: <strong>${gripI} kg</strong> · Asimetría: <strong style="color:${color}">${asim}%</strong></div>
      ${+asim > 10 ? '<div style="font-size:10px;color:var(--amber);margin-top:4px">⚠️ Asimetría >10% — déficit clínicamente relevante (Chávez Delgado UNAM 2024)</div>' : ''}
    </div></div>`;
  }

  // Sin hallazgos
  if (!allPos.length && !diagnoses.length) {
    html += `<div class="card mb-10" style="background:var(--bg3)"><div class="card-body">
      <div style="font-size:12px;color:var(--text2)">Sin tests positivos registrados. Completar evaluación clínica antes de generar informe.</div>
    </div></div>`;
  }

  // Diagnósticos presuntivos + recomendaciones
  if (validDxs.length) {
    html += `<div style="font-size:11px;font-weight:700;color:var(--neon);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">DIAGNÓSTICOS PRESUNTIVOS</div>`;
    validDxs.forEach(rule => {
      html += `<div class="card mb-10" style="border-color:rgba(57,255,122,.25)">
        <div class="card-header"><h3>${rule.label}</h3><span class="tag tag-g">Presuntivo</span></div>
        <div class="card-body">
          <div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:4px;text-transform:uppercase">Criterios diagnósticos</div>
          <ul style="margin:0 0 10px;padding-left:16px;font-size:11px;color:var(--text2)">
            ${rule.criterios.map(c => `<li style="margin-bottom:3px">${c}</li>`).join('')}
          </ul>`;
      rule.recom.forEach(fase => {
        html += `<div style="font-size:10px;font-weight:700;color:var(--amber);margin-bottom:4px;text-transform:uppercase;margin-top:8px">${fase.fase}</div>
          <ul style="margin:0 0 6px;padding-left:16px;font-size:11px;color:var(--text2)">
            ${fase.items.map(item => `<li style="margin-bottom:3px">${item}</li>`).join('')}
          </ul>`;
      });
      html += `</div></div>`;
    });
  }

  // Escalas
  const qdashScore = manoQDashVals.filter(v=>v!==null).length === 11
    ? ((manoQDashVals.reduce((a,b)=>a+b,0) - 11) / 44 * 100).toFixed(1)
    : null;
  const prweD = manoPrewDolorVals.filter(v=>v!==null).length === 5;
  const prweFE = manoPrewFuncEspVals.filter(v=>v!==null).length === 6;
  const prweFU = manoPrewFuncUsualVals.filter(v=>v!==null).length === 4;
  const prweTotal = (prweD && prweFE && prweFU)
    ? Math.round(manoPrewDolorVals.reduce((a,b)=>a+b,0) + (manoPrewFuncEspVals.reduce((a,b)=>a+b,0) + manoPrewFuncUsualVals.reduce((a,b)=>a+b,0)) / 2)
    : null;

  if (qdashScore !== null || prweTotal !== null) {
    html += `<div class="card mb-10"><div class="card-header"><h3>Escalas funcionales</h3></div><div class="card-body" style="font-size:11px">`;
    if (qdashScore !== null) {
      const q = +qdashScore;
      const qcolor = q < 30 ? 'var(--neon)' : q < 60 ? 'var(--amber)' : 'var(--red)';
      html += `<div style="margin-bottom:6px"><strong>QuickDASH:</strong> <span style="color:${qcolor};font-size:14px;font-weight:800">${qdashScore}</span>/100 (${q<30?'Leve':q<60?'Moderado':'Severo'}) — 0=sin discapacidad</div>`;
    }
    if (prweTotal !== null) {
      const p = prweTotal;
      const pcolor = p < 30 ? 'var(--neon)' : p < 55 ? 'var(--amber)' : 'var(--red)';
      html += `<div><strong>PRWE:</strong> <span style="color:${pcolor};font-size:14px;font-weight:800">${prweTotal}</span>/100 (${p<30?'Leve':p<55?'Moderado':'Severo'}) — Patient-Rated Wrist Evaluation · MacDermid 1996</div>`;
    }
    html += `</div></div>`;
  }

  // Footer evidencia
  html += `<div style="font-size:9px;color:var(--text3);padding:10px;border-top:1px solid var(--border);margin-top:4px">
    Fuentes: JOSPT CPG 2019 (STC) · HANDGUIDE 2014 (De Quervain / Trigger Finger) · EULAR 2018 Ann Rheum Dis 2019 (OA Mano) · HANDGUIDE BJSM 2013 (Guyon) · HANDGUIDE PRS 2013 (Dupuytren) · Chávez Delgado UNAM Rev Fac Med 2024 · Lluch Bergadà &amp; García Elías UNIA 2020
  </div>`;

  html += `</div>`;
  container.innerHTML = html;
}

function imprimirInformeMano() {
  const el = document.getElementById('mano-informe-container');
  if (!el || !el.innerHTML.trim()) { generarInformeMano(); setTimeout(imprimirInformeMano, 300); return; }
  const w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Informe Mano</title>
    <style>body{font-family:sans-serif;margin:24px;font-size:13px} h3{margin:4px 0} ul{margin:4px 0 8px} li{margin-bottom:3px} .card{border:1px solid #ccc;border-radius:8px;padding:10px;margin-bottom:10px}</style>
    </head><body>${el.innerHTML}</body></html>`);
  w.document.close();
  w.print();
}

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
  buildCodoSymptoms();
  if (typeof refreshCodoSessionBar === 'function') refreshCodoSessionBar();
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
    <div class="card mb-8" data-test-id="${t.id}">
      <div class="card-header"><h3>${t.name}</h3><span class="tag ${t.tag}" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:8px">${t.ref}</div>
        <div class="grid-2" style="gap:8px">
          <div class="codo-test-col">
            <div class="il mb-4">Derecho</div>
            <div style="display:flex;gap:6px">
              <button class="ot-btn" onclick="toggleOTCodo(this,'pos')">+ POS</button>
              <button class="ot-btn" onclick="toggleOTCodo(this,'neg')">– NEG</button>
            </div>
            <div style="margin-top:6px">
              <label style="font-size:10px;color:var(--text3)">EVA D</label>
              <input type="range" class="eva-slider codo-eva-d" min="0" max="10" value="0"
                oninput="this.nextElementSibling.textContent=this.value">
              <span style="font-family:var(--mono);font-size:13px;display:block;text-align:center">0</span>
            </div>
          </div>
          <div class="codo-test-col">
            <div class="il mb-4">Izquierdo</div>
            <div style="display:flex;gap:6px">
              <button class="ot-btn" onclick="toggleOTCodo(this,'pos')">+ POS</button>
              <button class="ot-btn" onclick="toggleOTCodo(this,'neg')">– NEG</button>
            </div>
            <div style="margin-top:6px">
              <label style="font-size:10px;color:var(--text3)">EVA I</label>
              <input type="range" class="eva-slider codo-eva-i" min="0" max="10" value="0"
                oninput="this.nextElementSibling.textContent=this.value">
              <span style="font-family:var(--mono);font-size:13px;display:block;text-align:center">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleOTCodo(btn, type) {
  const btnGroup = btn.parentElement;
  btnGroup.querySelectorAll('.ot-btn').forEach(b => b.classList.remove('pos','neg'));
  btn.classList.add(type);
  // Lock EVA slider in same column div if NEG
  const col = btnGroup.closest('.codo-test-col');
  if (col) {
    const slider = col.querySelector('.eva-slider');
    const valEl  = col.querySelector('span');
    if (slider) {
      if (type === 'neg') {
        slider.disabled = true;
        slider.value = 0;
        slider.style.opacity = '0.25';
        slider.style.pointerEvents = 'none';
        if (valEl) valEl.textContent = '0';
      } else {
        slider.disabled = false;
        slider.style.opacity = '1';
        slider.style.pointerEvents = '';
      }
    }
  }
  // Update diagnostic engine
  setTimeout(() => {
    if (typeof renderDiagnosticosCodo === 'function') {
      renderDiagnosticosCodo(_getCodoModalPositivos(), _getCodoSelectedSymptoms());
    }
    _renderCodoMissingAlerts();
  }, 0);
}

// ── Helper: get positive test IDs from modal DOM ──────────────────────────
function _getCodoModalPositivos() {
  const positivos = [];
  const allGroups = [...CODO_TESTS_LATERAL, ...CODO_TESTS_MEDIAL, ...CODO_TESTS_NEURAL];
  allGroups.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (!card) return;
    const cols = card.querySelectorAll('.codo-test-col');
    cols.forEach(col => {
      if (col.querySelector('.ot-btn.pos')) positivos.push(test.id);
    });
  });
  return [...new Set(positivos)];
}

// ── Helper: get ALL done tests (POS or NEG pressed) ──────────────────────
function _getDoneCodoTestIds() {
  const done = new Set();
  const allGroups = [...CODO_TESTS_LATERAL, ...CODO_TESTS_MEDIAL, ...CODO_TESTS_NEURAL];
  allGroups.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (!card) return;
    const cols = card.querySelectorAll('.codo-test-col');
    cols.forEach(col => {
      if (col.querySelector('.ot-btn.pos,.ot-btn.neg')) done.add(test.id);
    });
  });
  return done;
}

// ── Helper: get selected symptom IDs ─────────────────────────────────────
function _getCodoSelectedSymptoms() {
  const checked = document.querySelectorAll('#codo-symptoms-list input[type=checkbox]:checked');
  return [...checked].map(cb => cb.value);
}

// ── Symptom Checklist Builder ─────────────────────────────────────────────
function buildCodoSymptoms() {
  const c = document.getElementById('codo-symptoms-list'); if (!c || c.innerHTML) return;
  if (typeof CODO_SYMPTOMS === 'undefined') return;

  const regions = [
    { key: 'lateral',  label: 'Región Lateral', color: 'var(--red)',   tag: 'tag-r' },
    { key: 'medial',   label: 'Región Medial',   color: 'var(--amber)', tag: 'tag-y' },
    { key: 'neural',   label: 'Neural / Nervio Cubital', color: '#60a5fa', tag: 'tag-b' },
    { key: 'instab',   label: 'Inestabilidad / UCL', color: '#fb923c', tag: '' },
    { key: 'rigidez',  label: 'Rigidez / Post-traumático', color: 'var(--text2)', tag: '' },
  ];

  c.innerHTML = regions.map(r => {
    const items = CODO_SYMPTOMS.filter(s => s.region === r.key);
    if (!items.length) return '';
    return `
      <div style="margin-bottom:10px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${r.color};margin-bottom:5px">${r.label}</div>
        ${items.map(s => `
          <label style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid var(--border);cursor:pointer">
            <input type="checkbox" value="${s.id}" onchange="_onCodoSymptomChange()" style="margin-top:2px;accent-color:${r.color}">
            <span style="font-size:11px;line-height:1.4">${s.icon} ${s.label}</span>
          </label>
        `).join('')}
      </div>
    `;
  }).join('');
}

function _onCodoSymptomChange() {
  setTimeout(() => {
    if (typeof renderDiagnosticosCodo === 'function') {
      renderDiagnosticosCodo(_getCodoModalPositivos(), _getCodoSelectedSymptoms());
    }
    _renderCodoMissingAlerts();
  }, 0);
}

// ── Live missing test alerts ──────────────────────────────────────────────
function _renderCodoMissingAlerts() {
  const panel = document.getElementById('codo-missing-alerts-panel');
  if (!panel) return;
  const positivos = _getCodoModalPositivos();
  const symptoms  = _getCodoSelectedSymptoms();
  const doneIds   = _getDoneCodoTestIds();
  if ((positivos.length === 0 && symptoms.length === 0) || typeof CODO_RULES === 'undefined') {
    panel.innerHTML = ''; return;
  }

  const allTests = [
    ...(typeof CODO_TESTS_LATERAL !== 'undefined' ? CODO_TESTS_LATERAL : []),
    ...(typeof CODO_TESTS_MEDIAL  !== 'undefined' ? CODO_TESTS_MEDIAL  : []),
    ...(typeof CODO_TESTS_NEURAL  !== 'undefined' ? CODO_TESTS_NEURAL  : [])
  ];
  const tnOf = id => (allTests.find(t => t.id === id)?.name || id);

  const alerts = [];
  CODO_RULES.diagnosticos.forEach(dx => {
    if (!dx.testsKey.length) return;
    const ph = dx.testsKey.filter(t => positivos.includes(t));
    const nd = dx.testsKey.filter(t => !doneIds.has(t));
    if (ph.length >= 1 && nd.length > 0) {
      alerts.push({
        dxNombre: dx.nombre, missing: nd, imagingRec: dx.imagingRec || null,
        reason: ph.length >= dx.umbral ? 'confirmar hallazgo' : 'descartar diagnóstico'
      });
    }
  });

  if (!alerts.length) { panel.innerHTML = ''; return; }

  let h = `<div style="background:rgba(255,193,7,.08);border:1px solid var(--amber);border-radius:var(--r);padding:12px 14px;margin-top:10px">
    <div style="font-size:11px;font-weight:800;color:var(--amber);margin-bottom:6px;display:flex;align-items:center;gap:8px">
      ⚠️ Tests complementarios recomendados
      <span style="font-size:9px;font-weight:500;color:var(--text3)">${alerts.length} diagnóstico${alerts.length > 1 ? 's' : ''} sin confirmar</span>
    </div>
    <div style="font-size:10px;color:var(--text2);margin-bottom:10px;line-height:1.5">
      Tests clave no realizados que cambiarían la certeza diagnóstica. Realizarlos antes de concluir la evaluación:
    </div>`;

  alerts.forEach(al => {
    const missingHTML = al.missing.map(id =>
      `<span style="background:rgba(255,193,7,.15);border:1px solid var(--amber);color:var(--text);font-size:9px;padding:2px 8px;border-radius:3px;font-weight:600">${tnOf(id)}</span>`
    ).join(' ');
    h += `<div style="margin-bottom:8px;padding:9px 11px;background:var(--bg2);border-radius:5px;border-left:3px solid var(--amber)">
      <div style="font-size:10px;font-weight:700;color:var(--text);margin-bottom:5px">${al.dxNombre} <span class="tag tag-y" style="font-size:8px">${al.reason}</span></div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:6px">→ Realizar: ${missingHTML}</div>`;
    if (al.imagingRec) h += `<div style="font-size:9px;color:var(--text3);line-height:1.5;padding:5px 8px;background:var(--bg3);border-radius:3px">📷 ${al.imagingRec}</div>`;
    h += '</div>';
  });
  h += '</div>';
  panel.innerHTML = h;
}

// ── Tab switcher (extended) ───────────────────────────────────────────────
function showCTab(tab, btn) {
  const lazy = document.getElementById('codo-rom-fields');
  if (lazy && !lazy.innerHTML) initCodoSheet();
  ['obs','rom','tests','fuerza','esc','informe'].forEach(t => {
    const el = document.getElementById('ctab-' + t); if(el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-codo .btn').forEach(b => {
    if(b.id && b.id.startsWith('ctab-')) { b.className = 'btn btn-ghost btn-sm'; b.style.whiteSpace='nowrap'; b.style.fontSize='10px'; }
  });
  if(btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace='nowrap'; btn.style.fontSize='10px'; }
}

// ── Session management (espejo de hombro) ────────────────────────────────
let _codoSessions = []; // loaded from cur.klinical.codo.sessions

function _readCodoSessionData() {
  const gt  = id => document.getElementById(id)?.textContent || '';
  const gv  = id => document.getElementById(id)?.value || '';
  const gcb = sel => [...document.querySelectorAll(sel)].map(cb => cb.checked);

  // Tests: read all button states per card
  const allTests = [...CODO_TESTS_LATERAL, ...CODO_TESTS_MEDIAL, ...CODO_TESTS_NEURAL];
  const tests = {};
  allTests.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (!card) return;
    const cols = card.querySelectorAll('.codo-test-col');
    tests[test.id] = { d: null, i: null, evaD: 0, evaI: 0 };
    cols.forEach((col, idx) => {
      const side = idx === 0 ? 'd' : 'i';
      const posBtn = col.querySelector('.ot-btn.pos');
      const negBtn = col.querySelector('.ot-btn.neg');
      tests[test.id][side] = posBtn ? 'pos' : (negBtn ? 'neg' : null);
      const slider = col.querySelector('.eva-slider');
      tests[test.id][idx === 0 ? 'evaD' : 'evaI'] = slider ? +slider.value : 0;
    });
  });

  // ROM
  const rom = {};
  CODO_ROM.forEach(m => {
    rom[m.id] = {
      actD: gv(`crom-${m.id}-act-d`), actI: gv(`crom-${m.id}-act-i`),
      pasD: gv(`crom-${m.id}-pas-d`), pasI: gv(`crom-${m.id}-pas-i`)
    };
  });

  // Symptoms
  const symptomsChecked = [...document.querySelectorAll('#codo-symptoms-list input[type=checkbox]:checked')].map(cb => cb.value);

  return {
    fecha: new Date().toISOString().split('T')[0],
    nombre: '',
    tests, rom, symptomsChecked,
    pfgsD: gv('pfgs-d'), pfgsI: gv('pfgs-i'),
    gripD: gv('grip-max-d'), gripI: gv('grip-max-i'),
    pptD: gv('ppt-d'), pptI: gv('ppt-i'),
    nprsReposo: gv('codo-nprs-reposo'), nprsMov: gv('codo-nprs-mov'), nprsFunc: gv('codo-nprs-func'),
    dominancia: gv('codo-dominancia'), lado: gv('codo-lado'),
    tiempo: gv('codo-tiempo'), actividad: gv('codo-actividad'),
    obsText: gv('codo-obs-text'),
    prteeTotal: gt('prtee-total'), qdashTotal: gt('codo-qdash-total'),
    prteeDolorVals: [...(window.prteeDolorVals||[])],
    prteeActivVals: [...(window.prteeActivVals||[])],
    prteeUsualVals: [...(window.prteeUsualVals||[])],
    codoQDashVals:  [...(window.codoQDashVals||[])],
  };
}

function _writeCodoSessionData(data) {
  if (!data) return;
  const sv = (id, val) => { const el = document.getElementById(id); if(el && val !== undefined && val !== null && val !== '') el.value = val; };

  // Inputs básicos
  sv('codo-nprs-reposo', data.nprsReposo); sv('codo-nprs-mov', data.nprsMov); sv('codo-nprs-func', data.nprsFunc);
  sv('codo-dominancia', data.dominancia); sv('codo-lado', data.lado);
  sv('codo-tiempo', data.tiempo); sv('codo-actividad', data.actividad); sv('codo-obs-text', data.obsText);
  sv('pfgs-d', data.pfgsD); sv('pfgs-i', data.pfgsI);
  sv('grip-max-d', data.gripD); sv('grip-max-i', data.gripI);
  sv('ppt-d', data.pptD); sv('ppt-i', data.pptI);
  // Actualizar span displays de sliders NPRS
  ['codo-nprs-reposo','codo-nprs-mov','codo-nprs-func'].forEach(id => {
    const el = document.getElementById(id);
    if(el && el.nextElementSibling) el.nextElementSibling.textContent = el.value;
  });

  // Síntomas
  if (data.symptomsChecked) {
    document.querySelectorAll('#codo-symptoms-list input[type=checkbox]').forEach(cb => {
      cb.checked = data.symptomsChecked.includes(cb.value);
    });
  }

  // Tests ortopédicos (estados pos/neg + EVA sliders)
  if (data.tests) {
    const allTests = [
      ...(typeof CODO_TESTS_LATERAL !== 'undefined' ? CODO_TESTS_LATERAL : []),
      ...(typeof CODO_TESTS_MEDIAL  !== 'undefined' ? CODO_TESTS_MEDIAL  : []),
      ...(typeof CODO_TESTS_NEURAL  !== 'undefined' ? CODO_TESTS_NEURAL  : []),
    ];
    allTests.forEach(test => {
      const td = data.tests[test.id]; if (!td) return;
      const card = document.querySelector(`[data-test-id="${test.id}"]`); if (!card) return;
      const cols = card.querySelectorAll('.codo-test-col');
      [cols[0], cols[1]].forEach((col, idx) => {
        if (!col) return;
        const state = idx === 0 ? td.d : td.i;
        const btns  = col.querySelectorAll('.ot-btn');
        btns.forEach(b => b.classList.remove('pos','neg'));
        if (state === 'pos' && btns[0]) btns[0].classList.add('pos');
        if (state === 'neg' && btns[1]) btns[1].classList.add('neg');
        const slider = col.querySelector('.eva-slider');
        const valEl  = col.querySelector('span');
        const evaVal = idx === 0 ? td.evaD : td.evaI;
        if (slider && evaVal !== undefined) {
          slider.value = evaVal;
          slider.disabled = state === 'neg';
          slider.style.opacity = state === 'neg' ? '0.25' : '1';
          if (valEl) valEl.textContent = evaVal;
        }
      });
    });
  }

  // ROM
  if (data.rom) {
    (typeof CODO_ROM !== 'undefined' ? CODO_ROM : []).forEach(m => {
      const r = data.rom[m.id]; if (!r) return;
      sv(`crom-${m.id}-act-d`, r.actD); sv(`crom-${m.id}-act-i`, r.actI);
      sv(`crom-${m.id}-pas-d`, r.pasD); sv(`crom-${m.id}-pas-i`, r.pasI);
    });
  }

  // PRTEE — restaurar arrays y botones
  const restorePrteeList = (listId, savedVals, prefix) => {
    if (!savedVals?.length) return;
    const items = document.querySelectorAll(`#${listId} > div`);
    items.forEach((item, i) => {
      const v = savedVals[i];
      if (v === null || v === undefined) return;
      item.querySelectorAll('.ot-btn').forEach(b => {
        b.className = 'ot-btn'; b.style.minWidth='24px'; b.style.fontSize='10px'; b.style.padding='2px 4px';
      });
      const btn = item.querySelectorAll('.ot-btn')[v]; // v = 0–10
      if (btn) btn.classList.add('pos');
      if (prefix === 'dolor') prteeDolorVals[i] = v;
      else if (prefix === 'activ') prteeActivVals[i] = v;
      else if (prefix === 'usual') prteeUsualVals[i] = v;
    });
  };
  if (data.prteeDolorVals || data.prteeActivVals || data.prteeUsualVals) {
    prteeDolorVals = new Array(5).fill(null);
    prteeActivVals = new Array(6).fill(null);
    prteeUsualVals = new Array(4).fill(null);
    restorePrteeList('prtee-dolor-list', data.prteeDolorVals, 'dolor');
    restorePrteeList('prtee-activ-list', data.prteeActivVals, 'activ');
    restorePrteeList('prtee-usual-list', data.prteeUsualVals, 'usual');
    try {
      const sc = calcPRTEEScore();
      const el = document.getElementById('prtee-total');
      if (el && sc !== null) { el.textContent = sc; el.style.color = sc<=20?'var(--neon)':sc<=50?'var(--amber)':'var(--red)'; }
    } catch(e){}
  }

  // QuickDASH
  if (data.codoQDashVals) {
    codoQDashVals = new Array(11).fill(null);
    const qItems = document.querySelectorAll('#codo-qdash-list > div');
    data.codoQDashVals.forEach((v, i) => {
      if (v === null || v === undefined) return;
      const item = qItems[i]; if (!item) return;
      item.querySelectorAll('.ot-btn').forEach(b => { b.className='ot-btn'; b.style.minWidth='22px'; b.style.fontSize='10px'; b.style.padding='3px'; });
      const btn = item.querySelectorAll('.ot-btn')[v - 1]; // v = 1–5
      if (btn) btn.classList.add('pos');
      codoQDashVals[i] = v;
    });
    try {
      const sc = calcCodoQDASH();
      const el = document.getElementById('codo-qdash-total');
      if (el && sc !== null) { el.textContent = sc; el.style.color = sc<=20?'var(--neon)':sc<=50?'var(--amber)':'var(--red)'; }
    } catch(e){}
  }

  // Re-renderizar diagnósticos
  try {
    if(typeof renderDiagnosticosCodo === 'function')
      renderDiagnosticosCodo(_getCodoModalPositivos(), _getCodoSelectedSymptoms());
  } catch(e){}
}

function saveCodoSession() {
  if (!cur) { alert('Abrí la ficha del paciente primero'); return; }
  const name = prompt('Nombre para esta evaluación (ej. "Sesión 1 — inicial"):', `Sesión ${(cur.klinical?.codo?.sessions||[]).length + 1}`);
  if (!name) return;
  if (!cur.klinical) cur.klinical = {};
  if (!cur.klinical.codo) cur.klinical.codo = {};
  if (!cur.klinical.codo.sessions) cur.klinical.codo.sessions = [];
  const data = _readCodoSessionData();
  data.nombre = name;
  cur.klinical.codo.sessions.push(data);
  atletas = atletas.map(a => a.id === cur.id ? cur : a);
  saveData();
  showSaveToast();
  refreshCodoSessionBar();
}

function refreshCodoSessionBar() {
  if (!cur) return;
  const sessions = cur.klinical?.codo?.sessions || [];
  const sel = document.getElementById('codo-session-select');
  const cnt = document.getElementById('codo-session-count');
  if (sel) {
    sel.innerHTML = '<option value="-1">— Nueva evaluación —</option>' +
      sessions.map((s, i) => `<option value="${i}">${s.nombre || `Sesión ${i+1}`} · ${s.fecha||''}</option>`).join('');
  }
  if (cnt) cnt.textContent = sessions.length ? `${sessions.length} evaluacion${sessions.length>1?'es':''}` : '';
}

// ── Informe Codo ──────────────────────────────────────────────────────────
function generarInformeCodo() {
  if (!cur) { alert('Abrí la ficha del paciente primero'); return; }

  const gt  = id => document.getElementById(id)?.textContent?.trim() || '';
  const gv  = id => document.getElementById(id)?.value?.trim()       || '';

  // Patient data
  const nombre   = cur?.nombre   || '—';
  const edad     = cur?.edad     || '';
  const sexo     = cur?.sexo     || '';
  const peso     = cur?.peso     || '';
  const talla    = cur?.talla    || '';
  const deporte  = cur?.deporte  || '';
  const nivel    = cur?.nivel    || '';
  const objetivo = cur?.objetivo || '';
  const lesionMC = cur?.lesion   || '';

  const fecha      = new Date().toLocaleDateString('es-AR', {day:'2-digit',month:'long',year:'numeric'});
  const dominancia = gv('codo-dominancia');
  const ladoAfect  = gv('codo-lado');
  const tiempo     = gv('codo-tiempo');
  const actividad  = gv('codo-actividad');
  const obsText    = gv('codo-obs-text');

  // ROM rows
  const romRows = CODO_ROM.map(m => {
    const actD = gv(`crom-${m.id}-act-d`);
    const actI = gv(`crom-${m.id}-act-i`);
    const pasD = gv(`crom-${m.id}-pas-d`);
    const pasI = gv(`crom-${m.id}-pas-i`);
    if (!actD && !actI && !pasD && !pasI) return null;
    return { label: m.label, ref: m.ref, mdc: m.mdc, actD, actI, pasD, pasI };
  }).filter(Boolean);

  // Tests
  const allTestDefs = [...CODO_TESTS_LATERAL, ...CODO_TESTS_MEDIAL, ...CODO_TESTS_NEURAL];
  const tests = [];
  allTestDefs.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (!card) return;
    const cols = card.querySelectorAll('.codo-test-col');
    let dR = null, iR = null, evaD = '—', evaI = '—';
    cols.forEach((col, idx) => {
      const r = col.querySelector('.ot-btn.pos') ? 'POS' : (col.querySelector('.ot-btn.neg') ? 'NEG' : null);
      const s = col.querySelector('.eva-slider');
      if (idx === 0) { dR = r; evaD = s?.value || '—'; }
      else           { iR = r; evaI = s?.value || '—'; }
    });
    if (dR || iR) tests.push({ name: test.name, sub: test.sub, dR, iR, evaD, evaI });
  });

  // Symptoms selected
  const selSymptoms = _getCodoSelectedSymptoms();
  const symptomLabels = (typeof CODO_SYMPTOMS !== 'undefined' ? CODO_SYMPTOMS : [])
    .filter(s => selSymptoms.includes(s.id)).map(s => s.label);

  // Fuerza
  const pfgsD  = gv('pfgs-d');
  const pfgsI  = gv('pfgs-i');
  const gripD  = gv('grip-max-d');
  const gripI  = gv('grip-max-i');
  const pptD   = gv('ppt-d');
  const pptI   = gv('ppt-i');

  // Escalas
  const prteeT = gt('prtee-total');
  const qdashT = gt('codo-qdash-total');

  // EBM diagnosis
  const positivos = _getCodoModalPositivos();
  const dxResult  = (typeof diagnosticarCodo === 'function') ? diagnosticarCodo(positivos, selSymptoms) : { diagnosticos: [] };

  const _infSecHead = (num, title) => `
    <div class="sec-head">
      <span class="sec-badge">${num}</span>
      <span class="sec-title">${title}</span>
    </div>`;

  const css = `
    body{font-family:Inter,Arial,sans-serif;margin:0;background:#fff;color:#1a1a1a;font-size:12px;line-height:1.5}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#6b7e20;color:#fff;padding:6px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    td{padding:5px 8px;border-bottom:1px solid #e8f0d4}
    tr:nth-child(even) td{background:#f8faf2}
    .pos{color:#2d7a2d;font-weight:700} .neg{color:#888}
    .alerta{color:#cc3333;font-weight:700} .limite{color:#c65a00;font-weight:700} .ok{color:#2d7a2d;font-weight:700}
    .sec-badge{display:inline-block;background:#6b7e20;color:#fff;font-size:9px;font-weight:900;padding:2px 9px;border-radius:3px;letter-spacing:1px;margin-right:8px}
    .sec-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#1e2d0e}
    .sec-head{display:flex;align-items:center;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid #e8f0d4}
    .intro-box{font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f8faf2;border-radius:5px;border-left:3px solid #6b7e20}
    .metric-box{background:#f5f7ee;border-radius:6px;padding:10px;text-align:center;border:1px solid #e8f0d4}
    .metric-val{font-size:22px;font-weight:900;line-height:1}
    .metric-lbl{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
    @media print{.no-print{display:none!important}header{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  `;

  // Build sections
  const sec01 = `
    ${_infSecHead('01','Perfil del paciente')}
    <div class="intro-box">Datos de identificación y contexto clínico del paciente registrados al inicio de la evaluación de codo.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#f5f7ee;border-radius:6px;padding:12px;border:1px solid #e8f0d4">
        <div style="font-size:9px;text-transform:uppercase;color:#6b7e20;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos del Paciente</div>
        ${nombre ? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Nombre:</span> <strong>${nombre}</strong></div>` : ''}
        ${edad   ? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Edad:</span> ${edad} años${sexo?' · '+sexo:''}</div>` : ''}
        ${(peso||talla) ? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Morfología:</span> ${[peso?peso+' kg':'',talla?talla+' cm':''].filter(Boolean).join(' / ')}</div>` : ''}
        ${deporte ? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Deporte/Actividad:</span> ${deporte}${nivel?' — '+nivel:''}</div>` : ''}
        ${objetivo ? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Objetivo:</span> ${objetivo}</div>` : ''}
        ${lesionMC ? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Motivo de consulta:</span> ${lesionMC}</div>` : ''}
        <div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Fecha:</span> ${fecha}</div>
      </div>
      <div style="background:#f5f7ee;border-radius:6px;padding:12px;border:1px solid #e8f0d4">
        <div style="font-size:9px;text-transform:uppercase;color:#6b7e20;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos del Codo</div>
        <div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Dominancia:</span> ${dominancia}</div>
        <div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Lado afectado:</span> ${ladoAfect}</div>
        <div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Evolución:</span> ${tiempo}</div>
        <div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Actividad desencadenante:</span> ${actividad}</div>
        ${obsText ? `<div style="font-size:10px;color:#444;margin-top:8px;font-style:italic">${obsText}</div>` : ''}
      </div>
    </div>`;

  const sec02 = symptomLabels.length ? `
    ${_infSecHead('02','Presentación clínica reportada')}
    <div class="intro-box">Síntomas referidos por el paciente durante la anamnesis inicial, organizados por región anatómica. Orientan hacia el pre-diagnóstico diferencial antes de los tests ortopédicos.</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
      ${symptomLabels.map(l => `<span style="background:#f5f7ee;border:1px solid #c8d88a;border-radius:4px;padding:4px 10px;font-size:10px;color:#1e2d0e">${l}</span>`).join('')}
    </div>` : '';

  const sec03 = romRows.length ? `
    ${_infSecHead('03','Análisis de rango de movimiento (ROM)')}
    <div class="intro-box">Se midió el rango de movimiento activo y pasivo del complejo codo-antebrazo-muñeca con goniómetro universal. El arco funcional mínimo es extensión 30° — flexión 130° (Morrey). Asimetrías &gt;10° son clínicamente relevantes. Referencia: Lucado 2022 CPG.</div>
    <table>
      <tr><th>Movimiento</th><th>Referencia</th><th>Activo D</th><th>Activo I</th><th>Pasivo D</th><th>Pasivo I</th></tr>
      ${romRows.map(r => `<tr>
        <td><strong>${r.label}</strong></td><td style="color:#888">${r.ref}</td>
        <td>${r.actD?r.actD+'°':'—'}</td><td>${r.actI?r.actI+'°':'—'}</td>
        <td>${r.pasD?r.pasD+'°':'—'}</td><td>${r.pasI?r.pasI+'°':'—'}</td>
      </tr>`).join('')}
    </table>` : '';

  const posTests = tests.filter(t => t.dR==='POS' || t.iR==='POS');
  const negTests = tests.filter(t => (t.dR==='NEG'||t.iR==='NEG') && t.dR!=='POS' && t.iR!=='POS');
  const sec04 = tests.length ? `
    ${_infSecHead('04','Mapeo ortopédico de provocación')}
    <div class="intro-box">Tests ortopédicos estandarizados aplicados para reproducir los síntomas del paciente de forma controlada. Un resultado POSITIVO reproduce el dolor o genera una respuesta anormal. Un resultado NEGATIVO reduce la probabilidad de compromiso de esa estructura. EVA registra la intensidad del dolor reproducido (0–10). Fuentes: Lucado 2022 CPG, Tahir 2026.</div>
    <table>
      <tr><th>Test</th><th>Estructura / EBM</th><th>D</th><th>EVA D</th><th>I</th><th>EVA I</th></tr>
      ${tests.map(t => `<tr>
        <td><strong>${t.name}</strong></td>
        <td style="font-size:10px;color:#666">${t.sub}</td>
        <td class="${t.dR==='POS'?'pos':t.dR==='NEG'?'neg':''}">${t.dR==='POS'?'✚ POS':t.dR==='NEG'?'– NEG':'—'}</td>
        <td>${t.dR==='NEG'?'0':t.evaD}${t.evaD&&t.evaD!=='—'&&t.dR!=='NEG'?'/10':''}</td>
        <td class="${t.iR==='POS'?'pos':t.iR==='NEG'?'neg':''}">${t.iR==='POS'?'✚ POS':t.iR==='NEG'?'– NEG':'—'}</td>
        <td>${t.iR==='NEG'?'0':t.evaI}${t.evaI&&t.evaI!=='—'&&t.iR!=='NEG'?'/10':''}</td>
      </tr>`).join('')}
    </table>` : '';

  const hasFuerza = pfgsD||pfgsI||gripD||gripI||pptD||pptI;
  const calcAsimStr = (d, i) => {
    if (!d || !i) return '—';
    const a = (Math.abs(+d - +i) / Math.max(+d, +i) * 100).toFixed(1);
    return a + '% ' + (+a >= 20 ? '⚠ >MDC' : +a >= 10 ? 'Límite' : '✓');
  };
  const sec05 = hasFuerza ? `
    ${_infSecHead('05','Perfil de fuerza y sensibilidad al dolor (HHD / PPT)')}
    <div class="intro-box">La PFGS (fuerza de agarre sin dolor) es el mejor predictor diagnóstico y de pronóstico para epicondilalgia lateral: Sn 65%, Sp 97%, MCID 7 kg (Lucado 2022, Bobos 2019). El PPT cuantifica la sensibilidad local al dolor a la presión — valores reducidos bilateralmente orientan a sensibilización central.</div>
    <table>
      <tr><th>Medición</th><th>Derecho</th><th>Izquierdo</th><th>Asimetría</th></tr>
      ${pfgsD||pfgsI?`<tr><td><strong>PFGS (kg)</strong><br><span style="font-size:9px;color:#888">Sn 65% / Sp 97% / MCID 7 kg</span></td><td>${pfgsD||'—'}</td><td>${pfgsI||'—'}</td><td class="${+calcAsimStr(pfgsD,pfgsI).split('%')[0]>=20?'alerta':+calcAsimStr(pfgsD,pfgsI).split('%')[0]>=10?'limite':'ok'}">${calcAsimStr(pfgsD,pfgsI)}</td></tr>`:''}
      ${gripD||gripI?`<tr><td><strong>Prensión máx. (kg)</strong><br><span style="font-size:9px;color:#888">Fuerza máxima sin restricción</span></td><td>${gripD||'—'}</td><td>${gripI||'—'}</td><td>${calcAsimStr(gripD,gripI)}</td></tr>`:''}
      ${pptD||pptI?`<tr><td><strong>PPT epicóndilo (kg/cm²)</strong><br><span style="font-size:9px;color:#888">ICC interobs 0.77 — MDC 1.79 kg/cm²</span></td><td>${pptD||'—'}</td><td>${pptI||'—'}</td><td>${calcAsimStr(pptD,pptI)}</td></tr>`:''}
    </table>` : '';

  const hasEscalas = prteeT || qdashT;
  const sec06 = hasEscalas ? `
    ${_infSecHead('06','Escalas funcionales validadas')}
    <div class="intro-box">Instrumentos de resultado reportado por el paciente (PRO). La PRTEE es el gold standard para epicondilalgia lateral con propiedades psicométricas superiores (ICC 0.96, SEM 0.6, MCID 7 pts). El QuickDASH evalúa la discapacidad global del miembro superior (MCID 10.2 pts). Referencia: Lucado 2022 CPG Rec.A.</div>
    <table>
      <tr><th>Escala</th><th>Score</th><th>MCID</th><th>Interpretación</th></tr>
      ${prteeT?`<tr>
        <td><strong>PRTEE</strong><br><span style="font-size:9px;color:#888">Patient-Rated Tennis Elbow Evaluation — Rompe & MacDermid 2000</span><br><span style="font-size:9px;color:#666">15 ítems: 5 dolor + 10 función. 0–100; menor = mejor función.</span></td>
        <td><strong>${prteeT}/100</strong></td><td>7 pts</td>
        <td class="${+prteeT<=20?'ok':+prteeT<=50?'limite':'alerta'}">${+prteeT<=20?'Leve':+prteeT<=50?'Moderado':'Severo'}</td></tr>`:''}
      ${qdashT?`<tr>
        <td><strong>QuickDASH</strong><br><span style="font-size:9px;color:#888">Disabilities of the Arm, Shoulder and Hand — Hudak et al. 1996</span><br><span style="font-size:9px;color:#666">11 ítems. 0–100; menor = menor discapacidad miembro superior.</span></td>
        <td><strong>${qdashT}/100</strong></td><td>10.2 pts</td>
        <td class="${+qdashT<=30?'ok':+qdashT<=50?'limite':'alerta'}">${+qdashT<=30?'Leve':+qdashT<=50?'Moderado':'Severo'}</td></tr>`:''}
    </table>` : '';

  // EBM Diagnosis section
  let _dxC = `<div class="intro-box">El diagnóstico kinesiológico integra los tests ortopédicos y la presentación clínica del paciente en un motor de inferencia EBM. Es un diagnóstico <strong>presuntivo</strong> que requiere correlación con imagen y juicio médico para confirmación definitiva.</div>`;

  if (dxResult.diagnosticos.length > 0) {
    const top = dxResult.diagnosticos[0];
    const confColor = top.confidence >= 65 ? '#2d7a2d' : top.confidence >= 35 ? '#c65a00' : '#888';
    _dxC += `<div style="border:1px solid #b8d060;border-radius:8px;overflow:hidden;margin-bottom:12px">
      <div style="background:#6b7e20;padding:10px 14px;display:flex;justify-content:space-between;align-items:center">
        <div><div style="font-size:9px;letter-spacing:1px;color:rgba(255,255,255,.7);margin-bottom:2px">DIAGNÓSTICO PRINCIPAL — EBM CODO</div>
        <div style="font-size:13px;font-weight:900;color:#fff">${top.nombre}</div></div>
        <div style="background:rgba(255,255,255,.2);color:#fff;font-size:9px;padding:3px 10px;border-radius:4px;text-align:center">${top.confianzaLabel}<br><strong>${top.confidence}%</strong></div>
      </div>
      <div style="padding:12px 14px">
        <div style="font-size:10px;color:#888;margin-bottom:6px">Basado en: ${top.source}</div>
        <div style="font-size:11px;color:#444;line-height:1.75;margin-bottom:10px">${top.criterio}</div>
        <div style="font-size:10px;color:#444;line-height:1.7;padding:10px;background:#f5f7ee;border-radius:5px;margin-bottom:8px"><strong style="color:#2d5a0e">Tratamiento recomendado:</strong><br>${top.tratamiento}</div>
        <div style="font-size:9px;color:#aaa;font-style:italic">${top.ref}</div>
      </div></div>`;

    if (dxResult.diagnosticos.length > 1) {
      _dxC += `<div style="font-size:10px;font-weight:700;color:#555;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Diagnósticos diferenciales:</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">`;
      dxResult.diagnosticos.slice(1).forEach(dx => {
        const bc = dx.confidence >= 65 ? '#edf5e0' : dx.confidence >= 35 ? '#fef8ec' : '#f5f5f5';
        const tc = dx.confidence >= 65 ? '#2d6a1a' : dx.confidence >= 35 ? '#7a4500' : '#666';
        _dxC += `<div style="background:${bc};border-radius:4px;padding:7px 10px">
          <div style="font-size:10px;font-weight:700;color:${tc}">${dx.nombre}</div>
          <div style="font-size:9px;color:#888;margin-top:2px">${dx.confianzaLabel} · ${dx.confidence}%</div>
          <div style="font-size:9px;color:#555;margin-top:3px;line-height:1.4">${dx.criterio.substring(0,100)}${dx.criterio.length>100?'…':''}</div>
        </div>`;
      });
      _dxC += '</div>';
    }
  } else {
    _dxC += `<div style="font-size:11px;color:#888;font-style:italic;padding:10px;background:#f8f8f8;border-radius:5px">No se registraron tests ortopédicos ni síntomas suficientes para activar el motor diagnóstico. Complete el tab Tests y/o marque síntomas en el tab Observación.</div>`;
  }
  _dxC += `<div style="font-size:9px;color:#bbb;text-align:right;margin-top:8px;font-style:italic">CPG Lucado 2022 · Tahir 2026 · Bobos 2019 · No reemplaza el juicio clínico</div>`;

  const sec07 = _infSecHead('07','Diagnóstico kinesiológico presuntivo') + _dxC;

  const bodyContent = sec01 + sec02 + sec03 + sec04 + sec05 + sec06 + sec07;

  const fullHTML = `<!DOCTYPE html><html lang="es"><head>
  <meta charset="UTF-8"><title>Informe Kinesiológico Codo — ${nombre}</title>
  <style>${css}</style></head><body>
  <div class="no-print" style="background:#1e2d0e;padding:12px 24px;display:flex;gap:8px;align-items:center;position:sticky;top:0;z-index:100">
    <button onclick="window.print()" style="background:#6b7e20;color:#fff;border:none;border-radius:4px;padding:8px 16px;font-weight:700;cursor:pointer;font-size:12px">🖨 Imprimir / Guardar PDF</button>
    <span style="font-size:11px;color:rgba(255,255,255,.5);margin-left:8px">En imprimir → elegir "Guardar como PDF"</span>
  </div>
  <header style="background:#1e2d0e;padding:24px 40px;display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      <div style="font-size:26px;font-weight:900;letter-spacing:-.5px;color:#c8e06b">THE MOVE CLUB</div>
      <div style="font-size:11px;color:rgba(255,255,255,.5);margin-top:4px">Kinesiología de Alto Rendimiento · Evaluación de Codo</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:11px;color:rgba(255,255,255,.5)">Informe Kinesiológico — Codo</div>
      <div style="font-size:13px;font-weight:700;color:#c8e06b">${nombre}</div>
      <div style="font-size:10px;color:rgba(255,255,255,.4)">${fecha}</div>
    </div>
  </header>
  <div style="padding:32px 40px;max-width:900px;margin:0 auto">
    ${bodyContent}
    <div style="margin-top:32px;padding-top:16px;border-top:2px solid #e8f0d4;display:flex;justify-content:space-between;align-items:flex-end">
      <div style="font-size:10px;color:#888"><div>THE MOVE CLUB · Kinesiología de Alto Rendimiento</div>
      <div>CPG 2022 Lucado et al. JOSPT · Tahir et al. Cureus 2026 · Bobos et al. Arch PMR 2019</div></div>
      <div style="text-align:right"><div style="width:140px;border-top:1px solid #1e2d0e;margin-bottom:4px"></div>
      <div style="font-size:11px;font-weight:700">Kinesiólogo/a</div></div>
    </div>
  </div>
  </body></html>`;

  const w = window.open('', '_blank');
  if (w) { w.document.write(fullHTML); w.document.close(); }
  else { alert('Permitir ventanas emergentes para generar el informe.'); }
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

function loadCodoSession(idx) {
  if (idx === '' || idx === '-1' || !cur) return;
  const sessions = cur.klinical?.codo?.sessions || [];
  const s = sessions[parseInt(idx)];
  if (!s) return;
  const sv = (id, val) => { const el = document.getElementById(id); if(el && val!==undefined) el.value = val; };
  sv('codo-nprs-reposo', s.nprsReposo); sv('codo-nprs-mov', s.nprsMov); sv('codo-nprs-func', s.nprsFunc);
  sv('codo-dominancia', s.dominancia); sv('codo-lado', s.lado);
  sv('codo-tiempo', s.tiempo); sv('codo-actividad', s.actividad); sv('codo-obs-text', s.obsText);
  sv('pfgs-d', s.pfgsD); sv('pfgs-i', s.pfgsI);
  sv('grip-max-d', s.gripD); sv('grip-max-i', s.gripI);
  sv('ppt-d', s.pptD); sv('ppt-i', s.pptI);
  // Update EVA span displays
  ['codo-nprs-reposo','codo-nprs-mov','codo-nprs-func'].forEach(id => {
    const el = document.getElementById(id); if (el) el.nextElementSibling.textContent = el.value;
  });
  // Restore symptoms
  if (s.symptomsChecked) {
    document.querySelectorAll('#codo-symptoms-list input[type=checkbox]').forEach(cb => {
      cb.checked = s.symptomsChecked.includes(cb.value);
    });
    if (typeof renderDiagnosticosCodo === 'function')
      renderDiagnosticosCodo(_getCodoModalPositivos(), _getCodoSelectedSymptoms());
  }
  showSaveToast();
}

function toggleCodoHistorial() {
  const panel = document.getElementById('codo-historial-panel');
  if (!panel) return;
  if (panel.style.display !== 'none') { panel.style.display = 'none'; return; }
  const sessions = cur?.klinical?.codo?.sessions || [];
  if (!sessions.length) { panel.innerHTML = '<div style="font-size:10px;color:var(--text3);padding:8px">Sin evaluaciones guardadas aún.</div>'; panel.style.display = 'block'; return; }
  panel.innerHTML = sessions.map((s, i) => `
    <div style="padding:8px;border:1px solid var(--border);border-radius:6px;margin-bottom:6px;font-size:10px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <strong>${s.nombre || `Sesión ${i+1}`}</strong>
        <span style="color:var(--text3)">${s.fecha||''}</span>
      </div>
      <div style="margin-top:4px;color:var(--text2)">
        ${s.prteeTotal&&s.prteeTotal!=='—'?`PRTEE: <strong>${s.prteeTotal}</strong> · `:''}
        ${s.qdashTotal&&s.qdashTotal!=='—'?`QuickDASH: <strong>${s.qdashTotal}</strong>`:''}
      </div>
      <button class="btn btn-ghost btn-sm" style="font-size:9px;margin-top:4px" onclick="loadCodoSession(${i})">Cargar sesión</button>
    </div>
  `).join('');
  panel.style.display = 'block';
}


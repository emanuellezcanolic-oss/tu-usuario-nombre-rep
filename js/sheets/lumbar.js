// js/sheets/lumbar.js — Columna Lumbar v2
// CPG: Delitto et al. JOSPT 2012 · Cook SIJ cluster 2006 · O'Sullivan 2018
// Requires: papers-lumbar-rules.js

// startbackVals is declared in lesion.js — reuse that global
// eslint-disable-next-line no-unused-vars
let lbpPsfsVals = [null, null, null];
let lbpOdiScore = null;

// ── Tab switcher ──────────────────────────────────────────────────────────────
function showLBPTab(tab, btn) {
  ['obs','rom','tests','motor','esc','informe'].forEach(t => {
    const el = document.getElementById(`lbptab-${t}`);
    const b  = document.getElementById(`lbptab-${t}-btn`);
    if (el) el.style.display = t === tab ? '' : 'none';
    if (b)  { b.classList.remove('btn-neon'); b.classList.add('btn-ghost'); }
  });
  if (btn) { btn.classList.remove('btn-ghost'); btn.classList.add('btn-neon'); }
}

// ── Init ──────────────────────────────────────────────────────────────────────
function initLumbarSheet() {
  buildLBPROM();
  buildLBPTests();
  buildLBPMyotomas();
  buildLBPReflejos();
  buildStartBack();
  buildLBPPSFS();
  buildLumbarSymptoms();
  if (typeof refreshLBPSessionBar === 'function') refreshLBPSessionBar();
}

// ── ROM helpers ───────────────────────────────────────────────────────────────
(function _injectRomStyles() {
  if (document.getElementById('lbp-rom-eva-style')) return;
  const s = document.createElement('style');
  s.id = 'lbp-rom-eva-style';
  s.textContent = `
    .lbp-eva-range::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:#cc3333;cursor:pointer;border:2px solid #fff;box-shadow:0 0 3px rgba(0,0,0,.4)}
    .lbp-eva-range::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:#cc3333;cursor:pointer;border:2px solid #fff}
    .lbp-eva-range::-webkit-slider-runnable-track{height:4px;border-radius:2px}
    .lbp-eva-range::-moz-range-track{height:4px;border-radius:2px;background:var(--border,#333)}
  `;
  document.head.appendChild(s);
})();

function _lbpRomEvaUpdate(el) {
  const v   = +el.value;
  const pct = (v / 10) * 100;
  el.style.background = v > 0
    ? `linear-gradient(to right,#cc3333 ${pct}%,var(--border,#444) ${pct}%)`
    : 'var(--border,#444)';
  el.className = 'lbp-eva-range';
  const sp = el.nextElementSibling;
  if (sp) { sp.textContent = v || '0'; sp.style.color = v > 0 ? '#cc3333' : 'var(--text3)'; }
}

function _lbpRomSetUnit(unit) {
  const btn = document.getElementById('lbp-rom-unit-global');
  if (btn) { btn.textContent = unit; btn.style.background = unit === 'cm' ? 'var(--neon,#7ec957)' : 'transparent'; btn.style.color = unit === 'cm' ? '#000' : 'var(--text3)'; }
  (typeof LUMBAR_ROM !== 'undefined' ? LUMBAR_ROM : []).forEach(r => {
    const inp = document.getElementById(`lbp-rom-${r.id}-act`);
    if (inp) inp.placeholder = unit === 'cm' ? '0.0' : '0';
  });
}

// ── ROM ───────────────────────────────────────────────────────────────────────
function buildLBPROM() {
  const c = document.getElementById('lbp-rom-fields'); if (!c || c.innerHTML) return;
  c.innerHTML = `
    <div style="display:grid;grid-template-columns:28px 1fr 46px 68px 90px;gap:4px 6px;align-items:center;padding:4px 0 8px;border-bottom:1px solid var(--border)">
      <span></span>
      <span style="font-size:9px;color:var(--text3)">Movimiento</span>
      <span style="font-size:9px;color:var(--text3);text-align:center">Ref.</span>
      <span style="display:flex;align-items:center;justify-content:center;gap:4px">
        <span style="font-size:9px;color:var(--text3)">AROM</span>
        <button id="lbp-rom-unit-global"
          onclick="const u=this.textContent==='°'?'cm':'°';_lbpRomSetUnit(u)"
          title="Cambiar unidad para todos los movimientos"
          style="font-size:9px;padding:1px 5px;border:1px solid var(--border);border-radius:10px;background:transparent;cursor:pointer;color:var(--text3);font-weight:700;transition:all .15s">°</button>
      </span>
      <span style="font-size:9px;color:var(--text3);text-align:center">EVA dolor repro</span>
    </div>` +
  (typeof LUMBAR_ROM !== 'undefined' ? LUMBAR_ROM : []).map(r => `
    <div style="display:grid;grid-template-columns:28px 1fr 46px 68px 90px;gap:4px 6px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
      <div></div>
      <div style="font-size:11px;color:var(--text2)">${r.label}</div>
      <div style="font-size:9px;color:var(--text3);text-align:center">${r.ref}</div>
      <input class="inp inp-mono lbp-rom-val" type="number" id="lbp-rom-${r.id}-act"
        placeholder="0" step="any"
        style="padding:3px 4px;font-size:11px;text-align:center">
      <div style="display:flex;align-items:center;gap:3px">
        <input type="range" id="lbp-rom-${r.id}-eva" min="0" max="10" value="0"
          oninput="_lbpRomEvaUpdate(this)"
          style="flex:1;height:4px;border-radius:2px;outline:none;cursor:pointer;background:var(--border,#333);-webkit-appearance:none;appearance:none">
        <span style="font-family:var(--mono);font-size:11px;min-width:12px;color:var(--text3);text-align:right">0</span>
      </div>
    </div>
  `).join('');
}

// ── Test builder (D/I EVA per column) ─────────────────────────────────────────
function _buildLBPTestGroup(containerId, tests) {
  const c = document.getElementById(containerId); if (!c || c.innerHTML) return;
  c.innerHTML = tests.map(t => `
    <div class="card mb-8" data-test-id="${t.id}">
      <div class="card-body" style="padding:8px 10px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px">
          <div>
            <span style="font-size:12px;font-weight:700">${t.name}</span>
            <span class="tag ${t.tag}" style="font-size:9px;margin-left:5px">${t.sub}</span>
          </div>
        </div>
        <div style="font-size:9px;color:var(--text3);margin-bottom:8px;font-style:italic">${t.ref}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <div class="lbp-test-col">
            <div style="font-size:9px;color:var(--text3);text-align:center;margin-bottom:4px">DERECHA / BILATERAL</div>
            <div style="display:flex;gap:4px;justify-content:center;margin-bottom:6px">
              <button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTLumbar(this,'pos')">+ POS</button>
              <button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTLumbar(this,'neg')">– NEG</button>
            </div>
            <div style="display:flex;align-items:center;gap:4px">
              <span style="font-size:9px;color:var(--text3);min-width:22px">EVA</span>
              <input type="range" class="eva-slider lbp-eva-d" min="0" max="10" value="0" disabled
                oninput="this.nextElementSibling.textContent=this.value" style="flex:1">
              <span style="font-family:var(--mono);font-size:11px;min-width:14px">0</span>
            </div>
          </div>
          <div class="lbp-test-col">
            <div style="font-size:9px;color:var(--text3);text-align:center;margin-bottom:4px">IZQUIERDA</div>
            <div style="display:flex;gap:4px;justify-content:center;margin-bottom:6px">
              <button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTLumbar(this,'pos')">+ POS</button>
              <button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTLumbar(this,'neg')">– NEG</button>
            </div>
            <div style="display:flex;align-items:center;gap:4px">
              <span style="font-size:9px;color:var(--text3);min-width:22px">EVA</span>
              <input type="range" class="eva-slider lbp-eva-i" min="0" max="10" value="0" disabled
                oninput="this.nextElementSibling.textContent=this.value" style="flex:1">
              <span style="font-family:var(--mono);font-size:11px;min-width:14px">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function buildLBPTests() {
  _buildLBPTestGroup('lbp-tests-neural',      typeof LUMBAR_TESTS_NEURAL      !== 'undefined' ? LUMBAR_TESTS_NEURAL      : []);
  _buildLBPTestGroup('lbp-tests-sij',         typeof LUMBAR_TESTS_SIJ         !== 'undefined' ? LUMBAR_TESTS_SIJ         : []);
  _buildLBPTestGroup('lbp-tests-estabilidad', typeof LUMBAR_TESTS_ESTABILIDAD !== 'undefined' ? LUMBAR_TESTS_ESTABILIDAD : []);
  _buildLBPTestGroup('lbp-tests-estenosis',   typeof LUMBAR_TESTS_ESTENOSIS   !== 'undefined' ? LUMBAR_TESTS_ESTENOSIS   : []);
  _buildLBPTestGroup('lbp-tests-faceta',     typeof LUMBAR_TESTS_FACETA      !== 'undefined' ? LUMBAR_TESTS_FACETA      : []);
}

// ── Toggle test POS/NEG ───────────────────────────────────────────────────────
function toggleOTLumbar(btn, type) {
  const col = btn.closest('.lbp-test-col'); if (!col) return;
  const siblings = col.querySelectorAll('.ot-btn');
  siblings.forEach(b => b.classList.remove('pos', 'neg'));
  btn.classList.add(type);
  const slider = col.querySelector('.eva-slider');
  if (slider) slider.disabled = (type === 'neg');
  // Trigger diagnosis
  if (typeof renderDiagnosticosLumbar === 'function')
    renderDiagnosticosLumbar(_getLBPModalPositivos(), _getLBPSelectedSymptoms());
  if (typeof _renderLBPMissingAlerts === 'function')
    _renderLBPMissingAlerts();
}

function _getLBPModalPositivos() {
  const allTests = [
    ...(typeof LUMBAR_TESTS_NEURAL      !== 'undefined' ? LUMBAR_TESTS_NEURAL      : []),
    ...(typeof LUMBAR_TESTS_SIJ         !== 'undefined' ? LUMBAR_TESTS_SIJ         : []),
    ...(typeof LUMBAR_TESTS_ESTABILIDAD !== 'undefined' ? LUMBAR_TESTS_ESTABILIDAD : []),
    ...(typeof LUMBAR_TESTS_ESTENOSIS   !== 'undefined' ? LUMBAR_TESTS_ESTENOSIS   : []),
    ...(typeof LUMBAR_TESTS_FACETA      !== 'undefined' ? LUMBAR_TESTS_FACETA      : []),
  ];
  const pos = [];
  allTests.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (card && card.querySelector('.ot-btn.pos')) pos.push(test.id);
  });
  return pos;
}

function _getLBPSelectedSymptoms() {
  return [...document.querySelectorAll('#lbp-symptoms-list input[type=checkbox]:checked')].map(c => c.value);
}

function _renderLBPMissingAlerts() {
  const panel = document.getElementById('lbp-missing-alerts-panel'); if (!panel) return;
  const done = new Set();
  const allTests = [
    ...(typeof LUMBAR_TESTS_NEURAL      !== 'undefined' ? LUMBAR_TESTS_NEURAL      : []),
    ...(typeof LUMBAR_TESTS_SIJ         !== 'undefined' ? LUMBAR_TESTS_SIJ         : []),
    ...(typeof LUMBAR_TESTS_ESTABILIDAD !== 'undefined' ? LUMBAR_TESTS_ESTABILIDAD : []),
    ...(typeof LUMBAR_TESTS_ESTENOSIS   !== 'undefined' ? LUMBAR_TESTS_ESTENOSIS   : []),
    ...(typeof LUMBAR_TESTS_FACETA      !== 'undefined' ? LUMBAR_TESTS_FACETA      : []),
  ];
  allTests.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (card && (card.querySelector('.ot-btn.pos') || card.querySelector('.ot-btn.neg'))) done.add(test.id);
  });
  const pending = (LUMBAR_RULES?.diagnosticos || []).flatMap(dx => dx.testsKey).filter(id => !done.has(id));
  if (!pending.length) { panel.innerHTML = ''; return; }
  const uniq = [...new Set(pending)].slice(0, 5);
  const nm = id => allTests.find(t => t.id === id)?.name || id;
  panel.innerHTML = `
    <div style="padding:8px 10px;background:rgba(251,146,60,.08);border:1px solid rgba(251,146,60,.25);border-radius:6px;margin-bottom:8px;font-size:10px;color:var(--amber)">
      ⚠️ Tests clave pendientes: ${uniq.map(nm).join(' · ')}
    </div>`;
}

// ── Symptoms checklist ─────────────────────────────────────────────────────────
function buildLumbarSymptoms() {
  const c = document.getElementById('lbp-symptoms-list'); if (!c || c.innerHTML) return;
  const syms = typeof LUMBAR_SYMPTOMS !== 'undefined' ? LUMBAR_SYMPTOMS : [];
  const regions = {
    radiculopatia: '🔴 Radiculopatía lumbar',
    sij:           '🟠 Articulación sacroilíaca',
    discal:        '🟡 Dolor discal / mecánico',
    estenosis:     '🟣 Estenosis neurógena',
    inestabilidad: '🔵 Inestabilidad / control motor',
    facetario:     '🟤 Dolor facetario / articular',
  };
  c.innerHTML = Object.entries(regions).map(([region, title]) => {
    const items = syms.filter(s => s.region === region);
    if (!items.length) return '';
    return `
      <div style="margin-bottom:10px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:5px">${title}</div>
        ${items.map(s => `
          <label style="display:flex;gap:6px;align-items:flex-start;padding:3px 0;cursor:pointer">
            <input type="checkbox" value="${s.id}" onchange="_onLBPSymptomChange()" style="margin-top:2px">
            <span style="font-size:11px;color:var(--text2);line-height:1.4">${s.label}</span>
          </label>`).join('')}
      </div>`;
  }).join('');
}

function _onLBPSymptomChange() {
  if (typeof renderDiagnosticosLumbar === 'function')
    renderDiagnosticosLumbar(_getLBPModalPositivos(), _getLBPSelectedSymptoms());
}

// ── Motor: Myotomas ───────────────────────────────────────────────────────────
function buildLBPMyotomas() {
  const c = document.getElementById('lbp-myotomas-fields'); if (!c || c.innerHTML) return;
  const opts = ['','5/5','4+','4/5','4-','3/5','2/5','1/5','0/5']
    .map((v,i) => `<option value="${v}"${i===0?' selected':''}>${i===0?'—':v}</option>`).join('');
  c.innerHTML = `
    <div style="display:grid;grid-template-columns:36px 1fr 64px 64px;gap:4px 8px;align-items:center;padding:4px 0 8px;border-bottom:1px solid var(--border)">
      <span style="font-size:9px;color:var(--text3)">Nivel</span>
      <span style="font-size:9px;color:var(--text3)">Movimiento test</span>
      <span style="font-size:9px;color:var(--text3);text-align:center">D</span>
      <span style="font-size:9px;color:var(--text3);text-align:center">I</span>
    </div>` +
  (typeof LBP_MYOTOMAS !== 'undefined' ? LBP_MYOTOMAS : []).map(m => `
    <div style="display:grid;grid-template-columns:36px 1fr 64px 64px;gap:4px 8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="font-family:var(--mono);font-size:12px;font-weight:700;color:var(--neon)">${m.nivel}</div>
      <div style="font-size:11px;color:var(--text2)">${m.mov}</div>
      <select class="inp inp-mono" id="${m.id}-d" style="padding:3px 4px;font-size:11px;text-align:center" onchange="checkLBPMyotomaAsym('${m.id}')">${opts}</select>
      <select class="inp inp-mono" id="${m.id}-i" style="padding:3px 4px;font-size:11px;text-align:center" onchange="checkLBPMyotomaAsym('${m.id}')">${opts}</select>
    </div>
    <div id="${m.id}-alert" style="display:none;font-size:10px;color:var(--red);padding:2px 8px 4px">⚠️ Asimetría D/I — posible nivel comprometido</div>
  `).join('');
}

function checkLBPMyotomaAsym(id) {
  const d = document.getElementById(id+'-d')?.value;
  const i = document.getElementById(id+'-i')?.value;
  const al = document.getElementById(id+'-alert');
  if (!al) return;
  al.style.display = (d && i && d !== i) ? 'block' : 'none';
}

// ── Motor: Reflejos ───────────────────────────────────────────────────────────
function toggleReflejoLBP(btn, val) {
  const siblings = btn.parentElement.querySelectorAll('.lbp-reflejo-btn');
  siblings.forEach(b => { b.classList.remove('btn-neon'); b.dataset.active = ''; });
  if (btn.dataset.active === val) { btn.dataset.active = ''; }
  else { btn.classList.add('btn-neon'); btn.dataset.active = val; }
}

function buildLBPReflejos() {
  const c = document.getElementById('lbp-reflejos-fields'); if (!c || c.innerHTML) return;
  c.innerHTML = (typeof LBP_REFLEJOS !== 'undefined' ? LBP_REFLEJOS : []).map(r => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:12px;font-weight:600">${r.nombre}</span>
        <span style="font-family:var(--mono);font-size:10px;color:var(--neon)">${r.nivel}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <div>
          <div style="font-size:9px;color:var(--text3);margin-bottom:4px;text-align:center">DERECHA</div>
          <div style="display:flex;gap:3px;justify-content:center">
            <button class="ot-btn lbp-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoLBP(this,'hiper')">↑ Hiper</button>
            <button class="ot-btn lbp-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoLBP(this,'norm')">= Norm</button>
            <button class="ot-btn lbp-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoLBP(this,'hipo')">↓ Hipo</button>
          </div>
        </div>
        <div>
          <div style="font-size:9px;color:var(--text3);margin-bottom:4px;text-align:center">IZQUIERDA</div>
          <div style="display:flex;gap:3px;justify-content:center">
            <button class="ot-btn lbp-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoLBP(this,'hiper')">↑ Hiper</button>
            <button class="ot-btn lbp-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoLBP(this,'norm')">= Norm</button>
            <button class="ot-btn lbp-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoLBP(this,'hipo')">↓ Hipo</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── STarT Back (existing) ─────────────────────────────────────────────────────
const LBP_STARTBACK_ITEMS = [
  'En las últimas 2 semanas, ¿el dolor se extendió a la pierna/s?',
  'En las últimas 2 semanas, ¿tuvo dolor de hombro o cuello?',
  'En las últimas 2 semanas, ¿solo caminó distancias cortas por el dolor?',
  'En las últimas 2 semanas, ¿se vistió más lento por el dolor?',
  'En las últimas 2 semanas, ¿no está bien hacer actividades físicas exigentes?',
  'En las últimas 2 semanas, ¿se preocupó mucho por su dolor de espalda?',
  'Siento que mi dolor de espalda es terrible y nunca va a mejorar',
  'Generalmente no he disfrutado de todas las cosas que normalmente disfruto',
  'En general, ¿cuánto lo ha molestado su dolor de espalda en las últimas 2 semanas?',
];

function buildStartBack() {
  const c = document.getElementById('startback-sheet-fields'); if (!c || c.innerHTML) return;
  startbackVals = new Array(9).fill(null);
  c.innerHTML = LBP_STARTBACK_ITEMS.map((item, i) => `
    <div style="padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;margin-bottom:4px">${i+1}. ${item}</div>
      <div style="display:flex;gap:10px">
        ${i < 8
          ? `<label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="radio" name="sb-${i}" onchange="startbackVals[${i}]=0;calcStartBack2()"> No</label>
             <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="radio" name="sb-${i}" onchange="startbackVals[${i}]=1;calcStartBack2()"> Sí</label>`
          : `<label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="radio" name="sb-${i}" onchange="startbackVals[${i}]=0;calcStartBack2()"> Ninguna/Poca</label>
             <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="radio" name="sb-${i}" onchange="startbackVals[${i}]=1;calcStartBack2()"> Moderada/Mucha</label>`
        }
      </div>
    </div>
  `).join('');
}

function calcStartBack2() {
  const filled = startbackVals.filter(v => v !== null);
  if (filled.length < 9) return;
  const total = startbackVals.reduce((a, b) => a + b, 0);
  const sub   = startbackVals.slice(4).reduce((a, b) => a + b, 0);
  let grupo, col;
  if (total <= 3)      { grupo = 'Bajo riesgo';  col = 'var(--neon)'; }
  else if (sub <= 3)   { grupo = 'Medio riesgo'; col = 'var(--amber)'; }
  else                 { grupo = 'Alto riesgo';  col = 'var(--red)'; }
  const el = document.getElementById('startback-sheet-result');
  if (el) { el.textContent = `${grupo} (total ${total}/9 · sub ${sub}/5)`; el.style.color = col; }
}

// ── PSFS lumbar ───────────────────────────────────────────────────────────────
function buildLBPPSFS() {
  const c = document.getElementById('lbp-psfs-fields'); if (!c || c.innerHTML) return;
  lbpPsfsVals = [null, null, null];
  c.innerHTML = [1, 2, 3].map(n => `
    <div class="ig mb-8">
      <label class="il">Actividad ${n}</label>
      <input class="inp" type="text" id="lbp-psfs-act-${n}" placeholder="Ej: Agacharme a recoger algo del suelo..." style="margin-bottom:6px">
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${[0,1,2,3,4,5,6,7,8,9,10].map(v => `<button class="ot-btn" style="font-size:10px;padding:2px 6px" onclick="selectLBPPSFS(this,${n-1},${v})">${v}</button>`).join('')}
      </div>
    </div>
  `).join('');
}

function selectLBPPSFS(btn, idx, val) {
  const siblings = btn.parentElement.querySelectorAll('.ot-btn');
  siblings.forEach(b => b.classList.remove('btn-neon'));
  btn.classList.add('btn-neon');
  lbpPsfsVals[idx] = val;
  const filled = lbpPsfsVals.filter(v => v !== null);
  const el = document.getElementById('lbp-psfs-result'); if (!el) return;
  if (!filled.length) { el.textContent = 'Promedio PSFS: —'; el.style.color = 'var(--text3)'; return; }
  const avg = (filled.reduce((a, b) => a + b, 0) / filled.length).toFixed(1);
  el.innerHTML = `<span style="color:${avg>=5?'var(--neon)':avg>=3?'var(--amber)':'var(--red)'}">Promedio PSFS: ${avg}/10</span> <span style="font-size:10px;color:var(--text3)">(${filled.length}/3 · MCID ≥2 pts)</span>`;
}

// ── Red flags ─────────────────────────────────────────────────────────────────
function checkLBPRedFlags() {
  const cbs = document.querySelectorAll('.lbp-redflag');
  const any = [...cbs].some(c => c.checked);
  const el = document.getElementById('lbp-redflag-alert');
  if (el) el.style.display = any ? 'block' : 'none';
}

// ── Session management ────────────────────────────────────────────────────────
function _readLBPSessionData() {
  const gv = id => document.getElementById(id)?.value || '';
  const gt = id => document.getElementById(id)?.textContent?.trim() || '';

  const allTests = [
    ...(typeof LUMBAR_TESTS_NEURAL      !== 'undefined' ? LUMBAR_TESTS_NEURAL      : []),
    ...(typeof LUMBAR_TESTS_SIJ         !== 'undefined' ? LUMBAR_TESTS_SIJ         : []),
    ...(typeof LUMBAR_TESTS_ESTABILIDAD !== 'undefined' ? LUMBAR_TESTS_ESTABILIDAD : []),
    ...(typeof LUMBAR_TESTS_ESTENOSIS   !== 'undefined' ? LUMBAR_TESTS_ESTENOSIS   : []),
  ];
  const tests = {};
  allTests.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (!card) return;
    const cols = card.querySelectorAll('.lbp-test-col');
    tests[test.id] = { d: null, i: null, evaD: 0, evaI: 0 };
    cols.forEach((col, idx) => {
      const side = idx === 0 ? 'd' : 'i';
      tests[test.id][side] = col.querySelector('.ot-btn.pos') ? 'pos' : (col.querySelector('.ot-btn.neg') ? 'neg' : null);
      const slider = col.querySelector('.eva-slider');
      tests[test.id][idx === 0 ? 'evaD' : 'evaI'] = slider ? +slider.value : 0;
    });
  });

  const romUnit = document.getElementById('lbp-rom-unit-global')?.textContent || '°';
  const rom = {};
  (typeof LUMBAR_ROM !== 'undefined' ? LUMBAR_ROM : []).forEach(r => {
    const evaEl = document.getElementById(`lbp-rom-${r.id}-eva`);
    rom[r.id] = {
      act: gv(`lbp-rom-${r.id}-act`),
      eva: evaEl ? +evaEl.value : 0,
    };
  });
  rom._unit = romUnit;

  const myotomas = (typeof LBP_MYOTOMAS !== 'undefined' ? LBP_MYOTOMAS : []).map(m => ({
    id: m.id, d: gv(`${m.id}-d`), i: gv(`${m.id}-i`),
  }));

  const refCards = document.querySelectorAll('#lbp-reflejos-fields > div');
  const reflejos = [...refCards].map(card => {
    const btns = card.querySelectorAll('.lbp-reflejo-btn');
    const getActive = (start) => {
      for (let k = start; k < start + 3; k++) if (btns[k]?.dataset.active) return btns[k].dataset.active;
      return '';
    };
    return { d: getActive(0), i: getActive(3) };
  });

  const psfsActivities = [1, 2, 3].map(n => gv(`lbp-psfs-act-${n}`));
  const symptomsChecked = _getLBPSelectedSymptoms();
  const clasif = document.querySelector('input[name="lbp-clasificacion"]:checked')?.value || '';

  return {
    fecha: new Date().toISOString().split('T')[0],
    nombre: '',
    tests, rom, myotomas, reflejos, psfsActivities, symptomsChecked, clasif,
    nprs:        gv('lbp-nprs'),
    tiempo:      gv('lbp-tiempo'),
    mecanismo:   gv('lbp-mecanismo'),
    schober:     gv('lbp-schober'),
    odi:         gv('lbp-odi-input'),
    startback:   [...startbackVals],
    lbpPsfsVals: [...lbpPsfsVals],
    startbackResult: gt('startback-sheet-result'),
    psfsResult:  gt('lbp-psfs-result'),
    odiResult:   gt('odi-sheet-total'),
  };
}

// Restaura un snapshot completo en el formulario (usado por draft restore)
function _writeLBPSessionData(data) {
  if (!data) return;
  const _tmp = cur?.klinical?.lbp?.sessions;
  if (!cur.klinical) cur.klinical = {};
  if (!cur.klinical.lbp) cur.klinical.lbp = {};
  cur.klinical.lbp.sessions = [data];
  loadLBPSession(0);
  cur.klinical.lbp.sessions = _tmp || [];
}

function saveLBPSession() {
  if (!cur) { alert('Abrí la ficha del paciente primero'); return; }
  const name = prompt('Nombre para esta evaluación:', `Sesión ${(cur.klinical?.lbp?.sessions||[]).length + 1}`);
  if (!name) return;
  if (!cur.klinical)      cur.klinical = {};
  if (!cur.klinical.lbp)  cur.klinical.lbp = {};
  if (!cur.klinical.lbp.sessions) cur.klinical.lbp.sessions = [];
  const data = _readLBPSessionData();
  data.nombre = name;
  cur.klinical.lbp.sessions.push(data);
  atletas = atletas.map(a => a.id === cur.id ? cur : a);
  saveData();
  showSaveToast();
  refreshLBPSessionBar();
}

function refreshLBPSessionBar() {
  if (!cur) return;
  const sessions = cur.klinical?.lbp?.sessions || [];
  const sel = document.getElementById('lbp-session-select');
  if (sel) {
    sel.innerHTML = '<option value="">— Sesión actual —</option>' +
      sessions.map((s, i) => `<option value="${i}">${s.nombre || `Sesión ${i+1}`} · ${s.fecha||''}</option>`).join('');
  }
}

function loadLBPSession(idx) {
  if (idx === '' || !cur) return;
  const sessions = cur.klinical?.lbp?.sessions || [];
  const s = sessions[parseInt(idx)];
  if (!s) return;

  const sv = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };

  sv('lbp-nprs', s.nprs); sv('lbp-tiempo', s.tiempo); sv('lbp-mecanismo', s.mecanismo);
  sv('lbp-schober', s.schober); sv('lbp-odi-input', s.odi);
  const nprsEl = document.getElementById('lbp-nprs');
  if (nprsEl) nprsEl.nextElementSibling.textContent = nprsEl.value;

  if (s.rom) {
    if (s.rom._unit) _lbpRomSetUnit(s.rom._unit);
    Object.entries(s.rom).forEach(([id, vals]) => {
      if (id === '_unit') return;
      sv(`lbp-rom-${id}-act`, vals.act);
      const evaEl = document.getElementById(`lbp-rom-${id}-eva`);
      if (evaEl && vals.eva != null) { evaEl.value = vals.eva; _lbpRomEvaUpdate(evaEl); }
    });
  }

  if (s.tests) {
    Object.entries(s.tests).forEach(([testId, data]) => {
      const card = document.querySelector(`[data-test-id="${testId}"]`);
      if (!card) return;
      card.querySelectorAll('.lbp-test-col').forEach((col, colIdx) => {
        const side = colIdx === 0 ? 'd' : 'i';
        const result = data[side];
        col.querySelectorAll('.ot-btn').forEach(b => b.classList.remove('pos', 'neg'));
        if (result) {
          const target = [...col.querySelectorAll('.ot-btn')]
            .find(b => (b.getAttribute('onclick') || '').includes(`'${result}'`));
          if (target) target.classList.add(result);
        }
        const slider = col.querySelector('.eva-slider');
        if (slider) {
          slider.value = colIdx === 0 ? data.evaD : data.evaI || 0;
          slider.disabled = (result === 'neg');
          const disp = slider.nextElementSibling;
          if (disp) disp.textContent = slider.value;
        }
      });
    });
  }

  if (s.myotomas) s.myotomas.forEach(m => { sv(`${m.id}-d`, m.d); sv(`${m.id}-i`, m.i); });

  if (s.reflejos) {
    const refCards = document.querySelectorAll('#lbp-reflejos-fields > div');
    refCards.forEach((card, rIdx) => {
      if (!s.reflejos[rIdx]) return;
      const btns = card.querySelectorAll('.lbp-reflejo-btn');
      btns.forEach(b => { b.classList.remove('btn-neon'); b.dataset.active = ''; });
      ['d', 'i'].forEach((side, sideIdx) => {
        const val = s.reflejos[rIdx][side];
        if (!val) return;
        const start = sideIdx * 3;
        for (let k = start; k < start + 3; k++) {
          if (btns[k] && (btns[k].getAttribute('onclick') || '').includes(`'${val}'`)) {
            btns[k].classList.add('btn-neon'); btns[k].dataset.active = val; break;
          }
        }
      });
    });
  }

  if (s.startback) {
    startbackVals = [...s.startback];
    document.querySelectorAll('#startback-sheet-fields > div').forEach((group, idx) => {
      if (startbackVals[idx] === null) return;
      const radios = group.querySelectorAll('input[type=radio]');
      const targetRadio = startbackVals[idx] === 0 ? radios[0] : radios[1];
      if (targetRadio) targetRadio.checked = true;
    });
    calcStartBack2();
  }

  if (s.lbpPsfsVals) {
    lbpPsfsVals = [...s.lbpPsfsVals];
    if (s.psfsActivities) s.psfsActivities.forEach((txt, n) => sv(`lbp-psfs-act-${n+1}`, txt));
    document.querySelectorAll('#lbp-psfs-fields .ig').forEach((group, idx) => {
      if (lbpPsfsVals[idx] === null) return;
      const btns = group.querySelectorAll('.ot-btn');
      btns.forEach(b => b.classList.remove('btn-neon'));
      const target = [...btns].find(b => (b.getAttribute('onclick') || '').includes(`,${lbpPsfsVals[idx]})`));
      if (target) target.classList.add('btn-neon');
    });
    const filled = lbpPsfsVals.filter(v => v !== null);
    const psfsEl = document.getElementById('lbp-psfs-result');
    if (psfsEl && filled.length) {
      const avg = (filled.reduce((a, b) => a + b, 0) / filled.length).toFixed(1);
      psfsEl.innerHTML = `<span style="color:${avg>=5?'var(--neon)':avg>=3?'var(--amber)':'var(--red)'}">Promedio PSFS: ${avg}/10</span> <span style="font-size:10px;color:var(--text3)">(${filled.length}/3 · MCID ≥2 pts)</span>`;
    }
  }

  if (s.symptomsChecked) {
    document.querySelectorAll('#lbp-symptoms-list input[type=checkbox]').forEach(cb => {
      cb.checked = s.symptomsChecked.includes(cb.value);
    });
  }
  if (s.clasif) {
    const r = document.querySelector(`input[name="lbp-clasificacion"][value="${s.clasif}"]`);
    if (r) { r.checked = true; }
  }
  if (s.odi) {
    const v = +s.odi;
    const el = document.getElementById('odi-sheet-total');
    if (el) { el.textContent = v + '%'; el.style.color = v <= 20 ? 'var(--neon)' : v <= 40 ? 'var(--amber)' : 'var(--red)'; }
  }

  if (typeof renderDiagnosticosLumbar === 'function')
    renderDiagnosticosLumbar(_getLBPModalPositivos(), _getLBPSelectedSymptoms());
  showSaveToast();
}

function toggleLBPHistorial() {
  const panel = document.getElementById('lbp-historial-panel'); if (!panel) return;
  if (panel.style.display !== 'none') { panel.style.display = 'none'; return; }
  const sessions = cur?.klinical?.lbp?.sessions || [];
  if (!sessions.length) {
    panel.innerHTML = '<div style="font-size:10px;color:var(--text3);padding:8px">Sin evaluaciones guardadas.</div>';
    panel.style.display = 'block'; return;
  }
  panel.innerHTML = sessions.map((s, i) => `
    <div style="padding:8px;border:1px solid var(--border);border-radius:6px;margin-bottom:6px;font-size:10px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <strong>${s.nombre || `Sesión ${i+1}`}</strong>
        <span style="color:var(--text3)">${s.fecha||''}</span>
      </div>
      <div style="margin-top:4px;color:var(--text2)">
        ${s.odiResult&&s.odiResult!=='—'?`ODI: <strong>${s.odiResult}</strong> · `:''}
        ${s.startbackResult?`STarT Back: <strong>${s.startbackResult.split(' ')[0]+' '+s.startbackResult.split(' ')[1]}</strong>`:''}
      </div>
      <button class="btn btn-ghost btn-sm" style="font-size:9px;margin-top:4px" onclick="loadLBPSession(${i})">Cargar sesión</button>
    </div>
  `).join('');
  panel.style.display = 'block';
}

// ── Informe PDF ───────────────────────────────────────────────────────────────
function generarInformeLumbar() {
  if (!cur) { alert('Abrí la ficha del paciente primero'); return; }

  const gt = id => document.getElementById(id)?.textContent?.trim() || '';
  const gv = id => document.getElementById(id)?.value?.trim()       || '';

  const nombre   = cur?.nombre  || '—';
  const edad     = cur?.edad    || '';
  const sexo     = cur?.sexo    || '';
  const deporte  = cur?.deporte || '';
  const lesionMC = cur?.lesion  || '';
  const fecha    = new Date().toLocaleDateString('es-AR', {day:'2-digit',month:'long',year:'numeric'});

  const clasifLabel = {
    radiculopatia: 'Radiculopatía lumbar', sij: 'Disfunción SIJ',
    inestabilidad: 'Inestabilidad lumbar', estenosis: 'Estenosis neurógena', inespecifico: 'Dolor lumbar inespecífico',
  };
  const clasif   = document.querySelector('input[name="lbp-clasificacion"]:checked')?.value || '';
  const tiempo   = gv('lbp-tiempo');
  const mecanismo = gv('lbp-mecanismo');
  const nprs     = gv('lbp-nprs');
  const schober  = gv('lbp-schober');
  const odiScore = gv('lbp-odi-input');

  const selSymptoms = _getLBPSelectedSymptoms();
  const symptomLabels = (typeof LUMBAR_SYMPTOMS !== 'undefined' ? LUMBAR_SYMPTOMS : [])
    .filter(s => selSymptoms.includes(s.id)).map(s => s.label);

  const romUnit = document.getElementById('lbp-rom-unit-global')?.textContent || '°';
  const romRows = (typeof LUMBAR_ROM !== 'undefined' ? LUMBAR_ROM : []).map(r => {
    const act   = gv(`lbp-rom-${r.id}-act`);
    const evaEl = document.getElementById(`lbp-rom-${r.id}-eva`);
    const eva   = evaEl ? +evaEl.value : 0;
    if (!act && eva === 0) return null;
    return { label: r.label, ref: r.ref, mdc: r.mdc, act, unit: romUnit, eva };
  }).filter(Boolean);

  const allTestDefs = [
    ...(typeof LUMBAR_TESTS_NEURAL      !== 'undefined' ? LUMBAR_TESTS_NEURAL      : []),
    ...(typeof LUMBAR_TESTS_SIJ         !== 'undefined' ? LUMBAR_TESTS_SIJ         : []),
    ...(typeof LUMBAR_TESTS_ESTABILIDAD !== 'undefined' ? LUMBAR_TESTS_ESTABILIDAD : []),
    ...(typeof LUMBAR_TESTS_ESTENOSIS   !== 'undefined' ? LUMBAR_TESTS_ESTENOSIS   : []),
    ...(typeof LUMBAR_TESTS_FACETA      !== 'undefined' ? LUMBAR_TESTS_FACETA      : []),
  ];
  const tests = [];
  allTestDefs.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (!card) return;
    const cols = card.querySelectorAll('.lbp-test-col');
    let dR = null, iR = null, evaD = '—', evaI = '—';
    cols.forEach((col, idx) => {
      const r = col.querySelector('.ot-btn.pos') ? 'POS' : (col.querySelector('.ot-btn.neg') ? 'NEG' : null);
      const s = col.querySelector('.eva-slider');
      if (idx === 0) { dR = r; evaD = s?.value || '—'; }
      else           { iR = r; evaI = s?.value || '—'; }
    });
    if (dR || iR) tests.push({ name: test.name, sub: test.sub, dR, iR, evaD, evaI });
  });

  const myoRows = (typeof LBP_MYOTOMAS !== 'undefined' ? LBP_MYOTOMAS : []).map(m => {
    const d = gv(`${m.id}-d`); const i = gv(`${m.id}-i`);
    return { nivel: m.nivel, mov: m.mov, d, i, asym: d && i && d !== i };
  }).filter(m => m.d || m.i);

  const refCards2 = document.querySelectorAll('#lbp-reflejos-fields > div');
  const refRows = (typeof LBP_REFLEJOS !== 'undefined' ? LBP_REFLEJOS : []).map((r, rIdx) => {
    const card = refCards2[rIdx]; if (!card) return null;
    const btns = card.querySelectorAll('.lbp-reflejo-btn');
    const getActive = (start) => { for (let k = start; k < start+3; k++) if (btns[k]?.dataset.active) return btns[k].dataset.active; return ''; };
    const d = getActive(0), i = getActive(3);
    return (d || i) ? { nombre: r.nombre, nivel: r.nivel, d, i } : null;
  }).filter(Boolean);

  const sbResult  = gt('startback-sheet-result');
  const psfsRes   = gt('lbp-psfs-result');
  const positivos = _getLBPModalPositivos();
  const dxResult  = (typeof diagnosticarLumbar === 'function') ? diagnosticarLumbar(positivos, selSymptoms) : { diagnosticos: [] };

  const hasMotor = myoRows.length > 0 || refRows.length > 0;

  const css = `
    body{font-family:Inter,Arial,sans-serif;margin:0;background:#fff;color:#1a1a1a;font-size:12px;line-height:1.5}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#8fa845;color:#fff;padding:6px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    td{padding:5px 8px;border-bottom:1px solid #e8f0d4}
    tr:nth-child(even) td{background:#f5f7ee}
    .pos{color:#2d7a2d;font-weight:700} .neg{color:#888}
    .alerta{color:#cc3333;font-weight:700} .limite{color:#c65a00;font-weight:700} .ok{color:#2d7a2d;font-weight:700}
    .asym{color:#cc3333;font-weight:700}
    .sec-badge{display:inline-block;background:#8fa845;color:#fff;font-size:9px;font-weight:900;padding:2px 9px;border-radius:3px;letter-spacing:1px;margin-right:8px}
    .sec-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#1e2d0e}
    .sec-head{display:flex;align-items:center;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid #e8f0d4}
    .intro-box{font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f5f7ee;border-radius:5px;border-left:3px solid #8fa845}
    .dx-card{padding:10px;border:1px solid #e8f0d4;border-radius:6px;margin-bottom:8px}
    .dx-lrp{border-color:#cc3333;background:#fff8f8}
    .dx-sij{border-color:#b05a00;background:#fff8f0}
    .dx-estabilidad{border-color:#2d7a2d;background:#f0fff4}
    .dx-estenosis{border-color:#b87a00;background:#fffbf0}
    @media print{header{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  `;

  const _sec = (num, title) => `<div class="sec-head"><span class="sec-badge">${num}</span><span class="sec-title">${title}</span></div>`;

  const sec01 = `
    ${_sec('01','Perfil del paciente')}
    <div class="intro-box">Datos de identificación y contexto clínico registrados al inicio de la evaluación lumbar.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#f5f7ee;border-radius:6px;padding:12px;border:1px solid #e8f0d4">
        <div style="font-size:9px;text-transform:uppercase;color:#8fa845;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos del Paciente</div>
        ${nombre?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Nombre:</span> <strong>${nombre}</strong></div>`:''}
        ${edad?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Edad:</span> ${edad} años${sexo?' · '+sexo:''}</div>`:''}
        ${deporte?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Deporte:</span> ${deporte}</div>`:''}
        ${lesionMC?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Motivo:</span> ${lesionMC}</div>`:''}
        <div><span style="font-size:10px;color:#888">Fecha:</span> ${fecha}</div>
      </div>
      <div style="background:#f5f7ee;border-radius:6px;padding:12px;border:1px solid #e8f0d4">
        <div style="font-size:9px;text-transform:uppercase;color:#8fa845;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos Clínicos</div>
        ${tiempo?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Evolución:</span> ${tiempo}</div>`:''}
        ${mecanismo?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Mecanismo:</span> ${mecanismo}</div>`:''}
        ${nprs?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">NPRS:</span> ${nprs}/10</div>`:''}
        ${clasif?`<div><span style="font-size:10px;color:#888">Clasificación:</span> <strong>${clasifLabel[clasif]||clasif}</strong></div>`:''}
      </div>
    </div>`;

  const sec02 = symptomLabels.length ? `
    ${_sec('02','Presentación clínica reportada')}
    <div class="intro-box">Síntomas referidos durante la anamnesis. Orientan el diagnóstico diferencial pre-tests.</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
      ${symptomLabels.map(l => `<span style="background:#f5f7ee;border:1px solid #b8d08a;border-radius:4px;padding:4px 10px;font-size:10px;color:#1e2d0e">${l}</span>`).join('')}
    </div>` : '';

  const dolorosos = romRows.filter(r => r.eva > 0).map(r => `${r.label} (EVA ${r.eva}/10)`);
  const sec03 = (romRows.length || schober) ? `
    ${_sec('03','Rango de movimiento lumbar (ROM)')}
    <div class="intro-box">AROM con inclinómetro (°) o cinta métrica (cm: dedo-suelo, Schober por segmento). MDC ≈ 5° / 0.5 cm. EVA dolor = intensidad del dolor reproducido con ese movimiento (0 = sin repro). Schober modificado normal ≥ 5 cm (ICC 0.83–0.97). Ref: Blanpied 2017 · Tousignant 2005.</div>
    ${romRows.length ? `
    <table>
      <tr><th>Movimiento</th><th>Ref.</th><th>MDC</th><th>AROM</th><th>EVA repro</th></tr>
      ${romRows.map(r => `<tr>
        <td><strong>${r.label}</strong></td>
        <td style="color:#888">${r.ref}</td>
        <td style="color:#888">${r.mdc}</td>
        <td>${r.act ? r.act + (r.unit || '°') : '—'}</td>
        <td style="text-align:center">${r.eva > 0
          ? `<span style="color:#cc3333;font-weight:700">${r.eva}/10</span>`
          : '<span style="color:#aaa">0</span>'}</td>
      </tr>`).join('')}
    </table>` : ''}
    ${dolorosos.length ? `<div style="margin-top:6px;padding:7px 10px;background:#fff5f5;border:1px solid #ffc0c0;border-radius:5px;font-size:10px"><strong style="color:#cc3333">Movimientos que reproducen síntomas:</strong> ${dolorosos.join(' · ')}</div>` : ''}
    ${schober ? `<div style="margin-top:8px;padding:8px;background:#f8f8f0;border:1px solid #e0d8a0;border-radius:5px;font-size:10px"><strong>Schober modificado:</strong> ${schober} cm (normal ≥ 5 cm · ICC 0.83–0.97)</div>` : ''}` : '';

  const posTests = tests.filter(t => t.dR==='POS' || t.iR==='POS');
  const negTests = tests.filter(t => (t.dR==='NEG'||t.iR==='NEG') && t.dR!=='POS' && t.iR!=='POS');
  const sec04 = tests.length ? `
    ${_sec('04','Mapeo ortopédico de provocación')}
    <div class="intro-box">Tests estandarizados para provocar y reproducir síntomas lumbares de forma controlada. POSITIVO = reproduce síntomas. EVA indica intensidad reproducida (0–10). Fuentes: Delitto CPG 2012, Cook 2006, van der Windt 2010.</div>
    <table>
      <tr><th>Test</th><th>Estructura / EBM</th><th>D</th><th>EVA D</th><th>I</th><th>EVA I</th></tr>
      ${posTests.map(t=>`<tr>
        <td><strong>${t.name}</strong></td><td style="font-size:10px;color:#666">${t.sub}</td>
        <td class="${t.dR==='POS'?'pos':t.dR==='NEG'?'neg':''}">${t.dR||'—'}</td><td>${t.dR==='POS'?t.evaD:'—'}</td>
        <td class="${t.iR==='POS'?'pos':t.iR==='NEG'?'neg':''}">${t.iR||'—'}</td><td>${t.iR==='POS'?t.evaI:'—'}</td>
      </tr>`).join('')}
      ${negTests.map(t=>`<tr style="opacity:.7">
        <td>${t.name}</td><td style="font-size:10px;color:#666">${t.sub}</td>
        <td class="neg">${t.dR||'—'}</td><td>—</td>
        <td class="neg">${t.iR||'—'}</td><td>—</td>
      </tr>`).join('')}
    </table>` : '';

  const sec05 = hasMotor ? `
    ${_sec('05','Evaluación neuromuscular')}
    <div class="intro-box">Myotomas L2–S1 y reflejos osteotendinosos. Déficit = asimetría o < 5/5. Hiporreflexia + dermátomo + SLR positivo = cuadro radicular completo.</div>
    ${myoRows.length ? `
    <table style="margin-bottom:10px">
      <tr><th>Nivel</th><th>Movimiento</th><th>D</th><th>I</th><th>Asimetría</th></tr>
      ${myoRows.map(m=>`<tr>
        <td style="font-family:monospace;font-weight:700;color:#8fa845">${m.nivel}</td>
        <td>${m.mov}</td><td>${m.d||'—'}</td><td>${m.i||'—'}</td>
        <td class="${m.asym?'asym':''}">${m.asym?'⚠️ Asimetría':'—'}</td>
      </tr>`).join('')}
    </table>` : ''}
    ${refRows.length ? `
    <table>
      <tr><th>Reflejo</th><th>Nivel</th><th>Derecha</th><th>Izquierda</th></tr>
      ${refRows.map(r=>`<tr>
        <td><strong>${r.nombre}</strong></td>
        <td style="font-family:monospace;font-size:10px;color:#8fa845">${r.nivel}</td>
        <td>${r.d||'—'}</td><td>${r.i||'—'}</td>
      </tr>`).join('')}
    </table>` : ''}` : '';

  const sec06 = (sbResult || odiScore || psfsRes) ? `
    ${_sec('06','Escalas funcionales')}
    <div class="intro-box">STarT Back: estratificación de riesgo (bajo/medio/alto) guía intensidad de tratamiento. ODI: discapacidad funcional (MCID 10 pts). PSFS: actividades limitadas específicas (MCID 2 pts).</div>
    <div style="display:grid;grid-template-columns:${[sbResult,odiScore,psfsRes].filter(Boolean).length >= 2 ? '1fr 1fr':'1fr'};gap:12px">
      ${sbResult ? `<div style="background:#f5f7ee;border-radius:6px;padding:10px;border:1px solid #e8f0d4;text-align:center">
        <div style="font-size:9px;text-transform:uppercase;color:#8fa845;font-weight:700;margin-bottom:4px">STarT Back</div>
        <div style="font-size:14px;font-weight:700;color:#1e2d0e">${sbResult}</div>
      </div>` : ''}
      ${odiScore ? `<div style="background:#f5f7ee;border-radius:6px;padding:10px;border:1px solid #e8f0d4;text-align:center">
        <div style="font-size:9px;text-transform:uppercase;color:#8fa845;font-weight:700;margin-bottom:4px">ODI</div>
        <div style="font-size:22px;font-weight:900;color:#1e2d0e">${odiScore}%</div>
        <div style="font-size:10px;color:#888">${+odiScore<=20?'Mínima':+odiScore<=40?'Moderada':+odiScore<=60?'Grave':'Muy grave'} · MCID 10 pts</div>
      </div>` : ''}
      ${psfsRes ? `<div style="background:#f5f7ee;border-radius:6px;padding:10px;border:1px solid #e8f0d4">
        <div style="font-size:9px;text-transform:uppercase;color:#8fa845;font-weight:700;margin-bottom:4px">PSFS</div>
        <div style="font-size:11px;color:#1e2d0e">${psfsRes}</div>
        <div style="font-size:9px;color:#888;margin-top:4px">MCID 2 pts promedio</div>
      </div>` : ''}
    </div>` : '';

  const nm = id => (allTestDefs.find(t => t.id === id)?.name || id);
  const ns = id => ((typeof LUMBAR_SYMPTOMS !== 'undefined' ? LUMBAR_SYMPTOMS : []).find(s => s.id === id)?.label || id);

  const sec07 = dxResult.diagnosticos.length ? `
    ${_sec('07','Diagnóstico diferencial — CPG 2012')}
    <div class="intro-box">Motor de inferencia EBM basado en CPG Delitto 2012 (JOSPT) + Cook 2006 + Hicks 2003. Pondera tests ortopédicos (55%), apoyo (15%) y clínica (30%). Cluster SIJ Cook: ≥3/6 tests positivos confirman.</div>
    ${dxResult.diagnosticos.map((dx, i) => {
      const colorMap = { red:'#cc3333', neon:'#2d7a2d', amber:'#b87a00', orange:'#b05a00' };
      const c = colorMap[dx.colorKey] || '#8fa845';
      const clsMap = { 'LRP':'dx-lrp', 'SIJ':'dx-sij', 'Estabilidad':'dx-estabilidad', 'Estenosis':'dx-estenosis' };
      const cls = clsMap[dx.categoria] || 'dx-card';
      return `
      <div class="dx-card ${cls}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
          <span style="font-size:12px;font-weight:800;color:${c}">${i===0?'🏆 ':''}${dx.nombre}</span>
          <span style="font-size:10px;font-weight:700;color:${c}">${dx.confianzaLabel}</span>
        </div>
        <div style="font-size:9px;color:#888;margin-bottom:4px">Basado en: ${dx.source}</div>
        <div style="font-size:10px;color:#444;line-height:1.4;margin-bottom:6px">${dx.criterio}</div>
        ${dx.mainHits.length||dx.supportHits.length||dx.symptomHits.length?`
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
          ${dx.mainHits.map(t=>`<span style="background:#ffd0d0;color:#cc3333;padding:2px 6px;border-radius:3px;font-size:9px">✚ ${nm(t)}</span>`).join('')}
          ${dx.supportHits.map(t=>`<span style="background:#fff3cd;color:#b87a00;padding:2px 6px;border-radius:3px;font-size:9px">+ ${nm(t)}</span>`).join('')}
          ${dx.symptomHits.map(s=>`<span style="background:#e8f0d4;color:#1e2d0e;padding:2px 6px;border-radius:3px;font-size:9px">Sx: ${ns(s)}</span>`).join('')}
        </div>`:''
        }
        <div style="font-size:10px;line-height:1.4;color:#1a1a1a;padding-top:4px;border-top:1px solid #e8f0d4"><strong>Tratamiento CPG:</strong> ${dx.tratamiento.replace(/\n/g,' · ')}</div>
        <div style="font-size:9px;color:#888;margin-top:4px;font-style:italic">${dx.ref}</div>
      </div>`;
    }).join('')}` : '';


  // ── Recomendaciones clínicas EBM ─────────────────────────────────────────────
  const tiempoLabel = { agudo:'Agudo (< 4 semanas)', subagudo:'Subagudo (4–12 semanas)', cronico:'Crónico (> 12 semanas)' };
  const sbGroup = sbResult ? sbResult.split(' ')[0].toLowerCase() : '';
  const tiempoKey = tiempo || '';

  const _sbRec = () => {
    if (!sbResult) return '';
    if (sbResult.toLowerCase().includes('bajo')) return `
      <div style="padding:8px 12px;border-left:3px solid #2d7a2d;background:#f0fff4;border-radius:4px;margin-bottom:8px;font-size:10px">
        <strong style="color:#2d7a2d">STarT Back BAJO RIESGO → Vía 1:</strong> Autogestión + educación activa + mantenerse activo.<br>
        Rec: Educación en neurociencia del dolor · Actividad gradual · Evitar pasividad · 1–2 controles (WHO 2023 Gr. A).
      </div>`;
    if (sbResult.toLowerCase().includes('medio')) return `
      <div style="padding:8px 12px;border-left:3px solid #b87a00;background:#fffbf0;border-radius:4px;margin-bottom:8px;font-size:10px">
        <strong style="color:#b87a00">STarT Back RIESGO MEDIO → Vía 2:</strong> Programa de ejercicio dirigido + terapia manual.<br>
        Rec: Ejercicio activo supervisado · Manipulación/movilización (Rec. B) · Educación psicosocial (WHO 2023).
      </div>`;
    return `
      <div style="padding:8px 12px;border-left:3px solid #cc3333;background:#fff8f8;border-radius:4px;margin-bottom:8px;font-size:10px">
        <strong style="color:#cc3333">STarT Back ALTO RIESGO → Vía 3:</strong> Enfoque biopsicosocial intensivo.<br>
        Rec: Terapia cognitivo-conductual · Rehabilitación funcional intensiva · Psicología del dolor · Equipo interdisciplinario (WHO 2023 Gr. A).
      </div>`;
  };

  const _timeRec = () => {
    const recs = {
      agudo: `<li>Ejercicio activo específico — Rec. C (CPG 2021 George et al.)</li>
              <li>Terapia manual como coadyuvante — Rec. C agudo / Rec. B crónico</li>
              <li>Educación: mantenerse activo, pronóstico favorable (Rec. A)</li>
              <li>Evitar reposo absoluto en cama (Rec. A — WHO 2023)</li>
              <li>Imagen solo si banderas rojas o no mejora en 4–6 semanas</li>`,
      subagudo: `<li>Ejercicio activo + movilización articular (Rec. B)</li>
                 <li>Identificar factores psicosociales (banderas amarillas)</li>
                 <li>Prevenir cronificación: no catastrofizar, retorno gradual al trabajo</li>
                 <li>Terapia manual + ejercicio combinados: mejor que monoterapia (CPG 2021)</li>`,
      cronico: `<li>Ejercicio activo como tratamiento principal — múltiples modalidades (Rec. A — WHO 2023)</li>
                <li>Terapia manual: recomendada como adjunto (Rec. B — CPG 2021)</li>
                <li>Intervención psicológica / TCC si componente psicosocial (Rec. A — WHO 2023)</li>
                <li>Programa multicomponente: ejercicio + educación + psicológico (WHO 2023 Gr. A)</li>
                <li>Farmacología NO como primera línea en dolor primario crónico (WHO 2023)</li>`,
    };
    const r = recs[tiempoKey];
    if (!r) return '';
    return `
      <div style="padding:8px 12px;background:#f5f7ee;border-radius:4px;margin-bottom:8px;font-size:10px">
        <strong style="color:#1e2d0e">Por tiempo de evolución (${tiempoLabel[tiempoKey]||tiempoKey}):</strong>
        <ul style="margin:6px 0 0;padding-left:16px;line-height:1.7">${r}</ul>
      </div>`;
  };

  const _dxRec = () => {
    if (!dxResult.diagnosticos.length) return '';
    const top = dxResult.diagnosticos[0];
    const recMap = {
      'radiculopatia-lbp': 'Movilización neural progresiva · Ejercicio activo · Tracción si agudo severo · Evitar cirugía < 6–12 semanas salvo urgencia neurológica',
      'sij-disfuncion':    'Manipulación SIJ en decúbito lateral · Estabilización lumbopélvica · Cinturón pélvico si inestabilidad · Infiltración SIJ guiada si refractaria',
      'inestabilidad-lumbar': 'Motor control training: transverso + multífido · Estabilización local → global → funcional · Evitar manipulación en inestabilidad alta · CORE progresivo',
      'estenosis-neuro':   'Ejercicio en flexión · Bicicleta stationary · Aquatic therapy · Corsé en agudo · Derivar cirugía si progresivo (descompresión)',
      'dolor-facetario':   'Movilización grados III-IV · Manipulación thrust (Rec. B) · Ejercicio activo general · Calor local · Infiltración si refractario > 3 meses',
    };
    const rec = recMap[top.id] || top.tratamiento?.split('\n')[0] || '';
    return `
      <div style="padding:8px 12px;border-left:3px solid #8fa845;background:#f5f7ee;border-radius:4px;margin-bottom:8px;font-size:10px">
        <strong style="color:#1e2d0e">Por diagnóstico principal (${top.nombre}):</strong><br>
        <span style="line-height:1.7">${rec}</span>
      </div>`;
  };

  const sec08 = (_sbRec() || _timeRec() || _dxRec()) ? `
    <div class="sec-head"><span class="sec-badge">08</span><span class="sec-title">Recomendaciones clínicas EBM</span></div>
    <div class="intro-box">Basado en: STarT Back risk stratification · CPG 2021 George et al. JOSPT (Revisión AOPT) · WHO 2023 non-surgical chronic LBP guideline. No reemplaza juicio clínico individualizado.</div>
    ${_sbRec()}
    ${_timeRec()}
    ${_dxRec()}
    <div style="font-size:9px;color:#888;margin-top:8px;padding-top:6px;border-top:1px solid #e8f0d4">
      Referencias: George et al. J Orthop Sports Phys Ther 2021;51(11):CPG1-CPG60 · WHO Guideline non-surgical LBP 2023 (ISBN 978-92-4-008178-9) · Keele STarT Back Tool (Hill 2008) · Delitto JOSPT 2012
    </div>` : '';

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
    <title>Informe Lumbar — ${nombre}</title>
    <style>${css}</style></head><body style="padding:32px;max-width:860px;margin:0 auto">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #8fa845">
      <div>
        <div style="font-size:22px;font-weight:900;color:#1e2d0e">Informe de evaluación</div>
        <div style="font-size:14px;color:#8fa845;font-weight:700">🔶 Columna Lumbar — CPG 2012 · Delitto et al. JOSPT</div>
      </div>
      <div style="text-align:right;font-size:10px;color:#888">${fecha}<br><span style="font-size:9px">MoveMetrics v12</span></div>
    </div>
    ${sec01}${sec02}${sec03}${sec04}${sec05}${sec06}${sec07}${sec08}
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e8f0d4;font-size:9px;color:#aaa;text-align:center">
      CPG Delitto JOSPT 2012 · George et al. CPG 2021 · WHO 2023 · Cook Spine 2006 · Alqarni 2010 · Stuber JCCA 2014 · Laslett 2005 · Hicks 2003 · No reemplaza el juicio clínico
    </div>
    <script>setTimeout(()=>window.print(),400)</script>
    </body></html>`);
  win.document.close();
}

window.initLumbarSheet      = initLumbarSheet;
window.showLBPTab           = showLBPTab;
window.toggleOTLumbar       = toggleOTLumbar;
window.checkLBPMyotomaAsym  = checkLBPMyotomaAsym;
window.toggleReflejoLBP     = toggleReflejoLBP;
window.buildStartBack       = buildStartBack;
window._onLBPSymptomChange  = _onLBPSymptomChange;
window.checkLBPRedFlags     = checkLBPRedFlags;
window.calcStartBack2       = calcStartBack2;
window.selectLBPPSFS        = selectLBPPSFS;
window.checkLBPRedFlags     = checkLBPRedFlags;
window._onLBPSymptomChange  = _onLBPSymptomChange;
window.saveLBPSession       = saveLBPSession;
window.refreshLBPSessionBar = refreshLBPSessionBar;
window.loadLBPSession       = loadLBPSession;
window.toggleLBPHistorial   = toggleLBPHistorial;
window.generarInformeLumbar = generarInformeLumbar;

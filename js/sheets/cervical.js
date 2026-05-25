// sheets/cervical.js — ROM, tests, CFRT, CCFT, NFE, myotomas, reflejos, NDI, PSFS + informe + EBM Dx
// ══════════════════════════════════════════════════════
//  CERVICAL SHEET  v2
// ══════════════════════════════════════════════════════

let cxNdiVals  = new Array(10).fill(null);
let cxPsfsVals = [null, null, null];
const ccftState = {};

function showCXTab(tab, btn) {
  ['obs','rom','tests','motor','esc','informe'].forEach(t => {
    const el = document.getElementById('cxtab-' + t); if(el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-cervical .btn').forEach(b => {
    if (b.id && b.id.startsWith('cxtab-')) { b.className = 'btn btn-ghost btn-sm'; b.style.whiteSpace='nowrap'; b.style.fontSize='10px'; }
  });
  if (btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace='nowrap'; btn.style.fontSize='10px'; }
}

function initCervicalSheet() {
  buildCXROM();
  buildCXTests();
  buildCXMyotomas();
  buildCXReflejos();
  buildNDI();
  buildCXPSFS();
  buildCervicalSymptoms();
  if (typeof refreshCervicalSessionBar === 'function') refreshCervicalSessionBar();
}

function buildCXROM() {
  const c = document.getElementById('cx-rom-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = CERVICAL_ROM.map(r => `
    <div class="card mb-8">
      <div class="card-header" style="padding:8px 12px"><h3 style="font-size:12px">${r.label}</h3><span class="tag tag-b" style="font-size:9px">Ref: ${r.ref}</span></div>
      <div class="card-body" style="padding:8px 12px">
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">Activo (°)</label><input class="inp inp-mono" type="number" id="cx-rom-${r.id}-act" placeholder="${r.ref}" style="text-align:center"></div>
          <div class="ig"><label class="il">Pasivo (°)</label><input class="inp inp-mono" type="number" id="cx-rom-${r.id}-pas" placeholder="${r.ref}" style="text-align:center"></div>
        </div>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px">MDC: ${r.mdc}</div>
      </div>
    </div>
  `).join('');
}

function buildCXTests() {
  _buildCervTestGroup('cx-tests-radicular',   CERVICAL_TESTS_RADICULAR);
  _buildCervTestGroup('cx-tests-headache',    CERVICAL_TESTS_HEADACHE);
  _buildCervTestGroup('cx-tests-estabilidad', CERVICAL_TESTS_ESTABILIDAD);
  _buildCervTestGroup('cx-tests-mielopatia',  CERVICAL_TESTS_MIELOPATIA);
}

function _buildCervTestGroup(containerId, tests) {
  const c = document.getElementById(containerId); if(!c || c.innerHTML) return;
  c.innerHTML = tests.map(t => `
    <div class="card mb-8" data-test-id="${t.id}">
      <div class="card-header"><h3>${t.name}</h3><span class="tag ${t.tag}" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:8px">${t.ref}</div>
        <div class="grid-2" style="gap:8px">
          <div class="cx-test-col">
            <div class="il mb-4">Derecho</div>
            <div style="display:flex;gap:6px">
              <button class="ot-btn" onclick="toggleOTCervical(this,'pos')">+ POS</button>
              <button class="ot-btn" onclick="toggleOTCervical(this,'neg')">– NEG</button>
            </div>
            <div style="margin-top:6px">
              <label style="font-size:10px;color:var(--text3)">EVA D</label>
              <input type="range" class="eva-slider cx-eva-d" min="0" max="10" value="0"
                oninput="this.nextElementSibling.textContent=this.value">
              <span style="font-family:var(--mono);font-size:13px;display:block;text-align:center">0</span>
            </div>
          </div>
          <div class="cx-test-col">
            <div class="il mb-4">Izquierdo</div>
            <div style="display:flex;gap:6px">
              <button class="ot-btn" onclick="toggleOTCervical(this,'pos')">+ POS</button>
              <button class="ot-btn" onclick="toggleOTCervical(this,'neg')">– NEG</button>
            </div>
            <div style="margin-top:6px">
              <label style="font-size:10px;color:var(--text3)">EVA I</label>
              <input type="range" class="eva-slider cx-eva-i" min="0" max="10" value="0"
                oninput="this.nextElementSibling.textContent=this.value">
              <span style="font-family:var(--mono);font-size:13px;display:block;text-align:center">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleOTCervical(btn, type) {
  const btnGroup = btn.parentElement;
  btnGroup.querySelectorAll('.ot-btn').forEach(b => b.classList.remove('pos','neg'));
  btn.classList.add(type);
  const col = btnGroup.closest('.cx-test-col');
  if (col) {
    const slider = col.querySelector('.eva-slider');
    const valEl  = col.querySelector('span');
    if (slider) {
      if (type === 'neg') {
        slider.disabled = true; slider.value = 0;
        slider.style.opacity = '0.25'; slider.style.pointerEvents = 'none';
        if (valEl) valEl.textContent = '0';
      } else {
        slider.disabled = false; slider.style.opacity = '1'; slider.style.pointerEvents = '';
      }
    }
  }
  setTimeout(() => {
    if (typeof renderDiagnosticosCervical === 'function')
      renderDiagnosticosCervical(_getCervicalModalPositivos(), _getCervicalSelectedSymptoms());
    _renderCervicalMissingAlerts();
  }, 0);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function _getCervicalModalPositivos() {
  const positivos = [];
  const allTests = [
    ...(typeof CERVICAL_TESTS_RADICULAR   !== 'undefined' ? CERVICAL_TESTS_RADICULAR   : []),
    ...(typeof CERVICAL_TESTS_HEADACHE    !== 'undefined' ? CERVICAL_TESTS_HEADACHE    : []),
    ...(typeof CERVICAL_TESTS_ESTABILIDAD !== 'undefined' ? CERVICAL_TESTS_ESTABILIDAD : []),
    ...(typeof CERVICAL_TESTS_MIELOPATIA  !== 'undefined' ? CERVICAL_TESTS_MIELOPATIA  : []),
  ];
  allTests.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (!card) return;
    const hasPOS = [...card.querySelectorAll('.cx-test-col')].some(col => col.querySelector('.ot-btn.pos'));
    if (hasPOS) positivos.push(test.id);
  });
  return positivos;
}

function _getDoneCervicalTestIds() {
  const done = new Set();
  document.querySelectorAll('[data-test-id]').forEach(card => {
    const testId = card.dataset.testId;
    if (!testId) return;
    const hasAny = [...card.querySelectorAll('.cx-test-col')].some(col =>
      col.querySelector('.ot-btn.pos') || col.querySelector('.ot-btn.neg')
    );
    if (hasAny) done.add(testId);
  });
  return done;
}

function _getCervicalSelectedSymptoms() {
  return [...document.querySelectorAll('#cx-symptoms-list input[type=checkbox]:checked')].map(cb => cb.value);
}

// ── Symptom checklist ────────────────────────────────────────────────────────
function buildCervicalSymptoms() {
  const c = document.getElementById('cx-symptoms-list'); if (!c || c.innerHTML) return;
  if (typeof CERVICAL_SYMPTOMS === 'undefined') return;

  const regions = [
    { key:'radiculopatia', label:'Radiculopatía cervical', color:'var(--red)',   tag:'tag-r' },
    { key:'cefalea',       label:'Cefalea cervicogénica',  color:'var(--amber)', tag:'tag-y' },
    { key:'wad',           label:'WAD / Disfunción coordinación', color:'#fb923c', tag:'' },
    { key:'movilidad',     label:'Déficit de movilidad',    color:'var(--neon)', tag:'tag-b' },
    { key:'mielopatia',    label:'⚠️ Sospecha mielopatía', color:'var(--red)',  tag:'tag-r' },
  ];

  c.innerHTML = regions.map(r => {
    const items = CERVICAL_SYMPTOMS.filter(s => s.region === r.key);
    if (!items.length) return '';
    return `
      <div style="margin-bottom:10px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${r.color};margin-bottom:5px">${r.label}</div>
        ${items.map(s => `
          <label style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid var(--border);cursor:pointer">
            <input type="checkbox" value="${s.id}" onchange="_onCervicalSymptomChange()" style="margin-top:2px;accent-color:${r.color}">
            <span style="font-size:11px;line-height:1.4">${s.icon} ${s.label}</span>
          </label>
        `).join('')}
      </div>
    `;
  }).join('');
}

function _onCervicalSymptomChange() {
  setTimeout(() => {
    if (typeof renderDiagnosticosCervical === 'function')
      renderDiagnosticosCervical(_getCervicalModalPositivos(), _getCervicalSelectedSymptoms());
    _renderCervicalMissingAlerts();
  }, 0);
}

// ── Live missing-test alerts ──────────────────────────────────────────────────
function _renderCervicalMissingAlerts() {
  const panel = document.getElementById('cx-missing-alerts-panel');
  if (!panel) return;
  const positivos = _getCervicalModalPositivos();
  const symptoms  = _getCervicalSelectedSymptoms();
  const doneIds   = _getDoneCervicalTestIds();
  if ((positivos.length === 0 && symptoms.length === 0) || typeof CERVICAL_RULES === 'undefined') {
    panel.innerHTML = ''; return;
  }

  const dxResult = diagnosticarCervical(positivos, symptoms);
  const alerts = [];

  dxResult.diagnosticos.forEach(dx => {
    if (dx.confidence < 20) return;
    const missing = dx.testsKey.filter(t => !doneIds.has(t));
    if (missing.length === 0) return;
    const allTests = [
      ...(typeof CERVICAL_TESTS_RADICULAR   !== 'undefined' ? CERVICAL_TESTS_RADICULAR   : []),
      ...(typeof CERVICAL_TESTS_HEADACHE    !== 'undefined' ? CERVICAL_TESTS_HEADACHE    : []),
      ...(typeof CERVICAL_TESTS_ESTABILIDAD !== 'undefined' ? CERVICAL_TESTS_ESTABILIDAD : []),
      ...(typeof CERVICAL_TESTS_MIELOPATIA  !== 'undefined' ? CERVICAL_TESTS_MIELOPATIA  : []),
    ];
    const nameOfTest = id => (allTests.find(t => t.id === id)?.name || id);
    alerts.push({ dx: dx.nombre, cat: dx.categoria, missing: missing.map(nameOfTest) });
  });

  if (!alerts.length) { panel.innerHTML = ''; return; }

  panel.innerHTML = alerts.map(a => `
    <div style="margin-top:8px;padding:8px 10px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.25);border-radius:8px;font-size:10px">
      <span style="font-weight:700;color:var(--amber)">⚡ ${a.dx}</span>
      <span style="color:var(--text3)"> — tests pendientes: </span>
      ${a.missing.map(n => `<span style="background:rgba(251,191,36,.15);color:var(--amber);padding:1px 6px;border-radius:3px;margin:0 2px">${n}</span>`).join('')}
    </div>
  `).join('');
}

function calcCFRT() {
  const d = +document.getElementById('cfrt-d')?.value || 0;
  const i = +document.getElementById('cfrt-i')?.value || 0;
  const el = document.getElementById('cfrt-result'); if(!el) return;
  if(!d && !i) { el.textContent = 'Ingresá valores — positivo: <32° o diferencia >10°'; el.style.color='var(--text3)'; return; }
  const diff = Math.abs(d - i);
  const posD = d > 0 && d < 32;
  const posI = i > 0 && i < 32;
  const posAsym = diff > 10;
  if(posD || posI || posAsym) {
    const reasons = [];
    if(posD) reasons.push(`D: ${d}° < 32°`);
    if(posI) reasons.push(`I: ${i}° < 32°`);
    if(posAsym) reasons.push(`Asimetría: ${diff}°`);
    el.innerHTML = `<span style="color:var(--red)">⚠️ POSITIVO — ${reasons.join(' · ')}</span><br><span style="font-size:10px;color:var(--text3)">Sugestivo cefalea cervicogénica C1-C2</span>`;
  } else {
    el.innerHTML = `<span style="color:var(--neon)">✓ NEGATIVO — D:${d}° I:${i}° (ambos ≥32°, dif. ${diff}°)</span>`;
  }
}

function toggleCCFT(btn, type, level) {
  const siblings = btn.parentElement.querySelectorAll('.ot-btn');
  siblings.forEach(b => { b.classList.remove('btn-neon','btn-danger'); });
  btn.classList.add(type === 'ok' ? 'btn-neon' : 'btn-danger');
  ccftState[level] = type;
  _updateCCFTResult();
}

function _updateCCFTResult() {
  const levels = [22, 24, 26, 28, 30];
  const el = document.getElementById('ccft-result'); if(!el) return;
  const tested = levels.filter(l => ccftState[l]);
  if(!tested.length) { el.textContent='Testear niveles progresivamente'; el.style.color='var(--text3)'; return; }
  const maxOK = levels.filter(l => ccftState[l] === 'ok').reduce((a,b) => Math.max(a,b), 0);
  const firstFail = levels.find(l => ccftState[l] === 'fail');
  if(!firstFail) {
    el.innerHTML = `<span style="color:var(--neon)">✓ Aprobó hasta ${maxOK} mmHg</span><br><span style="font-size:10px;color:var(--text3)">Continuar si hay niveles sin testear</span>`;
  } else {
    el.innerHTML = `<span style="color:var(--amber)">Falla en ${firstFail} mmHg${maxOK ? ' · Aprobó hasta '+maxOK+' mmHg' : ''}</span><br><span style="font-size:10px;color:var(--text3)">Disfunción flexores profundos · Indica NPMCI</span>`;
  }
}

function calcCXNFE() {
  const t = +document.getElementById('cx-nfe-tiempo')?.value || 0;
  const sexo = document.getElementById('cx-nfe-sexo')?.value || 'M';
  const el = document.getElementById('cx-nfe-result'); if(!el) return;
  if(!t) { el.textContent='Ingresá el tiempo'; el.style.color='var(--text3)'; return; }
  const norm = sexo === 'M' ? 39 : 29;
  if(t >= norm) {
    el.innerHTML = `<span style="color:var(--neon)">✓ Normal — ${t}s (ref ≥${norm}s)</span>`;
  } else {
    el.innerHTML = `<span style="color:var(--red)">⚠️ Déficit — ${t}s / ref ≥${norm}s · Déficit: ${norm-t}s</span><br><span style="font-size:10px;color:var(--text3)">Disfunción flexores profundos cervicales</span>`;
  }
}

function buildCXMyotomas() {
  const c = document.getElementById('cx-myotomas-fields'); if(!c || c.innerHTML) return;
  const opts = ['','5/5','4+','4/5','4-','3/5','2/5','1/5','0/5']
    .map((v,i) => `<option value="${v}"${i===0?' selected':''}>${i===0?'—':v}</option>`).join('');
  c.innerHTML = `
    <div style="display:grid;grid-template-columns:36px 1fr 64px 64px;gap:4px 8px;align-items:center;padding:4px 0 8px;border-bottom:1px solid var(--border)">
      <span style="font-size:9px;color:var(--text3)">Nivel</span>
      <span style="font-size:9px;color:var(--text3)">Movimiento test</span>
      <span style="font-size:9px;color:var(--text3);text-align:center">D</span>
      <span style="font-size:9px;color:var(--text3);text-align:center">I</span>
    </div>` +
  CX_MYOTOMAS.map(m => `
    <div style="display:grid;grid-template-columns:36px 1fr 64px 64px;gap:4px 8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="font-family:var(--mono);font-size:12px;font-weight:700;color:var(--neon)">${m.nivel}</div>
      <div style="font-size:11px;color:var(--text2)">${m.mov}</div>
      <select class="inp inp-mono" id="${m.id}-d" style="padding:3px 4px;font-size:11px;text-align:center" onchange="checkMyotomaAsym('${m.id}')">${opts}</select>
      <select class="inp inp-mono" id="${m.id}-i" style="padding:3px 4px;font-size:11px;text-align:center" onchange="checkMyotomaAsym('${m.id}')">${opts}</select>
    </div>
    <div id="${m.id}-alert" style="display:none;font-size:10px;color:var(--red);padding:2px 8px 4px">⚠️ Asimetría D/I — posible nivel comprometido</div>
  `).join('');
}

function checkMyotomaAsym(id) {
  const d = document.getElementById(id+'-d')?.value;
  const i = document.getElementById(id+'-i')?.value;
  const al = document.getElementById(id+'-alert');
  if(!al) return;
  al.style.display = (d && i && d !== i) ? 'block' : 'none';
}

function toggleReflejoCX(btn, val) {
  // Radio-like toggle within the flex group (3 buttons)
  const siblings = btn.parentElement.querySelectorAll('.cx-reflejo-btn');
  siblings.forEach(b => { b.classList.remove('btn-neon'); b.dataset.active = ''; });
  if (btn.dataset.active === val) {
    // clicking same = deselect
    btn.dataset.active = '';
  } else {
    btn.classList.add('btn-neon');
    btn.dataset.active = val;
  }
}

function buildCXReflejos() {
  const c = document.getElementById('cx-reflejos-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = CX_REFLEJOS.map(r => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:12px;font-weight:600">${r.nombre}</span>
        <span style="font-family:var(--mono);font-size:10px;color:var(--neon)">${r.nivel}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <div>
          <div style="font-size:9px;color:var(--text3);margin-bottom:4px;text-align:center">DERECHA</div>
          <div style="display:flex;gap:3px;justify-content:center">
            <button class="ot-btn cx-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoCX(this,'hiper')">↑ Hiper</button>
            <button class="ot-btn cx-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoCX(this,'norm')">= Norm</button>
            <button class="ot-btn cx-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoCX(this,'hipo')">↓ Hipo</button>
          </div>
        </div>
        <div>
          <div style="font-size:9px;color:var(--text3);margin-bottom:4px;text-align:center">IZQUIERDA</div>
          <div style="display:flex;gap:3px;justify-content:center">
            <button class="ot-btn cx-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoCX(this,'hiper')">↑ Hiper</button>
            <button class="ot-btn cx-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoCX(this,'norm')">= Norm</button>
            <button class="ot-btn cx-reflejo-btn" style="font-size:9px;padding:3px 6px" onclick="toggleReflejoCX(this,'hipo')">↓ Hipo</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function buildNDI() {
  const c = document.getElementById('ndi-fields'); if(!c || c.innerHTML) return;
  cxNdiVals = new Array(10).fill(null);
  c.innerHTML = NDI_ITEMS.map((item, i) => `
    <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;font-weight:600;margin-bottom:6px">${i+1}. ${item}</div>
      <div style="display:flex;gap:3px;flex-wrap:wrap">
        ${[0,1,2,3,4,5].map(v => `
          <button class="ot-btn" style="font-size:10px;padding:4px 10px;flex:1;min-width:36px" onclick="selectNDI(this,${i},${v})" title="${NDI_LABELS[i]?.[v]||''}">
            <span style="font-family:var(--mono);font-weight:700">${v}</span>
          </button>
        `).join('')}
      </div>
      <div id="ndi-hint-${i}" style="font-size:9px;color:var(--text3);margin-top:4px;font-style:italic"></div>
    </div>
  `).join('');
}

function selectNDI(btn, idx, val) {
  const siblings = btn.parentElement.querySelectorAll('.ot-btn');
  siblings.forEach(b => b.classList.remove('btn-neon'));
  btn.classList.add('btn-neon');
  cxNdiVals[idx] = val;
  const hint = document.getElementById('ndi-hint-'+idx);
  if(hint && NDI_LABELS[idx]?.[val]) hint.textContent = NDI_LABELS[idx][val];
  calcNDI();
}

function calcNDI() {
  const filled = cxNdiVals.filter(v => v !== null);
  const totalEl = document.getElementById('ndi-total');
  const interpEl = document.getElementById('ndi-interp');
  if(filled.length < 10) {
    if(totalEl) { totalEl.textContent = `${filled.length}/10`; totalEl.style.color='var(--text3)'; }
    return;
  }
  const score = cxNdiVals.reduce((a,b) => a+b, 0);
  const pct = score * 2;
  if(totalEl) {
    totalEl.textContent = score;
    totalEl.style.color = score <= 4 ? 'var(--neon)' : score <= 14 ? 'var(--amber)' : 'var(--red)';
  }
  if(interpEl) {
    const cat = score <= 4 ? 'Sin discapacidad (0–8%)' : score <= 14 ? 'Discapacidad leve (10–28%)' : score <= 24 ? 'Discapacidad moderada (30–48%)' : score <= 34 ? 'Discapacidad severa (50–64%)' : 'Discapacidad completa (>64%)';
    interpEl.textContent = `${cat} · ${pct}% · MCID ≥7.5 pts de mejora`;
  }
}

function buildCXPSFS() {
  const c = document.getElementById('cx-psfs-fields'); if(!c || c.innerHTML) return;
  cxPsfsVals = [null, null, null];
  c.innerHTML = [1,2,3].map(n => `
    <div class="ig mb-8">
      <label class="il">Actividad ${n}</label>
      <input class="inp" type="text" id="cx-psfs-act-${n}" placeholder="Ej: Mirar al costado al manejar..." style="margin-bottom:6px">
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${[0,1,2,3,4,5,6,7,8,9,10].map(v => `<button class="ot-btn" style="font-size:10px;padding:2px 6px" onclick="selectCXPSFS(this,${n-1},${v})">${v}</button>`).join('')}
      </div>
    </div>
  `).join('');
}

function selectCXPSFS(btn, idx, val) {
  const siblings = btn.parentElement.querySelectorAll('.ot-btn');
  siblings.forEach(b => b.classList.remove('btn-neon'));
  btn.classList.add('btn-neon');
  cxPsfsVals[idx] = val;
  const filled = cxPsfsVals.filter(v => v !== null);
  const el = document.getElementById('cx-psfs-result'); if(!el) return;
  if(!filled.length) { el.textContent='Promedio PSFS: —'; el.style.color='var(--text3)'; return; }
  const avg = (filled.reduce((a,b) => a+b, 0) / filled.length).toFixed(1);
  el.innerHTML = `<span style="color:${avg>=5?'var(--neon)':avg>=3?'var(--amber)':'var(--red)'}">Promedio PSFS: ${avg}/10</span> <span style="font-size:10px;color:var(--text3)">(${filled.length}/3 actividades · MCID ≥2 pts)</span>`;
}

function updateCXClasif(radio) {
  const hints = {
    npmd: '📋 NPMD — Déficit de Movilidad: manipulación/movilización cervical + ejercicios de ROM. ROM limitado, dolor local. Buena respuesta a tto manual.',
    npmci: '⚡ NPMCI — Coordinación/WAD: CCFT + entrenamiento estabilizadores profundos. Sensibilización central posible. Evitar manipulación en WAD agudo.',
    npha: '🧠 NPHA — Cefalea Cervicogénica: movilización/manipulación C1-C2 + CFRT para seguimiento. CFRT+ confirma. Distinguir de migraña (sin aura ni autonomía).',
    nprp: '⚠️ NPRP — Radiculopatía: tracción cervical + ejercicios + educación. Derivar si déficit motor progresivo. Cluster Spurling+Distracción+ULNT1 confirma.'
  };
  const el = document.getElementById('cx-clasif-hint'); if(!el) return;
  el.textContent = hints[radio.value] || '';
  el.style.display = 'block';
}

function checkCXRedFlags() {
  const cbs = document.querySelectorAll('.cx-redflag');
  const any = [...cbs].some(c => c.checked);
  const el = document.getElementById('cx-redflag-alert'); if(el) el.style.display = any ? 'block' : 'none';
}

// ── Session management ────────────────────────────────────────────────────────
function _readCervicalSessionData() {
  const gv = id => document.getElementById(id)?.value || '';
  const gt = id => document.getElementById(id)?.textContent?.trim() || '';

  const allTests = [
    ...(typeof CERVICAL_TESTS_RADICULAR   !== 'undefined' ? CERVICAL_TESTS_RADICULAR   : []),
    ...(typeof CERVICAL_TESTS_HEADACHE    !== 'undefined' ? CERVICAL_TESTS_HEADACHE    : []),
    ...(typeof CERVICAL_TESTS_ESTABILIDAD !== 'undefined' ? CERVICAL_TESTS_ESTABILIDAD : []),
    ...(typeof CERVICAL_TESTS_MIELOPATIA  !== 'undefined' ? CERVICAL_TESTS_MIELOPATIA  : []),
  ];
  const tests = {};
  allTests.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (!card) return;
    const cols = card.querySelectorAll('.cx-test-col');
    tests[test.id] = { d: null, i: null, evaD: 0, evaI: 0 };
    cols.forEach((col, idx) => {
      const side = idx === 0 ? 'd' : 'i';
      tests[test.id][side] = col.querySelector('.ot-btn.pos') ? 'pos' : (col.querySelector('.ot-btn.neg') ? 'neg' : null);
      const slider = col.querySelector('.eva-slider');
      tests[test.id][idx === 0 ? 'evaD' : 'evaI'] = slider ? +slider.value : 0;
    });
  });

  const rom = {};
  CERVICAL_ROM.forEach(r => {
    rom[r.id] = { act: gv(`cx-rom-${r.id}-act`), pas: gv(`cx-rom-${r.id}-pas`) };
  });

  const symptomsChecked = _getCervicalSelectedSymptoms();
  const clasif = document.querySelector('input[name="cx-clasificacion"]:checked')?.value || '';

  return {
    fecha: new Date().toISOString().split('T')[0],
    nombre: '',
    tests, rom, symptomsChecked, clasif,
    nprs: gv('cx-nprs'),
    tiempo: gv('cx-tiempo'), mecanismo: gv('cx-mecanismo'),
    cfrtD: gv('cfrt-d'), cfrtI: gv('cfrt-i'),
    ccft: { ...ccftState },
    nfeTiempo: gv('cx-nfe-tiempo'), nfeSexo: gv('cx-nfe-sexo'),
    ndiTotal: gt('ndi-total'),
    psfsResult: gt('cx-psfs-result'),
    cxNdiVals:  [...cxNdiVals],
    cxPsfsVals: [...cxPsfsVals],
  };
}

function saveCervicalSession() {
  if (!cur) { alert('Abrí la ficha del paciente primero'); return; }
  const name = prompt('Nombre para esta evaluación:', `Sesión ${(cur.klinical?.cervical?.sessions||[]).length + 1}`);
  if (!name) return;
  if (!cur.klinical) cur.klinical = {};
  if (!cur.klinical.cervical) cur.klinical.cervical = {};
  if (!cur.klinical.cervical.sessions) cur.klinical.cervical.sessions = [];
  const data = _readCervicalSessionData();
  data.nombre = name;
  cur.klinical.cervical.sessions.push(data);
  atletas = atletas.map(a => a.id === cur.id ? cur : a);
  saveData();
  showSaveToast();
  refreshCervicalSessionBar();
}

function refreshCervicalSessionBar() {
  if (!cur) return;
  const sessions = cur.klinical?.cervical?.sessions || [];
  const sel = document.getElementById('cx-session-select');
  if (sel) {
    sel.innerHTML = '<option value="">— Sesión actual —</option>' +
      sessions.map((s, i) => `<option value="${i}">${s.nombre || `Sesión ${i+1}`} · ${s.fecha||''}</option>`).join('');
  }
}

function loadCervicalSession(idx) {
  if (idx === '' || !cur) return;
  const sessions = cur.klinical?.cervical?.sessions || [];
  const s = sessions[parseInt(idx)];
  if (!s) return;
  const sv = (id, val) => { const el = document.getElementById(id); if(el && val!==undefined) el.value = val; };
  sv('cx-nprs', s.nprs);
  sv('cx-tiempo', s.tiempo); sv('cx-mecanismo', s.mecanismo);
  sv('cfrt-d', s.cfrtD); sv('cfrt-i', s.cfrtI);
  sv('cx-nfe-tiempo', s.nfeTiempo); sv('cx-nfe-sexo', s.nfeSexo);
  if (s.nprs) { const el = document.getElementById('cx-nprs'); if(el) el.nextElementSibling.textContent = el.value; }
  if (s.symptomsChecked) {
    document.querySelectorAll('#cx-symptoms-list input[type=checkbox]').forEach(cb => {
      cb.checked = s.symptomsChecked.includes(cb.value);
    });
    if (typeof renderDiagnosticosCervical === 'function')
      renderDiagnosticosCervical(_getCervicalModalPositivos(), _getCervicalSelectedSymptoms());
  }
  if (s.clasif) {
    const r = document.querySelector(`input[name="cx-clasificacion"][value="${s.clasif}"]`);
    if (r) { r.checked = true; updateCXClasif(r); }
  }
  calcCFRT(); calcCXNFE();
  showSaveToast();
}

function toggleCervicalHistorial() {
  const panel = document.getElementById('cx-historial-panel');
  if (!panel) return;
  if (panel.style.display !== 'none') { panel.style.display = 'none'; return; }
  const sessions = cur?.klinical?.cervical?.sessions || [];
  if (!sessions.length) {
    panel.innerHTML = '<div style="font-size:10px;color:var(--text3);padding:8px">Sin evaluaciones guardadas aún.</div>';
    panel.style.display = 'block'; return;
  }
  panel.innerHTML = sessions.map((s, i) => `
    <div style="padding:8px;border:1px solid var(--border);border-radius:6px;margin-bottom:6px;font-size:10px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <strong>${s.nombre || `Sesión ${i+1}`}</strong>
        <span style="color:var(--text3)">${s.fecha||''}</span>
      </div>
      <div style="margin-top:4px;color:var(--text2)">
        ${s.ndiTotal&&s.ndiTotal!=='—'?`NDI: <strong>${s.ndiTotal}</strong> · `:''}
        ${s.clasif?`Clasif: <strong>${s.clasif.toUpperCase()}</strong>`:''}
      </div>
      <button class="btn btn-ghost btn-sm" style="font-size:9px;margin-top:4px" onclick="loadCervicalSession(${i})">Cargar sesión</button>
    </div>
  `).join('');
  panel.style.display = 'block';
}

// ── Informe cervical PDF ──────────────────────────────────────────────────────
function generarInformeCervical() {
  if (!cur) { alert('Abrí la ficha del paciente primero'); return; }

  const gt = id => document.getElementById(id)?.textContent?.trim() || '';
  const gv = id => document.getElementById(id)?.value?.trim()       || '';

  const nombre    = cur?.nombre   || '—';
  const edad      = cur?.edad     || '';
  const sexo      = cur?.sexo     || '';
  const deporte   = cur?.deporte  || '';
  const lesionMC  = cur?.lesion   || '';
  const fecha     = new Date().toLocaleDateString('es-AR', {day:'2-digit',month:'long',year:'numeric'});

  const clasif      = document.querySelector('input[name="cx-clasificacion"]:checked')?.value || '';
  const clasifLabel = { npmd:'NPMD — Déficit de Movilidad', npmci:'NPMCI — Coordinación/WAD', npha:'NPHA — Cefalea Cervicogénica', nprp:'NPRP — Radiculopatía' };
  const tiempo      = gv('cx-tiempo');
  const mecanismo   = gv('cx-mecanismo');
  const nprs        = gv('cx-nprs');

  // Síntomas marcados
  const selSymptoms = _getCervicalSelectedSymptoms();
  const symptomLabels = (typeof CERVICAL_SYMPTOMS !== 'undefined' ? CERVICAL_SYMPTOMS : [])
    .filter(s => selSymptoms.includes(s.id)).map(s => s.label);

  // ROM rows
  const romRows = CERVICAL_ROM.map(r => {
    const act = gv(`cx-rom-${r.id}-act`);
    const pas = gv(`cx-rom-${r.id}-pas`);
    if (!act && !pas) return null;
    return { label: r.label, ref: r.ref, mdc: r.mdc, act, pas };
  }).filter(Boolean);

  // CFRT
  const cfrtD = gv('cfrt-d'); const cfrtI = gv('cfrt-i');
  const cfrtRes = gt('cfrt-result');

  // Tests
  const allTestDefs = [
    ...(typeof CERVICAL_TESTS_RADICULAR   !== 'undefined' ? CERVICAL_TESTS_RADICULAR   : []),
    ...(typeof CERVICAL_TESTS_HEADACHE    !== 'undefined' ? CERVICAL_TESTS_HEADACHE    : []),
    ...(typeof CERVICAL_TESTS_ESTABILIDAD !== 'undefined' ? CERVICAL_TESTS_ESTABILIDAD : []),
    ...(typeof CERVICAL_TESTS_MIELOPATIA  !== 'undefined' ? CERVICAL_TESTS_MIELOPATIA  : []),
  ];
  const tests = [];
  allTestDefs.forEach(test => {
    const card = document.querySelector(`[data-test-id="${test.id}"]`);
    if (!card) return;
    const cols = card.querySelectorAll('.cx-test-col');
    let dR = null, iR = null, evaD = '—', evaI = '—';
    cols.forEach((col, idx) => {
      const r = col.querySelector('.ot-btn.pos') ? 'POS' : (col.querySelector('.ot-btn.neg') ? 'NEG' : null);
      const s = col.querySelector('.eva-slider');
      if (idx === 0) { dR = r; evaD = s?.value || '—'; }
      else           { iR = r; evaI = s?.value || '—'; }
    });
    if (dR || iR) tests.push({ name: test.name, sub: test.sub, dR, iR, evaD, evaI });
  });

  // Motor
  const ccftText = (() => {
    const levels = [22,24,26,28,30];
    const firstFail = levels.find(l => ccftState[l] === 'fail');
    const maxOK = levels.filter(l => ccftState[l]==='ok').reduce((a,b)=>Math.max(a,b), 0);
    if (!Object.keys(ccftState).length) return '—';
    return firstFail ? `Falla en ${firstFail} mmHg (máx OK: ${maxOK} mmHg)` : `Aprobó hasta ${maxOK} mmHg`;
  })();
  const nfeT = gv('cx-nfe-tiempo'); const nfeSexo = gv('cx-nfe-sexo');
  const nfeNorm = nfeSexo?.includes('asculino') ? 39 : 29;
  const nfeText = nfeT ? `${nfeT}s (ref ≥${nfeNorm}s) — ${+nfeT >= nfeNorm ? '✓ Normal' : '⚠️ Déficit'}` : '—';

  // Myotomas
  const myoRows = (typeof CX_MYOTOMAS !== 'undefined' ? CX_MYOTOMAS : []).map(m => {
    const d = gv(`${m.id}-d`); const i = gv(`${m.id}-i`);
    return { nivel: m.nivel, mov: m.mov, d: d||'—', i: i||'—', asym: d && i && d !== i };
  });

  // Reflejos
  const refRows = (typeof CX_REFLEJOS !== 'undefined' ? CX_REFLEJOS : []).map(r => {
    const getRef = (id, side) => {
      const card = document.getElementById(id);
      const btns = card?.closest('div')?.querySelectorAll(`.ot-btn.btn-neon, .ot-btn.btn-danger`);
      // Find active button in correct side
      return '—';
    };
    return { nombre: r.nombre, nivel: r.nivel };
  });

  // Escalas
  const ndiScore = gt('ndi-total');
  const psfsRes  = gt('cx-psfs-result');

  // EBM diagnosis
  const positivos = _getCervicalModalPositivos();
  const dxResult  = (typeof diagnosticarCervical === 'function') ? diagnosticarCervical(positivos, selSymptoms) : { diagnosticos: [] };

  // ── CSS ──
  const css = `
    body{font-family:Inter,Arial,sans-serif;margin:0;background:#fff;color:#1a1a1a;font-size:12px;line-height:1.5}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#2a4a7f;color:#fff;padding:6px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    td{padding:5px 8px;border-bottom:1px solid #ddeaf8}
    tr:nth-child(even) td{background:#f0f5fd}
    .pos{color:#2d7a2d;font-weight:700} .neg{color:#888}
    .alerta{color:#cc3333;font-weight:700} .limite{color:#c65a00;font-weight:700} .ok{color:#2d7a2d;font-weight:700}
    .asym{color:#cc3333;font-weight:700}
    .sec-badge{display:inline-block;background:#2a4a7f;color:#fff;font-size:9px;font-weight:900;padding:2px 9px;border-radius:3px;letter-spacing:1px;margin-right:8px}
    .sec-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#1a2e5e}
    .sec-head{display:flex;align-items:center;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid #ddeaf8}
    .intro-box{font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f0f5fd;border-radius:5px;border-left:3px solid #2a4a7f}
    .dx-card{padding:10px;border:1px solid #ddeaf8;border-radius:6px;margin-bottom:8px}
    .dx-nprp{border-color:#cc3333;background:#fff8f8}
    .dx-npha{border-color:#b87a00;background:#fffbf0}
    .dx-npmci{border-color:#b05a00;background:#fff8f0}
    .dx-npmd{border-color:#2d7a2d;background:#f0fff4}
    .dx-miel{border-color:#cc3333;background:#fff0f0}
    @media print{.no-print{display:none!important}header{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  `;

  const _sec = (num, title) => `
    <div class="sec-head">
      <span class="sec-badge">${num}</span>
      <span class="sec-title">${title}</span>
    </div>`;

  const sec01 = `
    ${_sec('01','Perfil del paciente')}
    <div class="intro-box">Datos de identificación y contexto clínico registrados al inicio de la evaluación cervical.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#f0f5fd;border-radius:6px;padding:12px;border:1px solid #ddeaf8">
        <div style="font-size:9px;text-transform:uppercase;color:#2a4a7f;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos del Paciente</div>
        ${nombre ? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Nombre:</span> <strong>${nombre}</strong></div>` : ''}
        ${edad   ? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Edad:</span> ${edad} años${sexo?' · '+sexo:''}</div>` : ''}
        ${deporte? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Deporte:</span> ${deporte}</div>` : ''}
        ${lesionMC?`<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Motivo:</span> ${lesionMC}</div>` : ''}
        <div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Fecha:</span> ${fecha}</div>
      </div>
      <div style="background:#f0f5fd;border-radius:6px;padding:12px;border:1px solid #ddeaf8">
        <div style="font-size:9px;text-transform:uppercase;color:#2a4a7f;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos Cervicales</div>
        <div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Evolución:</span> ${tiempo}</div>
        <div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Mecanismo:</span> ${mecanismo}</div>
        <div style="margin-bottom:4px"><span style="font-size:10px;color:#888">NPRS:</span> ${nprs}/10</div>
        ${clasif ? `<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Clasificación:</span> <strong>${clasifLabel[clasif]||clasif}</strong></div>` : ''}
      </div>
    </div>`;

  const sec02 = symptomLabels.length ? `
    ${_sec('02','Presentación clínica reportada')}
    <div class="intro-box">Síntomas referidos por el paciente durante la anamnesis, organizados por región anatómica. Orientan el pre-diagnóstico diferencial antes de los tests ortopédicos.</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
      ${symptomLabels.map(l => `<span style="background:#f0f5fd;border:1px solid #a0c0f0;border-radius:4px;padding:4px 10px;font-size:10px;color:#1a2e5e">${l}</span>`).join('')}
    </div>` : '';

  const sec03 = romRows.length ? `
    ${_sec('03','Análisis de rango de movimiento (ROM)')}
    <div class="intro-box">Medición del ROM cervical activo y pasivo con goniómetro o inclinómetro. MDC rotación: 7–10° · MDC flex/ext: 8–12°. Valores bajo referencia o asimetrías >10° son clínicamente relevantes. ICC CROM: 0.74–0.98. Referencia: Blanpied 2017 / Prushansky 2008.</div>
    <table>
      <tr><th>Movimiento</th><th>Referencia</th><th>MDC</th><th>Activo</th><th>Pasivo</th></tr>
      ${romRows.map(r => `<tr>
        <td><strong>${r.label}</strong></td><td style="color:#888">${r.ref}</td><td style="color:#888">${r.mdc}</td>
        <td>${r.act?r.act+'°':'—'}</td><td>${r.pas?r.pas+'°':'—'}</td>
      </tr>`).join('')}
    </table>
    ${(cfrtD || cfrtI) ? `
    <div style="margin-top:8px;padding:8px;background:#f8f8f0;border:1px solid #e0d8a0;border-radius:5px">
      <strong style="font-size:10px">CFRT:</strong> <span style="font-size:10px">D: ${cfrtD||'—'}° · I: ${cfrtI||'—'}° — ${cfrtRes}</span>
    </div>` : ''}` : '';

  const posTests = tests.filter(t => t.dR==='POS' || t.iR==='POS');
  const negTests = tests.filter(t => (t.dR==='NEG'||t.iR==='NEG') && t.dR!=='POS' && t.iR!=='POS');
  const sec04 = tests.length ? `
    ${_sec('04','Mapeo ortopédico de provocación')}
    <div class="intro-box">Tests estandarizados para reproducir síntomas cervicales de forma controlada. POSITIVO = reproduce el dolor o respuesta anormal. NEGATIVO = reduce probabilidad de compromiso de esa estructura. EVA registra la intensidad del dolor reproducido (0–10). Fuentes: Blanpied CPG 2017, Lin et al. 2025, Thoomes et al. 2026.</div>
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

  const sec05 = `
    ${_sec('05','Evaluación neuromuscular y motor')}
    <div class="intro-box">Evaluación de los flexores cervicales profundos (CCFT), endurance (NFE), myotomas C4–T1 y reflejos osteotendinosos. El CCFT es el gold standard para detectar disfunción neuromuscular en dolor cervical (Blomgren 2018). NFE normal: >39 s varones / >29 s mujeres.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div style="background:#f0f5fd;border-radius:6px;padding:10px;border:1px solid #ddeaf8;text-align:center">
        <div style="font-size:9px;text-transform:uppercase;color:#2a4a7f;font-weight:700;margin-bottom:4px">CCFT</div>
        <div style="font-size:14px;font-weight:900;color:#2a4a7f">${ccftText}</div>
      </div>
      <div style="background:#f0f5fd;border-radius:6px;padding:10px;border:1px solid #ddeaf8;text-align:center">
        <div style="font-size:9px;text-transform:uppercase;color:#2a4a7f;font-weight:700;margin-bottom:4px">NFE</div>
        <div style="font-size:13px;font-weight:700;color:#2a4a7f">${nfeText}</div>
      </div>
    </div>
    ${myoRows.length ? `
    <table>
      <tr><th>Nivel</th><th>Movimiento</th><th>D</th><th>I</th><th>Asimetría</th></tr>
      ${myoRows.map(m=>`<tr>
        <td style="font-family:monospace;font-weight:700;color:#2a4a7f">${m.nivel}</td>
        <td>${m.mov}</td><td>${m.d}</td><td>${m.i}</td>
        <td class="${m.asym?'asym':''}">${m.asym?'⚠️ Asimetría':'—'}</td>
      </tr>`).join('')}
    </table>` : ''}`;

  const sec06 = (ndiScore && ndiScore !== '—') ? `
    ${_sec('06','Escalas funcionales')}
    <div class="intro-box">El NDI (Neck Disability Index) es el gold standard para medir discapacidad cervical (Blanpied 2017 Rec. A). MCID = 7.5 pts · MDC = 5 pts · ICC 0.90. El PSFS evalúa actividades limitadas específicas del paciente (MCID 2 pts, mayor sensibilidad al cambio que NDI).</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#f0f5fd;border-radius:6px;padding:10px;border:1px solid #ddeaf8;text-align:center">
        <div style="font-size:9px;text-transform:uppercase;color:#2a4a7f;font-weight:700;margin-bottom:4px">NDI Total (0–50)</div>
        <div style="font-size:22px;font-weight:900;color:#2a4a7f">${ndiScore}</div>
        <div style="font-size:10px;color:#888;margin-top:4px">MCID 7.5 pts · ${+ndiScore<=4?'Sin discapacidad':+ndiScore<=14?'Discapacidad leve':+ndiScore<=24?'Discapacidad moderada':'Discapacidad severa'}</div>
      </div>
      <div style="background:#f0f5fd;border-radius:6px;padding:10px;border:1px solid #ddeaf8">
        <div style="font-size:9px;text-transform:uppercase;color:#2a4a7f;font-weight:700;margin-bottom:4px">PSFS</div>
        <div style="font-size:11px;color:#2a4a7f">${psfsRes || '—'}</div>
        <div style="font-size:9px;color:#888;margin-top:4px">MCID 2 pts promedio</div>
      </div>
    </div>` : '';

  const sec07 = dxResult.diagnosticos.length ? `
    ${_sec('07','Diagnóstico diferencial — CPG 2017')}
    <div class="intro-box">Motor de inferencia EBM basado en CPG Blanpied 2017 (JOSPT) + meta-análisis recientes. Pondera tests ortopédicos (55%), tests de apoyo (15%) y presentación clínica (30%) para calcular probabilidad diagnóstica. Mielopatía siempre prioridad si hay 1 test UMN positivo.</div>
    ${dxResult.diagnosticos.map((dx, i) => {
      const colorMap = { red:'#cc3333', neon:'#2d7a2d', amber:'#b87a00', orange:'#b05a00' };
      const c = colorMap[dx.colorKey] || '#2a4a7f';
      const cls = `dx-${dx.id === 'mielopatia-cx' ? 'miel' : dx.categoria.toLowerCase()}`;
      const allTests2 = [
        ...(typeof CERVICAL_TESTS_RADICULAR   !== 'undefined' ? CERVICAL_TESTS_RADICULAR   : []),
        ...(typeof CERVICAL_TESTS_HEADACHE    !== 'undefined' ? CERVICAL_TESTS_HEADACHE    : []),
        ...(typeof CERVICAL_TESTS_ESTABILIDAD !== 'undefined' ? CERVICAL_TESTS_ESTABILIDAD : []),
        ...(typeof CERVICAL_TESTS_MIELOPATIA  !== 'undefined' ? CERVICAL_TESTS_MIELOPATIA  : []),
      ];
      const nm = id => (allTests2.find(t => t.id === id)?.name || id);
      const ns = id => ((typeof CERVICAL_SYMPTOMS !== 'undefined' ? CERVICAL_SYMPTOMS : []).find(s => s.id === id)?.label || id);
      return `
      <div class="dx-card ${cls}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
          <div>
            <span style="font-size:12px;font-weight:800;color:${c}">${i===0&&dx.id!=='mielopatia-cx'?'🏆 ':''}${dx.id==='mielopatia-cx'?'🚨 ':''}${dx.nombre}</span>
            <span style="font-size:9px;background:#ddeaf8;color:#2a4a7f;padding:1px 6px;border-radius:3px;margin-left:6px">${dx.categoria}</span>
          </div>
          <span style="font-size:10px;font-weight:700;color:${c}">${dx.confianzaLabel}</span>
        </div>
        <div style="font-size:9px;color:#888;margin-bottom:4px">Basado en: ${dx.source} · ${dx.bySymptomOnly?'Sospecha clínica':'Confirmado por tests'}</div>
        <div style="font-size:10px;color:#444;line-height:1.4;margin-bottom:6px">${dx.criterio}</div>
        ${dx.mainHits.length||dx.supportHits.length||dx.symptomHits.length ? `
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
          ${dx.mainHits.map(t=>`<span style="background:#ffd0d0;color:#cc3333;padding:2px 6px;border-radius:3px;font-size:9px">✚ ${nm(t)}</span>`).join('')}
          ${dx.supportHits.map(t=>`<span style="background:#fff3cd;color:#b87a00;padding:2px 6px;border-radius:3px;font-size:9px">+ ${nm(t)}</span>`).join('')}
          ${dx.symptomHits.map(s=>`<span style="background:#ddeaf8;color:#2a4a7f;padding:2px 6px;border-radius:3px;font-size:9px">Sx: ${ns(s)}</span>`).join('')}
        </div>` : ''}
        <div style="font-size:10px;line-height:1.4;color:#1a1a1a;padding-top:4px;border-top:1px solid #e8e8e8"><strong>Tratamiento CPG:</strong> ${dx.tratamiento.replace(/\n/g,' · ')}</div>
        <div style="font-size:9px;color:#888;margin-top:4px;font-style:italic">${dx.ref}</div>
      </div>`;
    }).join('')}` : '';

  // Build window
  const win = window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
  <title>Informe Cervical — ${nombre}</title>
  <style>${css}</style></head><body>
  <div style="max-width:900px;margin:0 auto;padding:24px">
    <div style="text-align:center;border-bottom:3px solid #2a4a7f;margin-bottom:24px;padding-bottom:16px">
      <div style="font-size:24px;font-weight:900;letter-spacing:2px;color:#2a4a7f">🦴 INFORME CERVICAL</div>
      <div style="font-size:11px;color:#888;margin-top:4px">MoveMetrics · Evaluación EBM · CPG 2017 · ${fecha}</div>
    </div>
    ${sec01}${sec02}${sec03}${sec04}${sec05}${sec06}${sec07}
    <div style="margin-top:24px;padding-top:12px;border-top:1px solid #ddeaf8;font-size:9px;color:#aaa;text-align:center">
      CPG Blanpied et al. JOSPT 2017 · Lin et al. Am J PMR 2025 · Thoomes et al. BMC MSK 2026 · Rubio-Ochoa et al. Manual Therapy 2015 · Blomgren et al. BMC MSK 2018 · No reemplaza el juicio clínico
    </div>
    <div class="no-print" style="text-align:center;margin-top:20px">
      <button onclick="window.print()" style="background:#2a4a7f;color:#fff;border:none;padding:10px 24px;border-radius:6px;font-size:13px;cursor:pointer">🖨️ Imprimir / Guardar PDF</button>
    </div>
  </div>
  </body></html>`);
  win.document.close();
}

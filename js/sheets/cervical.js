// sheets/cervical.js — ROM, tests, CFRT, CCFT, NFE, myotomas, reflejos, NDI, PSFS
// ══════════════════════════════════════════════════════
//  CERVICAL SHEET
// ══════════════════════════════════════════════════════

let cxNdiVals = new Array(10).fill(null);
let cxPsfsVals = [null, null, null];
const ccftState = {};

function showCXTab(tab, btn) {
  ['obs','rom','tests','motor','esc'].forEach(t => {
    const el = document.getElementById('cxtab-' + t); if(el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-cervical .btn').forEach(b => b.classList.remove('btn-neon'));
  if(btn) btn.classList.add('btn-neon');
}

function initCervicalSheet() {
  buildCXROM();
  buildCXTests();
  buildCXMyotomas();
  buildCXReflejos();
  buildNDI();
  buildCXPSFS();
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
    <div class="card mb-8">
      <div class="card-header"><h3>${t.name}</h3><span class="tag ${t.tag}" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:8px">${t.ref}</div>
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
          <div><div class="il mb-4">I</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
        </div>
        <div class="ig mt-8"><label class="il">EVA / NRS D</label><input type="range" class="eva-slider" min="0" max="10" value="0" oninput="this.nextElementSibling.textContent=this.value"><span style="font-family:var(--mono);font-size:14px;display:block;text-align:center">0</span></div>
      </div>
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
  const opts = ['5/5','4+','4/5','4-','3/5','2/5','1/5','0/5'].map(v=>`<option>${v}</option>`).join('');
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
            <button class="ot-btn" style="font-size:9px;padding:3px 6px" onclick="toggleOT(this,'hiper')">↑ Hiper</button>
            <button class="ot-btn btn-neon" style="font-size:9px;padding:3px 6px" onclick="toggleOT(this,'norm')">= Norm</button>
            <button class="ot-btn" style="font-size:9px;padding:3px 6px" onclick="toggleOT(this,'hipo')">↓ Hipo</button>
          </div>
        </div>
        <div>
          <div style="font-size:9px;color:var(--text3);margin-bottom:4px;text-align:center">IZQUIERDA</div>
          <div style="display:flex;gap:3px;justify-content:center">
            <button class="ot-btn" style="font-size:9px;padding:3px 6px" onclick="toggleOT(this,'hiper')">↑ Hiper</button>
            <button class="ot-btn btn-neon" style="font-size:9px;padding:3px 6px" onclick="toggleOT(this,'norm')">= Norm</button>
            <button class="ot-btn" style="font-size:9px;padding:3px 6px" onclick="toggleOT(this,'hipo')">↓ Hipo</button>
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

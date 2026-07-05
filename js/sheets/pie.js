// sheets/pie.js v1
// Tabs: Observación | Tests | Fuerza·ROM | Escalas | Informe
// Evidencia: Koc JOSPT CPG 2023 · Nweke 2025 · Tien et al. 2026 · Ettinger 2025 · ACR 2025

// ── TAB SWITCHER ──────────────────────────────────────────────────────────────
function showPTab(tab, btn) {
  ['obs','tests','fuerza','escalas','pinforme'].forEach(t => {
    const el = document.getElementById('ptab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-pie .btn').forEach(b => {
    if (b.id && b.id.startsWith('ptab-')) {
      b.className = 'btn btn-ghost btn-sm';
      b.style.whiteSpace = 'nowrap';
      b.style.fontSize = '10px';
    }
  });
  if (btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace = 'nowrap'; btn.style.fontSize = '10px'; }
}

// ── HELPER: collect positive tests from a container ──────────────────────────
function _pie_getPosTests(containerId) {
  const c = document.getElementById(containerId); if (!c) return [];
  const results = [];
  c.querySelectorAll('.ot-btn.pos').forEach(btn => {
    const card = btn.closest('.card');
    const name = card?.querySelector('h3')?.textContent || '';
    if (name && !results.includes(name)) results.push(name);
  });
  return results;
}

// ── BUILD: OBSERVACIÓN ────────────────────────────────────────────────────────
function buildPieObs() {
  const el = document.getElementById('pie-obs-fields');
  if (!el || el.innerHTML) return;
  el.innerHTML = `
    <div class="grid-2" style="gap:12px">
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Datos Clínicos</div>
        <div class="ig"><label class="il">Pie afectado</label>
          <select class="inp" id="pie-lado">
            <option value="">— seleccionar —</option>
            <option>Derecho</option><option>Izquierdo</option><option>Bilateral</option>
          </select>
        </div>
        <div class="ig"><label class="il">Tiempo evolución</label>
          <select class="inp" id="pie-evolucion">
            <option value="">— seleccionar —</option>
            <option>&lt;6 semanas (agudo)</option>
            <option>6–12 semanas (subagudo)</option>
            <option>&gt;3 meses (crónico)</option>
            <option>&gt;6 meses (crónico persistente)</option>
          </select>
        </div>
        <div class="ig"><label class="il">Tipo de dolor</label>
          <select class="inp" id="pie-tipo-dolor">
            <option value="">— seleccionar —</option>
            <option>Talón medial (plantar)</option>
            <option>Talón posterior (Aquiles)</option>
            <option>Antepié / metatarsos</option>
            <option>Hallux / 1° MTF</option>
            <option>Arco plantar</option>
            <option>Difuso / generalizado</option>
          </select>
        </div>
        <div class="ig"><label class="il">Actividad desencadenante</label>
          <select class="inp" id="pie-actividad">
            <option value="">— seleccionar —</option>
            <option>Deportiva (running/salto)</option>
            <option>Laboral (bipedestación prolongada)</option>
            <option>Sedentario</option>
            <option>Sin factor claro</option>
          </select>
        </div>
        <div class="ig"><label class="il">NRS dolor actual (0–10)</label>
          <input class="inp inp-mono" id="pie-nrs" type="number" min="0" max="10" placeholder="0–10">
        </div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Factores de Riesgo</div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:12px">
          <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="pfr-imc"> IMC elevado (&gt;30 kg/m²)</label>
          <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="pfr-running"> Corredor / atleta</label>
          <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="pfr-bipedestacion"> Trabajo en bipedestación &gt;8 h/día</label>
          <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="pfr-calzado"> Calzado inadecuado / sin soporte</label>
          <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="pfr-planopies"> Pie plano (pes planus)</label>
          <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="pfr-cavus"> Pie cavo (pes cavus)</label>
          <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="pfr-hf"> Historia familiar HV (madre/abuela)</label>
        </div>
        <div style="font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin:14px 0 8px">Observación</div>
        <div class="ig"><label class="il">Tipo de arco</label>
          <select class="inp" id="pie-arco">
            <option value="">— seleccionar —</option>
            <option>Normal</option><option>Plano (pes planus)</option><option>Cavo (pes cavus)</option>
          </select>
        </div>
        <div class="ig"><label class="il">Marcha / gait</label>
          <select class="inp" id="pie-marcha">
            <option value="">— seleccionar —</option>
            <option>Normal</option><option>Antálgica</option><option>Pronada excesiva</option><option>Supinada</option>
          </select>
        </div>
        <div class="ig"><label class="il">Calzado actual</label>
          <input class="inp" id="pie-calzado" type="text" placeholder="ej. zapatillas running, taco alto...">
        </div>
      </div>
    </div>`;
}

// ── BUILD: TESTS ──────────────────────────────────────────────────────────────
function buildPieFascitisPlantar() {
  const el = document.getElementById('pie-fascitis-tests');
  if (!el || el.innerHTML) return;
  const tests = typeof PIE_FASCITIS_TESTS !== 'undefined' ? PIE_FASCITIS_TESTS : [];
  el.innerHTML = tests.map(t => `
    <div class="card" style="margin-bottom:10px">
      <div class="card-body" style="padding:10px">
        <h3 style="font-size:12px;margin-bottom:4px">${t.name}</h3>
        <div style="font-size:10px;color:var(--text2);margin-bottom:6px">${t.sub}</div>
        <div style="font-size:9px;color:var(--text3);margin-bottom:8px;font-style:italic">${t.ref}</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm ot-btn" onclick="toggleOT(this,'pos')" style="font-size:10px;padding:3px 10px">+ Pos</button>
          <button class="btn btn-ghost btn-sm ot-btn" onclick="toggleOT(this,'neg')" style="font-size:10px;padding:3px 10px">− Neg</button>
        </div>
      </div>
    </div>`).join('');
}

function buildPieHallux() {
  const el = document.getElementById('pie-hallux-tests');
  if (!el || el.innerHTML) return;
  const tests = typeof PIE_HALLUX_TESTS !== 'undefined' ? PIE_HALLUX_TESTS : [];
  el.innerHTML = tests.map(t => `
    <div class="card" style="margin-bottom:10px">
      <div class="card-body" style="padding:10px">
        <h3 style="font-size:12px;margin-bottom:4px">${t.name}</h3>
        <div style="font-size:10px;color:var(--text2);margin-bottom:6px">${t.sub}</div>
        <div style="font-size:9px;color:var(--text3);margin-bottom:8px;font-style:italic">${t.ref}</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm ot-btn" onclick="toggleOT(this,'pos')" style="font-size:10px;padding:3px 10px">+ Pos</button>
          <button class="btn btn-ghost btn-sm ot-btn" onclick="toggleOT(this,'neg')" style="font-size:10px;padding:3px 10px">− Neg</button>
        </div>
      </div>
    </div>`).join('');
}

// ── BUILD: FUERZA · ROM ───────────────────────────────────────────────────────
function buildPieFuerzaROM() {
  const el = document.getElementById('pie-fuerza-fields');
  if (!el || el.innerHTML) return;
  el.innerHTML = `
    <div class="grid-2" style="gap:12px">
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">ROM Tobillo (°)</div>
        <div class="ig"><label class="il">Dorsiflexión D (NWB)</label>
          <input class="inp inp-mono" id="pie-df-d" type="number" placeholder="≥10°">
        </div>
        <div class="ig"><label class="il">Dorsiflexión I (NWB)</label>
          <input class="inp inp-mono" id="pie-df-i" type="number" placeholder="≥10°">
        </div>
        <div class="ig"><label class="il">Dorsiflexión D (Lunge)</label>
          <input class="inp inp-mono" id="pie-lunge-d" type="number" placeholder="cm talón-pared">
        </div>
        <div class="ig"><label class="il">Dorsiflexión I (Lunge)</label>
          <input class="inp inp-mono" id="pie-lunge-i" type="number" placeholder="cm talón-pared">
        </div>
        <div style="font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin:14px 0 8px">ROM 1° MTF (°)</div>
        <div class="ig"><label class="il">Dorsiflexión D</label>
          <input class="inp inp-mono" id="pie-mtf-df-d" type="number" placeholder="Normal 70°">
        </div>
        <div class="ig"><label class="il">Dorsiflexión I</label>
          <input class="inp inp-mono" id="pie-mtf-df-i" type="number" placeholder="Normal 70°">
        </div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Fuerza Funcional</div>
        <div class="card" style="margin-bottom:10px">
          <div class="card-body" style="padding:10px">
            <h3 style="font-size:12px;margin-bottom:4px">Heel Raise Unipodal</h3>
            <div style="font-size:10px;color:var(--text2);margin-bottom:6px">Elevaciones talón en unipodal hasta fatiga o dolor. Normal: ≥25 repeticiones. Test gastrosoleo</div>
            <div style="font-size:9px;color:var(--text3);margin-bottom:8px;font-style:italic">Koc JOSPT CPG 2023 — test funcional músculo gastrocnemio/sóleo</div>
            <div class="grid-2" style="gap:8px">
              <div><label class="il" style="font-size:10px">Rep D</label><input class="inp inp-mono" id="pie-heel-raise-d" type="number" placeholder="reps" style="margin-top:4px"></div>
              <div><label class="il" style="font-size:10px">Rep I</label><input class="inp inp-mono" id="pie-heel-raise-i" type="number" placeholder="reps" style="margin-top:4px"></div>
            </div>
          </div>
        </div>
        <div class="card" style="margin-bottom:10px">
          <div class="card-body" style="padding:10px">
            <h3 style="font-size:12px;margin-bottom:4px">Navicular Drop Test</h3>
            <div style="font-size:10px;color:var(--text2);margin-bottom:6px">Diferencia altura navicular sentado vs bipedestación. Pronación excesiva: >10 mm. Evalúa control arco medial</div>
            <div style="font-size:9px;color:var(--text3);margin-bottom:8px;font-style:italic">Correlacionado con fascitis plantar y dolor mediopié — Koc JOSPT CPG 2023</div>
            <div class="grid-2" style="gap:8px">
              <div><label class="il" style="font-size:10px">Drop D (mm)</label><input class="inp inp-mono" id="pie-nav-drop-d" type="number" placeholder="mm" style="margin-top:4px"></div>
              <div><label class="il" style="font-size:10px">Drop I (mm)</label><input class="inp inp-mono" id="pie-nav-drop-i" type="number" placeholder="mm" style="margin-top:4px"></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body" style="padding:10px">
            <h3 style="font-size:12px;margin-bottom:4px">Grosor fascia plantar (ECO)</h3>
            <div style="font-size:10px;color:var(--text2);margin-bottom:6px">Normal: &lt;4 mm. Engrosamiento ≥4 mm compatible con fascitis plantar en ecografía diagnóstica</div>
            <div style="font-size:9px;color:var(--text3);margin-bottom:8px;font-style:italic">Koc JOSPT CPG 2023; Tien 2026 — criterio ecográfico estándar</div>
            <div class="grid-2" style="gap:8px">
              <div><label class="il" style="font-size:10px">Grosor D (mm)</label><input class="inp inp-mono" id="pie-fascia-d" type="number" step="0.1" placeholder="mm" style="margin-top:4px"></div>
              <div><label class="il" style="font-size:10px">Grosor I (mm)</label><input class="inp inp-mono" id="pie-fascia-i" type="number" step="0.1" placeholder="mm" style="margin-top:4px"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// ── BUILD: ESCALAS ────────────────────────────────────────────────────────────
// FAAM-ADL (Foot and Ankle Ability Measure — Activities of Daily Living)
// 21 ítems, escala 4 (sin dificultad) a 0 (incapaz); Ítem sin actividad = omitir
// Score = (suma / 84) × 100
const PIE_FAAM_ITEMS = [
  'Estar de pie','Caminar en superficies planas','Caminar descalzo en superficies planas',
  'Subir escalones','Bajar escalones','Pararse de puntillas','Caminar en superficies irregulares',
  'Subir y bajar aceras','Agacharse','Caminar en superficies inclinadas (arriba)',
  'Caminar en superficies inclinadas (abajo)','Caminar en superficies irregulares inicialmente',
  'Subir y bajar escaleras de mano','Caminar por períodos prolongados (>15 min)',
  'Trabajo doméstico','Actividades de la vida diaria','Cuidado personal',
  'Trabajo liviano a moderado (estar de pie, caminar)','Trabajo pesado (empujar, cargar, subir)',
  'Actividades recreativas','Tareas con demandas físicas moderadas'
];
let pieFaamVals = new Array(21).fill(null);

function buildPieEscalas() {
  const el = document.getElementById('pie-escalas-fields');
  if (!el || el.innerHTML) return;

  const faamHtml = PIE_FAAM_ITEMS.map((item, i) => `
    <div style="padding:6px 0;border-bottom:1px solid var(--bg4)">
      <div style="font-size:11px;margin-bottom:4px">${i+1}. ${item}</div>
      <div style="display:flex;gap:4px">
        ${[['4','Sin dificultad'],['3','Leve dificultad'],['2','Dificultad moderada'],['1','Dificultad extrema'],['0','Incapaz']].map(([v,l]) =>
          `<button class="btn btn-ghost btn-sm pie-faam-btn" data-idx="${i}" data-val="${v}" onclick="selectPieFaam(this,${i},${v})" style="font-size:9px;padding:2px 5px">${v}</button>`
        ).join('')}
        <span style="font-size:9px;color:var(--text3);margin-left:4px;align-self:center" id="pie-faam-label-${i}"></span>
      </div>
    </div>`).join('');

  el.innerHTML = `
    <div style="font-size:11px;color:var(--text2);margin-bottom:12px;padding:8px;background:var(--bg4);border-radius:8px">
      <strong>FAAM-ADL</strong> (Foot and Ankle Ability Measure — Actividades de la vida diaria)<br>
      Score 0–100. &lt;69 = discapacidad significativa. Referencia: Koc JOSPT CPG 2023
    </div>
    <div style="margin-bottom:12px">${faamHtml}</div>
    <div style="padding:10px;background:var(--verde04);border-radius:8px;font-size:12px" id="pie-faam-score-display">
      Score FAAM-ADL: <strong>—</strong>
    </div>`;
}

function selectPieFaam(btn, idx, val) {
  pieFaamVals[idx] = val;
  const labels = ['Sin dificultad','Leve dificultad','Moderada','Extrema','Incapaz'];
  document.getElementById(`pie-faam-label-${idx}`).textContent = labels[4-val] || '';
  document.querySelectorAll(`.pie-faam-btn[data-idx="${idx}"]`).forEach(b => {
    b.classList.remove('btn-neon');
    b.classList.add('btn-ghost');
  });
  btn.classList.remove('btn-ghost');
  btn.classList.add('btn-neon');
  _calcPieFAAM();
}

function _calcPieFAAM() {
  const filled = pieFaamVals.filter(v => v !== null);
  if (filled.length === 0) return null;
  const sum = filled.reduce((a, b) => a + b, 0);
  const score = Math.round((sum / (filled.length * 4)) * 100);
  const el = document.getElementById('pie-faam-score-display');
  if (el) {
    let cat = score >= 90 ? 'Mínima limitación' : score >= 70 ? 'Limitación leve' : score >= 50 ? 'Limitación moderada' : 'Discapacidad severa';
    el.innerHTML = `Score FAAM-ADL: <strong>${score}/100</strong> — ${cat} (${filled.length}/21 ítems respondidos)`;
  }
  return score;
}

// ── GENERAR INFORME ───────────────────────────────────────────────────────────
function generarInformePie() {
  const container = document.getElementById('pie-informe-container');
  if (!container) return;

  // Collect positive tests
  const fascitisPos = _pie_getPosTests('pie-fascitis-tests');
  const halluxPos = _pie_getPosTests('pie-hallux-tests');
  const allPos = [...fascitisPos, ...halluxPos];

  // Scores
  const nrs = parseInt(document.getElementById('pie-nrs')?.value) || null;
  const faamScore = _calcPieFAAM();
  const dfD = parseFloat(document.getElementById('pie-df-d')?.value) || null;
  const dfI = parseFloat(document.getElementById('pie-df-i')?.value) || null;
  const lungeD = parseFloat(document.getElementById('pie-lunge-d')?.value) || null;
  const lungeI = parseFloat(document.getElementById('pie-lunge-i')?.value) || null;
  const navD = parseFloat(document.getElementById('pie-nav-drop-d')?.value) || null;
  const navI = parseFloat(document.getElementById('pie-nav-drop-i')?.value) || null;
  const fasciaD = parseFloat(document.getElementById('pie-fascia-d')?.value) || null;
  const fasciaI = parseFloat(document.getElementById('pie-fascia-i')?.value) || null;
  const heelRaiseD = parseInt(document.getElementById('pie-heel-raise-d')?.value) || null;
  const heelRaiseI = parseInt(document.getElementById('pie-heel-raise-i')?.value) || null;
  const lado = document.getElementById('pie-lado')?.value || '';
  const evolucion = document.getElementById('pie-evolucion')?.value || '';

  // Diagnostic rules
  const reglas = typeof PIE_REGLAS !== 'undefined' ? PIE_REGLAS : [];
  const diagnoses = [];

  for (const regla of reglas) {
    const posMatch = allPos.filter(t => regla.criterios.some(c => t.toLowerCase().includes(c.toLowerCase())));
    if (posMatch.length >= regla.minPos) {
      diagnoses.push(regla);
    }
  }

  // Check heel squeeze → fractura estrés (override if hallux squeeze pos)
  const heelSqueezePos = fascitisPos.some(t => t.includes('Heel Squeeze') || t.includes('squeeze'));
  if (heelSqueezePos && !diagnoses.some(d => d.id === 'fractura-estres-calcaneo')) {
    const fr = reglas.find(r => r.id === 'fractura-estres-calcaneo');
    if (fr) diagnoses.unshift(fr);
  }

  // Build imbalances / findings
  const hallazgos = [];
  if (dfD !== null && dfD < 10) hallazgos.push(`Déficit dorsiflexión D: ${dfD}° (<10° — factor de riesgo FP)`);
  if (dfI !== null && dfI < 10) hallazgos.push(`Déficit dorsiflexión I: ${dfI}° (<10° — factor de riesgo FP)`);
  if (lungeD !== null && lungeD < 4) hallazgos.push(`Lunge test D: ${lungeD} cm (<4 cm — déficit significativo)`);
  if (lungeI !== null && lungeI < 4) hallazgos.push(`Lunge test I: ${lungeI} cm (<4 cm — déficit significativo)`);
  if (navD !== null && navD > 10) hallazgos.push(`Navicular drop D: ${navD} mm (>10 mm — pronación excesiva)`);
  if (navI !== null && navI > 10) hallazgos.push(`Navicular drop I: ${navI} mm (>10 mm — pronación excesiva)`);
  if (fasciaD !== null && fasciaD >= 4) hallazgos.push(`Grosor fascia D: ${fasciaD} mm (≥4 mm — engrosamiento ecográfico FP)`);
  if (fasciaI !== null && fasciaI >= 4) hallazgos.push(`Grosor fascia I: ${fasciaI} mm (≥4 mm — engrosamiento ecográfico FP)`);
  if (heelRaiseD !== null && heelRaiseD < 25) hallazgos.push(`Heel raise D: ${heelRaiseD} reps (<25 — debilidad gastrosoleo)`);
  if (heelRaiseI !== null && heelRaiseI < 25) hallazgos.push(`Heel raise I: ${heelRaiseI} reps (<25 — debilidad gastrosoleo)`);

  // Render
  let html = `<div style="font-family:var(--mono);font-size:11px;line-height:1.7">`;
  html += `<div style="font-size:14px;font-weight:700;color:var(--neon);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--verde20)">📄 INFORME EVALUACIÓN PIE / FOOT</div>`;

  // Header data
  html += `<div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:12px;font-size:11px">`;
  if (lado) html += `<div><span style="color:var(--text2)">Pie:</span> <strong>${lado}</strong></div>`;
  if (evolucion) html += `<div><span style="color:var(--text2)">Evolución:</span> <strong>${evolucion}</strong></div>`;
  if (nrs !== null && !isNaN(nrs)) html += `<div><span style="color:var(--text2)">NRS dolor:</span> <strong>${nrs}/10</strong></div>`;
  if (faamScore !== null) html += `<div><span style="color:var(--text2)">FAAM-ADL:</span> <strong>${faamScore}/100</strong></div>`;
  html += `</div>`;

  // Tests positivos
  if (allPos.length > 0) {
    html += `<div style="margin-bottom:12px"><div style="font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Tests Positivos</div>`;
    html += `<ul style="margin:0;padding-left:18px">${allPos.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
  }

  // Hallazgos mediciones
  if (hallazgos.length > 0) {
    html += `<div style="margin-bottom:12px"><div style="font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Hallazgos Funcionales</div>`;
    html += `<ul style="margin:0;padding-left:18px">${hallazgos.map(h => `<li>${h}</li>`).join('')}</ul></div>`;
  }

  // Diagnoses
  if (diagnoses.length > 0) {
    html += `<div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;color:var(--neon);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Presunto Diagnóstico</div>`;
    diagnoses.forEach((dx, i) => {
      html += `<div style="padding:10px;background:var(--verde04);border:1px solid var(--verde20);border-radius:8px;margin-bottom:10px">`;
      html += `<div style="font-weight:700;font-size:13px;margin-bottom:4px">${i+1}. ${dx.nombre}</div>`;
      html += `<div style="font-size:11px;color:var(--text2);margin-bottom:8px">${dx.descripcion}</div>`;
      html += `<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:6px;text-transform:uppercase">Plan de Tratamiento EBM:</div>`;
      dx.recom.forEach(r => {
        html += `<div style="font-size:10px;padding:4px 0;border-bottom:1px solid var(--bg4)">${r}</div>`;
      });
      html += `<div style="font-size:9px;color:var(--text3);margin-top:6px;font-style:italic">Ref: ${dx.ref}</div>`;
      html += `</div>`;
    });
  } else if (allPos.length > 0) {
    html += `<div style="padding:10px;background:var(--bg4);border-radius:8px;font-size:11px;color:var(--text2);margin-bottom:12px">Tests positivos presentes — no se cumplieron criterios mínimos para diagnóstico específico. Ampliar evaluación.</div>`;
  } else {
    html += `<div style="padding:10px;background:var(--bg4);border-radius:8px;font-size:11px;color:var(--text2);margin-bottom:12px">Sin tests positivos registrados. Complete la evaluación para generar presunto diagnóstico.</div>`;
  }

  // Footer
  html += `<div style="font-size:9px;color:var(--text3);margin-top:12px;padding-top:8px;border-top:1px solid var(--bg4)">
    Generado con MoveMetrics · Basado en: Koc JOSPT CPG 2023 · Nweke 2025 · Tien et al. Scientific Reports 2026 · Ettinger Dtsch Arztebl Int 2025 · ACR Chronic Foot Pain 2025
  </div></div>`;

  container.innerHTML = html;
  showPTab('pinforme', document.getElementById('ptab-pinforme-btn'));
}

function imprimirInformePie() {
  const content = document.getElementById('pie-informe-container')?.innerHTML;
  if (!content) { generarInformePie(); return; }
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Informe Pie</title><style>body{font-family:monospace;font-size:12px;padding:20px;color:#111}ul{margin:4px 0;padding-left:20px}div{margin-bottom:4px}</style></head><body>${content}</body></html>`);
  w.document.close(); w.print();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function initPieSheet() {
  buildPieObs();
  buildPieFascitisPlantar();
  buildPieHallux();
  buildPieFuerzaROM();
  buildPieEscalas();
  pieFaamVals = new Array(21).fill(null);
}

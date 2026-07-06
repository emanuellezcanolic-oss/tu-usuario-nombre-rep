// sheets/pie.js v4
// Tabs: Observación | Tests | Fuerza·ROM | Escalas | Informe
// Evidencia: Koc JOSPT CPG 2023 · Nweke 2025 · Tien et al. 2026 · Ettinger 2025 · ACR 2025

// ── TAB SWITCHER ──────────────────────────────────────────────────────────────
function showPTab(tab, btn) {
  // Scope dentro de #sheet-pie para evitar conflicto con ptab-fuerza del módulo F-V principal
  const sheet = document.getElementById('sheet-pie');
  ['obs','tests','fuerza','escalas','pinforme'].forEach(t => {
    const el = sheet ? sheet.querySelector('#ptab-' + t) : document.getElementById('ptab-' + t);
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
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';
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
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';
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
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';
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
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';
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
        <div style="font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin:14px 0 4px">Diferenciación Gastroc vs Sóleo</div>
        <div style="font-size:9px;color:var(--text3);margin-bottom:8px">DF rodilla extendida (NWB arriba) = gastroc+sóleo. DF rodilla 90° = sóleo solo. Si NWB ext &lt;10° y NWB flex &ge;10° → gastroc aislado. Koc JOSPT CPG 2023</div>
        <div class="ig"><label class="il">DF D (rodilla 90° flex)</label>
          <input class="inp inp-mono" id="pie-df-flex-d" type="number" placeholder="°" oninput="interpretGastrocSoleo()">
        </div>
        <div class="ig"><label class="il">DF I (rodilla 90° flex)</label>
          <input class="inp inp-mono" id="pie-df-flex-i" type="number" placeholder="°" oninput="interpretGastrocSoleo()">
        </div>
        <div id="pie-gastroc-interp" style="font-size:10px;padding:6px 8px;background:var(--bg4);border-radius:6px;margin-top:4px;display:none"></div>
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

function interpretGastrocSoleo() {
  const extD = parseFloat(document.getElementById('pie-df-d')?.value);
  const extI = parseFloat(document.getElementById('pie-df-i')?.value);
  const flexD = parseFloat(document.getElementById('pie-df-flex-d')?.value);
  const flexI = parseFloat(document.getElementById('pie-df-flex-i')?.value);
  const el = document.getElementById('pie-gastroc-interp');
  if (!el) return;
  const lines = [];
  const CUTOFF = 10;
  function classify(ext, flex, side) {
    if (isNaN(ext) || isNaN(flex)) return null;
    if (ext >= CUTOFF) return `${side}: DF normal (${ext}°) — sin restricción significativa`;
    if (ext < CUTOFF && flex >= CUTOFF) return `${side}: Restricción GASTROCNEMIO aislado (ext ${ext}° / flex ${flex}°) → estirar gastroc`;
    return `${side}: Restricción GASTROC + SÓLEO (ext ${ext}° / flex ${flex}°) → estirar ambos`;
  }
  const rD = classify(extD, flexD, 'D');
  const rI = classify(extI, flexI, 'I');
  if (rD) lines.push(rD);
  if (rI) lines.push(rI);
  if (lines.length) {
    el.style.display = 'block';
    el.innerHTML = lines.join('<br>');
  } else {
    el.style.display = 'none';
  }
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
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';

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
  // Collect positive tests
  const fascitisPos = _pie_getPosTests('pie-fascitis-tests');
  const halluxPos = _pie_getPosTests('pie-hallux-tests');
  const allPos = [...fascitisPos, ...halluxPos];

  // Scores y mediciones
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
  const dfFlexD = parseFloat(document.getElementById('pie-df-flex-d')?.value) || null;
  const dfFlexI = parseFloat(document.getElementById('pie-df-flex-i')?.value) || null;
  const heelRaiseD = parseInt(document.getElementById('pie-heel-raise-d')?.value) || null;
  const heelRaiseI = parseInt(document.getElementById('pie-heel-raise-i')?.value) || null;
  const lado = document.getElementById('pie-lado')?.value || '';
  const evolucion = document.getElementById('pie-evolucion')?.value || '';

  // Diagnóstico por reglas EBM
  const reglas = typeof PIE_REGLAS !== 'undefined' ? PIE_REGLAS : [];
  const diagnoses = [];
  for (const regla of reglas) {
    const posMatch = allPos.filter(t => regla.criterios.some(c => t.toLowerCase().includes(c.toLowerCase())));
    if (posMatch.length >= regla.minPos) diagnoses.push(regla);
  }
  const heelSqueezePos = allPos.some(t => t.includes('Heel Squeeze') || t.includes('squeeze'));
  if (heelSqueezePos && !diagnoses.some(d => d.id === 'fractura-estres-calcaneo')) {
    const fr = reglas.find(r => r.id === 'fractura-estres-calcaneo');
    if (fr) diagnoses.unshift(fr);
  }

  // Hallazgos clínicos
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
  if (dfD !== null && dfFlexD !== null && dfD < 10) {
    hallazgos.push(dfFlexD >= 10
      ? `Restricción gastroc aislado D: DF ext ${dfD}° / flex ${dfFlexD}° → estirar gastrocnemio`
      : `Restricción gastroc+sóleo D: DF ext ${dfD}° / flex ${dfFlexD}° → estirar ambos`);
  }
  if (dfI !== null && dfFlexI !== null && dfI < 10) {
    hallazgos.push(dfFlexI >= 10
      ? `Restricción gastroc aislado I: DF ext ${dfI}° / flex ${dfFlexI}° → estirar gastrocnemio`
      : `Restricción gastroc+sóleo I: DF ext ${dfI}° / flex ${dfFlexI}° → estirar ambos`);
  }

  // Datos del paciente
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

  // ── CSS ──
  const css = typeof _tmcCSS!=='undefined' ? _tmcCSS() : 'body{font-family:Arial,sans-serif;font-size:12px}table{width:100%;border-collapse:collapse}th{background:#798254;color:#fff;padding:6px}td{padding:5px;border-bottom:1px solid #ddd}';

  // ── SEC 01 — Perfil ──
  const _R = (k,v) => typeof _tmcRow!=='undefined' ? _tmcRow(k,v) : `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee;font-size:11px"><span style="color:#555">${k}</span><span style="font-weight:600">${v||'—'}</span></div>`;
  const sec01 = `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">01</span><span class="sec-title">Perfil del Atleta</span></div>
    <div class="sec-desc">Identificación del paciente, miembro afectado y contexto clínico de la consulta.</div>
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
      <div class="card-data"><div class="card-label">Contexto Clínico</div>
        ${lado?_R('Pie afectado',lado):''}
        ${evolucion?_R('Evolución',evolucion):''}
        ${nrs!==null?_R('NRS Dolor',nrs+'/10'):''}
        ${faamScore!==null?_R('FAAM-ADL',faamScore+'/100 — '+(faamScore>=90?'Mínima limitación':faamScore>=70?'Leve':faamScore>=50?'Moderada':'Severa')):''}
      </div>
    </div></div>`;

  // ── SEC 02 — ROM ──
  const hasROM = dfD||dfI||lungeD||lungeI||navD||navI||dfFlexD||dfFlexI;
  const romRadarItems = [
    (dfD||dfI)?{label:'DF Rodilla ext.',D:dfD||0,I:dfI||0,max:20,ref:10}:null,
    (lungeD||lungeI)?{label:'Lunge Test',D:lungeD||0,I:lungeI||0,max:12,ref:4}:null,
    (navD||navI)?{label:'Nav.Drop (inv)',D:navD?Math.max(0,15-navD):0,I:navI?Math.max(0,15-navI):0,max:15,ref:10}:null,
    (dfFlexD||dfFlexI)?{label:'DF Rodilla flex.',D:dfFlexD||0,I:dfFlexI||0,max:25,ref:10}:null,
  ].filter(Boolean);
  const _romRadar = (typeof _tmcRadarChart!=='undefined' && romRadarItems.length>=3)
    ? _tmcRadarChart(romRadarItems,{title:'Perfil ROM Tobillo/Pie',size:270})
    : '';
  const sec02 = hasROM ? `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">02</span><span class="sec-title">ROM y Mediciones Funcionales</span></div>
    <div class="sec-desc">Movilidad articular y tests de movilidad funcional. La dorsiflexión (DF) y el Lunge Test son los parámetros más sensibles para FP y tendinopatía. Referencia: Koc CPG JOSPT 2023 · Rathleff 2022.</div>
    <table>
      <tr><th>Medición</th><th>Referencia</th><th>D</th><th>I</th><th>Interpretación</th></tr>
      ${dfD||dfI?`<tr><td><strong>Dorsiflexión (rod. extendida)</strong></td><td>≥10°</td>
        <td class="${dfD!==null&&dfD<10?'alerta':'ok'}">${dfD!==null?dfD+'°':'—'}</td>
        <td class="${dfI!==null&&dfI<10?'alerta':'ok'}">${dfI!==null?dfI+'°':'—'}</td>
        <td style="font-size:10px">${[dfD,dfI].filter(v=>v!==null&&v<10).length?'⚠ Déficit FP (gastroc)':'✓ Normal'}</td></tr>`:''}
      ${dfFlexD||dfFlexI?`<tr><td><strong>Dorsiflexión (rod. flex.)</strong></td><td>≥10°</td>
        <td class="${dfFlexD!==null&&dfFlexD<10?'alerta':'ok'}">${dfFlexD!==null?dfFlexD+'°':'—'}</td>
        <td class="${dfFlexI!==null&&dfFlexI<10?'alerta':'ok'}">${dfFlexI!==null?dfFlexI+'°':'—'}</td>
        <td style="font-size:10px">${(dfD!==null&&dfFlexD!==null&&dfD<10)?(dfFlexD>=10?'Restricción gastroc aislado':'Gastroc+sóleo'):'—'}</td></tr>`:''}
      ${lungeD||lungeI?`<tr><td><strong>Lunge Test</strong></td><td>≥4 cm</td>
        <td class="${lungeD!==null&&lungeD<4?'alerta':'ok'}">${lungeD!==null?lungeD+' cm':'—'}</td>
        <td class="${lungeI!==null&&lungeI<4?'alerta':'ok'}">${lungeI!==null?lungeI+' cm':'—'}</td>
        <td style="font-size:10px">${[lungeD,lungeI].filter(v=>v!==null&&v<4).length?'⚠ Déficit significativo':'✓ Normal'}</td></tr>`:''}
      ${navD||navI?`<tr><td><strong>Navicular Drop</strong></td><td>≤10 mm</td>
        <td class="${navD!==null&&navD>10?'alerta':'ok'}">${navD!==null?navD+' mm':'—'}</td>
        <td class="${navI!==null&&navI>10?'alerta':'ok'}">${navI!==null?navI+' mm':'—'}</td>
        <td style="font-size:10px">${[navD,navI].filter(v=>v!==null&&v>10).length?'⚠ Pronación excesiva':'✓ Normal'}</td></tr>`:''}
    </table>${_romRadar}</div>` : '';

  // ── SEC 03 — Tests ortopédicos ──
  const fascitisTestsDef = typeof PIE_FASCITIS_TESTS!=='undefined' ? PIE_FASCITIS_TESTS : [];
  const halluxTestsDef   = typeof PIE_HALLUX_TESTS!=='undefined'   ? PIE_HALLUX_TESTS   : [];
  const allTestsWithRes = [];
  fascitisTestsDef.forEach(t => {
    const dEl = document.getElementById(`fascitis-${t.id}-d`);
    const iEl = document.getElementById(`fascitis-${t.id}-i`);
    const dR = dEl?.dataset?.val?.toUpperCase()||null;
    const iR = iEl?.dataset?.val?.toUpperCase()||null;
    if (dR||iR) allTestsWithRes.push({name:t.name,sub:t.sub||'',ref:t.ref||'',dR,iR});
  });
  halluxTestsDef.forEach(t => {
    const el = document.getElementById(`hallux-${t.id}`);
    const r = el?.dataset?.val?.toUpperCase()||null;
    if (r) allTestsWithRes.push({name:t.name,sub:t.sub||'',ref:t.ref||'',dR:r,iR:null});
  });
  const sec03 = allTestsWithRes.length ? `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">03</span><span class="sec-title">Tests Ortopédicos de Provocación</span></div>
    <div class="sec-desc">Maniobras clínicas estandarizadas para reproducir síntomas y orientar diagnóstico diferencial. POSITIVO = reproduce el dolor o genera respuesta anormal. Ref: Physio Practice 2024 · Weel BJSM 2016.</div>
    <table>
      <tr><th>Test</th><th>Referencia EBM</th><th>D</th><th>I</th></tr>
      ${allTestsWithRes.map(t=>`<tr>
        <td><strong>${t.name}</strong>${t.sub?`<br><span style="font-size:9px;color:#888">${t.sub}</span>`:''}</td>
        <td style="font-size:10px;color:#666">${t.ref||'—'}</td>
        <td class="${t.dR==='POS'?'pos':t.dR==='NEG'?'neg':''}">${t.dR==='POS'?'✚ POS':t.dR==='NEG'?'— NEG':'—'}</td>
        <td class="${t.iR==='POS'?'pos':t.iR==='NEG'?'neg':''}">${t.iR==='POS'?'✚ POS':t.iR==='NEG'?'— NEG':'—'}</td>
      </tr>`).join('')}
    </table></div>` : '';

  // ── SEC 04 — Fuerza ──
  const hasFuerza = heelRaiseD||heelRaiseI||fasciaD||fasciaI;
  const asimHR = (heelRaiseD&&heelRaiseI)?((Math.abs(heelRaiseD-heelRaiseI)/Math.max(heelRaiseD,heelRaiseI))*100).toFixed(1):null;
  const _barItems = (heelRaiseD||heelRaiseI)?[{label:'Heel Raises',D:heelRaiseD,I:heelRaiseI,unit:' reps',ref:25,asim:asimHR}]:[];
  const _fuerzaBar = (typeof _tmcBarChart!=='undefined' && _barItems.length>0)
    ? _tmcBarChart(_barItems,{title:'Perfil de Fuerza — Gastrosoleo'})
    : '';
  const sec04 = hasFuerza ? `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">04</span><span class="sec-title">Evaluaciones de Fuerza y Morfología</span></div>
    <div class="sec-desc">La fuerza del tríceps sural (gastrosoleo) es el principal factor de carga para la fascia plantar. Heel Raise ≥25 reps = normal. Grosor fascia ≥4 mm (ecografía) confirma proceso activo. Ref: Sartori 2024 · Martin JOSPT 2021.</div>
    <table>
      <tr><th>Medición</th><th>Referencia</th><th>D</th><th>I</th><th>Asimetría</th><th>Interpretación</th></tr>
      ${heelRaiseD||heelRaiseI?`<tr>
        <td><strong>Heel Raise Test</strong></td><td>≥25 reps</td>
        <td class="${heelRaiseD!==null&&heelRaiseD<25?'alerta':'ok'}">${heelRaiseD!==null?heelRaiseD+' reps':'—'}</td>
        <td class="${heelRaiseI!==null&&heelRaiseI<25?'alerta':'ok'}">${heelRaiseI!==null?heelRaiseI+' reps':'—'}</td>
        <td class="${asimHR?+asimHR>=20?'alerta':+asimHR>=15?'limite':'ok':''}">${asimHR?asimHR+'%':'—'}</td>
        <td style="font-size:10px">${[heelRaiseD,heelRaiseI].filter(v=>v!==null&&v<25).length?'⚠ Déficit muscular':'✓ Normal'}</td>
      </tr>`:''}
      ${fasciaD||fasciaI?`<tr>
        <td><strong>Grosor Fascia (eco)</strong></td><td>&lt;4 mm</td>
        <td class="${fasciaD!==null&&fasciaD>=4?'alerta':'ok'}">${fasciaD!==null?fasciaD+' mm':'—'}</td>
        <td class="${fasciaI!==null&&fasciaI>=4?'alerta':'ok'}">${fasciaI!==null?fasciaI+' mm':'—'}</td>
        <td>—</td>
        <td style="font-size:10px">${[fasciaD,fasciaI].filter(v=>v!==null&&v>=4).length?'⚠ Engrosamiento FP':'✓ Normal'}</td>
      </tr>`:''}
    </table>${_fuerzaBar}</div>` : '';

  // ── SEC 05 — Dashboard ──
  const hasDashboard = faamScore!==null || nrs!==null;
  const _faamGauge = (typeof _tmcGauge!=='undefined' && faamScore!==null)
    ? _tmcGauge(faamScore,100,{label:'FAAM-ADL',sub:faamScore>=90?'Mínima limitación':faamScore>=70?'Leve':faamScore>=50?'Moderada':'Severa',size:160})
    : '';
  const _nrsGauge = (typeof _tmcGauge!=='undefined' && nrs!==null)
    ? _tmcGauge(nrs,10,{label:'NRS Dolor',sub:'0=sin dolor · 10=máximo',size:140,colorFn:(v)=>v<=3?'#798254':v<=6?'#b06000':'#c03030'})
    : '';
  const dashboard = hasDashboard ? `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">05</span><span class="sec-title">Dashboard — Indicadores Clave</span></div>
    <div class="sec-desc">Resumen visual de scores clínicos. FAAM-ADL 0–100 (MCID: 8 pts · MDC: 5.7 pts). NRS: dolor 0–10. Score FAAM ≥90 = criterio de retorno deportivo Koc CPG 2023.</div>
    <div style="display:flex;gap:32px;justify-content:center;margin:16px 0 12px;flex-wrap:wrap">
      ${_faamGauge}${_nrsGauge}
    </div></div>` : '';

  // ── SEC 06 — Escalas funcionales ──
  const sec06 = faamScore!==null ? `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">06</span><span class="sec-title">Escalas Funcionales</span></div>
    <div class="sec-desc">Instrumentos validados de resultado reportado por el paciente (PRO). Monitorear progresión y detectar MCID (Mínima Diferencia Clínicamente Importante) a lo largo del tratamiento.</div>
    <table>
      <tr><th>Escala</th><th>Score</th><th>MCID</th><th>Interpretación</th></tr>
      <tr>
        <td><strong>FAAM-ADL</strong><br><span style="font-size:9px;color:#888">Foot and Ankle Ability Measure — Actividades de la vida diaria (Martin 2005)</span></td>
        <td><strong>${faamScore}/100</strong></td>
        <td>8 pts · MDC 5.7</td>
        <td class="${faamScore>=90?'ok':faamScore>=70?'limite':'alerta'}">${faamScore>=90?'✓ Función mínimamente limitada (RTS ready)':faamScore>=70?'Limitación leve':faamScore>=50?'Limitación moderada':'Discapacidad severa'}</td>
      </tr>
      ${nrs!==null?`<tr>
        <td><strong>NRS — Dolor</strong><br><span style="font-size:9px;color:#888">Numeric Rating Scale · 0 = sin dolor, 10 = dolor máximo imaginable</span></td>
        <td><strong>${nrs}/10</strong></td><td>≤3/10 retorno</td>
        <td class="${nrs<=3?'ok':nrs<=6?'limite':'alerta'}">${nrs<=3?'✓ Tolerable (criterio RTS)':nrs<=6?'Moderado':'⚠ Severo'}</td>
      </tr>`:''}
    </table></div>` : '';

  // ── SEC 07 — Diagnóstico presuntivo ──
  let dxHTML = '';
  if (diagnoses.length > 0) {
    diagnoses.forEach((dx,i) => {
      dxHTML += `<div style="border:1.5px solid #b0c070;border-radius:8px;overflow:hidden;margin-bottom:12px">
        <div style="background:#798254;padding:10px 14px">
          <div style="font-size:9px;letter-spacing:1px;color:rgba(255,255,255,.65);margin-bottom:2px">DIAGNÓSTICO ${i===0?'PRINCIPAL':'DIFERENCIAL'} — EBM</div>
          <div style="font-size:13px;font-weight:900;color:#fff">${dx.nombre}</div>
        </div>
        <div style="padding:12px 14px">
          <div style="font-size:11px;color:#444;line-height:1.75;margin-bottom:10px">${dx.descripcion}</div>
          <div style="font-size:10px;font-weight:700;color:#444;margin-bottom:6px;text-transform:uppercase">Plan de Tratamiento EBM:</div>
          ${dx.recom.map(r=>`<div style="font-size:10px;padding:4px 0;border-bottom:1px solid #eaeee0">${r}</div>`).join('')}
          <div style="font-size:9px;color:#aaa;font-style:italic;text-align:right;margin-top:6px">${dx.ref}</div>
        </div>
      </div>`;
    });
  } else if (allPos.length > 0) {
    dxHTML = `<div style="padding:12px;background:#f6f8ee;border-radius:8px;font-size:11px;color:#444">Tests positivos presentes — no se cumplieron criterios mínimos para diagnóstico específico. Ampliar evaluación.</div>`;
  } else {
    dxHTML = `<div style="padding:12px;background:#f6f8ee;border-radius:8px;font-size:11px;color:#888">Sin tests positivos registrados. Complete la evaluación clínica para generar presunto diagnóstico.</div>`;
  }
  const sec07 = `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">07</span><span class="sec-title">Diagnóstico Kinesiológico Presuntivo</span></div>
    <div class="sec-desc">Motor de inferencia EBM basado en criterios diagnósticos validados por CPG nivel I. El diagnóstico presuntivo requiere correlación con imagen y juicio médico para confirmación definitiva.</div>
    ${dxHTML}
    <div style="font-size:9px;color:#aaa;font-style:italic;text-align:right;margin-top:6px">Koc M. et al. JOSPT 2023 · Nweke 2025 · Ettinger Dtsch Arztebl Int 2025 · ACR Chronic Foot Pain 2025</div>
    </div>`;

  // ── SEC 08 — Tratamiento ──
  const sec08 = `
    <div class="sec-wrap"><div class="sec-head"><span class="sec-badge">08</span><span class="sec-title">Ruta de Tratamiento — EBM</span></div>
    <div class="sec-desc">Protocolo de tratamiento en fases progresivas según CPG 2023 (Koc et al., JOSPT) para patología de pie y tobillo. La progresión entre fases depende del cumplimiento de criterios funcionales objetivos, no solo del tiempo.</div>
    <div class="grid-2">
      ${[
        ['FASE 1 — Reducción de carga','Sem. 1–3','Modificación de actividad. Hielo + AINEs tópicos. Plantillas ortopédicas o taping de descarga medial. Estiramiento gastrosoleo separado (gastroc 3×30s, sóleo 3×30s/día) con rodilla en extensión y flexión.'],
        ['FASE 2 — Fortalecimiento (HSR)','Sem. 4–8','Heavy Slow Resistance: heel raise excéntrico 3×15 reps 3s bajada. Carga progresiva en fascia plantar: toe curls con toalla. Propiocepción monopodal estático → dinámico.'],
        ['FASE 3 — Carga funcional','Sem. 9–12','Pliometría progresiva tren inferior. Lunge cargado con déficit. Carrera progresiva: volumen → intensidad. Objetivo FAAM-ADL ≥80. Navicular drop y DF tobillo dentro de rango normal.'],
        ['FASE 4 — RTS / Retorno deportivo','Sem. 13+','Simulación gestual del deporte específico. Sprint + cambios de dirección. Criterios de alta: Heel raise ≥25 reps + FAAM-ADL ≥90 + NRS ≤3/10.'],
      ].map(([titulo,sem,desc])=>`
      <div class="phase-box">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <strong style="font-size:10px;color:#1e1e1b">${titulo}</strong>
          <span class="phase-sem">${sem}</span>
        </div>
        <div style="font-size:10px;color:#555;line-height:1.55">${desc}</div>
      </div>`).join('')}
    </div></div>`;

  // ── FIRMA ──
  const firma = typeof _tmcFirma!=='undefined'
    ? _tmcFirma({profNombre,profMP,profInst})
    : `<div style="margin-top:32px;padding-top:16px;border-top:2px solid #dde5c4;text-align:right">
        <div style="width:140px;border-top:1.5px solid #1e1e1b;margin-left:auto;margin-bottom:5px"></div>
        <div style="font-size:11px;font-weight:700">${profNombre}</div>
        <div style="font-size:10px;color:#666">${profInst}</div>
      </div>`;

  // ── ASSEMBLE HTML ──
  const bodyContent = sec01+sec02+sec03+sec04+dashboard+sec06+sec07+sec08+firma;
  const headerHTML = typeof _tmcHeader!=='undefined'
    ? _tmcHeader({profNombre,profMP,profInst,fecha,refs:'Basado en evidencia · Koc CPG JOSPT 2023'})
    : `<header style="background:#1e1e1b;padding:24px 40px;display:flex;justify-content:space-between"><div style="color:#96a566;font-size:24px;font-weight:900">THE MOVE CLUB</div><div style="color:#fff;text-align:right"><div style="font-size:15px;font-weight:700;color:#96a566">${fecha}</div><div>${profNombre}</div></div></header>`;
  const footerHTML = typeof _tmcFooter!=='undefined'
    ? _tmcFooter('Pie y Tobillo','CPG 2023 · Koc JOSPT')
    : `<footer style="background:#1e1e1b;color:rgba(255,255,255,.35);padding:10px 44px;display:flex;justify-content:space-between;font-size:9px"><span>THE MOVE CLUB</span><span>Informe Pie · EBM</span></footer>`;
  const toolbar = typeof _tmcToolbar!=='undefined'
    ? _tmcToolbar
    : `<div class="no-print" style="background:#1e1e1b;padding:10px 20px;display:flex;gap:8px"><button onclick="window.print()" style="background:#798254;color:#fff;border:none;border-radius:4px;padding:8px 18px;font-weight:700;cursor:pointer">🖨 Imprimir / PDF</button></div>`;

  const fullHTML = `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Informe Pie y Tobillo — ${nombre} — ${fecha}</title>
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
  const container = document.getElementById('pie-informe-container');
  if (container) {
    const dxNames = diagnoses.map(d=>d.nombre).join(', ');
    container.innerHTML = `
      <div style="font-family:var(--mono);font-size:11px;line-height:1.7">
        <div style="font-size:13px;font-weight:700;color:var(--neon);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--verde20)">✓ Informe generado — se abrió en nueva ventana</div>
        <div style="padding:10px;background:var(--verde04);border:1px solid var(--verde20);border-radius:8px;margin-bottom:12px;font-size:11px">
          ${faamScore!==null?`<div><b>FAAM-ADL:</b> ${faamScore}/100 — ${faamScore>=90?'Mínima limitación':faamScore>=70?'Leve':faamScore>=50?'Moderada':'Severa'}</div>`:''}
          ${nrs!==null?`<div><b>NRS Dolor:</b> ${nrs}/10</div>`:''}
          ${hallazgos.length?`<div><b>Hallazgos:</b> ${hallazgos.length} detectados</div>`:''}
          ${allPos.length?`<div><b>Tests (+):</b> ${allPos.join(' · ')}</div>`:''}
          ${dxNames?`<div><b>Presunto Dx:</b> ${dxNames}</div>`:''}
        </div>
        <button onclick="generarInformePie()" class="btn btn-neon btn-sm" style="font-size:10px">🔄 Regenerar informe</button>
      </div>`;
  }
  showPTab('pinforme', document.getElementById('ptab-pinforme-btn'));
}

function imprimirInformePie() {
  generarInformePie();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function initPieSheet() {
  try { buildPieObs(); } catch(e) { console.error('buildPieObs', e); }
  try { buildPieFascitisPlantar(); } catch(e) { console.error('buildPieFascitisPlantar', e); }
  try { buildPieHallux(); } catch(e) { console.error('buildPieHallux', e); }
  try { buildPieFuerzaROM(); } catch(e) { console.error('buildPieFuerzaROM', e); }
  try { buildPieEscalas(); } catch(e) { console.error('buildPieEscalas', e); }
  pieFaamVals = new Array(21).fill(null);
}

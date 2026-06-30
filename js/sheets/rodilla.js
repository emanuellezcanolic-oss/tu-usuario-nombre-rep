// ═══════════════════════════════════════════════════════════════
// sheets/rodilla.js v8 — LCA · SPF · Menisco · Condral · ITBS
// Algoritmo diagnóstico + informe imprimible basado en evidencia
// ═══════════════════════════════════════════════════════════════

// Estado interno de los tests completados
const rodState = {
  lca:   {},  // { lachman: bool|null, cajon_ant: bool|null, ... }
  spf:   {},
  men:   {},  // menisco
  cond:  {},  // condral
  itbs:  {},  // síndrome de fricción banda iliotibial
};

// ── Helpers ──────────────────────────────────────────────────
function _rodSetTest(categoria, id, val) {
  rodState[categoria][id] = val;
  _updateRodillaDiag();
}

// ── BUILDER: SPF ─────────────────────────────────────────────
function buildRodillaSPF() {
  const c = document.getElementById('rodilla-spf-fields');
  if (!c || c.innerHTML) return;

  const diagTests       = RODILLA_SPF_TESTS.filter(t => !t.tipo);
  const assessmentTests = RODILLA_SPF_TESTS.filter(t => t.tipo === 'assessment');

  const renderTest = t => {
    const tagLabel = t.sn
      ? `Sn ${t.sn} · Sp ${t.sp}`
      : (t.tipo === 'assessment' ? 'Evaluación funcional' : 'Criterio clínico');
    const tagClass = t.tipo === 'assessment' ? 'tag-g' : 'tag-b';
    const lrInfo   = t.lr_pos ? `<div style="font-size:10px;color:var(--text3);margin-top:2px">LR+ ${t.lr_pos} · LR– ${t.lr_neg}</div>` : '';
    return `
    <div class="card mb-8">
      <div class="card-header">
        <div>
          <h3>${t.nombre}</h3>
          <div style="font-size:10px;color:var(--text3);margin-top:2px">${t.protocolo.slice(0,85)}…</div>
        </div>
        <span class="tag ${tagClass}" style="font-size:9px;white-space:nowrap">${tagLabel}</span>
      </div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text2);margin-bottom:8px;font-style:italic">${t.protocolo}</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
          <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('spf','${t.id}',true)">+ POS</button>
          <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('spf','${t.id}',false)">– NEG</button>
          <span style="font-size:10px;color:var(--text3);margin-left:6px">${t.criterio_diag ? '⭐ Criterio diagnóstico' : ''}</span>
        </div>
        ${lrInfo}
        <div style="font-size:10px;color:var(--text3);margin-top:4px">📚 ${t.ref}${t.nota ? '<br><span style="color:var(--amber)">⚠️ ' + t.nota + '</span>' : ''}</div>
      </div>
    </div>`;
  };

  // Cluster diagnóstico Decary 2017 — LR+ 8.70 / LR– 0.12
  const clusterDecary = `
  <div class="card mb-10" style="border-color:rgba(99,179,255,.3);background:rgba(99,179,255,.04)">
    <div class="card-body">
      <div style="font-size:12px;font-weight:700;color:#63b3ff;margin-bottom:4px">Cluster Diagnóstico SPF — Décary 2017 / Willy 2019 CPG</div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:8px">
        Décary S et al. — 2 clusters combinados: <strong>LR+ 8.70</strong> (IC 5.20–14.58) · <strong>LR– 0.12</strong> (IC 0.06–0.27) · NPV 0.96.<br>
        <em>Cluster POSITIVO</em> (confirmar): Edad &lt;40 + dolor anterior + sensibilidad faceta patelar medial → Sn 0.64 · Sp 0.93.<br>
        <em>Cluster NEGATIVO</em> (descartar): Edad &lt;58 + dolor medial/lateral/posterior + sin sensibilidad facetas → -LR 0.12.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <div style="padding:6px 8px;border-radius:6px;border:1px solid rgba(99,179,255,.2);background:rgba(99,179,255,.03)">
          <div style="font-size:10px;font-weight:700;color:#63b3ff;margin-bottom:4px">① Confirmación diagnóstica</div>
          <div style="display:flex;gap:6px">
            <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('spf','cluster_pos',true)">+ CUMPLE</button>
            <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('spf','cluster_pos',false)">– NO</button>
          </div>
          <div style="font-size:9px;color:var(--text3);margin-top:4px">Edad &lt;40 · dolor anterior · sensibilidad faceta medial</div>
        </div>
        <div style="padding:6px 8px;border-radius:6px;border:1px solid rgba(99,179,255,.2);background:rgba(99,179,255,.03)">
          <div style="font-size:10px;font-weight:700;color:#63b3ff;margin-bottom:4px">② Exclusión diagnóstica</div>
          <div style="display:flex;gap:6px">
            <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('spf','cluster_neg',true)">+ CUMPLE</button>
            <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('spf','cluster_neg',false)">– NO</button>
          </div>
          <div style="font-size:9px;color:var(--text3);margin-top:4px">Edad &lt;58 · dolor no anterior · sin sensibilidad facetas</div>
        </div>
      </div>
    </div>
  </div>`;

  const sectionHeader = (titulo, subtitulo) =>
    `<div style="margin:14px 0 8px;font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:4px">${titulo}<span style="font-size:10px;font-weight:400;color:var(--text3);margin-left:6px;text-transform:none">${subtitulo}</span></div>`;

  c.innerHTML =
    clusterDecary +
    sectionHeader('Tests Diagnósticos', 'con Sensibilidad / Especificidad') +
    diagTests.map(renderTest).join('') +
    sectionHeader('Evaluaciones Funcionales', 'clasificación por subgrupos · Willy 2019 CPG') +
    assessmentTests.map(renderTest).join('');
}

// ── BUILDER: LCA ─────────────────────────────────────────────
function buildRodillaLCA() {
  const c = document.getElementById('rodilla-lca-fields');
  if (!c || c.innerHTML) return;

  c.innerHTML = RODILLA_LCA_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header">
        <div>
          <h3>${t.nombre}${t.gold ? ' 🏅' : ''}</h3>
          <div style="font-size:10px;color:var(--text3);margin-top:2px">${t.lesion || 'LCA'}</div>
        </div>
        <span class="tag tag-r" style="font-size:9px;white-space:nowrap">Sn ${t.sn} · Sp ${t.sp}${t.nota ? ' ⚠' : ''}</span>
      </div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text2);margin-bottom:8px;font-style:italic">${t.protocolo}</div>
        <div class="grid-2" style="gap:8px;margin-bottom:6px">
          <div>
            <div class="il mb-4">D</div>
            <div style="display:flex;gap:6px">
              <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('lca','${t.id}',true)">+ POS</button>
              <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('lca','${t.id}',false)">– NEG</button>
            </div>
          </div>
          <div>
            <div class="il mb-4">I</div>
            <div style="display:flex;gap:6px">
              <button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button>
              <button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button>
            </div>
          </div>
        </div>
        ${t.id === 'pivot_shift' ? `
        <div class="ig mt-6"><label class="il">Grado</label>
          <select class="inp" style="font-size:12px" id="pivot-grado">
            <option value="">— Sin grado —</option>
            <option value="0">0 — Negativo</option>
            <option value="I">I — Deslizamiento</option>
            <option value="II">II — Clunk</option>
            <option value="III">III — Clunk marcado</option>
          </select>
        </div>` : ''}
        <div style="font-size:10px;color:var(--text3);margin-top:4px">📚 ${t.ref}${t.nota ? '<br><span style="color:var(--amber)">⚠️ ' + t.nota + '</span>' : ''}</div>
        ${t.lr_pos ? `<div style="font-size:10px;color:var(--text3);margin-top:2px">LR+ ${t.lr_pos} · LR– ${t.lr_neg}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// ── BUILDER: Menisco ──────────────────────────────────────────
function buildRodillaMenisco() {
  const c = document.getElementById('rodilla-menisco-fields');
  if (!c || c.innerHTML) return;

  // ── Composite Score Lowery 2006 (citado JOSPT 2018 CPG)
  // 5 elementos exactos del paper (Lowery DJ et al. AJSM 2006):
  //   1) Antecedente mecanismo meniscal → 'mecanismo_men'  (historia)
  //   2) Dolor en línea articular (JLT) → 'jlt'           (test)
  //   3) McMurray positivo              → 'mcmurray'       (test)
  //   4) Derrame articular              → 'derrame'        (test)
  //   5) Dolor con squat completo       → 'squat_dolor'    (test)
  // ≥3/5 → Sn 0.92 · Sp 0.75 · LR+ 3.68 · LR- 0.11
  const LOWERY_KEYS = ['mecanismo_men','jlt','mcmurray','derrame','squat_dolor'];
  const LOWERY_LABELS = [
    '① Antecedente de mecanismo meniscal (historia clínica)',
    '② JLT — Dolor en línea articular',
    '③ McMurray positivo',
    '④ Derrame articular presente',
    '⑤ Dolor con squat completo (flexión máxima)',
  ];

  const compositeInfo = `
  <div class="card mb-10" style="border-color:rgba(255,190,0,.3);background:rgba(255,190,0,.04)">
    <div class="card-body">
      <div style="font-size:12px;font-weight:700;color:var(--amber);margin-bottom:4px">Composite Score Meniscal — Lowery 2006 / JOSPT 2018 CPG</div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:6px">Lowery DJ et al. Am J Sports Med 2006 — 5 elementos. ≥3/5 positivos → Sn <strong>0.92</strong> · Sp <strong>0.75</strong> · LR+ <strong>3.68</strong> · LR– <strong>0.11</strong> (útil para DESCARTE).</div>
      <div id="rod-composite-score" style="font-family:var(--mono);font-size:20px;font-weight:800;color:var(--text3);margin-bottom:10px">0/5</div>
      <div style="display:grid;grid-template-columns:1fr;gap:6px">
        ${LOWERY_KEYS.map((k,i) => `
        <div style="padding:6px 8px;background:rgba(255,255,255,.03);border-radius:6px;border:1px solid rgba(255,190,0,.15)">
          <div style="font-size:10px;font-weight:700;color:var(--amber);margin-bottom:4px">${LOWERY_LABELS[i]}</div>
          <div style="display:flex;gap:6px">
            <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('men','${k}',true);_updateComposite()">+ SÍ/POS</button>
            <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('men','${k}',false);_updateComposite()">– NO/NEG</button>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;

  // Tests adicionales (fuera del composite Lowery)
  const COMPOSITE_IDS = new Set(LOWERY_KEYS);
  const testsAdicionales = RODILLA_MENISCO_TESTS.filter(t => !COMPOSITE_IDS.has(t.id));
  const testsComposite   = RODILLA_MENISCO_TESTS.filter(t =>  COMPOSITE_IDS.has(t.id));

  function renderTest(t, isComp) {
    const snInfo = t.sn_med
      ? `Sn med ${t.sn_med} · Sp med ${t.sp_med}`
      : (t.sn ? `Sn ${t.sn} · Sp ${t.sp}` : 'Sin Sn/Sp pooled');
    const borderStyle = isComp ? ' style="border-color:rgba(255,190,0,.3)"' : '';
    const isBilateral = ['mcmurray','apley','thessaly','ege'].includes(t.id);
    return `
    <div class="card mb-8"${borderStyle}>
      <div class="card-header">
        <div>
          <h3>${t.nombre}${isComp ? ' ⭐' : ''}</h3>
          ${isComp ? '<div style="font-size:9px;color:var(--amber)">Elemento Composite Lowery</div>' : ''}
        </div>
        <span class="tag tag-y" style="font-size:9px;white-space:nowrap">${snInfo}</span>
      </div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text2);margin-bottom:8px;font-style:italic">${t.protocolo}</div>
        ${isBilateral ? `
        <div class="grid-2" style="gap:8px;margin-bottom:6px">
          <div>
            <div class="il mb-4">Medial</div>
            <div style="display:flex;gap:6px">
              <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('men','${t.id}',true);_updateComposite()">+ POS</button>
              <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('men','${t.id}',false);_updateComposite()">– NEG</button>
            </div>
          </div>
          <div>
            <div class="il mb-4">Lateral</div>
            <div style="display:flex;gap:6px">
              <button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button>
              <button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button>
            </div>
          </div>
        </div>` : `
        <div style="display:flex;gap:6px;margin-bottom:6px">
          <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('men','${t.id}',true);_updateComposite()">+ POS</button>
          <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('men','${t.id}',false);_updateComposite()">– NEG</button>
        </div>`}
        <div style="font-size:10px;color:var(--text3)">📚 ${t.ref}${t.nota ? '<br><span style="color:var(--amber)">⚠️ ' + t.nota + '</span>' : ''}</div>
      </div>
    </div>`;
  }

  // Los tests del composite que tienen su propio entry en RODILLA_MENISCO_TESTS
  // los mostramos primero con border amber; el resto van debajo
  const compositeInTests  = RODILLA_MENISCO_TESTS.filter(t => COMPOSITE_IDS.has(t.id));
  const adicionales       = RODILLA_MENISCO_TESTS.filter(t => !COMPOSITE_IDS.has(t.id));

  c.innerHTML = compositeInfo
    + compositeInTests.map(t => renderTest(t, true)).join('')
    + `<div style="margin:12px 0 8px;font-size:10px;font-weight:700;color:var(--text3);letter-spacing:.1em;text-transform:uppercase">Tests adicionales (fuera del composite)</div>`
    + adicionales.map(t => renderTest(t, false)).join('');
}

function _updateComposite() {
  // Composite Lowery 2006 — 5 elementos exactos
  // 1) mecanismo_men  2) jlt  3) mcmurray  4) derrame  5) squat_dolor
  const keys = ['mecanismo_men','jlt','mcmurray','derrame','squat_dolor'];
  const score = keys.filter(k => rodState.men[k] === true).length;
  const el = document.getElementById('rod-composite-score');
  if (!el) return;
  const c = score >= 3 ? 'var(--neon)' : score >= 2 ? 'var(--amber)' : 'var(--text3)';
  el.style.color = c;
  let label = '';
  if (score >= 3) label = '— ≥3 pos → Sp 0.75 · LR– 0.11';
  else if (score >= 1) label = '— incompleto';
  el.textContent = `${score}/5 ${label}`;
}

// ── BUILDER: Condral ─────────────────────────────────────────
function buildRodillaCondral() {
  const c = document.getElementById('rodilla-condral-fields');
  if (!c || c.innerHTML) return;

  const header = `<div class="card mb-10" style="border-color:rgba(255,100,70,.3);background:rgba(255,100,70,.04)">
    <div class="card-body">
      <div style="font-size:12px;font-weight:700;color:var(--red);margin-bottom:4px">⚠️ Lesión Condral / Osteocondral</div>
      <div style="font-size:11px;color:var(--text2)">No existen pruebas físicas de alta Sn/Sp para lesión condral focal. El diagnóstico definitivo requiere RMN (sensibilidad >80% para lesiones ≥1cm²). La evaluación clínica orienta la sospecha y prioridad de derivación.</div>
      <div style="font-size:10px;color:var(--text3);margin-top:4px">📚 Wilk KE 2006 JOSPT / Logerstedt 2018 JOSPT CPG</div>
    </div>
  </div>`;

  c.innerHTML = header + RODILLA_CONDRAL_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header">
        <div>
          <h3>${t.nombre}</h3>
          ${t.lesion ? `<div style="font-size:10px;color:var(--text3);margin-top:2px">${t.lesion}</div>` : ''}
        </div>
        <span class="tag tag-r" style="font-size:9px;white-space:nowrap">${t.sn ? `Sn ${t.sn} · Sp ${t.sp}` : 'Hallazgo clínico'}</span>
      </div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text2);margin-bottom:8px;font-style:italic">${t.protocolo}</div>
        <div style="display:flex;gap:6px;margin-bottom:6px">
          <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('cond','${t.id}',true)">+ POS</button>
          <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('cond','${t.id}',false)">– NEG</button>
        </div>
        <div style="font-size:10px;color:var(--text3)">📚 ${t.ref}${t.nota ? '<br><span style="color:var(--amber)">⚠️ ' + t.nota + '</span>' : ''}</div>
      </div>
    </div>
  `).join('');
}

// ── BUILDER: ITBS ─────────────────────────────────────────────
function buildRodillaITBS() {
  const c = document.getElementById('rodilla-itbs-fields');
  if (!c || c.innerHTML) return;

  // Header evidencia
  const header = `
  <div class="card mb-10" style="border-color:rgba(255,190,0,.3);background:rgba(255,190,0,.04)">
    <div class="card-body">
      <div style="font-size:12px;font-weight:700;color:var(--amber);margin-bottom:4px">Síndrome de Fricción de la Banda Iliotibial (SFBI)</div>
      <div style="font-size:11px;color:var(--text2);line-height:1.6">Diagnóstico clínico basado en historia y tests. Prevalencia 7.9-10% de lesiones en corredores. Ningún test único tiene alta Sn/Sp — la combinación de Noble Compression + anamnesis confirma el diagnóstico.</div>
      <div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap">
        <span style="font-size:9px;color:var(--neon)">✓ 44% curación a 8 sem (Beals 2013)</span>
        <span style="font-size:9px;color:var(--neon)">✓ 91.7% curación a 6 meses</span>
        <span style="font-size:9px;color:var(--amber)">⚡ HAS = 1ª línea (Sanchez-Alvarado 2024)</span>
      </div>
    </div>
  </div>`;

  // Grado clínico selector
  const gradoSection = `
  <div class="card mb-8" style="border-color:rgba(255,190,0,.25)">
    <div class="card-header"><h3>Estadificación Clínica (Orchard 1996)</h3></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
        ${ITBS_STAGES.map(s => `
        <button id="itbs-grade-${s.grade}" onclick="selectITBSGrade(${s.grade},this)"
          style="padding:7px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg2);cursor:pointer;text-align:left">
          <div style="font-size:10px;font-weight:700;color:var(--${s.color})">${s.label}</div>
          <div style="font-size:9px;color:var(--text2);margin-top:2px;line-height:1.4">${s.desc}</div>
        </button>`).join('')}
      </div>
      <div id="itbs-grade-display" style="font-size:10px;color:var(--text3);text-align:center">Sin grado seleccionado</div>
    </div>
  </div>`;

  // Tests diagnósticos
  const testsDiag = RODILLA_ITBS_TESTS.filter(t => t.categoria === 'test_diagnostico').map(t => `
    <div class="card mb-8">
      <div class="card-header">
        <div>
          <h3>${t.nombre}</h3>
          <div style="font-size:10px;color:var(--text3);margin-top:2px">${t.referencia}</div>
        </div>
        <span class="tag tag-a" style="font-size:9px;white-space:nowrap">${t.sn ? `Sn ${t.sn}` : 'Dx Clínico'}</span>
      </div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text2);margin-bottom:8px;font-style:italic">${t.protocolo}</div>
        <div style="display:flex;gap:6px;margin-bottom:6px">
          <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('itbs','${t.id}',true)">+ POS</button>
          <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('itbs','${t.id}',false)">– NEG</button>
        </div>
        <div style="font-size:10px;color:var(--neon);margin-top:4px">${t.interpretacion}</div>
      </div>
    </div>`).join('');

  // Tests funcionales / flexibilidad
  const testsFlex = RODILLA_ITBS_TESTS.filter(t => t.categoria !== 'test_diagnostico').map(t => `
    <div class="card mb-8">
      <div class="card-header">
        <div>
          <h3>${t.nombre}</h3>
          <div style="font-size:10px;color:var(--text3);margin-top:2px">${t.referencia}</div>
        </div>
        <span class="tag" style="font-size:9px;background:rgba(77,158,255,.12);color:var(--blue);border-color:rgba(77,158,255,.3)">${t.categoria === 'evaluacion_funcional' ? 'Funcional' : 'Flexibilidad'}</span>
      </div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text2);margin-bottom:8px;font-style:italic">${t.protocolo}</div>
        <div style="display:flex;gap:6px;margin-bottom:6px">
          <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('itbs','${t.id}',true)">+ POS</button>
          <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('itbs','${t.id}',false)">– NEG</button>
        </div>
        <div style="font-size:10px;color:var(--neon);margin-top:4px">${t.interpretacion}</div>
      </div>
    </div>`).join('');

  // Factores de riesgo
  const rfSection = `
  <div class="card mb-8" style="border-color:rgba(255,190,0,.25)">
    <div class="card-header"><h3>Factores de Riesgo (Sanchez-Alvarado 2024)</h3></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${ITBS_RISK_FACTORS.map(rf => `
        <label style="display:flex;align-items:flex-start;gap:7px;cursor:pointer;padding:5px 6px;border-radius:5px;border:1px solid var(--border);background:var(--bg2)">
          <input type="checkbox" id="itbs-rf-${rf.id}" onchange="calcITBSRisk()" style="margin-top:2px;accent-color:var(--amber)">
          <span style="font-size:10px;color:var(--text1);line-height:1.4">${rf.label}</span>
        </label>`).join('')}
      </div>
      <div id="itbs-risk-display" style="margin-top:10px;padding:8px 10px;border-radius:6px;background:var(--bg3);border:1px solid var(--border);font-size:11px;color:var(--text2);text-align:center">
        Seleccioná factores de riesgo para calcular perfil
      </div>
    </div>
  </div>`;

  // Plan de tratamiento referencial
  const txSection = `
  <div class="card mb-8" style="border-color:rgba(57,255,122,.2)">
    <div class="card-header"><h3>Evidencia Tratamiento Conservador</h3><span class="tag tag-v" style="font-size:9px">Nivel II</span></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
        <div style="padding:8px;border-radius:5px;background:rgba(57,255,122,.05);border:1px solid rgba(57,255,122,.15)">
          <div style="font-weight:700;color:var(--neon);margin-bottom:5px">Fase Aguda (0-2 sem)</div>
          <div style="color:var(--text2);line-height:1.7">• Reposo relativo / carga modificada<br>• Hielo + AINE tópico/oral<br>• Evitar factores desencadenantes<br>• Análisis de carrera y calzado</div>
        </div>
        <div style="padding:8px;border-radius:5px;background:rgba(255,190,0,.05);border:1px solid rgba(255,190,0,.15)">
          <div style="font-weight:700;color:var(--amber);margin-bottom:5px">Fase Subaguda (2-8 sem)</div>
          <div style="color:var(--text2);line-height:1.7">• HAS: fortalecimiento abductores ⭐<br>• Estiramiento ITB/TFL<br>• Terapia manual EEII<br>• Shockwave focalizada (evidencia moderada)</div>
        </div>
        <div style="padding:8px;border-radius:5px;background:rgba(77,158,255,.05);border:1px solid rgba(77,158,255,.15)">
          <div style="font-weight:700;color:var(--blue);margin-bottom:5px">Fase Funcional (6-12 sem)</div>
          <div style="color:var(--text2);line-height:1.7">• Reeducación de carrera (cadencia +5-10%)<br>• Progresión de volumen gradual<br>• Retorno progresivo a pista<br>• Control de calidad de movimiento</div>
        </div>
        <div style="padding:8px;border-radius:5px;background:rgba(255,70,70,.05);border:1px solid rgba(255,70,70,.15)">
          <div style="font-weight:700;color:var(--red);margin-bottom:5px">Cirugía (último recurso)</div>
          <div style="color:var(--text2);line-height:1.7">• Solo si fracaso conservador >6 meses<br>• Bursectomía / liberación ITB<br>• 87% éxito en series quirúrgicas<br>• Baja tasa de recomendación CPG</div>
        </div>
      </div>
      <div style="font-size:9px;color:var(--text3);margin-top:8px">📚 Sanchez-Alvarado 2024 · Beals & Flanigan 2013 · McKay 2020</div>
    </div>
  </div>`;

  c.innerHTML = header + gradoSection +
    `<div style="font-size:11px;font-weight:600;color:var(--text1);margin:10px 0 6px">Tests Diagnósticos</div>` +
    testsDiag +
    `<div style="font-size:11px;font-weight:600;color:var(--text1);margin:10px 0 6px">Evaluación Funcional y Flexibilidad</div>` +
    testsFlex +
    rfSection + txSection;
}

// ── Helpers ITBS ──────────────────────────────────────────────
function selectITBSGrade(grade, el) {
  ITBS_STAGES.forEach(s => {
    const btn = document.getElementById('itbs-grade-' + s.grade);
    if (btn) {
      btn.style.borderColor = s.grade === grade ? 'var(--amber)' : 'var(--border)';
      btn.style.background  = s.grade === grade ? 'rgba(255,190,0,.12)' : 'var(--bg2)';
    }
  });
  rodState.itbs._grade = grade;
  const stage = ITBS_STAGES.find(s => s.grade === grade);
  const el2 = document.getElementById('itbs-grade-display');
  if (el2 && stage) {
    el2.textContent = `Seleccionado: ${stage.label} — ${stage.desc}`;
    el2.style.color = `var(--${stage.color})`;
  }
}

function calcITBSRisk() {
  const checked = ITBS_RISK_FACTORS.filter(rf =>
    document.getElementById('itbs-rf-' + rf.id)?.checked
  );
  const totalPeso   = checked.reduce((a, rf) => a + rf.peso, 0);
  const maxPeso     = ITBS_RISK_FACTORS.reduce((a, rf) => a + rf.peso, 0);
  const pct         = Math.round(totalPeso / maxPeso * 100);
  const nivel       = pct >= 65 ? 'Alto' : pct >= 35 ? 'Moderado' : 'Bajo';
  const color       = pct >= 65 ? 'var(--red)' : pct >= 35 ? 'var(--amber)' : 'var(--neon)';
  const el = document.getElementById('itbs-risk-display');
  if (el) {
    el.innerHTML = `Perfil de riesgo: <strong style="color:${color}">${nivel} (${pct}%)</strong> · ${checked.length}/${ITBS_RISK_FACTORS.length} factores presentes`;
    el.style.borderColor = color;
  }
}

// ── ALGORITMO DIAGNÓSTICO ─────────────────────────────────────
function _updateRodillaDiag() {
  const el = document.getElementById('rod-diag-panel');
  if (!el) return;

  const allTests = {
    ...rodState.lca,
    ...rodState.spf,
    ...rodState.men,
    ...rodState.cond,
  };

  const resultados = [];
  for (const [key, logic] of Object.entries(RODILLA_DIAG_LOGIC)) {
    const res = logic.evaluar(allTests);
    if (res) resultados.push({ key, label: logic.label, ...res });
  }

  if (resultados.length === 0) {
    el.innerHTML = `<div style="font-size:11px;color:var(--text3);text-align:center;padding:12px">Completá tests para ver el análisis diagnóstico</div>`;
    return;
  }

  const sorted = [...resultados].sort((a,b) => b.pct - a.pct);

  const colorMap = {
    alto: { c: 'var(--red)', bg: 'rgba(255,70,70,.08)', border: 'rgba(255,70,70,.3)', icon: '🔴' },
    moderado: { c: 'var(--amber)', bg: 'rgba(255,190,0,.08)', border: 'rgba(255,190,0,.3)', icon: '🟡' },
    bajo: { c: 'var(--neon)', bg: 'rgba(57,255,122,.06)', border: 'rgba(57,255,122,.2)', icon: '🟢' },
  };

  el.innerHTML = sorted.map(r => {
    const cm = colorMap[r.nivel] || colorMap.bajo;
    const barW = Math.min(r.pct, 100);
    return `
    <div style="margin-bottom:8px;padding:9px 11px;background:${cm.bg};border:1px solid ${cm.border};border-radius:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="font-size:12px;font-weight:700;color:${cm.c}">${cm.icon} ${r.label}</div>
        <div style="font-family:var(--mono);font-size:13px;font-weight:800;color:${cm.c}">${r.pct}%</div>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.08);border-radius:2px;margin-bottom:5px">
        <div style="height:100%;width:${barW}%;background:${cm.c};border-radius:2px;transition:width .3s"></div>
      </div>
      <div style="font-size:10px;color:var(--text2);line-height:1.5">${r.msg}</div>
      ${r.urgente ? `<div style="font-size:10px;color:var(--red);font-weight:700;margin-top:4px">⚠️ URGENTE — Derivar inmediatamente</div>` : ''}
    </div>`;
  }).join('');
}

// ── RATIO I/Q ─────────────────────────────────────────────────
function calcRatioIQ(side) {
  const cuad = +document.getElementById('cuad-' + side)?.value || 0;
  const isq  = +document.getElementById('isq-' + side)?.value || 0;
  const el = document.getElementById('ratio-iq-' + side);
  if (!cuad || !el) return;
  const ratio = (isq / cuad).toFixed(2);
  const rc = +ratio >= 0.6 ? 'var(--neon)' : 'var(--red)';
  el.innerHTML = `Ratio ${side.toUpperCase()}: <span style="font-family:var(--mono);color:${rc};font-weight:700">${ratio}</span> ${+ratio < 0.6 ? '⚠️ <0.60 (déficit isquiotibial)' : '✓ Normal (≥0.60)'}`;
}

// ── HOP TESTS LSI ─────────────────────────────────────────────
function buildHopRTP() {
  const c = document.getElementById('hop-tests-rtp');
  if (!c || c.innerHTML) return;
  const tests = ['Single hop para distancia', 'Triple hop para distancia', '6m hop (tiempo)', 'Cross-over triple hop'];
  c.innerHTML = tests.map((t, i) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:12px;font-weight:600;margin-bottom:6px">${t}</div>
      <div class="grid-2" style="gap:6px">
        <div class="ig"><label class="il">Miembro lesionado</label><input class="inp inp-mono" type="number" step="0.1" id="hop-les-${i}" placeholder="0" oninput="calcLSISheet(${i})"></div>
        <div class="ig"><label class="il">Contralateral</label><input class="inp inp-mono" type="number" step="0.1" id="hop-con-${i}" placeholder="0" oninput="calcLSISheet(${i})"></div>
      </div>
      <div id="lsi-sheet-${i}" style="font-size:12px;color:var(--text3);margin-top:4px">LSI: completá ambos lados</div>
    </div>
  `).join('');
}

function calcLSISheet(i) {
  const les = +document.getElementById('hop-les-' + i)?.value;
  const con = +document.getElementById('hop-con-' + i)?.value;
  const el = document.getElementById('lsi-sheet-' + i);
  if (!les || !con || !el) return;
  const lsi = (les / con * 100).toFixed(1);
  const c = +lsi >= 90 ? 'var(--neon)' : +lsi >= 80 ? 'var(--amber)' : 'var(--red)';
  el.innerHTML = `LSI: <span style="font-family:var(--mono);font-weight:700;color:${c}">${lsi}%</span> ${+lsi >= 90 ? '✓ Criterio RTP alcanzado' : '⚠️ No alcanza criterio RTP (≥90%)'}`;
}

// ── DROP NAVICULAR ─────────────────────────────────────────────
function calcDropNavicular(side) {
  const desc = +document.getElementById('nav-desc-' + side)?.value;
  const carg = +document.getElementById('nav-carg-' + side)?.value;
  const el = document.getElementById('nav-result-' + side);
  if (!el) return;
  if (!desc || !carg) { el.textContent = `Drop ${side.toUpperCase()}: —`; return; }
  const drop = Math.abs(carg - desc);
  const c = drop > 10 ? 'var(--red)' : drop > 6 ? 'var(--amber)' : 'var(--neon)';
  el.innerHTML = `Drop ${side.toUpperCase()}: <strong style="font-family:var(--mono);color:${c}">${drop} mm</strong> ${drop > 10 ? '⚠️ Pronación excesiva (>10mm)' : drop > 6 ? '⚠️ Moderado (6–10mm)' : '✓ Normal (≤6mm)'}`;
}

// ── CADENCIA ──────────────────────────────────────────────────
function calcCadencia() {
  const v = +document.getElementById('cadencia-actual')?.value;
  const el = document.getElementById('cadencia-result');
  if (!el || !v) return;
  const target = 180;
  const delta = target - v;
  const plus5  = Math.round(v * 1.05);
  const plus10 = Math.round(v * 1.10);
  const c = v >= 170 ? 'var(--neon)' : v >= 160 ? 'var(--amber)' : 'var(--red)';
  el.innerHTML = `<span style="font-family:var(--mono);color:${c};font-size:14px;font-weight:700">${v} pasos/min</span> — ${v >= 170 ? '✓ Rango óptimo (170–180)' : `⚠️ ${delta} pasos/min por debajo del óptimo. Progresión: +5% = <strong>${plus5}</strong> · +10% = <strong>${plus10}</strong>`}`;
}

// ── ROM RODILLA ───────────────────────────────────────────────
// Essential Data Element per Logerstedt JOSPT 2018
// Extensión: 0°=normal · positivo=déficit · negativo=hiperext
// Flexión: normal 130–150°
function calcRodROM() {
  const extD = document.getElementById('rom-ext-d')?.value;
  const extI = document.getElementById('rom-ext-i')?.value;
  const flxD = document.getElementById('rom-flex-d')?.value;
  const flxI = document.getElementById('rom-flex-i')?.value;
  const el   = document.getElementById('rod-rom-result');
  if (!el) return;

  const msgs = [];

  if (extD !== '' && extI !== '') {
    const ed = +extD, ei = +extI;
    const diff = Math.abs(ed - ei);
    // Déficit de extensión: ≥5° vs contralateral → clínicamente relevante (Logerstedt 2018)
    if (ed > 0) msgs.push(`<span style="color:var(--amber)">⚠️ Déficit extensión D: ${ed}° — Clínicamente relevante si ≥5°</span>`);
    if (ei > 0) msgs.push(`<span style="color:var(--amber)">⚠️ Déficit extensión I: ${ei}° — Clínicamente relevante si ≥5°</span>`);
    if (diff >= 5) msgs.push(`<span style="color:var(--red)">⚠️ Asimetría extensión: ${diff}° (D vs I)</span>`);
    if (ed <= 0 && ei <= 0) msgs.push(`<span style="color:var(--neon)">✓ Extensión bilateral dentro de rango normal</span>`);
  }

  if (flxD !== '' && flxI !== '') {
    const fd = +flxD, fi = +flxI;
    const diffF = Math.abs(fd - fi);
    const normalFlx = 130;
    if (fd < normalFlx) msgs.push(`<span style="color:var(--amber)">⚠️ Flexión D: ${fd}° — Reducida (normal ≥130°)</span>`);
    if (fi < normalFlx) msgs.push(`<span style="color:var(--amber)">⚠️ Flexión I: ${fi}° — Reducida (normal ≥130°)</span>`);
    if (diffF >= 10) msgs.push(`<span style="color:var(--red)">⚠️ Asimetría flexión: ${diffF}° (D vs I)</span>`);
    if (fd >= normalFlx && fi >= normalFlx && diffF < 10) msgs.push(`<span style="color:var(--neon)">✓ Flexión bilateral dentro de rango normal</span>`);
  }

  el.innerHTML = msgs.length
    ? msgs.join('<br>')
    : '<span style="color:var(--text3)">Completá los datos de ROM para ver el análisis bilateral</span>';
}

// ── VISA-P (Visentini 1998 / Hernandez-Sanchez 2011 validación española) ─────
// 8 ítems × 0–10: suma max 80 → escalado ×1.25 = 0–100
// 0=peor síntoma / 10=sin síntoma · <80 = sintomático · MCID: 13 pts
function buildVISAP() {
  const c = document.getElementById('visap-fields');
  if (!c || c.innerHTML) return;
  visapVals = new Array(8).fill(0);
  c.innerHTML = VISAP_P_ITEMS.map((item, i) => `
    <div style="padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;font-weight:600;margin-bottom:5px;color:var(--text1)">${i + 1}. ${item.q}</div>
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:10px;color:var(--red);min-width:30px">0</span>
        <input type="range" class="eva-slider" min="0" max="10" value="0" style="flex:1"
          oninput="visapVals[${i}]=+this.value;document.getElementById('vp-val-${i}').textContent=this.value;calcVISAP()">
        <span style="font-size:10px;color:var(--neon);min-width:30px;text-align:right">10</span>
        <div id="vp-val-${i}" style="font-family:var(--mono);font-size:16px;font-weight:800;color:var(--neon);min-width:24px;text-align:center">0</div>
      </div>
    </div>
  `).join('');
}

function calcVISAP() {
  const raw   = visapVals.reduce((a, b) => a + (b || 0), 0); // 0-80
  const total = Math.round(raw * 1.25); // escalado 0-100
  const el    = document.getElementById('visap-total');
  if (el) {
    el.textContent = total;
    el.style.color = total >= 80 ? 'var(--neon)' : total >= 60 ? 'var(--amber)' : 'var(--red)';
  }
  const label = document.getElementById('visap-label');
  if (label) {
    label.textContent = total >= 80 ? 'Asintomático / Normal' :
                        total >= 60 ? 'Síntomas moderados' : 'Síntomas severos';
    label.style.color = total >= 80 ? 'var(--neon)' : total >= 60 ? 'var(--amber)' : 'var(--red)';
  }
}

// ── LYSHOLM (Lysholm 1982 / Tegner 1985) ─────────────────────
// 7 ítems (sin swelling per JOSPT 2018 Rasch) · Max 90 → ×100/90
// ≥95: excelente · 84–94: bueno · 65–83: regular · <65: malo
let lysholmVals = {};
function buildLysholm() {
  const c = document.getElementById('lysholm-fields');
  if (!c || c.innerHTML) return;
  lysholmVals = {};
  c.innerHTML = LYSHOLM_ITEMS.map(item => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;font-weight:600;margin-bottom:5px">${item.label} <span style="font-size:9px;color:var(--text3)">(max ${item.max} pts)</span></div>
      <select class="inp" style="font-size:11px" id="lys-${item.id}" onchange="lysholmVals['${item.id}']=+this.value;calcLysholm()">
        <option value="">— Seleccionar —</option>
        ${item.opciones.map(o => `<option value="${o.val}">${o.txt} (${o.val} pts)</option>`).join('')}
      </select>
    </div>
  `).join('');
}

function calcLysholm() {
  const vals = Object.values(lysholmVals);
  if (vals.length < LYSHOLM_ITEMS.length) return;
  const raw   = vals.reduce((a, b) => a + b, 0); // 0-90
  const total = Math.round(raw / LYSHOLM_MAX * 100);
  const el    = document.getElementById('lysholm-total');
  if (!el) return;
  el.textContent = total;
  el.style.color = total >= 95 ? 'var(--neon)' : total >= 84 ? '#7cd' : total >= 65 ? 'var(--amber)' : 'var(--red)';
  const label = document.getElementById('lysholm-label');
  if (label) {
    const txt = total >= 95 ? 'Excelente' : total >= 84 ? 'Bueno' : total >= 65 ? 'Regular' : 'Malo';
    label.textContent = txt;
    label.style.color = total >= 95 ? 'var(--neon)' : total >= 84 ? '#7cd' : total >= 65 ? 'var(--amber)' : 'var(--red)';
  }
}

// ── TEGNER ACTIVITY LEVEL ─────────────────────────────────────
function buildTegner() {
  const c = document.getElementById('tegner-fields');
  if (!c || c.innerHTML) return;
  const opts = TEGNER_NIVELES.map(n => `<option value="${n.val}">${n.val} — ${n.txt}</option>`).join('');
  c.innerHTML = `
    <div style="padding:8px 0">
      <div style="font-size:10px;color:var(--text3);margin-bottom:6px">📚 Tegner Y & Lysholm J. Clin Orthop 1985. JOSPT 2018 CPG Grado C.</div>
      <select class="inp" style="font-size:11px" id="tegner-sel" onchange="calcTegner(this.value)">
        <option value="">— Seleccionar nivel —</option>
        ${opts}
      </select>
      <div id="tegner-result" style="margin-top:8px;font-size:12px;color:var(--text2)"></div>
    </div>
  `;
  // También llenar el select de nivel pre-lesión
  const pre = document.getElementById('tegner-pre');
  if (pre && pre.options.length <= 1) {
    TEGNER_NIVELES.forEach(n => {
      const o = document.createElement('option');
      o.value = n.val; o.textContent = `${n.val} — ${n.txt}`;
      pre.appendChild(o);
    });
  }
}

function calcTegner(val) {
  const el = document.getElementById('tegner-result');
  if (!el) return;
  const v = +val;
  const c = v >= 8 ? 'var(--neon)' : v >= 5 ? 'var(--amber)' : 'var(--red)';
  el.innerHTML = `Nivel Tegner: <strong style="font-family:var(--mono);font-size:16px;color:${c}">${v}</strong> ${v >= 8 ? '— Deporte competitivo' : v >= 5 ? '— Deporte recreativo / trabajo pesado' : '— Actividad limitada'}`;
}

// ── MARX ACTIVITY RATING SCALE (Marx RG et al. AJSM 2001) ────
// 4 ítems · cada uno 0–4 · Total 0–16
// ≥14 = alta demanda · ≥8 = moderado · <8 = baja demanda
let marxVals = {};
function buildMarx() {
  const c = document.getElementById('marx-fields');
  if (!c || c.innerHTML) return;
  marxVals = {};
  c.innerHTML = MARX_ITEMS.map(item => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;font-weight:600;margin-bottom:5px">${item.label}</div>
      <select class="inp" style="font-size:11px" id="marx-${item.id}" onchange="marxVals['${item.id}']=+this.value;calcMarx()">
        <option value="">— Seleccionar —</option>
        ${MARX_FREC.map(f => `<option value="${f.val}">${f.txt} (${f.val})</option>`).join('')}
      </select>
    </div>
  `).join('');
}

function calcMarx() {
  const vals = Object.values(marxVals);
  if (vals.length < MARX_ITEMS.length) return;
  const total = vals.reduce((a, b) => a + b, 0);
  const el    = document.getElementById('marx-total');
  if (!el) return;
  el.textContent = total;
  el.style.color = total >= 14 ? 'var(--neon)' : total >= 8 ? 'var(--amber)' : 'var(--red)';
  const label = document.getElementById('marx-label');
  if (label) {
    const txt = total >= 14 ? 'Alta demanda deportiva' : total >= 8 ? 'Actividad moderada' : 'Baja demanda';
    label.textContent = txt;
    label.style.color = total >= 14 ? 'var(--neon)' : total >= 8 ? 'var(--amber)' : 'var(--red)';
  }
}

// ── KOOS — 42 preguntas completas ─────────────────────────────
// Roos EM et al. JOSPT 1998 · Versión española: Izquierdo-Avino 2010
// Scoring por subescala: (maxPts - suma) / maxPts × 100 → 0–100 (100=mejor)
let koosVals = {};  // { sectionId: { itemId: val } }

function buildKOOS() {
  const c = document.getElementById('koos-fields');
  if (!c || c.innerHTML) return;
  koosVals = {};
  KOOS_SECTIONS.forEach(s => { koosVals[s.id] = {}; });

  c.innerHTML = KOOS_SECTIONS.map(sec => `
    <div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:var(--neon);padding:6px 0;margin-bottom:4px;border-bottom:1px solid var(--border)">${sec.label}</div>
      <div style="font-size:10px;color:var(--text3);margin-bottom:8px;font-style:italic">${sec.instruccion}</div>
      ${sec.items.map((item, idx) => `
        <div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">
          <div style="font-size:10px;font-weight:600;margin-bottom:4px;color:var(--text1)">${item.id}. ${item.q}</div>
          <select class="inp" style="font-size:10px;padding:3px 6px"
            id="koos-${sec.id}-${item.id}"
            onchange="koosVals['${sec.id}']['${item.id}']=+this.value;calcKOOS()">
            <option value="">— Seleccioná —</option>
            ${item.opts.map(o => `<option value="${o.v}">${o.t}</option>`).join('')}
          </select>
        </div>
      `).join('')}
      <div style="display:flex;justify-content:flex-end;align-items:center;padding:6px 0;margin-top:4px">
        <div style="font-size:10px;color:var(--text3);margin-right:8px">${sec.label.split(' ').pop()}</div>
        <div id="koos-sub-${sec.id}" style="font-family:var(--mono);font-size:16px;font-weight:800;color:var(--text3)">—</div>
      </div>
    </div>
  `).join('');
}

function calcKOOS() {
  let allComplete = true;
  KOOS_SECTIONS.forEach(sec => {
    const vals = sec.items.map(item => {
      const v = koosVals[sec.id]?.[item.id];
      return v !== undefined && v !== '' ? +v : null;
    });
    const completedCount = vals.filter(v => v !== null).length;
    if (completedCount < sec.items.length) { allComplete = false; }
    if (completedCount === 0) return;

    const sum = vals.filter(v => v !== null).reduce((a,b) => a+b, 0);
    const maxForCompleted = completedCount * 4;
    const subScore = Math.round((maxForCompleted - sum) / maxForCompleted * 100);

    const el = document.getElementById('koos-sub-' + sec.id);
    if (el) {
      const c = subScore >= 75 ? 'var(--neon)' : subScore >= 50 ? 'var(--amber)' : 'var(--red)';
      el.textContent = subScore;
      el.style.color = c;
    }
    // Actualizar badge de subescala si existe
    const badge = document.getElementById('koos-badge-' + sec.id);
    if (badge) {
      const c = subScore >= 75 ? 'var(--neon)' : subScore >= 50 ? 'var(--amber)' : 'var(--red)';
      const txt = subScore >= 75 ? 'Buena función' : subScore >= 50 ? 'Disfunción moderada' : 'Disfunción severa';
      badge.innerHTML = `<span style="color:${c};font-weight:700;font-family:var(--mono)">${subScore}</span> <span style="font-size:9px;color:${c}">${txt}</span>`;
    }
  });

  // Total promedio si todas completas
  const tot = document.getElementById('koos-total');
  if (tot && allComplete) {
    const subScores = KOOS_SECTIONS.map(sec => {
      const vals = sec.items.map(item => +koosVals[sec.id]?.[item.id] || 0);
      const sum  = vals.reduce((a,b)=>a+b,0);
      return Math.round((sec.maxPts - sum) / sec.maxPts * 100);
    });
    const prom = Math.round(subScores.reduce((a,b)=>a+b,0) / subScores.length);
    tot.textContent = prom;
    tot.style.color = prom >= 75 ? 'var(--neon)' : prom >= 50 ? 'var(--amber)' : 'var(--red)';
  }
}

// ── WOMET — Western Ontario Meniscal Evaluation Tool ──────────
// Kirkley A et al. Clin J Sport Med 2007;17(5):349-356
// 16 ítems VAS 0–100 · 0=sin problema / 100=problema máximo
// Score total: 100 - (suma/1600×100) → 0–100 (100=mejor)
// MCID: 11.1 pts · JOSPT 2018 Grado A — específico para menisco
let wometVals = new Array(16).fill(null);
function buildWOMET() {
  const c = document.getElementById('womet-fields');
  if (!c || c.innerHTML) return;
  wometVals = new Array(16).fill(null);
  let idx = 0;
  c.innerHTML = WOMET_SECTIONS.map(sec => `
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--neon);padding:6px 0;margin-bottom:4px;border-bottom:1px solid var(--border)">${sec.label}</div>
      <div style="font-size:10px;color:var(--text3);margin-bottom:8px;font-style:italic">${sec.instruccion}</div>
      ${sec.items.map(item => {
        const i = idx++;
        return `
        <div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">
          <div style="font-size:10px;font-weight:600;margin-bottom:5px;color:var(--text1)">${item.id}. ${item.q}</div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:9px;color:var(--neon);min-width:24px">0</span>
            <input type="range" class="eva-slider" min="0" max="100" value="0" style="flex:1"
              oninput="wometVals[${i}]=+this.value;document.getElementById('wv-${i}').textContent=this.value;calcWOMET()">
            <span style="font-size:9px;color:var(--red);min-width:36px;text-align:right">100</span>
            <div id="wv-${i}" style="font-family:var(--mono);font-size:14px;font-weight:800;color:var(--neon);min-width:28px;text-align:right">0</div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);margin-top:2px"><span>sin problema</span><span>problema máximo</span></div>
        </div>`;
      }).join('')}
    </div>
  `).join('');
}

function calcWOMET() {
  const vals = wometVals.filter(v => v !== null && v >= 0);
  if (vals.length === 0) return;
  const sum   = vals.reduce((a,b) => a+b, 0);
  const maxPts = vals.length * 100;
  const total = Math.round(100 - (sum / maxPts * 100));
  const el = document.getElementById('womet-total');
  if (el) {
    el.textContent = total;
    el.style.color = total >= 75 ? 'var(--neon)' : total >= 50 ? 'var(--amber)' : 'var(--red)';
  }
  const label = document.getElementById('womet-label');
  if (label) {
    const txt = total >= 75 ? 'Función meniscal buena' : total >= 50 ? 'Disfunción moderada' : 'Disfunción severa';
    label.textContent = `${vals.length}/16 completados${vals.length === 16 ? '' : ' (parcial)'}  · ${txt}`;
    label.style.color = total >= 75 ? 'var(--neon)' : total >= 50 ? 'var(--amber)' : 'var(--red)';
  }
}

// ═══════════════════════════════════════════════════════════════
// INFORME IMPRIMIBLE — Rodilla
// ═══════════════════════════════════════════════════════════════
function _rodillaPrintInforme() {
  if (!cur) { alert('Seleccioná un atleta primero'); return; }

  const nombre   = `${cur.nombre || ''} ${cur.apellido || ''}`.trim();
  const fecha    = new Date().toLocaleDateString('es-AR', {day:'2-digit',month:'long',year:'numeric'});
  const kine     = cur.kine || 'Lic. Emanuel Lezcano';

  // ── Reunir resultados ──
  const lcaResults  = RODILLA_LCA_TESTS.map(t => ({
    ...t, resultado: rodState.lca[t.id],
  })).filter(t => t.resultado !== undefined);

  const spfResults  = RODILLA_SPF_TESTS.map(t => ({
    ...t, resultado: rodState.spf[t.id],
  })).filter(t => t.resultado !== undefined);

  const menResults  = RODILLA_MENISCO_TESTS.map(t => ({
    ...t, resultado: rodState.men[t.id],
  })).filter(t => t.resultado !== undefined);

  const condResults = RODILLA_CONDRAL_TESTS.map(t => ({
    ...t, resultado: rodState.cond[t.id],
  })).filter(t => t.resultado !== undefined);

  const itbsResults = RODILLA_ITBS_TESTS.map(t => ({
    ...t, resultado: rodState.itbs[t.id],
  })).filter(t => t.resultado !== undefined);

  // ── ITBS extras desde DOM ──
  const itbsGrade = rodState.itbs._grade || null;
  const itbsGradeInfo = itbsGrade ? ITBS_STAGES.find(s => s.grade === itbsGrade) : null;
  const itbsRFs = typeof ITBS_RISK_FACTORS !== 'undefined'
    ? ITBS_RISK_FACTORS.filter(rf => document.getElementById('itbs-rf-' + rf.id)?.checked)
    : [];
  const itbsRFPeso  = itbsRFs.reduce((a, rf) => a + rf.peso, 0);
  const itbsMaxPeso = typeof ITBS_RISK_FACTORS !== 'undefined'
    ? ITBS_RISK_FACTORS.reduce((a, rf) => a + rf.peso, 0) : 1;
  const itbsRiskPct = Math.round(itbsRFPeso / itbsMaxPeso * 100);
  const hasITBS = itbsResults.length > 0 || itbsGrade || itbsRFs.length > 0;

  // ── Diagnóstico ──
  const allTests = { ...rodState.lca, ...rodState.spf, ...rodState.men, ...rodState.cond };
  const diagResults = Object.entries(RODILLA_DIAG_LOGIC)
    .map(([k, logic]) => ({ key: k, label: logic.label, ...logic.evaluar(allTests) }))
    .filter(r => r.nivel)
    .sort((a, b) => b.pct - a.pct);

  const totalCompletados = lcaResults.length + spfResults.length + menResults.length + condResults.length + itbsResults.length;

  // ── Escalas desde DOM ──
  const gt = id => { const el = document.getElementById(id); return (el?.textContent?.trim() || '').replace(/[^0-9.\-]/g,'') || '—'; };
  const gv = id => (document.getElementById(id)?.value || '').trim() || '—';

  const visapRaw    = gt('visap-total');
  const kujalaRaw   = gv('kujala-input');
  const koosDolor   = gt('koos-sub-dolor');
  const koosSint    = gt('koos-sub-sintomas');
  const koosAvd     = gt('koos-sub-avd');
  const koosDeporte = gt('koos-sub-deporte');
  const koosQol     = gt('koos-sub-qol');
  const koosTotal   = gt('koos-total');
  const lysholmRaw  = gt('lysholm-total');
  const marxRaw     = gt('marx-total');
  const wometRaw    = gt('womet-total');
  const tegnerVal   = gv('tegner-sel');

  // ── ROM desde DOM ──
  const romExtD  = gv('rom-ext-d');
  const romExtI  = gv('rom-ext-i');
  const romFlexD = gv('rom-flex-d');
  const romFlexI = gv('rom-flex-i');
  const hasROM   = [romExtD, romExtI, romFlexD, romFlexI].some(v => v !== '—');
  const hasScales = [visapRaw, kujalaRaw, lysholmRaw, marxRaw, wometRaw].some(v => v !== '—');

  // ── Paleta de colores (print-safe, hex) ──
  const C = {
    verde:    { bg: '#1a3a25', border: '#39ff7a', text: '#39ff7a' },
    amarillo: { bg: '#332a00', border: '#ffbe00', text: '#ffbe00' },
    rojo:     { bg: '#331515', border: '#ff4646', text: '#ff4646' },
    azul:     { bg: '#0d1e3a', border: '#4d9eff', text: '#4d9eff' },
    gris:     { bg: '#252827', border: '#4a4d4a', text: '#888888' },
  };

  function nivelColor(nivel) {
    if (nivel === 'alto')    return C.rojo;
    if (nivel === 'moderado') return C.amarillo;
    return C.verde;
  }

  function badge(color, txt) {
    return `<span style="display:inline-block;padding:1.5pt 6pt;border:1pt solid ${color.border};border-radius:2pt;font-size:6.5pt;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:${color.bg};color:${color.text}">${txt}</span>`;
  }

  function secHeader(num, title) {
    return `<div style="display:flex;align-items:center;gap:9pt;padding:6pt 9pt;margin-bottom:9pt;background:#2a2e2b;border-left:3pt solid #39ff7a;border-radius:0 3pt 3pt 0"><span style="font-family:monospace;font-size:6pt;font-weight:700;color:#39ff7a;letter-spacing:.1em;opacity:.75">${num}</span><span style="font-size:7.5pt;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#ffffff">${title}</span></div>`;
  }

  function testRow(t, i) {
    const pos = t.resultado === true;
    const bg  = i % 2 === 0 ? '#242725' : '#1f2220';
    const snTxt = t.sn ? `Sn ${t.sn} · Sp ${t.sp}` : '—';
    return `<tr style="background:${bg}">
      <td style="padding:5pt 6pt;font-size:7.5pt;font-weight:700;color:#ddd;white-space:nowrap">${t.nombre}</td>
      <td style="padding:5pt 6pt;text-align:center">${badge(pos ? C.rojo : C.verde, pos ? 'POSITIVO' : 'NEGATIVO')}</td>
      <td style="padding:5pt 6pt;font-size:5.5pt;color:#555">${snTxt}</td>
      <td style="padding:5pt 6pt;font-size:6pt;color:#888;max-width:100pt">${t.interpreta ? t.interpreta(t.resultado) : '—'}</td>
    </tr>`;
  }

  function testTable(title, tests, showSection) {
    if (!showSection || tests.length === 0) return '';
    return `
    <div class="section" style="margin-bottom:9pt">
      ${title}
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:#2a2e2b">
          <th style="padding:4.5pt 6pt;font-size:5.5pt;font-weight:700;letter-spacing:.1em;color:#777;text-transform:uppercase;border-bottom:1pt solid #3a3d3a;text-align:left">TEST</th>
          <th style="padding:4.5pt 6pt;font-size:5.5pt;font-weight:700;letter-spacing:.1em;color:#777;text-transform:uppercase;border-bottom:1pt solid #3a3d3a;text-align:center">RESULTADO</th>
          <th style="padding:4.5pt 6pt;font-size:5.5pt;font-weight:700;letter-spacing:.1em;color:#777;text-transform:uppercase;border-bottom:1pt solid #3a3d3a">Sn / Sp</th>
          <th style="padding:4.5pt 6pt;font-size:5.5pt;font-weight:700;letter-spacing:.1em;color:#777;text-transform:uppercase;border-bottom:1pt solid #3a3d3a">INTERPRETACIÓN</th>
        </tr></thead>
        <tbody>${tests.map((t, i) => testRow(t, i)).join('')}</tbody>
      </table>
    </div>`;
  }

  function scaleRow(label, value, ref, mcid) {
    const isDash = value === '—';
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5pt 7pt;border-bottom:1pt solid #252827">
      <div>
        <div style="font-size:7pt;font-weight:700;color:#ccc">${label}</div>
        ${ref ? `<div style="font-size:5pt;color:#444">${ref}${mcid ? ' · MCID ' + mcid : ''}</div>` : ''}
      </div>
      <div style="font-family:monospace;font-size:${isDash?'9':'13'}pt;font-weight:900;color:${isDash?'#333':'#39ff7a'}">${value}</div>
    </div>`;
  }

  const refs = Object.values(RODILLA_REFS);
  const hasDiag = diagResults.length > 0;
  const hasLCA  = lcaResults.length > 0;
  const hasSPF  = spfResults.length > 0;
  const hasMen  = menResults.length > 0;
  const hasCond = condResults.length > 0;

  // Composite score menisco — 5 elementos JOSPT 2018 (Logerstedt)
  const compKeys = ['catching_locking','mcmurray','hyperext_forzada','flexion_max','jlt'];
  const compScore = compKeys.filter(k => rodState.men[k] === true).length;

  const pageHdr = `<div class="hdr">
    <div style="font-size:9pt;font-weight:900;color:#fff">MOVEMETRICS <span style="font-weight:400;color:#444">·</span> <span style="font-size:6.5pt;font-weight:600;letter-spacing:.1em;color:#39ff7a;text-transform:uppercase">EVALUACIÓN RODILLA</span></div>
    <div style="font-size:6.5pt;color:#555">${nombre} · ${fecha}</div>
  </div>`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación Rodilla — ${nombre}</title>
<style>
  @page { size: A4 portrait; margin: 13mm 16mm 15mm 16mm; }
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; color-adjust:exact !important; }
  body { background:#1a1c1b; color:#e0e0e0; font-family:'Segoe UI',Arial,sans-serif; font-size:8pt; line-height:1.45; }
  .page { width:100%; padding:16pt; }
  .page-break { page-break-before:always; }
  .section { background:#1f2220; border:1pt solid #2e312e; border-radius:5pt; padding:11pt 13pt; margin-bottom:9pt; page-break-inside:avoid; }
  table { width:100%; border-collapse:collapse; }
  th, td { text-align:left; }
  .hdr { display:flex; justify-content:space-between; align-items:center; padding-bottom:8pt; margin-bottom:10pt; border-bottom:1pt solid #2e312e; }
  .no-print { display:flex; }
  @media print { .no-print { display:none !important; } }
</style>
</head>
<body>

<!-- ── TOOLBAR ────────────────────────────────────────────────── -->
<div class="no-print" style="background:#111312;border-bottom:1pt solid #2e312e;padding:10pt 20pt;gap:8pt;align-items:center;position:sticky;top:0;z-index:100">
  <button onclick="window.print()" style="background:#39ff7a;color:#000;border:none;border-radius:4pt;padding:8pt 18pt;font-weight:800;cursor:pointer;font-size:9pt">🖨 Imprimir / Guardar PDF</button>
  <button onclick="toggleEditMode()" id="edit-btn" style="background:#2a2e2b;color:#aaa;border:1pt solid #3a3d3a;border-radius:4pt;padding:8pt 13pt;cursor:pointer;font-size:9pt">✏ Editar</button>
  <span style="font-size:7.5pt;color:rgba(255,255,255,.3);margin-left:8pt">Al imprimir elegí "Guardar como PDF"</span>
</div>

<div id="report-body">

<!-- ── PÁGINA 1 ───────────────────────────────────────────────── -->
<div class="page">

  <!-- PORTADA -->
  <div style="padding-bottom:10pt;margin-bottom:12pt;border-bottom:1.5pt solid #39ff7a">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="font-size:24pt;font-weight:900;letter-spacing:-.5pt;color:#ffffff;line-height:1">MOVEMETRICS</div>
        <div style="font-size:6.5pt;letter-spacing:.26em;color:#39ff7a;font-weight:600;text-transform:uppercase;margin-top:3pt">INFORME DIAGNÓSTICO · EVALUACIÓN DE RODILLA · BASADO EN EVIDENCIA</div>
      </div>
      <div style="text-align:right;line-height:1.8">
        <div style="font-size:5.5pt;letter-spacing:.12em;text-transform:uppercase;color:#555">FECHA</div>
        <div style="font-size:13pt;font-weight:800;color:#e8e8e8;font-family:monospace">${fecha}</div>
        <div style="font-size:6.5pt;color:#666">Evaluador: ${kine}</div>
      </div>
    </div>
  </div>

  <!-- 01 PERFIL -->
  <div class="section">
    ${secHeader('01.', 'PERFIL DEL PACIENTE')}
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:14pt">
      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#39ff7a;text-transform:uppercase;margin-bottom:3pt;opacity:.75">PACIENTE</div>
        <div style="font-size:15pt;font-weight:900;color:#ffffff;line-height:1.1">${nombre}</div>
      </div>
      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#39ff7a;text-transform:uppercase;margin-bottom:3pt;opacity:.75">EDAD</div>
        <div style="font-size:13pt;font-weight:900;color:#fff">${cur?.edad || '?'}<span style="font-size:7pt;color:#666"> A</span></div>
        <div style="font-size:7pt;color:#888">${cur?.deporte || '—'}</div>
      </div>
      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#39ff7a;text-transform:uppercase;margin-bottom:3pt;opacity:.75">MORFOLOGÍA</div>
        <div style="font-size:10pt;font-weight:800;color:#fff">${cur?.peso || '?'}<span style="font-size:7pt;color:#666"> kg</span></div>
        <div style="font-size:9pt;font-weight:700;color:#ccc">${cur?.talla || '?'}<span style="font-size:7pt;color:#666"> cm</span></div>
      </div>
      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#39ff7a;text-transform:uppercase;margin-bottom:3pt;opacity:.75">EVALUACIÓN</div>
        <div style="font-size:8pt;font-weight:700;color:#fff;font-family:monospace">${fecha}</div>
        <div style="font-size:6.5pt;color:#666;margin-top:3pt">${totalCompletados} tests completados</div>
      </div>
    </div>
  </div>

  <!-- 02 ROM -->
  ${hasROM ? `<div class="section">
    ${secHeader('02.', 'RANGO DE MOVIMIENTO ARTICULAR')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12pt">
      <div>
        <div style="font-size:6pt;font-weight:700;letter-spacing:.1em;color:#555;text-transform:uppercase;margin-bottom:5pt">EXTENSIÓN ACTIVA</div>
        <div style="display:flex;gap:18pt;align-items:baseline">
          <div><span style="font-size:5.5pt;color:#555">DERECHA </span><span style="font-size:14pt;font-weight:900;font-family:monospace;color:#e8e8e8">${romExtD !== '—' ? romExtD : '—'}</span><span style="font-size:7pt;color:#444">°</span></div>
          <div><span style="font-size:5.5pt;color:#555">IZQUIERDA </span><span style="font-size:14pt;font-weight:900;font-family:monospace;color:#e8e8e8">${romExtI !== '—' ? romExtI : '—'}</span><span style="font-size:7pt;color:#444">°</span></div>
        </div>
        <div style="font-size:5.5pt;color:#3a3d3a;margin-top:2pt">0°=normal · negativo=hiperext · positivo=déficit</div>
      </div>
      <div>
        <div style="font-size:6pt;font-weight:700;letter-spacing:.1em;color:#555;text-transform:uppercase;margin-bottom:5pt">FLEXIÓN ACTIVA</div>
        <div style="display:flex;gap:18pt;align-items:baseline">
          <div><span style="font-size:5.5pt;color:#555">DERECHA </span><span style="font-size:14pt;font-weight:900;font-family:monospace;color:#e8e8e8">${romFlexD !== '—' ? romFlexD : '—'}</span><span style="font-size:7pt;color:#444">°</span></div>
          <div><span style="font-size:5.5pt;color:#555">IZQUIERDA </span><span style="font-size:14pt;font-weight:900;font-family:monospace;color:#e8e8e8">${romFlexI !== '—' ? romFlexI : '—'}</span><span style="font-size:7pt;color:#444">°</span></div>
        </div>
        <div style="font-size:5.5pt;color:#3a3d3a;margin-top:2pt">Normal: 130–150° · JOSPT 2018 dato esencial</div>
      </div>
    </div>
  </div>` : ''}

  <!-- 03 ANÁLISIS DIAGNÓSTICO -->
  ${hasDiag ? `<div class="section">
    ${secHeader('03.', 'ANÁLISIS DIAGNÓSTICO — PROBABILIDAD POR PATOLOGÍA')}
    <div style="font-size:6.5pt;color:#555;margin-bottom:8pt">Basado en likelihood ratios (LR+/LR–) y criterios CPG. Probabilidad estimada según tests completados. No reemplaza juicio clínico.</div>
    ${diagResults.map(r => {
      const cm = nivelColor(r.nivel);
      const barW = Math.min(r.pct, 100);
      return `<div style="margin-bottom:7pt;padding:7pt 10pt;background:${cm.bg};border:1pt solid ${cm.border};border-radius:4pt">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3pt">
          <div style="font-size:8pt;font-weight:800;color:${cm.text}">${r.label}</div>
          <div style="font-family:monospace;font-size:12pt;font-weight:900;color:${cm.text}">${r.pct}%</div>
        </div>
        <div style="height:4pt;background:rgba(255,255,255,.08);border-radius:2pt;margin-bottom:5pt">
          <div style="height:100%;width:${barW}%;background:${cm.border};border-radius:2pt"></div>
        </div>
        <div style="font-size:6.5pt;color:#aaa">${r.msg}</div>
        ${r.urgente ? `<div style="font-size:7pt;color:#ff4646;font-weight:700;margin-top:3pt">⚠ DERIVACIÓN URGENTE</div>` : ''}
      </div>`;
    }).join('')}
  </div>` : ''}

  <!-- 04 LCA -->
  ${testTable(secHeader('04.', 'TESTS LIGAMENTO CRUZADO ANTERIOR (LCA / LCP)'), lcaResults, hasLCA)}

</div>

${hasSPF || hasMen ? `
<!-- ── PÁGINA 2 ───────────────────────────────────────────────── -->
<div class="page page-break">
  ${pageHdr}

  <!-- 05 SPF -->
  ${testTable(secHeader('05.', 'SÍNDROME DOLOR PATELOFEMORAL (SPF / PFP)'), spfResults, hasSPF)}
  ${hasSPF ? `<div style="margin-top:-4pt;margin-bottom:9pt;padding:6pt 8pt;background:#1a1c1b;border-radius:3pt;border-left:2pt solid #2a5c3a"><span style="font-size:6.5pt;font-weight:700;color:#aaa">Criterios diagnósticos (Willy 2019 JOSPT, Grado A/B): </span><span style="font-size:6.5pt;color:#555">(1) Dolor retro/peripatelar · (2) Reproducción con cuclillas, escaleras o sedentación prolongada · (3) Exclusión patología tibiofemoral.</span></div>` : ''}

  <!-- 06 MENISCO -->
  ${testTable(secHeader('06.', 'MENISCO'), menResults, hasMen)}
  ${hasMen ? `<div style="margin-top:-4pt;margin-bottom:9pt;padding:6pt 8pt;background:#1a1c1b;border-radius:3pt;border-left:2pt solid #2a5c3a">
    <span style="font-size:6.5pt;font-weight:700;color:#aaa">Composite Score JOSPT 2018: </span>
    <span style="font-size:6.5pt;color:#555">Catching/locking + McMurray + Hiperextensión forzada + Flexión máxima + JLT. ≥4 positivos → Sp 90.2% · ≥2 positivos → Sn 76.6%. Presente: <strong style="color:#ffbe00">${compScore}/5</strong>.</span>
  </div>` : ''}

</div>` : ''}

${hasCond ? `
<!-- ── PÁGINA CONDRAL ─────────────────────────────────────────── -->
<div class="page page-break">
  ${pageHdr}

  <!-- 07 CONDRAL -->
  ${testTable(secHeader('07.', 'LESIÓN CONDRAL / OSTEOCONDRAL'), condResults, true)}
  <div style="margin-top:-4pt;margin-bottom:9pt;padding:6pt 8pt;background:#331515;border-radius:3pt;border-left:2pt solid #ff4646">
    <span style="font-size:6.5pt;font-weight:700;color:#ff8888">Nota clínica (Wilk 2006 / Logerstedt 2018): </span>
    <span style="font-size:6.5pt;color:#888">No existen pruebas físicas de alta Sn/Sp para lesión condral focal. Diagnóstico definitivo por RMN (Sn &gt;80% para lesiones ≥1cm²). Hemarthrosis &lt;2h post-trauma = alta sospecha fractura osteocondral. Ottawa Knee Rules: Sn 0.99, Sp 0.49 (Stiell 1995).</span>
  </div>

</div>` : ''}

${hasScales ? `
<!-- ── PÁGINA ESCALAS ─────────────────────────────────────────── -->
<div class="page page-break">
  ${pageHdr}

  <!-- 08 ESCALAS -->
  <div class="section">
    ${secHeader('08.', 'ESCALAS AUTORREPORTADAS Y FUNCIONALES')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14pt">

      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#39ff7a;text-transform:uppercase;margin-bottom:5pt;opacity:.75">PATELOFEMORAL / SPF</div>
        ${scaleRow('VISA-P Score', visapRaw !== '—' ? visapRaw + '/100' : '—', 'Hernandez-Sanchez 2014', '12 pts')}
        ${scaleRow('Kujala / AKPS', kujalaRaw !== '—' ? kujalaRaw + '/100' : '—', 'Kujala 1993 · función patelofemoral', '8–10 pts')}
      </div>

      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#39ff7a;text-transform:uppercase;margin-bottom:5pt;opacity:.75">FUNCIÓN / ACTIVIDAD</div>
        ${scaleRow('Lysholm Score', lysholmRaw !== '—' ? lysholmRaw + '/100' : '—', 'Lysholm 1982 · LCA / menisco', '10 pts')}
        ${scaleRow('Tegner Activity', tegnerVal !== '—' ? 'Nivel ' + tegnerVal + ' / 10' : '—', 'Tegner & Lysholm 1985', '1 nivel')}
        ${scaleRow('Marx Activity Rating', marxRaw !== '—' ? marxRaw + '/16' : '—', 'Marx et al. AJSM 2001 · RTP', '4 pts')}
      </div>

      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#39ff7a;text-transform:uppercase;margin-bottom:5pt;opacity:.75">KOOS — SUBESCALAS (0–100 mejor)</div>
        ${scaleRow('Dolor (Pain)', koosDolor !== '—' ? koosDolor + '/100' : '—', 'Roos 1998', '10')}
        ${scaleRow('Síntomas', koosSint !== '—' ? koosSint + '/100' : '—', '', '')}
        ${scaleRow('AVD', koosAvd !== '—' ? koosAvd + '/100' : '—', 'Actividades de la vida diaria', '9')}
        ${scaleRow('Deporte / Recreación', koosDeporte !== '—' ? koosDeporte + '/100' : '—', '', '12')}
        ${scaleRow('Calidad de Vida (QoL)', koosQol !== '—' ? koosQol + '/100' : '—', '', '10')}
        <div style="display:flex;justify-content:space-between;align-items:center;padding:7pt 7pt;background:#2a2e2b;border-radius:3pt;margin-top:4pt">
          <span style="font-size:7pt;font-weight:700;color:#aaa">KOOS Promedio Total</span>
          <span style="font-family:monospace;font-size:16pt;font-weight:900;color:${koosTotal !== '—' ? '#39ff7a' : '#333'}">${koosTotal !== '—' ? koosTotal : '—'}</span>
        </div>
      </div>

      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#39ff7a;text-transform:uppercase;margin-bottom:5pt;opacity:.75">MENISCO</div>
        ${scaleRow('WOMET Score', wometRaw !== '—' ? wometRaw + '/100' : '—', 'Kirkley 1998 · Western Ontario', '11–15 pts')}

        ${(diagResults.length > 0 || totalCompletados > 0) ? `
        <div style="margin-top:12pt">
          <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#39ff7a;text-transform:uppercase;margin-bottom:5pt;opacity:.75">RESUMEN DE EVALUACIÓN</div>
          <div style="font-size:7pt;color:#888;line-height:1.7;padding:7pt;background:#1f2220;border-radius:3pt;border:1pt solid #2e312e">
            Tests completados: <strong style="color:#ccc">${totalCompletados}</strong><br>
            ${diagResults.length > 0 ? `Hallazgos principales: <strong style="color:#ccc">${diagResults.slice(0,2).map(r => r.label + ' ' + r.pct + '%').join(' · ')}</strong>` : 'Sin hallazgos diagnósticos registrados.'}
          </div>
        </div>` : ''}
      </div>

    </div>
  </div>

</div>` : ''}

${hasITBS ? `
<!-- ── SECCIÓN ITBS ─────────────────────────────────────────── -->
<div class="page page-break">
  ${pageHdr}

  <!-- 09 SFBI / ITBS -->
  <div class="section">
    ${secHeader('09.', 'SÍNDROME DE FRICCIÓN DE LA BANDA ILIOTIBIAL (SFBI)')}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12pt;margin-bottom:10pt">
      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#ffbe00;text-transform:uppercase;margin-bottom:6pt;opacity:.9">ESTADIFICACIÓN CLÍNICA</div>
        ${itbsGradeInfo ? `
        <div style="padding:8pt 10pt;background:#2a2600;border:1pt solid #ffbe00;border-radius:4pt">
          <div style="font-size:9pt;font-weight:800;color:#ffbe00">${itbsGradeInfo.label}</div>
          <div style="font-size:7.5pt;color:#bbb;margin-top:3pt;line-height:1.5">${itbsGradeInfo.desc}</div>
        </div>` : `<div style="font-size:7.5pt;color:#555;font-style:italic">Sin estadificación registrada</div>`}

        <div style="margin-top:10pt">
          <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#ffbe00;text-transform:uppercase;margin-bottom:5pt;opacity:.9">PERFIL DE RIESGO</div>
          ${itbsRFs.length > 0 ? `
          <div style="padding:7pt 9pt;background:#2a2600;border-radius:3pt;border:1pt solid rgba(255,190,0,.3)">
            <div style="font-size:8pt;color:#ffbe00;font-weight:700;margin-bottom:4pt">
              ${itbsRiskPct >= 65 ? 'Alto' : itbsRiskPct >= 35 ? 'Moderado' : 'Bajo'} — ${itbsRiskPct}%
            </div>
            ${itbsRFs.map(rf => `<div style="font-size:7pt;color:#aaa;line-height:1.7">• ${rf.label}</div>`).join('')}
          </div>` : `<div style="font-size:7pt;color:#555;font-style:italic">Sin factores de riesgo registrados</div>`}
        </div>
      </div>

      <div>
        <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#ffbe00;text-transform:uppercase;margin-bottom:6pt;opacity:.9">TESTS CLÍNICOS (${itbsResults.length} completados)</div>
        ${itbsResults.length > 0 ? itbsResults.map(t => {
          const pos = t.resultado === true;
          const col = pos ? '#ff4646' : '#39ff7a';
          const bg  = pos ? '#331515' : '#1a3a25';
          return `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:5pt 7pt;margin-bottom:4pt;background:${bg};border-radius:3pt;border:1pt solid ${col}">
            <div>
              <div style="font-size:7pt;font-weight:700;color:${col}">${t.nombre}</div>
              <div style="font-size:5.5pt;color:#888;margin-top:1pt">${t.referencia}</div>
            </div>
            <span style="font-size:8pt;font-weight:800;color:${col};white-space:nowrap">${pos ? 'POS' : 'NEG'}</span>
          </div>`;
        }).join('') : `<div style="font-size:7.5pt;color:#555;font-style:italic">Sin tests completados</div>`}

        <div style="margin-top:10pt">
          <div style="font-size:5.5pt;font-weight:700;letter-spacing:.12em;color:#4d9eff;text-transform:uppercase;margin-bottom:5pt;opacity:.9">EVIDENCIA PRONÓSTICA</div>
          <div style="font-size:7pt;color:#aaa;line-height:1.9;padding:7pt;background:#0d1e3a;border-radius:3pt;border:1pt solid rgba(77,158,255,.2)">
            44% curación a 8 semanas · 91.7% a 6 meses (Beals & Flanigan 2013)<br>
            Hip Abductor Strengthening (HAS): ↓27-100% dolor en 2-8 sem (Sanchez-Alvarado 2024)<br>
            McKay 2020 pilot RCT: HAS superior a estiramiento y ejercicio convencional
          </div>
        </div>
      </div>
    </div>

    <div style="font-size:5.5pt;color:#3a3d3a;font-style:italic;line-height:1.6;padding:5pt 7pt;background:#1a1c1b;border-radius:3pt;border:1pt solid #222">
      📚 Noble CA. Am J Sports Med 1980 · Sanchez-Alvarado A et al. Front Sports Act Living 2024;6:1386456 · Beals C & Flanigan D. J Sports Med 2013 · McKay J et al. BMC Sports Sci Med Rehab 2020
    </div>
  </div>
</div>` : ''}

<!-- ── PÁGINA FINAL ────────────────────────────────────────────── -->
<div class="page page-break">
  ${pageHdr}

  <!-- 10 JUICIO CLÍNICO -->
  <div class="section">
    ${secHeader('10.', 'JUICIO CLÍNICO INTEGRADOR')}
    <div style="padding:10pt 12pt;background:#1a1c1b;border:1pt solid #2e312e;border-radius:4pt;margin-bottom:9pt;min-height:50pt">
      <div style="font-size:7.5pt;color:#bbb;line-height:1.9">
        ${nombre} presenta una evaluación de rodilla con ${totalCompletados} tests completados.
        ${diagResults.length > 0 ? `Los hallazgos de mayor probabilidad diagnóstica son: <strong style="color:#fff">${diagResults.slice(0, 3).map(r => r.label + ' (' + r.pct + '%)').join(', ')}</strong>.` : 'Sin tests diagnósticos registrados.'}
        ${diagResults.find(r => r.urgente) ? ' <strong style="color:#ff4646">⚠ Se detecta hallazgo urgente — derivar inmediatamente.</strong>' : ''}
      </div>
    </div>
    <div style="font-size:6pt;color:#555;font-style:italic;padding:5pt 8pt;background:#1a1c1b;border-radius:3pt;line-height:1.6">
      ⚠ Este informe no reemplaza el juicio clínico del profesional tratante. Los valores de corte (Sn/Sp/LR) provienen de los estudios referenciados. La probabilidad es una estimación basada en likelihood ratios y no constituye diagnóstico definitivo. Lesiones condrales requieren confirmación por RMN.
    </div>
  </div>

  <!-- 10 BIBLIOGRAFÍA -->
  <div class="section">
    ${secHeader('11.', 'BIBLIOGRAFÍA')}
    <div>
      ${refs.map((r, i) => `<div style="font-size:5.5pt;color:#555;padding:2.5pt 0;border-bottom:1pt solid #222">[${i + 1}] ${r}</div>`).join('')}
    </div>
  </div>

  <!-- FIRMA -->
  <div style="margin-top:20pt;padding-top:10pt;border-top:1pt solid #2e312e;display:flex;justify-content:space-between;align-items:flex-end">
    <div style="font-size:6pt;color:#3a3d3a">
      <div>MOVEMETRICS · Kinesiología basada en evidencia</div>
      <div>CPG: Willy 2019 JOSPT · Logerstedt 2018 · Stiell 1995</div>
    </div>
    <div style="text-align:right">
      <div style="width:130pt;border-top:1pt solid #3a3d3a;margin-bottom:4pt"></div>
      <div style="font-size:8pt;font-weight:700;color:#ccc">${kine}</div>
      <div style="font-size:6pt;color:#444">Kinesiólogo/a · Fecha: ${fecha}</div>
    </div>
  </div>

</div>

</div><!-- /report-body -->

<script>
function toggleEditMode() {
  const body = document.getElementById('report-body');
  const btn  = document.getElementById('edit-btn');
  const editing = body.contentEditable === 'true';
  body.contentEditable = editing ? 'false' : 'true';
  body.style.outline   = editing ? 'none' : '2px dashed rgba(57,255,122,.35)';
  btn.textContent      = editing ? '✏ Editar' : '✓ Listo';
  btn.style.background = editing ? '#2a2e2b' : '#1a3a25';
  btn.style.color      = editing ? '#aaa' : '#39ff7a';
}
</script>

</body>
</html>`;

  const win = window.open('', '_blank', 'width=960,height=860,resizable=yes,scrollbars=yes');
  if (!win) { alert('Popup bloqueado. Habilitá popups para este sitio.'); return; }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.onload = () => { try { win.print(); } catch(e) {} };
}
window._rodillaPrintInforme = _rodillaPrintInforme;

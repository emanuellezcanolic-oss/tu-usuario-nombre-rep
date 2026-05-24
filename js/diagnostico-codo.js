// js/diagnostico-codo.js
// Motor de inferencia para diagnóstico diferencial de codo
// Requires: papers-codo-rules.js (CODO_RULES), lesion.js (CODO_TESTS_*), codo.js (codoState)

// positivosIds: string[] — IDs de tests positivos
// symptomIds:  string[] — IDs de síntomas marcados en checklist
function diagnosticarCodo(positivosIds, symptomIds) {
  const pos  = new Set(positivosIds  || []);
  const symp = new Set(symptomIds    || []);
  const resultado = { banderasRojas: [], diagnosticos: [] };

  CODO_RULES.diagnosticos.forEach(dx => {
    const mainHits    = dx.testsKey.filter(t => pos.has(t));
    const supportHits = dx.testsSupportKey.filter(t => pos.has(t));
    const symptomHits = (dx.symptomKeys || []).filter(s => symp.has(s));

    // Test-based threshold (same as hombro)
    const meetsTestThreshold = mainHits.length >= dx.umbral ||
      (mainHits.length >= 1 && supportHits.length >= 2);

    // Symptom-based threshold
    const meetsSymptomThreshold = dx.umbral === 0
      ? symptomHits.length >= (dx.symptomUmbral || 1)
      : symptomHits.length >= (dx.symptomUmbral || 2);

    const shouldInclude = meetsTestThreshold || meetsSymptomThreshold;
    if (!shouldInclude) return;

    // Confidence: 70% weight tests, 20% symptoms, 10% context
    const mainRatio    = mainHits.length    / Math.max(dx.testsKey.length, 1);
    const supportRatio = supportHits.length / Math.max(dx.testsSupportKey.length, 1);
    const symptomRatio = symptomHits.length / Math.max((dx.symptomKeys || []).length, 1);

    const confidence = Math.min(100, Math.round(
      (mainRatio * 0.55 + supportRatio * 0.15 + symptomRatio * 0.30) * 100
    ));

    let confianzaLabel, confianzaColor, source;
    if (meetsTestThreshold && meetsSymptomThreshold) {
      source = 'tests + clínica';
    } else if (meetsTestThreshold) {
      source = 'tests ortopédicos';
    } else {
      source = 'presentación clínica';
    }

    if (confidence >= 65) { confianzaLabel = 'Alta probabilidad';    confianzaColor = 'var(--neon)'; }
    else if (confidence >= 35) { confianzaLabel = 'Sospecha moderada'; confianzaColor = 'var(--amber)'; }
    else { confianzaLabel = 'Posible';                                  confianzaColor = 'var(--text2)'; }

    resultado.diagnosticos.push({
      ...dx, mainHits, supportHits, symptomHits, confidence,
      confianzaLabel, confianzaColor, source,
      bySymptomOnly: !meetsTestThreshold && meetsSymptomThreshold
    });
  });

  resultado.diagnosticos.sort((a, b) => b.confidence - a.confidence);
  return resultado;
}

function _colorForKeyC(key) {
  const map = {
    red: 'var(--red)', neon: 'var(--neon)', amber: 'var(--amber)',
    blue: '#60a5fa', orange: '#fb923c', text: 'var(--text2)'
  };
  return map[key] || 'var(--text)';
}

function _tagClassForCategoriaC(cat) {
  const map = {
    'Lateral':        'tag-r',
    'Medial':         'tag-y',
    'Neural':         'tag-b',
    'Inestabilidad':  'tag-y',
    'Articular':      'tag-b'
  };
  return map[cat] || '';
}

// positivosOverride: string[] | undefined
// symptomsOverride:  string[] | undefined
function renderDiagnosticosCodo(positivosOverride, symptomsOverride) {
  const card = document.getElementById('kine-dx-codo-card');
  if (!card) return;

  let positivos, symptoms;

  if (positivosOverride !== undefined) {
    positivos = positivosOverride;
  } else {
    // Fallback: read from kineState if available
    const codoIds = new Set([
      ...(typeof CODO_TESTS_LATERAL !== 'undefined' ? CODO_TESTS_LATERAL : []).map(t => t.id),
      ...(typeof CODO_TESTS_MEDIAL  !== 'undefined' ? CODO_TESTS_MEDIAL  : []).map(t => t.id),
      ...(typeof CODO_TESTS_NEURAL  !== 'undefined' ? CODO_TESTS_NEURAL  : []).map(t => t.id)
    ]);
    positivos = typeof kineState !== 'undefined'
      ? Object.entries(kineState.tests)
          .filter(([id, v]) => v.result === 'pos' && codoIds.has(id))
          .map(([id]) => id)
      : [];
  }

  symptoms = symptomsOverride !== undefined ? symptomsOverride : _getCodoSelectedSymptoms();

  if (positivos.length === 0 && symptoms.length === 0) {
    card.style.display = 'none';
    return;
  }

  const resultado = diagnosticarCodo(positivos, symptoms);

  if (resultado.diagnosticos.length === 0) {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'block';

  const allTests = [
    ...(typeof CODO_TESTS_LATERAL !== 'undefined' ? CODO_TESTS_LATERAL : []),
    ...(typeof CODO_TESTS_MEDIAL  !== 'undefined' ? CODO_TESTS_MEDIAL  : []),
    ...(typeof CODO_TESTS_NEURAL  !== 'undefined' ? CODO_TESTS_NEURAL  : [])
  ];
  const nameOfTest = id => (allTests.find(t => t.id === id)?.name || id);
  const nameOfSymp = id => ((typeof CODO_SYMPTOMS !== 'undefined' ? CODO_SYMPTOMS : []).find(s => s.id === id)?.label || id);

  let html = `
  <div class="card" style="margin-top:16px;border:1px solid var(--neon);border-radius:var(--r)">
    <div class="card-header" style="background:rgba(57,255,122,.06)">
      <h3 style="display:flex;align-items:center;gap:8px">
        <span>🔬</span> Diagnóstico diferencial de codo
      </h3>
      <span class="tag tag-y">EBM · ${positivos.length} test${positivos.length !== 1 ? 's' : ''} · ${symptoms.length} síntoma${symptoms.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="card-body">`;

  resultado.diagnosticos.forEach((dx, i) => {
    const isTop   = i === 0;
    const dxColor = _colorForKeyC(dx.colorKey);
    const tagCls  = _tagClassForCategoriaC(dx.categoria);
    const border  = isTop ? 'border-color:var(--neon)' : 'border-color:var(--border)';
    const bg      = isTop ? 'background:rgba(57,255,122,.04)' : '';
    const symBadge = dx.bySymptomOnly
      ? `<span style="font-size:9px;background:rgba(251,146,60,.15);color:#fb923c;padding:1px 5px;border-radius:3px;margin-left:4px">Sospecha clínica</span>`
      : '';

    html += `
    <div style="border:1px solid var(--border);${border};${bg};border-radius:var(--r);padding:12px;margin-bottom:10px">
      <div class="flex-b" style="align-items:flex-start;gap:8px">
        <div>
          <span style="font-size:13px;font-weight:700;color:${dxColor}">${isTop ? '🏆 ' : ''}${dx.nombre}</span>
          <span class="tag ${tagCls}" style="margin-left:6px;font-size:9px">${dx.categoria}</span>
          ${symBadge}
        </div>
        <span style="font-size:10px;color:${dx.confianzaColor};font-weight:600;white-space:nowrap">${dx.confianzaLabel}</span>
      </div>

      <div style="margin-top:4px;font-size:9px;color:var(--text3)">Basado en: ${dx.source}</div>
      <div style="margin-top:6px;font-size:11px;color:var(--text2);line-height:1.4">${dx.criterio}</div>

      <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">
        ${dx.mainHits.map(t    => `<span class="tag tag-r" style="font-size:9px">✚ ${nameOfTest(t)}</span>`).join('')}
        ${dx.supportHits.map(t => `<span class="tag tag-y" style="font-size:9px">+ ${nameOfTest(t)}</span>`).join('')}
        ${dx.symptomHits.map(s => `<span class="tag tag-b" style="font-size:9px">Sx: ${nameOfSymp(s)}</span>`).join('')}
      </div>

      <details style="margin-top:10px">
        <summary style="font-size:10px;color:var(--text3);cursor:pointer;user-select:none">
          Ver evidencia y tratamiento
        </summary>
        <div style="margin-top:8px;padding:8px;background:var(--bg3);border-radius:4px">
          <div style="font-size:10px;color:var(--text2);line-height:1.5;white-space:pre-line">${dx.evidencia}</div>
        </div>
        <div style="margin-top:8px;padding:8px;background:rgba(57,255,122,.07);border-left:2px solid var(--neon);border-radius:4px">
          <div style="font-size:10px;font-weight:600;color:var(--neon);margin-bottom:4px">Tratamiento recomendado (CPG 2022)</div>
          <div style="font-size:10px;color:var(--text);line-height:1.5">${dx.tratamiento}</div>
        </div>
        <div style="margin-top:6px;font-size:9px;color:var(--text3);font-style:italic;line-height:1.4">${dx.ref}</div>
      </details>
    </div>`;
  });

  html += `
      <div style="font-size:9px;color:var(--text3);text-align:center;margin-top:4px;padding-top:8px;border-top:1px solid var(--border)">
        Algoritmo basado en CPG JOSPT 2022 · Tahir et al. Cureus 2026 · Bobos et al. Arch PMR 2019 · No reemplaza el juicio clínico
      </div>
    </div>
  </div>`;

  card.innerHTML = html;
}

window.diagnosticarCodo        = diagnosticarCodo;
window.renderDiagnosticosCodo  = renderDiagnosticosCodo;

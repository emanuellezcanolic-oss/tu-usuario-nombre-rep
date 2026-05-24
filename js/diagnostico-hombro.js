// js/diagnostico-hombro.js
// Motor de inferencia para diagnóstico diferencial de hombro
// Requires: papers-hombro-rules.js (HOMBRO_RULES), ortho-tests.js (ORTHO_TESTS), kine.js (kineState)

function diagnosticarHombro(positivosIds) {
  const pos = new Set(positivosIds);
  const resultado = { banderasRojas: [], diagnosticos: [] };

  // Puntuar diagnósticos
  HOMBRO_RULES.diagnosticos.forEach(dx => {
    const mainHits    = dx.testsKey.filter(t => pos.has(t));
    const supportHits = dx.testsSupportKey.filter(t => pos.has(t));

    const meetsThreshold = mainHits.length >= dx.umbral ||
      (mainHits.length >= 1 && supportHits.length >= 2);

    if (!meetsThreshold) return;

    const mainRatio    = mainHits.length    / Math.max(dx.testsKey.length, 1);
    const supportRatio = supportHits.length / Math.max(dx.testsSupportKey.length, 1);
    const confidence   = Math.min(100, Math.round((mainRatio * 0.70 + supportRatio * 0.30) * 100));

    let confianzaLabel, confianzaColor;
    if (confidence >= 65) { confianzaLabel = 'Alta probabilidad';    confianzaColor = 'var(--neon)'; }
    else if (confidence >= 35) { confianzaLabel = 'Sospecha moderada'; confianzaColor = 'var(--amber)'; }
    else { confianzaLabel = 'Posible';                                 confianzaColor = 'var(--text2)'; }

    resultado.diagnosticos.push({
      ...dx, mainHits, supportHits, confidence, confianzaLabel, confianzaColor
    });
  });

  resultado.diagnosticos.sort((a, b) => b.confidence - a.confidence);
  return resultado;
}

function _colorForKeyH(key) {
  const map = {
    red: 'var(--red)', neon: 'var(--neon)', amber: 'var(--amber)',
    blue: '#60a5fa', orange: '#fb923c', text: 'var(--text)'
  };
  return map[key] || 'var(--text)';
}

function _tagClassForCategoriaH(cat) {
  const map = {
    'Urgencia':         'tag-r',
    'Manguito Rotador': 'tag-r',
    'Subacromial':      'tag-b',
    'Labrum':           'tag-y',
    'Inestabilidad':    'tag-y',
    'Biceps':           'tag-b'
  };
  return map[cat] || '';
}

// positivosOverride: optional string[] — used by hombro modal to pass tests directly.
// If omitted, falls back to kineState.tests (kine panel behaviour, unchanged).
function renderDiagnosticosHombro(positivosOverride) {
  const card = document.getElementById('kine-dx-hombro-card');
  if (!card) return;

  let positivos;
  if (positivosOverride) {
    positivos = positivosOverride;
  } else {
    // Original path: read from kine panel kineState
    const hombroIds = new Set([
      ...(ORTHO_TESTS.subacro  || []).map(t => t.id),
      ...(ORTHO_TESTS.manguito || []).map(t => t.id),
      ...(ORTHO_TESTS.biceps   || []).map(t => t.id)
    ]);
    positivos = Object.entries(kineState.tests)
      .filter(([id, v]) => v.result === 'pos' && hombroIds.has(id))
      .map(([id]) => id);
  }

  if (positivos.length === 0) { card.style.display = 'none'; return; }

  const resultado = diagnosticarHombro(positivos);

  if (resultado.diagnosticos.length === 0) {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'block';

  // Flat list of all hombro tests for name lookup — includes HOMBRO_TESTS (modal) + painful-arc
  const allTests = [
    ...(ORTHO_TESTS.subacro  || []),
    ...(ORTHO_TESTS.manguito || []),
    ...(ORTHO_TESTS.biceps   || []),
    ...(typeof HOMBRO_TESTS !== 'undefined' ? HOMBRO_TESTS : []),
    { id:'painful-arc', name:'Arco Doloroso' }
  ];
  const nameOf = id => (allTests.find(t => t.id === id)?.name || id);

  let html = `
  <div class="card" style="margin-top:16px;border:1px solid var(--neon);border-radius:var(--r)">
    <div class="card-header" style="background:rgba(57,255,122,.06)">
      <h3 style="display:flex;align-items:center;gap:8px">
        <span>🔬</span> Diagnóstico diferencial de hombro
      </h3>
      <span class="tag tag-y">Algoritmo EBM · ${positivos.length} test${positivos.length > 1 ? 's' : ''} positivo${positivos.length > 1 ? 's' : ''}</span>
    </div>
    <div class="card-body">`;

  resultado.diagnosticos.forEach((dx, i) => {
    const isTop   = i === 0;
    const dxColor = _colorForKeyH(dx.colorKey);
    const tagCls  = _tagClassForCategoriaH(dx.categoria);
    const border  = isTop ? 'border-color:var(--neon)' : 'border-color:var(--border)';
    const bg      = isTop ? 'background:rgba(57,255,122,.04)' : '';

    html += `
    <div style="border:1px solid var(--border);${border};${bg};border-radius:var(--r);padding:12px;margin-bottom:10px">
      <div class="flex-b" style="align-items:flex-start;gap:8px">
        <div>
          <span style="font-size:13px;font-weight:700;color:${dxColor}">${isTop ? '🏆 ' : ''}${dx.nombre}</span>
          <span class="tag ${tagCls}" style="margin-left:6px;font-size:9px">${dx.categoria}</span>
        </div>
        <span style="font-size:10px;color:${dx.confianzaColor};font-weight:600;white-space:nowrap">${dx.confianzaLabel}</span>
      </div>

      <div style="margin-top:6px;font-size:11px;color:var(--text2);line-height:1.4">${dx.criterio}</div>

      <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">
        ${dx.mainHits.map(t    => `<span class="tag tag-r" style="font-size:9px">+ ${nameOf(t)}</span>`).join('')}
        ${dx.supportHits.map(t => `<span class="tag tag-y" style="font-size:9px">+ ${nameOf(t)}</span>`).join('')}
      </div>

      <details style="margin-top:10px">
        <summary style="font-size:10px;color:var(--text3);cursor:pointer;user-select:none">
          Ver evidencia y tratamiento
        </summary>
        <div style="margin-top:8px;padding:8px;background:var(--bg3);border-radius:4px">
          <div style="font-size:10px;color:var(--text2);line-height:1.5;white-space:pre-line">${dx.evidencia}</div>
        </div>
        <div style="margin-top:8px;padding:8px;background:rgba(57,255,122,.07);border-left:2px solid var(--neon);border-radius:4px">
          <div style="font-size:10px;font-weight:600;color:var(--neon);margin-bottom:4px">Tratamiento recomendado</div>
          <div style="font-size:10px;color:var(--text);line-height:1.5">${dx.tratamiento}</div>
        </div>
        <div style="margin-top:6px;font-size:9px;color:var(--text3);font-style:italic;line-height:1.4">${dx.ref}</div>
      </details>
    </div>`;
  });

  html += `
      <div style="font-size:9px;color:var(--text3);text-align:center;margin-top:4px;padding-top:8px;border-top:1px solid var(--border)">
        Algoritmo basado en 4 revisiones sistemáticas / meta-análisis · No reemplaza el juicio clínico
      </div>
    </div>
  </div>`;

  card.innerHTML = html;
}

window.diagnosticarHombro       = diagnosticarHombro;
window.renderDiagnosticosHombro = renderDiagnosticosHombro;

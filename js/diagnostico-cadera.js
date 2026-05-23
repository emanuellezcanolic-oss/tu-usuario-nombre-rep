// js/diagnostico-cadera.js
// Motor de inferencia para diagnóstico diferencial de cadera
// Requires: papers-cadera-rules.js (CADERA_RULES), ortho-tests.js (ORTHO_TESTS), kine.js (kineState)

function diagnosticarCadera(positivosIds) {
  const pos = new Set(positivosIds);
  const resultado = { banderasRojas: [], diagnosticos: [] };

  // Banderas rojas por tests positivos
  CADERA_RULES.banderasRojas.forEach(b => {
    if (b.triggerTests.length > 0 && b.triggerTests.some(t => pos.has(t))) {
      resultado.banderasRojas.push(b);
    }
  });

  // Puntuar diagnósticos
  CADERA_RULES.diagnosticos.forEach(dx => {
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

function _colorForKey(key) {
  const map = {
    red: 'var(--red)', neon: 'var(--neon)', amber: 'var(--amber)',
    blue: '#60a5fa', orange: '#fb923c', text: 'var(--text)'
  };
  return map[key] || 'var(--text)';
}

function _tagClassForCategoria(cat) {
  const map = {
    'Urgencia':        'tag-r',
    'Intraarticular':  'tag-y',
    'Extraarticular':  'tag-b',
    'Ingle deportiva': 'tag-g',
    'Degenerativa':    ''
  };
  return map[cat] || '';
}

function renderDiagnosticosCadera() {
  const card = document.getElementById('kine-dx-cadera-card');
  if (!card) return;

  // Collect all cadera-related test IDs
  const caderaIds = new Set([
    ...(ORTHO_TESTS.cadera            || []).map(t => t.id),
    ...(ORTHO_TESTS.caderaGluteal     || []).map(t => t.id),
    ...(ORTHO_TESTS.caderaFractura    || []).map(t => t.id),
    ...(ORTHO_TESTS.caderaOA          || []).map(t => t.id),
    ...(ORTHO_TESTS.dohaAductores     || []).map(t => t.id),
    ...(ORTHO_TESTS.dohaPsoas         || []).map(t => t.id),
    ...(ORTHO_TESTS.dohaInguinal      || []).map(t => t.id),
    ...(ORTHO_TESTS.dohaComplementarios || []).map(t => t.id)
  ]);

  const positivos = Object.entries(kineState.tests)
    .filter(([id, v]) => v.result === 'pos' && caderaIds.has(id))
    .map(([id]) => id);

  if (positivos.length === 0) { card.style.display = 'none'; return; }

  const resultado = diagnosticarCadera(positivos);

  if (resultado.diagnosticos.length === 0 && resultado.banderasRojas.length === 0) {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'block';

  // ── Build HTML ──────────────────────────────────────────────────────────
  let html = `
  <div class="card" style="margin-top:16px;border:1px solid var(--neon);border-radius:var(--r)">
    <div class="card-header" style="background:rgba(57,255,122,.06)">
      <h3 style="display:flex;align-items:center;gap:8px">
        <span>🔬</span> Diagnóstico diferencial de cadera
      </h3>
      <span class="tag tag-y">Algoritmo EBM · ${positivos.length} test${positivos.length > 1 ? 's' : ''} positivo${positivos.length > 1 ? 's' : ''}</span>
    </div>
    <div class="card-body">`;

  // ── Red flags ────────────────────────────────────────────────────────────
  if (resultado.banderasRojas.length > 0) {
    html += `
    <div style="background:rgba(255,68,68,.12);border:1px solid var(--red);border-radius:var(--r);padding:12px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:var(--red);margin-bottom:8px">⚠️ BANDERAS ROJAS — ACCIÓN INMEDIATA</div>`;
    resultado.banderasRojas.forEach(b => {
      html += `<div style="font-size:11px;color:var(--red);margin-bottom:4px">🚨 <b>${b.label}</b><br><span style="color:var(--text2);margin-left:16px">${b.action}</span></div>`;
    });
    html += `</div>`;
  }

  // ── Diagnostics ──────────────────────────────────────────────────────────
  resultado.diagnosticos.forEach((dx, i) => {
    const isTop   = i === 0;
    const dxColor = _colorForKey(dx.colorKey);
    const tagCls  = _tagClassForCategoria(dx.categoria);
    const border  = isTop ? 'border-color:var(--neon)' : 'border-color:var(--border)';
    const bg      = isTop ? 'background:rgba(57,255,122,.04)' : '';

    // Show test IDs with real names when possible
    const allTests = [
      ...(ORTHO_TESTS.cadera || []),
      ...(ORTHO_TESTS.caderaGluteal || []),
      ...(ORTHO_TESTS.caderaFractura || []),
      ...(ORTHO_TESTS.caderaOA || []),
      ...(ORTHO_TESTS.dohaAductores || []),
      ...(ORTHO_TESTS.dohaPsoas || []),
      ...(ORTHO_TESTS.dohaInguinal || []),
      ...(ORTHO_TESTS.dohaComplementarios || [])
    ];
    const nameOf = id => (allTests.find(t => t.id === id)?.name || id);

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
        Algoritmo basado en 9 meta-análisis y revisiones sistemáticas · No reemplaza el juicio clínico
      </div>
    </div>
  </div>`;

  card.innerHTML = html;
}

window.diagnosticarCadera    = diagnosticarCadera;
window.renderDiagnosticosCadera = renderDiagnosticosCadera;

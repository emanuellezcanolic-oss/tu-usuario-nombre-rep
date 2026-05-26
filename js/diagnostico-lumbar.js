// js/diagnostico-lumbar.js
// Motor de inferencia — diagnóstico diferencial lumbar
// Requires: papers-lumbar-rules.js (LUMBAR_RULES), lumbar.js (lbpState)

function diagnosticarLumbar(positivosIds, symptomIds) {
  const pos  = new Set(positivosIds || []);
  const symp = new Set(symptomIds   || []);
  const resultado = { diagnosticos: [] };

  LUMBAR_RULES.diagnosticos.forEach(dx => {
    const mainHits    = dx.testsKey.filter(t => pos.has(t));
    const supportHits = dx.testsSupportKey.filter(t => pos.has(t));
    const symptomHits = (dx.symptomKeys || []).filter(s => symp.has(s));

    const meetsTestThreshold = dx.umbral === 0
      ? false
      : mainHits.length >= dx.umbral || (mainHits.length >= 1 && supportHits.length >= 2);

    const meetsSymptomThreshold = dx.umbral === 0
      ? symptomHits.length >= (dx.symptomUmbral || 1)
      : symptomHits.length >= (dx.symptomUmbral || 2);

    const shouldInclude = meetsTestThreshold || meetsSymptomThreshold;
    if (!shouldInclude) return;

    const mainRatio    = dx.testsKey.length       ? mainHits.length    / dx.testsKey.length       : 0;
    const supportRatio = dx.testsSupportKey.length ? supportHits.length / dx.testsSupportKey.length : 0;
    const symptomRatio = (dx.symptomKeys || []).length ? symptomHits.length / (dx.symptomKeys || []).length : 0;

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

    if (confidence >= 65)      { confianzaLabel = 'Alta probabilidad';  confianzaColor = 'var(--neon)'; }
    else if (confidence >= 35) { confianzaLabel = 'Sospecha moderada';  confianzaColor = 'var(--amber)'; }
    else                       { confianzaLabel = 'Posible';            confianzaColor = 'var(--text2)'; }

    resultado.diagnosticos.push({
      ...dx, mainHits, supportHits, symptomHits, confidence,
      confianzaLabel, confianzaColor, source,
      bySymptomOnly: !meetsTestThreshold && meetsSymptomThreshold,
    });
  });

  resultado.diagnosticos.sort((a, b) => b.confidence - a.confidence);
  return resultado;
}

function _colorForKeyLBP(key) {
  const map = {
    red: 'var(--red)', neon: 'var(--neon)', amber: 'var(--amber)',
    blue: '#60a5fa', orange: '#fb923c', text: 'var(--text2)'
  };
  return map[key] || 'var(--text)';
}

function _tagClassForCategoriaLBP(cat) {
  const map = {
    'LRP':        'tag-r',
    'SIJ':        'tag-y',
    'Estabilidad':'tag-b',
    'Estenosis':  'tag-y',
    'Faceta':     'tag-y',
  };
  return map[cat] || '';
}

function renderDiagnosticosLumbar(positivosOverride, symptomsOverride) {
  const card = document.getElementById('kine-dx-lbp-card');
  if (!card) return;

  let positivos, symptoms;

  if (positivosOverride !== undefined) {
    positivos = positivosOverride;
  } else {
    const allLbpIds = new Set([
      ...(typeof LUMBAR_TESTS_NEURAL     !== 'undefined' ? LUMBAR_TESTS_NEURAL     : []).map(t => t.id),
      ...(typeof LUMBAR_TESTS_SIJ        !== 'undefined' ? LUMBAR_TESTS_SIJ        : []).map(t => t.id),
      ...(typeof LUMBAR_TESTS_ESTABILIDAD !== 'undefined' ? LUMBAR_TESTS_ESTABILIDAD : []).map(t => t.id),
      ...(typeof LUMBAR_TESTS_ESTENOSIS  !== 'undefined' ? LUMBAR_TESTS_ESTENOSIS  : []).map(t => t.id),
    ]);
    positivos = typeof kineState !== 'undefined'
      ? Object.entries(kineState.tests)
          .filter(([id, v]) => v.result === 'pos' && allLbpIds.has(id))
          .map(([id]) => id)
      : [];
  }

  symptoms = symptomsOverride !== undefined ? symptomsOverride : [];

  if (positivos.length === 0 && symptoms.length === 0) {
    card.style.display = 'none'; return;
  }

  const resultado = diagnosticarLumbar(positivos, symptoms);
  if (resultado.diagnosticos.length === 0) { card.style.display = 'none'; return; }

  card.style.display = 'block';

  const allTests = [
    ...(typeof LUMBAR_TESTS_NEURAL      !== 'undefined' ? LUMBAR_TESTS_NEURAL      : []),
    ...(typeof LUMBAR_TESTS_SIJ         !== 'undefined' ? LUMBAR_TESTS_SIJ         : []),
    ...(typeof LUMBAR_TESTS_ESTABILIDAD !== 'undefined' ? LUMBAR_TESTS_ESTABILIDAD : []),
    ...(typeof LUMBAR_TESTS_ESTENOSIS   !== 'undefined' ? LUMBAR_TESTS_ESTENOSIS   : []),
    ...(typeof LUMBAR_TESTS_FACETA      !== 'undefined' ? LUMBAR_TESTS_FACETA      : []),
  ];
  const nameOfTest = id => (allTests.find(t => t.id === id)?.name || id);
  const nameOfSymp = id => ((typeof LUMBAR_SYMPTOMS !== 'undefined' ? LUMBAR_SYMPTOMS : []).find(s => s.id === id)?.label || id);

  let html = `
  <div class="card" style="margin-top:16px;border:1px solid var(--neon);border-radius:var(--r)">
    <div class="card-header" style="background:rgba(57,255,122,.06)">
      <h3 style="display:flex;align-items:center;gap:8px">
        <span>🔬</span> Diagnóstico diferencial lumbar
      </h3>
      <span class="tag tag-y">CPG 2012 · ${positivos.length} test${positivos.length !== 1?'s':''} · ${symptoms.length} síntoma${symptoms.length !== 1?'s':''}</span>
    </div>
    <div class="card-body">`;

  resultado.diagnosticos.forEach((dx, i) => {
    const isTop   = i === 0;
    const dxColor = _colorForKeyLBP(dx.colorKey);
    const tagCls  = _tagClassForCategoriaLBP(dx.categoria);
    const border  = isTop ? 'border-color:var(--neon)' : 'border-color:var(--border)';
    const bg      = isTop ? 'background:rgba(57,255,122,.04)' : '';
    const symBadge = dx.bySymptomOnly
      ? `<span style="font-size:9px;background:rgba(251,146,60,.15);color:#fb923c;padding:1px 5px;border-radius:3px;margin-left:4px">Sospecha clínica</span>`
      : '';

    html += `
    <div style="border:1px solid var(--border);${border};${bg};border-radius:var(--r);padding:12px;margin-bottom:10px">
      <div class="flex-b" style="align-items:flex-start;gap:8px">
        <div>
          <span style="font-size:13px;font-weight:700;color:${dxColor}">${isTop?'🏆 ':''}${dx.nombre}</span>
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
        <summary style="font-size:10px;color:var(--text3);cursor:pointer;user-select:none">Ver evidencia y tratamiento</summary>
        <div style="margin-top:8px;padding:8px;background:var(--bg3);border-radius:4px">
          <div style="font-size:10px;color:var(--text2);line-height:1.5;white-space:pre-line">${dx.evidencia}</div>
        </div>
        <div style="margin-top:8px;padding:8px;background:rgba(57,255,122,.07);border-left:2px solid var(--neon);border-radius:4px">
          <div style="font-size:10px;font-weight:600;color:var(--neon);margin-bottom:4px">Tratamiento recomendado (CPG 2012)</div>
          <div style="font-size:10px;color:var(--text);line-height:1.5">${dx.tratamiento}</div>
        </div>
        <div style="margin-top:6px;font-size:9px;color:var(--text3);font-style:italic;line-height:1.4">${dx.ref}</div>
      </details>
    </div>`;
  });

  html += `
      <div style="font-size:9px;color:var(--text3);text-align:center;margin-top:4px;padding-top:8px;border-top:1px solid var(--border)">
        Algoritmo: CPG Delitto 2012 · George et al. CPG 2021 · WHO 2023 · Cook 2006 · Alqarni 2010 · Stuber 2014 · Laslett 2005 · Hicks 2003 · No reemplaza el juicio clínico
      </div>
    </div>
  </div>`;

  card.innerHTML = html;
}

window.diagnosticarLumbar       = diagnosticarLumbar;
window.renderDiagnosticosLumbar = renderDiagnosticosLumbar;

// js/diagnostico-cervical.js
// Motor de inferencia — diagnóstico diferencial cervical
// Requires: papers-cervical-rules.js (CERVICAL_RULES), lesion.js (CERVICAL_TESTS_*), cervical.js (cxState)

function diagnosticarCervical(positivosIds, symptomIds) {
  const pos  = new Set(positivosIds || []);
  const symp = new Set(symptomIds   || []);
  const resultado = { banderasRojas: [], diagnosticos: [] };

  CERVICAL_RULES.diagnosticos.forEach(dx => {
    const mainHits    = dx.testsKey.filter(t => pos.has(t));
    const supportHits = dx.testsSupportKey.filter(t => pos.has(t));
    const symptomHits = (dx.symptomKeys || []).filter(s => symp.has(s));

    const meetsTestThreshold = dx.umbral === 0
      ? false
      : mainHits.length >= dx.umbral || (mainHits.length >= 1 && supportHits.length >= 2);

    const meetsSymptomThreshold = dx.umbral === 0
      ? symptomHits.length >= (dx.symptomUmbral || 1)
      : symptomHits.length >= (dx.symptomUmbral || 2);

    // Special: mielopatía triggers if ANY main test positive
    const meetsMieloUrgent = dx.id === 'mielopatia-cx' && mainHits.length >= 1;

    const shouldInclude = meetsTestThreshold || meetsSymptomThreshold || meetsMieloUrgent;
    if (!shouldInclude) return;

    const mainRatio    = dx.testsKey.length      ? mainHits.length    / dx.testsKey.length      : 0;
    const supportRatio = dx.testsSupportKey.length ? supportHits.length / dx.testsSupportKey.length : 0;
    const symptomRatio = (dx.symptomKeys || []).length ? symptomHits.length / (dx.symptomKeys || []).length : 0;

    const confidence = Math.min(100, Math.round(
      (mainRatio * 0.55 + supportRatio * 0.15 + symptomRatio * 0.30) * 100
    ));

    let confianzaLabel, confianzaColor, source;
    if (meetsTestThreshold && meetsSymptomThreshold) {
      source = 'tests + clínica';
    } else if (meetsTestThreshold || meetsMieloUrgent) {
      source = 'tests ortopédicos';
    } else {
      source = 'presentación clínica';
    }

    if (confidence >= 65) { confianzaLabel = 'Alta probabilidad';    confianzaColor = 'var(--neon)'; }
    else if (confidence >= 35) { confianzaLabel = 'Sospecha moderada'; confianzaColor = 'var(--amber)'; }
    else { confianzaLabel = 'Posible';                                  confianzaColor = 'var(--text2)'; }

    // Mielopatía always shown as urgent
    if (dx.id === 'mielopatia-cx') {
      confianzaLabel = '⚠️ Derivar urgente';
      confianzaColor = 'var(--red)';
    }

    resultado.diagnosticos.push({
      ...dx, mainHits, supportHits, symptomHits, confidence,
      confianzaLabel, confianzaColor, source,
      bySymptomOnly: !meetsTestThreshold && !meetsMieloUrgent && meetsSymptomThreshold,
    });
  });

  resultado.diagnosticos.sort((a, b) => {
    // Mielopatía always first
    if (a.id === 'mielopatia-cx') return -1;
    if (b.id === 'mielopatia-cx') return 1;
    return b.confidence - a.confidence;
  });

  return resultado;
}

function _colorForKeyCX(key) {
  const map = {
    red: 'var(--red)', neon: 'var(--neon)', amber: 'var(--amber)',
    blue: '#60a5fa', orange: '#fb923c', text: 'var(--text2)'
  };
  return map[key] || 'var(--text)';
}

function _tagClassForCategoriaCX(cat) {
  const map = {
    'NPRP':       'tag-r',
    'NPHA':       'tag-y',
    'NPMCI':      'tag-y',
    'NPMD':       'tag-b',
    'Mielopatía': 'tag-r',
  };
  return map[cat] || '';
}

function renderDiagnosticosCervical(positivosOverride, symptomsOverride) {
  const card = document.getElementById('kine-dx-cervical-card');
  if (!card) return;

  let positivos, symptoms;

  if (positivosOverride !== undefined) {
    positivos = positivosOverride;
  } else {
    const allCxIds = new Set([
      ...(typeof CERVICAL_TESTS_RADICULAR  !== 'undefined' ? CERVICAL_TESTS_RADICULAR  : []).map(t => t.id),
      ...(typeof CERVICAL_TESTS_HEADACHE   !== 'undefined' ? CERVICAL_TESTS_HEADACHE   : []).map(t => t.id),
      ...(typeof CERVICAL_TESTS_ESTABILIDAD !== 'undefined' ? CERVICAL_TESTS_ESTABILIDAD : []).map(t => t.id),
      ...(typeof CERVICAL_TESTS_MIELOPATIA !== 'undefined' ? CERVICAL_TESTS_MIELOPATIA : []).map(t => t.id),
    ]);
    positivos = typeof kineState !== 'undefined'
      ? Object.entries(kineState.tests)
          .filter(([id, v]) => v.result === 'pos' && allCxIds.has(id))
          .map(([id]) => id)
      : [];
  }

  symptoms = symptomsOverride !== undefined ? symptomsOverride : [];

  if (positivos.length === 0 && symptoms.length === 0) {
    card.style.display = 'none'; return;
  }

  const resultado = diagnosticarCervical(positivos, symptoms);
  if (resultado.diagnosticos.length === 0) { card.style.display = 'none'; return; }

  card.style.display = 'block';

  const allTests = [
    ...(typeof CERVICAL_TESTS_RADICULAR  !== 'undefined' ? CERVICAL_TESTS_RADICULAR  : []),
    ...(typeof CERVICAL_TESTS_HEADACHE   !== 'undefined' ? CERVICAL_TESTS_HEADACHE   : []),
    ...(typeof CERVICAL_TESTS_ESTABILIDAD !== 'undefined' ? CERVICAL_TESTS_ESTABILIDAD : []),
    ...(typeof CERVICAL_TESTS_MIELOPATIA !== 'undefined' ? CERVICAL_TESTS_MIELOPATIA : []),
  ];
  const nameOfTest = id => (allTests.find(t => t.id === id)?.name || id);
  const nameOfSymp = id => ((typeof CERVICAL_SYMPTOMS !== 'undefined' ? CERVICAL_SYMPTOMS : []).find(s => s.id === id)?.label || id);

  let html = `
  <div class="card" style="margin-top:16px;border:1px solid var(--neon);border-radius:var(--r)">
    <div class="card-header" style="background:rgba(57,255,122,.06)">
      <h3 style="display:flex;align-items:center;gap:8px">
        <span>🔬</span> Diagnóstico diferencial cervical
      </h3>
      <span class="tag tag-y">CPG 2017 · ${positivos.length} test${positivos.length !== 1?'s':''} · ${symptoms.length} síntoma${symptoms.length !== 1?'s':''}</span>
    </div>
    <div class="card-body">`;

  resultado.diagnosticos.forEach((dx, i) => {
    const isTop    = i === 0;
    const isMielo  = dx.id === 'mielopatia-cx';
    const dxColor  = _colorForKeyCX(dx.colorKey);
    const tagCls   = _tagClassForCategoriaCX(dx.categoria);
    const border   = isMielo ? 'border-color:var(--red)' : isTop ? 'border-color:var(--neon)' : 'border-color:var(--border)';
    const bg       = isMielo ? 'background:rgba(255,68,68,.05)' : isTop ? 'background:rgba(57,255,122,.04)' : '';
    const symBadge = dx.bySymptomOnly
      ? `<span style="font-size:9px;background:rgba(251,146,60,.15);color:#fb923c;padding:1px 5px;border-radius:3px;margin-left:4px">Sospecha clínica</span>`
      : '';
    const mieloBadge = isMielo
      ? `<span style="font-size:9px;background:rgba(255,68,68,.2);color:var(--red);padding:2px 8px;border-radius:3px;margin-left:4px;font-weight:700">DERIVAR</span>`
      : '';

    html += `
    <div style="border:1px solid var(--border);${border};${bg};border-radius:var(--r);padding:12px;margin-bottom:10px">
      <div class="flex-b" style="align-items:flex-start;gap:8px">
        <div>
          <span style="font-size:13px;font-weight:700;color:${dxColor}">${isTop&&!isMielo?'🏆 ':''}${isMielo?'🚨 ':''}${dx.nombre}</span>
          <span class="tag ${tagCls}" style="margin-left:6px;font-size:9px">${dx.categoria}</span>
          ${symBadge}${mieloBadge}
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
          <div style="font-size:10px;font-weight:600;color:var(--neon);margin-bottom:4px">Tratamiento recomendado (CPG 2017)</div>
          <div style="font-size:10px;color:var(--text);line-height:1.5">${dx.tratamiento}</div>
        </div>
        <div style="margin-top:6px;font-size:9px;color:var(--text3);font-style:italic;line-height:1.4">${dx.ref}</div>
      </details>
    </div>`;
  });

  html += `
      <div style="font-size:9px;color:var(--text3);text-align:center;margin-top:4px;padding-top:8px;border-top:1px solid var(--border)">
        Algoritmo: CPG Blanpied 2017 JOSPT · Lin et al. Am J PMR 2025 · Thoomes et al. BMC MSK 2026 · Rubio-Ochoa et al. Manual Therapy 2015 · Blomgren et al. BMC MSK 2018 · No reemplaza el juicio clínico
      </div>
    </div>
  </div>`;

  card.innerHTML = html;
}

window.diagnosticarCervical       = diagnosticarCervical;
window.renderDiagnosticosCervical = renderDiagnosticosCervical;

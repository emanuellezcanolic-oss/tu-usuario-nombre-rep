// js/sheets/cadera.js — Cadera / Ingle / Doha / GTPS v2
// CPG: Enseki 2023 JOSPT · Reiman 2012/2014 BJSM · Delahunt 2015 Doha · Simel 2019 JAMA
// Requires: papers-cadera-rules.js (CADERA_RULES, CADERA_ROM), ortho-tests.js (ORTHO_TESTS),
//           diagnostico-cadera.js (diagnosticarCadera, _colorForKey, _tagClassForCategoria)

// ── Tab switcher ───────────────────────────────────────────────────────────────
function showCaderaTab(tab, btn) {
  ['obs','rom','tests','ingle','gtps','esc','informe'].forEach(function(t) {
    var el = document.getElementById('cadtab-' + t);
    if (el) el.style.display = t === tab ? '' : 'none';
  });
  document.querySelectorAll('.cad-tab-btn').forEach(function(b) {
    b.classList.remove('btn-neon');
    b.classList.add('btn-ghost');
  });
  if (btn) {
    btn.classList.remove('btn-ghost');
    btn.classList.add('btn-neon');
  }
}

// ── Red flags ─────────────────────────────────────────────────────────────────
function checkCaderaRedFlags() {
  var hasFlag = Array.from(document.querySelectorAll('.cad-redflag')).some(function(cb) { return cb.checked; });
  var alert = document.getElementById('cad-redflag-alert');
  if (alert) alert.style.display = hasFlag ? 'block' : 'none';
}

// ── ROM helpers ───────────────────────────────────────────────────────────────
(function _injectCaderaRomStyles() {
  if (document.getElementById('cad-rom-eva-style')) return;
  var s = document.createElement('style');
  s.id = 'cad-rom-eva-style';
  s.textContent = [
    '.cad-eva-range::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:#cc3333;cursor:pointer;border:2px solid #fff;box-shadow:0 0 3px rgba(0,0,0,.4)}',
    '.cad-eva-range::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:#cc3333;cursor:pointer;border:2px solid #fff}',
    '.cad-eva-range::-webkit-slider-runnable-track{height:4px;border-radius:2px}',
    '.cad-eva-range::-moz-range-track{height:4px;border-radius:2px;background:var(--border,#333)}'
  ].join('');
  document.head.appendChild(s);
})();

function _caderaRomEvaUpdate(el) {
  var v   = +el.value;
  var pct = (v / 10) * 100;
  el.style.background = v > 0
    ? 'linear-gradient(to right,#cc3333 ' + pct + '%,var(--border,#444) ' + pct + '%)'
    : 'var(--border,#444)';
  el.className = 'cad-eva-range';
  var sp = el.nextElementSibling;
  if (sp) { sp.textContent = v || '0'; sp.style.color = v > 0 ? '#cc3333' : 'var(--text3)'; }
}

function _caderaRomSetUnit(unit) {
  var btn = document.getElementById('cad-rom-unit-global');
  if (btn) {
    btn.textContent = unit;
    btn.style.background = unit === 'cm' ? 'var(--neon,#7ec957)' : 'transparent';
    btn.style.color = unit === 'cm' ? '#000' : 'var(--text3)';
  }
  (typeof CADERA_ROM !== 'undefined' ? CADERA_ROM : []).forEach(function(r) {
    var inp = document.getElementById('cad-rom-' + r.id + '-act');
    if (inp) inp.placeholder = unit === 'cm' ? '0.0' : '0';
  });
}

// ── ROM builder ───────────────────────────────────────────────────────────────
function buildCaderaROM() {
  var c = document.getElementById('cad-rom-fields');
  if (!c || c.innerHTML) return;
  var header = '<div style="display:grid;grid-template-columns:28px 1fr 46px 68px 90px;gap:4px 6px;align-items:center;padding:4px 0 8px;border-bottom:1px solid var(--border)">' +
    '<span></span>' +
    '<span style="font-size:9px;color:var(--text3)">Movimiento</span>' +
    '<span style="font-size:9px;color:var(--text3);text-align:center">Ref.</span>' +
    '<span style="display:flex;align-items:center;justify-content:center;gap:4px">' +
      '<span style="font-size:9px;color:var(--text3)">AROM</span>' +
      '<button id="cad-rom-unit-global"' +
        ' onclick="var u=this.textContent===\'°\'?\'cm\':\'°\';_caderaRomSetUnit(u)"' +
        ' title="Cambiar unidad para todos los movimientos"' +
        ' style="font-size:9px;padding:1px 5px;border:1px solid var(--border);border-radius:10px;background:transparent;cursor:pointer;color:var(--text3);font-weight:700;transition:all .15s">°</button>' +
    '</span>' +
    '<span style="font-size:9px;color:var(--text3);text-align:center">EVA dolor repro</span>' +
    '</div>';

  var rows = (typeof CADERA_ROM !== 'undefined' ? CADERA_ROM : []).map(function(r) {
    return '<div style="display:grid;grid-template-columns:28px 1fr 46px 68px 90px;gap:4px 6px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">' +
      '<div></div>' +
      '<div style="font-size:11px;color:var(--text2)">' + r.label + '</div>' +
      '<div style="font-size:9px;color:var(--text3);text-align:center">' + r.ref + '</div>' +
      '<input class="inp inp-mono cad-rom-val" type="number" id="cad-rom-' + r.id + '-act"' +
        ' placeholder="0" step="any"' +
        ' style="padding:3px 4px;font-size:11px;text-align:center">' +
      '<div style="display:flex;align-items:center;gap:3px">' +
        '<input type="range" id="cad-rom-' + r.id + '-eva" min="0" max="10" value="0"' +
          ' oninput="_caderaRomEvaUpdate(this)"' +
          ' style="flex:1;height:4px;border-radius:2px;outline:none;cursor:pointer;background:var(--border,#333);-webkit-appearance:none;appearance:none">' +
        '<span style="font-family:var(--mono);font-size:11px;min-width:12px;color:var(--text3);text-align:right">0</span>' +
      '</div>' +
      '</div>';
  });

  c.innerHTML = header + rows.join('');
}

// ── Test group builder ─────────────────────────────────────────────────────────
function _buildCaderaTestGroup(containerId, tests) {
  var c = document.getElementById(containerId);
  if (!c || c.innerHTML) return;
  c.innerHTML = tests.map(function(t) {
    return '<div class="card mb-8" data-test-id="' + t.id + '">' +
      '<div class="card-body" style="padding:8px 10px">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px">' +
          '<div>' +
            '<span style="font-size:12px;font-weight:700">' + t.name + '</span>' +
            '<span class="tag ' + (t.tag || '') + '" style="font-size:9px;margin-left:5px">' + t.sub + '</span>' +
          '</div>' +
        '</div>' +
        '<div style="font-size:9px;color:var(--text3);margin-bottom:8px;font-style:italic">' + t.ref + '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' +
          '<div class="cad-test-col">' +
            '<div style="font-size:9px;color:var(--text3);text-align:center;margin-bottom:4px">DERECHA / BILATERAL</div>' +
            '<div style="display:flex;gap:4px;justify-content:center;margin-bottom:6px">' +
              '<button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTCadera(this,\'pos\')">+ POS</button>' +
              '<button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTCadera(this,\'neg\')">– NEG</button>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:4px">' +
              '<span style="font-size:9px;color:var(--text3);min-width:22px">EVA</span>' +
              '<input type="range" class="eva-slider cad-eva-slider" min="0" max="10" value="0" disabled' +
                ' oninput="this.nextElementSibling.textContent=this.value" style="flex:1">' +
              '<span style="font-family:var(--mono);font-size:11px;min-width:14px">0</span>' +
            '</div>' +
          '</div>' +
          '<div class="cad-test-col">' +
            '<div style="font-size:9px;color:var(--text3);text-align:center;margin-bottom:4px">IZQUIERDA</div>' +
            '<div style="display:flex;gap:4px;justify-content:center;margin-bottom:6px">' +
              '<button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTCadera(this,\'pos\')">+ POS</button>' +
              '<button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTCadera(this,\'neg\')">– NEG</button>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:4px">' +
              '<span style="font-size:9px;color:var(--text3);min-width:22px">EVA</span>' +
              '<input type="range" class="eva-slider cad-eva-slider" min="0" max="10" value="0" disabled' +
                ' oninput="this.nextElementSibling.textContent=this.value" style="flex:1">' +
              '<span style="font-family:var(--mono);font-size:11px;min-width:14px">0</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ── Toggle POS/NEG ─────────────────────────────────────────────────────────────
function toggleOTCadera(btn, type) {
  var col = btn.closest('.cad-test-col');
  if (!col) return;
  var siblings = col.querySelectorAll('.ot-btn');
  siblings.forEach(function(b) { b.classList.remove('pos', 'neg'); });
  btn.classList.add(type);
  var slider = col.querySelector('.cad-eva-slider');
  if (slider) slider.disabled = (type === 'neg');
  _renderCaderaFromModal();
}

// ── Collect positives ──────────────────────────────────────────────────────────
function _getCaderaModalPositivos() {
  var allTests = [
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.cadera             ? ORTHO_TESTS.cadera             : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaGluteal      ? ORTHO_TESTS.caderaGluteal      : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaGTPS         ? ORTHO_TESTS.caderaGTPS         : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaFractura     ? ORTHO_TESTS.caderaFractura     : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaOA           ? ORTHO_TESTS.caderaOA           : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaAductores      ? ORTHO_TESTS.dohaAductores      : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaPsoas          ? ORTHO_TESTS.dohaPsoas          : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaInguinal       ? ORTHO_TESTS.dohaInguinal       : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaComplementarios ? ORTHO_TESTS.dohaComplementarios : [])
  ];
  var pos = [];
  allTests.forEach(function(test) {
    var card = document.querySelector('#sheet-cadera [data-test-id="' + test.id + '"]');
    if (card && card.querySelector('.ot-btn.pos')) pos.push(test.id);
  });
  return pos;
}

// ── Render diagnosis panel ─────────────────────────────────────────────────────
function _renderCaderaFromModal() {
  var panel = document.getElementById('cad-dx-panel');
  if (!panel) return;
  if (typeof diagnosticarCadera !== 'function') return;

  var positivos = _getCaderaModalPositivos();
  if (positivos.length === 0) { panel.innerHTML = ''; return; }

  var resultado = diagnosticarCadera(positivos);
  if (resultado.diagnosticos.length === 0 && resultado.banderasRojas.length === 0) {
    panel.innerHTML = ''; return;
  }

  var allTests = [
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.cadera             ? ORTHO_TESTS.cadera             : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaGluteal      ? ORTHO_TESTS.caderaGluteal      : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaGTPS         ? ORTHO_TESTS.caderaGTPS         : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaFractura     ? ORTHO_TESTS.caderaFractura     : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaOA           ? ORTHO_TESTS.caderaOA           : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaAductores      ? ORTHO_TESTS.dohaAductores      : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaPsoas          ? ORTHO_TESTS.dohaPsoas          : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaInguinal       ? ORTHO_TESTS.dohaInguinal       : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaComplementarios ? ORTHO_TESTS.dohaComplementarios : [])
  ];
  var nameOf = function(id) { return (allTests.find(function(t) { return t.id === id; }) || {}).name || id; };

  var html = '<div class="card" style="margin-top:16px;border:1px solid var(--neon);border-radius:var(--r)">' +
    '<div class="card-header" style="background:rgba(57,255,122,.06)">' +
      '<h3 style="display:flex;align-items:center;gap:8px"><span>🔬</span> Diagnóstico diferencial de cadera</h3>' +
      '<span class="tag tag-y">Algoritmo EBM · ' + positivos.length + ' test' + (positivos.length > 1 ? 's' : '') + ' positivo' + (positivos.length > 1 ? 's' : '') + '</span>' +
    '</div>' +
    '<div class="card-body">';

  if (resultado.banderasRojas.length > 0) {
    html += '<div style="background:rgba(255,68,68,.12);border:1px solid var(--red);border-radius:var(--r);padding:12px;margin-bottom:14px">' +
      '<div style="font-size:12px;font-weight:700;color:var(--red);margin-bottom:8px">⚠️ BANDERAS ROJAS — ACCIÓN INMEDIATA</div>';
    resultado.banderasRojas.forEach(function(b) {
      html += '<div style="font-size:11px;color:var(--red);margin-bottom:4px">🚨 <b>' + b.label + '</b><br><span style="color:var(--text2);margin-left:16px">' + b.action + '</span></div>';
    });
    html += '</div>';
  }

  resultado.diagnosticos.forEach(function(dx, i) {
    var isTop   = i === 0;
    var dxColor = typeof _colorForKey === 'function' ? _colorForKey(dx.colorKey) : 'var(--text)';
    var tagCls  = typeof _tagClassForCategoria === 'function' ? _tagClassForCategoria(dx.categoria) : '';
    var border  = isTop ? 'border-color:var(--neon)' : 'border-color:var(--border)';
    var bg      = isTop ? 'background:rgba(57,255,122,.04)' : '';

    html += '<div style="border:1px solid var(--border);' + border + ';' + bg + ';border-radius:var(--r);padding:12px;margin-bottom:10px">' +
      '<div class="flex-b" style="align-items:flex-start;gap:8px">' +
        '<div>' +
          '<span style="font-size:13px;font-weight:700;color:' + dxColor + '">' + (isTop ? '🏆 ' : '') + dx.nombre + '</span>' +
          '<span class="tag ' + tagCls + '" style="margin-left:6px;font-size:9px">' + dx.categoria + '</span>' +
        '</div>' +
        '<span style="font-size:10px;color:' + dx.confianzaColor + ';font-weight:600;white-space:nowrap">' + dx.confianzaLabel + '</span>' +
      '</div>' +
      '<div style="margin-top:6px;font-size:11px;color:var(--text2);line-height:1.4">' + dx.criterio + '</div>' +
      '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">' +
        dx.mainHits.map(function(t)    { return '<span class="tag tag-r" style="font-size:9px">+ ' + nameOf(t) + '</span>'; }).join('') +
        dx.supportHits.map(function(t) { return '<span class="tag tag-y" style="font-size:9px">+ ' + nameOf(t) + '</span>'; }).join('') +
      '</div>' +
      '<details style="margin-top:10px">' +
        '<summary style="font-size:10px;color:var(--text3);cursor:pointer;user-select:none">Ver evidencia y tratamiento</summary>' +
        '<div style="margin-top:8px;padding:8px;background:var(--bg3);border-radius:4px">' +
          '<div style="font-size:10px;color:var(--text2);line-height:1.5;white-space:pre-line">' + dx.evidencia + '</div>' +
        '</div>' +
        '<div style="margin-top:8px;padding:8px;background:rgba(57,255,122,.07);border-left:2px solid var(--neon);border-radius:4px">' +
          '<div style="font-size:10px;font-weight:600;color:var(--neon);margin-bottom:4px">Tratamiento recomendado</div>' +
          '<div style="font-size:10px;color:var(--text);line-height:1.5">' + dx.tratamiento + '</div>' +
        '</div>' +
        '<div style="margin-top:6px;font-size:9px;color:var(--text3);font-style:italic;line-height:1.4">' + dx.ref + '</div>' +
      '</details>' +
    '</div>';
  });

  html += '<div style="font-size:9px;color:var(--text3);text-align:center;margin-top:4px;padding-top:8px;border-top:1px solid var(--border)">' +
    'Algoritmo basado en meta-análisis y revisiones sistemáticas · No reemplaza el juicio clínico' +
  '</div></div></div>';

  panel.innerHTML = html;
}

// ── GTPS / Bursitis tab ────────────────────────────────────────────────────────
function buildCaderaGTPS() {
  var c = document.getElementById('cad-gtps-fields');
  if (!c || c.innerHTML) return;

  var infoCard = '<div class="card mb-10" style="border-color:rgba(126,201,87,.3)">' +
    '<div class="card-header" style="background:rgba(126,201,87,.06)">' +
      '<h3>🦴 GTPS — Síndrome de Dolor Trocantérico Mayor</h3>' +
      '<span class="tag tag-b">Extraarticular · EBM 2025</span>' +
    '</div>' +
    '<div class="card-body">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">' +
        '<div style="padding:8px;background:var(--bg3);border-radius:6px">' +
          '<div style="font-size:9px;text-transform:uppercase;color:var(--neon);font-weight:700;margin-bottom:4px">Epidemiología</div>' +
          '<div style="font-size:10px;color:var(--text2);line-height:1.5">' +
            '1.8–5.6 / 1000 adultos/año<br>Pico: mujeres 40–60 años<br>OA hip concomitante en ~⅔ de casos<br>Autolimitante en mayoría (resolución >90% conservador)' +
          '</div>' +
        '</div>' +
        '<div style="padding:8px;background:var(--bg3);border-radius:6px">' +
          '<div style="font-size:9px;text-transform:uppercase;color:var(--neon);font-weight:700;margin-bottom:4px">Criterio diagnóstico clínico</div>' +
          '<div style="font-size:10px;color:var(--text2);line-height:1.5">' +
            '① Dolor lateral de cadera/muslo<br>② Palpación dolorosa trocánter mayor<br>③ FABER reproduciendo dolor LATERAL<br>Sin dificultad para ponerse calzado<br><span style="color:var(--text3);font-size:9px">Barratt BJSM 2016 · Reid J Orthop 2016</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="padding:8px;background:rgba(126,201,87,.07);border-radius:6px;border-left:2px solid var(--neon)">' +
        '<div style="font-size:10px;color:var(--text2);line-height:1.5">' +
          '<strong>Fisiopatología actual:</strong> GTPS = paraguas que incluye tendinopatía glútea med/min + bursitis trocantérica (4-46%) + coxa saltans externa. ' +
          'Bursitis aislada poco frecuente; la tendinopatía gluteal es el componente principal en estudios histopatológicos.' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';

  // Tests section
  var gtpsTests = (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaGTPS) || [];
  var glutealTests = (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaGluteal) || [];
  var allGtpsTests = gtpsTests.concat(glutealTests);

  var testsHtml = '<div class="card mb-10">' +
    '<div class="card-header"><h3>Tests diagnósticos GTPS</h3><span class="tag tag-r">Palpación · FABER lateral · Abducción</span></div>' +
    '<div class="card-body">' +
      '<div style="font-size:9px;color:var(--text3);margin-bottom:8px">Resisted External Derotation = mejor test individual (LR+ 32.6) · Cluster palpación + abd resistida = 96% — Lequesne 2008 · Reiman BJSM 2012</div>' +
      allGtpsTests.map(function(t) {
        return '<div class="card mb-8" data-test-id="' + t.id + '">' +
          '<div class="card-body" style="padding:8px 10px">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px">' +
              '<div>' +
                '<span style="font-size:12px;font-weight:700">' + t.name + '</span>' +
                '<span class="tag tag-y" style="font-size:9px;margin-left:5px">' + t.sub + '</span>' +
              '</div>' +
            '</div>' +
            '<div style="font-size:9px;color:var(--text3);margin-bottom:8px;font-style:italic">' + t.ref + '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' +
              '<div class="cad-test-col">' +
                '<div style="font-size:9px;color:var(--text3);text-align:center;margin-bottom:4px">DERECHA / BILATERAL</div>' +
                '<div style="display:flex;gap:4px;justify-content:center;margin-bottom:6px">' +
                  '<button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTCadera(this,\'pos\')">+ POS</button>' +
                  '<button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTCadera(this,\'neg\')">– NEG</button>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:4px">' +
                  '<span style="font-size:9px;color:var(--text3);min-width:22px">EVA</span>' +
                  '<input type="range" class="eva-slider cad-eva-slider" min="0" max="10" value="0" disabled oninput="this.nextElementSibling.textContent=this.value" style="flex:1">' +
                  '<span style="font-family:var(--mono);font-size:11px;min-width:14px">0</span>' +
                '</div>' +
              '</div>' +
              '<div class="cad-test-col">' +
                '<div style="font-size:9px;color:var(--text3);text-align:center;margin-bottom:4px">IZQUIERDA</div>' +
                '<div style="display:flex;gap:4px;justify-content:center;margin-bottom:6px">' +
                  '<button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTCadera(this,\'pos\')">+ POS</button>' +
                  '<button class="ot-btn" style="font-size:9px;padding:3px 8px" onclick="toggleOTCadera(this,\'neg\')">– NEG</button>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:4px">' +
                  '<span style="font-size:9px;color:var(--text3);min-width:22px">EVA</span>' +
                  '<input type="range" class="eva-slider cad-eva-slider" min="0" max="10" value="0" disabled oninput="this.nextElementSibling.textContent=this.value" style="flex:1">' +
                  '<span style="font-family:var(--mono);font-size:11px;min-width:14px">0</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>' +
  '</div>';

  // Treatment evidence
  var tratHtml = '<div class="card mb-10">' +
    '<div class="card-header"><h3>Evidencia de tratamiento GTPS</h3><span class="tag tag-g">Barratt 2016 · Lustenberger 2011 · Reid 2016</span></div>' +
    '<div class="card-body">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
        _gtpsTratCard('Fase 1 — Corto plazo (0–3 m)', 'var(--amber)',
          'Inyección corticosteroide (CSI)',
          'Superior a cuidados habituales y RSWT al 1 mes. Mejor resultado a las 6 semanas. Efecto no mantenido a 12-15 meses. Guiada por imagen NO superior a landmark (Cohen RCT 2009). Dosis 24 mg betametasona con mayor beneficio sostenido a 26 semanas (Shbeeb). Riesgo degeneración tendinosa con dosis repetidas.',
          'Barratt BJSM 2016 (SR 8 estudios, n=696) · Cohen BMJ 2009 (RCT)') +
        _gtpsTratCard('Fase 2 — Mediano plazo (1–4 m)', 'var(--neon)',
          'Ondas de choque radiales (RSWT)',
          'Superior a CSI y home training a 4 meses (Rompe Am J Sports Med 2009, n=229). Mejora media VAS 3.9 pts y HHS 30.3 pts vs baseline. Sin diferencia vs home training a 15 meses. Opción cuando CSI es insuficiente.',
          'Rompe Am J Sports Med 2009 (RCT nivel I) · Furia Am J Sports Med 2009') +
        _gtpsTratCard('Fase 3 — Largo plazo (3–15 m)', 'var(--neon)',
          'Ejercicio en carga progresiva (EE)',
          'Superior a CSI a 15 meses (Rompe 2009). Home training: 64% retorno a la actividad vs 49% CSI. Protocolo: fortalecimiento glúteo med/min, isométricos en carga, excéntricos en carga progresiva. Evitar ITB stretch (compresión del tendón). Estiramiento piriformis + SLR + sentadillas asistidas.',
          'Rompe Am J Sports Med 2009 (RCT) · Barratt BJSM 2016 · Lustenberger Clin J Sport Med 2011') +
        _gtpsTratCard('Fase 4 — Refractario / Quirúrgico', 'var(--red)',
          'Cirugía (bursectomía · liberación ITB · reparación glútea)',
          '≥3 meses sin respuesta al tratamiento conservador. Bursectomía endoscópica: VAS −3.4. Z-plasty distal ITB: mayor mejora VAS (7.0) y HHS (30). Reparación glútea: 88–100% satisfacción. Técnicas endoscópicas: menor tiempo hospitalario, menor dolor post-op.',
          'Lustenberger Clin J Sport Med 2011 (SR 24 estudios, >950 casos) · Reid J Orthop 2016 (SR)') +
      '</div>' +
      '<div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:6px;font-size:9px;color:var(--text3);line-height:1.5">' +
        '⚠️ Evitar: compresión del tendón (no cruzar piernas, no adducción en carga, no ITB stretching agresivo). Factores pronóstico negativos: OA hip coexistente (×4.8 riesgo persistencia al año), síntomas prolongados, inyecciones previas múltiples — Lievense 2005.' +
      '</div>' +
    '</div>' +
  '</div>';

  c.innerHTML = infoCard + testsHtml + tratHtml;
}

function _gtpsTratCard(titulo, color, interv, desc, ref) {
  return '<div style="padding:10px;border:1px solid var(--border);border-left:3px solid ' + color + ';border-radius:6px">' +
    '<div style="font-size:10px;font-weight:700;color:' + color + ';margin-bottom:4px">' + titulo + '</div>' +
    '<div style="font-size:11px;font-weight:600;margin-bottom:4px">' + interv + '</div>' +
    '<div style="font-size:10px;color:var(--text2);line-height:1.4;margin-bottom:4px">' + desc + '</div>' +
    '<div style="font-size:9px;color:var(--text3);font-style:italic">' + ref + '</div>' +
  '</div>';
}

// ── VISA-G ─────────────────────────────────────────────────────────────────────
var visagVals = [];

function buildVISAG() {
  var c = document.getElementById('cad-visag-fields');
  if (!c || c.innerHTML) return;
  var items = (typeof VISAG_ITEMS !== 'undefined') ? VISAG_ITEMS : [];
  visagVals = new Array(items.length).fill(null);
  c.innerHTML = items.map(function(item, i) {
    return '<div style="padding:8px 0;border-bottom:1px solid var(--border)">' +
      '<div style="font-size:12px;margin-bottom:6px">' + (i + 1) + '. ' + item.q + '</div>' +
      '<div style="font-size:9px;color:var(--text3);margin-bottom:4px">0 = peor / sin actividad &nbsp;·&nbsp; 10 = sin dolor / actividad completa</div>' +
      '<input type="range" class="eva-slider" min="0" max="10" value="0"' +
        ' oninput="visagVals[' + i + ']=+this.value;this.nextElementSibling.textContent=this.value;_calcVISAG()">' +
      '<div style="font-family:var(--mono);font-size:14px;text-align:center;color:var(--neon)">0</div>' +
    '</div>';
  }).join('') +
  '<div id="visag-total" style="margin-top:12px;padding:10px;border-radius:8px;background:var(--bg3);text-align:center">' +
    '<span style="font-size:10px;color:var(--text3)">Total VISA-G:</span>' +
    '<span style="font-size:22px;font-weight:900;font-family:var(--mono);margin-left:8px;color:var(--text3)">0</span>' +
    '<span style="font-size:10px;color:var(--text3)">/80</span>' +
  '</div>';
}

function _calcVISAG() {
  var total = visagVals.reduce(function(a, b) { return a + (b || 0); }, 0);
  var el = document.getElementById('visag-total');
  if (!el) return;
  var color = total >= 60 ? 'var(--neon)' : total >= 40 ? 'var(--amber)' : 'var(--red)';
  var interp = total >= 60 ? 'Función conservada' : total >= 40 ? 'Afectación moderada' : 'Afectación severa';
  el.innerHTML = '<span style="font-size:10px;color:var(--text3)">Total VISA-G:</span>' +
    '<span style="font-size:22px;font-weight:900;font-family:var(--mono);margin-left:8px;color:' + color + '">' + total + '</span>' +
    '<span style="font-size:10px;color:var(--text3)">/80</span>' +
    '<span style="font-size:10px;color:' + color + ';margin-left:8px">· ' + interp + '</span>' +
    '<div style="font-size:9px;color:var(--text3);margin-top:4px">MDC ~11 pts · MCID ~12 pts (Fearon AM et al. Man Ther 2015;20(6):805-13)</div>';
}

// ── Build test groups ──────────────────────────────────────────────────────────
function buildCaderaTests() {
  _buildCaderaTestGroup('cad-tests-intra',    (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.cadera)          || []);
  _buildCaderaTestGroup('cad-tests-gluteal',  (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaGluteal)   || []);
  _buildCaderaTestGroup('cad-tests-fractura', (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaFractura)  || []);
  _buildCaderaTestGroup('cad-tests-oa',       (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaOA)        || []);
}

function buildCaderaIngle() {
  _buildCaderaTestGroup('cad-ingle-aduct', (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaAductores)      || []);
  _buildCaderaTestGroup('cad-ingle-psoas', (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaPsoas)          || []);
  _buildCaderaTestGroup('cad-ingle-ing',   (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaInguinal)       || []);
  _buildCaderaTestGroup('cad-ingle-comp',  (typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaComplementarios) || []);
}

// ── mHHS scale ─────────────────────────────────────────────────────────────────
var CAD_MHHS_ITEMS = [
  { id:'pain',     label:'Dolor',                   hint:'0=severo incapacitante, 44=sin dolor',        max:44 },
  { id:'limp',     label:'Cojera',                  hint:'0=severa, 11=sin cojera',                     max:11 },
  { id:'support',  label:'Soporte',                 hint:'0=imposible, 11=sin soporte',                 max:11 },
  { id:'distance', label:'Distancia caminada',      hint:'0=no puede, 11=sin limitación',               max:11 },
  { id:'stairs',   label:'Escaleras',               hint:'0=no puede, 4=normal',                        max:4  },
  { id:'shoes',    label:'Calzado y medias',        hint:'0=imposible, 4=normal',                       max:4  },
  { id:'sit',      label:'Sentarse',                hint:'0=imposible, 5=en cualquier silla cómodo',    max:5  },
  { id:'transport',label:'Transporte público',      hint:'0=no puede, 1=puede',                         max:1  },
];

function buildCaderaEscalas() {
  var c = document.getElementById('cad-esc-mhhs');
  if (!c || c.innerHTML) return;

  var rows = CAD_MHHS_ITEMS.map(function(item) {
    return '<div style="padding:8px 0;border-bottom:1px solid var(--border)">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px">' +
        '<div>' +
          '<span style="font-size:12px;font-weight:600">' + item.label + '</span>' +
          '<span style="font-size:9px;color:var(--text3);display:block;margin-top:2px">' + item.hint + ' (máx ' + item.max + ')</span>' +
        '</div>' +
        '<input class="inp inp-mono" type="number" id="cad-mhhs-' + item.id + '"' +
          ' min="0" max="' + item.max + '" placeholder="0"' +
          ' style="width:60px;padding:4px 6px;font-size:13px;text-align:center"' +
          ' oninput="_calcMHHS()">' +
      '</div>' +
    '</div>';
  }).join('');

  c.innerHTML = rows +
    '<div style="margin-top:12px;padding:10px;border-radius:8px;background:var(--bg3);text-align:center" id="cad-mhhs-total">' +
      '<span style="font-size:10px;color:var(--text3)">Total mHHS:</span>' +
      '<span style="font-size:22px;font-weight:900;font-family:var(--mono);margin-left:8px;color:var(--text3)">—</span>' +
      '<span style="font-size:10px;color:var(--text3)">/91</span>' +
    '</div>' +
    '<div style="margin-top:8px;font-size:10px;color:var(--text3);padding:6px;background:rgba(251,146,60,.06);border-radius:6px">' +
      '📋 Ver pestaña Ingle/Doha para HAGOS (Hip And Groin Outcome Score).' +
    '</div>';

  // VISA-G
  buildVISAG();

  // HAGOS note in escalas tab
  var hagosCont = document.getElementById('hagos-sheet-fields');
  if (hagosCont && typeof buildHAGOS === 'function') {
    try { buildHAGOS(); } catch(e) { console.warn('buildHAGOS', e); }
  }
}

function _calcMHHS() {
  var total = CAD_MHHS_ITEMS.reduce(function(acc, item) {
    var val = parseFloat(document.getElementById('cad-mhhs-' + item.id)?.value || 0) || 0;
    return acc + Math.min(val, item.max);
  }, 0);
  total = Math.round(total);
  var el = document.getElementById('cad-mhhs-total');
  if (!el) return;
  var color = total >= 80 ? 'var(--neon)' : total >= 70 ? 'var(--amber)' : 'var(--red)';
  var interp = total >= 80 ? 'Buen resultado' : total >= 70 ? 'Resultado aceptable' : 'Resultado malo (< 70)';
  el.innerHTML = '<span style="font-size:10px;color:var(--text3)">Total mHHS:</span>' +
    '<span style="font-size:22px;font-weight:900;font-family:var(--mono);margin-left:8px;color:' + color + '">' + total + '</span>' +
    '<span style="font-size:10px;color:var(--text3)">/91</span>' +
    '<span style="font-size:10px;color:' + color + ';margin-left:8px">· ' + interp + '</span>' +
    '<div style="font-size:9px;color:var(--text3);margin-top:4px">MDC 8 pts · MCID 14 pts (Harris 1969, mod. Byrd 2003)</div>';
}

// ── Recomendaciones EBM por diagnóstico ───────────────────────────────────────
var _RECOM = {
  'fractura-cuello': { urgencia: true, fases:[
    { label:'⚠️ URGENCIA', color:'#cc3333', items:['No cargar peso — inmovilización inmediata','Derivar guardia con Rx pelvis AP urgente','Analgesia IV si está disponible'] }
  ], ref:'Reiman MP et al. BJSM 2012' },

  'fai-sindrome': { fases:[
    { label:'Fase 1 — Control del dolor (sem 0–4)', color:'#b87a00', items:[
      'Educación: evitar flexión >90° + rotación interna combinadas (posición de pinzamiento)',
      'Descarga relativa de actividades provocativas · crioterapia 10–15 min × 3/día',
      'Ejercicio sin impacto: bicicleta sin resistencia, hidroterapia, marcha en piscina'
    ]},
    { label:'Fase 2 — Fortalecimiento (sem 4–12)', color:'#2d7a2d', items:[
      'Glúteo medio y mayor: clamshell con banda, side step, puente unilateral progresivo',
      'Core profundo lumbopélvico: dead bug, bird-dog, pallof press',
      'ROM dirigido: movilidad en extensión y RE — evitar extremo de flexión + RI bajo carga'
    ]},
    { label:'Fase 3 — Retorno funcional (sem 8–16)', color:'#2563a8', items:[
      'Pliometría progresiva y cambios de dirección sin reproducir síntomas',
      'Retorno deportivo por etapas: Trote → Carrera → Corte → Deporte específico',
      'Imagen si no mejora o confirmar morfología: Rx pelvis AP + MRA (ángulo alfa Cam > 55°)',
      'Criterio alta: abductores ≥ 85% bilateral · FADIR sin dolor · escala funcional > 80'
    ]}
  ], ref:'Enseki K et al. JOSPT 2023 CPG · Griffin DR et al. BJSM 2016 (Warwick Agreement) · Ishøi L et al. BJSM 2021' },

  'lesion-labral': { fases:[
    { label:'Fase 1 — Protección (sem 0–4)', color:'#b87a00', items:[
      'Descarga relativa: evitar rotaciones extremas y flexión bajo carga',
      'Crioterapia · AINE tópico si necesario · actividad acuática si tolera',
      'Solicitar Artro-RM para confirmación diagnóstica (Sn 87–91%)'
    ]},
    { label:'Fase 2 — Estabilización (sem 4–12)', color:'#2d7a2d', items:[
      'Fortalecimiento glúteo profundo y rotadores externos: side-lying ER, clamshell, step-up lateral',
      'Control motor: conciencia de posición neutral de cadera · evitar click/dolor en ejercicio',
      'Cadena cinética cerrada progresiva: squat parcial → completo → unilateral'
    ]},
    { label:'Fase 3 — Decisión (> 12 sem)', color:'#2563a8', items:[
      'Si no mejora: valorar artroscopia (desbridamiento o reparación labral)',
      'Post-cirugía: rehabilitación 4–6 meses para retorno deportivo completo',
      'Criterios alta: VAS ≤ 2, déficit fuerza ≤ 15%, single-leg squat sin compensación'
    ]}
  ], ref:'Enseki K et al. JOSPT 2023 CPG · Reiman MP et al. BJSM 2012;2014' },

  'microinestabilidad': { fases:[
    { label:'Fase 1 — Estabilización (sem 0–8)', color:'#b87a00', items:[
      'Evitar posiciones de apprehension: hiperextensión + RE extrema',
      'Fortalecimiento rotadores externos profundos y glúteo menor (hip ER en neutro)',
      'Propiocepción monopodal: balance board, superficies inestables progresivas',
      'Evaluar hiperlaxitud sistémica (Beighton) — si ≥ 4 derivar evaluación displasia'
    ]},
    { label:'Fase 2 — Funcional (sem 8–16)', color:'#2d7a2d', items:[
      'Carga progresiva en posiciones de riesgo controladas',
      'Entrenamiento neuromuscular: perturbaciones reactivas, plyos de baja amplitud',
      'MRA para descartar lesión capsular o labral asociada'
    ]}
  ], ref:'Wong SE et al. Curr Rev Musculoskelet Med 2022 · Enseki K et al. JOSPT 2023 CPG' },

  'displasia-ddh': { fases:[
    { label:'Conservador (sem 0–12)', color:'#b87a00', items:[
      'Fortalecimiento periarticular: glúteos, rotadores, core pélvico (estabilización activa)',
      'Evitar movimientos de inestabilidad: extensión + RE extrema bajo carga',
      'Rx pelvis con protocolo: medir ángulo CE (normal > 25°) y ángulo AI'
    ]},
    { label:'Decisión quirúrgica (> 12 sem)', color:'#cc3333', items:[
      'CEA < 18°: derivar cirugía ortopédica para osteotomía periacetabular (PAO)',
      'CEA 18–25° (borderline): prueba conservadora extendida + reevaluación',
      'Post-PAO: rehabilitación 9–12 meses para retorno deportivo completo'
    ]}
  ], ref:'Enseki K et al. JOSPT 2023 CPG · Wong SE et al. Curr Rev Musculoskelet Med 2022' },

  'tendinopatia-glutea': { fases:[
    { label:'Fase 1 — Descarga y educación (sem 0–4)', color:'#b87a00', items:[
      '⚠️ EDUCACIÓN CLAVE: evitar compresión tendinosa — no cruzar piernas, no aducción, no inclinación lateral del tronco',
      'Posición al dormir: almohada entre rodillas en decúbito lateral · evitar posición "fig. 4"',
      'Isométrico analgésico: abducción de cadera contra pared lateral (30–45 seg × 5 series)'
    ]},
    { label:'Fase 2 — Carga progresiva (sem 4–12)', color:'#2d7a2d', items:[
      'Isotónico: clamshell con banda → abducción en bipedestación → puente glúteo unilateral',
      'RSWT si meseta terapéutica: 2000 pulsos 0.16 mJ/mm², 3–4 sesiones (superior a CSI a 4 meses)',
      'Evitar masaje transverso profundo y estiramiento de banda iliotibial en fase aguda'
    ]},
    { label:'Fase 3 — Carga funcional y retorno (sem 8–20)', color:'#2563a8', items:[
      'Single-leg squat progresivo, step-up lateral, sentadilla con banda, lateral band walk',
      'Trote en línea recta antes de agregar cambios de dirección y velocidad',
      'VISA-G ≥ 70/80 como criterio de retorno deportivo · MDC ~11 · MCID ~12',
      'CSI (corticosteroide): beneficio a 1–3 meses pero inferior al ejercicio a 15 meses (Barratt 2016)'
    ]}
  ], ref:'Barratt PA et al. BJSM 2016 · Lustenberger DP et al. Clin J Sport Med 2011 · Reid D. J Orthop Sports Phys Ther 2016 · Lequesne M et al. Arthritis Rheum 2008' },

  'coxa-saltans': { fases:[
    { label:'Conservador (sem 0–8)', color:'#b87a00', items:[
      'Estiramiento banda iliotibial y psoas · liberación miofascial (foam roller)',
      'Fortalecimiento glúteo: abordar debilidad abductora subyacente',
      'Resolución espontánea frecuente — informar al paciente'
    ]},
    { label:'Si refractario (> 3 meses)', color:'#2563a8', items:[
      'Infiltración ecoguiada de bursa o vaina tendinosa si sintomático severo',
      'Fisioterapia intensiva con control motor y patrones de movimiento'
    ]}
  ], ref:'Enseki K et al. JOSPT 2023 CPG' },

  'ingle-aductor': { fases:[
    { label:'Aguda (sem 0–2)', color:'#b87a00', items:[
      'Reducción de carga: evitar sprint, cambios de dirección y adducción bajo carga',
      'Crioterapia 15 min × 3/día · compresión elástica de cadera/ingle',
      'Marcha sin dolor → trote suave como criterio de progresión'
    ]},
    { label:'Rehabilitación — Copenhagen Protocol (sem 2–8)', color:'#2d7a2d', items:[
      'Copenhagen Adductor Exercise: la intervención con mayor evidencia (Harøy et al. BJSM 2019)',
      'Progresión: aductor isométrico sentado → excéntrico lateral tumbado → Copenhagen completo',
      'Complemento: core, abductores, psoas en cadena · 3 sesiones/semana'
    ]},
    { label:'Retorno deportivo (sem 8–16)', color:'#2563a8', items:[
      'Criterio retorno: squeeze test bilateral sin dolor · fuerza aductora ≥ 90% contralateral',
      'Progresión: Trote → Sprint → Cambios de dirección → Entrenamiento específico → Competición',
      'Criterio alta: HAGOS Deporte > 80/100 · adductor strength test sin dolor'
    ]}
  ], ref:'Delahunt E et al. BJSM 2015 (Doha) · Harøy J et al. BJSM 2019 (Copenhagen Adductor Exercise)' },

  'ingle-psoas': { fases:[
    { label:'Aguda (sem 0–2)', color:'#b87a00', items:[
      'Reducción de carga: evitar flexión de cadera contra resistencia y sprint',
      'Crioterapia · compresión · AINE tópico si necesario'
    ]},
    { label:'Rehabilitación (sem 2–10)', color:'#2d7a2d', items:[
      'Fortalecimiento excéntrico progresivo de flexores de cadera',
      'Control motor lumbopélvico: disociación lumbo-cadera, estabilización anti-extensión',
      'Estiramiento suave de psoas en fase subaguda (no en aguda)'
    ]},
    { label:'Retorno (sem 8–12)', color:'#2563a8', items:[
      'Progresión: trote → aceleración → sprint completo · sin dolor en flexión resistida',
      'Criterio: Thomas test sin limitación significativa · HAGOS ≥ 80'
    ]}
  ], ref:'Delahunt E et al. BJSM 2015 (Doha)' },

  'ingle-inguinal': { fases:[
    { label:'Conservador (sem 0–6)', color:'#b87a00', items:[
      'Reducción actividades provocativas: sprint, Valsalva, cambios de dirección bruscos',
      'Fortalecimiento core y pared abdominal: crunch oblicuo, plancha, pallof press',
      'Derivar cirugía si no mejora en 6 semanas (hernia deportiva generalmente requiere reparación)'
    ]},
    { label:'Quirúrgico (si indicado)', color:'#2563a8', items:[
      'Reparación laparoscópica de pared posterior (TEP/TAPP): mejor evidencia disponible',
      'Retorno deportivo post-cirugía: 6–8 semanas con protocolo progresivo específico'
    ]}
  ], ref:'Delahunt E et al. BJSM 2015 (Doha)' },

  'osteitis-pubis': { fases:[
    { label:'Aguda — reposo relativo (sem 0–4)', color:'#b87a00', items:[
      'Reducción de carga de alta intensidad · actividad en piscina si tolera',
      'Infiltración corticoide en sínfisis si dolor severo (alivio 1–4 semanas)',
      'RMN: confirmar edema óseo bilateral en sínfisis pubis'
    ]},
    { label:'Rehabilitación (sem 4–16)', color:'#2d7a2d', items:[
      'Core y estabilización pélvica: prioridad absoluta (transverso abdominal, oblicuos)',
      'Fortalecimiento de aductores y abductores de forma progresiva y bilateral',
      'Recuperación lenta: 3–6 meses en promedio para retorno deportivo completo'
    ]}
  ], ref:'Delahunt E et al. BJSM 2015 (Doha)' },

  'artrosis-cadera': { fases:[
    { label:'Manejo conservador activo (continuo)', color:'#b87a00', items:[
      'Ejercicio aeróbico: 150 min/semana de intensidad moderada — Evidencia A (ACR 2019)',
      'Fortalecimiento: cuádriceps, glúteos, core — mínimo 2× semana con progresión de carga',
      'Control de peso: -5–10% reduce dolor y mejora función significativamente',
      'Educación: dolor ≠ daño — movimiento seguro es medicina · autogestión activa'
    ]},
    { label:'Manejo farmacológico / infiltración', color:'#2d7a2d', items:[
      'AINE tópico (diclofenaco gel): primera línea farmacológica OA leve-moderada',
      'Corticosteroide intraarticular: alivio 4–8 semanas · repetir con imagen si necesario',
      'Ácido hialurónico: beneficio modesto en OA leve-moderada · alternativa a corticoide'
    ]},
    { label:'Criterios derivación quirúrgica', color:'#cc3333', items:[
      'Indicación ATC: dolor severo refractario + discapacidad + fracaso conservador ≥ 3 meses',
      'Post-ATC: fisioterapia intensiva primeras 12 semanas · retorno actividad ≥ 6 meses',
      'Artroplastia = mayor MCID en dolor y función a 1 año (> cualquier intervención conservadora)'
    ]}
  ], ref:'Simel DL et al. JAMA 2019 · Enseki K et al. JOSPT 2023 CPG · Kolasinski SL et al. ACR 2019' },

  'ligamento-redondo': { fases:[
    { label:'Conservador (sem 0–8)', color:'#b87a00', items:[
      'Evitar movimientos de rotación con carga que reproduzcan el click/dolor',
      'Estabilización dinámica de cadera: rotadores, glúteo, core'
    ]},
    { label:'Quirúrgico (si refractario)', color:'#2563a8', items:[
      'Artroscopia diagnóstica y terapéutica: desbridamiento o reparación ligamentum teres',
      'Retorno deportivo post-cirugía: 3–4 meses con protocolo progresivo'
    ]}
  ], ref:'Enseki K et al. JOSPT 2023 CPG' }
};

// ── Informe ────────────────────────────────────────────────────────────────────
function generarInformeCadera() {
  if (!cur) { alert('Abrí la ficha del paciente primero'); return; }

  var gt = function(id) { return (document.getElementById(id) || {}).textContent?.trim() || ''; };
  var gv = function(id) { return (document.getElementById(id) || {}).value?.trim()       || ''; };

  var nombre  = (typeof cur !== 'undefined' && cur.nombre)  || '—';
  var edad    = (typeof cur !== 'undefined' && cur.edad)    || '';
  var deporte = (typeof cur !== 'undefined' && cur.deporte) || '';
  var fecha   = new Date().toLocaleDateString('es-AR', {day:'2-digit', month:'long', year:'numeric'});

  var nprs     = gv('cad-nprs');
  var tiempo   = gv('cad-tiempo');
  var mecanismo = gv('cad-mecanismo');
  var obsText  = gv('cad-obs');

  // Location checkboxes
  var locs = [];
  if (document.getElementById('cad-loc-ingle')?.checked)    locs.push('Ingle');
  if (document.getElementById('cad-loc-lateral')?.checked)  locs.push('Lateral');
  if (document.getElementById('cad-loc-posterior')?.checked) locs.push('Posterior');
  if (document.getElementById('cad-loc-difuso')?.checked)   locs.push('Difuso');

  // ROM
  var romUnit = gt('cad-rom-unit-global') || '°';
  var romRows = (typeof CADERA_ROM !== 'undefined' ? CADERA_ROM : []).map(function(r) {
    var act   = gv('cad-rom-' + r.id + '-act');
    var evaEl = document.getElementById('cad-rom-' + r.id + '-eva');
    var eva   = evaEl ? +evaEl.value : 0;
    if (!act && eva === 0) return null;
    return { label: r.label, ref: r.ref, mdc: r.mdc, act: act, unit: romUnit, eva: eva };
  }).filter(Boolean);

  // Tests
  var allTestDefs = [
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.cadera             ? ORTHO_TESTS.cadera             : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaGluteal      ? ORTHO_TESTS.caderaGluteal      : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaGTPS         ? ORTHO_TESTS.caderaGTPS         : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaFractura     ? ORTHO_TESTS.caderaFractura     : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.caderaOA           ? ORTHO_TESTS.caderaOA           : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaAductores      ? ORTHO_TESTS.dohaAductores      : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaPsoas          ? ORTHO_TESTS.dohaPsoas          : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaInguinal       ? ORTHO_TESTS.dohaInguinal       : []),
    ...(typeof ORTHO_TESTS !== 'undefined' && ORTHO_TESTS.dohaComplementarios ? ORTHO_TESTS.dohaComplementarios : [])
  ];
  var nm = function(id) { return (allTestDefs.find(function(t) { return t.id === id; }) || {}).name || id; };

  var tests = [];
  allTestDefs.forEach(function(test) {
    var card = document.querySelector('#sheet-cadera [data-test-id="' + test.id + '"]');
    if (!card) return;
    var cols = card.querySelectorAll('.cad-test-col');
    var dR = null, iR = null, evaD = '—', evaI = '—';
    cols.forEach(function(col, idx) {
      var r = col.querySelector('.ot-btn.pos') ? 'POS' : (col.querySelector('.ot-btn.neg') ? 'NEG' : null);
      var s = col.querySelector('.cad-eva-slider');
      if (idx === 0) { dR = r; evaD = s ? s.value : '—'; }
      else           { iR = r; evaI = s ? s.value : '—'; }
    });
    if (dR || iR) tests.push({ name: test.name, sub: test.sub, dR: dR, iR: iR, evaD: evaD, evaI: evaI });
  });

  // Diagnosis
  var positivos = _getCaderaModalPositivos();
  var dxResult  = typeof diagnosticarCadera === 'function' ? diagnosticarCadera(positivos) : { diagnosticos: [], banderasRojas: [] };

  // mHHS
  var mhhsTotal = CAD_MHHS_ITEMS.reduce(function(acc, item) {
    var val = parseFloat((document.getElementById('cad-mhhs-' + item.id) || {}).value || 0) || 0;
    return acc + Math.min(val, item.max);
  }, 0);
  mhhsTotal = Math.round(mhhsTotal);
  var hasMhhs = CAD_MHHS_ITEMS.some(function(item) { return !!document.getElementById('cad-mhhs-' + item.id)?.value; });

  // VISA-G
  var visagTotal = visagVals.reduce(function(a, b) { return a + (b || 0); }, 0);
  var hasVisag = visagVals.some(function(v) { return v !== null && v > 0; });

  // HAGOS subscale scores
  var hagosScores = typeof _getHAGOSScores === 'function' ? _getHAGOSScores() : [];
  var hasHagos = hagosScores.length > 0;

  var css = [
    'body{font-family:Inter,Arial,sans-serif;margin:0;background:#fff;color:#1a1a1a;font-size:12px;line-height:1.5}',
    'table{width:100%;border-collapse:collapse;font-size:11px}',
    'th{background:#7e5ba8;color:#fff;padding:6px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}',
    'td{padding:5px 8px;border-bottom:1px solid #e8e0f0}',
    'tr:nth-child(even) td{background:#f7f4fb}',
    '.pos{color:#2d7a2d;font-weight:700} .neg{color:#888}',
    '.sec-badge{display:inline-block;background:#7e5ba8;color:#fff;font-size:9px;font-weight:900;padding:2px 9px;border-radius:3px;letter-spacing:1px;margin-right:8px}',
    '.sec-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#2a1a42}',
    '.sec-head{display:flex;align-items:center;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid #e8e0f0}',
    '.intro-box{font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f7f4fb;border-radius:5px;border-left:3px solid #7e5ba8}',
    '.dx-card{padding:10px;border:1px solid #e8e0f0;border-radius:6px;margin-bottom:8px}',
    '@media print{header{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
  ].join('');

  var _sec = function(num, title) {
    return '<div class="sec-head"><span class="sec-badge">' + num + '</span><span class="sec-title">' + title + '</span></div>';
  };

  var sec01 = _sec('01','Perfil del paciente') +
    '<div class="intro-box">Datos clínicos registrados al inicio de la evaluación de cadera.</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div style="background:#f7f4fb;border-radius:6px;padding:12px;border:1px solid #e8e0f0">' +
        '<div style="font-size:9px;text-transform:uppercase;color:#7e5ba8;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos del Paciente</div>' +
        (nombre ? '<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Nombre:</span> <strong>' + nombre + '</strong></div>' : '') +
        (edad   ? '<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Edad:</span> ' + edad + ' años</div>' : '') +
        (deporte ? '<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Deporte:</span> ' + deporte + '</div>' : '') +
        '<div><span style="font-size:10px;color:#888">Fecha:</span> ' + fecha + '</div>' +
      '</div>' +
      '<div style="background:#f7f4fb;border-radius:6px;padding:12px;border:1px solid #e8e0f0">' +
        '<div style="font-size:9px;text-transform:uppercase;color:#7e5ba8;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos Clínicos</div>' +
        (nprs       ? '<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">NPRS:</span> ' + nprs + '/10</div>' : '') +
        (tiempo     ? '<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Evolución:</span> ' + tiempo + '</div>' : '') +
        (mecanismo  ? '<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Mecanismo:</span> ' + mecanismo + '</div>' : '') +
        (locs.length ? '<div style="margin-bottom:4px"><span style="font-size:10px;color:#888">Localización:</span> ' + locs.join(', ') + '</div>' : '') +
        (obsText    ? '<div><span style="font-size:10px;color:#888">Obs:</span> ' + obsText + '</div>' : '') +
      '</div>' +
    '</div>';

  var dolorosos = romRows.filter(function(r) { return r.eva > 0; }).map(function(r) { return r.label + ' (EVA ' + r.eva + '/10)'; });
  var sec02 = romRows.length ? (
    _sec('02','Rango de movimiento (ROM)') +
    '<div class="intro-box">AROM con inclinómetro (°). MDC ≈ 4–5°. EVA = dolor reproducido. Ref: Enseki 2023 CPG · Clohisy 2009.</div>' +
    '<table><tr><th>Movimiento</th><th>Ref.</th><th>MDC</th><th>AROM</th><th>EVA repro</th></tr>' +
    romRows.map(function(r) {
      return '<tr><td><strong>' + r.label + '</strong></td>' +
        '<td style="color:#888">' + r.ref + '</td>' +
        '<td style="color:#888">' + r.mdc + '</td>' +
        '<td>' + (r.act ? r.act + (r.unit || '°') : '—') + '</td>' +
        '<td style="text-align:center">' + (r.eva > 0 ? '<span style="color:#cc3333;font-weight:700">' + r.eva + '/10</span>' : '<span style="color:#aaa">0</span>') + '</td>' +
        '</tr>';
    }).join('') + '</table>' +
    (dolorosos.length ? '<div style="margin-top:6px;padding:7px 10px;background:#fff5f5;border:1px solid #ffc0c0;border-radius:5px;font-size:10px"><strong style="color:#cc3333">Movimientos que reproducen síntomas:</strong> ' + dolorosos.join(' · ') + '</div>' : '')
  ) : '';

  var posTests = tests.filter(function(t) { return t.dR === 'POS' || t.iR === 'POS'; });
  var negTests = tests.filter(function(t) { return (t.dR === 'NEG' || t.iR === 'NEG') && t.dR !== 'POS' && t.iR !== 'POS'; });
  var sec03 = tests.length ? (
    _sec('03','Tests ortopédicos') +
    '<div class="intro-box">Tests estandarizados. POSITIVO = reproduce síntomas. EVA indica intensidad (0–10). Fuentes: Reiman 2012/2014 · Simel 2019 · Doha 2015.</div>' +
    '<table><tr><th>Test</th><th>Estructura / EBM</th><th>D</th><th>EVA D</th><th>I</th><th>EVA I</th></tr>' +
    posTests.map(function(t) {
      return '<tr>' +
        '<td><strong>' + t.name + '</strong></td><td style="font-size:10px;color:#666">' + t.sub + '</td>' +
        '<td class="' + (t.dR === 'POS' ? 'pos' : t.dR === 'NEG' ? 'neg' : '') + '">' + (t.dR || '—') + '</td>' +
        '<td>' + (t.dR === 'POS' ? t.evaD : '—') + '</td>' +
        '<td class="' + (t.iR === 'POS' ? 'pos' : t.iR === 'NEG' ? 'neg' : '') + '">' + (t.iR || '—') + '</td>' +
        '<td>' + (t.iR === 'POS' ? t.evaI : '—') + '</td>' +
        '</tr>';
    }).join('') +
    negTests.map(function(t) {
      return '<tr style="opacity:.7"><td>' + t.name + '</td><td style="font-size:10px;color:#666">' + t.sub + '</td>' +
        '<td class="neg">' + (t.dR || '—') + '</td><td>—</td>' +
        '<td class="neg">' + (t.iR || '—') + '</td><td>—</td></tr>';
    }).join('') + '</table>'
  ) : '';

  var sec04 = dxResult.diagnosticos.length ? (
    _sec('04','Diagnóstico EBM') +
    '<div class="intro-box">Motor de inferencia basado en: Enseki 2023 CPG · Reiman BJSM 2012/2014 · Delahunt Doha 2015 · Simel JAMA 2019. No reemplaza el juicio clínico.</div>' +
    dxResult.diagnosticos.map(function(dx, i) {
      var colorMap = { red:'#cc3333', neon:'#2d7a2d', amber:'#b87a00', blue:'#2563a8', orange:'#b05a00', text:'#1a1a1a' };
      var c = colorMap[dx.colorKey] || '#7e5ba8';
      return '<div class="dx-card" style="border-color:' + c + '44">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">' +
          '<span style="font-size:12px;font-weight:800;color:' + c + '">' + (i === 0 ? '🏆 ' : '') + dx.nombre + '</span>' +
          '<span style="font-size:10px;font-weight:700;color:' + c + '">' + dx.confianzaLabel + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:#444;line-height:1.4;margin-bottom:6px">' + dx.criterio + '</div>' +
        (dx.mainHits.length || dx.supportHits.length ? '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">' +
          dx.mainHits.map(function(t) { return '<span style="background:#ffd0d0;color:#cc3333;padding:2px 6px;border-radius:3px;font-size:9px">+ ' + nm(t) + '</span>'; }).join('') +
          dx.supportHits.map(function(t) { return '<span style="background:#fff3cd;color:#b87a00;padding:2px 6px;border-radius:3px;font-size:9px">+ ' + nm(t) + '</span>'; }).join('') +
        '</div>' : '') +
        '<div style="font-size:10px;line-height:1.4;color:#1a1a1a;padding-top:4px;border-top:1px solid #e8e0f0"><strong>Tratamiento:</strong> ' + dx.tratamiento.replace(/\n/g,' · ') + '</div>' +
        '<div style="font-size:9px;color:#888;margin-top:4px;font-style:italic">' + dx.ref + '</div>' +
      '</div>';
    }).join('')
  ) : '';


  var visagColor = visagTotal >= 60 ? '#2d7a2d' : visagTotal >= 40 ? '#b87a00' : '#cc3333';
  var visagInterp = visagTotal >= 60 ? 'Función conservada' : visagTotal >= 40 ? 'Limitación moderada' : 'Limitación severa';
  var sec05b = hasVisag ? (
    '<div style="margin-top:12px">' +
    '<div class="intro-box">VISA-G: Victorian Institute of Sport Assessment – Gluteal. 8 ítems /80. MDC ~11 pts · MCID ~12 pts. Fearon AM et al. Man Ther 2015;20(6):805-13.</div>' +
    '<div style="background:#f7f4fb;border-radius:6px;padding:12px;border:1px solid #e8e0f0;text-align:center">' +
      '<div style="font-size:9px;text-transform:uppercase;color:#7e5ba8;font-weight:700;margin-bottom:4px">VISA-G</div>' +
      '<div style="font-size:28px;font-weight:900;color:' + visagColor + '">' + visagTotal + '<span style="font-size:14px;color:#888">/80</span></div>' +
      '<div style="font-size:11px;color:' + visagColor + ';font-weight:600">' + visagInterp + '</div>' +
    '</div></div>'
  ) : '';

  var hagosTableRows = hagosScores.map(function(s) {
    var interp = s.score >= 75 ? 'Leve / normal' : s.score >= 50 ? 'Moderado' : 'Severo';
    var c = s.score >= 75 ? '#2d7a2d' : s.score >= 50 ? '#b87a00' : '#cc3333';
    return '<tr><td><strong>' + s.label + '</strong></td>' +
      '<td style="font-weight:700;color:' + c + ';text-align:center">' + s.score + '/100</td>' +
      '<td style="color:' + c + '">' + interp + '</td></tr>';
  }).join('');
  var sec05hagos = hasHagos ? (
    '<div style="margin-top:12px">' +
    '<div class="intro-box">HAGOS: Hip And Groin Outcome Score · Thorborg K et al. BJSM 2011 · 37 ítems · 6 subescalas · 0 = máximos síntomas · 100 = sin síntomas</div>' +
    '<table><tr><th>Subescala</th><th>Score</th><th>Severidad</th></tr>' + hagosTableRows + '</table>' +
    '</div>'
  ) : '';

  var sec05combined = (hasMhhs || hasVisag || hasHagos) ? (
    _sec('05','Escalas funcionales') +
    (hasMhhs ? ('<div class="intro-box">mHHS: Modified Harris Hip Score (máx 91). MDC 8 pts · MCID 14 pts. Byrd 2003.</div>' +
    '<div style="background:#f7f4fb;border-radius:6px;padding:12px;border:1px solid #e8e0f0;text-align:center;margin-bottom:10px">' +
      '<div style="font-size:9px;text-transform:uppercase;color:#7e5ba8;font-weight:700;margin-bottom:4px">mHHS</div>' +
      '<div style="font-size:28px;font-weight:900;color:' + (mhhsTotal >= 80 ? '#2d7a2d' : mhhsTotal >= 70 ? '#b87a00' : '#cc3333') + '">' + mhhsTotal + '<span style="font-size:14px;color:#888">/91</span></div>' +
      '<div style="font-size:11px;color:' + (mhhsTotal >= 80 ? '#2d7a2d' : mhhsTotal >= 70 ? '#b87a00' : '#cc3333') + ';font-weight:600">' + (mhhsTotal >= 80 ? 'Buen resultado' : mhhsTotal >= 70 ? 'Resultado aceptable' : 'Resultado malo') + '</div>' +
    '</div>') : '') +
    sec05b + sec05hagos
  ) : '';

  // Sec 06 — Recomendaciones EBM
  var topDx = dxResult.diagnosticos[0] || null;
  var sec06 = '';
  if (topDx) {
    var recomData = _RECOM[topDx.id];
    var colorMap6 = { red:'#cc3333', neon:'#2d7a2d', amber:'#b87a00', blue:'#2563a8', orange:'#b05a00', text:'#444' };
    var dxColor6 = colorMap6[topDx.colorKey] || '#7e5ba8';
    if (recomData) {
      sec06 = _sec('06','Recomendaciones EBM — ' + topDx.nombre) +
        '<div class="intro-box">Plan de tratamiento basado en evidencia para el diagnóstico principal. Adaptar según etapa clínica, tolerancia y respuesta individual. No reemplaza el juicio clínico.</div>' +
        recomData.fases.map(function(fase) {
          return '<div style="margin-bottom:12px;border-left:3px solid ' + fase.color + ';padding:10px 14px;background:#fafafa;border-radius:0 6px 6px 0">' +
            '<div style="font-size:10px;font-weight:800;color:' + fase.color + ';text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">' + fase.label + '</div>' +
            '<ul style="margin:0;padding-left:16px;font-size:10px;line-height:1.75;color:#333">' +
            fase.items.map(function(it) { return '<li style="margin-bottom:2px">' + it + '</li>'; }).join('') +
            '</ul></div>';
        }).join('') +
        '<div style="font-size:9px;color:#888;font-style:italic;margin-top:6px">Referencias: ' + recomData.ref + '</div>';
    } else {
      sec06 = _sec('06','Recomendaciones EBM — ' + topDx.nombre) +
        '<div class="intro-box">Plan basado en el tratamiento recomendado para el diagnóstico principal.</div>' +
        '<ul style="font-size:10px;line-height:1.8;color:#333;padding-left:20px;margin:0">' +
        topDx.tratamiento.split('·').map(function(it) { return '<li>' + it.trim() + '</li>'; }).join('') + '</ul>' +
        '<div style="font-size:9px;color:#888;font-style:italic;margin-top:6px">' + topDx.ref.replace(/\n/g,' · ') + '</div>';
    }
  }

  var win = window.open('', '_blank');
  win.document.write('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe Cadera — ' + nombre + '</title><style>' + css + '</style></head>' +
    '<body style="padding:32px;max-width:860px;margin:0 auto">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #7e5ba8">' +
      '<div>' +
        '<div style="font-size:22px;font-weight:900;color:#2a1a42">Informe de evaluación</div>' +
        '<div style="font-size:14px;color:#7e5ba8;font-weight:700">🦴 Cadera — Enseki 2023 CPG · Reiman 2012/2014 · Doha 2015 · Simel 2019 · Barratt BJSM 2016</div>' +
      '</div>' +
      '<div style="text-align:right;font-size:10px;color:#888">' + fecha + '<br><span style="font-size:9px">MoveMetrics v12</span></div>' +
    '</div>' +
    sec01 + sec02 + sec03 + sec04 + sec05combined + sec06 +
    '<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e8e0f0;font-size:9px;color:#aaa;text-align:center">' +
      'Enseki K et al. JOSPT 2023 · Reiman MP et al. BJSM 2012;2014 · Delahunt E et al. BJSM 2015 (Doha) · Simel DL et al. JAMA 2019 · Griffin DR et al. BJSM 2016 · Thorborg K et al. BJSM 2011 · No reemplaza el juicio clínico' +
    '</div>' +
    '<script>setTimeout(function(){window.print();},400)<\/script>' +
    '</body></html>');
  win.document.close();
}

// ── Init ───────────────────────────────────────────────────────────────────────
function initCaderaSheet() {
  buildCaderaROM();
  buildCaderaTests();
  buildCaderaIngle();
  buildCaderaGTPS();
  buildCaderaEscalas();
}

// ── Expose globals ─────────────────────────────────────────────────────────────
window.showCaderaTab          = showCaderaTab;
window.checkCaderaRedFlags    = checkCaderaRedFlags;
window._caderaRomEvaUpdate    = _caderaRomEvaUpdate;
window._caderaRomSetUnit      = _caderaRomSetUnit;
window.buildCaderaROM         = buildCaderaROM;
window.toggleOTCadera         = toggleOTCadera;
window._getCaderaModalPositivos = _getCaderaModalPositivos;
window._renderCaderaFromModal = _renderCaderaFromModal;
window.buildCaderaTests       = buildCaderaTests;
window.buildCaderaIngle       = buildCaderaIngle;
window.buildCaderaGTPS        = buildCaderaGTPS;
window.buildCaderaEscalas     = buildCaderaEscalas;
window._calcMHHS              = _calcMHHS;
window.buildVISAG             = buildVISAG;
window._calcVISAG             = _calcVISAG;
window._gtpsTratCard          = _gtpsTratCard;
window.visagVals              = visagVals;
window.generarInformeCadera   = generarInformeCadera;
window.initCaderaSheet        = initCaderaSheet;

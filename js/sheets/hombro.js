// sheets/hombro.js — hoja clínica hombro/muñeca (ROM, tests, fuerza, ASES, WORC, DASH, SPADI)
function buildHombroROM() {
  const c = document.getElementById('hombro-rom-fields'); if(!c) return; c.innerHTML = '';
  c.innerHTML = ROM_HOMBRO.map(m => `
    <div class="card mb-8">
      <div class="card-header"><h3>${m.label}</h3><span class="tag tag-b">Ref: ${m.ref}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">Activo D (°)</label><input class="inp inp-mono" type="number" id="rom-${m.id}-act-d" placeholder="0" oninput="calcTROMSheet()"></div>
          <div class="ig"><label class="il">Activo I (°)</label><input class="inp inp-mono" type="number" id="rom-${m.id}-act-i" placeholder="0" oninput="calcTROMSheet()"></div>
          <div class="ig"><label class="il">Pasivo D (°)</label><input class="inp inp-mono" type="number" id="rom-${m.id}-pas-d" placeholder="0"></div>
          <div class="ig"><label class="il">Pasivo I (°)</label><input class="inp inp-mono" type="number" id="rom-${m.id}-pas-i" placeholder="0"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function calcTROMSheet() {
  const riD = +document.getElementById('rom-ri-act-d')?.value||0;
  const reD = +document.getElementById('rom-re-act-d')?.value||0;
  const riI = +document.getElementById('rom-ri-act-i')?.value||0;
  const reI = +document.getElementById('rom-re-act-i')?.value||0;
  const tD = riD+reD, tI = riI+reI;
  const elD = document.getElementById('hombro-trom-d'), elI = document.getElementById('hombro-trom-i');
  if(elD){ elD.textContent = tD>0?tD+'°':'—'; elD.style.color=tD>=90?'var(--neon)':tD>=80?'var(--amber)':'var(--red)'; }
  if(elI){ elI.textContent = tI>0?tI+'°':'—'; elI.style.color=tI>=90?'var(--neon)':tI>=80?'var(--amber)':'var(--red)'; }
  const elG = document.getElementById('hombro-gird-result');
  if(elG && tD>0 && tI>0) {
    const diff = Math.abs(tD-tI);
    const c = diff>=18?'var(--red)':diff>=10?'var(--amber)':'var(--neon)';
    elG.innerHTML = `Diferencia TROM: <span style="color:${c};font-weight:700">${diff}°</span> ${diff>=18?'⚠️ GIRD ≥18° significativo':'✓ Normal'}`;
  }
}

// All test IDs that were performed (either POS or NEG pressed) in the hombro modal
function _getDoneHombroTestIds() {
  const done = new Set();
  const htabTests = document.getElementById('htab-tests');
  if (htabTests) {
    const paCard = htabTests.querySelector('.card.mb-10');
    if (paCard) {
      const cols = paCard.querySelectorAll('.grid-2 > div');
      if (cols[0]?.querySelector('.ot-btn.pos,.ot-btn.neg') || cols[1]?.querySelector('.ot-btn.pos,.ot-btn.neg')) done.add('painful-arc');
    }
  }
  document.querySelectorAll('#hombro-tests-rapidos .card').forEach((card, idx) => {
    const test = (HOMBRO_TESTS||[])[idx]; if (!test) return;
    const cols = card.querySelectorAll('.card-body .grid-2 > div');
    if (cols[0]?.querySelector('.ot-btn.pos,.ot-btn.neg') || cols[1]?.querySelector('.ot-btn.pos,.ot-btn.neg')) done.add(test.id);
  });
  return done;
}

// Read all positive test IDs from the hombro modal Tests tab
function _getHombroModalPositivos() {
  const pos = [];
  // Painful arc (hardcoded first card in htab-tests)
  const htabTests = document.getElementById('htab-tests');
  if (htabTests) {
    const paCard = htabTests.querySelector('.card.mb-10');
    if (paCard) {
      const cols = paCard.querySelectorAll('.grid-2 > div');
      if (cols[0]?.querySelector('.ot-btn.pos') || cols[1]?.querySelector('.ot-btn.pos')) pos.push('painful-arc');
    }
  }
  // Quick test cards (HOMBRO_TESTS)
  document.querySelectorAll('#hombro-tests-rapidos .card').forEach((card, idx) => {
    const test = (HOMBRO_TESTS||[])[idx]; if (!test) return;
    const cols = card.querySelectorAll('.card-body .grid-2 > div');
    if (cols[0]?.querySelector('.ot-btn.pos') || cols[1]?.querySelector('.ot-btn.pos')) pos.push(test.id);
  });
  return pos;
}

// Hombro-specific toggle: also locks EVA slider when NEG selected
// and triggers automatic EBM diagnostic update
function toggleOTHombro(btn, type) {
  const btnGroup = btn.parentElement;
  btnGroup.querySelectorAll('.ot-btn').forEach(b => b.classList.remove('pos','neg'));
  btn.classList.add(type);
  // lock EVA slider in same column div
  const col = btnGroup.parentElement;
  const slider = col.querySelector('.eva-slider');
  const valEl  = col.querySelector('.eva-val');
  if (slider) {
    if (type === 'neg') {
      slider.disabled = true;
      slider.value = 0;
      slider.style.opacity = '0.25';
      slider.style.pointerEvents = 'none';
      if (valEl) valEl.textContent = '0';
    } else {
      slider.disabled = false;
      slider.style.opacity = '1';
      slider.style.pointerEvents = '';
    }
  }
  // Run EBM diagnostic engine with current modal test state
  setTimeout(() => {
    if (typeof renderDiagnosticosHombro === 'function') renderDiagnosticosHombro(_getHombroModalPositivos());
    _renderHombroMissingAlerts();
  }, 0);
}

// Live in-modal notification: key tests not yet performed that would change the diagnosis
function _renderHombroMissingAlerts() {
  const panel = document.getElementById('hombro-missing-alerts-panel');
  if (!panel) return;
  const positivos = _getHombroModalPositivos();
  const doneIds   = _getDoneHombroTestIds();
  if (!positivos.length || typeof HOMBRO_RULES === 'undefined') { panel.innerHTML = ''; return; }

  const htl   = [...(typeof HOMBRO_TESTS !== 'undefined' ? HOMBRO_TESTS : []), { id: 'painful-arc', name: 'Arco Doloroso' }];
  const tnOf  = id => (htl.find(t => t.id === id)?.name || id);
  const tnSub = id => (htl.find(t => t.id === id)?.sub  || '');

  const alerts = [];
  HOMBRO_RULES.diagnosticos.forEach(dx => {
    const ph = dx.testsKey.filter(t => positivos.includes(t));
    const nd = dx.testsKey.filter(t => !doneIds.has(t));
    if (ph.length >= 1 && nd.length > 0) {
      alerts.push({
        dxNombre: dx.nombre, categoria: dx.categoria,
        missing: nd, imagingRec: dx.imagingRec || null,
        reason: ph.length >= dx.umbral ? 'confirmar hallazgo' : 'descartar diagnóstico'
      });
    }
  });

  if (!alerts.length) { panel.innerHTML = ''; return; }

  let h = `<div style="background:rgba(255,193,7,.08);border:1px solid var(--amber);border-radius:var(--r);padding:12px 14px;margin-top:10px">
    <div style="font-size:11px;font-weight:800;color:var(--amber);margin-bottom:6px;display:flex;align-items:center;gap:8px">
      ⚠️ Tests complementarios recomendados
      <span style="font-size:9px;font-weight:500;color:var(--text3)">${alerts.length} diagnóstico${alerts.length > 1 ? 's' : ''} sin confirmar</span>
    </div>
    <div style="font-size:10px;color:var(--text2);margin-bottom:10px;line-height:1.5">
      Tests clave no realizados que cambiarían la certeza diagnóstica. Realizarlos antes de concluir la evaluación:
    </div>`;

  alerts.forEach(al => {
    const missingHTML = al.missing.map(id => {
      const sub = tnSub(id);
      return `<span style="background:rgba(255,193,7,.15);border:1px solid var(--amber);color:var(--text);font-size:9px;padding:2px 8px;border-radius:3px;font-weight:600">${tnOf(id)}${sub ? ` <span style="opacity:.65;font-size:8px">(${sub})</span>` : ''}</span>`;
    }).join(' ');
    h += `<div style="margin-bottom:8px;padding:9px 11px;background:var(--bg2);border-radius:5px;border-left:3px solid var(--amber)">
      <div style="font-size:10px;font-weight:700;color:var(--text);margin-bottom:5px">
        ${al.dxNombre} <span class="tag tag-y" style="font-size:8px">${al.reason}</span>
      </div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:6px">→ Realizar: ${missingHTML}</div>`;
    if (al.imagingRec) {
      h += `<div style="font-size:9px;color:var(--text3);line-height:1.5;padding:5px 8px;background:var(--bg3);border-radius:3px">📷 ${al.imagingRec}</div>`;
    }
    h += '</div>';
  });

  h += '</div>';
  panel.innerHTML = h;
}

function buildHombroTests() {
  const c = document.getElementById('hombro-tests-rapidos'); if(!c) return; c.innerHTML = '';
  const col = (side) => `
    <div>
      <div class="il mb-4">${side}</div>
      <div style="display:flex;gap:6px">
        <button class="ot-btn" onclick="toggleOTHombro(this,'pos')">+ POS</button>
        <button class="ot-btn" onclick="toggleOTHombro(this,'neg')">– NEG</button>
      </div>
      <div class="ig mt-6">
        <label class="il" style="font-size:10px">EVA ${side}</label>
        <input type="range" class="eva-slider" min="0" max="10" value="0"
          oninput="this.nextElementSibling.textContent=this.value">
        <span class="eva-val" style="font-family:var(--mono);font-size:13px;display:block;text-align:center">0</span>
      </div>
    </div>`;
  c.innerHTML = HOMBRO_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header"><h3>${t.name}</h3><span class="tag ${t.tag}" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:10px">${col('D')}${col('I')}</div>
      </div>
    </div>`).join('');
}

function buildHombroFuerza() {
  const c = document.getElementById('hombro-fuerza-fields'); if(!c) return; c.innerHTML = '';
  c.innerHTML = FUERZA_HOMBRO.map(m => `
    <div class="card mb-8">
      <div class="card-header"><h3>${m.label}</h3><span class="tag tag-b">${m.angulo}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">D (N)</label><input class="inp inp-mono" type="number" step="0.1" id="fuerza-${m.id}-d" placeholder="0.0" oninput="calcHombroAsimetria()"></div>
          <div class="ig"><label class="il">I (N)</label><input class="inp inp-mono" type="number" step="0.1" id="fuerza-${m.id}-i" placeholder="0.0" oninput="calcHombroAsimetria()"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function calcHombroAsimetria() {
  const results = FUERZA_HOMBRO.map(m => {
    const d = +document.getElementById('fuerza-'+m.id+'-d')?.value||0;
    const i = +document.getElementById('fuerza-'+m.id+'-i')?.value||0;
    if(!d&&!i) return null;
    const mayor = Math.max(d,i), menor = Math.min(d,i);
    const asim = mayor>0?((mayor-menor)/mayor*100).toFixed(1):0;
    const c = +asim>=20?'var(--red)':+asim>=15?'var(--amber)':'var(--neon)';
    return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border)"><span style="font-size:12px">${m.label}</span><span style="font-family:var(--mono);color:${c}">${asim}%</span></div>`;
  }).filter(Boolean);
  const el = document.getElementById('hombro-asimetria-result');
  if(el) el.innerHTML = results.length ? results.join('')+'<div style="font-size:9px;color:var(--text3);margin-top:4px">MDC: 15–20% · CPG 2025</div>' : 'Completá valores para calcular asimetría';
}

function buildASES() {
  const c = document.getElementById('ases-actividades-list'); if(!c) return; c.innerHTML = '';
  c.innerHTML = ASES_ITEMS.map((act,i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12px;flex:1">${act}</span>
      <div style="display:flex;gap:4px;margin-left:8px">
        ${[0,1,2,3].map(v=>`<button class="ot-btn" style="min-width:28px;font-size:10px" onclick="selectASES(this,${i},${v})">${v}</button>`).join('')}
      </div>
    </div>
  `).join('');
}
function selectASES(btn, idx, val) {
  btn.parentElement.querySelectorAll('.ot-btn').forEach(b=>{ b.className='ot-btn'; b.style.minWidth='28px'; b.style.fontSize='10px'; });
  btn.classList.add('pos'); asesVals[idx]=val; calcASES2();
}
function calcASES2() {
  const dolor = +document.querySelector('#htab-cuest .eva-slider')?.value||0;
  const pain = (10-dolor)/10*50;
  const filled = asesVals.filter(v=>v!==null);
  const func = filled.length===10?(filled.reduce((a,b)=>a+b,0)/30*50):null;
  const total = func!==null?Math.round(pain+func):null;
  const el = document.getElementById('ases-total'); if(el) el.textContent = total!==null?total:'—';
}

function buildWORC() {
  const c = document.getElementById('worc-fields-sheet'); if(!c) return; c.innerHTML = '';
  worcVals = new Array(21).fill(0);
  let idx = 0;
  c.innerHTML = WORC_SECTIONS.map(sec => `
    <div style="margin-bottom:10px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);margin-bottom:6px">${sec.d}</div>
      ${sec.items.map(item => {
        const i = idx++;
        return `<div style="padding:6px 0;border-bottom:1px solid var(--border)">
          <div style="font-size:11px;margin-bottom:4px">${item}</div>
          <input type="range" class="eva-slider" min="0" max="100" value="0"
            oninput="worcVals[${i}]=+this.value;document.getElementById('wv-${i}').textContent=this.value;calcWORC2()">
          <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3)">
            <span>Sin síntomas</span><span id="wv-${i}" style="font-family:var(--mono)">0</span><span>Máximos</span>
          </div>
        </div>`;
      }).join('')}
    </div>
  `).join('');
}
function calcWORC2() {
  const sum = worcVals.reduce((a,b)=>a+b,0);
  const pct = ((2100-sum)/2100*100).toFixed(1);
  const el = document.getElementById('worc-total-sheet'); if(el) el.textContent = sum;
  const ep = document.getElementById('worc-pct-sheet'); if(ep) ep.textContent = pct+'% función';
}

function buildDASH() {
  const c = document.getElementById('dash-fields-sheet'); if(!c) return; c.innerHTML = '';
  c.innerHTML = DASH_ITEMS.map((item,i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:11px;flex:1">${item}</span>
      <div style="display:flex;gap:3px;margin-left:6px">
        ${[1,2,3,4,5].map(v=>`<button class="ot-btn" style="min-width:22px;font-size:10px;padding:3px"
          onclick="selectDASH(this,${i},${v})">${v}</button>`).join('')}
      </div>
    </div>
  `).join('');
}
function selectDASH(btn, idx, val) {
  btn.parentElement.querySelectorAll('.ot-btn').forEach(b=>{b.className='ot-btn';b.style.minWidth='22px';b.style.fontSize='10px';b.style.padding='3px';});
  btn.classList.add('pos'); dashVals[idx]=val;
  const filled = dashVals.filter(v=>v!==null);
  if(filled.length===21){
    const score = ((filled.reduce((a,b)=>a+b,0)/filled.length-1)/4*100).toFixed(1);
    const el = document.getElementById('dash-total-sheet'); if(el) el.textContent=score;
  }
}

function calcSPADI() {
  const sliders = document.querySelectorAll('#spadi-body .eva-slider');
  if (sliders.length < 2) return;
  const d = +sliders[0].value, dis = +sliders[1].value;
  const total = ((d + dis) / 2).toFixed(1);
  const el = document.getElementById('spadi-total');
  if (el) el.textContent = total;

  // Interpretation thresholds — Porollan et al. JSES International 2025 (SPADI-Ar)
  // MDC=6.05 · MCID=18.46 · SCB=27.69 · PASS=21.35
  const interp = document.getElementById('spadi-interp');
  if (!interp) return;
  const t = parseFloat(total);
  let label, color, detail;
  if (t <= 21.35) {
    label = '✓ PASS — Estado aceptable para el paciente'; color = 'var(--neon)';
    detail = 'Puntuación ≤21.35 = Estado sintomático aceptable (PASS). El paciente considera su estado como aceptable si persistiera.';
  } else if (t <= 40) {
    label = 'Moderado — Por encima del PASS'; color = 'var(--amber)';
    detail = 'Supera el umbral PASS (21.35). Seguimiento recomendado.';
  } else if (t <= 60) {
    label = 'Alto — Dolor/discapacidad significativa'; color = 'var(--amber)';
    detail = 'Puntuación elevada. Una mejoría ≥18.46 pts (MCID) indicará cambio clínicamente importante.';
  } else {
    label = '⚠ Muy alto — Compromiso severo'; color = 'var(--red)';
    detail = 'Puntuación ≥60. Se espera mejoría sustancial ≥27.69 pts (SCB) para considerar beneficio clínico significativo.';
  }
  interp.innerHTML = `
    <div style="font-weight:700;font-size:11px;color:${color};margin-bottom:4px">${label}</div>
    <div style="font-size:10px;color:var(--text3);line-height:1.5">${detail}</div>
    <div style="font-size:9px;color:var(--text3);margin-top:6px;border-top:1px solid rgba(255,255,255,.05);padding-top:4px">
      Umbrales SPADI-Ar (Porollan et al. 2025 · n=101 · Hospital Durand, Buenos Aires):
      MDC <b>6.05</b> · MCID <b>18.46</b> · SCB <b>27.69</b> · PASS <b>21.35</b> · ICC 0.89 · SEM 2.18
    </div>`;
}

function checkHombroRedFlags() {
  const cbs = document.querySelectorAll('.hombro-redflag');
  const any = [...cbs].some(c=>c.checked);
  const el = document.getElementById('hombro-redflag-alert'); if(el) el.style.display=any?'block':'none';
}

// STAR-Hombro Nivel 3 — Irritabilidad tisular (McClure & Michener 2015)
function updateHombroSTAR(val) {
  // Highlight selected card
  ['alta','moderada','baja'].forEach(v => {
    const card = document.getElementById('star-card-'+v);
    if (!card) return;
    if (v === val) {
      const colors = {alta:'rgba(255,68,68,.35)',moderada:'rgba(255,176,32,.35)',baja:'rgba(0,200,100,.35)'};
      card.style.border = '2px solid '+colors[v];
      card.style.background = colors[v].replace('.35','.08');
    } else {
      const dimColors = {alta:'rgba(255,68,68,.15)',moderada:'rgba(255,176,32,.15)',baja:'rgba(0,200,100,.15)'};
      card.style.border = '2px solid '+dimColors[v];
      card.style.background = '';
    }
  });
  // Check the radio
  const radio = document.querySelector(`[name="hombro-star-irritabilidad"][value="${val}"]`);
  if (radio) radio.checked = true;

  const panel = document.getElementById('star-intervenciones');
  if (!panel) return;

  const contenidos = {
    alta: {
      color: 'var(--red)', bg: 'rgba(255,68,68,.07)', border: 'rgba(255,68,68,.2)',
      titulo: '🔴 Irritabilidad ALTA — Minimizar estrés físico',
      foco: 'Modulación del dolor · Modificación de actividad · Monitoreo de deterioro',
      intervenciones: [
        ['Dolor / tejido local', 'Modificación de actividad + terapia manual + modalidades analgésicas'],
        ['Sensibilización central', 'Exposición progresiva controlada + manejo médico si corresponde'],
        ['Movilidad pasiva limitada', 'ROM libre de dolor · Stretching suave en rango NO terminal'],
        ['Hiperlaxitud pasiva', 'Proteger de rango terminal · Actividad cardiovascular region no afectada'],
        ['Debilidad neuromuscular', 'AROM en rangos libres de dolor · Biofeedback / NMES si inhibición'],
        ['Intolerancia funcional', 'Proteger de rangos terminales · Movilizar regiones no afectadas'],
        ['Educación', 'Educación en neurociencia del dolor · Estrategias de autogestión'],
      ]
    },
    moderada: {
      color: 'var(--amber)', bg: 'rgba(255,176,32,.07)', border: 'rgba(255,176,32,.2)',
      titulo: '🟡 Irritabilidad MODERADA — Estrés físico leve-moderado',
      foco: 'Abordar deterioros · Restaurar actividad funcional básica',
      intervenciones: [
        ['Dolor / tejido local', 'Modificación de actividad + terapia manual + modalidades limitadas'],
        ['Sensibilización central', 'Exposición progresiva + abordaje médico interdisciplinario'],
        ['Movilidad pasiva limitada', 'Stretching intermitente en rango terminal cómodo'],
        ['Hiperlaxitud pasiva', 'Control activo en rango medio · Abordar hipmovilidades adyacentes'],
        ['Debilidad neuromuscular', 'Resistencia leve-moderada hasta fatiga · Rangos medios'],
        ['Control motor deficiente', 'Entrenamiento básico de movimiento con énfasis en calidad'],
        ['Intolerancia funcional', 'Progresión gradual en actividades funcionales básicas'],
        ['Educación', 'Expectativas de recuperación · Adherencia al programa'],
      ]
    },
    baja: {
      color: 'var(--neon)', bg: 'rgba(0,200,100,.07)', border: 'rgba(0,200,100,.2)',
      titulo: '🟢 Irritabilidad BAJA — Estrés físico moderado-alto',
      foco: 'Abordar deterioros · Restaurar actividad funcional de alta demanda',
      intervenciones: [
        ['Dolor / tejido local', 'Sin modalidades analgésicas · Carga progresiva bien tolerada'],
        ['Sensibilización central', 'Exposición progresiva a actividad de alta demanda'],
        ['Movilidad pasiva limitada', 'Stretching tolerable en rango terminal · Mayor duración y frecuencia'],
        ['Hiperlaxitud pasiva', 'Control activo en rango completo · Actividad funcional de alta demanda'],
        ['Debilidad neuromuscular', 'Resistencia moderada-alta hasta fatiga · Incluir rangos terminales'],
        ['Control motor deficiente', 'Entrenamiento de alta demanda con énfasis en calidad de movimiento'],
        ['Intolerancia funcional', 'Progresión a actividades funcionales de alta demanda / deporte'],
        ['Educación', 'Criterios de RTP · Prevención de recaídas · Carga de entrenamiento'],
      ]
    }
  };

  const c = contenidos[val];
  if (!c) { panel.style.display='none'; return; }

  panel.style.display = 'block';
  panel.style.background = c.bg;
  panel.style.border = '1px solid '+c.border;
  panel.innerHTML = `
    <div style="font-weight:700;font-size:12px;color:${c.color};margin-bottom:4px">${c.titulo}</div>
    <div style="font-size:10px;color:var(--text3);margin-bottom:10px">Foco: ${c.foco}</div>
    <div style="display:flex;flex-direction:column;gap:4px">
      ${c.intervenciones.map(([imp,int]) => `
        <div style="display:grid;grid-template-columns:160px 1fr;gap:6px;padding:4px 0;border-top:1px solid rgba(255,255,255,.05)">
          <span style="font-size:10px;color:var(--text3);font-weight:600">${imp}</span>
          <span style="font-size:10px;color:var(--text2)">${int}</span>
        </div>`).join('')}
    </div>`;
}

// ── RTP: RETORNO AL JUEGO ─────────────────────────────────────────────────────
// Kurz et al. BMJ Open 2023 (Delphi) · Otley et al. 2024 · Olds 2019 (SARTS) · Reddy JSES 2023

function buildHombroRTP() {
  const c = document.getElementById('hombro-rtp-fields');
  if (!c || c.innerHTML) return;

  const semaBox = (id, label, criterion) =>
    `<div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
      <div style="font-size:9px;color:var(--text3);margin-bottom:2px">${label}</div>
      <div id="${id}-val" style="font-family:var(--mono);font-size:20px;font-weight:800;color:var(--text3)">—</div>
      <div style="font-size:9px;color:var(--text3)">${criterion}</div>
    </div>`;

  const lsiRow = (id, label, extra) =>
    `<div style="margin-bottom:10px">
      <div style="font-size:11px;font-weight:600;margin-bottom:6px">${label}</div>
      <div class="grid-2" style="gap:8px;margin-bottom:4px">
        <div class="ig"><label class="il">Afectado (N)</label>
          <input class="inp inp-mono" type="number" step="0.1" id="rtp-${id}-aff" placeholder="0.0" oninput="calcRTPFuerza()"></div>
        <div class="ig"><label class="il">Contralateral (N)</label>
          <input class="inp inp-mono" type="number" step="0.1" id="rtp-${id}-ctrl" placeholder="0.0" oninput="calcRTPFuerza()"></div>
      </div>
      <div id="rtp-${id}-lsi" style="font-size:11px;color:var(--text3);text-align:right">LSI: —${extra||''}</div>
    </div>`;

  c.innerHTML = `
  <!-- Evidence bar -->
  <div style="font-size:10px;color:var(--text3);margin-bottom:12px;padding:8px;background:var(--bg4);border-radius:8px;line-height:1.6">
    <strong style="color:var(--amber)">Retorno al Juego — Hombro</strong> · Kurz BMJ Open 2023 · Otley et al. 2024 · Olds Phys Ther Sport 2019 · Reddy JSES 2023
  </div>

  <!-- SEMÁFORO -->
  <div class="card mb-10">
    <div class="card-header"><h3>Semáforo de clearance</h3><span class="tag tag-b">Criteria-based</span></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        ${semaBox('sema-wosi','WOSI mod.','≥95 = competencia')}
        ${semaBox('sema-dolor','NRS Dolor','≤3/10 = OK')}
        ${semaBox('sema-fuerza','LSI ER','≥90% = pass')}
        ${semaBox('sema-ckc','CKCUEST','≥21 = normal')}
      </div>
      <div id="rtp-clearance-verdict" style="padding:10px;border-radius:8px;background:var(--bg4);font-size:12px;color:var(--text3);text-align:center">
        Completar evaluación para semáforo
      </div>
    </div>
  </div>

  <!-- PROs -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-pros-body')">
      <h3>PROs — Readiness psicológica y funcional</h3>
      <span class="tag" style="background:rgba(167,139,250,.15);color:#A78BFA">WOSI · SIRSI · KJOC · PRIA-RS</span>
    </div>
    <div id="rtp-pros-body">
      <div class="card-body">
        <!-- WOSI -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">WOSI modificado</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">100 − (original/21). Criterio: ≥90 práctica · ≥95 competencia. MCID = 151.9</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">WOSI original (0–2100)</label>
              <input class="inp inp-mono" type="number" min="0" max="2100" id="wosi-original" placeholder="0–2100" oninput="calcRTPWOSI()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">WOSI mod.</div>
              <div id="wosi-mod-val" style="font-family:var(--mono);font-size:22px;font-weight:800;color:var(--text3)">—</div>
              <div id="wosi-mod-tag" style="font-size:9px;color:var(--text3)">≥95 = competencia</div>
            </div>
          </div>
        </div>
        <!-- SIRSI -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">SIRSI — Shoulder Instability Readiness to RTS</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">12 preguntas, escala 0–10. Score = (suma / 120) × 100%. Mayor % = mejor disposición psicológica.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Suma total (0–120)</label>
              <input class="inp inp-mono" type="number" min="0" max="120" id="sirsi-suma" placeholder="0–120" oninput="calcRTPSIRSI()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">SIRSI %</div>
              <div id="sirsi-pct" style="font-family:var(--mono);font-size:22px;font-weight:800;color:var(--text3)">—</div>
              <div style="font-size:9px;color:var(--text3)">mayor % = mejor</div>
            </div>
          </div>
        </div>
        <!-- KJOC -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">KJOC — Kerlan-Jobe Orthopedic Clinic Score</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">10 VAS, 0–100%. &lt;88–90% = riesgo en overhead. Baseball: &lt;90 = riesgo.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">KJOC % (0–100)</label>
              <input class="inp inp-mono" type="number" min="0" max="100" step="0.1" id="kjoc-score" placeholder="0–100" oninput="calcRTPKJOC()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">Estado</div>
              <div id="kjoc-tag" style="font-family:var(--mono);font-size:14px;font-weight:800;color:var(--text3);padding-top:8px">—</div>
            </div>
          </div>
        </div>
        <!-- PRIA-RS -->
        <div>
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">PRIA-RS (Kurz 2023)</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">10–50 puntos. Criterio Delphi: ≥40 para clearance.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Score PRIA-RS (10–50)</label>
              <input class="inp inp-mono" type="number" min="10" max="50" id="pria-rs" placeholder="10–50" oninput="calcRTPPRIA()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">Estado</div>
              <div id="pria-tag" style="font-family:var(--mono);font-size:14px;font-weight:800;color:var(--text3);padding-top:8px">—</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- NRS DOLOR -->
  <div class="card mb-10">
    <div class="card-header"><h3>Dolor — NRS</h3><span class="tag tag-b">Criterio ≤3/10</span></div>
    <div class="card-body">
      <div class="ig"><label class="il">NRS actual (0–10)</label>
        <input type="range" class="eva-slider" min="0" max="10" value="0" id="rtp-nrs"
          oninput="document.getElementById('rtp-nrs-val').textContent=this.value;calcRTPSemaforo()">
        <div id="rtp-nrs-val" style="font-family:var(--mono);font-size:22px;text-align:center;color:var(--neon)">0</div>
      </div>
      <div style="font-size:10px;color:var(--text3);margin-top:4px">Criterio Kurz 2023 / Otley 2024: ≤3/10 para clearance deportivo</div>
    </div>
  </div>

  <!-- FUERZA ISOMÉTRICA -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-fuerza-body')">
      <h3>Fuerza isométrica ER / IR</h3>
      <span class="tag tag-b">LSI ≥90% · HHD · Otley 2024 · Reddy JSES 2023</span>
    </div>
    <div id="rtp-fuerza-body">
      <div class="card-body">
        <div style="font-size:10px;color:var(--text3);margin-bottom:10px">HHD (handgrip/push-pull). Medir a 0° y 90° ABD. Lanzadores: LSI &gt;100% en lado dominante afectado (adaptación esperada).</div>
        ${lsiRow('er0','ER a 0° ABD (N)')}
        ${lsiRow('ir0','IR a 0° ABD (N)')}
        ${lsiRow('er90','ER a 90° ABD (N)')}
        ${lsiRow('ir90','IR a 90° ABD (N)')}
        <div style="margin-top:4px;padding:8px;background:var(--bg4);border-radius:8px">
          <div style="font-size:10px;font-weight:700;margin-bottom:6px;color:var(--text2)">Ratios ER:IR (rango saludable: 0.65–0.99)</div>
          <div class="grid-2" style="gap:8px">
            <div><div class="il mb-2">Ratio 0° ABD</div><div id="rtp-ratio0" style="font-family:var(--mono);font-size:16px;color:var(--text3)">—</div></div>
            <div><div class="il mb-2">Ratio 90° ABD</div><div id="rtp-ratio90" style="font-family:var(--mono);font-size:16px;color:var(--text3)">—</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CADENA CERRADA -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-ckc-body')">
      <h3>Tests cadena cerrada</h3>
      <span class="tag tag-b">CKCUEST · UQ-YBT · OAHT</span>
    </div>
    <div id="rtp-ckc-body">
      <div class="card-body">
        <!-- CKCUEST -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">CKCUEST — Closed Kinetic Chain Upper Extremity Stability Test</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">Plancha, manos a 91 cm, toques alternos 15 s. 3 intentos → promedio. Mujeres: sobre rodillas. ≥21 = normal · ≥22 = pass Reddy 2023.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Reps/15 s (promedio)</label>
              <input class="inp inp-mono" type="number" step="0.1" id="ckcuest-reps" placeholder="0" oninput="calcRTPCKC()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">Estado</div>
              <div id="ckcuest-tag" style="font-family:var(--mono);font-size:16px;font-weight:800;color:var(--text3);padding-top:6px">—</div>
            </div>
          </div>
        </div>
        <!-- UQ-YBT -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">UQ-YBT — Upper Quarter Y-Balance Test</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">Plancha 1 brazo, alcance en 3 direcciones normalizado a longitud de extremidad. LSI ≥90%.</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:4px">
            ${['med','sl','il'].map((dir,i)=>`
            <div>
              <div class="il mb-2" style="font-size:10px">${['Medial','S.Lateral','I.Lateral'][i]}</div>
              <div class="grid-2" style="gap:4px">
                <input class="inp inp-mono" type="number" step="0.1" id="ybt-${dir}-aff" placeholder="Aff" style="font-size:11px" oninput="calcRTPYBT()">
                <input class="inp inp-mono" type="number" step="0.1" id="ybt-${dir}-ctrl" placeholder="Ctrl" style="font-size:11px" oninput="calcRTPYBT()">
              </div>
              <div id="ybt-${dir}-lsi" style="font-size:10px;color:var(--text3);text-align:right">LSI: —</div>
            </div>`).join('')}
          </div>
        </div>
        <!-- OAHT -->
        <div>
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">OAHT — One-Arm Hop Test</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">Plancha 1 brazo, 5 saltos sobre step de 10.2 cm. Comparación bilateral (tiempo). Asimetría esperada DOM&gt;NONDOM: 4.4 s.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Tiempo afectado (s)</label>
              <input class="inp inp-mono" type="number" step="0.01" id="oaht-aff" placeholder="0.00" oninput="calcRTPOAHT()"></div>
            <div class="ig"><label class="il">Tiempo contralateral (s)</label>
              <input class="inp inp-mono" type="number" step="0.01" id="oaht-ctrl" placeholder="0.00" oninput="calcRTPOAHT()"></div>
          </div>
          <div id="oaht-result" style="font-size:11px;color:var(--text3);margin-top:4px;text-align:right">Diferencia: —</div>
        </div>
      </div>
    </div>
  </div>

  <!-- CADENA ABIERTA / POTENCIA -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-oca-body')">
      <h3>Tests cadena abierta y potencia</h3>
      <span class="tag tag-b">SSASP · BABER · Drop Catches</span>
    </div>
    <div id="rtp-oca-body">
      <div class="card-body">
        <!-- SSASP -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">SSASP — Seated Single Arm Shot Put</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">Long-sitting, espalda pared, pelota 2 kg. Máx. distancia horizontal (cm). Asimetría esperada: 3–13% (DOM &gt; NONDOM).</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Afectado (cm)</label>
              <input class="inp inp-mono" type="number" step="0.1" id="ssasp-aff" placeholder="0.0" oninput="calcRTPSSASP()"></div>
            <div class="ig"><label class="il">Contralateral (cm)</label>
              <input class="inp inp-mono" type="number" step="0.1" id="ssasp-ctrl" placeholder="0.0" oninput="calcRTPSSASP()"></div>
          </div>
          <div id="ssasp-result" style="font-size:11px;color:var(--text3);margin-top:4px;text-align:right">LSI: —</div>
        </div>
        <!-- BABER -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">BABER — Ball Bouncing And Reaching (Olds 2019)</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">1 min, pelota 3 kg. Normativa DOM: 16 ± 5 reps. LSI ≥91% = pass.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Afectado (reps)</label>
              <input class="inp inp-mono" type="number" id="baber-aff" placeholder="0" oninput="calcRTPBABER()"></div>
            <div class="ig"><label class="il">Contralateral (reps)</label>
              <input class="inp inp-mono" type="number" id="baber-ctrl" placeholder="0" oninput="calcRTPBABER()"></div>
          </div>
          <div id="baber-result" style="font-size:11px;color:var(--text3);margin-top:4px;text-align:right">LSI: —</div>
        </div>
        <!-- Drop Catches -->
        <div>
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">Drop Catches (Olds 2019)</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">1 min, pelota de tenis lanzada. Normativa DOM: 52 ± 12 capturas. LSI ≥93% = pass.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Afectado (capturas)</label>
              <input class="inp inp-mono" type="number" id="dropc-aff" placeholder="0" oninput="calcRTPDropC()"></div>
            <div class="ig"><label class="il">Contralateral (capturas)</label>
              <input class="inp inp-mono" type="number" id="dropc-ctrl" placeholder="0" oninput="calcRTPDropC()"></div>
          </div>
          <div id="dropc-result" style="font-size:11px;color:var(--text3);margin-top:4px;text-align:right">LSI: —</div>
        </div>
      </div>
    </div>
  </div>

  <!-- BATERÍA SARTS -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-sarts-body')">
      <h3>Batería SARTS — 8 tests (Olds 2019)</h3>
      <span class="tag tag-b">ICC 0.78–0.96 · 1 min / test</span>
    </div>
    <div id="rtp-sarts-body" style="display:none">
      <div class="card-body">
        <div style="font-size:10px;color:var(--text3);margin-bottom:10px">Shoulder Athletic Return to Sport battery. 6/8 confiables desde sesión 2. Drop Catches y Ball Taps requieren ≥3 sesiones para confiabilidad.</div>
        ${[
          {id:'baber2',   label:'BABER (cadena abierta)',           norm:'DOM 16±5',   unit:'reps/min',   note:''},
          {id:'dropcatch',label:'Drop Catches (cadena abierta)',    norm:'DOM 52±12',  unit:'reps/min',   note:'≥3 sesiones'},
          {id:'balltaps', label:'Ball Taps (cadena abierta)',       norm:'—',          unit:'golpes/min', note:'≥3 sesiones'},
          {id:'ohsnatch', label:'Overhead Snatch 5kg (abierta)',    norm:'DOM 24±5',   unit:'reps/min',   note:''},
          {id:'pushupcl', label:'Push-Up Claps (cadena cerrada)',   norm:'DOM 15±9',   unit:'reps/min',   note:'MDC90=4'},
          {id:'linehops', label:'Line Hops (cadena cerrada)',       norm:'—',          unit:'saltos/min', note:'MDC90=9'},
          {id:'mckcuest', label:'MCKCUEST (cadena cerrada)',        norm:'23±17',      unit:'reps/min',   note:'MDC90=0'},
          {id:'sidehold', label:'Side Hold Rotations (cerrada)',    norm:'DOM 18±5',   unit:'reps/min',   note:'MDC90=5'},
        ].map(t=>`
        <div style="padding:6px 0;border-bottom:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5px">
            <span style="font-size:11px;font-weight:600">${t.label}${t.note?` <span style="font-size:9px;color:var(--amber)">⚠️ ${t.note}</span>`:''}</span>
            <span style="font-size:9px;color:var(--text3)">${t.unit}</span>
          </div>
          <div class="grid-2" style="gap:6px">
            <div class="ig"><label class="il">D</label>
              <input class="inp inp-mono" type="number" step="0.1" placeholder="—" id="sarts-${t.id}-d" oninput="calcSARTS('${t.id}')"></div>
            <div class="ig"><label class="il">I</label>
              <input class="inp inp-mono" type="number" step="0.1" placeholder="—" id="sarts-${t.id}-i" oninput="calcSARTS('${t.id}')"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:3px">
            <span style="font-size:9px;color:var(--text3)">Norm: ${t.norm}</span>
            <div id="sarts-${t.id}-lsi" style="font-size:10px;color:var(--text3)">LSI: —</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- DECISIÓN FINAL -->
  <div class="card" style="border-color:rgba(0,255,136,.2)">
    <div class="card-header"><h3>Decisión de clearance</h3></div>
    <div class="card-body">
      <div class="ig"><label class="il">Semanas post-cirugía / lesión</label>
        <input class="inp inp-mono" type="number" id="rtp-semanas" placeholder="0" min="0"></div>
      <div style="font-size:10px;color:var(--text3);margin:8px 0;padding:8px;background:var(--bg4);border-radius:6px;line-height:1.7">
        <strong style="color:var(--amber)">Criterios Otley et al. 2024 / Kurz 2023:</strong><br>
        ✓ ROM completa sin dolor · ✓ WOSI mod ≥90 práctica / ≥95 competencia<br>
        ✓ LSI fuerza ER/IR ≥90% · ✓ CKCUEST ≥21 · ✓ UQ-YBT LSI ≥90%<br>
        ✓ Dolor ≤3/10 · ✓ SIRSI elevado · ✓ PRIA-RS ≥40 · ✓ ≥6 meses post-qx
      </div>
      <div class="ig"><label class="il">Notas del kinesiólgo</label>
        <textarea class="inp" rows="3" placeholder="Criterios cumplidos, pendientes, plan de exposición progresiva..."></textarea></div>
    </div>
  </div>`;
}

// ── RTP CALCULATORS ──────────────────────────────────────────────────────────
function calcRTPWOSI() {
  const v = document.getElementById('wosi-original')?.value;
  if (v === '' || v === null || v === undefined) return;
  const mod = +(100 - +v/21).toFixed(1);
  const el = document.getElementById('wosi-mod-val');
  const tag = document.getElementById('wosi-mod-tag');
  const c = mod >= 95 ? 'var(--neon)' : mod >= 90 ? 'var(--amber)' : 'var(--red)';
  if (el) { el.textContent = mod; el.style.color = c; }
  if (tag) { tag.textContent = mod >= 95 ? 'Competencia ✓' : mod >= 90 ? 'Solo práctica' : 'NO clearance'; tag.style.color = c; }
  const sv = document.getElementById('sema-wosi-val');
  if (sv) { sv.textContent = mod; sv.style.color = c; }
  calcRTPSemaforo();
}
function calcRTPSIRSI() {
  const v = document.getElementById('sirsi-suma')?.value;
  if (v === '' || v === undefined) return;
  const pct = +(+v / 120 * 100).toFixed(1);
  const el = document.getElementById('sirsi-pct');
  const c = pct >= 75 ? 'var(--neon)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';
  if (el) { el.textContent = pct + '%'; el.style.color = c; }
}
function calcRTPKJOC() {
  const v = +document.getElementById('kjoc-score')?.value;
  const el = document.getElementById('kjoc-tag'); if (!el) return;
  if (!v && v !== 0) { el.textContent = '—'; el.style.color = 'var(--text3)'; return; }
  if (v >= 90) { el.textContent = 'Normal ✓'; el.style.color = 'var(--neon)'; }
  else if (v >= 80) { el.textContent = 'Riesgo leve'; el.style.color = 'var(--amber)'; }
  else { el.textContent = 'RIESGO'; el.style.color = 'var(--red)'; }
}
function calcRTPPRIA() {
  const v = +document.getElementById('pria-rs')?.value;
  const el = document.getElementById('pria-tag'); if (!el) return;
  if (!v) { el.textContent = '—'; el.style.color = 'var(--text3)'; return; }
  el.textContent = v >= 40 ? 'Clearance ✓' : 'NO clearance';
  el.style.color = v >= 40 ? 'var(--neon)' : 'var(--red)';
}
function calcRTPFuerza() {
  ['er0','ir0','er90','ir90'].forEach(id => {
    const aff = +document.getElementById('rtp-'+id+'-aff')?.value || 0;
    const ctrl = +document.getElementById('rtp-'+id+'-ctrl')?.value || 0;
    const el = document.getElementById('rtp-'+id+'-lsi');
    if (el && ctrl > 0) {
      const lsi = +(aff/ctrl*100).toFixed(1);
      el.textContent = 'LSI: ' + lsi + '%';
      el.style.color = lsi >= 90 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
    }
  });
  const er0a = +document.getElementById('rtp-er0-aff')?.value || 0;
  const ir0a = +document.getElementById('rtp-ir0-aff')?.value || 0;
  const er90a = +document.getElementById('rtp-er90-aff')?.value || 0;
  const ir90a = +document.getElementById('rtp-ir90-aff')?.value || 0;
  const r0 = document.getElementById('rtp-ratio0');
  const r90 = document.getElementById('rtp-ratio90');
  if (r0 && ir0a > 0) {
    const ratio = +(er0a/ir0a).toFixed(2);
    r0.textContent = ratio;
    r0.style.color = ratio >= 0.65 && ratio <= 0.99 ? 'var(--neon)' : 'var(--amber)';
  }
  if (r90 && ir90a > 0) {
    const ratio = +(er90a/ir90a).toFixed(2);
    r90.textContent = ratio;
    r90.style.color = ratio >= 0.65 && ratio <= 0.99 ? 'var(--neon)' : 'var(--amber)';
  }
  // update semáforo ER LSI
  const er0c = +document.getElementById('rtp-er0-ctrl')?.value || 0;
  if (er0a > 0 && er0c > 0) {
    const lsi = +(er0a/er0c*100).toFixed(1);
    const sv = document.getElementById('sema-fuerza-val');
    const c = lsi >= 90 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
    if (sv) { sv.textContent = lsi+'%'; sv.style.color = c; }
  }
  calcRTPSemaforo();
}
function calcRTPCKC() {
  const v = +document.getElementById('ckcuest-reps')?.value || 0;
  const el = document.getElementById('ckcuest-tag');
  const sv = document.getElementById('sema-ckc-val');
  const c = v >= 22 ? 'var(--neon)' : v >= 21 ? 'var(--amber)' : 'var(--red)';
  if (el && v) { el.textContent = v >= 22 ? 'Pass ✓' : v >= 21 ? 'Normal' : 'Déficit'; el.style.color = c; }
  if (sv && v) { sv.textContent = v; sv.style.color = c; }
  calcRTPSemaforo();
}
function calcRTPYBT() {
  ['med','sl','il'].forEach(dir => {
    const aff = +document.getElementById('ybt-'+dir+'-aff')?.value || 0;
    const ctrl = +document.getElementById('ybt-'+dir+'-ctrl')?.value || 0;
    const el = document.getElementById('ybt-'+dir+'-lsi');
    if (el && ctrl > 0) {
      const lsi = +(aff/ctrl*100).toFixed(1);
      el.textContent = 'LSI: ' + lsi + '%';
      el.style.color = lsi >= 90 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
    }
  });
}
function calcRTPOAHT() {
  const aff = +document.getElementById('oaht-aff')?.value || 0;
  const ctrl = +document.getElementById('oaht-ctrl')?.value || 0;
  const el = document.getElementById('oaht-result'); if (!el || !aff || !ctrl) return;
  const diff = Math.abs(aff - ctrl).toFixed(2);
  el.textContent = 'Diferencia: ' + diff + 's ' + (+diff <= 4.4 ? '✓ Normal' : '⚠️ Asimetría elevada');
  el.style.color = +diff <= 4.4 ? 'var(--neon)' : 'var(--red)';
}
function calcRTPSSASP() {
  const aff = +document.getElementById('ssasp-aff')?.value || 0;
  const ctrl = +document.getElementById('ssasp-ctrl')?.value || 0;
  const el = document.getElementById('ssasp-result'); if (!el) return;
  if (!aff || !ctrl) { el.textContent = 'LSI: —'; el.style.color = 'var(--text3)'; return; }
  const lsi = +(aff/ctrl*100).toFixed(1);
  el.textContent = 'LSI: ' + lsi + '% (esperado 87–97%)';
  el.style.color = lsi >= 87 ? 'var(--neon)' : lsi >= 75 ? 'var(--amber)' : 'var(--red)';
}
function calcRTPBABER() {
  const aff = +document.getElementById('baber-aff')?.value || 0;
  const ctrl = +document.getElementById('baber-ctrl')?.value || 0;
  const el = document.getElementById('baber-result'); if (!el) return;
  if (!aff || !ctrl) { el.textContent = 'LSI: —'; el.style.color = 'var(--text3)'; return; }
  const lsi = +(aff/ctrl*100).toFixed(1);
  el.textContent = 'LSI: ' + lsi + '% (pass ≥91%)';
  el.style.color = lsi >= 91 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
}
function calcRTPDropC() {
  const aff = +document.getElementById('dropc-aff')?.value || 0;
  const ctrl = +document.getElementById('dropc-ctrl')?.value || 0;
  const el = document.getElementById('dropc-result'); if (!el) return;
  if (!aff || !ctrl) { el.textContent = 'LSI: —'; el.style.color = 'var(--text3)'; return; }
  const lsi = +(aff/ctrl*100).toFixed(1);
  el.textContent = 'LSI: ' + lsi + '% (pass ≥93%)';
  el.style.color = lsi >= 93 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
}
function calcSARTS(id) {
  const d = +document.getElementById('sarts-'+id+'-d')?.value || 0;
  const i = +document.getElementById('sarts-'+id+'-i')?.value || 0;
  const el = document.getElementById('sarts-'+id+'-lsi');
  if (!el || !d || !i) { if(el) { el.textContent = 'LSI: —'; el.style.color = 'var(--text3)'; } return; }
  const lsi = +(d/i*100).toFixed(1);
  el.textContent = 'LSI: ' + lsi + '%';
  el.style.color = lsi >= 90 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
}
function calcRTPSemaforo() {
  const wosiV = document.getElementById('wosi-original')?.value;
  const wosi_mod = wosiV !== '' && wosiV !== undefined ? +(100 - +wosiV/21).toFixed(1) : null;
  const nrs = +document.getElementById('rtp-nrs')?.value || 0;
  const er0a = +document.getElementById('rtp-er0-aff')?.value || 0;
  const er0c = +document.getElementById('rtp-er0-ctrl')?.value || 0;
  const lsi_er = er0c > 0 ? +(er0a/er0c*100).toFixed(1) : null;
  const ckc = +document.getElementById('ckcuest-reps')?.value || 0;

  const checks = [];
  if (wosi_mod !== null) checks.push({ ok: wosi_mod >= 95, label: 'WOSI' });
  if (document.getElementById('rtp-nrs')?.value !== '' && document.getElementById('rtp-nrs')?.value !== undefined) checks.push({ ok: nrs <= 3, label: 'Dolor' });
  if (lsi_er !== null) checks.push({ ok: lsi_er >= 90, label: 'LSI ER' });
  if (ckc > 0) checks.push({ ok: ckc >= 21, label: 'CKCUEST' });

  // update dolor sema
  if (document.getElementById('rtp-nrs')?.value !== '') {
    const sv = document.getElementById('sema-dolor-val');
    const c = nrs <= 3 ? 'var(--neon)' : nrs <= 6 ? 'var(--amber)' : 'var(--red)';
    if (sv) { sv.textContent = nrs+'/10'; sv.style.color = c; }
  }

  const verdict = document.getElementById('rtp-clearance-verdict'); if (!verdict) return;
  if (checks.length === 0) return;
  const passed = checks.filter(c => c.ok).length;
  const failed = checks.filter(c => !c.ok).map(c => c.label);
  if (passed === checks.length && checks.length >= 3) {
    verdict.textContent = '✅ CRITERIOS CUMPLIDOS — Clearance deportivo posible';
    verdict.style.background = 'rgba(0,255,136,.12)'; verdict.style.color = 'var(--neon)'; verdict.style.fontWeight = '700';
  } else if (passed >= checks.length * 0.75) {
    verdict.textContent = '⚠️ ' + passed + '/' + checks.length + ' OK — Pendientes: ' + failed.join(', ');
    verdict.style.background = 'rgba(255,176,32,.12)'; verdict.style.color = 'var(--amber)'; verdict.style.fontWeight = '700';
  } else {
    verdict.textContent = '❌ ' + passed + '/' + checks.length + ' — NO clearance. Déficit en: ' + failed.join(', ');
    verdict.style.background = 'rgba(255,68,68,.12)'; verdict.style.color = 'var(--red)'; verdict.style.fontWeight = '700';
  }
}

// ── INFORME KINESIOLÓGICO HOMBRO ─────────────────────────────────────────────
// Genera un reporte profesional imprimible en nueva ventana

function buildHombroInforme() {
  const c = document.getElementById('hombro-informe-panel');
  if (!c || c.innerHTML) return;
  const profV  = document.getElementById('prof-nombre')?.value || 'Lic. Emanuel Lezcano';
  const instV  = document.getElementById('prof-inst')?.value   || 'The Move Club';
  c.innerHTML = `
  <div style="font-size:11px;color:var(--text3);margin-bottom:12px;padding:8px;background:var(--bg4);border-radius:8px">
    <strong style="color:var(--amber)">Informe Clínico</strong> · Genera un PDF profesional con los datos de la evaluación actual. Solo se incluyen secciones con datos completados.
  </div>

  <!-- Destinatario -->
  <div class="card mb-10">
    <div class="card-header"><h3>Destinatario</h3></div>
    <div class="card-body">
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px">
          <input type="radio" name="inf-dest" value="medico" id="inf-dest-med" checked
            onchange="document.getElementById('inf-med-fields').style.display='block'">
          Médico / Especialista
        </label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px">
          <input type="radio" name="inf-dest" value="paciente" id="inf-dest-pac"
            onchange="document.getElementById('inf-med-fields').style.display='none'">
          Paciente / Familia
        </label>
      </div>
      <div id="inf-med-fields">
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">Nombre del médico (Dr./Dra.)</label>
            <input class="inp" id="inf-doctor-nombre" placeholder="Ej: Juan García"></div>
          <div class="ig"><label class="il">Especialidad</label>
            <input class="inp" id="inf-doctor-esp" placeholder="Ej: Ortopedia y Traumatología"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Firmante -->
  <div class="card mb-10">
    <div class="card-header"><h3>Profesional firmante</h3></div>
    <div class="card-body">
      <div class="grid-2" style="gap:8px">
        <div class="ig"><label class="il">Nombre profesional</label>
          <input class="inp" id="inf-prof-nombre" placeholder="Lic. Emanuel Lezcano" value="${profV}"></div>
        <div class="ig"><label class="il">MP / Matrícula</label>
          <input class="inp" id="inf-prof-mp" placeholder="MP 12345"></div>
        <div class="ig"><label class="il">Institución</label>
          <input class="inp" id="inf-prof-inst" placeholder="The Move Club" value="${instV}"></div>
        <div class="ig"><label class="il">Diagnóstico kinesiológico</label>
          <input class="inp" id="inf-dx-manual" placeholder="Ej: Tendinopatía supraespinoso crónica D"></div>
      </div>
    </div>
  </div>

  <!-- Secciones -->
  <div class="card mb-10">
    <div class="card-header"><h3>Secciones a incluir</h3></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${[
          ['inf-sec-rom','ROM'],['inf-sec-tests','Tests ortopédicos'],
          ['inf-sec-fuerza','Fuerza HHD'],['inf-sec-escalas','Escalas funcionales'],
          ['inf-sec-rtp','Criterios RTP'],['inf-sec-trat','Plan de tratamiento'],
        ].map(([id,label])=>`
          <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer">
            <input type="checkbox" id="${id}" checked> ${label}
          </label>`).join('')}
      </div>
    </div>
  </div>

  <!-- Notas -->
  <div class="card mb-12">
    <div class="card-header"><h3>Notas clínicas adicionales</h3></div>
    <div class="card-body">
      <textarea class="inp" id="inf-notas" rows="3"
        placeholder="Educación al paciente, contraindicaciones, derivaciones sugeridas..."></textarea>
    </div>
  </div>

  <!-- Botón -->
  <button class="btn btn-neon btn-full" onclick="generarInformeHombro()">
    📄 Generar Informe & Abrir para imprimir
  </button>`;
}

// Helper: EVA slider color
function _iColor(val, low, high) {
  return +val <= low ? '#2d6b1a' : +val <= high ? '#b06000' : '#c03030';
}
// Helper: LSI color
function _lsiColor(pct) {
  return +pct >= 90 ? '#2d6b1a' : +pct >= 80 ? '#b06000' : '#c03030';
}
// Helper: section header
function _infSecHead(num, title) {
  return `<div style="display:flex;align-items:center;gap:8px;margin:20px 0 10px;padding-bottom:5px;border-bottom:2px solid #dde5c4">
    <span style="background:#798254;color:#fff;font-size:9px;font-weight:900;padding:2px 9px;border-radius:3px;letter-spacing:1px">${num}</span>
    <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#1e1e1b">${title}</span>
  </div>`;
}
// Helper: data row
function _infRow(k, v) {
  return `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #e5e5e0;font-size:11px">
    <span style="color:#666">${k}</span><span style="font-weight:600">${v||'—'}</span>
  </div>`;
}
// Read orthopedic test DOM state
function _readHombroTests() {
  const results = [];
  // Painful arc (hardcoded card — first card in htab-tests)
  const htabTests = document.getElementById('htab-tests');
  if (htabTests) {
    const paCard = htabTests.querySelector('.card.mb-10');
    if (paCard) {
      const cols = paCard.querySelectorAll('.grid-2 > div');
      const dCol = cols[0], iCol = cols[1];
      const dPos = dCol?.querySelector('.ot-btn.pos'), dNeg = dCol?.querySelector('.ot-btn.neg');
      const iPos = iCol?.querySelector('.ot-btn.pos'), iNeg = iCol?.querySelector('.ot-btn.neg');
      if (dPos||dNeg||iPos||iNeg) results.push({
        name:'Arco Doloroso (Painful Arc)', ebi:'LR+ 3.44 · Confirmar RC',
        dR: dPos?'POS':dNeg?'NEG':'—', iR: iPos?'POS':iNeg?'NEG':'—',
        evaD: dNeg?'0':(dCol?.querySelector('.eva-slider')?.value||'—'),
        evaI: iNeg?'0':(iCol?.querySelector('.eva-slider')?.value||'—'),
      });
    }
  }
  // Quick test cards
  const cards = document.querySelectorAll('#hombro-tests-rapidos .card');
  cards.forEach((card,idx) => {
    const test = HOMBRO_TESTS[idx]; if (!test) return;
    const cols = card.querySelectorAll('.card-body .grid-2 > div');
    const dCol = cols[0], iCol = cols[1];
    const dPos = dCol?.querySelector('.ot-btn.pos'), dNeg = dCol?.querySelector('.ot-btn.neg');
    const iPos = iCol?.querySelector('.ot-btn.pos'), iNeg = iCol?.querySelector('.ot-btn.neg');
    if (!dPos&&!dNeg&&!iPos&&!iNeg) return;
    results.push({
      name: test.name, ebi: test.sub,
      dR: dPos?'POS':dNeg?'NEG':'—', iR: iPos?'POS':iNeg?'NEG':'—',
      evaD: dNeg?'0':(dCol?.querySelector('.eva-slider')?.value||'—'),
      evaI: iNeg?'0':(iCol?.querySelector('.eva-slider')?.value||'—'),
    });
  });
  return results;
}

// ── SESSION / HISTORY MANAGEMENT ─────────────────────────────────────────────
// Stores named evaluation snapshots in cur.klinical.hombro.sessions[]

function _readTestColState(col) {
  if (!col) return null;
  const btns = col.querySelectorAll('.ot-btn');
  return {
    state: btns[0]?.classList.contains('pos') ? 'pos' : btns[1]?.classList.contains('neg') ? 'neg' : null,
    eva:   col.querySelector('.eva-slider')?.value || '0',
    rangeFrom: col.querySelectorAll('input[type=number]')?.[0]?.value || '',
    rangeTo:   col.querySelectorAll('input[type=number]')?.[1]?.value || '',
  };
}

function _applyTestColState(col, s) {
  if (!col || !s) return;
  const btns = col.querySelectorAll('.ot-btn');
  btns.forEach(b => b.classList.remove('pos','neg'));
  if (s.state === 'pos' && btns[0]) btns[0].classList.add('pos');
  if (s.state === 'neg' && btns[1]) btns[1].classList.add('neg');
  const slider = col.querySelector('.eva-slider');
  const valEl  = col.querySelector('.eva-val');
  if (slider) {
    slider.value = s.eva || 0;
    if (valEl) valEl.textContent = s.eva || 0;
    if (s.state === 'neg') {
      slider.disabled = true; slider.style.opacity = '0.25'; slider.style.pointerEvents = 'none';
    } else { slider.disabled = false; slider.style.opacity = '1'; slider.style.pointerEvents = ''; }
  }
  const numInputs = col.querySelectorAll('input[type=number]');
  if (numInputs[0]) numInputs[0].value = s.rangeFrom || '';
  if (numInputs[1]) numInputs[1].value = s.rangeTo  || '';
}

function _readHombroSessionData() {
  const g = id => document.getElementById(id)?.value || '';
  const data = { label:'', fecha: new Date().toISOString().split('T')[0], timestamp: Date.now(),
    rom:{}, tests:{}, fuerza:{}, escalas:{}, rtp:{}, obs:{} };

  // ROM
  (ROM_HOMBRO||[]).forEach(m => {
    ['act-d','act-i','pas-d','pas-i'].forEach(k => { data.rom[m.id+'-'+k] = g('rom-'+m.id+'-'+k); });
  });

  // Tests — painful arc (hardcoded card, always first in htab-tests)
  const htabTests = document.getElementById('htab-tests');
  if (htabTests) {
    const paCard = htabTests.querySelector('.card.mb-10');
    if (paCard) {
      const cols = paCard.querySelectorAll('.grid-2 > div');
      data.tests['painful-arc'] = { d: _readTestColState(cols[0]), i: _readTestColState(cols[1]) };
    }
  }
  // Quick test cards
  document.querySelectorAll('#hombro-tests-rapidos .card').forEach((card, idx) => {
    const test = (HOMBRO_TESTS||[])[idx]; if (!test) return;
    const cols = card.querySelectorAll('.card-body .grid-2 > div');
    data.tests[test.id] = { d: _readTestColState(cols[0]), i: _readTestColState(cols[1]) };
  });

  // Fuerza
  (FUERZA_HOMBRO||[]).forEach(m => {
    ['d','i'].forEach(s => { data.fuerza[m.id+'-'+s] = g('fuerza-'+m.id+'-'+s); });
  });

  // Escalas
  data.escalas.asesVals   = [...(window.asesVals||[])];
  data.escalas.worcVals   = [...(window.worcVals||[])];
  data.escalas.dashVals   = [...(window.dashVals||[])];
  data.escalas.asesEva    = +document.querySelector('#htab-cuest .eva-slider')?.value || 0;
  const spSliders = document.querySelectorAll('#spadi-body .eva-slider');
  data.escalas.spadiDolor = spSliders[0] ? +spSliders[0].value : 0;
  data.escalas.spadiDis   = spSliders[1] ? +spSliders[1].value : 0;
  // Store computed totals for historial display
  data.escalas.asesTotal  = document.getElementById('ases-total')?.textContent || '';
  data.escalas.worcTotal  = document.getElementById('worc-total-sheet')?.textContent || '';
  data.escalas.dashTotal  = document.getElementById('dash-total-sheet')?.textContent || '';
  data.escalas.spadi      = document.getElementById('spadi-total')?.textContent || '';

  // RTP — all numeric inputs
  ['wosi-original','sirsi-suma','kjoc-score','pria-rs','rtp-nrs',
   'rtp-er0-aff','rtp-er0-ctrl','rtp-ir0-aff','rtp-ir0-ctrl',
   'rtp-er90-aff','rtp-er90-ctrl','rtp-ir90-aff','rtp-ir90-ctrl',
   'ybt-med-aff','ybt-med-ctrl','ybt-sl-aff','ybt-sl-ctrl','ybt-il-aff','ybt-il-ctrl',
   'oaht-aff','oaht-ctrl','ckcuest-reps','ssasp-aff','ssasp-ctrl',
   'baber-aff','baber-ctrl','dropc-aff','dropc-ctrl','rtp-semanas',
  ].forEach(id => { data.rtp[id] = g(id); });
  ['baber2','dropcatch','balltaps','ohsnatch','pushupcl','linehops','mckcuest','sidehold'].forEach(id => {
    ['d','i'].forEach(s => { data.rtp['sarts-'+id+'-'+s] = g('sarts-'+id+'-'+s); });
  });
  const rtpNoteEl = document.querySelector('#htab-rtp textarea');
  data.rtp.notes = rtpNoteEl?.value || '';

  // Obs
  data.obs.redflags    = [...document.querySelectorAll('.hombro-redflag')].map(c => c.checked);
  data.obs.progfactors = [...document.querySelectorAll('#htab-obs .card:nth-child(2) input[type=checkbox]')].map(c => c.checked);
  const atSelects = document.querySelectorAll('#htab-obs .card:nth-child(3) select');
  data.obs.atrofiaD = atSelects[0]?.value || '';
  data.obs.atrofiaI = atSelects[1]?.value || '';
  data.obs.obsText  = document.querySelector('#htab-obs textarea')?.value || '';
  data.obs.starIrritabilidad = document.querySelector('[name="hombro-star-irritabilidad"]:checked')?.value || '';

  return data;
}

function _writeHombroSessionData(data) {
  if (!data) return;
  const setV = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };

  // ROM
  (ROM_HOMBRO||[]).forEach(m => {
    ['act-d','act-i','pas-d','pas-i'].forEach(k => setV('rom-'+m.id+'-'+k, data.rom?.[m.id+'-'+k]||''));
  });
  try { calcTROMSheet(); } catch(e){}

  // Tests — painful arc
  const htabTests = document.getElementById('htab-tests');
  if (htabTests && data.tests?.['painful-arc']) {
    const paCard = htabTests.querySelector('.card.mb-10');
    if (paCard) {
      const cols = paCard.querySelectorAll('.grid-2 > div');
      _applyTestColState(cols[0], data.tests['painful-arc'].d);
      _applyTestColState(cols[1], data.tests['painful-arc'].i);
    }
  }
  // Quick tests
  document.querySelectorAll('#hombro-tests-rapidos .card').forEach((card, idx) => {
    const test = (HOMBRO_TESTS||[])[idx]; if (!test) return;
    const td = data.tests?.[test.id]; if (!td) return;
    const cols = card.querySelectorAll('.card-body .grid-2 > div');
    _applyTestColState(cols[0], td.d); _applyTestColState(cols[1], td.i);
  });

  // Fuerza
  (FUERZA_HOMBRO||[]).forEach(m => {
    ['d','i'].forEach(s => setV('fuerza-'+m.id+'-'+s, data.fuerza?.[m.id+'-'+s]||''));
  });
  try { calcHombroAsimetria(); } catch(e){}

  // Escalas — restore arrays + re-paint buttons
  if (data.escalas?.asesVals) {
    window.asesVals = [...data.escalas.asesVals];
    document.querySelectorAll('#ases-actividades-list > div').forEach((item, i) => {
      const val = asesVals[i];
      item.querySelectorAll('.ot-btn').forEach(b => { b.className='ot-btn'; b.style.minWidth='28px'; b.style.fontSize='10px'; });
      if (val !== null && val !== undefined) {
        const b = item.querySelectorAll('.ot-btn')[val]; if (b) b.classList.add('pos');
      }
    });
  }
  if (data.escalas?.worcVals) {
    window.worcVals = [...data.escalas.worcVals];
    document.querySelectorAll('#worc-fields-sheet .eva-slider').forEach((s, i) => {
      s.value = worcVals[i]||0;
      const sp = document.getElementById('wv-'+i); if (sp) sp.textContent = worcVals[i]||0;
    });
    try { calcWORC2(); } catch(e){}
  }
  if (data.escalas?.dashVals) {
    window.dashVals = [...data.escalas.dashVals];
    document.querySelectorAll('#dash-fields-sheet > div').forEach((item, i) => {
      const val = dashVals[i]; // 1-5
      item.querySelectorAll('.ot-btn').forEach(b => { b.className='ot-btn'; b.style.minWidth='22px'; b.style.fontSize='10px'; b.style.padding='3px'; });
      if (val !== null && val !== undefined) {
        const b = item.querySelectorAll('.ot-btn')[val-1]; if (b) b.classList.add('pos');
      }
    });
    const filled = dashVals.filter(v=>v!==null);
    if (filled.length===21) {
      const score = ((filled.reduce((a,b)=>a+b,0)/filled.length-1)/4*100).toFixed(1);
      const el = document.getElementById('dash-total-sheet'); if (el) el.textContent=score;
    }
  }
  // ASES EVA
  const asesSlider = document.querySelector('#htab-cuest .eva-slider');
  if (asesSlider && data.escalas?.asesEva !== undefined) {
    asesSlider.value = data.escalas.asesEva;
    const disp = document.getElementById('ases-dolor-val'); if (disp) disp.textContent = data.escalas.asesEva;
  }
  try { calcASES2(); } catch(e){}
  // SPADI sliders
  const spSliders = document.querySelectorAll('#spadi-body .eva-slider');
  if (spSliders[0] && data.escalas?.spadiDolor !== undefined) {
    spSliders[0].value = data.escalas.spadiDolor;
    if (spSliders[0].nextElementSibling) spSliders[0].nextElementSibling.textContent = data.escalas.spadiDolor;
  }
  if (spSliders[1] && data.escalas?.spadiDis !== undefined) {
    spSliders[1].value = data.escalas.spadiDis;
    if (spSliders[1].nextElementSibling) spSliders[1].nextElementSibling.textContent = data.escalas.spadiDis;
  }
  try { calcSPADI(); } catch(e){}

  // RTP
  ['wosi-original','sirsi-suma','kjoc-score','pria-rs',
   'rtp-er0-aff','rtp-er0-ctrl','rtp-ir0-aff','rtp-ir0-ctrl',
   'rtp-er90-aff','rtp-er90-ctrl','rtp-ir90-aff','rtp-ir90-ctrl',
   'ybt-med-aff','ybt-med-ctrl','ybt-sl-aff','ybt-sl-ctrl','ybt-il-aff','ybt-il-ctrl',
   'oaht-aff','oaht-ctrl','ckcuest-reps','ssasp-aff','ssasp-ctrl',
   'baber-aff','baber-ctrl','dropc-aff','dropc-ctrl','rtp-semanas',
  ].forEach(id => setV(id, data.rtp?.[id]||''));
  // NRS slider (range input — set value + display)
  const nrsSlider = document.getElementById('rtp-nrs');
  if (nrsSlider && data.rtp?.['rtp-nrs'] !== undefined) {
    nrsSlider.value = data.rtp['rtp-nrs'];
    const nrsDisp = document.getElementById('rtp-nrs-val'); if (nrsDisp) nrsDisp.textContent = data.rtp['rtp-nrs'];
  }
  ['baber2','dropcatch','balltaps','ohsnatch','pushupcl','linehops','mckcuest','sidehold'].forEach(id => {
    ['d','i'].forEach(s => setV('sarts-'+id+'-'+s, data.rtp?.['sarts-'+id+'-'+s]||''));
  });
  const rtpNoteEl = document.querySelector('#htab-rtp textarea');
  if (rtpNoteEl) rtpNoteEl.value = data.rtp?.notes || '';
  // Recalc all RTP indicators
  try { calcRTPWOSI(); calcRTPSIRSI(); calcRTPKJOC(); calcRTPPRIA();
        calcRTPFuerza(); calcRTPCKC(); calcRTPYBT(); calcRTPOAHT();
        calcRTPSSASP(); calcRTPBABER(); calcRTPDropC(); calcRTPSemaforo(); } catch(e){}

  // Obs
  const rfCbs = document.querySelectorAll('.hombro-redflag');
  (data.obs?.redflags||[]).forEach((v,i) => { if (rfCbs[i]) rfCbs[i].checked = v; });
  try { checkHombroRedFlags(); } catch(e){}
  const pfCbs = document.querySelectorAll('#htab-obs .card:nth-child(2) input[type=checkbox]');
  (data.obs?.progfactors||[]).forEach((v,i) => { if (pfCbs[i]) pfCbs[i].checked = v; });
  const atSelects = document.querySelectorAll('#htab-obs .card:nth-child(3) select');
  if (atSelects[0] && data.obs?.atrofiaD) atSelects[0].value = data.obs.atrofiaD;
  if (atSelects[1] && data.obs?.atrofiaI) atSelects[1].value = data.obs.atrofiaI;
  const obsTextEl = document.querySelector('#htab-obs textarea');
  if (obsTextEl) obsTextEl.value = data.obs?.obsText || '';
  if (data.obs?.starIrritabilidad) try { updateHombroSTAR(data.obs.starIrritabilidad); } catch(e){}
}

function saveHombroSession() {
  if (!cur) { alert('Seleccioná un atleta primero.'); return; }
  if (!cur.klinical) cur.klinical = {};
  if (!cur.klinical.hombro) cur.klinical.hombro = {};
  if (!cur.klinical.hombro.sessions) cur.klinical.hombro.sessions = [];
  const n = cur.klinical.hombro.sessions.length + 1;
  const label = prompt('Nombre de la evaluación:', 'Test ' + n);
  if (label === null) return;
  const data = _readHombroSessionData();
  data.label = label || ('Test ' + n);
  cur.klinical.hombro.sessions.push(data);
  atletas = atletas.map(a => a.id === cur.id ? cur : a);
  saveData();
  showSaveToast();
  refreshHombroSessionBar();
}

function hombroSelectSession(idx) {
  if (idx < 0 || !cur?.klinical?.hombro?.sessions) return;
  const session = cur.klinical.hombro.sessions[idx];
  if (!session) return;
  _writeHombroSessionData(session);
  // Update select label
  const sel = document.getElementById('hombro-session-select');
  if (sel) sel.value = idx;
}

function deleteHombroSession(idx) {
  if (!cur?.klinical?.hombro?.sessions) return;
  const s = cur.klinical.hombro.sessions[idx];
  if (!confirm('¿Eliminar evaluación "' + (s?.label||idx) + '"?')) return;
  cur.klinical.hombro.sessions.splice(idx, 1);
  atletas = atletas.map(a => a.id === cur.id ? cur : a);
  saveData();
  refreshHombroSessionBar();
  const panel = document.getElementById('hombro-historial-panel');
  if (panel && panel.style.display !== 'none') showHombroHistorial();
}

function refreshHombroSessionBar() {
  const sel = document.getElementById('hombro-session-select');
  if (!sel) return;
  const sessions = cur?.klinical?.hombro?.sessions || [];
  sel.innerHTML = '<option value="-1">— Nueva evaluación —</option>'
    + sessions.map((s,i) => `<option value="${i}">${s.label} · ${s.fecha}</option>`).join('');
  // Show session count badge
  const badge = document.getElementById('hombro-session-count');
  if (badge) badge.textContent = sessions.length ? sessions.length + ' guardada' + (sessions.length>1?'s':'') : '';
}

function showHombroHistorial() {
  const panel = document.getElementById('hombro-historial-panel');
  if (!panel) return;
  if (panel.style.display !== 'none') { panel.style.display = 'none'; return; }
  const sessions = cur?.klinical?.hombro?.sessions || [];
  if (!sessions.length) { panel.innerHTML = '<div style="padding:10px;text-align:center;font-size:12px;color:var(--text3)">No hay evaluaciones guardadas aún.</div>'; panel.style.display='block'; return; }

  const metrics = [
    { label: 'ASES Total',     fn: s => s.escalas?.asesTotal||'—' },
    { label: 'WORC Total',     fn: s => s.escalas?.worcTotal||'—' },
    { label: 'DASH Score',     fn: s => s.escalas?.dashTotal||'—' },
    { label: 'SPADI',          fn: s => s.escalas?.spadi||'—' },
    { label: 'WOSI mod.',      fn: s => { const v=s.rtp?.['wosi-original']; return v?(+(100-+v/21).toFixed(1))+'':'—'; } },
    { label: 'NRS Dolor',      fn: s => s.rtp?.['rtp-nrs']?s.rtp['rtp-nrs']+'/10':'—' },
    { label: 'LSI ER 0°',      fn: s => { const a=+s.rtp?.['rtp-er0-aff'],c=+s.rtp?.['rtp-er0-ctrl']; return (a&&c)?+(a/c*100).toFixed(1)+'%':'—'; } },
    { label: 'CKCUEST',        fn: s => s.rtp?.['ckcuest-reps']?s.rtp['ckcuest-reps']+' reps':'—' },
  ];
  (ROM_HOMBRO||[]).forEach(m => {
    metrics.push({ label: m.label+' D°', fn: s => s.rom?.[m.id+'-act-d']?s.rom[m.id+'-act-d']+'°':'—' });
    metrics.push({ label: m.label+' I°', fn: s => s.rom?.[m.id+'-act-i']?s.rom[m.id+'-act-i']+'°':'—' });
  });

  panel.innerHTML = `
    <div style="background:var(--bg4);border-radius:10px;padding:12px;margin-bottom:14px;overflow-x:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
        <strong style="font-size:13px">📊 Historial de evaluaciones — ${cur?.nombre||''}</strong>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="exportHombroCSV()" style="font-size:10px">⬇ CSV</button>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('hombro-historial-panel').style.display='none'" style="font-size:10px">✕</button>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;min-width:400px">
        <thead>
          <tr>
            <th style="text-align:left;padding:5px 8px;background:var(--bg3);font-size:10px;border-radius:4px 0 0 4px">Métrica</th>
            ${sessions.map((s,i) => `
              <th style="text-align:center;padding:5px 8px;background:var(--bg3);font-size:10px;min-width:90px">
                <div>${s.label}</div>
                <div style="font-weight:400;color:var(--text3)">${s.fecha}</div>
                <div style="display:flex;gap:3px;justify-content:center;margin-top:4px">
                  <button onclick="hombroSelectSession(${i});document.getElementById('hombro-historial-panel').style.display='none'"
                    style="background:var(--neon);color:#000;border:none;border-radius:3px;padding:2px 5px;cursor:pointer;font-size:9px;font-weight:700">Cargar</button>
                  <button onclick="deleteHombroSession(${i})"
                    style="background:rgba(255,68,68,.15);color:var(--red);border:1px solid rgba(255,68,68,.3);border-radius:3px;padding:2px 5px;cursor:pointer;font-size:9px">🗑</button>
                </div>
              </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${metrics.map(r => `
            <tr style="border-bottom:1px solid var(--border)">
              <td style="padding:5px 8px;color:var(--text2);font-size:10px;white-space:nowrap">${r.label}</td>
              ${sessions.map(s => `<td style="text-align:center;padding:5px 8px;font-family:var(--mono);font-size:11px">${r.fn(s)}</td>`).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
      <div style="font-size:9px;color:var(--text3);margin-top:8px">Pulsar "Cargar" para restaurar una evaluación en el formulario</div>
    </div>`;
  panel.style.display = 'block';
}

function exportHombroCSV() {
  const sessions = cur?.klinical?.hombro?.sessions;
  if (!sessions?.length) return;
  const headers = ['Métrica', ...sessions.map(s => s.label+' ('+s.fecha+')')];
  const rows = [
    ['ASES Total',  ...sessions.map(s => s.escalas?.asesTotal||'')],
    ['WORC Total',  ...sessions.map(s => s.escalas?.worcTotal||'')],
    ['DASH Score',  ...sessions.map(s => s.escalas?.dashTotal||'')],
    ['SPADI',       ...sessions.map(s => s.escalas?.spadi||'')],
    ['NRS Dolor',   ...sessions.map(s => s.rtp?.['rtp-nrs']||'')],
    ['CKCUEST reps',...sessions.map(s => s.rtp?.['ckcuest-reps']||'')],
    ['WOSI orig',   ...sessions.map(s => s.rtp?.['wosi-original']||'')],
    ['LSI ER 0° aff',...sessions.map(s => s.rtp?.['rtp-er0-aff']||'')],
    ['LSI ER 0° ctrl',...sessions.map(s => s.rtp?.['rtp-er0-ctrl']||'')],
  ];
  (ROM_HOMBRO||[]).forEach(m => {
    rows.push([m.label+' D act.',  ...sessions.map(s => s.rom?.[m.id+'-act-d']||'')]);
    rows.push([m.label+' I act.',  ...sessions.map(s => s.rom?.[m.id+'-act-i']||'')]);
  });
  (FUERZA_HOMBRO||[]).forEach(m => {
    rows.push([m.label+' D (N)', ...sessions.map(s => s.fuerza?.[m.id+'-d']||'')]);
    rows.push([m.label+' I (N)', ...sessions.map(s => s.fuerza?.[m.id+'-i']||'')]);
  });
  const csv = [headers, ...rows].map(r => r.map(c => '"'+(c||'').toString().replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url;
  a.download=(cur?.nombre||'paciente').replace(/\s+/g,'_')+'_hombro_historial.csv';
  a.click(); URL.revokeObjectURL(url);
}

function generarInformeHombro() {
  // Ensure diagnostic card is up-to-date with current modal test state
  if (typeof renderDiagnosticosHombro === 'function') renderDiagnosticosHombro(_getHombroModalPositivos());

  // ── Data collection ──
  const g  = id => document.getElementById(id)?.value || '';
  const gt = id => document.getElementById(id)?.textContent?.trim() || '';
  const ch = id => document.getElementById(id)?.checked;

  const dest       = document.querySelector('input[name="inf-dest"]:checked')?.value || 'medico';
  const docNombre  = g('inf-doctor-nombre');
  const docEsp     = g('inf-doctor-esp');
  const profNombre = g('inf-prof-nombre') || 'Lic. Emanuel Lezcano';
  const profMP     = g('inf-prof-mp');
  const profInst   = g('inf-prof-inst') || 'The Move Club';
  const dxManual   = g('inf-dx-manual');
  const notasExtra = g('inf-notas');
  const fecha      = new Date().toLocaleDateString('es-AR', {day:'2-digit',month:'long',year:'numeric'});

  // Patient — full profile from cur object
  const nombre   = cur?.nombre   || '—';
  const edad     = cur?.edad     || '';
  const sexo     = cur?.sexo     || '';
  const peso     = cur?.peso     || '';
  const talla    = cur?.talla    || '';
  const deporte  = cur?.deporte  || '';
  const nivel    = cur?.nivel    || '';
  const objetivo = cur?.objetivo || '';
  const lesionMC = cur?.lesion   || '';

  // Red flags & prognostic factors
  const redflags = [...document.querySelectorAll('.hombro-redflag:checked')].length > 0;
  const redflagLabels = [...document.querySelectorAll('.hombro-redflag:checked')].map(c => c.closest('label')?.textContent?.trim().replace(/\s+/g,' ') || '').filter(Boolean);
  const progCbs  = [...document.querySelectorAll('#htab-obs .card:nth-child(2) input[type=checkbox]:checked')];
  const progList = progCbs.map(el => el.closest('label')?.textContent?.trim() || '').filter(Boolean);
  const obsNotes = document.querySelector('#htab-obs textarea')?.value || '';
  const starIrrit = document.querySelector('[name="hombro-star-irritabilidad"]:checked')?.value || '';
  const starLabels = {alta:'ALTA — Minimizar estrés físico', moderada:'MODERADA — Estrés físico leve-moderado', baja:'BAJA — Estrés físico moderado-alto'};
  const starFoco   = {alta:'Modulación del dolor · Modificación de actividad', moderada:'Abordar deterioros · Actividad funcional básica', baja:'Abordar deterioros · Actividad funcional de alta demanda'};

  // ROM
  const romRows = (ROM_HOMBRO||[]).map(m => ({
    label: m.label, ref: m.ref,
    actD: g(`rom-${m.id}-act-d`), actI: g(`rom-${m.id}-act-i`),
    pasD: g(`rom-${m.id}-pas-d`), pasI: g(`rom-${m.id}-pas-i`),
  })).filter(r => r.actD||r.actI||r.pasD||r.pasI);
  const tromD = gt('hombro-trom-d'), tromI = gt('hombro-trom-i');

  // Tests
  const tests = _readHombroTests();

  // Strength
  const fuerzaRows = (FUERZA_HOMBRO||[]).map(m => {
    const d = g(`fuerza-${m.id}-d`), i = g(`fuerza-${m.id}-i`);
    if (!d && !i) return null;
    const asim = (d&&i) ? ((Math.abs(+d - +i)/Math.max(+d,+i))*100).toFixed(1) : null;
    return { label:`${m.label} ${m.angulo}`, d, i, asim };
  }).filter(Boolean);

  // Scales
  const ases  = gt('ases-total');
  const worc  = gt('worc-total-sheet');
  const worcP = gt('worc-pct-sheet');
  const dash  = gt('dash-total-sheet');
  const spadi = gt('spadi-total');
  const hasEscalas = [ases,worc,dash,spadi].some(v => v && v !== '—');

  // RTP
  const wosiMod   = gt('wosi-mod-val');
  const wosiTag   = gt('wosi-mod-tag');
  const sirsiPct  = gt('sirsi-pct');
  const kjoc      = g('kjoc-score');
  const priars    = g('pria-rs');
  const rtpNrs    = g('rtp-nrs');
  const lsiER     = gt('rtp-er0-lsi');
  const ckcuest   = g('ckcuest-reps');
  const hasRTP = [wosiMod,sirsiPct,kjoc,ckcuest].some(v => v && v !== '—');

  // Diagnostic engine output
  const dxCard = document.getElementById('kine-dx-hombro-card');
  const dxHTML = dxCard?.style.display !== 'none' ? (dxCard?.innerHTML || '') : '';

  // ── Section toggles ──
  const secROM    = ch('inf-sec-rom');
  const secTests  = ch('inf-sec-tests');
  const secFuerza = ch('inf-sec-fuerza');
  const secEsc    = ch('inf-sec-escalas');
  const secRTP    = ch('inf-sec-rtp');
  const secTrat   = ch('inf-sec-trat');

  // ── Build HTML ──
  const css = `
    body{font-family:Inter,Arial,sans-serif;margin:0;background:#fff;color:#1a1a1a;font-size:12px;line-height:1.5}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#798254;color:#fff;padding:6px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    td{padding:5px 8px;border-bottom:1px solid #dde5c4}
    tr:nth-child(even) td{background:#f6f8ee}
    .pos{color:#2d6b1a;font-weight:700}
    .neg{color:#888}
    .alerta{color:#c03030;font-weight:700}
    .limite{color:#b06000;font-weight:700}
    .ok{color:#2d6b1a;font-weight:700}
    .sec-badge{display:inline-block;background:#798254;color:#fff;font-size:9px;font-weight:900;padding:2px 9px;border-radius:3px;letter-spacing:1px;margin-right:8px}
    .sec-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#1e1e1b}
    .sec-head{display:flex;align-items:center;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid #dde5c4}
    .metric-box{background:#f6f8ee;border-radius:6px;padding:10px;text-align:center;border:1px solid #dde5c4}
    .metric-val{font-size:22px;font-weight:900;line-height:1}
    .metric-lbl{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
    .metric-sub{font-size:8px;color:#999;margin-top:3px}
    .chart-block{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    @media print{
      .no-print{display:none!important}
      body{font-size:11px}
      header,footer{-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .sec-badge,.pos,.neg,.metric-box,.chart-block{-webkit-print-color-adjust:exact;print-color-adjust:exact}
      svg{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    }
  `;

  // Intro paragraph
  const intro = dest === 'medico'
    ? `<div style="padding:16px 32px;background:#f8f9f3;border-left:4px solid #798254;font-size:11px;line-height:1.8;color:#2a2a2a">
        ${docNombre ? `Dr./Dra. <strong>${docNombre}</strong>${docEsp?` (${docEsp})`:''},<br><br>` : ''}
        Me dirijo a Ud. y su equipo ${docEsp||'médico'} con el agrado de presentarle el informe kinesiológico del/la paciente
        <strong>${nombre}</strong>${edad?' de '+edad+' años':''}. La evaluación fue realizada con fecha <strong>${fecha}</strong>
        siguiendo los lineamientos de la Guía de Práctica Clínica CPG 2025 (Desmeules et al., JOSPT) para patología de hombro,
        con pruebas de rendimiento diagnóstico validadas por meta-análisis (Zhao 2024).
       </div>`
    : `<div style="padding:16px 32px;background:#f8f9f3;border-left:4px solid #798254;font-size:11px;line-height:1.8;color:#2a2a2a">
        Estimado/a <strong>${nombre}</strong>:<br><br>
        A continuación presentamos los resultados de su evaluación kinesiológica del <strong>${fecha}</strong>.
        Este informe resume los hallazgos sobre su hombro, incluyendo movilidad, fuerza, pruebas clínicas y
        cuestionarios funcionales, junto con las recomendaciones de tratamiento.
       </div>`;

  // 01 — Perfil & Screening
  const sec01 = `
    ${_infSecHead('01','Perfil del atleta & Screening')}
    <div style="font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f6f8ee;border-radius:5px;border-left:3px solid #798254">
      Esta sección resume los datos de identificación del paciente y el screening inicial de señales de alerta (banderas rojas) realizado al inicio de la evaluación. Las banderas rojas son hallazgos que, si están presentes, requieren derivación médica inmediata y suspensión del tratamiento kinesiológico hasta su descarte. Se registra también el motivo de consulta, los objetivos del paciente y factores pronósticos que pueden influir en la evolución clínica.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#f6f8ee;border-radius:6px;padding:12px;border:1px solid #dde5c4">
        <div style="font-size:9px;text-transform:uppercase;color:#798254;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos del Paciente</div>
        ${_infRow('Nombre completo', nombre)}
        ${edad ? _infRow('Edad', edad+' años'+(sexo?' · '+sexo:'')) : (sexo?_infRow('Sexo', sexo):'')}
        ${(peso||talla) ? _infRow('Morfología', [peso?peso+' kg':'', talla?talla+' cm':''].filter(Boolean).join(' / ')) : ''}
        ${deporte ? _infRow('Deporte / Actividad', deporte+(nivel?' — '+nivel:'')) : ''}
        ${objetivo ? _infRow('Objetivo', objetivo) : ''}
        ${lesionMC ? _infRow('Motivo de consulta', lesionMC) : ''}
        ${_infRow('Fecha de evaluación', fecha)}
      </div>
      <div style="background:#f6f8ee;border-radius:6px;padding:12px;border:1px solid #dde5c4">
        <div style="font-size:9px;text-transform:uppercase;color:#798254;font-weight:700;letter-spacing:1px;margin-bottom:8px">Screening STAR-Hombro (Nivel 1–3)</div>
        <div style="font-size:11px;font-weight:700;margin-bottom:8px;color:${redflags?'#c03030':'#2d6b1a'}">
          ${redflags ? '⚠ BANDERAS ROJAS DETECTADAS — DERIVAR' : '✓ Nivel 1: Sin banderas rojas'}
        </div>
        ${redflagLabels.length ? redflagLabels.map(l=>`<div style="font-size:10px;color:#c03030">⚠ ${l}</div>`).join('') : ''}
        ${progList.length ? `<div style="font-size:10px;color:#b06000;font-weight:600;margin-top:6px;margin-bottom:4px">Factores pronósticos activos:</div>
          ${progList.map(f=>`<div style="font-size:10px;color:#b06000">• ${f}</div>`).join('')}`
        : `<div style="font-size:10px;color:#666;margin-top:6px">Sin factores pronósticos relevantes</div>`}
        ${starIrrit ? `
          <div style="margin-top:10px;padding:8px;background:${starIrrit==='alta'?'#fff0f0':starIrrit==='moderada'?'#fff8e8':'#f0fff6'};border-radius:5px;border-left:3px solid ${starIrrit==='alta'?'#c03030':starIrrit==='moderada'?'#c07000':'#2d6b1a'}">
            <div style="font-size:9px;text-transform:uppercase;font-weight:700;color:${starIrrit==='alta'?'#c03030':starIrrit==='moderada'?'#c07000':'#2d6b1a'};letter-spacing:.5px;margin-bottom:2px">STAR Nivel 3 — Irritabilidad tisular</div>
            <div style="font-size:11px;font-weight:700">${starLabels[starIrrit]||starIrrit.toUpperCase()}</div>
            <div style="font-size:10px;color:#555;margin-top:2px">Foco: ${starFoco[starIrrit]||''}</div>
          </div>` : ''}
        ${obsNotes ? `<div style="font-size:10px;color:#444;margin-top:8px;font-style:italic">${obsNotes}</div>` : ''}
      </div>
    </div>`;

  // 02 — ROM (con radar chart)
  const _radarItems = romRows.filter(r => parseFloat(r.ref) > 0).slice(0, 8).map(r => ({
    label: r.label.replace('Rotación','Rot.').replace(' / ','/').replace('Abducción','Abd.').replace('Aducción','Adc.').replace('Flexión','Flex.').replace('Extensión','Ext.'),
    D: parseFloat(r.actD) || 0,
    I: parseFloat(r.actI) || 0,
    max: parseFloat(r.ref) || 90,
    ref: parseFloat(r.ref) || 90,
  }));
  const _romRadar = (typeof _tmcRadarChart !== 'undefined' && _radarItems.length >= 3)
    ? _tmcRadarChart(_radarItems, {title:'ROM Spider — Activo (°)', size:300})
    : '';
  const sec02 = (secROM && romRows.length) ? `
    ${_infSecHead('02','Análisis de rango de movimiento (ROM)')}
    <div style="font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f6f8ee;border-radius:5px;border-left:3px solid #798254">
      El rango de movimiento (ROM) cuantifica en grados la amplitud de cada movimiento del hombro. Se mide de forma <strong>activa</strong> (el paciente mueve el brazo por su cuenta) y <strong>pasiva</strong> (el kinesiólogo guía el movimiento sin esfuerzo del paciente). Comparar ambas modalidades permite identificar si la restricción tiene origen muscular, capsular o estructural. Se evalúan ambos miembros para detectar asimetrías. El <strong>TROM</strong> (Total Rotational Motion = Rotación Interna + Rotación Externa) es un indicador específico en deportistas de cabeza de húmero, donde déficits ≥18° (GIRD) se asocian a riesgo de lesión. Referencia: CPG 2025 Rec.#6 · MDC activo: 8–23°.
    </div>
    <table>
      <tr><th>Movimiento</th><th>Referencia</th><th>Activo D</th><th>Activo I</th><th>Pasivo D</th><th>Pasivo I</th></tr>
      ${romRows.map(r=>`<tr>
        <td><strong>${r.label}</strong></td><td style="color:#888">${r.ref}</td>
        <td>${r.actD?r.actD+'°':'—'}</td><td>${r.actI?r.actI+'°':'—'}</td>
        <td>${r.pasD?r.pasD+'°':'—'}</td><td>${r.pasI?r.pasI+'°':'—'}</td>
      </tr>`).join('')}
      ${(tromD&&tromD!=='—')||(tromI&&tromI!=='—') ? `<tr style="background:#f0f5e8">
        <td colspan="2"><strong>TROM (RI+RE)</strong></td>
        <td><strong>${tromD}</strong></td><td><strong>${tromI}</strong></td><td></td><td></td>
      </tr>` : ''}
    </table>${_romRadar}` : '';

  // 03 — Tests ortopédicos
  const sec03 = (secTests && tests.length) ? `
    ${_infSecHead('03','Mapeo ortopédico de provocación')}
    <div style="font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f6f8ee;border-radius:5px;border-left:3px solid #798254">
      Los tests ortopédicos de provocación son maniobras clínicas estandarizadas que el kinesiólogo aplica para reproducir de forma controlada los síntomas del paciente. Cada test está diseñado para evaluar una estructura específica del hombro (manguito rotador, labrum, bíceps, espacio subacromial). Un resultado <strong>POSITIVO</strong> indica que la maniobra reproduce el dolor o genera una respuesta anormal; un resultado <strong>NEGATIVO</strong> permite reducir la probabilidad de compromiso de esa estructura. La columna EVA registra la intensidad del dolor reproducido (0 = sin dolor · 10 = máximo dolor imaginable). El rendimiento diagnóstico de cada test (Sn/Sp/LR) proviene de meta-análisis internacionales de alto nivel de evidencia (Zhao 2024, CPG 2025).
    </div>
    <table>
      <tr><th>Test</th><th>EBM</th><th>D</th><th>EVA D</th><th>I</th><th>EVA I</th></tr>
      ${tests.map(t=>`<tr>
        <td><strong>${t.name}</strong></td>
        <td style="font-size:10px;color:#666">${t.ebi}</td>
        <td class="${t.dR==='POS'?'pos':t.dR==='NEG'?'neg':''}">${t.dR==='POS'?'✚ POSITIVO':t.dR==='NEG'?'– NEGATIVO':'—'}</td>
        <td>${t.dR==='NEG'?'0':(t.evaD||'—')}${t.evaD&&t.evaD!=='—'?'/10':''}</td>
        <td class="${t.iR==='POS'?'pos':t.iR==='NEG'?'neg':''}">${t.iR==='POS'?'✚ POSITIVO':t.iR==='NEG'?'– NEGATIVO':'—'}</td>
        <td>${t.iR==='NEG'?'0':(t.evaI||'—')}${t.evaI&&t.evaI!=='—'?'/10':''}</td>
      </tr>`).join('')}
    </table>` : '';

  // 04 — Fuerza HHD (con bar chart)
  const _barItems = fuerzaRows.map(r => ({
    label: r.label.length > 26 ? r.label.substring(0, 26) : r.label,
    D: r.d || null, I: r.i || null, unit: ' N', ref: null, asim: r.asim,
  }));
  const _fuerzaBar = (typeof _tmcBarChart !== 'undefined' && _barItems.length > 0)
    ? _tmcBarChart(_barItems, {title:'Perfil de Fuerza Muscular (N) — D vs I'})
    : '';
  const sec04 = (secFuerza && fuerzaRows.length) ? `
    ${_infSecHead('04','Perfil de fuerza dinamométrica (HHD)')}
    <div style="font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f6f8ee;border-radius:5px;border-left:3px solid #798254">
      La dinamometría con handheld dynamometer (HHD) es la herramienta gold standard para cuantificar la fuerza muscular de forma objetiva y reproducible. Los valores se expresan en <strong>Newtons (N)</strong> y se comparan entre el miembro dominante y no dominante para calcular la <strong>asimetría</strong>. Una asimetría ≥15% supera el MDC (Mínima Diferencia Detectable) y es clínicamente relevante; asimetrías ≥20% son consideradas críticas y se asocian a mayor riesgo de re-lesión y rendimiento deportivo disminuido. Se evalúan los principales grupos musculares del manguito rotador y la cintura escapular. Referencia: CPG 2025 Rec.#7.
    </div>
    <table>
      <tr><th>Movimiento</th><th>D (N)</th><th>I (N)</th><th>Asimetría</th><th>Interpretación</th></tr>
      ${fuerzaRows.map(r=>`<tr>
        <td><strong>${r.label}</strong></td>
        <td>${r.d||'—'}</td><td>${r.i||'—'}</td>
        <td class="${r.asim?+r.asim>=20?'alerta':+r.asim>=15?'limite':'ok':''}">${r.asim?r.asim+'%':'—'}</td>
        <td style="font-size:10px">${r.asim?(+r.asim>=20?'⚠ CRÍTICO >MDC':+r.asim>=15?'Límite MDC':'✓ Normal'):'—'}</td>
      </tr>`).join('')}
    </table>${_fuerzaBar}` : '';

  // Dashboard metrics
  const dashboard = (hasEscalas || hasRTP) ? `
    ${_infSecHead('05','Dashboard — Indicadores clínicos clave')}
    <div style="font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f6f8ee;border-radius:5px;border-left:3px solid #798254">
      Resumen visual de los scores clínicos más relevantes obtenidos en esta evaluación. Permite una lectura rápida del estado funcional del paciente y facilita la comparación longitudinal entre sesiones. El <strong>MCID</strong> (Mínima Diferencia Clínicamente Importante) indica el cambio mínimo en puntos que debe ocurrir para considerar que hubo una mejoría real percibida por el paciente, más allá del error de medición.
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
      ${ases&&ases!=='—'?`<div class="metric-box">
        <div class="metric-lbl">ASES Score</div>
        <div class="metric-val" style="color:${+ases>=80?'#2d6b1a':+ases>=60?'#b06000':'#c03030'}">${ases}</div>
        <div class="metric-sub">MCID: 6.4–21.9 · /100</div></div>`:''}
      ${worc&&worc!=='—'?`<div class="metric-box">
        <div class="metric-lbl">WORC</div>
        <div class="metric-val" style="color:${worcP?'#2d6b1a':'#b06000'}">${worcP||worc}</div>
        <div class="metric-sub">MCID: 245.3 · /2100</div></div>`:''}
      ${dash&&dash!=='—'?`<div class="metric-box">
        <div class="metric-lbl">DASH</div>
        <div class="metric-val" style="color:${+dash<=30?'#2d6b1a':+dash<=50?'#b06000':'#c03030'}">${dash}</div>
        <div class="metric-sub">MCID: 10.2 · /100</div></div>`:''}
      ${wosiMod&&wosiMod!=='—'?`<div class="metric-box">
        <div class="metric-lbl">WOSI mod.</div>
        <div class="metric-val" style="color:${+wosiMod>=95?'#2d6b1a':+wosiMod>=90?'#b06000':'#c03030'}">${wosiMod}</div>
        <div class="metric-sub">≥95 competencia</div></div>`:''}
    </div>` : '';

  // 06 — Escalas
  const _scaleNameCell = (name, abbr, desc) =>
    `<td><strong>${name}</strong><br><span style="font-size:9px;color:#888;font-weight:400;line-height:1.4">${abbr}</span><br><span style="font-size:9px;color:#666;line-height:1.45;display:block;margin-top:2px">${desc}</span></td>`;
  const sec06 = (secEsc && hasEscalas) ? `
    ${_infSecHead('06','Escalas funcionales (CPG 2025 Rec.#8)')}
    <div style="font-size:10px;color:#666;margin-bottom:8px;line-height:1.5">Instrumentos validados de resultado reportado por el paciente (PRO). Los scores permiten monitorear progresión y detectar cambios clínicamente significativos (MCID) a lo largo del tratamiento.</div>
    <table>
      <tr><th>Escala</th><th>Score</th><th>MCID</th><th>Interpretación</th></tr>
      ${ases&&ases!=='—'?`<tr>
        ${_scaleNameCell('ASES Score','American Shoulder and Elbow Surgeons — Hawkins et al. 1985','Mide función del hombro en 10 actividades de la vida diaria + intensidad de dolor (EVA). Rango 0–100; mayor puntaje = mejor función.')}
        <td><strong>${ases}/100</strong></td><td>6.4–21.9 pts</td>
        <td class="${+ases>=80?'ok':+ases>=60?'limite':'alerta'}">${+ases>=80?'Buena función':+ases>=60?'Función moderada':'Función severamente limitada'}</td></tr>`:''}
      ${worc&&worc!=='—'?`<tr>
        ${_scaleNameCell('WORC Index','Western Ontario Rotator Cuff Index — Kirkley et al. 1998','Calidad de vida específica para patología de manguito rotador. 21 ítems VAS agrupados en 4 dominios: síntomas físicos, deportes/recreación, trabajo, estilo de vida. Rango 0–2100; menor = mejor.')}
        <td><strong>${worc}/2100</strong>${worcP?` <span style="font-size:10px;color:#666">(${worcP})</span>`:''}</td><td>245.3 pts</td>
        <td style="font-size:10px;color:#666">0 = función completa · 2100 = máxima afectación</td></tr>`:''}
      ${dash&&dash!=='—'?`<tr>
        ${_scaleNameCell('DASH / QuickDASH','Disabilities of the Arm, Shoulder and Hand — Hudak et al. 1996','Evalúa discapacidad del miembro superior en actividades cotidianas, laborales y recreativas. Rango 0–100; menor puntaje = menor discapacidad. QuickDASH usa 11 de los 30 ítems.')}
        <td><strong>${dash}/100</strong></td><td>10.2 pts</td>
        <td class="${+dash<=30?'ok':+dash<=50?'limite':'alerta'}">${+dash<=30?'Discapacidad leve':+dash<=50?'Discapacidad moderada':'Discapacidad severa'}</td></tr>`:''}
      ${spadi&&spadi!=='—'?`<tr>
        ${_scaleNameCell('SPADI-Ar','Shoulder Pain and Disability Index — Versión Argentina (Porollan et al. JSES Int. 2025)','Evalúa dolor (5 ítems) e interferencia funcional (8 ítems) del hombro. Score total 0–100; mayor = mayor discapacidad. Validado en Argentina (ICC 0.89, SEM 2.18, n=101 · H. Durand, Buenos Aires).')}
        <td><strong>${spadi}/100</strong></td>
        <td style="font-size:10px">MDC 6.05<br>MCID 18.46<br>SCB 27.69<br>PASS ≤21.35</td>
        <td class="${+spadi<=21.35?'ok':+spadi<=40?'limite':'alerta'}" style="font-size:10px">${+spadi<=21.35?'✓ PASS — Estado aceptable':+spadi<=40?'Por encima del PASS':+spadi<=60?'Significativo — Objetivo MCID -18.46':'⚠ Severo — Objetivo SCB -27.69'}</td></tr>`:''}
    </table>` : '';

  // 07 — RTP
  const sec07 = (secRTP && hasRTP) ? `
    ${_infSecHead('07','Criterios de retorno al juego (RTP)')}
    <div style="font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f6f8ee;border-radius:5px;border-left:3px solid #798254">
      Los criterios de retorno deportivo (Return to Play / RTP) son indicadores objetivos que determinan si el paciente está en condiciones de reincorporarse de forma segura a la práctica o competencia. Se evalúan aspectos <strong>psicológicos</strong> (readiness, miedo a re-lesión vía SIRSI/KJOC) y <strong>funcionales</strong> (simetría de fuerza, dolor máximo tolerable, rendimiento en test de campo). El alta deportiva se otorga únicamente cuando todos los umbrales están cumplidos simultáneamente. Fuente: Kurz BMJ Open 2023 · Otley et al. 2024.
    </div>
    <table>
      <tr><th>Indicador</th><th>Valor</th><th>Criterio</th><th>Estado</th></tr>
      ${wosiMod&&wosiMod!=='—'?`<tr><td>WOSI modificado</td><td><strong>${wosiMod}</strong></td><td>≥95 competencia / ≥90 práctica</td>
        <td class="${+wosiMod>=95?'ok':+wosiMod>=90?'limite':'alerta'}">${wosiTag||''}</td></tr>`:''}
      ${sirsiPct?`<tr><td>SIRSI %</td><td><strong>${sirsiPct}</strong></td><td>Mayor % = mejor</td>
        <td class="${+sirsiPct.replace('%','')>=75?'ok':'limite'}">Readiness psicológica</td></tr>`:''}
      ${kjoc?`<tr><td>KJOC Score</td><td><strong>${kjoc}%</strong></td><td>≥88–90% overhead</td>
        <td class="${+kjoc>=90?'ok':+kjoc>=80?'limite':'alerta'}">${+kjoc>=90?'Normal':+kjoc>=80?'Riesgo leve':'⚠ Riesgo'}</td></tr>`:''}
      ${rtpNrs?`<tr><td>NRS Dolor</td><td><strong>${rtpNrs}/10</strong></td><td>≤3/10</td>
        <td class="${+rtpNrs<=3?'ok':+rtpNrs<=6?'limite':'alerta'}">${+rtpNrs<=3?'✓ OK':'⚠ Excede criterio'}</td></tr>`:''}
      ${lsiER&&lsiER!=='—'?`<tr><td>LSI ER (Fuerza)</td><td><strong>${lsiER}</strong></td><td>≥90%</td>
        <td class="${+lsiER.replace('LSI: ','').replace('%','')>=90?'ok':'alerta'}">Simetría miembros</td></tr>`:''}
      ${ckcuest?`<tr><td>CKCUEST</td><td><strong>${ckcuest} reps</strong></td><td>≥21 reps/15s</td>
        <td class="${+ckcuest>=21?'ok':'alerta'}">${+ckcuest>=22?'Pass ✓':+ckcuest>=21?'Normal':'Déficit'}</td></tr>`:''}
    </table>` : '';

  // 08 — Diagnóstico kinesiológico presuntivo — narrative EBM block
  const _modalPos = _getHombroModalPositivos();
  const _posTests = tests.filter(t => t.dR==='POS' || t.iR==='POS');
  const _negTests = tests.filter(t => (t.dR==='NEG'||t.iR==='NEG') && t.dR!=='POS' && t.iR!=='POS');
  const _htl      = [...(typeof HOMBRO_TESTS!=='undefined'?HOMBRO_TESTS:[]), {id:'painful-arc',name:'Arco Doloroso'}];
  const _tnOf     = id => (_htl.find(t=>t.id===id)?.name||id);
  let _dxC = '';

  if (dxManual) _dxC += '<div style="background:#f6f8ee;border-radius:6px;padding:10px;border:2px solid #798254;font-size:12px;font-weight:700;color:#1e1e1b;margin-bottom:12px">'+dxManual+'</div>';

  if (tests.length > 0) {
    // ── Narrative paragraph ──
    let _nar = 'Se realizaron <strong>'+tests.length+' prueba'+(tests.length>1?'s':'')+' ortopédica'+(tests.length>1?'s':'')+' estandarizada'+(tests.length>1?'s':'')+'</strong> de provocación durante la presente evaluación. ';
    if (_posTests.length > 0) {
      const _pDesc = _posTests.map(t=>{
        const _s=[];
        if(t.dR==='POS') _s.push('D'+(t.evaD&&t.evaD!=='—'&&t.evaD!=='0'?' (EVA '+t.evaD+'/10)':''));
        if(t.iR==='POS') _s.push('I'+(t.evaI&&t.evaI!=='—'&&t.evaI!=='0'?' (EVA '+t.evaI+'/10)':''));
        return '<em>'+t.name+'</em> ['+_s.join(', ')+']';
      }).join('; ');
      _nar += '<strong style="color:#6b7e20">'+_posTests.length+' test'+(+_posTests.length>1?'s':'')+' result'+(_posTests.length>1?'aron':'ó')+' positivo'+(+_posTests.length>1?'s':'')+':</strong> '+_pDesc+'. ';
    }
    if (_negTests.length > 0) {
      const _nNames = _negTests.slice(0,4).map(t=>'<em>'+t.name+'</em>').join(', ')+(_negTests.length>4?' y '+(_negTests.length-4)+' más':'');
      _nar += _negTests.length+' test'+(_negTests.length>1?'s':'')+' result'+(_negTests.length>1?'aron':'ó')+' negativo'+(_negTests.length>1?'s':'')+' ('+_nNames+'), lo que permite reducir la probabilidad de diagnósticos alternativos relacionados. ';
    }
    _dxC += '<div style="font-size:11px;line-height:1.85;color:#333;margin-bottom:12px;padding:11px 13px;background:#fafbf7;border-radius:6px;border:1px solid #dde5c4">'+_nar+'</div>';

    // ── EBM Diagnosis engine ──
    if (_modalPos.length > 0 && typeof diagnosticarHombro==='function') {
      const _res = diagnosticarHombro(_modalPos);
      if (_res.diagnosticos.length > 0) {
        const _top = _res.diagnosticos[0];
        // Main diagnosis box
        _dxC += '<div style="border:1px solid #b8d060;border-radius:8px;overflow:hidden;margin-bottom:12px">'
          +'<div style="background:#798254;padding:10px 14px;display:flex;justify-content:space-between;align-items:center">'
          +'<div><div style="font-size:9px;letter-spacing:1px;color:rgba(255,255,255,.7);margin-bottom:2px">DIAGNÓSTICO PRINCIPAL — EVALUACIÓN BASADA EN EVIDENCIA</div>'
          +'<div style="font-size:13px;font-weight:900;color:#fff">'+_top.nombre+'</div></div>'
          +'<div style="background:rgba(255,255,255,.2);color:#fff;font-size:9px;padding:3px 10px;border-radius:4px;text-align:center">'+_top.confianzaLabel+'<br><strong>'+_top.confidence+'%</strong></div></div>'
          +'<div style="padding:12px 14px">'
          +'<div style="font-size:11px;color:#444;line-height:1.75;margin-bottom:10px">'+_top.criterio+'</div>'
          +'<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">'
          +'<span style="font-size:9px;color:#888;align-self:center">Tests positivos que orientan:</span>'
          +_top.mainHits.map(t=>'<span style="background:#f9eaea;color:#8b2020;font-size:9px;padding:2px 8px;border-radius:3px;border:1px solid #f0cece">'+_tnOf(t)+'</span>').join('')
          +_top.supportHits.map(t=>'<span style="background:#fdf5e0;color:#7a5500;font-size:9px;padding:2px 8px;border-radius:3px;border:1px solid #f0e0a0">'+_tnOf(t)+'</span>').join('')
          +'</div>'
          +'<div style="font-size:10px;color:#444;line-height:1.7;padding:10px;background:#f6f8ee;border-radius:5px;margin-bottom:8px"><strong style="color:#2d5a0e">Ruta de tratamiento recomendada (CPG 2025):</strong><br>'+_top.tratamiento+'</div>'
          +'<div style="font-size:9px;color:#aaa;font-style:italic">'+_top.ref+'</div>'
          +'</div></div>';

        // Differential diagnoses
        if (_res.diagnosticos.length > 1) {
          _dxC += '<div style="margin-bottom:8px"><div style="font-size:10px;font-weight:700;color:#555;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Diagnósticos diferenciales a considerar:</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">';
          _res.diagnosticos.slice(1).forEach(dx => {
            const _bc = dx.confidence>=65?'#edf5e0':dx.confidence>=35?'#fef8ec':'#f5f5f5';
            const _tc = dx.confidence>=65?'#2d6a1a':dx.confidence>=35?'#7a4500':'#666';
            _dxC += '<div style="background:'+_bc+';border-radius:4px;padding:7px 10px">'
              +'<div style="font-size:10px;font-weight:700;color:'+_tc+'">'+dx.nombre+'</div>'
              +'<div style="font-size:9px;color:#888;margin-top:2px">'+dx.confianzaLabel+' · '+dx.confidence+'%</div>'
              +'<div style="font-size:9px;color:#555;margin-top:3px;line-height:1.4">'+dx.criterio.substring(0,100)+(dx.criterio.length>100?'…':'')+'</div>'
              +'</div>';
          });
          _dxC += '</div></div>';
        }
      }
    } else if (_posTests.length===0 && tests.length>0) {
      _dxC += '<div style="font-size:11px;color:#555;padding:10px;background:#f8f8f8;border-radius:5px;border-left:3px solid #ccc;line-height:1.7">Todos los tests ortopédicos resultaron negativos en la evaluación actual. Esto orienta a descartar patología estructural mayor del complejo glenohumeral. Se recomienda considerar origen referido cervical o torácico, síndrome de dolor miofascial, o factores contribuyentes psicosociales (kinesiofobia, catastrofización). Evaluación diferencial cervical recomendada.</div>';
    }

    // Evidence footer
    _dxC += '<div style="font-size:9px;color:#bbb;text-align:right;margin-top:8px;font-style:italic">Algoritmo diagnóstico basado en: Zhao Y. et al. BMC Musculoskelet Disord 2024 · Desmeules F. et al. JOSPT 2025 (CPG Nivel I) · Beraldo M. et al. Cureus 2025 · Bruna González Rev AKD 2020</div>';

  } else if (!dxManual) {
    _dxC += '<div style="font-size:11px;color:#888;font-style:italic;padding:10px;background:#f8f8f8;border-radius:5px">No se registraron tests ortopédicos en esta evaluación. Complete el tab Tests del modal hombro para activar el diagnóstico diferencial automático basado en evidencia.</div>';
  }
  const _sec08Intro = '<div style="font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f6f8ee;border-radius:5px;border-left:3px solid #798254">El diagnóstico kinesiológico es la conclusión clínica del kinesiólogo basada en la integración de todos los hallazgos de la evaluación: ROM, fuerza, tests ortopédicos y escalas funcionales. Es un diagnóstico <strong>presuntivo</strong>, ya que requiere correlación con imagen (ecografía, RMN) y juicio médico para confirmación definitiva. El motor de inferencia EBM pondera automáticamente los tests positivos según su razón de verosimilitud (LR+/LR−) proveniente de meta-análisis internacionales, calculando la probabilidad de cada diagnóstico diferencial.</div>';
  const sec08 = _infSecHead('08','Diagnóstico kinesiológico presuntivo') + _sec08Intro + _dxC;

  // 09 — Plan de tratamiento
  const sec09 = secTrat ? `
    ${_infSecHead('09','Ruta de tratamiento basada en evidencia')}
    <div style="font-size:10px;color:#444;margin-bottom:10px;line-height:1.65;padding:9px 12px;background:#f6f8ee;border-radius:5px;border-left:3px solid #798254">
      El plan de tratamiento se estructura en fases progresivas basadas en los lineamientos de la Guía de Práctica Clínica CPG 2025 para patología de hombro. Cada fase tiene objetivos específicos, duración estimada e intervenciones con respaldo de evidencia. La progresión entre fases depende del cumplimiento de criterios funcionales objetivos, no exclusivamente del tiempo transcurrido.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${[
        ['FASE 1 — Modulación analgésica', 'Sem. 1–3', 'Isometría pesada RE a 0° y 45° (5×45s, 70% MIVC). Protocolo capsular posterior (Sleeper Stretch). Reducción de inhibición artrogénica.'],
        ['FASE 2 — Orientación estructural (HSR)', 'Sem. 4–8', 'Heavy Slow Resistance 3s/3s. Síntesis colágena. Trabajo escapular: Push-up plus, remo supino, serrato anterior.'],
        ['FASE 3 — Potencia y cadena cinética', 'Sem. 9–12', 'Pliometría tren superior. Lanzamientos balísticos. Integración de patrones de empuje cruzado con apoyo monopodal.'],
        ['FASE 4 — RTS específico', 'Sem. 13+', 'Simulación gestual del deporte. Perturbaciones externas reactivas en overhead. Exposición progresiva con criterios objetivos.'],
      ].map(([titulo,sem,desc])=>`
      <div style="background:#f6f8ee;border-radius:6px;padding:10px;border:1px solid #dde5c4">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <strong style="font-size:10px;color:#1e1e1b">${titulo}</strong>
          <span style="background:#798254;color:#fff;font-size:8px;padding:1px 6px;border-radius:3px">${sem}</span>
        </div>
        <div style="font-size:10px;color:#555;line-height:1.5">${desc}</div>
      </div>`).join('')}
    </div>` : '';

  // 10 — Notas clínicas
  const sec10 = notasExtra ? `
    ${_infSecHead('10','Notas clínicas adicionales')}
    <div style="background:#fdfde8;border-radius:6px;padding:12px;border:1px solid #e8e0a0;font-size:11px;line-height:1.7;white-space:pre-wrap">${notasExtra}</div>` : '';

  // Firma
  const firma = typeof _tmcFirma !== 'undefined'
    ? _tmcFirma({profNombre, profMP, profInst})
    : `<div style="margin-top:32px;padding-top:16px;border-top:2px solid #dde5c4;display:flex;justify-content:space-between;align-items:flex-end">
      <div style="font-size:10px;color:#888">
        <div>THE MOVE CLUB · Kinesiología de Alto Rendimiento</div>
        <div>CPG 2025 · Desmeules et al. · Zhao 2024 meta-análisis</div>
      </div>
      <div style="text-align:right">
        <div style="width:140px;border-top:1.5px solid #1e1e1b;margin-bottom:4px"></div>
        <div style="font-size:11px;font-weight:700">${profNombre}</div>
        ${profMP?`<div style="font-size:10px;color:#666">${profMP}</div>`:''}
        <div style="font-size:10px;color:#666">${profInst}</div>
      </div>
    </div>`;

  // ── Assemble full report ──
  const bodyContent = sec01 + sec02 + sec03 + sec04 + dashboard + sec06 + sec07 + sec08 + sec09 + sec10 + firma;

  const fullHTML = `<!DOCTYPE html>
<html lang="es"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Informe Kinesiológico — ${nombre} — ${fecha}</title>
  <style>${css}</style>
</head><body>
<div class="no-print" style="background:#1e1e1b;padding:10px 20px;display:flex;gap:8px;align-items:center;position:sticky;top:0;z-index:100">
  <button onclick="window.print()" style="background:#798254;color:#fff;border:none;border-radius:4px;padding:8px 18px;font-weight:700;cursor:pointer;font-size:12px;letter-spacing:.3px">🖨 Imprimir / Guardar PDF</button>
  <button onclick="toggleEditMode()" id="edit-btn" style="background:#444;color:#fff;border:none;border-radius:4px;padding:8px 14px;cursor:pointer;font-size:12px">✏ Editar</button>
  <span style="font-size:10px;color:rgba(255,255,255,.35);margin-left:6px">Imprimir → «Guardar como PDF» para exportar</span>
</div>
<header style="background:#1e1e1b;padding:26px 44px;display:flex;justify-content:space-between;align-items:flex-start">
  <div style="display:flex;align-items:flex-start;gap:16px">
    <div style="opacity:.95;margin-top:2px">${typeof TMC_ISOTIPO_SVG!=='undefined'?TMC_ISOTIPO_SVG('#798254',52):''}</div>
    <div>
      <div style="font-size:26px;font-weight:900;letter-spacing:-.5px;color:#96a566;line-height:1">THE MOVE CLUB</div>
      <div style="font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:rgba(255,255,255,.38);margin-top:4px">REPORTE CLÍNICO KINESIOLÓGICO</div>
      <div style="font-size:10.5px;color:rgba(255,255,255,.58);margin-top:7px">Basado en evidencia · CPG 2025 · Desmeules et al. (JOSPT)</div>
    </div>
  </div>
  <div style="text-align:right;color:rgba(255,255,255,.75);font-size:11px">
    <div style="font-size:9px;color:rgba(255,255,255,.32);text-transform:uppercase;letter-spacing:1.2px">FECHA EVALUACIÓN</div>
    <div style="font-size:16px;font-weight:700;color:#96a566;margin-top:3px">${fecha}</div>
    <div style="margin-top:7px;font-size:11.5px;font-weight:600">${profNombre}${profMP?' · '+profMP:''}</div>
    <div style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px">${profInst}</div>
  </div>
</header>
${intro}
<main id="report-body" style="padding:8px 40px 32px;max-width:800px;margin:0 auto">${bodyContent}</main>
<footer style="background:#1e1e1b;color:rgba(255,255,255,.35);padding:10px 44px;display:flex;justify-content:space-between;font-size:9px;margin-top:8px">
  <span>THE MOVE CLUB · DEPARTAMENTO DE BIOMECÁNICA Y RENDIMIENTO</span>
  <span>Informe Clínico Kinesiológico — Hombro · CPG 2025 · Desmeules et al.</span>
</footer>
<script>
function toggleEditMode(){
  const body = document.getElementById('report-body');
  const btn  = document.getElementById('edit-btn');
  const intro = document.querySelector('header + div');
  const editing = body.contentEditable === 'true';
  body.contentEditable = editing ? 'false' : 'true';
  if (intro) intro.contentEditable = body.contentEditable;
  body.style.outline = editing ? 'none' : '2px dashed #798254';
  btn.textContent = editing ? '✏ Editar' : '✓ Listo';
  btn.style.background = editing ? '#555' : '#798254';
}
</script>
</body></html>`;

  const win = window.open('', '_blank', 'width=960,height=860,resizable=yes,scrollbars=yes');
  if (!win) { alert('Habilitá popups para este sitio para abrir el informe.'); return; }
  win.document.write(fullHTML);
  win.document.close();
}


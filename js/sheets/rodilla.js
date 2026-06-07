// ═══════════════════════════════════════════════════════════════
// sheets/rodilla.js v2 — LCA · SPF · Menisco · Condral
// Algoritmo diagnóstico + informe imprimible basado en evidencia
// ═══════════════════════════════════════════════════════════════

// Estado interno de los tests completados
const rodState = {
  lca:   {},  // { lachman: bool|null, cajon_ant: bool|null, ... }
  spf:   {},
  men:   {},  // menisco
  cond:  {},  // condral
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

  c.innerHTML = RODILLA_SPF_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header">
        <div>
          <h3>${t.nombre}</h3>
          <div style="font-size:10px;color:var(--text3);margin-top:2px">${t.protocolo.slice(0,90)}…</div>
        </div>
        <span class="tag tag-b" style="font-size:9px;white-space:nowrap">${t.sn ? `Sn ${t.sn} · Sp ${t.sp}` : 'Criterio clínico'}</span>
      </div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text2);margin-bottom:8px;font-style:italic">${t.protocolo}</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
          <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('spf','${t.id}',true)">+ POS</button>
          <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('spf','${t.id}',false)">– NEG</button>
          <span style="font-size:10px;color:var(--text3);margin-left:6px">${t.criterio_diag ? '⭐ Criterio diagnóstico principal' : ''}</span>
        </div>
        <div style="font-size:10px;color:var(--text3)">📚 ${t.ref}${t.nota ? '<br>⚠️ ' + t.nota : ''}</div>
      </div>
    </div>
  `).join('');
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

  // Composite score info — 5 elementos exactos JOSPT 2018
  const compositeInfo = `<div class="card mb-10" style="border-color:rgba(255,190,0,.3);background:rgba(255,190,0,.04)">
    <div class="card-body">
      <div style="font-size:12px;font-weight:700;color:var(--amber);margin-bottom:4px">Composite Score Meniscal (Logerstedt, JOSPT 2018)</div>
      <div style="font-size:11px;color:var(--text2)">5 elementos: antecedente locking/catching ⭐ + hiperextensión forzada ⭐ + flexión máxima ⭐ + JLT ⭐ + McMurray ⭐</div>
      <div style="font-size:11px;color:var(--text2);margin-top:4px">>3 positivos → <strong style="color:var(--neon)">Sp 90.2%</strong> · >1 positivo → Sn 76.6% · 0 positivos → Sn 23.4% / Sp 56.9%</div>
      <div id="rod-composite-score" style="font-family:var(--mono);font-size:20px;font-weight:800;color:var(--neon);margin-top:6px">0/5</div>
      <!-- Antecedente locking/catching — elemento 1 del composite -->
      <div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,190,0,.2)">
        <div style="font-size:11px;font-weight:700;margin-bottom:6px">① Antecedente de locking / catching (historia clínica)</div>
        <div style="font-size:10px;color:var(--text2);margin-bottom:6px;font-style:italic">¿El paciente refiere sensación de bloqueo articular o "catching" (traba momentánea) en la rodilla?</div>
        <div style="display:flex;gap:6px">
          <button class="ot-btn" onclick="toggleOT(this,'pos');_rodSetTest('men','catching_locking',true);_updateComposite()">+ SÍ</button>
          <button class="ot-btn" onclick="toggleOT(this,'neg');_rodSetTest('men','catching_locking',false);_updateComposite()">– NO</button>
        </div>
        <div style="font-size:10px;color:var(--text3);margin-top:4px">📚 Logerstedt DS et al. JOSPT 2018;48(2):A1-A50. Elemento 1 del Composite Score.</div>
      </div>
    </div>
  </div>`;

  c.innerHTML = compositeInfo + RODILLA_MENISCO_TESTS.map(t => {
    const snInfo = t.sn_med
      ? `Sn med ${t.sn_med} · Sp med ${t.sp_med} · Sn lat ${t.sn_lat}`
      : (t.sn ? `Sn ${t.sn} · Sp ${t.sp}` : 'Elemento composite score');
    const isComposite = ['mcmurray','hyperext_forzada','flexion_max','jlt'].includes(t.id);
    return `
    <div class="card mb-8${isComposite ? '" style="border-color:rgba(255,190,0,.3)' : ''}">
      <div class="card-header">
        <div>
          <h3>${t.nombre}${isComposite ? ' ⭐' : ''}</h3>
          <div style="font-size:10px;color:var(--text3);margin-top:2px">${isComposite ? 'Elemento composite score' : ''}</div>
        </div>
        <span class="tag tag-y" style="font-size:9px;white-space:nowrap">${snInfo}</span>
      </div>
      <div class="card-body">
        <div style="font-size:10px;color:var(--text2);margin-bottom:8px;font-style:italic">${t.protocolo}</div>
        ${t.id === 'mcmurray' || t.id === 'apley' || t.id === 'thessaly' ? `
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
        <div style="font-size:10px;color:var(--text3)">📚 ${t.ref}${t.nota ? '<br>⚠️ ' + t.nota : ''}</div>
      </div>
    </div>`;
  }).join('');
}

function _updateComposite() {
  // Composite JOSPT 2018: 5 elementos exactos del paper
  // 1) catching/locking, 2) hiperext forzada, 3) flexión máx, 4) JLT, 5) McMurray
  const keys = ['catching_locking','hyperext_forzada','flexion_max','jlt','mcmurray'];
  const score = keys.filter(k => rodState.men[k] === true).length;
  const el = document.getElementById('rod-composite-score');
  if (!el) return;
  const c = score >= 4 ? 'var(--neon)' : score >= 2 ? 'var(--amber)' : 'var(--text3)';
  el.style.color = c;
  let label = '';
  if (score >= 4) label = '— Sp 90.2%';
  else if (score >= 2) label = '— Sn 76.6%';
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
let visapVals = new Array(8).fill(0);
function buildVISAP() {
  const c = document.getElementById('visap-fields');
  if (!c || c.innerHTML) return;
  visapVals = new Array(8).fill(0);
  c.innerHTML = VISAP_ITEMS.map((item, i) => `
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

// ── KOOS — inputs de subescalas (0–100 por subescala) ─────────
function buildKOOS() {
  const c = document.getElementById('koos-fields');
  if (!c || c.innerHTML) return;
  c.innerHTML = KOOS_SUBSCALAS.map(s => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;font-weight:600;margin-bottom:3px">${s.label}</div>
      <div style="font-size:10px;color:var(--text3);margin-bottom:5px">${s.desc} · MCID: ≥${s.mcid} pts</div>
      <div style="display:flex;align-items:center;gap:8px">
        <input class="inp inp-mono" type="number" min="0" max="100" placeholder="0–100"
          id="koos-${s.id}" style="width:80px"
          oninput="calcKOOS('${s.id}',+this.value)">
        <div id="koos-badge-${s.id}" style="font-size:12px;color:var(--text3)">—</div>
      </div>
    </div>
  `).join('');
}

function calcKOOS(id, val) {
  const el = document.getElementById('koos-badge-' + id);
  if (!el || isNaN(val)) return;
  const c   = val >= 75 ? 'var(--neon)' : val >= 50 ? 'var(--amber)' : 'var(--red)';
  const txt = val >= 75 ? 'Buena función' : val >= 50 ? 'Disfunción moderada' : 'Disfunción severa';
  el.innerHTML = `<span style="color:${c};font-weight:700;font-family:var(--mono)">${val}</span> — <span style="color:${c}">${txt}</span>`;
  // Actualizar total visual si existe
  const subs = KOOS_SUBSCALAS.map(s => {
    const inp = document.getElementById('koos-' + s.id);
    return inp && inp.value !== '' ? +inp.value : null;
  }).filter(v => v !== null);
  if (subs.length === KOOS_SUBSCALAS.length) {
    const prom = Math.round(subs.reduce((a,b)=>a+b,0) / subs.length);
    const tot = document.getElementById('koos-total');
    if (tot) { tot.textContent = prom; tot.style.color = prom >= 75 ? 'var(--neon)' : prom >= 50 ? 'var(--amber)' : 'var(--red)'; }
  }
}

// ═══════════════════════════════════════════════════════════════
// INFORME IMPRIMIBLE — Rodilla
// ═══════════════════════════════════════════════════════════════
function _rodillaPrintInforme() {
  if (!cur) { alert('Seleccioná un atleta primero'); return; }

  const nombre   = `${cur.nombre || ''} ${cur.apellido || ''}`.trim();
  const fecha    = new Date().toLocaleDateString('es-AR');
  const kine     = cur.kine || '—';

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

  // ── Diagnóstico ──
  const allTests = { ...rodState.lca, ...rodState.spf, ...rodState.men, ...rodState.cond };
  const diagResults = Object.entries(RODILLA_DIAG_LOGIC)
    .map(([k, logic]) => ({ key: k, label: logic.label, ...logic.evaluar(allTests) }))
    .filter(r => r.nivel)
    .sort((a, b) => b.pct - a.pct);

  const totalCompletados = lcaResults.length + spfResults.length + menResults.length + condResults.length;

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
    const c   = pos ? C.rojo : C.verde;
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

  const refs = Object.values(RODILLA_REFS);
  const hasDiag    = diagResults.length > 0;
  const hasLCA     = lcaResults.length > 0;
  const hasSPF     = spfResults.length > 0;
  const hasMen     = menResults.length > 0;
  const hasCond    = condResults.length > 0;

  // Composite score menisco — 5 elementos JOSPT 2018 (Logerstedt)
  const compKeys = ['catching_locking','mcmurray','hyperext_forzada','flexion_max','jlt'];
  const compScore = compKeys.filter(k => rodState.men[k] === true).length;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Evaluación Rodilla — ${nombre}</title>
<style>
  @page { size: A4 portrait; margin: 13mm 16mm 15mm 16mm; }
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; color-adjust:exact !important; }
  body { background:#1a1c1b; color:#e0e0e0; font-family:'Segoe UI',Arial,sans-serif; font-size:8pt; line-height:1.45; }
  .page { width:100%; }
  .page-break { page-break-before:always; }
  .section { background:#1f2220; border:1pt solid #2e312e; border-radius:5pt; padding:11pt 13pt; margin-bottom:9pt; page-break-inside:avoid; }
  table { width:100%; border-collapse:collapse; }
  th, td { text-align:left; }
  .hdr { display:flex; justify-content:space-between; align-items:center; padding-bottom:8pt; margin-bottom:10pt; border-bottom:1pt solid #2e312e; }
  .col-2 { display:grid; grid-template-columns:1fr 1fr; gap:8pt; }
</style>
</head>
<body>

<!-- PÁGINA 1 -->
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

  <!-- 02 ANÁLISIS DIAGNÓSTICO -->
  ${hasDiag ? `<div class="section">
    ${secHeader('02.', 'ANÁLISIS DIAGNÓSTICO — PROBABILIDAD POR PATOLOGÍA')}
    <div style="font-size:6.5pt;color:#666;margin-bottom:8pt">Basado en likelihood ratios (LR+/LR–) y criterios CPG. Probabilidad estimada según tests completados. No reemplaza juicio clínico.</div>
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

  <!-- 03 LCA -->
  ${testTable(secHeader('03.', 'TESTS LIGAMENTO CRUZADO ANTERIOR (LCA / LCP)'), lcaResults, hasLCA)}

</div>

${hasSPF || hasMen ? `
<!-- PÁGINA 2 -->
<div class="page page-break">
  <div class="hdr">
    <div style="font-size:9pt;font-weight:900;color:#fff">MOVEMETRICS <span style="font-weight:400;color:#444">·</span> <span style="font-size:6.5pt;font-weight:600;letter-spacing:.1em;color:#39ff7a;text-transform:uppercase">EVALUACIÓN RODILLA</span></div>
    <div style="font-size:6.5pt;color:#555">${nombre} · ${fecha}</div>
  </div>

  <!-- 04 SPF -->
  ${testTable(secHeader('04.', 'SÍNDROME DOLOR PATELOFEMORAL (SPF / PFP)'), spfResults, hasSPF)}
  ${hasSPF ? `<div style="margin-top:-4pt;margin-bottom:9pt;padding:6pt 8pt;background:#1a1c1b;border-radius:3pt;border-left:2pt solid #2a5c3a"><span style="font-size:6.5pt;font-weight:700;color:#aaa">Criterios diagnósticos (Willy 2019 JOSPT, Grado A/B): </span><span style="font-size:6.5pt;color:#666">(1) Dolor retro/peripatelar · (2) Reproducción con cuclillas, escaleras o sedentación prolongada · (3) Exclusión patología tibiofemoral. Test de inclinación patelar: Grado C. Clarke y aprensión: baja utilidad aislados.</span></div>` : ''}

  <!-- 05 MENISCO -->
  ${testTable(secHeader('05.', 'MENISCO'), menResults, hasMen)}
  ${hasMen ? `<div style="margin-top:-4pt;margin-bottom:9pt;padding:6pt 8pt;background:#1a1c1b;border-radius:3pt;border-left:2pt solid #2a5c3a">
    <span style="font-size:6.5pt;font-weight:700;color:#aaa">Composite Score JOSPT 2018: </span>
    <span style="font-size:6.5pt;color:#666">Catching/locking + McMurray + Hiperextensión forzada + Flexión máxima + JLT. ≥4 positivos → Sp 90.2% · ≥2 positivos → Sn 76.6%. Presente: <strong style="color:#ffbe00">${compScore}/5</strong>.</span>
  </div>` : ''}

</div>` : ''}

${hasCond ? `
<!-- PÁGINA CONDRAL -->
<div class="page ${hasSPF || hasMen ? '' : 'page-break'}">
  ${(hasSPF || hasMen) ? `<div class="hdr">
    <div style="font-size:9pt;font-weight:900;color:#fff">MOVEMETRICS <span style="font-weight:400;color:#444">·</span> <span style="font-size:6.5pt;font-weight:600;letter-spacing:.1em;color:#39ff7a;text-transform:uppercase">EVALUACIÓN RODILLA</span></div>
    <div style="font-size:6.5pt;color:#555">${nombre} · ${fecha}</div>
  </div>` : ''}

  <!-- 06 CONDRAL -->
  ${testTable(secHeader('06.', 'LESIÓN CONDRAL / OSTEOCONDRAL'), condResults, true)}
  <div style="margin-top:-4pt;margin-bottom:9pt;padding:6pt 8pt;background:#331515;border-radius:3pt;border-left:2pt solid #ff4646">
    <span style="font-size:6.5pt;font-weight:700;color:#ff8888">Nota clínica (Wilk 2006 / Logerstedt 2018): </span>
    <span style="font-size:6.5pt;color:#888">No existen pruebas físicas de alta Sn/Sp para lesión condral focal. Diagnóstico definitivo por RMN (Sn >80% para lesiones ≥1cm²). Hemarthrosis <2h post-trauma = alta sospecha fractura osteocondral. Ottawa Knee Rules: Sn 0.99, Sp 0.49 (Stiell 1995) — si positivo, indicar Rx antes de RMN.</span>
  </div>

</div>` : ''}

<!-- BIBLIOGRAFÍA -->
<div class="page page-break">
  <div class="hdr">
    <div style="font-size:9pt;font-weight:900;color:#fff">MOVEMETRICS <span style="font-weight:400;color:#444">·</span> <span style="font-size:6.5pt;font-weight:600;letter-spacing:.1em;color:#39ff7a;text-transform:uppercase">EVALUACIÓN RODILLA</span></div>
    <div style="font-size:6.5pt;color:#555">${nombre} · ${fecha}</div>
  </div>

  <!-- JUICIO CLÍNICO -->
  <div class="section">
    ${secHeader('07.', 'JUICIO CLÍNICO INTEGRADOR')}
    <div style="padding:10pt 12pt;background:#1a1c1b;border:1pt solid #2e312e;border-radius:4pt;margin-bottom:9pt">
      <div style="font-size:7.5pt;color:#bbb;line-height:1.8">
        ${nombre} presenta una evaluación de rodilla con ${totalCompletados} tests completados.
        ${diagResults.length > 0 ? `Las patologías con mayor probabilidad según los tests realizados son: <strong style="color:#fff">${diagResults.slice(0, 2).map(r => r.label + ' (' + r.pct + '%)').join(', ')}</strong>.` : ''}
        ${diagResults.find(r => r.urgente) ? '<strong style="color:#ff4646"> ⚠ Se detecta hallazgo urgente — derivar inmediatamente.</strong>' : ''}
      </div>
    </div>
    <div style="font-size:6.5pt;color:#666;font-style:italic;padding:5pt 8pt;background:#1a1c1b;border-radius:3pt">
      ⚠ Este informe no reemplaza el juicio clínico del profesional tratante. Los valores de corte (Sn/Sp/LR) provienen de los estudios referenciados. La probabilidad es una estimación basada en likelihood ratios pre-test/post-test y no constituye diagnóstico definitivo. Para lesiones condrales, la confirmación requiere RMN.
    </div>
  </div>

  <!-- BIBLIOGRAFÍA -->
  <div class="section">
    ${secHeader('08.', 'BIBLIOGRAFÍA')}
    <div style="display:grid;grid-template-columns:1fr;gap:4pt">
      ${refs.map((r, i) => `<div style="font-size:6pt;color:#555;padding:3pt 0;border-bottom:1pt solid #252827">[${i + 1}] ${r}</div>`).join('')}
    </div>
  </div>

</div>

</body>
</html>`;

  const win = window.open('', '_blank', 'width=960,height=780,scrollbars=yes,menubar=yes');
  if (!win) { alert('Popup bloqueado. Habilitá popups para este sitio.'); return; }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.onload = () => { try { win.print(); } catch(e) {} };
}
window._rodillaPrintInforme = _rodillaPrintInforme;

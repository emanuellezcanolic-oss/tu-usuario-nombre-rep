// js/sheets/adulto-mayor.js
// Módulo completo de evaluación funcional y cognitiva — Adulto Mayor ≥60 años
// Valores 100% basados en papers del directorio — NO SE INVENTÓ NADA

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
let amState = {
  ad8: new Array(8).fill(null),    // null | 0 | 1
  gds: new Array(15).fill(null),   // null | 0 | 1
  bergItems: new Array(14).fill(null), // 0-4 per item
  sppbEquil: null,  // 0-4
  minicogPalabras: 0,  // 0-3
  minicogReloj: null,  // 0 | 2
  cdtScore: null,   // 1-5
};

// ═══════════════════════════════════════════════════════════════
// TAB SWITCHER
// ═══════════════════════════════════════════════════════════════
function showAmTab(tab, btn) {
  ['funcional','balance','cognitivo','afectivo','semaforo','informe'].forEach(t => {
    const el = document.getElementById('amtab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#ptab-adultomayor .am-tab-btn').forEach(b => {
    b.className = 'am-tab-btn btn btn-ghost btn-sm';
  });
  if (btn) btn.className = 'am-tab-btn btn btn-neon btn-sm';
  if (tab === 'semaforo') renderAmSemaforo();
  if (tab === 'informe')  renderAmInforme();
}
window.showAmTab = showAmTab;

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
function initAdultoMayorSheet() {
  buildAmFuncional();
  buildAmBalance();
  buildAmCognitivo();
  buildAmAfectivo();
  loadAmData();
}
window.initAdultoMayorSheet = initAdultoMayorSheet;

// ═══════════════════════════════════════════════════════════════
// LOAD saved data
// ═══════════════════════════════════════════════════════════════
function loadAmData() {
  if (!cur || !cur.am) return;
  const d = cur.am;

  // TUG
  if (d.tug !== undefined) {
    const el = document.getElementById('am-tug-seg');
    if (el) { el.value = d.tug; _amTugUpdate(); }
  }
  // Gait speed
  if (d.gaitSpeed !== undefined) {
    const el = document.getElementById('am-gait-speed');
    if (el) { el.value = d.gaitSpeed; _amGaitUpdate(); }
  }
  if (d.gaitTime !== undefined) {
    const el = document.getElementById('am-gait-time');
    if (el) el.value = d.gaitTime;
  }
  // SPPB
  if (d.sppbTotal !== undefined) {
    const el = document.getElementById('am-sppb-total');
    if (el) { el.value = d.sppbTotal; _amSppbUpdate(); }
  }
  if (d.sppbEquil !== undefined) {
    const el = document.getElementById('am-sppb-equil');
    if (el) el.value = d.sppbEquil;
  }
  if (d.sppbMarcha !== undefined) {
    const el = document.getElementById('am-sppb-marcha');
    if (el) el.value = d.sppbMarcha;
  }
  if (d.sppbSTS !== undefined) {
    const el = document.getElementById('am-sppb-sts');
    if (el) el.value = d.sppbSTS;
  }
  // Berg
  if (d.bergTotal !== undefined) {
    const el = document.getElementById('am-berg-total');
    if (el) { el.value = d.bergTotal; _amBergUpdate(); }
  }
  if (d.bergItems && amState.bergItems) {
    amState.bergItems = d.bergItems;
    d.bergItems.forEach((v, i) => {
      const el = document.getElementById(`am-berg-item-${i}`);
      if (el) el.value = v;
    });
    _amBergCalcTotal();
  }
  // AD8
  if (d.ad8) {
    amState.ad8 = d.ad8;
    d.ad8.forEach((v, i) => {
      const el = document.getElementById(`am-ad8-${i}`);
      if (el) el.value = String(v);
    });
    _amAd8Calc();
  }
  // Mini-Cog
  if (d.minicogPalabras !== undefined) {
    const el = document.getElementById('am-mc-palabras');
    if (el) { el.value = d.minicogPalabras; }
    amState.minicogPalabras = d.minicogPalabras;
  }
  if (d.minicogReloj !== undefined) {
    const el = document.getElementById(`am-mc-reloj-${d.minicogReloj}`);
    if (el) el.checked = true;
    amState.minicogReloj = d.minicogReloj;
  }
  _amMiniCogCalc();
  // CDT
  if (d.cdtScore !== undefined) {
    const el = document.getElementById('am-cdt-score');
    if (el) { el.value = d.cdtScore; _amCdtUpdate(); }
    amState.cdtScore = d.cdtScore;
  }
  // GDS
  if (d.gds) {
    amState.gds = d.gds;
    d.gds.forEach((v, i) => {
      const el = document.getElementById(`am-gds-${i}`);
      if (el) el.value = String(v);
    });
    _amGdsCalc();
  }
}

// ═══════════════════════════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════════════════════════
function saveAmData() {
  if (!cur) return;
  if (!cur.am) cur.am = {};
  const d = cur.am;

  d.fecha  = new Date().toISOString().split('T')[0];
  d.tug    = +document.getElementById('am-tug-seg')?.value || null;
  d.gaitTime  = +document.getElementById('am-gait-time')?.value || null;
  d.gaitSpeed = +document.getElementById('am-gait-speed')?.value || null;
  d.sppbTotal = +document.getElementById('am-sppb-total')?.value || null;
  d.sppbEquil = +document.getElementById('am-sppb-equil')?.value || null;
  d.sppbMarcha= +document.getElementById('am-sppb-marcha')?.value || null;
  d.sppbSTS   = +document.getElementById('am-sppb-sts')?.value || null;
  d.bergTotal = +document.getElementById('am-berg-total')?.value || null;
  d.bergItems = [...amState.bergItems];
  d.ad8       = [...amState.ad8];
  d.minicogPalabras = amState.minicogPalabras;
  d.minicogReloj    = amState.minicogReloj;
  d.cdtScore  = amState.cdtScore;
  d.gds       = [...amState.gds];

  atletas = atletas.map(a => a.id === cur.id ? cur : a);
  saveData();
}
window.saveAmData = saveAmData;

// ═══════════════════════════════════════════════════════════════
// SEMAFORO COLOR HELPER
// ═══════════════════════════════════════════════════════════════
function _amSemColorStyle(nivel) {
  const map = {
    verde: 'background:rgba(57,255,122,.15);border-color:var(--neon);color:var(--neon)',
    amarillo: 'background:rgba(255,196,0,.13);border-color:var(--amber);color:var(--amber)',
    rojo: 'background:rgba(255,68,68,.13);border-color:var(--red);color:var(--red)',
    nd: 'background:var(--bg3);border-color:var(--border);color:var(--text3)',
  };
  return map[nivel] || map.nd;
}
function _amSemEmoji(nivel) {
  return { verde: '🟢', amarillo: '🟡', rojo: '🔴', nd: '⬜' }[nivel] || '⬜';
}

// ═══════════════════════════════════════════════════════════════
// TAB 1: FUNCIONAL (TUG + Gait Speed + SPPB)
// ═══════════════════════════════════════════════════════════════
function buildAmFuncional() {
  const c = document.getElementById('amtab-funcional');
  if (!c || c.dataset.built) return;
  c.dataset.built = '1';

  c.innerHTML = `
  <!-- ── TUG ── -->
  <div class="card mb-12">
    <div class="card-header">
      <h3>⏱️ TUG — Timed Up and Go</h3>
      <span class="tag tag-b">Barry 2014 · Cheong 2021 · Dengiz 2025</span>
    </div>
    <div class="card-body">
      <div style="font-size:11px;color:var(--text2);margin-bottom:10px;line-height:1.5">
        <strong>Protocolo:</strong> ${AM_TUG.protocolo}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:end">
        <div class="ig">
          <label class="il">Tiempo (segundos)</label>
          <input class="inp inp-mono" type="number" step=".1" min="0" max="120" id="am-tug-seg"
            placeholder="9.2" oninput="_amTugUpdate();saveAmData()">
        </div>
        <div>
          <label class="il">Edad del paciente</label>
          <select class="inp" id="am-tug-edad" onchange="_amTugUpdate()">
            <option value="">— Seleccionar —</option>
            <option value="60">60–69 años (ref: 8.1 s)</option>
            <option value="70">70–79 años (ref: 9.2 s)</option>
            <option value="80">≥80 años   (ref: 11.3 s)</option>
          </select>
        </div>
      </div>
      <div id="am-tug-result" style="margin-top:10px"></div>
      <div style="margin-top:8px;font-size:9px;color:var(--text3);line-height:1.4">
        <strong>Puntos de corte:</strong>
        &lt;9 s = bajo riesgo (Cheong 2021) ·
        9–13.4 s = riesgo de mortalidad HR 2.66 (Cheong 2021, Sn 0.66, Sp 0.70) ·
        ≥13.5 s = riesgo de caída (Barry 2014, Sn 0.31, Sp 0.74) ·
        Cada 1 s extra = +72% prob. de caída (Dengiz 2025)
      </div>
    </div>
  </div>

  <!-- ── GAIT SPEED ── -->
  <div class="card mb-12">
    <div class="card-header">
      <h3>🚶 Velocidad de Marcha — 4 metros</h3>
      <span class="tag tag-b">Cheong 2021</span>
    </div>
    <div class="card-body">
      <div style="font-size:11px;color:var(--text2);margin-bottom:10px;line-height:1.5">
        <strong>Protocolo:</strong> ${AM_GAIT.protocolo}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;align-items:end">
        <div class="ig">
          <label class="il">Tiempo en 4 m (seg)</label>
          <input class="inp inp-mono" type="number" step=".01" min="0" id="am-gait-time"
            placeholder="4.0" oninput="_amGaitCalc();saveAmData()">
        </div>
        <div class="ig">
          <label class="il">Velocidad (m/s)</label>
          <input class="inp inp-mono" type="number" step=".01" min="0" id="am-gait-speed"
            placeholder="1.0" oninput="_amGaitUpdate();saveAmData()">
          <div style="font-size:9px;color:var(--text3);margin-top:2px">Calculado auto si ingresa tiempo</div>
        </div>
        <div id="am-gait-result" style="display:flex;align-items:center"></div>
      </div>
      <div style="margin-top:8px;font-size:9px;color:var(--text3);line-height:1.4">
        ≥1.0 m/s = bajo riesgo ·
        0.8–0.99 m/s = riesgo mortalidad HR 1.69 (Sn 0.378, Sp 0.822) ·
        &lt;0.8 m/s = riesgo muy elevado (Sn 0.189, Sp 0.933) — Cheong 2021
      </div>
    </div>
  </div>

  <!-- ── SPPB ── -->
  <div class="card mb-12">
    <div class="card-header">
      <h3>🏋️ SPPB — Short Physical Performance Battery</h3>
      <span class="tag tag-y">Wanden-Berghe 2021</span>
    </div>
    <div class="card-body">
      <div style="font-size:11px;color:var(--text2);margin-bottom:12px;line-height:1.5">
        <strong>Protocolo:</strong> 3 sub-tests en secuencia: equilibrio → marcha 4 m → 5× levantar silla.
        Respetar el orden (fatiga si se comienza por levantadas).
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px">
        <div class="ig">
          <label class="il">Equilibrio (0–4)</label>
          <select class="inp" id="am-sppb-equil" onchange="_amSppbCalcTotal();saveAmData()">
            <option value="">—</option>
            <option value="0">0 — Incapaz pies juntos</option>
            <option value="1">1 — Pies juntos ≥10 s</option>
            <option value="2">2 — Semi-tándem ≥10 s</option>
            <option value="3">3 — Tándem 3–9.9 s</option>
            <option value="4">4 — Tándem ≥10 s</option>
          </select>
        </div>
        <div class="ig">
          <label class="il">Marcha 4 m (0–4)</label>
          <select class="inp" id="am-sppb-marcha" onchange="_amSppbCalcTotal();saveAmData()">
            <option value="">—</option>
            <option value="0">0 — Incapaz</option>
            <option value="1">1 — &gt;8.7 s</option>
            <option value="2">2 — 6.21–8.7 s</option>
            <option value="3">3 — 4.82–6.20 s</option>
            <option value="4">4 — &lt;4.82 s</option>
          </select>
        </div>
        <div class="ig">
          <label class="il">5× STS (0–4)</label>
          <select class="inp" id="am-sppb-sts" onchange="_amSppbCalcTotal();saveAmData()">
            <option value="">—</option>
            <option value="0">0 — Incapaz o &gt;60 s</option>
            <option value="1">1 — &gt;16.7 s</option>
            <option value="2">2 — 13.7–16.6 s</option>
            <option value="3">3 — 11.2–13.6 s</option>
            <option value="4">4 — &lt;11.2 s</option>
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px;align-items:center">
        <div class="ig">
          <label class="il">Total SPPB (0–12)</label>
          <input class="inp inp-mono" type="number" min="0" max="12" id="am-sppb-total"
            placeholder="—" oninput="_amSppbUpdate();saveAmData()" style="font-size:18px;font-weight:700;text-align:center">
        </div>
        <div id="am-sppb-result"></div>
      </div>
      <div style="margin-top:8px;font-size:9px;color:var(--text3);line-height:1.4">
        10–12 = normal · 7–9 = fragilidad leve-moderada · &lt;7 = fragilidad severa / alto riesgo —
        Cambio de 1 punto tiene significado clínico — Wanden-Berghe 2021
      </div>
    </div>
  </div>

  <div style="text-align:right;margin-top:4px">
    <button class="btn btn-neon btn-sm" onclick="saveAmData();showSaveToast()">💾 Guardar evaluación</button>
  </div>`;
}

function _amTugUpdate() {
  const v = +document.getElementById('am-tug-seg')?.value;
  const edadSel = document.getElementById('am-tug-edad')?.value;
  const res = document.getElementById('am-tug-result'); if (!res) return;
  if (!v) { res.innerHTML = ''; return; }
  const s = AM_TUG.semaforo(v);
  const label = AM_TUG.semaforo_label(v);
  let refStr = '';
  if (edadSel === '60') refStr = `Referencia 60–69 años: 8.1 s (IC 7.1–9.0)`;
  else if (edadSel === '70') refStr = `Referencia 70–79 años: 9.2 s (IC 8.2–10.2)`;
  else if (edadSel === '80') refStr = `Referencia ≥80 años: 11.3 s (IC 10.0–12.7)`;
  res.innerHTML = `
    <div style="border:1px solid;border-radius:var(--r);padding:10px;${_amSemColorStyle(s)}">
      <div style="font-size:14px;font-weight:700">${_amSemEmoji(s)} ${label}</div>
      ${refStr ? `<div style="font-size:10px;margin-top:3px;opacity:.8">${refStr} — Dengiz 2025</div>` : ''}
    </div>`;
}
window._amTugUpdate = _amTugUpdate;

function _amGaitCalc() {
  const t = +document.getElementById('am-gait-time')?.value;
  if (!t) return;
  const speed = +(4 / t).toFixed(2);
  const el = document.getElementById('am-gait-speed');
  if (el) { el.value = speed; _amGaitUpdate(); }
}
window._amGaitCalc = _amGaitCalc;

function _amGaitUpdate() {
  const v = +document.getElementById('am-gait-speed')?.value;
  const res = document.getElementById('am-gait-result'); if (!res) return;
  if (!v) { res.innerHTML = ''; return; }
  const s = AM_GAIT.semaforo(v);
  const label = AM_GAIT.semaforo_label(v);
  res.innerHTML = `<div style="border:1px solid;border-radius:var(--r);padding:8px;font-size:12px;font-weight:700;${_amSemColorStyle(s)}">${_amSemEmoji(s)} ${label}</div>`;
}
window._amGaitUpdate = _amGaitUpdate;

function _amSppbCalcTotal() {
  const e = document.getElementById('am-sppb-equil')?.value;
  const m = document.getElementById('am-sppb-marcha')?.value;
  const s = document.getElementById('am-sppb-sts')?.value;
  if (e === '' || m === '' || s === '' || e === undefined) return;
  const total = +e + +m + +s;
  const el = document.getElementById('am-sppb-total');
  if (el) { el.value = total; _amSppbUpdate(); }
}
window._amSppbCalcTotal = _amSppbCalcTotal;

function _amSppbUpdate() {
  const v = document.getElementById('am-sppb-total')?.value;
  const res = document.getElementById('am-sppb-result'); if (!res) return;
  if (v === '' || v === null || v === undefined) { res.innerHTML = ''; return; }
  const s = AM_SPPB.semaforo(v);
  const label = AM_SPPB.semaforo_label(v);
  res.innerHTML = `<div style="border:1px solid;border-radius:var(--r);padding:10px;${_amSemColorStyle(s)}"><div style="font-size:14px;font-weight:700">${_amSemEmoji(s)} ${label}</div></div>`;
}
window._amSppbUpdate = _amSppbUpdate;

// ═══════════════════════════════════════════════════════════════
// TAB 2: BALANCE — Berg Balance Scale
// ═══════════════════════════════════════════════════════════════
function buildAmBalance() {
  const c = document.getElementById('amtab-balance');
  if (!c || c.dataset.built) return;
  c.dataset.built = '1';

  const itemsHtml = AM_BERG.items.map((item, i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:11px;flex:1;color:var(--text)">${i+1}. ${item}</span>
      <select class="inp" id="am-berg-item-${i}" style="width:80px;font-size:11px"
        onchange="_amBergItemChange(${i},this.value);saveAmData()">
        <option value="">—</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>`).join('');

  c.innerHTML = `
  <div class="card mb-12">
    <div class="card-header">
      <h3>⚖️ Berg Balance Scale (BBS)</h3>
      <span class="tag tag-b">Park 2017 · Dengiz 2025</span>
    </div>
    <div class="card-body">
      <div style="font-size:11px;color:var(--text2);margin-bottom:10px;line-height:1.5">
        <strong>Protocolo:</strong> ${AM_BERG.protocolo}
        Puntaje 0–4 por ítem (4 = completamente independiente). Total máx: 56 pts.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;align-items:center">
        <div class="ig">
          <label class="il" style="font-size:13px;font-weight:700">TOTAL BBS (0–56)</label>
          <input class="inp inp-mono" type="number" min="0" max="56" id="am-berg-total"
            placeholder="—" oninput="_amBergUpdate();saveAmData()"
            style="font-size:24px;font-weight:700;text-align:center">
          <div style="font-size:9px;color:var(--text3);margin-top:2px">Ingrese total directo O use los ítems abajo</div>
        </div>
        <div id="am-berg-result"></div>
      </div>
      <div style="max-height:360px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r);padding:8px">
        <div style="font-size:10px;font-weight:700;color:var(--text3);margin-bottom:4px">
          ÍTEMS INDIVIDUALES (0=incapaz · 4=independiente) — cálculo automático del total
        </div>
        ${itemsHtml}
      </div>
      <div style="margin-top:8px;font-size:9px;color:var(--text3);line-height:1.4">
        0–20 = balance alterado · 21–40 = aceptable · 41–56 = bueno —
        AUC 0.97 (Park 2017, meta-análisis N=570, Sn 0.73, Sp 0.90)
      </div>
    </div>
  </div>
  <div style="text-align:right">
    <button class="btn btn-neon btn-sm" onclick="saveAmData();showSaveToast()">💾 Guardar</button>
  </div>`;
}

function _amBergItemChange(i, val) {
  amState.bergItems[i] = val === '' ? null : +val;
  _amBergCalcTotal();
}
window._amBergItemChange = _amBergItemChange;

function _amBergCalcTotal() {
  const valid = amState.bergItems.filter(v => v !== null);
  if (valid.length === 0) return;
  const total = amState.bergItems.reduce((s, v) => s + (v || 0), 0);
  const el = document.getElementById('am-berg-total');
  if (el) { el.value = total; _amBergUpdate(); }
}

function _amBergUpdate() {
  const v = document.getElementById('am-berg-total')?.value;
  const res = document.getElementById('am-berg-result'); if (!res) return;
  if (v === '' || v === null || v === undefined) { res.innerHTML = ''; return; }
  const s = AM_BERG.semaforo(v);
  const label = AM_BERG.semaforo_label(v);
  res.innerHTML = `
    <div style="border:1px solid;border-radius:var(--r);padding:12px;${_amSemColorStyle(s)}">
      <div style="font-size:15px;font-weight:700">${_amSemEmoji(s)} ${label}</div>
    </div>`;
}
window._amBergUpdate = _amBergUpdate;

// ═══════════════════════════════════════════════════════════════
// TAB 3: COGNITIVO (AD-8 + Mini-Cog + CDT)
// ═══════════════════════════════════════════════════════════════
function buildAmCognitivo() {
  const c = document.getElementById('amtab-cognitivo');
  if (!c || c.dataset.built) return;
  c.dataset.built = '1';

  // AD-8 items
  const ad8Html = AM_AD8.items.map((item, i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12px;flex:1">${i+1}. ${item}</span>
      <select class="inp" id="am-ad8-${i}" style="width:100px;font-size:11px"
        onchange="_amAd8Change(${i},this.value);saveAmData()">
        <option value="">—</option>
        <option value="1">Sí (cambio)</option>
        <option value="0">No / No sé</option>
      </select>
    </div>`).join('');

  c.innerHTML = `
  <!-- ── AD-8 ── -->
  <div class="card mb-12">
    <div class="card-header">
      <h3>🧠 AD-8 — Entrevista de Detección de Demencia</h3>
      <span class="tag tag-r">Usarel 2019</span>
    </div>
    <div class="card-body">
      <div style="font-size:11px;color:var(--text2);margin-bottom:10px;line-height:1.5">
        <strong>Administrador:</strong> Informante (cuidador/familiar). ~3 min.
        Pregunta: <em>"¿Ha notado un cambio en las siguientes áreas en los últimos meses/años?"</em>
        Puntaje 1 = Sí (hay cambio) · 0 = No / No sé.
      </div>
      <div style="margin-bottom:12px">
        ${ad8Html}
      </div>
      <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px;align-items:center">
        <div class="ig">
          <label class="il" style="font-size:13px;font-weight:700">Total AD-8 (0–8)</label>
          <div id="am-ad8-total-display" style="font-size:28px;font-weight:700;font-family:var(--mono);text-align:center;padding:8px;border:1px solid var(--border);border-radius:var(--r)">—</div>
        </div>
        <div id="am-ad8-result"></div>
      </div>
      <div style="margin-top:8px;font-size:9px;color:var(--text3);line-height:1.4">
        0–2 = normal · 3–4 = DCL sospechado (Sn 81.7%, Sp 93.6%) · ≥5 = demencia probable (Sn 100%, Sp 96.3%) —
        AUC demencia 0.999 · α Cronbach 0.928 — Usarel 2019, N=334
      </div>
    </div>
  </div>

  <!-- ── MINI-COG ── -->
  <div class="card mb-12">
    <div class="card-header">
      <h3>🔢 Mini-Cog</h3>
      <span class="tag tag-b">Borson 2000 (ref. en Usarel 2019)</span>
    </div>
    <div class="card-body">
      <div style="font-size:11px;color:var(--text2);margin-bottom:12px;line-height:1.5">
        <strong>Protocolo:</strong>
        (1) Decir 3 palabras sin repetición: <em>"Ahora le voy a decir 3 palabras. Repítalas ahora."</em>
        (2) Test del Reloj (ver abajo).
        (3) Repetir las 3 palabras: <em>"¿Recuerda las 3 palabras que le dije?"</em>
      </div>

      <div style="background:rgba(57,255,122,.05);border:1px solid var(--neon);border-radius:var(--r);padding:10px;margin-bottom:12px">
        <div style="font-size:11px;font-weight:700;color:var(--neon);margin-bottom:4px">Palabras ejemplo (o use las del kit):</div>
        <div style="font-size:14px;font-family:var(--mono)">manzana &nbsp;·&nbsp; centavo &nbsp;·&nbsp; mesa</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div class="ig">
          <label class="il">Palabras recordadas (0–3)</label>
          <input class="inp inp-mono" type="number" min="0" max="3" id="am-mc-palabras"
            placeholder="0–3" oninput="_amMiniCogCalc();saveAmData()" style="text-align:center;font-size:18px">
        </div>
        <div class="ig">
          <label class="il">Test del Reloj</label>
          <div style="display:flex;gap:8px;margin-top:4px">
            <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
              <input type="radio" name="am-mc-reloj" id="am-mc-reloj-2" value="2" onchange="_amMiniCogReloj(2);saveAmData()"> Normal (2 pts)
            </label>
            <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
              <input type="radio" name="am-mc-reloj" id="am-mc-reloj-0" value="0" onchange="_amMiniCogReloj(0);saveAmData()"> Anormal (0 pts)
            </label>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px;align-items:center">
        <div>
          <label class="il" style="font-size:12px;font-weight:700">Total Mini-Cog (0–5)</label>
          <div id="am-mc-total-display" style="font-size:28px;font-weight:700;font-family:var(--mono);text-align:center;padding:8px;border:1px solid var(--border);border-radius:var(--r)">—</div>
        </div>
        <div id="am-mc-result"></div>
      </div>
      <div style="margin-top:8px;font-size:9px;color:var(--text3)">
        ≤2 = screening positivo (Sn 0.76–0.99, Sp 0.89) · ≥3 = screening negativo
      </div>
    </div>
  </div>

  <!-- ── CDT ── -->
  <div class="card mb-12">
    <div class="card-header">
      <h3>🕐 CDT — Test del Dibujo del Reloj</h3>
      <span class="tag tag-y">Shulman 2000 (datos Usarel 2019)</span>
    </div>
    <div class="card-body">
      <div style="font-size:11px;color:var(--text2);margin-bottom:10px;line-height:1.5">
        <strong>Instrucción:</strong> "Dibuje un reloj con todas las horas y coloque las agujas marcando las 11 y 10 minutos."
      </div>
      <div style="display:grid;gap:6px;margin-bottom:12px">
        ${AM_CDT.escala.map(e => `
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px;border-radius:4px;border:1px solid var(--border);font-size:11px">
            <input type="radio" name="am-cdt-score" value="${e.pts}" onchange="_amCdtRadio(${e.pts});saveAmData()">
            <span style="font-family:var(--mono);font-weight:700;min-width:16px">${e.pts}</span>
            <span>${e.label}</span>
          </label>`).join('')}
      </div>
      <div id="am-cdt-result"></div>
      <div style="margin-top:8px;font-size:9px;color:var(--text3);line-height:1.4">
        Medias (Usarel 2019): Control=4.7 · DCL=4.1 · Demencia=1.2
      </div>
    </div>
  </div>

  <div style="text-align:right">
    <button class="btn btn-neon btn-sm" onclick="saveAmData();showSaveToast()">💾 Guardar</button>
  </div>`;
}

function _amAd8Change(i, val) {
  amState.ad8[i] = val === '' ? null : +val;
  _amAd8Calc();
}
window._amAd8Change = _amAd8Change;

function _amAd8Calc() {
  const valid = amState.ad8.filter(v => v !== null);
  if (valid.length === 0) {
    const disp = document.getElementById('am-ad8-total-display');
    if (disp) disp.textContent = '—';
    const res = document.getElementById('am-ad8-result');
    if (res) res.innerHTML = '';
    return;
  }
  const total = amState.ad8.reduce((s, v) => s + (v || 0), 0);
  const disp = document.getElementById('am-ad8-total-display');
  if (disp) disp.textContent = total;
  const s = AM_AD8.semaforo(total);
  const label = AM_AD8.semaforo_label(total);
  const res = document.getElementById('am-ad8-result');
  if (res) res.innerHTML = `<div style="border:1px solid;border-radius:var(--r);padding:12px;${_amSemColorStyle(s)}"><div style="font-size:14px;font-weight:700">${_amSemEmoji(s)} ${label}</div></div>`;
}
window._amAd8Calc = _amAd8Calc;

function _amMiniCogReloj(val) {
  amState.minicogReloj = val;
  _amMiniCogCalc();
}
window._amMiniCogReloj = _amMiniCogReloj;

function _amMiniCogCalc() {
  const pal = +document.getElementById('am-mc-palabras')?.value || 0;
  amState.minicogPalabras = pal;
  const rel = amState.minicogReloj;
  if (rel === null) return;
  const total = pal + rel;
  const disp = document.getElementById('am-mc-total-display');
  if (disp) disp.textContent = total;
  const s = AM_MINICOG.semaforo(total);
  const label = AM_MINICOG.semaforo_label(total);
  const res = document.getElementById('am-mc-result');
  if (res) res.innerHTML = `<div style="border:1px solid;border-radius:var(--r);padding:12px;${_amSemColorStyle(s)}"><div style="font-size:14px;font-weight:700">${_amSemEmoji(s)} ${label}</div></div>`;
}
window._amMiniCogCalc = _amMiniCogCalc;

function _amCdtRadio(pts) {
  amState.cdtScore = pts;
  _amCdtUpdate();
}
window._amCdtRadio = _amCdtRadio;

function _amCdtUpdate() {
  const v = amState.cdtScore;
  if (v === null || v === undefined) return;
  const el = document.getElementById('am-cdt-score');
  if (el) el.value = v;
  const s = AM_CDT.semaforo(v);
  const label = AM_CDT.semaforo_label(v);
  const res = document.getElementById('am-cdt-result');
  if (res) res.innerHTML = `<div style="border:1px solid;border-radius:var(--r);padding:10px;${_amSemColorStyle(s)}"><div style="font-size:13px;font-weight:700">${_amSemEmoji(s)} ${label}</div></div>`;
}
window._amCdtUpdate = _amCdtUpdate;

// ═══════════════════════════════════════════════════════════════
// TAB 4: AFECTIVO — GDS-15
// ═══════════════════════════════════════════════════════════════
function buildAmAfectivo() {
  const c = document.getElementById('amtab-afectivo');
  if (!c || c.dataset.built) return;
  c.dataset.built = '1';

  const gdsHtml = AM_GDS15.items.map(([q, patol], i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:11px;flex:1">${i+1}. ${q}</span>
      <select class="inp" id="am-gds-${i}" style="width:90px;font-size:11px"
        onchange="_amGdsChange(${i},this.value,'${patol}');saveAmData()">
        <option value="">—</option>
        <option value="si">Sí</option>
        <option value="no">No</option>
      </select>
    </div>`).join('');

  c.innerHTML = `
  <div class="card mb-12">
    <div class="card-header">
      <h3>😔 GDS-15 — Escala de Depresión Geriátrica</h3>
      <span class="tag tag-b">Yesavage · Wanden-Berghe 2021</span>
    </div>
    <div class="card-body">
      <div style="font-size:11px;color:var(--text2);margin-bottom:10px;line-height:1.5">
        Versión corta 15 ítems. Respuestas Sí/No. ~5 minutos. Administrado al paciente.
      </div>
      <div style="margin-bottom:12px">${gdsHtml}</div>
      <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px;align-items:center">
        <div>
          <label class="il" style="font-size:13px;font-weight:700">Total GDS-15 (0–15)</label>
          <div id="am-gds-total-display" style="font-size:28px;font-weight:700;font-family:var(--mono);text-align:center;padding:8px;border:1px solid var(--border);border-radius:var(--r)">—</div>
        </div>
        <div id="am-gds-result"></div>
      </div>
      <div style="margin-top:8px;font-size:9px;color:var(--text3);line-height:1.4">
        0–5 = normal · 6–9 = probable depresión · ≥10 = depresión — Wanden-Berghe 2021
      </div>
    </div>
  </div>
  <div style="text-align:right">
    <button class="btn btn-neon btn-sm" onclick="saveAmData();showSaveToast()">💾 Guardar</button>
  </div>`;
}

function _amGdsChange(i, val, patol) {
  amState.gds[i] = (val === patol) ? 1 : (val === '' ? null : 0);
  _amGdsCalc();
}
window._amGdsChange = _amGdsChange;

function _amGdsCalc() {
  const valid = amState.gds.filter(v => v !== null);
  if (valid.length === 0) {
    const d = document.getElementById('am-gds-total-display'); if (d) d.textContent = '—';
    const r = document.getElementById('am-gds-result'); if (r) r.innerHTML = '';
    return;
  }
  const total = amState.gds.reduce((s, v) => s + (v || 0), 0);
  const d = document.getElementById('am-gds-total-display'); if (d) d.textContent = total;
  const s = AM_GDS15.semaforo(total);
  const label = AM_GDS15.semaforo_label(total);
  const res = document.getElementById('am-gds-result');
  if (res) res.innerHTML = `<div style="border:1px solid;border-radius:var(--r);padding:12px;${_amSemColorStyle(s)}"><div style="font-size:14px;font-weight:700">${_amSemEmoji(s)} ${label}</div></div>`;
}
window._amGdsCalc = _amGdsCalc;

// ═══════════════════════════════════════════════════════════════
// TAB 5: SEMÁFORO GLOBAL
// ═══════════════════════════════════════════════════════════════
function renderAmSemaforo() {
  const c = document.getElementById('amtab-semaforo'); if (!c) return;

  const d = cur?.am || {};

  // Gather values
  const tugV    = d.tug;
  const gaitV   = d.gaitSpeed;
  const sppbV   = d.sppbTotal;
  const bergV   = d.bergTotal;
  const ad8V    = (amState.ad8.some(v => v !== null)) ? amState.ad8.reduce((s,v)=>s+(v||0),0) : null;
  const mcV     = (amState.minicogPalabras !== undefined && amState.minicogReloj !== null)
                  ? amState.minicogPalabras + (amState.minicogReloj || 0) : null;
  const cdtV    = amState.cdtScore;
  const gdsV    = (amState.gds.some(v => v !== null)) ? amState.gds.reduce((s,v)=>s+(v||0),0) : null;

  const semaforos = {
    tug:   AM_TUG.semaforo(tugV),
    gait:  AM_GAIT.semaforo(gaitV),
    sppb:  AM_SPPB.semaforo(sppbV),
    berg:  AM_BERG.semaforo(bergV),
    ad8:   AM_AD8.semaforo(ad8V),
    mc:    AM_MINICOG.semaforo(mcV),
    cdt:   AM_CDT.semaforo(cdtV),
    gds:   AM_GDS15.semaforo(gdsV),
  };

  const global = calcAmRiesgoGlobal(semaforos);

  const rows = [
    { key:'tug',  label:'TUG',              val: tugV   ? `${tugV} s`      : '—', sem: semaforos.tug,  lbl: AM_TUG.semaforo_label(tugV) },
    { key:'gait', label:'Velocidad marcha',  val: gaitV  ? `${gaitV} m/s`  : '—', sem: semaforos.gait, lbl: AM_GAIT.semaforo_label(gaitV) },
    { key:'sppb', label:'SPPB',             val: sppbV !== null && sppbV !== undefined ? `${sppbV}/12` : '—', sem: semaforos.sppb, lbl: AM_SPPB.semaforo_label(sppbV) },
    { key:'berg', label:'Berg Balance',      val: bergV !== null && bergV !== undefined ? `${bergV}/56` : '—', sem: semaforos.berg, lbl: AM_BERG.semaforo_label(bergV) },
    { key:'ad8',  label:'AD-8',             val: ad8V !== null ? `${ad8V}/8`  : '—', sem: semaforos.ad8,  lbl: AM_AD8.semaforo_label(ad8V) },
    { key:'mc',   label:'Mini-Cog',         val: mcV  !== null ? `${mcV}/5`   : '—', sem: semaforos.mc,   lbl: AM_MINICOG.semaforo_label(mcV) },
    { key:'cdt',  label:'Test del Reloj',   val: cdtV !== null ? `${cdtV}/5`  : '—', sem: semaforos.cdt,  lbl: AM_CDT.semaforo_label(cdtV) },
    { key:'gds',  label:'GDS-15 Depresión', val: gdsV !== null ? `${gdsV}/15` : '—', sem: semaforos.gds,  lbl: AM_GDS15.semaforo_label(gdsV) },
  ];

  const rowsHtml = rows.map(r => {
    const style = _amSemColorStyle(r.sem);
    return `
      <div style="display:grid;grid-template-columns:140px 80px 1fr;gap:10px;align-items:center;padding:8px;border-bottom:1px solid var(--border)">
        <span style="font-size:12px;font-weight:600">${r.label}</span>
        <span style="font-family:var(--mono);font-size:13px;font-weight:700;text-align:center">${r.val}</span>
        <div style="border:1px solid;border-radius:4px;padding:5px 8px;font-size:11px;${style}">${_amSemEmoji(r.sem)} ${r.lbl}</div>
      </div>`;
  }).join('');

  c.innerHTML = `
  <!-- GLOBAL RISK -->
  <div style="border:2px solid;border-radius:var(--r);padding:16px;margin-bottom:16px;text-align:center;${_amSemColorStyle(global.nivel)}">
    <div style="font-size:20px;font-weight:700;margin-bottom:4px">${global.label}</div>
    <div style="font-size:12px;opacity:.85">${global.descripcion}</div>
    <div style="font-size:10px;margin-top:6px;opacity:.7">${global.total} dominios evaluados</div>
  </div>

  <!-- TABLE -->
  <div class="card mb-12">
    <div class="card-header"><h3>Resumen por dominio</h3></div>
    <div class="card-body" style="padding:0">
      <div style="display:grid;grid-template-columns:140px 80px 1fr;gap:10px;padding:8px;background:var(--bg3);font-size:10px;font-weight:700;color:var(--text3);border-bottom:1px solid var(--border)">
        <span>TEST</span><span style="text-align:center">RESULTADO</span><span>INTERPRETACIÓN</span>
      </div>
      ${rowsHtml}
    </div>
  </div>

  <!-- DOMAINS -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
    <div class="card">
      <div class="card-header"><h3>🏃 Funcional / Balance</h3></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:6px">
          ${['tug','gait','sppb','berg'].map(k => {
            const r = rows.find(x => x.key===k);
            return `<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px">
              <span>${r.label}</span>
              <span style="border:1px solid;border-radius:3px;padding:2px 6px;font-size:10px;font-weight:700;${_amSemColorStyle(r.sem)}">${_amSemEmoji(r.sem)} ${r.val}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>🧠 Cognitivo / Afectivo</h3></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:6px">
          ${['ad8','mc','cdt','gds'].map(k => {
            const r = rows.find(x => x.key===k);
            return `<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px">
              <span>${r.label}</span>
              <span style="border:1px solid;border-radius:3px;padding:2px 6px;font-size:10px;font-weight:700;${_amSemColorStyle(r.sem)}">${_amSemEmoji(r.sem)} ${r.val}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>

  <div style="font-size:9px;color:var(--text3);text-align:center;padding-top:8px;border-top:1px solid var(--border)">
    Algoritmo basado en 6 publicaciones científicas (Barry 2014, Cheong 2021, Dengiz 2025, Park 2017, Usarel 2019, Wanden-Berghe 2021) ·
    No reemplaza el juicio clínico · 🟢 &lt;9s TUG, ≥1.0 m/s marcha, ≥10 SPPB, ≥41 Berg, AD-8 ≤2, Mini-Cog ≥3, CDT ≥4, GDS ≤5
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
// TAB 6: INFORME
// ═══════════════════════════════════════════════════════════════
function renderAmInforme() {
  const c = document.getElementById('amtab-informe'); if (!c) return;

  const d = cur?.am || {};
  const nombre = cur ? `${cur.nombre || ''} ${cur.apellido || ''}`.trim() : '—';
  const fecha  = d.fecha || new Date().toISOString().split('T')[0];

  const ad8Total  = amState.ad8.some(v=>v!==null) ? amState.ad8.reduce((s,v)=>s+(v||0),0) : null;
  const mcTotal   = (amState.minicogReloj!==null && amState.minicogPalabras!==undefined)
                    ? amState.minicogPalabras + (amState.minicogReloj||0) : null;
  const gdsTotal  = amState.gds.some(v=>v!==null) ? amState.gds.reduce((s,v)=>s+(v||0),0) : null;

  const hallazgos = [
    { test:'TUG',              val: d.tug      ? `${d.tug} s`          : '—', sem: AM_TUG.semaforo(d.tug),    lbl: AM_TUG.semaforo_label(d.tug),    ref:'Barry 2014 · Cheong 2021' },
    { test:'Velocidad marcha', val: d.gaitSpeed ? `${d.gaitSpeed} m/s` : '—', sem: AM_GAIT.semaforo(d.gaitSpeed), lbl: AM_GAIT.semaforo_label(d.gaitSpeed), ref:'Cheong 2021' },
    { test:'SPPB',            val: d.sppbTotal!==null&&d.sppbTotal!==undefined ? `${d.sppbTotal}/12` : '—', sem: AM_SPPB.semaforo(d.sppbTotal), lbl: AM_SPPB.semaforo_label(d.sppbTotal), ref:'Wanden-Berghe 2021' },
    { test:'Berg Balance',    val: d.bergTotal!==null&&d.bergTotal!==undefined ? `${d.bergTotal}/56` : '—', sem: AM_BERG.semaforo(d.bergTotal), lbl: AM_BERG.semaforo_label(d.bergTotal), ref:'Park 2017 · Dengiz 2025' },
    { test:'AD-8',            val: ad8Total!==null ? `${ad8Total}/8`  : '—', sem: AM_AD8.semaforo(ad8Total), lbl: AM_AD8.semaforo_label(ad8Total), ref:'Usarel 2019' },
    { test:'Mini-Cog',        val: mcTotal!==null  ? `${mcTotal}/5`   : '—', sem: AM_MINICOG.semaforo(mcTotal), lbl: AM_MINICOG.semaforo_label(mcTotal), ref:'Borson 2000' },
    { test:'CDT (Reloj)',     val: amState.cdtScore!==null ? `${amState.cdtScore}/5` : '—', sem: AM_CDT.semaforo(amState.cdtScore), lbl: AM_CDT.semaforo_label(amState.cdtScore), ref:'Shulman 2000 / Usarel 2019' },
    { test:'GDS-15',          val: gdsTotal!==null ? `${gdsTotal}/15` : '—', sem: AM_GDS15.semaforo(gdsTotal), lbl: AM_GDS15.semaforo_label(gdsTotal), ref:'Yesavage / Wanden-Berghe 2021' },
  ];

  const semaforos = Object.fromEntries(hallazgos.map(h => [h.test, h.sem]));
  const global = calcAmRiesgoGlobal(semaforos);

  // Recommendations by risk level
  const rojos = hallazgos.filter(h => h.sem === 'rojo');
  const amarillos = hallazgos.filter(h => h.sem === 'amarillo');
  let recomHtml = '';
  if (rojos.length > 0) {
    recomHtml += `<div style="margin-bottom:8px"><strong style="color:var(--red)">🔴 Dominios críticos (requieren acción inmediata):</strong><ul style="margin:4px 0 0 16px;font-size:11px;line-height:1.7">
      ${rojos.map(h => `<li><strong>${h.test}:</strong> ${h.lbl}</li>`).join('')}</ul></div>`;
  }
  if (amarillos.length > 0) {
    recomHtml += `<div style="margin-bottom:8px"><strong style="color:var(--amber)">🟡 Dominios de atención (seguimiento activo):</strong><ul style="margin:4px 0 0 16px;font-size:11px;line-height:1.7">
      ${amarillos.map(h => `<li><strong>${h.test}:</strong> ${h.lbl}</li>`).join('')}</ul></div>`;
  }
  if (rojos.length === 0 && amarillos.length === 0) {
    recomHtml = `<div style="color:var(--neon);font-size:12px">🟢 Todos los dominios evaluados dentro de rangos normales según los puntos de corte basados en evidencia.</div>`;
  }

  c.innerHTML = `
  <div class="card" style="margin-bottom:16px">
    <div class="card-header" style="background:rgba(57,255,122,.06)">
      <h3 style="display:flex;align-items:center;gap:8px">
        <span>📋</span> Informe de Evaluación Funcional y Cognitiva — Adulto Mayor
      </h3>
      <button class="btn btn-ghost btn-sm" onclick="window.print()">🖨️ Imprimir</button>
    </div>
    <div class="card-body" id="am-informe-body">

      <!-- HEADER -->
      <div style="border-bottom:2px solid var(--neon);padding-bottom:12px;margin-bottom:16px">
        <div style="font-size:16px;font-weight:700">${nombre || 'Paciente'}</div>
        <div style="font-size:11px;color:var(--text2);margin-top:2px">
          Fecha evaluación: ${fecha} &nbsp;·&nbsp;
          ${cur?.edad ? `Edad: ${cur.edad} años` : ''} &nbsp;·&nbsp;
          Evaluador: ${cur?.kine || '—'}
        </div>
      </div>

      <!-- RIESGO GLOBAL -->
      <div style="border:2px solid;border-radius:var(--r);padding:14px;margin-bottom:16px;${_amSemColorStyle(global.nivel)}">
        <div style="font-size:16px;font-weight:700;margin-bottom:4px">${global.label}</div>
        <div style="font-size:12px;opacity:.85">${global.descripcion}</div>
      </div>

      <!-- TABLA HALLAZGOS -->
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--text)">1. Hallazgos por dominio</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:16px">
        <thead>
          <tr style="background:var(--bg3);font-size:10px;color:var(--text3)">
            <th style="text-align:left;padding:6px 8px;border:1px solid var(--border)">Test</th>
            <th style="text-align:center;padding:6px 8px;border:1px solid var(--border)">Resultado</th>
            <th style="text-align:left;padding:6px 8px;border:1px solid var(--border)">Interpretación</th>
            <th style="text-align:left;padding:6px 8px;border:1px solid var(--border)">Referencia</th>
          </tr>
        </thead>
        <tbody>
          ${hallazgos.map(h => `
            <tr>
              <td style="padding:6px 8px;border:1px solid var(--border);font-weight:600">${h.test}</td>
              <td style="padding:6px 8px;border:1px solid var(--border);text-align:center;font-family:var(--mono);font-weight:700">${h.val}</td>
              <td style="padding:6px 8px;border:1px solid var(--border)">${_amSemEmoji(h.sem)} ${h.lbl}</td>
              <td style="padding:6px 8px;border:1px solid var(--border);color:var(--text3);font-size:9px">${h.ref}</td>
            </tr>`).join('')}
        </tbody>
      </table>

      <!-- RECOMENDACIONES -->
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--text)">2. Hallazgos clínicos relevantes</div>
      <div style="border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:16px;font-size:11px">
        ${recomHtml}
      </div>

      <!-- INTERVENCIÓN -->
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--text)">3. Intervención sugerida (según evidencia)</div>
      <div style="border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:16px;font-size:11px;line-height:1.7">
        ${global.nivel === 'rojo' ? `
          <div style="color:var(--red);font-weight:700;margin-bottom:6px">⚠️ PRIORIDAD ALTA:</div>
          <ul style="margin:0 0 0 16px">
            <li>Derivar a valoración geriátrica multidisciplinar</li>
            <li>Evaluación de riesgo de caída con intervención domiciliaria</li>
            <li>Revisión de polifarmacia y psicotrópicos</li>
            ${rojos.some(h=>['AD-8','Mini-Cog','CDT (Reloj)'].includes(h.test)) ? '<li>Derivación neurológica / psicogeriatría para evaluación cognitiva formal</li>' : ''}
            ${rojos.some(h=>['GDS-15'].includes(h.test)) ? '<li>Evaluación psiquiátrica / tratamiento antidepresivo según criterio médico</li>' : ''}
            <li>Programa de ejercicio multicomponente supervisado (fuerza + equilibrio + aeróbico)</li>
          </ul>` :
          global.nivel === 'amarillo' ? `
          <div style="color:var(--amber);font-weight:700;margin-bottom:6px">⚡ ACCIÓN PREVENTIVA:</div>
          <ul style="margin:0 0 0 16px">
            <li>Programa de ejercicio multicomponente (Otago / Fall Prevention Exercise)</li>
            <li>Evaluación ambiental domiciliaria de riesgos de caída</li>
            <li>Seguimiento en 3–6 meses con re-evaluación</li>
            ${amarillos.some(h=>['AD-8','Mini-Cog'].includes(h.test)) ? '<li>Monitorización cognitiva periódica — Mini-Cog en próxima visita</li>' : ''}
          </ul>` : `
          <div style="color:var(--neon);font-weight:700;margin-bottom:6px">✅ MANTENIMIENTO:</div>
          <ul style="margin:0 0 0 16px">
            <li>Continuar con actividad física regular (≥150 min/semana intensidad moderada)</li>
            <li>Re-evaluación anual o ante cualquier cambio funcional significativo</li>
          </ul>`}
      </div>

      <!-- REFERENCIAS -->
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--text)">4. Bibliografía</div>
      <div style="font-size:9px;color:var(--text3);line-height:1.8;border-top:1px solid var(--border);padding-top:8px">
        <div>• ${AM_REFS.barry2014}</div>
        <div>• ${AM_REFS.cheong2021}</div>
        <div>• ${AM_REFS.dengiz2025}</div>
        <div>• ${AM_REFS.park2017}</div>
        <div>• ${AM_REFS.usarel2019}</div>
        <div>• ${AM_REFS.wanden2021}</div>
      </div>

      <div style="font-size:9px;color:var(--text3);text-align:center;margin-top:12px;padding-top:8px;border-top:1px solid var(--border)">
        Informe generado por MoveMetrics v12 · Valores 100% basados en evidencia científica ·
        Este informe no reemplaza el juicio clínico del profesional tratante.
      </div>
    </div>
  </div>`;
}

window.renderAmSemaforo = renderAmSemaforo;
window.renderAmInforme  = renderAmInforme;

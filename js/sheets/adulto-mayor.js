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
// TAB 6: INFORME — Dashboard infográfico profesional
// ═══════════════════════════════════════════════════════════════
function renderAmInforme() {
  const c = document.getElementById('amtab-informe'); if (!c) return;

  const d      = cur?.am || {};
  const nombre = cur ? `${cur.nombre || ''} ${cur.apellido || ''}`.trim() : '—';
  const fecha  = d.fecha || new Date().toISOString().split('T')[0];
  const [yy, mm, dd] = fecha.split('-');
  const fechaFmt = dd && mm && yy ? `${dd} / ${mm} / ${yy}` : fecha;

  const ad8Total = amState.ad8.some(v=>v!==null) ? amState.ad8.reduce((s,v)=>s+(v||0),0) : null;
  const mcTotal  = (amState.minicogReloj!==null && amState.minicogPalabras!==undefined)
                   ? amState.minicogPalabras + (amState.minicogReloj||0) : null;
  const gdsTotal = amState.gds.some(v=>v!==null) ? amState.gds.reduce((s,v)=>s+(v||0),0) : null;
  const cdtV     = amState.cdtScore;

  const hallazgos = [
    { test:'TUG',             icon:'⏱', cat:'func', val: d.tug       ? `${d.tug} s`          : '—', rawVal: d.tug,       max:30,  unit:'s',   sem: AM_TUG.semaforo(d.tug),    lbl: AM_TUG.semaforo_label(d.tug),    ref:'Barry 2014 · Cheong 2021',        cut:'<9s ✓ · 9–13.4s ⚠ · ≥13.5s ✗' },
    { test:'Vel. Marcha',     icon:'🚶', cat:'func', val: d.gaitSpeed ? `${d.gaitSpeed} m/s`  : '—', rawVal: d.gaitSpeed, max:2,   unit:'m/s', sem: AM_GAIT.semaforo(d.gaitSpeed), lbl: AM_GAIT.semaforo_label(d.gaitSpeed), ref:'Cheong 2021',              cut:'≥1.0 m/s ✓ · 0.8–0.99 ⚠ · <0.8 ✗' },
    { test:'SPPB',            icon:'📊', cat:'func', val: d.sppbTotal!=null ? `${d.sppbTotal}/12` : '—', rawVal: d.sppbTotal, max:12, unit:'/12', sem: AM_SPPB.semaforo(d.sppbTotal), lbl: AM_SPPB.semaforo_label(d.sppbTotal), ref:'Wanden-Berghe 2021',   cut:'10–12 ✓ · 7–9 ⚠ · <7 ✗' },
    { test:'Berg Balance',    icon:'⚖',  cat:'func', val: d.bergTotal!=null ? `${d.bergTotal}/56` : '—', rawVal: d.bergTotal, max:56, unit:'/56', sem: AM_BERG.semaforo(d.bergTotal), lbl: AM_BERG.semaforo_label(d.bergTotal), ref:'Park 2017 · Dengiz 2025', cut:'≥41 ✓ · 21–40 ⚠ · ≤20 ✗' },
    { test:'AD-8',            icon:'🧠', cat:'cog',  val: ad8Total!=null ? `${ad8Total}/8`   : '—', rawVal: ad8Total,    max:8,   unit:'/8',  sem: AM_AD8.semaforo(ad8Total),   lbl: AM_AD8.semaforo_label(ad8Total),   ref:'Usarel 2019',              cut:'≤2 ✓ · 3–4 ⚠ · ≥5 ✗' },
    { test:'Mini-Cog',        icon:'💡', cat:'cog',  val: mcTotal!=null  ? `${mcTotal}/5`    : '—', rawVal: mcTotal,     max:5,   unit:'/5',  sem: AM_MINICOG.semaforo(mcTotal), lbl: AM_MINICOG.semaforo_label(mcTotal), ref:'Borson 2000',             cut:'≥3 ✓ · ≤2 ✗' },
    { test:'Test del Reloj',  icon:'🕐', cat:'cog',  val: cdtV!=null     ? `${cdtV}/5`       : '—', rawVal: cdtV,        max:5,   unit:'/5',  sem: AM_CDT.semaforo(cdtV),       lbl: AM_CDT.semaforo_label(cdtV),       ref:'Shulman 2000 / Usarel 2019', cut:'≥4 ✓ · 3 ⚠ · 1–2 ✗' },
    { test:'GDS-15',          icon:'💬', cat:'afec', val: gdsTotal!=null ? `${gdsTotal}/15`  : '—', rawVal: gdsTotal,    max:15,  unit:'/15', sem: AM_GDS15.semaforo(gdsTotal), lbl: AM_GDS15.semaforo_label(gdsTotal), ref:'Yesavage / Wanden-Berghe 2021', cut:'≤5 ✓ · 6–9 ⚠ · ≥10 ✗' },
  ];

  const semObj = {};
  hallazgos.forEach(h => { semObj[h.test] = h.sem; });
  const global  = calcAmRiesgoGlobal(semObj);
  const rojos   = hallazgos.filter(h => h.sem === 'rojo');
  const amarillos = hallazgos.filter(h => h.sem === 'amarillo');
  const verdes  = hallazgos.filter(h => h.sem === 'verde');
  const totalEval = hallazgos.filter(h => h.rawVal != null).length;

  // ── helpers ──────────────────────────────────────────────────
  const COLORS = {
    verde:   { bg:'rgba(57,255,122,.12)',  border:'#39ff7a', text:'#39ff7a' },
    amarillo:{ bg:'rgba(255,190,0,.12)',   border:'#ffbe00', text:'#ffbe00' },
    rojo:    { bg:'rgba(255,70,70,.12)',   border:'#ff4646', text:'#ff4646' },
    none:    { bg:'rgba(255,255,255,.04)', border:'rgba(255,255,255,.15)', text:'rgba(255,255,255,.4)' },
  };
  const col = s => COLORS[s] || COLORS.none;

  // Badge inline
  const badge = (s, txt) => {
    const c2 = col(s);
    return `<span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;background:${c2.bg};border:1px solid ${c2.border};color:${c2.text}">${txt}</span>`;
  };

  // Section header (numbered, like THE MOVE CLUB PDF)
  const secHeader = (num, title) =>
    `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;margin-bottom:14px;background:rgba(255,255,255,.03);border-left:3px solid var(--neon);border-radius:0 6px 6px 0">
       <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:var(--neon);letter-spacing:.1em;opacity:.7">${num}</span>
       <span style="font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#fff">${title}</span>
     </div>`;

  // Visual progress bar
  const barHtml = (rawVal, max, sem, invertido) => {
    if (rawVal == null) return `<div style="height:6px;background:rgba(255,255,255,.07);border-radius:3px"></div>`;
    let pct = Math.min(100, Math.max(2, (parseFloat(rawVal) / max) * 100));
    if (invertido) pct = 100 - pct; // For TUG: lower is better, fill bar inversely
    const c2 = col(sem);
    return `<div style="height:6px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden">
      <div style="height:100%;width:${pct}%;background:${c2.border};border-radius:3px;transition:width .3s"></div>
    </div>`;
  };

  // Metric row (for tabular sections)
  const metricRow = (h, i) => {
    const c2 = col(h.sem);
    const bg = i % 2 === 0 ? 'rgba(255,255,255,.02)' : 'transparent';
    return `<tr style="background:${bg}">
      <td style="padding:8px 10px;font-size:11px;font-weight:600;color:rgba(255,255,255,.85);white-space:nowrap">${h.icon} ${h.test}</td>
      <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:13px;font-weight:800;color:#fff">${h.val}</td>
      <td style="padding:8px 10px">${barHtml(h.rawVal, h.max, h.sem, h.test==='TUG'||h.test==='AD-8'||h.test==='GDS-15')}</td>
      <td style="padding:8px 10px;white-space:nowrap">${badge(h.sem, h.lbl)}</td>
      <td style="padding:8px 10px;font-size:8px;color:rgba(255,255,255,.3)">${h.cut}</td>
    </tr>`;
  };

  // Intervention phases
  const phases = global.nivel === 'rojo' ? [
    { num:'FASE 1', title:'PRIORIDAD INMEDIATA', sub:'DERIVACIÓN Y SEGURIDAD', color:'#ff4646',
      items:['Derivación a valoración geriátrica multidisciplinar',
             'Evaluación domiciliaria de riesgos de caída y adaptaciones ambientales',
             'Revisión de polifarmacia y medicación psicotrópica',
             ...(rojos.some(h=>['AD-8','Mini-Cog','Test del Reloj'].includes(h.test)) ? ['Derivación neurológica / psicogeriatría para evaluación cognitiva formal (MoCA, MMSE)'] : []),
             ...(rojos.some(h=>h.test==='GDS-15') ? ['Evaluación psiquiátrica — considerar tratamiento antidepresivo según criterio médico'] : [])] },
    { num:'FASE 2', title:'PROGRAMA TERAPÉUTICO', sub:'EJERCICIO MULTICOMPONENTE SUPERVISADO', color:'#ffbe00',
      items:['Programa Otago u equivalente: fuerza + equilibrio + marcha (≥3×/sem)',
             'Entrenamiento de fuerza con énfasis en MMII: extensores de rodilla y tobillo',
             'Entrenamiento de equilibrio estático y dinámico (superficie inestable progresiva)',
             'Aeróbico de baja intensidad: caminata progresiva o bicicleta estática'] },
    { num:'FASE 3', title:'SEGUIMIENTO', sub:'RE-EVALUACIÓN A 3–6 MESES', color:'rgba(255,255,255,.4)',
      items:['Re-evaluación completa de batería geriátrica (TUG · SPPB · Berg)',
             'Monitorización cognitiva periódica si dominio cognitivo fue alterado',
             'Ajuste del programa según respuesta clínica y funcional'] },
  ] : global.nivel === 'amarillo' ? [
    { num:'FASE 1', title:'INTERVENCIÓN PREVENTIVA', sub:'EJERCICIO MULTICOMPONENTE', color:'#ffbe00',
      items:['Programa Otago o Fall Prevention Exercise (FPE) 3×/sem',
             'Entrenamiento de fuerza funcional: sentadilla, bipedestación unipodal, escalones',
             'Evaluación ambiental domiciliaria: eliminación de obstáculos, iluminación, barandas',
             ...(amarillos.some(h=>['AD-8','Mini-Cog'].includes(h.test)) ? ['Monitorización cognitiva — repetir Mini-Cog en 6 meses'] : [])] },
    { num:'FASE 2', title:'SEGUIMIENTO', sub:'RE-EVALUACIÓN A 6 MESES', color:'rgba(255,255,255,.4)',
      items:['Re-evaluación de TUG y velocidad de marcha',
             'Actualizar dominio cognitivo y afectivo si valores límite',
             'Ajuste progresivo de intensidad de ejercicio (FITT)'] },
  ] : [
    { num:'FASE 1', title:'MANTENIMIENTO', sub:'ACTIVIDAD FÍSICA REGULAR', color:'#39ff7a',
      items:['Continuar con actividad física ≥150 min/semana a intensidad moderada (OMS)',
             'Incluir ejercicios de fuerza ≥2×/sem y equilibrio como prevención primaria',
             'Dieta equilibrada con aporte proteico adecuado (≥1.2 g/kg/día en adulto mayor)'] },
    { num:'FASE 2', title:'SEGUIMIENTO ANUAL', sub:'RE-EVALUACIÓN PREVENTIVA', color:'rgba(255,255,255,.4)',
      items:['Re-evaluación completa anual o ante cualquier cambio funcional significativo',
             'Control de factores de riesgo cardiovascular y metabólico',
             'Revisión de visión, audición y calzado como factores de caída'] },
  ];

  // Global risk colors
  const gc = col(global.nivel);

  c.innerHTML = `
  <div style="font-family:'Segoe UI',system-ui,sans-serif;color:#fff;max-width:860px;margin:0 auto">

    <!-- ══ TOOLBAR ══════════════════════════════════════════════ -->
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:14px">
      <button class="btn btn-ghost btn-sm" onclick="window.print()" style="font-size:11px">🖨️ Imprimir / PDF</button>
    </div>

    <!-- ══ PORTADA ═══════════════════════════════════════════════ -->
    <div style="padding:20px 22px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;margin-bottom:16px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-size:22px;font-weight:900;letter-spacing:-.5px;line-height:1">MOVEMETRICS</div>
          <div style="font-size:9px;letter-spacing:.22em;color:var(--neon);text-transform:uppercase;margin-top:3px;font-weight:600">REPORTE INFOGRÁFICO · VALORACIÓN GERIÁTRICA</div>
        </div>
        <div style="text-align:right;font-size:10px;color:rgba(255,255,255,.45);line-height:1.8">
          <div>FECHA</div>
          <div style="font-size:14px;font-weight:700;color:#fff;font-family:var(--mono)">${fechaFmt}</div>
          <div style="margin-top:4px">EVALUADOR: <span style="color:rgba(255,255,255,.7)">${cur?.kine || '—'}</span></div>
        </div>
      </div>
      <div style="margin-top:14px;height:1px;background:linear-gradient(90deg,var(--neon),transparent)"></div>
    </div>

    <!-- ══ 01. PERFIL DEL PACIENTE ════════════════════════════════ -->
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px 22px;margin-bottom:14px">
      ${secHeader('01.','PERFIL DEL PACIENTE')}
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--neon);opacity:.7;text-transform:uppercase;margin-bottom:4px">PACIENTE</div>
          <div style="font-size:15px;font-weight:800;color:#fff">${nombre}</div>
        </div>
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--neon);opacity:.7;text-transform:uppercase;margin-bottom:4px">EDAD / DISCIPLINA</div>
          <div style="font-size:15px;font-weight:800;color:#fff">${cur?.edad ? cur.edad + ' A' : '—'} <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,.5)">/ ${cur?.deporte || '—'}</span></div>
        </div>
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--neon);opacity:.7;text-transform:uppercase;margin-bottom:4px">MORFOLOGÍA</div>
          <div style="font-size:15px;font-weight:800;color:#fff">${cur?.peso ? cur.peso+' kg' : '—'} <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,.5)">/ ${cur?.talla ? cur.talla+' cm' : '—'}</span></div>
        </div>
      </div>
    </div>

    <!-- ══ 02. RIESGO GLOBAL ══════════════════════════════════════ -->
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px 22px;margin-bottom:14px">
      ${secHeader('02.','RIESGO GLOBAL INTEGRADO')}
      <div style="display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center">
        <!-- Big badge -->
        <div style="text-align:center;padding:18px 28px;background:${gc.bg};border:2px solid ${gc.border};border-radius:8px;min-width:160px">
          <div style="font-size:26px;font-weight:900;color:${gc.text};letter-spacing:-.5px;line-height:1.1">${global.label}</div>
          <div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:${gc.text};opacity:.7;margin-top:4px">${global.descripcion}</div>
        </div>
        <!-- Mini grid -->
        <div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
            ${hallazgos.map(h => {
              const c2 = col(h.sem);
              return `<div style="text-align:center;padding:8px 6px;background:${c2.bg};border:1px solid ${c2.border};border-radius:6px">
                <div style="font-size:16px;margin-bottom:3px">${h.icon}</div>
                <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,.7);letter-spacing:.04em">${h.test}</div>
                <div style="font-family:var(--mono);font-size:12px;font-weight:800;color:${c2.text};margin-top:3px">${h.val}</div>
              </div>`;
            }).join('')}
          </div>
          <div style="margin-top:10px;font-size:9px;color:rgba(255,255,255,.3);text-align:right">
            ${totalEval} / ${hallazgos.length} dominios evaluados · ${verdes.length} normales · ${amarillos.length} alertas · ${rojos.length} críticos
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 03. ANÁLISIS FUNCIONAL & BALANCE ══════════════════════ -->
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px 22px;margin-bottom:14px">
      ${secHeader('03.','ANÁLISIS FUNCIONAL Y BALANCE')}
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,.08)">
            <th style="text-align:left;padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase">TEST</th>
            <th style="text-align:center;padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase">RESULTADO</th>
            <th style="padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase;width:30%">PERFIL</th>
            <th style="padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase">INTERPRETACIÓN</th>
            <th style="text-align:left;padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase">PUNTO DE CORTE</th>
          </tr>
        </thead>
        <tbody>
          ${hallazgos.filter(h=>h.cat==='func').map((h,i) => metricRow(h,i)).join('')}
        </tbody>
      </table>
      <div style="margin-top:10px;padding:10px 12px;background:rgba(255,255,255,.02);border-radius:6px;font-size:10px;color:rgba(255,255,255,.45);line-height:1.8">
        <strong style="color:rgba(255,255,255,.6)">Nota clínica:</strong>
        TUG ≥13.5s indica riesgo de caída elevado (Barry 2014: Sn 0.31, Sp 0.74). Velocidad de marcha &lt;0.8 m/s predictor independiente de mortalidad (HR 2.66 — Cheong 2021). SPPB &lt;7 asociado a pérdida de funcionalidad (Wanden-Berghe 2021). Berg ≤20 riesgo caída inminente (Park 2017: Sn 0.73, Sp 0.90).
      </div>
    </div>

    <!-- ══ 04. ANÁLISIS COGNITIVO ════════════════════════════════ -->
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px 22px;margin-bottom:14px">
      ${secHeader('04.','ANÁLISIS COGNITIVO')}
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,.08)">
            <th style="text-align:left;padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase">ESCALA</th>
            <th style="text-align:center;padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase">PUNTUACIÓN</th>
            <th style="padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase;width:30%">PERFIL</th>
            <th style="padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase">RESULTADO</th>
            <th style="text-align:left;padding:6px 10px;font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase">PUNTO DE CORTE</th>
          </tr>
        </thead>
        <tbody>
          ${hallazgos.filter(h=>h.cat==='cog').map((h,i) => metricRow(h,i)).join('')}
        </tbody>
      </table>
      <div style="margin-top:10px;padding:10px 12px;background:rgba(255,255,255,.02);border-radius:6px;font-size:10px;color:rgba(255,255,255,.45);line-height:1.8">
        <strong style="color:rgba(255,255,255,.6)">Nota clínica:</strong>
        AD-8 ≥2 puntos sugiere deterioro cognitivo (Usarel 2019: Sn 100% demencia / Sn 81.67% MCI). Mini-Cog ≤2 screena positivo (Borson 2000: Sn 0.76–0.99, Sp 0.89). CDT &lt;4 Shulman correlaciona con deterioro leve-moderado (media control=4.7 vs demencia=1.2).
      </div>
    </div>

    <!-- ══ 05. ESTADO AFECTIVO ════════════════════════════════════ -->
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px 22px;margin-bottom:14px">
      ${secHeader('05.','ESTADO AFECTIVO — ESCALA DE DEPRESIÓN GERIÁTRICA (GDS-15)')}
      ${(() => {
        const h = hallazgos.find(x=>x.test==='GDS-15');
        const c2 = col(h.sem);
        return `<div style="display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center">
          <div style="text-align:center;padding:16px 22px;background:${c2.bg};border:2px solid ${c2.border};border-radius:8px;min-width:120px">
            <div style="font-size:28px;font-weight:900;color:${c2.text};font-family:var(--mono)">${h.val}</div>
            <div style="font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:${c2.text};opacity:.7;margin-top:4px">GDS-15</div>
          </div>
          <div>
            ${badge(h.sem, h.lbl)}
            <div style="margin-top:10px;font-size:10px;color:rgba(255,255,255,.5);line-height:1.8">
              <strong style="color:rgba(255,255,255,.65)">Escala:</strong> 0–5 Sin depresión &nbsp;·&nbsp; 6–9 Depresión leve &nbsp;·&nbsp; ≥10 Depresión establecida
              <br>Punto de corte validado en población hispanohablante (Wanden-Berghe 2021).
            </div>
          </div>
        </div>`;
      })()}
    </div>

    <!-- ══ 06. PLAN DE INTERVENCIÓN ══════════════════════════════ -->
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px 22px;margin-bottom:14px">
      ${secHeader('06.','PLAN DE INTERVENCIÓN BASADO EN EVIDENCIA')}
      <div style="display:grid;grid-template-columns:${phases.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr'};gap:12px">
        ${phases.map(p => `
          <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-top:3px solid ${p.color};border-radius:6px;padding:14px">
            <div style="font-size:10px;font-weight:800;letter-spacing:.1em;color:${p.color};text-transform:uppercase;margin-bottom:3px">${p.num}</div>
            <div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.06em;line-height:1.3;margin-bottom:3px">${p.title}</div>
            <div style="font-size:9px;font-weight:600;letter-spacing:.08em;color:rgba(255,255,255,.35);text-transform:uppercase;margin-bottom:10px">${p.sub}</div>
            <ul style="margin:0;padding:0 0 0 14px;font-size:10px;color:rgba(255,255,255,.65);line-height:1.9">
              ${p.items.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>
    </div>

    <!-- ══ 07. MARCADORES DE RE-EVALUACIÓN ══════════════════════ -->
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px 22px;margin-bottom:14px">
      ${secHeader('07.','CRITERIOS DE SEGUIMIENTO')}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${[
          { icon:'⏱', text:'TUG: mejoría ≥3.5s respecto al basal (MCID Dengiz 2025)' },
          { icon:'🚶', text:'Velocidad marcha: superar umbral ≥1.0 m/s (Cheong 2021)' },
          { icon:'📊', text:'SPPB: puntuación ≥10 como objetivo funcional (Wanden-Berghe 2021)' },
          { icon:'⚖', text:'Berg Balance: ≥41 pts — zona de bajo riesgo de caída (Park 2017)' },
          { icon:'🧠', text:'AD-8: mantener ≤2 — repetir si síntomas nuevos o cambio conductual' },
          { icon:'💬', text:'GDS-15: ≤5 — re-evaluar en 3 meses si puntaje 6–9' },
        ].map(m => `<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 10px;background:rgba(255,255,255,.02);border-radius:5px;border:1px solid rgba(255,255,255,.05)">
          <span style="font-size:14px;margin-top:1px">${m.icon}</span>
          <span style="font-size:10px;color:rgba(255,255,255,.6);line-height:1.6">${m.text}</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- ══ 08. BIBLIOGRAFÍA ══════════════════════════════════════ -->
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px 22px;margin-bottom:14px">
      ${secHeader('08.','BIBLIOGRAFÍA CIENTÍFICA')}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${[AM_REFS.barry2014, AM_REFS.cheong2021, AM_REFS.dengiz2025, AM_REFS.park2017, AM_REFS.usarel2019, AM_REFS.wanden2021].map(r =>
          `<div style="font-size:8.5px;color:rgba(255,255,255,.35);padding:6px 8px;background:rgba(255,255,255,.02);border-radius:4px;line-height:1.6;border-left:2px solid rgba(57,255,122,.25)">• ${r}</div>`
        ).join('')}
      </div>
    </div>

    <!-- ══ FOOTER ════════════════════════════════════════════════ -->
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:1px solid rgba(255,255,255,.08);font-size:9px;color:rgba(255,255,255,.25);letter-spacing:.06em">
      <span>MOVEMETRICS · DEPARTAMENTO DE EVALUACIÓN CLÍNICA</span>
      <span>Basado en evidencia científica · No reemplaza el juicio clínico</span>
      <span>REPORTE GERIÁTRICO · v12.0</span>
    </div>

  </div>`;
}

window.renderAmSemaforo = renderAmSemaforo;
window.renderAmInforme  = renderAmInforme;

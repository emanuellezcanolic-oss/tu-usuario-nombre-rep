// ── GLOBALS (compartidos entre módulos) ──
// cur, atletas, kineState, etc. se definen en app.js
// Este archivo asume que app.js ya fue cargado

function abrirVideoJump(key, field) {
  vjState.targetKey  = key;
  vjState.targetField = field || (key + '-r1');
  vjState.takeoff = null;
  vjState.landing = null;
  // Reset UI
  const ids = ['vj-takeoff-disp','vj-landing-disp','vj-result-area'];
  ids.forEach(id => { const e = document.getElementById(id); if(e) e.innerHTML = ''; });
  const v = document.getElementById('vj-video');
  if (v) { v.src = ''; v.load(); }
  document.getElementById('vj-player-wrap').style.display = 'none';
  document.getElementById('vj-upload-area').style.display = 'block';
  document.getElementById('vj-btn-takeoff').style.background = '';
  document.getElementById('vj-btn-landing').style.background = '';
  document.getElementById('vj-modal-title').textContent = 'Video Salto -- ' + key.toUpperCase();
  openModal('modal-vj');
}

function loadVJVideo(input) {
  if (!input.files.length) return;
  const url = URL.createObjectURL(input.files[0]);
  const v   = document.getElementById('vj-video');
  v.src = url; v.load();
  document.getElementById('vj-player-wrap').style.display = 'block';
  document.getElementById('vj-upload-area').style.display = 'none';
  v.addEventListener('loadedmetadata', () => {
    const fps = getVJFps();
    document.getElementById('vj-frame-tot').textContent = Math.floor(v.duration * fps);
    updateVJFrameInfo();
  });
  v.addEventListener('timeupdate', updateVJFrameInfo);
}

function getVJFps() {
  // FPS de grabacion (real)
  return parseFloat(document.getElementById('vj-fps-grab')?.value || 240);
}

function getVJFpsRepro() {
  // FPS de reproduccion del video (normalmente 30)
  return parseFloat(document.getElementById('vj-fps-repro')?.value || 30);
}


function setVJMode(mode) {
  document.getElementById('vj-mode-auto').style.display     = mode === 'auto'     ? 'block' : 'none';
  document.getElementById('vj-mode-calibrar').style.display = mode === 'calibrar' ? 'block' : 'none';
  document.getElementById('vj-mode-btn-auto').style.background = mode === 'auto' ? 'rgba(57,255,122,.15)' : '';
  document.getElementById('vj-mode-btn-auto').style.borderColor = mode === 'auto' ? 'rgba(57,255,122,.3)' : '';
  document.getElementById('vj-mode-btn-auto').style.color = mode === 'auto' ? 'var(--neon)' : '';
  document.getElementById('vj-mode-btn-cal').style.background = mode === 'calibrar' ? 'rgba(255,176,32,.15)' : '';
  document.getElementById('vj-mode-btn-cal').style.borderColor = mode === 'calibrar' ? 'rgba(255,176,32,.3)' : '';
  document.getElementById('vj-mode-btn-cal').style.color = mode === 'calibrar' ? 'var(--amber)' : '';
  vjState.calMode = mode;
}

function vjCalibrar() {
  const hReal  = parseFloat(document.getElementById('vj-cal-altura')?.value) || 0;
  const tVideo = parseFloat(document.getElementById('vj-cal-tvideo')?.value) || 0;
  const el     = document.getElementById('vj-cal-result');
  if (!el) return;
  if (!hReal || !tVideo) { el.textContent = 'Ingresa los valores para calibrar'; el.style.color = 'var(--text2)'; return; }
  // From h = g*t²/8 -> t_real = sqrt(8*h/g)
  const tReal  = Math.sqrt(8 * (hReal/100) / 9.81);
  const factor = tReal / (tVideo/1000);
  vjState.calFactor = factor;
  el.textContent = 'Factor calibrado: ' + factor.toFixed(4) + ' -- t_real = t_video x ' + factor.toFixed(4);
  el.style.color = 'var(--neon)';
}

// Presets: { grab, repro, factor, label, tip }
const VJ_PRESETS = [
  { id:'n30',  grab:30,  repro:30,  factor:1.0,   label:'30 fps',        tip:'Video normal -- mas preciso' },
  { id:'n60',  grab:60,  repro:60,  factor:1.0,   label:'60 fps',        tip:'Video normal 60fps' },
  { id:'s120', grab:120, repro:30,  factor:0.25,  label:'Slow 120fps',   tip:'Slow mo 120fps -- reproduce a 30fps' },
  { id:'s240', grab:240, repro:30,  factor:0.125, label:'Slow 240fps',   tip:'iPhone Slo-Mo 240fps -- reproduce a 30fps' },
  { id:'s480', grab:480, repro:30,  factor:0.0625,label:'Slow 480fps',   tip:'Super slow mo 480fps' },
  { id:'s960', grab:960, repro:30,  factor:0.03125,label:'Slow 960fps',  tip:'Ultra slow mo 960fps' },
];

function setVJFps(presetId, btn) {
  const preset = VJ_PRESETS.find(p => p.id === presetId);
  if (!preset) return;
  vjState.fpsPreset = preset;
  document.querySelectorAll('#vj-fps-btns button').forEach(b => {
    b.className = 'btn btn-ghost btn-sm';
    b.style.fontSize = '10px';
  });
  if (btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.fontSize = '10px'; }
  const tipEl = document.getElementById('vj-fps-tip');
  if (tipEl) {
    tipEl.textContent = preset.tip;
    tipEl.style.color = preset.factor === 1.0 ? 'var(--neon)' : 'var(--amber)';
  }
}

function getVJFps() {
  return vjState.fpsPreset ? vjState.fpsPreset.grab : 30;
}

function getVJFpsRepro() {
  return vjState.fpsPreset ? vjState.fpsPreset.repro : 30;
}

function getVJSlowFactor() {
  return vjState.fpsPreset ? vjState.fpsPreset.factor : 1.0;
}

function vjUpdateFpsInfo() {}

function updateVJFrameInfo() {
  const v   = document.getElementById('vj-video');
  if (!v || !v.duration) return;
  const fps = getVJFps();
  document.getElementById('vj-frame-cur').textContent = Math.round(v.currentTime * fps);
  document.getElementById('vj-time-cur').textContent  = v.currentTime.toFixed(3) + 's';
  const s = document.getElementById('vj-scrubber');
  if (s) s.value = Math.round((v.currentTime / v.duration) * 1000);
}

function vjJump(n) {
  const v = document.getElementById('vj-video');
  if (!v || !v.src) return;
  v.pause(); document.getElementById('vj-play-btn').textContent = 'Play';
  v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + n / getVJFps()));
  setTimeout(updateVJFrameInfo, 40);
}

function vjTogglePlay() {
  const v   = document.getElementById('vj-video');
  const btn = document.getElementById('vj-play-btn');
  if (!v) return;
  if (v.paused) { v.play(); btn.textContent = 'Pausa'; }
  else          { v.pause(); btn.textContent = 'Play'; }
}

function vjScrub(val) {
  const v = document.getElementById('vj-video');
  if (!v || !v.duration) return;
  v.currentTime = (val / 1000) * v.duration;
}

function vjMarkTakeoff() {
  const v = document.getElementById('vj-video');
  if (!v || !v.src) { alert('Carga un video primero'); return; }
  v.pause(); document.getElementById('vj-play-btn').textContent = 'Play';
  vjState.takeoff = v.currentTime;
  const fpsR = getVJFpsRepro();
  document.getElementById('vj-takeoff-disp').textContent =
    v.currentTime.toFixed(3) + 's  (frame ' + Math.round(v.currentTime * fpsR) + ')';
  document.getElementById('vj-btn-takeoff').style.background = 'rgba(57,255,122,.2)';
  if (vjState.landing !== null) calcVJJump();
}

function vjMarkLanding() {
  const v = document.getElementById('vj-video');
  if (!v || !v.src) { alert('Carga un video primero'); return; }
  if (vjState.takeoff === null) { alert('Marca primero el Despegue'); return; }
  if (v.currentTime <= vjState.takeoff) { alert('El aterrizaje debe ser despues del despegue'); return; }
  v.pause(); document.getElementById('vj-play-btn').textContent = 'Play';
  vjState.landing = v.currentTime;
  const fpsR = getVJFpsRepro();
  document.getElementById('vj-landing-disp').textContent =
    v.currentTime.toFixed(3) + 's  (frame ' + Math.round(v.currentTime * fpsR) + ')';
  document.getElementById('vj-btn-landing').style.background = 'rgba(255,59,59,.2)';
  calcVJJump();
}

function calcVJJump() {
  if (vjState.takeoff === null || vjState.landing === null) return;
  const tVideo  = vjState.landing - vjState.takeoff;
  const factor  = getVJSlowFactor();
  const tReal   = tVideo * factor;
  const fps     = getVJFps();
  const fpsRep  = getVJFpsRepro();
  const tMs     = Math.round(tReal * 1000);
  const hCm     = ((9.81 * tReal * tReal) / 8) * 100;
  const frames  = Math.round(tVideo * fpsRep);
  const c = hCm >= 40 ? 'var(--neon)' : hCm >= 30 ? 'var(--amber)' : 'var(--red)';
  document.getElementById('vj-result-area').innerHTML =
    '<div style="background:var(--dark4);border-radius:10px;padding:16px;text-align:center;margin-top:12px">' +
    '<div style="font-family:var(--mono);font-size:9px;color:var(--text2);text-transform:uppercase;margin-bottom:6px">Altura calculada</div>' +
    '<div style="font-family:var(--mono);font-size:52px;font-weight:800;color:' + c + ';line-height:1;text-shadow:0 0 20px ' + c + '33">' + hCm.toFixed(1) + '</div>' +
    '<div style="font-size:13px;color:var(--text2);margin-top:4px">cm</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">' +
    '<div style="background:rgba(57,255,122,.05);border-radius:6px;padding:8px;text-align:center">' +
    '<div style="font-family:var(--mono);font-size:8px;color:var(--text3);text-transform:uppercase;margin-bottom:2px">Tiempo de vuelo</div>' +
    '<div style="font-family:var(--mono);font-size:18px;font-weight:800;color:' + c + '">' + tMs + ' ms</div></div>' +
    '<div style="background:rgba(77,158,255,.05);border-radius:6px;padding:8px;text-align:center">' +
    '<div style="font-family:var(--mono);font-size:8px;color:var(--text3);text-transform:uppercase;margin-bottom:2px">Frames de vuelo</div>' +
    '<div style="font-family:var(--mono);font-size:18px;font-weight:800;color:var(--blue)">' + frames + ' @ ' + fps + 'fps</div></div>' +
    '</div></div>';
  vjState.resultCm = hCm;
}

function confirmarVJResult() {
  if (!vjState.resultCm) { alert('Calcula el salto primero'); return; }
  const h = +vjState.resultCm.toFixed(1);
  // Write to the correct input (rep1 or specified field)
  const inp = document.getElementById(vjState.targetField);
  if (inp) {
    inp.value = h;
    inp.dispatchEvent(new Event('input'));
  }
  // Also trigger calcSalto
  const key = vjState.targetKey;
  if (key) {
    // find r2id
    const r2inp = document.getElementById(key + '-r2');
    calcSalto(key, key + '-r2');
  }
  closeModal('modal-vj');
  showSaveToast();
}

function vjClearMarkers() {
  vjState.takeoff = null; vjState.landing = null; vjState.resultCm = null;
  document.getElementById('vj-takeoff-disp').textContent = '';
  document.getElementById('vj-landing-disp').textContent = '';
  document.getElementById('vj-result-area').innerHTML   = '';
  document.getElementById('vj-btn-takeoff').style.background = '';
  document.getElementById('vj-btn-landing').style.background = '';
}


// ========================================================
//  VALGO DE RODILLA -- Analizador de angulo sobre video
//  Dos lineas sobre frame congelado -> angulo automatico
// ========================================================

let valgoState = {
  fps: 30,
  color: '#39FF7A',
  mode: 'linea1',     // 'linea1' | 'linea2'
  linea1: [],         // max 2 puntos
  linea2: [],         // max 2 puntos
  ctx: null,
  angle: null
};

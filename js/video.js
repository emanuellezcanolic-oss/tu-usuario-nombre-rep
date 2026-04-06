// ── GLOBALS (compartidos entre módulos) ──
// cur, atletas, kineState, etc. se definen en app.js
// Este archivo asume que app.js ya fue cargado

function getFps() {
  const sel = document.getElementById('video-fps');
  if (!sel) return 60;
  if (sel.value === 'custom') {
    return parseFloat(document.getElementById('video-fps-custom').value) || 60;
  }
  return parseFloat(sel.value) || 60;
}

function onFpsChange() {
  const sel = document.getElementById('video-fps');
  const customInp = document.getElementById('video-fps-custom');
  if (sel.value === 'custom') {
    customInp.style.display = 'block';
  } else {
    customInp.style.display = 'none';
  }
  const fps = getFps();
  videoState.fps = fps;
  const ms = (1000 / fps).toFixed(2);
  const el = document.getElementById('frame-duration-display');
  if (el) el.textContent = ms + ' ms';
  // Recalculate if markers already set
  if (videoState.takeoffTime !== null && videoState.landingTime !== null) {
    calcVideoJump();
  }
}

function loadVideo(input) {
  if (!input.files.length) return;
  const file = input.files[0];
  const url = URL.createObjectURL(file);
  const video = document.getElementById('video-player');
  const wrap = document.getElementById('video-player-wrap');
  const uploadArea = document.getElementById('video-upload-area');
  video.src = url;
  video.load();
  wrap.style.display = 'block';
  uploadArea.style.display = 'none';
  video.addEventListener('loadedmetadata', () => {
    videoState.duration = video.duration;
    document.getElementById('vid-time-tot').textContent = video.duration.toFixed(3) + 's';
    const totalFrames = Math.floor(video.duration * getFps());
    document.getElementById('vid-frame-tot').textContent = totalFrames;
    updateVideoUI();
  });
  video.addEventListener('timeupdate', updateVideoUI);
}

function handleVideoDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('video/')) return;
  const input = document.getElementById('video-file-inp');
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
  loadVideo(input);
}

function updateVideoUI() {
  const video = document.getElementById('video-player');
  if (!video) return;
  const fps = getFps();
  const currentFrame = Math.round(video.currentTime * fps);
  const totalFrames = Math.floor(video.duration * fps);
  document.getElementById('vid-frame-num').textContent = currentFrame;
  document.getElementById('vid-time-cur').textContent = video.currentTime.toFixed(3) + 's';
  const scrubber = document.getElementById('video-scrubber');
  if (scrubber && video.duration) {
    scrubber.value = Math.round((video.currentTime / video.duration) * 1000);
  }
  // Update marker bars
  if (videoState.takeoffTime !== null && video.duration) {
    const pct = (videoState.takeoffTime / video.duration * 100).toFixed(2);
    const bar = document.getElementById('bar-takeoff');
    if (bar) { bar.style.left = pct + '%'; bar.style.display = 'block'; }
  }
  if (videoState.landingTime !== null && video.duration) {
    const pct = (videoState.landingTime / video.duration * 100).toFixed(2);
    const bar = document.getElementById('bar-landing');
    if (bar) { bar.style.left = pct + '%'; bar.style.display = 'block'; }
  }
}

function jumpFrames(n) {
  const video = document.getElementById('video-player');
  if (!video) return;
  video.pause();
  document.getElementById('play-btn').textContent = '▶';
  const fps = getFps();
  const frameDuration = 1 / fps;
  let newTime = video.currentTime + n * frameDuration;
  newTime = Math.max(0, Math.min(video.duration, newTime));
  video.currentTime = newTime;
  setTimeout(updateVideoUI, 50);
}

function scrubVideo(val) {
  const video = document.getElementById('video-player');
  if (!video || !video.duration) return;
  video.currentTime = (val / 1000) * video.duration;
}

function togglePlay() {
  const video = document.getElementById('video-player');
  const btn = document.getElementById('play-btn');
  if (!video) return;
  if (video.paused) { video.play(); btn.textContent = '⏸'; }
  else { video.pause(); btn.textContent = '▶'; }
}

function markTakeoff() {
  const video = document.getElementById('video-player');
  if (!video || !video.src) { alert('Cargá un video primero'); return; }
  video.pause();
  document.getElementById('play-btn').textContent = '▶';
  videoState.takeoffTime = video.currentTime;
  const fps = getFps();
  const frame = Math.round(video.currentTime * fps);
  document.getElementById('takeoff-frame-display').textContent = video.currentTime.toFixed(3) + 's';
  document.getElementById('takeoff-time-display').textContent = 'Frame ' + frame;
  document.getElementById('btn-takeoff').style.background = 'rgba(57,255,122,.15)';
  document.getElementById('btn-takeoff').style.borderColor = 'rgba(57,255,122,.4)';
  updateVideoUI();
  if (videoState.landingTime !== null) calcVideoJump();
}

function markLanding() {
  const video = document.getElementById('video-player');
  if (!video || !video.src) { alert('Cargá un video primero'); return; }
  if (videoState.takeoffTime === null) { alert('Marcá primero el Despegue'); return; }
  if (video.currentTime <= videoState.takeoffTime) { alert('El aterrizaje debe ser DESPUÉS del despegue'); return; }
  video.pause();
  document.getElementById('play-btn').textContent = '▶';
  videoState.landingTime = video.currentTime;
  const fps = getFps();
  const frame = Math.round(video.currentTime * fps);
  document.getElementById('landing-frame-display').textContent = video.currentTime.toFixed(3) + 's';
  document.getElementById('landing-time-display').textContent = 'Frame ' + frame;
  document.getElementById('btn-landing').style.background = 'rgba(255,59,59,.15)';
  document.getElementById('btn-landing').style.borderColor = 'rgba(255,59,59,.4)';
  updateVideoUI();
  calcVideoJump();
}

function calcVideoJump() {
  if (videoState.takeoffTime === null || videoState.landingTime === null) return;
  const fps = getFps();
  const t = videoState.landingTime - videoState.takeoffTime; // seconds
  const tMs = Math.round(t * 1000);
  const frames = Math.round(t * fps);
  // h = g * t^2 / 8  (caída libre con tiempo de vuelo completo)
  const g = 9.81;
  const hMeters = (g * t * t) / 8;
  const hCm = hMeters * 100;

  // Status
  const c = hCm >= 40 ? 'var(--neon)' : hCm >= 30 ? 'var(--amber)' : 'var(--red)';
  const label = hCm >= 40 ? '🟢 Excelente' : hCm >= 30 ? '🟡 Moderado' : '🔴 Bajo';

  document.getElementById('video-result-card').style.display = 'block';
  document.getElementById('video-height-display').textContent = hCm.toFixed(1);
  document.getElementById('video-height-display').style.color = c;
  document.getElementById('video-height-display').style.textShadow = `0 0 30px ${c}`;
  document.getElementById('video-flight-ms').textContent = tMs;
  document.getElementById('video-flight-frames').textContent = frames;
  document.getElementById('video-fps-used').textContent = fps;
  const badge = document.getElementById('video-result-badge');
  badge.textContent = label;
  badge.className = 'tag ' + (hCm >= 40 ? 'tag-g' : hCm >= 30 ? 'tag-y' : 'tag-r');

  // Compare with manual CMJ if exists
  if (cur && cur.lastCMJ) {
    const diff = (hCm - cur.lastCMJ).toFixed(1);
    const sign = diff >= 0 ? '+' : '';
    document.getElementById('video-vs-manual').style.display = 'block';
    document.getElementById('video-vs-cmj').textContent = cur.lastCMJ.toFixed(1) + 'cm (' + sign + diff + 'cm)';
    document.getElementById('video-vs-cmj').style.color = diff >= 0 ? 'var(--neon)' : 'var(--red)';
  }

  // Store result for saving
  videoState.result = { hCm: +hCm.toFixed(1), tMs, frames, fps, takeoff: videoState.takeoffTime, landing: videoState.landingTime };
}

function clearMarkers() {
  videoState.takeoffTime = null;
  videoState.landingTime = null;
  videoState.result = null;
  ['takeoff-frame-display','takeoff-time-display'].forEach(id => { const e=document.getElementById(id); if(e) e.textContent='--'; });
  ['landing-frame-display','landing-time-display'].forEach(id => { const e=document.getElementById(id); if(e) e.textContent='--'; });
  document.getElementById('btn-takeoff').style.cssText = '';
  document.getElementById('btn-landing').style.cssText = '';
  document.getElementById('video-result-card').style.display = 'none';
  document.getElementById('video-vs-manual').style.display = 'none';
  ['bar-takeoff','bar-landing'].forEach(id => { const e=document.getElementById(id); if(e) e.style.display='none'; });
}

function saveVideoSalto() {
  if (!cur) { alert('Seleccioná un atleta'); return; }
  if (!videoState.result) { alert('Calculá un salto primero'); return; }
  const fecha = new Date().toISOString().split('T')[0];
  if (!cur.evals) cur.evals = {};
  cur.evals['video_' + fecha + '_' + Date.now()] = {
    ...videoState.result,
    fecha,
    tipo: 'video-salto'
  };
  // Also update lastCMJ if higher or not set
  if (!cur.lastCMJ || videoState.result.hCm > cur.lastCMJ) {
    cur.lastCMJ = videoState.result.hCm;
  }
  atletas = atletas.map(a => a.id === cur.id ? cur : a);
  saveData();
  renderProfileHero();
  showSaveToast();
}


function saveFuncTests() {
  if (!cur) return;
  const sts  = +document.getElementById('sts-reps')?.value||null;
  const uni  = +document.getElementById('unipodal-seg')?.value||null;
  const tug  = +document.getElementById('tug-seg')?.value||null;
  const d6m  = +document.getElementById('dist6min-m')?.value||null;
  if (sts)  cur.sitToStand = sts;
  if (uni)  cur.unipodal   = uni;
  if (tug)  cur.tug        = tug;
  if (d6m)  cur.dist6min   = d6m;
  atletas = atletas.map(a => a.id === cur.id ? cur : a);
  saveData();
  renderRadar();
}


// ========================================================
//  GONIOMETRO INTERACTIVO
// ========================================================

let goniometroActivo = false, goniometroCongelado = false;
let anguloActual = 0, anguloCongelado = 0, goniometroCtx = null;
let testEnCurso = null, anguloMax = 60, anguloOffset = 0, calibrado = false;

// MoveAnalysis.js — análisis de movimiento por video usando MediaPipe Pose
// Templates: sentadilla bipodal/unipodal, lunge, CMJ
// Vistas: front | side_l | side_r | back
// Output: ángulos por frame + flags asimetría/forma + KPIs

(function(){
'use strict';

// MediaPipe landmark indices (33 points, BlazePose)
const L = {
  NOSE:0, L_EYE:2, R_EYE:5, L_EAR:7, R_EAR:8,
  L_SHOULDER:11, R_SHOULDER:12, L_ELBOW:13, R_ELBOW:14,
  L_WRIST:15, R_WRIST:16,
  L_HIP:23, R_HIP:24, L_KNEE:25, R_KNEE:26,
  L_ANKLE:27, R_ANKLE:28, L_HEEL:29, R_HEEL:30,
  L_FOOT:31, R_FOOT:32
};

// 2D angle from 3 landmarks (degrees, 0-180)
function angle2D(a, b, c){
  if (!a || !b || !c) return null;
  const v1x = a.x - b.x, v1y = a.y - b.y;
  const v2x = c.x - b.x, v2y = c.y - b.y;
  const dot = v1x*v2x + v1y*v2y;
  const m1 = Math.hypot(v1x,v1y), m2 = Math.hypot(v2x,v2y);
  if (m1*m2 === 0) return null;
  const cos = Math.max(-1, Math.min(1, dot/(m1*m2)));
  return Math.acos(cos) * 180 / Math.PI;
}

// All useful joint angles for one frame
function allAngles(lm){
  return {
    knee_l:    angle2D(lm[L.L_HIP],      lm[L.L_KNEE],     lm[L.L_ANKLE]),
    knee_r:    angle2D(lm[L.R_HIP],      lm[L.R_KNEE],     lm[L.R_ANKLE]),
    hip_l:     angle2D(lm[L.L_SHOULDER], lm[L.L_HIP],      lm[L.L_KNEE]),
    hip_r:     angle2D(lm[L.R_SHOULDER], lm[L.R_HIP],      lm[L.R_KNEE]),
    ankle_l:   angle2D(lm[L.L_KNEE],     lm[L.L_ANKLE],    lm[L.L_FOOT]),
    ankle_r:   angle2D(lm[L.R_KNEE],     lm[L.R_ANKLE],    lm[L.R_FOOT]),
    elbow_l:   angle2D(lm[L.L_SHOULDER], lm[L.L_ELBOW],    lm[L.L_WRIST]),
    elbow_r:   angle2D(lm[L.R_SHOULDER], lm[L.R_ELBOW],    lm[L.R_WRIST]),
    shoulder_l:angle2D(lm[L.L_HIP],      lm[L.L_SHOULDER], lm[L.L_ELBOW]),
    shoulder_r:angle2D(lm[L.R_HIP],      lm[L.R_SHOULDER], lm[L.R_ELBOW]),
    // line-tilts (degrees from horizontal, signed)
    pelvis_tilt:    lineTilt(lm[L.L_HIP],      lm[L.R_HIP]),
    shoulder_tilt:  lineTilt(lm[L.L_SHOULDER], lm[L.R_SHOULDER]),
    trunk_lean:     lineTilt(midpoint(lm[L.L_HIP],lm[L.R_HIP]), midpoint(lm[L.L_SHOULDER],lm[L.R_SHOULDER])) - 90,
    // valgus index = knee X relative to hip-ankle line (signed, frontal view)
    valgus_l:  valgusIndex(lm[L.L_HIP], lm[L.L_KNEE], lm[L.L_ANKLE]),
    valgus_r:  valgusIndex(lm[L.R_HIP], lm[L.R_KNEE], lm[L.R_ANKLE])
  };
}

function midpoint(a,b){ return a&&b ? {x:(a.x+b.x)/2, y:(a.y+b.y)/2, z:((a.z||0)+(b.z||0))/2} : null; }
function lineTilt(a,b){
  if (!a||!b) return null;
  return Math.atan2(b.y-a.y, b.x-a.x) * 180 / Math.PI;
}
// valgus: lateral deviation of knee from hip-ankle line (positive = medial = valgo)
function valgusIndex(hip, knee, ankle){
  if (!hip||!knee||!ankle) return null;
  const t = (knee.y - hip.y) / (ankle.y - hip.y);
  const expectedX = hip.x + t*(ankle.x - hip.x);
  return knee.x - expectedX; // sign depends on side L/R
}

// ── Templates ────────────────────────────────────────────────────────────
// Each template: { name, view_required[], analyze(angles_per_frame) → {kpis,flags} }

function lower(arr, v){ return arr.filter(x => x != null).reduce((a,b)=> Math.min(a,b), v); }
function upper(arr, v){ return arr.filter(x => x != null).reduce((a,b)=> Math.max(a,b), v); }
function avg(arr){ const c = arr.filter(x=>x!=null); return c.length ? c.reduce((a,b)=>a+b,0)/c.length : null; }

const TEMPLATES = {

  squat_bipodal: {
    name:'Sentadilla bipodal',
    analyze(frames, view){
      const flags = [];
      const kpis = {};
      const kneeL = frames.map(f => f.knee_l);
      const kneeR = frames.map(f => f.knee_r);
      kpis['Profundidad rodilla IZQ'] = lower(kneeL, 999).toFixed(0)+'°';
      kpis['Profundidad rodilla DER'] = lower(kneeR, 999).toFixed(0)+'°';
      const minL = lower(kneeL,999), minR = lower(kneeR,999);
      const asym = Math.abs(minL - minR);
      kpis['Asimetría profundidad'] = asym.toFixed(1)+'°';
      if (asym > 8) flags.push({lvl:'red', msg:`Asimetría profundidad rodilla ${asym.toFixed(0)}° (>8°)`});
      else if (asym > 4) flags.push({lvl:'amber', msg:`Asimetría leve profundidad ${asym.toFixed(1)}°`});

      if (view === 'front' || view === 'back'){
        // valgus dynamics
        const vL = frames.map(f => f.valgus_l).filter(x=>x!=null);
        const vR = frames.map(f => f.valgus_r).filter(x=>x!=null);
        const maxValL = Math.max(...vL.map(Math.abs));
        const maxValR = Math.max(...vR.map(Math.abs));
        kpis['Valgo máx IZQ'] = maxValL.toFixed(3);
        kpis['Valgo máx DER'] = maxValR.toFixed(3);
        if (maxValL > 0.04) flags.push({lvl:'red', msg:'Valgo dinámico rodilla IZQ marcado'});
        else if (maxValL > 0.02) flags.push({lvl:'amber', msg:'Valgo leve rodilla IZQ'});
        if (maxValR > 0.04) flags.push({lvl:'red', msg:'Valgo dinámico rodilla DER marcado'});
        else if (maxValR > 0.02) flags.push({lvl:'amber', msg:'Valgo leve rodilla DER'});

        // pelvis/shoulder tilt
        const pelvT = avg(frames.map(f => f.pelvis_tilt));
        const shouT = avg(frames.map(f => f.shoulder_tilt));
        if (pelvT != null && Math.abs(pelvT) > 4) flags.push({lvl:'amber', msg:`Inclinación pélvica ${pelvT.toFixed(1)}°`});
        if (shouT != null && Math.abs(shouT) > 4) flags.push({lvl:'amber', msg:`Caída de hombro ${shouT.toFixed(1)}°`});
      }
      if (view === 'side_l' || view === 'side_r'){
        const trunk = frames.map(f => f.trunk_lean).filter(x=>x!=null);
        const maxLean = Math.max(...trunk.map(Math.abs));
        kpis['Máx inclin. tronco'] = maxLean.toFixed(0)+'°';
        if (maxLean > 45) flags.push({lvl:'red', msg:`Tronco muy adelantado ${maxLean.toFixed(0)}°`});
        else if (maxLean > 30) flags.push({lvl:'amber', msg:`Tronco adelantado ${maxLean.toFixed(0)}°`});
      }

      // depth classification
      const deepest = Math.min(minL, minR);
      kpis['Profundidad'] = deepest < 90 ? '✅ Completa' : deepest < 110 ? '⚠ Parcial' : '❌ Cuarto';

      return { kpis, flags };
    }
  },

  squat_unipodal_l: {
    name:'Sentadilla unipodal IZQ',
    analyze(frames, view){
      const flags = [];
      const kpis = {};
      const knee = frames.map(f => f.knee_l);
      kpis['Profundidad'] = lower(knee, 999).toFixed(0)+'°';
      const minK = lower(knee, 999);
      kpis['Clasificación'] = minK < 100 ? '✅ Buena' : minK < 120 ? '⚠ Limitada' : '❌ Muy limitada';

      if (view === 'front' || view === 'back'){
        const v = frames.map(f => f.valgus_l).filter(x=>x!=null);
        const maxV = Math.max(...v.map(Math.abs));
        kpis['Valgo máx'] = maxV.toFixed(3);
        if (maxV > 0.05) flags.push({lvl:'red', msg:'Valgo dinámico marcado (valgo importante)'});
        else if (maxV > 0.025) flags.push({lvl:'amber', msg:'Valgo dinámico leve'});

        // Trendelenburg: pelvis drop hacia lado contralateral (DER cae)
        const pelvT = avg(frames.map(f => f.pelvis_tilt));
        if (pelvT != null){
          kpis['Tilt pélvico medio'] = pelvT.toFixed(1)+'°';
          if (Math.abs(pelvT) > 5) flags.push({lvl:'red', msg:`Trendelenburg (caída cadera contralateral) ${pelvT.toFixed(1)}°`});
          else if (Math.abs(pelvT) > 3) flags.push({lvl:'amber', msg:'Tilt pélvico leve (Trendelenburg compensado)'});
        }
      }
      if (view === 'side_l' || view === 'side_r'){
        const trunk = frames.map(f=>f.trunk_lean).filter(x=>x!=null);
        const maxLean = Math.max(...trunk.map(Math.abs));
        kpis['Inclin. tronco'] = maxLean.toFixed(0)+'°';
        if (maxLean > 35) flags.push({lvl:'amber', msg:`Tronco compensa ${maxLean.toFixed(0)}°`});
      }
      return { kpis, flags };
    }
  },

  squat_unipodal_r: {
    name:'Sentadilla unipodal DER',
    analyze(frames, view){
      // reuse logic mirrored
      const t = TEMPLATES.squat_unipodal_l.analyze(
        frames.map(f => ({...f, knee_l: f.knee_r, valgus_l: f.valgus_r, pelvis_tilt: -f.pelvis_tilt})),
        view
      );
      return t;
    }
  },

  lunge: {
    name:'Zancada',
    analyze(frames, view){
      const flags = [];
      const kpis = {};
      const minL = lower(frames.map(f=>f.knee_l), 999);
      const minR = lower(frames.map(f=>f.knee_r), 999);
      kpis['Rodilla adelante (mín)'] = Math.min(minL,minR).toFixed(0)+'°';
      const asym = Math.abs(minL - minR);
      kpis['Asimetría'] = asym.toFixed(1)+'°';
      if (asym > 10) flags.push({lvl:'red', msg:`Asimetría grande ${asym.toFixed(0)}°`});
      const trunk = frames.map(f=>f.trunk_lean).filter(x=>x!=null);
      if (trunk.length){
        const maxL = Math.max(...trunk.map(Math.abs));
        kpis['Máx tronco'] = maxL.toFixed(0)+'°';
        if (maxL > 25) flags.push({lvl:'amber', msg:`Tronco proyectado ${maxL.toFixed(0)}°`});
      }
      return { kpis, flags };
    }
  },

  cmj: {
    name:'Salto CMJ',
    analyze(frames, view){
      const flags = [];
      const kpis = {};
      // detect minimum knee (countermovement) and landing
      const allK = frames.map(f => Math.min(f.knee_l||999, f.knee_r||999));
      const minK = Math.min(...allK);
      kpis['Pre-stretch profundidad'] = minK.toFixed(0)+'°';
      if (minK > 110) flags.push({lvl:'amber', msg:'Pre-stretch poco profundo (>110°)'});
      // landing valgus check
      if (view === 'front'){
        const vL = Math.max(...frames.map(f => Math.abs(f.valgus_l||0)));
        const vR = Math.max(...frames.map(f => Math.abs(f.valgus_r||0)));
        if (Math.max(vL,vR) > 0.05) flags.push({lvl:'red', msg:'Valgo en aterrizaje'});
      }
      return { kpis, flags };
    }
  },

  free: {
    name:'Análisis libre',
    analyze(frames, view){
      const kpis = {};
      ['knee_l','knee_r','hip_l','hip_r','elbow_l','elbow_r'].forEach(k => {
        const arr = frames.map(f => f[k]).filter(x=>x!=null);
        if (arr.length){
          kpis[k+' min']  = Math.min(...arr).toFixed(0)+'°';
          kpis[k+' max']  = Math.max(...arr).toFixed(0)+'°';
        }
      });
      return { kpis, flags: [] };
    }
  }
};

// ── Pose detector setup ────────────────────────────────────────────────
let poseLandmarker = null;
let poseReady = false;

async function initPose(){
  if (poseReady) return;
  MA._setStatus('Cargando MediaPipe…');
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/+esm');
    const { PoseLandmarker, FilesetResolver } = mod;
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/wasm'
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    poseReady = true;
    MA._setStatus('MediaPipe listo. Subí video y dale Analizar.');
  } catch(e){
    console.error('[MA] init error', e);
    MA._setStatus('Error cargando MediaPipe: '+e.message);
  }
}

// ── Main module ─────────────────────────────────────────────────────────
const MA = window.MA = {
  _video: null,
  _canvas: null,
  _ctx: null,
  _frames: [],
  _last: null,
  _stream: null,

  loadVideo(file){
    if (!file) return;
    const v = document.getElementById('ma-video');
    v.src = URL.createObjectURL(file);
    v.load();
    document.getElementById('ma-analyze-btn').disabled = false;
    this._setStatus('Video listo. Dale ▶ Analizar.');
    this._stopWebcam();
  },

  async useWebcam(){
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({ video:{ width:1280, height:720 } });
      const v = document.getElementById('ma-video');
      v.srcObject = this._stream;
      await v.play();
      this._setStatus('Webcam activa. Live tracking ON');
      this._liveLoop();
    } catch(e){ alert('No se pudo abrir webcam: '+e.message); }
  },

  _stopWebcam(){
    if (this._stream){ this._stream.getTracks().forEach(t=>t.stop()); this._stream=null; }
  },

  async analyze(){
    if (!poseReady) await initPose();
    if (!poseReady) return;
    const v = document.getElementById('ma-video');
    if (!v.duration || isNaN(v.duration)){ alert('Video no cargado'); return; }
    this._video = v; this._setupCanvas();
    this._frames = [];

    const fps = 10;
    const total = Math.floor(v.duration * fps);
    let frame = 0;
    this._setStatus(`Procesando 0/${total}…`);
    v.pause();
    v.currentTime = 0;
    await new Promise(r => v.onseeked = r);

    const tick = async () => {
      if (frame >= total){ this._finish(); return; }
      const t = frame / fps;
      v.currentTime = t;
      await new Promise(r => { v.onseeked = r; });
      const result = poseLandmarker.detectForVideo(v, performance.now());
      if (result?.landmarks?.[0]){
        const lm = result.landmarks[0];
        const a = allAngles(lm);
        a._t = t;
        a._lm = lm;
        this._frames.push(a);
        this._draw(lm);
      }
      frame++;
      this._setStatus(`Procesando ${frame}/${total}…`);
      setTimeout(tick, 0);
    };
    tick();
  },

  _liveLoop(){
    if (!this._stream) return;
    const v = document.getElementById('ma-video');
    this._video = v; this._setupCanvas();
    const loop = async () => {
      if (!this._stream) return;
      if (!poseReady){ await initPose(); }
      if (poseReady && v.readyState >= 2){
        const result = poseLandmarker.detectForVideo(v, performance.now());
        if (result?.landmarks?.[0]) this._draw(result.landmarks[0]);
      }
      requestAnimationFrame(loop);
    };
    loop();
  },

  _setupCanvas(){
    const c = document.getElementById('ma-canvas');
    const v = document.getElementById('ma-video');
    c.width  = v.videoWidth  || 1280;
    c.height = v.videoHeight || 720;
    this._canvas = c; this._ctx = c.getContext('2d');
  },

  _draw(lm){
    const ctx = this._ctx; if (!ctx) return;
    const w = this._canvas.width, h = this._canvas.height;
    ctx.clearRect(0,0,w,h);
    const PAIRS = [
      [11,13],[13,15],[12,14],[14,16],          // arms
      [11,12],[11,23],[12,24],[23,24],          // torso
      [23,25],[25,27],[24,26],[26,28],          // legs
      [27,31],[28,32],[27,29],[28,30]           // feet
    ];
    ctx.lineWidth = 3; ctx.strokeStyle = '#39FF7A';
    PAIRS.forEach(([a,b]) => {
      const A = lm[a], B = lm[b];
      if (!A||!B) return;
      ctx.beginPath();
      ctx.moveTo(A.x*w, A.y*h); ctx.lineTo(B.x*w, B.y*h);
      ctx.stroke();
    });
    ctx.fillStyle = '#fff';
    lm.forEach(p => { if(!p) return;
      ctx.beginPath();
      ctx.arc(p.x*w, p.y*h, 3.5, 0, Math.PI*2);
      ctx.fill();
    });
    // angle annotations on knees
    [[L.L_HIP,L.L_KNEE,L.L_ANKLE,'IZQ'], [L.R_HIP,L.R_KNEE,L.R_ANKLE,'DER']].forEach(([a,b,c,lbl]) => {
      const A=lm[a],B=lm[b],C=lm[c]; if(!A||!B||!C) return;
      const ang = angle2D(A,B,C); if (ang==null) return;
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = ang < 90 ? '#39FF7A' : ang < 130 ? '#FFB020' : '#FF4040';
      ctx.fillText(`${lbl} ${ang.toFixed(0)}°`, B.x*w + 10, B.y*h);
    });
  },

  _finish(){
    const ex = document.getElementById('ma-exercise').value;
    const view = document.getElementById('ma-view').value;
    const tpl = TEMPLATES[ex] || TEMPLATES.free;
    const result = tpl.analyze(this._frames, view);
    this._last = { exercise: ex, view, ts: new Date().toISOString(), kpis: result.kpis, flags: result.flags, framesCount: this._frames.length };
    this._renderResults(result);
    this._setStatus(`Analizado. ${this._frames.length} frames procesados.`);
  },

  _renderResults(res){
    document.getElementById('ma-results').style.display = 'block';
    const kpisEl = document.getElementById('ma-kpis');
    kpisEl.innerHTML = Object.entries(res.kpis).map(([k,v]) => `
      <div style="padding:8px 10px;background:var(--bg1);border:1px solid var(--border);border-radius:5px">
        <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.05em">${k}</div>
        <div style="font-size:15px;color:var(--text);font-weight:700;font-family:var(--mono);margin-top:2px">${v}</div>
      </div>`).join('');
    const flagsEl = document.getElementById('ma-flags');
    if (!res.flags.length){
      flagsEl.innerHTML = '<div style="padding:8px;background:rgba(57,255,122,.1);border:1px solid var(--neon);border-radius:5px;color:var(--neon);font-size:12px">✅ Sin alertas. Patrón motor correcto.</div>';
    } else {
      flagsEl.innerHTML = res.flags.map(f => {
        const c = f.lvl === 'red' ? 'var(--red)' : f.lvl === 'amber' ? 'var(--amber)' : 'var(--neon)';
        const ic = f.lvl === 'red' ? '🔴' : f.lvl === 'amber' ? '🟡' : '🟢';
        return `<div style="padding:6px 10px;background:rgba(0,0,0,.3);border-left:3px solid ${c};border-radius:3px;margin-bottom:4px;font-size:12px;color:var(--text)">${ic} ${f.msg}</div>`;
      }).join('');
    }
    this._drawChart();
  },

  _drawChart(){
    const c = document.getElementById('ma-chart');
    const ctx = c.getContext('2d');
    const w = c.width = c.clientWidth;
    const h = c.height = 160;
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,w,h);
    if (!this._frames.length) return;
    const series = [
      { key:'knee_l', col:'#39FF7A', label:'Rodilla IZQ' },
      { key:'knee_r', col:'#FF4060', label:'Rodilla DER' }
    ];
    const all = this._frames.flatMap(f => [f.knee_l, f.knee_r]).filter(x=>x!=null);
    if (!all.length) return;
    const min = Math.min(...all), max = Math.max(...all);
    const pad = 24;
    series.forEach(s => {
      ctx.strokeStyle = s.col; ctx.lineWidth = 2; ctx.beginPath();
      this._frames.forEach((f,i) => {
        const v = f[s.key]; if (v==null) return;
        const x = pad + (i/(this._frames.length-1)) * (w-pad*2);
        const y = h - pad - ((v-min)/(max-min)) * (h-pad*2);
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();
    });
    ctx.fillStyle = '#888'; ctx.font = '10px monospace';
    ctx.fillText(`${min.toFixed(0)}°`, 4, h-pad);
    ctx.fillText(`${max.toFixed(0)}°`, 4, pad+8);
    ctx.fillText('Rodilla IZQ', pad+4, 14);
    ctx.fillStyle = '#FF4060';
    ctx.fillText('Rodilla DER', pad+90, 14);
  },

  save(){
    if (!this._last){ alert('Nada que guardar'); return; }
    if (!cur) return;
    if (!Array.isArray(cur.movimiento)) cur.movimiento = [];
    cur.movimiento.push({ ...this._last, frames: this._frames.map(f => ({...f, _lm:undefined})) });
    if (typeof saveAtletas === 'function') saveAtletas();
    alert('Análisis guardado en historia del atleta.');
  },

  exportJSON(){
    if (!this._last) return;
    const data = JSON.stringify({ ...this._last, frames: this._frames }, null, 2);
    const blob = new Blob([data], { type:'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `move-analysis-${Date.now()}.json`;
    a.click();
  },

  _setStatus(s){
    const el = document.getElementById('ma-status');
    if (el) el.textContent = s;
  }
};

// Lazy init pose when tab opens
document.addEventListener('DOMContentLoaded', () => {
  // pre-warm: don't auto-init, esperar al primer uso
});

})();

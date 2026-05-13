// ── GLOBALS (compartidos entre módulos) ──
// cur, atletas, kineState, etc. se definen en app.js
// Este archivo asume que app.js ya fue cargado

function toggleSheetSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function initKlinicalSheet(panel) {
  // Build content based on which sheet opened
  if (panel === 'codo') { initCodoSheet(); return; }
  if (panel === 'hombro' || panel === 'munieca') initHombroSheet();
  if (panel === 'rodilla' || panel === 'cadera' || panel === 'gluteo') initRodillaSheet();
  if (panel === 'tobillo' || panel === 'pantorrilla' || panel === 'pie') initTobilloSheet();
  if (panel === 'cervical') { initCervicalSheet(); return; }
  if (panel === 'lumbar' || panel === 'lumbar-post' || panel === 'dorsal') initLBPSheet();
  if (panel === 'ingle') initGroinSheet();
}

function initHombroSheet() {
  buildHombroROM();
  buildHombroTests();
  buildHombroFuerza();
  buildASES();
  buildWORC();
  buildDASH();
}

function initRodillaSheet() {
  buildRodillaSPF();
  buildRodillaLCA();
  buildRodillaMenisco();
  buildHopRTP();
  buildVISAP();
}

function initTobilloSheet() {
  buildTobilloLig();
  buildSEBT();
  buildCAIT2();
  buildFAAM2();
  buildVISAA();
}

function initLBPSheet() {
  buildStartBack();
}

function initGroinSheet() {
  buildDoha();
  buildHAGOS();
}

// ── TAB SWITCHERS ──
function showHTab(tab, btn) {
  ['obs','rom','tests','fuerza','cuest'].forEach(t => {
    const el = document.getElementById('htab-' + t); if(el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-hombro .btn').forEach(b => {
    if(b.id && b.id.startsWith('htab-')) { b.className = 'btn btn-ghost btn-sm'; b.style.whiteSpace='nowrap'; b.style.fontSize='10px'; }
  });
  if(btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace='nowrap'; btn.style.fontSize='10px'; }
}
function showRTab(tab, btn) {
  ['spf','lca','lig','men','cuest','rtp'].forEach(t => {
    const el = document.getElementById('rtab-' + t); if(el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-rodilla .btn').forEach(b => {
    if(b.id && b.id.startsWith('rtab-')) { b.className = 'btn btn-ghost btn-sm'; b.style.whiteSpace='nowrap'; b.style.fontSize='10px'; }
  });
  if(btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace='nowrap'; btn.style.fontSize='10px'; }
}
function showTTab(tab, btn) {
  ['lig','func','tcuest','tvisa'].forEach(t => {
    const el = document.getElementById('ttab-' + t); if(el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-tobillo .btn').forEach(b => {
    if(b.id && b.id.startsWith('ttab-')) { b.className = 'btn btn-ghost btn-sm'; b.style.whiteSpace='nowrap'; b.style.fontSize='10px'; }
  });
  if(btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace='nowrap'; btn.style.fontSize='10px'; }
}
function setFAAMTab2(tab, btn) {
  document.getElementById('faam-avd-sheet').style.display = tab === 'avd' ? 'block' : 'none';
  document.getElementById('faam-dep-sheet').style.display = tab === 'dep' ? 'block' : 'none';
  document.querySelectorAll('#faam-avd-btn, #faam-dep-btn').forEach(b => b.className = 'btn btn-ghost btn-sm');
  if(btn) btn.className = 'btn btn-neon btn-sm';
}

// ── BUILDERS ──
function toggleOT(btn, type) {
  const siblings = btn.parentElement.querySelectorAll('.ot-btn');
  siblings.forEach(b => b.classList.remove('pos','neg'));
  btn.classList.add(type);
}

function saveKlinicalSheet(type) {
  if(!cur) return;
  if(!cur.klinical) cur.klinical = {};
  cur.klinical[type] = cur.klinical[type] || {};
  cur.klinical[type].fecha = new Date().toISOString().split('T')[0];
  // Save specific values based on type
  if(type==='rodilla') {
    cur.klinical.rodilla.kujala = +document.getElementById('kujala-input')?.value || null;
    cur.klinical.rodilla.visap = visapVals.reduce((a,b)=>a+(b||0),0);
  }
  if(type==='tobillo') {
    const caitTotal = caitVals2.filter(v=>v!==null).length===9 ? caitVals2.reduce((a,b)=>a+b,0) : null;
    cur.klinical.tobillo.cait = caitTotal;
    cur.klinical.tobillo.visaa = visaaVals.reduce((a,b)=>a+(b||0),0);
  }
  if(type==='codo') {
    cur.klinical.codo.pfgsD = +document.getElementById('pfgs-d')?.value || null;
    cur.klinical.codo.pfgsI = +document.getElementById('pfgs-i')?.value || null;
    cur.klinical.codo.gripD = +document.getElementById('grip-max-d')?.value || null;
    cur.klinical.codo.gripI = +document.getElementById('grip-max-i')?.value || null;
    cur.klinical.codo.prtee = calcPRTEEScore();
    cur.klinical.codo.qdash = calcCodoQDASH();
  }
  if(type==='cervical') {
    const ndiScore = cxNdiVals.filter(v=>v!==null).length===10 ? cxNdiVals.reduce((a,b)=>a+b,0) : null;
    const psfsAvg = cxPsfsVals.filter(v=>v!==null).length ? +(cxPsfsVals.filter(v=>v!==null).reduce((a,b)=>a+b,0)/cxPsfsVals.filter(v=>v!==null).length).toFixed(1) : null;
    cur.klinical.cervical.ndi = ndiScore;
    cur.klinical.cervical.psfs = psfsAvg;
    cur.klinical.cervical.nprs = +document.getElementById('cx-nprs')?.value || null;
    cur.klinical.cervical.clasificacion = document.querySelector('input[name="cx-clasificacion"]:checked')?.value || null;
    const nfeT = +document.getElementById('cx-nfe-tiempo')?.value || null;
    cur.klinical.cervical.nfe = nfeT;
    const cfrtD = +document.getElementById('cfrt-d')?.value || null;
    const cfrtI = +document.getElementById('cfrt-i')?.value || null;
    cur.klinical.cervical.cfrtD = cfrtD;
    cur.klinical.cervical.cfrtI = cfrtI;
  }
  atletas = atletas.map(a => a.id===cur.id ? cur : a);
  saveData();
  showSaveToast();
}


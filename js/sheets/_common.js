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
  if (panel === 'codo') {
    initCodoSheet();
    // Restaurar draft
    if(cur?.klinical?.codo?.draft && typeof _writeCodoSessionData === 'function') {
      setTimeout(() => _writeCodoSessionData(cur.klinical.codo.draft), 60);
    }
    return;
  }
  if (panel === 'hombro' || panel === 'munieca') {
    initHombroSheet();
    if(typeof refreshHombroSessionBar==='function') refreshHombroSessionBar();
    // Restaurar draft guardado con "Guardar evaluación hombro"
    if(cur?.klinical?.hombro?.draft && typeof _writeHombroSessionData === 'function') {
      setTimeout(() => _writeHombroSessionData(cur.klinical.hombro.draft), 60);
    }
  }
  if (panel === 'cadera' || panel === 'gluteo' || panel === 'ingle') { initCaderaSheet(); return; }
  if (panel === 'rodilla') initRodillaSheet();
  if (panel === 'tobillo' || panel === 'pantorrilla' || panel === 'pie') initTobilloSheet();
  if (panel === 'cervical') {
    initCervicalSheet();
    // Restaurar draft
    if(cur?.klinical?.cervical?.draft && typeof _writeCervicalSessionData === 'function') {
      setTimeout(() => _writeCervicalSessionData(cur.klinical.cervical.draft), 60);
    }
    return;
  }
  if (panel === 'lumbar' || panel === 'lumbar-post' || panel === 'dorsal') {
    initLBPSheet();
    // Restaurar draft
    if(cur?.klinical?.lbp?.draft && typeof _writeLBPSessionData === 'function') {
      setTimeout(() => _writeLBPSessionData(cur.klinical.lbp.draft), 60);
    }
  }
}

function initHombroSheet() {
  buildHombroROM();
  buildHombroTests();
  buildHombroFuerza();
  buildASES();
  buildWORC();
  buildDASH();
  if(typeof buildHombroRTP==='function') buildHombroRTP();
  if(typeof buildHombroInforme==='function') buildHombroInforme();
  if(typeof renderDiagnosticosHombro==='function') renderDiagnosticosHombro();
  if(typeof refreshHombroSessionBar==='function') refreshHombroSessionBar();
}

function initRodillaSheet() {
  buildRodillaSPF();
  buildRodillaLCA();
  buildRodillaMenisco();
  buildRodillaCondral();
  buildHopRTP();
  buildACLRSI();
  buildVISAP();
  buildKOOS();
  buildWOMET();
  buildLysholm();
  buildTegner();
  buildMarx();
}

function initTobilloSheet() {
  buildTobilloEsguince();
  buildTobilloSindesmosis();
  buildTobilloAquiles();
  buildTobilloHopTests();
  buildSEBT();
  buildFascitisPlantar();
  buildCAIT2();
  buildFAAM2();
  buildVISAA();
}

function initLBPSheet() {
  initLumbarSheet();
}

function initGroinSheet() {
  buildDoha();
  buildHAGOS();
}

// ── TAB SWITCHERS ──
function showHTab(tab, btn) {
  // Lazy-init: build content on first tab switch if modal opened without initKlinicalSheet
  const romFields = document.getElementById('hombro-rom-fields');
  if (romFields && !romFields.innerHTML) initHombroSheet();
  ['obs','rom','tests','fuerza','cuest','rtp','informe'].forEach(t => {
    const el = document.getElementById('htab-' + t); if(el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-hombro .btn').forEach(b => {
    if(b.id && b.id.startsWith('htab-')) { b.className = 'btn btn-ghost btn-sm'; b.style.whiteSpace='nowrap'; b.style.fontSize='10px'; }
  });
  if(btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace='nowrap'; btn.style.fontSize='10px'; }
}
function showRTab(tab, btn) {
  ['spf','lca','lig','men','cuest','rtp','cond','itbs','inf'].forEach(t => {
    const el = document.getElementById('rtab-' + t); if(el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#sheet-rodilla .btn').forEach(b => {
    if(b.id && b.id.startsWith('rtab-')) { b.className = 'btn btn-ghost btn-sm'; b.style.whiteSpace='nowrap'; b.style.fontSize='10px'; }
  });
  if(btn) { btn.className = 'btn btn-neon btn-sm'; btn.style.whiteSpace='nowrap'; btn.style.fontSize='10px'; }
}
function showTTab(tab, btn) {
  ['esguince','sindes','aquiles','func','escalas','tinforme'].forEach(t => {
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
    // Draft completo (para restaurar al reabrir modal)
    if(typeof _readCervicalSessionData === 'function') {
      cur.klinical.cervical.draft = _readCervicalSessionData();
    }
  }
  if(type==='hombro') {
    // Guardar snapshot completo del formulario (tests, ROM, escalas, RTP, obs)
    if(typeof _readHombroSessionData === 'function') {
      if(!cur.klinical.hombro) cur.klinical.hombro = {};
      cur.klinical.hombro.draft = _readHombroSessionData();
    }
  }
  if(type==='codo') {
    // Guardar snapshot completo del formulario codo
    if(typeof _readCodoSessionData === 'function') {
      if(!cur.klinical.codo) cur.klinical.codo = {};
      cur.klinical.codo.draft = _readCodoSessionData();
    }
  }
  if(type==='lbp') {
    if(typeof _readLBPSessionData === 'function') {
      if(!cur.klinical.lbp) cur.klinical.lbp = {};
      cur.klinical.lbp.draft = _readLBPSessionData();
    }
  }
  atletas = atletas.map(a => a.id===cur.id ? cur : a);
  saveData();
  showSaveToast();
}

// ── PRE-BUILD ALL SHEETS AT PAGE LOAD ──────────────────────────────────────
// Ensures tab content exists regardless of how modals are opened.
// DOMContentLoaded fires after all <script> tags parsed → all builders defined.
document.addEventListener('DOMContentLoaded', function() {
  try { initHombroSheet();   } catch(e) { console.error('initHombroSheet',e); }
  try { initRodillaSheet();  } catch(e) { console.error('initRodillaSheet',e); }
  try { initTobilloSheet();  } catch(e) { console.error('initTobilloSheet',e); }
  try { initLBPSheet();      } catch(e) { console.error('initLBPSheet',e); }
  try { initGroinSheet();    } catch(e) { console.error('initGroinSheet',e); }
  try { if(typeof initCodoSheet==='function')    initCodoSheet();    } catch(e) { console.error('initCodoSheet',e); }
  try { if(typeof initCervicalSheet==='function') initCervicalSheet(); } catch(e) { console.error('initCervicalSheet',e); }
  try { if(typeof initCaderaSheet==='function')  initCaderaSheet();  } catch(e) { console.error('initCaderaSheet',e); }
});


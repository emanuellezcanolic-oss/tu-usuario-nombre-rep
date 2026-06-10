// ══════════════════════════════════════════════════════════════
//  MoveMetrics v12 -- JavaScript completo
// ══════════════════════════════════════════════════════════════

// ── API KEY MANAGER ──
// La key se guarda en localStorage del navegador.
// Nunca queda expuesta en el código fuente.
function getApiKey() {
  return localStorage.getItem('mm_api_key') || '';
}
function saveApiKey(key) {
  localStorage.setItem('mm_api_key', key.trim());
}
function clearApiKey() {
  localStorage.removeItem('mm_api_key');
}
function hasApiKey() {
  return !!getApiKey();
}

function showApiKeyModal() {
  const existing = getApiKey();
  const modal = document.createElement('div');
  modal.id = 'api-key-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)';
  modal.innerHTML = `
    <div style="background:#0f0f0f;border:1px solid rgba(57,255,122,.25);border-radius:16px;padding:32px 28px;width:100%;max-width:420px;margin:16px">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#39FF7A;letter-spacing:.12em;margin-bottom:8px;text-transform:uppercase">∧ MoveMetrics</div>
      <div style="font-size:20px;font-weight:700;margin-bottom:6px;color:#f0f0f0">API Key de Anthropic</div>
      <div style="font-size:13px;color:#888;margin-bottom:20px;line-height:1.6">
        Ingresá tu API Key para generar informes con IA.<br>
        Se guarda <b style="color:#f0f0f0">solo en tu navegador</b> -- nunca se sube a ningún servidor.
      </div>
      <input id="api-key-input" type="password"
        placeholder="sk-ant-api03-..."
        value="${existing}"
        style="width:100%;background:#141414;border:1px solid rgba(57,255,122,.2);border-radius:8px;color:#f0f0f0;padding:10px 14px;font-size:13px;font-family:'JetBrains Mono',monospace;outline:none;margin-bottom:8px;box-sizing:border-box"
      >
      <div style="font-size:11px;color:#3a3a3a;margin-bottom:16px;font-family:'JetBrains Mono',monospace">
        Obtené tu key gratis en console.groq.com → API Keys
      </div>
      <div style="display:flex;gap:10px">
        <button onclick="
          const k=document.getElementById('api-key-input').value.trim();
          if(!k){alert('Ingresá una API Key');return;}
          saveApiKey(k);
          document.getElementById('api-key-modal').remove();
          showSaveToast();
        " style="flex:1;background:#39FF7A;color:#000;border:none;border-radius:8px;padding:11px;font-weight:700;font-size:13px;cursor:pointer">
          Guardar y continuar
        </button>
        ${existing ? `<button onclick="document.getElementById('api-key-modal').remove()" style="background:#1c1c1c;color:#888;border:1px solid #252525;border-radius:8px;padding:11px 16px;font-size:13px;cursor:pointer">Cancelar</button>` : ''}
      </div>
      ${existing ? `<div style="text-align:center;margin-top:12px"><button onclick="clearApiKey();document.getElementById('api-key-input').value=''" style="background:none;border:none;color:#3a3a3a;font-size:11px;cursor:pointer;text-decoration:underline">Borrar key guardada</button></div>` : ''}
    </div>`;
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('api-key-input')?.focus(), 100);
}

// ── DATOS GLOBALES ──
let atletas = JSON.parse(localStorage.getItem('mm_v12_atletas') || '[]');
let cur = null;
let fvChart = null, radarChart = null, movRadarChart = null, dashFvChart = null;
let fvRowCount = 0;
let _pendingPhoto = null;
let _lastFvEj = null;
let kineState = { bodyZones: {}, tests: {}, form: {} };

// ── CONSTANTES ──
const VMP_REF = {
  sentadilla: 0.32, 'press-banca': 0.18, 'peso-muerto': 0.14,
  'bench-pull': 0.53, 'hip-thrust': 0.24, 'media-sent': 0.33,
  'military-press': 0.20, dominadas: 0.22
};

const STR_NORMS = {
  sentadilla:   { name: 'Sentadilla',    red: 1.0,  amber: 1.5 },
  'press-banca':{ name: 'Press Banca',   red: 0.75, amber: 1.25 },
  'peso-muerto':{ name: 'Peso Muerto',   red: 1.25, amber: 2.0 },
  'hip-thrust': { name: 'Hip Thrust',    red: 1.0,  amber: 2.0 }
};

const RUGBY = {
  pilares:       { n:'Pilares (1/3)',      tipo:'Forward', squat:[155,165,175], vert:[35,37.5,40], horiz:[2.10,2.20,2.30], sp10:[1.75,1.70,1.65] },
  hooker:        { n:'Hooker (2)',         tipo:'Forward', squat:[145,155,165], vert:[35,37.5,40], horiz:[2.15,2.25,2.30], sp10:[1.74,1.69,1.64] },
  '2da-linea':   { n:'2da Línea (4/5)',   tipo:'Forward', squat:[130,140,150], vert:[40,42.5,45], horiz:[2.25,2.30,2.40], sp10:[1.72,1.67,1.62] },
  '3ras-lineas': { n:'3ras Líneas (6/7/8)',tipo:'Forward',squat:[135,145,155], vert:[45,47.5,50], horiz:[2.40,2.45,2.50], sp10:[1.68,1.63,1.58] },
  'medio-scrum': { n:'Medio Scrum (9)',   tipo:'Back',    squat:[120,130,140], vert:[47.5,50,52.5],horiz:[2.30,2.40,2.45],sp10:[1.63,1.58,1.53] },
  apertura:      { n:'Apertura (10)',      tipo:'Back',    squat:[125,135,145], vert:[47.5,50,52.5],horiz:[2.35,2.45,2.50],sp10:[1.62,1.57,1.52] },
  centros:       { n:'Centros (12/13)',    tipo:'Back',    squat:[125,135,145], vert:[47.5,50,52.5],horiz:[2.35,2.45,2.50],sp10:[1.62,1.57,1.52] },
  'wing-fb':     { n:'Wings/FB (11/14/15)',tipo:'Back',   squat:[120,130,140], vert:[50,52.5,55],  horiz:[2.40,2.50,2.55],sp10:[1.58,1.53,1.48] }
};

const SPRINT_NORMS = {
  Rugby:   { Forward:{ sp10:[1.78,1.72,1.65], sp30:[4.50,4.35,4.20], ttest:[9.8,9.5,9.2]  },
             Back:   { sp10:[1.70,1.63,1.57], sp30:[4.25,4.10,3.95], ttest:[9.5,9.2,8.9]  } },
  Fútbol:  { general:{ sp10:[1.75,1.70,1.65], sp30:[4.30,4.20,4.10], ttest:[9.6,9.3,9.0]  } },
  Básquet: { general:{ sp10:[1.80,1.74,1.68], sp30:[4.45,4.30,4.15], ttest:[9.9,9.6,9.3]  } }
};

// ── BATERIA COMPLETA BOSCO ──
const SALTOS_DEF = [
  // Verticales bilaterales
  { key:'sj',   label:'SJ',             icon:'', unit:'cm', type:'bilateral',  cat:'vertical',   desc:'Squat Jump -- fuerza explosiva pura' },
  { key:'cmj',  label:'CMJ',            icon:'', unit:'cm', type:'bilateral',  cat:'vertical',   desc:'Countermovement Jump -- fuerza elastico-explosiva' },
  { key:'abk',  label:'Abalakov',       icon:'', unit:'cm', type:'bilateral',  cat:'vertical',   desc:'CMJ con brazos -- coordin. neuromotora' },
  { key:'dj',   label:'Drop Jump',      icon:'', unit:'cm', type:'bilateral',  cat:'vertical',   desc:'DJ 20-40cm -- fuerza reflejo-elastico-explosiva', hasRSI:true },
  { key:'ms15', label:'Multi-salto 15s',icon:'', unit:'W/kg',type:'bilateral', cat:'vertical',   desc:'Potencia anaerob. alactica -- 15 segundos' },
  // Horizontales unilaterales
  { key:'bj',   label:'Broad Jump',     icon:'', unit:'cm', type:'bilateral',  cat:'horizontal', desc:'Salto horizontal bilateral' },
  { key:'sh',   label:'Single Hop',     icon:'', unit:'cm', type:'unilateral', cat:'horizontal', desc:'Hop for distance -- LSI' },
  { key:'3h',   label:'Triple Hop',     icon:'', unit:'cm', type:'unilateral', cat:'horizontal', desc:'Triple Hop for distance -- LSI' },
  { key:'ch',   label:'Cross-over Hop', icon:'', unit:'cm', type:'unilateral', cat:'horizontal', desc:'Cross-over 3 saltos -- LSI' },
  { key:'t6h',  label:'Timed 6m Hop',   icon:'', unit:'s',  type:'unilateral', cat:'horizontal', desc:'6 metros -- tiempo -- LSI', lowerIsBetter:true },
  { key:'djb',  label:'DJ Unilateral',  icon:'', unit:'cm', type:'unilateral', cat:'vertical',   desc:'Drop Jump unilateral -- LSI + RSI', hasRSI:true },
  { key:'sideh',label:'Side Hop',       icon:'', unit:'reps',type:'unilateral',cat:'horizontal', desc:'Saltos laterales 30s -- Gustavsson' }
];

// Normas Bosco (Garrido-Chamorro, EFDeportes 2004, N=765 deportistas alto nivel)
const BOSCO_NORMS = {
  sj:  { male:{ mean:34.49, sd:5.13 }, female:{ mean:26.31, sd:4.47 } },
  cmj: { male:{ mean:39.23, sd:5.58 }, female:{ mean:29.47, sd:10.86 } },
  abk: { male:{ mean:47.20, sd:10.23 }, female:{ mean:33.49, sd:5.30 } },
  ms15:{ male:{ mean:38.18, sd:15.43 }, female:{ mean:32.61, sd:11.57 } }
};

// Normas Side Hop -- Gustavsson et al. (2006)
const SIDEHOP_NORMS = { male:{ min:55 }, female:{ min:41 } };

// Normas Hop Tests -- LSI return to sport (Limb Symmetry Index)
// Referencia: Noyes et al. 1991, Moksnes & Risberg 2009, Reid et al. 2007
const HOP_NORMS = {
  sh:  {
    lsi_rts: 90,   // % LSI minimo para retorno al deporte
    lsi_elite: 95, // % LSI atletas elite
    // Valores absolutos referencia (cm) -- adultos activos
    male:   { mean: 165, sd: 20 },
    female: { mean: 135, sd: 18 }
  },
  '3h': {
    lsi_rts: 90,
    lsi_elite: 95,
    male:   { mean: 490, sd: 55 },
    female: { mean: 400, sd: 48 }
  },
  ch: {
    lsi_rts: 90,
    lsi_elite: 95,
    male:   { mean: 480, sd: 52 },
    female: { mean: 385, sd: 45 }
  },
  t6h: {
    lsi_rts: 90,
    lsi_elite: 95,
    lowerIsBetter: true,
    // Menor tiempo = mejor -- LSI se calcula al reves
    male:   { mean: 2.1, sd: 0.3 },  // segundos
    female: { mean: 2.4, sd: 0.3 }
  },
  djb: {
    lsi_rts: 90,
    lsi_elite: 95,
    male:   { mean: 28, sd: 6 },
    female: { mean: 22, sd: 5 }
  }
};


// ══════════════════════════════════════════════════════
//  NAVEGACIÓN
// ══════════════════════════════════════════════════════

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.mn-btn').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id)?.classList.add('active');
  const navMap = { atletas: 0, tests: 1, ajustes: 2 };
  const idx = navMap[id];
  if (idx !== undefined) {
    document.querySelectorAll('.nav-item')[idx]?.classList.add('active');
    document.querySelectorAll('.mn-btn')[idx]?.classList.add('active');
  }
}

function showProfileTab(tab, btn) {
  const tabs = ['dashboard','kinesio','fuerza','saltos','movilidad','velocidad','fms','fatiga','video','vmp','historial','adultomayor'];
  tabs.forEach(t => document.getElementById('ptab-' + t)?.classList.toggle('hidden', t !== tab));
  document.querySelectorAll('#profile-tab-bar .ptab').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');
  if (tab === 'dashboard')  renderDashboard();
  if (tab === 'historial')  renderHistorial();
  if (tab === 'kinesio')    initKinesio();
  if (tab === 'fuerza')     renderFVHist();
  if (tab === 'saltos')     { renderSimetriasTabla(); }
  if (tab === 'fuerza')     { initFVTools(); updatePrePostSelects(); initPlanillas(); }
  if (tab === 'saltos')     { initPlanillas(); }
  if (tab === 'velocidad')  { initTrineo(); buildIFTRefTable(); }
  if (tab === 'fatiga')     { }
  if (tab === 'adultomayor') {
    if (typeof initAdultoMayorSheet === 'function') initAdultoMayorSheet();
    if (typeof showAmTab === 'function') {
      const firstBtn = document.querySelector('.am-tab-btn[data-tab="funcional"]');
      showAmTab('funcional', firstBtn);
    }
  }
  if (tab === 'movilidad') {
    setTimeout(redrawGauges, 60);
    const amPanel = document.getElementById('adulto-mayor-tests');
    if (amPanel && cur) {
      amPanel.classList.toggle('hidden', cur.deporte !== 'Adulto Mayor');
      if (cur.deporte === 'Adulto Mayor') {
        if (cur.sitToStand) document.getElementById('sts-reps').value = cur.sitToStand;
        if (cur.unipodal)   document.getElementById('unipodal-seg').value = cur.unipodal;
        if (cur.tug)        document.getElementById('tug-seg').value = cur.tug;
        if (cur.dist6min)   document.getElementById('dist6min-m').value = cur.dist6min;
      }
    }
  }
}

function openModal(id)  { document.getElementById(id).classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }

// ══════════════════════════════════════════════════════
//  PERSISTENCIA
// ══════════════════════════════════════════════════════

function saveData() {
  localStorage.setItem('mm_v12_atletas', JSON.stringify(atletas));
  showSaveToast();
}

function showSaveToast() {
  const t = document.getElementById('save-toast');
  if (!t) return;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.style.opacity = '0', 2000);
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach(m =>
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); })
  );
  renderAtletas();
  buildSaltosGrid();
  buildHooperFields();
  for (let i = 0; i < 5; i++) addFVRow();
  _lastFvEj = document.getElementById('fv-ej')?.value || null;
  const today = new Date().toISOString().split('T')[0];
  ['fv-fecha','saltos-fecha','sprint-fecha','fat-fecha','kine-fecha'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = today;
  });
  ['g-ld','g-li','g-tcd','g-tci'].forEach(id => drawGauge(id, 0, 0, 100, 'lunge'));
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (cur) saveData(); }
  });
});

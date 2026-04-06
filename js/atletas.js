// ── GLOBALS (compartidos entre módulos) ──
// cur, atletas, kineState, etc. se definen en app.js
// Este archivo asume que app.js ya fue cargado

function setSvc(v) {
  document.getElementById('s-servicio').value = v;
  document.getElementById('svc-rend').className = 'btn btn-full ' + (v === 'rendimiento' ? 'btn-neon' : 'btn-ghost');
  document.getElementById('svc-kine').className = 'btn btn-full ' + (v === 'kinesio'     ? 'btn-neon' : 'btn-ghost');
}

function checkRugby() {
  const d = document.getElementById('s-deporte').value;
  document.getElementById('rugby-sec').classList.toggle('hidden', d !== 'Rugby');
}

function previewFormPhoto(input) {
  if (!input.files.length) return;
  const reader = new FileReader();
  reader.onload = e => {
    _pendingPhoto = e.target.result;
    const prev = document.getElementById('form-photo-prev');
    if (prev) { prev.innerHTML = ''; const img = document.createElement('img'); img.src = _pendingPhoto; img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:12px'; prev.appendChild(img); }
  };
  reader.readAsDataURL(input.files[0]);
}

function updateProfilePhoto(input) {
  if (!input.files.length || !cur) return;
  const reader = new FileReader();
  reader.onload = e => {
    cur.foto = e.target.result;
    atletas = atletas.map(a => a.id === cur.id ? cur : a);
    saveData();
    renderProfileHero();
    renderAtletas();
  };
  reader.readAsDataURL(input.files[0]);
}

function prepNewAtleta() {
  document.getElementById('form-title').textContent = 'Nuevo atleta';
  document.getElementById('edit-id').value = '';
  ['s-nombre','s-edad','s-peso','s-talla','s-pierna','s-lesion','s-email'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  ['s-sexo','s-deporte','s-nivel','s-objetivo','s-puesto'].forEach(id => {
    const el = document.getElementById(id); if (el) el.selectedIndex = 0;
  });
  document.getElementById('rugby-sec').classList.add('hidden');
  setSvc('rendimiento');
  const prev = document.getElementById('form-photo-prev'); if (prev) prev.innerHTML = '👤';
  _pendingPhoto = null;
}

function editAtletaById(id) {
  const s = atletas.find(a => a.id === id); if (!s) return;
  cur = s;
  document.getElementById('form-title').textContent = 'Editar atleta';
  document.getElementById('edit-id').value = s.id;
  ['nombre','edad','peso','talla','pierna','lesion','email'].forEach(k => {
    const el = document.getElementById('s-' + k); if (el) el.value = s[k] || '';
  });
  setSvc(s.servicio || 'rendimiento');
  ['sexo','deporte','nivel','objetivo','puesto'].forEach(k => {
    const el = document.getElementById('s-' + k); if (el && s[k]) el.value = s[k];
  });
  document.getElementById('rugby-sec').classList.toggle('hidden', s.deporte !== 'Rugby');
  const prev = document.getElementById('form-photo-prev');
  if (prev) {
    if (s.foto) { prev.innerHTML = ''; const img = document.createElement('img'); img.src = s.foto; img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:12px'; prev.appendChild(img); }
    else prev.innerHTML = '👤';
  }
  _pendingPhoto = null;
  openModal('modal-atleta-form');
}

function saveAtleta() {
  const nombre = document.getElementById('s-nombre').value.trim();
  if (!nombre) { alert('Ingresá el nombre'); return; }
  const eid = +document.getElementById('edit-id').value || null;
  const existing = eid ? atletas.find(a => a.id === eid) : null;
  const data = {
    id:       eid || Date.now(),
    nombre,
    edad:     document.getElementById('s-edad').value,
    sexo:     document.getElementById('s-sexo').value,
    peso:     document.getElementById('s-peso').value,
    talla:    document.getElementById('s-talla').value,
    pierna:   document.getElementById('s-pierna').value,
    servicio: document.getElementById('s-servicio').value,
    deporte:  document.getElementById('s-deporte').value,
    puesto:   document.getElementById('s-puesto').value,
    nivel:    document.getElementById('s-nivel').value,
    objetivo: document.getElementById('s-objetivo').value,
    lesion:   document.getElementById('s-lesion').value,
    email:    document.getElementById('s-email').value,
    foto:     _pendingPhoto || existing?.foto || null,
    creado:   existing?.creado || new Date().toISOString(),
    evals:    existing?.evals || {},
    evalsByDate: existing?.evalsByDate || {},
    kinesio:  existing?.kinesio || null
  };
  _pendingPhoto = null;
  if (eid) atletas = atletas.map(a => a.id === eid ? data : a);
  else atletas.push(data);
  if (!eid || cur?.id === eid) cur = data;
  saveData();
  closeModal('modal-atleta-form');
  renderAtletas();
  if (cur?.id === data.id) renderProfileHero();
}

function deleteAtleta(id, ev) {
  ev?.stopPropagation();
  if (!confirm('¿Eliminar este atleta y todos sus datos?')) return;
  atletas = atletas.filter(a => a.id !== id);
  if (cur?.id === id) { cur = null; showPage('atletas'); }
  saveData(); renderAtletas();
}

function selectAtleta(id) {
  cur = atletas.find(a => a.id === id);
  if (!cur) return;
  document.getElementById('sb-atleta-info').textContent = cur.nombre;
  document.getElementById('tests-atleta-indicator').textContent = cur.nombre;
  document.getElementById('profile-hero-area').style.display = 'block';
  renderProfileHero();
  showPage('tests');
  showProfileTab('dashboard', document.querySelector('.ptab'));
}

function renderAtletas() {
  const grid = document.getElementById('atletas-grid');
  document.getElementById('atletas-count').textContent =
    atletas.length + ' atleta' + (atletas.length !== 1 ? 's' : '') + ' registrado' + (atletas.length !== 1 ? 's' : '');
  if (!atletas.length) {
    grid.innerHTML = [
      '<div style="grid-column:1/-1;text-align:center;padding:100px 20px">',
      '<div style="width:80px;height:80px;border-radius:20px;background:rgba(57,255,122,.06);',
      'border:1px solid rgba(57,255,122,.12);display:flex;align-items:center;',
      'justify-content:center;font-size:32px;margin:0 auto 24px">&#128100;</div>',
      '<div style="font-size:32px;font-weight:800;letter-spacing:.08em;color:#fff;margin-bottom:10px">SIN ATLETAS</div>',
      '<p style="font-size:13px;color:rgba(255,255,255,.3);line-height:1.8">',
      'Crea tu primer atleta para comenzar.</p></div>'
    ].join('');
    return;
  }
  grid.innerHTML = atletas.map(s => {
    const evalCount = Object.keys(s.evals || {}).length;
    const hasInjury = s.lesion || (s.kinesio && Object.values(s.kinesio.bodyZones || {}).some(z => !z.recuperado));
    const photoHtml = s.foto
      ? `<img src="${s.foto}" style="width:40px;height:40px;border-radius:10px;object-fit:cover;border:1px solid var(--border2);flex-shrink:0">`
      : `<div class="athlete-av-sm">${s.nombre.charAt(0)}</div>`;
    return `<div class="athlete-card ${hasInjury ? 'has-injury' : ''}" onclick="selectAtleta(${s.id})">
      <div class="athlete-card-inner">
        <div class="flex mb-12" style="align-items:flex-start;gap:14px">
          ${photoHtml}
          <div style="flex:1;min-width:0">
            <div style="font-size:16px;font-weight:800;margin-bottom:3px;color:#fff;letter-spacing:-.3px">${s.nombre}</div>
            <div style="font-size:11px;color:rgba(255,255,255,.4);margin-bottom:4px">${s.deporte || 'Sin deporte'}${s.puesto ? ' · ' + s.puesto : ''} · ${s.edad || '?'} años · ${s.peso || '?'} kg</div>
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:10px;font-weight:700;color:var(--neon);font-family:var(--mono)">${s.servicio === 'kinesio' ? '🏥 KINESIO' : '⚡ RENDIMIENTO'}</span>
              ${s.lesion ? `<span style="font-size:10px;color:var(--amber)">· 📌 ${s.lesion}</span>` : ''}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end">
            <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();editAtletaById(${s.id})" style="padding:4px 8px;font-size:10px;opacity:.5">✏️</button>
            <button class="btn btn-red btn-sm"   onclick="deleteAtleta(${s.id},event)" style="padding:4px 8px;font-size:10px;opacity:.5">🗑️</button>
          </div>
        </div>
        <div style="height:1px;background:rgba(255,255,255,.05);margin-bottom:12px"></div>
        <div style="display:flex;gap:6px;align-items:center;justify-content:space-between">
          <div style="display:flex;gap:5px">
            <span class="tag ${s.nivel === 'elite' ? 'tag-g' : s.nivel === 'semi-pro' ? 'tag-b' : 'tag-y'}">${s.nivel || '--'}</span>
            <span class="tag" style="background:rgba(255,255,255,.05);color:rgba(255,255,255,.4)">${evalCount} eval</span>
          </div>
          ${hasInjury ? '<span style="font-size:9px;font-family:var(--mono);color:var(--red);font-weight:700">● LESIÓN ACTIVA</span>' : '<span style="font-size:9px;font-family:var(--mono);color:rgba(57,255,122,.4)">● ACTIVO</span>'}
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterAtletas(q) {
  const f = atletas.filter(s =>
    s.nombre.toLowerCase().includes(q.toLowerCase()) ||
    (s.deporte || '').toLowerCase().includes(q.toLowerCase())
  );
  const grid = document.getElementById('atletas-grid');
  grid.innerHTML = f.map(s => `
    <div class="athlete-card" onclick="selectAtleta(${s.id})">
      <div class="flex gap-12"><div class="athlete-av-sm">${s.nombre.charAt(0)}</div>
      <div><div style="font-size:14px;font-weight:700">${s.nombre}</div><div style="font-size:11px;color:var(--text2)">${s.deporte || '--'}</div></div></div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════
//  PROFILE HERO
// ══════════════════════════════════════════════════════

function renderProfileHero() {
  if (!cur) return;
  const s = cur;
  document.getElementById('tests-atleta-indicator').textContent = s.nombre;
  // Avatar
  const av = document.getElementById('profile-av-lg');
  if (av) {
    if (s.foto) { av.innerHTML = `<img src="${s.foto}"><div class="profile-av-edit">✏️</div>`; }
    else { av.textContent = s.nombre.charAt(0); av.innerHTML += '<div class="profile-av-edit">✏️</div>'; }
  }
  document.getElementById('profile-meta').textContent =
    `${s.deporte || '--'}${s.puesto ? ' · ' + s.puesto : ''} · ${s.edad || '?'} años · ${s.peso || '?'} kg · ${s.talla || '?'} cm`;
  const tags = document.getElementById('profile-tags');
  if (tags) tags.innerHTML = [
    `<span class="tag tag-g">${s.objetivo || '--'}</span>`,
    `<span class="tag tag-b">${s.nivel || '--'}</span>`,
    s.lesion ? `<span class="tag tag-y">📌 ${s.lesion}</span>` : ''
  ].join(' ');
  // Fuerza relativa KPI
  const frkpi = document.getElementById('fuerza-rel-kpi');
  if (frkpi && s.lastFV?.oneRM && s.peso) {
    const ratio = (s.lastFV.oneRM / +s.peso).toFixed(2);
    const normKey = Object.keys(STR_NORMS).find(k => s.lastFV.ejercicio?.toLowerCase().includes(STR_NORMS[k].name.toLowerCase().split(' ')[0].toLowerCase()));
    const norm = STR_NORMS[normKey];
    const color = norm ? (+ratio >= norm.amber ? 'var(--neon)' : +ratio >= norm.red ? 'var(--amber)' : 'var(--red)') : 'var(--neon)';
    const label = norm ? (+ratio >= norm.amber ? 'Elite' : +ratio >= norm.red ? 'Moderado' : 'Déficit') : '--';
    frkpi.innerHTML = `<div style="text-align:right"><div class="il">Fuerza Relativa</div><div style="font-family:var(--mono);font-size:22px;font-weight:800;color:${color};text-shadow:0 0 12px ${color}">${ratio}×PC</div><span class="tag" style="background:${color}22;color:${color}">${label}</span></div>`;
  } else if (frkpi) frkpi.innerHTML = '';
  // Stats
  const lastSp = getLastEval('sprint');
  const evalTotal = Object.keys(s.evals || {}).length;
  const statsRow = document.getElementById('profile-stats-row');
  if (statsRow) statsRow.innerHTML = `
    <div class="kpi ${s.lastCMJ >= 40 ? 'kpi-green' : s.lastCMJ >= 30 ? '' : s.lastCMJ ? 'kpi-red' : ''}">
      <div class="kpi-label">CMJ último</div>
      <div class="kpi-val">${s.lastCMJ ? s.lastCMJ.toFixed(1) : '--'}</div>
      <div class="kpi-sub">cm altura</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">1RM estimado</div>
      <div class="kpi-val">${s.lastFV?.oneRM ? s.lastFV.oneRM.toFixed(0) : '--'}</div>
      <div class="kpi-sub">${s.lastFV?.ejercicio || '--'}</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">10m sprint</div>
      <div class="kpi-val">${lastSp?.sp10 || '--'}</div>
      <div class="kpi-sub">segundos</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Evaluaciones</div>
      <div class="kpi-val">${evalTotal}</div>
      <div class="kpi-sub">registros</div>
    </div>`;
  // Kinesio badge en tab
  const kineTab = document.getElementById('tab-kinesio');
  if (kineTab) {
    const activeZones = Object.values(s.kinesio?.bodyZones || {}).filter(z => !z.recuperado).length;
    kineTab.textContent = activeZones ? `🏥 Kinesio 🔴${activeZones}` : '🏥 Kinesio';
    kineTab.classList.toggle('kine-active', activeZones > 0);
  }
}

function getLastEval(type) {
  if (!cur) return null;
  return Object.entries(cur.evals || {})
    .filter(([k]) => k.startsWith(type + '_'))
    .map(([, v]) => v)
    .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))[0] || null;
}

// ══════════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════════

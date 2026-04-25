// ThreeBodyChart.js — viewer 3D anatomía (Three.js + Z-Anatomy GLB)
// Renderiza dentro de #three-body-chart. Carga body_skin/muscle/skeleton.glb
// desde /assets. Click en malla → identifica nombre → mapea a panel clínico.

(function(){
'use strict';

const ASSET_BASE = 'assets/';
const LAYERS = [
  { id:'skeleton', file:'body_skeleton.glb', label:'🦴 Esqueleto', color:0xeeeede, opacity:1.0 },
  { id:'muscle',   file:'body_muscle.glb',   label:'💪 Músculos',  color:0xb84a3c, opacity:0.92 },
  { id:'skin',     file:'body_skin.glb',     label:'👤 Piel',      color:0xd9b39a, opacity:0.35 },
];

// Mapeo: substring de nombre de malla (Z-Anatomy usa nombres anatómicos en latín/EN)
// → panel clínico de MoveMetrics. Sin match → solo muestra el label.
const MESH_TO_PANEL = [
  // miembro superior
  ['shoulder|deltoid|scapul|clavic|acromio|rotator|supraspinat|infraspinat|subscapul|teres', 'hombro'],
  ['elbow|biceps|triceps|brachi|olecra|radius|ulna(?!r)', 'codo'],
  ['wrist|carpal|hand|finger|metacarp|phalan(?!.*pelvi)', 'hombro'],
  // tronco
  ['cervical|atlas|axis|neck|sternoclei|trapez', 'cervical'],
  ['thoracic|rib|sternum|pectoral|latissimus|abdomin|oblique|rectus.abd', 'lumbar'],
  ['lumbar|lower.back|psoas|quadratus.lumb|erector', 'lumbar'],
  // miembro inferior
  ['hip|pelvi|ilium|ischium|pubis|gluteu|piriform', 'cadera'],
  ['adductor|gracilis|sartorius|groin|inguinal', 'ingle'],
  ['knee|patell|menisc|cruciate|collateral|quadricep|hamstring|biceps.fem|semitend|semimembr', 'rodilla'],
  ['ankle|talus|calcaneus|tibial|fibul|peroneus|gastrocn|soleus|achilles|tendo.calc', 'tobillo'],
  ['foot|tarsal|metatarsal|toe|plantar|halluc', 'tobillo'],
];

const SHEET_MAP_3D = {
  hombro:'sheet-hombro', cervical:'sheet-cervical', lumbar:'sheet-lumbar',
  rodilla:'sheet-rodilla', tobillo:'sheet-tobillo', codo:'sheet-codo',
  cadera:'sheet-rodilla', ingle:'sheet-groin'
};

function meshToPanel(name){
  const n = (name || '').toLowerCase();
  for (const [pat, panel] of MESH_TO_PANEL){
    if (new RegExp(pat, 'i').test(n)) return panel;
  }
  return null;
}

const TBC = window.TBC = {
  scene:null, camera:null, renderer:null, controls:null, raycaster:null,
  mouse:{x:0,y:0}, container:null, root:null,
  layerObjs: {}, // id → THREE.Group
  layerOn:   { skeleton:true, muscle:true, skin:false },
  hovered:   null, selected:null,
  _origMat: new WeakMap(),
  _started:false,

  init(){
    if (this._started) return;
    this.root = document.getElementById('three-body-chart');
    if (!this.root) return;
    if (typeof THREE === 'undefined'){
      this.root.innerHTML = `<div style="padding:24px;color:var(--red);text-align:center">Three.js no cargó. Verificá conexión.</div>`;
      return;
    }
    this._buildUI();
    this._initThree();
    this._loadModels();
    this._bindEvents();
    this._started = true;
  },

  _buildUI(){
    this.root.innerHTML = `
      <div class="tbc-wrap" style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden">
        <div class="tbc-controls" style="display:flex;gap:8px;flex-wrap:wrap;padding:10px 12px;background:var(--bg1);border-bottom:1px solid var(--border);align-items:center">
          <span style="color:var(--text3);font-size:10px;letter-spacing:1px;font-weight:600">CAPAS</span>
          ${LAYERS.map(l => `
            <label class="tbc-layer" style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:4px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text)">
              <input type="checkbox" ${this.layerOn[l.id]?'checked':''} onchange="TBC.toggleLayer('${l.id}',this.checked)">
              ${l.label}
            </label>
          `).join('')}
          <span style="flex:1"></span>
          <button class="btn btn-ghost btn-sm" onclick="TBC.resetView()" style="font-size:11px">⟳ Reset vista</button>
        </div>
        <div id="tbc-canvas-wrap" style="position:relative;width:100%;height:520px;background:radial-gradient(ellipse at center, #1a1a1a 0%, #050505 100%)">
          <div id="tbc-loading" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:13px;flex-direction:column;gap:8px">
            <div>Cargando modelo 3D…</div>
            <div id="tbc-loading-detail" style="font-size:10px;color:var(--text4)"></div>
          </div>
          <div id="tbc-info" style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,0.75);padding:6px 10px;border-radius:5px;color:var(--neon);font-size:11px;display:none;border:1px solid var(--neon);max-width:60%"></div>
          <div id="tbc-tooltip" style="position:absolute;pointer-events:none;background:rgba(0,0,0,0.9);border:1px solid var(--border);color:var(--text);font-size:11px;padding:4px 8px;border-radius:4px;display:none;z-index:10"></div>
          <div id="tbc-lesions" style="position:absolute;top:10px;right:10px;width:240px;max-height:480px;overflow:auto;background:rgba(0,0,0,.82);border:1px solid var(--border);border-radius:6px;padding:8px;color:var(--text);font-size:11px;display:none"></div>
          <button id="tbc-lesions-toggle" onclick="TBC.toggleLesionPanel()" style="position:absolute;top:10px;right:10px;background:var(--bg1);border:1px solid var(--neon);color:var(--neon);padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px;font-weight:600">📋 Lesiones</button>
        </div>
        <div style="padding:8px 12px;background:var(--bg1);border-top:1px solid var(--border);font-size:10px;color:var(--text3);text-align:center">
          🖱️ arrastrá para rotar · rueda para zoom · clic en estructura para ver panel clínico
        </div>
      </div>
    `;
    this.container = document.getElementById('tbc-canvas-wrap');
  },

  _initThree(){
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.camera = new THREE.PerspectiveCamera(40, w/h, 0.01, 100);
    this.camera.position.set(0, 1.5, 4);
    this.renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    // luces
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(2, 4, 3);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x88aaff, 0.3);
    rim.position.set(-3, 2, -2);
    this.scene.add(rim);

    // controles
    if (THREE.OrbitControls){
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.target.set(0, 1, 0);
      this.controls.minDistance = 0.5;
      this.controls.maxDistance = 8;
    }

    this.raycaster = new THREE.Raycaster();

    // animate
    const tick = () => {
      requestAnimationFrame(tick);
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    tick();

    window.addEventListener('resize', () => this._onResize());
  },

  _onResize(){
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.camera.aspect = w/h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  },

  _loadModels(){
    if (!THREE.GLTFLoader){
      this._setLoading('GLTFLoader no disponible');
      return;
    }
    const loader = new THREE.GLTFLoader();
    if (THREE.DRACOLoader){
      const draco = new THREE.DRACOLoader();
      draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      loader.setDRACOLoader(draco);
    }
    let pending = LAYERS.length, anyLoaded = false;
    LAYERS.forEach(l => {
      const url = ASSET_BASE + l.file;
      this._setLoading(`Bajando ${l.file}…`);
      loader.load(url,
        (gltf) => {
          const grp = gltf.scene;
          grp.traverse(o => {
            if (o.isMesh){
              // forzar material con color anatómico (Z-Anatomy viene sin color útil)
              const mat = new THREE.MeshStandardMaterial({
                color: l.color,
                roughness: 0.55,
                metalness: 0.05,
                transparent: l.opacity < 1,
                opacity: l.opacity,
                side: THREE.DoubleSide,
                flatShading: false,
              });
              o.material = mat;
              this._origMat.set(o, mat);
              o.userData.layer = l.id;
              o.castShadow = false;
              o.receiveShadow = false;
            }
          });
          grp.visible = !!this.layerOn[l.id];
          this.scene.add(grp);
          this.layerObjs[l.id] = grp;
          this._fitCameraIfFirst(grp);
          anyLoaded = true;
          if (--pending === 0) this._loadDone(anyLoaded);
        },
        (xhr) => {
          if (xhr.lengthComputable){
            const pct = (xhr.loaded / xhr.total * 100).toFixed(0);
            this._setLoading(`${l.file} ${pct}%`);
          }
        },
        (err) => {
          console.warn('[TBC] no se pudo cargar', url, err);
          if (--pending === 0) this._loadDone(anyLoaded);
        }
      );
    });
  },

  _loadDone(any){
    const ld = document.getElementById('tbc-loading');
    if (any){
      if (ld) ld.style.display = 'none';
      // build hotspots + apply existing tints
      try { this._buildHotspots(); } catch(e){ console.warn('[TBC] hotspots',e); }
      try { this.applyLesionTints(); } catch(e){}
    } else {
      if (ld){
        ld.innerHTML = `<div style="color:var(--amber);text-align:center;padding:20px;max-width:90%">
          <div style="font-size:14px;margin-bottom:8px">⚠️ Modelo 3D no encontrado</div>
          <div style="font-size:11px;color:var(--text3);line-height:1.6">Falta exportar Z-Anatomy a GLB.<br>
          Seguí los pasos de Blender que te pasó Claude.<br>
          Los archivos van en: <code>movemetrics/assets/body_skeleton.glb</code> (etc).</div>
        </div>`;
      }
    }
  },

  _fitCameraIfFirst(grp){
    if (this._fitDone) return;
    const box = new THREE.Box3().setFromObject(grp);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const dist = maxDim * 1.6;
    this.camera.position.set(center.x, center.y, center.z + dist);
    if (this.controls){ this.controls.target.copy(center); this.controls.update(); }
    this._fitDone = true;
    this._homePos = this.camera.position.clone();
    this._homeTarget = center.clone();
  },

  _setLoading(txt){
    const d = document.getElementById('tbc-loading-detail');
    if (d) d.textContent = txt;
  },

  _bindEvents(){
    const c = this.renderer.domElement;
    c.addEventListener('mousemove', e => this._onPointer(e, false));
    c.addEventListener('click',     e => this._onPointer(e, true));
  },

  _onPointer(e, isClick){
    const rect = e.target.getBoundingClientRect();
    this.mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const targets = [];
    // hotspots PRIMERO (renderOrder alto, prioridad click)
    this._hotspots.forEach(h => h.visible !== false && targets.push(h));
    Object.entries(this.layerObjs).forEach(([id, grp]) => {
      if (this.layerOn[id]) grp.traverse(o => o.isMesh && targets.push(o));
    });
    const hits = this.raycaster.intersectObjects(targets, false);
    if (!hits.length){
      this._clearHover();
      this._hideTooltip();
      return;
    }
    const obj = hits[0].object;
    const hit = hits[0];
    const hot = obj.userData?.hotspot;
    if (isClick){
      let ctx;
      if (hot){
        ctx = {
          meshName: 'joint:'+hot.id,
          displayName: hot.name,
          side: hot.side,
          region: hot.region,
          segment: null,
          category: 'joint',
          kind: 'joint'
        };
      } else {
        ctx = this._buildLesionCtx(obj, hit);
      }
      this._showInfo(ctx.displayName, ctx.region);
      if (typeof LSH !== 'undefined') LSH.open(ctx);
      else console.warn('[TBC] LSH no cargado');
    } else {
      if (hot){
        this._hideHover();
        this._showTooltip(e, hot.name);
      } else {
        this._setHover(obj);
        this._showTooltip(e, this._prettyName(obj.name||''));
      }
    }
  },

  _hideHover(){ this._clearHover(); },

  // ── lesion context builder ─────────────────────────────────────────────
  _buildLesionCtx(obj, hit){
    const name = obj.name || '';
    const layer = obj.userData?.layer || 'muscle';
    const side = this._detectSide(name);
    const segment = layer === 'muscle' ? this._detectSegment(obj, hit.point) : null;
    const region = meshToPanel(name) || '';
    const displayName = this._prettyName(name);

    // category default by layer + segment
    let category = 'muscle';
    if (layer === 'skeleton') category = 'bone';
    else if (segment === 'proximal' || segment === 'distal') category = 'tendon';
    else category = 'muscle';

    return {
      meshName: name,
      displayName,
      side,
      region,
      segment,
      category,
      kind: layer
    };
  },

  _detectSide(name){
    const n = name.toLowerCase();
    if (/\.l(\.|$)/.test(n) || /\bleft\b/.test(n)) return 'L';
    if (/\.r(\.|$)/.test(n) || /\bright\b/.test(n)) return 'R';
    return '';
  },

  _detectSegment(mesh, worldPoint){
    // bbox in world space, project click onto longest axis
    const box = new THREE.Box3().setFromObject(mesh);
    if (box.isEmpty()) return null;
    const size = box.getSize(new THREE.Vector3());
    const axes = [['x',size.x],['y',size.y],['z',size.z]].sort((a,b)=>b[1]-a[1]);
    const ax = axes[0][0]; // longest
    const t = (worldPoint[ax] - box.min[ax]) / (box.max[ax] - box.min[ax]);
    // anatomy convention: top of bbox (high Y) = proximal for limbs
    // for vertical muscles ax=y → t=1 means top → proximal
    // invert if Y axis to match: proximal = high Y
    const norm = (ax === 'y') ? (1 - t) : t;
    if (norm < 0.33) return 'proximal';
    if (norm > 0.66) return 'distal';
    return 'vientre';
  },

  _prettyName(name){
    return (name||'')
      .replace(/\.[lr](\.|$)/i,'$1')
      .replace(/\.[a-z0-9]+$/i,'')
      .replace(/_/g,' ')
      .replace(/\bmuscle\b/i,'')
      .replace(/\s+/g,' ')
      .trim()
      .replace(/^\w/, c => c.toUpperCase());
  },

  _setHover(obj){
    if (this.hovered === obj) return;
    this._clearHover();
    this.hovered = obj;
    if (!this._origMat.has(obj)) this._origMat.set(obj, obj.material);
    obj.material = obj.material.clone();
    obj.material.emissive = new THREE.Color(0x39FF7A);
    obj.material.emissiveIntensity = 0.4;
  },

  _clearHover(){
    if (this.hovered){
      const orig = this._origMat.get(this.hovered);
      if (orig) this.hovered.material = orig;
      this.hovered = null;
    }
  },

  _showTooltip(e, txt){
    const tt = document.getElementById('tbc-tooltip');
    if (!tt) return;
    const rect = this.container.getBoundingClientRect();
    tt.style.left = (e.clientX - rect.left + 12) + 'px';
    tt.style.top  = (e.clientY - rect.top  + 12) + 'px';
    tt.textContent = txt;
    tt.style.display = 'block';
  },
  _hideTooltip(){
    const tt = document.getElementById('tbc-tooltip');
    if (tt) tt.style.display = 'none';
  },

  _showInfo(name, panel){
    const el = document.getElementById('tbc-info');
    if (!el) return;
    el.innerHTML = panel
      ? `<b>${name}</b> → abriendo panel clínico <span style="color:#fff">${panel}</span>`
      : `<b>${name}</b> <span style="color:var(--text3)">(sin panel clínico mapeado)</span>`;
    el.style.display = 'block';
    clearTimeout(this._infoT);
    this._infoT = setTimeout(() => el.style.display='none', 4000);
  },

  toggleLayer(id, on){
    this.layerOn[id] = on;
    if (this.layerObjs[id]) this.layerObjs[id].visible = on;
  },

  resetView(){
    if (this._homePos && this.controls){
      this.camera.position.copy(this._homePos);
      this.controls.target.copy(this._homeTarget);
      this.controls.update();
    }
  },

  // ── joint hotspots ─────────────────────────────────────────────────────
  // se construyen DESPUÉS de que carga skeleton, derivando posiciones de
  // bbox de huesos clave. Cada hotspot es esfera transparente clickeable.
  _hotspots: [],
  _meshIndex: {}, // meshName → THREE.Mesh (para tinte por lesión)

  _buildHotspots(){
    const sk = this.layerObjs.skeleton;
    if (!sk) return;
    // index meshes
    sk.traverse(o => { if (o.isMesh && o.name) this._meshIndex[o.name] = o; });
    const mu = this.layerObjs.muscle;
    if (mu) mu.traverse(o => { if (o.isMesh && o.name) this._meshIndex[o.name] = o; });

    const findBbox = (regex) => {
      const box = new THREE.Box3();
      let any = false;
      sk.traverse(o => { if (o.isMesh && regex.test(o.name||'')){ box.expandByObject(o); any = true; }});
      return any ? box : null;
    };
    const center = b => b ? b.getCenter(new THREE.Vector3()) : null;

    // joints to compute
    const JOINTS = [
      { id:'hombro.l',   region:'hombro',   side:'L', name:'Hombro Izq',   from:[/Humerus\.l/i, /Scapula\.l/i],   pick:'top' },
      { id:'hombro.r',   region:'hombro',   side:'R', name:'Hombro Der',   from:[/Humerus\.r/i, /Scapula\.r/i],   pick:'top' },
      { id:'codo.l',     region:'codo',     side:'L', name:'Codo Izq',     from:[/Humerus\.l/i, /Radius\.l/i],    pick:'between' },
      { id:'codo.r',     region:'codo',     side:'R', name:'Codo Der',     from:[/Humerus\.r/i, /Radius\.r/i],    pick:'between' },
      { id:'cadera.l',   region:'cadera',   side:'L', name:'Cadera Izq',   from:[/Femur\.l/i, /Hip bone\.l/i],    pick:'top' },
      { id:'cadera.r',   region:'cadera',   side:'R', name:'Cadera Der',   from:[/Femur\.r/i, /Hip bone\.r/i],    pick:'top' },
      { id:'rodilla.l',  region:'rodilla',  side:'L', name:'Rodilla Izq',  from:[/Patella\.l/i],                  pick:'center' },
      { id:'rodilla.r',  region:'rodilla',  side:'R', name:'Rodilla Der',  from:[/Patella\.r/i],                  pick:'center' },
      { id:'tobillo.l',  region:'tobillo',  side:'L', name:'Tobillo Izq',  from:[/Talus\.l/i],                    pick:'center' },
      { id:'tobillo.r',  region:'tobillo',  side:'R', name:'Tobillo Der',  from:[/Talus\.r/i],                    pick:'center' },
      { id:'cervical',   region:'cervical', side:'',  name:'Cervical',     from:[/Vertebra C[345]/i],             pick:'center' },
      { id:'lumbar',     region:'lumbar',   side:'',  name:'Lumbar',       from:[/Vertebra L[234]/i],             pick:'center' },
    ];

    // estimate scale: 1.5% of model height for sphere radius
    const root = new THREE.Box3().setFromObject(sk);
    const radius = Math.max(0.018, root.getSize(new THREE.Vector3()).y * 0.022);

    JOINTS.forEach(j => {
      const boxes = j.from.map(rx => findBbox(rx)).filter(Boolean);
      if (!boxes.length) return;
      let pos;
      if (j.pick === 'top'){
        // proximal end of first bone (high Y of first, with low Y of second blended)
        pos = boxes[0].getCenter(new THREE.Vector3());
        if (boxes[1]) pos.lerp(boxes[1].getCenter(new THREE.Vector3()), 0.5);
        pos.y = boxes[0].max.y * 0.95 + boxes[0].min.y * 0.05; // toward top
      } else if (j.pick === 'between'){
        // midpoint between bottom of bone1 and top of bone2
        const p1 = new THREE.Vector3((boxes[0].min.x+boxes[0].max.x)/2, boxes[0].min.y, (boxes[0].min.z+boxes[0].max.z)/2);
        const p2 = boxes[1] ? new THREE.Vector3((boxes[1].min.x+boxes[1].max.x)/2, boxes[1].max.y, (boxes[1].min.z+boxes[1].max.z)/2) : p1;
        pos = p1.lerp(p2, 0.5);
      } else {
        pos = boxes[0].getCenter(new THREE.Vector3());
      }

      const geom = new THREE.SphereGeometry(radius, 24, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x39FF7A, transparent: true, opacity: 0.32, depthTest: false
      });
      const sphere = new THREE.Mesh(geom, mat);
      sphere.position.copy(pos);
      sphere.renderOrder = 999;
      sphere.userData.hotspot = j;

      // outer ring (concentric circle effect)
      const ringGeom = new THREE.SphereGeometry(radius * 1.6, 24, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x39FF7A, transparent: true, opacity: 0.10, depthTest: false, wireframe: true
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      ring.renderOrder = 998;
      ring.userData.hotspot = j;

      this.scene.add(sphere);
      this.scene.add(ring);
      this._hotspots.push(sphere, ring);
    });
    console.log('[TBC] hotspots built:', this._hotspots.length / 2);
  },

  toggleHotspots(on){
    this._hotspots.forEach(h => h.visible = on);
  },

  // ── lesion panel + tint ────────────────────────────────────────────────
  toggleLesionPanel(){
    const p = document.getElementById('tbc-lesions');
    const b = document.getElementById('tbc-lesions-toggle');
    if (!p || !b) return;
    const open = p.style.display === 'none';
    p.style.display = open ? 'block' : 'none';
    b.style.display = open ? 'none'  : 'block';
    if (open) this.renderLesionList();
  },

  renderLesionList(){
    const p = document.getElementById('tbc-lesions');
    if (!p || typeof LSH === 'undefined') return;
    const arr = LSH.list();
    const head = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <span style="font-weight:700;color:var(--neon);font-size:11px;letter-spacing:.1em">LESIONES (${arr.length})</span>
        <button onclick="TBC.toggleLesionPanel()" style="background:transparent;border:none;color:var(--text2);cursor:pointer;font-size:14px">✕</button>
      </div>`;
    if (!arr.length){
      p.innerHTML = head + '<div style="color:var(--text3);font-size:10px;text-align:center;padding:14px">Sin lesiones registradas.<br>Hacé clic en una estructura del modelo.</div>';
      return;
    }
    const items = arr.map(l => {
      const vasC = l.vas<=3?'var(--neon)':l.vas<=6?'var(--amber)':'var(--red)';
      const path = l.pathology || l.pathologyCustom || '—';
      return `
      <div style="border:1px solid var(--border);border-radius:5px;padding:6px 8px;margin-bottom:5px;background:rgba(255,255,255,.02)">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:4px">
          <b style="font-size:11px;color:var(--text)">${l.displayName}</b>
          <span style="font-size:14px;font-weight:700;color:${vasC};font-family:var(--mono)">${l.vas}</span>
        </div>
        <div style="font-size:9px;color:var(--text3);margin:2px 0">${l.side?l.side+' · ':''}${l.segment||''}${l.region?' · '+l.region:''}</div>
        <div style="font-size:10px;color:var(--text2)">${path}</div>
        <div style="display:flex;gap:4px;margin-top:5px">
          <button onclick="TBC.focusLesion('${l.meshName.replace(/'/g,"\\'")}')" style="flex:1;padding:3px;background:var(--bg1);border:1px solid var(--border);color:var(--text2);border-radius:3px;cursor:pointer;font-size:9px">📍 Ver</button>
          <button onclick="LSH.delete('${l.id}')" style="padding:3px 8px;background:transparent;border:1px solid var(--red);color:var(--red);border-radius:3px;cursor:pointer;font-size:9px">🗑</button>
        </div>
      </div>`;
    }).join('');
    p.innerHTML = head + items;
  },

  applyLesionTints(){
    if (typeof LSH === 'undefined') return;
    // reset previous tinted meshes
    if (this._tinted){
      this._tinted.forEach(m => {
        if (m && m.material) m.material.emissive?.setHex(0x000000);
      });
    }
    this._tinted = [];
    LSH.list().forEach(l => {
      const m = this._meshIndex[l.meshName];
      if (m && m.material && m.material.emissive){
        const c = l.vas <= 3 ? 0x208a3a : l.vas <= 6 ? 0xc28a1e : 0xc73838;
        m.material.emissive.setHex(c);
        m.material.emissiveIntensity = 0.55;
        this._tinted.push(m);
      }
    });
  },

  focusLesion(meshName){
    const m = this._meshIndex[meshName];
    if (!m || !this.controls) return;
    const box = new THREE.Box3().setFromObject(m);
    if (box.isEmpty()) return;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const dist = Math.max(size.x, size.y, size.z) * 4;
    this.camera.position.set(center.x, center.y, center.z + dist);
    this.controls.target.copy(center);
    this.controls.update();
  }
};

// hook lesion updates
document.addEventListener('lsh:update', () => {
  if (TBC._started){
    TBC.renderLesionList();
    TBC.applyLesionTints();
  }
});

})();

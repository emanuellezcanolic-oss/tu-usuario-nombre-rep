// LesionSheet.js — modal contextual de lesión + schema/storage
// Fase 1: UI + persistencia. Fase 2 lo invoca desde TBC click.
//
// API pública:
//   LSH.open(ctx)   ctx = {meshName, displayName, side, region, segment, category, kind, prefill}
//   LSH.list()      → array de lesiones del cur atleta
//   LSH.delete(id)
//   LSH.save(rec)   (interno - usa form)
//
// Schema lesión:
//   { id, ts, category, kind, meshName, displayName, side, region,
//     segment, pathology, pathologyCustom, vas, phase, mechanism, notes }

(function(){
'use strict';

const PATHOLOGY_CATALOG = {
  muscle: [
    'Mialgia','Contusión muscular','Calambre/Espasmo','Contractura',
    'Elongación/Distensión G1','Desgarro fibrilar G2','Ruptura total G3',
    'Hernia muscular','Miositis osificante','Síndrome compartimental','DOMS'
  ],
  tendon: [
    'Tendinitis (aguda)','Tendinosis (crónica)','Tenosinovitis','Paratendinitis',
    'Entesopatía/Entesitis','Ruptura tendinosa parcial','Ruptura tendinosa total',
    'Fascitis','Avulsión tendinosa'
  ],
  joint: [
    'Esguince G1','Esguince G2','Esguince G3','Laxitud ligamentaria',
    'Ruptura ligamentaria','Luxación','Subluxación','Artritis traumática',
    'Artritis inflamatoria','Artrosis','Capsulitis adhesiva','Sinovitis',
    'Bursitis','Lesión meniscal','Lesión labrum','Osteocondritis disecante',
    'Impingement'
  ],
  bone: [
    'Fractura cerrada','Fractura expuesta','Fractura conminuta','Fisura',
    'Fractura por estrés','Edema óseo','Periostitis','Osteomielitis','Epifisiólisis'
  ]
};

const CAT_LABELS = {
  muscle: '💪 Muscular',
  tendon: '🪢 Tendón/Fascia',
  joint:  '🦴 Articular',
  bone:   '🦴 Óseo'
};

// región → sheetId existente del kinesio (para botón "Tests ortopédicos")
const REGION_TO_SHEET = {
  hombro:'sheet-hombro', cervical:'sheet-cervical', lumbar:'sheet-lumbar',
  rodilla:'sheet-rodilla', tobillo:'sheet-tobillo', codo:'sheet-codo',
  cadera:'sheet-rodilla', ingle:'sheet-groin'
};

const uuid = () => 'lx_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);

const LSH = window.LSH = {
  _modalId: 'lesion-sheet-modal',
  _ctx: null,

  // ── persistence ──────────────────────────────────────────────────────────
  list(){
    if (typeof cur === 'undefined' || !cur) return [];
    if (!cur.kinesio) cur.kinesio = {};
    if (!Array.isArray(cur.kinesio.lesions)) cur.kinesio.lesions = [];
    return cur.kinesio.lesions;
  },

  delete(id){
    const arr = this.list();
    const i = arr.findIndex(l => l.id === id);
    if (i >= 0){
      arr.splice(i,1);
      this._persist();
      this._fireUpdate();
    }
  },

  _persist(){
    try { if (typeof saveAtletas === 'function') saveAtletas(); } catch(e){}
    try { if (typeof renderAtletas === 'function') renderAtletas(); } catch(e){}
  },

  _fireUpdate(){
    document.dispatchEvent(new CustomEvent('lsh:update', { detail:{ lesions:this.list() } }));
  },

  // ── modal lifecycle ──────────────────────────────────────────────────────
  open(ctx){
    this._ctx = Object.assign({
      meshName:'(sin nombre)',
      displayName:'Estructura',
      side:'',
      region:'',
      segment:null,
      category:'muscle',
      kind:'muscle',
      prefill:null
    }, ctx||{});
    this._ensureModal();
    this._renderForm();
    document.getElementById(this._modalId).style.display='flex';
  },

  close(){
    const m = document.getElementById(this._modalId);
    if (m) m.style.display='none';
    this._ctx = null;
  },

  _ensureModal(){
    if (document.getElementById(this._modalId)) return;
    const m = document.createElement('div');
    m.id = this._modalId;
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:9999;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    m.innerHTML = `
      <style>
        #${this._modalId} select, #${this._modalId} option {
          background:#0f0f0f !important; color:#eaeaea !important;
        }
        #${this._modalId} select:focus { outline:1px solid var(--neon); }
        #${this._modalId} input::placeholder, #${this._modalId} textarea::placeholder { color:#666; }
      </style>
      <div id="lsh-card" style="width:min(680px,94vw);max-height:92vh;overflow:auto;background:var(--bg2);border:1px solid var(--neon);border-radius:10px;padding:0;box-shadow:0 0 40px rgba(57,255,122,.25)">
        <div id="lsh-head"></div>
        <div id="lsh-body" style="padding:14px 18px"></div>
      </div>
    `;
    m.addEventListener('click', e => { if (e.target === m) this.close(); });
    document.body.appendChild(m);
  },

  _renderForm(){
    const c = this._ctx;
    const head = document.getElementById('lsh-head');
    const body = document.getElementById('lsh-body');
    if (!head || !body) return;

    const sideTxt = c.side === 'L' ? '🅻 Izq' : c.side === 'R' ? '🆁 Der' : '';
    const segTxt  = c.segment ? ({proximal:'Proximal (origen)', vientre:'Vientre medio', distal:'Distal (inserción)'})[c.segment] : '';
    const sheetId = REGION_TO_SHEET[c.region];

    head.style.cssText = 'padding:14px 18px;background:var(--bg1);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap';
    head.innerHTML = `
      <span style="font-family:var(--mono);font-weight:700;color:var(--neon);font-size:11px;letter-spacing:.1em">REGISTRO LESIÓN</span>
      <span style="flex:1"></span>
      <button onclick="LSH.close()" style="background:transparent;border:1px solid var(--border);color:var(--text2);padding:4px 10px;border-radius:5px;cursor:pointer;font-size:11px">✕ Cerrar</button>
      <div style="flex-basis:100%;display:flex;flex-direction:column;gap:2px;margin-top:6px">
        <div style="font-size:15px;color:var(--text);font-weight:600">${c.displayName} ${sideTxt?`<span style="color:var(--neon);font-size:11px;margin-left:6px">${sideTxt}</span>`:''}</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono)">${c.meshName}${c.region?` · región: ${c.region}`:''}${segTxt?` · ${segTxt}`:''}</div>
      </div>
    `;

    // category tabs
    const cats = ['muscle','tendon','joint','bone'];
    const tabsHtml = cats.map(cat => {
      const on = cat === c.category;
      return `<button data-cat="${cat}" onclick="LSH._switchCat('${cat}')" style="flex:1;padding:7px;font-size:11px;font-weight:600;border-radius:5px;cursor:pointer;border:1px solid var(--border);background:${on?'var(--neon)':'var(--bg1)'};color:${on?'#000':'var(--text2)'}">${CAT_LABELS[cat]}</button>`;
    }).join('');

    const pathOpts = PATHOLOGY_CATALOG[c.category]
      .map(p => `<option value="${p}">${p}</option>`).join('');

    const prefill = c.prefill || {};
    const segVal  = prefill.segment || c.segment || '';
    const pathVal = prefill.pathology || '';
    const phaseVal= prefill.phase || 'aguda';
    const mechVal = prefill.mechanism || 'sobreuso';
    const vasVal  = prefill.vas != null ? prefill.vas : 5;

    body.innerHTML = `
      <div style="display:flex;gap:6px;margin-bottom:14px">${tabsHtml}</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div>
          <label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-weight:700">Segmento</label>
          <select id="lsh-seg" style="width:100%;padding:7px;background:var(--bg1);color:var(--text);border:1px solid var(--border);border-radius:5px;font-size:13px;margin-top:4px">
            <option value="">— sin especificar —</option>
            <option value="proximal" ${segVal==='proximal'?'selected':''}>Proximal (origen)</option>
            <option value="vientre"  ${segVal==='vientre' ?'selected':''}>Vientre medio</option>
            <option value="distal"   ${segVal==='distal'  ?'selected':''}>Distal (inserción)</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-weight:700">Lado</label>
          <select id="lsh-side" style="width:100%;padding:7px;background:var(--bg1);color:var(--text);border:1px solid var(--border);border-radius:5px;font-size:13px;margin-top:4px">
            <option value="" ${!c.side?'selected':''}>—</option>
            <option value="L" ${c.side==='L'?'selected':''}>Izquierdo</option>
            <option value="R" ${c.side==='R'?'selected':''}>Derecho</option>
            <option value="B">Bilateral</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-weight:700">Patología</label>
        <select id="lsh-path" style="width:100%;padding:7px;background:var(--bg1);color:var(--text);border:1px solid var(--border);border-radius:5px;font-size:13px;margin-top:4px">
          <option value="">— elegir —</option>
          ${pathOpts}
        </select>
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-weight:700">Otra patología (opcional)</label>
        <input id="lsh-path-custom" type="text" placeholder="ej: Síndrome del piramidal" value="${(prefill.pathologyCustom||'').replace(/"/g,'&quot;')}" style="width:100%;padding:7px;background:var(--bg1);color:var(--text);border:1px solid var(--border);border-radius:5px;font-size:13px;margin-top:4px">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div>
          <label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-weight:700">Fase</label>
          <select id="lsh-phase" style="width:100%;padding:7px;background:var(--bg1);color:var(--text);border:1px solid var(--border);border-radius:5px;font-size:13px;margin-top:4px">
            <option value="aguda"    ${phaseVal==='aguda'?'selected':''}>Aguda (&lt;72h)</option>
            <option value="subaguda" ${phaseVal==='subaguda'?'selected':''}>Subaguda (&lt;3sem)</option>
            <option value="crónica"  ${phaseVal==='crónica'?'selected':''}>Crónica (&gt;3sem)</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-weight:700">Mecanismo</label>
          <select id="lsh-mech" style="width:100%;padding:7px;background:var(--bg1);color:var(--text);border:1px solid var(--border);border-radius:5px;font-size:13px;margin-top:4px">
            <option value="directo"     ${mechVal==='directo'?'selected':''}>Directo / contacto</option>
            <option value="indirecto"   ${mechVal==='indirecto'?'selected':''}>Indirecto</option>
            <option value="sobreuso"    ${mechVal==='sobreuso'?'selected':''}>Sobreuso</option>
            <option value="atraumático" ${mechVal==='atraumático'?'selected':''}>Atraumático</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
          <label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-weight:700">EVA / VAS dolor</label>
          <span id="lsh-vas-val" style="font-size:18px;font-weight:700;color:var(--neon);font-family:var(--mono)">${vasVal}</span>
        </div>
        <input id="lsh-vas" type="range" min="0" max="10" step="1" value="${vasVal}" oninput="document.getElementById('lsh-vas-val').textContent=this.value;LSH._colorVas(this.value)" style="width:100%">
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:2px"><span>0 sin dolor</span><span>5 moderado</span><span>10 insoportable</span></div>
      </div>

      <div style="margin-bottom:14px">
        <label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-weight:700">Notas clínicas</label>
        <textarea id="lsh-notes" rows="2" placeholder="Mecanismo, evolución, restricciones…" style="width:100%;padding:7px;background:var(--bg1);color:var(--text);border:1px solid var(--border);border-radius:5px;font-size:12px;margin-top:4px;resize:vertical;font-family:inherit">${(prefill.notes||'').replace(/</g,'&lt;')}</textarea>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button onclick="LSH._save()" style="flex:1;min-width:140px;padding:10px;background:var(--neon);color:#000;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px">💾 Guardar lesión</button>
        ${sheetId ? `<button onclick="LSH._goTests('${sheetId}','${c.region}')" style="padding:10px 14px;background:var(--bg1);color:var(--neon);border:1px solid var(--neon);border-radius:6px;font-weight:600;cursor:pointer;font-size:12px">🔬 Tests ortopédicos →</button>` : ''}
        <button onclick="LSH.close()" style="padding:10px 14px;background:transparent;color:var(--text2);border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:12px">Cancelar</button>
      </div>
    `;
    this._colorVas(vasVal);
  },

  _colorVas(v){
    const el = document.getElementById('lsh-vas-val');
    if (!el) return;
    v = +v;
    el.style.color = v<=3 ? 'var(--neon)' : v<=6 ? 'var(--amber)' : 'var(--red)';
  },

  _switchCat(cat){
    if (!this._ctx) return;
    this._ctx.category = cat;
    // preserve current form state
    const form = this._readForm();
    this._ctx.prefill = form;
    this._renderForm();
  },

  _readForm(){
    const get = id => document.getElementById(id);
    return {
      segment:        get('lsh-seg')?.value || null,
      pathology:      get('lsh-path')?.value || '',
      pathologyCustom:get('lsh-path-custom')?.value || '',
      phase:          get('lsh-phase')?.value || 'aguda',
      mechanism:      get('lsh-mech')?.value || 'sobreuso',
      vas:            +(get('lsh-vas')?.value || 0),
      notes:          get('lsh-notes')?.value || '',
      side:           get('lsh-side')?.value || ''
    };
  },

  _save(){
    const c = this._ctx;
    if (!c) return;
    const f = this._readForm();
    if (!f.pathology && !f.pathologyCustom){
      alert('Elegí una patología o escribí una custom.');
      return;
    }
    const rec = {
      id: uuid(),
      ts: new Date().toISOString(),
      category:        c.category,
      kind:            c.kind,
      meshName:        c.meshName,
      displayName:     c.displayName,
      side:            f.side || c.side || '',
      region:          c.region || '',
      segment:         f.segment || null,
      pathology:       f.pathology || '',
      pathologyCustom: f.pathologyCustom || '',
      vas:             f.vas,
      phase:           f.phase,
      mechanism:       f.mechanism,
      notes:           f.notes
    };
    const arr = this.list();
    arr.push(rec);
    this._persist();
    this._fireUpdate();
    this.close();
    if (typeof showToast === 'function') showToast('Lesión registrada');
    else console.log('[LSH] saved', rec);
  },

  _goTests(sheetId, region){
    if (typeof openModal === 'function' && document.getElementById(sheetId)){
      openModal(sheetId);
    } else if (typeof showKinePanel === 'function'){
      showKinePanel(region, region);
    } else {
      alert('Panel de tests no disponible para esta región.');
    }
  },

  // expose for TBC
  PATHOLOGY_CATALOG,
  REGION_TO_SHEET
};

})();

// sheets/hombro.js — hoja clínica hombro/muñeca (ROM, tests, fuerza, ASES, WORC, DASH, SPADI)
function buildHombroROM() {
  const c = document.getElementById('hombro-rom-fields'); if(!c) return; c.innerHTML = '';
  c.innerHTML = ROM_HOMBRO.map(m => `
    <div class="card mb-8">
      <div class="card-header"><h3>${m.label}</h3><span class="tag tag-b">Ref: ${m.ref}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">Activo D (°)</label><input class="inp inp-mono" type="number" id="rom-${m.id}-act-d" placeholder="0" oninput="calcTROMSheet()"></div>
          <div class="ig"><label class="il">Activo I (°)</label><input class="inp inp-mono" type="number" id="rom-${m.id}-act-i" placeholder="0" oninput="calcTROMSheet()"></div>
          <div class="ig"><label class="il">Pasivo D (°)</label><input class="inp inp-mono" type="number" id="rom-${m.id}-pas-d" placeholder="0"></div>
          <div class="ig"><label class="il">Pasivo I (°)</label><input class="inp inp-mono" type="number" id="rom-${m.id}-pas-i" placeholder="0"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function calcTROMSheet() {
  const riD = +document.getElementById('rom-ri-act-d')?.value||0;
  const reD = +document.getElementById('rom-re-act-d')?.value||0;
  const riI = +document.getElementById('rom-ri-act-i')?.value||0;
  const reI = +document.getElementById('rom-re-act-i')?.value||0;
  const tD = riD+reD, tI = riI+reI;
  const elD = document.getElementById('hombro-trom-d'), elI = document.getElementById('hombro-trom-i');
  if(elD){ elD.textContent = tD>0?tD+'°':'—'; elD.style.color=tD>=90?'var(--neon)':tD>=80?'var(--amber)':'var(--red)'; }
  if(elI){ elI.textContent = tI>0?tI+'°':'—'; elI.style.color=tI>=90?'var(--neon)':tI>=80?'var(--amber)':'var(--red)'; }
  const elG = document.getElementById('hombro-gird-result');
  if(elG && tD>0 && tI>0) {
    const diff = Math.abs(tD-tI);
    const c = diff>=18?'var(--red)':diff>=10?'var(--amber)':'var(--neon)';
    elG.innerHTML = `Diferencia TROM: <span style="color:${c};font-weight:700">${diff}°</span> ${diff>=18?'⚠️ GIRD ≥18° significativo':'✓ Normal'}`;
  }
}

function buildHombroTests() {
  const c = document.getElementById('hombro-tests-rapidos'); if(!c) return; c.innerHTML = '';
  c.innerHTML = HOMBRO_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header"><h3>${t.name}</h3><span class="tag ${t.tag}" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
          <div><div class="il mb-4">I</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
        </div>
        <div class="ig mt-8"><label class="il">EVA D</label><input type="range" class="eva-slider" min="0" max="10" value="0" oninput="this.nextElementSibling.textContent=this.value"><span style="font-family:var(--mono);font-size:14px;display:block;text-align:center">0</span></div>
      </div>
    </div>
  `).join('');
}

function buildHombroFuerza() {
  const c = document.getElementById('hombro-fuerza-fields'); if(!c) return; c.innerHTML = '';
  c.innerHTML = FUERZA_HOMBRO.map(m => `
    <div class="card mb-8">
      <div class="card-header"><h3>${m.label}</h3><span class="tag tag-b">${m.angulo}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">D (N)</label><input class="inp inp-mono" type="number" step="0.1" id="fuerza-${m.id}-d" placeholder="0.0" oninput="calcHombroAsimetria()"></div>
          <div class="ig"><label class="il">I (N)</label><input class="inp inp-mono" type="number" step="0.1" id="fuerza-${m.id}-i" placeholder="0.0" oninput="calcHombroAsimetria()"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function calcHombroAsimetria() {
  const results = FUERZA_HOMBRO.map(m => {
    const d = +document.getElementById('fuerza-'+m.id+'-d')?.value||0;
    const i = +document.getElementById('fuerza-'+m.id+'-i')?.value||0;
    if(!d&&!i) return null;
    const mayor = Math.max(d,i), menor = Math.min(d,i);
    const asim = mayor>0?((mayor-menor)/mayor*100).toFixed(1):0;
    const c = +asim>=20?'var(--red)':+asim>=15?'var(--amber)':'var(--neon)';
    return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border)"><span style="font-size:12px">${m.label}</span><span style="font-family:var(--mono);color:${c}">${asim}%</span></div>`;
  }).filter(Boolean);
  const el = document.getElementById('hombro-asimetria-result');
  if(el) el.innerHTML = results.length ? results.join('')+'<div style="font-size:9px;color:var(--text3);margin-top:4px">MDC: 15–20% · CPG 2025</div>' : 'Completá valores para calcular asimetría';
}

function buildASES() {
  const c = document.getElementById('ases-actividades-list'); if(!c) return; c.innerHTML = '';
  c.innerHTML = ASES_ITEMS.map((act,i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12px;flex:1">${act}</span>
      <div style="display:flex;gap:4px;margin-left:8px">
        ${[0,1,2,3].map(v=>`<button class="ot-btn" style="min-width:28px;font-size:10px" onclick="selectASES(this,${i},${v})">${v}</button>`).join('')}
      </div>
    </div>
  `).join('');
}
function selectASES(btn, idx, val) {
  btn.parentElement.querySelectorAll('.ot-btn').forEach(b=>{ b.className='ot-btn'; b.style.minWidth='28px'; b.style.fontSize='10px'; });
  btn.classList.add('pos'); asesVals[idx]=val; calcASES2();
}
function calcASES2() {
  const dolor = +document.querySelector('#htab-cuest .eva-slider')?.value||0;
  const pain = (10-dolor)/10*50;
  const filled = asesVals.filter(v=>v!==null);
  const func = filled.length===10?(filled.reduce((a,b)=>a+b,0)/30*50):null;
  const total = func!==null?Math.round(pain+func):null;
  const el = document.getElementById('ases-total'); if(el) el.textContent = total!==null?total:'—';
}

function buildWORC() {
  const c = document.getElementById('worc-fields-sheet'); if(!c) return; c.innerHTML = '';
  worcVals = new Array(21).fill(0);
  let idx = 0;
  c.innerHTML = WORC_SECTIONS.map(sec => `
    <div style="margin-bottom:10px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);margin-bottom:6px">${sec.d}</div>
      ${sec.items.map(item => {
        const i = idx++;
        return `<div style="padding:6px 0;border-bottom:1px solid var(--border)">
          <div style="font-size:11px;margin-bottom:4px">${item}</div>
          <input type="range" class="eva-slider" min="0" max="100" value="0"
            oninput="worcVals[${i}]=+this.value;document.getElementById('wv-${i}').textContent=this.value;calcWORC2()">
          <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3)">
            <span>Sin síntomas</span><span id="wv-${i}" style="font-family:var(--mono)">0</span><span>Máximos</span>
          </div>
        </div>`;
      }).join('')}
    </div>
  `).join('');
}
function calcWORC2() {
  const sum = worcVals.reduce((a,b)=>a+b,0);
  const pct = ((2100-sum)/2100*100).toFixed(1);
  const el = document.getElementById('worc-total-sheet'); if(el) el.textContent = sum;
  const ep = document.getElementById('worc-pct-sheet'); if(ep) ep.textContent = pct+'% función';
}

function buildDASH() {
  const c = document.getElementById('dash-fields-sheet'); if(!c) return; c.innerHTML = '';
  c.innerHTML = DASH_ITEMS.map((item,i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:11px;flex:1">${item}</span>
      <div style="display:flex;gap:3px;margin-left:6px">
        ${[1,2,3,4,5].map(v=>`<button class="ot-btn" style="min-width:22px;font-size:10px;padding:3px"
          onclick="selectDASH(this,${i},${v})">${v}</button>`).join('')}
      </div>
    </div>
  `).join('');
}
function selectDASH(btn, idx, val) {
  btn.parentElement.querySelectorAll('.ot-btn').forEach(b=>{b.className='ot-btn';b.style.minWidth='22px';b.style.fontSize='10px';b.style.padding='3px';});
  btn.classList.add('pos'); dashVals[idx]=val;
  const filled = dashVals.filter(v=>v!==null);
  if(filled.length===21){
    const score = ((filled.reduce((a,b)=>a+b,0)/filled.length-1)/4*100).toFixed(1);
    const el = document.getElementById('dash-total-sheet'); if(el) el.textContent=score;
  }
}

function calcSPADI() {
  const sliders = document.querySelectorAll('#spadi-body .eva-slider');
  if(sliders.length>=2){
    const d=+sliders[0].value, dis=+sliders[1].value;
    const total=((d+dis)/2).toFixed(1);
    const el=document.getElementById('spadi-total');if(el)el.textContent=total;
  }
}

function checkHombroRedFlags() {
  const cbs = document.querySelectorAll('.hombro-redflag');
  const any = [...cbs].some(c=>c.checked);
  const el = document.getElementById('hombro-redflag-alert'); if(el) el.style.display=any?'block':'none';
}


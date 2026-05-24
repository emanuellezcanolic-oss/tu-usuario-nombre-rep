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

// Hombro-specific toggle: also locks EVA slider when NEG selected
function toggleOTHombro(btn, type) {
  const btnGroup = btn.parentElement;
  btnGroup.querySelectorAll('.ot-btn').forEach(b => b.classList.remove('pos','neg'));
  btn.classList.add(type);
  // lock EVA slider in same column div
  const col = btnGroup.parentElement;
  const slider = col.querySelector('.eva-slider');
  const valEl  = col.querySelector('.eva-val');
  if (slider) {
    if (type === 'neg') {
      slider.disabled = true;
      slider.value = 0;
      slider.style.opacity = '0.25';
      slider.style.pointerEvents = 'none';
      if (valEl) valEl.textContent = '0';
    } else {
      slider.disabled = false;
      slider.style.opacity = '1';
      slider.style.pointerEvents = '';
    }
  }
}

function buildHombroTests() {
  const c = document.getElementById('hombro-tests-rapidos'); if(!c) return; c.innerHTML = '';
  const col = (side) => `
    <div>
      <div class="il mb-4">${side}</div>
      <div style="display:flex;gap:6px">
        <button class="ot-btn" onclick="toggleOTHombro(this,'pos')">+ POS</button>
        <button class="ot-btn" onclick="toggleOTHombro(this,'neg')">– NEG</button>
      </div>
      <div class="ig mt-6">
        <label class="il" style="font-size:10px">EVA ${side}</label>
        <input type="range" class="eva-slider" min="0" max="10" value="0"
          oninput="this.nextElementSibling.textContent=this.value">
        <span class="eva-val" style="font-family:var(--mono);font-size:13px;display:block;text-align:center">0</span>
      </div>
    </div>`;
  c.innerHTML = HOMBRO_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header"><h3>${t.name}</h3><span class="tag ${t.tag}" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:10px">${col('D')}${col('I')}</div>
      </div>
    </div>`).join('');
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

// ── RTP: RETORNO AL JUEGO ─────────────────────────────────────────────────────
// Kurz et al. BMJ Open 2023 (Delphi) · Otley et al. 2024 · Olds 2019 (SARTS) · Reddy JSES 2023

function buildHombroRTP() {
  const c = document.getElementById('hombro-rtp-fields');
  if (!c || c.innerHTML) return;

  const semaBox = (id, label, criterion) =>
    `<div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
      <div style="font-size:9px;color:var(--text3);margin-bottom:2px">${label}</div>
      <div id="${id}-val" style="font-family:var(--mono);font-size:20px;font-weight:800;color:var(--text3)">—</div>
      <div style="font-size:9px;color:var(--text3)">${criterion}</div>
    </div>`;

  const lsiRow = (id, label, extra) =>
    `<div style="margin-bottom:10px">
      <div style="font-size:11px;font-weight:600;margin-bottom:6px">${label}</div>
      <div class="grid-2" style="gap:8px;margin-bottom:4px">
        <div class="ig"><label class="il">Afectado (N)</label>
          <input class="inp inp-mono" type="number" step="0.1" id="rtp-${id}-aff" placeholder="0.0" oninput="calcRTPFuerza()"></div>
        <div class="ig"><label class="il">Contralateral (N)</label>
          <input class="inp inp-mono" type="number" step="0.1" id="rtp-${id}-ctrl" placeholder="0.0" oninput="calcRTPFuerza()"></div>
      </div>
      <div id="rtp-${id}-lsi" style="font-size:11px;color:var(--text3);text-align:right">LSI: —${extra||''}</div>
    </div>`;

  c.innerHTML = `
  <!-- Evidence bar -->
  <div style="font-size:10px;color:var(--text3);margin-bottom:12px;padding:8px;background:var(--bg4);border-radius:8px;line-height:1.6">
    <strong style="color:var(--amber)">Retorno al Juego — Hombro</strong> · Kurz BMJ Open 2023 · Otley et al. 2024 · Olds Phys Ther Sport 2019 · Reddy JSES 2023
  </div>

  <!-- SEMÁFORO -->
  <div class="card mb-10">
    <div class="card-header"><h3>Semáforo de clearance</h3><span class="tag tag-b">Criteria-based</span></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        ${semaBox('sema-wosi','WOSI mod.','≥95 = competencia')}
        ${semaBox('sema-dolor','NRS Dolor','≤3/10 = OK')}
        ${semaBox('sema-fuerza','LSI ER','≥90% = pass')}
        ${semaBox('sema-ckc','CKCUEST','≥21 = normal')}
      </div>
      <div id="rtp-clearance-verdict" style="padding:10px;border-radius:8px;background:var(--bg4);font-size:12px;color:var(--text3);text-align:center">
        Completar evaluación para semáforo
      </div>
    </div>
  </div>

  <!-- PROs -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-pros-body')">
      <h3>PROs — Readiness psicológica y funcional</h3>
      <span class="tag" style="background:rgba(167,139,250,.15);color:#A78BFA">WOSI · SIRSI · KJOC · PRIA-RS</span>
    </div>
    <div id="rtp-pros-body">
      <div class="card-body">
        <!-- WOSI -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">WOSI modificado</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">100 − (original/21). Criterio: ≥90 práctica · ≥95 competencia. MCID = 151.9</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">WOSI original (0–2100)</label>
              <input class="inp inp-mono" type="number" min="0" max="2100" id="wosi-original" placeholder="0–2100" oninput="calcRTPWOSI()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">WOSI mod.</div>
              <div id="wosi-mod-val" style="font-family:var(--mono);font-size:22px;font-weight:800;color:var(--text3)">—</div>
              <div id="wosi-mod-tag" style="font-size:9px;color:var(--text3)">≥95 = competencia</div>
            </div>
          </div>
        </div>
        <!-- SIRSI -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">SIRSI — Shoulder Instability Readiness to RTS</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">12 preguntas, escala 0–10. Score = (suma / 120) × 100%. Mayor % = mejor disposición psicológica.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Suma total (0–120)</label>
              <input class="inp inp-mono" type="number" min="0" max="120" id="sirsi-suma" placeholder="0–120" oninput="calcRTPSIRSI()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">SIRSI %</div>
              <div id="sirsi-pct" style="font-family:var(--mono);font-size:22px;font-weight:800;color:var(--text3)">—</div>
              <div style="font-size:9px;color:var(--text3)">mayor % = mejor</div>
            </div>
          </div>
        </div>
        <!-- KJOC -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">KJOC — Kerlan-Jobe Orthopedic Clinic Score</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">10 VAS, 0–100%. &lt;88–90% = riesgo en overhead. Baseball: &lt;90 = riesgo.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">KJOC % (0–100)</label>
              <input class="inp inp-mono" type="number" min="0" max="100" step="0.1" id="kjoc-score" placeholder="0–100" oninput="calcRTPKJOC()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">Estado</div>
              <div id="kjoc-tag" style="font-family:var(--mono);font-size:14px;font-weight:800;color:var(--text3);padding-top:8px">—</div>
            </div>
          </div>
        </div>
        <!-- PRIA-RS -->
        <div>
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">PRIA-RS (Kurz 2023)</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">10–50 puntos. Criterio Delphi: ≥40 para clearance.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Score PRIA-RS (10–50)</label>
              <input class="inp inp-mono" type="number" min="10" max="50" id="pria-rs" placeholder="10–50" oninput="calcRTPPRIA()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">Estado</div>
              <div id="pria-tag" style="font-family:var(--mono);font-size:14px;font-weight:800;color:var(--text3);padding-top:8px">—</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- NRS DOLOR -->
  <div class="card mb-10">
    <div class="card-header"><h3>Dolor — NRS</h3><span class="tag tag-b">Criterio ≤3/10</span></div>
    <div class="card-body">
      <div class="ig"><label class="il">NRS actual (0–10)</label>
        <input type="range" class="eva-slider" min="0" max="10" value="0" id="rtp-nrs"
          oninput="document.getElementById('rtp-nrs-val').textContent=this.value;calcRTPSemaforo()">
        <div id="rtp-nrs-val" style="font-family:var(--mono);font-size:22px;text-align:center;color:var(--neon)">0</div>
      </div>
      <div style="font-size:10px;color:var(--text3);margin-top:4px">Criterio Kurz 2023 / Otley 2024: ≤3/10 para clearance deportivo</div>
    </div>
  </div>

  <!-- FUERZA ISOMÉTRICA -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-fuerza-body')">
      <h3>Fuerza isométrica ER / IR</h3>
      <span class="tag tag-b">LSI ≥90% · HHD · Otley 2024 · Reddy JSES 2023</span>
    </div>
    <div id="rtp-fuerza-body">
      <div class="card-body">
        <div style="font-size:10px;color:var(--text3);margin-bottom:10px">HHD (handgrip/push-pull). Medir a 0° y 90° ABD. Lanzadores: LSI &gt;100% en lado dominante afectado (adaptación esperada).</div>
        ${lsiRow('er0','ER a 0° ABD (N)')}
        ${lsiRow('ir0','IR a 0° ABD (N)')}
        ${lsiRow('er90','ER a 90° ABD (N)')}
        ${lsiRow('ir90','IR a 90° ABD (N)')}
        <div style="margin-top:4px;padding:8px;background:var(--bg4);border-radius:8px">
          <div style="font-size:10px;font-weight:700;margin-bottom:6px;color:var(--text2)">Ratios ER:IR (rango saludable: 0.65–0.99)</div>
          <div class="grid-2" style="gap:8px">
            <div><div class="il mb-2">Ratio 0° ABD</div><div id="rtp-ratio0" style="font-family:var(--mono);font-size:16px;color:var(--text3)">—</div></div>
            <div><div class="il mb-2">Ratio 90° ABD</div><div id="rtp-ratio90" style="font-family:var(--mono);font-size:16px;color:var(--text3)">—</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CADENA CERRADA -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-ckc-body')">
      <h3>Tests cadena cerrada</h3>
      <span class="tag tag-b">CKCUEST · UQ-YBT · OAHT</span>
    </div>
    <div id="rtp-ckc-body">
      <div class="card-body">
        <!-- CKCUEST -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">CKCUEST — Closed Kinetic Chain Upper Extremity Stability Test</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">Plancha, manos a 91 cm, toques alternos 15 s. 3 intentos → promedio. Mujeres: sobre rodillas. ≥21 = normal · ≥22 = pass Reddy 2023.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Reps/15 s (promedio)</label>
              <input class="inp inp-mono" type="number" step="0.1" id="ckcuest-reps" placeholder="0" oninput="calcRTPCKC()"></div>
            <div style="padding:8px;background:var(--bg4);border-radius:8px;text-align:center">
              <div style="font-size:9px;color:var(--text3)">Estado</div>
              <div id="ckcuest-tag" style="font-family:var(--mono);font-size:16px;font-weight:800;color:var(--text3);padding-top:6px">—</div>
            </div>
          </div>
        </div>
        <!-- UQ-YBT -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">UQ-YBT — Upper Quarter Y-Balance Test</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">Plancha 1 brazo, alcance en 3 direcciones normalizado a longitud de extremidad. LSI ≥90%.</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:4px">
            ${['med','sl','il'].map((dir,i)=>`
            <div>
              <div class="il mb-2" style="font-size:10px">${['Medial','S.Lateral','I.Lateral'][i]}</div>
              <div class="grid-2" style="gap:4px">
                <input class="inp inp-mono" type="number" step="0.1" id="ybt-${dir}-aff" placeholder="Aff" style="font-size:11px" oninput="calcRTPYBT()">
                <input class="inp inp-mono" type="number" step="0.1" id="ybt-${dir}-ctrl" placeholder="Ctrl" style="font-size:11px" oninput="calcRTPYBT()">
              </div>
              <div id="ybt-${dir}-lsi" style="font-size:10px;color:var(--text3);text-align:right">LSI: —</div>
            </div>`).join('')}
          </div>
        </div>
        <!-- OAHT -->
        <div>
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">OAHT — One-Arm Hop Test</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">Plancha 1 brazo, 5 saltos sobre step de 10.2 cm. Comparación bilateral (tiempo). Asimetría esperada DOM&gt;NONDOM: 4.4 s.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Tiempo afectado (s)</label>
              <input class="inp inp-mono" type="number" step="0.01" id="oaht-aff" placeholder="0.00" oninput="calcRTPOAHT()"></div>
            <div class="ig"><label class="il">Tiempo contralateral (s)</label>
              <input class="inp inp-mono" type="number" step="0.01" id="oaht-ctrl" placeholder="0.00" oninput="calcRTPOAHT()"></div>
          </div>
          <div id="oaht-result" style="font-size:11px;color:var(--text3);margin-top:4px;text-align:right">Diferencia: —</div>
        </div>
      </div>
    </div>
  </div>

  <!-- CADENA ABIERTA / POTENCIA -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-oca-body')">
      <h3>Tests cadena abierta y potencia</h3>
      <span class="tag tag-b">SSASP · BABER · Drop Catches</span>
    </div>
    <div id="rtp-oca-body">
      <div class="card-body">
        <!-- SSASP -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">SSASP — Seated Single Arm Shot Put</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">Long-sitting, espalda pared, pelota 2 kg. Máx. distancia horizontal (cm). Asimetría esperada: 3–13% (DOM &gt; NONDOM).</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Afectado (cm)</label>
              <input class="inp inp-mono" type="number" step="0.1" id="ssasp-aff" placeholder="0.0" oninput="calcRTPSSASP()"></div>
            <div class="ig"><label class="il">Contralateral (cm)</label>
              <input class="inp inp-mono" type="number" step="0.1" id="ssasp-ctrl" placeholder="0.0" oninput="calcRTPSSASP()"></div>
          </div>
          <div id="ssasp-result" style="font-size:11px;color:var(--text3);margin-top:4px;text-align:right">LSI: —</div>
        </div>
        <!-- BABER -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">BABER — Ball Bouncing And Reaching (Olds 2019)</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">1 min, pelota 3 kg. Normativa DOM: 16 ± 5 reps. LSI ≥91% = pass.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Afectado (reps)</label>
              <input class="inp inp-mono" type="number" id="baber-aff" placeholder="0" oninput="calcRTPBABER()"></div>
            <div class="ig"><label class="il">Contralateral (reps)</label>
              <input class="inp inp-mono" type="number" id="baber-ctrl" placeholder="0" oninput="calcRTPBABER()"></div>
          </div>
          <div id="baber-result" style="font-size:11px;color:var(--text3);margin-top:4px;text-align:right">LSI: —</div>
        </div>
        <!-- Drop Catches -->
        <div>
          <div style="font-size:11px;font-weight:600;margin-bottom:2px">Drop Catches (Olds 2019)</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:6px">1 min, pelota de tenis lanzada. Normativa DOM: 52 ± 12 capturas. LSI ≥93% = pass.</div>
          <div class="grid-2" style="gap:8px">
            <div class="ig"><label class="il">Afectado (capturas)</label>
              <input class="inp inp-mono" type="number" id="dropc-aff" placeholder="0" oninput="calcRTPDropC()"></div>
            <div class="ig"><label class="il">Contralateral (capturas)</label>
              <input class="inp inp-mono" type="number" id="dropc-ctrl" placeholder="0" oninput="calcRTPDropC()"></div>
          </div>
          <div id="dropc-result" style="font-size:11px;color:var(--text3);margin-top:4px;text-align:right">LSI: —</div>
        </div>
      </div>
    </div>
  </div>

  <!-- BATERÍA SARTS -->
  <div class="card mb-10">
    <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('rtp-sarts-body')">
      <h3>Batería SARTS — 8 tests (Olds 2019)</h3>
      <span class="tag tag-b">ICC 0.78–0.96 · 1 min / test</span>
    </div>
    <div id="rtp-sarts-body" style="display:none">
      <div class="card-body">
        <div style="font-size:10px;color:var(--text3);margin-bottom:10px">Shoulder Athletic Return to Sport battery. 6/8 confiables desde sesión 2. Drop Catches y Ball Taps requieren ≥3 sesiones para confiabilidad.</div>
        ${[
          {id:'baber2',   label:'BABER (cadena abierta)',           norm:'DOM 16±5',   unit:'reps/min',   note:''},
          {id:'dropcatch',label:'Drop Catches (cadena abierta)',    norm:'DOM 52±12',  unit:'reps/min',   note:'≥3 sesiones'},
          {id:'balltaps', label:'Ball Taps (cadena abierta)',       norm:'—',          unit:'golpes/min', note:'≥3 sesiones'},
          {id:'ohsnatch', label:'Overhead Snatch 5kg (abierta)',    norm:'DOM 24±5',   unit:'reps/min',   note:''},
          {id:'pushupcl', label:'Push-Up Claps (cadena cerrada)',   norm:'DOM 15±9',   unit:'reps/min',   note:'MDC90=4'},
          {id:'linehops', label:'Line Hops (cadena cerrada)',       norm:'—',          unit:'saltos/min', note:'MDC90=9'},
          {id:'mckcuest', label:'MCKCUEST (cadena cerrada)',        norm:'23±17',      unit:'reps/min',   note:'MDC90=0'},
          {id:'sidehold', label:'Side Hold Rotations (cerrada)',    norm:'DOM 18±5',   unit:'reps/min',   note:'MDC90=5'},
        ].map(t=>`
        <div style="padding:6px 0;border-bottom:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5px">
            <span style="font-size:11px;font-weight:600">${t.label}${t.note?` <span style="font-size:9px;color:var(--amber)">⚠️ ${t.note}</span>`:''}</span>
            <span style="font-size:9px;color:var(--text3)">${t.unit}</span>
          </div>
          <div class="grid-2" style="gap:6px">
            <div class="ig"><label class="il">D</label>
              <input class="inp inp-mono" type="number" step="0.1" placeholder="—" id="sarts-${t.id}-d" oninput="calcSARTS('${t.id}')"></div>
            <div class="ig"><label class="il">I</label>
              <input class="inp inp-mono" type="number" step="0.1" placeholder="—" id="sarts-${t.id}-i" oninput="calcSARTS('${t.id}')"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:3px">
            <span style="font-size:9px;color:var(--text3)">Norm: ${t.norm}</span>
            <div id="sarts-${t.id}-lsi" style="font-size:10px;color:var(--text3)">LSI: —</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- DECISIÓN FINAL -->
  <div class="card" style="border-color:rgba(0,255,136,.2)">
    <div class="card-header"><h3>Decisión de clearance</h3></div>
    <div class="card-body">
      <div class="ig"><label class="il">Semanas post-cirugía / lesión</label>
        <input class="inp inp-mono" type="number" id="rtp-semanas" placeholder="0" min="0"></div>
      <div style="font-size:10px;color:var(--text3);margin:8px 0;padding:8px;background:var(--bg4);border-radius:6px;line-height:1.7">
        <strong style="color:var(--amber)">Criterios Otley et al. 2024 / Kurz 2023:</strong><br>
        ✓ ROM completa sin dolor · ✓ WOSI mod ≥90 práctica / ≥95 competencia<br>
        ✓ LSI fuerza ER/IR ≥90% · ✓ CKCUEST ≥21 · ✓ UQ-YBT LSI ≥90%<br>
        ✓ Dolor ≤3/10 · ✓ SIRSI elevado · ✓ PRIA-RS ≥40 · ✓ ≥6 meses post-qx
      </div>
      <div class="ig"><label class="il">Notas del kinesiólgo</label>
        <textarea class="inp" rows="3" placeholder="Criterios cumplidos, pendientes, plan de exposición progresiva..."></textarea></div>
    </div>
  </div>`;
}

// ── RTP CALCULATORS ──────────────────────────────────────────────────────────
function calcRTPWOSI() {
  const v = document.getElementById('wosi-original')?.value;
  if (v === '' || v === null || v === undefined) return;
  const mod = +(100 - +v/21).toFixed(1);
  const el = document.getElementById('wosi-mod-val');
  const tag = document.getElementById('wosi-mod-tag');
  const c = mod >= 95 ? 'var(--neon)' : mod >= 90 ? 'var(--amber)' : 'var(--red)';
  if (el) { el.textContent = mod; el.style.color = c; }
  if (tag) { tag.textContent = mod >= 95 ? 'Competencia ✓' : mod >= 90 ? 'Solo práctica' : 'NO clearance'; tag.style.color = c; }
  const sv = document.getElementById('sema-wosi-val');
  if (sv) { sv.textContent = mod; sv.style.color = c; }
  calcRTPSemaforo();
}
function calcRTPSIRSI() {
  const v = document.getElementById('sirsi-suma')?.value;
  if (v === '' || v === undefined) return;
  const pct = +(+v / 120 * 100).toFixed(1);
  const el = document.getElementById('sirsi-pct');
  const c = pct >= 75 ? 'var(--neon)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';
  if (el) { el.textContent = pct + '%'; el.style.color = c; }
}
function calcRTPKJOC() {
  const v = +document.getElementById('kjoc-score')?.value;
  const el = document.getElementById('kjoc-tag'); if (!el) return;
  if (!v && v !== 0) { el.textContent = '—'; el.style.color = 'var(--text3)'; return; }
  if (v >= 90) { el.textContent = 'Normal ✓'; el.style.color = 'var(--neon)'; }
  else if (v >= 80) { el.textContent = 'Riesgo leve'; el.style.color = 'var(--amber)'; }
  else { el.textContent = 'RIESGO'; el.style.color = 'var(--red)'; }
}
function calcRTPPRIA() {
  const v = +document.getElementById('pria-rs')?.value;
  const el = document.getElementById('pria-tag'); if (!el) return;
  if (!v) { el.textContent = '—'; el.style.color = 'var(--text3)'; return; }
  el.textContent = v >= 40 ? 'Clearance ✓' : 'NO clearance';
  el.style.color = v >= 40 ? 'var(--neon)' : 'var(--red)';
}
function calcRTPFuerza() {
  ['er0','ir0','er90','ir90'].forEach(id => {
    const aff = +document.getElementById('rtp-'+id+'-aff')?.value || 0;
    const ctrl = +document.getElementById('rtp-'+id+'-ctrl')?.value || 0;
    const el = document.getElementById('rtp-'+id+'-lsi');
    if (el && ctrl > 0) {
      const lsi = +(aff/ctrl*100).toFixed(1);
      el.textContent = 'LSI: ' + lsi + '%';
      el.style.color = lsi >= 90 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
    }
  });
  const er0a = +document.getElementById('rtp-er0-aff')?.value || 0;
  const ir0a = +document.getElementById('rtp-ir0-aff')?.value || 0;
  const er90a = +document.getElementById('rtp-er90-aff')?.value || 0;
  const ir90a = +document.getElementById('rtp-ir90-aff')?.value || 0;
  const r0 = document.getElementById('rtp-ratio0');
  const r90 = document.getElementById('rtp-ratio90');
  if (r0 && ir0a > 0) {
    const ratio = +(er0a/ir0a).toFixed(2);
    r0.textContent = ratio;
    r0.style.color = ratio >= 0.65 && ratio <= 0.99 ? 'var(--neon)' : 'var(--amber)';
  }
  if (r90 && ir90a > 0) {
    const ratio = +(er90a/ir90a).toFixed(2);
    r90.textContent = ratio;
    r90.style.color = ratio >= 0.65 && ratio <= 0.99 ? 'var(--neon)' : 'var(--amber)';
  }
  // update semáforo ER LSI
  const er0c = +document.getElementById('rtp-er0-ctrl')?.value || 0;
  if (er0a > 0 && er0c > 0) {
    const lsi = +(er0a/er0c*100).toFixed(1);
    const sv = document.getElementById('sema-fuerza-val');
    const c = lsi >= 90 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
    if (sv) { sv.textContent = lsi+'%'; sv.style.color = c; }
  }
  calcRTPSemaforo();
}
function calcRTPCKC() {
  const v = +document.getElementById('ckcuest-reps')?.value || 0;
  const el = document.getElementById('ckcuest-tag');
  const sv = document.getElementById('sema-ckc-val');
  const c = v >= 22 ? 'var(--neon)' : v >= 21 ? 'var(--amber)' : 'var(--red)';
  if (el && v) { el.textContent = v >= 22 ? 'Pass ✓' : v >= 21 ? 'Normal' : 'Déficit'; el.style.color = c; }
  if (sv && v) { sv.textContent = v; sv.style.color = c; }
  calcRTPSemaforo();
}
function calcRTPYBT() {
  ['med','sl','il'].forEach(dir => {
    const aff = +document.getElementById('ybt-'+dir+'-aff')?.value || 0;
    const ctrl = +document.getElementById('ybt-'+dir+'-ctrl')?.value || 0;
    const el = document.getElementById('ybt-'+dir+'-lsi');
    if (el && ctrl > 0) {
      const lsi = +(aff/ctrl*100).toFixed(1);
      el.textContent = 'LSI: ' + lsi + '%';
      el.style.color = lsi >= 90 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
    }
  });
}
function calcRTPOAHT() {
  const aff = +document.getElementById('oaht-aff')?.value || 0;
  const ctrl = +document.getElementById('oaht-ctrl')?.value || 0;
  const el = document.getElementById('oaht-result'); if (!el || !aff || !ctrl) return;
  const diff = Math.abs(aff - ctrl).toFixed(2);
  el.textContent = 'Diferencia: ' + diff + 's ' + (+diff <= 4.4 ? '✓ Normal' : '⚠️ Asimetría elevada');
  el.style.color = +diff <= 4.4 ? 'var(--neon)' : 'var(--red)';
}
function calcRTPSSASP() {
  const aff = +document.getElementById('ssasp-aff')?.value || 0;
  const ctrl = +document.getElementById('ssasp-ctrl')?.value || 0;
  const el = document.getElementById('ssasp-result'); if (!el) return;
  if (!aff || !ctrl) { el.textContent = 'LSI: —'; el.style.color = 'var(--text3)'; return; }
  const lsi = +(aff/ctrl*100).toFixed(1);
  el.textContent = 'LSI: ' + lsi + '% (esperado 87–97%)';
  el.style.color = lsi >= 87 ? 'var(--neon)' : lsi >= 75 ? 'var(--amber)' : 'var(--red)';
}
function calcRTPBABER() {
  const aff = +document.getElementById('baber-aff')?.value || 0;
  const ctrl = +document.getElementById('baber-ctrl')?.value || 0;
  const el = document.getElementById('baber-result'); if (!el) return;
  if (!aff || !ctrl) { el.textContent = 'LSI: —'; el.style.color = 'var(--text3)'; return; }
  const lsi = +(aff/ctrl*100).toFixed(1);
  el.textContent = 'LSI: ' + lsi + '% (pass ≥91%)';
  el.style.color = lsi >= 91 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
}
function calcRTPDropC() {
  const aff = +document.getElementById('dropc-aff')?.value || 0;
  const ctrl = +document.getElementById('dropc-ctrl')?.value || 0;
  const el = document.getElementById('dropc-result'); if (!el) return;
  if (!aff || !ctrl) { el.textContent = 'LSI: —'; el.style.color = 'var(--text3)'; return; }
  const lsi = +(aff/ctrl*100).toFixed(1);
  el.textContent = 'LSI: ' + lsi + '% (pass ≥93%)';
  el.style.color = lsi >= 93 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
}
function calcSARTS(id) {
  const d = +document.getElementById('sarts-'+id+'-d')?.value || 0;
  const i = +document.getElementById('sarts-'+id+'-i')?.value || 0;
  const el = document.getElementById('sarts-'+id+'-lsi');
  if (!el || !d || !i) { if(el) { el.textContent = 'LSI: —'; el.style.color = 'var(--text3)'; } return; }
  const lsi = +(d/i*100).toFixed(1);
  el.textContent = 'LSI: ' + lsi + '%';
  el.style.color = lsi >= 90 ? 'var(--neon)' : lsi >= 80 ? 'var(--amber)' : 'var(--red)';
}
function calcRTPSemaforo() {
  const wosiV = document.getElementById('wosi-original')?.value;
  const wosi_mod = wosiV !== '' && wosiV !== undefined ? +(100 - +wosiV/21).toFixed(1) : null;
  const nrs = +document.getElementById('rtp-nrs')?.value || 0;
  const er0a = +document.getElementById('rtp-er0-aff')?.value || 0;
  const er0c = +document.getElementById('rtp-er0-ctrl')?.value || 0;
  const lsi_er = er0c > 0 ? +(er0a/er0c*100).toFixed(1) : null;
  const ckc = +document.getElementById('ckcuest-reps')?.value || 0;

  const checks = [];
  if (wosi_mod !== null) checks.push({ ok: wosi_mod >= 95, label: 'WOSI' });
  if (document.getElementById('rtp-nrs')?.value !== '' && document.getElementById('rtp-nrs')?.value !== undefined) checks.push({ ok: nrs <= 3, label: 'Dolor' });
  if (lsi_er !== null) checks.push({ ok: lsi_er >= 90, label: 'LSI ER' });
  if (ckc > 0) checks.push({ ok: ckc >= 21, label: 'CKCUEST' });

  // update dolor sema
  if (document.getElementById('rtp-nrs')?.value !== '') {
    const sv = document.getElementById('sema-dolor-val');
    const c = nrs <= 3 ? 'var(--neon)' : nrs <= 6 ? 'var(--amber)' : 'var(--red)';
    if (sv) { sv.textContent = nrs+'/10'; sv.style.color = c; }
  }

  const verdict = document.getElementById('rtp-clearance-verdict'); if (!verdict) return;
  if (checks.length === 0) return;
  const passed = checks.filter(c => c.ok).length;
  const failed = checks.filter(c => !c.ok).map(c => c.label);
  if (passed === checks.length && checks.length >= 3) {
    verdict.textContent = '✅ CRITERIOS CUMPLIDOS — Clearance deportivo posible';
    verdict.style.background = 'rgba(0,255,136,.12)'; verdict.style.color = 'var(--neon)'; verdict.style.fontWeight = '700';
  } else if (passed >= checks.length * 0.75) {
    verdict.textContent = '⚠️ ' + passed + '/' + checks.length + ' OK — Pendientes: ' + failed.join(', ');
    verdict.style.background = 'rgba(255,176,32,.12)'; verdict.style.color = 'var(--amber)'; verdict.style.fontWeight = '700';
  } else {
    verdict.textContent = '❌ ' + passed + '/' + checks.length + ' — NO clearance. Déficit en: ' + failed.join(', ');
    verdict.style.background = 'rgba(255,68,68,.12)'; verdict.style.color = 'var(--red)'; verdict.style.fontWeight = '700';
  }
}

// ── INFORME KINESIOLÓGICO HOMBRO ─────────────────────────────────────────────
// Genera un reporte profesional imprimible en nueva ventana

function buildHombroInforme() {
  const c = document.getElementById('hombro-informe-panel');
  if (!c || c.innerHTML) return;
  const profV  = document.getElementById('prof-nombre')?.value || 'Lic. Emanuel Lezcano';
  const instV  = document.getElementById('prof-inst')?.value   || 'The Move Club';
  c.innerHTML = `
  <div style="font-size:11px;color:var(--text3);margin-bottom:12px;padding:8px;background:var(--bg4);border-radius:8px">
    <strong style="color:var(--amber)">Informe Clínico</strong> · Genera un PDF profesional con los datos de la evaluación actual. Solo se incluyen secciones con datos completados.
  </div>

  <!-- Destinatario -->
  <div class="card mb-10">
    <div class="card-header"><h3>Destinatario</h3></div>
    <div class="card-body">
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px">
          <input type="radio" name="inf-dest" value="medico" id="inf-dest-med" checked
            onchange="document.getElementById('inf-med-fields').style.display='block'">
          Médico / Especialista
        </label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px">
          <input type="radio" name="inf-dest" value="paciente" id="inf-dest-pac"
            onchange="document.getElementById('inf-med-fields').style.display='none'">
          Paciente / Familia
        </label>
      </div>
      <div id="inf-med-fields">
        <div class="grid-2" style="gap:8px">
          <div class="ig"><label class="il">Nombre del médico (Dr./Dra.)</label>
            <input class="inp" id="inf-doctor-nombre" placeholder="Ej: Juan García"></div>
          <div class="ig"><label class="il">Especialidad</label>
            <input class="inp" id="inf-doctor-esp" placeholder="Ej: Ortopedia y Traumatología"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Firmante -->
  <div class="card mb-10">
    <div class="card-header"><h3>Profesional firmante</h3></div>
    <div class="card-body">
      <div class="grid-2" style="gap:8px">
        <div class="ig"><label class="il">Nombre profesional</label>
          <input class="inp" id="inf-prof-nombre" placeholder="Lic. Emanuel Lezcano" value="${profV}"></div>
        <div class="ig"><label class="il">MP / Matrícula</label>
          <input class="inp" id="inf-prof-mp" placeholder="MP 12345"></div>
        <div class="ig"><label class="il">Institución</label>
          <input class="inp" id="inf-prof-inst" placeholder="The Move Club" value="${instV}"></div>
        <div class="ig"><label class="il">Diagnóstico kinesiológico</label>
          <input class="inp" id="inf-dx-manual" placeholder="Ej: Tendinopatía supraespinoso crónica D"></div>
      </div>
    </div>
  </div>

  <!-- Secciones -->
  <div class="card mb-10">
    <div class="card-header"><h3>Secciones a incluir</h3></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${[
          ['inf-sec-rom','ROM'],['inf-sec-tests','Tests ortopédicos'],
          ['inf-sec-fuerza','Fuerza HHD'],['inf-sec-escalas','Escalas funcionales'],
          ['inf-sec-rtp','Criterios RTP'],['inf-sec-trat','Plan de tratamiento'],
        ].map(([id,label])=>`
          <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer">
            <input type="checkbox" id="${id}" checked> ${label}
          </label>`).join('')}
      </div>
    </div>
  </div>

  <!-- Notas -->
  <div class="card mb-12">
    <div class="card-header"><h3>Notas clínicas adicionales</h3></div>
    <div class="card-body">
      <textarea class="inp" id="inf-notas" rows="3"
        placeholder="Educación al paciente, contraindicaciones, derivaciones sugeridas..."></textarea>
    </div>
  </div>

  <!-- Botón -->
  <button class="btn btn-neon btn-full" onclick="generarInformeHombro()">
    📄 Generar Informe & Abrir para imprimir
  </button>`;
}

// Helper: EVA slider color
function _iColor(val, low, high) {
  return +val <= low ? '#2d7a2d' : +val <= high ? '#c65a00' : '#cc3333';
}
// Helper: LSI color
function _lsiColor(pct) {
  return +pct >= 90 ? '#2d7a2d' : +pct >= 80 ? '#c65a00' : '#cc3333';
}
// Helper: section header
function _infSecHead(num, title) {
  return `<div style="display:flex;align-items:center;gap:8px;margin:20px 0 10px;padding-bottom:5px;border-bottom:2px solid #e8f0d4">
    <span style="background:#8fa845;color:#fff;font-size:9px;font-weight:900;padding:2px 9px;border-radius:3px;letter-spacing:1px">${num}</span>
    <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#1e2d0e">${title}</span>
  </div>`;
}
// Helper: data row
function _infRow(k, v) {
  return `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #e5e5e0;font-size:11px">
    <span style="color:#666">${k}</span><span style="font-weight:600">${v||'—'}</span>
  </div>`;
}
// Read orthopedic test DOM state
function _readHombroTests() {
  const results = [];
  // Painful arc (hardcoded card — first card in htab-tests)
  const htabTests = document.getElementById('htab-tests');
  if (htabTests) {
    const paCard = htabTests.querySelector('.card.mb-10');
    if (paCard) {
      const cols = paCard.querySelectorAll('.grid-2 > div');
      const dCol = cols[0], iCol = cols[1];
      const dPos = dCol?.querySelector('.ot-btn.pos'), dNeg = dCol?.querySelector('.ot-btn.neg');
      const iPos = iCol?.querySelector('.ot-btn.pos'), iNeg = iCol?.querySelector('.ot-btn.neg');
      if (dPos||dNeg||iPos||iNeg) results.push({
        name:'Arco Doloroso (Painful Arc)', ebi:'LR+ 3.44 · Confirmar RC',
        dR: dPos?'POS':dNeg?'NEG':'—', iR: iPos?'POS':iNeg?'NEG':'—',
        evaD: dNeg?'0':(dCol?.querySelector('.eva-slider')?.value||'—'),
        evaI: iNeg?'0':(iCol?.querySelector('.eva-slider')?.value||'—'),
      });
    }
  }
  // Quick test cards
  const cards = document.querySelectorAll('#hombro-tests-rapidos .card');
  cards.forEach((card,idx) => {
    const test = HOMBRO_TESTS[idx]; if (!test) return;
    const cols = card.querySelectorAll('.card-body .grid-2 > div');
    const dCol = cols[0], iCol = cols[1];
    const dPos = dCol?.querySelector('.ot-btn.pos'), dNeg = dCol?.querySelector('.ot-btn.neg');
    const iPos = iCol?.querySelector('.ot-btn.pos'), iNeg = iCol?.querySelector('.ot-btn.neg');
    if (!dPos&&!dNeg&&!iPos&&!iNeg) return;
    results.push({
      name: test.name, ebi: test.sub,
      dR: dPos?'POS':dNeg?'NEG':'—', iR: iPos?'POS':iNeg?'NEG':'—',
      evaD: dNeg?'0':(dCol?.querySelector('.eva-slider')?.value||'—'),
      evaI: iNeg?'0':(iCol?.querySelector('.eva-slider')?.value||'—'),
    });
  });
  return results;
}

function generarInformeHombro() {
  // ── Data collection ──
  const g  = id => document.getElementById(id)?.value || '';
  const gt = id => document.getElementById(id)?.textContent?.trim() || '';
  const ch = id => document.getElementById(id)?.checked;

  const dest       = document.querySelector('input[name="inf-dest"]:checked')?.value || 'medico';
  const docNombre  = g('inf-doctor-nombre');
  const docEsp     = g('inf-doctor-esp');
  const profNombre = g('inf-prof-nombre') || 'Lic. Emanuel Lezcano';
  const profMP     = g('inf-prof-mp');
  const profInst   = g('inf-prof-inst') || 'The Move Club';
  const dxManual   = g('inf-dx-manual');
  const notasExtra = g('inf-notas');
  const fecha      = new Date().toLocaleDateString('es-AR', {day:'2-digit',month:'long',year:'numeric'});

  // Patient
  const nombre  = cur?.nombre || '—';
  const edad    = cur?.edad || '';
  const peso    = cur?.peso || '';
  const talla   = cur?.talla || '';
  const deporte = cur?.deporte || '';

  // Red flags & prognostic factors
  const redflags = [...document.querySelectorAll('.hombro-redflag:checked')].length > 0;
  const progCbs  = [...document.querySelectorAll('#htab-obs .card:nth-child(2) input[type=checkbox]:checked')];
  const progList = progCbs.map(el => el.closest('label')?.textContent?.trim() || '').filter(Boolean);
  const obsNotes = document.querySelector('#htab-obs textarea')?.value || '';

  // ROM
  const romRows = (ROM_HOMBRO||[]).map(m => ({
    label: m.label, ref: m.ref,
    actD: g(`rom-${m.id}-act-d`), actI: g(`rom-${m.id}-act-i`),
    pasD: g(`rom-${m.id}-pas-d`), pasI: g(`rom-${m.id}-pas-i`),
  })).filter(r => r.actD||r.actI||r.pasD||r.pasI);
  const tromD = gt('hombro-trom-d'), tromI = gt('hombro-trom-i');

  // Tests
  const tests = _readHombroTests();

  // Strength
  const fuerzaRows = (FUERZA_HOMBRO||[]).map(m => {
    const d = g(`fuerza-${m.id}-d`), i = g(`fuerza-${m.id}-i`);
    if (!d && !i) return null;
    const asim = (d&&i) ? ((Math.abs(+d - +i)/Math.max(+d,+i))*100).toFixed(1) : null;
    return { label:`${m.label} ${m.angulo}`, d, i, asim };
  }).filter(Boolean);

  // Scales
  const ases  = gt('ases-total');
  const worc  = gt('worc-total-sheet');
  const worcP = gt('worc-pct-sheet');
  const dash  = gt('dash-total-sheet');
  const spadi = gt('spadi-total');
  const hasEscalas = [ases,worc,dash,spadi].some(v => v && v !== '—');

  // RTP
  const wosiMod   = gt('wosi-mod-val');
  const wosiTag   = gt('wosi-mod-tag');
  const sirsiPct  = gt('sirsi-pct');
  const kjoc      = g('kjoc-score');
  const priars    = g('pria-rs');
  const rtpNrs    = g('rtp-nrs');
  const lsiER     = gt('rtp-er0-lsi');
  const ckcuest   = g('ckcuest-reps');
  const hasRTP = [wosiMod,sirsiPct,kjoc,ckcuest].some(v => v && v !== '—');

  // Diagnostic engine output
  const dxCard = document.getElementById('kine-dx-hombro-card');
  const dxHTML = dxCard?.style.display !== 'none' ? (dxCard?.innerHTML || '') : '';

  // ── Section toggles ──
  const secROM    = ch('inf-sec-rom');
  const secTests  = ch('inf-sec-tests');
  const secFuerza = ch('inf-sec-fuerza');
  const secEsc    = ch('inf-sec-escalas');
  const secRTP    = ch('inf-sec-rtp');
  const secTrat   = ch('inf-sec-trat');

  // ── Build HTML ──
  const css = `
    body{font-family:Inter,Arial,sans-serif;margin:0;background:#fff;color:#1a1a1a;font-size:12px;line-height:1.5}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#8fa845;color:#fff;padding:6px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    td{padding:5px 8px;border-bottom:1px solid #e8f0d4}
    tr:nth-child(even) td{background:#f8faf2}
    .pos{color:#2d7a2d;font-weight:700}
    .neg{color:#888}
    .alerta{color:#cc3333;font-weight:700}
    .limite{color:#c65a00;font-weight:700}
    .ok{color:#2d7a2d;font-weight:700}
    .sec-badge{display:inline-block;background:#8fa845;color:#fff;font-size:9px;font-weight:900;padding:2px 9px;border-radius:3px;letter-spacing:1px;margin-right:8px}
    .sec-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#1e2d0e}
    .sec-head{display:flex;align-items:center;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid #e8f0d4}
    .metric-box{background:#f5f7ee;border-radius:6px;padding:10px;text-align:center;border:1px solid #e8f0d4}
    .metric-val{font-size:22px;font-weight:900;line-height:1}
    .metric-lbl{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
    .metric-sub{font-size:8px;color:#999;margin-top:3px}
    @media print{
      .no-print{display:none!important}
      body{font-size:11px}
      header{-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .sec-badge,.pos,.neg,.metric-box{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    }
  `;

  // Intro paragraph
  const intro = dest === 'medico'
    ? `<div style="padding:16px 32px;background:#f8f9f3;border-left:4px solid #8fa845;font-size:11px;line-height:1.8;color:#2a2a2a">
        ${docNombre ? `Dr./Dra. <strong>${docNombre}</strong>${docEsp?` (${docEsp})`:''},<br><br>` : ''}
        Me dirijo a Ud. y su equipo ${docEsp||'médico'} con el agrado de presentarle el informe kinesiológico del/la paciente
        <strong>${nombre}</strong>${edad?' de '+edad+' años':''}. La evaluación fue realizada con fecha <strong>${fecha}</strong>
        siguiendo los lineamientos de la Guía de Práctica Clínica CPG 2025 (Desmeules et al., JOSPT) para patología de hombro,
        con pruebas de rendimiento diagnóstico validadas por meta-análisis (Zhao 2024).
       </div>`
    : `<div style="padding:16px 32px;background:#f8f9f3;border-left:4px solid #8fa845;font-size:11px;line-height:1.8;color:#2a2a2a">
        Estimado/a <strong>${nombre}</strong>:<br><br>
        A continuación presentamos los resultados de su evaluación kinesiológica del <strong>${fecha}</strong>.
        Este informe resume los hallazgos sobre su hombro, incluyendo movilidad, fuerza, pruebas clínicas y
        cuestionarios funcionales, junto con las recomendaciones de tratamiento.
       </div>`;

  // 01 — Perfil & Screening
  const sec01 = `
    ${_infSecHead('01','Perfil del atleta & Screening')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#f5f7ee;border-radius:6px;padding:12px;border:1px solid #e8f0d4">
        <div style="font-size:9px;text-transform:uppercase;color:#8fa845;font-weight:700;letter-spacing:1px;margin-bottom:8px">Datos del Paciente</div>
        ${_infRow('Nombre', nombre)}
        ${_infRow('Edad', edad ? edad+' años' : '')}
        ${_infRow('Morfología', [peso?peso+'kg':'', talla?talla+'cm':''].filter(Boolean).join(' / '))}
        ${_infRow('Disciplina', deporte)}
        ${_infRow('Fecha evaluación', fecha)}
      </div>
      <div style="background:#f5f7ee;border-radius:6px;padding:12px;border:1px solid #e8f0d4">
        <div style="font-size:9px;text-transform:uppercase;color:#8fa845;font-weight:700;letter-spacing:1px;margin-bottom:8px">Screening CPG 2025</div>
        <div style="font-size:11px;font-weight:700;margin-bottom:8px;color:${redflags?'#cc3333':'#2d7a2d'}">
          ${redflags ? '⚠ BANDERAS ROJAS DETECTADAS — DERIVAR' : '✓ Sin banderas rojas'}
        </div>
        ${progList.length ? `<div style="font-size:10px;color:#c65a00;font-weight:600;margin-bottom:4px">Factores pronósticos activos:</div>
          ${progList.map(f=>`<div style="font-size:10px;color:#c65a00">• ${f}</div>`).join('')}`
        : `<div style="font-size:10px;color:#666">Sin factores pronósticos relevantes</div>`}
        ${obsNotes ? `<div style="font-size:10px;color:#444;margin-top:8px;font-style:italic">${obsNotes}</div>` : ''}
      </div>
    </div>`;

  // 02 — ROM
  const sec02 = (secROM && romRows.length) ? `
    ${_infSecHead('02','Análisis de rango de movimiento (ROM)')}
    <div style="font-size:10px;color:#888;margin-bottom:6px">Marco de referencia: CPG 2025 Rec.#6 · MDC activo: 8–23°</div>
    <table>
      <tr><th>Movimiento</th><th>Referencia</th><th>Activo D</th><th>Activo I</th><th>Pasivo D</th><th>Pasivo I</th></tr>
      ${romRows.map(r=>`<tr>
        <td><strong>${r.label}</strong></td><td style="color:#888">${r.ref}</td>
        <td>${r.actD?r.actD+'°':'—'}</td><td>${r.actI?r.actI+'°':'—'}</td>
        <td>${r.pasD?r.pasD+'°':'—'}</td><td>${r.pasI?r.pasI+'°':'—'}</td>
      </tr>`).join('')}
      ${(tromD&&tromD!=='—')||(tromI&&tromI!=='—') ? `<tr style="background:#f0f5e8">
        <td colspan="2"><strong>TROM (RI+RE)</strong></td>
        <td><strong>${tromD}</strong></td><td><strong>${tromI}</strong></td><td></td><td></td>
      </tr>` : ''}
    </table>` : '';

  // 03 — Tests ortopédicos
  const sec03 = (secTests && tests.length) ? `
    ${_infSecHead('03','Mapeo ortopédico de provocación')}
    <div style="font-size:10px;color:#888;margin-bottom:6px">Resultados basados en evidencia · Zhao 2024 meta-análisis · CPG 2025</div>
    <table>
      <tr><th>Test</th><th>EBM</th><th>D</th><th>EVA D</th><th>I</th><th>EVA I</th></tr>
      ${tests.map(t=>`<tr>
        <td><strong>${t.name}</strong></td>
        <td style="font-size:10px;color:#666">${t.ebi}</td>
        <td class="${t.dR==='POS'?'pos':t.dR==='NEG'?'neg':''}">${t.dR==='POS'?'✚ POSITIVO':t.dR==='NEG'?'– NEGATIVO':'—'}</td>
        <td>${t.dR==='NEG'?'0':(t.evaD||'—')}${t.evaD&&t.evaD!=='—'?'/10':''}</td>
        <td class="${t.iR==='POS'?'pos':t.iR==='NEG'?'neg':''}">${t.iR==='POS'?'✚ POSITIVO':t.iR==='NEG'?'– NEGATIVO':'—'}</td>
        <td>${t.iR==='NEG'?'0':(t.evaI||'—')}${t.evaI&&t.evaI!=='—'?'/10':''}</td>
      </tr>`).join('')}
    </table>` : '';

  // 04 — Fuerza HHD
  const sec04 = (secFuerza && fuerzaRows.length) ? `
    ${_infSecHead('04','Perfil de fuerza dinamométrica (HHD)')}
    <div style="font-size:10px;color:#888;margin-bottom:6px">Newtons (N) · MDC 15–20% · CPG 2025 Rec.#7</div>
    <table>
      <tr><th>Movimiento</th><th>D (N)</th><th>I (N)</th><th>Asimetría</th><th>Interpretación</th></tr>
      ${fuerzaRows.map(r=>`<tr>
        <td><strong>${r.label}</strong></td>
        <td>${r.d||'—'}</td><td>${r.i||'—'}</td>
        <td class="${r.asim?+r.asim>=20?'alerta':+r.asim>=15?'limite':'ok':''}">${r.asim?r.asim+'%':'—'}</td>
        <td style="font-size:10px">${r.asim?(+r.asim>=20?'⚠ CRÍTICO >MDC':+r.asim>=15?'Límite MDC':'✓ Normal'):'—'}</td>
      </tr>`).join('')}
    </table>` : '';

  // Dashboard metrics
  const dashboard = (hasEscalas || hasRTP) ? `
    ${_infSecHead('05','Dashboard — Indicadores clínicos clave')}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
      ${ases&&ases!=='—'?`<div class="metric-box">
        <div class="metric-lbl">ASES Score</div>
        <div class="metric-val" style="color:${+ases>=80?'#2d7a2d':+ases>=60?'#c65a00':'#cc3333'}">${ases}</div>
        <div class="metric-sub">MCID: 6.4–21.9 · /100</div></div>`:''}
      ${worc&&worc!=='—'?`<div class="metric-box">
        <div class="metric-lbl">WORC</div>
        <div class="metric-val" style="color:${worcP?'#2d7a2d':'#c65a00'}">${worcP||worc}</div>
        <div class="metric-sub">MCID: 245.3 · /2100</div></div>`:''}
      ${dash&&dash!=='—'?`<div class="metric-box">
        <div class="metric-lbl">DASH</div>
        <div class="metric-val" style="color:${+dash<=30?'#2d7a2d':+dash<=50?'#c65a00':'#cc3333'}">${dash}</div>
        <div class="metric-sub">MCID: 10.2 · /100</div></div>`:''}
      ${wosiMod&&wosiMod!=='—'?`<div class="metric-box">
        <div class="metric-lbl">WOSI mod.</div>
        <div class="metric-val" style="color:${+wosiMod>=95?'#2d7a2d':+wosiMod>=90?'#c65a00':'#cc3333'}">${wosiMod}</div>
        <div class="metric-sub">≥95 competencia</div></div>`:''}
    </div>` : '';

  // 06 — Escalas
  const sec06 = (secEsc && hasEscalas) ? `
    ${_infSecHead('06','Escalas funcionales (CPG 2025 Rec.#8)')}
    <table>
      <tr><th>Escala</th><th>Score</th><th>MCID</th><th>Interpretación</th></tr>
      ${ases&&ases!=='—'?`<tr><td>ASES Score</td><td><strong>${ases}/100</strong></td><td>6.4–21.9 pts</td>
        <td class="${+ases>=80?'ok':+ases>=60?'limite':'alerta'}">${+ases>=80?'Buena función':+ases>=60?'Función moderada':'Función severamente limitada'}</td></tr>`:''}
      ${worc&&worc!=='—'?`<tr><td>WORC Index</td><td><strong>${worc}/2100</strong>${worcP?` (${worcP})`:''}</td><td>245.3 pts</td>
        <td style="font-size:10px;color:#666">Menor = mejor</td></tr>`:''}
      ${dash&&dash!=='—'?`<tr><td>DASH / QuickDASH</td><td><strong>${dash}/100</strong></td><td>10.2 pts</td>
        <td class="${+dash<=30?'ok':+dash<=50?'limite':'alerta'}">${+dash<=30?'Discapacidad leve':+dash<=50?'Discapacidad moderada':'Discapacidad severa'}</td></tr>`:''}
      ${spadi&&spadi!=='—'?`<tr><td>SPADI</td><td><strong>${spadi}/100</strong></td><td>8 pts</td>
        <td class="${+spadi<=30?'ok':+spadi<=50?'limite':'alerta'}">${+spadi<=30?'Leve':+spadi<=50?'Moderado':'Severo'}</td></tr>`:''}
    </table>` : '';

  // 07 — RTP
  const sec07 = (secRTP && hasRTP) ? `
    ${_infSecHead('07','Criterios de retorno al juego (RTP)')}
    <div style="font-size:10px;color:#888;margin-bottom:6px">Kurz BMJ Open 2023 · Otley et al. 2024</div>
    <table>
      <tr><th>Indicador</th><th>Valor</th><th>Criterio</th><th>Estado</th></tr>
      ${wosiMod&&wosiMod!=='—'?`<tr><td>WOSI modificado</td><td><strong>${wosiMod}</strong></td><td>≥95 competencia / ≥90 práctica</td>
        <td class="${+wosiMod>=95?'ok':+wosiMod>=90?'limite':'alerta'}">${wosiTag||''}</td></tr>`:''}
      ${sirsiPct?`<tr><td>SIRSI %</td><td><strong>${sirsiPct}</strong></td><td>Mayor % = mejor</td>
        <td class="${+sirsiPct.replace('%','')>=75?'ok':'limite'}">Readiness psicológica</td></tr>`:''}
      ${kjoc?`<tr><td>KJOC Score</td><td><strong>${kjoc}%</strong></td><td>≥88–90% overhead</td>
        <td class="${+kjoc>=90?'ok':+kjoc>=80?'limite':'alerta'}">${+kjoc>=90?'Normal':+kjoc>=80?'Riesgo leve':'⚠ Riesgo'}</td></tr>`:''}
      ${rtpNrs?`<tr><td>NRS Dolor</td><td><strong>${rtpNrs}/10</strong></td><td>≤3/10</td>
        <td class="${+rtpNrs<=3?'ok':+rtpNrs<=6?'limite':'alerta'}">${+rtpNrs<=3?'✓ OK':'⚠ Excede criterio'}</td></tr>`:''}
      ${lsiER&&lsiER!=='—'?`<tr><td>LSI ER (Fuerza)</td><td><strong>${lsiER}</strong></td><td>≥90%</td>
        <td class="${+lsiER.replace('LSI: ','').replace('%','')>=90?'ok':'alerta'}">Simetría miembros</td></tr>`:''}
      ${ckcuest?`<tr><td>CKCUEST</td><td><strong>${ckcuest} reps</strong></td><td>≥21 reps/15s</td>
        <td class="${+ckcuest>=21?'ok':'alerta'}">${+ckcuest>=22?'Pass ✓':+ckcuest>=21?'Normal':'Déficit'}</td></tr>`:''}
    </table>` : '';

  // 08 — Diagnóstico presuntivo
  const sec08 = `
    ${_infSecHead('08','Diagnóstico kinesiológico presuntivo')}
    ${dxManual?`<div style="background:#f5f7ee;border-radius:6px;padding:10px;border:1px solid #e8f0d4;font-size:12px;font-weight:600;color:#1e2d0e;margin-bottom:8px">
      ${dxManual}</div>`:''}
    ${dxHTML?`<div style="background:#f5f7ee;border-radius:6px;padding:8px;border:1px solid #e8f0d4;font-size:11px">${dxHTML}</div>`
    :'<div style="font-size:11px;color:#888;font-style:italic">Completar "Diagnóstico kinesiológico" en el formulario o realizar tests en el panel Kinesiólogo para diagnóstico automático.</div>'}`;

  // 09 — Plan de tratamiento
  const sec09 = secTrat ? `
    ${_infSecHead('09','Ruta de tratamiento basada en evidencia')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${[
        ['FASE 1 — Modulación analgésica', 'Sem. 1–3', 'Isometría pesada RE a 0° y 45° (5×45s, 70% MIVC). Protocolo capsular posterior (Sleeper Stretch). Reducción de inhibición artrogénica.'],
        ['FASE 2 — Orientación estructural (HSR)', 'Sem. 4–8', 'Heavy Slow Resistance 3s/3s. Síntesis colágena. Trabajo escapular: Push-up plus, remo supino, serrato anterior.'],
        ['FASE 3 — Potencia y cadena cinética', 'Sem. 9–12', 'Pliometría tren superior. Lanzamientos balísticos. Integración de patrones de empuje cruzado con apoyo monopodal.'],
        ['FASE 4 — RTS específico', 'Sem. 13+', 'Simulación gestual del deporte. Perturbaciones externas reactivas en overhead. Exposición progresiva con criterios objetivos.'],
      ].map(([titulo,sem,desc])=>`
      <div style="background:#f5f7ee;border-radius:6px;padding:10px;border:1px solid #e8f0d4">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <strong style="font-size:10px;color:#1e2d0e">${titulo}</strong>
          <span style="background:#8fa845;color:#fff;font-size:8px;padding:1px 6px;border-radius:3px">${sem}</span>
        </div>
        <div style="font-size:10px;color:#555;line-height:1.5">${desc}</div>
      </div>`).join('')}
    </div>` : '';

  // 10 — Notas clínicas
  const sec10 = notasExtra ? `
    ${_infSecHead('10','Notas clínicas adicionales')}
    <div style="background:#fdfde8;border-radius:6px;padding:12px;border:1px solid #e8e0a0;font-size:11px;line-height:1.7;white-space:pre-wrap">${notasExtra}</div>` : '';

  // Firma
  const firma = `
    <div style="margin-top:32px;padding-top:16px;border-top:2px solid #e8f0d4;display:flex;justify-content:space-between;align-items:flex-end">
      <div style="font-size:10px;color:#888">
        <div>THE MOVE CLUB · Kinesiología de Alto Rendimiento</div>
        <div>CPG 2025 · Desmeules et al. · Zhao 2024 meta-análisis</div>
      </div>
      <div style="text-align:right">
        <div style="width:140px;border-top:1px solid #1e2d0e;margin-bottom:4px"></div>
        <div style="font-size:11px;font-weight:700">${profNombre}</div>
        ${profMP?`<div style="font-size:10px;color:#666">${profMP}</div>`:''}
        <div style="font-size:10px;color:#666">${profInst}</div>
      </div>
    </div>`;

  // ── Assemble full report ──
  const bodyContent = sec01 + sec02 + sec03 + sec04 + dashboard + sec06 + sec07 + sec08 + sec09 + sec10 + firma;

  const fullHTML = `<!DOCTYPE html>
<html lang="es"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Informe Kinesiológico — ${nombre} — ${fecha}</title>
  <style>${css}</style>
</head><body>
<div class="no-print" style="background:#1e2d0e;padding:12px 24px;display:flex;gap:8px;align-items:center;position:sticky;top:0;z-index:100">
  <button onclick="window.print()" style="background:#8fa845;color:#fff;border:none;border-radius:4px;padding:8px 16px;font-weight:700;cursor:pointer;font-size:12px">🖨 Imprimir / Guardar PDF</button>
  <button onclick="toggleEditMode()" id="edit-btn" style="background:#555;color:#fff;border:none;border-radius:4px;padding:8px 14px;cursor:pointer;font-size:12px">✏ Editar</button>
  <span style="font-size:11px;color:rgba(255,255,255,.5);margin-left:8px">En imprimir → elegir "Guardar como PDF"</span>
</div>
<header style="background:#1e2d0e;padding:24px 40px;display:flex;justify-content:space-between;align-items:flex-start">
  <div>
    <div style="font-size:26px;font-weight:900;letter-spacing:-.5px;color:#c8e06b">THE MOVE CLUB</div>
    <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.45);margin-top:2px">REPORTE CLÍNICO KINESIOLÓGICO</div>
    <div style="font-size:11px;color:rgba(255,255,255,.65);margin-top:6px">Basado en evidencia · CPG 2025 · Desmeules et al. (JOSPT)</div>
  </div>
  <div style="text-align:right;color:rgba(255,255,255,.8);font-size:11px">
    <div style="font-size:9px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:1px">Fecha evaluación</div>
    <div style="font-size:16px;font-weight:700;color:#c8e06b">${fecha}</div>
    <div style="margin-top:6px">${profNombre}${profMP?' · '+profMP:''}</div>
    <div style="font-size:10px;color:rgba(255,255,255,.5)">${profInst}</div>
  </div>
</header>
${intro}
<main id="report-body" style="padding:8px 40px 32px;max-width:800px;margin:0 auto">${bodyContent}</main>
<footer style="background:#1e2d0e;color:rgba(255,255,255,.4);padding:10px 40px;display:flex;justify-content:space-between;font-size:9px">
  <span>THE MOVE CLUB · DEPARTAMENTO DE BIOMECÁNICA Y RENDIMIENTO</span>
  <span>Informe Clínico Kinesiológico · CPG 2025</span>
</footer>
<script>
function toggleEditMode(){
  const body = document.getElementById('report-body');
  const btn  = document.getElementById('edit-btn');
  const intro = document.querySelector('header + div');
  const editing = body.contentEditable === 'true';
  body.contentEditable = editing ? 'false' : 'true';
  if (intro) intro.contentEditable = body.contentEditable;
  body.style.outline = editing ? 'none' : '2px dashed #8fa845';
  btn.textContent = editing ? '✏ Editar' : '✓ Listo';
  btn.style.background = editing ? '#555' : '#8fa845';
}
</script>
</body></html>`;

  const win = window.open('', '_blank', 'width=960,height=860,resizable=yes,scrollbars=yes');
  if (!win) { alert('Habilitá popups para este sitio para abrir el informe.'); return; }
  win.document.write(fullHTML);
  win.document.close();
}


// sheets/rodilla.js — SPF, LCA, menisco, Hop RTP, VISAP
function buildRodillaSPF() {
  const c = document.getElementById('rodilla-spf-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = SPF_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header"><h3>${t.name}</h3><span class="tag tag-r">Provocativo</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
          <div><div class="il mb-4">I</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
        </div>
        ${t.hasValgo?`
        <div class="grid-2" style="gap:8px;margin-top:8px">
          <div class="ig"><label class="il">Valgo dinámico D (°) — &gt;10° = positivo</label>
            <input class="inp inp-mono" type="number" id="valgo-spf-d" placeholder="0" oninput="checkValgoSPF('d')">
            <div id="valgo-spf-d-alert" style="display:none;font-size:11px;color:var(--amber);margin-top:3px">⚠️ Valgo &gt;10° — disfunción control motor</div>
          </div>
          <div class="ig"><label class="il">Valgo dinámico I (°)</label>
            <input class="inp inp-mono" type="number" id="valgo-spf-i" placeholder="0" oninput="checkValgoSPF('i')">
            <div id="valgo-spf-i-alert" style="display:none;font-size:11px;color:var(--amber);margin-top:3px">⚠️ Valgo &gt;10°</div>
          </div>
        </div>`:''}
      </div>
    </div>
  `).join('');
}
function checkValgoSPF(side) {
  const val = +document.getElementById('valgo-spf-'+side)?.value;
  const alert = document.getElementById('valgo-spf-'+side+'-alert'); if(alert) alert.style.display=val>10?'block':'none';
}

function buildRodillaLCA() {
  const c = document.getElementById('rodilla-lca-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = LCA_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header"><h3>${t.name}</h3><span class="tag tag-r" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
          <div><div class="il mb-4">I</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
        </div>
        ${t.hasGrado?`<div class="ig mt-8"><label class="il">Grado</label><select class="inp" style="font-size:12px">${t.opciones.map(o=>`<option>${o}</option>`).join('')}</select></div>`:''}
      </div>
    </div>
  `).join('');
}

function buildRodillaMenisco() {
  const c = document.getElementById('rodilla-menisco-fields'); if(!c || c.innerHTML) return;
  c.innerHTML = MENISCO_TESTS.map(t => `
    <div class="card mb-8">
      <div class="card-header"><h3>${t.name}</h3><span class="tag tag-y" style="font-size:9px">${t.sub}</span></div>
      <div class="card-body">
        <div class="grid-2" style="gap:8px">
          <div><div class="il mb-4">D — Medial</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
          <div><div class="il mb-4">D — Lateral</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
        </div>
      </div>
    </div>
  `).join('') + `<div class="card">
    <div class="card-header"><h3>Síntomas mecánicos</h3></div>
    <div class="card-body" style="display:flex;flex-direction:column;gap:8px">
      <label style="display:flex;justify-content:space-between;font-size:12px">Ruido articular (clic/crepitación)<input type="checkbox" style="accent-color:var(--neon);width:18px;height:18px"></label>
      <label style="display:flex;justify-content:space-between;font-size:12px">Bloqueo articular<input type="checkbox" style="accent-color:var(--neon);width:18px;height:18px"></label>
      <div class="ig mt-4"><label class="il">Descripción</label><textarea class="inp" rows="2" placeholder="Localización, situación en que aparece..."></textarea></div>
    </div>
  </div>`;
}

function calcRatioIQ(side) {
  const cuad = +document.getElementById('cuad-'+side)?.value||0;
  const isq  = +document.getElementById('isq-'+side)?.value||0;
  const el = document.getElementById('ratio-iq-'+side); if(!cuad || !el) return;
  const ratio = (isq/cuad).toFixed(2);
  const rc = +ratio>=0.6?'var(--neon)':'var(--red)';
  el.innerHTML = `Ratio ${side.toUpperCase()}: <span style="font-family:var(--mono);color:${rc};font-weight:700">${ratio}</span> ${+ratio<0.6?'⚠️ <0.60 (déficit)':'✓ Normal'}`;
}

function buildHopRTP() {
  const c = document.getElementById('hop-tests-rtp'); if(!c || c.innerHTML) return;
  const tests = ['Single hop','Triple hop','6m hop (tiempo)','Cross-over triple hop'];
  c.innerHTML = tests.map((t,i) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:12px;font-weight:600;margin-bottom:6px">${t}</div>
      <div class="grid-2" style="gap:6px">
        <div class="ig"><label class="il">Miembro lesionado</label><input class="inp inp-mono" type="number" step="0.1" id="hop-les-${i}" placeholder="0" oninput="calcLSISheet(${i})"></div>
        <div class="ig"><label class="il">Contralateral</label><input class="inp inp-mono" type="number" step="0.1" id="hop-con-${i}" placeholder="0" oninput="calcLSISheet(${i})"></div>
      </div>
      <div id="lsi-sheet-${i}" style="font-size:12px;color:var(--text3);margin-top:4px">LSI: completá ambos lados</div>
    </div>
  `).join('');
}
function calcLSISheet(i) {
  const les = +document.getElementById('hop-les-'+i)?.value;
  const con = +document.getElementById('hop-con-'+i)?.value;
  const el = document.getElementById('lsi-sheet-'+i); if(!les || !con || !el) return;
  const lsi = (les/con*100).toFixed(1);
  const c = +lsi>=90?'var(--neon)':+lsi>=80?'var(--amber)':'var(--red)';
  el.innerHTML = `LSI: <span style="font-family:var(--mono);font-weight:700;color:${c}">${lsi}%</span> ${+lsi>=90?'✓ Criterio RTP':'⚠️ No alcanza RTP (≥90%)'}`;
}

function buildVISAP() {
  const c = document.getElementById('visap-fields'); if(!c || c.innerHTML) return;
  visapVals = new Array(8).fill(null);
  c.innerHTML = VISAP_ITEMS.map((item,i) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:12px;margin-bottom:6px">${i+1}. ${item.q}</div>
      <input type="range" class="eva-slider" min="0" max="10" value="0"
        oninput="visapVals[${i}]=+this.value;this.nextElementSibling.textContent=this.value;calcVISAP()">
      <div style="font-family:var(--mono);font-size:14px;text-align:center;color:var(--neon)">0</div>
    </div>
  `).join('');
}
function calcVISAP() {
  const total = visapVals.reduce((a,b)=>a+(b||0),0);
  const el = document.getElementById('visap-total'); if(el){ el.textContent=total; el.style.color=total>=80?'var(--neon)':total>=60?'var(--amber)':'var(--red)'; }
}


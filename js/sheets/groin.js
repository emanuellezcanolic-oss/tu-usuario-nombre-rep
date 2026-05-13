// sheets/groin.js — Doha, HAGOS
function buildDoha() {
  const c = document.getElementById('doha-entidades-sheet'); if(!c || c.innerHTML) return;
  c.innerHTML = DOHA_ENTS.map(e => `
    <div class="card mb-8" style="border-color:${e.color}44">
      <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('doha-${e.id}-body')">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:10px;height:10px;border-radius:50%;background:${e.color}"></div>
          <h3>${e.label}</h3>
        </div>
        <span style="font-size:12px;color:var(--text3)">▼</span>
      </div>
      <div id="doha-${e.id}-body" style="display:none">
        <div class="card-body">
          <div style="font-size:11px;color:var(--text2);margin-bottom:6px"><strong>Criterios:</strong> ${e.crit}</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:10px">Confiabilidad: ${e.kappa}</div>
          ${e.tests.map(t => `
            <div class="card mb-6" style="border-color:${e.color}33">
              <div class="card-body" style="padding:10px">
                <div style="font-size:12px;font-weight:600;margin-bottom:6px">${t}</div>
                <div class="grid-2" style="gap:6px">
                  <div><div class="il mb-4">D</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
                  <div><div class="il mb-4">I</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
                </div>
                <div class="grid-2" style="gap:6px;margin-top:6px">
                  <div class="ig"><label class="il">EVA D</label><input type="range" class="eva-slider" min="0" max="10" value="0" oninput="this.nextElementSibling.textContent=this.value"><span style="font-family:var(--mono);font-size:13px;text-align:center;display:block">0</span></div>
                  <div class="ig"><label class="il">EVA I</label><input type="range" class="eva-slider" min="0" max="10" value="0" oninput="this.nextElementSibling.textContent=this.value"><span style="font-family:var(--mono);font-size:13px;text-align:center;display:block">0</span></div>
                </div>
              </div>
            </div>
          `).join('')}
          <div class="ig"><label class="il">Clasificación</label>
            <select class="inp" style="font-size:12px" id="doha-class-${e.id}">
              <option value="">— No presente —</option>
              <option value="1">1° — Entidad primaria</option>
              <option value="2">2° — Entidad secundaria</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function buildHAGOS() {
  const c = document.getElementById('hagos-sheet-fields'); if(!c || c.innerHTML) return;
  const dom = ['Síntomas','Dolor','Función AVD','Función deporte','Participación física','Calidad de vida'];
  c.innerHTML = dom.map(d => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12px">${d}</span>
      <div style="display:flex;align-items:center;gap:6px">
        <input class="inp inp-mono" type="number" min="0" max="100" placeholder="0–100" style="width:70px">
        <span style="font-size:10px;color:var(--text3)">pts</span>
      </div>
    </div>
  `).join('') + '<div style="font-size:9px;color:var(--text3);margin-top:6px">0 = máximos síntomas · 100 = sin síntomas</div>';
}


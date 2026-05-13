// sheets/lumbar.js — StartBack screening
function buildStartBack() {
  const c = document.getElementById('startback-sheet-fields'); if(!c || c.innerHTML) return;
  startbackVals = new Array(9).fill(null);
  c.innerHTML = STARTBACK_ITEMS.map((item,i) => `
    <div style="padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;margin-bottom:4px">${i+1}. ${item}</div>
      <div style="display:flex;gap:10px">
        ${i<8?
          `<label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="radio" name="sb2-${i}" onchange="startbackVals[${i}]=0;calcStartBack2()"> No</label>
           <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="radio" name="sb2-${i}" onchange="startbackVals[${i}]=1;calcStartBack2()"> Sí</label>` :
          `<label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="radio" name="sb2-${i}" onchange="startbackVals[${i}]=0;calcStartBack2()"> Ninguna/Poca</label>
           <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="radio" name="sb2-${i}" onchange="startbackVals[${i}]=1;calcStartBack2()"> Moderada/Mucha</label>`
        }
      </div>
    </div>
  `).join('');
}
function calcStartBack2() {
  const filled = startbackVals.filter(v=>v!==null);
  if(filled.length<9) return;
  const total = startbackVals.reduce((a,b)=>a+b,0);
  const sub = startbackVals.slice(4).reduce((a,b)=>a+b,0);
  let grupo, c;
  if(total<=3){ grupo='Bajo riesgo'; c='var(--neon)'; }
  else if(sub<=3){ grupo='Medio riesgo'; c='var(--amber)'; }
  else { grupo='Alto riesgo'; c='var(--red)'; }
  const el=document.getElementById('startback-sheet-result'); if(el){ el.textContent=grupo; el.style.color=c; }
}


// ── GLOBALS (compartidos entre módulos) ──
// cur, atletas, kineState, etc. se definen en app.js
// Este archivo asume que app.js ya fue cargado

function onMov() {
  const ld=+document.getElementById('lunge-d')?.value||0, li=+document.getElementById('lunge-i')?.value||0;
  const riD=+document.getElementById('cad-ri-d')?.value||0, reD=+document.getElementById('cad-re-d')?.value||0;
  const riI=+document.getElementById('cad-ri-i')?.value||0, reI=+document.getElementById('cad-re-i')?.value||0;
  const tromCadD=riD+reD, tromCadI=riI+reI;
  const riHD=+document.getElementById('hom-ri-d')?.value||0, reHD=+document.getElementById('hom-re-d')?.value||0;
  const riHI=+document.getElementById('hom-ri-i')?.value||0, reHI=+document.getElementById('hom-re-i')?.value||0;
  const tromHomD=riHD+reHD, tromHomI=riHI+reHI;
  const semL = v => !v?'':v<35?`<span style="color:var(--red)">🔴 ${v}° -- déficit</span>`:v<=40?`<span style="color:var(--amber)">🟡 ${v}° -- límite</span>`:`<span style="color:var(--neon)">🟢 ${v}° -- normal</span>`;
  let lr = `<div class="flex mt-8" style="gap:12px;flex-wrap:wrap">${ld?semL(ld):''}${li?semL(li):''}</div>`;
  if (ld&&li) { const d=Math.abs(ld-li); lr+=`<div style="font-size:11px;margin-top:6px;color:${d>5?'var(--amber)':'var(--neon)'}">Asimetría: ${d}°${d>5?' ⚠️ >5° significativo':' ✓'}</div>`; }
  document.getElementById('lunge-result').innerHTML = lr;
  const semC = v => v>90?`<span style="color:var(--neon)">🟢 ${v}°</span>`:v>=80?`<span style="color:var(--amber)">🟡 ${v}°</span>`:`<span style="color:var(--red)">🔴 ${v}°</span>`;
  document.getElementById('cad-result').innerHTML = tromCadD||tromCadI?`<div class="flex mt-8" style="gap:12px">${tromCadD?`<div>D: ${semC(tromCadD)}</div>`:''}${tromCadI?`<div>I: ${semC(tromCadI)}</div>`:''}</div>`:'';
  const semH = v => v>120?`<span style="color:var(--neon)">🟢 ${v}°</span>`:v>=100?`<span style="color:var(--amber)">🟡 ${v}°</span>`:`<span style="color:var(--red)">🔴 ${v}°</span>`;
  const gird = tromHomD&&tromHomI?Math.abs(tromHomD-tromHomI):null;
  document.getElementById('hom-result').innerHTML = (tromHomD||tromHomI)?`<div class="flex mt-8" style="gap:12px">${tromHomD?`<div>D: ${semH(tromHomD)}</div>`:''}${tromHomI?`<div>I: ${semH(tromHomI)}</div>`:''}</div>${gird!==null?`<div style="font-size:11px;margin-top:6px;color:${gird>=18?'var(--red)':'var(--neon)'}">GIRD: ${gird}°${gird>=18?' ⚠️ Significativo (≥18°)':' ✓ Normal'}</div>`:''}`:'';
  drawGauge('g-ld',ld,0,60,'lunge'); drawGauge('g-li',li,0,60,'lunge');
  drawGauge('g-tcd',tromCadD,0,120,'trom'); drawGauge('g-tci',tromCadI,0,120,'trom');
  const colors = { ld:ld<35?'var(--red)':ld<=40?'var(--amber)':'var(--neon)', li:li<35?'var(--red)':li<=40?'var(--amber)':'var(--neon)',
    tcd:tromCadD<80?'var(--red)':tromCadD<90?'var(--amber)':'var(--neon)', tci:tromCadI<80?'var(--red)':tromCadI<90?'var(--amber)':'var(--neon)' };
  if (ld) { const e=document.getElementById('gv-ld'); if(e){e.textContent=ld;e.style.color=colors.ld;} }
  if (li) { const e=document.getElementById('gv-li'); if(e){e.textContent=li;e.style.color=colors.li;} }
  if (tromCadD) { const e=document.getElementById('gv-tcd'); if(e){e.textContent=tromCadD;e.style.color=colors.tcd;} }
  if (tromCadI) { const e=document.getElementById('gv-tci'); if(e){e.textContent=tromCadI;e.style.color=colors.tci;} }
  if (cur) { cur.lungeD=ld;cur.lungeI=li;cur.tromCadD=tromCadD;cur.tromCadI=tromCadI;cur.tromHomD=tromHomD;cur.tromHomI=tromHomI; }
  renderMovSemaforos(ld,li,tromCadD,tromCadI,tromHomD,tromHomI);
}

function renderMovSemaforos(ld,li,tcd,tci,thd,thi) {
  const area = document.getElementById('mov-semaforos'); if (!area) return;
  const items = [
    { lbl:'Lunge D',     val:ld,  t1:35, t2:40,  max:60,  unit:'°', c:'var(--neon)' },
    { lbl:'Lunge I',     val:li,  t1:35, t2:40,  max:60,  unit:'°', c:'var(--blue)'  },
    { lbl:'TROM Cad D',  val:tcd, t1:80, t2:90,  max:120, unit:'°', c:'var(--neon)' },
    { lbl:'TROM Cad I',  val:tci, t1:80, t2:90,  max:120, unit:'°', c:'var(--blue)'  },
    { lbl:'TROM Hom D',  val:thd, t1:100,t2:120, max:150, unit:'°', c:'var(--neon)' },
    { lbl:'TROM Hom I',  val:thi, t1:100,t2:120, max:150, unit:'°', c:'var(--blue)'  }
  ];
  area.innerHTML = items.map(item => {
    if (!item.val) return `<div class="card mb-8"><div class="card-body" style="padding:10px 14px"><div style="font-size:11px;font-weight:700;color:var(--text3)">${item.lbl}: --</div></div></div>`;
    const c = item.val<item.t1?'var(--red)':item.val<item.t2?'var(--amber)':'var(--neon)';
    const pct = Math.min(100, item.val/item.max*100);
    const st = item.val<item.t1?'🔴 Déficit':item.val<item.t2?'🟡 Límite':'🟢 Normal';
    return `<div class="card mb-8" style="border-color:${c}44">
      <div class="card-body" style="padding:10px 14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:11px;font-weight:700">${item.lbl}</span>
          <span style="font-family:var(--mono);font-size:18px;font-weight:800;color:${c}">${item.val}${item.unit}</span>
        </div>
        <div class="prog-wrap"><div class="prog-bar" style="width:${pct.toFixed(0)}%;background:${c}"></div></div>
        <div style="font-size:10px;color:${c};margin-top:4px">${st}</div>
      </div>
    </div>`;
  }).join('');
}

function drawMovRadar(ld,li,tcd,tci,thd,thi) {
  const scores=[Math.min(100,ld/60*100),Math.min(100,li/60*100),Math.min(100,tcd/120*100),Math.min(100,tci/120*100),Math.min(100,thd/150*100),Math.min(100,thi/150*100)];
  const ideal=[67,67,75,75,80,80];
  const ctx=document.getElementById('mov-radar'); if(!ctx)return;
  if(movRadarChart)movRadarChart.destroy();
  movRadarChart=new Chart(ctx,{type:'radar',
    data:{labels:['Lunge D','Lunge I','TROM Cad D','TROM Cad I','TROM Hom D','TROM Hom I'],datasets:[
      {label:'Óptimo',data:ideal,backgroundColor:'rgba(77,158,255,.06)',borderColor:'rgba(77,158,255,.3)',borderWidth:1.5,pointRadius:2},
      {label:'Actual',data:scores,backgroundColor:'rgba(57,255,122,.1)',borderColor:'rgba(57,255,122,.7)',borderWidth:2,pointRadius:4,pointBackgroundColor:'#39FF7A'}
    ]},
    options:{responsive:true,plugins:{legend:{display:false}},
      scales:{r:{beginAtZero:true,max:100,grid:{color:'rgba(255,255,255,.04)'},angleLines:{color:'rgba(255,255,255,.04)'},pointLabels:{color:'#555',font:{size:9}},ticks:{display:false}}}}
  });
}

function drawGauge(id,value,min,max,type){
  const c=document.getElementById(id); if(!c)return;
  const ctx=c.getContext('2d'); const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H); const cx=W/2,cy=H-6,r=Math.min(W*.44,H*.84);
  const st=Math.PI,en=2*Math.PI;
  let zones;
  if(type==='lunge') zones=[{t:35/60,c:'rgba(255,68,68,.4)'},{t:40/60,c:'rgba(255,176,32,.4)'},{t:1,c:'rgba(57,255,122,.4)'}];
  else zones=[{t:80/120,c:'rgba(255,68,68,.4)'},{t:90/120,c:'rgba(255,176,32,.4)'},{t:1,c:'rgba(57,255,122,.4)'}];
  let prev=st;
  zones.forEach(z=>{const ang=st+z.t*(en-st);ctx.beginPath();ctx.arc(cx,cy,r,prev,ang);ctx.lineWidth=10;ctx.strokeStyle=z.c;ctx.stroke();prev=ang;});
  if(value>0){
    const norm=Math.max(0,Math.min(1,(value-min)/(max-min)));const ang=st+norm*(en-st);
    const nc=type==='lunge'?(value<35?'#FF4444':value<=40?'#FFB020':'#39FF7A'):(value<80?'#FF4444':value<90?'#FFB020':'#39FF7A');
    ctx.beginPath();ctx.moveTo(cx-Math.cos(ang)*6,cy-Math.sin(ang)*6);ctx.lineTo(cx+Math.cos(ang)*(r*.82),cy+Math.sin(ang)*(r*.82));
    ctx.lineWidth=2;ctx.strokeStyle=nc;ctx.lineCap='round';ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fillStyle=nc;ctx.fill();
  }
}

function redrawGauges(){
  const ld=+document.getElementById('lunge-d')?.value||0,li=+document.getElementById('lunge-i')?.value||0;
  const riD=+document.getElementById('cad-ri-d')?.value||0,reD=+document.getElementById('cad-re-d')?.value||0;
  const riI=+document.getElementById('cad-ri-i')?.value||0,reI=+document.getElementById('cad-re-i')?.value||0;
  drawGauge('g-ld',ld,0,60,'lunge'); drawGauge('g-li',li,0,60,'lunge');
  drawGauge('g-tcd',riD+reD,0,120,'trom'); drawGauge('g-tci',riI+reI,0,120,'trom');
}

function saveMov(){
  if(!cur)return;
  const evalIdx=document.getElementById('mov-eval-num').value;
  const ld=+document.getElementById('lunge-d')?.value||null,li=+document.getElementById('lunge-i')?.value||null;
  const riD=+document.getElementById('cad-ri-d')?.value||0,reD=+document.getElementById('cad-re-d')?.value||0;
  const riI=+document.getElementById('cad-ri-i')?.value||0,reI=+document.getElementById('cad-re-i')?.value||0;
  const riHD=+document.getElementById('hom-ri-d')?.value||0,reHD=+document.getElementById('hom-re-d')?.value||0;
  const riHI=+document.getElementById('hom-ri-i')?.value||0,reHI=+document.getElementById('hom-re-i')?.value||0;
  const fecha=new Date().toISOString().split('T')[0];
  const movData={lungeD:ld,lungeI:li,tromCadD:riD+reD||null,tromCadI:riI+reI||null,tromHomD:riHD+reHD||null,tromHomI:riHI+reHI||null,fecha};
  if(!cur.evals)cur.evals={};
  cur.evals['mov_'+evalIdx]=movData;
  if(!cur.evalsByDate)cur.evalsByDate={};
  if(!cur.evalsByDate[fecha])cur.evalsByDate[fecha]={};
  cur.evalsByDate[fecha].movilidad=movData;
  cur.lungeD=ld;cur.lungeI=li;cur.tromCadD=riD+reD;cur.tromCadI=riI+reI;cur.tromHomD=riHD+reHD;cur.tromHomI=riHI+reHI;
  atletas=atletas.map(a=>a.id===cur.id?cur:a);saveData();
}

// ══════════════════════════════════════════════════════
//  VELOCIDAD / SPRINT
// ══════════════════════════════════════════════════════

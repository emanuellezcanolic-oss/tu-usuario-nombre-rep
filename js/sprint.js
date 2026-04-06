// ── GLOBALS (compartidos entre módulos) ──
// cur, atletas, kineState, etc. se definen en app.js
// Este archivo asume que app.js ya fue cargado

function calcSprintBench(){
  const sp10=+document.getElementById('sp-10')?.value||0;
  const sp30=+document.getElementById('sp-30')?.value||0;
  const d505=+document.getElementById('sp-505d')?.value||0,i505=+document.getElementById('sp-505i')?.value||0;
  if(d505&&i505){const a=Math.abs(d505-i505)/Math.max(d505,i505)*100;const c=a>10?'var(--red)':a>5?'var(--amber)':'var(--neon)';document.getElementById('sp-505-asim').innerHTML=`<div style="margin-top:8px;font-size:12px;color:${c}">Asimetría 505: ${a.toFixed(1)}% ${a>10?'🔴':a>5?'⚠️':'✓'}</div>`;}
  const area=document.getElementById('sprint-bench-area'); if(!cur||!area)return;
  const deporte=cur.deporte||'',puesto=cur.puesto||'';
  const rd=RUGBY[puesto];
  const norms=SPRINT_NORMS[deporte]?.[rd?.tipo||'general']||SPRINT_NORMS[deporte]?.general;
  if(!norms){area.innerHTML='<div class="card"><div class="card-body" style="font-size:12px;color:var(--text3)">Sin benchmarks para este deporte. Disponibles: Rugby, Fútbol, Básquet.</div></div>';return;}
  const cats=['Amateur','Competitivo','Elite'];
  let html=`<div class="card"><div class="card-header"><h3>Benchmark -- ${deporte}${puesto?' · '+puesto:''}</h3></div><div class="card-body">`;
  if(sp10&&norms.sp10){
    html+=`<div class="mb-12"><div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:8px;font-family:var(--mono);text-transform:uppercase">10m Sprint · ${sp10}s</div>`;
    norms.sp10.forEach((ref,i)=>{const delta=(sp10-ref).toFixed(2);const b=sp10<=ref;const c=b?'var(--neon)':i===2?'var(--red)':'var(--amber)';html+=`<div class="flex-b mb-4"><span style="font-size:11px;color:var(--text2)">${cats[i]}: ${ref}s</span><span style="font-family:var(--mono);color:${c};font-size:11px;font-weight:700">${b?'✓ ':'+'}${delta}s</span></div><div class="prog-wrap"><div class="prog-bar" style="width:${Math.min(100,ref/sp10*100).toFixed(0)}%;background:${c}"></div></div>`;});
    const eliteRef=norms.sp10[2];
    html+=`<div style="margin-top:8px;padding:10px;background:var(--bg4);border-radius:var(--r);border:1px solid var(--border)"><div style="font-size:11px;font-weight:700;margin-bottom:4px">${sp10<=eliteRef?'✅ Supera el estándar elite':'Distancia al nivel elite'}</div><div style="font-family:var(--mono);color:${sp10<=eliteRef?'var(--neon)':'var(--amber)'};font-size:20px;font-weight:800">${sp10<=eliteRef?'−':'+'} ${Math.abs(sp10-eliteRef).toFixed(2)}s</div></div></div>`;
  }
  html+='</div></div>';area.innerHTML=html;
}

function saveSprint(){
  if(!cur)return;
  const evalIdx=document.getElementById('sprint-eval-num').value;
  const fecha=document.getElementById('sprint-fecha').value||new Date().toISOString().split('T')[0];
  if(!cur.evals)cur.evals={};
  cur.evals['sprint_'+evalIdx]={sp10:+document.getElementById('sp-10').value||null,sp20:+document.getElementById('sp-20').value||null,sp30:+document.getElementById('sp-30').value||null,vmax:+document.getElementById('sp-vmax').value||null,ttest:+document.getElementById('sp-ttest').value||null,d505:+document.getElementById('sp-505d').value||null,i505:+document.getElementById('sp-505i').value||null,fecha};
  atletas=atletas.map(a=>a.id===cur.id?cur:a);saveData();
}

// ══════════════════════════════════════════════════════
//  FMS -- CALIDAD DE MOVIMIENTO
// ══════════════════════════════════════════════════════

function loadSlot(input,slotId){
  if(!input.files.length)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const slot=document.getElementById(slotId); if(!slot)return;
    let img=slot.querySelector('img');
    if(!img){img=document.createElement('img');slot.appendChild(img);}
    img.src=e.target.result;img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit';
    slot.style.border='1px solid var(--neon)';
    const txt=slot.querySelector('div');if(txt)txt.style.display='none';
  };
  reader.readAsDataURL(input.files[0]);
}

function setFMS(btn,type){
  btn.parentElement.querySelectorAll('.fms-btn').forEach(b=>{b.classList.remove('yes','no');});
  btn.classList.add(type);
  ['ohs','sd'].forEach(id=>{
    const container=document.getElementById(id+'-checks');if(!container)return;
    const yesCount=container.querySelectorAll('.fms-btn.yes').length;
    const total=container.querySelectorAll('.fms-check').length;
    const scored=[...container.querySelectorAll('.fms-check')].filter(r=>r.querySelector('.fms-btn.yes')||r.querySelector('.fms-btn.no')).length;
    const scoreEl=document.getElementById(id+'-score');
    if(scoreEl&&scored>0){
      const pct=(yesCount/total*100).toFixed(0);
      const c=+pct>=80?'var(--neon)':+pct>=50?'var(--amber)':'var(--red)';
      scoreEl.innerHTML=`<div style="display:flex;align-items:center;gap:10px;padding:10px;background:${c}11;border:1px solid ${c}33;border-radius:var(--r)"><div style="font-family:var(--mono);font-size:22px;font-weight:800;color:${c}">${yesCount}/${total}</div><div style="font-size:12px;color:${c};font-weight:700">${+pct>=80?'✅ Buena calidad':+pct>=50?'⚠️ Compensaciones':'🔴 Déficits significativos'}</div></div>`;
    }
  });
}

function calcValgo(){
  const d=+document.getElementById('valgo-d')?.value||0,i=+document.getElementById('valgo-i')?.value||0;
  const el=document.getElementById('valgo-result');if(!el)return;
  const parts=[];
  if(d)parts.push(`D: <b style="color:${d>10?'var(--red)':'var(--neon)'}">${d}°</b> ${d>10?'⚠️ >10°':''}`);
  if(i)parts.push(`I: <b style="color:${i>10?'var(--red)':'var(--neon)'}">${i}°</b> ${i>10?'⚠️ >10°':''}`);
  el.innerHTML=`<div style="font-size:12px;margin-top:8px">${parts.join(' · ')}</div>`;
}

function saveFMS(){
  if(!cur)return;
  const ohsCriterios=[...document.getElementById('ohs-checks')?.querySelectorAll('.fms-btn.yes,.fms-btn.no')||[]].map(b=>b.classList.contains('yes')?'si':'no');
  const sdCriterios=[...document.getElementById('sd-checks')?.querySelectorAll('.fms-btn.yes,.fms-btn.no')||[]].map(b=>b.classList.contains('yes')?'si':'no');
  const fecha=new Date().toISOString().split('T')[0];
  if(!cur.evals)cur.evals={};
  cur.evals['fms_'+fecha]={fecha,ohs:{criterios:ohsCriterios,obs:document.getElementById('ohs-obs')?.value},sd:{criterios:sdCriterios,valgoD:+document.getElementById('valgo-d')?.value||0,valgoI:+document.getElementById('valgo-i')?.value||0,obs:document.getElementById('sd-obs')?.value}};
  atletas=atletas.map(a=>a.id===cur.id?cur:a);saveData();
}

// ══════════════════════════════════════════════════════
//  FATIGA
// ══════════════════════════════════════════════════════

/* ═══════════════════════════════════════════════════════════════
   MoveMetrics · informe-kinetic.js · Kinetic Precision PDF
   MOVE Brand · jsPDF landscape A4 · Canvas charts · Groq AI
   ═══════════════════════════════════════════════════════════════ */

const KP = {
  NEGRO:  [30,30,27], NEGRO2:[37,37,34], NEGRO3:[42,42,39],
  OW:     [244,243,242], GRIS:[186,184,182], CAMEL:[173,165,161],
  VERDE:  [121,130,84], RED:[214,78,78], AMBER:[201,146,42],
  BLUE:   [91,143,201],
};
const KD = { W:297, H:210, M:12 };
let _kCtx = {};

/* ── MODAL ──────────────────────────────────────────────────── */
function openKineticPDFModal() {
  if (!cur) { showToast('Seleccioná un atleta primero','warn'); return; }
  let el = document.getElementById('modal-kinetic-pdf');
  if (!el) {
    el = document.createElement('div');
    el.id = 'modal-kinetic-pdf';
    el.className = 'modal';
    el.innerHTML = `
<div class="modal-box" style="max-width:460px;background:var(--negro2)">
  <div class="modal-header" style="border-bottom:1px solid rgba(121,130,84,.2)">
    <div>
      <h3 style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;color:var(--offwhite)">PDF KINETIC PRECISION</h3>
      <p style="font-size:11px;color:var(--camel);margin-top:2px">Seleccioná las secciones a incluir</p>
    </div>
    <button onclick="closeModal('modal-kinetic-pdf')" class="modal-close">✕</button>
  </div>
  <div class="modal-body" style="padding:20px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
      ${[['portada','📋','Portada & Resumen',1],['fuerza','💪','Fuerza & Potencia',1],
         ['velocidad','⚡','Velocidad & Movilidad',1],['clinica','🩺','Clínica & Recs.',1]]
        .map(([id,ic,lb,ch])=>`
        <label style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--negro3);border:1px solid rgba(121,130,84,.15);border-radius:8px;cursor:pointer">
          <input type="checkbox" id="kpdf-${id}" ${ch?'checked':''} style="accent-color:var(--verde);width:16px;height:16px">
          <div><div style="font-size:18px;line-height:1">${ic}</div>
          <div style="font-size:12px;color:var(--offwhite);margin-top:2px">${lb}</div></div>
        </label>`).join('')}
    </div>
    <div style="margin-bottom:14px;padding:10px 12px;background:rgba(121,130,84,.08);border:1px solid rgba(121,130,84,.2);border-radius:6px;font-size:11px;color:var(--camel)">
      <b style="color:var(--verde)">IA incluida</b> — resumen generado con Groq si tenés API Key configurada.
    </div>
    <button class="btn btn-neon" style="width:100%;font-family:'Bebas Neue';font-size:16px;letter-spacing:2px;padding:14px"
            onclick="_kGenerar()">GENERAR PDF</button>
  </div>
</div>`;
    document.body.appendChild(el);
  }
  openModal('modal-kinetic-pdf');
}

async function _kGenerar() {
  const secs = {
    portada:   !!document.getElementById('kpdf-portada')?.checked,
    fuerza:    !!document.getElementById('kpdf-fuerza')?.checked,
    velocidad: !!document.getElementById('kpdf-velocidad')?.checked,
    clinica:   !!document.getElementById('kpdf-clinica')?.checked,
  };
  closeModal('modal-kinetic-pdf');
  showToast('Generando PDF Kinetic Precision…','info');
  try { await generarKineticPDF(secs); }
  catch(e) { console.error('KineticPDF:',e); showToast('Error PDF: '+e.message,'error'); }
}

/* ── MAIN GENERATOR ─────────────────────────────────────────── */
async function generarKineticPDF(secs={portada:true,fuerza:true,velocidad:true,clinica:true}) {
  if (!window.jspdf?.jsPDF) { showToast('jsPDF no cargado','error'); return; }
  const {jsPDF} = window.jspdf;
  const s = cur; if (!s) return;

  _kCtx = {
    prof:  document.getElementById('prof-nombre')?.value || 'Lic. Emanuel Lezcano',
    inst:  document.getElementById('prof-inst')?.value   || 'The Move Club',
    fecha: new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'long',year:'numeric'}),
  };

  const doc = new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const fv  = _kGetFV(s);
  const sal = _kGetSaltos(s);
  const sp  = _kGetSprint(s);
  const mov = _kGetMov(s);
  const kin = _kGetKine(s);
  const hop = _kGetHooper(s);

  showToast('Consultando IA…','info');
  const ai = await _kAI(s,fv,sal,sp,kin);

  let first = true;
  const np = () => { if(!first) doc.addPage(); first=false; _kBg(doc); };

  if (secs.portada)   { np(); _kPagePortada(doc,s,fv,sal,sp,ai); }
  if (secs.fuerza)    { np(); _kPageFuerza(doc,s,fv,sal); }
  if (secs.velocidad) { np(); _kPageVelocidad(doc,s,sp,mov); }
  if (secs.clinica)   { np(); _kPageClinica(doc,s,kin,hop,ai); }

  doc.save(`MoveMetrics_${(s.nombre||'atleta').replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`);
  showToast('PDF generado ✓','ok');
}

/* ── DATA EXTRACTORS ────────────────────────────────────────── */
function _kGetFV(s) {
  if (!s?.lastFV) return null;
  const f = s.lastFV;
  return {
    ejercicio: f.ejercicio||'—', F0: f.F0||0, V0: f.V0||f.a||0,
    Pmax: f.Pmax||0, oneRM: f.oneRM||0, r2: f.r2||0,
    cargas: f.cargas||[], vmps: f.vmps||[],
    ftRel: (f.oneRM&&s.peso) ? f.oneRM/+s.peso : 0,
  };
}
function _kGetSaltos(s) {
  const sal = getLastEval('saltos'); if (!sal?.avg) return null;
  const a = sal.avg;
  const ie = (a.cmj&&a.sj) ? ((a.cmj-a.sj)/a.sj*100) : null;
  const ib = (a.abk&&a.cmj) ? ((a.abk-a.cmj)/a.cmj*100) : null;
  const lsi = (a.shD&&a.shI) ? (Math.min(a.shD,a.shI)/Math.max(a.shD,a.shI)*100) : null;
  return {sj:a.sj||0,cmj:a.cmj||0,abk:a.abk||0,dj:a.dj||0,shD:a.shD||0,shI:a.shI||0,ie,ib,lsi};
}
function _kGetSprint(s) {
  const sp = getLastEval('sprint'); if (!sp) return null;
  const a505 = (sp.d505&&sp.i505) ? Math.abs(sp.d505-sp.i505)/Math.max(sp.d505,sp.i505)*100 : null;
  return {sp10:sp.sp10||0,sp20:sp.sp20||0,sp30:sp.sp30||0,vmax:sp.vmax||0,ttest:sp.ttest||0,asim:a505};
}
function _kGetMov(s) {
  return {lungeD:+s.lungeD||0,lungeI:+s.lungeI||0,tromD:+s.tromCadD||0,tromI:+s.tromCadI||0,
          tromDE:+s.tromCadDExt||0,tromIE:+s.tromCadIExt||0,flexHD:+s.flexHD||0,flexHI:+s.flexHI||0};
}
function _kGetKine(s) {
  if (!s?.kinesio) return null;
  const allT = Object.values(typeof ORTHO_TESTS!=='undefined'?ORTHO_TESTS:{}).flat();
  const pos = Object.entries(s.kinesio.tests||{}).filter(([,v])=>v.result==='pos')
    .map(([id])=>allT.find(t=>t.id===id)?.name||id);
  const zonas = Object.values(s.kinesio.bodyZones||{}).filter(z=>!z.recuperado)
    .map(z=>({label:z.label,eva:z.eva||0}));
  return {dx:s.kinesio.form?.dx||'—',eva:s.kinesio.form?.eva??'—',pos,zonas};
}
function _kGetHooper(s) {
  const f = getLastEval('fatiga'); if (!f?.hooper) return null;
  const [sueno,estres,fatiga,doms] = f.hooper;
  return {sueno,estres,fatiga,doms,hrv:f.hrv||null,total:sueno+estres+fatiga+doms};
}

/* ── PDF HELPERS ────────────────────────────────────────────── */
function _kBg(doc) {
  const {W,H} = KD;
  doc.setFillColor(...KP.NEGRO); doc.rect(0,0,W,H,'F');
  const cv = document.createElement('canvas'); cv.width=595; cv.height=420;
  const ctx = cv.getContext('2d');
  ctx.fillStyle='#1e1e1b'; ctx.fillRect(0,0,595,420);
  ctx.save(); ctx.globalAlpha=0.022; ctx.strokeStyle='#798254'; ctx.lineWidth=1;
  for (let i=-420;i<595+420;i+=42) {
    ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i+420*0.3,420); ctx.stroke();
  }
  ctx.restore();
  const g = ctx.createRadialGradient(0,0,0,0,0,260);
  g.addColorStop(0,'rgba(121,130,84,0.07)'); g.addColorStop(1,'rgba(121,130,84,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,595,420);
  doc.addImage(cv.toDataURL('image/jpeg',0.82),'JPEG',0,0,W,H);
}

function _kBand(doc,title,y) {
  const {M,W} = KD;
  doc.setFillColor(...KP.VERDE); doc.rect(M,y,3,8,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(10.5); doc.setTextColor(...KP.OW);
  doc.text(title.toUpperCase(),M+6,y+6);
  doc.setDrawColor(...KP.NEGRO3); doc.setLineWidth(0.3);
  doc.line(M,y+9,W-M,y+9);
  return y+14;
}

function _kFooter(doc,label) {
  const {W,H,M} = KD;
  doc.setDrawColor(...KP.NEGRO3); doc.setLineWidth(0.3); doc.line(M,H-11,W-M,H-11);
  doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(...KP.CAMEL);
  doc.text(`${_kCtx.prof} · ${_kCtx.inst}`,M,H-6);
  doc.setFont('helvetica','bold'); doc.setTextColor(...KP.VERDE);
  doc.text('MOVEMETRICS',W/2,H-6,{align:'center'});
  doc.setFont('helvetica','normal'); doc.setTextColor(...KP.CAMEL);
  doc.text(`${_kCtx.fecha} · ${label}`,W-M,H-6,{align:'right'});
}

function _kCard(doc,x,y,w,h) {
  doc.setFillColor(...KP.NEGRO2); doc.roundedRect(x,y,w,h,2,2,'F');
  doc.setFillColor(...KP.VERDE); doc.rect(x,y,w,1,'F');
}

function _kKpi(doc,lb,val,unit,color,x,y,w,h) {
  _kCard(doc,x,y,w,h);
  doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(...(color||KP.OW));
  doc.text(String(val),x+w/2,y+h/2+1,{align:'center'});
  if (unit) {
    doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(...KP.GRIS);
    doc.text(unit,x+w/2,y+h/2+5.5,{align:'center'});
  }
  doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(...KP.CAMEL);
  doc.text(lb,x+w/2,y+h-2.5,{align:'center'});
}

/* ── CANVAS CHARTS ──────────────────────────────────────────── */
function _kGauge(val,max,lbl,col) {
  const S=180; const cv=document.createElement('canvas'); cv.width=S; cv.height=S;
  const ctx=cv.getContext('2d'); const cx=S/2,cy=S/2,R=S*0.37;
  const sa=Math.PI*0.75, ea=Math.PI*2.25, va=sa+(ea-sa)*Math.min(val/max,1);
  ctx.fillStyle='#1e1e1b'; ctx.fillRect(0,0,S,S);
  ctx.beginPath(); ctx.arc(cx,cy,R,sa,ea);
  ctx.strokeStyle='#2a2a27'; ctx.lineWidth=S*0.1; ctx.stroke();
  const gr=ctx.createLinearGradient(0,0,S,S);
  gr.addColorStop(0,`rgba(${col.join(',')},0.65)`); gr.addColorStop(1,`rgb(${col.join(',')})`);
  ctx.beginPath(); ctx.arc(cx,cy,R,sa,va);
  ctx.strokeStyle=gr; ctx.lineWidth=S*0.1; ctx.lineCap='round'; ctx.stroke();
  ctx.fillStyle='#f4f3f2'; ctx.font=`bold ${S*0.19}px helvetica`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(val.toFixed(val<10?1:0),cx,cy-S*0.04);
  ctx.fillStyle='#ada5a1'; ctx.font=`${S*0.085}px helvetica`;
  ctx.fillText(lbl,cx,cy+S*0.15);
  return cv;
}

function _kBarChart(bars,W,H) {
  const cv=document.createElement('canvas'); cv.width=W; cv.height=H;
  const ctx=cv.getContext('2d');
  ctx.fillStyle='#252522'; ctx.fillRect(0,0,W,H);
  const valid=bars.filter(b=>b.val>0); if(!valid.length) return cv;
  const pad=22,bw=(W-pad*2)/valid.length-6,mH=H-36;
  valid.forEach((b,i)=>{
    const x=pad+i*((W-pad*2)/valid.length)+3;
    const pct=b.inv?Math.min(b.val/(b.ref*1.15),1):Math.max(0,1-(b.val/(b.ref*1.25)));
    const bH=Math.max(4,pct*mH), y=H-24-bH;
    const good=b.inv?(b.val>=b.ref*0.88):(b.val<=b.ref*1.05);
    const ok=b.inv?(b.val>=b.ref*0.72):(b.val<=b.ref*1.18);
    const col=good?'#798254':ok?'#c9922a':'#d64e4e';
    ctx.fillStyle='rgba(42,42,39,0.8)'; ctx.fillRect(x,H-24-mH,bw,mH);
    const gd=ctx.createLinearGradient(x,y,x,H-24);
    gd.addColorStop(0,col); gd.addColorStop(1,col+'55');
    ctx.fillStyle=gd; ctx.fillRect(x,y,bw,bH);
    ctx.fillStyle='#f4f3f2'; ctx.font=`bold 10px helvetica`; ctx.textAlign='center';
    ctx.fillText(b.val.toFixed(b.val<5?2:1),x+bw/2,y-3);
    ctx.fillStyle='#ada5a1'; ctx.font='8px helvetica';
    ctx.fillText(b.unit,x+bw/2,y+9);
    ctx.fillStyle='#bab8b6'; ctx.font='bold 9px helvetica';
    ctx.fillText(b.label,x+bw/2,H-8);
  });
  return cv;
}

function _kFVChart(fv,W,H) {
  const cv=document.createElement('canvas'); cv.width=W; cv.height=H;
  const ctx=cv.getContext('2d');
  ctx.fillStyle='#252522'; ctx.fillRect(0,0,W,H);
  if(!fv?.cargas?.length){
    ctx.fillStyle='#ada5a1'; ctx.font='10px helvetica'; ctx.textAlign='center';
    ctx.fillText('Sin datos F-V',W/2,H/2); return cv;
  }
  const pd={t:10,r:10,b:20,l:26};
  const cw=W-pd.l-pd.r, ch=H-pd.t-pd.b;
  const xMax=Math.max(...fv.cargas)*1.08, yMax=Math.max(...fv.vmps)*1.12;
  const tx=v=>pd.l+(v/xMax)*cw, ty=v=>pd.t+ch-(v/yMax)*ch;
  ctx.strokeStyle='rgba(186,184,182,0.1)'; ctx.lineWidth=0.5;
  for(let i=0;i<=4;i++){const y=pd.t+(i/4)*ch;ctx.beginPath();ctx.moveTo(pd.l,y);ctx.lineTo(pd.l+cw,y);ctx.stroke();}
  if(fv.V0&&fv.F0){
    ctx.beginPath(); ctx.strokeStyle='rgba(121,130,84,0.65)'; ctx.lineWidth=1.5;
    ctx.moveTo(tx(0),ty(fv.V0)); ctx.lineTo(tx(fv.F0),ty(0)); ctx.stroke();
  }
  fv.cargas.forEach((x,i)=>{
    const y=fv.vmps[i]; if(!y) return;
    ctx.beginPath(); ctx.arc(tx(x),ty(y),3.5,0,Math.PI*2);
    ctx.fillStyle='#798254'; ctx.fill();
    ctx.strokeStyle='#f4f3f2'; ctx.lineWidth=0.8; ctx.stroke();
  });
  ctx.fillStyle='#ada5a1'; ctx.font='7px helvetica'; ctx.textAlign='center';
  ctx.fillText('Carga (kg)',W/2,H-3);
  ctx.save(); ctx.translate(8,H/2); ctx.rotate(-Math.PI/2);
  ctx.fillText('VMP (m/s)',0,0); ctx.restore();
  return cv;
}

function _kBoscoChart(sal,W,H) {
  const bars=[
    {label:'SJ',val:sal.sj,ref:32},{label:'CMJ',val:sal.cmj,ref:35},
    {label:'ABK',val:sal.abk,ref:40},{label:'DJ',val:sal.dj,ref:32},
  ];
  return _kBarChart(bars.map(b=>({...b,unit:'cm',inv:false,good:b.val>b.ref,ok:b.val>b.ref*0.85})),W,H);
}

/* ── PAGE 1: PORTADA ────────────────────────────────────────── */
function _kPagePortada(doc,s,fv,sal,sp,ai) {
  const {W,H,M} = KD;

  // Left: Athlete identity
  doc.setFont('helvetica','bold'); doc.setFontSize(26); doc.setTextColor(...KP.OW);
  const parts=(s.nombre||'ATLETA').toUpperCase().split(' ');
  doc.text(parts[0]||'',M,22);
  if(parts[1]) doc.text(parts.slice(1).join(' '),M,31);
  doc.setFillColor(...KP.VERDE); doc.rect(M,34,36,1.5,'F');

  const info=[['DEPORTE',s.deporte||'—'],['PUESTO',s.puesto||'—'],['NIVEL',s.nivel||'—'],
               ['EDAD',s.edad?(s.edad+' años'):'—'],['PESO',s.peso?(s.peso+' kg'):'—'],
               ['TALLA',s.talla?(s.talla+' cm'):'—']];
  let iy=41;
  info.forEach(([lb,val])=>{
    doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(...KP.CAMEL);
    doc.text(lb,M,iy);
    doc.setFont('helvetica','bold'); doc.setTextColor(...KP.OW);
    doc.text(val,M+22,iy);
    iy+=7.5;
  });

  // Gauge
  const gVal=sal?.cmj||sp?.vmax||fv?.oneRM||0;
  const gMax=sal?.cmj?60:sp?.vmax?12:fv?.oneRM?200:60;
  const gLbl=sal?.cmj?'CMJ cm':sp?.vmax?'Vmax m/s':'1RM kg';
  if(gVal>0){
    const gc=_kGauge(gVal,gMax,gLbl,KP.VERDE);
    doc.addImage(gc.toDataURL('image/png'),'PNG',M,iy+2,46,46);
  }

  // Divider
  doc.setDrawColor(...KP.NEGRO3); doc.setLineWidth(0.4); doc.line(M+90,12,M+90,H-12);

  // Center: KPIs
  const kx=M+96, kw=38;
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.VERDE);
  doc.text('INDICADORES CLAVE',kx,16);
  const kpis=[
    {lb:'CMJ',val:sal?.cmj?.toFixed(1)||'—',unit:'cm'},
    {lb:'1RM',val:fv?.oneRM?.toFixed(1)||'—',unit:'kg'},
    {lb:'F.Rel',val:fv?.ftRel?.toFixed(2)||'—',unit:'×PC'},
    {lb:'10m',val:sp?.sp10?.toFixed(2)||'—',unit:'s'},
    {lb:'Vmax',val:sp?.vmax?.toFixed(1)||'—',unit:'m/s'},
    {lb:'T-Test',val:sp?.ttest?.toFixed(2)||'—',unit:'s'},
  ];
  let ky=19;
  kpis.forEach(k=>{ _kKpi(doc,k.lb,k.val,k.unit,null,kx,ky,kw,20); ky+=23; });

  doc.setDrawColor(...KP.NEGRO3); doc.line(kx+kw+5,12,kx+kw+5,H-12);

  // Right: AI summary
  const rx=kx+kw+10, rw=W-rx-M;
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.VERDE);
  doc.text('ANÁLISIS EJECUTIVO',rx,16);
  _kCard(doc,rx,18,rw,H-32);
  const summ=_kExtract(ai,'📋');
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...KP.GRIS);
  doc.splitTextToSize(summ,rw-6).slice(0,22).forEach((l,i)=>doc.text(l,rx+3,26+i*5.5));

  // Report date top right
  doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(...KP.CAMEL);
  doc.text(_kCtx.fecha,W-M,8,{align:'right'});

  _kFooter(doc,'Portada — 1/4');
}

/* ── PAGE 2: FUERZA & POTENCIA ──────────────────────────────── */
function _kPageFuerza(doc,s,fv,sal) {
  const {M,W,H} = KD; let y=M;
  y=_kBand(doc,'Fuerza & Potencia',y);

  // F-V chart
  const fvImg=_kFVChart(fv,90,56);
  doc.addImage(fvImg.toDataURL('image/jpeg',0.9),'JPEG',M,y,90,56);

  // F-V parameters
  if(fv){
    const px=M+94;
    doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.VERDE);
    doc.text('PARÁMETROS · '+(fv.ejercicio||''),px,y+5);
    const params=[['F₀',fv.F0?.toFixed(1)||'—','kg'],['V₀',fv.V0?.toFixed(3)||'—','m/s'],
                  ['Pmax',fv.Pmax?.toFixed(0)||'—','W'],['1RM',fv.oneRM?.toFixed(1)||'—','kg'],
                  ['F.Rel.',fv.ftRel?.toFixed(2)||'—','×PC'],['R²',fv.r2?.toFixed(3)||'—','']];
    let py=y+9;
    params.forEach(([lb,val,un])=>{
      doc.setFillColor(...KP.NEGRO2); doc.rect(px,py,48,5.5,'F');
      doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(...KP.CAMEL);
      doc.text(lb,px+2,py+4);
      doc.setFont('helvetica','bold'); doc.setTextColor(...KP.OW);
      doc.text(val+(un?' '+un:''),px+48,py+4,{align:'right'});
      py+=6.5;
    });
    // Status badge
    const normKey=Object.keys(typeof STR_NORMS!=='undefined'?STR_NORMS:{}).find(k=>
      fv.ejercicio?.toLowerCase().includes((STR_NORMS[k].name||'').toLowerCase().split(' ')[0].toLowerCase()));
    if(normKey&&fv.ftRel){
      const n=STR_NORMS[normKey];
      const [stLbl,stCol]=fv.ftRel>=n.amber?['ELITE',KP.VERDE]:fv.ftRel>=n.red?['MODERADO',KP.AMBER]:['DÉFICIT',KP.RED];
      doc.setFillColor(...stCol); doc.roundedRect(px,py+2,48,8,1.5,1.5,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.setTextColor(...KP.NEGRO);
      doc.text(stLbl,px+24,py+7.5,{align:'center'});
    }
  }

  // %RM table
  const tx=M+150;
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.VERDE);
  doc.text('%1RM → VMP',tx,y+5);
  const rmRows=[['100%','≤0.20','Fza Máx'],['90%','0.30-0.35','Hipert+'],
                ['80%','0.45-0.60','Hipert'],['70%','0.75-0.85','Fza/Pot'],
                ['60%','0.90-1.10','Potencia'],['50%','1.15-1.40','Velocidad']];
  let ty=y+9;
  rmRows.forEach((row,ri)=>{
    doc.setFillColor(...(ri%2===0?KP.NEGRO2:KP.NEGRO3)); doc.rect(tx,ty,72,5.5,'F');
    const load=fv?.oneRM?`${(fv.oneRM*parseInt(row[0])/100).toFixed(1)}kg`:'';
    [row[0],row[1],load||row[2]].forEach((c,ci)=>{
      doc.setFont('helvetica',ri===0?'bold':'normal'); doc.setFontSize(6.5);
      doc.setTextColor(ci===0?KP.VERDE:KP.GRIS);
      doc.text(c,tx+2+[0,18,48][ci],ty+4);
    });
    ty+=6;
  });

  // Bosco
  y+=62;
  y=_kBand(doc,'Batería de Bosco',y);
  if(sal){
    const bc=_kBoscoChart(sal,90,46);
    doc.addImage(bc.toDataURL('image/jpeg',0.9),'JPEG',M,y,90,46);
    const idx=[
      {lb:'Índice Elástico',val:sal.ie!=null?sal.ie.toFixed(1)+'%':'—',col:sal.ie>15?KP.VERDE:sal.ie>8?KP.AMBER:KP.RED},
      {lb:'Índice Bosco',val:sal.ib!=null?sal.ib.toFixed(1)+'%':'—',col:sal.ib>15?KP.VERDE:sal.ib>8?KP.AMBER:KP.RED},
      {lb:'LSI Hop',val:sal.lsi!=null?sal.lsi.toFixed(1)+'%':'—',col:sal.lsi>=90?KP.VERDE:sal.lsi>=80?KP.AMBER:KP.RED},
    ];
    let iy=y+2; const ix=M+94;
    idx.forEach(({lb,val,col})=>{
      doc.setFillColor(...KP.NEGRO2); doc.roundedRect(ix,iy,58,10,1.5,1.5,'F');
      doc.setFillColor(...col); doc.rect(ix,iy,3,10,'F');
      doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(...KP.GRIS);
      doc.text(lb,ix+6,iy+4.5);
      doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(...col);
      doc.text(val,ix+6,iy+9);
      iy+=13;
    });
    // Norms table
    const nx=M+160;
    doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.VERDE);
    doc.text('NORMAS BOSCO (Garrido-Chamorro 2004)',nx,y+4);
    [['Variable','Hombres','Mujeres'],['SJ','31.9±8.4','22.7±5.2'],
     ['CMJ','33.6±8.3','24.4±5.8'],['ABK','38.8±9.8','27.4±7.3'],
     ['DJ','30.3±8.1','20.1±5.5']].forEach((row,ri)=>{
      let ny=y+8+ri*6;
      doc.setFillColor(...(ri%2===0?KP.NEGRO2:KP.NEGRO3)); doc.rect(nx,ny,72,5.5,'F');
      if(ri===0){doc.setFillColor(...KP.VERDE);doc.rect(nx,ny,72,0.5,'F');}
      [0,1,2].forEach(ci=>{
        doc.setFont('helvetica',ri===0?'bold':'normal'); doc.setFontSize(6.5);
        doc.setTextColor(ri===0?KP.OW:ci===0?KP.CAMEL:KP.GRIS);
        doc.text(row[ci],nx+2+[0,24,48][ci],ny+4);
      });
    });
  }

  _kFooter(doc,'Fuerza & Potencia — 2/4');
}

/* ── PAGE 3: VELOCIDAD & MOVILIDAD ─────────────────────────── */
function _kPageVelocidad(doc,s,sp,mov) {
  const {M,W,H} = KD; let y=M;
  y=_kBand(doc,'Velocidad & Movilidad',y);

  // Sprint chart
  const bars=[
    {label:'10m',val:sp?.sp10||0,ref:1.80,unit:'s',inv:false},
    {label:'20m',val:sp?.sp20||0,ref:3.00,unit:'s',inv:false},
    {label:'30m',val:sp?.sp30||0,ref:4.20,unit:'s',inv:false},
    {label:'Vmax',val:sp?.vmax||0,ref:8.00,unit:'m/s',inv:true},
  ];
  const sc=_kBarChart(bars,100,52);
  doc.addImage(sc.toDataURL('image/jpeg',0.9),'JPEG',M,y,100,52);

  // Sprint KPIs
  const sx=M+104;
  [{lb:'T-Test',val:sp?.ttest?.toFixed(2)||'—',unit:'s'},
   {lb:'Vmax',val:sp?.vmax?.toFixed(1)||'—',unit:'m/s'},
   {lb:'Asim 505',val:sp?.asim?.toFixed(1)||'—',unit:'%'}].forEach((k,i)=>{
    _kKpi(doc,k.lb,k.val,k.unit,null,sx+i*34,y,32,20);
  });

  // Sprint norms table
  const snt=sx;
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.VERDE);
  doc.text('REFERENCIAS SPRINT',snt,y+25);
  [['10m','<1.70s','1.70-1.85s'],['20m','<2.90s','2.90-3.10s'],['30m','<4.00s','4.00-4.30s']].forEach((r,ri)=>{
    let ny=y+29+ri*6;
    doc.setFillColor(...(ri%2===0?KP.NEGRO2:KP.NEGRO3)); doc.rect(snt,ny,100,5.5,'F');
    [r[0],r[1],r[2]].forEach((c,ci)=>{
      doc.setFont('helvetica','normal'); doc.setFontSize(6.5);
      doc.setTextColor(ci===0?KP.CAMEL:ci===1?KP.VERDE:KP.AMBER);
      doc.text(c,snt+2+[0,18,52][ci],ny+4);
    });
  });

  // VMP Zones (right)
  const vzx=M+218;
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.VERDE);
  doc.text('ZONAS INTENSIDAD VMP',vzx,y+4);
  [{lb:'Fza Máxima',vmp:'>0.15 m/s',col:KP.RED},{lb:'Hipertrofia',vmp:'0.50-0.75',col:KP.AMBER},
   {lb:'Potencia',vmp:'0.75-1.00',col:KP.VERDE},{lb:'F-V Óptimo',vmp:'1.00-1.20',col:KP.BLUE},
   {lb:'Velocidad',vmp:'>1.20 m/s',col:KP.CAMEL}].forEach((z,zi)=>{
    let zy=y+8+zi*7.5;
    doc.setFillColor(...KP.NEGRO2); doc.rect(vzx,zy,66,6.5,'F');
    doc.setFillColor(...z.col); doc.rect(vzx,zy,3,6.5,'F');
    doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(...KP.GRIS);
    doc.text(z.lb,vzx+6,zy+4.5);
    doc.setTextColor(...KP.OW); doc.text(z.vmp,vzx+62,zy+4.5,{align:'right'});
  });

  // Mobility section
  y+=58;
  y=_kBand(doc,'Movilidad Articular',y);

  const movItems=[
    {lb:'Lunge (°)',D:mov.lungeD,I:mov.lungeI,ref:35},
    {lb:'TROM Cad. Flex (°)',D:mov.tromD,I:mov.tromI,ref:100},
    {lb:'TROM Cad. Ext (°)',D:mov.tromDE,I:mov.tromIE,ref:20},
    {lb:'Flex. Hombro (°)',D:mov.flexHD,I:mov.flexHI,ref:150},
  ];
  movItems.forEach((item,i)=>{
    const my=y+i*10;
    if(i%2===0){doc.setFillColor(...KP.NEGRO2);doc.rect(M,my-1,W-M*2,9.5,'F');}
    // Label
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...KP.GRIS);
    doc.text(item.lb,M+2,my+5);
    // D/I dots
    [[item.D,'D'],[item.I,'I']].forEach(([v,side],si)=>{
      const col=!v?KP.GRIS:v>=item.ref?KP.VERDE:v>=item.ref*0.85?KP.AMBER:KP.RED;
      const dotX=M+105+si*26;
      doc.setFillColor(...col); doc.circle(dotX,my+3.5,2,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor(...KP.OW);
      doc.text(`${side}: ${v||'—'}°`,dotX+4,my+5);
    });
    // Asimetría
    if(item.D&&item.I){
      const as=Math.abs(item.D-item.I)/Math.max(item.D,item.I)*100;
      const col=as<=10?KP.VERDE:as<=20?KP.AMBER:KP.RED;
      doc.setFontSize(6.5); doc.setTextColor(...col);
      doc.text(`Asim ${as.toFixed(0)}%`,M+162,my+5);
    }
  });

  _kFooter(doc,'Velocidad & Movilidad — 3/4');
}

/* ── PAGE 4: CLÍNICA ────────────────────────────────────────── */
function _kPageClinica(doc,s,kin,hop,ai) {
  const {M,W,H} = KD; let y=M;
  y=_kBand(doc,'Clínica & Recomendaciones',y);

  // Hooper
  if(hop){
    doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.CAMEL);
    doc.text('ÍNDICE HOOPER',M,y);
    let hy=y+4;
    [{lb:'Sueño',v:hop.sueno},{lb:'Estrés',v:hop.estres},{lb:'Fatiga',v:hop.fatiga},{lb:'DOMS',v:hop.doms}]
    .forEach(({lb,v})=>{
      doc.setFillColor(...KP.NEGRO2); doc.rect(M,hy,88,7.5,'F');
      const pct=(v||0)/7;
      const col=pct<=0.43?KP.VERDE:pct<=0.71?KP.AMBER:KP.RED;
      doc.setFillColor(...KP.NEGRO3); doc.rect(M+22,hy+2,52,3.5,'F');
      doc.setFillColor(...col); doc.rect(M+22,hy+2,52*pct,3.5,'F');
      doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(...KP.GRIS);
      doc.text(lb,M+2,hy+5.5);
      doc.setFont('helvetica','bold'); doc.setTextColor(...col);
      doc.text(`${v||0}/7`,M+82,hy+5.5,{align:'right'});
      hy+=9;
    });
    const totCol=hop.total<=16?KP.VERDE:hop.total<=22?KP.AMBER:KP.RED;
    doc.setFillColor(...totCol); doc.roundedRect(M,hy+2,88,9,2,2,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.setTextColor(...KP.NEGRO);
    doc.text(`IH TOTAL: ${hop.total}/28`,M+44,hy+8,{align:'center'});
    if(hop.hrv){
      doc.setFillColor(...KP.NEGRO2); doc.roundedRect(M,hy+14,88,7,1.5,1.5,'F');
      doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(...KP.GRIS);
      doc.text('HRV:',M+2,hy+19);
      doc.setFont('helvetica','bold'); doc.setTextColor(...KP.OW);
      doc.text(hop.hrv+' ms',M+14,hy+19);
    }
  }

  // Kinesio
  const kx=M+96, kiw=80; let kiy=y;
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.CAMEL);
  doc.text('KINESIO',kx,kiy);
  kiy+=5;
  if(kin){
    _kCard(doc,kx,kiy,kiw,10);
    doc.setFont('helvetica','bold'); doc.setFontSize(6.5); doc.setTextColor(...KP.CAMEL);
    doc.text('Dx:',kx+2,kiy+5);
    doc.setTextColor(...KP.OW);
    doc.text(doc.splitTextToSize(kin.dx,kiw-14)[0],kx+10,kiy+5);
    doc.setTextColor(...KP.AMBER);
    doc.text(`EVA ${kin.eva}/10`,kx+kiw-2,kiy+8,{align:'right'});
    kiy+=13;
    kin.zonas.slice(0,5).forEach(z=>{
      const col=z.eva>=7?KP.RED:z.eva>=4?KP.AMBER:KP.VERDE;
      doc.setFillColor(...KP.NEGRO2); doc.rect(kx,kiy,kiw,6,'F');
      doc.setFillColor(...col); doc.rect(kx,kiy,3,6,'F');
      doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(...KP.GRIS);
      doc.text(z.label,kx+6,kiy+4.5);
      doc.setTextColor(...col); doc.text(`EVA ${z.eva}`,kx+kiw-2,kiy+4.5,{align:'right'});
      kiy+=7.5;
    });
    if(kin.pos.length){
      kiy+=3;
      doc.setFont('helvetica','bold'); doc.setFontSize(6.5); doc.setTextColor(...KP.RED);
      doc.text('Tests positivos:',kx,kiy); kiy+=4;
      kin.pos.slice(0,6).forEach(t=>{
        doc.setFont('helvetica','normal'); doc.setFontSize(6); doc.setTextColor(...KP.GRIS);
        doc.text('• '+t,kx+2,kiy); kiy+=4.5;
      });
    }
  } else {
    doc.setFontSize(8); doc.setTextColor(...KP.CAMEL);
    doc.text('Sin evaluación kinesiológica',kx+2,kiy+8);
  }

  // AI Recommendations (right column)
  const rx=kx+kiw+10, rw=W-rx-M;
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...KP.VERDE);
  doc.text('PLAN IA & RECOMENDACIONES',rx,y);
  _kCard(doc,rx,y+3,rw,H-y-18);
  const recs=_kExtract(ai,'📅')||_kExtract(ai,'💪')||ai||'Sin recomendaciones.';
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...KP.GRIS);
  doc.splitTextToSize(recs,rw-6).slice(0,25).forEach((l,i)=>doc.text(l,rx+3,y+10+i*5.2));

  _kFooter(doc,'Clínica & Recomendaciones — 4/4');
}

/* ── AI ─────────────────────────────────────────────────────── */
async function _kAI(s,fv,sal,sp,kin) {
  const key=getApiKey();
  if(!key) return 'API Key no configurada. Configurá tu Groq API Key en ajustes.';
  const salE=getLastEval('saltos'), spE=getLastEval('sprint');
  const prompt=`Kinesiólogo deportivo argentino. Análisis conciso en español rioplatense.

ATLETA: ${s.nombre}, ${s.edad||'?'}a, ${s.peso||'?'}kg, ${s.deporte||'—'}${s.puesto?' ('+s.puesto+')':''}
${s.lesion?'LESIÓN: '+s.lesion:''}
F-V: ${fv?`${fv.ejercicio} | 1RM ${fv.oneRM?.toFixed(1)}kg | Pmax ${fv.Pmax?.toFixed(0)}W | FRel ${fv.ftRel?.toFixed(2)}xPC`:'Sin datos'}
Saltos: CMJ ${salE?.avg?.cmj?.toFixed(1)||'—'}cm | SJ ${salE?.avg?.sj?.toFixed(1)||'—'}cm
Sprint: 10m ${spE?.sp10||'—'}s | Vmax ${spE?.vmax||'—'}m/s | TTest ${spE?.ttest||'—'}s
${kin?`Kinesio: ${kin.dx} | EVA ${kin.eva}/10`:''}

Respondé EXACTAMENTE (sin intro):

📋 RESUMEN
[2 oraciones: estado funcional actual con valores]

💪 FORTALEZAS
• [punto 1 con valor concreto]
• [punto 2 con valor concreto]

⚠️ ÁREAS DE MEJORA
• [déficit 1 con umbral]
• [déficit 2 con umbral]

📅 PLAN DE ACCIÓN
• [prescripción 1: ejercicio, vol, intensidad]
• [prescripción 2: ejercicio, vol, intensidad]
• [prescripción 3: ejercicio, vol, intensidad]`;
  try {
    const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model:'llama-3.1-8b-instant',max_tokens:550,
        messages:[{role:'system',content:'Kinesiólogo deportivo argentino. Técnico, conciso, español rioplatense.'},
                  {role:'user',content:prompt}]})
    });
    const d=await r.json();
    if(d.error) throw new Error(d.error.message);
    return d.choices?.[0]?.message?.content||'Sin respuesta.';
  } catch(e) {
    console.error('KineticPDF AI:',e);
    return 'Error IA: '+e.message;
  }
}

function _kExtract(text,emoji) {
  if(!text) return '';
  const re=new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[^\\n]*\\n([\\s\\S]*?)(?=📋|💪|⚠️|📅|$)');
  const m=text.match(re);
  return m?m[1].trim():emoji==='📋'?text.slice(0,280).trim():'';
}

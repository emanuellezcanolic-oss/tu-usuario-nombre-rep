// ── THE MOVE CLUB · Informe Base v1 ──────────────────────────────────────────
// Branding compartido, SVGs, charts y CSS para todos los informes clínicos

// ── BRAND ─────────────────────────────────────────────────────────────────────
const TMC_BRAND = {
  negro:    '#1e1e1b',
  verde:    '#798254',
  verdeClr: '#96a566',  // ligero para texto sobre oscuro
  gris:     '#bab8b6',
  camel:    '#ada5a1',
  tostado:  '#ac9f98',
  offWhite: '#f4f3f2',
  verdePale:'#f0f3e8',
  verdeMid: '#e2e8cc',
};

// ── ISOTIPO SVG (tres triángulos anidados = silueta montaña) ──────────────────
const TMC_ISOTIPO_SVG = (color='currentColor', size=56) => `
<svg width="${size}" height="${Math.round(size*0.78)}" viewBox="0 0 100 78"
     xmlns="http://www.w3.org/2000/svg" fill="none"
     stroke="${color}" stroke-linejoin="round" stroke-linecap="round">
  <polygon points="50,5 94,73 6,73" stroke-width="4.5"/>
  <polygon points="50,19 80,73 20,73" stroke-width="3.5"/>
  <polygon points="50,34 66,73 34,73" stroke-width="2.8"/>
</svg>`;

// ── SELLO SVG (circular — THE MOVE CLUB / montaña / ESTD 2021) ───────────────
const TMC_SELLO_SVG = (color='currentColor', size=110) => `
<svg width="${size}" height="${size}" viewBox="0 0 200 200"
     xmlns="http://www.w3.org/2000/svg" fill="${color}">
  <circle cx="100" cy="100" r="96" fill="none" stroke="${color}" stroke-width="4"/>
  <circle cx="100" cy="100" r="82" fill="none" stroke="${color}" stroke-width="1.8"/>
  <path id="selloArcTop" fill="none" d="M 14,100 A 86,86 0 0,1 186,100"/>
  <text font-family="Arial,sans-serif" font-size="14" font-weight="900"
        letter-spacing="5" fill="${color}" stroke="none" text-anchor="middle">
    <textPath href="#selloArcTop" startOffset="50%">THE MOVE CLUB</textPath>
  </text>
  <!-- Isotipo central (3 triángulos) -->
  <g stroke="${color}" fill="none" stroke-width="3.5" stroke-linejoin="round">
    <polygon points="100,66 76,110 124,110"/>
    <polygon points="100,55 68,115 132,115"/>
    <polygon points="100,44 60,120 140,120"/>
  </g>
  <!-- ESTD 2021 -->
  <text x="100" y="170" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="12" font-weight="700" letter-spacing="5" fill="${color}" stroke="none">ESTD · 2021</text>
  <circle cx="37" cy="152" r="2.5" fill="${color}" stroke="none"/>
  <circle cx="163" cy="152" r="2.5" fill="${color}" stroke="none"/>
</svg>`;

// ── CSS COMPARTIDO ─────────────────────────────────────────────────────────────
function _tmcCSS() {
  return `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',Arial,Helvetica,sans-serif;background:#fff;color:#1e1e1b;font-size:12px;line-height:1.55}
  table{width:100%;border-collapse:collapse;font-size:11px}
  th{background:#798254;color:#fff;padding:7px 10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px}
  td{padding:6px 10px;border-bottom:1px solid #e5e9d8}
  tr:nth-child(even) td{background:#f8faf2}
  .pos{color:#2d6b1a;font-weight:700}
  .neg{color:#888}
  .alerta{color:#c03030;font-weight:700}
  .limite{color:#b06000;font-weight:700}
  .ok{color:#2d6b1a;font-weight:700}
  .sec-wrap{margin:22px 0 12px}
  .sec-head{display:flex;align-items:center;gap:9px;padding-bottom:6px;border-bottom:2px solid #d8e0b8}
  .sec-badge{display:inline-block;background:#798254;color:#fff;font-size:9px;font-weight:900;padding:3px 10px;border-radius:3px;letter-spacing:1.2px;flex-shrink:0}
  .sec-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:#1e1e1b}
  .sec-desc{font-size:10px;color:#444;line-height:1.7;padding:9px 13px;background:#f6f8ee;border-radius:5px;border-left:3px solid #798254;margin:10px 0}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  .card-data{background:#f6f8ee;border-radius:7px;padding:12px;border:1px solid #dde5c4}
  .card-label{font-size:9px;text-transform:uppercase;color:#798254;font-weight:700;letter-spacing:1px;margin-bottom:8px}
  .metric-box{background:#f6f8ee;border-radius:7px;padding:12px;text-align:center;border:1px solid #dde5c4}
  .metric-val{font-size:24px;font-weight:900;line-height:1}
  .metric-lbl{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
  .metric-sub{font-size:8px;color:#aaa;margin-top:3px}
  .phase-box{background:#f6f8ee;border-radius:6px;padding:10px;border:1px solid #dde5c4}
  .phase-sem{background:#798254;color:#fff;font-size:8px;padding:1px 7px;border-radius:3px;white-space:nowrap}
  .intro-box{padding:18px 36px;background:#f6f8ee;border-left:4px solid #798254;font-size:11px;line-height:1.85;color:#2a2a2a}
  .dx-main{border:1.5px solid #b0c070;border-radius:8px;overflow:hidden;margin-bottom:12px}
  .dx-head{background:#798254;padding:10px 14px;display:flex;justify-content:space-between;align-items:center}
  .dx-body{padding:12px 14px}
  .ref-foot{font-size:9px;color:#aaa;font-style:italic;text-align:right;margin-top:6px}
  @media print{
    .no-print{display:none!important}
    body{font-size:11px}
    header,footer,.sec-badge,th{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .dx-head,.metric-box,.card-data,.phase-box{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .intro-box{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .chart-block{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    svg{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }`;
}

// ── SECTION HEADER ─────────────────────────────────────────────────────────────
function _tmcSecHead(num, title) {
  return `<div class="sec-wrap"><div class="sec-head">
    <span class="sec-badge">${num}</span>
    <span class="sec-title">${title}</span>
  </div>`;
}
function _tmcSecClose() { return '</div>'; }
function _tmcRow(k, v) {
  return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eaeee0;font-size:11px">
    <span style="color:#555">${k}</span><span style="font-weight:600">${v||'—'}</span>
  </div>`;
}

// ── HEADER COMPLETO ────────────────────────────────────────────────────────────
function _tmcHeader(opts={}) {
  const {
    profNombre='Lic. Emanuel Lezcano', profMP='', profInst='The Move Club',
    fecha=new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'long',year:'numeric'}),
    subtitulo='REPORTE CLÍNICO KINESIOLÓGICO',
    refs='Basado en evidencia · EBM',
  } = opts;
  return `
<header style="background:#1e1e1b;padding:26px 44px;display:flex;justify-content:space-between;align-items:flex-start">
  <div style="display:flex;align-items:flex-start;gap:16px">
    <div style="opacity:.95;margin-top:2px">${TMC_ISOTIPO_SVG('#798254', 52)}</div>
    <div>
      <div style="font-size:26px;font-weight:900;letter-spacing:-.5px;color:#96a566;line-height:1">THE MOVE CLUB</div>
      <div style="font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:rgba(255,255,255,.38);margin-top:4px">${subtitulo}</div>
      <div style="font-size:10.5px;color:rgba(255,255,255,.58);margin-top:7px">${refs}</div>
    </div>
  </div>
  <div style="text-align:right;color:rgba(255,255,255,.75);font-size:11px">
    <div style="font-size:9px;color:rgba(255,255,255,.32);text-transform:uppercase;letter-spacing:1.2px">FECHA EVALUACIÓN</div>
    <div style="font-size:16px;font-weight:700;color:#96a566;margin-top:3px">${fecha}</div>
    <div style="margin-top:7px;font-size:11.5px;font-weight:600">${profNombre}${profMP?' · '+profMP:''}</div>
    <div style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px">${profInst}</div>
  </div>
</header>`;
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function _tmcFooter(modulo='Kinesiología', refs='EBM') {
  return `
<footer style="background:#1e1e1b;color:rgba(255,255,255,.35);padding:10px 44px;display:flex;justify-content:space-between;font-size:9px;margin-top:8px">
  <span>THE MOVE CLUB · DEPARTAMENTO DE BIOMECÁNICA Y RENDIMIENTO</span>
  <span>Informe Clínico Kinesiológico — ${modulo} · ${refs}</span>
</footer>`;
}

// ── FIRMA ─────────────────────────────────────────────────────────────────────
function _tmcFirma(opts={}) {
  const { profNombre='Lic. Emanuel Lezcano', profMP='', profInst='The Move Club' } = opts;
  return `
<div style="margin-top:32px;padding-top:18px;border-top:2px solid #dde5c4;display:flex;justify-content:space-between;align-items:flex-end">
  <div style="font-size:10px;color:#999;line-height:1.8">
    <div>THE MOVE CLUB · Kinesiología de Alto Rendimiento</div>
    <div>Informes generados con MoveMetrics · Evidencia CPG nivel I</div>
  </div>
  <div style="display:flex;align-items:flex-end;gap:24px">
    <div style="opacity:.75">${TMC_SELLO_SVG('#1e1e1b', 80)}</div>
    <div style="text-align:right">
      <div style="width:160px;border-top:1.5px solid #1e1e1b;margin-bottom:5px"></div>
      <div style="font-size:12px;font-weight:700">${profNombre}</div>
      ${profMP?`<div style="font-size:10px;color:#666">${profMP}</div>`:''}
      <div style="font-size:10px;color:#666">${profInst}</div>
    </div>
  </div>
</div>`;
}

// ── CHART: RADAR (ROM Spider) ─────────────────────────────────────────────────
// items = [{ label, D, I, max, ref }]
// D/I = valores reales; max = valor máximo de escala; ref = referencia normal
function _tmcRadarChart(items, opts={}) {
  const { size=280, title='' } = opts;
  const n = items.filter(it => it.max > 0).length;
  if (n < 3) return '';
  const validItems = items.filter(it => it.max > 0);

  const cx = size/2, cy = size/2 + 10;
  const maxR = size/2 - 58;
  const levels = 4;
  const angles = validItems.map((_,i) => -Math.PI/2 + (2*Math.PI/n)*i);

  // Grid
  let grid = '';
  for (let l=1; l<=levels; l++) {
    const r = maxR*l/levels;
    const pts = angles.map(a => `${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`).join(' ');
    grid += `<polygon points="${pts}" fill="none" stroke="#e0e4d4" stroke-width="${l===levels?1:0.6}"/>`;
    if (l===levels || l===levels/2) {
      grid += `<text x="${(cx-2).toFixed(1)}" y="${(cy-r-2).toFixed(1)}" text-anchor="middle" font-size="7" fill="#bbb">${Math.round(100*l/levels)}%</text>`;
    }
  }

  // Axes + labels
  let axes = '';
  validItems.forEach((item,i) => {
    const a = angles[i];
    const x1=(cx+maxR*Math.cos(a)).toFixed(1), y1=(cy+maxR*Math.sin(a)).toFixed(1);
    axes += `<line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" stroke="#dde0cc" stroke-width="0.8"/>`;
    const lx=cx+(maxR+26)*Math.cos(a), ly=cy+(maxR+26)*Math.sin(a);
    const ta=Math.cos(a)>0.1?'start':Math.cos(a)<-0.1?'end':'middle';
    // Multi-line label
    const words=item.label.split(' ');
    const linesL = words.length > 2 ? [words.slice(0,Math.ceil(words.length/2)).join(' '), words.slice(Math.ceil(words.length/2)).join(' ')] : [item.label];
    axes += `<text x="${lx.toFixed(1)}" y="${(ly-(linesL.length-1)*6).toFixed(1)}" text-anchor="${ta}" font-size="8.5" fill="#444" font-weight="600">`;
    linesL.forEach((line,li) => { axes += `<tspan x="${lx.toFixed(1)}" dy="${li===0?0:11}">${line}</tspan>`; });
    axes += `</text>`;
  });

  // Reference polygon (gray)
  const refPts = validItems.map((item,i) => {
    const ref = item.ref !== undefined ? item.ref : item.max;
    const r = maxR * Math.min(ref/item.max, 1);
    return `${(cx+r*Math.cos(angles[i])).toFixed(1)},${(cy+r*Math.sin(angles[i])).toFixed(1)}`;
  }).join(' ');

  // D polygon (verde)
  const dPts = validItems.map((item,i) => {
    const v = Math.max(parseFloat(item.D)||0, 0);
    const r = maxR * Math.min(v/item.max, 1);
    return `${(cx+r*Math.cos(angles[i])).toFixed(1)},${(cy+r*Math.sin(angles[i])).toFixed(1)}`;
  }).join(' ');

  // I polygon (camel)
  const iPts = validItems.map((item,i) => {
    const v = Math.max(parseFloat(item.I)||0, 0);
    const r = maxR * Math.min(v/item.max, 1);
    return `${(cx+r*Math.cos(angles[i])).toFixed(1)},${(cy+r*Math.sin(angles[i])).toFixed(1)}`;
  }).join(' ');

  const hasD = validItems.some(it => parseFloat(it.D) > 0);
  const hasI = validItems.some(it => parseFloat(it.I) > 0);

  // Legend
  const legX=8, legY=size-28;
  let legend = `<g font-size="8.5" fill="#555">`;
  legend += `<line x1="${legX}" y1="${legY}" x2="${legX+14}" y2="${legY}" stroke="#c0c8a0" stroke-width="1.5" stroke-dasharray="4,2"/><text x="${legX+17}" y="${legY+3}">Referencia normal</text>`;
  if (hasD) legend += `<rect x="${legX}" y="${legY+9}" width="14" height="4" fill="rgba(121,130,84,.28)" stroke="#798254" stroke-width="1" rx="1"/><text x="${legX+17}" y="${legY+14}" fill="#798254" font-weight="700">D (Dcha)</text>`;
  if (hasI) legend += `<rect x="${legX+90}" y="${legY+9}" width="14" height="4" fill="rgba(172,159,152,.25)" stroke="#ac9f98" stroke-width="1" rx="1"/><text x="${legX+107}" y="${legY+14}" fill="#ac9f98" font-weight="700">I (Izda)</text>`;
  legend += '</g>';

  return `<div class="chart-block" style="text-align:center;margin:12px 0 4px">
    ${title?`<div style="font-size:10px;font-weight:700;color:#1e1e1b;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">${title}</div>`:''}
    <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${size}px;display:inline-block">
      ${grid}${axes}
      <polygon points="${refPts}" fill="rgba(180,190,150,.12)" stroke="#c0c8a0" stroke-width="1.5" stroke-dasharray="5,3"/>
      ${hasD?`<polygon points="${dPts}" fill="rgba(121,130,84,.22)" stroke="#798254" stroke-width="2"/>`:'' }
      ${hasI?`<polygon points="${iPts}" fill="rgba(172,159,152,.18)" stroke="#ac9f98" stroke-width="2" stroke-dasharray="5,3"/>`:'' }
      ${legend}
    </svg>
  </div>`;
}

// ── CHART: BARRAS HORIZONTALES (Fuerza) ───────────────────────────────────────
// items = [{ label, D, I, unit, ref, asim }]
function _tmcBarChart(items, opts={}) {
  const { title='' } = opts;
  const valid = items.filter(it => it.D!==null||it.I!==null);
  if (!valid.length) return '';

  const rowH=36, padT=32, padL=140, padR=90, maxW=240, padB=12;
  const actualMax = Math.max(...valid.flatMap(it=>[parseFloat(it.D)||0,parseFloat(it.I)||0]),
                            ...valid.map(it=>it.ref||0)) * 1.15;
  const svgH = padT + valid.length * rowH + padB;
  const svgW = padL + maxW + padR;

  let rows='', header='';
  header += `<text x="${padL-6}" y="${padT-8}" text-anchor="end" font-size="9" fill="#888" font-weight="600">Movimiento</text>`;
  header += `<rect x="${padL}" y="${padT-16}" width="11" height="5" fill="#798254" rx="1.5"/>`;
  header += `<text x="${padL+14}" y="${padT-10}" font-size="9" fill="#798254" font-weight="700">D (dcha)</text>`;
  header += `<rect x="${padL+90}" y="${padT-16}" width="11" height="5" fill="#ada5a1" rx="1.5"/>`;
  header += `<text x="${padL+104}" y="${padT-10}" font-size="9" fill="#ada5a1" font-weight="700">I (izda)</text>`;
  header += `<text x="${padL+maxW+6}" y="${padT-10}" font-size="9" fill="#888" font-weight="600">Asim.</text>`;

  valid.forEach((item,i) => {
    const y = padT + i*rowH;
    const dV = parseFloat(item.D)||0, iV = parseFloat(item.I)||0;
    const dW = actualMax > 0 ? (dV/actualMax)*maxW : 0;
    const iW = actualMax > 0 ? (iV/actualMax)*maxW : 0;
    const refW = item.ref && actualMax > 0 ? (item.ref/actualMax)*maxW : 0;

    rows += `<rect x="${padL}" y="${y+3}" width="${maxW}" height="${rowH-6}" fill="${i%2===0?'#f9fbf3':'#fff'}" rx="2"/>`;
    rows += `<text x="${padL-8}" y="${y+rowH/2+4}" text-anchor="end" font-size="9" fill="#333">${item.label}</text>`;

    // D bar
    if (dW>0) {
      rows += `<rect x="${padL}" y="${y+6}" width="${dW.toFixed(1)}" height="${(rowH-12)/2-1}" fill="#798254" rx="2" opacity=".85"/>`;
      rows += `<text x="${padL+dW+4}" y="${y+14}" font-size="8" fill="#798254" font-weight="700">${item.D}${item.unit||''}</text>`;
    }
    // I bar
    if (iW>0) {
      rows += `<rect x="${padL}" y="${y+rowH/2-1}" width="${iW.toFixed(1)}" height="${(rowH-12)/2-1}" fill="#ada5a1" rx="2" opacity=".85"/>`;
      rows += `<text x="${padL+iW+4}" y="${y+rowH-7}" font-size="8" fill="#666" font-weight="700">${item.I}${item.unit||''}</text>`;
    }
    // Reference line
    if (refW>0) {
      rows += `<line x1="${padL+refW}" y1="${y+5}" x2="${padL+refW}" y2="${y+rowH-5}" stroke="#c8d090" stroke-width="1.5" stroke-dasharray="3,2"/>`;
    }
    // Asymmetry
    if (item.asim!==null && item.asim!==undefined) {
      const ac = +item.asim>=20?'#c03030':+item.asim>=15?'#b06000':'#2d6b1a';
      rows += `<text x="${padL+maxW+8}" y="${y+rowH/2+4}" font-size="8.5" fill="${ac}" font-weight="700">${item.asim}%</text>`;
    }
  });

  return `<div class="chart-block" style="margin:12px 0 4px">
    ${title?`<div style="font-size:10px;font-weight:700;color:#1e1e1b;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">${title}</div>`:''}
    <svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${svgW}px;display:block;margin:0 auto">
      ${header}${rows}
    </svg>
  </div>`;
}

// ── CHART: GAUGE SEMICIRCULAR (Escalas) ──────────────────────────────────────
// score=valor numérico; max=máximo; opts.cutoffs=[{val, color}]
function _tmcGauge(score, max, opts={}) {
  const { label='', sub='', size=150, colorFn=null } = opts;
  if (score === null || score === undefined || isNaN(+score)) return '';
  const pct = Math.min(Math.max(+score/+max, 0), 1);
  const cx=size/2, cy=size*0.62, r=size*0.38;

  // Color based on pct (default: red→orange→green)
  const color = colorFn ? colorFn(+score, +max)
    : (pct>=0.7?'#798254':pct>=0.4?'#b06000':'#c03030');

  // Arc angles (from left=180° to right=0° across the top)
  const fillAngle = Math.PI*(1-pct);
  const fillEndX = (cx + r*Math.cos(fillAngle)).toFixed(2);
  const fillEndY = (cy - r*Math.sin(fillAngle)).toFixed(2);
  const largeArc = pct > 0.5 ? '1' : '0';

  // Tick marks
  let ticks='';
  for (let t=0; t<=4; t++) {
    const a=Math.PI*(1-t/4);
    const x1=(cx+r*Math.cos(a)).toFixed(1), y1=(cy-r*Math.sin(a)).toFixed(1);
    const x2=(cx+(r-6)*Math.cos(a)).toFixed(1), y2=(cy-(r-6)*Math.sin(a)).toFixed(1);
    ticks+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ccc" stroke-width="1.5"/>`;
  }

  return `<div style="text-align:center">
    <svg viewBox="0 0 ${size} ${size*0.72}" xmlns="http://www.w3.org/2000/svg" style="width:${size}px;max-width:100%">
      <!-- BG arc -->
      <path d="M ${(cx-r).toFixed(1)},${cy.toFixed(1)} A ${r},${r} 0 0,1 ${(cx+r).toFixed(1)},${cy.toFixed(1)}"
            fill="none" stroke="#e8e8e4" stroke-width="13" stroke-linecap="round"/>
      <!-- Fill arc -->
      ${pct>0?`<path d="M ${(cx-r).toFixed(1)},${cy.toFixed(1)} A ${r},${r} 0 ${largeArc},1 ${fillEndX},${fillEndY}"
            fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round"/>`:''}
      ${ticks}
      <!-- Score -->
      <text x="${cx}" y="${(cy-4).toFixed(1)}" text-anchor="middle"
            font-size="${Math.round(size*0.2)}" font-weight="900" fill="${color}">${Math.round(+score)}</text>
      <text x="${cx}" y="${(cy+11).toFixed(1)}" text-anchor="middle"
            font-size="${Math.round(size*0.085)}" fill="#aaa">/${max}</text>
      <!-- Label -->
      <text x="${cx}" y="${(cy+23).toFixed(1)}" text-anchor="middle"
            font-size="${Math.round(size*0.082)}" fill="#555" font-weight="700">${label}</text>
      ${sub?`<text x="${cx}" y="${(cy+34).toFixed(1)}" text-anchor="middle" font-size="${Math.round(size*0.07)}" fill="#aaa">${sub}</text>`:''}
    </svg>
  </div>`;
}

// ── PROGRESS BAR horizontal simple ────────────────────────────────────────────
function _tmcProgressBar(val, max, opts={}) {
  const { color='#798254', label='', sub='' } = opts;
  const pct = Math.min(Math.max(+val/+max*100, 0), 100);
  return `<div style="margin-bottom:10px">
    <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px">
      <span style="font-weight:600">${label}</span>
      <span style="color:${color};font-weight:700">${Math.round(+val)} / ${max}</span>
    </div>
    <div style="background:#eee;border-radius:4px;height:8px;overflow:hidden">
      <div style="background:${color};width:${pct.toFixed(1)}%;height:100%;border-radius:4px"></div>
    </div>
    ${sub?`<div style="font-size:9px;color:#999;margin-top:2px">${sub}</div>`:''}
  </div>`;
}

// ── VENTANA COMPLETA (wrapper para abrir popup) ───────────────────────────────
function _tmcOpenWindow(html, titulo='Informe TMC') {
  const win = window.open('', '_blank', 'width=980,height=880,resizable=yes,scrollbars=yes');
  if (!win) { alert('Habilitá popups para este sitio para abrir el informe.'); return; }
  win.document.write(html);
  win.document.close();
}

// ── BARRA HERRAMIENTAS (no-print) ─────────────────────────────────────────────
const _tmcToolbar = `
<div class="no-print" style="background:#1e1e1b;padding:10px 20px;display:flex;gap:8px;align-items:center;position:sticky;top:0;z-index:100">
  <button onclick="window.print()" style="background:#798254;color:#fff;border:none;border-radius:4px;padding:8px 18px;font-weight:700;cursor:pointer;font-size:12px;letter-spacing:.3px">
    🖨 Imprimir / Guardar PDF
  </button>
  <button onclick="(function(){const b=document.getElementById('report-body');const e=b.contentEditable==='true';b.contentEditable=e?'false':'true';b.style.outline=e?'none':'2px dashed #798254';this.textContent=e?'✏ Editar':'✓ Listo';this.style.background=e?'#444':'#798254'}).call(this)"
    style="background:#444;color:#fff;border:none;border-radius:4px;padding:8px 14px;cursor:pointer;font-size:12px">✏ Editar</button>
  <span style="font-size:10px;color:rgba(255,255,255,.35);margin-left:6px">Imprimir → «Guardar como PDF» para exportar</span>
</div>`;

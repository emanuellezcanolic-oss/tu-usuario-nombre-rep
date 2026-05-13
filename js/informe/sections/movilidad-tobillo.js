// movilidad-tobillo.js — page 5: Lunge Test + TROM Cadera (coords ajustadas)
(function(){
  if (typeof INF === 'undefined') return;
  const BG = 'assets/templates/move-club/5.png';

  INF.register('movilidad-tobillo', (a) => {
    let lD = a.lungeD ?? null, lI = a.lungeI ?? null;
    if (lD == null && a.evals){
      const last = Object.values(a.evals).filter(e => e?.lungeD != null).pop();
      if (last){ lD = last.lungeD; lI = last.lungeI; }
    }
    let cadD = a.tromCadD ?? null, cadI = a.tromCadI ?? null;
    if (cadD == null && a.evals){
      const last = Object.values(a.evals).filter(e => e?.tromCadD != null).pop();
      if (last){ cadD = last.tromCadD; cadI = last.tromCadI; }
    }
    // si tenemos RI/RE separados los usaríamos, por ahora dividimos TROM en 2
    const cadD_RI = a.tromCadDRI ?? (cadD != null ? Math.round(cadD * 0.55) : null);
    const cadD_RE = a.tromCadDRE ?? (cadD != null ? cadD - (cadD_RI||0) : null);
    const cadI_RI = a.tromCadIRI ?? (cadI != null ? Math.round(cadI * 0.55) : null);
    const cadI_RE = a.tromCadIRE ?? (cadI != null ? cadI - (cadI_RI||0) : null);

    const pctLunge = INF.pctDiff(lD, lI);
    const clsL = v => v == null ? '' : v < 35 ? 'val-bad' : v < 40 ? 'val-warn' : 'val-good';
    const clsC = v => v == null ? '' : v < 80 ? 'val-bad' : v < 90 ? 'val-warn' : 'val-good';
    const fmt = v => v == null ? '—' : v.toFixed(0) + '°';

    // Stilo común para overlay numérico en cajitas pequeñas
    const ovStyle = (left, top, w, h, fs) =>
      `position:absolute;left:${left}%;top:${top}%;width:${w}%;height:${h}%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-weight:900;font-size:${fs}px;text-shadow:0 1px 2px rgba(0,0,0,.7)`;

    return `
    <div class="rpt-page" style="background-image:url('${BG}')">
      <!-- LUNGE TEST ─ izquierda: 2 valores + % -->
      <!-- DERECHA value box -->
      <div class="${clsL(lD)?'val-good':''}" style="${ovStyle(23, 60, 11, 7, 26)};color:${lD==null?'#888':lD<35?'#ff4060':lD<40?'#ffb020':'#39FF7A'}">${fmt(lD)}</div>
      <!-- IZQUIERDA value box -->
      <div style="${ovStyle(23, 68.5, 11, 7, 26)};color:${lI==null?'#888':lI<35?'#ff4060':lI<40?'#ffb020':'#39FF7A'}">${fmt(lI)}</div>
      <!-- % DIFERENCIA value -->
      <div style="${ovStyle(36, 68.5, 11, 7, 22)};color:${pctLunge==null?'#888':pctLunge<5?'#39FF7A':pctLunge<10?'#ffb020':'#ff4060'}">${pctLunge==null?'—':pctLunge.toFixed(1)+'%'}</div>

      <!-- TROM CADERA — derecha: RI/RE D/I + TROM -->
      <div style="${ovStyle(70, 56.5, 11, 6, 22)};color:${clsC(cadD_RI)==='val-good'?'#39FF7A':clsC(cadD_RI)==='val-warn'?'#ffb020':cadD_RI==null?'#888':'#ff4060'}">${fmt(cadD_RI)}</div>
      <div style="${ovStyle(84, 56.5, 11, 6, 22)};color:${clsC(cadI_RI)==='val-good'?'#39FF7A':clsC(cadI_RI)==='val-warn'?'#ffb020':cadI_RI==null?'#888':'#ff4060'}">${fmt(cadI_RI)}</div>
      <div style="${ovStyle(70, 63.5, 11, 6, 22)};color:${clsC(cadD_RE)==='val-good'?'#39FF7A':clsC(cadD_RE)==='val-warn'?'#ffb020':cadD_RE==null?'#888':'#ff4060'}">${fmt(cadD_RE)}</div>
      <div style="${ovStyle(84, 63.5, 11, 6, 22)};color:${clsC(cadI_RE)==='val-good'?'#39FF7A':clsC(cadI_RE)==='val-warn'?'#ffb020':cadI_RE==null?'#888':'#ff4060'}">${fmt(cadI_RE)}</div>
      <div style="${ovStyle(70, 70.5, 11, 6, 24)};color:${clsC(cadD)==='val-good'?'#39FF7A':clsC(cadD)==='val-warn'?'#ffb020':cadD==null?'#888':'#ff4060'}">${fmt(cadD)}</div>
      <div style="${ovStyle(84, 70.5, 11, 6, 24)};color:${clsC(cadI)==='val-good'?'#39FF7A':clsC(cadI)==='val-warn'?'#ffb020':cadI==null?'#888':'#ff4060'}">${fmt(cadI)}</div>
    </div>`;
  });
})();

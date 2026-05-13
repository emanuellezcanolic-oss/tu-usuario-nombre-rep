// movilidad-hombro.js — page 6: Hombro RI/RE/TROM D/I
(function(){
  if (typeof INF === 'undefined') return;
  const BG = 'assets/templates/move-club/6.png';
  INF.register('movilidad-hombro', (a) => {
    let homD = a.tromHomD ?? null, homI = a.tromHomI ?? null;
    if (homD == null && a.evals){
      const last = Object.values(a.evals).filter(e => e?.tromHomD != null).pop();
      if (last){ homD = last.tromHomD; homI = last.tromHomI; }
    }
    // si tenemos RI/RE separados sería mejor, por ahora muestro TROM total
    const cls = v => v == null ? '' : v < 135 ? 'val-bad' : v < 150 ? 'val-warn' : 'val-good';
    const fmt = v => v == null ? '—' : v.toFixed(0) + '°';
    const half = v => v == null ? null : Math.round(v/2);

    return `
    <div class="rpt-page" style="background-image:url('${BG}')">
      <!-- RI D/I (assumimos mitad de TROM si solo tenemos total) -->
      <div class="rpt-ov num ${cls(homD)}" style="left:61%;top:32%;width:10%;height:7%;font-size:20px">${fmt(half(homD))}</div>
      <div class="rpt-ov num ${cls(homI)}" style="left:81%;top:32%;width:10%;height:7%;font-size:20px">${fmt(half(homI))}</div>
      <!-- RE D/I -->
      <div class="rpt-ov num ${cls(homD)}" style="left:61%;top:46%;width:10%;height:7%;font-size:20px">${fmt(half(homD))}</div>
      <div class="rpt-ov num ${cls(homI)}" style="left:81%;top:46%;width:10%;height:7%;font-size:20px">${fmt(half(homI))}</div>
      <!-- TROM total D/I -->
      <div class="rpt-ov num ${cls(homD)}" style="left:61%;top:60%;width:10%;height:7%;font-size:22px">${fmt(homD)}</div>
      <div class="rpt-ov num ${cls(homI)}" style="left:81%;top:60%;width:10%;height:7%;font-size:22px">${fmt(homI)}</div>
    </div>`;
  });
})();

// movilidad-tobillo.js — page 5: Lunge Test (LEFT) + TROM Cadera (RIGHT)
// Coords aproximadas según template Canva 2400×1350 → mapeadas a % de 1200×675
(function(){
  if (typeof INF === 'undefined') return;
  const BG = 'assets/templates/move-club/5.png';

  INF.register('movilidad-tobillo', (a, ev) => {
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

    const pctLunge = INF.pctDiff(lD, lI);
    const cls = v => v == null ? '' : v < 35 ? 'val-bad' : v < 40 ? 'val-warn' : 'val-good';
    const clsCad = v => v == null ? '' : v < 80 ? 'val-bad' : v < 90 ? 'val-warn' : 'val-good';
    const fmt = v => v == null ? '—' : v.toFixed(0) + '°';

    return `
    <div class="rpt-page" style="background-image:url('${BG}')">
      <!-- LUNGE TEST izquierda -->
      <div class="rpt-ov num ${cls(lD)}" style="left:11%;top:51%;width:11%;height:8%;font-size:28px">${fmt(lD)}</div>
      <div class="rpt-ov num ${cls(lI)}" style="left:11%;top:62%;width:11%;height:8%;font-size:28px">${fmt(lI)}</div>
      <div class="rpt-ov num ${pctLunge==null?'':pctLunge<5?'val-good':pctLunge<10?'val-warn':'val-bad'}" style="left:34%;top:58%;width:11%;height:8%;font-size:22px">${pctLunge==null?'—':pctLunge.toFixed(1)+'%'}</div>

      <!-- TROM CADERA derecha. RI/RE D/I -->
      <div class="rpt-ov num ${clsCad(cadD)}" style="left:73%;top:48%;width:10%;height:7%;font-size:22px">${fmt(cadD)}</div>
      <div class="rpt-ov num ${clsCad(cadI)}" style="left:85%;top:48%;width:10%;height:7%;font-size:22px">${fmt(cadI)}</div>
    </div>`;
  });
})();

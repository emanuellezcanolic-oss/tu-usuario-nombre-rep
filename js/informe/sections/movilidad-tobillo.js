// movilidad-tobillo.js — page 5: Lunge + TROM Cadera (draggable via .rpt-cal)
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
    const cadD_RI = a.tromCadDRI ?? (cadD != null ? Math.round(cadD * 0.55) : null);
    const cadD_RE = a.tromCadDRE ?? (cadD != null ? cadD - (cadD_RI||0) : null);
    const cadI_RI = a.tromCadIRI ?? (cadI != null ? Math.round(cadI * 0.55) : null);
    const cadI_RE = a.tromCadIRE ?? (cadI != null ? cadI - (cadI_RI||0) : null);

    const pctL = INF.pctDiff(lD, lI);
    const fmt = v => v == null ? '—' : v.toFixed(0) + '°';
    const colL = v => v == null ? '#888' : v < 35 ? '#ff4060' : v < 40 ? '#ffb020' : '#39FF7A';
    const colC = v => v == null ? '#888' : v < 80 ? '#ff4060' : v < 90 ? '#ffb020' : '#39FF7A';
    const colP = v => v == null ? '#888' : v < 5  ? '#39FF7A' : v < 10 ? '#ffb020' : '#ff4060';

    // helper para overlay draggable. key único por campo.
    const ov = (key, txt, color, fs, left, top) =>
      `<div class="rpt-cal" data-key="${key}" style="position:absolute;left:${left}%;top:${top}%;width:11%;height:6%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-weight:900;font-size:${fs}px;color:${color};text-shadow:0 1px 2px rgba(0,0,0,.7)">${txt}</div>`;

    return `
    <div class="rpt-page" style="background-image:url('${BG}')">
      ${ov('mov_lunge_d',      fmt(lD),     colL(lD), 26, 23, 60)}
      ${ov('mov_lunge_i',      fmt(lI),     colL(lI), 26, 23, 68.5)}
      ${ov('mov_lunge_pct',    pctL==null?'—':pctL.toFixed(1)+'%', colP(pctL), 22, 36, 68.5)}
      ${ov('mov_cad_ri_d',     fmt(cadD_RI), colC(cadD_RI), 22, 70, 56.5)}
      ${ov('mov_cad_ri_i',     fmt(cadI_RI), colC(cadI_RI), 22, 84, 56.5)}
      ${ov('mov_cad_re_d',     fmt(cadD_RE), colC(cadD_RE), 22, 70, 63.5)}
      ${ov('mov_cad_re_i',     fmt(cadI_RE), colC(cadI_RE), 22, 84, 63.5)}
      ${ov('mov_cad_trom_d',   fmt(cadD),    colC(cadD), 24, 70, 70.5)}
      ${ov('mov_cad_trom_i',   fmt(cadI),    colC(cadI), 24, 84, 70.5)}
    </div>`;
  });
})();

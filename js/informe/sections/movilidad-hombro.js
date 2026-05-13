// movilidad-hombro.js — page 6: Hombro RI/RE/TROM D/I (draggable)
(function(){
  if (typeof INF === 'undefined') return;
  const BG = 'assets/templates/move-club/6.png';
  INF.register('movilidad-hombro', (a) => {
    let homD = a.tromHomD ?? null, homI = a.tromHomI ?? null;
    if (homD == null && a.evals){
      const last = Object.values(a.evals).filter(e => e?.tromHomD != null).pop();
      if (last){ homD = last.tromHomD; homI = last.tromHomI; }
    }
    const half = v => v == null ? null : Math.round(v/2);
    const fmt = v => v == null ? '—' : v.toFixed(0) + '°';
    const col = v => v == null ? '#888' : v < 135 ? '#ff4060' : v < 150 ? '#ffb020' : '#39FF7A';
    const ov = (k, txt, c, fs, l, t) =>
      `<div class="rpt-cal" data-key="${k}" style="position:absolute;left:${l}%;top:${t}%;width:11%;height:7%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-weight:900;font-size:${fs}px;color:${c};text-shadow:0 1px 2px rgba(0,0,0,.7)">${txt}</div>`;
    return `
    <div class="rpt-page" style="background-image:url('${BG}')">
      ${ov('hom_ri_d',   fmt(half(homD)), col(homD), 22, 61, 32)}
      ${ov('hom_ri_i',   fmt(half(homI)), col(homI), 22, 81, 32)}
      ${ov('hom_re_d',   fmt(half(homD)), col(homD), 22, 61, 46)}
      ${ov('hom_re_i',   fmt(half(homI)), col(homI), 22, 81, 46)}
      ${ov('hom_trom_d', fmt(homD),       col(homD), 24, 61, 60)}
      ${ov('hom_trom_i', fmt(homI),       col(homI), 24, 81, 60)}
    </div>`;
  });
})();

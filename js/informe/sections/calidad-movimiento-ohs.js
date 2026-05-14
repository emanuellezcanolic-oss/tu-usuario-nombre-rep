// calidad-movimiento-ohs.js — page 3: Overhead Squat
// Foto desde FMS slot-ohs-frente / slot-ohs-perfil + criterios % desde cur.evals.fms_*
(function(){
  if (typeof INF === 'undefined') return;
  const BG = 'assets/templates/move-club/3.png';

  INF.register('calidad-movimiento-ohs', (a) => {
    // recuperar fotos desde slots FMS del DOM
    const fmsImg = (id) => {
      const slot = document.getElementById(id);
      return slot?.querySelector('img')?.src || null;
    };
    const photoFrente = fmsImg('slot-ohs-frente');
    const photoPerfil = fmsImg('slot-ohs-perfil');

    // criterios desde última evaluación FMS
    let crit = null;
    if (a.evals){
      const lastFms = Object.entries(a.evals)
        .filter(([k]) => k.startsWith('fms_'))
        .map(([,v]) => v)
        .pop();
      crit = lastFms?.ohs?.criterios;
    }
    // si crit es array de yes/no por índice 0..3 → calcular % cada uno (yes=25%, no=0%)
    const pct = idx => {
      if (!Array.isArray(crit)) return null;
      const v = crit[idx];
      return v === 'yes' ? '25%' : v === 'no' ? '0%' : null;
    };
    const totalPct = () => {
      if (!Array.isArray(crit)) return null;
      const yes = crit.filter(x => x === 'yes').length;
      return (yes * 25) + '%';
    };

    const fmt = v => v == null ? '—' : v;
    const col = v => v === '25%' ? '#39FF7A' : v === '0%' ? '#ff4060' : '#888';

    // overlay helper draggable
    const ov = (key, txt, color, fs, l, t, w, h) =>
      `<div class="rpt-cal" data-key="${key}" style="position:absolute;left:${l}%;top:${t}%;width:${w}%;height:${h}%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-weight:900;font-size:${fs}px;color:${color};text-shadow:0 1px 2px rgba(0,0,0,.7)">${txt}</div>`;

    // overlay para foto
    const photoOv = (key, src, l, t, w, h) => {
      if (!src) return `<div class="rpt-cal" data-key="${key}" style="position:absolute;left:${l}%;top:${t}%;width:${w}%;height:${h}%;display:flex;align-items:center;justify-content:center;font-size:9px;color:#666;border:1px dashed #444;border-radius:4px;text-align:center">Pegar Foto<br>(${key})</div>`;
      return `<div class="rpt-cal" data-key="${key}" style="position:absolute;left:${l}%;top:${t}%;width:${w}%;height:${h}%;overflow:hidden;border-radius:4px"><img src="${src}" style="width:100%;height:100%;object-fit:cover"></div>`;
    };

    return `
    <div class="rpt-page" style="background-image:url('${BG}')">
      <!-- 2 fotos slots dashed -->
      ${photoOv('cm_ohs_foto1', photoFrente, 31, 58, 13, 35)}
      ${photoOv('cm_ohs_foto2', photoPerfil, 47, 58, 13, 35)}
      <!-- 4 criterios % -->
      ${ov('cm_ohs_c1', fmt(pct(0)), col(pct(0)), 16, 90, 64, 8, 5)}
      ${ov('cm_ohs_c2', fmt(pct(1)), col(pct(1)), 16, 90, 72, 8, 5)}
      ${ov('cm_ohs_c3', fmt(pct(2)), col(pct(2)), 16, 90, 80, 8, 5)}
      ${ov('cm_ohs_c4', fmt(pct(3)), col(pct(3)), 16, 90, 88, 8, 5)}
      <!-- total combinado -->
      ${ov('cm_ohs_total', fmt(totalPct()), totalPct()==='100%'?'#39FF7A':totalPct()==='0%'?'#ff4060':'#ffb020', 28, 91, 76, 9, 8)}
    </div>`;
  });
})();

// calidad-movimiento-sls.js — page 4: Single-Leg Squat
// 4 fotos slots (D/I × frente/perfil) + criterios % por lado
(function(){
  if (typeof INF === 'undefined') return;
  const BG = 'assets/templates/move-club/4.png';

  INF.register('calidad-movimiento-sls', (a) => {
    const fmsImg = (id) => document.getElementById(id)?.querySelector('img')?.src || null;
    const photoFD = fmsImg('slot-sd-fd');
    const photoPD = fmsImg('slot-sd-pd');
    const photoFI = fmsImg('slot-sd-fi');
    const photoPI = fmsImg('slot-sd-pi');

    let critD = null, critI = null;
    if (a.evals){
      const lastFms = Object.entries(a.evals)
        .filter(([k]) => k.startsWith('fms_'))
        .map(([,v]) => v)
        .pop();
      const sd = lastFms?.sd;
      if (sd){
        critD = sd.criteriosD || sd.criterios; // depende cómo se guarda
        critI = sd.criteriosI || sd.criterios;
      }
    }

    const totalPct = (crit) => {
      if (!Array.isArray(crit)) return null;
      const yes = crit.filter(x => x === 'yes').length;
      return (yes * 25) + '%';
    };
    const fmt = v => v == null ? '—' : v;
    const totD = totalPct(critD);
    const totI = totalPct(critI);

    const ov = (key, txt, color, fs, l, t, w, h) =>
      `<div class="rpt-cal" data-key="${key}" style="position:absolute;left:${l}%;top:${t}%;width:${w}%;height:${h}%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-weight:900;font-size:${fs}px;color:${color};text-shadow:0 1px 2px rgba(0,0,0,.7)">${txt}</div>`;

    const photoOv = (key, src, l, t, w, h) => {
      if (!src) return `<div class="rpt-cal" data-key="${key}" style="position:absolute;left:${l}%;top:${t}%;width:${w}%;height:${h}%;display:flex;align-items:center;justify-content:center;font-size:9px;color:#666;border:1px dashed #444;border-radius:4px;text-align:center">Pegar Foto<br>(${key})</div>`;
      return `<div class="rpt-cal" data-key="${key}" style="position:absolute;left:${l}%;top:${t}%;width:${w}%;height:${h}%;overflow:hidden;border-radius:4px"><img src="${src}" style="width:100%;height:100%;object-fit:cover"></div>`;
    };

    const colT = t => t === '100%' ? '#39FF7A' : t === '0%' ? '#ff4060' : '#ffb020';

    return `
    <div class="rpt-page" style="background-image:url('${BG}')">
      <!-- 4 fotos: D-Frente, D-Perfil, I-Frente, I-Perfil -->
      ${photoOv('cm_sls_dfrente', photoFD, 3, 47, 14, 41)}
      ${photoOv('cm_sls_dperfil', photoPD, 19, 47, 14, 41)}
      ${photoOv('cm_sls_ifrente', photoFI, 35, 47, 14, 41)}
      ${photoOv('cm_sls_iperfil', photoPI, 51, 47, 14, 41)}
      <!-- % por lado: DERECHA / IZQUIERDA -->
      ${ov('cm_sls_pct_d', fmt(totD), colT(totD), 24, 79, 47, 9, 8)}
      ${ov('cm_sls_pct_i', fmt(totI), colT(totI), 24, 91, 47, 9, 8)}
    </div>`;
  });
})();

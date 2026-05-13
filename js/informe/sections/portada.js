// portada.js — page 1 con overlays draggables
(function(){
  if (typeof INF === 'undefined') return;
  const BG = 'assets/templates/move-club/1.png';
  INF.register('portada', (a) => {
    const fecha = new Date().toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' });
    const ov = (key, txt, color, fs, left, top, w) =>
      `<div class="rpt-cal" data-key="${key}" style="position:absolute;left:${left}%;top:${top}%;width:${w||40}%;color:${color};font-family:'Bebas Neue',sans-serif;font-weight:900;font-size:${fs}px;text-shadow:0 2px 4px rgba(0,0,0,.7);text-align:left">${txt}</div>`;
    return `
    <div class="rpt-page" style="background-image:url('${BG}')">
      ${ov('portada_nombre', (a.nombre||'—').toUpperCase(), '#39FF7A', 28, 6, 75)}
      ${ov('portada_meta1',  `${a.deporte||''}${a.puesto?' · '+a.puesto:''}${a.edad?' · '+a.edad+' años':''}${a.peso?' · '+a.peso+'kg':''}`, '#ddd', 14, 6, 82)}
      ${ov('portada_fecha',  fecha, '#888', 12, 6, 88)}
    </div>`;
  });
})();

// portada.js — page 1: INFORME header con logo The Move Club
(function(){
  if (typeof INF === 'undefined') return;
  const BG = 'assets/templates/move-club/1.png';
  INF.register('portada', (a, ev) => {
    const fecha = new Date().toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' });
    return `
    <div class="rpt-page" style="background-image:url('${BG}')">
      <!-- Por: Prof. abajo de "INFORME" -->
      <div class="rpt-ov text" style="left:6%;top:75%;width:50%;font-size:24px;color:#39FF7A;text-shadow:none;justify-content:flex-start">
        ${(a.nombre||'—').toUpperCase()}
      </div>
      <div class="rpt-ov text" style="left:6%;top:82%;width:50%;font-size:14px;color:#ddd;text-shadow:none;justify-content:flex-start;font-weight:400">
        ${a.deporte||''}${a.puesto?' · '+a.puesto:''}${a.edad?' · '+a.edad+' años':''}${a.peso?' · '+a.peso+'kg':''}
      </div>
      <div class="rpt-ov text" style="left:6%;top:88%;width:50%;font-size:12px;color:#888;text-shadow:none;justify-content:flex-start;font-weight:400;letter-spacing:.1em;text-transform:uppercase">
        ${fecha}
      </div>
    </div>`;
  });
})();

// intro.js — page 2: EVALUACIONES REALIZADAS (background only, sin data dinámica)
(function(){
  if (typeof INF === 'undefined') return;
  const BG = 'assets/templates/move-club/2.png';
  INF.register('intro', (a) => {
    return `<div class="rpt-page" style="background-image:url('${BG}')"></div>`;
  });
})();

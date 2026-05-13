// js/informe/sections/portada.js
(function(){
  if (typeof INF === 'undefined') return;
  INF.register('portada', (a, ev) => {
    const fecha = new Date().toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' });
    const evalNum = (a.evals && Object.keys(a.evals).length) || ev.evalNum || 1;
    const foto = a.foto || a.avatar || '';
    return `
    <div class="rpt-page rpt-cover">
      <div class="big">INFORME<br/><span style="color:#fff">EVALUATIVO</span></div>
      <div class="photo-circle">
        ${foto ? `<img src="${foto}" alt="">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#444;font-size:60px">👤</div>`}
      </div>
      <div class="athlete">${a.nombre || '—'}</div>
      <div class="meta">${a.deporte || ''} ${a.puesto ? '· '+a.puesto : ''}</div>
      <div class="meta" style="margin-top:6px">${a.edad ? a.edad+' años' : ''} ${a.peso ? '· '+a.peso+' kg' : ''} ${a.talla ? '· '+a.talla+' cm' : ''}</div>
      <div class="meta" style="margin-top:14px">${fecha}</div>
      <div class="eval-tags">
        <span class="eval-tag">Evaluación N°${evalNum}</span>
        ${a.objetivo ? `<span class="eval-tag">${a.objetivo}</span>` : ''}
        ${a.nivel ? `<span class="eval-tag">${a.nivel}</span>` : ''}
      </div>
      ${INF.pageFooter(1)}
    </div>`;
  });
})();

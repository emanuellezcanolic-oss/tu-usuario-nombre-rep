// js/informe/selector.js — modal para elegir qué secciones incluir en el informe HTML

(function(){
'use strict';

function openInformeBuilder(){
  if (typeof INF === 'undefined'){ alert('Builder no cargado'); return; }
  const atleta = (typeof cur !== 'undefined') ? cur : null;
  if (!atleta){
    alert('Seleccioná un atleta primero.\nIr a "Atletas" → click sobre un atleta → después volver a Historial.');
    return;
  }

  let modal = document.getElementById('inf-builder-modal');
  if (modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'inf-builder-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';

  const cat = INF.CATALOG;
  const items = Object.entries(cat).map(([id, info]) => {
    const checked = info.always ? 'checked disabled' : '';
    return `<label style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--bg1);border:1px solid var(--border);border-radius:5px;cursor:pointer;transition:all .15s;margin-bottom:5px" onmouseover="this.style.borderColor='var(--neon)'" onmouseout="this.style.borderColor='var(--border)'">
      <input type="checkbox" class="inf-sec-cb" data-section="${id}" ${checked} ${!info.always?'checked':''} style="width:16px;height:16px;accent-color:var(--neon)">
      <span style="font-size:16px">${info.icon}</span>
      <span style="flex:1;font-size:12px;color:var(--text)">${info.label}</span>
      ${info.always?'<span style="font-size:9px;color:var(--text3);text-transform:uppercase">obligatoria</span>':''}
    </label>`;
  }).join('');

  modal.innerHTML = `
    <div style="width:min(640px,94vw);max-height:88vh;overflow:auto;background:var(--bg2);border:1px solid var(--neon);border-radius:10px;padding:0;box-shadow:0 0 40px rgba(57,255,122,.25)">
      <div style="padding:16px 20px;background:var(--bg1);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px">
        <span style="font-family:var(--mono);font-weight:700;color:var(--neon);font-size:11px;letter-spacing:.1em">📄 ARMAR INFORME · ${(atleta.nombre||'').toUpperCase()}</span>
        <span style="flex:1"></span>
        <button onclick="document.getElementById('inf-builder-modal').remove()" style="background:transparent;border:1px solid var(--border);color:var(--text2);padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px">✕</button>
      </div>
      <div style="padding:14px 18px">
        <div style="font-size:11px;color:var(--text3);margin-bottom:10px">Marcá las secciones que querés incluir. El informe se abre en una ventana nueva → "🖨 Imprimir / Guardar PDF" para exportar.</div>
        <div style="display:flex;gap:6px;margin-bottom:10px">
          <button class="btn btn-ghost btn-sm" onclick="document.querySelectorAll('.inf-sec-cb:not(:disabled)').forEach(c=>c.checked=true)">☑ Todas</button>
          <button class="btn btn-ghost btn-sm" onclick="document.querySelectorAll('.inf-sec-cb:not(:disabled)').forEach(c=>c.checked=false)">☐ Ninguna</button>
        </div>
        ${items}
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="btn btn-neon" style="flex:1" onclick="generarInformeHTML()">📄 Generar informe</button>
          <button class="btn btn-ghost" onclick="document.getElementById('inf-builder-modal').remove()">Cancelar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function generarInformeHTML(){
  const ids = Array.from(document.querySelectorAll('.inf-sec-cb:checked')).map(c => c.dataset.section);
  if (!ids.length){ alert('Marcá al menos una sección'); return; }
  const atleta = (typeof cur !== 'undefined') ? cur : null;
  INF.generate(ids, atleta);
  document.getElementById('inf-builder-modal')?.remove();
}

window.openInformeBuilder = openInformeBuilder;
window.generarInformeHTML = generarInformeHTML;

})();

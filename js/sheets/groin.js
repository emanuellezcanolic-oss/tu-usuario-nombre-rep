// sheets/groin.js — Doha, HAGOS
function buildDoha() {
  const c = document.getElementById('doha-entidades-sheet'); if(!c || c.innerHTML) return;
  c.innerHTML = DOHA_ENTS.map(e => `
    <div class="card mb-8" style="border-color:${e.color}44">
      <div class="card-header" style="cursor:pointer" onclick="toggleSheetSection('doha-${e.id}-body')">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:10px;height:10px;border-radius:50%;background:${e.color}"></div>
          <h3>${e.label}</h3>
        </div>
        <span style="font-size:12px;color:var(--text3)">▼</span>
      </div>
      <div id="doha-${e.id}-body" style="display:none">
        <div class="card-body">
          <div style="font-size:11px;color:var(--text2);margin-bottom:6px"><strong>Criterios:</strong> ${e.crit}</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:10px">Confiabilidad: ${e.kappa}</div>
          ${e.tests.map(t => `
            <div class="card mb-6" style="border-color:${e.color}33">
              <div class="card-body" style="padding:10px">
                <div style="font-size:12px;font-weight:600;margin-bottom:6px">${t}</div>
                <div class="grid-2" style="gap:6px">
                  <div><div class="il mb-4">D</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
                  <div><div class="il mb-4">I</div><div style="display:flex;gap:6px"><button class="ot-btn" onclick="toggleOT(this,'pos')">+ POS</button><button class="ot-btn" onclick="toggleOT(this,'neg')">– NEG</button></div></div>
                </div>
                <div class="grid-2" style="gap:6px;margin-top:6px">
                  <div class="ig"><label class="il">EVA D</label><input type="range" class="eva-slider" min="0" max="10" value="0" oninput="this.nextElementSibling.textContent=this.value"><span style="font-family:var(--mono);font-size:13px;text-align:center;display:block">0</span></div>
                  <div class="ig"><label class="il">EVA I</label><input type="range" class="eva-slider" min="0" max="10" value="0" oninput="this.nextElementSibling.textContent=this.value"><span style="font-family:var(--mono);font-size:13px;text-align:center;display:block">0</span></div>
                </div>
              </div>
            </div>
          `).join('')}
          <div class="ig"><label class="il">Clasificación</label>
            <select class="inp" style="font-size:12px" id="doha-class-${e.id}">
              <option value="">— No presente —</option>
              <option value="1">1° — Entidad primaria</option>
              <option value="2">2° — Entidad secundaria</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── HAGOS completo — Thorborg K et al. Br J Sports Med 2011;45(6):478-91 ─────────
// 37 ítems · 6 subescalas · cada opción = 4 - índice → score subescala 0–100
var HAGOS_SUBS = [
  {
    id:'S', label:'S — Síntomas', tag:'7 ítems',
    intro:'<em>Las siguientes preguntas refieren a los síntomas que notó en su cadera/ingle durante la <strong>última semana</strong>.</em>',
    items:[
      { id:'S1',  q:'¿Ha notado hinchazón en su cadera/ingle?',                                                           opts:['Nunca','Raramente','A veces','A menudo','Siempre'] },
      { id:'S2',  q:'¿Ha sentido crepitaciones, chasquidos u otros ruidos al mover su cadera/ingle?',                     opts:['Nunca','Raramente','A veces','A menudo','Siempre'] },
      { id:'S3',  q:'¿Su cadera/ingle se trabó o bloqueó al moverse?',                                                    opts:['Nunca','Raramente','A veces','A menudo','Siempre'] },
      { id:'S4',  q:'¿Puede estirar completamente su cadera/ingle?',                                                      opts:['Siempre','A menudo','A veces','Raramente','Nunca'] },
      { id:'S5',  q:'¿Puede doblar/flexionar completamente su cadera/ingle?',                                             opts:['Siempre','A menudo','A veces','Raramente','Nunca'] },
      { id:'S6',  q:'¿Cuánta rigidez nota en su cadera/ingle al levantarse a la mañana?',                                 opts:['Ninguna','Leve','Moderada','Severa','Extrema'] },
      { id:'S7',  q:'¿Cuánta rigidez nota en su cadera/ingle después de estar sentado, acostado o descansando?',          opts:['Ninguna','Leve','Moderada','Severa','Extrema'] }
    ]
  },
  {
    id:'P', label:'P — Dolor', tag:'10 ítems',
    intro:'<em>¿Cuánto dolor de cadera/ingle tuvo durante las <strong>últimas semanas</strong> al realizar las siguientes actividades?</em>',
    items:[
      { id:'P1',  q:'¿Con qué frecuencia experimenta dolor de cadera/ingle?',                                             opts:['Nunca','Mensualmente','Semanalmente','Diariamente','Constantemente'] },
      { id:'P2',  q:'Al girar / pivotar sobre la pierna afectada',                                                        opts:['Sin dolor','Leve','Moderado','Severo','Extremo'] },
      { id:'P3',  q:'Al estirar completamente la cadera y la rodilla',                                                    opts:['Sin dolor','Leve','Moderado','Severo','Extremo'] },
      { id:'P4',  q:'Al subir escaleras',                                                                                  opts:['Sin dolor','Leve','Moderado','Severo','Extremo'] },
      { id:'P5',  q:'Al estar de pie',                                                                                     opts:['Sin dolor','Leve','Moderado','Severo','Extremo'] },
      { id:'P6',  q:'Al caminar sobre terreno plano',                                                                     opts:['Sin dolor','Leve','Moderado','Severo','Extremo'] },
      { id:'P7',  q:'Al entrar o salir de un automóvil',                                                                  opts:['Sin dolor','Leve','Moderado','Severo','Extremo'] },
      { id:'P8',  q:'Al ponerse o quitarse los calcetines y el calzado',                                                  opts:['Sin dolor','Leve','Moderado','Severo','Extremo'] },
      { id:'P9',  q:'Al estar acostado en la cama (al girar, al mantener la posición)',                                   opts:['Sin dolor','Leve','Moderado','Severo','Extremo'] },
      { id:'P10', q:'Al estar sentado',                                                                                    opts:['Sin dolor','Leve','Moderado','Severo','Extremo'] }
    ]
  },
  {
    id:'A', label:'A — Función AVD', tag:'5 ítems',
    intro:'<em>¿Qué dificultad tuvo durante las <strong>últimas semanas</strong> para realizar las siguientes <strong>actividades de la vida diaria</strong>?</em>',
    items:[
      { id:'A1',  q:'Subir y bajar escaleras',                                                                             opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'A2',  q:'Ponerse en cuclillas',                                                                                opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'A3',  q:'Entrar o salir de un automóvil',                                                                     opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'A4',  q:'Caminar sobre terreno plano',                                                                        opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'A5',  q:'Ponerse y quitarse los calcetines y el calzado',                                                     opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] }
    ]
  },
  {
    id:'SP', label:'SP — Función Deportiva', tag:'8 ítems',
    intro:'<em>¿Qué dificultad tuvo durante las <strong>últimas semanas</strong> para realizar las siguientes <strong>actividades deportivas y recreativas</strong>?</em>',
    items:[
      { id:'SP1', q:'Ponerse en cuclillas',                                                                                opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'SP2', q:'Correr',                                                                                              opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'SP3', q:'Cortar / cambiar de dirección rápidamente',                                                          opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'SP4', q:'Saltar y aterrizar',                                                                                  opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'SP5', q:'Esprintar',                                                                                           opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'SP6', q:'Girar / pivotar sobre la pierna cargada',                                                            opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'SP7', q:'Practicar deporte',                                                                                   opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] },
      { id:'SP8', q:'Actividad sexual',                                                                                    opts:['Sin dificultad','Leve','Moderada','Grave','Imposible'] }
    ]
  },
  {
    id:'PA', label:'PA — Participación Física', tag:'2 ítems',
    intro:'<em>Respecto a la <strong>participación en actividad física</strong>:</em>',
    items:[
      { id:'PA1', q:'¿Cuánto tiempo puede practicar deporte o actividad física debido a su problema de cadera/ingle?',    opts:['Sin limitación','Pequeña limitación','Moderada limitación','Gran limitación','No puedo practicar'] },
      { id:'PA2', q:'¿Ha modificado su deporte o actividad física para evitar el dolor de cadera/ingle?',                 opts:['No','Ligeramente','Moderadamente','Enormemente','Completamente'] }
    ]
  },
  {
    id:'QOL', label:'QOL — Calidad de Vida', tag:'5 ítems',
    intro:'<em>Sobre la <strong>calidad de vida</strong> relacionada con su problema de cadera/ingle:</em>',
    items:[
      { id:'QOL1', q:'¿Con qué frecuencia es consciente de su problema de cadera/ingle?',                                 opts:['Nunca','Mensualmente','Semanalmente','Diariamente','Constantemente'] },
      { id:'QOL2', q:'¿Ha modificado su estilo de vida para evitar actividades potencialmente dañinas?',                  opts:['Nada','Ligeramente','Moderadamente','Enormemente','Totalmente'] },
      { id:'QOL3', q:'¿En qué medida le preocupa la falta de confianza en su cadera/ingle?',                             opts:['Nada','Leve','Moderadamente','Mucho','Extremadamente'] },
      { id:'QOL4', q:'En general, ¿cuánta dificultad tiene con su cadera/ingle?',                                        opts:['Ninguna','Leve','Moderada','Grave','Extrema'] },
      { id:'QOL5', q:'¿Ha cambiado su percepción corporal a causa de su problema de cadera/ingle?',                      opts:['Nada','Ligeramente','Moderadamente','Mucho','Completamente'] }
    ]
  }
];

function buildHAGOS() {
  var c = document.getElementById('hagos-sheet-fields');
  if (!c || c.innerHTML) return;

  // Inject style once
  if (!document.getElementById('hagos-style')) {
    var st = document.createElement('style');
    st.id = 'hagos-style';
    st.textContent = [
      'input[type=radio].hagos-r{display:none}',
      'input[type=radio].hagos-r:checked + .hagos-chip{background:var(--neon)!important;color:#000!important;border-color:var(--neon)!important;font-weight:700}',
      '.hagos-chip:hover{background:var(--verde08)!important;border-color:var(--neon)!important}'
    ].join('');
    document.head.appendChild(st);
  }

  c.innerHTML = HAGOS_SUBS.map(function(sub) {
    return '<div style="margin-bottom:20px">' +
      '<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:var(--verde08);border-radius:6px;margin-bottom:8px">' +
        '<span style="font-size:11px;font-weight:800;color:var(--neon);font-family:var(--mono)">' + sub.label + '</span>' +
        '<span style="font-size:9px;color:var(--text3)">' + sub.tag + '</span>' +
        '<span style="margin-left:auto;font-family:var(--mono);font-size:12px;font-weight:700;color:var(--text2)" id="hagos-score-' + sub.id + '">—</span>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--text3);margin-bottom:8px;padding:0 2px">' + sub.intro + '</div>' +
      sub.items.map(function(item) {
        return '<div style="padding:8px 0;border-bottom:1px solid var(--border)">' +
          '<div style="font-size:11px;color:var(--text);margin-bottom:6px"><strong>' + item.id + '.</strong> ' + item.q + '</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:4px">' +
          item.opts.map(function(opt, i) {
            return '<label style="cursor:pointer">' +
              '<input type="radio" class="hagos-r" name="hagos-' + item.id + '" value="' + (4 - i) + '" onchange="_calcHAGOS()">' +
              '<span class="hagos-chip" style="display:inline-block;padding:4px 9px;border-radius:4px;font-size:10px;border:1px solid var(--border);background:var(--bg3);transition:all .15s">' + opt + '</span>' +
            '</label>';
          }).join('') +
          '</div></div>';
      }).join('') +
    '</div>';
  }).join('') +
  '<div style="font-size:9px;color:var(--text3);margin-top:4px;padding-top:8px;border-top:1px solid var(--border)">' +
    'HAGOS — Hip And Groin Outcome Score · Thorborg K et al. Br J Sports Med 2011;45(6):478-91 · 37 ítems · 6 subescalas · 0 = máximos síntomas · 100 = sin síntomas' +
  '</div>';
}

function _calcHAGOS() {
  HAGOS_SUBS.forEach(function(sub) {
    var sum = 0, answered = 0;
    sub.items.forEach(function(item) {
      var el = document.querySelector('input[name="hagos-' + item.id + '"]:checked');
      if (el) { sum += parseInt(el.value); answered++; }
    });
    var scoreEl = document.getElementById('hagos-score-' + sub.id);
    if (!scoreEl) return;
    if (!answered) { scoreEl.textContent = '—'; scoreEl.style.color = 'var(--text2)'; return; }
    var score = Math.round((sum / (sub.items.length * 4)) * 100);
    scoreEl.textContent = score + '/100';
    scoreEl.style.color = score >= 75 ? 'var(--neon)' : score >= 50 ? 'var(--amber)' : 'var(--red)';
  });
}

function _getHAGOSScores() {
  return HAGOS_SUBS.map(function(sub) {
    var sum = 0, answered = 0;
    sub.items.forEach(function(item) {
      var el = document.querySelector('input[name="hagos-' + item.id + '"]:checked');
      if (el) { sum += parseInt(el.value); answered++; }
    });
    return answered > 0
      ? { id: sub.id, label: sub.label.replace(/^[A-Z]+ — /, ''), score: Math.round((sum / (sub.items.length * 4)) * 100) }
      : null;
  }).filter(Boolean);
}

window.buildHAGOS    = buildHAGOS;
window._calcHAGOS    = _calcHAGOS;
window._getHAGOSScores = _getHAGOSScores;


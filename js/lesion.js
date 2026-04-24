// ── GLOBALS (compartidos entre módulos) ──
// cur, atletas, kineState, etc. se definen en app.js
// Este archivo asume que app.js ya fue cargado

function setLesEstado(estado) {
  ['agudo','subagudo','cronico','readap'].forEach(e => {
    const btn = document.getElementById('les-est-' + e);
    if (btn) btn.classList.remove('yes');
  });
  const btn = document.getElementById('les-est-' + estado);
  if (btn) btn.classList.add('yes');
  if (!cur) return;
  if (!cur.lesionSeguimiento) cur.lesionSeguimiento = {};
  cur.lesionSeguimiento.estado = estado;
}

function updateRTSPercent() {
  const cbs = document.querySelectorAll('.les-rts-cb');
  const total = cbs.length;
  const checked = [...cbs].filter(c => c.checked).length;
  const pct = Math.round(checked / total * 100);
  const c = pct >= 80 ? 'var(--neon)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';
  const tag1 = document.getElementById('les-rts-pct');
  const tag2 = document.getElementById('les-rts-pct2');
  const bar  = document.getElementById('les-rts-bar');
  if (tag1) { tag1.textContent = pct + '%'; tag1.style.background = c + '22'; tag1.style.color = c; }
  if (tag2) tag2.textContent = checked + ' / ' + total;
  if (bar)  { bar.style.width = pct + '%'; bar.style.background = c; }
}

function updateLesDias() {
  const dias    = +document.getElementById('les-dias')?.value    || 0;
  const diasRTS = +document.getElementById('les-dias-rts')?.value || 0;
  const display = document.getElementById('les-timeline-display');
  const bar     = document.getElementById('les-prog-bar');
  const dot     = document.getElementById('les-prog-dot');
  const mid     = document.getElementById('les-dias-mid');
  const rtsLbl  = document.getElementById('les-rts-label');
  if (!display) return;
  if (dias > 0 || diasRTS > 0) {
    display.style.display = 'block';
    const maxDays = diasRTS || 90;
    const pct = diasRTS ? Math.min(100, (dias / diasRTS) * 100) : 0;
    const c = pct >= 80 ? 'var(--neon)' : pct >= 40 ? 'var(--amber)' : 'var(--red)';
    if (bar) bar.style.width = pct + '%';
    if (dot) { dot.style.left = 'calc(' + pct + '% - 8px)'; dot.style.background = c; dot.style.boxShadow = '0 0 10px ' + c; }
    if (mid) mid.textContent = 'Día ' + Math.round(maxDays / 2);
    if (rtsLbl) rtsLbl.textContent = 'RTS día ' + diasRTS;
  } else {
    display.style.display = 'none';
  }
}

function saveLesionSeguimiento() {
  if (!cur) return;
  const data = {
    tipo:      document.getElementById('les-tipo')?.value       || '',
    estructura:document.getElementById('les-estructura')?.value || '',
    etapa:     document.getElementById('les-etapa')?.value      || '',
    dias:      +document.getElementById('les-dias')?.value      || 0,
    diasRTS:   +document.getElementById('les-dias-rts')?.value  || 0,
    obs:       document.getElementById('les-obs')?.value        || '',
    rtsChecks: [...document.querySelectorAll('.les-rts-cb')].map(c => c.checked),
    fecha:     new Date().toISOString().split('T')[0]
  };
  // Preserve estado from state
  const estadoBtn = ['agudo','subagudo','cronico','readap'].find(e =>
    document.getElementById('les-est-' + e)?.classList.contains('yes')
  );
  data.estado = estadoBtn || '';
  if (!cur.lesionSeguimiento) cur.lesionSeguimiento = {};
  Object.assign(cur.lesionSeguimiento, data);
  // Update main lesion field
  if (data.tipo && data.estructura) cur.lesion = data.tipo + ' — ' + data.estructura;
}

function restoreLesionSeguimiento() {
  const d = cur?.lesionSeguimiento;
  if (!d) return;
  const fields = ['les-tipo','les-estructura','les-etapa','les-dias','les-dias-rts','les-obs'];
  const keys   = ['tipo','estructura','etapa','dias','diasRTS','obs'];
  fields.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && d[keys[i]] !== undefined) el.value = d[keys[i]];
  });
  if (d.estado) setLesEstado(d.estado);
  if (d.rtsChecks) {
    const cbs = [...document.querySelectorAll('.les-rts-cb')];
    d.rtsChecks.forEach((v, i) => { if (cbs[i]) cbs[i].checked = v; });
  }
  updateRTSPercent();
  updateLesDias();
}


// ══════════════════════════════════════════════════════
//  SHEETS CLÍNICOS — Hombro, Rodilla, Tobillo, LBP, Groin
// ══════════════════════════════════════════════════════

const HOMBRO_TESTS = [
  { id:'hawkins', name:'Hawkins-Kennedy', sub:'DESCARTAR RC (LR− 0.25) · Sn 0.83', tag:'tag-b' },
  { id:'neer',    name:'Neer impingement', sub:'Compresión subacromial · Sn 0.72', tag:'tag-b' },
  { id:'jobe',    name:'Empty Can (Jobe)', sub:'Supraespinoso · Sn 0.69', tag:'tag-r' },
  { id:'patte',   name:'Patte', sub:'Infraespinoso / Redondo menor · Sn 0.92', tag:'tag-r' },
  { id:'gerber',  name:'Gerber (Lift-off)', sub:'Subescapular · Sn 0.79', tag:'tag-r' },
  { id:'obrien',  name:"O'Brien (SLAP)", sub:'Labrum superior · Sn 0.47', tag:'tag-y' },
  { id:'apprehension', name:'Apprehension / Relocation', sub:'Inestabilidad GH anterior · Sn 0.72', tag:'tag-y' },
];

const CERVICAL_TESTS_RADICULAR = [
  { id:'spurling',       name:'Spurling',                    sub:'Radiculopatía cervical · Sn 0.50 / Sp 0.86 · LR+ 3.5',  tag:'tag-r',  ref:'Flexión lateral + extensión + compresión axial hacia lado sintomático' },
  { id:'distraccion-cx', name:'Distracción cervical',        sub:'Radiculopatía · Sn 0.44 / Sp 0.90 · complementa Spurling', tag:'tag-b', ref:'Tracción manual con paciente supino — alivio = compresión discal/facetaria' },
  { id:'ultt1',          name:'ULTT1 (mediano)',              sub:'Tensión N. mediano · Sn 0.97 / Sp 0.22 — alta Sn',       tag:'tag-b',  ref:'Depresión escápula + abd + RE + ext codo + sup + ext muñeca/dedos' },
  { id:'ultt2',          name:'ULTT2 (radial)',               sub:'Tensión N. radial · diferencia &gt;10° = positivo',       tag:'tag-b',  ref:'Depresión escápula + RI + flex codo + pro + flex muñeca/dedos' },
  { id:'ultt3',          name:'ULTT3 (cubital)',              sub:'Tensión N. cubital · parestesias 4°-5° dedo',            tag:'tag-b',  ref:'Depresión escápula + abd + RE + flex codo + ext muñeca — diferencia bilateral &gt;10° = positivo' },
  { id:'abd-alivio',     name:'Shoulder Abduction Relief',   sub:'Radiculopatía C5-C6 · Sn 0.43 / Sp 0.93',               tag:'tag-b',  ref:'Mano ipsilateral en la cabeza — alivio de síntomas = positivo' },
  { id:'jackson-cx',     name:'Jackson Compression',         sub:'Radiculopatía · LR+ 2.9 · similar a Spurling',           tag:'tag-y',  ref:'Rotación + extensión ipsilateral + compresión axial — dolor/parestesias = positivo' },
  { id:'valsalva-cx',    name:'Valsalva cervical',            sub:'Lesión ocupante / hernia discal · LR+ 2.3 intracraneal', tag:'tag-y',  ref:'Aumento presión intradiscal con esfuerzo — dolor/parestesias = positivo' },
];
const CERVICAL_TESTS_HEADACHE = [
  { id:'flexion-rot',    name:'Flexion-Rotation Test (CFRT)', sub:'Cefalea cervicogénica C1-C2 · Sn 0.91 / Sp 0.90',      tag:'tag-r',  ref:'Supino, flex. máx. cervical, rotar suavemente hasta tope — &lt;32° o asimetría &gt;10° = positivo' },
  { id:'ppivm-c0c3',    name:'PPIVM C0–C3',                  sub:'Movilidad intervertebral pasiva alta · cefalea',         tag:'tag-b',  ref:'PA y unilateral sobre C0-C3 — hipomóvil = segmento involucrado' },
  { id:'crfl-test',     name:'CRFL (Cervical Rotation Lat. Flex.)', sub:'Síndrome de 1° costilla / outlet torácico · Sn 0.77 / Sp 0.75', tag:'tag-y', ref:'Rotación contralateral + flexión lateral ipsilateral — restricción = 1° costilla elevada' },
];
const CERVICAL_TESTS_ESTABILIDAD = [
  { id:'sharp-purser',       name:'Sharp-Purser',            sub:'Inestabilidad C1-C2 · Sn 0.69 / Sp 0.96 — AR/trauma',  tag:'tag-r',  ref:'Cabeza en semiflexión, empuje posterior occipital — clic/alivio = inestabilidad transversa' },
  { id:'alar-lig',           name:'Alar Ligament Test',      sub:'Estabilidad alar · Sn 0.27 / Sp 0.64 — post-whiplash', tag:'tag-b',  ref:'Mov. lateral con cabeza fija — ausencia de movimiento acoplado = laxitud' },
  { id:'ant-shear-c12',      name:'Anterior Shear C1-C2',    sub:'Inestabilidad atlanto-axial · screening',               tag:'tag-y',  ref:'Paciente supino, fuerza anterior sobre C2 — síntomas = positivo (derivar)' },
  { id:'dvat-test',          name:'DVAT (Vertebral Artery)',  sub:'Insuficiencia vertebrobasilar · pre-manipulación screening', tag:'tag-r', ref:'Extensión + rotación sostenida 30 seg cada lado — vértigo/nistagmo/náuseas = CONTRAINDICACIÓN manipulación' },
];
const CERVICAL_TESTS_MIELOPATIA = [
  { id:'hoffmann',    name:'Signo de Hoffmann',      sub:'UMN / Mielopatía · Sn 0.58 / Sp 0.78',         tag:'tag-r', ref:'Flick del dedo medio — flexión refleja pulgar/índice = UMN positivo (derivar)' },
  { id:'inv-sup',     name:'Inverted Supinator Sign', sub:'Mielopatía C5-C6 · hiporeflexia nivel + hiperreflexia distal', tag:'tag-r', ref:'Percusión braquiorradial — flexión dedos en lugar de muñeca = signo de Babinski del miembro superior' },
  { id:'lhermitte',   name:'Signo de Lhermitte',     sub:'Compresión cordón posterior · Sn 0.27 / Sp 0.90', tag:'tag-r', ref:'Flexión pasiva cervical — descarga eléctrica hacia miembros = positivo (derivar urgente)' },
  { id:'finger-esc',  name:'Finger Escape Sign',     sub:'Debilidad intrínseca T1 · mielopatía avanzada',  tag:'tag-y', ref:'Dedos extendidos — 5° dedo abducido involuntariamente = debilidad intrínseca' },
  { id:'step-test',   name:'Tandem Gait / Step Test', sub:'Ataxia medular · coordinación mielopatía',       tag:'tag-y', ref:'Caminar en tándem 10 pasos — desequilibrio = compromiso cordón lateral (derivar)' },
];

const CERVICAL_ROM = [
  { id:'flex-cx',   label:'Flexión cervical',    ref:'60–80°',  mdc:'5–10°' },
  { id:'ext-cx',    label:'Extensión cervical',   ref:'50–70°',  mdc:'5–10°' },
  { id:'latd-cx',   label:'Inclinación lateral D', ref:'45°',    mdc:'5°' },
  { id:'lati-cx',   label:'Inclinación lateral I', ref:'45°',    mdc:'5°' },
  { id:'rotd-cx',   label:'Rotación D',           ref:'60–80°',  mdc:'5°' },
  { id:'roti-cx',   label:'Rotación I',           ref:'60–80°',  mdc:'5°' },
];

const CX_MYOTOMAS = [
  { nivel:'C4', mov:'Elevación escapular', id:'myo-c4' },
  { nivel:'C5', mov:'Abducción hombro (deltoides)', id:'myo-c5' },
  { nivel:'C6', mov:'Flexión codo / extensión muñeca', id:'myo-c6' },
  { nivel:'C7', mov:'Extensión codo / flexión muñeca', id:'myo-c7' },
  { nivel:'C8', mov:'Flexión dedos (FPD)', id:'myo-c8' },
  { nivel:'T1', mov:'Abducción dedo meñique', id:'myo-t1' },
];
const CX_REFLEJOS = [
  { nombre:'Bicipital', nivel:'C5-C6', id:'ref-bic' },
  { nombre:'Braquiorradial', nivel:'C6', id:'ref-bqr' },
  { nombre:'Tricipital', nivel:'C7', id:'ref-tri' },
];
const NDI_ITEMS = [
  'Intensidad de dolor','Cuidado personal (lavarse, vestirse)','Levantar objetos',
  'Lectura','Cefalea/dolor de cabeza','Concentración','Trabajo',
  'Manejo de auto','Dormir','Actividades recreativas'
];
const NDI_LABELS = [
  ['Sin dolor','Dolor leve ocasional','Dolor moderado frecuente','Dolor moderado constante','Dolor severo frecuente','Dolor severo constante'],
  ['Normal sin dolor','Normal con algo de dolor','Lento y cuidadoso','Con algo de ayuda','Necesita mucha ayuda','No puedo solo/a'],
  ['Sin problema','Objetos pesados sin dolor','Objetos pesados con dolor','Objetos moderados con dolor','Solo objetos ligeros','No puedo levantar nada'],
  ['Sin problema','Leo todo sin dolor','Leo todo con leve dolor','No puedo leer todo por dolor','Apenas puedo leer','No puedo leer en absoluto'],
  ['Sin cefalea','Cefalea leve infrecuente','Cefalea moderada infrecuente','Cefalea moderada frecuente','Cefalea severa frecuente','Cefalea constante'],
  ['Sin dificultad','Concentración plena con esfuerzo','Dificultad leve para concentrarme','Dificultad moderada para concentrarme','Mucha dificultad para concentrarme','No puedo concentrarme en absoluto'],
  ['Puedo trabajar normal','Solo mi trabajo habitual','Puedo hacer la mayoría','No puedo hacer todo mi trabajo','Solo trabajo muy poco','No puedo trabajar en absoluto'],
  ['Sin problema','Con algo de molestia','Con dolor moderado','Con dolor severo — debo parar','Apenas puedo manejar','No puedo manejar en absoluto'],
  ['Duermo sin problema','Leve perturbación del sueño','Moderada perturbación del sueño','Dolor me despierta menos de la mitad','Dolor me despierta más de la mitad','No puedo dormir por el dolor'],
  ['Sin restricción','Algo de dolor pero normal','Solo actividades leves sin dolor','Solo actividades leves con dolor','Casi no puedo hacer actividades','No hago actividades recreativas'],
];

const CODO_TESTS_LATERAL = [
  { id:'cozen',      name:'Cozen',                   sub:'Epicondilalgia lateral · Sn 0.84 / Sp 0.75', tag:'tag-r',  ref:'Extensión muñeca resistida con codo extendido' },
  { id:'mill',       name:'Mill (estiramiento)',      sub:'Extensores epicóndilo · Sn 0.53 / Sp 0.69',  tag:'tag-b',  ref:'Pronación + flexión muñeca + extensión codo' },
  { id:'maudsley',   name:'Maudsley (3° dedo)',       sub:'ECRB · Sn 0.52 — extensión resistida',       tag:'tag-b',  ref:'Extensión del dedo medio contra resistencia' },
  { id:'chair-test', name:'Chair lifting test',       sub:'Funcional LET · Lucado 2022',                tag:'tag-b',  ref:'Levantar silla con palma hacia abajo — dolor = positivo' },
];
const CODO_TESTS_MEDIAL = [
  { id:'golfer-elbow',  name:'Golfer elbow test',      sub:'Epicondilalgia medial · Sn 0.64 / Sp 0.69',  tag:'tag-y',  ref:'Flexión muñeca resistida + palpación epicóndilo medial' },
  { id:'valgus-codo',   name:'Estrés en valgo codo',   sub:'LCU (lig. cubital colateral) · lanzadores',   tag:'tag-y',  ref:'Valgus con codo en 20–30° flexión — apertura medial' },
  { id:'milking',       name:'Milking maneuver',        sub:'LCU · atletas overhead · Sn 0.76',            tag:'tag-y',  ref:'Tirón del pulgar en abducción con codo en flexión' },
];
const CODO_TESTS_NEURAL = [
  { id:'tinel-cubital',      name:'Tinel cubital tunnel',   sub:'N. cubital · parestesias 4–5 dedo',           tag:'tag-b',  ref:'Percusión sobre canal cubital — parestesias distales' },
  { id:'elbow-flex-test',    name:'Elbow flexion test',     sub:'N. cubital compresión · Sn 0.75 / Sp 0.99',   tag:'tag-b',  ref:'Flexión máx. codo + muñeca extendida 3 minutos' },
  { id:'lateral-pivot-codo', name:'Lateral pivot shift',    sub:'LUCL · inestabilidad lateral · Sp 1.0',       tag:'tag-r',  ref:'Resupinación en decúbito — clunk/aprensión = positivo' },
];
const ROM_HOMBRO = [
  { id:'flex', label:'Flexión', ref:'170–180°' },
  { id:'abd', label:'Abducción', ref:'170–180°' },
  { id:'ri', label:'RI', ref:'60–90°' },
  { id:'re', label:'RE', ref:'80–90°' },
  { id:'hadd', label:'Aducción Horiz.', ref:'30–40°' },
];
const FUERZA_HOMBRO = [
  { id:'ri-f', label:'RI', angulo:'0° neutro' },
  { id:'re-f', label:'RE', angulo:'0° neutro' },
  { id:'abd-f', label:'Abducción', angulo:'90°' },
  { id:'flex-f', label:'Flexión', angulo:'90°' },
];
const LCA_TESTS = [
  { id:'lachman', name:'Lachman', sub:'Gold standard LCA · Sn 0.86 / Sp 0.91', hasGrado:false },
  { id:'cajon-ant', name:'Cajón anterior', sub:'LCA · Sn 0.54', hasGrado:false },
  { id:'cajon-post', name:'Cajón posterior', sub:'LCP · Sn 0.90', hasGrado:false },
  { id:'pivot-shift', name:'Pivot Shift', sub:'LCA rotacional · Sp 0.98', hasGrado:true, opciones:['0 — Neg','I — Desliz.','II — Clunk','III — Clunk marcado'] },
  { id:'lelli', name:'Signo de palanca (Lelli)', sub:'Alta Sn aguda (Sn 1.0)', hasGrado:false },
];
const MENISCO_TESTS = [
  { id:'mcmurray', name:'McMurray', sub:'Menisco medial/lateral · Sn 0.70' },
  { id:'apley', name:'Apley', sub:'Menisco · Sn 0.61' },
  { id:'thessaly', name:'Thessaly (carga)', sub:'Menisco · Sn 0.89' },
];
const SPF_TESTS = [
  { id:'step-down', name:'Step-Down test', sub:'Control motor rodilla', hasValgo:true },
  { id:'sls', name:'Single Leg Squat (SLS)', sub:'Control motor · valgo dinámico', hasValgo:false },
];
const TOBILLO_LIG = [
  { id:'drawer-tob', name:'Anterior Drawer', sub:'ATFL · Sn 0.73 / Sp 0.60' },
  { id:'talar-tilt', name:'Talar Tilt', sub:'CFL · Sn 0.50 / Sp 0.88' },
  { id:'thompson', name:'Thompson', sub:'Tendón Aquiles · Sn 0.96' },
];
const ASES_ITEMS = [
  'Ponerse un abrigo','Dormir sobre el lado afectado','Lavarse la espalda',
  'Limpiarse tras la micción','Peinarse','Llegar a una balda alta',
  'Levantar 4.5kg por encima del hombro','Lanzar una pelota por encima',
  'Realizar su trabajo habitual','Realizar su deporte habitual'
];
const WORC_SECTIONS = [
  { d:'Síntomas físicos', items:['¿Cuánto dolor en su hombro?','¿Cuánta debilidad?','¿Inestabilidad?','¿Ruidos/clic?','¿Rigidez?','¿Pérdida de movimiento?'] },
  { d:'Deporte/Recreación', items:['¿Dif. actividades sobre la cabeza?','¿Dif. actividades de empuje?','¿Dif. lanzar/cargar objetos?','¿Dif. actividades recreativas?'] },
  { d:'Trabajo', items:['¿Dif. trabajar igual que antes?','¿Limitación en volumen de trabajo?','¿Dif. rendimiento laboral?','¿Afectó su trabajo?'] },
  { d:'Estilo de vida', items:['¿Afecta actividades con familia?','¿Dif. dormir?','¿Limita AVD?'] },
  { d:'Estado emocional', items:['¿Preocupa que empeore?','¿Desanimado?','¿Incertidumbre?','¿Miedo a lesionarse?'] },
];
const DASH_ITEMS = [
  'Abrir frasco apretado','Escribir','Girar una llave','Preparar una comida',
  'Empujar puerta pesada','Colocar algo en estante alto','Tareas del hogar pesadas',
  'Actividad en jardín','Tender la cama','Llevar bolsas de compras',
  'Cargar objeto pesado >5kg','Cambiar bombilla en el techo',
  'Lavarse/secarse el cabello','Lavarse la espalda','Ponerse un pullover',
  'Usar un cuchillo para comer','Actividades recreativas poco esfuerzo',
  'Actividades con algo de impacto','Moverse libremente con brazos/hombros',
  'Transporte (viajar, conducir)','Actividad sexual'
];
const VISAP_ITEMS = [
  { q:'¿Tiene dolor en el tendón patelar durante la mañana?', max:10 },
  { q:'¿Tiene dolor en el tendón patelar durante actividad?', max:10 },
  { q:'¿Puede hacer sentadillas completas?', max:10 },
  { q:'¿Tiene dolor al saltar?', max:10 },
  { q:'¿Puede realizar su deporte sin dolor?', max:10 },
  { q:'¿Puede saltar sin dolor?', max:10 },
  { q:'¿Puede hacer actividades de la vida diaria sin dolor?', max:10 },
  { q:'¿Puede hacer actividades deportivas sin restricción?', max:10 },
];
const VISAA_ITEMS = [
  { q:'¿Tiene dolor durante / después de levantarse por la mañana?', max:10 },
  { q:'¿Tiene dolor al hacer estiramiento del tendón de Aquiles?', max:10 },
  { q:'¿Tiene dolor al caminar en terreno llano?', max:10 },
  { q:'¿Tiene dolor al bajar escaleras a un ritmo normal?', max:10 },
  { q:'¿Tiene dolor al hacer un solo salto a máxima altura?', max:10 },
  { q:'¿Cuántas repeticiones de elevación de talón puede hacer sin dolor?', max:10 },
  { q:'¿Durante cuánto tiempo puede practicar su deporte?', max:10 },
  { q:'¿Puede practicar su deporte al nivel habitual?', max:10 },
];
const CAIT_ITEMS2 = [
  { q:'Tengo dolor en mi tobillo', ops:['Nunca (5)','Al deporte (4)','Al correr irr. (3)','Al correr plano (2)','Al caminar irr. (1)','Al caminar plano (0)'], vals:[5,4,3,2,1,0] },
  { q:'Siento inestabilidad en mi tobillo', ops:['Nunca (4)','A veces deporte (3)','Frecuente deporte (2)','A veces AVD (1)','Frecuente AVD (0)'], vals:[4,3,2,1,0] },
  { q:'En giros bruscos siento inestabilidad', ops:['Nunca (3)','A veces corriendo (2)','A menudo corriendo (1)','Al caminar (0)'], vals:[3,2,1,0] },
  { q:'Bajando escaleras siento inestabilidad', ops:['Nunca (3)','Si voy rápido (2)','Ocasionalmente (1)','Siempre (0)'], vals:[3,2,1,0] },
  { q:'Inestabilidad apoyado en una pierna', ops:['Nunca (2)','En punta de pie (1)','Pie plano (0)'], vals:[2,1,0] },
  { q:'Inestabilidad al saltar de lado', ops:['Nunca (3)','Saltos peq. lado (2)','Saltos peq. punto (1)','Cualquier salto (0)'], vals:[3,2,1,0] },
  { q:'Inestabilidad al correr terreno irregular', ops:['Nunca (4)','Correr irr. (3)','Trotar irr. (2)','Caminar irr. (1)','Caminar plano (0)'], vals:[4,3,2,1,0] },
  { q:'Cuando el tobillo comienza a torcerse puedo...', ops:['Detenerlo inmediatamente (3)','A menudo (2)','Algunas veces (1)','Nunca (0)'], vals:[3,2,1,0] },
  { q:'Después de torcerse, recupera en...', ops:['Inmediatamente (3)','Menos 1 día (2)','1-2 días (1)','Más 2 días (0)'], vals:[3,2,1,0] },
];
const FAAM_AVD_ITEMS = [
  'Estar de pie','Caminar en terreno llano','Caminar sin zapatos',
  'Caminar cuesta arriba','Caminar cuesta abajo','Subir escaleras','Bajar escaleras',
  'Caminar terreno irregular','Subir/bajar bordillos','Ponerse en cuclillas',
  'Ponerse de puntillas','Comenzar a andar','Andar 5 min o menos',
  'Caminar 10 min','Caminar 15 min o más','Tareas domésticas',
  'Actividades vida diaria','Cuidado personal','Trabajo liviano',
  'Trabajo moderado','Trabajo pesado'
];
const FAAM_DEP_ITEMS = [
  'Correr','Saltar','Aterrizar de saltos','Paradas y arranques rápidos',
  'Lateralidad y cambios de dirección','Actividades poco esfuerzo',
  'Actividades esfuerzo normal','Capacidad de actividad con normalidad'
];
const DOHA_ENTS = [
  { id:'aductor', label:'Aductor-relacionado', color:'var(--blue)', crit:'Palpación aductores + dolor en resistencia de aducción', kappa:'κ = 0.40–0.52',
    tests:['Palpación músculo aductor largo','Resistencia aducción (0°/45°/90°)','Squeeze test 0° y 45°'] },
  { id:'inguinal', label:'Inguinal-relacionado', color:'var(--teal)', crit:'Dolor canal inguinal + sensibilidad. Sin hernia palpable.', kappa:'κ = 0.44–0.52',
    tests:['Palpación canal inguinal','Dolor con contracción abdominal','Valsalva / tos'] },
  { id:'iliopsoas', label:'Iliopsoas-relacionado', color:'#A78BFA', crit:'Palpación iliopsoas + dolor en flexión resistida cadera.', kappa:'κ = 0.57–0.65 (mejor)',
    tests:['Palpación iliopsoas','Flexión resistida cadera','Estiramiento flexores'] },
  { id:'pubico', label:'Púbico-relacionado', color:'var(--amber)', crit:'Sensibilidad en sínfisis púbica y hueso adyacente.', kappa:'κ = 0.12 (baja)',
    tests:['Palpación sínfisis púbica','Palpación rama púbica'] },
  { id:'cadera', label:'Cadera-relacionado', color:'var(--red)', crit:'Sospecha cadera como fuente (ROM doloroso/limitado).', kappa:'κ = 0.62',
    tests:['FADIR (FAI/Labrum)','FABER (cápsula post.)','ROM pasivo cadera'] },
];
const STARTBACK_ITEMS = [
  'Mi dolor se ha extendido a la pierna/s en las últimas 2 semanas',
  'He tenido dolor en el hombro/cuello en las últimas 2 semanas',
  'Solo he caminado distancias cortas por mi dolor de espalda',
  'Me he vestido más despacio de lo habitual por el dolor',
  'No es seguro ser físicamente activo con esta condición',
  'Los pensamientos preocupantes han estado rondando mi mente',
  'Siento que mi espalda no mejorará pronto',
  'En general, no he disfrutado las cosas que solía disfrutar',
  '¿Cuánto se ha sentido molesto por su dolor de espalda?',
];
const SEBT_DIRS = ['Anterior','Posteromedial','Posterolateral'];

// State for clinical sheets
let worcVals = new Array(21).fill(0);
let asesVals = new Array(10).fill(null);
let dashVals = new Array(21).fill(null);
let visapVals = new Array(8).fill(null);
let visaaVals = new Array(8).fill(null);
let caitVals2 = new Array(9).fill(null);
let faamAvdVals = new Array(21).fill(null);
let faamDepVals = new Array(8).fill(null);
let startbackVals = new Array(9).fill(null);

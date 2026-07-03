// ═══════════════════════════════════════════════════════════════
// papers-rodilla-rules.js v5
// Base de evidencia: LCA · LCP · SPF · Menisco · Condral · SFBI/ITBS
// Fuentes principales:
//   Logerstedt DS et al. JOSPT 2018;48(2):A1-A50 (CPG Revision)
//   Logerstedt DS et al. JOSPT 2010;40(9):A1-A35 (Menisco CPG)
//   Mithoefer K et al. JOSPT 2012;42(3):254-273 (Condral)
//   Wilk KE et al. JOSPT 2006;36(10):815-827 (Condral)
//   Willy RW et al. JOSPT 2019;49(9):CPG1-CPG95 (SPF)
//   Logerstedt DS et al. Sports Med 2021 (Carga articular)
//   Sanchez-Alvarado A et al. Front Sports Act Living 2024;6:1386456 (ITBS SR)
//   Beals C & Flanigan D. J Sports Med 2013;367169 (ITBS tratamiento)
//   McKay J et al. BMC Sports Sci Med Rehab 2020 (ITBS rehabilitación corredoras)
// ═══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
// KOOS — Knee Injury and Osteoarthritis Outcome Score
// Roos EM et al. JOSPT 1998;28(2):88-96
// 42 ítems · 5 subescalas · Likert 0–4 · 0=peor/100=mejor
// Versión española: Izquierdo-Avino 2010
// MCID: 8–10 pts por subescala · JOSPT 2018 Grado A
// ══════════════════════════════════════════════════════

// Opciones Likert estándar KOOS (0–4)
const KOOS_OPTS_DOLOR     = [{v:0,t:'Ninguno'},{v:1,t:'Mínimo'},{v:2,t:'Moderado'},{v:3,t:'Severo'},{v:4,t:'Extremo'}];
const KOOS_OPTS_DIFICULTAD= [{v:0,t:'Sin dificultad'},{v:1,t:'Mínima'},{v:2,t:'Moderada'},{v:3,t:'Severa'},{v:4,t:'Imposible'}];
const KOOS_OPTS_FRECUENCIA= [{v:0,t:'Nunca'},{v:1,t:'Mensualmente'},{v:2,t:'Semanalmente'},{v:3,t:'A diario'},{v:4,t:'Constantemente'}];
const KOOS_OPTS_SINTOMA   = [{v:0,t:'Ninguna'},{v:1,t:'Leve'},{v:2,t:'Moderada'},{v:3,t:'Severa'},{v:4,t:'Extrema'}];
const KOOS_OPTS_SINTOMAFREQ=[{v:0,t:'Nunca'},{v:1,t:'Raramente'},{v:2,t:'A veces'},{v:3,t:'A menudo'},{v:4,t:'Siempre'}];
// S6/S7: invertido — Siempre=0 (sin problema), Nunca=4 (imposible)
const KOOS_OPTS_CAPACIDAD = [{v:0,t:'Completamente'},{v:1,t:'Mayoritariamente'},{v:2,t:'Parcialmente'},{v:3,t:'Mínimamente'},{v:4,t:'Para nada'}];
const KOOS_OPTS_MODIFICADO= [{v:0,t:'Para nada'},{v:1,t:'Levemente'},{v:2,t:'Moderadamente'},{v:3,t:'Mucho'},{v:4,t:'Totalmente'}];
const KOOS_OPTS_CONFIANZA = [{v:0,t:'Para nada'},{v:1,t:'Levemente'},{v:2,t:'Moderadamente'},{v:3,t:'Mucho'},{v:4,t:'Extremadamente'}];

const KOOS_SECTIONS = [
  {
    id: 'dolor', label: 'Subescala DOLOR', instruccion: 'Indique el nivel de DOLOR experimentado en su rodilla en la ÚLTIMA SEMANA en las siguientes actividades:',
    items: [
      { id:'P1', q:'¿Con qué frecuencia padece dolor de rodilla?', opts: KOOS_OPTS_FRECUENCIA },
      { id:'P2', q:'Al girar/rotar sobre su rodilla', opts: KOOS_OPTS_DOLOR },
      { id:'P3', q:'Al extender totalmente la rodilla', opts: KOOS_OPTS_DOLOR },
      { id:'P4', q:'Al doblar totalmente la rodilla', opts: KOOS_OPTS_DOLOR },
      { id:'P5', q:'Al caminar sobre una superficie plana', opts: KOOS_OPTS_DOLOR },
      { id:'P6', q:'Al subir o bajar escaleras', opts: KOOS_OPTS_DOLOR },
      { id:'P7', q:'Por la noche estando en cama', opts: KOOS_OPTS_DOLOR },
      { id:'P8', q:'Estando sentado o tumbado', opts: KOOS_OPTS_DOLOR },
      { id:'P9', q:'Estando de pie', opts: KOOS_OPTS_DOLOR },
    ],
    maxPts: 36,
  },
  {
    id: 'sintomas', label: 'Subescala SÍNTOMAS', instruccion: 'Experiencia en la ÚLTIMA SEMANA:',
    items: [
      { id:'S1', q:'¿Cuánta rigidez de rodilla tiene al despertarse por la mañana?', opts: KOOS_OPTS_SINTOMA },
      { id:'S2', q:'¿Cuánta rigidez tiene después de estar sentado, tumbado o en reposo el resto del día?', opts: KOOS_OPTS_SINTOMA },
      { id:'S3', q:'¿Le hincha la rodilla?', opts: KOOS_OPTS_SINTOMAFREQ },
      { id:'S4', q:'¿Siente crujidos u oye cualquier otro sonido al moverse?', opts: KOOS_OPTS_SINTOMAFREQ },
      { id:'S5', q:'¿Nota que la rodilla se engancha o le falla al moverse?', opts: KOOS_OPTS_SINTOMAFREQ },
      { id:'S6', q:'¿Puede extender totalmente la rodilla?', opts: KOOS_OPTS_CAPACIDAD },
      { id:'S7', q:'¿Puede doblar totalmente la rodilla?', opts: KOOS_OPTS_CAPACIDAD },
    ],
    maxPts: 28,
  },
  {
    id: 'avd', label: 'Subescala ACTIVIDADES DE LA VIDA DIARIA (AVD)', instruccion: '¿Cuánta DIFICULTAD ha tenido en la ÚLTIMA SEMANA para realizar las siguientes actividades diarias?',
    items: [
      { id:'A1',  q:'Bajar escaleras', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A2',  q:'Subir escaleras', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A3',  q:'Levantarse de una silla', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A4',  q:'Estar de pie', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A5',  q:'Agacharse al suelo / recoger un objeto', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A6',  q:'Caminar sobre una superficie plana', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A7',  q:'Entrar o salir del coche', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A8',  q:'Ir de compras', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A9',  q:'Ponerse los calcetines o medias', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A10', q:'Levantarse de la cama', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A11', q:'Quitarse los calcetines o medias', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A12', q:'Estar tumbado en la cama (girar, mantener posición de rodilla)', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A13', q:'Entrar o salir de la bañera', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A14', q:'Estar sentado', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A15', q:'Sentarse o levantarse del inodoro', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A16', q:'Tareas domésticas pesadas (mover cajas pesadas, fregar, etc.)', opts: KOOS_OPTS_DIFICULTAD },
      { id:'A17', q:'Tareas domésticas ligeras (cocinar, quitar el polvo, etc.)', opts: KOOS_OPTS_DIFICULTAD },
    ],
    maxPts: 68,
  },
  {
    id: 'deporte', label: 'Subescala DEPORTE Y RECREACIÓN', instruccion: '¿Cuánta DIFICULTAD ha tenido en la ÚLTIMA SEMANA para realizar las siguientes actividades deportivas/recreativas?',
    items: [
      { id:'SP1', q:'Ponerse en cuclillas (sentadilla profunda)', opts: KOOS_OPTS_DIFICULTAD },
      { id:'SP2', q:'Correr', opts: KOOS_OPTS_DIFICULTAD },
      { id:'SP3', q:'Saltar', opts: KOOS_OPTS_DIFICULTAD },
      { id:'SP4', q:'Girar / rotar sobre la rodilla lesionada', opts: KOOS_OPTS_DIFICULTAD },
      { id:'SP5', q:'Arrodillarse', opts: KOOS_OPTS_DIFICULTAD },
    ],
    maxPts: 20,
  },
  {
    id: 'qol', label: 'Subescala CALIDAD DE VIDA', instruccion: 'Responda las siguientes preguntas sobre su rodilla:',
    items: [
      { id:'Q1', q:'¿Con qué frecuencia es consciente de su problema de rodilla?', opts: KOOS_OPTS_FRECUENCIA },
      { id:'Q2', q:'¿Ha modificado su estilo de vida para evitar actividades potencialmente dañinas para su rodilla?', opts: KOOS_OPTS_MODIFICADO },
      { id:'Q3', q:'¿En qué medida le preocupa no tener confianza en su rodilla?', opts: KOOS_OPTS_CONFIANZA },
      { id:'Q4', q:'En general, ¿cuánta dificultad tiene con su rodilla?', opts: KOOS_OPTS_DOLOR },
    ],
    maxPts: 16,
  },
];

// Información de subescalas KOOS
const KOOS_SUBSCALAS = [
  { id:'dolor',   label:'Dolor (Pain)',              items:9,  mcid:10, desc:'Dolor en 9 actividades',           maxPts:36 },
  { id:'sintomas',label:'Síntomas',                  items:7,  mcid:10, desc:'Rigidez, hinchazón, ruidos, ROM',  maxPts:28 },
  { id:'avd',     label:'Actividades diarias (AVD)', items:17, mcid:10, desc:'17 actividades cotidianas',         maxPts:68 },
  { id:'deporte', label:'Deporte / Recreación',      items:5,  mcid:12, desc:'5 actividades deportivas',          maxPts:20 },
  { id:'qol',     label:'Calidad de vida (QoL)',      items:4,  mcid:8,  desc:'4 ítems calidad de vida',          maxPts:16 },
];

// ══════════════════════════════════════════════════════
// WOMET — Western Ontario Meniscal Evaluation Tool
// Kirkley A et al. AJSM 2007;35(8):1375-1381
// 16 ítems VAS 0–100 · MCID: 11.1 pts · JOSPT 2018 Grado A
// Específico para patología meniscal
// ══════════════════════════════════════════════════════
const WOMET_SECTIONS = [
  {
    id: 'sintomas_fis', label: 'Síntomas físicos', instruccion: 'Las siguientes preguntas se refieren a síntomas físicos de su rodilla. Marque en la escala (0=sin problema / 100=problema máximo):',
    items: [
      { id:'W1',  q:'Dolor en rodilla al realizar actividad repetitiva de carga (p.ej. bajar escaleras, caminar cuesta abajo)' },
      { id:'W2',  q:'Dolor en rodilla al llegar al límite de amplitud de movimiento' },
      { id:'W3',  q:'Dolor en rodilla en reposo' },
      { id:'W4',  q:'Dolor en rodilla por la noche' },
      { id:'W5',  q:'Hinchazón (inflamación) de la rodilla' },
      { id:'W6',  q:'Rigidez de la rodilla' },
      { id:'W7',  q:'Enganchón o bloqueo momentáneo de la rodilla al moverse' },
      { id:'W8',  q:'Sensación de fallo o cedimiento de la rodilla' },
      { id:'W9',  q:'Debilidad o falta de fuerza en la rodilla' },
    ],
  },
  {
    id: 'deporte_trab', label: 'Deporte y trabajo', instruccion: 'Las siguientes preguntas se refieren a la actividad deportiva y laboral: (0=sin problema / 100=problema máximo)',
    items: [
      { id:'W10', q:'Capacidad para participar en actividades deportivas extenuantes y/o trabajos físicamente exigentes' },
      { id:'W11', q:'Capacidad para participar en actividades deportivas o recreativas de intensidad moderada' },
      { id:'W12', q:'Capacidad para realizar las actividades diarias habituales (tareas domésticas, trabajo ligero)' },
      { id:'W13', q:'Actividad específica más importante para usted (especificar en observaciones)' },
    ],
  },
  {
    id: 'estilo_vida', label: 'Estilo de vida', instruccion: 'Las siguientes preguntas se refieren al impacto en su vida diaria: (0=sin problema / 100=problema máximo)',
    items: [
      { id:'W14', q:'Efecto del problema de rodilla en sus relaciones personales (familia, pareja, amigos)' },
      { id:'W15', q:'Efecto del problema de rodilla en su vida social (salidas, eventos, actividades recreativas)' },
      { id:'W16', q:'Efecto del problema de rodilla en su bienestar psicológico (humor, motivación, autoconfianza)' },
    ],
  },
];

// ══════════════════════════════════════════════════════
// VISA-P — Victorian Institute of Sport Assessment (Patella)
// Visentini PJ et al. J Sci Med Sport 1998;1(1):22-28
// Versión española: Hernandez-Sanchez S et al. JOSPT 2011;41(8):581-591
// 8 ítems · 0–10 por ítem · suma ×1.25 = 0–100
// <80 = sintomático · MCID: 13 pts
// ══════════════════════════════════════════════════════
const VISAP_P_ITEMS = [
  { q: '¿Cuánto dolor tenés en el tendón rotuliano al despertar por la mañana? (0=muy severo · 10=ninguno)' },
  { q: 'Durante o después del entrenamiento, ¿cuánto dolor tenés en el tendón rotuliano? (0=muy severo · 10=ninguno)' },
  { q: 'Al bajar escaleras con paso normal, ¿cuánto dolor sentís? (0=muy severo · 10=ninguno)' },
  { q: 'Al saltar o aterrizar de un salto, ¿cuánto dolor sentís? (0=muy severo · 10=ninguno)' },
  { q: '¿Podés hacer sentadillas monopodales en plano inclinado sin dolor? (0=imposible · 10=sin problema)' },
  { q: '¿Podés entrenar a tu nivel habitual? (0=imposible · 10=sin restricción)' },
  { q: '¿Podés practicar tu deporte sin modificar el rendimiento? (0=imposible · 10=sin limitación)' },
  { q: '¿Por cuánto tiempo podés practicar sin dolor? (0=sin actividad · 10=sin límite de tiempo)' },
];

// ═══════════════════════════════════════════════════════════════
// ACL-RSI — Anterior Cruciate Ligament Return to Sport after Injury Scale
// Webster KE & Feller JA. Br J Sports Med. 2016;50(2):66-67
// Validación española: Baez SE et al. J Orthop Sports Phys Ther. 2018;48(2):95-101
// 12 ítems · 0–100 por ítem (0=nada · 100=completamente)
// Score final = media de ítems ajustados (negativos invertidos) → 0–100
// Cutoff: >56 = preparado psicológicamente para RTS · MCID ≈ 10 pts
// 3 dominios: Emociones · Confianza en rendimiento · Percepción de riesgo
// ═══════════════════════════════════════════════════════════════
const ACL_RSI_ITEMS = [
  { q:'Me siento confiado/a en que puedo rendir al mismo nivel deportivo que antes de la lesión.', reversed:false, dominio:'confianza' },
  { q:'Siento nerviosismo ante la idea de volver a practicar mi deporte.', reversed:true, dominio:'emociones' },
  { q:'Tengo confianza en mi rodilla operada.', reversed:false, dominio:'confianza' },
  { q:'Siento dudas o vacilación ante la idea de volver al deporte.', reversed:true, dominio:'emociones' },
  { q:'Tengo miedo de aterrizar sobre la rodilla y volver a lesionarme.', reversed:true, dominio:'riesgo' },
  { q:'Me siento seguro/a de mi capacidad para rendir bien en el deporte después de la lesión/cirugía.', reversed:false, dominio:'confianza' },
  { q:'Pienso que practicar deporte representa un riesgo para mi rodilla.', reversed:true, dominio:'riesgo' },
  { q:'Tengo miedo de volver a lesionarme la rodilla practicando deporte.', reversed:true, dominio:'riesgo' },
  { q:'Siento confianza en poder manejar las exigencias físicas de mi deporte.', reversed:false, dominio:'confianza' },
  { q:'Me siento frustrado/a porque debo tener cuidado al usar la rodilla durante el deporte.', reversed:true, dominio:'emociones' },
  { q:'Me siento listo/a para volver a competir.', reversed:false, dominio:'confianza' },
  { q:'Me siento tranquilo/a ante la perspectiva de volver al deporte.', reversed:false, dominio:'emociones' },
];

// ═══════════════════════════════════════════════════════════════
// TESTS LCA / LCP
// Fuentes: Benjaminse A AJSM 2006 · Solomon DH JAMA 2001
//          Rubinstein RA AJSM 1994 · Lelli A KSSTA 2014
// ═══════════════════════════════════════════════════════════════
const RODILLA_LCA_TESTS = [
  {
    id: 'lachman',
    nombre: 'Lachman',
    lesion: 'LCA',
    gold: true,
    protocolo: 'Rodilla 20–30° flexión. Fija fémur con una mano, desplazá tibia anteriormente con la otra. Positivo: traslación anterior aumentada o fin de arco blando.',
    sn: '0.85',
    sp: '0.94',
    lr_pos: '10.2',
    lr_neg: '0.16',
    ref: 'Benjaminse A et al. AJSM 2006. Solomon DH et al. JAMA 2001.',
    peso: 3,
    interpreta(val) {
      if (val === true)  return 'LR+ 10.2 → alta probabilidad post-test LCA. Confirmar con RMN.';
      if (val === false) return 'LR– 0.16 → probabilidad post-test muy baja. Alta especificidad.';
      return '—';
    },
  },
  {
    id: 'cajon_ant',
    nombre: 'Cajón anterior',
    lesion: 'LCA',
    gold: false,
    protocolo: 'Rodilla 90° flexión, pie apoyado. Tibia con ambas manos, traccionar anteriormente. Positivo: desplazamiento >5 mm o asimetría.',
    sn: '0.54',
    sp: '0.83',
    lr_pos: '3.2',
    lr_neg: '0.55',
    ref: 'Solomon DH et al. JAMA 2001. Benjaminse A. AJSM 2006.',
    peso: 1,
    interpreta(val) {
      if (val === true)  return 'LR+ 3.2 → probabilidad moderada. Complementar con Lachman.';
      if (val === false) return 'Sn baja (0.54): negativo no descarta LCA.';
      return '—';
    },
  },
  {
    id: 'pivot_shift',
    nombre: 'Pivot Shift',
    lesion: 'LCA',
    gold: false,
    protocolo: 'Valgo + rotación interna + extensión progresiva. Positivo (clunk o reasentamiento a ~30°) indica inestabilidad rotacional.',
    sn: '0.35',
    sp: '0.98',
    lr_pos: '17.5',
    lr_neg: '0.66',
    ref: 'Benjaminse A et al. AJSM 2006.',
    peso: 3,
    interpreta(val) {
      if (val === true)  return 'LR+ 17.5 → MUY alta probabilidad inestabilidad rotacional LCA.';
      if (val === false) return 'Sn baja (0.35): negativo no descarta. Test bajo anestesia aumenta Sn.';
      return '—';
    },
  },
  {
    id: 'lelli',
    nombre: 'Lever Sign (Lelli)',
    lesion: 'LCA',
    gold: false,
    protocolo: 'Paciente supino, rodilla extendida. Puño bajo tercio medio fémur. LCA íntegro: talón levanta. Positivo: talón permanece en camilla.',
    sn: '1.00',
    sp: '1.00',
    lr_pos: null,
    lr_neg: null,
    ref: 'Lelli A et al. Knee Surg Sports Traumatol Arthrosc 2014.',
    nota: 'Sn/Sp del estudio original (n=400 cirugía). Estudios posteriores: Sn 0.38–1.00 / Sp 0.48–0.99. No usar como único test.',
    peso: 1,
    interpreta(val) {
      if (val === true)  return 'Lelli positivo. Resultado variable en literatura — confirmar con Lachman.';
      if (val === false) return 'Lelli negativo. Alta Sp en estudio original pero datos contradictorios.';
      return '—';
    },
  },
  {
    id: 'cajon_post',
    nombre: 'Cajón posterior',
    lesion: 'LCP',
    gold: false,
    protocolo: 'Rodilla 90° flexión. Empuje posterior sobre tibia. Positivo: step-off disminuido o traslación posterior aumentada.',
    sn: '0.90',
    sp: '0.99',
    lr_pos: '90',
    lr_neg: '0.10',
    ref: 'Rubinstein RA et al. AJSM 1994.',
    peso: 2,
    interpreta(val) {
      if (val === true)  return 'LR+ ~90 → probabilidad post-test LCP muy alta. Derivar urgente.';
      if (val === false) return 'LR– 0.10 → probabilidad post-test LCP muy baja.';
      return '—';
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// TESTS SPF / PFP
// Fuente: Willy RW et al. JOSPT 2019;49(9):CPG1-CPG95
//         Cook C et al. Physiotherapy 2012
// ═══════════════════════════════════════════════════════════════
const RODILLA_SPF_TESTS = [
  {
    id: 'dolor_cuclillas',
    nombre: 'Dolor con cuclillas',
    protocolo: 'Sentadilla profunda bilateral. Positivo: dolor retropatelar o peripatelar reproducible. Criterio diagnóstico de mayor peso (Grado A).',
    sn: '0.91',
    sp: '0.50',
    lr_pos: '1.82',
    lr_neg: '0.18',
    ref: 'Cook C et al. Physiotherapy 2012. Willy RW et al. JOSPT 2019 (CPG Grado A).',
    criterio_diag: true,
    interpreta(val) {
      if (val === true)  return 'Test de mayor Sn (0.91). Positivo → probabilidad SPF alta. Criterio diagnóstico principal.';
      if (val === false) return 'LR– 0.18 → negativo reduce probabilidad. Alta sensibilidad.';
      return '—';
    },
  },
  {
    id: 'clarke',
    nombre: 'Clarke (compresión patelar)',
    protocolo: 'Cuádriceps relajado. Comprimir rótula hacia distal mientras paciente contrae cuádriceps. Positivo: dolor reproducido.',
    sn: '0.49',
    sp: '0.67',
    lr_pos: '1.48',
    lr_neg: '0.76',
    ref: 'Cook C et al. PM&R 2010. Doberstein ST. J Athl Train 2008.',
    interpreta(val) {
      if (val === true)  return 'Sn/Sp modestas. Resultado positivo contribuye poco de forma aislada.';
      if (val === false) return 'Sn baja: negativo no descarta SPF.';
      return '—';
    },
  },
  {
    id: 'tilt_patelar',
    nombre: 'Inclinación patelar (Tilt)',
    protocolo: 'Rodilla extendida relajada. Elevar borde lateral de la rótula. Normal: borde lateral ≥0° horizontal. Positivo: no alcanza horizontal.',
    sn: '0.43',
    sp: '0.92',
    lr_pos: '5.38',
    lr_neg: '0.62',
    ref: 'Nijs J et al. Clin Rheumatol 2006. Willy RW et al. JOSPT 2019 (CPG Grado C).',
    interpreta(val) {
      if (val === true)  return 'Alta Sp (0.92): positivo confirma disfunción patelar lateral. LR+ 5.38.';
      if (val === false) return 'Sn baja (0.43): negativo no descarta SPF (Grado C evidencia).';
      return '—';
    },
  },
  {
    id: 'aprension_patelar',
    nombre: 'Aprensión patelar',
    protocolo: 'Desplazar rótula lateralmente con rodilla extendida. Positivo: sensación de inestabilidad o aprensión del paciente (no solo dolor).',
    sn: '0.39',
    sp: '0.93',
    lr_pos: '5.57',
    lr_neg: '0.65',
    ref: 'Cook C et al. PM&R 2010. Malanga GA. Arch Phys Med Rehabil 2003.',
    interpreta(val) {
      if (val === true)  return 'Alta Sp: positivo sugiere inestabilidad patelar / riesgo luxación. LR+ 5.57.';
      if (val === false) return 'Baja Sn: negativo no descarta inestabilidad.';
      return '—';
    },
  },
  {
    id: 'dolor_escaleras',
    nombre: 'Dolor escaleras / sedestación prolongada',
    protocolo: 'Preguntar o provocar dolor en: subir/bajar escaleras, correr, pedalear, permanecer sentado >30 min. Positivo: reproducción del dolor típico.',
    sn: '0.80',
    sp: '0.56',
    lr_pos: '1.82',
    lr_neg: '0.36',
    ref: 'Willy RW et al. JOSPT 2019 CPG — Grado A para diagnóstico SPF.',
    criterio_diag: true,
    interpreta(val) {
      if (val === true)  return 'Grado A: criterio diagnóstico. Positivo en actividades de carga confirma SPF.';
      if (val === false) return 'Negativo reduce probabilidad diagnóstica (LR– 0.36).';
      return '—';
    },
  },
  {
    id: 'palp_peripatelar',
    nombre: 'Palpación peripatelar',
    protocolo: 'Palpar bordes medial, lateral, polo inferior y tendón patelar. Positivo: dolor reproducible en zona peripatelar.',
    sn: '0.52',
    sp: '0.80',
    lr_pos: '2.60',
    lr_neg: '0.60',
    ref: 'Cook C et al. PM&R 2010.',
    interpreta(val) {
      if (val === true)  return 'Sp 0.80: positivo confirma zona dolorosa patelofemoral. LR+ 2.60.';
      if (val === false) return 'Sn 0.52: resultado negativo no descarta.';
      return '—';
    },
  },

  // ── Nuevos tests — Willy RW et al. JOSPT 2019 CPG ──────────────
  {
    id: 'dolor_arrodillarse',
    nombre: 'Dolor al arrodillarse',
    protocolo: 'Paciente se arrodilla sobre ambas rodillas sobre superficie firme. Positivo: reproducción de dolor anterior o peripatelar de rodilla. Criterio diagnóstico de inclusión (Grado B).',
    sn: '0.84',
    sp: '0.50',
    lr_pos: '1.7',
    lr_neg: '0.3',
    ref: 'Willy RW et al. JOSPT 2019;49(9):CPG1-CPG95 — Nivel evidencia I. Criterio diagnóstico Grado B.',
    criterio_diag: true,
    interpreta(val) {
      if (val === true)  return 'Sn 0.84: alta sensibilidad. Positivo confirma dolor PFJ por carga directa sobre rótula. LR+ 1.7. Criterio diagnóstico.';
      if (val === false) return 'LR– 0.3: negativo reduce sospecha. Sn 0.84 → su ausencia tiene peso diagnóstico.';
      return '—';
    },
  },
  {
    id: 'eccentric_step_down',
    nombre: 'Eccentric Step-Down (Descenso excéntrico)',
    protocolo: 'De pie sobre escalón (~20 cm). Descender el pie contralateral excéntricamente hasta casi tocar el suelo, sin perder control. Positivo: dolor anterior de rodilla reproducible durante el descenso.',
    sn: '0.42',
    sp: '0.82',
    lr_pos: '2.3',
    lr_neg: '0.7',
    ref: 'Willy RW et al. JOSPT 2019 CPG — Nivel I. Sp 0.82 mayor que sentadilla bilateral.',
    interpreta(val) {
      if (val === true)  return 'Sp 0.82: positivo confirma dolor PFJ en carga excéntrica. LR+ 2.3. Útil para confirmar.';
      if (val === false) return 'Sn 0.42: negativo no descarta SPF. Complementar con otros tests de mayor Sn.';
      return '—';
    },
  },
  {
    id: 'waldron',
    nombre: 'Waldron Test',
    protocolo: 'Supino, rodilla extendida. El evaluador aplica compresión directa sobre la rótula mientras lleva la rodilla a flexión pasiva de 0° a 130°. Positivo: dolor y/o crepitación reproducible en algún arco del movimiento.',
    sn: '0.45',
    sp: '0.68',
    lr_pos: '1.4',
    lr_neg: '0.8',
    ref: 'Willy RW et al. JOSPT 2019 CPG. Cook C et al. PM&R 2010.',
    interpreta(val) {
      if (val === true)  return 'LR+ 1.4: positivo contribuye moderadamente. Útil combinado con otros tests.';
      if (val === false) return 'Sn/Sp moderadas. Resultado negativo no es determinante de forma aislada.';
      return '—';
    },
  },
  {
    id: 'patella_alta',
    nombre: 'Evaluación Rótula Alta (Patella Alta)',
    protocolo: 'Inspección visual + medición: índice Insall-Salvati (TL/PL >1.2) o Caton-Deschamps por imagen. Clínico: rótula palpablemente elevada en extensión, "ojos de rana" a 30° flexión. Positivo: rótula anormalmente alta.',
    sn: '0.49',
    sp: '0.72',
    lr_pos: '1.75',
    lr_neg: '0.71',
    ref: 'Willy RW et al. JOSPT 2019 CPG. Lankhorst NE et al. BJSM 2012 (Insall-Salvati MD 0.04 en SPF).',
    interpreta(val) {
      if (val === true)  return 'Positivo: rótula alta → menor área de contacto PFJ a baja flexión → mayor estrés cartilaginoso. LR+ 1.75.';
      if (val === false) return 'No descarta SPF. Confirmar con hallazgos clínicos y funcionales.';
      return '—';
    },
  },
  {
    id: 'lateral_pull',
    nombre: 'Lateral Pull Test',
    protocolo: 'Rodilla en extensión. Deslizar la rótula lateralmente observando la facilidad de desplazamiento. Positivo: desplazamiento lateral >75% del ancho patelar o signo telescopio (rótula "salta" lateralmente sin resistencia muscular).',
    sn: '0.25',
    sp: '1.00',
    lr_pos: '∞',
    lr_neg: '0.80',
    ref: 'Willy RW et al. JOSPT 2019 CPG — Sp 1.00. ICC intratester k=0.39–0.47.',
    nota: 'Sp 1.00: positivo CONFIRMA hipermobilidad patelar lateral. Sn 0.25: muy baja, falsos negativos frecuentes.',
    interpreta(val) {
      if (val === true)  return 'Sp 1.00: positivo CONFIRMA hipermobilidad lateral patelar / riesgo de inestabilidad. LR+ incalculable (muy alto).';
      if (val === false) return 'Sn 0.25 muy baja: negativo NO descarta SPF. Solo el 25% de casos reales son detectados.';
      return '—';
    },
  },
  {
    id: 'deslizamiento_patelar_ml',
    nombre: 'Deslizamiento Patelar Medial/Lateral',
    protocolo: 'Rodilla en extensión, cuádriceps relajado. Desplazar rótula pasivamente en sentido medial y lateral. Registrar: dolor, hipomobilidad (retináculo retraído) o hipermobilidad (laxitud). Normal: deslizamiento 2-3 cuadrantes en cada dirección.',
    sn: '0.54',
    sp: '0.69',
    lr_pos: '1.8',
    lr_neg: '0.7',
    ref: 'Willy RW et al. JOSPT 2019 CPG — ICC intertester k=0.59. Nivel III.',
    interpreta(val) {
      if (val === true)  return 'LR+ 1.8: positivo apoya restricción/exceso de movilidad patelar. Orienta hacia terapia manual o taping.';
      if (val === false) return 'Sn/Sp moderadas. Interpretar en contexto clínico completo.';
      return '—';
    },
  },
  {
    id: 'vmo_coordination',
    nombre: 'Test de Coordinación VMO',
    protocolo: 'Evaluar activación relativa VMO vs VL durante extensión activa de rodilla (palpación bimanual o EMG). Positivo: activación retrasada o inhibición evidente del VMO respecto al VL, o fallo en contracción inicial del VMO.',
    sn: '0.16',
    sp: '0.93',
    lr_pos: '2.26',
    lr_neg: '0.90',
    ref: 'Willy RW et al. JOSPT 2019 CPG — Nivel II. LR+ 2.26 (IC 1.9–2.9). Cowan SH et al. PTJ 2001.',
    nota: 'Sn muy baja (0.16). Positivo confirma déficit VMO pero negativo NO descarta SPF (mayoría de casos SPF son negativos).',
    interpreta(val) {
      if (val === true)  return 'Sp 0.93 + LR+ 2.26: positivo confirma déficit de coordinación VMO. Indica ejercicio selectivo y biofeedback.';
      if (val === false) return 'Sn 0.16: negativo no descarta SPF. La mayoría de pacientes SPF no son detectados con este test.';
      return '—';
    },
  },

  // ── Evaluaciones funcionales de clasificación (subgrupos SPF) ──
  {
    id: 'lateral_step_down',
    nombre: 'Lateral Step-Down (Calidad de movimiento)',
    protocolo: 'Pie en escalón (~20 cm). Descender lentamente el pie contralateral sin tocarlo. Observar 6 ítems: 1)inclinación de tronco, 2)manos en cadera, 3)valgo de rodilla, 4)rótula medial al pie, 5)ondulación de rodilla, 6)golpe de pie. 0-2=Bueno; 3-4=Moderado; 5-6=Pobre (déficit de coordinación).',
    tipo: 'assessment',
    ref: 'Willy RW et al. JOSPT 2019 CPG — ICC intratester 0.67–0.81. Grado C: clasificación subgrupos SPF. Lankhorst BJSM 2012. Powers BJSM 2017.',
    interpreta(val) {
      if (val === true)  return 'Déficit de coordinación (≥3/6 criterios): indica déficit de control motor de cadera/rodilla. Valgo dinámico presente. Priorizar fortalecimiento de cadera.';
      if (val === false) return 'Calidad de movimiento aceptable (≤2/6 criterios). Bajo riesgo de déficit neuromuscular en esta tarea.';
      return '—';
    },
  },
  {
    id: 'single_leg_squat',
    nombre: 'Squat Unipodal + FPPA',
    protocolo: 'Sentadilla monopodal lenta (~5 seg bajada, manos en cadera). Observar FPPA (ángulo proyección frontal): eje muslo vs tibia. Positivo: cambio ≥10° en valgo (aducción de cadera excesiva), lean ipsilateral de tronco, o rodilla cae medial al pie.',
    tipo: 'assessment',
    ref: 'Willy RW et al. JOSPT 2019 CPG — ICC FPPA 0.72–0.88. Lankhorst BJSM 2012. Powers BJSM 2017 (consenso internacional).',
    interpreta(val) {
      if (val === true)  return 'Valgo dinámico ≥10° o aducción cadera excesiva: indica déficit de control motor. Evaluar fuerza abductores y rotadores externos de cadera.';
      if (val === false) return 'Control motor adecuado en plano frontal durante carga monopodal. No descarta SPF.';
      return '—';
    },
  },
  {
    id: 'navicular_drop',
    nombre: 'Navicular Drop Test (Pronación)',
    protocolo: 'Marcar posición del navicular en bipedestación con subtalar en posición neutra. Medir descenso al apoyar completamente. Positivo: caída ≥10 mm. FPI-6 complementario: >6 puntos = pronación excesiva.',
    tipo: 'assessment',
    ref: 'Willy RW et al. JOSPT 2019 CPG — ICC intratester 0.87–0.93. Lankhorst BJSM 2012 (SMD 0.33, factor prospectivo JUMP-ACL). Powers BJSM 2017.',
    interpreta(val) {
      if (val === true)  return 'Caída ≥10 mm: hiperpronación subtalar. Factor asociado a SPF (prospectivo). Evaluar indicación de ortesis plantares.';
      if (val === false) return 'Caída <10 mm: postura de pie normal. No se justifica ortesis por este hallazgo aislado.';
      return '—';
    },
  },
  {
    id: 'ober_test',
    nombre: 'Ober Test (Banda Iliotibial)',
    protocolo: 'Decúbito lateral, pierna superior. Extender y abducir la cadera (rodilla a 90°), luego soltar. Normal: la pierna puede adducir por debajo de neutral. Positivo (acortamiento IT): no puede bajar a 0° o menos (aducción <11°).',
    tipo: 'assessment',
    ref: 'Willy RW et al. JOSPT 2019 CPG — ICC intratester 0.97. MDC95=5.82°. Umbral: <11° = retracción. Lankhorst BJSM 2012. Powers BJSM 2017.',
    interpreta(val) {
      if (val === true)  return 'Retracción IT (<11° aducción): asociado a tilt patelar lateral y dolor PFJ. Indica estiramiento IT y ejercicio de cadera.';
      if (val === false) return 'Longitud IT normal (≥11°). Otros factores predominan en este caso.';
      return '—';
    },
  },
  {
    id: 'cuadriceps_length',
    nombre: 'Longitud Cuádriceps (Flexión en prono)',
    protocolo: 'Decúbito prono, pelvis estabilizada. Flexión pasiva de rodilla medida con goniómetro o inclinómetro. Positivo (acortamiento): flexión <134° (inclinómetro) o <120° (goniómetro estándar).',
    tipo: 'assessment',
    ref: 'Willy RW et al. JOSPT 2019 CPG — ICC intratester 0.91. MDC95=10.53°. Lankhorst BJSM 2012 (MD −11.4°, predictor prospectivo Witvrouw 2000).',
    interpreta(val) {
      if (val === true)  return 'Acortamiento cuádriceps (<134°): aumenta compresión PFJ. Predictor prospectivo de SPF (Witvrouw 2000). Priorizar estiramiento de cuádriceps.';
      if (val === false) return 'Longitud normal del cuádriceps (≥134°). Evaluar otros factores musculares.';
      return '—';
    },
  },
  {
    id: 'hamstring_length',
    nombre: 'Longitud Isquiotibiales (SLR/Extensión activa)',
    protocolo: 'SLR pasivo con cadera a 90° o extensión activa de rodilla con cadera fija a 90°. Positivo (acortamiento): déficit de extensión >20° o SLR <79°.',
    tipo: 'assessment',
    ref: 'Willy RW et al. JOSPT 2019 CPG — ICC intratester 0.94–0.99. Lankhorst BJSM 2012 (MD −9.5° en SPF, p<0.001).',
    interpreta(val) {
      if (val === true)  return 'Acortamiento isquiotibiales: aumenta tensión posterior de rodilla. Asociado a SPF. Incluir estiramiento isquiotibial.';
      if (val === false) return 'Longitud normal de isquiotibiales.';
      return '—';
    },
  },
  {
    id: 'hip_strength',
    nombre: 'Fuerza Cadera — Abductores y Rotadores Externos',
    protocolo: 'Decúbito lateral, cadera 45° flexión, rodilla 90°. Dinamómetro de mano en cara lateral del muslo distal. MVIC combinado abductores + RE. Umbrales déficit: Hombres <37%PC (ABD) o <13%PC (RE); Mujeres <30%PC (ABD) o <17%PC (RE).',
    tipo: 'assessment',
    ref: 'Willy RW et al. JOSPT 2019 CPG — ICC intratester 0.98–0.99. HipSIT. Lankhorst BJSM 2012 (ABD WMD −3.30%PC; RE WMD −1.43%PC). Powers BJSM 2017.',
    interpreta(val) {
      if (val === true)  return 'Déficit de fuerza de cadera: factor clasificatorio SPF. Priorizar fortalecimiento de abductores y rotadores externos de cadera en el programa de rehabilitación.';
      if (val === false) return 'Fuerza de cadera dentro de umbrales. Evaluar otros factores (cuádriceps, tejidos blandos, pie).';
      return '—';
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// TESTS MENISCO
// Fuente principal: Logerstedt DS et al. JOSPT 2018;48(2):A1-A50
//   (meta-análisis pooled: valores exactos del CPG)
// Valores Sn/Sp son POOLED de múltiples estudios (IC 95% en notas)
// ═══════════════════════════════════════════════════════════════
const RODILLA_MENISCO_TESTS = [
  {
    id: 'mcmurray',
    nombre: 'McMurray',
    protocolo: 'Supino, rodilla en flexión máxima. Aplicar varo + RE (menisco medial) o valgo + RI (menisco lateral). Extender progresivamente. Positivo: clunk palpable o dolor en interlínea articular.',
    sn: '0.61',
    sp: '0.84',
    lr_pos: '3.61',
    lr_neg: '0.53',
    ref: 'Logerstedt DS et al. JOSPT 2018 CPG — meta-análisis pooled. LR+ 3.61 (IC95%: 2.27-5.72). OR 7.13.',
    nota: 'Rango entre estudios: Sn 0.16–0.83, Sp 0.59–0.98. Los pooled son del meta-análisis JOSPT 2018.',
    interpreta(val) {
      if (val === true)  return 'LR+ 3.61 pooled (IC95%: 2.27-5.72). Sp 0.84: específico para desgarros. OR diagnóstico 7.13.';
      if (val === false) return 'LR– 0.53. Sn 0.61 pooled: negativo reduce sospecha pero no descarta.';
      return '—';
    },
  },
  {
    id: 'jlt',
    nombre: 'Dolor en línea articular (JLT)',
    protocolo: 'Palpación directa de interlínea medial y lateral con rodilla ~90°. Positivo: dolor reproducible a palpación directa en interlínea.',
    sn: '0.63',
    sp: '0.77',
    lr_pos: '2.74',
    lr_neg: '0.48',
    ref: 'Logerstedt DS et al. JOSPT 2018 CPG — pooled. LR+ 2.74 (IC95%: 1.75-4.29). OR 5.66.',
    interpreta(val) {
      if (val === true)  return 'LR+ 2.74 (IC95%: 1.75-4.29). Parte del Composite Score Lowery 2006.';
      if (val === false) return 'LR– 0.48: negativo contribuye a reducir sospecha. Completar composite.';
      return '—';
    },
  },
  {
    id: 'thessaly',
    nombre: 'Thessaly 20°',
    protocolo: 'Pie apoyado unipodal, rodilla 20° flexión, terapeuta sostiene manos. Paciente rota tronco interna/externamente 3×. Positivo: dolor en interlínea o sensación de bloqueo.',
    sn_med: '0.89', sp_med: '0.97',
    sn_lat: '0.92', sp_lat: '0.96',
    ref: 'Karachalios T et al. JBJS 2005. Logerstedt JOSPT 2018 CPG — Grado D (evidencia conflictiva).',
    nota: 'ADVERTENCIA: Grado D. Valores del estudio original NO replicados. Estudios independientes: Sn 0.36–0.64, Sp 0.49–0.83. Usar solo como complemento.',
    interpreta(val) {
      if (val === true)  return 'Alta Sp en estudio original. PERO Grado D — evidencia conflictiva. No usar aislado.';
      if (val === false) return 'Sn muy variable en réplicas. Negativo no descarta. Grado D de evidencia.';
      return '—';
    },
  },
  {
    id: 'apley',
    nombre: 'Apley (compresión + distracción)',
    protocolo: 'Prono, rodilla 90°. Compresión+rotación: positivo (menisco). Distracción+rotación: positivo (ligamentos). Positivo meniscal: dolor con compresión pero no con distracción.',
    sn: '0.60',
    sp: '0.70',
    ref: 'Hegedus EJ et al. Br J Sports Med 2007. Logerstedt JOSPT 2018 CPG — Grado C.',
    interpreta(val) {
      if (val === true)  return 'Sp 0.70 con compresión: aumenta sospecha meniscal. Grado C evidencia.';
      if (val === false) return 'Sn/Sp modestas. Usar junto a composite score.';
      return '—';
    },
  },
  {
    id: 'ege',
    nombre: "Ege's Test",
    protocolo: 'De pie, pies separados 30–40 cm. Para menisco MEDIAL: rotación interna de pie + squat. Para menisco LATERAL: rotación externa + squat. Positivo: click o dolor en interlínea correspondiente.',
    sn: '0.67',
    sp: '0.79',
    sn_lat: '0.78',
    sp_lat: '0.84',
    ref: "Akseki D et al. Knee Surg Sports Traumatol Arthrosc 2004. Citado en Logerstedt JOSPT 2018 — un solo estudio, no pooled.",
    nota: 'Sn medial 0.67 / Sp medial 0.79. Sn lateral 0.78 / Sp lateral 0.84. Un solo estudio.',
    interpreta(val) {
      if (val === true)  return "Ege positivo: sospecha de desgarro meniscal (medial o lateral según variante). Sn 0.67-0.78 / Sp 0.79-0.84.";
      if (val === false) return 'Negativo reduce sospecha. Complementar con McMurray y JLT.';
      return '—';
    },
  },
  {
    id: 'bounce_home',
    nombre: 'Bounce Home Test',
    protocolo: 'Supino, talón apoyado en mano del terapeuta. La rodilla cae pasivamente en extensión completa. Positivo: extensión incompleta — la rodilla "no llega al fondo" (bloqueo mecánico por menisco).',
    sn: null,
    sp: null,
    ref: 'Logerstedt DS et al. JOSPT 2018 CPG. Apley AG & Solomon L. Apley\'s System of Orthopaedics. Sin valores pooled.',
    nota: 'Sin Sn/Sp establecida en literatura. Útil como indicador de bloqueo mecánico meniscal.',
    interpreta(val) {
      if (val === true)  return 'Bloqueo mecánico presente → sospecha fuerte de desgarro meniscal con desplazamiento. Considerar derivación urgente.';
      if (val === false) return 'Extensión completa pasiva: bloqueo mecánico menos probable.';
      return '—';
    },
  },
  {
    id: 'steinmann',
    nombre: 'Steinmann I',
    protocolo: 'Rodilla 90° flexión. Rotación brusca interna→lateral (menisco lateral) o externa→medial (menisco medial). Positivo: dolor agudo en interlínea articular correspondiente.',
    sn: '0.62',
    sp: '0.90',
    ref: 'Kurosaka M et al. Am J Sports Med 1999. Citado en revisiones de tests meniscales.',
    interpreta(val) {
      if (val === true)  return 'Alta Sp (0.90): positivo confirma desgarro meniscal. LR+ ~6.';
      if (val === false) return 'Sn 0.62: negativo reduce sospecha pero no descarta.';
      return '—';
    },
  },
  {
    id: 'derrame',
    nombre: 'Derrame articular (Stroke Test)',
    protocolo: 'Modified Stroke/Brush Test: "barrer" cara medial de distal a proximal, luego cara lateral de proximal a distal. Ola de fluido visible en cara medial = positivo. Grading: 0=neg · 1+=traza · 2+=bultoma inmediato · 3+=muy tenso.',
    sn: null,
    sp: null,
    ref: 'Logerstedt DS et al. JOSPT 2018 CPG. Elemento del Composite Score Lowery 2006.',
    nota: 'Sin Sn/Sp establecida aislada para diagnóstico meniscal. Parte del Composite Score 5 elementos (Lowery 2006).',
    interpreta(val) {
      if (val === true)  return 'Derrame presente → parte del Composite Score Lowery. Evaluar grado (1+/2+/3+).';
      if (val === false) return 'Sin derrame → punto negativo del composite. Continuar evaluación.';
      return '—';
    },
  },
  {
    id: 'squat_dolor',
    nombre: 'Dolor con squat completo',
    protocolo: 'Sentadilla profunda bilateral, talón-glúteo. Positivo: dolor en compartimento posterior o interlínea articular al alcanzar flexión máxima.',
    sn: null,
    sp: null,
    ref: 'Lowery DJ et al. Am J Sports Med 2006. Elemento del Composite Score meniscal (JOSPT 2018 CPG).',
    nota: 'Elemento 5 del Composite Score Lowery 2006 (LR- 0.11 cuando <3 positivos en composite).',
    interpreta(val) {
      if (val === true)  return 'Dolor con squat: parte del Composite Score. >3/5 positivos → Sp 0.75, LR- 0.11.';
      if (val === false) return 'Squat sin dolor: punto negativo del composite.';
      return '—';
    },
  },
  {
    id: 'mecanismo_men',
    nombre: 'Antecedente mecanismo meniscal',
    protocolo: '(Historia clínica) ¿El paciente refiere historia de: 1) trauma en flexión-rotación bajo carga, o 2) movimiento de squatting con dolor súbito, o 3) episodio de bloqueo o giving way? Positivo: ≥1 de estos antecedentes.',
    sn: null,
    sp: null,
    ref: 'Lowery DJ et al. Am J Sports Med 2006. Elemento ① del Composite Score meniscal (JOSPT 2018 CPG).',
    nota: 'Elemento clave del Composite Score Lowery 2006. Combinar con 4 tests clínicos.',
    interpreta(val) {
      if (val === true)  return 'Historia consistente con mecanismo meniscal. Elemento 1 del composite.';
      if (val === false) return 'Sin antecedente de mecanismo meniscal clásico.';
      return '—';
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// TESTS CONDRAL / OSTEOCONDRAL
// Fuentes: Wilk KE JOSPT 2006 · Logerstedt DS JOSPT 2018
//          Mithoefer K JOSPT 2012 · Stiell IG JAMA 1996
// ═══════════════════════════════════════════════════════════════
const RODILLA_CONDRAL_TESTS = [
  {
    id: 'hemarthrosis',
    nombre: 'Hemarthrosis aguda (0–2 h post-trauma)',
    lesion: 'Fractura osteocondral / LCA / LP',
    protocolo: 'Derrame articular hemático en las primeras 2 horas post-trauma. Positivo: aspirado hemático o derrame rápido marcado clínicamente.',
    sn: '0.85',
    sp: '0.70',
    ref: 'Logerstedt DS 2018 JOSPT CPG. Wilk KE 2006 JOSPT.',
    interpreta(val) {
      if (val === true)  return 'Sn 0.85: hemarthrosis aguda → alta sospecha fractura osteocondral/LCA. Ottawa Knee + Rx urgente.';
      if (val === false) return 'Ausencia reduce probabilidad fractura osteocondral aguda.';
      return '—';
    },
  },
  {
    id: 'stroke_test',
    nombre: 'Modified Stroke Test / Derrame articular',
    lesion: 'Derrame intraarticular',
    protocolo: 'Barrer cara medial distal→proximal, luego lateral proximal→distal. Ola de fluido = positivo. Grado: 0=neg / 1+=traza / 2+=bultoma inmediato / 3+=muy tenso (no se desplaza).',
    sn: '0.67',
    sp: '0.71',
    ref: 'Kastelein M et al. Ann Fam Med 2008.',
    interpreta(val) {
      if (val === true)  return 'Derrame articular: mayor sospecha de lesión intraarticular (menisco, condral, LCA).';
      if (val === false) return 'Sin derrame activo. No descarta lesión condral sin inflamación.';
      return '—';
    },
  },
  {
    id: 'wilson_test',
    nombre: 'Wilson Test (OCD)',
    lesion: 'Osteocondritis Disecante (OCD)',
    protocolo: 'Rodilla 90° → extensión con rotación interna de tibia. Positivo: dolor a ~30° que cede con rotación externa. Específico para OCD cóndilo femoral medial.',
    sn: '0.65',
    sp: '0.77',
    ref: 'Wilson JN 1967 JBJS. Hughes JA 2011 (falsos negativos frecuentes en OCD estable).',
    nota: 'Hughes 2011: Sn limitada para OCD estable. Confirmar con RMN.',
    interpreta(val) {
      if (val === true)  return 'Positivo: sospecha OCD cóndilo femoral medial. Indicar RMN.';
      if (val === false) return 'Negativo no descarta OCD (alta tasa falsos negativos en lesiones estables).';
      return '—';
    },
  },
  {
    id: 'palp_condral',
    nombre: 'Palpación condral / interlínea',
    lesion: 'Lesión focal condral',
    protocolo: 'Palpación directa de cóndilos femorales y plateaux tibiales con rodilla flexionada. Positivo: dolor focal en zona condral articular. Registrar localización exacta.',
    sn: null,
    sp: null,
    ref: 'Wilk KE et al. JOSPT 2006 — hallazgo orientador sin Sn/Sp establecida.',
    interpreta(val) {
      if (val === true)  return 'Hallazgo orientador: dolor focal condral. Localizar exactamente. No reemplaza RMN.';
      if (val === false) return 'Palpación indolora. No descarta lesión condral asintomática.';
      return '—';
    },
  },
  {
    id: 'crepitacion',
    nombre: 'Crepitación articular',
    lesion: 'Degeneración condral / OA',
    protocolo: 'Movilización pasiva/activa de la rodilla. Registrar: crepitación fina (SPF), gruesa (OA), o clunk (cuerpo libre). Grado y localización exacta.',
    sn: null,
    sp: null,
    ref: 'Wilk KE et al. JOSPT 2006.',
    interpreta(val) {
      if (val === true)  return 'Crepitación presente. Gruesa → sospecha OA/condromalacia. Complementar con imagen.';
      if (val === false) return 'Sin crepitación. No descarta lesión condral focal temprana.';
      return '—';
    },
  },
  {
    id: 'ottawa_knee',
    nombre: 'Ottawa Knee Rules',
    lesion: 'Fractura ósea / osteocondral',
    protocolo: 'Indicar Rx si: ①edad ≥55 años ②dolor cabeza peroné ③dolor rótula aislado ④imposibilidad flexión 90° ⑤imposibilidad carga 4 pasos. Positivo = ≥1 criterio.',
    sn: '0.99',
    sp: '0.49',
    ref: 'Stiell IG et al. JAMA 1996. Logerstedt DS 2018 JOSPT CPG — Grado A.',
    interpreta(val) {
      if (val === true)  return 'Sn 0.99: criterio presente → INDICAR Rx ANTES DE RMN. Descartar fractura osteocondral.';
      if (val === false) return 'Sin criterios Ottawa (Sn 0.99 → fractura muy improbable). Continuar evaluación.';
      return '—';
    },
  },
  {
    id: 'dolor_carga_pf',
    nombre: 'Dolor con carga PF (cuclillas/escaleras)',
    lesion: 'Condromalacia / SPF',
    protocolo: 'Dolor retropatelar que aumenta con actividades de carga patelofemoral (cuclillas, escaleras, correr cuesta abajo). Positivo: reproducción de dolor PF característico.',
    sn: null,
    sp: null,
    ref: 'Wilk KE 2006 JOSPT. Fredericson M 2005 Clin Sports Med.',
    interpreta(val) {
      if (val === true)  return 'Dolor carga PF: evaluar en conjunto con SPF. RMN para confirmar condromalacia.';
      if (val === false) return 'Sin dolor carga PF. Condromalacia activa menos probable.';
      return '—';
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// LÓGICA DIAGNÓSTICA
// Fuentes: Logerstedt JOSPT 2018 · Benjaminse AJSM 2006
//          Willy JOSPT 2019 · Lowery AJSM 2006
// ═══════════════════════════════════════════════════════════════
const RODILLA_DIAG_LOGIC = {

  lca: {
    label: 'Lesión LCA',
    evaluar(tests) {
      const lachman = tests['lachman'];
      const pivot   = tests['pivot_shift'];
      const cajon   = tests['cajon_ant'];
      if (lachman === undefined && pivot === undefined && cajon === undefined) return null;
      if (lachman === true && pivot === true) {
        return { nivel: 'alto', pct: 95,
          msg: 'Lachman+ (LR+ 10.2) + Pivot Shift+ (LR+ 17.5): probabilidad post-test LCA muy alta. Indicar RMN.' };
      }
      if (lachman === true) {
        return { nivel: 'alto', pct: 75,
          msg: 'Lachman positivo (LR+ 10.2). Probabilidad alta. Confirmar con Pivot Shift y RMN.' };
      }
      if (pivot === true) {
        return { nivel: 'moderado', pct: 72,
          msg: 'Pivot Shift+ (LR+ 17.5, Sp 0.98): alta inestabilidad rotacional. Sn 0.35. Indicar RMN.' };
      }
      if (cajon === true && lachman !== true) {
        return { nivel: 'moderado', pct: 50,
          msg: 'Cajón anterior+ (LR+ 3.2). Sn baja para LCA. Complementar con Lachman.' };
      }
      if (lachman === false && (pivot === false || pivot === undefined)) {
        return { nivel: 'bajo', pct: 5,
          msg: 'Lachman negativo (LR– 0.16): probabilidad post-test LCA muy baja.' };
      }
      return null;
    },
  },

  lcp: {
    label: 'Lesión LCP',
    evaluar(tests) {
      const cajon = tests['cajon_post'];
      if (cajon === undefined) return null;
      if (cajon === true) {
        return { nivel: 'alto', pct: 92, urgente: true,
          msg: 'Cajón posterior positivo (LR+ ~90, Sn 0.90/Sp 0.99). Alta probabilidad LCP. Derivar urgente.' };
      }
      return { nivel: 'bajo', pct: 4,
        msg: 'Cajón posterior negativo (LR– 0.10): lesión LCP muy improbable.' };
    },
  },

  spf: {
    label: 'Síndrome Dolor Patelofemoral (SPF)',
    evaluar(tests) {
      const cuclillas = tests['dolor_cuclillas'];
      const escaleras = tests['dolor_escaleras'];
      const tilt      = tests['tilt_patelar'];
      const apr       = tests['aprension_patelar'];
      const palp      = tests['palp_peripatelar'];
      if (cuclillas === undefined && escaleras === undefined) return null;
      if (cuclillas === true && escaleras === true) {
        return { nivel: 'alto', pct: 88,
          msg: 'Dolor cuclillas+ y escaleras+: ambos criterios CPG Grado A (Willy 2019). Diagnóstico SPF probable. Excluir patología tibiofemoral.' };
      }
      if ((cuclillas === true || escaleras === true) && (tilt === true || apr === true || palp === true)) {
        return { nivel: 'moderado', pct: 72,
          msg: 'Un criterio funcional Grado A + hallazgo físico positivo. SPF probable.' };
      }
      if (cuclillas === true || escaleras === true) {
        return { nivel: 'moderado', pct: 58,
          msg: 'Un criterio Grado A positivo. Probabilidad moderada SPF. Completar evaluación funcional.' };
      }
      if (tilt === true || apr === true) {
        return { nivel: 'moderado', pct: 45,
          msg: 'Hallazgos físicos positivos (tilt/aprensión). Sp alta (0.92–0.93) sin criterio funcional.' };
      }
      if (cuclillas === false && escaleras === false) {
        return { nivel: 'bajo', pct: 8,
          msg: 'Ambos criterios Grado A negativos: SPF muy poco probable.' };
      }
      return null;
    },
  },

  menisco: {
    label: 'Desgarro Meniscal',
    evaluar(tests) {
      // COMPOSITE SCORE — Lowery DJ et al. Am J Sports Med 2006 (citado JOSPT 2018 CPG)
      // 5 elementos exactos del paper:
      //   1) Antecedente de mecanismo meniscal (historia clínica)
      //   2) Dolor en línea articular (JLT)
      //   3) McMurray positivo
      //   4) Derrame articular presente
      //   5) Dolor con squat completo
      // ≥3/5 positivos → Sn 0.92, Sp 0.75, LR+ 3.68, LR- 0.11
      const mec    = tests['mecanismo_men'];
      const jlt    = tests['jlt'];
      const mcm    = tests['mcmurray'];
      const der    = tests['derrame'];
      const squat  = tests['squat_dolor'];
      // Tests adicionales para OR general
      const thes   = tests['thessaly'];
      const apley  = tests['apley'];
      const ege    = tests['ege'];
      const stein  = tests['steinmann'];
      const bounce = tests['bounce_home'];

      const compVals = [mec, jlt, mcm, der, squat];
      const completados = compVals.filter(v => v !== undefined).length;
      const totalCompletados = [mec,jlt,mcm,der,squat,thes,apley,ege,stein,bounce].filter(v=>v!==undefined).length;

      if (totalCompletados === 0) return null;

      const compPos = compVals.filter(v => v === true).length;

      // Bounce home positivo → bloqueo mecánico = urgente
      if (bounce === true) {
        return { nivel: 'alto', pct: 85, urgente: false,
          msg: 'Bounce Home positivo: bloqueo mecánico presente → alta probabilidad desgarro desplazado. Derivar para imagen urgente.' };
      }

      if (completados >= 3) {
        if (compPos >= 3) {
          return { nivel: 'alto', pct: 85,
            msg: `Composite Score Lowery 2006: ${compPos}/5 positivos. ≥3/5 → Sn 0.92 / Sp 0.75 / LR+ 3.68 / LR- 0.11 (JOSPT 2018). Indicar RMN.` };
        }
        if (compPos === 2) {
          const total = [mcm,thes,jlt,mec,der,squat,ege,stein].filter(v=>v===true).length;
          return { nivel: 'moderado', pct: 55,
            msg: `Composite Score ${compPos}/5. Sospecha moderada. ${total} tests positivos en total. Completar evaluación.` };
        }
        if (compPos <= 1 && completados >= 4) {
          return { nivel: 'bajo', pct: 12,
            msg: `Composite Score ${compPos}/5. <3 positivos → LR- 0.11: baja probabilidad de desgarro meniscal (Lowery 2006 / JOSPT 2018).` };
        }
      }

      // Antes de tener composite completo — evaluar tests individuales
      if (mcm === true && jlt === true) {
        return { nivel: 'moderado', pct: 65,
          msg: 'McMurray+ (LR+ 3.61) + JLT+ (LR+ 2.74). Par positivo → probabilidad meniscal moderada-alta. Completar composite Lowery 5 elementos.' };
      }
      if (mcm === true) {
        return { nivel: 'moderado', pct: 50,
          msg: 'McMurray positivo (LR+ 3.61 pooled, OR 7.13). Completar composite: mecanismo + JLT + derrame + squat.' };
      }
      if (jlt === true) {
        return { nivel: 'moderado', pct: 40,
          msg: 'JLT positivo (LR+ 2.74). Completar composite Lowery para mayor precisión.' };
      }
      return null;
    },
  },

  condral: {
    label: 'Lesión Condral / Osteocondral',
    evaluar(tests) {
      const hem    = tests['hemarthrosis'];
      const wilson = tests['wilson_test'];
      const palp   = tests['palp_condral'];
      const ottawa = tests['ottawa_knee'];
      const stroke = tests['stroke_test'];
      const completados = [hem,wilson,palp,ottawa,stroke].filter(v=>v!==undefined).length;
      if (completados === 0) return null;
      if (ottawa === true && hem === true) {
        return { nivel: 'alto', pct: 90, urgente: true,
          msg: 'Ottawa Knee Rules+ (Sn 0.99) + hemarthrosis aguda: DESCARTAR FRACTURA OSTEOCONDRAL. Rx urgente → RMN.' };
      }
      if (ottawa === true) {
        return { nivel: 'alto', pct: 75, urgente: true,
          msg: 'Ottawa Knee Rules positivo (Sn 0.99): indicar Rx antes de continuar manejo conservador.' };
      }
      if (hem === true) {
        return { nivel: 'alto', pct: 80, urgente: true,
          msg: 'Hemarthrosis aguda (0–2h): Sn 0.85 para lesión osteocondral/ligamentaria grave. Derivar urgente.' };
      }
      if (wilson === true && palp === true) {
        return { nivel: 'moderado', pct: 62,
          msg: 'Wilson+ + dolor condral: sospecha OCD cóndilo femoral medial. Indicar RMN.' };
      }
      if (wilson === true) {
        return { nivel: 'moderado', pct: 48,
          msg: 'Wilson positivo (Sp 0.77). Sospecha OCD. Alta tasa falsos negativos en lesiones estables.' };
      }
      if (stroke === true && palp === true) {
        return { nivel: 'moderado', pct: 45,
          msg: 'Derrame + dolor condral: sospecha patología intraarticular. RMN para confirmar.' };
      }
      return null;
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// LYSHOLM KNEE SCALE
// Lysholm J, Gillquist J. Am J Sports Med 1982;10(3):150-154
// 7 ítems (sin "swelling" — removido per JOSPT 2018 Rasch analysis)
// Max 90 pts → normalizar ×100/90 → 0–100
// ≥95: excelente · 84–94: bueno · 65–83: regular · <65: malo
// MCID: 8.9 pts · Logerstedt JOSPT 2018 Grado A
// ═══════════════════════════════════════════════════════════════
const LYSHOLM_ITEMS = [
  {
    id: 'cojera',
    label: 'Cojera',
    max: 5,
    opciones: [
      { val: 5, txt: 'Ninguna' },
      { val: 3, txt: 'Leve o periódica' },
      { val: 0, txt: 'Severa y constante' },
    ],
  },
  {
    id: 'apoyo',
    label: 'Soporte (bastón/muleta)',
    max: 5,
    opciones: [
      { val: 5, txt: 'Sin soporte' },
      { val: 3, txt: 'Bastón o muleta necesaria' },
      { val: 0, txt: 'No puede cargar peso' },
    ],
  },
  {
    id: 'bloqueo',
    label: 'Bloqueo articular (locking)',
    max: 15,
    opciones: [
      { val: 15, txt: 'Sin bloqueo ni sensación de chasquido' },
      { val: 10, txt: 'Sensación de chasquido pero sin bloqueo' },
      { val:  6, txt: 'Bloqueo ocasional' },
      { val:  2, txt: 'Bloqueo frecuente' },
      { val:  0, txt: 'Articulación bloqueada al examen' },
    ],
  },
  {
    id: 'inestabilidad',
    label: 'Inestabilidad (giving way)',
    max: 25,
    opciones: [
      { val: 25, txt: 'Nunca cede' },
      { val: 20, txt: 'Raramente en deportes muy intensos' },
      { val: 15, txt: 'Frecuentemente en deportes intensos o trabajo pesado' },
      { val: 10, txt: 'Ocasionalmente en actividades diarias' },
      { val:  5, txt: 'Frecuentemente en actividades diarias' },
      { val:  0, txt: 'Con cada paso' },
    ],
  },
  {
    id: 'dolor',
    label: 'Dolor',
    max: 25,
    opciones: [
      { val: 25, txt: 'Sin dolor' },
      { val: 20, txt: 'Leve e inconstante durante ejercicio intenso' },
      { val: 15, txt: 'Marcado durante ejercicio intenso' },
      { val: 10, txt: 'Marcado al caminar más de 2 km' },
      { val:  5, txt: 'Marcado al caminar menos de 2 km' },
      { val:  0, txt: 'Constante' },
    ],
  },
  {
    id: 'escaleras',
    label: 'Subir escaleras',
    max: 10,
    opciones: [
      { val: 10, txt: 'Sin problemas' },
      { val:  6, txt: 'Levemente limitado' },
      { val:  2, txt: 'Un escalón a la vez' },
      { val:  0, txt: 'Imposible' },
    ],
  },
  {
    id: 'cuclillas',
    label: 'Ponerse en cuclillas',
    max: 5,
    opciones: [
      { val: 5, txt: 'Sin problemas' },
      { val: 4, txt: 'Levemente limitado' },
      { val: 2, txt: 'No más de 90°' },
      { val: 0, txt: 'Imposible' },
    ],
  },
];
const LYSHOLM_MAX = LYSHOLM_ITEMS.reduce((s, i) => s + i.max, 0); // 90

// ═══════════════════════════════════════════════════════════════
// TEGNER ACTIVITY SCALE
// Tegner Y, Lysholm J. Clin Orthop 1985;(198):43-49
// Nivel de actividad 0–10 · JOSPT 2018 Grado A (en conjunto con Lysholm)
// ═══════════════════════════════════════════════════════════════
const TEGNER_NIVELES = [
  { val: 0, txt: 'Baja por enfermedad o lesión · discapacidad laboral por rodilla' },
  { val: 1, txt: 'Trabajo sedentario · Caminar en superficie plana (sin deporte)' },
  { val: 2, txt: 'Trabajo liviano (enfermería) · Caminar en terreno irregular, bosque, sin escaladas' },
  { val: 3, txt: 'Trabajo liviano · Natación · Caminata en bosque con terreno irregular' },
  { val: 4, txt: 'Trabajo moderado-pesado · Bicicleta de ruta · Trote en piso plano ≥2×/semana' },
  { val: 5, txt: 'Trabajo pesado (construcción) · Bicicleta competitiva · Trote en terreno irregular ≥2×/semana' },
  { val: 6, txt: 'Deportes recreativos: tenis, handball, básquet, ski alpino · Trote ≥5×/semana' },
  { val: 7, txt: 'Deporte competitivo: tenis, atletismo (pista), motocross, handball, básquet' },
  { val: 8, txt: 'Deportes competitivos: raqueta, atletismo de campo, hockey sobre hielo, lucha, gimnasia' },
  { val: 9, txt: 'Fútbol (divisiones inferiores), hockey, lucha, gimnasia, básquet competitivo a nivel alto' },
  { val:10, txt: 'Fútbol a nivel nacional/internacional · Raqueta a nivel internacional' },
];

// ═══════════════════════════════════════════════════════════════
// MARX ACTIVITY RATING SCALE
// Marx RG et al. Am J Sports Med 2001;29(2):213-218
// 4 ítems · 0–4 por ítem · Total 0–16 · JOSPT 2018 Grado A
// ≥14 = alta demanda · ≥8 = moderada · <8 = baja
// ═══════════════════════════════════════════════════════════════
const MARX_ITEMS = [
  { id: 'correr',    label: 'Correr en línea recta a máxima velocidad' },
  { id: 'cortar',   label: 'Cambiar de dirección bruscamente (cutting)' },
  { id: 'decelerar',label: 'Desacelerar bruscamente para detenerse' },
  { id: 'pivotar',  label: 'Pivotar sobre la rodilla afectada' },
];
const MARX_FREC = [
  { val: 0, txt: 'Menos de 1 vez al mes' },
  { val: 1, txt: 'Una vez al mes' },
  { val: 2, txt: 'Una vez por semana' },
  { val: 3, txt: 'Algunos días por semana' },
  { val: 4, txt: 'Todos los días' },
];

// ═══════════════════════════════════════════════════════════════
// BIBLIOGRAFÍA
// ═══════════════════════════════════════════════════════════════
const RODILLA_REFS = {
  benjaminse2006:  'Benjaminse A, Gokeler A, van der Schans CP. Clinical diagnosis of an anterior cruciate ligament rupture: a meta-analysis. J Orthop Sports Phys Ther. 2006;36(5):267-288.',
  solomon2001:     'Solomon DH, Simel DL, Bates DW, Katz JN, Schaffer JL. Does this patient have a torn meniscus or ligament of the knee? JAMA. 2001;286(13):1610-1620.',
  rubinstein1994:  'Rubinstein RA Jr et al. The accuracy of the clinical examination in the setting of posterior cruciate ligament injuries. Am J Sports Med. 1994;22(4):550-557.',
  lelli2014:       'Lelli A et al. The "Lever Sign": a new clinical test for the diagnosis of anterior cruciate ligament rupture. Knee Surg Sports Traumatol Arthrosc. 2016;24(9):2794-2797.',
  willy2019:       'Willy RW et al. Patellofemoral Pain. J Orthop Sports Phys Ther. 2019;49(9):CPG1-CPG95.',
  cook2012:        'Cook C et al. Best tests/clinical findings for screening and diagnosis of patellofemoral pain syndrome. Physiotherapy. 2012;98(2):93-100.',
  logerstedt2018:  'Logerstedt DS et al. Knee Stability and Movement Coordination Impairments: Knee Ligament Sprain Revision 2017. J Orthop Sports Phys Ther. 2018;47(11):A1-A47.',
  logerstedt2018cpg:'Logerstedt DS et al. Knee Pain and Mobility Impairments: Meniscal and Articular Cartilage Lesions Revision 2018. J Orthop Sports Phys Ther. 2018;48(2):A1-A50.',
  logerstedt2021:  'Logerstedt DS et al. Effects of and Response to Mechanical Loading on the Knee. Sports Medicine. 2021.',
  mithoefer2012:   'Mithoefer K et al. Return to Playing Level After Articular Cartilage Repair in the Knee. J Orthop Sports Phys Ther. 2012;42(3):254-273.',
  wilk2006:        'Wilk KE et al. Rehabilitation of articular lesions in the athlete\'s knee. J Orthop Sports Phys Ther. 2006;36(10):815-827.',
  stiell1996:      'Stiell IG et al. Prospective validation of a decision rule for the use of radiography in acute knee injuries. JAMA. 1996;275(8):611-615.',
  hegedus2007:     'Hegedus EJ et al. Physical examination tests for assessing a torn meniscus in the knee: a systematic review with meta-analysis. J Orthop Sports Phys Ther. 2007;37(9):541-550.',
  lowery2006:      'Lowery DJ et al. A Validated Clinical Prediction Rule for the Diagnosis of Knee Meniscal Pathology. Am J Sports Med. 2006;34(9):1549-1555.',
  karachalios2005: 'Karachalios T et al. Diagnostic accuracy of a new clinical test (the Thessaly test) for early detection of meniscal tears. J Bone Joint Surg Am. 2005;87(5):955-962.',
  akseki2004:      "Akseki D et al. A new weight-bearing meniscal test and a comparison with McMurray's test and joint line tenderness. Arthroscopy. 2004;20(9):951-958.",
  lysholm1982:     'Lysholm J, Gillquist J. Evaluation of knee ligament surgery results with special emphasis on use of a scoring scale. Am J Sports Med. 1982;10(3):150-154.',
  tegner1985:      'Tegner Y, Lysholm J. Rating systems in the evaluation of knee ligament injuries. Clin Orthop Relat Res. 1985;(198):43-49.',
  marx2001:        'Marx RG et al. Development and evaluation of an activity rating scale for disorders of the knee. Am J Sports Med. 2001;29(2):213-218.',
  roos1998:        'Roos EM et al. Knee injury and Osteoarthritis Outcome Score (KOOS)—development of a self-administered outcome measure. J Orthop Sports Phys Ther. 1998;28(2):88-96.',
  izquierdo2010:   'Izquierdo-Avino R et al. Spanish translation and validation of the Knee Injury and Osteoarthritis Outcome Score (KOOS). Osteoarthritis Cartilage. 2010.',
  kirkley2007:     'Kirkley A et al. The development and validation of a quality of life-measurement tool for patients with meniscal pathology: the Western Ontario Meniscal Evaluation Tool (WOMET). Clin J Sport Med. 2007;17(5):349-356.',
  visentini1998:   'Visentini PJ et al. The VISA score: an index of severity of symptoms in patients with jumper\'s knee. J Sci Med Sport. 1998;1(1):22-28.',
  hernandez2011:   'Hernandez-Sanchez S et al. Cross-cultural adaptation of VISA-P score for patellar tendinopathy in Spanish population. J Orthop Sports Phys Ther. 2011;41(8):581-591.',
  noble1980:       'Noble CA. Iliotibial band friction syndrome in runners. Am J Sports Med. 1980;8(4):232-234.',
  lavine2010:      'Lavine R. Iliotibial band friction syndrome. Curr Rev Musculoskelet Med. 2010;3(1-4):18-22.',
  beals2013:       'Beals C & Flanigan D. A Review of Treatments for Iliotibial Band Syndrome in the Athletic Population. J Sports Med. 2013;367169.',
  mckay2020:       'McKay J et al. Iliotibial band syndrome rehabilitation in female runners: a pilot randomized study. BMC Sports Sci Med Rehab. 2020;12:1.',
  sanchezalvarado2024: 'Sanchez-Alvarado A et al. Effects of conservative treatment strategies for ITBS on pain and function in runners. Front Sports Act Living. 2024;6:1386456.',
  kakouris2021:    'Kakouris N et al. A systematic review of running-related musculoskeletal injuries in runners. J Sport Health Sci. 2021;10(5):513-522.',
  orchard1996:     'Orchard JW et al. Biomechanical analysis of iliotibial band friction syndrome in runners. Am J Sports Med. 1996;24(3):375-379.',
};


// ══════════════════════════════════════════════════════
// SÍNDROME DE FRICCIÓN DE LA BANDA ILIOTIBIAL (SFBI / ITBS)
// Sanchez-Alvarado A et al. Front Sports Act Living 2024;6:1386456
// Beals C & Flanigan D. J Sports Med 2013;367169
// McKay J et al. BMC Sports Sci Med Rehab 2020;12:1
// Noble CA. Am J Sports Med 1980;8(4):232-234
// Lavine R. Curr Rev Musculoskelet Med 2010;3:18-22
// ══════════════════════════════════════════════════════

const RODILLA_ITBS_TESTS = [
  {
    id: 'noble_compression',
    nombre: 'Noble Compression Test',
    categoria: 'test_diagnostico',
    sn: 0.97, sp: null, lrPos: null, lrNeg: null,
    referencia: 'Noble 1980 · Lavine 2010',
    protocolo: 'Decúbito supino, rodilla a 30° flexión. Presión manual sobre epicóndilo femoral lateral (2-3 cm proximal). Positivo: dolor reproducido en zona de impingement.',
    interpretacion: 'Alta sensibilidad (0.97). Test de elección para confirmar ITBS. Dolor a 30° = zona de impingement ITB.',
    urgente: false,
  },
  {
    id: 'renne_test',
    nombre: 'Renne Test (Single-Leg Squat 30-40°)',
    categoria: 'test_diagnostico',
    sn: null, sp: null, lrPos: null, lrNeg: null,
    referencia: 'Renne 1975 · Lavine 2010',
    protocolo: 'De pie en apoyo monopodal. Flexionar rodilla a 30-40° (posición de impingement). Positivo: dolor en epicóndilo femoral lateral reproducido.',
    interpretacion: 'Reproduce dolor en "zona de impingement" (30-40° flexión). Sin valores Sn/Sp establecidos, pero alta especificidad clínica.',
    urgente: false,
  },
  {
    id: 'ober_test',
    nombre: 'Ober Test (Tensión ITB/TFL)',
    categoria: 'test_flexibilidad',
    sn: null, sp: null, lrPos: null, lrNeg: null,
    referencia: 'Ober 1936 · Fredericson 2000',
    protocolo: 'Decúbito lateral, cadera abducida y extendida. Soltar extremidad. Positivo: cadera no desciende bajo línea horizontal (aducción < 0°).',
    interpretacion: 'Evalúa tensión TFL/ITB. Positivo = factor predisponente ITBS. No diagnóstico por sí solo pero orienta tratamiento.',
    urgente: false,
  },
  {
    id: 'thomas_test_tfl',
    nombre: 'Thomas Test Modificado (TFL)',
    categoria: 'test_flexibilidad',
    sn: null, sp: null, lrPos: null, lrNeg: null,
    referencia: 'Harvey 1998',
    protocolo: 'Decúbito supino al borde de camilla. Flexionar cadera contralateral. Observar si muslo ipsilateral abducido/rotado externamente al soltar.',
    interpretacion: 'Positivo con abducción-RE del muslo = retracción TFL. Factor predisponente ITBS.',
    urgente: false,
  },
  {
    id: 'slmd_30',
    nombre: 'Single-Leg Mini Squat 30° (Control de Cadera)',
    categoria: 'evaluacion_funcional',
    sn: null, sp: null, lrPos: null, lrNeg: null,
    referencia: 'McKay 2020 · Willy 2014',
    protocolo: 'De pie unipodal. Sentadilla a 30° rodilla. Observar: aducción cadera, valgus rodilla (FPPA), tronco lateral.',
    interpretacion: 'Aducción cadera >17° o FPPA >10° = déficit de control neuromuscular. Factor causal en ITBS corredores.',
    urgente: false,
  },
  {
    id: 'hip_abductor_strength',
    nombre: 'Fuerza Abductores Cadera (Dinamometría)',
    categoria: 'evaluacion_funcional',
    sn: null, sp: null, lrPos: null, lrNeg: null,
    referencia: 'Fredericson 2000 · Sanchez-Alvarado 2024',
    protocolo: 'Dinamometría manual o isocinética. Abducción cadera en decúbito lateral. Comparar bilateral.',
    interpretacion: 'Déficit >15% lado afectado = factor predisponente principal. HAS = primera línea de tratamiento (evidencia Nivel II).',
    urgente: false,
  },
];

// Factores de riesgo ITBS
const ITBS_RISK_FACTORS = [
  { id: 'weekly_km',      label: 'Kilómetros semanales elevados (>60 km/sem)', peso: 3 },
  { id: 'downhill',       label: 'Entrenamiento en cuestas/descenso', peso: 3 },
  { id: 'hip_weakness',   label: 'Debilidad abductores/glúteo medio', peso: 3 },
  { id: 'itb_tension',    label: 'Tensión TFL/ITB (Ober positivo)', peso: 2 },
  { id: 'volume_spike',   label: 'Aumento brusco de volumen (>10%/semana)', peso: 3 },
  { id: 'interval',       label: 'Entrenamiento interválico repetitivo', peso: 2 },
  { id: 'hard_surface',   label: 'Superficie dura/inclinada lateral', peso: 1 },
  { id: 'hip_adduction',  label: 'Excesiva aducción/RI cadera en carrera', peso: 3 },
];

// Estadificación clínica ITBS (Orchard 1996 / Lavine 2010)
const ITBS_STAGES = [
  { grade: 1, label: 'Grado I',  desc: 'Dolor post-carrera. No durante.',                color: 'neon'  },
  { grade: 2, label: 'Grado II', desc: 'Dolor durante carrera. No limita rendimiento.',   color: 'amber' },
  { grade: 3, label: 'Grado III',desc: 'Dolor que limita la carrera. Presente en AVD.',  color: 'red'   },
  { grade: 4, label: 'Grado IV', desc: 'Dolor en reposo y actividades cotidianas.',       color: 'red'   },
];

// js/data/papers-lumbar-rules.js
// EBM rules for lumbar differential diagnosis
// Sources: Delitto et al. JOSPT 2012 CPG · Cook et al. Spine 2006 (SIJ cluster)
//          van der Windt 2010 Cochrane · Laslett EJSP 2005 · Hicks 2003
//          Majlesi 2008 · Mens 2001 · O'Sullivan 2018 · Konno 2007

// ── Test definitions ─────────────────────────────────────────────────────────

const LUMBAR_TESTS_NEURAL = [
  { id:'slr',         name:'SLR (Lasègue)',              sub:'L4-S1 · < 60° = positivo · Sn 0.91 / Sp 0.26',          tag:'tag-r', ref:'van der Windt 2010 Cochrane — ángulo en que aparece dolor ciático con rodilla extendida' },
  { id:'slump',       name:'SLUMP test',                  sub:'Tensión dural / radiculopatía · Sn 0.84 / Sp 0.83',     tag:'tag-r', ref:'Majlesi 2008 — posición slump + extensión rodilla + dorsiflexión + rotación cervical' },
  { id:'slr-cruzado', name:'SLR cruzado (Well leg raise)',sub:'Hernia masiva · Sn 0.29 / Sp 0.88 / LR+ 2.42',         tag:'tag-r', ref:'Alta especificidad — positivo contralateral = hernia extruida o secuestrada' },
  { id:'fnt-prueba',  name:'Femoral Nerve Tension (FNT)', sub:'L2-L4 · cara anterior muslo',                           tag:'tag-y', ref:'Prone knee bend — dolor en cara anterior muslo/rodilla = raíz L2-L4' },
  { id:'bowstring',   name:'Bowstring test',              sub:'Compresión ciático · Sn 0.38 / Sp 0.89',                tag:'tag-y', ref:'Compresión poplítea con SLR positivo — aumenta dolor = alta especificidad compromiso neural' },
];

const LUMBAR_TESTS_SIJ = [
  { id:'thigh-thrust',      name:'Thigh Thrust',          sub:'SIJ · mejor test individual · Sn 0.88 / Sp 0.69',    tag:'tag-r', ref:'Laslett 2005 — fuerza posterior sobre fémur en 90° flexión → provoca dolor SIJ' },
  { id:'faber-lbp',         name:'FABER (Patrick)',        sub:'SIJ / cápsula · Sn 0.57 / Sp 0.71',                  tag:'tag-y', ref:'Flexión + Abducción + RE — distancia codo-camilla asimétrica o dolor SIJ = positivo' },
  { id:'gaenslen',          name:'Gaenslen',               sub:'SIJ · Sn 0.53 / Sp 0.71',                            tag:'tag-y', ref:'Extensión 1 cadera + flexión contralateral — fuerza cizallamiento en SIJ' },
  { id:'compression-sij',   name:'Compresión SIJ',         sub:'SIJ · Sn 0.69 / Sp 0.69',                            tag:'tag-y', ref:'Presión medial sobre crestas ilíacas en decúbito lateral — dolor SIJ posterior = positivo' },
  { id:'distraccion-sij',   name:'Distracción SIJ',        sub:'SIJ · Sn 0.60 / Sp 0.81',                            tag:'tag-y', ref:'Presión sobre EIAS en supino — separa articulaciones SIJ — dolor = positivo' },
  { id:'sacral-thrust',     name:'Sacral Thrust',          sub:'SIJ · Sn 0.63 / Sp 0.75',                            tag:'tag-y', ref:'Presión sobre sacro en prono — provoca dolor SIJ posterior' },
];

const LUMBAR_TESTS_ESTABILIDAD = [
  { id:'aslr',        name:'ASLR',                        sub:'Dolor pélvico posterior · Sn 0.87 / Sp 0.94',         tag:'tag-b', ref:'Mens 2001 — elevación pierna extendida en supino · dificultad percibida = déficit transferencia de carga pélvica' },
  { id:'prone-instab',name:'Prone Instability Test',       sub:'Inestabilidad lumbar · Sn 0.72 / Sp 0.58',           tag:'tag-b', ref:'Hicks 2003 — PA en prono con pies en suelo: dolor → pies levantados: mejora = inestabilidad' },
  { id:'aberrant-mv', name:'Aberrant movement signs',      sub:'Gower sign / desvío / catch',                         tag:'tag-b', ref:'Hicks 2003 — movimientos aberrantes al volver de flexión: signo de inestabilidad segmentaria' },
];

const LUMBAR_TESTS_ESTENOSIS = [
  { id:'stoop-test',       name:'Stoop test',              sub:'Estenosis neurógena · Sn 0.49 / Sp 0.84',            tag:'tag-y', ref:'Caminar hasta síntomas → inclinarse: alivio = estenosis neurógena (vs vascular: no cambia)' },
  { id:'two-stage-walk',   name:'Two-stage walk test',     sub:'Claudicación neurógena · distancia comparativa',      tag:'tag-y', ref:'Mayor distancia caminando inclinado vs erguido = estenosis (no vascular)' },
];

// ── ROM ──────────────────────────────────────────────────────────────────────
const LUMBAR_ROM = [
  { id:'flex',  label:'Flexión lumbar',         ref:'40–60°', mdc:'5°',  schober: false },
  { id:'ext',   label:'Extensión lumbar',        ref:'20–35°', mdc:'5°',  schober: false },
  { id:'rot-d', label:'Rotación derecha',        ref:'30–45°', mdc:'5°',  schober: false },
  { id:'rot-i', label:'Rotación izquierda',      ref:'30–45°', mdc:'5°',  schober: false },
  { id:'lat-d', label:'Inclinación lateral D',   ref:'15–25°', mdc:'3°',  schober: false },
  { id:'lat-i', label:'Inclinación lateral I',   ref:'15–25°', mdc:'3°',  schober: false },
];

// ── Myotomas L2–S1 ───────────────────────────────────────────────────────────
const LBP_MYOTOMAS = [
  { id:'lbp-myo-l2', nivel:'L2', mov:'Flexión cadera (iliopsoas)' },
  { id:'lbp-myo-l3', nivel:'L3', mov:'Extensión rodilla (cuádriceps)' },
  { id:'lbp-myo-l4', nivel:'L4', mov:'Dorsiflexión tobillo (tibial anterior)' },
  { id:'lbp-myo-l5', nivel:'L5', mov:'Extensión dedo gordo (EHL)' },
  { id:'lbp-myo-s1', nivel:'S1', mov:'Plantiflexión tobillo (gastrocnemio)' },
];

// ── Reflejos ─────────────────────────────────────────────────────────────────
const LBP_REFLEJOS = [
  { id:'lbp-ref-l4', nombre:'Reflejo rotuliano',  nivel:'L3-L4' },
  { id:'lbp-ref-s1', nombre:'Reflejo aquiliano',   nivel:'S1' },
];

// ── Symptoms ─────────────────────────────────────────────────────────────────
const LUMBAR_SYMPTOMS = [
  // Radiculopatía lumbar
  { id:'lrp-irradiacion',    label:'Dolor irradiado por debajo de la rodilla (ciática)',       region:'radiculopatia', icon:'🔴' },
  { id:'lrp-parestesias',    label:'Parestesias / hormigueo en pierna o pie',                  region:'radiculopatia', icon:'🔴' },
  { id:'lrp-debilidad',      label:'Debilidad muscular en pierna / pie',                       region:'radiculopatia', icon:'🔴' },
  { id:'lrp-dermatomal',     label:'Dolor en patrón dermatomal (L4/L5/S1)',                    region:'radiculopatia', icon:'🔴' },
  { id:'lrp-valsalva',       label:'Aumento del dolor con tos / estornudo / Valsalva',          region:'radiculopatia', icon:'🔴' },

  // SIJ
  { id:'sij-sacro',          label:'Dolor localizado en zona sacra / glútea unilateral',        region:'sij', icon:'🟠' },
  { id:'sij-ingle',          label:'Dolor referido a ingle o cara anterior de muslo',           region:'sij', icon:'🟠' },
  { id:'sij-levantarse',     label:'Dolor con cambio de posición (sentado → de pie)',           region:'sij', icon:'🟠' },
  { id:'sij-dedo-psis',      label:'Paciente señala dolor con 1 dedo sobre PSIS',               region:'sij', icon:'🟠' },

  // Discal / mecánico
  { id:'disc-flexion',       label:'Dolor que empeora con flexión / sedestación prolongada',    region:'discal', icon:'🟡' },
  { id:'disc-central',       label:'Dolor lumbar central sin irradiación distal',               region:'discal', icon:'🟡' },
  { id:'disc-manana',        label:'Rigidez matutina > 30 minutos',                            region:'discal', icon:'🟡' },

  // Estenosis neurógena
  { id:'esten-caminar',      label:'Dolor/pesadez en piernas al caminar (claudicación)',        region:'estenosis', icon:'🟣' },
  { id:'esten-bicicleta',    label:'Alivio al flexionar tronco o andar en bicicleta',           region:'estenosis', icon:'🟣' },
  { id:'esten-bilateral',    label:'Síntomas bilaterales en piernas',                           region:'estenosis', icon:'🟣' },
  { id:'esten-extension',    label:'Dolor que empeora con extensión / estar de pie',            region:'estenosis', icon:'🟣' },

  // Inestabilidad / control motor
  { id:'instab-captura',     label:'Episodios de "fallar" o bloqueo lumbar con movimiento',    region:'inestabilidad', icon:'🔵' },
  { id:'instab-fatiga',      label:'Fatiga postural rápida al mantener posición',               region:'inestabilidad', icon:'🔵' },
  { id:'instab-cronica',     label:'Dolor crónico recurrente con múltiples episodios',          region:'inestabilidad', icon:'🔵' },
];

// ── Diagnostic rules ─────────────────────────────────────────────────────────
const LUMBAR_RULES = {
  banderasRojas: [
    { id:'cauda-equina',      label:'Síndrome cauda equina (retención urinaria, anestesia en silla de montar)', accion:'Derivar urgencias — neurocirugía inmediata' },
    { id:'fractura-lbp',     label:'Fractura vertebral (trauma, osteoporosis, corticoides crónicos)',           accion:'RX urgente antes de movilizar' },
    { id:'malignidad-lbp',   label:'Cáncer / infección (fiebre, pérdida peso, dolor nocturno severo)',          accion:'Derivar médico — imagen urgente' },
    { id:'esp-inflam',       label:'Espondiloartropatía inflamatoria (< 45 años, rigidez matutina, alivio con ej.)', accion:'Derivar reumatología' },
    { id:'neuro-progresiva', label:'Déficit neurológico progresivo o bilateral grave',                           accion:'Neurología / neurocirugía urgente' },
  ],

  diagnosticos: [
    // 1. Radiculopatía lumbar
    {
      id: 'radiculopatia-lbp',
      nombre: 'Radiculopatía lumbar',
      categoria: 'LRP',
      colorKey: 'red',
      testsKey:        ['slr', 'slump', 'slr-cruzado'],
      testsSupportKey: ['fnt-prueba', 'bowstring'],
      symptomKeys: ['lrp-irradiacion','lrp-parestesias','lrp-debilidad','lrp-dermatomal','lrp-valsalva'],
      umbral: 1,
      symptomUmbral: 2,
      criterio: 'SLR < 60° = alta sensibilidad (Sn 0.91). Cruzado = alta Sp (0.88) para hernia extruida. SLUMP: Sn 0.84 / Sp 0.83. Síntomas dermatomales + SLR positivo = sospecha alta sin imagen.',
      evidencia: 'SLR: Sn 0.91 / Sp 0.26 / LR+ 1.23 / LR- 0.12 (van der Windt 2010 Cochrane — 15 estudios).\nSLUMP: Sn 0.84 / Sp 0.83 — superior al SLR en subagudo/crónico (Majlesi 2008).\nCrossed SLR: Sn 0.29 / Sp 0.88 / LR+ 2.42 — confirma hernia masiva.\nFemoral Nerve Tension: L2-L4 — dolor cara anterior muslo.\nBowstring: Sn 0.38 / Sp 0.89 — alta Sp para compromiso neural.',
      tratamiento: '• Educación en neurociencia del dolor (Rec. A)\n• Movilización neural progresiva + ejercicio activo\n• Tracción lumbar en agudo severo (Rec. C)\n• Evitar reposo en cama (Rec. A)\n• Derivar si déficit motor progresivo o cauda equina\n• RMN solo si no mejora en 4–6 sem o déficit neurológico',
      ref: 'Delitto et al. JOSPT 2012 CPG · van der Windt Cochrane 2010 · Majlesi 2008 · Airaksinen 2006',
    },

    // 2. Disfunción SIJ
    {
      id: 'sij-disfuncion',
      nombre: 'Disfunción sacroilíaca (SIJ)',
      categoria: 'SIJ',
      colorKey: 'orange',
      testsKey:        ['thigh-thrust', 'faber-lbp', 'gaenslen', 'compression-sij', 'distraccion-sij', 'sacral-thrust'],
      testsSupportKey: [],
      symptomKeys: ['sij-sacro','sij-ingle','sij-levantarse','sij-dedo-psis'],
      umbral: 3,
      symptomUmbral: 2,
      criterio: 'Cluster Cook 2006: ≥ 3 de 6 tests positivos = Sn 0.91 / Sp 0.78 / LR+ 4.16. Thigh Thrust es el test más sensible (Sn 0.88). FABER + Gaenslen + Compresión añaden especificidad al cluster.',
      evidencia: 'Thigh Thrust: Sn 0.88 / Sp 0.69 — mejor test SIJ individual (Laslett 2005).\nFABER: Sn 0.57 / Sp 0.71 (Cibulka 1999).\nGaenslen: Sn 0.53 / Sp 0.71.\nCompresión: Sn 0.69 / Sp 0.69.\nDistracción: Sn 0.60 / Sp 0.81.\nSacral Thrust: Sn 0.63 / Sp 0.75.\nCluster ≥3/6: Sn 0.91 / Sp 0.78 / LR+ 4.16 / LR- 0.12 (Cook et al. Spine 2006).',
      tratamiento: '• Manipulación thrust SIJ en decúbito lateral (Rec. A)\n• Estabilización lumbopélvica con ejercicio activo\n• Cinturón pélvico si inestabilidad relevante\n• Educación postural y ergonomía en AVD\n• Infiltración SIJ guiada por imagen si refractaria\n• Fisioterapia perineal si postparto',
      ref: 'Cook et al. Spine 2006 · Laslett EJSP 2005 · Cibulka 1999 · Delitto JOSPT 2012',
    },

    // 3. Inestabilidad lumbar
    {
      id: 'inestabilidad-lumbar',
      nombre: 'Inestabilidad / déficit control motor lumbar',
      categoria: 'Estabilidad',
      colorKey: 'neon',
      testsKey:        ['aslr', 'prone-instab'],
      testsSupportKey: ['aberrant-mv'],
      symptomKeys: ['instab-captura','instab-fatiga','instab-cronica'],
      umbral: 1,
      symptomUmbral: 2,
      criterio: 'ASLR: Sn 0.87 / Sp 0.94 para dolor pélvico posterior. Prone Instability Test: Sn 0.72 / Sp 0.58. Cluster inestabilidad (Hicks 2003): edad < 40 + SLR > 91° + prone instab + aberrant movement → LR+ 4.3.',
      evidencia: 'ASLR: Sn 0.87 / Sp 0.94 / LR+ 14.5 (Mens 2001) — dolor pélvico posterior periparto/crónico.\nProne Instability Test: Sn 0.72 / Sp 0.58 / LR+ 1.71 (Hicks 2003).\nMovimientos aberrantes: desvío, Gower sign, instability catch.\nCluster Hicks 2003: 4 criterios → LR+ 4.3 para respuesta a estabilización.\nEjercicio de estabilización > movilización en inestables.',
      tratamiento: '• Motor control training: transverso + multífido (Rec. A)\n• Estabilización progresiva: local → global → funcional\n• Evitar manipulación en inestabilidad alta\n• Pilates o MDT si preferencia direccional\n• Educación en carga gradual y retorno a actividad\n• CORE + fortalecimiento cintura pélvica',
      ref: 'Delitto et al. JOSPT 2012 · Hicks 2003 · Mens 2001 · Richardson 1999 · Ferreira 2006',
    },

    // 4. Estenosis neurógena
    {
      id: 'estenosis-neuro',
      nombre: 'Estenosis neurógena lumbar',
      categoria: 'Estenosis',
      colorKey: 'amber',
      testsKey:        ['stoop-test'],
      testsSupportKey: ['two-stage-walk'],
      symptomKeys: ['esten-caminar','esten-bicicleta','esten-bilateral','esten-extension'],
      umbral: 0,
      symptomUmbral: 2,
      criterio: 'Claudicación neurógena: dolor bilateral en piernas al caminar que mejora con flexión (bicicleta sign). Stoop test positivo + Sn 0.49 / Sp 0.84. Diferenciar de claudicación vascular (no mejora con postura).',
      evidencia: 'Stoop test: Sn 0.49 / Sp 0.84 — reprouce síntomas al caminar erguido, alivio al inclinarse.\nTwo-stage walk: mayor distancia inclinado = estenosis (no vascular).\nCluster Konno 2007: bilateral + mejoría flexión + > 60 años = LR+ 3.4.\nRMN confirma: área canal < 100mm² (cirugía si < 75mm²).',
      tratamiento: '• Ejercicio en flexión (bicicleta, Nordic walking inclinado)\n• Educación: evitar hiperlordosis, caminar apoyado\n• Aquatic therapy (descarga corporal efectiva)\n• Corsé lumbar en agudo sintomático\n• Derivar cirugía si síntomas graves / progresivos (descompresión)\n• TENS / calor como adjunto en crónico',
      ref: 'Delitto et al. JOSPT 2012 · Konno 2007 · Katz 2008 · Fritz 2000',
    },
  ],
};

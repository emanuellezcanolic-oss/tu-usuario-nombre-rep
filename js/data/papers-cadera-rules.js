// js/data/papers-cadera-rules.js
// Reglas clínicas para motor diagnóstico de cadera
// Fuentes: Griffin 2016 (Warwick), Enseki 2023 (JOSPT CPG), Wong 2022 (Curr Rev Musculoskelet),
//          Caliesch 2020 (BMJ Open), Delahunt 2015 (Doha), Ishøi 2021 (BJSM),
//          Reiman 2012 (BJSM meta-análisis), Reiman 2014 (BJSM FAI meta-análisis),
//          Simel 2019 (JAMA hip OA)

const CADERA_RULES = {

  banderasRojas: [
    {
      id: 'fractura-sospecha',
      label: 'Trauma + imposibilidad de carga',
      action: 'Sospechar fractura — realizar PPPT y derivar a Rx urgente',
      color: 'red',
      triggerTests: ['pppt']
    },
    {
      id: 'night-pain',
      label: 'Dolor nocturno severo sin trauma',
      action: 'Descartar neoplasia / infección — derivar médico',
      color: 'red',
      triggerTests: []
    },
    {
      id: 'artritis-septica',
      label: 'Fiebre + dolor agudo de cadera',
      action: 'Artritis séptica hasta no demostrar lo contrario — derivar urgente',
      color: 'red',
      triggerTests: []
    },
    {
      id: 'pediatrico',
      label: 'Paciente pediátrico (< 16 años)',
      action: 'Descartar Perthes / SCFE antes de evaluar FAI',
      color: 'amber',
      triggerTests: []
    }
  ],

  diagnosticos: [
    // ── EMERGENCIAS / URGENCIAS ──────────────────────────────────────────
    {
      id: 'fractura-cuello',
      nombre: 'Fractura de cuello femoral',
      categoria: 'Urgencia',
      colorKey: 'red',
      testsKey: ['pppt'],
      testsSupportKey: ['fulcrum-test'],
      umbral: 1,
      criterio: 'PPPT positivo = alta sospecha de fractura. No cargar peso.',
      evidencia: 'PPPT pooled Sn 95% Sp 86% LR+ 6.11 LR- 0.07 — Reiman MP et al. BJSM 2012 (meta-análisis, n=782, 3 estudios).',
      tratamiento: '⚠️ Derivación urgente a guardia — inmovilización — radiografía pelvis AP urgente — no cargar peso.',
      ref: 'Reiman MP et al. Br J Sports Med 2012. doi:10.1136/bjsports-2012-091035'
    },

    // ── INTRAARTICULAR ──────────────────────────────────────────────────
    {
      id: 'fai-sindrome',
      nombre: 'FAI Síndrome (Pinzamiento Femoroacetabular)',
      categoria: 'Intraarticular',
      colorKey: 'neon',
      testsKey: ['fadir', 'prone-ir-neutral'],
      testsSupportKey: ['fpaw', 'scour', 'irop', 'maximal-squat', 'stinchfield', 'third-test'],
      umbral: 1,
      criterio: 'Warwick Agreement: síntomas + signos clínicos + morfología en imagen. FADIR (cribado) + Prone IR neutro (LR+ 4.83) = mejor combinación clínica.',
      evidencia: 'FADIR pooled Sn 94% Sp 9% LR+ 1.02 — Reiman 2014 (meta-análisis n=1398 caderas).\nProne IR neutro 0° flex: LR+ 4.83 Sp 94% — mejor test rule-in individual — Ishøi L et al. BJSM 2021.\nFPAW: Sn 61% Sp 56% — Caliesch R et al. BMJ Open 2020.\nMorphología Cam = ángulo alfa > 55° en Rx/MRA.',
      tratamiento: 'Educación del movimiento · Fortalecimiento glúteo y core · Evitar ROM extremo (flexión + RI combinadas) · Derivar imagen: Rx pelvis + MRA para confirmar morfología · Fisioterapia 8-12 semanas antes de valorar cirugía artroscópica.',
      ref: 'Griffin DR et al. Br J Sports Med 2016 (Warwick Agreement)\nIshøi L et al. Br J Sports Med 2021\nReiman MP et al. Br J Sports Med 2014'
    },
    {
      id: 'lesion-labral',
      nombre: 'Lesión labral acetabular',
      categoria: 'Intraarticular',
      colorKey: 'neon',
      testsKey: ['fadir', 'third-test'],
      testsSupportKey: ['scour', 'irop', 'stinchfield', 'log-roll', 'thomas'],
      umbral: 1,
      criterio: 'FADIR (alta Sn, descarte) + THIRD test (LR+ 3.9, rule-in) o Thomas (LR+ 11.1, fuerte rule-in). Gold standard: Artro-RM Sn 87-91% Sp 80-89%.',
      evidencia: 'FADDIR pooled Sn 94-99% Sp 7-8% — Reiman 2012; 2014.\nThomas test: Sn 89% Sp 92% LR+ 11.1 LR- 0.12 — McCarthy & Busconi (en Reiman BJSM 2012) — test individual más útil para labrum.\nTHIRD test: Sn 98% Sp 75% LR+ 3.9 LR- 0.03 — Myrick & Nissen 2014.\nArtro-RM: Sn 87-91% Sp 80-89% — gold standard imagen.',
      tratamiento: 'Fisioterapia: control motor, estabilización cadera · Evitar ROM extremo · Artro-RM para confirmar · Valorar artroscopia si no mejora en 3-6 meses (desbridamiento / reparación).',
      ref: 'Reiman MP et al. BJSM 2012; 2014\nEnseki K et al. JOSPT 2023 CPG'
    },
    {
      id: 'microinestabilidad',
      nombre: 'Microinestabilidad de cadera',
      categoria: 'Intraarticular',
      colorKey: 'amber',
      testsKey: ['anterior-apprehension', 'abd-ext-er', 'prone-er'],
      testsSupportKey: ['log-roll', 'faber'],
      umbral: 2,
      criterio: 'CPR: 3 tests positivos (anterior-apprehension + abd-ext-er + prone-er) = 95% probabilidad. 2 tests = alta sospecha. Evaluar hiperlaxitud sistémica.',
      evidencia: 'Anterior apprehension: Sn 71% Sp 85% | Abd-Ext-ER: Sn 81% Sp 89% | Prone ER: Sn 33% Sp 98% — Wong SE et al. Curr Rev Musculoskelet Med 2022.\nCombinación 3 tests = 95% likelihood — CPR microinestabilidad.',
      tratamiento: 'Estabilización dinámica periarticular · Fortalecimiento profundo (glúteo menor, rotadores externos profundos) · Evitar movimientos de apprehension · Control neuromuscular · MRA para descartar lesión capsular asociada.',
      ref: 'Wong SE et al. Curr Rev Musculoskelet Med 2022\nEnseki K et al. JOSPT 2023 CPG'
    },
    {
      id: 'displasia-ddh',
      nombre: 'Displasia acetabular / DDH borderline',
      categoria: 'Intraarticular',
      colorKey: 'amber',
      testsKey: ['log-roll', 'faber'],
      testsSupportKey: ['anterior-apprehension', 'abd-ext-er', 'fadir'],
      umbral: 1,
      criterio: 'Log roll positivo + FABER + síntomas de inestabilidad. Confirmar con imagen: CEA < 25° en Rx.',
      evidencia: 'Log roll: Sn 42% Sp 62% — baja Sn individual, usar en combinación.\nFABER: Sn 42-81% Sp 18-75% — Reiman 2012.\nCEA < 25° en Rx frontal pelvis = displasia definitiva.',
      tratamiento: 'Fortalecimiento muscular periarticular · Control motor · Derivar imagen (Rx pelvis con protocolo FAI/DDH) · Valorar osteotomía periacetabular (PAO) si sintomático y displasia significativa.',
      ref: 'Enseki K et al. JOSPT 2023 CPG\nWong SE et al. Curr Rev Musculoskelet Med 2022'
    },
    {
      id: 'ligamento-redondo',
      nombre: 'Lesión ligamento redondo (ligamentum teres)',
      categoria: 'Intraarticular',
      colorKey: 'amber',
      testsKey: ['ligamentum-teres'],
      testsSupportKey: ['log-roll', 'faber'],
      umbral: 1,
      criterio: 'Ligamentum teres test positivo + dolor central de cadera + posible click intraarticular.',
      evidencia: 'Ligamentum teres test — Enseki JOSPT CPG 2023. Evidencia diagnóstica limitada individual; usar en contexto clínico.',
      tratamiento: 'Artroscopia diagnóstica y terapéutica (desbridamiento o reparación) si confirmado · Fisioterapia: estabilización de cadera.',
      ref: 'Enseki K et al. JOSPT 2023 CPG'
    },

    // ── EXTRAARTICULAR ───────────────────────────────────────────────────
    {
      id: 'coxa-saltans',
      nombre: 'Coxa saltans / Cadera en resorte',
      categoria: 'Extraarticular',
      colorKey: 'blue',
      testsKey: ['ober', 'thomas'],
      testsSupportKey: [],
      umbral: 1,
      criterio: 'Snap palpable / audible en flexo-extensión o rotación. Ober+ = IT band. Thomas+ = psoas.',
      evidencia: 'Diagnóstico clínico — snap reproducible con movimiento activo. No hay tests con LR publicados específicos para coxa saltans.',
      tratamiento: 'Estiramiento IT band y psoas · Liberación miofascial · Fortalecimiento glúteo · Resolución espontánea frecuente · Infiltración ecoguiada si sintomático severo.',
      ref: 'Enseki K et al. JOSPT 2023 CPG'
    },
    {
      id: 'tendinopatia-glutea',
      nombre: 'Tendinopatía glútea (GTPS)',
      categoria: 'Extraarticular',
      colorKey: 'blue',
      testsKey: ['trendelenburg', 'resisted-hip-abduction'],
      testsSupportKey: ['resisted-ext-derotation'],
      umbral: 1,
      criterio: 'Trendelenburg + Resisted Hip Abduction positivos. Resisted External Derotation (LR+ 32.6) = mejor test individual en clínica.',
      evidencia: 'Trendelenburg pooled: Sn 61% Sp 92% LR+ 6.83 — Reiman 2012 (3 estudios, n=78).\nResisted Hip Abduction pooled: Sn 71% Sp 84% LR+ 5.50 — Reiman 2012.\nResisted External Derotation (Lequesne): Sn 88% Sp 97.3% LR+ 32.6 — test individual más potente para GTPS.\nCluster palpación + abducción resistida = 96% confirmación.',
      tratamiento: 'Ejercicio carga progresiva (alta carga excéntrica e isométrica) · Evitar compresión tendinosa: no cruzar piernas, no adducción · HIIT modificado · PRP infiltración en refractario · No masaje transverso profundo en fase aguda.',
      ref: 'Reiman MP et al. BJSM 2012\nLequesne M et al. Arthritis Rheum 2008;59:241-6'
    },

    // ── INGLE / DOHA ─────────────────────────────────────────────────────
    {
      id: 'ingle-aductor',
      nombre: 'Ingle aductor-related (Doha)',
      categoria: 'Ingle deportiva',
      colorKey: 'orange',
      testsKey: ['doha-aduct-dolor', 'doha-aduct-resist'],
      testsSupportKey: ['doha-squeeze-0', 'doha-squeeze-45', 'doha-aduct-estir'],
      umbral: 2,
      criterio: 'Doha: palpación dolorosa origen aductor largo + dolor en resistencia aducción = diagnóstico definitivo. Bilateral adductor test LR+ 7.7.',
      evidencia: 'Bilateral adductor test: Sn 54% Sp 93% LR+ 7.7 — Verrall 2005 (en Reiman BJSM 2012).\nSqueeze test 0°: Sn 78% Sp 50% LR+ 4.8 | 45°: Sn 56% Sp 73% — Doha Consensus 2015.',
      tratamiento: 'Carga progresiva aductores (Copenhagen protocol) · Reducción de carga aguda · Retorno gradual al deporte en 8-12 semanas con protocolo estructurado.',
      ref: 'Delahunt E et al. Br J Sports Med 2015 (Reunión Doha)\nVerrall GM et al. Scand J Med Sci Sports 2005'
    },
    {
      id: 'ingle-psoas',
      nombre: 'Ingle iliopsoas-related (Doha)',
      categoria: 'Ingle deportiva',
      colorKey: 'orange',
      testsKey: ['doha-psoas-dolor', 'doha-psoas-resist'],
      testsSupportKey: ['doha-psoas-estir', 'doha-flex-activa', 'thomas'],
      umbral: 2,
      criterio: 'Doha: palpación dolorosa psoas/iliaco distal + dolor en flexión resistida 90° = diagnóstico definitivo.',
      evidencia: 'Criterios Doha Consensus 2015 — palpación + resistencia = categoría definitiva iliopsoas-related.',
      tratamiento: 'Fortalecimiento excéntrico psoas · Control motor lumbo-pélvico · Estiramiento progresivo · Retorno gradual.',
      ref: 'Delahunt E et al. Br J Sports Med 2015 (Reunión Doha)'
    },
    {
      id: 'ingle-inguinal',
      nombre: 'Ingle inguinal-related / Hernia deportiva (Doha)',
      categoria: 'Ingle deportiva',
      colorKey: 'orange',
      testsKey: ['doha-ing-dolor', 'doha-ing-resist'],
      testsSupportKey: ['doha-valsalva', 'doha-gibbon'],
      umbral: 2,
      criterio: 'Doha: dolor canal inguinal a palpación + dolor con resistencia combinada abd+flex. Gibbon sling test Sn/Sp 99%.',
      evidencia: 'Gibbon inguinal sling test: Sn 99% Sp 99% — Doha Consensus.\nCriterios Doha 2015 — canal palpation + resisted maneuver = diagnóstico definitivo.',
      tratamiento: 'Conservador 6-12 semanas · Si fracasa: derivar cirugía (reparación laparoscópica) · Retorno deporte post-cirugía: 6-8 semanas.',
      ref: 'Delahunt E et al. Br J Sports Med 2015 (Reunión Doha)'
    },
    {
      id: 'osteitis-pubis',
      nombre: 'Osteitis pubis / Pubis-related (Doha)',
      categoria: 'Ingle deportiva',
      colorKey: 'orange',
      testsKey: ['doha-pubis'],
      testsSupportKey: ['doha-rectus', 'doha-squeeze-0'],
      umbral: 1,
      criterio: 'Doha: dolor a palpación directa en sínfisis pubis ± squeeze test positivo.',
      evidencia: 'Criterio Doha: palpación sínfisis = categoría pubis-related. Confirmación: RMN (edema óseo en sínfisis pubis).',
      tratamiento: 'Reposo relativo · Control de carga · Rehabilitación core y pelvis · Infiltración corticoide si severo · Recuperación lenta: 3-6 meses típicamente.',
      ref: 'Delahunt E et al. Br J Sports Med 2015 (Reunión Doha)'
    },

    // ── DEGENERATIVA ─────────────────────────────────────────────────────
    {
      id: 'artrosis-cadera',
      nombre: 'Artrosis de cadera (OA)',
      categoria: 'Degenerativa',
      colorKey: 'text',
      testsKey: ['squat-posterior-pain', 'groin-abd-add-pain'],
      testsSupportKey: ['hip-adduction-loss', 'hip-ir-loss', 'abductor-weakness-oa', 'faber'],
      umbral: 1,
      criterio: 'Cluster ≥ 2 hallazgos: dolor posterior en cuclillas, dolor ingle en abd/aducc, pérdida ROM, debilidad abductora. Cluster ≥ 5 → OA severa (LR+ 35).',
      evidencia: 'Squat → posterior pain: LR+ 6.1 Sn 24% Sp 96% | Groin abd/add pain: LR+ 5.7 Sn 33% Sp 94%.\nAbductor weakness: LR+ 4.5 Sn 44% Sp 90% | Disminución aducción: LR+ 4.2 Sn 80% Sp 81%.\nCluster ≥ 4 hallazgos: LR+ 4.9 | Cluster ≥ 5 hallazgos: LR+ 35 — Simel DL et al. JAMA 2019.',
      tratamiento: 'Ejercicio aeróbico y de fuerza (evidencia A) · Control de peso · Educación · AINES tópicos · Intraarticular: hialurónico o corticoide · Artroplastia total de cadera si discapacidad severa.',
      ref: 'Simel DL et al. JAMA 2019;322(23):2323-2333\nEnseki K et al. JOSPT 2023 CPG'
    }
  ]
};

// ── VISA-G — Victorian Institute of Sport Assessment – Gluteal (Fearon 2015) ──
const VISAG_ITEMS = [
  { q:'¿Cuánto dolor tiene al caminar por terreno plano durante 30 minutos?',                        max:10 },
  { q:'¿Cuánto dolor tiene al subir o bajar escaleras?',                                              max:10 },
  { q:'¿Cuánto dolor tiene al acostarse sobre el lado afectado durante la noche?',                   max:10 },
  { q:'¿Cuánto dolor tiene al ponerse las medias o el calzado?',                                     max:10 },
  { q:'¿Cuánto dolor tiene al pararse sobre una sola pierna (30 segundos)?',                         max:10 },
  { q:'¿Cuánto dolor tiene al hacer actividad física de más de 30 minutos?',                         max:10 },
  { q:'¿En qué medida el dolor de cadera afecta sus actividades de la vida diaria?',                 max:10 },
  { q:'¿Cuántas semanas de las últimas 4 semanas pudo entrenar / ejercitarse con normalidad?',       max:10 },
];
// 0 = peor / sin actividad  |  10 = sin dolor / actividad completa
// Total /80  ·  MDC ~11 pts  ·  MCID ~12 pts  ·  Fuente: Fearon AM et al. Man Ther 2015;20(6):805-13

const CADERA_ROM = [
  { id:'flex',  label:'Flexión',           ref:'100–120°', mdc:'5°' },
  { id:'ext',   label:'Extensión',          ref:'20–30°',  mdc:'4°' },
  { id:'abd',   label:'Abducción',          ref:'40–50°',  mdc:'4°' },
  { id:'add',   label:'Aducción',           ref:'20–30°',  mdc:'4°' },
  { id:'ri',    label:'Rot. interna',       ref:'30–40°',  mdc:'5°' },
  { id:'re',    label:'Rot. externa',       ref:'40–60°',  mdc:'5°' },
];

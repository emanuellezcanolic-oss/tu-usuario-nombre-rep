// data/papers-tobillo-rules.js v3 — Datos clínicos y diagnósticos tobillo
// Fuentes: Polzer 2012 · Gomes 2022 · Vuurberg 2018 · Doherty 2017 · Torre 2019
//          Meredith 2025 · Alfredson 1998 · Beyer 2015 · Hiller 2006 · Plisky 2006
//          Martin JOSPT CPG 2014 · DiGiovanni Foot Ankle Int 2002 · Riddle JOSPT 2004
//          Chimenti JOSPT CPG 2024 · Hutchison Foot Ankle Surg 2013 · Matthews PeerJ 2021

var TOBILLO_LIG_LAT = [
  { id:'drawer-tob',  name:'Anterior Drawer (ATFL)',      sub:'ATFL — inestabilidad anterior',       ref:'Sn 96% / Sp 84% (exam diferido 3–5 d) — Polzer 2012 (n=282)' },
  { id:'talar-tilt',  name:'Talar Tilt (CFL)',             sub:'CFL + ATFL — desgarro grado II-III',  ref:'Sn 0.50 / Sp 0.88 / LR+ 4.2 — van Dijk 1996; Polzer 2012' },
  { id:'kleiger-lat', name:'Rotación externa (Kleiger)',   sub:'Deltoides / sindesmosis distal',      ref:'Sn 0.71 / Sp 0.63 — Alonso 1992; Torre 2019' },
];

var TOBILLO_LIG_MED = [
  { id:'deltoid-palp',  name:'Palpación lig. deltoideo',  sub:'Complejo medial — esguince en eversión',  ref:'Criterio clínico — dolor reproduc. en palpación' },
  { id:'eversion-str',  name:'Stress eversión',            sub:'Ligamento deltoideo medial',               ref:'Inestabilidad medial — laxitud en eversión forzada' },
  { id:'ant-drawer-med', name:'Cajón anterior tibiotalar', sub:'Impingement anterior / ATFL anterior',     ref:'Polzer 2012 — pinzamiento anteromedial' },
];

var TOBILLO_OTTAWA_ITEMS = [
  { id:'ott-lat-mal',   label:'Sensibilidad ósea borde posterior / punta maléolo LATERAL (últimos 6 cm)', zona:'tobillo' },
  { id:'ott-med-mal',   label:'Sensibilidad ósea borde posterior / punta maléolo MEDIAL (últimos 6 cm)',  zona:'tobillo' },
  { id:'ott-carga-tob', label:'Incapacidad de cargar peso inmediatamente tras la lesión O en la consulta (4 pasos)',  zona:'tobillo' },
  { id:'ott-navicular', label:'Sensibilidad ósea en hueso NAVICULAR',                                     zona:'pie' },
  { id:'ott-5mt',       label:'Sensibilidad ósea en base del 5.° METATARSIANO',                           zona:'pie' },
  { id:'ott-carga-pie', label:'Incapacidad de cargar peso (4 pasos) — dolor en zona mediopié',            zona:'pie' },
];

var TOBILLO_SINDES_TESTS = [
  { id:'squeeze-sindes', name:'Squeeze test (compresión tibia-peroné)', sub:'Compresión proximal al punto medio de pierna → dolor en tobillo', ref:'Valor pronóstico — Torre SEMCPT 2019; menor tasa FP que rotación ext.' },
  { id:'kleiger-sindes', name:'Rotación externa forzada (Kleiger)',      sub:'RE + DF: dolor en sindesmosis — menor tasa falsos positivos',     ref:'Mejor Sn/Sp relativa de tests sindesmal — Torre 2019; Alonso 1992' },
  { id:'crossed-leg',    name:'Crossed-Leg test (pierna cruzada)',       sub:'Pierna afecta sobre rodilla contralateral — fuerza medial rodilla', ref:'Beumer AJSM 2003; Torre SEMCPT 2019' },
  { id:'cotton-test',    name:'Cotton test (traslación astragalina)',     sub:'Traslación lateral/medial del astrágalo en neutro',               ref:'Inestabilidad sindesmal distal — Torre 2019' },
  { id:'fib-transl',     name:'Traslación peroné',                       sub:'Desplazamiento anterior/posterior del peroné distal',             ref:'Torre SEMCPT 2019 — comparar con contralateral' },
];

var TOBILLO_AQUILES_TESTS = [
  // ── Ruptura ──────────────────────────────────────────────────────────────────
  { id:'thompson',      name:'Thompson test',                sub:'Squeeze pantorrilla → pérdida plantar flexión = ruptura',               ref:'Sn 0.96 / Sp 0.93 — Maffulli BMJ 1999' },
  { id:'matles',        name:'Matles test',                  sub:'Prono, rodillas 90° → pérdida FP pasiva = ruptura completa',            ref:'Sn 0.88 / Sp 0.85 — Maffulli 1998' },
  // ── Tendinopatía — diferenciación midporción / insercional ───────────────────
  { id:'arc-sign',      name:'Arc sign (signo del arco)',    sub:'Bulto palpable desaparece en DF = midporción; persiste = insercional',   ref:'Maffulli 2003; Meredith Curr Rev Musculoskel 2025; Matthews PeerJ 2021' },
  { id:'royal-london',  name:'Royal London Hospital test',   sub:'Palpación midporción en DF vs. FP — dolor diferencial midporción',      ref:'Meredith 2025; Crisp AJSM 2008; Chimenti JOSPT CPG 2024' },
  // ── Tendinopatía — tests clínicos (evidencia Hutchison 2013 / CPG 2024) ──────
  { id:'palp-midportion', name:'Palpación porción media (2–6 cm sobre inserción)', sub:'Dolor reproducible a palpación local — zona avascular midporción', ref:'Mayor validez diagnóstica TA — Hutchison Foot Ankle Surg 2013 · Matthews PeerJ 2021 (n=159)' },
  { id:'rigidez-matinal', name:'Rigidez matinal (Morning stiffness)',               sub:'Dolor/rigidez al inicio de movimiento tras reposo nocturno o prolongado', ref:'K=0.75 fiabilidad inter/intraobs — Hutchison 2013; Palp+rigidez: Sn 83% / Sp 89%' },
  { id:'carga-dolor',     name:'Dolor con carga tendinosa (SLHR + salto)',          sub:'Reproducción dolor en elevación talón unipodal o salto → Core Outcome Set TA', ref:'Core Outcome Set TA — Chimenti JOSPT CPG 2024; Matthews PeerJ 2021; Carcia JOSPT 2010 CPG' },
  // ── Diferenciación gastroc / sóleo ───────────────────────────────────────────
  { id:'silfverskiold', name:'Silfverskiöld test',           sub:'DF con rodilla extendida vs. flexionada — diferenciar gastrocnemio vs. sóleo', ref:'DiGiovanni Foot Ankle Int 2002; Meredith 2025' },
];

var TOBILLO_PIE_TESTS = [
  { id:'windlass',    name:'Windlass test',                         sub:'Extensión pasiva 1° MF en bipedestación → dolor talón medial',    ref:'Sp 100% (Sn 13–32%) — Thomas Foot Ankle Int 2019; Martin JOSPT CPG 2014' },
  { id:'calc-palp',  name:'Palpación tuberosidad calcánea medial', sub:'Dolor reproducible en inserción de fascia plantar',                ref:'Sn 78% — criterio clínico principal — Martin JOSPT CPG 2014 (APTA Nivel I)' },
  { id:'first-step', name:'Dolor primer paso (First-step pain)',    sub:'Dolor intenso al levantarse por mañana o tras reposo prolongado', ref:'Sn 70–80% — síntoma cardinal fasciopatía plantar — Riddle JOSPT 2004' },
  { id:'silfver-fp', name:'Silfverskiöld (equino gastroc.)',        sub:'DF <0° con rodilla extendida — contractura gastrocnemio',         ref:'OR 23.3 para fasciopatía si DF<0° — Riddle JOSPT 2004; DiGiovanni Foot Ankle Int 2002' },
];

var TOBILLO_HOP_TESTS = [
  { id:'side-hop',   name:'Side Hop test',          sub:'IAC — >12.87 s necesita rehab',  cut:12.87, unit:'s', worse:'mayor', ref:'MDC 5.82 s — Hiller JOSPT 2006; Galleher CPG 2020' },
  { id:'fig8-hop',   name:'Figure-of-8 Hop test',   sub:'IAC — >17.35 s necesita rehab',  cut:17.35, unit:'s', worse:'mayor', ref:'MDC 4.59 s — Galleher CPG 2020' },
  { id:'hop-6m',     name:'6-Meter Hop test',        sub:'LSI <87.7% = déficit funcional', cut:87.7,  unit:'%LSI', worse:'menor', ref:'MDC 0.22 s — Galleher CPG 2020' },
];

var TOBILLO_RULES = [
  {
    id: 'ruptura-aquiles',
    label: 'Ruptura tendón de Aquiles',
    color: 'var(--red)',
    tests: ['thompson','matles'],
    criterios: ['Thompson + (pérdida FP en squeeze)', 'Matles + (asimetría FP prono)', 'Brecha palpable en tendón'],
    tratamiento: 'Derivar urgencias. Inmovilización en equino (FP 20–30°). Decisión conservadora vs. quirúrgica.'
  },
  {
    id: 'tendinopatia-aquiles-mid',
    label: 'Tendinopatía Aquiles (midporción)',
    color: 'var(--amber)',
    tests: ['royal-london','arc-sign','palp-midportion','rigidez-matinal','carga-dolor'],
    criterios: [
      'Palpación dolorosa 2–6 cm sobre inserción (Hutchison 2013)',
      'Rigidez matinal presente (K=0.75 fiabilidad)',
      'Dolor con carga (SLHR / salto) — Core Outcome Set TA',
      'Arc sign midporción (bulto desaparece en DF)',
      'Royal London Hospital + (dolor DF, alivio FP)',
      'VISA-A <75 / dolor insidioso post-actividad'
    ],
    tratamiento: 'Carga tendinosa progresiva (Grado A CPG 2024). VISA-A + SHR como Core Outcome Set. Sin reposo completo.'
  },
  {
    id: 'tendinopatia-aquiles-ins',
    label: 'Tendinopatía Aquiles (insercional)',
    color: 'var(--amber)',
    tests: ['arc-sign','palp-midportion','carga-dolor'],
    criterios: [
      'Arc sign insercional (bulto persiste en reposo/FP)',
      'Dolor en inserción calcánea (no en midporción)',
      'VISA-A <75 · Dolor con DF o en ascenso/descenso escaleras'
    ],
    tratamiento: 'HSR modificado sin DF completa. Heel lift 1.5 cm. ESWT enfocado en inserción. Evitar estiramientos en DF extrema.'
  },
  {
    id: 'lesion-sindesmosial',
    label: 'Lesión sindesmosial',
    color: 'var(--red)',
    tests: ['squeeze-sindes','kleiger-sindes','crossed-leg','cotton-test','fib-transl'],
    minPos: 2,
    criterios: ['≥2 tests sindesmosis positivos', 'Dolor proximal articulación tibioastragalina', 'Mecanismo RE o hiperdorsiflexión'],
    tratamiento: 'Imagen obligatoria (RM gold standard: Sn >91%, Sp 100%). Inmovilización 4–6 sem. Derivar ortopedia si diástasis >2 mm.'
  },
  {
    id: 'esguince-agudo-lateral',
    label: 'Esguince lateral agudo',
    color: 'var(--amber)',
    tests: ['drawer-tob','talar-tilt'],
    criterios: ['Cajón anterior + (grado II-III)', 'Mecanismo inversión + dolor ATFL', 'Talar Tilt + (CFL comprometido)'],
    tratamiento: 'POLICE. Soporte funcional 7–10 días. Movilización temprana. Propiocepción desde día 3–5.'
  },
  {
    id: 'esguince-lateral-cronico',
    label: 'Inestabilidad lateral crónica (IAC)',
    color: 'var(--red)',
    tests: ['drawer-tob','talar-tilt'],
    criterios: ['CAIT <28 (≤27)', '≥2 esguinces recurrentes', 'Sensación de "cedida" / giving way'],
    tratamiento: 'Rehab neuromuscular 6–12 sem. Peroneos. Brace preventivo. CAIT como outcome primario.'
  },
  {
    id: 'contractura-gastrocnemio',
    label: 'Contractura gastrocnemio',
    color: 'var(--teal)',
    tests: ['silfverskiold'],
    criterios: ['Silfverskiöld + (DF restringida con rodilla extendida, normal con flexionada)'],
    tratamiento: 'Estiramiento gastrocnemio aislado. Heel lift transitorio. Valorar Strayer si refractario.'
  },
  {
    id: 'sebt-deficit',
    label: 'Déficit control postural dinámico',
    color: 'var(--amber)',
    criterios: ['SEBT asimetría >4 cm', 'Composite score <89%', 'IAC o post-esguince'],
    tratamiento: 'Programa neuromuscular 6 semanas. Hop training. Side Hop + Figure-8 Hop como outcomes.'
  },
  {
    id: 'ottawa-positivo',
    label: 'Sospecha fractura (Ottawa +)',
    color: 'var(--red)',
    criterios: ['Ottawa Ankle/Foot Rules positivo — Sn 96–98% (Polzer 2012; Bachmann 2003)'],
    tratamiento: 'Radiografía urgente tobillo y/o pie. No iniciar rehabilitación hasta descartar fractura.'
  },
  {
    id: 'fasciopatia-plantar',
    label: 'Fasciopatía plantar',
    color: 'var(--amber)',
    tests: ['windlass','calc-palp','first-step','silfver-fp'],
    criterios: ['Windlass + (Sp 100%)', 'Dolor en tuberosidad calcánea medial (Sn 78%)', 'Dolor primer paso (Sn 70–80%)', 'DF restringida rodilla extendida (OR 23.3)'],
    tratamiento: 'Carga progresiva + estiramiento Windlass + ESWT. Heel lift si equino gastroc asociado.'
  }
];

var TOBILLO_RECOM = {
  'ruptura-aquiles': { fases:[
    { label:'Manejo agudo — URGENTE', color:'#c0392b', items:[
      'INMOVILIZAR en equino (plantar flexión 20–30°) inmediatamente — Maffulli BMJ 1999',
      'Derivación urgente ortopedia/traumatología en 24–48 h',
      'Conservador vs. quirúrgico: mismo resultado funcional con protocolo temprano (Willits JBJS 2010)',
      'Protocolo conservador: bota equina → reducción progresiva semanas 0–8'
    ], ref:'Willits JBJS 2010' },
    { label:'Rehabilitación temprana (sem 6–16)', color:'#2d7a2d', items:[
      'Inicio fisioterapia semana 6–8 post-lesión o cirugía',
      'Movilización activa progresiva FP/DF en piscina desde semana 6',
      'Isométricos posición neutra semana 8–10',
      'Marcha sin asistencia semana 10–12 (según protocolo y adherencia)'
    ], ref:'Willits JBJS 2010' },
    { label:'Retorno a deporte (mes 4–12)', color:'#2563a8', items:[
      'No antes de 4–6 meses — criterio fuerza ≥80% contralateral',
      'HSR intensivo meses 3–6 bajo supervisión',
      'VISA-A ≥85 + Single Heel Rise ≥20 reps como criterios de alta funcional',
      'Riesgo re-ruptura 2–4% con seguimiento; brace recomendado 1 año'
    ], ref:'Maffulli BMJ 1999 · Willits JBJS 2010' }
  ], ref:'Willits JBJS 2010 · Maffulli BMJ 1999' },

  'tendinopatia-aquiles-mid': { fases:[
    { label:'Fase 1 — Carga inicial + educación (sem 0–4) · Grado A/B CPG 2024', color:'#b87a00', items:[
      'Core Outcome Set TA: VISA-A baseline + SHR reps sin dolor + dolor con actividad — Chimenti JOSPT CPG 2024',
      'Carga tendinosa desde el inicio, intensidad máxima tolerada — NO reposo completo (Grado A + B CPG 2024)',
      'Isométricos: 5 × 45 s elevación talón bilateral → analgesia inmediata — Rio BJSM 2015',
      'Educación: enfoque ciencia del dolor O patoanatómico — ambos válidos combinados con ejercicio (Grado B CPG 2024)',
      'Reducir carga de impacto si EVA >3/10 post-entrenamiento; heel lift 1.5 cm transitorio',
      'Factores pronósticos: TMK (kinesiofobia), VISA-A, BMI, fuerza — Hanlon et al., Chimenti 2024'
    ], ref:'Chimenti JOSPT CPG 2024 (Grado A/B) · Rio BJSM 2015' },
    { label:'Fase 2 — Heavy Slow Resistance ≥3×/sem (sem 4–12) · Grado A/E CPG 2024', color:'#2d7a2d', items:[
      'Carga tendinosa mínimo 3×/sem con intensidad máxima tolerada — Grado E CPG 2024 (Van der Vlist, Charles meta-análisis)',
      'HSR: igual eficacia que excéntrico Alfredson, mayor adherencia — Beyer AJSM 2015; ESWT + ejercicio ≈ ejercicio solo (Gatz RCT 2020)',
      'Protocolo Alfredson: 3 × 15 reps rodilla recta + flexionada, 2×/día — Alfredson AJSM 1998 (alternativa válida)',
      'Progresión: peso corporal → mochila → prensa — carrera cuando EVA post-carga ≤3/10 + VISA-A ≥40',
      'ESWT complementario sem 6–8 si respuesta insuficiente (no superior a ejercicio solo en meta-análisis)',
      'Terapia manual (movilización muscular/articular/fascia): puede utilizarse — Grado F CPG 2024'
    ], ref:'Chimenti JOSPT CPG 2024 (Grado A/E/F) · Beyer AJSM 2015 · Alfredson AJSM 1998' },
    { label:'Fase 3 — Retorno deportivo (sem 12–24)', color:'#2563a8', items:[
      'Alta funcional: VISA-A ≥90 + SHR ≥25 reps sin dolor + ausencia dolor con carga (Core Outcome Set — Chimenti 2024)',
      'Pliometría progresiva: bipodal → unipodal → drop jumps → específico del deporte',
      'Prevención recaída: HSR de mantenimiento 1–2×/sem en temporada — Meredith 2025',
      'Educación carga: pico semanal y carga acumulada = principales factores de recidiva',
      'Microtenotomía por radiofrecuencia si respuesta insuficiente a 2 años (Al-ani RCT, Nivel I)'
    ], ref:'Chimenti JOSPT CPG 2024 · Beyer AJSM 2015 · Meredith 2025' }
  ], ref:'Chimenti JOSPT CPG 2024 · Alfredson AJSM 1998 · Beyer AJSM 2015 · Hutchison Foot Ankle Surg 2013 · Matthews PeerJ 2021' },

  'tendinopatia-aquiles-ins': { fases:[
    { label:'Fase 1 — Control compresión insercional (sem 0–4)', color:'#b87a00', items:[
      'VISA-A baseline — criterio alta ≥80; Core Outcome Set: VISA-A + SHR + dolor con actividad',
      'EVITAR dorsiflexión completa — aumenta compresión en inserción calcánea — Jonsson Br J Sports Med 2008',
      'Isométricos en posición neutra: 5 × 45 s, 2×/día — analgesia y carga tendinosa inicial — Rio BJSM 2015',
      'Heel wedge bilateral 1.5 cm constante en calzado — reduce estrés insertional',
      'Suspender descensos, pendiente negativa y estiramientos en DF extrema',
      'Educación: diferencia midporción vs. insercional — ajustar expectativas de tiempo de recuperación'
    ], ref:'Jonsson Br J Sports Med 2008 · Rio BJSM 2015' },
    { label:'Fase 2 — HSR modificado + ESWT (sem 4–12)', color:'#2d7a2d', items:[
      'HSR en plano neutro/liso — sin descenso talón bajo plano horizontal (Jonsson modificado)',
      'Elevación talón: 3 × 15 reps, rango 0° a FP máxima; 3×/sem, intensidad progresiva — Chimenti CPG 2024',
      'Cadena posterior complementaria: glúteos, isquiosurales, tibial posterior',
      'ESWT focalizado en inserción: ≥3–4 sesiones semanas 4–8 — evidencia superior a excéntrico en insercional (Meredith 2025)',
      'Terapia manual: movilización articular + tejidos blandos puede utilizarse — Grado F Chimenti 2024'
    ], ref:'Jonsson 2008 · Meredith 2025 · Chimenti JOSPT CPG 2024' },
    { label:'Fase 3 — Retorno y seguimiento (sem 12–20)', color:'#2563a8', items:[
      'Alta funcional: VISA-A ≥80 + SHR ≥20 reps sin dolor + ausencia dolor primer paso post-actividad',
      'Mantener heel lift 6 meses durante entrenamiento de carga',
      'Deformidad de Haglund prominente + bursitis: valorar derivación a ortopedia — Meredith 2025',
      'Seguimiento VISA-A mensual — respuesta esperada ≥15 pts en 12 semanas',
      'Fasciotomía o bursectomía: considerar si >12 meses sin respuesta conservadora'
    ], ref:'Jonsson 2008 · Meredith 2025 · Chimenti 2024' }
  ], ref:'Jonsson Br J Sports Med 2008 · Meredith 2025 · Chimenti JOSPT CPG 2024 · Rio BJSM 2015' },

  'lesion-sindesmosial': { fases:[
    { label:'Fase 1 — Inmovilización (sem 0–6)', color:'#b87a00', items:[
      'RM OBLIGATORIA para confirmar y graduar — Sn >91% Sp 100% (Torre SEMCPT 2019)',
      'Sin diástasis: conservador = mismo resultado que quirúrgico (Candal-Couto 2004)',
      'Diástasis >2 mm en carga: derivar ortopedia urgente (tornillo o TightRope)',
      'Crioterapia + elevación primeros 5 días',
      'Bicicleta estática o piscina desde semana 2–3 (sin diástasis)'
    ], ref:'Torre SEMCPT 2019 · Williams Foot Ankle Int 2007' },
    { label:'Fase 2 — Rehabilitación (sem 6–12)', color:'#2d7a2d', items:[
      'Movilización rango completo progresivo una vez consolidado',
      'Fortalecimiento peroneos, tibial anterior y posterior',
      'Propiocepción en plano estable primero, luego inestable',
      'Evitar RE + dorsiflexión forzada hasta ≥10 semanas'
    ], ref:'Torre 2019 · Gerber Foot Ankle Int 1998' },
    { label:'Fase 3 — Retorno deportivo (sem 10–20)', color:'#2563a8', items:[
      'Retorno deporte ≥8–12 sem en lesión aislada sin cirugía',
      '≥4–6 meses si fijación quirúrgica',
      'Test carga en RE sin dolor → criterio funcional de alta',
      'Tape o bota preventiva resto de temporada'
    ], ref:'Williams 2007 · Gerber 1998' }
  ], ref:'Torre SEMCPT 2019 · Williams Foot Ankle Int 2007' },

  'esguince-agudo-lateral': { fases:[
    { label:'Fase 1 — POLICE (sem 0–1)', color:'#b87a00', items:[
      'POLICE (Protection, Optimal Loading, Ice, Compression, Elevation) — Grado A (Ruiz-Sanchez 2022)',
      'Soporte funcional (brace semirígido o vendaje funcional) — Grado A, preferible a escayola',
      'AINEs 48–72 h si EVA >6/10 — no uso prolongado (inhibe reparación) — Grado A',
      'Movilización activa tobillo desde día 1 dentro del umbral dolor (DF, circunducción)',
      'Crioterapia 15–20 min × 4–6 veces/día — primeras 72 h — Grado A'
    ], ref:'Vuurberg BJSM 2018 CPG · Ruiz-Sanchez Medicine 2022' },
    { label:'Fase 2 — Neuromuscular (sem 1–4)', color:'#2d7a2d', items:[
      'Ejercicios peroneos en CCC desde día 5 — Grado A en CPGs (Doherty 2017)',
      'Propiocepción en plano inestable: tabla de Freeman, foam pad — Mohammadi BJSM 2007',
      'Fortalecimiento isométrico evertores y flexores plantares',
      'Carga progresiva: bipodal → monopodal → superficie inestable',
      'Terapia manual: MWM de Mulligan + movilización tibiofibular → evidencia Grado A/B'
    ], ref:'Doherty BJSports Med 2017 · Vuurberg 2018' },
    { label:'Fase 3 — Retorno funcional (sem 3–8)', color:'#2563a8', items:[
      'Side Hop <12.87 s + Figure-8 Hop <17.35 s → criterios funcionales de alta (Galleher 2020)',
      'CAIT ≥28 como criterio de alta (Hiller JOSPT 2006; CPG APTA 2013)',
      'Brace preventivo primeras 8 sem en deporte de pivote — Grado A',
      'FIFA 11+: reduce incidencia de esguinces en fútbol 32% (Alhazmi PeerJ 2025)',
      'Educación: recurrencia 40% sin rehab estructurada — Doherty 2017'
    ], ref:'Doherty 2017 · Galleher 2020 · Alhazmi PeerJ 2025' }
  ], ref:'Vuurberg BJSM 2018 CPG · Ruiz-Sanchez Medicine 2022 · Doherty BJSports Med 2017' },

  'esguince-lateral-cronico': { fases:[
    { label:'Fase 1 — Evaluación y control (sem 0–2)', color:'#b87a00', items:[
      'CAIT baseline (<28 = IAC; MCID 3 puntos) — Hiller JOSPT 2006; CPG APTA 2013',
      'SEBT para cuantificar déficit postural — Plisky JOSPT 2006',
      'Quick-FAAM como outcome funcional (MCID >6.5%) — Galleher CPG 2020',
      'Fuerza peroneos con HHD — déficit frecuente en IAC',
      'Terapia manual: movilización traction-glide posterior — Vicenzino JOSPT 2006 Grado A'
    ], ref:'Doherty BJSports Med 2017 · Galleher CPG 2020' },
    { label:'Fase 2 — Rehab neuromuscular (sem 2–8)', color:'#2d7a2d', items:[
      'Entrenamiento neuromuscular efectivo a corto plazo para estabilidad — evidencia fuerte (Doherty 2017)',
      'Protocolo BAL (Balance, Agility, Landing) 6 semanas — McKeon BJSM 2008',
      'Eversión resistida progresiva: isométrica → isotónica → isocinética',
      'Hip strengthening (glúteo medio + rotadores externos) — evidencia emergente',
      'Kinesiotaping para retroalimentación propioceptiva durante ejercicio'
    ], ref:'Doherty 2017 · McKeon BJSM 2008' },
    { label:'Fase 3 — Retorno y prevención (sem 8–16)', color:'#2563a8', items:[
      'Side Hop <12.87 s + Figure-8 Hop <17.35 s → criterios alta funcional IAC',
      'CAIT ≥28 + SEBT asimetría <4 cm → alta',
      'Ankle stabilizer brace — evidencia fuerte para prevención recidiva (Doherty 2017)',
      'Broström modificado si persiste inestabilidad mecánica >12 sem de rehab',
      'Educación: 20–40% de esguinces agudos desarrollan IAC sin rehab (Doherty 2017)'
    ], ref:'Doherty 2017 · Galleher CPG 2020 · Hiller 2006' }
  ], ref:'Doherty BJSports Med 2017 · Galleher CPG 2020' },

  'contractura-gastrocnemio': { fases:[
    { label:'Programa de estiramiento (sem 0–8)', color:'#b87a00', items:[
      'Estiramiento gastrocnemio: rodilla extendida, pie neutro — 3 × 30 s × 2/día',
      'Estiramiento sóleo: rodilla flexionada — comparar ROM con Silfverskiöld',
      'Heel lift bilateral transitorio 4–6 semanas',
      'Si asociado a fasciopatía plantar: estiramiento Windlass simultáneo'
    ], ref:'DiGiovanni Foot Ankle Int 2002 · Meredith 2025' },
    { label:'Valoración quirúrgica (sem 8+ si refractario)', color:'#2563a8', items:[
      'Alargamiento gastrocnemio proximal (Strayer) si <5° DF persiste con rodilla extendida',
      'Indicación: síntomas discapacitantes + sin respuesta conservadora',
      'Post-cirugía: movilización temprana, fisioterapia semana 2'
    ], ref:'DiGiovanni 2002' }
  ], ref:'DiGiovanni Foot Ankle Int 2002' },

  'sebt-deficit': { fases:[
    { label:'Neuromuscular básico (sem 0–3)', color:'#b87a00', items:[
      'Single-leg balance en foam pad — 3 × 30 s × 3/sem',
      'SEBT en 3 direcciones: objetivo simetría <4 cm — Plisky JOSPT 2006',
      'Hip abductores + rotadores externos: relación cadera-tobillo',
      'Tabla de Freeman, disco equilibrio'
    ], ref:'Plisky JOSPT 2006 · Gribble JOSPT 2012' },
    { label:'Control dinámico avanzado (sem 3–6)', color:'#2d7a2d', items:[
      'Hop training: Side Hop, Figure-8 Hop — objetivos Galleher 2020',
      'Re-test SEBT semana 6 → criterio progresión',
      'Carga excéntrica peroneos y tibial posterior',
      'Entrenamiento campo si deporte específico'
    ], ref:'McKeon BJSM 2008 · Galleher 2020' }
  ], ref:'Plisky JOSPT 2006 · Galleher CPG 2020' },

  'ottawa-positivo': { fases:[
    { label:'Evaluación urgente', color:'#c0392b', items:[
      'Radiografía tobillo Y/O pie según zona de sensibilidad ósea — Ottawa Sn 96–98% (Polzer 2012)',
      'Examen diferido 3–5 días post-PRICE mejora Sn clínica ligamentos al 96% (Polzer 2012)',
      'No iniciar carga ni rehabilitación hasta descartar fractura por imagen',
      'Inmovilización provisional: vendaje compresivo + crioterapia + elevación',
      'Si fractura confirmada: derivar ortopedia para plan específico'
    ], ref:'Stiell Lancet 1992 · Gomes BMC Musculoskel 2022 · Polzer 2012' }
  ], ref:'Polzer Orthop Rev 2012 · Gomes BMC 2022 (n=8.560)' },

  'fasciopatia-plantar': { fases:[
    { label:'Fase 1 — Manejo dolor y carga inicial (sem 0–4)', color:'#b87a00', items:[
      'Estiramiento Windlass: 3 × 10 extensiones pasivas 1° MF en descarga antes de levantarse — DiGiovanni JBJS 2003',
      'Estiramiento gastrocnemio aislado (si Silfverskiöld +): 3 × 30 s × 2/día — DiGiovanni Foot Ankle Int 2002',
      'Heel lift bilateral 1 cm transitorio si DF <0° con rodilla extendida — reduce carga insercional',
      'Low-Dye taping o plantilla prefabricada arco longitudinal medial — reducción dolor inmediata — Martin CPG 2014',
      'Crioterapia local 15 min × 3/día en fase aguda'
    ], ref:'DiGiovanni JBJS 2003 · Martin JOSPT CPG 2014' },
    { label:'Fase 2 — Carga progresiva / HSR (sem 4–12)', color:'#2d7a2d', items:[
      'Ejercicios intrínsecos pie: short foot exercise, toe curl — carga intrínseca progresiva',
      'Heel raise excéntrico en escalón: 3 × 15 reps, 3×/sem — Rathleff BJSM 2015',
      'ESWT (ondas de choque): ≥3 sesiones semanas 4–8 si respuesta insuficiente — Maffulli 2010; Martin CPG 2014',
      'Inicio carrera en línea recta semana 8 si EVA post-actividad ≤3/10',
      'Monitoreo: recidiva de dolor primer paso = indicador de sobrecarga'
    ], ref:'Rathleff BJSM 2015 · Martin JOSPT CPG 2014' },
    { label:'Fase 3 — Retorno y prevención (sem 8–20)', color:'#2563a8', items:[
      'Alta funcional: caminata 5 km sin dolor + Windlass negativo + Dolor primer paso ausente',
      'Calzado con soporte arco longitudinal medial — primer año de seguimiento',
      'Plantilla personalizada si pie plano asociado o recidiva — DiGiovanni 2002',
      'Mantenimiento: estiramiento Windlass diario + cargas progresivas de pie',
      'Fasciotomía plantar parcial: sólo si >12 meses sin respuesta conservadora — Martin CPG 2014'
    ], ref:'Martin JOSPT CPG 2014 · DiGiovanni Foot Ankle Int 2002' }
  ], ref:'DiGiovanni Foot Ankle Int 2002 · Martin JOSPT CPG 2014 · Rathleff BJSM 2015 · Riddle JOSPT 2004' }
};

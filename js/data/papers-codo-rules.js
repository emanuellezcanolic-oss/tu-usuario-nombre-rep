// js/data/papers-codo-rules.js
// Reglas clínicas para motor diagnóstico de codo
// Fuentes:
//   Lucado AM et al. JOSPT 2022 — CPG Lateral Elbow Pain (Nivel I-II)
//   Tahir A et al. Cureus 2026 — Medial Epicondylitis Review
//   Bobos P et al. Arch PMR 2019 — Measurement Properties Grip Strength (meta-análisis)

// ── SÍNTOMAS CLÍNICOS para checklist estructurado ─────────────────────────
const CODO_SYMPTOMS = [
  // Región lateral
  { id: 'let-dolor-lateral',      label: 'Dolor en cara lateral del codo',               region: 'lateral',  icon: '🔴' },
  { id: 'let-ext-muneca',         label: 'Dolor al extender la muñeca / empujar',         region: 'lateral',  icon: '🔴' },
  { id: 'let-agarre',             label: 'Dolor al agarrar / apretón de mano',            region: 'lateral',  icon: '🔴' },
  { id: 'let-supinacion',         label: 'Dolor con supinación del antebrazo',            region: 'lateral',  icon: '🔴' },
  { id: 'let-golpe-lat',          label: 'Sensibilidad local epicóndilo lateral',         region: 'lateral',  icon: '🔴' },
  { id: 'let-irradiacion',        label: 'Irradiación hacia antebrazo distal',            region: 'lateral',  icon: '🔴' },
  // Región medial
  { id: 'me-dolor-medial',        label: 'Dolor en cara medial del codo',                 region: 'medial',   icon: '🟡' },
  { id: 'me-flex-muneca',         label: 'Dolor al flexionar la muñeca',                  region: 'medial',   icon: '🟡' },
  { id: 'me-pronacion',           label: 'Dolor con pronación del antebrazo',             region: 'medial',   icon: '🟡' },
  { id: 'me-agarre',              label: 'Dolor al cerrar el puño / agarrar',             region: 'medial',   icon: '🟡' },
  { id: 'me-golpe-med',           label: 'Sensibilidad local epicóndilo medial',          region: 'medial',   icon: '🟡' },
  { id: 'me-irradiacion',         label: 'Irradiación a antebrazo / muñeca (cara interna)',region: 'medial',  icon: '🟡' },
  // Neural cubital
  { id: 'cub-parestesias-4-5',    label: 'Parestesias / hormigueo 4° y 5° dedo',          region: 'neural',   icon: '🔵' },
  { id: 'cub-dolor-nocturno',     label: 'Dolor o síntomas nocturnos / en reposo',        region: 'neural',   icon: '🔵' },
  { id: 'cub-debilidad-mano',     label: 'Debilidad de mano / torpeza / pérdida de agarre',region: 'neural',  icon: '🔵' },
  { id: 'cub-pos-flex-codo',      label: 'Síntomas se agravan con flexión máx. codo',     region: 'neural',   icon: '🔵' },
  { id: 'cub-clunk',              label: 'Luxación nerviosa (sensación clunk medial)',     region: 'neural',   icon: '🔵' },
  // Inestabilidad / UCL
  { id: 'ucl-lanzador',           label: 'Deportista de lanzamiento (béisbol, jabalina, tenis)',region: 'instab', icon: '🟠' },
  { id: 'ucl-valgo',              label: 'Dolor con carga en valgo (lanzamiento late cocking)',region: 'instab', icon: '🟠' },
  { id: 'ucl-pop',                label: 'Pop / sensación de inestabilidad medial aguda', region: 'instab',   icon: '🟠' },
  // Rigidez post-traumática
  { id: 'rig-trauma',             label: 'Antecedente de fractura / cirugía de codo',     region: 'rigidez',  icon: '⚫' },
  { id: 'rig-limit-flex',         label: 'Limitación notable de flexión (no llega a 130°)',region: 'rigidez', icon: '⚫' },
  { id: 'rig-limit-ext',          label: 'Falta de extensión completa (no llega a 0°)',    region: 'rigidez',  icon: '⚫' },
];

// ── REGLAS DIAGNÓSTICAS ────────────────────────────────────────────────────
const CODO_RULES = {

  banderasRojas: [
    {
      id: 'fractura-codo',
      label: 'Trauma directo + deformidad / imposibilidad de movimiento',
      action: 'Sospecha fractura/luxación — radiografía urgente AP + lateral',
      color: 'red'
    },
    {
      id: 'septica-codo',
      label: 'Fiebre + dolor agudo + calor local de codo',
      action: 'Artritis séptica glenohumeral/cubital — derivar urgente',
      color: 'red'
    },
    {
      id: 'tumor-codo',
      label: 'Dolor nocturno en reposo sin antecedente traumático',
      action: 'Descartar lesión tumoral ósea — derivar médico',
      color: 'red'
    },
    {
      id: 'radiculopatia',
      label: 'Parestesias + debilidad + reflejos alterados',
      action: 'Sospecha radiculopatía C6-C7 o neuropatía periférica — evaluar columna cervical',
      color: 'red'
    }
  ],

  diagnosticos: [

    // ── EPICONDILALGIA LATERAL (LET / Tennis Elbow) ────────────────────────
    {
      id: 'epicondilalgia-lateral',
      nombre: 'Epicondilalgia Lateral (Codo de Tenis)',
      categoria: 'Lateral',
      colorKey: 'red',
      testsKey: ['cozen', 'chair-test'],
      testsSupportKey: ['mill', 'maudsley'],
      umbral: 1,
      symptomKeys: ['let-dolor-lateral', 'let-ext-muneca', 'let-agarre', 'let-supinacion', 'let-golpe-lat', 'let-irradiacion'],
      symptomUmbral: 2,
      criterio: 'Cozen positivo (Sn 84%, Sp 75%) + dolor lateral del codo + agravado por agarre/extensión muñeca. PFGS reducido ipsilateral confirma (Sn 65%, Sp 97%). Mill Stretch positivo alta especificidad (Sp 100%).',
      evidencia: 'Cozen: Sn 84%, Sp 75% — LET (Lucado 2022 CPG, Nivel I).\nMill\'s Stretch: Sn 53–76%, Sp 100% — alta especificidad (Lucado 2022).\nMaudsley (3° dedo extensión resistida): Sn 52% — ECRB específico.\nChair Lifting test: funcional LET, específico para actividades diarias.\nPFGS (grip sin dolor): Sn 65%, Sp 97%, MCID 7 kg — mejor predictor diagnóstico y de pronóstico (Bobos 2019 meta-análisis, Lucado 2022).\nEcografía: Sn 90–100%, Sp 83–100% para cambios estructurales tendinosos (Lucado 2022).',
      tratamiento: 'CPG 2022 Rec.B: Ejercicio resistido excéntrico/isométrico/concéntrico extensores muñeca (3×15, 6–12 semanas). Progresión: isométrico → isotónico → excéntrico sin provocar síntomas. Terapia manual (cervical/torácica) si hay restricciones asociadas. Dry needling Rec.B. No US como monoterapia (Rec.D). PRTEE gold standard de seguimiento (MCID 7 pts).',
      ref: 'Lucado AM et al. JOSPT 2022 (CPG Nivel I-II)\nBobos P et al. Arch PMR 2019 (meta-análisis)',
      imagingRec: 'Ecografía músculo-tendinosa (Sn 90–100%, Sp 83–100%) — Lucado 2022. Indicada si síntomas >12 semanas sin mejora o sospecha de rotura parcial/completa ECRB. RMN si ecografía normal con síntomas persistentes.'
    },

    // ── EPICONDILALGIA MEDIAL (Golfer's Elbow) ─────────────────────────────
    {
      id: 'epicondilalgia-medial',
      nombre: 'Epicondilalgia Medial (Codo de Golfista)',
      categoria: 'Medial',
      colorKey: 'amber',
      testsKey: ['golfer-elbow'],
      testsSupportKey: ['valgus-codo', 'milking'],
      umbral: 1,
      symptomKeys: ['me-dolor-medial', 'me-flex-muneca', 'me-pronacion', 'me-agarre', 'me-golpe-med', 'me-irradiacion'],
      symptomUmbral: 2,
      criterio: 'Golfer elbow test positivo (Sn 64%, Sp 69%) + dolor cara medial del codo + agravado por flexión muñeca y pronación. Hasta 20% presentan neuropatía cubital coexistente — evaluar siempre.',
      evidencia: 'Golfer Elbow test (flexión muñeca resistida + palpación epicóndilo medial): Sn 64%, Sp 69%.\nUltrasonografía: Sn 95.2%, Sp 92% para tendinopatía flexo-pronadora — Tahir et al. Cureus 2026.\nMRI gold standard: lesiones en señal T1/T2 del tendón flexo-pronador.\n20% de casos presentan afectación del nervio cubital asociada (Tahir 2026).',
      tratamiento: 'Fase 1: Reposo relativo, AINE tópico (1ª línea), crioterapia, modificación ergonómica. Fase 2: Ejercicio excéntrico de carga flexo-pronadora, propiocepción, terapia manual. Fase 3: Reintroducción gesto deportivo gradual, calentamiento, educación. Cirugía si falla conservador 6–12 meses.',
      ref: 'Tahir A et al. Cureus 2026 (Medial Epicondylitis Review)',
      imagingRec: 'Ecografía primer nivel (Sn 95.2%, Sp 92%) — Tahir 2026. RMN si hallazgos ecográficos normales con síntomas persistentes o ante sospecha de rotura completa. EMG si neuropatía cubital asociada.'
    },

    // ── SÍNDROME CANAL CUBITAL (Neuropatía Cubital) ────────────────────────
    {
      id: 'sindrome-canal-cubital',
      nombre: 'Síndrome del Canal Cubital (Neuropatía Cubital)',
      categoria: 'Neural',
      colorKey: 'blue',
      testsKey: ['tinel-cubital', 'elbow-flex-test'],
      testsSupportKey: [],
      umbral: 1,
      symptomKeys: ['cub-parestesias-4-5', 'cub-debilidad-mano', 'cub-dolor-nocturno', 'cub-pos-flex-codo', 'cub-clunk'],
      symptomUmbral: 2,
      criterio: 'Elbow Flexion Test positivo (Sn 75%, Sp 99%) — alta especificidad compresión cubital. Tinel positivo sobre canal cubital. Parestesias 4°/5° dedo reproducibles. EMG/NCS confirma.',
      evidencia: 'Elbow Flexion Test (codo en flexión máx + muñeca extendida 3 min): Sn 75%, Sp 99% — compresión n. cubital en canal cubital.\nTinel cubital: sensibilidad limitada aislada, alta especificidad si reproduce parestesias en distribución cubital.\nEMG/NCS: gold standard para cuantificar grado de neuropatía y guiar decisión quirúrgica.',
      tratamiento: 'Conservador: evitar flexión prolongada, férula nocturna en extensión 0–30°, educación postural. Si falla 3–6 meses: descompresión/transposición quirúrgica. EMG guía la indicación. Coexistencia con epicondilalgia medial: tratar ambas.',
      ref: 'Tahir A et al. Cureus 2026\nLucado AM et al. JOSPT 2022',
      imagingRec: 'EMG + Estudios de conducción nerviosa (NCS) — gold standard para cuantificar neuropatía cubital y guiar decisión quirúrgica. Ecografía de alta resolución como complemento para visualizar el nervio en el canal.'
    },

    // ── INESTABILIDAD MEDIAL / LESIÓN UCL ─────────────────────────────────
    {
      id: 'inestabilidad-ucl',
      nombre: 'Inestabilidad Medial / Lesión UCL',
      categoria: 'Inestabilidad',
      colorKey: 'orange',
      testsKey: ['valgus-codo', 'milking'],
      testsSupportKey: ['golfer-elbow'],
      umbral: 1,
      symptomKeys: ['ucl-lanzador', 'ucl-valgo', 'ucl-pop'],
      symptomUmbral: 2,
      criterio: 'Milking maneuver positivo (Sn 76%) + estrés en valgo positivo + contexto atleta overhead. Artroscopia / artro-RM gold standard para clasificación de rotura parcial vs completa.',
      evidencia: 'Milking Maneuver: Sn 76% — lesión UCL en atletas overhead.\nEstrés en valgo (20–30° flexión): apertura medial = inestabilidad colateral cubital.\nRMN con gadolinio (artro-RM): gold standard para rotura parcial o completa del UCL (LCU).',
      tratamiento: 'Conservador en rotura parcial: reposo, fisioterapia fortalecimiento flexo-pronador, 3–6 meses. Rotura completa con demanda alta: reconstrucción UCL (Tommy John). RTP atleta: criterios funcionales + psicológicos. Rehab post-Tommy John: 12–18 meses.',
      ref: 'Lucado AM et al. JOSPT 2022\nTahir A et al. Cureus 2026',
      imagingRec: 'Artro-RM (gold standard) para rotura parcial/completa UCL. Ecografía dinámica bajo estrés en valgo. RX con estrés (valgo) para cuantificar apertura medial en mm.'
    },

    // ── INESTABILIDAD LATERAL / LUCL ──────────────────────────────────────
    {
      id: 'inestabilidad-lucl',
      nombre: 'Inestabilidad Lateral (Lesión LUCL)',
      categoria: 'Inestabilidad',
      colorKey: 'orange',
      testsKey: ['lateral-pivot-codo'],
      testsSupportKey: [],
      umbral: 1,
      symptomKeys: ['ucl-pop'],
      symptomUmbral: 1,
      criterio: 'Lateral Pivot Shift positivo: Sp 100% — confirma inestabilidad rotatorio posterior (PLRI). Antecedente de trauma o luxación. RMN para evaluar LUCL.',
      evidencia: 'Lateral Pivot Shift test: Sp 100% — altamente específico para PLRI (inestabilidad rotatoria posterolateral). Muchos pacientes con PLRI tienen test negativo bajo anestesia general. RMN/artroscopia para confirmar.',
      tratamiento: 'Reconstrucción ligamentaria LUCL si inestabilidad clínica + fallo conservador. Rehabilitación preoperatoria: ROM conservado, fortalecimiento. Post-quirúrgico: 6–12 meses de rehab progresiva.',
      ref: 'Lucado AM et al. JOSPT 2022',
      imagingRec: 'RMN para evaluación LUCL. Artroscopia diagnóstica y terapéutica en casos complejos.'
    },

    // ── RIGIDEZ POST-TRAUMÁTICA ───────────────────────────────────────────
    {
      id: 'rigidez-codo',
      nombre: 'Rigidez Post-traumática de Codo',
      categoria: 'Articular',
      colorKey: 'text',
      testsKey: [],
      testsSupportKey: [],
      umbral: 0,
      symptomKeys: ['rig-trauma', 'rig-limit-flex', 'rig-limit-ext'],
      symptomUmbral: 2,
      criterio: 'Limitación de ROM post-trauma/cirugía. Arco funcional mínimo 30–130°. Déficit de extensión ≥30° o flexión ≤100° indica intervención. ROM activo vs pasivo orienta causa (miogénica/capsular).',
      evidencia: 'Arco funcional mínimo requerido: extensión 30° — flexión 130° (Morrey). Rigidez extrínseca (capsular/cicatrizal) vs intrínseca (articular). Abordaje conservador 6 meses con ≥50% recuperación esperada. Artrólisis si falla conservador.',
      tratamiento: 'Conservador: movilización suave precoz, termoterapia previa, ejercicios activos + pasivos, ortesis de elongación progresiva (estática progresiva o dinámica). Cirugía (artrólisis artroscópica/abierta) si fracasa >6 meses o déficit mayor.',
      ref: 'Lucado AM et al. JOSPT 2022 (ROM measures, evidencia B)',
      imagingRec: 'RX AP + lateral para cuerpos libres, heterotopia ósea. TC sin contraste para evaluación detallada de causa articular. RMN si sospecha contractura capsular aislada sin patología ósea.'
    }
  ]
};

// js/data/papers-cervical-rules.js
// EBM rules for cervical differential diagnosis
// Sources: Blanpied CPG 2017 (JOSPT) · Lin et al. Am J PMR 2025 · Thoomes et al. BMC MSK 2026
//          Rubio-Ochoa et al. Manual Therapy 2015 · Blomgren et al. BMC MSK 2018

// ── 22 symptom items across 5 regions ────────────────────────────────────────
const CERVICAL_SYMPTOMS = [
  // Radiculopatía cervical (NPRP)
  { id:'nprp-irradiacion',  label:'Dolor irradiado al brazo / dedo (dermátomo)', region:'radiculopatia', icon:'🔴' },
  { id:'nprp-parestesias',  label:'Parestesias / hormigueo en brazo o mano',     region:'radiculopatia', icon:'🔴' },
  { id:'nprp-debilidad',    label:'Debilidad muscular en brazo / mano',           region:'radiculopatia', icon:'🔴' },
  { id:'nprp-alivio-abd',   label:'Alivio al elevar brazo sobre la cabeza',       region:'radiculopatia', icon:'🔴' },
  { id:'nprp-reflejo',      label:'Alteración de reflejos tendinosos (asimetría D/I)', region:'radiculopatia', icon:'🔴' },
  { id:'nprp-cervicalgia',  label:'Cervicalgia + irradiación hombro → brazo → mano', region:'radiculopatia', icon:'🔴' },

  // Cefalea cervicogénica (NPHA)
  { id:'npha-cef-unilateral',label:'Cefalea unilateral occipital o fronto-orbital', region:'cefalea', icon:'🟡' },
  { id:'npha-cef-movimiento',label:'Cefalea desencadenada por movimiento cervical', region:'cefalea', icon:'🟡' },
  { id:'npha-rigidez-alta',  label:'Rigidez suboccipital / restricción C1-C2',      region:'cefalea', icon:'🟡' },
  { id:'npha-presion-cx',    label:'Punto gatillo suboccipital sensible a presión',  region:'cefalea', icon:'🟡' },
  { id:'npha-nauseas',       label:'Náuseas o fotofobia asociadas a cefalea',         region:'cefalea', icon:'🟡' },

  // WAD / Coordinación (NPMCI)
  { id:'npmci-whiplash',     label:'Antecedente trauma cervical / whiplash',          region:'wad', icon:'🟠' },
  { id:'npmci-mareos',       label:'Mareos o inestabilidad asociados al dolor',       region:'wad', icon:'🟠' },
  { id:'npmci-fatiga',       label:'Fatiga muscular cervical con carga postural',      region:'wad', icon:'🟠' },
  { id:'npmci-hiperalgesia', label:'Hiperalgesia generalizada / sensibilización central', region:'wad', icon:'🟠' },
  { id:'npmci-nocturno',     label:'Dolor en reposo o nocturno sin patrón mecánico',  region:'wad', icon:'🟠' },

  // Déficit movilidad (NPMD)
  { id:'npmd-rigidez',       label:'Rigidez cervical matutina o ROM claramente limitado', region:'movilidad', icon:'🔵' },
  { id:'npmd-dolor-local',   label:'Dolor cervical local sin irradiación distal',         region:'movilidad', icon:'🔵' },
  { id:'npmd-mecanico',      label:'Dolor mecánico: empeora con movimiento, mejora reposo', region:'movilidad', icon:'🔵' },

  // Mielopatía (screening / banderas rojas funcionales)
  { id:'miel-torpeza',       label:'Torpeza o pérdida motricidad fina en manos',      region:'mielopatia', icon:'⚠️' },
  { id:'miel-marcha',        label:'Marcha inestable / ataxia',                        region:'mielopatia', icon:'⚠️' },
  { id:'miel-disestesias',   label:'Disestesias bilaterales en manos / pies',          region:'mielopatia', icon:'⚠️' },
];

// ── Diagnostic rules (EBM) ───────────────────────────────────────────────────
const CERVICAL_RULES = {
  banderasRojas: [
    { id:'trauma-cx',      label:'Trauma alta energía — fractura/luxación posible',     accion:'Derivar a urgencias — RX antes de movilizar' },
    { id:'mielopatia-br',  label:'Mielopatía (marcha inestable, disestesias bilaterales manos/pies)', accion:'Derivar neurología/neurocirugía urgente' },
    { id:'insuf-vb',       label:'Insuf. vertebrobasilar: dizziness + diplopia + disartria/disfagia', accion:'Contraindicación absoluta de manipulación' },
    { id:'inestab-lig-cx', label:'Inestabilidad ligamentaria alta (AR, Down, post-trauma)',            accion:'Sharp-Purser · NO manipulación sin imagen previa' },
    { id:'cancer-cx',      label:'Dolor nocturno severo + síntomas constitucionales (cáncer, infección)', accion:'Derivar a médico — imagen urgente' },
  ],

  diagnosticos: [
    // ── 1. NPRP — Radiculopatía ───────────────────────────────────────────────
    {
      id: 'radiculopatia-cx',
      nombre: 'Radiculopatía cervical (NPRP)',
      categoria: 'NPRP',
      colorKey: 'red',
      testsKey:        ['spurling', 'distraccion-cx', 'ultt1'],
      testsSupportKey: ['abd-alivio', 'jackson-cx', 'valsalva-cx', 'ultt2', 'ultt3'],
      symptomKeys: ['nprp-irradiacion','nprp-parestesias','nprp-debilidad','nprp-alivio-abd','nprp-reflejo','nprp-cervicalgia'],
      umbral: 2,
      symptomUmbral: 2,
      criterio: 'Wainner 2003 CPR: 3/4 positivos (Spurling + Distracción + ULTT1 + rot <60°) → LR+ 6.1. 4/4 → LR+ 30.3 / Sp 0.99. Irradiación + parestesias en dermátomo = sospecha alta.',
      evidencia: 'Spurling: Sn 0.53 / Sp 0.92 / LR+ 3.28 / LR- 0.28 (Lin et al. Am J PMR 2025 — meta-análisis 8 estudios, n=8).\nCon extensión/rotación: Sn 0.67 / Sp 0.93.\nULTT1 (ULNT mediano): Sn 0.70 / Sp 0.71 (Thoomes et al. BMC MSK 2026).\nULNTs combinados (3+4): Sn 0.97 / Sp 0.51.\nShoulder Abduction Relief: Sn 0.49 / Sp 0.76.\nDistracción: Sp 0.90 — alta para descartar compresión.',
      tratamiento: '• Tracción cervical manual/mecánica (Rec. A) · 8–10 sesiones\n• Ejercicio cervical + escápulo-torácico\n• Educación en neurociencia del dolor\n• Collar blando solo en agudo muy severo (<1 semana)\n• Derivar si déficit motor progresivo o pérdida de fuerza\n• RMN si sin mejoría a 4–6 semanas',
      ref: 'Blanpied et al. JOSPT 2017 CPG (Rec. A) · Wainner 2003 · Lin et al. Am J PMR 2025 · Thoomes et al. BMC MSK 2026',
    },

    // ── 2. NPHA — Cefalea cervicogénica ──────────────────────────────────────
    {
      id: 'cefalea-cervicogenica',
      nombre: 'Cefalea cervicogénica (NPHA)',
      categoria: 'NPHA',
      colorKey: 'amber',
      testsKey:        ['flexion-rot'],
      testsSupportKey: ['ppivm-c0c3', 'crfl-test'],
      symptomKeys: ['npha-cef-unilateral','npha-cef-movimiento','npha-rigidez-alta','npha-presion-cx','npha-nauseas'],
      umbral: 1,
      symptomUmbral: 2,
      criterio: 'CFRT: <32° o asimetría >10° = positivo. Restricción rotación C1-C2. Cefalea unilateral reproducida por movimiento cervical. Distinguir de migraña: sin aura ni síntomas autonómicos.',
      evidencia: 'CFRT: Sn 0.91 / Sp 0.90 — mayor precisión diagnóstica de todos los tests para CGH (Rubio-Ochoa et al. Manual Therapy 2015 — revisión sistemática 8 estudios).\nFiabilidad CFRT ICC 0.93 intrasesión / 0.85 intersesión.\nPPIVM C0-C3: alta validez para hipomobilidad segmentaria alta.\nLa reproducción de la cefalea habitual con CFRT = confirma origen cervical.',
      tratamiento: '• Manipulación/movilización C1-C2 (Rec. A) — mayor evidencia disponible\n• CFRT como herramienta de seguimiento\n• Ejercicio estabilizador DCF (Rec. B)\n• Educación diferencial CGH vs migraña\n• Punción seca trigger suboccipital (Rec. C)\n• Evitar AINEs crónicos sin supervisión médica',
      ref: 'Blanpied et al. JOSPT 2017 CPG · Rubio-Ochoa et al. Manual Therapy 2015 · Jull et al. Spine 2002',
    },

    // ── 3. NPMCI — WAD / Disfunción coordinación ─────────────────────────────
    {
      id: 'npmci-wad',
      nombre: 'Disfunción coordinación / WAD (NPMCI)',
      categoria: 'NPMCI',
      colorKey: 'orange',
      testsKey:        [],
      testsSupportKey: ['sharp-purser', 'alar-lig'],
      symptomKeys: ['npmci-whiplash','npmci-mareos','npmci-fatiga','npmci-hiperalgesia','npmci-nocturno'],
      umbral: 0,
      symptomUmbral: 2,
      criterio: 'CCFT falla <26 mmHg + NFE reducido. Antecedente whiplash o postura sostenida. Sensibilización central posible (dolor difuso, hiperalgesia). CCFT es el gold standard para DCF.',
      evidencia: 'CCFT: evidencia fuerte para disfunción DCF en dolor cervical (Blomgren et al. BMC MSK 2018 — 12 RCTs).\nDCF training mejora coordinación neuromuscular (effect size grande).\nNFE normal: >39 s H / >29 s M.\nWAD Grado I: sin déficit neurológico · Grado II: signos musculoesqueléticos · Grado III: déficit neurológico.\nEvitar manipulación en WAD agudo (primeras 2 semanas).',
      tratamiento: '• CCFT como ejercicio terapéutico (22→30 mmHg progresivo)\n• NFE entrenamiento endurance + estabilización profunda\n• Evitar manipulación en WAD agudo (Rec. E contraindicación relativa)\n• Educación en neurociencia del dolor + autocuidado\n• Graded exposure a movimiento progresivo\n• Psicosocial: catastrofismo, kinesofobia (banderas amarillas)',
      ref: 'Blanpied et al. JOSPT 2017 · Blomgren et al. BMC MSK 2018 · Quebec Task Force on WAD',
    },

    // ── 4. NPMD — Déficit de movilidad ───────────────────────────────────────
    {
      id: 'npmd',
      nombre: 'Déficit de movilidad cervical (NPMD)',
      categoria: 'NPMD',
      colorKey: 'neon',
      testsKey:        ['ppivm-c0c3'],
      testsSupportKey: ['sharp-purser', 'dvat-test'],
      symptomKeys: ['npmd-rigidez','npmd-dolor-local','npmd-mecanico'],
      umbral: 0,
      symptomUmbral: 2,
      criterio: 'ROM limitado (>2 planos o MDC superado). Restricción segmental palpable (PAIVM/PPIVM). Dolor local sin irradiación. Ausencia de signos neurológicos. Buena respuesta a movilización manual.',
      evidencia: 'Manipulación cervical: NNT 3 para reducción de dolor en agudo (Blanpied 2017 Rec. A).\nROM: ICC CROM 0.74–0.98 dependiendo del movimiento (Prushansky & Dvir 2008).\nMDC rotación: 7–10° · MDC flex/ext: 8–12°.\nManipulación + ejercicio > solo ejercicio o solo manipulación (Rec. A).',
      tratamiento: '• Manipulación/movilización cervical y torácica (Rec. A)\n• ROM activo y pasivo dirigido\n• Ejercicio de estiramiento cervical\n• Calor local + TENS como adjunto (Rec. C)\n• Alta progresiva con programa domiciliario\n• Ergonomía postural laboral',
      ref: 'Blanpied et al. JOSPT 2017 CPG · Prushansky & Dvir 2008 · Lin et al. Br J Sports Med 2019',
    },

    // ── 5. Mielopatía cervical (screening / bandera roja funcional) ───────────
    {
      id: 'mielopatia-cx',
      nombre: 'Sospecha mielopatía cervical (UMN)',
      categoria: 'Mielopatía',
      colorKey: 'red',
      testsKey:        ['hoffmann', 'lhermitte'],
      testsSupportKey: ['inv-sup', 'finger-esc', 'step-test'],
      symptomKeys: ['miel-torpeza','miel-marcha','miel-disestesias'],
      umbral: 1,
      symptomUmbral: 1,
      criterio: '⚠️ CUALQUIER test UMN positivo = derivación urgente. Hoffmann Sn 0.58 / Sp 0.78. Lhermitte: descarga eléctrica con flexión = compresión cordón posterior. NO continuar tratamiento manual.',
      evidencia: 'Hoffmann: Sn 0.58 / Sp 0.78 / LR+ 2.6 (Cook et al. JOSPT 2009).\nLhermitte: Sp 0.90 — alta para confirmar compromiso medular.\nFinger Escape: alta especificidad para mielopatía avanzada (T1).\nTandem Gait: ataxia medular — Sp >0.95 en mielopatía confirmada.\nBabinski + Hoffmann combinados: Sp cercana a 1.0.',
      tratamiento: '⚠️ DERIVACIÓN URGENTE — No continuar tratamiento manual sin clearance.\n• RMN cervical urgente\n• Evaluación neurológica / neuroquirúrgica\n• Cirugía descompresiva si indicado\n• Rehabilitación postquirúrgica con kinesioterapia supervisada',
      ref: 'Blanpied et al. JOSPT 2017 · Cook et al. JOSPT 2009 · Iyer et al. Neurosurgery 2016',
    },
  ],
};

// ── PIE / FOOT — Evidence-Based Data ────────────────────────────────────────
// Sources:
//   Koc et al. JOSPT CPG 2023 (Heel Pain – Plantar Fasciitis, Revision 2023)
//   Nweke TC. Comprehensive Review & Evidence-Based Treatment Framework 2025
//   Tien CH et al. Comparative effectiveness minimally invasive therapies PF.
//     Scientific Reports 2026 (SR&MA 63 RCTs n=4170)
//   Ettinger S et al. Hallux Valgus: Prevalence & Treatment Options.
//     Dtsch Arztebl Int 2025;122:308-14
//   ACR Appropriateness Criteria: Chronic Foot Pain – Update 2025
// ─────────────────────────────────────────────────────────────────────────────

const PIE_FASCITIS_TESTS = [
  {
    id: 'palp-tuberculo',
    name: 'Palpación tubérculo medial calcáneo',
    sub: 'Dolor máximo puntual en cara inferomedial del talón (origen fascia plantar sobre tubérculo medial)',
    ref: 'Signo cardinal FP — Koc JOSPT CPG 2023; Nweke 2025. Sensibilidad elevada; palpación es el hallazgo clínico más consistente',
  },
  {
    id: 'windlass',
    name: 'Windlass Test (Jack\'s Test)',
    sub: 'Dorsiflexión pasiva del hallux → tensión fascia → reproducción dolor en talón/arco plantar',
    ref: 'Sn 0.32–0.54 / Sp 0.96–1.00 (Batt 2009) — Alta especificidad; útil para confirmar FP. Koc JOSPT CPG 2023; Nweke 2025',
  },
  {
    id: 'heel-squeeze',
    name: 'Heel Squeeze Test',
    sub: 'Compresión bilateral calcáneo entre pulgar e índice → (+) sugiere fractura de estrés; (−) más compatible con FP',
    ref: 'Diferencial fractura estrés calcáneo — Nweke 2025; ACR Chronic Foot Pain 2025. Positivo → derivar RX/ECO',
  },
  {
    id: 'dorsiflexion-deficit',
    name: 'Déficit dorsiflexión tobillo (<10° NWB)',
    sub: 'DF en carga en lunge test <4 cm o DF NWB <10° → factor de riesgo independiente fascitis plantar (tight calf)',
    ref: 'Factor de riesgo biomecánico FP — Koc JOSPT CPG 2023; Riddle JOSPT 2003; limitación DF aumenta carga sobre fascia',
  },
  {
    id: 'primer-paso',
    name: 'Dolor primer paso matinal',
    sub: 'Dolor severo en talón al levantarse tras reposo nocturno — cede parcialmente con la marcha (signo patognomónico)',
    ref: 'Patrón diagnóstico característico FP — Koc JOSPT CPG 2023; Nweke 2025. Presente en >75% de los casos',
  },
  {
    id: 'dolor-carga',
    name: 'Dolor con carga / bipedestación prolongada',
    sub: 'Dolor talón que aumenta progresivamente tras períodos de bipedestación o caminata prolongados',
    ref: 'Criterio clínico FP — Koc JOSPT CPG 2023. Diferencia FP de radiculopatía S1 (empeora con reposo)',
  },
];

const PIE_HALLUX_TESTS = [
  {
    id: 'inspeccion-hv',
    name: 'Inspección deformidad Hallux Valgus',
    sub: 'Desviación lateral del hallux + desviación medial 1° metatarsiano; exostosis medial (juanete); valorar leve/moderado/grave',
    ref: 'Evaluación clínica estándar HV — Ettinger Dtsch Arztebl Int 2025; Prevalencia ~2%; 83% mujeres. Clasificar grado deformidad',
  },
  {
    id: 'rom-1mtf',
    name: 'ROM 1° articulación MTF',
    sub: 'Normal: dorsiflexión 70°, flexión plantar 30°. Rigidez significativa = hallux rigidus. Valorar crepitación articular',
    ref: 'Evaluación articular MTF — Ettinger Dtsch Arztebl Int 2025. Rigidez severa → derivar Qx; AOFAS mejora promedio 33.8 pts post-Qx',
  },
  {
    id: 'alineacion-dedos',
    name: 'Alineación dedos menores',
    sub: 'Dedos en martillo / en garra / deformidades asociadas; úlceras de presión por calzado; síntomas metatarsalgia transferida',
    ref: 'Complicación frecuente HV severo — Ettinger Dtsch Arztebl Int 2025. Presente en casos moderados/graves con desviación hallux',
  },
  {
    id: 'dolor-calzado',
    name: 'Dolor reproducible con calzado estrecho',
    sub: 'Dolor/eritema sobre exostosis medial al usar calzado ajustado → compromiso funcional y limitación actividad diaria',
    ref: 'Criterio sintomático HV — Ettinger Dtsch Arztebl Int 2025. HV asintomático no requiere estudios de rutina',
  },
];

const PIE_REGLAS = [
  {
    id: 'fascitis-plantar',
    nombre: 'Fascitis Plantar',
    criterios: ['Palpación tubérculo', 'Windlass', 'primer paso', 'carga'],
    minPos: 2,
    descripcion: 'Entesopatía degenerativa por sobrecarga del origen de la fascia plantar en el tubérculo medial del calcáneo. Causa más frecuente de dolor de talón (11–15% de todas las consultas de pie).',
    recom: [
      'Fase 1 — Inicial (0–6 sem): Estiramiento específico fascia plantar + gastroc/sóleo (Grado A, CPG 2023) · Taping plantar rígido o elástico (Grado A) · Crioterapia local · Modificación actividad · Calzado con soporte arco/talón acolchado',
      'Fase 2 — Subaguda (6–12 sem): Terapia manual articular + tejido blando (Grado A, CPG 2023) · Ortesis prefabricada (Grado B) · MTrP gastroc/sóleo/fibulares · Fisioterapia supervisada 2–3x/sem',
      'Fase 3 — Crónica (>6 meses): ESWT (amplia evidencia — 63 ECAs; eficacia en todos los dominios, Tien 2026) · PRP: mejora función y grosor fascia a largo plazo · Proloterapia: alivio dolor sostenido · Toxina botulínica A: mayor alivio corto plazo · Dry needling fascia/puntos gatillo',
      'Red flags: Heel Squeeze (+) → descartar fractura estrés calcáneo (RX o ecografía urgente). Déficit neurológico distal → descartar síndrome túnel tarsiano (ACR 2025). No mejoría a 3 meses → reevaluar diagnóstico, considerar imagen',
    ],
    ref: 'Koc JOSPT CPG 2023 · Nweke 2025 · Tien et al. Scientific Reports 2026 (SR&MA)',
  },
  {
    id: 'hallux-valgus',
    nombre: 'Hallux Valgus',
    criterios: ['Inspección deformidad', 'dolor calzado'],
    minPos: 2,
    descripcion: 'Deformidad progresiva del hallux con desviación lateral y prominencia medial de la 1° MTF (juanete). Etiología multifactorial. Prevalencia ~2%; 83% en mujeres.',
    recom: [
      'Fase 1 — Conservador (HV leve/moderado): Calzado amplio sin compresión medial · Separadores digitales · Ortesis de corrección nocturna · Ortosis plantar según biomecánica · Objetivo: control sintomático y prevención progresión',
      'Fase 2 — Fisioterapia: Fortalecimiento musculatura intrínseca (abductor hallucis) · Movilización activa/pasiva 1° MTF · Taping corrector · AINE tópico en exacerbaciones inflamatorias',
      'Fase 3 — Quirúrgico (HV moderado-grave sintomático sin respuesta conservadora): Las técnicas disponibles logran corrección angular comparable. AOFAS mejora promedio 33.8 pts (IC95%: 30.5–37.0, Ettinger 2025). Tasa complicaciones 18.5%: metatarsalgia de transferencia, deformidad recurrente, hallux varus',
      'Derivación: HV grave · Hallux rigidus asociado · Deformidades dedos menores asociadas → Cirugía pie-tobillo',
    ],
    ref: 'Ettinger S et al. Dtsch Arztebl Int 2025;122:308–14',
  },
  {
    id: 'fractura-estres-calcaneo',
    nombre: 'Sospecha Fractura de Estrés Calcáneo',
    criterios: ['Heel Squeeze'],
    minPos: 1,
    descripcion: 'Heel squeeze (+) con dolor difuso en calcáneo sin foco en tubérculo medial → alta sospecha fractura de estrés. Requiere imagen urgente.',
    recom: [
      'Derivación urgente: RX calcáneo (sensibilidad baja en agudo) + ECO/RMN si alta sospecha clínica (ACR Appropriateness 2025)',
      'Manejo conservador: descarga total · bota de yeso o bota ortopédica 6–8 sem · Sin carga hasta resolución dolor',
      'Red flags: Antecedentes de triada atlética, osteoporosis, corticoides crónicos, amenorrea → mayor riesgo fractura estrés. Evaluar densitometría',
    ],
    ref: 'ACR Appropriateness Criteria: Chronic Foot Pain – Update 2025 · Nweke 2025',
  },
];

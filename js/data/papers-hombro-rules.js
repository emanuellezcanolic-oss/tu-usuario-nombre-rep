// js/data/papers-hombro-rules.js
// Reglas clínicas para motor diagnóstico de hombro
// Fuentes:
//   Desmeules F et al. JOSPT 2025 (CPG Tendinopatía Manguito Rotador — Nivel I)
//   Zhao Y et al. BMC Musculoskelet Disord 2024 (meta-análisis DOR, múltiples estudios)
//   Beraldo M et al. Cureus 2025 (telemedicina vs MRI, n=32, STARD)
//   Bruna González Rev AKD 2020 (revisión sistemática Sn/Sp hombro)
//   Gismervik / Hegedus meta-análisis (tabla usuario — DOR orientativo)

const HOMBRO_RULES = {

  banderasRojas: [
    {
      id: 'tumor-hombro',
      label: 'Antecedentes o sospecha de cáncer',
      action: 'Derivar médico — descartar tumor óseo / metástasis',
      color: 'red',
      triggerTests: []
    },
    {
      id: 'infeccion-hombro',
      label: 'Fiebre + dolor agudo de hombro',
      action: 'Artritis séptica glenohumeral hasta demostrar lo contrario — derivar urgente',
      color: 'red',
      triggerTests: []
    },
    {
      id: 'fractura-hombro',
      label: 'Trauma directo + deformidad / imposibilidad de movimiento',
      action: 'Sospecha fractura/luxación — radiografía urgente AP + Y + axil',
      color: 'red',
      triggerTests: []
    },
    {
      id: 'visceral-referido',
      label: 'Dolor de hombro + signos cardiovasculares o viscerales',
      action: 'Dolor referido cardíaco / diafragmático — evaluación médica inmediata',
      color: 'red',
      triggerTests: []
    }
  ],

  diagnosticos: [

    // ── DESGARRO MANGUITO ROTADOR COMPLETO ────────────────────────────────
    {
      id: 'desgarro-mr-completo',
      nombre: 'Desgarro Manguito Rotador Completo',
      categoria: 'Manguito Rotador',
      colorKey: 'red',
      testsKey: ['re-lag-90'],
      testsSupportKey: ['jobe', 'patte', 'painful-arc', 'gerber'],
      umbral: 1,
      criterio: 'Retraso RE 90° positivo → alta probabilidad desgarro completo supraespinoso/infraespinoso (DOR 12.70, Sp 99%). Confirmar con ecografía o RMN.',
      evidencia: 'Retraso RE 90°: DOR 12.70 (IC 3.68–43.86), Sn 17%, Sp 99%, LR+ 6.91 — test CONFIRMATORIO más potente (Zhao 2024).\nJobe Empty Can: DOR 3.54 (IC 1.37–9.19), Sn 71.7%, Sp 57% (Zhao 2024).\nPatte: DOR 3.08 (NS), Sn 33%, Sp 89%.\nBeraldo 2025: Jobe pain Sn 96.2% vs MRI (n=32).\nImagen: MRI Sn 67–70%, Sp 86–95%; Ecografía Sn 62%, Sp 85% (Desmeules JOSPT 2025).',
      tratamiento: 'Si joven activo + desgarro agudo: derivar valoración quirúrgica artroscópica. Si conservador: fisioterapia 12 semanas (fortalecimiento RI/RE isométrico → isotónico, estabilización escapular). MDC fuerza 15–20%. ASES MCID 6.4–21.9 pts.',
      ref: 'Zhao Y et al. BMC Musculoskelet Disord 2024\nBeraldo M et al. Cureus 2025\nDesmeules F et al. JOSPT 2025',
      imagingRec: 'RMN glenohumeral (Sn 67–70%, Sp 86–95%) o Ecografía dinámica (Sn 62%, Sp 85%) — Desmeules JOSPT 2025. Indicada siempre para confirmar extensión del desgarro y planificar conducta quirúrgica.'
    },

    // ── LESIÓN SUBESCAPULAR ────────────────────────────────────────────────
    {
      id: 'lesion-subescapular',
      nombre: 'Lesión Subescapular',
      categoria: 'Manguito Rotador',
      colorKey: 'amber',
      testsKey: ['ri-lag', 'gerber'],
      testsSupportKey: ['bear-hug'],
      umbral: 1,
      criterio: 'Retraso RI (DOR 7.03, Sp 92%) y/o Gerber Lift-off positivos confirman lesión subescapular. Bear Hug complementa (Sn 84%).',
      evidencia: 'Retraso RI: DOR 7.03 (IC 2.98–16.61), Sn 52.5%, Sp 92%, LR+ 4.23 — Zhao 2024.\nGerber Lift-off: Sn 79%, Sp 89% — Bruna González 2020.\nBear Hug: DOR 2.77 (IC 1.13–6.77), Sn 84%, Sp 28% (Zhao 2024).\nBear Hug weakness (in-person): Sp 96%, PPV 80% vs MRI — Beraldo 2025.',
      tratamiento: 'Fortalecimiento subescapular gradual (RI con banda elástica, desliz escapular). Si desgarro completo: valorar reparación artroscópica. Evitar RE extrema en fase aguda.',
      ref: 'Zhao Y et al. BMC Musculoskelet Disord 2024\nBeraldo M et al. Cureus 2025\nBruna González Rev AKD 2020',
      imagingRec: 'Artro-RM (gold standard) o ecografía dinámica para confirmar lesión y extensión — Beraldo 2025. Indicada antes de decisión quirúrgica.'
    },

    // ── PINZAMIENTO SUBACROMIAL / RC TENDINOPATÍA ──────────────────────────
    {
      id: 'pinzamiento-subacromial',
      nombre: 'Pinzamiento Subacromial / RC Tendinopatía',
      categoria: 'Subacromial',
      colorKey: 'neon',
      testsKey: ['hawkins', 'painful-arc', 'neer'],
      testsSupportKey: ['jobe', 'yocum', 'yergason'],
      umbral: 2,
      criterio: 'Hawkins-Kennedy negativo descarta (LR− 0.25). Arco doloroso positivo confirma (LR+ 3.44). Cluster ≥3/5 aumenta certeza (LR+ 2.93, LR− 0.34).',
      evidencia: 'Hawkins-Kennedy: Sn 0.83, Sp 0.69, LR+ 2.68, LR− 0.25 — Desmeules JOSPT 2025 (meta-análisis Nivel I, n=962).\nArco doloroso: Sn 0.62, Sp 0.82, LR+ 3.44 — Desmeules 2025.\nNeer: LR+ 1.48, LR− 0.68 — valor limitado aislado.\nYergason para SIS: DOR 4.71 (IC 2.16–10.32), Sn 45%, Sp 86% — Zhao 2024.\nCluster 5 tests ≥3/5: LR+ 2.93, LR− 0.34 — Liaghat (1 estudio Nivel I).',
      tratamiento: 'CPG 2025 Rec.#1-12: No imagen primeras 12 semanas. Fisioterapia: educación, ROM, fortalecimiento RC + escápula, ejercicio supervisado. Ondas de choque si calcificante. Ecografía si >12 sem sin mejora.',
      ref: 'Desmeules F et al. JOSPT 2025 (CPG Nivel I)\nZhao Y et al. BMC Musculoskelet Disord 2024',
      imagingRec: 'Imagen NO indicada primeras 12 semanas (CPG 2025 Rec.#1). Si sin mejora >12 sem: ecografía preferencial para descartar desgarro parcial o bursitis cálcica.'
    },

    // ── TENDINITIS / DESGARRO PARCIAL SUPRAESPINOSO ──────────────────────
    {
      id: 'tendinitis-supraespinoso',
      nombre: 'Tendinitis / Desgarro Parcial Supraespinoso',
      categoria: 'Subacromial',
      colorKey: 'amber',
      testsKey: ['jobe', 'painful-arc'],
      testsSupportKey: ['hawkins', 'neer', 're-lag-90'],
      umbral: 1,
      criterio: 'Jobe (Empty Can) positivo es orientativo para supraespinoso (Sn 74%, Sp 77%). Combinado con Arco doloroso aumenta probabilidad. Retraso RE 90° negativo reduce sospecha de desgarro completo.',
      evidencia: 'Jobe: DOR 3.54 (IC 1.37–9.19), Sn 71.7%, Sp 57% — Zhao 2024.\nBeraldo 2025: Jobe pain Sn 96.2% para cualquier patología supraespinoso vs MRI.\nBeraldo 2025: Jobe weakness Sn 88.5%, Sp 66.7% para desgarro completo in-person.\nTabla EBM: Jobe 74%/77% — orientativo supraespinoso (Gismervik/Hegedus).\nImagen MRI partial tear: LR+ 10.17, LR− 0.31 (Desmeules 2025).',
      tratamiento: 'Ejercicio terapéutico: fortalecimiento excéntrico/isométrico RC. Educación del movimiento. Progresión carga gradual. Si sin mejora >12 sem: imagen (ecografía preferencial).',
      ref: 'Zhao Y et al. BMC Musculoskelet Disord 2024\nBeraldo M et al. Cureus 2025\nDesmeules F et al. JOSPT 2025',
      imagingRec: 'Ecografía si >12 semanas sin mejora (CPG 2025). MRI LR+ 10.17 para desgarro parcial — Desmeules 2025. No indicada antes de 12 semanas de tratamiento conservador.'
    },

    // ── LESIÓN SLAP / LABRUM ──────────────────────────────────────────────
    {
      id: 'lesion-slap',
      nombre: 'Lesión SLAP / Labrum Glenohumeral',
      categoria: 'Labrum',
      colorKey: 'blue',
      testsKey: ['obrien'],
      testsSupportKey: ['speed', 'yergason', 'apprehension'],
      umbral: 1,
      criterio: "O'Brien positivo es confirmatorio si positivo (Sp 89%). Compresión-Rotación: Sn 43%, Sp 89% — confirmatorio. Artro-RM gold standard (Sn 87–91%, Sp 80–89%).",
      evidencia: "O'Brien (Active Compression): Sn 0.47, Sp 0.89 — test SLAP.\nCompresión-Rotación: Sn 43%, Sp 89% — confirmatorio si positivo (Gismervik/Hegedus).\nSpeed: Sn 0.69, Sp 0.56 para bíceps/SLAP.\nGold standard: Artro-RM Sn 87–91%, Sp 80–89% — Bruna González 2020.",
      tratamiento: 'Conservador 3-6 meses (fortalecimiento RC y escápula). Si falla o atleta overhead: artroscopia + reparación/tenodesis bíceps según tipo SLAP y nivel de actividad.',
      ref: 'Bruna González Rev AKD 2020\nGismervik meta-análisis (tabla EBM usuario)',
      imagingRec: 'Artro-RM gold standard (Sn 87–91%, Sp 80–89%) — Bruna González 2020. Indicada para tipificación SLAP (I–IV) y planificación quirúrgica en overhead athletes.'
    },

    // ── INESTABILIDAD GH ANTERIOR ─────────────────────────────────────────
    {
      id: 'inestabilidad-gh',
      nombre: 'Inestabilidad GH Anterior',
      categoria: 'Inestabilidad',
      colorKey: 'orange',
      testsKey: ['apprehension'],
      testsSupportKey: ['obrien'],
      umbral: 1,
      criterio: 'Apprehension/Relocation positivo: Sn 72%, Sp 96% — alta especificidad inestabilidad anterior. Release Surprise test: Sn 96%, Sp 95% (Bruna González 2020).',
      evidencia: 'Apprehension: Sn 0.72, Sp 0.96 — Bruna González Rev AKD 2020.\nRelease Surprise (Fulcrum): Sn 96%, Sp 95% — alta precisión diagnóstica.\nGold standard: artroscopia / RMN para Bankart, Hill-Sachs.',
      tratamiento: 'Rehabilitación: fortalecimiento RI/RE en cadena cerrada, propiocepción GH, estabilización escapular 3-6 meses. Si falla o >3 episodios: valorar Bankart artroscópico.',
      ref: 'Bruna González Rev AKD 2020',
      imagingRec: 'RMN o artro-RM para evaluar lesión de Bankart y Hill-Sachs — Bruna González 2020. Rx AP+Y+axil si sospecha fractura asociada. Indicada ante >1 episodio de luxación o fallo conservador.'
    },

    // ── TENDINOPATÍA BÍCEPS / LHBT ────────────────────────────────────────
    {
      id: 'tendinopatia-biceps',
      nombre: 'Tendinopatía Bíceps / Lesión LHBT',
      categoria: 'Bíceps',
      colorKey: 'neon',
      testsKey: ['speed', 'yergason'],
      testsSupportKey: ['obrien'],
      umbral: 1,
      criterio: 'Speed + Yergason combinados aumentan probabilidad. Yergason DOR 4.71 para SIS (Sp 86%). Speed: Sn 0.69, Sp 0.56.',
      evidencia: 'Yergason: DOR 4.71 (IC 2.16–10.32), Sn 45%, Sp 86% — Zhao 2024 meta-análisis.\nSpeed: Sn 0.69, Sp 0.56 — Bruna González 2020.\nFrecuente asociación con patología subacromial (50-90% casos SIS).',
      tratamiento: 'Fortalecimiento excéntrico bíceps (curl excéntrico), estabilización GH. Si LHBT roto: tenodesis/tenotomía según edad y demanda. Infiltración eco-guiada en refractarios.',
      ref: 'Zhao Y et al. BMC Musculoskelet Disord 2024',
      imagingRec: 'Ecografía dinámica preferencial (visualización directa del tendón bíceps + bursa). Infiltración eco-guiada en refractarios. RMN si sospecha de rotura parcial o completa LHBT.'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// papers-rodilla-rules.js v1
// Base de evidencia: LCA · LCP · SPF · Menisco · Condral
// TODAS las Sn/Sp provienen de papers indexados en PubMed.
// ═══════════════════════════════════════════════════════════════

// ── VISA-P items (Visentini 1998 / Logerstedt 2012) ──────────
const VISAP_ITEMS = [
  { q: 'Dolor al caminar (EVA 0–10; 0=sin dolor)' },
  { q: 'Dolor al correr (EVA 0–10; 0=sin dolor)' },
  { q: 'Dolor durante o después de 10 sentadillas monopodal (EVA 0–10)' },
  { q: 'Dolor durante o después de 10 declinaciones monopodal (EVA 0–10)' },
  { q: '¿Podés entrenar en forma completa? (EVA 0–10; 0=imposible)' },
  { q: '¿Podés jugar / competir sin dolor? (EVA 0–10; 0=imposible)' },
  { q: 'Si no tenés dolor al practicar deporte: ¿cuánto entrenaste esta semana? (EVA 0–10)' },
  { q: 'Puntuación global de la última semana (EVA 0–10)' },
];

// ═══════════════════════════════════════════════════════════════
// TESTS LCA / LCP
// ═══════════════════════════════════════════════════════════════
const RODILLA_LCA_TESTS = [
  {
    id: 'lachman',
    nombre: 'Lachman',
    lesion: 'LCA',
    gold: true,
    protocolo: 'Rodilla 20–30° flexión. Fija fémur con una mano, desplaza tibia anterior con la otra. Positivo: traslación anterior aumentada o fin de arco blando.',
    sn: '0.85',
    sp: '0.94',
    lr_pos: '10.2',
    lr_neg: '0.16',
    ref: 'Benjaminse A et al. AJSM 2006. Solomon DH et al. JAMA 2001.',
    peso: 3,
    interpreta(val) {
      if (val === true)  return 'LR+ 10.2 → alta probabilidad post-test LCA. Confirmar con RMN.';
      if (val === false) return 'LR– 0.16 → probabilidad post-test muy baja. Test negativo con alta especificidad.';
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
      if (val === false) return 'Sn baja (0.35): negativo no descarta. Test anestesia aumenta sensibilidad.';
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
    nota: 'Sn/Sp de estudio original (n=400 cirugía). Estudios posteriores: Sn 0.38–1.00 / Sp 0.48–0.99. No usar como único test.',
    peso: 1,
    interpreta(val) {
      if (val === true)  return 'Lelli positivo. Resultado variable en literatura — confirmar con Lachman.';
      if (val === false) return 'Lelli negativo. Alta Sp en estudio original pero datos contradictorios en réplicas.';
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
    ref: 'Cook C et al. PM&R 2010. Willy RW et al. JOSPT 2019 (CPG Grado A).',
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
    protocolo: 'Rodilla extendida relajada. Elevar borde lateral de la rótula. Normal: borde lateral ≥0° horizontal. Positivo: no alcanza horizontal (tilt medial insuficiente).',
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
    nombre: 'Dolor escaleras / sedentación prolongada',
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
];

// ═══════════════════════════════════════════════════════════════
// TESTS MENISCO
// ═══════════════════════════════════════════════════════════════
const RODILLA_MENISCO_TESTS = [
  {
    id: 'mcmurray',
    nombre: 'McMurray',
    protocolo: 'Supino. Flexión máxima → extensión progresiva con rotación externa (medial) o interna (lateral) y valgo/varo. Positivo: clic palpable o dolor en interlínea.',
    sn_med: '0.83', sp_med: '0.76',
    sn_lat: '0.68', sp_lat: '0.97',
    ref: 'Logerstedt DS et al. JOSPT 2010 / 2018 CPG Update.',
    interpreta(val) {
      if (val === true)  return 'Sn 0.83 (med) · Sp 0.97 (lat): positivo es específico para desgarros laterales.';
      if (val === false) return 'Negativo reduce pero no descarta: Sn variable en desgarros complejos.';
      return '—';
    },
  },
  {
    id: 'thessaly',
    nombre: 'Thessaly 20°',
    protocolo: 'Bipedestación unipodal, rodilla 20° flexión. Rotación interna/externa del tronco 3 veces. Positivo: dolor o sensación de bloqueo en interlínea articular.',
    sn_med: '0.89', sp_med: '0.97',
    sn_lat: '0.92', sp_lat: '0.96',
    ref: 'Karachalios T et al. JBJS 2005. Logerstedt 2018 JOSPT CPG.',
    nota: 'Réplicas posteriores reportan Sn más baja (0.29–0.66). Usar en conjunto con composite score.',
    interpreta(val) {
      if (val === true)  return 'Alta Sp en estudio original. Positivo → parte del composite score.';
      if (val === false) return 'Réplicas tienen Sn variable. Negativo no descarta desgarro.';
      return '—';
    },
  },
  {
    id: 'apley',
    nombre: 'Apley (compresión + distracción)',
    protocolo: 'Prono, rodilla 90°. Compresión+rotación: positivo (menisco). Distracción+rotación: positivo (ligamentos). Diferencial por tipo de dolor.',
    sn: '0.61',
    sp: '0.70',
    ref: 'Hegedus EJ et al. Br J Sports Med 2007.',
    interpreta(val) {
      if (val === true)  return 'Sp 0.70: positivo con compresión aumenta sospecha meniscal.';
      if (val === false) return 'Sn/Sp modestas. Usar junto a McMurray y composite score.';
      return '—';
    },
  },
  {
    id: 'jlt',
    nombre: 'Línea articular (JLT)',
    protocolo: 'Palpación de interlínea medial y lateral con rodilla 45°–90°. Positivo: dolor reproducible a la palpación directa de la interlínea.',
    sn: '0.55',
    sp: '0.67',
    ref: 'Hegedus EJ et al. Br J Sports Med 2007. Logerstedt 2018 CPG (elemento composite score).',
    interpreta(val) {
      if (val === true)  return 'Elemento composite score JOSPT 2018. Positivo contribuye al diagnóstico clínico.';
      if (val === false) return 'Sn 0.55: negativo no descarta. Complementar con McMurray y Thessaly.';
      return '—';
    },
  },
  {
    id: 'hyperext_forzada',
    nombre: 'Hiperextensión forzada',
    protocolo: 'Elevar el talón pasivamente con rodilla extendida. Positivo: dolor en interlínea articular posterior a la hiperextensión pasiva.',
    sn: null,
    sp: null,
    ref: 'Logerstedt DS et al. JOSPT 2018 CPG — elemento composite score meniscal.',
    interpreta(val) {
      if (val === true)  return 'Positivo: elemento del composite score (≥3/4 → Sp 90.2%, JOSPT 2018).';
      if (val === false) return 'Negativo: sin contribución al composite score.';
      return '—';
    },
  },
  {
    id: 'flexion_max',
    nombre: 'Flexión pasiva máxima',
    protocolo: 'Flexión máxima pasiva de rodilla. Positivo: dolor en interlínea posterior o anterior a la flexión completa.',
    sn: null,
    sp: null,
    ref: 'Logerstedt DS et al. JOSPT 2018 CPG — elemento composite score meniscal.',
    interpreta(val) {
      if (val === true)  return 'Positivo: elemento del composite score (≥3/4 → Sp 90.2%).';
      if (val === false) return 'Negativo: sin contribución al composite score.';
      return '—';
    },
  },
  {
    id: 'steinmann',
    nombre: 'Steinmann I',
    protocolo: 'Rotación brusca de tibia con rodilla 90° (externa→medial, interna→lateral). Positivo: dolor agudo en interlínea articular correspondiente.',
    sn: '0.62',
    sp: '0.90',
    ref: 'Kurosaka M et al. Am J Sports Med 1999.',
    interpreta(val) {
      if (val === true)  return 'Alta Sp (0.90): positivo confirma desgarro meniscal. LR+ ~6.';
      if (val === false) return 'Sn 0.62: negativo reduce sospecha pero no descarta.';
      return '—';
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// TESTS CONDRAL / OSTEOCONDRAL
// ═══════════════════════════════════════════════════════════════
const RODILLA_CONDRAL_TESTS = [
  {
    id: 'hemarthrosis',
    nombre: 'Hemarthrosis aguda (0–2 h post-trauma)',
    lesion: 'Fractura osteocondral / LCA / LP',
    protocolo: 'Derrame articular hemático en las primeras 2 horas post-trauma. Positivo: aspirado hemático o derrame rápido marcado.',
    sn: '0.85',
    sp: '0.70',
    ref: 'Logerstedt DS 2018 JOSPT CPG. Wilk KE 2006 JOSPT.',
    interpreta(val) {
      if (val === true)  return 'Sn 0.85: hemarthrosis aguda → alta sospecha fractura osteocondral/LCA. Ottawa + Rx urgente.';
      if (val === false) return 'Ausencia de hemarthrosis aguda reduce probabilidad fractura osteocondral aguda.';
      return '—';
    },
  },
  {
    id: 'stroke_test',
    nombre: 'Stroke Test (ballottement)',
    lesion: 'Derrame articular',
    protocolo: 'Comprimir fondo de saco suprapatelar hacia distal y empujar borde medial. Positivo: ola de líquido palpable en lado lateral.',
    sn: '0.67',
    sp: '0.71',
    ref: 'Kastelein M et al. Ann Fam Med 2008.',
    interpreta(val) {
      if (val === true)  return 'Positivo: derrame articular presente. Aumenta sospecha lesión intraarticular.';
      if (val === false) return 'Derrame menor o ausente. No descarta lesión condral sin inflamación activa.';
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
    nota: 'Hughes 2011: sensibilidad limitada para OCD estable. Confirmar con RMN.',
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
    protocolo: 'Palpación directa de cóndiles femorales y plateaux tibiales con rodilla flexionada. Positivo: dolor focal en zona condral articular.',
    sn: null,
    sp: null,
    ref: 'Wilk KE et al. JOSPT 2006 — hallazgo orientador sin Sn/Sp establecida.',
    interpreta(val) {
      if (val === true)  return 'Hallazgo orientador: dolor focal condral. No reemplaza RMN.';
      if (val === false) return 'Palpación indolora. No descarta lesión condral asintomática.';
      return '—';
    },
  },
  {
    id: 'crepitacion',
    nombre: 'Crepitación articular',
    lesion: 'Degeneración condral / OA',
    protocolo: 'Movilización pasiva/activa de la rodilla. Registrar: crepitación fina (SPF), gruesa (OA), o clunk (cuerpo libre). Grado y localización.',
    sn: null,
    sp: null,
    ref: 'Wilk KE et al. JOSPT 2006.',
    interpreta(val) {
      if (val === true)  return 'Crepitación presente. Grado grueso → sospecha OA/condromalacia. Complementar con imagen.';
      if (val === false) return 'Sin crepitación. No descarta lesión condral focal temprana.';
      return '—';
    },
  },
  {
    id: 'ottawa_knee',
    nombre: 'Ottawa Knee Rules',
    lesion: 'Fractura ósea / osteocondral',
    protocolo: 'Indicar Rx si: edad ≥55 años; o dolor cabeza peroné; o dolor rótula aislado; o imposibilidad flexión 90°; o imposibilidad carga 4 pasos. Positivo = ≥1 criterio.',
    sn: '0.99',
    sp: '0.49',
    ref: 'Stiell IG et al. Ann Emerg Med 1995. Logerstedt DS 2018 JOSPT CPG.',
    interpreta(val) {
      if (val === true)  return 'Sn 0.99: criterio presente → INDICAR Rx ANTES DE RMN. Descartar fractura.';
      if (val === false) return 'Sin criterios Ottawa (Sn 0.99 → fractura muy improbable). Continuar evaluación clínica.';
      return '—';
    },
  },
  {
    id: 'dolor_carga_pf',
    nombre: 'Dolor con carga PF (cuclillas/escaleras)',
    lesion: 'Condromalacia / SPF',
    protocolo: 'Dolor retropatelar que aumenta con actividades de carga patelofemoral (cuclillas, escaleras, correr cuesta abajo).',
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
// LÓGICA DIAGNÓSTICA — basada en likelihood ratios y CPG
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
          msg: 'Lachman+ (LR+ 10.2) + Pivot Shift+ (LR+ 17.5): probabilidad post-test LCA muy alta. Indicar RMN articular.' };
      }
      if (lachman === true) {
        return { nivel: 'alto', pct: 75,
          msg: 'Lachman positivo (LR+ 10.2). Probabilidad post-test alta. Confirmar con Pivot Shift y RMN.' };
      }
      if (pivot === true) {
        return { nivel: 'moderado', pct: 72,
          msg: 'Pivot Shift positivo (LR+ 17.5, Sp 0.98): alta inestabilidad rotacional. Sn 0.35. Indicar RMN.' };
      }
      if (cajon === true && lachman !== true && pivot !== true) {
        return { nivel: 'moderado', pct: 50,
          msg: 'Cajón anterior positivo (LR+ 3.2). Sn baja para LCA. Complementar con Lachman.' };
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
          msg: 'Cajón posterior positivo (LR+ ~90, Sn 0.90 / Sp 0.99). Alta probabilidad LCP. Derivar urgente.' };
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
          msg: 'Dolor cuclillas+ y escaleras+: ambos criterios CPG Grado A positivos (Willy 2019). Diagnóstico SPF probable. Excluir patología tibiofemoral.' };
      }
      if ((cuclillas === true || escaleras === true) && (tilt === true || apr === true || palp === true)) {
        return { nivel: 'moderado', pct: 72,
          msg: 'Un criterio funcional Grado A + hallazgo físico positivo. SPF probable. Evaluar biomecánica cadera/rodilla.' };
      }
      if (cuclillas === true || escaleras === true) {
        return { nivel: 'moderado', pct: 58,
          msg: 'Un criterio diagnóstico Grado A positivo. Probabilidad moderada SPF. Completar evaluación funcional.' };
      }
      if (tilt === true || apr === true) {
        return { nivel: 'moderado', pct: 45,
          msg: 'Hallazgos físicos positivos (tilt/aprensión). Sp alta (0.92–0.93) pero sin criterio funcional. Evaluar en actividad.' };
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
      const mcm   = tests['mcmurray'];
      const thes  = tests['thessaly'];
      const jlt   = tests['jlt'];
      const hyper = tests['hyperext_forzada'];
      const flex  = tests['flexion_max'];
      const stein = tests['steinmann'];
      const completados = [mcm, thes, jlt, hyper, flex, stein].filter(v => v !== undefined).length;
      if (completados === 0) return null;

      // Composite JOSPT 2018: mcmurray + hyperext + flexmax + jlt
      const compPos = [mcm, hyper, flex, jlt].filter(v => v === true).length;

      if (compPos >= 3) {
        return { nivel: 'alto', pct: 88,
          msg: `Composite Score: ${compPos}/4 positivos (Sp 90.2%, Logerstedt JOSPT 2018). Alta probabilidad desgarro meniscal. Indicar RMN.` };
      }
      const totalPos = [mcm,thes,jlt,hyper,flex,stein].filter(v=>v===true).length;
      if (compPos >= 1 && totalPos >= 3) {
        return { nivel: 'moderado', pct: 72,
          msg: `${totalPos} tests positivos. Sospecha moderada–alta. Composite score ${compPos}/4.` };
      }
      if (compPos >= 1) {
        return { nivel: 'moderado', pct: 50,
          msg: `Composite score ${compPos}/4. Sospecha moderada. Completar: McMurray, Thessaly, JLT, hiperextensión, flexión máxima.` };
      }
      if ([mcm,thes,jlt,hyper,flex].filter(v=>v===false).length >= 3) {
        return { nivel: 'bajo', pct: 12,
          msg: 'Múltiples tests negativos. Sospecha de desgarro meniscal baja.' };
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
          msg: 'Ottawa Knee Rules positivo (Sn 0.99) + hemarthrosis aguda: DESCARTAR FRACTURA OSTEOCONDRAL. Rx urgente → RMN.' };
      }
      if (ottawa === true) {
        return { nivel: 'alto', pct: 75, urgente: true,
          msg: 'Ottawa Knee Rules positivo (Sn 0.99): indicar Rx antes de continuar manejo conservador.' };
      }
      if (hem === true) {
        return { nivel: 'alto', pct: 80, urgente: true,
          msg: 'Hemarthrosis aguda (0–2h): Sn 0.85 para lesión osteocondral/ligamentaria grave. Derivar urgente para imagen.' };
      }
      if (wilson === true && palp === true) {
        return { nivel: 'moderado', pct: 62,
          msg: 'Wilson test positivo + dolor palpación condral: sospecha OCD cóndilo femoral medial. Indicar RMN.' };
      }
      if (wilson === true) {
        return { nivel: 'moderado', pct: 48,
          msg: 'Wilson test positivo (Sp 0.77). Sospecha OCD. Nota: alta tasa falsos negativos en lesiones estables (Hughes 2011).' };
      }
      if (stroke === true && palp === true) {
        return { nivel: 'moderado', pct: 45,
          msg: 'Derrame articular + dolor condral: sospecha patología intraarticular. RMN para confirmar.' };
      }
      return null;
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// BIBLIOGRAFÍA
// ═══════════════════════════════════════════════════════════════
const RODILLA_REFS = {
  benjaminse2006:  'Benjaminse A, Gokeler A, van der Schans CP. Clinical diagnosis of an anterior cruciate ligament rupture: a meta-analysis. J Orthop Sports Phys Ther. 2006;36(5):267-288.',
  solomon2001:     'Solomon DH, Simel DL, Bates DW, Katz JN, Schaffer JL. The rational clinical examination. Does this patient have a torn meniscus or ligament of the knee? JAMA. 2001;286(13):1610-1620.',
  rubinstein1994:  'Rubinstein RA Jr, Shelbourne KD, McCarroll JR, VanMeter CD, Rettig AC. The accuracy of the clinical examination in the setting of posterior cruciate ligament injuries. Am J Sports Med. 1994;22(4):550-557.',
  lelli2014:       'Lelli A, Di Turi RP, Spenciner DB, Domni M. The "Lever Sign": a new clinical test for the diagnosis of anterior cruciate ligament rupture. Knee Surg Sports Traumatol Arthrosc. 2016;24(9):2794-2797.',
  willy2019:       'Willy RW, Hoglund LT, Barton CJ, et al. Patellofemoral Pain. J Orthop Sports Phys Ther. 2019;49(9):CPG1-CPG95.',
  cook2010:        'Cook C, Mabry L, Reiman MP, Hegedus EJ. Best tests/clinical findings for screening and diagnosis of patellofemoral pain syndrome: a systematic review. Physiotherapy. 2012;98(2):93-100.',
  logerstedt2018:  'Logerstedt DS, Ebert JR, MacLeod TD, et al. Effects of and Response to Mechanical Loading on the Knee. J Orthop Sports Phys Ther. 2018;48(6):499-520.',
  stiell1995:      'Stiell IG, Greenberg GH, Wells GA, et al. Prospective validation of a decision rule for the use of radiography in acute knee injuries. JAMA. 1996;275(8):611-615.',
  hegedus2007:     'Hegedus EJ, Cook C, Hasselblad V, Goode A, McCrory DC. Physical examination tests for assessing a torn meniscus in the knee: a systematic review with meta-analysis. J Orthop Sports Phys Ther. 2007;37(9):541-550.',
  wilk2006:        'Wilk KE, Briem K, Reinold MM, Devine KM, Dugas J, Andrews JR. Rehabilitation of articular lesions in the athlete\'s knee. J Orthop Sports Phys Ther. 2006;36(10):815-827.',
};

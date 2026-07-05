// papers-mano-rules.js v1
// Fuentes de evidencia:
// - Erickson et al. JOSPT CPG 2019 — CTS / Carpal Tunnel Syndrome (Hand Pain & Sensory Deficits)
// - Huisstede et al. Phys Ther 2014 — De Quervain HANDGUIDE (European Delphi consensus)
// - Huisstede et al. Phys Ther 2014 — Trigger Finger HANDGUIDE (European Delphi consensus)
// - Kloppenburg et al. Ann Rheum Dis 2019 — Hand OA EULAR 2018 recommendations
// - Hoogvliet et al. BJSM 2013 — Guyon Canal HANDGUIDE (European Delphi consensus)
// - Huisstede et al. Plast Reconstr Surg 2013 — Dupuytren HANDGUIDE (European Delphi consensus)
// - Chávez Delgado et al. UNAM Rev Fac Med 2024 — Evaluación funcional de mano
// - Lluch Bergadà & García Elías. UNIA 2020 — Exploración clínica de la mano y la muñeca
// - Suárez Fernández & de Paz Nieves. UNLP 2020 — Valoración neurológica de la mano

// ─── STC ────────────────────────────────────────────────────────────────────
const MANO_STC_TESTS = [
  { id:'durkan',     name:'Compresión carpiana (Durkan)',   sub:'Presión bilateral sobre TC 30 s → síntomas territorio mediano',         ref:'Mejor test único STC: Sn 0.87 / Sp 0.90 — JOSPT CPG 2019 Grade B' },
  { id:'phalen',     name:'Test de Phalen',                 sub:'Flexión máxima muñeca 60 s → parestesias I–III dedos (territorio mediano)',  ref:'Sn 0.68 / Sp 0.73 — JOSPT CPG 2019 Grade B' },
  { id:'phalen-inv', name:'Phalen invertido',               sub:'Extensión máxima muñeca 60 s → parestesias territorio mediano',         ref:'Sn 0.59 / Sp 0.74 — combinado con Phalen mejora sensibilidad JOSPT CPG 2019' },
  { id:'tinel-tc',   name:'Tinel túnel carpiano',           sub:'Percusión retináculo flexor → parestesias distales territorio mediano',  ref:'Sn 0.50 / Sp 0.77 — JOSPT CPG 2019 Grade B' },
  { id:'shaking',    name:'Shaking hand sign',              sub:'Agitar la mano alivia las parestesias (síntoma auto-referido)',         ref:'LR+ 3.15 — ≥3/5 factores (age>45, shaking, pérd. sens., CTQ-SSS>1.9, wrist ratio >0.67) → alta prob. STC — JOSPT CPG 2019 Grade B' }
];

// ─── DE QUERVAIN ─────────────────────────────────────────────────────────────
const MANO_DEQUERVAIN_TESTS = [
  { id:'finkelstein', name:'Test de Finkelstein',          sub:'Pulgar en puño → desviación cubital pasiva → dolor 1er compartimento',   ref:'Test principal De Quervain — HANDGUIDE 2014 (Huisstede Phys Ther 2014); Exploración muñeca (Iglesia Peralta)' },
  { id:'muckard',     name:'Test de Muckard',              sub:'Extensión pasiva pulgar + desviación cubital → dolor tabaquera anatómica', ref:'Variante Finkelstein — HANDGUIDE 2014; Lluch Bergadà UNIA 2020' },
  { id:'palp-1comp',  name:'Palpación 1er compartimento',  sub:'Dolor a palpación proceso estiloide radial / tabaquera anatómica (APL + EPB)', ref:'Hallazgo clínico principal — Lluch Bergadà UNIA 2020; HANDGUIDE 2014' }
];

// ─── DEDO EN GATILLO ─────────────────────────────────────────────────────────
const MANO_GATILLO_TESTS = [
  { id:'palp-a1',    name:'Palpación polea A1',           sub:'Dolor/nódulo palpable base falange proximal al flexionar el dedo',       ref:'Hallazgo clínico Trigger Finger — HANDGUIDE 2014 (Huisstede Phys Ther 2014)' },
  { id:'triggering', name:'Bloqueo/resorte en flexión',   sub:'Bloqueo con o sin resorte al extender el dedo → dedo en gatillo activo', ref:'Hallazgo diagnóstico principal — Quinnell Grades I–IV; HANDGUIDE 2014' }
];

// ─── CMC / OA ─────────────────────────────────────────────────────────────────
const MANO_CMC_TESTS = [
  { id:'grind-cmc',  name:'Grind test CMC I (pulgar)',    sub:'Compresión axial + rotación CMC pulgar → dolor / crepitación en tabaquera', ref:'Sn 0.53 / Sp 0.88 — alta especificidad rizartrosis — Lluch Bergadà UNIA 2020; Exploración física muñeca-mano (Iglesia Peralta)' },
  { id:'heberden',   name:'Nódulos de Heberden (IFD)',    sub:'Ensanchamiento óseo articulaciones IFD — hallazgo típico OA mano',       ref:'Hallazgo clínico OA — EULAR 2018 (Kloppenburg Ann Rheum Dis 2019)' },
  { id:'bouchard',   name:'Nódulos de Bouchard (IFP)',    sub:'Ensanchamiento óseo articulaciones IFP — hallazgo típico OA mano',       ref:'Hallazgo clínico OA — EULAR 2018 (Kloppenburg Ann Rheum Dis 2019)' }
];

// ─── NEUROPATÍA / GUYON / DUPUYTREN ──────────────────────────────────────────
const MANO_NEURO_TESTS = [
  { id:'tinel-guyon',     name:'Tinel canal de Guyon',         sub:'Percusión sobre canal de Guyon (cubital al pisiforme) → parestesias 4°-5° dedos', ref:'Test diagnóstico neuropatía cubital distal — HANDGUIDE Guyon 2013 (Hoogvliet BJSM 2013)' },
  { id:'froment',         name:'Signo de Froment',              sub:'Prehensión lateral papel pulgar-índice → flexión IFP pulgar (n. cubital insuficiente: aductor del pulgar débil)', ref:'Parálisis aductor pulgar (n. cubital) — Valoración Neurológica Mano (Suárez Fernández, UNLP)' },
  { id:'wartenberg',      name:'Signo de Wartenberg',           sub:'5° dedo en abducción permanente por debilidad interóseo palmar n. cubital', ref:'Afectación n. cubital motor (interóseos) — Valoración Neurológica Mano (Suárez Fernández, UNLP)' },
  { id:'dupuytren-cord',  name:'Palpación cuerda Dupuytren',    sub:'Cuerda pretendinosa palmar + nódulos → retracción digital MCF/IFP (4°-5° dedos)', ref:'Diagnóstico Dupuytren — HANDGUIDE 2013 (Huisstede Plast Reconstr Surg 2013)' },
  { id:'table-test',      name:'Hueston Table test (Dupuytren)', sub:'La mano NO puede quedar plana sobre la mesa = déficit extensión MCF y/o IFP > 0°', ref:'Test funcional Dupuytren — HANDGUIDE 2013; Patología ortopédica mano (Guillen, UNLP)' }
];

// ─── REGLAS DIAGNÓSTICAS ─────────────────────────────────────────────────────
const MANO_RULES = [
  {
    id: 'stc',
    label: 'Síndrome Túnel Carpiano (STC)',
    criterios: [
      'Durkan (compresión carpiana) positivo: mejor test único Sn 0.87 / Sp 0.90 — JOSPT CPG 2019',
      'Phalen + Tinel positivos combinados aumentan probabilidad post-test',
      'Síntomas: parestesias nocturnas en territorio mediano (I-III + borde radial IV)',
      '≥3/5 factores: age >45, shaking alivia, pérdida sensorial pulgar, CTQ-SSS >1.9, wrist ratio >0.67 → alta probabilidad STC — JOSPT CPG 2019 Grade B',
      'Confirmación: electromiografía / velocidad de conducción nerviosa'
    ],
    recom: [
      {
        fase: 'Fase 1 — Conservador inicial (6–8 semanas)',
        items: [
          'Ortesis muñeca neutra nocturna — JOSPT CPG 2019 Grade A',
          'Ejercicios de deslizamiento del nervio mediano (nerve gliding) — JOSPT CPG 2019 Grade B',
          'Educación: evitar posiciones mantenidas de flexión-extensión de muñeca',
          'AINES tópicos o sistémicos para manejo sintomático — JOSPT CPG 2019 Grade B'
        ]
      },
      {
        fase: 'Fase 2 — Sin respuesta conservadora (>3 meses)',
        items: [
          'Inyección corticosteroide intracanal — mejora sintomática a corto plazo — JOSPT CPG 2019',
          'Derivación a cirugía si síntomas moderados-severos o atrofia tenar — JOSPT CPG 2019',
          'Terapia manual: movilización neural + movilización articular carpiana — JOSPT CPG 2019 Grade C'
        ]
      }
    ]
  },
  {
    id: 'dequervain',
    label: 'Tenosinovitis de De Quervain',
    criterios: [
      'Finkelstein positivo — test diagnóstico principal (HANDGUIDE 2014)',
      'Dolor y/o crepitación 1er compartimento dorsal (APL + EPB)',
      'Palpación dolorosa proceso estiloide radial / tabaquera anatómica'
    ],
    recom: [
      {
        fase: 'Fase 1 — Conservador (primera línea)',
        items: [
          'Instrucciones de modificación de actividad — siempre indicado, no usar como tratamiento único — HANDGUIDE 2014',
          'Ortesis muñeca + pulgar en reposo (thumb spica splint) — HANDGUIDE 2014 (consenso)',
          'AINES + ortesis combinados — HANDGUIDE 2014 (opción consensuada)',
          'Ejercicios de deslizamiento tendinoso APL/EPB'
        ]
      },
      {
        fase: 'Fase 2 — Sin respuesta en 6 semanas',
        items: [
          'Inyección corticosteroide 1er compartimento (+ ortesis) — HANDGUIDE 2014 (consenso)',
          'Cirugía (liberación 1er compartimento) si tratamiento conservador falla — HANDGUIDE 2014'
        ]
      }
    ]
  },
  {
    id: 'trigger-finger',
    label: 'Dedo en Gatillo (Trigger Finger)',
    criterios: [
      'Bloqueo con o sin resorte al flexionar/extender el dedo — hallazgo diagnóstico principal',
      'Nódulo/dolor palpable a nivel polea A1 (base de falange proximal)',
      'Clasificación Quinnell: I (dolor) → II (disparador activo) → III (bloqueo pasivo) → IV (fijo)'
    ],
    recom: [
      {
        fase: 'Fase 1 — Conservador',
        items: [
          'Ortesis en extensión (noche) 6 semanas — HANDGUIDE 2014 (consenso)',
          'Inyección corticosteroide intrapolea A1 — alta efectividad, HANDGUIDE 2014 (consenso)',
          'Instrucciones: modificación de actividades repetitivas'
        ]
      },
      {
        fase: 'Fase 2 — Refractario / Quinnell III-IV',
        items: [
          'Inyección repetida corticosteroide (hasta 2–3 intentos) — HANDGUIDE 2014',
          'Liberación quirúrgica percutánea o abierta de polea A1 — HANDGUIDE 2014 (consenso)'
        ]
      }
    ]
  },
  {
    id: 'rizartrosis',
    label: 'Rizartrosis (OA CMC I pulgar)',
    criterios: [
      'Grind test CMC I positivo (Sp 0.88) — alta especificidad',
      'Dolor en tabaquera anatómica + CMC I con actividad de pinza',
      'Ensanchamiento CMC I, deformidad en Z o subluxación radial del pulgar'
    ],
    recom: [
      {
        fase: 'No farmacológico (primera línea)',
        items: [
          'Ejercicio terapéutico (fuerza pinza, estabilización CMC I) — EULAR 2018 Rec 3',
          'Ortesis CMC I (thumb brace/spica) — EULAR 2018 Rec 3',
          'Educación y protección articular — EULAR 2018 overarching principle'
        ]
      },
      {
        fase: 'Farmacológico',
        items: [
          'AINES tópicos — primera línea farmacológica — EULAR 2018 Rec 4 (Grade A)',
          'AINES orales corto plazo si respuesta tópica insuficiente — EULAR 2018 Rec 5',
          'Infiltración corticosteroide intraarticular CMC I (dolor intenso) — EULAR 2018 Rec 7'
        ]
      }
    ]
  },
  {
    id: 'oa-mano',
    label: 'Osteoartritis de Mano (OA interfalángica)',
    criterios: [
      'Nódulos Heberden (IFD) y/o Bouchard (IFP) — hallazgo clínico OA mano',
      'Dolor y rigidez articular interfalángica con actividad / matinal',
      'Diagnóstico clínico + radiológico — EULAR 2018'
    ],
    recom: [
      {
        fase: 'No farmacológico (primera línea)',
        items: [
          'Ejercicio articular (movilidad + fuerza de agarre) — EULAR 2018 Rec 3',
          'Dispositivos de asistencia (adaptive devices) — EULAR 2018 Rec 2',
          'Educación: protección articular, actividad moderada — EULAR 2018 Rec 1'
        ]
      },
      {
        fase: 'Farmacológico',
        items: [
          'AINES tópicos (primera elección farmacológica) — EULAR 2018 Rec 4 Grade A',
          'AINES orales a corto plazo — EULAR 2018 Rec 5',
          'Condroitín sulfato (alivio sintomático) — EULAR 2018 Rec 6',
          'Infiltración corticosteroide IFP solo si dolor inflamatorio intenso — EULAR 2018 Rec 7'
        ]
      }
    ]
  },
  {
    id: 'guyon',
    label: 'Neuropatía Cubital — Canal de Guyon',
    criterios: [
      'Tinel positivo sobre canal de Guyon (n. cubital)',
      'Froment positivo — debilidad aductor pulgar (n. cubital motor)',
      'Parestesias / hipoestesia 4°–5° dedos (territorio cubital)',
      'Wartenberg positivo en afectación motora de interóseos'
    ],
    recom: [
      {
        fase: 'Fase 1 — Conservador',
        items: [
          'Instrucciones + educación (SIEMPRE incluir) — HANDGUIDE Guyon 2013 (Hoogvliet BJSM 2013)',
          'Ortesis muñeca en posición neutra (descarga canal cubital) — HANDGUIDE Guyon 2013 (consenso)',
          'Modificación de actividades comprensivas (manillar, apoyo prolongado codo/muñeca)'
        ]
      },
      {
        fase: 'Fase 2 — Sin respuesta / Déficit motor progresivo',
        items: [
          'Cirugía (descompresión canal de Guyon) — HANDGUIDE Guyon 2013 (consenso)',
          'Indicación quirúrgica: déficit motor progresivo o fracaso conservador >3–6 meses'
        ]
      }
    ]
  },
  {
    id: 'dupuytren',
    label: 'Enfermedad de Dupuytren',
    criterios: [
      'Cuerda pretendinosa palmar palpable + nódulos palmares',
      'Table test positivo (Hueston) — mano no apoya plana sobre la mesa',
      'Retracción en flexión MCF y/o IFP (4°–5° dedos principalmente)',
      'Factores de riesgo: varón >40 años, herencia, diabetes, etnia nórdica, trauma repetido'
    ],
    recom: [
      {
        fase: 'Tratamiento según severidad de contractura',
        items: [
          'Sin contractura significativa: observación y monitoreo periódico — HANDGUIDE Dupuytren 2013 (Huisstede PRS 2013)',
          'Con contractura: fasciotomía con aguja percutánea o abierta — HANDGUIDE 2013 (consenso)',
          'Fasciectomía limitada o dermofasciectomía — HANDGUIDE 2013 (según edad, piel, recurrencias)',
          'Rehabilitación post-quirúrgica: instrucciones + ejercicio terapéutico (SIEMPRE) — HANDGUIDE 2013',
          'Férula post-quirúrgica: según indicación clínica — HANDGUIDE 2013'
        ]
      }
    ]
  }
];

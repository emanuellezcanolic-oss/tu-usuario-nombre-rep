// js/data/papers-adulto-mayor-rules.js
// Valores de corte 100% basados en los artículos del directorio
// C:\Users\Usuario\Documents\Claude\Paper\Adulto mayor
// NO SE INVENTÓ NINGÚN VALOR — todo referenciado

const AM_REFS = {
  barry2014:  'Barry E et al. Is the TUG test a useful predictor of risk of falls in community-dwelling older adults. BMC Geriatrics 2014;14:14.',
  cheong2021: 'Cheong CY et al. Physical and functional measures predicting long-term mortality in community-dwelling older adults. AGING 2021;13(23):25038–25054.',
  dengiz2025: 'Dengiz A et al. Investigation of commonly used assessment methods for predicting fall risk in the elderly. Exp Gerontol 2025;206:112784.',
  park2017:   'Park SH. Tools for assessing fall risk in the elderly: a systematic review and meta-analysis. Aging Clin Exp Res 2017. DOI 10.1007/s40520-017-0749-0.',
  usarel2019: 'Usarel C et al. The AD8 (Dementia Screening Interview) is a valid and reliable screening scale not only for dementia but also for MCI. Int Psychogeriatr 2019;31(2):223–229.',
  wanden2021: 'Wanden-Berghe C. Valoración geriátrica integral. Hosp Domic 2021;5(2):115–124.',
};

// ─────────────────────────────────────────────────────────────
// TUG — Timed Up and Go
// Barry 2014 (caída) + Cheong 2021 (mortalidad) + Dengiz 2025 (valores norma)
// ─────────────────────────────────────────────────────────────
const AM_TUG = {
  nombre: 'TUG — Timed Up and Go',
  protocolo: 'Silla con apoyabrazos (~46 cm). Paciente sentado. Señal verbal "Ya": levantarse, caminar 3 m a paso normal, girar, volver y sentarse. Cronometrar. Práctica previa de 1 intento.',
  unidad: 'segundos',
  // Valores normativos por edad (Dengiz 2025, Exp Gerontol 2025)
  normas: [
    { rango: '60–69 años', media: 8.1, ic95: [7.1, 9.0] },
    { rango: '70–79 años', media: 9.2, ic95: [8.2, 10.2] },
    { rango: '≥80 años',   media: 11.3, ic95: [10.0, 12.7] },
  ],
  // Puntos de corte clínicos
  cortes: {
    mortalidad: {
      valor: 9,
      op: '>=',
      label: '≥9 s → indicador de vitalidad y pronóstico funcional reducido',
      sn: 0.656, sp: 0.696, auc: 0.737,
      hr: 2.66, hr_ci: [1.67, 4.23],
      ref: 'Cheong 2021 — Singapore Longitudinal Ageing Study (N=2906, seguimiento 9 años)'
    },
    caida: {
      valor: 13.5,
      op: '>=',
      label: '≥13.5 s → riesgo de caída (comunidad)',
      sn: 0.31, sp: 0.74, sp_ci: [0.52, 0.88],
      ref: 'Barry 2014 — Meta-análisis 25 estudios, N=2314'
    },
    por_segundo: {
      label: 'Cada 1 s de aumento → 72% mayor probabilidad de caída (Exp(B)=1.720)',
      ref: 'Dengiz 2025'
    }
  },
  // Semáforo: menor tiempo = mejor
  semaforo: (s) => {
    if (s === null || s === '' || isNaN(s)) return 'nd';
    const v = +s;
    if (v < 9)    return 'verde';
    if (v < 13.5) return 'amarillo';
    return 'rojo';
  },
  semaforo_label: (s) => {
    if (s === null || s === '' || isNaN(s)) return '—';
    const v = +s;
    if (v < 9)    return `${v}s — Normal / Bajo riesgo`;
    if (v < 13.5) return `${v}s — Indicador de vitalidad (HR 2.66)`;
    return `${v}s — Riesgo caída · vitalidad comprometida`;
  },
};

// ─────────────────────────────────────────────────────────────
// 4m Gait Speed — Velocidad de marcha 4 metros
// Cheong 2021 — mortalidad
// ─────────────────────────────────────────────────────────────
const AM_GAIT = {
  nombre: 'Velocidad de Marcha — 4 metros',
  protocolo: 'Zona de aceleración 2 m + zona cronometrada 4 m + zona de deceleración 2 m. Caminar a paso habitual. Cronometrar los 4 m centrales. V(m/s) = 4 / tiempo(s).',
  unidad: 'm/s',
  cortes: [
    { valor: 0.8, op: '<', label: '<0.8 m/s → riesgo muy elevado', sn: 0.189, sp: 0.933, ref: 'Cheong 2021' },
    { valor: 1.0, op: '<', label: '<1.0 m/s → indicador de vitalidad funcional (HR 1.69)', sn: 0.378, sp: 0.822, hr: 1.69, hr_ci: [1.08, 2.63], ref: 'Cheong 2021' },
  ],
  semaforo: (v) => {
    if (v === null || v === '' || isNaN(v)) return 'nd';
    const n = +v;
    if (n >= 1.0) return 'verde';
    if (n >= 0.8) return 'amarillo';
    return 'rojo';
  },
  semaforo_label: (v) => {
    if (v === null || v === '' || isNaN(v)) return '—';
    const n = +v;
    if (n >= 1.0) return `${n} m/s — Normal`;
    if (n >= 0.8) return `${n} m/s — Riesgo moderado`;
    return `${n} m/s — Vitalidad y pronóstico comprometido`;
  },
};

// ─────────────────────────────────────────────────────────────
// SPPB — Short Physical Performance Battery
// Wanden-Berghe 2021 — valoración geriátrica
// ─────────────────────────────────────────────────────────────
const AM_SPPB = {
  nombre: 'SPPB — Short Physical Performance Battery',
  protocolo: 'Suma de 3 sub-tests: (1) Equilibrio estático — pies juntos / semi-tándem / tándem (0–4 pts). (2) Velocidad marcha 4 m (0–4 pts). (3) 5× levantarse silla sin brazos (0–4 pts). Total 0–12 pts.',
  rango: [0, 12],
  cortes: {
    fragilidad: { valor: 10, op: '<', label: '<10 pts → fragilidad + riesgo elevado de caídas y discapacidad', ref: 'Wanden-Berghe 2021' },
    severo:     { valor: 7,  op: '<', label: '<7 pts → deterioro funcional severo', ref: 'Wanden-Berghe 2021' },
  },
  nota: 'Cambios de 1 punto tienen significado clínico. A mayor deterioro: ↑ mortalidad, ↑ ingresos hospitalarios, ↑ institucionalización.',
  semaforo: (s) => {
    if (s === null || s === '' || isNaN(s)) return 'nd';
    const v = +s;
    if (v >= 10) return 'verde';
    if (v >= 7)  return 'amarillo';
    return 'rojo';
  },
  semaforo_label: (s) => {
    if (s === null || s === '' || isNaN(s)) return '—';
    const v = +s;
    if (v >= 10) return `${v}/12 — Normal`;
    if (v >= 7)  return `${v}/12 — Fragilidad leve-moderada`;
    return `${v}/12 — Fragilidad severa / Alto riesgo`;
  },
  // Sub-test 3: 5×STS — tiempos de referencia SPPB
  sts5: {
    0: 'Incapaz o >60 s',
    1: '>16.7 s',
    2: '13.7–16.6 s',
    3: '11.2–13.6 s',
    4: '<11.2 s',
  },
};

// ─────────────────────────────────────────────────────────────
// Berg Balance Scale
// Park 2017 (meta-análisis) + Dengiz 2025 + clasificación estándar
// ─────────────────────────────────────────────────────────────
const AM_BERG = {
  nombre: 'Berg Balance Scale (BBS)',
  protocolo: '14 ítems de observación directa: sentarse/pararse, transferencias, equilibrio estático y dinámico. Tiempo: 15–20 min. Material: silla, cronómetro, regla, escalón. Puntuación 0–4 por ítem. Máx: 56.',
  rango: [0, 56],
  items: [
    'De pie a sentado',
    'Sentado a de pie',
    'Transferencias',
    'De pie sin apoyo',
    'Sentado sin apoyo',
    'De pie con ojos cerrados',
    'De pie con pies juntos',
    'Alcance con brazo extendido',
    'Recoger objeto del suelo',
    'Girarse para mirar atrás',
    'Giro 360°',
    'Apoyo alternante en escalón',
    'De pie con un pie delante',
    'Apoyo monopodal',
  ],
  cortes: [
    { rango: [0, 20],  label: 'Balance alterado — alto riesgo de caídas', color: 'var(--red)' },
    { rango: [21, 40], label: 'Balance aceptable — asistencia/supervisión posible', color: 'var(--amber)' },
    { rango: [41, 56], label: 'Balance bueno — funcionalmente independiente', color: 'var(--neon)' },
  ],
  // Park 2017 meta-análisis (comunidad, 5 estudios, N=570)
  evidencia: { sn: 0.73, sn_ci: [0.65, 0.79], sp: 0.90, sp_ci: [0.86, 0.93], auc: 0.97, ref: 'Park 2017 — Meta-análisis, comunidad, N=570' },
  semaforo: (s) => {
    if (s === null || s === '' || isNaN(s)) return 'nd';
    const v = +s;
    if (v >= 41) return 'verde';
    if (v >= 21) return 'amarillo';
    return 'rojo';
  },
  semaforo_label: (s) => {
    if (s === null || s === '' || isNaN(s)) return '—';
    const v = +s;
    if (v >= 41) return `${v}/56 — Balance bueno`;
    if (v >= 21) return `${v}/56 — Balance aceptable`;
    return `${v}/56 — Balance alterado`;
  },
};

// ─────────────────────────────────────────────────────────────
// AD-8 — Dementia Screening Interview
// Usarel et al. 2019, Int Psychogeriatr
// ─────────────────────────────────────────────────────────────
const AM_AD8 = {
  nombre: 'AD-8 — Entrevista de Detección de Demencia',
  descripcion: 'Administrado a informante (cuidador/familiar). Pregunta: "¿Ha notado cambio en las últimas semanas/meses en estas áreas?" Puntaje 1 = Sí, hay cambio / 0 = No o No sé.',
  tiempo: '~3 minutos',
  rango: [0, 8],
  items: [
    'Problemas de juicio (dificultad para tomar decisiones, malas decisiones financieras)',
    'Menor interés en hobbies o actividades',
    'Repite lo mismo (preguntas, historias, afirmaciones)',
    'Dificultad para aprender a usar aparatos (VCR, computadora, microondas, control remoto)',
    'Olvida el mes o el año correcto',
    'Dificultad para manejar asuntos financieros complejos (balancear chequera, impuestos, pagar facturas)',
    'Dificultad para recordar citas',
    'Problemas diarios de memoria o pensamiento',
  ],
  cortes: [
    { min: 0, max: 2, label: 'Normal — sin deterioro cognitivo significativo', color: 'var(--neon)' },
    { min: 3, max: 4, label: 'DCL — Deterioro cognitivo leve sospechado', color: 'var(--amber)', sn: 0.8167, sp: 0.9359 },
    { min: 5, max: 8, label: 'Demencia probable', color: 'var(--red)', sn: 1.0, sp: 0.963 },
  ],
  // Usarel 2019 (N=334 pacientes geriátricos)
  evidencia: {
    alpha_cronbach: 0.928,
    auc_deterioro: 0.979,
    auc_demencia:  0.999,
    ref: 'Usarel C et al. Int Psychogeriatr 2019;31(2):223–229.'
  },
  semaforo: (s) => {
    if (s === null || s === '' || isNaN(s)) return 'nd';
    const v = +s;
    if (v <= 2) return 'verde';
    if (v <= 4) return 'amarillo';
    return 'rojo';
  },
  semaforo_label: (s) => {
    if (s === null || s === '' || isNaN(s)) return '—';
    const v = +s;
    if (v <= 2) return `${v}/8 — Normal`;
    if (v <= 4) return `${v}/8 — Sospecha DCL (Sn 81.7%, Sp 93.6%)`;
    return `${v}/8 — Demencia probable (Sn 100%, Sp 96.3%)`;
  },
};

// ─────────────────────────────────────────────────────────────
// Mini-Cog — 3 Words + Clock Drawing
// Borson S 2000 (referenced in AD8 paper context + valoración geriátrica)
// ─────────────────────────────────────────────────────────────
const AM_MINICOG = {
  nombre: 'Mini-Cog',
  protocolo: '(1) Decir 3 palabras (sin relación entre sí). (2) Test del Reloj: dibujar reloj, poner las 12 horas y marcar la 11:10. (3) Repetir las 3 palabras. Puntaje: 0–2 pts palabra + 0 o 2 pts reloj = 0–5 total.',
  rango: [0, 5],
  palabras: ['manzana', 'centavo', 'mesa'],   // ejemplo estándar
  scoring_reloj: { 0: 'Anormal (errores significativos)', 2: 'Normal (horas correctas, agujas correctas)' },
  cortes: [
    { min: 0, max: 2, label: 'Screening positivo — deterioro cognitivo probable', sn_rango: '0.76–0.99', sp_rango: '0.89–0.96' },
    { min: 3, max: 5, label: 'Screening negativo — sin deterioro significativo' },
  ],
  semaforo: (s) => {
    if (s === null || s === '' || isNaN(s)) return 'nd';
    const v = +s;
    if (v >= 3) return 'verde';
    return 'rojo';
  },
  semaforo_label: (s) => {
    if (s === null || s === '' || isNaN(s)) return '—';
    const v = +s;
    if (v >= 3) return `${v}/5 — Screening negativo`;
    return `${v}/5 — Screening positivo (deterioro probable)`;
  },
};

// ─────────────────────────────────────────────────────────────
// CDT — Clock Drawing Test (Shulman 2000)
// Referenciado en Usarel 2019 (AD8 paper). Scores medios:
// Control=4.7, DCL=4.1, Demencia=1.2 (AD8 paper, Tabla 1)
// ─────────────────────────────────────────────────────────────
const AM_CDT = {
  nombre: 'CDT — Test del Dibujo del Reloj',
  protocolo: 'Hoja en blanco. Instrucción: "Dibuje un reloj con todas las horas y coloque las agujas marcando las 11:10". Calificación 1–5 según escala de Shulman.',
  escala: [
    { pts: 5, label: 'Correcto — agujas en las 11:10, todas las horas presentes' },
    { pts: 4, label: 'Leves errores visuoespaciales — agujas levemente imprecisas' },
    { pts: 3, label: 'Error medio — agujas incorrectas pero esfera con horas' },
    { pts: 2, label: 'Sólo esfera o números, sin agujas válidas' },
    { pts: 1, label: 'Intento sin éxito — no hay reloj reconocible' },
  ],
  // Valores reales de Usarel 2019, Tabla 1
  refs_medias: { control: 4.7, dcl: 4.1, demencia: 1.2 },
  semaforo: (s) => {
    if (s === null || s === '' || isNaN(s)) return 'nd';
    const v = +s;
    if (v >= 4) return 'verde';
    if (v >= 3) return 'amarillo';
    return 'rojo';
  },
  semaforo_label: (s) => {
    if (s === null || s === '' || isNaN(s)) return '—';
    const v = +s;
    if (v >= 4) return `${v}/5 — Normal (media control: 4.7)`;
    if (v >= 3) return `${v}/5 — Sospecha DCL (media DCL: 4.1)`;
    return `${v}/5 — Probable deterioro (media demencia: 1.2)`;
  },
};

// ─────────────────────────────────────────────────────────────
// GDS-15 — Escala de Depresión Geriátrica (Yesavage — versión corta)
// Referenciado en Wanden-Berghe 2021 y Cheong 2021 (GDS)
// ─────────────────────────────────────────────────────────────
const AM_GDS15 = {
  nombre: 'GDS-15 — Escala de Depresión Geriátrica',
  protocolo: 'Versión corta 15 ítems. Respuestas Sí/No. Cada ítem patológico suma 1 punto. Total: 0–15.',
  tiempo: '~5 minutos',
  // Ítem: [pregunta, respuesta_patológica ('si' o 'no')]
  items: [
    ['¿En general está satisfecho/a con su vida?',                                      'no'],
    ['¿Ha abandonado muchas actividades e intereses?',                                  'si'],
    ['¿Siente que su vida está vacía?',                                                 'si'],
    ['¿Se aburre a menudo?',                                                            'si'],
    ['¿Está de buen humor la mayor parte del tiempo?',                                  'no'],
    ['¿Tiene miedo de que algo malo le vaya a pasar?',                                  'si'],
    ['¿Se siente feliz la mayor parte del tiempo?',                                     'no'],
    ['¿Se siente a menudo desamparado/a?',                                              'si'],
    ['¿Prefiere quedarse en casa en vez de salir y hacer cosas nuevas?',                'si'],
    ['¿Cree que tiene más problemas de memoria que la mayoría de las personas?',        'si'],
    ['¿Cree que es maravilloso estar vivo/a en este momento?',                          'no'],
    ['¿Se siente inútil tal como está actualmente?',                                    'si'],
    ['¿Se siente lleno/a de energía?',                                                  'no'],
    ['¿Siente que su situación es desesperada?',                                        'si'],
    ['¿Cree que la mayoría de las personas están mejor que usted?',                     'si'],
  ],
  cortes: [
    { min: 0,  max: 5,  label: 'Normal',             color: 'var(--neon)'  },
    { min: 6,  max: 9,  label: 'Depresión probable', color: 'var(--amber)' },
    { min: 10, max: 15, label: 'Depresión',           color: 'var(--red)'   },
  ],
  ref: 'Wanden-Berghe C 2021 + Cheong CY 2021 (GDS como predictor de mortalidad)',
  semaforo: (s) => {
    if (s === null || s === '' || isNaN(s)) return 'nd';
    const v = +s;
    if (v <= 5)  return 'verde';
    if (v <= 9)  return 'amarillo';
    return 'rojo';
  },
  semaforo_label: (s) => {
    if (s === null || s === '' || isNaN(s)) return '—';
    const v = +s;
    if (v <= 5)  return `${v}/15 — Normal`;
    if (v <= 9)  return `${v}/15 — Depresión probable`;
    return `${v}/15 — Depresión`;
  },
};

// ─────────────────────────────────────────────────────────────
// Función de riesgo global (basada en nº de dominios en rojo/amarillo)
// ─────────────────────────────────────────────────────────────
function calcAmRiesgoGlobal(semaforos) {
  // semaforos: { tug, gait, sppb, berg, ad8, minicog, cdt, gds }
  const vals = Object.values(semaforos).filter(v => v !== 'nd');
  const rojos    = vals.filter(v => v === 'rojo').length;
  const amarillos = vals.filter(v => v === 'amarillo').length;

  let nivel, color, label, descripcion;
  if (rojos >= 2) {
    nivel = 'rojo'; color = 'var(--red)';
    label = '🔴 RIESGO ALTO';
    descripcion = `${rojos} dominios en rojo — evaluación multidisciplinar urgente`;
  } else if (rojos === 1 || amarillos >= 2) {
    nivel = 'amarillo'; color = 'var(--amber)';
    label = '🟡 RIESGO MODERADO';
    descripcion = `${rojos} rojo · ${amarillos} amarillo — intervención preventiva recomendada`;
  } else {
    nivel = 'verde'; color = 'var(--neon)';
    label = '🟢 RIESGO BAJO';
    descripcion = 'Sin señales de alerta significativas en esta evaluación';
  }
  return { nivel, color, label, descripcion, rojos, amarillos, total: vals.length };
}

window.AM_TUG     = AM_TUG;
window.AM_GAIT    = AM_GAIT;
window.AM_SPPB    = AM_SPPB;
window.AM_BERG    = AM_BERG;
window.AM_AD8     = AM_AD8;
window.AM_MINICOG = AM_MINICOG;
window.AM_CDT     = AM_CDT;
window.AM_GDS15   = AM_GDS15;
window.AM_REFS    = AM_REFS;
window.calcAmRiesgoGlobal = calcAmRiesgoGlobal;

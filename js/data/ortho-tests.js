// data/ortho-tests.js — catálogo tests ortopédicos por región (extraído de app.js)
const ORTHO_TESTS = {
  subacro: [
    { id:'neer',    name:'Neer',            sub:'Compresión subacromial',   ref:'Sn 0.72 / Sp 0.66' },
    { id:'hawkins', name:'Hawkins-Kennedy', sub:'Compresión subacromial',   ref:'Sn 0.83 / Sp 0.56 -- DESCARTAR RC' },
    { id:'yocum',   name:'Yocum',           sub:'Espacio subacromial',      ref:'Sn 0.78 / Sp 0.61' }
  ],
  manguito: [
    { id:'jobe',        name:'Jobe (Empty Can)',   sub:'Supraespinoso',          ref:'Sn 0.69 / Sp 0.66' },
    { id:'patte',       name:'Patte',              sub:'Infraespinoso/Red. menor',ref:'Sn 0.92 / Sp 0.30' },
    { id:'gerber',      name:'Gerber (Lift-off)',  sub:'Subescapular',           ref:'Sn 0.79 / Sp 0.89' },
    { id:'painful-arc', name:'Arco doloroso',      sub:'60-120° = RC',           ref:'LR+ 3.44 -- CONFIRMAR RC' }
  ],
  biceps: [
    { id:'speed',       name:'Speed',           sub:'Tendón bíceps proximal', ref:'Sn 0.69 / Sp 0.56' },
    { id:'yergason',    name:'Yergason',        sub:'Tendón bíceps / SLAP',   ref:'Sn 0.43 / Sp 0.79' },
    { id:'apprehension',name:'Apprehension',    sub:'Inestabilidad anterior', ref:'Sn 0.72 / Sp 0.96' },
    { id:'obrien',      name:"O'Brien (SLAP)",  sub:'Labrum superior',        ref:'Sn 0.47 / Sp 0.89' }
  ],
  ligamentos: [
    { id:'lachman',    name:'Lachman',           sub:'LCA -- Gold standard',  ref:'Sn 0.86 / Sp 0.91' },
    { id:'cajon-ant',  name:'Cajón anterior',    sub:'LCA',                  ref:'Sn 0.54 / Sp 0.72' },
    { id:'cajon-post', name:'Cajón posterior',   sub:'LCP',                  ref:'Sn 0.90 / Sp 0.99' },
    { id:'pivot-shift',name:'Pivot Shift',       sub:'LCA rotacional',       ref:'Sn 0.28 / Sp 0.98' },
    { id:'lelli',      name:'Lelli (Palanca)',   sub:'LCA -- alta Sn agudo',  ref:'Sn 1.00 / Sp 0.97' },
    { id:'valgo-est',  name:'Stress valgo 0°/30°',sub:'LLI',                ref:'Laxitud LLI' },
    { id:'varo-est',   name:'Stress varo 0°/30°', sub:'LLE',                ref:'Laxitud LLE' }
  ],
  meniscos: [
    { id:'mcmurray', name:'McMurray', sub:'Menisco medial/lateral', ref:'Sn 0.70 / Sp 0.71' },
    { id:'apley',    name:'Apley',    sub:'Menisco',                ref:'Sn 0.61 / Sp 0.70' },
    { id:'thessaly', name:'Thessaly', sub:'Menisco -- carga',        ref:'Sn 0.89 / Sp 0.97' }
  ],
  funcionales: [
    { id:'single-leg', name:'Single Leg Squat', sub:'Control motor rodilla', ref:'Valgo >10° = positivo' },
    { id:'step-down',  name:'Step-Down',        sub:'Control motor rodilla', ref:'Valgo dinámico' },
    { id:'ratio-iq',   name:'Ratio I/Q (HHD)',  sub:'<0.60 = déficit',       ref:'Valkyria / PushPull' }
  ],
  tobillo: [
    { id:'drawer-tob',  name:'Anterior Drawer', sub:'ATFL',          ref:'Sn 0.73 / Sp 0.60' },
    { id:'talar-tilt',  name:'Talar Tilt',      sub:'CFL',           ref:'Sn 0.50 / Sp 0.88' },
    { id:'thompson',    name:'Thompson',         sub:'Tendón Aquiles',ref:'Sn 0.96 / Sp 0.93' }
  ],
  lumbar: [
    { id:'slr',        name:'SLR (Lasègue)', sub:'L4-S1 · Pos <60°',    ref:'Sn 0.91 / Sp 0.26' },
    { id:'slump',      name:'SLUMP test',    sub:'Tensión dural',        ref:'Sn 0.84 / Sp 0.83' },
    { id:'aslr',       name:'ASLR',          sub:'Estabilidad lumbopélv',ref:'Estabilidad TP' },
    { id:'slr-cruzado',name:'SLR cruzado',   sub:'Hernia grave',         ref:'Sn 0.29 / Sp 0.88' }
  ],
  cadera: [
    // ── FAI / Labrum / Intraarticular ────────────────────────────────────
    { id:'fadir',              name:'FADIR',                    sub:'FAI / Labrum — cribado',           ref:'Sn 0.96 / Sp 0.10 — Ishøi BJSM 2021' },
    { id:'prone-ir-neutral',   name:'Prone IR neutro (0° flex)',sub:'FAI — MEJOR rule-in individual',   ref:'LR+ 4.83 / Sp 94% — Ishøi BJSM 2021' },
    { id:'faber',              name:'FABER (Patrick)',           sub:'SI / Cápsula / Displasia',         ref:'Sn 0.57 / Sp 0.71 — Reiman BJSM 2012' },
    { id:'scour',              name:'Scour / Labral stress',    sub:'Intraarticular / Labrum',          ref:'Sn 0.50 / Sp 0.29 — Maslowski 2010' },
    { id:'irop',               name:'IROP (IR + Sobrepresión)', sub:'FAI / Labrum',                     ref:'Sn 0.91 / Sp 0.18 — Maslowski 2010' },
    { id:'third-test',         name:'THIRD test',               sub:'Labrum — rule-in',                 ref:'Sn 98% / Sp 75% / LR+ 3.9 — Myrick 2014' },
    { id:'thomas',             name:'Thomas',                   sub:'Labrum / Psoas — LR+ 11.1',        ref:'Sn 0.89 / Sp 0.92 / LR+ 11.1 — Reiman 2012' },
    { id:'stinchfield',        name:'Stinchfield (Resisted SLR)',sub:'Intraarticular inespecífico',     ref:'Sn 0.59 / Sp 0.32 — Maslowski 2010' },
    { id:'posterior-impingement',name:'Posterior impingement',  sub:'FAI posterior / Labrum posterior', ref:'Sn 0.21 — baja Sn, alta especificidad' },
    { id:'maximal-squat',      name:'Maximal squat test',       sub:'FAI / Morfología cam',             ref:'Sn 0.75 / Sp 0.41 — Ayeni 2014 (en Reiman 2014)' },
    { id:'fpaw',               name:'FPAW (Foot Progression Angle Walking)',sub:'Morfología cam',       ref:'Sn 0.61 / Sp 0.56 — Caliesch BMJ Open 2020' },
    // ── Microinestabilidad ───────────────────────────────────────────────
    { id:'anterior-apprehension',name:'Anterior apprehension',  sub:'Microinestabilidad anterior',      ref:'Sn 0.71 / Sp 0.85 — Wong 2022' },
    { id:'abd-ext-er',         name:'Abducción-Extensión-RE',   sub:'Microinestabilidad — CPR',         ref:'Sn 0.81 / Sp 0.89 — Wong 2022' },
    { id:'prone-er',           name:'Prone External Rotation',  sub:'Microinestabilidad — alta Sp',     ref:'Sn 0.33 / Sp 0.98 — Wong 2022' },
    // ── Displasia / Otros ────────────────────────────────────────────────
    { id:'log-roll',           name:'Log Roll',                  sub:'Intraarticular / Displasia',       ref:'Sn 0.42 / Sp 0.62 — Wong 2022' },
    { id:'ligamentum-teres',   name:'Ligamentum Teres test',    sub:'Lesión lig. redondo',              ref:'Enseki JOSPT CPG 2023' },
    { id:'trendelenburg',      name:'Trendelenburg',             sub:'Glúteo medio / GTPS',              ref:'Sn 0.61 / Sp 0.92 / LR+ 6.83 — Reiman 2012' },
    { id:'ober',               name:'Ober',                      sub:'Banda iliotibial / Coxa saltans',  ref:'Tensión IT band' }
  ],
  caderaGluteal: [
    { id:'resisted-hip-abduction', name:'Resisted Hip Abduction',     sub:'Tendinopatía glútea',          ref:'Sn 0.71 / Sp 0.84 / LR+ 5.50 — Reiman 2012' },
    { id:'resisted-ext-derotation',name:'Resisted External Derotation',sub:'Tendinopatía glútea — mejor test', ref:'Sn 88% / Sp 97.3% / LR+ 32.6 — Lequesne 2008' }
  ],
  caderaFractura: [
    { id:'pppt',         name:'PPPT (Patela-Pubis Percussion)',  sub:'Fractura cuello femoral',          ref:'Sn 95% / Sp 86% / LR+ 6.11 — Reiman 2012 meta-análisis' },
    { id:'fulcrum-test', name:'Fulcrum test (Stress fracture)',  sub:'Fractura de estrés fémur',         ref:'Sn 88-93% / Sp 13-75% — Johnson & Kang' }
  ],
  caderaOA: [
    { id:'squat-posterior-pain',  name:'Cuclillas → dolor posterior', sub:'Artrosis cadera — mejor sign', ref:'LR+ 6.1 / Sn 24% / Sp 96% — Simel JAMA 2019' },
    { id:'groin-abd-add-pain',    name:'Dolor ingle en abd/aducc',    sub:'Artrosis cadera',              ref:'LR+ 5.7 / Sn 33% / Sp 94% — Simel JAMA 2019' },
    { id:'abductor-weakness-oa',  name:'Debilidad abductora',         sub:'Artrosis cadera',              ref:'LR+ 4.5 / Sn 44% / Sp 90% — Simel JAMA 2019' },
    { id:'hip-adduction-loss',    name:'Pérdida aducción pasiva',     sub:'Artrosis cadera',              ref:'LR+ 4.2 / Sn 80% / Sp 81% — Simel JAMA 2019' },
    { id:'hip-ir-loss',           name:'Pérdida RI pasiva',           sub:'Artrosis cadera',              ref:'LR+ 3.2 / Sn 66% / Sp 79% — Simel JAMA 2019' }
  ],
  dohaAductores: [
    { id:'doha-squeeze-0',    name:'Squeeze test 0 deg',         sub:'Aductores -- ingle atletica',         ref:'Sn 0.78 / Sp 0.50 -- cadera 0 grados' },
    { id:'doha-squeeze-45',   name:'Squeeze test 45 deg',        sub:'Aductores -- mas especifico',         ref:'Sn 0.56 / Sp 0.73 -- cadera 45 grados' },
    { id:'doha-squeeze-90',   name:'Squeeze test 90 deg',        sub:'Aductores / gracilis',                ref:'Complementario -- 90 grados rodilla' },
    { id:'doha-aduct-dolor',  name:'Palpacion aductor largo',    sub:'Proximal -- Criterio Doha obligatorio',ref:'Sn 0.90 -- punto de mayor dolor' },
    { id:'doha-aduct-resist', name:'Resistencia aductores',      sub:'Contraccion isometrica 0-45 deg',     ref:'Criterio Doha -- dolor reproducible' },
    { id:'doha-aduct-estir',  name:'Estiramiento aductor',       sub:'Abduccion pasiva maxima',             ref:'Criterio complementario Doha' }
  ],
  dohaPsoas: [
    { id:'doha-psoas-dolor',  name:'Palpacion iliopsoas',        sub:'Tendon distal / vientre -- Doha',     ref:'Criterio obligatorio ingle anterior' },
    { id:'doha-psoas-resist', name:'Resistencia flexion cadera', sub:'Isometrica supino 90 deg -- Doha',    ref:'Dolor reproducible = positivo Doha' },
    { id:'doha-psoas-estir',  name:'Estiramiento psoas',         sub:'Thomas modificado -- extension pasiva',ref:'Criterio complementario Doha' },
    { id:'doha-stork',        name:'Stork test (Flamingo)',      sub:'SIJ / Psoas bajo carga',              ref:'Sn 0.17 / Sp 0.79 -- SIJ loading' },
    { id:'doha-flex-activa',  name:'Flexion activa cadera',      sub:'Hip flexion pain provocation',        ref:'Criterio Doha -- ingle anterior' }
  ],
  dohaInguinal: [
    { id:'doha-ing-dolor',    name:'Palpacion canal inguinal',   sub:'Anillo inguinal superficial -- Doha', ref:'Criterio obligatorio hernia deportiva' },
    { id:'doha-ing-resist',   name:'Resistencia abd + flex',     sub:'Contraccion combinada -- Doha',       ref:'Criterio Doha inguinal' },
    { id:'doha-valsalva',     name:'Valsalva / tos provocada',   sub:'Aumento presion intraabdominal',      ref:'Hernia inguinal / deportiva' },
    { id:'doha-gibbon',       name:'Gibbon (inguinal sling)',     sub:'Canal inguinal bajo carga',           ref:'Sn 0.99 / Sp 0.99 -- hernia deportiva' }
  ],
  dohaComplementarios: [
    { id:'doha-pubis',        name:'Palpacion pubis',            sub:'Symphysis pubis -- osteitis pubis',   ref:'Criterio complementario Doha' },
    { id:'doha-rectus',       name:'Palpacion recto abdominal',  sub:'Insercion pubica -- Doha',            ref:'Criterio complementario abdomen bajo' },
    { id:'doha-cadera-rom',   name:'Dolor ROM cadera activo',    sub:'RI / RE bajo carga -- FAI asociado',  ref:'Descartar FAI concomitante' },
    { id:'doha-posterior',    name:'Dolor posterior cadera',     sub:'Gluteo / isquion -- diferencial',     ref:'Descartar tendinopatia isquiosural' }
  ],
  cervicalNeural: [
    { id:'spurling',          name:'Spurling',                   sub:'Compresion raiz nerviosa cervical',   ref:'Sn 0.50 / Sp 0.86 -- LR+ 3.5' },
    { id:'distraccion-cx',    name:'Distraccion cervical',       sub:'Alivio = compresion discal / facet',  ref:'Sn 0.44 / Sp 0.90 -- complementa Spurling' },
    { id:'valsalva-cx',       name:'Valsalva cervical',          sub:'Hernia discal / lesion ocupante',     ref:'Aumento presion intradiscal' },
    { id:'ultt1',             name:'ULTT1 (brachial tension)',   sub:'Tension neural miembro superior',     ref:'Sn 0.97 / Sp 0.22 -- descartar compresion' },
    { id:'ultt2',             name:'ULTT2 (mediano / radial)',   sub:'Tension nervio mediano / radial',     ref:'Diferencia > 10 deg = positivo' },
    { id:'roos',              name:'Roos (EAST)',                 sub:'Desfiladero toracico',                ref:'3 min -- parestesias = positivo' }
  ],
  cervicalArticular: [
    { id:'flexion-rot',       name:'Flexion-Rotation test',      sub:'C1-C2 -- cervicogenico',              ref:'Sn 0.91 / Sp 0.90 -- cefalea cervicogenica' },
    { id:'alar-lig',          name:'Alar ligament test',         sub:'Estabilidad alar -- trauma',          ref:'Sn 0.27 / Sp 0.64 -- post whiplash' },
    { id:'sharp-purser',      name:'Sharp-Purser',                sub:'Inestabilidad C0-C2',                 ref:'Sn 0.69 / Sp 0.96 -- AR / trauma' },
    { id:'ppivm-cx',          name:'PPIVM cervical',              sub:'Movilidad intervertebral pasiva',     ref:'Hipomovil / hipermovil por segmento' }
  ],
  cervicalMuscular: [
    { id:'deep-flex-cx',      name:'Deep Neck Flexor test',      sub:'Resistencia flexores profundos',      ref:'< 38 mmHg = deficit -- Stabilizer' },
    { id:'cranio-cx',         name:'Craniocervical flexion test', sub:'Longus colli activation',             ref:'5 niveles: 10-22-26-30 mmHg' },
    { id:'fuerza-cx-lat',     name:'Fuerza lateral cervical',    sub:'HHD o escala manual',                 ref:'Asimetria > 10% = significativa' }
  ],
  codoLateral: [
    { id:'cozen',             name:'Cozen',                      sub:'Epicondilalgia lateral · ECRB',       ref:'Sn 0.84 / Sp 0.75 -- Lucado 2022 -- extensión muñeca resistida' },
    { id:'mill',              name:'Mill (estiramiento)',         sub:'Epicondilalgia lateral · extensores', ref:'Sn 0.53 / Sp 0.69 -- Lucado 2022 -- estiramiento extensores + pron' },
    { id:'maudsley',          name:'Maudsley (dedo medio)',      sub:'ECRB -- epicóndilo lateral',          ref:'Sn 0.52 / Sp 0.48 -- extensión 3° dedo resistida -- alta Sn cluster' },
    { id:'chair-test',        name:'Chair lifting test',         sub:'Epicondilalgia lateral funcional',    ref:'Dolor/debilidad al levantar silla con palma abajo' }
  ],
  codoMedial: [
    { id:'golfer-elbow',      name:'Golfer elbow test',          sub:'Epicondilalgia medial',               ref:'Sn 0.64 / Sp 0.69 -- flexion muneca resist.' },
    { id:'valgus-codo',       name:'Stress valgo codo',          sub:'LCU (cubital colateral)',             ref:'Valgus en 20-30 deg flexion -- lanzadores' },
    { id:'milking',           name:'Milking maneuver',            sub:'LCU -- atletas overhead',             ref:'Sn 0.76 -- lanzadores / overhead' }
  ],
  codoLigamentos: [
    { id:'tinel-cubital',     name:'Tinel cubital tunnel',       sub:'Nervio cubital',                      ref:'Parestesias 4-5 dedo = positivo' },
    { id:'elbow-flex-test',   name:'Elbow flexion test',         sub:'Nervio cubital -- compresion',        ref:'Sn 0.75 / Sp 0.99 -- flexion max 3 min' },
    { id:'lateral-pivot-codo',name:'Lateral pivot shift codo',   sub:'LUCL -- inestabilidad lateral',       ref:'Sn 0.38 / Sp 1.0' }
  ],
  patelo: [
    { id:'clarke',            name:'Clarke (Grind test)',        sub:'Articulacion patelofemoral',          ref:'Baja especificidad -- usar en contexto' },
    { id:'zohlen',            name:'Zohlen test',                sub:'Compresion patelar activa',           ref:'Dolor al contraer cuad con compresion' },
    { id:'patela-tilt',       name:'Patellar tilt test',         sub:'Retinaculopatia lateral',             ref:'< 0 deg tilt = tension retinacular' },
    { id:'jsign',             name:'J-sign (patellar glide)',    sub:'Tracking patelar -- VMO',             ref:'J-sign = disfuncion VMO / PFPS' },
    { id:'apprehension-pat',  name:'Patella apprehension',       sub:'Inestabilidad / luxacion patelar',    ref:'Sn 0.39 / Sp 0.93 -- luxacion recurrente' }
  ],
  tendonesRodilla: [
    { id:'single-decline',    name:'Single Leg Decline Squat',   sub:'Carga excentrica tendon patelar',    ref:'Gold standard funcional tendinopatia' },
    { id:'royal-london',      name:'Royal London Hop test',       sub:'Tendinopatia patelar funcional',     ref:'VAS > 3/10 = positivo' },
    { id:'arc-patelar',       name:'Arc test patelar',            sub:'Tendinopatia -- palpacion en ext.',  ref:'Sn 0.78 -- extension completa' },
    { id:'quad-tendon',       name:'Tendon cuadricipital',        sub:'Insercion proximal patelar',         ref:'Polo superior -- adultos > 40' }
  ],
  pie: [
    { id:'thompson-aq',       name:'Thompson (Aquiles)',          sub:'Ruptura tendon de Aquiles',          ref:'Sn 0.96 / Sp 0.93 -- squeeze pantorrilla' },
    { id:'arc-aquiles',       name:'Arc sign Aquiles',            sub:'Insercion vs midportion',            ref:'Desaparece en dorsiflexion = insercion' },
    { id:'windlass',          name:'Windlass test',               sub:'Fascia plantar',                     ref:'Sn 0.32 / Sp 1.0 -- fasciitis plantar' },
    { id:'too-many-toes',     name:'Too many toes sign',          sub:'PTTD -- tibial posterior',           ref:'Valgo pie / colapso arco medial' },
    { id:'single-heel-rise',  name:'Single heel rise',            sub:'Tibial posterior / Aquiles fuerza',  ref:'< 25 reps o asimetria = deficit' },
    { id:'mulder',            name:'Mulder click (Morton)',       sub:'Neuroma de Morton',                  ref:'Click + dolor = neuroma interdigital' }
  ],
  muneca: [
    { id:'finkelstein',       name:'Finkelstein',                 sub:'De Quervain -- 1er compartimento',   ref:'Sn 0.89 / Sp 0.14 -- muy sensible' },
    { id:'phalen',            name:'Phalen',                      sub:'Tunel carpiano -- mediano',          ref:'Sn 0.68 / Sp 0.73 -- 60 seg flexion max' },
    { id:'tinel-carpo',       name:'Tinel carpo',                 sub:'Nervio mediano -- tunel carpiano',   ref:'Sn 0.50 / Sp 0.77 -- percusion' },
    { id:'durkan',            name:'Durkan (compresion directa)', sub:'Tunel carpiano -- mas especifico',   ref:'Sn 0.87 / Sp 0.90' },
    { id:'tfcc-grind',        name:'TFCC grind test',             sub:'Complejo triangular fibrocartilago', ref:'Dolor ulnar en rotacion + carga' },
    { id:'watson',            name:'Watson (scaphoid shift)',      sub:'Inestabilidad escafoides / SL',      ref:'Sn 0.69 / Sp 0.64 -- clunk = positivo' }
  ]
};

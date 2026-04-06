// ========================================================
// INFORME AVANZADO v2 - Selección de tests, audiencia y evolución
// ========================================================
// Dependencias: app.js, atletas.js, dashboard.js, saltos.js
// ========================================================

// ── CONFIGURACIÓN DEL INFORME ──
let informeConfig = {
  audiencia: 'paciente', // 'paciente', 'medico', 'entrenador'
  testsSeleccionados: {
    calidadMovimiento: true,
    movilidad: true,
    saltos: true,
    simetria: true,
    fuerzaRelativa: true,
    evolutivos: false,
    imagenes: true
  },
  compararCon: null,
  incluirRecomendaciones: true,
  incluirPlanAccion: true
};

// ── TESTS DISPONIBLES ──
const TESTS_DISPONIBLES = {
  calidadMovimiento: { nombre: 'Calidad de Movimiento (OHS)', icono: '🎯', default: true },
  movilidad: { nombre: 'Movilidad Articular', icono: '📐', default: true },
  saltos: { nombre: 'Saltos Verticales (SJ/CMJ/Abalakov)', icono: '🦘', default: true },
  simetria: { nombre: 'Simetría Funcional (Hop Tests)', icono: '⚖️', default: true },
  fuerzaRelativa: { nombre: 'Perfil de Fuerza Relativa', icono: '💪', default: true },
  evolutivos: { nombre: 'Comparativa Evolutiva', icono: '📈', default: false },
  fvCurve: { nombre: 'Curva Fuerza-Velocidad', icono: '📊', default: false },
  fatiga: { nombre: 'Estado de Fatiga (Hooper)', icono: '⚡', default: false }
};

// ── PLANTILLAS POR AUDIENCIA ──
const PLANTILLAS_AUDIENCIA = {
  paciente: {
    tono: 'motivador',
    nivelTecnico: 'bajo',
    destacar: ['logros', 'mejoras', 'recomendaciones'],
    evitar: ['terminologia medica compleja', 'porcentajes de riesgo'],
    intro: '¡Hola! Este es tu informe personalizado. Vamos a ver cómo está tu cuerpo y qué podemos hacer para que rindas mejor y te sientas genial.'
  },
  medico: {
    tono: 'tecnico',
    nivelTecnico: 'alto',
    destacar: ['hallazgos clinicos', 'asimetrias', 'factores riesgo', 'valores numericos'],
    evitar: ['lenguaje motivacional excesivo'],
    intro: 'Informe clínico-deportivo con datos objetivos de la evaluación funcional del atleta.'
  },
  entrenador: {
    tono: 'operativo',
    nivelTecnico: 'medio',
    destacar: ['cargas entrenamiento', 'objetivos semanales', 'test clave', 'progresion'],
    evitar: ['jerga medica innecesaria'],
    intro: 'Análisis de rendimiento para optimizar la planificación del entrenamiento.'
  }
};

// ── REFERENCIAS PARA SEMAFOROS ──
const REFERENCIAS_INFORME = {
  sj: { bajo: 25, normal: 35, elite: 45, unidad: 'cm' },
  cmj: { bajo: 30, normal: 40, elite: 55, unidad: 'cm' },
  abk: { bajo: 35, normal: 45, elite: 60, unidad: 'cm' },
  bj: { bajo: 160, normal: 200, elite: 240, unidad: 'cm' },
  lunge: { deficit: 35, limite: 40, optimo: 50, unidad: '°' },
  tromCad: { deficit: 70, limite: 85, optimo: 100, unidad: '°' },
  tromHom: { deficit: 120, limite: 140, optimo: 160, unidad: '°' }
};

// ========================================================
// MODAL DE CONFIGURACIÓN DEL INFORME
// ========================================================

function mostrarConfiguracionInforme() {
  if (!cur) { alert('Seleccioná un atleta primero'); return; }
  
  const modal = document.createElement('div');
  modal.id = 'modal-config-informe';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:10000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)';
  
  const testsHtml = Object.entries(TESTS_DISPONIBLES).map(([key, test]) => `
    <label style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer">
      <input type="checkbox" id="test-${key}" ${informeConfig.testsSeleccionados[key] ? 'checked' : ''} 
        onchange="informeConfig.testsSeleccionados['${key}']=this.checked">
      <span style="font-size:20px">${test.icono}</span>
      <div>
        <div style="font-weight:600;font-size:14px">${test.nombre}</div>
        <div style="font-size:10px;color:rgba(255,255,255,.4)">Incluir en el informe</div>
      </div>
    </label>
  `).join('');

  const fechasPrevias = obtenerFechasEvaluacionesParaComparativa();
  
  modal.innerHTML = `
    <div style="background:#0f0f0f;border:1px solid rgba(57,255,122,.25);border-radius:20px;width:100%;max-width:600px;max-height:90vh;overflow-y:auto">
      <div style="padding:24px">
        <div style="font-family:monospace;font-size:11px;color:#39FF7A;margin-bottom:8px">MOVEMETRICS</div>
        <div style="font-size:22px;font-weight:800;margin-bottom:20px">Configurar Informe</div>
        
        <!-- Audiencia -->
        <div style="margin-bottom:24px">
          <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#39FF7A">👤 ¿Para quién es este informe?</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button id="audiencia-paciente" class="btn ${informeConfig.audiencia === 'paciente' ? 'btn-neon' : 'btn-ghost'}" style="flex:1">🏃 Paciente</button>
            <button id="audiencia-medico" class="btn ${informeConfig.audiencia === 'medico' ? 'btn-neon' : 'btn-ghost'}" style="flex:1">🩺 Médico</button>
            <button id="audiencia-entrenador" class="btn ${informeConfig.audiencia === 'entrenador' ? 'btn-neon' : 'btn-ghost'}" style="flex:1">📋 Entrenador</button>
          </div>
        </div>
        
        <!-- Tests a incluir -->
        <div style="margin-bottom:24px">
          <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#4D9EFF">📋 Seleccioná los tests</div>
          <div style="background:rgba(255,255,255,.03);border-radius:12px;padding:12px">
            ${testsHtml}
          </div>
        </div>
        
        <!-- Comparativa evolutiva -->
        <div style="margin-bottom:24px">
          <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#FFB020">📊 Comparativa evolutiva</div>
          <div style="background:rgba(255,255,255,.03);border-radius:12px;padding:12px">
            <label style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <input type="checkbox" id="comparar-evolutivo" ${informeConfig.compararCon ? 'checked' : ''}>
              <span>Comparar con evaluación anterior</span>
            </label>
            <div id="select-fecha-evolutivo" style="display:${informeConfig.compararCon ? 'block' : 'none'}">
              <select id="fecha-evolutiva" class="inp" style="width:100%">
                <option value="">Seleccionar fecha</option>
                ${fechasPrevias.map(f => `<option value="${f.fecha}" ${informeConfig.compararCon === f.fecha ? 'selected' : ''}>${f.fecha} - ${f.tests.join(', ')}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
        
        <!-- Botones -->
        <div style="display:flex;gap:12px;margin-top:20px">
          <button id="btn-generar-informe" class="btn btn-neon" style="flex:1">📄 Generar Informe</button>
          <button id="btn-cerrar-config" class="btn btn-ghost">Cancelar</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Bind eventos
  document.getElementById('audiencia-paciente')?.addEventListener('click', () => {
    informeConfig.audiencia = 'paciente';
    document.querySelectorAll('#modal-config-informe .btn').forEach(b => {
      if (b.id?.startsWith('audiencia-')) b.className = 'btn btn-ghost';
    });
    document.getElementById('audiencia-paciente').className = 'btn btn-neon';
  });
  
  document.getElementById('audiencia-medico')?.addEventListener('click', () => {
    informeConfig.audiencia = 'medico';
    document.querySelectorAll('#modal-config-informe .btn').forEach(b => {
      if (b.id?.startsWith('audiencia-')) b.className = 'btn btn-ghost';
    });
    document.getElementById('audiencia-medico').className = 'btn btn-neon';
  });
  
  document.getElementById('audiencia-entrenador')?.addEventListener('click', () => {
    informeConfig.audiencia = 'entrenador';
    document.querySelectorAll('#modal-config-informe .btn').forEach(b => {
      if (b.id?.startsWith('audiencia-')) b.className = 'btn btn-ghost';
    });
    document.getElementById('audiencia-entrenador').className = 'btn btn-neon';
  });
  
  const chkComparar = document.getElementById('comparar-evolutivo');
  chkComparar?.addEventListener('change', (e) => {
    const selectDiv = document.getElementById('select-fecha-evolutivo');
    selectDiv.style.display = e.target.checked ? 'block' : 'none';
    if (!e.target.checked) informeConfig.compararCon = null;
  });
  
  const selectFecha = document.getElementById('fecha-evolutiva');
  selectFecha?.addEventListener('change', (e) => {
    informeConfig.compararCon = e.target.value || null;
  });
  
  document.getElementById('btn-generar-informe')?.addEventListener('click', () => {
    modal.remove();
    generarInformePersonalizado();
  });
  
  document.getElementById('btn-cerrar-config')?.addEventListener('click', () => {
    modal.remove();
  });
}

// ── OBTENER FECHAS DE EVALUACIONES ──
function obtenerFechasEvaluacionesParaComparativa() {
  if (!cur) return [];
  const fechas = [];
  Object.entries(cur.evals || {}).forEach(([key, data]) => {
    if (data?.fecha) {
      const fecha = data.fecha;
      const existing = fechas.find(f => f.fecha === fecha);
      const tipo = key.split('_')[0];
      const tipoNombre = {
        'fv': 'F-V', 'saltos': 'Saltos', 'sprint': 'Sprint',
        'mov': 'Movilidad', 'fatiga': 'Fatiga', 'fms': 'FMS'
      }[tipo] || tipo;
      
      if (existing) {
        if (!existing.tests.includes(tipoNombre)) existing.tests.push(tipoNombre);
      } else {
        fechas.push({ fecha, tests: [tipoNombre] });
      }
    }
  });
  return fechas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

// ========================================================
// GENERAR INFORME PERSONALIZADO
// ========================================================

async function generarInformePersonalizado() {
  if (!cur) { alert('Seleccioná un atleta primero'); return; }
  
  // Obtener datos previos si hay comparativa
  let datosPrevios = null;
  if (informeConfig.compararCon) {
    datosPrevios = obtenerDatosPorFecha(informeConfig.compararCon);
  }
  
  // Crear modal de informe
  if (!document.getElementById('modal-informe-avanzado')) {
    crearModalInformeAvanzado();
  }
  
  openModal('modal-informe-avanzado');
  document.getElementById('informe-avanzado-loading').classList.remove('hidden');
  document.getElementById('informe-avanzado-content').classList.add('hidden');
  
  const contenido = construirInformeTexto(datosPrevios);
  
  document.getElementById('informe-avanzado-text').value = contenido;
  document.getElementById('informe-avanzado-loading').classList.add('hidden');
  document.getElementById('informe-avanzado-content').classList.remove('hidden');
}

function obtenerDatosPorFecha(fecha) {
  if (!cur || !cur.evalsByDate || !cur.evalsByDate[fecha]) return null;
  const data = cur.evalsByDate[fecha];
  return {
    fecha,
    saltos: data.saltos || null,
    movilidad: data.movilidad || null,
    fuerza: Object.values(cur.evals || {}).find(e => e.fecha === fecha && (e.ejercicio || e.oneRM)) || null
  };
}

// ========================================================
// CONSTRUIR TEXTO DEL INFORME
// ========================================================

function construirInformeTexto(datosPrevios) {
  const s = cur;
  const plantilla = PLANTILLAS_AUDIENCIA[informeConfig.audiencia];
  const tests = informeConfig.testsSeleccionados;
  const esComparativo = datosPrevios !== null;
  
  const lineas = [];
  
  // Header
  lineas.push(`# INFORME DE EVALUACIÓN FUNCIONAL\n`);
  lineas.push(`**Atleta:** ${s.nombre}`);
  lineas.push(`**Deporte:** ${s.deporte || '--'}${s.puesto ? ` · ${s.puesto}` : ''}`);
  lineas.push(`**Fecha:** ${new Date().toLocaleDateString('es-AR')}`);
  if (esComparativo) lineas.push(`**Comparativa con:** ${datosPrevios.fecha}`);
  lineas.push(`**Audiencia:** ${plantilla.audiencia === 'paciente' ? 'Deportista' : plantilla.audiencia === 'medico' ? 'Médico' : 'Entrenador'}`);
  lineas.push(`\n---\n`);
  
  // Introducción
  lineas.push(`## 📋 Introducción\n`);
  lineas.push(`${plantilla.intro}\n`);
  
  // ============================================================
  // 1. CALIDAD DE MOVIMIENTO
  // ============================================================
  if (tests.calidadMovimiento) {
    const fmsData = getLastEval('fms');
    const ohsCriterios = fmsData?.ohs?.criterios || [];
    const ohsScore = ohsCriterios.filter(c => c === 'si').length;
    const ohsTotal = 4;
    const ohsPct = (ohsScore / ohsTotal * 100).toFixed(0);
    
    lineas.push(`## 🎯 1. Calidad de Movimiento\n`);
    lineas.push(`### Sentadilla Overhead (OHS)`);
    lineas.push(`**Puntuación:** ${ohsScore}/${ohsTotal} (${ohsPct}%)\n`);
    lineas.push(`| Criterio | Estado |`);
    lineas.push(`|----------|--------|`);
    lineas.push(`| Rodillas alineadas con los pies (25%) | ${ohsCriterios[0] === 'si' ? '✅ CUMPLE' : '❌ NO CUMPLE'} |`);
    lineas.push(`| Fémur debajo de la horizontal (25%) | ${ohsCriterios[1] === 'si' ? '✅ CUMPLE' : '❌ NO CUMPLE'} |`);
    lineas.push(`| Torso paralelo a la tibia (25%) | ${ohsCriterios[2] === 'si' ? '✅ CUMPLE' : '❌ NO CUMPLE'} |`);
    lineas.push(`| Barra alineada con los pies (25%) | ${ohsCriterios[3] === 'si' ? '✅ CUMPLE' : '❌ NO CUMPLE'} |`);
    
    if (plantilla.audiencia === 'paciente') {
      if (ohsPct >= 75) lineas.push(`\n✅ **¡Muy bien!** Tu calidad de movimiento es excelente.`);
      else if (ohsPct >= 50) lineas.push(`\n🟡 **Buen trabajo!** Hay pequeños detalles que podemos ajustar.`);
      else lineas.push(`\n🔴 **Área de oportunidad.** Podemos mejorar tu patrón de movimiento.`);
    }
    lineas.push(`\n---\n`);
  }
  
  // ============================================================
  // 2. MOVILIDAD ARTICULAR
  // ============================================================
  if (tests.movilidad) {
    const lungeD = s.lungeD || 0;
    const lungeI = s.lungeI || 0;
    const tromCadD = s.tromCadD || 0;
    const tromCadI = s.tromCadI || 0;
    const tromHomD = s.tromHomD || 0;
    const tromHomI = s.tromHomI || 0;
    
    const getEstado = (val, ref) => {
      if (!val) return '--';
      if (val >= ref.optimo) return '🟢 Óptimo';
      if (val >= ref.limite) return '🟡 Límite';
      return '🔴 Déficit';
    };
    
    lineas.push(`## 📐 2. Movilidad Articular\n`);
    
    lineas.push(`### Tobillo (Lunge Test)`);
    lineas.push(`| Lado | Valor | Estado |`);
    lineas.push(`|------|-------|--------|`);
    lineas.push(`| Derecho | ${lungeD || '--'}° | ${getEstado(lungeD, REFERENCIAS_INFORME.lunge)} |`);
    lineas.push(`| Izquierdo | ${lungeI || '--'}° | ${getEstado(lungeI, REFERENCIAS_INFORME.lunge)} |`);
    if (lungeD && lungeI) {
      const asim = Math.abs(lungeD - lungeI);
      lineas.push(`\n**Asimetría:** ${asim}° ${asim > 5 ? '⚠️ Significativa (>5°)' : '✓ Normal'}`);
    }
    
    lineas.push(`\n### Cadera (TROM)`);
    lineas.push(`| Lado | Valor | Estado |`);
    lineas.push(`|------|-------|--------|`);
    lineas.push(`| Derecho | ${tromCadD || '--'}° | ${getEstado(tromCadD, REFERENCIAS_INFORME.tromCad)} |`);
    lineas.push(`| Izquierdo | ${tromCadI || '--'}° | ${getEstado(tromCadI, REFERENCIAS_INFORME.tromCad)} |`);
    
    lineas.push(`\n### Hombro (TROM)`);
    lineas.push(`| Lado | Valor | Estado |`);
    lineas.push(`|------|-------|--------|`);
    lineas.push(`| Derecho | ${tromHomD || '--'}° | ${getEstado(tromHomD, REFERENCIAS_INFORME.tromHom)} |`);
    lineas.push(`| Izquierdo | ${tromHomI || '--'}° | ${getEstado(tromHomI, REFERENCIAS_INFORME.tromHom)} |`);
    
    lineas.push(`\n---\n`);
  }
  
  // ============================================================
  // 3. SALTABILIDAD
  // ============================================================
  if (tests.saltos) {
    const saltoData = getLastEval('saltos');
    const sj = saltoData?.avg?.sj || 0;
    const cmj = saltoData?.avg?.cmj || 0;
    const abk = saltoData?.avg?.abk || 0;
    const bj = saltoData?.avg?.bj || 0;
    
    const getSemaforo = (val, ref) => {
      if (!val) return { color: '⚪', texto: 'Sin datos' };
      if (val >= ref.elite) return { color: '🟢', texto: 'Elite' };
      if (val >= ref.normal) return { color: '🟡', texto: 'Normal' };
      return { color: '🔴', texto: 'Bajo' };
    };
    
    lineas.push(`## 🦘 3. Saltabilidad\n`);
    lineas.push(`### Saltos Verticales - Batería Bosco\n`);
    lineas.push(`| Prueba | Valor | Referencia | Estado |`);
    lineas.push(`|--------|-------|------------|--------|`);
    
    const sjEst = getSemaforo(sj, REFERENCIAS_INFORME.sj);
    lineas.push(`| SJ (fuerza explosiva) | ${sj || '--'} cm | >${REFERENCIAS_INFORME.sj.elite} (Elite) | ${sjEst.color} ${sjEst.texto} |`);
    
    const cmjEst = getSemaforo(cmj, REFERENCIAS_INFORME.cmj);
    lineas.push(`| CMJ (fuerza elástica) | ${cmj || '--'} cm | >${REFERENCIAS_INFORME.cmj.elite} (Elite) | ${cmjEst.color} ${cmjEst.texto} |`);
    
    const abkEst = getSemaforo(abk, REFERENCIAS_INFORME.abk);
    lineas.push(`| Abalakov (coordinación) | ${abk || '--'} cm | >${REFERENCIAS_INFORME.abk.elite} (Elite) | ${abkEst.color} ${abkEst.texto} |`);
    
    if (sj && cmj) {
      const ie = ((cmj - sj) / sj * 100).toFixed(1);
      const ieColor = ie >= 15 ? '🟢' : ie >= 8 ? '🟡' : '🔴';
      lineas.push(`\n**Índice de Elasticidad:** ${ie}% ${ieColor}`);
    }
    
    if (bj) {
      const bjEst = getSemaforo(bj, REFERENCIAS_INFORME.bj);
      lineas.push(`\n### Salto Horizontal (Broad Jump)`);
      lineas.push(`**Promedio:** ${bj} cm → ${bjEst.color} ${bjEst.texto}`);
      if (s.peso) {
        const au = (bj / 100) * s.peso;
        lineas.push(`**Unidades de salto (AU):** ${au.toFixed(1)} kg·m`);
      }
    }
    
    // Comparativa evolutiva
    if (esComparativo && datosPrevios?.saltos?.cmj && cmj) {
      const mejora = cmj - datosPrevios.saltos.cmj;
      const flecha = mejora > 0 ? '⬆️' : mejora < 0 ? '⬇️' : '➡️';
      lineas.push(`\n### 📈 Evolución CMJ`);
      lineas.push(`**Anterior (${datosPrevios.fecha}):** ${datosPrevios.saltos.cmj.toFixed(1)} cm`);
      lineas.push(`**Actual:** ${cmj.toFixed(1)} cm`);
      lineas.push(`**Cambio:** ${flecha} ${mejora > 0 ? '+' : ''}${mejora.toFixed(1)} cm`);
    }
    
    lineas.push(`\n---\n`);
  }
  
  // ============================================================
  // 4. SIMETRÍA FUNCIONAL
  // ============================================================
  if (tests.simetria) {
    const saltoData = getLastEval('saltos');
    const hopTests = [
      { key: 'sh', nombre: 'Single Hop', unidad: 'cm', umbral: 90 },
      { key: '3h', nombre: 'Triple Hop', unidad: 'cm', umbral: 90 },
      { key: 't6h', nombre: 'Timed 6m Hop', unidad: 's', umbral: 90, lowerIsBetter: true }
    ];
    
    let hayDatos = false;
    const filas = [];
    
    for (const test of hopTests) {
      const valD = saltoData?.avg?.[`${test.key}D`] || 0;
      const valI = saltoData?.avg?.[`${test.key}I`] || 0;
      
      if (valD && valI) {
        hayDatos = true;
        const mayor = Math.max(valD, valI);
        const menor = Math.min(valD, valI);
        const lsi = (menor / mayor * 100).toFixed(1);
        const cumple = lsi >= test.umbral;
        filas.push(`| ${test.nombre} | ${valD}${test.unidad} | ${valI}${test.unidad} | ${lsi}% | ${cumple ? '✅ APTO' : '🔴 NO APTO'} |`);
      }
    }
    
    if (hayDatos) {
      lineas.push(`## ⚖️ 4. Simetría Funcional\n`);
      lineas.push(`| Test | Derecha | Izquierda | LSI | Estado RTS |`);
      lineas.push(`|------|---------|-----------|-----|------------|`);
      filas.forEach(f => lineas.push(f));
      lineas.push(`\n*Criterio RTS (Retorno al Deporte): LSI ≥ 90%*\n`);
    }
    
    lineas.push(`---\n`);
  }
  
  // ============================================================
  // 5. PERFIL DE FUERZA RELATIVA
  // ============================================================
  if (tests.fuerzaRelativa && s.lastFV?.oneRM && s.peso) {
    const fr = (s.lastFV.oneRM / s.peso).toFixed(2);
    let nivel = '', color = '';
    if (fr >= 1.5) { nivel = 'Alto'; color = '🟢'; }
    else if (fr >= 1.0) { nivel = 'Medio'; color = '🟡'; }
    else { nivel = 'Bajo'; color = '🔴'; }
    
    lineas.push(`## 💪 5. Perfil de Fuerza Relativa\n`);
    lineas.push(`**Ejercicio:** ${s.lastFV.ejercicio || 'Sentadilla'}`);
    lineas.push(`**1RM Estimado:** ${s.lastFV.oneRM.toFixed(0)} kg`);
    lineas.push(`**Peso corporal:** ${s.peso} kg`);
    lineas.push(`**Fuerza Relativa:** ${fr} × PC → ${color} **${nivel}**\n`);
    lineas.push(`| Nivel | Rango |`);
    lineas.push(`|-------|-------|`);
    lineas.push(`| Alto | >1.5× PC |`);
    lineas.push(`| Medio | 1.0-1.5× PC |`);
    lineas.push(`| Bajo | <1.0× PC |`);
    
    if (esComparativo && datosPrevios?.fuerza?.oneRM) {
      const frPrev = (datosPrevios.fuerza.oneRM / s.peso).toFixed(2);
      const mejora = (fr - frPrev).toFixed(2);
      const flecha = mejora > 0 ? '⬆️' : mejora < 0 ? '⬇️' : '➡️';
      lineas.push(`\n### 📈 Evolución`);
      lineas.push(`**Anterior (${datosPrevios.fecha}):** ${frPrev} × PC`);
      lineas.push(`**Actual:** ${fr} × PC`);
      lineas.push(`**Cambio:** ${flecha} ${mejora > 0 ? '+' : ''}${mejora} × PC`);
    }
    
    lineas.push(`\n---\n`);
  }
  
  // ============================================================
  // 6. PLAN DE ACCIÓN
  // ============================================================
  if (informeConfig.incluirPlanAccion) {
    lineas.push(`## 📋 6. Plan de Acción\n`);
    lineas.push(`| Prioridad | Área | Acción | Frecuencia |`);
    lineas.push(`|-----------|------|--------|------------|`);
    
    // Recomendaciones basadas en datos
    if ((s.lungeD || 0) < 40 || (s.lungeI || 0) < 40) {
      lineas.push(`| Alta | Movilidad tobillo | Dorsiflexiones con banda y lunges | Diaria, 3×30\" |`);
    }
    
    const saltoData = getLastEval('saltos');
    const shD = saltoData?.avg?.shD || 0;
    const shI = saltoData?.avg?.shI || 0;
    if (shD && shI && Math.abs(shD - shI) / Math.max(shD, shI) * 100 > 10) {
      const piernaDebil = shD < shI ? 'derecha' : 'izquierda';
      lineas.push(`| Alta | Asimetría funcional | Trabajo unilateral pierna ${piernaDebil} | 2-3 veces/semana |`);
    }
    
    if (s.lastFV?.oneRM && s.peso && (s.lastFV.oneRM / s.peso) < 1.0) {
      lineas.push(`| Media | Fuerza máxima | Sentadilla 3-5 rep al 80-85% | 2 veces/semana |`);
    }
    
    lineas.push(`\n---\n`);
  }
  
  // ============================================================
  // 7. CIERRE
  // ============================================================
  lineas.push(`## 🔄 7. Próximos Pasos\n`);
  if (plantilla.audiencia === 'paciente') {
    lineas.push(`¡Excelente trabajo! Cada evaluación es un paso más hacia tu mejor versión deportiva.\n`);
    lineas.push(`**Te recomendamos:**`);
    lineas.push(`1. Compartí este informe con tu entrenador`);
    lineas.push(`2. Seguí las recomendaciones personalizadas`);
    lineas.push(`3. Realizá una nueva evaluación en 4-6 semanas`);
  } else if (plantilla.audiencia === 'medico') {
    lineas.push(`**Recomendaciones clínicas:**`);
    lineas.push(`- Reevaluar en 6-8 semanas`);
    lineas.push(`- Monitorear asimetrías >10%`);
  } else {
    lineas.push(`**Planificación sugerida:**`);
    lineas.push(`- Microciclo 1-2: Enfocar áreas priorizadas`);
    lineas.push(`- Reevaluación programada para 4-6 semanas`);
  }
  
  lineas.push(`\n---\n`);
  lineas.push(`*Informe generado por MoveMetrics v12*`);
  lineas.push(`**THE MOVE CLUB** — ${new Date().toLocaleDateString('es-AR')}`);
  
  return lineas.join('\n');
}

// ========================================================
// MODAL Y EXPORTACIÓN
// ========================================================

function crearModalInformeAvanzado() {
  if (document.getElementById('modal-informe-avanzado')) return;
  
  const modal = document.createElement('div');
  modal.id = 'modal-informe-avanzado';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-sheet" style="max-width:800px;width:90%">
      <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h2 style="font-family:'Bebas Neue',sans-serif;font-size:28px">📄 Informe Personalizado</h2>
        <button class="close" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>
      </div>
      <div id="informe-avanzado-loading" style="padding:40px;text-align:center">
        <div class="dots" style="justify-content:center"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        <div style="margin-top:16px;color:rgba(255,255,255,.4)">Generando informe...</div>
      </div>
      <div id="informe-avanzado-content" style="display:none">
        <textarea id="informe-avanzado-text" class="inp" rows="20" style="font-family:monospace;font-size:11px;background:#0a0a0a"></textarea>
        <div style="display:flex;gap:12px;margin-top:16px">
          <button id="exportar-pdf-avanzado" class="btn btn-neon">📄 Exportar PDF</button>
          <button id="copiar-texto" class="btn btn-ghost">📋 Copiar texto</button>
          <button id="reconfigurar-informe" class="btn btn-ghost">⚙️ Reconfigurar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('close')) {
      closeModal('modal-informe-avanzado');
    }
  });
  
  document.getElementById('exportar-pdf-avanzado')?.addEventListener('click', () => {
    exportarPDFAvanzado();
  });
  
  document.getElementById('copiar-texto')?.addEventListener('click', () => {
    const texto = document.getElementById('informe-avanzado-text')?.value;
    if (texto) {
      navigator.clipboard.writeText(texto);
      showSaveToast();
    }
  });
  
  document.getElementById('reconfigurar-informe')?.addEventListener('click', () => {
    closeModal('modal-informe-avanzado');
    mostrarConfiguracionInforme();
  });
}

function exportarPDFAvanzado() {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) { alert('Error al cargar jsPDF'); return; }
  
  const s = cur;
  const texto = document.getElementById('informe-avanzado-text')?.value;
  if (!texto) { alert('No hay contenido para exportar'); return; }
  
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // Fondo negro
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Header
  doc.setFillColor(8, 8, 8);
  doc.rect(0, 0, 210, 44, 'F');
  doc.setDrawColor(57, 255, 122);
  doc.setLineWidth(0.4);
  doc.line(0, 44, 210, 44);
  
  doc.setTextColor(57, 255, 122);
  doc.setFontSize(18);
  doc.setFont('courier', 'bold');
  doc.text('MOVEMETRICS', 14, 20);
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.setFont('courier', 'normal');
  doc.text('INFORME PERSONALIZADO', 14, 27);
  doc.text(`Audiencia: ${informeConfig.audiencia === 'paciente' ? 'Deportista' : informeConfig.audiencia === 'medico' ? 'Médico' : 'Entrenador'}`, 14, 33);
  
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text(s?.nombre || 'Atleta', 196, 18, { align: 'right' });
  doc.text(new Date().toLocaleDateString('es-AR'), 196, 24, { align: 'right' });
  
  // Contenido
  const lines = doc.splitTextToSize(texto, 182);
  let y = 58;
  
  for (const line of lines) {
    if (y > 275) {
      doc.addPage();
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, 210, 297, 'F');
      y = 20;
    }
    
    if (line.startsWith('# ')) {
      doc.setFont('courier', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(57, 255, 122);
      y += 4;
    } else if (line.startsWith('## ')) {
      doc.setFont('courier', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(77, 158, 255);
      y += 3;
    } else if (line.startsWith('### ')) {
      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 176, 32);
      y += 2;
    } else if (line.includes('|')) {
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
    } else {
      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
    }
    
    doc.text(line, 14, y);
    y += (line.startsWith('#') ? 7 : line.startsWith('##') ? 6 : line.startsWith('###') ? 5 : 4.5);
  }
  
  // Footer
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(6, 6, 6);
    doc.rect(0, 286, 210, 11, 'F');
    doc.setDrawColor(57, 255, 122);
    doc.setLineWidth(0.2);
    doc.line(0, 286, 210, 286);
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(7);
    doc.setFont('courier', 'normal');
    doc.text('MOVEMETRICS v12 · INFORME PERSONALIZADO', 14, 292);
    doc.text(`${i} / ${total}`, 196, 292, { align: 'right' });
  }
  
  doc.save(`MoveMetrics_${s?.nombre?.replace(/\s/g, '_') || 'informe'}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ========================================================
// INTEGRACIÓN CON EL SISTEMA EXISTENTE
// ========================================================

// Agregar botón en el perfil del atleta
function agregarBotonInformeAvanzado() {
  const toolbar = document.querySelector('#profile-hero-area .flex-b, .profile-toolbar');
  if (toolbar && !document.getElementById('btn-informe-avanzado')) {
    const btn = document.createElement('button');
    btn.id = 'btn-informe-avanzado';
    btn.className = 'btn btn-neon';
    btn.innerHTML = '📄 Informe Personalizado';
    btn.style.marginLeft = 'auto';
    btn.addEventListener('click', mostrarConfiguracionInforme);
    toolbar.appendChild(btn);
  }
}

// Hookear selectAtleta original
if (typeof window.selectAtleta === 'function') {
  const originalSelectAtleta = window.selectAtleta;
  window.selectAtleta = function(id) {
    originalSelectAtleta(id);
    setTimeout(agregarBotonInformeAvanzado, 100);
  };
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
  crearModalInformeAvanzado();
  if (cur) setTimeout(agregarBotonInformeAvanzado, 500);
});

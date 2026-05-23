# MoveMetrics v12 — Plataforma Deportivo-Clínica

App web de evaluación kinesiológica y rendimiento deportivo.  
Desarrollada por **Lic. Emanuel Lezcano** — MOVE Centro de Evaluación.

## Estructura del proyecto

```
movemetrics/
├── index.html                   ← App principal (abrir en navegador)
├── css/
│   ├── main.css                 ← Estilos base (industrial dark)
│   ├── dashboard.css            ← Panel principal
│   ├── kine.css                 ← Módulo kinesiológico
│   └── saltos.css               ← Módulo saltos
├── js/
│   ├── app.js                   ← Núcleo de la app
│   ├── atletas.js               ← Gestión de atletas
│   ├── dashboard.js             ← Panel principal
│   ├── fv.js                    ← Perfil Fuerza-Velocidad
│   ├── saltos.js                ← Módulo saltos (CMJ, BJ, Hop)
│   ├── movilidad.js             ← Movilidad articular
│   ├── sprint.js                ← Sprint & COD
│   ├── kine.js                  ← Módulo kinesiológico
│   ├── lesion.js                ← Gestión de lesiones
│   ├── valgo.js                 ← Análisis valgo en video
│   ├── video.js                 ← Módulo video
│   ├── videojump.js             ← Video análisis salto
│   ├── vmp.js                   ← VMP & ajustes
│   ├── functools.js             ← Utilidades
│   ├── planillas.js             ← Plantillas
│   ├── ThreeBodyChart.js        ← Body chart 3D
│   ├── LesionSheet.js           ← Hoja de lesión
│   ├── MoveAnalysis.js          ← Análisis de movimiento (IA)
│   ├── ExpertAnalysis.js        ← Análisis experto
│   ├── VideoCompare.js          ← Comparación de videos
│   ├── Workspace.js             ← Workspace
│   ├── data/
│   │   └── ortho-tests.js       ← Tests ortopédicos
│   ├── sheets/
│   │   ├── _common.js           ← Lógica compartida de hojas
│   │   ├── hombro.js
│   │   ├── rodilla.js
│   │   ├── tobillo.js
│   │   ├── lumbar.js
│   │   ├── groin.js
│   │   ├── codo.js
│   │   └── cervical.js
│   └── informe/
│       ├── builder.js           ← Constructor de informes PDF
│       ├── selector.js          ← Selector de plantilla
│       ├── template.css         ← Estilos del informe
│       └── sections/            ← Secciones del informe IA
├── assets/
│   ├── img/                     ← Logos e imágenes de marca
│   │   ├── isotipo-camel.png
│   │   ├── isotipo-gris.png
│   │   ├── logotipo-blanco.png
│   │   ├── logotipo-negro.png
│   │   └── sello-gris.png
│   ├── templates/move-club/     ← Plantillas visuales del informe
│   ├── body_muscle.glb          ← Modelo 3D muscular
│   └── body_skeleton.glb        ← Modelo 3D esqueleto
└── README.md
```

## Módulos

| Módulo | Descripción |
|--------|-------------|
| Atletas | Gestión de perfiles deportivos |
| Perfil F-V | Carga-Velocidad con regresión lineal y R² |
| Saltos | CMJ, BJ, Hop con LSI y simetría |
| Movilidad | Lunge, TROM Cadera/Hombro con velocímetros |
| Sprint & COD | Con benchmarks normativos |
| Kinesiológico | Body Chart 3D, Anamnesis MOVE, Tests ortopédicos |
| Video & Valgo | Análisis de video y ángulo de valgo |
| Informe IA | Generación automática con Claude AI + exportar PDF |

## Configuración de API Key

En la app (sidebar inferior), hacer click en **🔑 API KEY** e ingresar tu clave de Anthropic.

Obtené tu API Key en: https://console.anthropic.com

## Deploy

La app está desplegada en GitHub Pages:  
https://emanuellezcanolic-oss.github.io/tu-usuario-nombre-rep/

Para actualizar: cualquier push a `main` actualiza el deploy automáticamente.

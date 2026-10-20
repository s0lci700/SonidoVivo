# Guía técnica para la defensa — Sonido Vivo · EP2

Documentación de apoyo para la defensa técnica individual de la Evaluación
Parcial 2 (DSY1104, sección 005D). Explica cómo está construido el proyecto,
dónde está cada funcionalidad en el código y qué verifica cada prueba.

Se escribió sobre la versión entregada: los nombres de archivos, funciones y
pruebas corresponden al código de `frontend/src`.

> **Tecnología.** La pauta impresa de la EP2 nombra Bootstrap y Jasmine/Karma.
> El curso los reemplazó por **Tailwind CSS** y **Vitest + React Testing
> Library**, que son los que usa este proyecto. La equivalencia está en
> `01-preguntas-por-indicador.md`, §5.

## Contenido

| Archivo | Qué contiene |
|---|---|
| `01-preguntas-por-indicador.md` | Preguntas técnicas frecuentes, ordenadas por indicador de la rúbrica, con el archivo donde se responden |
| `02-recorridos-del-codigo.md` | Cada funcionalidad desde la pantalla hasta el archivo y la función que la implementan |
| `03-las-pruebas.md` | Las 78 pruebas agrupadas por tipo, las 10 representativas y el uso de mocks y spies |
| `04-aporte-y-commits.md` | Desarrollo del proyecto commit a commit y autoría de cada parte |
| `05-limitaciones-y-decisiones.md` | Limitaciones conocidas de la versión entregada y por qué se tomó cada decisión |
| `06-resumen.md` | Una página: rutas, archivos clave, comandos y números |

## Indicadores individuales de la rúbrica

| Indicador | Peso | Tema | Dónde |
|---|---|---|---|
| IE2.1.3 | 15 % | Diseño del frontend con React | `01` §1, `02` |
| IE2.1.4 | 20 % | Componentes, props, state y responsivo | `01` §2, `02` |
| IE2.2.2 | 15 % | Demostración de pruebas unitarias | `03` |
| IE2.3.2 | 10 % | Proceso de testing: entorno, mocks, análisis | `01` §4, `03` |

## Cómo levantar el proyecto

En `frontend/`, con Node 24:

```
npm install
npm run dev            # http://localhost:5173
npm test               # 78 pruebas
npm run test:coverage  # reporte de cobertura
```

Usuario administrador de prueba: el primero de `src/data/usuarios.json`.

## Documentos relacionados

- `../ERS-SonidoVivo.md` — requisitos del sistema.
- `../cobertura-testing-EP2.md` — alcance y resultados de la cobertura.
- `../guion-video-EP2.md` — guion del video de demostración.

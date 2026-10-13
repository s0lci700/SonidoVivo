# Documento de Cobertura del Testing — Sonido Vivo · EP2

> Sigue la plantilla `09_Plantilla_Documento_Cobertura_Testing_EP2.docx`.
> Las secciones 1 y 2 están completas. Las secciones 3 a 7 se llenan con los
> resultados reales cuando las 10 pruebas estén escritas: lo marcado con
> **[COMPLETAR]** no puede inventarse antes.

## 1. Identificación

| Campo | |
|---|---|
| Sección | DSY1104-005D |
| Grupo | Sin número de grupo (proyecto individual) |
| Integrantes | Sol León (proyecto individual) |
| Contexto / caso | Forma B — Tienda Sonido Vivo |
| Repositorio GitHub | https://github.com/s0lci700/SonidoVivo |
| Versión evaluada | **[COMPLETAR: hash del commit entregado]** |

## 2. Configuración del entorno de pruebas

| Herramienta | Versión | Para qué se usa |
|---|---|---|
| Vitest | 4.1 | Ejecuta las pruebas y entrega `describe`, `it`, `expect` y `vi` |
| React Testing Library (`@testing-library/react`) | 16.3 | Renderiza componentes y los consulta como lo haría un usuario |
| `@testing-library/jest-dom` | 7.0 | Agrega comprobaciones del DOM como `toBeInTheDocument` y `toBeDisabled` |
| jsdom | 29.1 | Simula el navegador dentro de Node |
| `@vitest/coverage-v8` | 4.1 | Mide la cobertura de código |

**Configuración** (`frontend/vite.config.js`, bloque `test`):

- `environment: 'jsdom'` — las pruebas corren con un DOM simulado.
- `setupFiles: './src/test/setup.js'` — se ejecuta antes de cada archivo de
  prueba e importa `@testing-library/jest-dom/vitest`.
- `coverage.provider: 'v8'`, con reporte en texto y HTML.
- `coverage.include: ['src/**/*.{js,jsx}']`; se excluyen `src/main.jsx` y
  `src/test/**`, que no contienen lógica propia.

**Comandos** (se ejecutan en `frontend/`):

| Comando | Qué hace |
|---|---|
| `npm test` | Ejecuta todas las pruebas una vez |
| `npm run test:watch` | Vuelve a ejecutar al guardar un archivo |
| `npm run test:coverage` | Ejecuta las pruebas y genera el reporte de cobertura en `coverage/` |

Las pruebas viven junto al archivo que prueban, con el sufijo `.test.js` o
`.test.jsx`.

## 3. Registro de pruebas

Las tres primeras ya existen y pasan. Las demás están planificadas como
`it.todo` en el repositorio; se actualiza esta tabla cuando estén escritas.

| N° | Archivo / componente | Comportamiento verificado | Tipo | Resultado |
|---|---|---|---|---|
| 1 | `utils/estadoStock.test.js` | Con stock 0 devuelve «Agotado» | Lógica | OK |
| 2 | `utils/estadoStock.test.js` | Con stock 3 devuelve «Últimas 3 unidades» | Lógica | OK |
| 3 | `utils/estadoStock.test.js` | Con stock 8 devuelve «En stock · 8 disponibles» | Lógica | OK |
| 4 | `utils/validaciones.test.js` | `validarCorreo` acepta un correo bien formado y rechaza uno sin @ | Lógica / validación | [COMPLETAR] |
| 5 | `utils/validaciones.test.js` | `validarTexto` rechaza un texto más corto que el mínimo | Lógica / validación | [COMPLETAR] |
| 6 | `utils/validaciones.test.js` | `validarPrecio` rechaza 0, negativos y decimales | Lógica / validación | [COMPLETAR] |
| 7 | `components/Item.test.jsx` | Muestra nombre, marca y precio formateado en CLP | Componente (renderizado y props) | [COMPLETAR] |
| 8 | `components/Item.test.jsx` | No muestra el botón Agregar si no recibe `onAgregar` | Componente (renderizado condicional) | [COMPLETAR] |
| 9 | `components/Item.test.jsx` | Deshabilita el botón Agregar cuando el stock es 0 | Componente (props) | [COMPLETAR] |
| 10 | `components/Item.test.jsx` | Llama a `onAgregar` al hacer clic en Agregar | Interacción + mock (`vi.fn`) | [COMPLETAR] |
| 11 | `pages/Login.test.jsx` | El campo correo refleja lo que escribe el usuario | Estado | [COMPLETAR] |
| 12 | `pages/Login.test.jsx` | No muestra mensaje de error antes de enviar | Componente (renderizado condicional) | [COMPLETAR] |
| 13 | `pages/Login.test.jsx` | Muestra «Credenciales incorrectas» cuando el servicio rechaza el login | Interacción + mock (`vi.mock`) | [COMPLETAR] |

> `utils/calculos.test.js` (`sumar`) es un resto del Tutorial 5 y no prueba
> nada del proyecto: conviene eliminarlo o reemplazarlo antes de entregar, para
> que no cuente como prueba de relleno.

## 4. Mocks y spies utilizados

**[COMPLETAR con el código real.]** Lo planificado:

| Mock | Dónde | Qué reemplaza | Por qué | Qué se verifica |
|---|---|---|---|---|
| `vi.fn()` | `Item.test.jsx` | La función `onAgregar` que `Item` recibe por props | `Item` no decide qué pasa al agregar; solo debe avisar a su padre | Que se llamó una vez y con el producto correcto |
| `vi.mock('../services/authService')` | `Login.test.jsx` | `iniciarSesion` | Aislar el formulario de los datos de usuarios y de `localStorage` | Que con respuesta `false` aparece el mensaje de error |

## 5. Resultado de cobertura

Ejecutar `npm run test:coverage` sobre la versión entregada y copiar la fila
`All files`.

| Métrica | Resultado | Interpretación |
|---|---|---|
| Statements | [COMPLETAR] % | [COMPLETAR] |
| Branches | [COMPLETAR] % | [COMPLETAR] |
| Functions | [COMPLETAR] % | [COMPLETAR] |
| Lines | [COMPLETAR] % | [COMPLETAR] |

Incluir una captura de la tabla de la terminal y otra del reporte HTML
(`frontend/coverage/index.html`).

## 6. Análisis

**[COMPLETAR con los números reales.]** Preguntas de la plantilla:

- ¿Qué componentes o funciones quedaron mejor cubiertos?
- ¿Qué funcionalidades presentan menor cobertura y por qué?
- ¿Qué error o comportamiento inesperado fue detectado gracias a una prueba?
- ¿Qué prueba adicional sería conveniente implementar en una siguiente versión?

## 7. Conclusiones

**[COMPLETAR.]** Conclusión técnica breve sobre el aporte del testing a la
calidad del frontend.

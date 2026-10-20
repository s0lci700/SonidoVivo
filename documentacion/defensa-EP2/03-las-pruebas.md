# Las pruebas del proyecto

**78 pruebas en 15 archivos**, todas pasando (`npm test` en `frontend/`).
Herramientas: Vitest 4 + React Testing Library + jsdom + jest-dom.

## Configuración

| Archivo | Qué configura |
|---|---|
| `vite.config.js` → `test` | `environment: 'jsdom'`, `setupFiles: './src/test/setup.js'`, cobertura `v8` con reportes `text` y `html` (excluye `main.jsx` y `src/test/`) |
| `src/test/setup.js` | Importa `@testing-library/jest-dom/vitest` (matchers `toBeInTheDocument`, `toBeDisabled`, `toHaveValue`, `toHaveAttribute`…), `localStorage.clear()` antes de cada prueba y `cleanup` después |
| `package.json` | `test` (una vez), `test:watch` (modo observador), `test:coverage` |
| `jsconfig.json` | Solo para el editor: autocompletado de los matchers de jest-dom |

Estructura de cada prueba: **preparar** (datos o `render`) → **actuar**
(`fireEvent.click`, `fireEvent.change`, llamar la función) → **afirmar** (`expect`).

## Las 10 representativas

| # | Archivo → prueba | Qué asegura | Herramienta clave |
|---|---|---|---|
| 1 | `utils/carrito.test.js` → «no pasa del stock del producto» | Una guitarra con stock 2 agregada 3 veces queda con cantidad 2 | Función pura, `toEqual` |
| 2 | `utils/carrito.test.js` → «calcula el precio total» | `calcularTotal` suma precio × cantidad de todas las líneas | `reduce` |
| 3 | `utils/validaciones.test.js` → «rechaza un correo sin arroba» | `validarCorreo("docente.duoc.cl")` es `false` | Regex |
| 4 | `services/productoService.test.js` → «rechaza un código que ya existe» | `crearProducto` con `GA001` lanza error | `await expect(...).rejects.toThrow("Ya existe")` |
| 5 | `services/authService.test.js` → «guarda el usuario en localStorage» | El login guarda `{ correo, nombre, rol }` (sin contraseña) con la clave `usuarioActual` | **Spy**: `vi.spyOn(Storage.prototype, "setItem")` |
| 6 | `components/Item.test.jsx` → «llama a onAgregar (vi.fn) al hacer clic en Agregar» | El clic llama una vez a `onAgregar` con los 4 campos del producto | **Mock**: `vi.fn`, `toHaveBeenCalledWith` |
| 7 | `components/Item.test.jsx` → «muestra «Agregado» por 1,5 segundos» | El botón cambia a «Agregado» y vuelve a «Agregar» a los 1500 ms | `vi.useFakeTimers`, `act` + `advanceTimersByTime` |
| 8 | `pages/Login.test.jsx` → «muestra "Credenciales incorrectas" cuando iniciarSesion (vi.mock) devuelve false» | El formulario muestra el error y llamó al servicio con lo escrito | **Mock de módulo**: `vi.mock`, `mockReturnValue(false)` |
| 9 | `pages/Checkout.test.jsx` → «con el formulario vacío muestra errores y no vacía el carrito» | Las validaciones bloquean el pago | `vi.fn` + `not.toHaveBeenCalled()` |
| 10 | `pages/AdminProductos.test.jsx` → «Eliminar quita el producto de la tabla» | Confirmar elimina GA001 y la tabla se recarga | Spy de `window.confirm`, `findBy`, `waitFor` |

## Todas, por archivo

### Lógica pura (`utils/`) — sin React
| Archivo | Pruebas | Qué cubre |
|---|---|---|
| `carrito.test.js` | 13 | `limitarCantidad`; `agregarProducto` (agrega, suma, tope de stock); `quitarProducto` (solo el indicado, código inexistente); `cambiarCantidad` (cambia, tope de stock, mínimo 1, solo el indicado, inexistente); `calcularTotal` (total y carrito vacío = 0) |
| `validaciones.test.js` | 15 | `validarTexto`, `validarCorreo`, `validarPassword` (largo y mayúscula), `validarPrecio` (≤ 0, decimal, texto), `validarStock` (negativo, decimal) |
| `estadoStock.test.js` | 3 | Stock 0 → «Agotado», 3 → «Últimas 3 unidades», 8 → «En stock» |
| `formatearPrecio.test.js` | 4 | `$129.990`, millones, menos de mil, cero |

### Servicios (`services/`) — async y `localStorage`
| Archivo | Pruebas | Qué cubre |
|---|---|---|
| `productoService.test.js` | 9 | CREATE (agrega, rechaza repetido), READ (lee el JSON, `null` si no existe), UPDATE (solo cambia lo enviado, rechaza inexistente), DELETE (quita, rechaza inexistente), persistencia en `localStorage` |
| `authService.test.js` | 1 | Spy sobre `setItem` al iniciar sesión |

### Componentes y páginas — React Testing Library
| Archivo | Pruebas | Qué cubre |
|---|---|---|
| `Item.test.jsx` | 6 | Muestra nombre/marca/precio; sin `onAgregar` no hay botón; stock 0 deshabilita; mock de `onAgregar`; enlace a la ficha; «Agregado» 1,5 s |
| `Login.test.jsx` | 3 | Campo controlado; sin error antes de enviar; «Credenciales incorrectas» con `vi.mock` |
| `Contacto.test.jsx` | 3 | Renderiza; errores al enviar vacío; valida, confirma y limpia |
| `Carrito.test.jsx` | 3 | El + pide la cantidad siguiente (`vi.fn`); carrito vacío; total |
| `Checkout.test.jsx` | 3 | Resumen y total; vacío muestra errores sin vaciar; retiro en tienda válido vacía el carrito |
| `DetalleProducto.test.jsx` | 3 | Muestra el producto de la URL; código inexistente; envía al carrito solo los campos necesarios |
| `AdminProductos.test.jsx` | 4 | Lista; Editar enlaza al formulario; Eliminar quita la fila; cancelar no borra |
| `AdminProductoForm.test.jsx` | 5 | Precarga al editar; código bloqueado; 8 errores vacío; guarda el precio y vuelve a la lista; código repetido |
| `Admin.test.jsx` | 3 | Saluda a la sesión; agotado aparece en «Por reponer»; Cerrar sesión borra la sesión y va al login |

## Mocks, spies y otras herramientas

| Herramienta | Qué hace | Dónde |
|---|---|---|
| `vi.fn()` | Función falsa que registra sus llamadas | Item, Carrito, Checkout, DetalleProducto |
| `vi.mock(ruta)` | Reemplaza un módulo completo por uno falso | Login (`authService`) |
| `vi.spyOn(obj, "metodo")` | Observa una función real; con `mockReturnValue` también la reemplaza | authService (`Storage.prototype.setItem`), AdminProductos (`window.confirm`) |
| `vi.useFakeTimers()` | Controla el tiempo (`setTimeout`) | Item («Agregado» 1,5 s) |
| `MemoryRouter` | Router en memoria para componentes con `Link`, `useNavigate` o `useParams` | Item, Login, Checkout, Detalle, Admin… |
| `MemoryRouter initialEntries` + `Routes` | Abre una URL concreta y comprueba la navegación | AdminProductoForm, DetalleProducto, Admin |
| `findBy…` / `waitFor` | Esperan algo que llega de forma asíncrona (`useEffect`) | AdminProductos, AdminProductoForm, Admin, Detalle |
| `queryBy…` | Comprueba que algo **no** está (no lanza error) | Item, Login, AdminProductos |

**Mock vs spy:** un mock reemplaza algo que no queremos usar de verdad (el
servicio de login, la función que recibe el componente). Un spy observa algo
real (`localStorage.setItem`) para comprobar que se llamó y cómo.

## Errores reales que las pruebas detectaron

- `productoService.test.js`: comparar `obtenerProductoPorCodigo(...)` sin `await`
  daba una promesa en vez del producto → la prueba falló y se corrigió.
- `AdminProductoForm.test.jsx`: la prueba de «código repetido» se escribió primero
  sobre la ruta de **edición**, y ahí guardaba y navegaba en vez de mostrar el error.
  Eso aclaró que el error de código repetido solo existe al **crear**.
- `AdminProductos`: al probar en 360 px se vio que la página entera se desplazaba
  hacia el lado (el texto `sr-only` con `position: absolute` escapaba del contenedor).
- Formulario de producto: un stock vacío se guardaba como 0, porque `Number("") === 0`.
  Se agregó la comprobación de campo vacío.

## Cobertura (resumen)

`npm run test:coverage` → **75 % de sentencias, 76 % de ramas, 64 % de funciones,
75 % de líneas**. `utils/` 100 %, `services/` ≈ 92 %, páginas con lógica 80–100 %.
Sin pruebas: páginas de presentación (Inicio, Nosotros, NoEncontrado), Header,
Footer, `App.jsx`, `RutaProtegida`, `ResultadoCompra`. Detalle en
`../cobertura-testing-EP2.md`.

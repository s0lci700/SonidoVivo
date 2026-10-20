# Guion del video de demostración — Sonido Vivo · EP2

Basado en `10_Guia_Video_Demostracion_EP2_DSY1104_2026-2.docx` y en la rúbrica
oficial EP2. Duración objetivo: **7 a 8 minutos**. Se graba la pantalla con
narración por voz; no hace falta aparecer en cámara.

> **Tecnología:** el docente indicó en clase que la pauta impresa es antigua:
> **Tailwind CSS reemplaza a Bootstrap** y **Vitest + React Testing Library
> reemplazan a Jasmine/Karma**. El video lo dice una vez, en la etapa 6.

> **Lección de EV1 (80/100):** se perdieron 15 puntos en «Demuestra el desarrollo
> de validaciones» porque no se *mostraron* funcionando. Aquí cada validación se
> provoca en pantalla: primero el dato inválido y su mensaje, después el válido.

## Antes de grabar

- [ ] Commit final hecho y subido. Anotar el hash: `________`.
- [ ] VS Code en la carpeta del proyecto, con `frontend/src` desplegado.
- [ ] Terminal 1 en `frontend/` con `npm run dev` corriendo.
- [ ] Terminal 2 en `frontend/`, libre, para las pruebas.
- [ ] Navegador en `http://localhost:5173/` con `localStorage` vacío
      (DevTools → Application → Local Storage → Clear). Así el catálogo parte de
      `productos.json`, el carrito está vacío y no hay sesión.
- [ ] Otra pestaña: https://github.com/s0lci700/SonidoVivo/commits/main
- [ ] DevTools con el modo dispositivo listo (360 px).
- [ ] Pestañas abiertas en VS Code, en este orden:
      `App.jsx`, `Item.jsx`, `utils/carrito.js`, `services/productoService.js`,
      `pages/AdminProductoForm.jsx`, `utils/validaciones.js`,
      `utils/carrito.test.js`, `components/Item.test.jsx`, `pages/Login.test.jsx`.
- [ ] Notificaciones silenciadas y el cargador conectado (por si se corta la luz,
      grabar por etapas: si se interrumpe, se retoma desde la última etapa).

## Guion

Cada fila indica el indicador de la rúbrica que cubre.

| # | Etapa · tiempo | Dónde | Qué hacer | Qué decir | Rúbrica |
|---|---|---|---|---|---|
| 1 | Presentación · 0:00–0:25 | Navegador, Inicio | Mostrar la portada | «Soy Sol León, de la sección 005D de Desarrollo Full Stack II. Este es Sonido Vivo, la Forma B: una tienda de instrumentos de Viña del Mar. Es un proyecto individual y esta es la versión entregada para la Evaluación Parcial 2.» | — |
| 2 | Navegación · 0:25–1:05 | Navegador | Inicio → Catálogo → un producto → Nosotros → Contacto. Escribir `/no-existe` para ver la página 404 | «Es una SPA en React 19 con Vite. La navegación la hace React Router: la página no se recarga, solo cambia lo que va dentro del layout. Encabezado y pie son los mismos en todas las vistas, y una ruta comodín muestra la página 404.» | IE2.1.1, IE2.1.3 |
| 3 | Estructura · 1:05–2:05 | VS Code | Árbol de `src`. `App.jsx`: la tabla de rutas y el `useState` del carrito. `Item.jsx`: sus props | «El código está separado por responsabilidad: `pages` es una vista por ruta, `components` las piezas reutilizables, `services` el acceso a datos y `utils` las funciones puras. En `App` están las rutas, todas dentro de `LayoutPrincipal`, que dibuja la página activa con `<Outlet />`. El carrito vive en `App` con `useState`, porque lo comparten el encabezado, el catálogo, el carrito y el checkout: es el ancestro común. `Item` es la tarjeta de producto: recibe el producto y `onAgregar` por props, y se reutiliza en el catálogo y en la portada.» | IE2.1.2, IE2.1.4 |
| 4 | Catálogo y carrito · 2:05–3:15 | Navegador | Filtrar por dos categorías (la URL cambia a `?categoria=…`). Agregar dos productos: ver «Agregado» y el contador del encabezado. Abrir el carrito: subir y bajar una cantidad hasta el tope de stock, quitar uno | «El filtro vive en la URL con `useSearchParams`, por eso sobrevive a recargar. Al agregar, el botón confirma con "Agregado" y el contador sube, porque todos leen el mismo estado de `App`. En el carrito la cantidad no pasa del stock ni baja de uno: esa regla está en `utils/carrito.js`, en `limitarCantidad`, una función pura con sus propias pruebas.» | IE2.1.4 |
| 5 | Checkout y validaciones · 3:15–4:15 | Navegador y VS Code | **Pagar con el formulario vacío** → aparecen los errores. Elegir región y ver que cambian las comunas. Llenar bien y marcar «Simular pago rechazado» → vista de error. Volver, desmarcar y pagar → compra realizada y carrito vacío. Abrir `validaciones.js` 5 s | «Primero lo envío vacío: cada campo muestra su error y el carrito no se toca. Al elegir región se cargan sus comunas. Con "pago rechazado" se ve la vista de error y el carrito se conserva para reintentar. Ahora con datos válidos: compra realizada y carrito vacío. Las reglas son funciones puras en `utils/validaciones.js`; las usan Contacto, Checkout y el formulario de productos.» | IE2.1.4, validaciones |
| 6 | Administración (CRUD) · 4:15–5:20 | Navegador y VS Code | Entrar a `/admin` sin sesión → redirige al login. Login con datos malos → «Credenciales incorrectas». Login con el administrador de `usuarios.json` → panel. En Productos: **Nuevo producto vacío → 8 errores**; código repetido `GA001` → «Ya existe…». Crear uno válido, editar su precio (el código queda bloqueado), ver la miniatura «Sin foto», eliminarlo con confirmación. Abrir `productoService.js` 10 s | «Las rutas de administración están dentro de `RutaProtegida`: sin sesión redirigen al login. La sesión es simulada en `localStorage`; en el Parcial 3 se cambia por JWT. El formulario sirve para crear y editar: con `useParams` sabe si hay un código en la URL. Si lo guardo vacío, valida cada campo; si repito un código, el servicio lanza un error y el formulario lo muestra. El CRUD trabaja sobre una copia del catálogo en `localStorage`, y las páginas solo hablan con `productoService`: en el Parcial 3 ese archivo pasa a usar `fetch` y las páginas no cambian.» | IE2.1.1, IE2.1.4, validaciones |
| 7 | Responsivo · 5:20–5:55 | Navegador con DevTools | 1280 → 768 → 360 px. Abrir el menú hamburguesa. En 360, la tabla de admin se desplaza hacia el lado con la columna Código fija | «Uso Tailwind CSS, que el curso adoptó en reemplazo de Bootstrap. La grilla pasa de cuatro columnas a tres, dos y una con los prefijos `sm`, `md` y `lg`; en móvil la navegación se colapsa en un menú hamburguesa y la tabla de administración se desplaza hacia el lado.» | IE2.1.2, IE2.1.4 |
| 8 | Pruebas · 5:55–7:20 | Terminal 2 y VS Code | `npm test` → 78 pruebas en 15 archivos, todas en verde. Abrir `carrito.test.js` (lógica), `Item.test.jsx` (componente con `vi.fn` y relojes falsos) y `Login.test.jsx` (`vi.mock`). `npm run test:coverage` y mostrar el resumen | «Las pruebas usan Vitest con React Testing Library y jsdom, que reemplazan a Jasmine y Karma. La configuración está en `vite.config.js` y en `src/test/setup.js`, que limpia `localStorage` antes de cada prueba. Hay tres tipos. De lógica: esta comprueba que `agregarProducto` no pasa del stock. De componente: esta renderiza la tarjeta, hace clic en Agregar y verifica con un mock, `vi.fn`, que se llamó a `onAgregar` con los datos del producto. Y con `vi.mock`: aquí reemplazo el servicio de login para forzar "credenciales incorrectas" sin depender de los datos reales. La cobertura es de 75 % de las líneas; la lógica de `utils` y `services` está sobre 90 %.» | IE2.2.1, IE2.2.2, IE2.3.1, IE2.3.2 |
| 9 | GitHub · 7:20–7:45 | Pestaña de GitHub | Repositorio público y el historial de commits | «El repositorio es público y este historial muestra cómo avanzó el proyecto: primero la estructura y las rutas, luego validaciones y pruebas, el carrito, el checkout y el CRUD de administración.» | — |
| 10 | Cierre · 7:45–8:00 | Navegador, Inicio | La portada | «Esta demostración corresponde a la versión entregada para la Evaluación Parcial 2. Gracias.» | — |

## Las 10 pruebas que se nombran

La rúbrica pide demostrar 10 pruebas. El proyecto tiene 78; estas son las que
conviene saber explicar (están en el orden en que aparecen en la terminal):

| # | Archivo | Prueba | Tipo |
|---|---|---|---|
| 1 | `utils/carrito.test.js` | «no pasa del stock del producto» | Lógica |
| 2 | `utils/carrito.test.js` | «calcula el precio total» | Lógica |
| 3 | `utils/validaciones.test.js` | «rechaza un correo sin arroba» | Lógica / validación |
| 4 | `services/productoService.test.js` | «rechaza un código que ya existe» | Servicio, async |
| 5 | `services/authService.test.js` | «guarda el usuario en localStorage» | **Spy** (`vi.spyOn`) |
| 6 | `components/Item.test.jsx` | «llama a onAgregar (vi.fn) al hacer clic en Agregar» | Componente, **mock** |
| 7 | `components/Item.test.jsx` | «muestra «Agregado» por 1,5 segundos» | Componente, relojes falsos |
| 8 | `pages/Login.test.jsx` | «muestra "Credenciales incorrectas" cuando iniciarSesion (vi.mock) devuelve false» | **Mock de módulo** |
| 9 | `pages/Checkout.test.jsx` | «con el formulario vacío muestra errores y no vacía el carrito» | Formulario |
| 10 | `pages/AdminProductos.test.jsx` | «Eliminar quita el producto de la tabla» | Async + spy de `confirm` |

## Si hay que acortar (para quedar en ~6 min)

- Etapa 2: saltar Nosotros.
- Etapa 4: un solo filtro.
- Etapa 6: mostrar solo el formulario vacío y eliminar.
- Etapa 8: no correr la cobertura en vivo; mostrar el resumen ya generado.

## Después de grabar

- [ ] Ver el video completo: que se escuche la voz y se lea el código (zoom de VS Code ≥ 150 %).
- [ ] Confirmar que el commit de GitHub es el mismo que se entrega.
- [ ] Subir a Drive con acceso «Cualquier persona con el enlace» y probar en una ventana de incógnito.

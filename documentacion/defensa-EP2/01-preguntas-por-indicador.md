# Preguntas técnicas por indicador

Cada respuesta indica el archivo donde se ve en el código (**Abrir:**) y la
explicación, con ejemplos que usan los datos reales del catálogo.

---

## 1. IE2.1.3 — Diseño del proyecto con React (15 %)

### «¿Cómo está organizado el proyecto y por qué?»
**Abrir:** el árbol de `frontend/src`.
- `pages/`: una vista por ruta (Catalogo, Carrito, Checkout, Admin…).
- `components/`: piezas reutilizables (Item, Boton, Campo, Selector, Header…).
- `services/`: acceso a datos (`productoService`, `authService`, `regionService`).
- `utils/`: funciones puras sin React (`carrito.js`, `validaciones.js`, `formatearPrecio.js`…).
- `data/`: los JSON simulados del Parcial 2.
- `layouts/`: `LayoutPrincipal` con Header, `<Outlet />` y Footer.

**El porqué:** separar por responsabilidad. Las páginas **no leen `data/`
directamente**; pasan por `services/`. En el Parcial 3 `productoService.js`
cambia `localStorage` por `fetch` contra la API REST y ninguna página cambia,
porque las funciones ya son `async` (decisión DEC-03 del ERS).

### «¿Por qué React y Vite?»
React permite dividir la interfaz en componentes con su propio estado y
reutilizarlos (Item en Catálogo y en Inicio). Vite da el servidor de desarrollo
con recarga instantánea y el build de producción (`npm run build`). Las pruebas
usan Vitest, que comparte la configuración de Vite (`vite.config.js`).

### «¿Cómo funciona la navegación?»
**Abrir:** `main.jsx` y `App.jsx`.
- `main.jsx` envuelve la app en `<BrowserRouter>`.
- `App.jsx` tiene `<Routes>`: una ruta padre con `element={<LayoutPrincipal />}`
  y todas las páginas como hijas. `LayoutPrincipal` dibuja Header y Footer, y en
  el medio `<Outlet />`, donde React Router pone la página activa.
- Rutas con parámetro: `producto/:codigo` y `admin/productos/:codigo`, que se
  leen con `useParams()`.
- `path="*"` → `NoEncontrado` (404).
- El cambio de página no recarga el documento: es una SPA.

### «¿Qué es una SPA?»
Una sola página HTML (`index.html`); React cambia el contenido según la URL sin
pedir otra página al servidor. Por eso el estado del carrito sobrevive al navegar
entre Catálogo y Carrito (pero no a recargar con F5: ver `05`).

### «¿Dónde viven los datos y cómo llegan a la pantalla?»
`productos.json` → `productoService.obtenerProductos()` (lee la copia de
`localStorage` o, si no hay, el JSON) → `ItemList` lo llama en un `useEffect` y
guarda la lista en su estado → hace `.map` y dibuja un `Item` por producto.

---

## 2. IE2.1.4 — Componentes, props, state y responsivo (20 %)

### «Muéstrame un componente reutilizable y qué recibe por props»
**Abrir:** `components/Item.jsx`.
- Recibe el producto con spread (`<Item {...producto} onAgregar={...} />` en
  `ItemList.jsx`): `codigo`, `nombre`, `marca`, `modelo`, `precio`, `stock`,
  `descripcion`, y la función `onAgregar`.
- Se reutiliza en `ItemList` (catálogo) y en `Inicio` (destacados). En Inicio
  **no** recibe `onAgregar`, y entonces no muestra el botón: renderizado condicional.
- Otros reutilizables: `Boton` (variantes primario/secundario/éxito, y modo enlace
  con `a="/ruta"`), `Campo` (input/textarea con label y error), `Selector`
  (select con label y error, en Checkout y en el formulario de admin).

### «Explica un uso de props y uno de state»
- **Props:** `App` pasa `onAgregar={agregarAlCarrito}` a `Catalogo` → `ItemList`
  → `Item`. El hijo no sabe qué es el carrito: solo avisa hacia arriba llamando a
  `props.onAgregar(producto)`. Los datos bajan por props y los eventos suben por
  funciones.
- **State:** el carrito en `App.jsx`:
  `const [carrito, setCarrito] = useState([])`. Cuando cambia, React vuelve a
  dibujar el contador del Header y la página del Carrito.
- **State local:** `Item` tiene `agregado` (muestra «Agregado» 1,5 s). Solo esa
  tarjeta lo necesita, así que vive ahí y no en `App`.

### «¿Por qué el carrito está en App y no en la página Carrito?»
Lo usan el **Header** (contador), **Catálogo/Detalle** (agregar), **Carrito**
(cambiar, quitar) y **Checkout** (pagar y vaciar). El estado se sube al
**ancestro común más cercano**: `App`. Si estuviera en `Carrito`, el Header no
podría leerlo.

### «¿Por qué `setCarrito(prev => ...)` y no `setCarrito(agregarProducto(carrito, p))`?»
La forma con función recibe el valor **más reciente** del estado. Si se agregan
dos productos seguidos antes de que React vuelva a dibujar, con la otra forma el
segundo podría usar un `carrito` viejo y perder el primero.

### «¿Por qué la lógica del carrito está en `utils/` y no en App?»
`utils/carrito.js` tiene **funciones puras**: reciben el carrito y devuelven uno
**nuevo** sin modificar el original (`map`, `filter`, spread). Así se prueban
sin React (13 pruebas en `carrito.test.js`) y `App` solo las envuelve con
`setCarrito`. React necesita un arreglo nuevo para detectar el cambio.

### «Explica `agregarProducto`»
**Abrir:** `utils/carrito.js`.
- `some` revisa si el código ya está.
- Si está: `map` devuelve un carrito nuevo donde ese ítem tiene
  `cantidad: limitarCantidad(item.cantidad + 1, item.stock)`.
- Si no: `[...carrito, { ...producto, cantidad: 1 }]`.
- `limitarCantidad(c, stock) = Math.min(Math.max(c, 1), stock)`: nunca menos de 1
  ni más que el stock. **Ejemplo:** GA001 tiene stock 8; si haces clic 9 veces la
  cantidad queda en 8.

### «¿Qué hace `useEffect` en ItemList y por qué tiene `[props.categoriaId]`?»
Carga los productos después de dibujar. El arreglo de dependencias hace que se
vuelva a ejecutar **solo cuando cambia la categoría**. Sin él, se ejecutaría en
cada render; con `[]`, no se actualizaría al filtrar.

### «¿Dónde se controla el estado de este formulario y por qué está ahí?»
**Abrir:** `pages/Checkout.jsx` o `pages/AdminProductoForm.jsx`.
- `formData` con `useState` (un objeto con todos los campos), `errores` con
  `useState({})`.
- **Formulario controlado:** cada `Campo` recibe `value={formData.x}` y
  `onChange={handleChange}`. `handleChange` usa `e.target.name` para saber qué
  campo actualizar: `setFormData(prev => ({ ...prev, [name]: value }))`.
- Está en la página porque solo esa página lo usa; `Campo` es «tonto»: muestra
  lo que le pasan.

### «¿Qué ocurre si el usuario ingresa un dato inválido? Muéstralo»
`handleSubmit` hace `e.preventDefault()`, arma `nuevosErrores` con cada regla
(`validarTexto`, `validarCorreo`, `validarPrecio`, `validarStock`), lo guarda con
`setErrores`, y si hay alguno hace `return` **antes** de guardar o navegar.
`Campo` muestra `props.error` en un `<p role="alert">` y pone el borde en cobre
con `aria-invalid`.
**Ejemplo real:** en Checkout, Pagar vacío → «Ingresa tu nombre.», «Elige una
región.»… y `onVaciar` no se llama (lo prueba `Checkout.test.jsx`).

### «¿Qué pasaría si eliminas esta validación?»
Ejemplos para practicar:
- Sin `validarPrecio` en AdminProductoForm → se podría guardar precio 0 o
  `"abc"`, que se vería como `$NaN` en el catálogo.
- Sin `limitarCantidad` → el carrito podría pedir 20 unidades de algo con stock 8.
- Sin el chequeo de código repetido en `crearProducto` → dos productos con el
  mismo `codigo`; como `codigo` es la `key` de las listas, React mostraría
  advertencias y editar/eliminar afectaría al primero que encuentre.
- Sin el `return` después de `setErrores` → se mostrarían los errores **y** se
  guardaría igual.

### «Explica el CRUD de productos»
**Abrir:** `services/productoService.js`.
- `leerProductos()` (privada): `localStorage.getItem("productos")`; si no hay,
  usa una copia de `productos.json`.
- `guardarProductos(lista)` (privada): `localStorage.setItem` con `JSON.stringify`.
- `crearProducto`: si `some` encuentra el código → `throw new Error("Ya existe…")`;
  si no, guarda `[...lista, producto]`.
- `actualizarProducto(codigo, cambios)`: `find` el actual, `{ ...actual, ...cambios }`,
  guarda con `map`.
- `eliminarProducto`: `filter` por código distinto.
- Todas son `async` y lanzan error si el código no existe: el formulario lo
  atrapa con `try/catch` y lo muestra en el campo Código.

### «¿Cómo sabe el formulario si está creando o editando?»
`useParams()`: en `/admin/productos/nuevo` no hay `codigo`; en
`/admin/productos/GA001` sí. Si hay código, el `useEffect` precarga el producto
(precio y stock pasados a texto con `String()`, porque los inputs trabajan con
texto) y el campo Código queda deshabilitado. Al guardar, `Number()` los
devuelve a número.

### «¿Cómo se protegen las rutas de administración?»
**Abrir:** `components/RutaProtegida.jsx`. Si `estaAutenticado()` es falso
devuelve `<Navigate to="/login" replace />`; si no, dibuja `props.children`.
En `App.jsx` cada ruta de admin va envuelta: `<RutaProtegida><Admin /></RutaProtegida>`.
Es protección **de interfaz** con sesión simulada en `localStorage`, no seguridad
real: en el Parcial 3 se reemplaza por JWT validado en el backend.

### «¿Cómo implementaste el diseño responsivo?»
**Tailwind CSS v4** (el curso lo adoptó en lugar de Bootstrap), con el plugin
`@tailwindcss/vite`. Es *mobile first*: la clase sin prefijo es para móvil, y
`sm:` (640 px), `md:` (768 px), `lg:` (1024 px) aplican desde ese ancho.
- Grilla del catálogo (`ItemList.jsx`): `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
- Header: la barra de enlaces es `hidden md:flex`; el botón hamburguesa es `md:hidden`,
  y abre un menú controlado por el estado `menuAbierto`.
- Checkout: `lg:grid-cols-[1fr_20rem]`; en móvil el resumen va primero (`order-first`).
- Tabla de admin: `overflow-x-auto` con la columna Código `sticky`.
- Metas del brief: 360, 768 y 1280 px.

### «¿Dónde están los colores y fuentes?»
`src/index.css`, bloque `@theme`: tokens `laca`, `marfil`, `laton`, `cobre`,
`patina` y las fuentes. Tailwind genera las clases (`bg-laton-500`,
`text-cobre-600`). Un solo lugar para cambiar la paleta.

---

## 3. IE2.2.2 — Demostrar pruebas (15 %)

Ver `03-las-pruebas.md`. Ten claras **10**, y para cada una: qué renderiza o
llama, qué acción simula y qué afirma.

### «Ejecuta las pruebas»
En `frontend/`: `npm test` → 78 pruebas en 15 archivos. `npm run test:coverage`
→ tabla por archivo y carpeta `coverage/` con el reporte HTML.

### «¿Qué significa que una prueba pase o falle?»
Pasa: todas sus `expect` se cumplieron. Falla: al menos una no; Vitest muestra
el valor esperado contra el recibido y la línea. **Ejemplo real de esta semana:**
`expect(obtenerProductoPorCodigo("XX001")).toEqual(nuevo)` fallaba porque faltaba
`await`: se comparaba una promesa con un objeto. La prueba detectó el error.

---

## 4. IE2.3.2 — Proceso de testing (10 %)

### «¿Cómo configuraste el entorno de pruebas?»
- **Vitest** como runner, configurado en `vite.config.js` dentro de `test: {}`:
  `environment: 'jsdom'` (un DOM simulado en Node), `setupFiles: './src/test/setup.js'`
  y `coverage` con el proveedor `v8`.
- **`src/test/setup.js`:** importa `@testing-library/jest-dom/vitest` (agrega
  matchers como `toBeInTheDocument`, `toBeDisabled`), limpia `localStorage`
  antes de cada prueba y desmonta lo renderizado después (`cleanup`).
- **React Testing Library:** `render`, `screen`, `fireEvent`, `waitFor`.
- Scripts en `package.json`: `test`, `test:watch`, `test:coverage`.

### «¿Qué es un mock y qué es un spy? ¿Dónde los usas?»
- **Mock (`vi.fn`)**: función falsa que registra cómo la llamaron. En
  `Item.test.jsx`, `onAgregar` es un `vi.fn()` y se verifica
  `toHaveBeenCalledWith({ codigo, nombre, precio, stock })`. También en Carrito,
  Checkout y DetalleProducto.
- **Mock de módulo (`vi.mock`)**: reemplaza un archivo entero. `Login.test.jsx`
  hace `vi.mock("../services/authService")` y fuerza
  `iniciarSesion.mockReturnValue(false)` para probar «Credenciales incorrectas»
  sin depender de `usuarios.json`.
- **Spy (`vi.spyOn`)**: observa (y opcionalmente reemplaza) una función real.
  `authService.test.js` espía `Storage.prototype.setItem` para verificar que el
  login guarda el usuario. `AdminProductos.test.jsx` espía `window.confirm` para
  simular «Aceptar» o «Cancelar».
- **Relojes falsos (`vi.useFakeTimers`)**: en `Item.test.jsx`, para adelantar
  1,5 s sin esperarlos (`vi.advanceTimersByTime(1500)`).

### «¿Por qué usas `findBy` o `waitFor` en algunas pruebas?»
Las páginas cargan datos en un `useEffect` asíncrono: en el primer render la
lista está vacía. `findBy…` espera hasta que aparezca el elemento; `waitFor`
reintenta un `expect` hasta que se cumpla (por ejemplo, que GA001 desaparezca
después de eliminar). `queryBy…` se usa para afirmar que algo **no** está
(`getBy` lanzaría error).

### «¿Por qué `MemoryRouter` en las pruebas?»
Los componentes con `<Link>`, `useNavigate` o `useParams` necesitan un router.
`MemoryRouter` es un router en memoria; con `initialEntries` y `<Routes>` se
puede abrir una URL concreta (`/admin/productos/GA001`) y comprobar a dónde navega.

### «Analiza los resultados de cobertura»
Ver `cobertura-testing-EP2.md`. Total ≈ **75 % de líneas**. Alto en lo
importante: `utils/` 100 %, `services/` ≈ 92 %, páginas con lógica
(Admin, AdminProductos, AdminProductoForm, Checkout, Login) 80–100 %.
En 0 %: páginas de solo presentación (Inicio, Nosotros, NoEncontrado), Header,
Footer, `App.jsx` y `ResultadoCompra`. Se priorizó probar **lógica y
comportamiento** sobre páginas estáticas. Siguiente paso: pruebas de Header
(menú móvil) y `RutaProtegida`.

---

## 5. Preguntas sobre la tecnología de la pauta

### «La pauta pide Bootstrap. ¿Por qué Tailwind?»
El docente informó que la pauta es antigua y que el curso usa Tailwind. Lo mismo
que Bootstrap resuelve con clases de grilla (`col-md-6`), Tailwind lo resuelve
con utilidades (`md:grid-cols-2`). Ventaja aquí: la paleta propia vive en
`@theme` y no hay que sobrescribir estilos de un tema prearmado.

### «La pauta pide Jasmine y Karma. ¿Qué usaste?»
Vitest + React Testing Library, el reemplazo indicado por el curso.
Equivalencias: `describe`/`it`/`expect` son iguales; `jasmine.createSpy` ≈
`vi.fn`; `spyOn` ≈ `vi.spyOn`; Karma levantaba un navegador real, Vitest usa
**jsdom** dentro de Node, más rápido y sin navegador.

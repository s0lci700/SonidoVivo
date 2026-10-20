# Resumen de una página

## Stack
React 19 · Vite 8 · React Router 7 · Tailwind CSS 4 · Vitest 4 + React Testing
Library + jsdom · ESLint. JavaScript (no TypeScript). Datos simulados en JSON +
`localStorage`.

## Comandos (en `frontend/`)
`npm install` · `npm run dev` · `npm test` · `npm run test:coverage` ·
`npm run lint` · `npm run build`

## Rutas (`App.jsx`, todas dentro de `LayoutPrincipal`)

| Ruta | Página | Notas |
|---|---|---|
| `/` | Inicio | Destacados con `Item` sin botón |
| `/catalogo` | Catalogo | Filtro `?categoria=` con `useSearchParams` |
| `/producto/:codigo` | DetalleProducto | `useParams` |
| `/nosotros`, `/contacto` | Nosotros, Contacto | Contacto: formulario validado |
| `/carrito` | Carrito | Recibe el carrito y 3 funciones por props |
| `/checkout` | Checkout | Validaciones, región → comunas |
| `/compra/exito`, `/compra/error` | ResultadoCompra | Pedido por `useLocation().state` |
| `/login`, `/registro` | Login, Registro | Registro pendiente |
| `/admin` | Admin | Protegida |
| `/admin/productos` | AdminProductos | Protegida · listar y eliminar |
| `/admin/productos/nuevo`, `/admin/productos/:codigo` | AdminProductoForm | Protegida · crear y editar |
| `*` | NoEncontrado | 404 |

## Dónde está cada cosa

| Qué | Archivo |
|---|---|
| Estado del carrito | `App.jsx` (`useState`) |
| Reglas del carrito | `utils/carrito.js` |
| Validaciones | `utils/validaciones.js` |
| CRUD de productos | `services/productoService.js` |
| Sesión | `services/authService.js` (clave `usuarioActual`) |
| Proteger rutas | `components/RutaProtegida.jsx` |
| Layout + `<Outlet />` | `layouts/LayoutPrincipal.jsx` |
| Tarjeta de producto | `components/Item.jsx` |
| Input con label y error | `components/Campo.jsx` |
| Select con label y error | `components/Selector.jsx` |
| Botón / enlace con estilo de botón | `components/Boton.jsx` |
| Colores, fuentes, animaciones | `src/index.css` (`@theme`) |
| Configuración de pruebas | `vite.config.js` (`test`), `src/test/setup.js` |

## Hooks usados
- `useState`: carrito, formularios, errores, listas cargadas, menú móvil, «Agregado».
- `useEffect`: cargar datos de los servicios (con dependencias: `[]`, `[codigo]`, `[props.categoriaId]`).
- `useRef`: el temporizador de «Agregado» en `Item` (no provoca re-render).
- React Router: `useParams`, `useNavigate`, `useSearchParams`, `useLocation`.

## Números
- **78 pruebas**, 15 archivos, todas pasando.
- Cobertura: **75 % líneas** · utils 100 % · services ≈ 92 %.
- **51 productos**, 10 categorías, 16 regiones.
- Más de 45 commits.

## Tres frases para empezar cualquier respuesta
1. «Está en `<archivo>`, en `<función>`: …» (y abrirlo).
2. «Por ejemplo, con GA001, que tiene stock 8: …»
3. «Lo verifica la prueba `<nombre>` en `<archivo>.test`.»

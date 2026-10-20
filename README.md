# Sonido Vivo

Proyecto semestral **DSY1104 · Desarrollo Full Stack II · 2026-2**, sección 005D.
Caso Forma B: *Tienda Sonido Vivo*. Proyecto individual de Sol León.

Tienda de instrumentos y equipos musicales de Viña del Mar: catálogo en línea
con stock, carrito, compra con despacho o retiro en tienda, y un panel de
administración para mantener los productos.

**Versión actual: Evaluación Parcial 2** (frontend en React con datos simulados).

## Ejecutar

Requiere Node.js 20.19+ o 22.12+ (probado con Node 24).

```
cd frontend
npm install
npm run dev        # http://localhost:5173
npm test           # 78 pruebas unitarias
```

| Comando (en `frontend/`) | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite |
| `npm run build` | Build de producción en `frontend/dist/` |
| `npm test` | Ejecuta las pruebas unitarias una vez |
| `npm run test:watch` | Pruebas en modo observación |
| `npm run test:coverage` | Pruebas con reporte de cobertura en `frontend/coverage/` |
| `npm run lint` | ESLint |

**Administración:** `/login` con el usuario administrador de
`frontend/src/data/usuarios.json` (el primero de la lista). La sesión es
simulada; para volver al catálogo original, borra el `localStorage` del sitio
desde las herramientas del navegador.

## Qué incluye

- Catálogo de 51 productos con filtro por categoría (en la URL) y ficha de producto.
- Carrito con cantidades limitadas por el stock, subtotales y total.
- Checkout con validaciones, despacho (región → comuna) o retiro en tienda, y
  resultado de la compra exitoso o rechazado (pago simulado).
- Inicio y cierre de sesión simulados, rutas de administración protegidas.
- Panel de administración con indicadores y lista de productos por reponer.
- CRUD de productos: listar, crear, editar y eliminar, persistido en `localStorage`.
- Contacto con validaciones, Inicio, Nosotros y página 404.
- Diseño responsivo (360 / 768 / 1280 px) con menú hamburguesa en móvil.

## Tecnología

React 19 · Vite 8 · React Router 7 · **Tailwind CSS 4** · **Vitest 4 + React
Testing Library** · ESLint. JavaScript.

La pauta de la EP2 nombra Bootstrap y Jasmine/Karma; el curso autorizó Tailwind
CSS y reemplazó Jasmine/Karma por Vitest + React Testing Library.

## Estructura

```
SonidoVivo/
├── frontend/          App React + Vite (Parcial 2)
│   └── src/
│       ├── App.jsx        rutas y estado del carrito
│       ├── layouts/       LayoutPrincipal: Header + página activa + Footer
│       ├── pages/         una vista por ruta
│       ├── components/    piezas reutilizables (Item, Boton, Campo, Selector, Header…)
│       ├── services/      acceso a datos: productos (CRUD), sesión, regiones
│       ├── utils/         funciones puras: carrito, validaciones, estadoStock, formatearPrecio
│       ├── data/          datos simulados (JSON)
│       └── test/          configuración de Vitest
├── backend/           Microservicios Spring Boot (Parcial 3)
├── database/          Modelo y scripts MySQL (Parcial 3)
└── documentacion/     ERS, cobertura del testing, guía técnica y material del curso
```

Las pruebas viven junto al archivo que prueban (`*.test.js` / `*.test.jsx`).

## Rutas

Definidas en `frontend/src/App.jsx`, todas dentro de `LayoutPrincipal`.

| Ruta | Vista |
|---|---|
| `/` | Inicio |
| `/catalogo` | Catálogo, con filtro `?categoria=ID` |
| `/producto/:codigo` | Ficha de producto |
| `/nosotros`, `/contacto` | Nosotros, Contacto |
| `/carrito` | Carrito de compras |
| `/checkout` | Datos de entrega y pago |
| `/compra/exito`, `/compra/error` | Resultado de la compra |
| `/login` | Inicio de sesión |
| `/registro` | Registro (pendiente) |
| `/admin` | Panel de administración (requiere sesión) |
| `/admin/productos` | Listado de productos (requiere sesión) |
| `/admin/productos/nuevo`, `/admin/productos/:codigo` | Crear y editar producto (requiere sesión) |
| cualquier otra | Página no encontrada |

## Documentación

| Documento | Contenido |
|---|---|
| [`documentacion/ERS-SonidoVivo.md`](documentacion/ERS-SonidoVivo.md) | Especificación de requisitos, versión 2 (también en PDF) |
| [`documentacion/cobertura-testing-EP2.md`](documentacion/cobertura-testing-EP2.md) | Pruebas, mocks, cobertura y análisis (también en PDF) |
| [`documentacion/defensa-EP2/`](documentacion/defensa-EP2/) | Guía técnica del código: recorridos, pruebas, decisiones. Abrir `index.html` |
| [`documentacion/guion-video-EP2.md`](documentacion/guion-video-EP2.md) | Guion del video de demostración |
| `DESIGN.md`, `PRODUCT.md` | Sistema visual y contexto de diseño |

## Decisiones técnicas

- **Capa de servicios.** Las páginas nunca leen `data/` directamente; pasan por
  `frontend/src/services/`, con funciones `async`. En el Parcial 3 solo esa capa
  cambia a `fetch` contra la API REST.
- **Estado del carrito en `App`.** Es el ancestro común del encabezado, el
  catálogo, el carrito y el checkout; baja por props. Las reglas del carrito son
  funciones puras en `utils/carrito.js`.
- **CRUD sobre `localStorage`.** El catálogo parte de `productos.json` y se
  guarda en el navegador para que los cambios del administrador persistan.
- **Sesión simulada.** `authService` guarda `{ correo, nombre, rol }` en
  `localStorage`. No es seguridad real; en el Parcial 3 se reemplaza por JWT.
- **Responsivo con Tailwind**, *mobile first*: prefijos `sm:`, `md:`, `lg:` en
  cada componente y tokens de color en `src/index.css` (`@theme`).

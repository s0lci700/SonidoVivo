# Sonido Vivo

Proyecto semestral **DSY1104 · Desarrollo Full Stack II · 2026-2** — Forma B: *Tienda Sonido Vivo*.

Tienda de instrumentos y equipos musicales en Viña del Mar que necesita un catálogo en línea con stock actualizado, pedidos formales para clientes remotos y control de inventario y ventas.

## Estructura

```
SonidoVivo/
├── frontend/        App React + Vite (Parcial 2)
├── backend/         Microservicios Spring Boot (Parcial 3)
├── database/        Modelo y scripts MySQL (Parcial 3)
└── documentacion/   Instrucciones del curso, caso y catálogo
```

## Frontend

Requiere Node.js 20.19+ o 22.12+.

```
cd frontend
npm install
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite |
| `npm run build` | Build de producción en `frontend/dist/` |
| `npm test` | Ejecuta las pruebas unitarias una vez |
| `npm run test:watch` | Pruebas en modo observación |
| `npm run test:coverage` | Pruebas con reporte de cobertura (texto y `coverage/`) |
| `npm run lint` | ESLint |

### Organización de `frontend/src`

```
src/
├── layouts/      LayoutPrincipal: Header + página activa + Footer
├── pages/        Una vista por ruta
├── components/   Piezas reutilizables (Header, Footer, Item, ItemList, Chip, RutaProtegida)
├── services/     Acceso a datos y sesión (productoService, authService)
├── data/         Catálogo y categorías simulados (JSON)
├── utils/        Funciones puras: estadoStock, validaciones
├── assets/       Imágenes de productos
└── test/         Configuración de Vitest
```

Las pruebas viven junto al archivo que prueban (`*.test.js` / `*.test.jsx`).

### Rutas

Definidas en `frontend/src/App.jsx`, todas dentro de `LayoutPrincipal`. El catálogo con filtro por categoría está operativo; el resto de las vistas está en desarrollo para la Evaluación Parcial 2.

| Ruta | Vista |
|---|---|
| `/` | Inicio |
| `/catalogo` | Catálogo, con filtro `?categoria=ID` |
| `/producto/:codigo` | Detalle de producto |
| `/nosotros` | Nosotros |
| `/contacto` | Contacto |
| `/carrito` | Carrito de compras |
| `/checkout` | Datos de entrega y pago |
| `/compra/exito`, `/compra/error` | Resultado de la compra |
| `/login`, `/registro` | Inicio de sesión y registro |
| `/admin` | Panel de administración (requiere sesión) |
| `/admin/productos` | Listado de productos (requiere sesión) |
| `/admin/productos/nuevo`, `/admin/productos/:codigo` | Crear y editar producto (requiere sesión) |
| cualquier otra | Página no encontrada |

## Decisiones técnicas

- **Diseño responsivo: Tailwind CSS v4.** El curso acepta Bootstrap o Tailwind y pide elegir uno. Se eligió Tailwind porque sus prefijos de breakpoint (`md:`, `lg:`) permiten expresar el comportamiento responsivo directamente en cada componente, sin archivos CSS separados.
- **Navegación:** React Router (`react-router-dom`), con un layout común y rutas de administración envueltas en `RutaProtegida`.
- **Pruebas: Vitest + React Testing Library** (entorno `jsdom`), la actualización técnica que el curso autoriza en lugar de Jasmine/Karma.
- **Sesión:** en Parcial 2 es simulada en `localStorage` (`authService`); no es seguridad real y en Parcial 3 se reemplaza por autenticación del backend con JWT.
- **Datos:** en Parcial 2 los datos son simulados (`frontend/src/data/`) y se consumen a través de `frontend/src/services/`, para que en Parcial 3 solo cambie la capa de servicios al conectarse a la API REST.

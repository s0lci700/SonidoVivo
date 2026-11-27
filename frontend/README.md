# Sonido Vivo — Frontend (React)

Proyecto semestral **DSY1104 · Desarrollo Full Stack II · 2026-2**, sección 005D.
Caso Forma B: *Tienda Sonido Vivo*. Proyecto individual de Sol León.

Tienda de instrumentos de Viña del Mar: catálogo con stock, carrito, compra con despacho
o retiro, inicio de sesión con JWT y paneles según el rol (administrador, vendedor, cliente).
Consume los tres microservicios Spring Boot del repositorio del backend.

## Requisitos

- **Node.js 20.19+ o 22.12+** (probado con Node 24 y 25).
- **El backend en ejecución** ([SonidoVivo-backend](https://github.com/s0lci700/SonidoVivo-backend)): XAMPP con MySQL iniciado
  y los microservicios `ms-productos` (8081), `ms-usuarios` (8082) y `ms-pedidos` (8083).
  Sin backend el sitio abre, pero el catálogo y el login muestran error de conexión.

## Ejecutar

```powershell
npm install
npm run dev        # http://localhost:5173
```

Orden para levantar todo: XAMPP (MySQL) → los tres microservicios → `npm run dev`.

Las URL de los microservicios tienen valores por defecto (`src/services/api.js`). Para
cambiarlas, copiar `.env.example` como `.env` y editarlo.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite |
| `npm run build` | Build de producción en `dist/` |
| `npm test` | Pruebas unitarias (Vitest + React Testing Library) |
| `npm run test:coverage` | Pruebas con reporte de cobertura en `coverage/` |
| `npm run lint` | ESLint |

Las pruebas **no necesitan el backend**: `src/test/apiSimulada.js` reemplaza `fetch` por
un backend falso que responde con los datos de `src/data/`.

## Usuarios de demostración

Los crea `ms-usuarios` la primera vez que arranca.

| Correo | Contraseña | Rol | Llega a |
|---|---|---|---|
| `admin@sonidovivo.cl` | `Admin123` | ADMINISTRADOR | `/admin` |
| `vendedor@sonidovivo.cl` | `Vendedor123` | VENDEDOR | `/admin/pedidos` |
| `cliente@correo.cl` | `Cliente123` | CLIENTE | `/mis-pedidos` |

También se puede crear una cuenta de cliente en `/registro`.

## Rutas

| Ruta | Vista | Acceso |
|---|---|---|
| `/`, `/nosotros`, `/contacto` | Inicio, Nosotros, Contacto | Público |
| `/catalogo`, `/producto/:codigo` | Catálogo (filtro `?categoria=ID`) y ficha | Público |
| `/carrito`, `/compra/exito`, `/compra/error` | Carrito y resultado de la compra | Público |
| `/checkout` | Datos de entrega y confirmación | Pide iniciar sesión para comprar |
| `/login`, `/registro` | Inicio de sesión y registro | Público |
| `/mis-pedidos` | Historial de pedidos propios | Con sesión |
| `/admin/pedidos` | Gestión de pedidos y estados | ADMINISTRADOR, VENDEDOR |
| `/admin`, `/admin/productos[/nuevo\|/:codigo]` | Panel y CRUD de productos | ADMINISTRADOR |
| `/admin/usuarios[/nuevo]` | Gestión de usuarios | ADMINISTRADOR |
| `/sin-permiso`, cualquier otra | 403 y 404 | — |

`RutaProtegida` oculta las pantallas según el rol, pero la protección real está en el
backend: una llamada directa a la API sin el rol correcto recibe 401 o 403.

## Cómo se conecta con el backend

- **`src/services/api.js`** es el único archivo que llama a `fetch`. Agrega
  `Authorization: Bearer <token>`, convierte las respuestas de error (`{error, campos}`)
  en `ErrorApi` y borra la sesión ante un 401.
- **`src/services/sesion.js`** guarda el token, el rol y el nombre en `sessionStorage` y
  descarta la sesión vencida.
- Tras un F5, `RutaProtegida` valida la sesión con `GET /auth/me` antes de mostrar la página.
- Las páginas nunca llaman a `fetch`: usan `authService`, `productoService`,
  `pedidoService` y `usuarioService`.

## Estructura

```
src/
├── App.jsx        rutas y estado del carrito
├── layouts/       LayoutPrincipal: Header + página + Footer
├── pages/         una vista por ruta
├── components/    piezas reutilizables (Item, Header, RutaProtegida, Campo…)
├── services/      acceso a la API (api.js, sesion.js y un servicio por recurso)
├── utils/         funciones puras: carrito, validaciones, formato de precios
├── data/          datos del Parcial 2, usados solo por el backend falso de las pruebas
└── test/          configuración de Vitest y apiSimulada.js
```

## Tecnología

React 19 · Vite 8 · React Router 7 · Tailwind CSS 4 · Vitest 4 + React Testing Library ·
ESLint. JavaScript.

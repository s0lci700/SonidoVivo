# Desarrollo del proyecto y aporte personal

Proyecto **individual**: Sol León (sección 005D). Repositorio:
https://github.com/s0lci700/SonidoVivo — 45 commits entre el 25/09 y el 20/10/2026.

## Identidades en el historial

| Autor en git | Commits | Qué es |
|---|---|---|
| Sol León | 41 | Equipo personal |
| AO-Alumno | 3 | Equipo de la sala de clases (25/09 y 02/10: creación del repo, plantilla Vite, instalación de Vitest) |
| s0lci700 | 1 | Cuenta de GitHub, reorganización inicial del repo |

Las tres identidades son de la misma estudiante; git las separa por nombre y correo del equipo usado.

## Evolución por etapas

| Fecha | Commits | Qué se hizo |
|---|---|---|
| 25/09 | `7eb391b` → `ae8a09b` | Repo, plantilla React + Vite, catálogo importado del `.xlsx` a JSON, carpetas `backend/` y `database/` reservadas para el Parcial 3 |
| 29/09 | `c1b6e5f` → `af4bd42` | Listado de productos, `productoService`, Header y página Catálogo, sistema de diseño (PRODUCT.md, DESIGN.md), filtro por categoría |
| 02–06/10 | `dfd210d` → `bee3aac` | Instalación de Vitest + RTL (Tutorial 5), primera función extraída a `utils/` con pruebas (`estadoStock`) |
| 12/10 | `3a9d338` | Esqueleto de rutas y páginas de la EP2 |
| 13/10 | `1fcf263` → `3c7558b` | Validaciones y pruebas, Contacto y `Campo`, `Boton`, Login simulado, pruebas de Contacto, Login e Item |
| 15/10 | `1d3e56a` | Prueba con **spy** sobre `localStorage` en `iniciarSesion` |
| 17/10 | `4a7f0f3`, `8ded4fc` | Lógica del carrito en `utils/carrito.js` con 13 pruebas; estado del carrito en `App` y botón Agregar |
| 20/10 | `c0e8fdc` → `896ec76` | Ficha de producto, checkout y resultado; página del carrito; CRUD sobre `localStorage` con pruebas; tabla y formulario de administración con pruebas; panel de administración; refactor (`formatearPrecio`, `Selector`) |

## Commits para mostrar en la defensa

Cada uno se abre en GitHub (`/commit/<hash>`) y muestra el diff.

| Commit | Problema que resolvió | Qué cambió |
|---|---|---|
| `4a7f0f3` Agregar lógica del carrito en utils con sus pruebas | El carrito necesitaba reglas (no duplicar líneas, respetar el stock) que se pudieran probar sin React | `utils/carrito.js`: `agregarProducto`, `quitarProducto`, `cambiarCantidad`, `calcularTotal` y `limitarCantidad`, todas inmutables; 13 pruebas |
| `8ded4fc` Conectar el carrito | El Header, el Catálogo y el Carrito tenían que compartir un mismo carrito | `useState` del carrito en `App`; `onAgregar` baja por props hasta `Item` |
| `592f255` CRUD simulado de productos sobre localStorage | El catálogo era de solo lectura; el Anexo 1 pide crear, editar y eliminar | `productoService.js`: copia en `localStorage`, `crearProducto` / `actualizarProducto` / `eliminarProducto` con errores; 9 pruebas |
| `b7ec23b` Formulario de producto | Crear y editar con la misma página, validando todos los campos | `useParams` para el modo, formulario controlado, 8 validaciones, `try/catch` del servicio |
| `cae0a57` Pruebas del formulario de producto | Verificar precarga, bloqueo del código, errores y guardado | `MemoryRouter` con `initialEntries` y rutas reales; 5 pruebas |
| `1d3e56a` Prueba con spy | Comprobar que el login guarda la sesión sin guardar la contraseña | `vi.spyOn(Storage.prototype, "setItem")` |

## Autoría y uso de asistencia

El proyecto se desarrolló con **Claude Code** como asistente: explicaciones de
React y Vitest, revisión del código escrito, guías paso a paso y, en algunas
partes, borradores que luego se revisaron e integraron.

| Parte | Cómo se hizo |
|---|---|
| Lógica del carrito (`utils/carrito.js`) y sus pruebas | Escrita por la estudiante, con revisión del asistente |
| Estado del carrito en `App` y conexión con `Item`, `ItemList`, `Catalogo` | Escrita por la estudiante, con revisión |
| CRUD en `productoService.js` y sus 9 pruebas | Escrito por la estudiante, con guía y revisión |
| Lógica de `AdminProductos` y `AdminProductoForm` (estado, carga, eliminar, validaciones, guardado) y sus pruebas | Escrita por la estudiante, con guía y revisión |
| Prueba con spy de `authService` | Escrita por la estudiante |
| Ficha de producto, Checkout, ResultadoCompra, ResumenPedido, `regionService` | Borrador del asistente, revisado e integrado |
| Panel `/admin`, sesión en el Header, `formatearPrecio`, `Selector` | Borrador del asistente, revisado e integrado |
| Diseño visual (sistema de latón, animaciones, estilos de tablas y formularios) | Asistente, siguiendo `DESIGN.md` |

Todas las partes, incluidas las que empezaron como borrador, se recorren en
`02-recorridos-del-codigo.md` y se pueden explicar con el código abierto.

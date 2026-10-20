# Limitaciones conocidas y decisiones

Lo que la versión entregada no hace, o hace de forma simplificada, y por qué.
Cada punto indica dónde está en el código y qué cambiaría en el Parcial 3.

## Alcance

### El registro de usuarios no está implementado
- `pages/Registro.jsx` muestra «Pendiente» y tiene un `TODO`; la ruta `/registro` existe.
- `utils/validaciones.js` ya tiene `validarPassword` (6 caracteres y una
  mayúscula) **con sus pruebas**, pensada para ese formulario.
- **Decisión:** se priorizó el flujo de compra y el CRUD de administración, que
  son el núcleo del Anexo 1. Registrar usuarios requiere un `registrarUsuario`
  en `authService` (también con `TODO`) que en el Parcial 3 será un `POST` a la API.

### El pago es simulado
- `Checkout.jsx` tiene la casilla «Simular pago rechazado (demostración)» para
  mostrar las dos vistas de resultado (Figuras 7 y 8 del Anexo 1).
- No hay pasarela de pago: el Parcial 2 es solo frontend.

### Contacto no envía el mensaje
- `Contacto.jsx` valida y muestra «Mensaje enviado.», pero no lo manda a ningún
  lado. En el Parcial 3: `POST` a un endpoint de contacto.

## Estado y datos

### El carrito se pierde al recargar la página (F5)
- Vive en `useState` de `App.jsx`. Sobrevive al navegar (es una SPA), pero no a
  recargar, porque el estado de React vive en memoria.
- **Cómo se resolvería:** guardar el carrito en `localStorage` con un `useEffect`
  que escuche `[carrito]`, y leerlo al iniciar el `useState(() => ...)`. Se dejó
  fuera para no mezclar dos fuentes de verdad antes de tener backend.

### El contador del encabezado cuenta líneas, no unidades
- `LayoutPrincipal cantidadCarrito={carrito.length}`: dos guitarras iguales
  cuentan 1.
- **Alternativa:** `carrito.reduce((n, i) => n + i.cantidad, 0)`. Ambas son
  comunes en tiendas; se eligió «productos distintos».

### La copia del catálogo en `localStorage` no se actualiza sola
- `productoService.leerProductos()` usa `productos.json` **solo** la primera vez;
  después lee la copia guardada. Si se edita el JSON, el navegador sigue
  mostrando la copia vieja hasta borrar `localStorage`.
- Es el comportamiento esperado de un CRUD simulado (los cambios del admin
  deben persistir). En el Parcial 3 la fuente es la base de datos.

### Los productos creados no tienen foto
- Las imágenes salen de `src/assets/productos/<codigo>.webp`
  (`utils/imagenProducto.js`, con `import.meta.glob`). Un producto nuevo no
  tiene archivo: la tabla muestra «Sin foto» y la tarjeta queda sin imagen.
- En el Parcial 3 la imagen sería una URL guardada en la base de datos.

## Seguridad

### La sesión es simulada y no es seguridad real
- `authService.js` compara contra `usuarios.json`, que trae las contraseñas en
  texto plano, y guarda `{ correo, nombre, rol }` en `localStorage`
  (**no** guarda la contraseña: lo verifica `authService.test.js`).
- Cualquiera puede escribir `usuarioActual` a mano en DevTools y entrar a `/admin`.
- `RutaProtegida` es protección **de interfaz**. La seguridad real va en el
  backend del Parcial 3: contraseñas con hash y JWT validado en cada petición.

### `RutaProtegida` no revisa el rol
- Solo verifica que haya sesión (`estaAutenticado()`). Un usuario «Vendedor»
  activo también entraría al panel.
- El `TODO` del archivo deja el cambio indicado: recibir `props.rol` y comparar
  con `obtenerSesion().rol`.

## Pruebas y cobertura

### Archivos sin pruebas (0 %)
`App.jsx`, `Header.jsx`, `Footer.jsx`, `RutaProtegida.jsx`, `ItemList.jsx`,
`Chip.jsx`, `Catalogo.jsx`, `Inicio.jsx`, `Nosotros.jsx`, `NoEncontrado.jsx`,
`Registro.jsx`, `ResultadoCompra.jsx`.
- **Criterio:** se priorizó la lógica (utils 100 %, services ≈ 92 %) y las
  páginas con formularios o CRUD (80–100 %). Las de 0 % son sobre todo de
  presentación.
- **Las que más convendría agregar:** `RutaProtegida` (redirige sin sesión),
  `Header` (abre y cierra el menú móvil; muestra «Panel» con sesión) y
  `Catalogo` (el clic en un chip cambia `?categoria=`).

## Código

### Componentes internos en algunas páginas
`Filtros` (Catalogo), `ControlCantidad` (Carrito), `Indicador` (Admin),
`MarcaEstado` (ResultadoCompra) viven dentro de la página que los usa.
- **Criterio:** se extrae a `components/` lo que se **reutiliza**: `Selector` se
  movió porque lo usan Checkout y el formulario de admin; `formatearPrecio` se
  llevó a `utils/` porque se repetía en seis archivos. Lo que se usa una sola
  vez queda junto a su página.

### El umbral de «stock crítico» (3) está en dos lugares
`utils/estadoStock.js` (las etiquetas de la tarjeta) y `pages/Admin.jsx` (los
indicadores). Mejora simple: una constante `STOCK_CRITICO` exportada desde
`estadoStock.js`.

### `window.confirm` para eliminar
Es el diálogo nativo del navegador: simple y accesible, pero no se puede
estilizar. En las pruebas se reemplaza con `vi.spyOn(window, "confirm")`.

## Tecnología distinta a la pauta impresa

La rúbrica nombra **Bootstrap** y **Jasmine/Karma**. El curso los reemplazó por
**Tailwind CSS** y **Vitest + React Testing Library**, según lo indicado por el
docente. Equivalencias en `01-preguntas-por-indicador.md`, §5.

# Recorridos del código

Cada funcionalidad, desde lo que se ve en pantalla hasta el archivo y la función
que la implementan. Las flechas indican el orden en que corre el código.

---

## 1. Ver el catálogo y filtrar por categoría

**Pantalla:** `/catalogo`, chips de categorías, grilla de tarjetas.

1. `App.jsx` → ruta `catalogo` → `<Catalogo onAgregar={agregarAlCarrito} />`.
2. `pages/Catalogo.jsx`
   - `useSearchParams()` lee `?categoria=GA` de la URL.
   - `useEffect(..., [])` → `obtenerCategorias()` → estado `categorias`.
   - `Filtros` (componente interno) dibuja un `Chip` por categoría. Al hacer clic:
     `setSearchParams({ categoria: id })`; «Todas» hace `setSearchParams({})`.
3. `components/ItemList.jsx` recibe `categoriaId`.
   - `useEffect(..., [props.categoriaId])` → `obtenerProductos(categoriaId)` → estado `productos`.
   - `productos.map(p => <Item key={p.codigo} {...p} onAgregar={...} />)`.
4. `services/productoService.js` → `obtenerProductos(categoriaId)`: lee la lista
   (`leerProductos()`) y filtra por `categoriaId` si viene.

**Por qué el filtro está en la URL y no en un `useState`:** sobrevive a recargar,
se puede compartir el enlace y el botón Atrás del navegador vuelve al filtro anterior.

---

## 2. Agregar un producto al carrito

**Pantalla:** botón «Agregar» en la tarjeta → cambia a «Agregado» con un visto
por 1,5 s; el contador del encabezado sube y aparece un anillo de latón.

1. `components/Item.jsx` → `agregar()`:
   - `props.onAgregar({ codigo, nombre, precio, stock })`: envía solo los campos
     que el carrito necesita.
   - `setAgregado(true)` y un `setTimeout` de 1500 ms guardado en `useRef`.
     Si se hace clic otra vez, `clearTimeout` reinicia la cuenta.
2. `App.jsx` → `agregarAlCarrito(producto)`:
   - `setCarrito(prev => agregarProducto(prev, producto))`.
   - `setPulsoCarrito(n => n + 1)`: dispara la animación del Header.
3. `utils/carrito.js` → `agregarProducto`: si ya está, suma 1 con tope de stock
   (`limitarCantidad`); si no, lo agrega con `cantidad: 1`.
4. `LayoutPrincipal` recibe `cantidadCarrito={carrito.length}` → `Header` lo muestra.
   El anillo es un `<span key={pulsoCarrito}>`: al cambiar la `key`, React lo
   vuelve a montar y la animación `animate-resonar` se repite.

**El contador muestra líneas, no unidades** (`carrito.length`): ver `05`.

---

## 3. Ver la ficha de un producto

**Pantalla:** clic en el nombre de una tarjeta → `/producto/GA001`.

1. `Item.jsx`: `<Link to={`/producto/${props.codigo}`}>`.
2. `App.jsx` → ruta `producto/:codigo` → `DetalleProducto`.
3. `pages/DetalleProducto.jsx`:
   - `const { codigo } = useParams()`.
   - Estado `producto` con tres valores: `undefined` = cargando, `null` = no
     existe (muestra «Producto no encontrado»), objeto = el producto.
   - `useEffect(..., [codigo])` → `obtenerProductoPorCodigo(codigo)`.
   - Ficha técnica en una lista `<dl>` (Marca, Modelo, Categoría, Código).

---

## 4. Cambiar cantidades y quitar en el carrito

**Pantalla:** `/carrito`, botones − y + por línea, «Quitar», «Vaciar», total.

1. `App.jsx` pasa `carrito`, `onQuitar`, `onCambiarCantidad`, `onVaciar`.
2. `pages/Carrito.jsx` no tiene estado propio: muestra el carrito y avisa hacia arriba.
   - `ControlCantidad` (interno): `−` llama `onCambiarCantidad(codigo, cantidad - 1)`,
     `+` con `cantidad + 1`. Los botones se deshabilitan en 1 y en el stock.
   - Total con `calcularTotal(carrito)` (`reduce`) y `formatearPrecio`.
   - Carrito vacío → «Tu carrito está vacío» y enlace al catálogo.
3. `App.jsx` → `cambiarCantidadCarrito` → `utils/carrito.js` → `cambiarCantidad`,
   que también usa `limitarCantidad`.

---

## 5. Pagar (checkout) y ver el resultado

**Pantalla:** `/checkout` → formulario de datos y entrega + resumen → «Pagar $…»
→ `/compra/exito` o `/compra/error`.

1. `pages/Checkout.jsx`
   - Estado: `formData` (nombre, apellidos, correo, entrega, calle, región, comuna),
     `errores`, `regiones` (de `regionService`), `rechazarPago` (casilla de demostración).
   - Al cambiar la región, `handleChange` limpia la comuna; las comunas salen de
     la región elegida con `find`.
   - `handleSubmit`: valida; si la entrega es **despacho**, también calle, región
     y comuna. Con errores → `return` (el carrito no se toca).
   - Arma `pedido` (número, cliente, entrega, líneas, total).
   - `rechazarPago` marcado → `navigate("/compra/error", { state: { pedido } })`,
     el carrito se conserva.
   - Si no → `props.onVaciar()` y `navigate("/compra/exito", { state: { pedido } })`.
2. `pages/ResultadoCompra.jsx`
   - `useLocation().state?.pedido` lee el pedido que envió el Checkout.
   - `props.exito` decide la vista: «Compra realizada» (pátina) o «No se pudo
     realizar el pago» (cobre, con «Volver a intentar»).
   - Si se entra escribiendo la URL no hay `state` → «Sin pedido».
3. `components/ResumenPedido.jsx`: lista de líneas y total; lo usan Checkout y ResultadoCompra.
4. `components/Selector.jsx`: los `<select>` de región y comuna.

---

## 6. Formulario de contacto

**Pantalla:** `/contacto`, nombre, email y mensaje.

`pages/Contacto.jsx`: formulario controlado; `handleSubmit` valida con
`validarCorreo` y `validarTexto` (mínimo 3 para el nombre y 10 para el mensaje).
Si es válido muestra «Mensaje enviado.» y limpia el formulario.

---

## 7. Iniciar y cerrar sesión

1. `pages/Login.jsx`: `usuario` (correo, password) y `error`. `handleSubmit`:
   - vacíos → «Ingrese su correo y su contraseña»;
   - `iniciarSesion(correo, password)` falso → «Credenciales incorrectas»;
   - correcto → `navigate("/admin")`.
2. `services/authService.js`:
   - `iniciarSesion` busca en `usuarios.json` (correo, password y `activo`) y guarda
     `{ correo, nombre, rol }` en `localStorage` con la clave `usuarioActual`.
     **No guarda la contraseña.**
   - `obtenerSesion`, `estaAutenticado`, `cerrarSesion`.
3. `components/Header.jsx`: lee `obtenerSesion()` en cada render; `useLocation()`
   hace que se vuelva a dibujar al navegar. Con sesión muestra «Panel» y «Salir».
4. `components/RutaProtegida.jsx`: sin sesión → `<Navigate to="/login" replace />`.

---

## 8. Panel de administración

**Pantalla:** `/admin` → saludo, «Cerrar sesión», indicadores, «Por reponer», secciones.

`pages/Admin.jsx`:
- Saludo con `obtenerSesion().nombre`.
- `useEffect` → `obtenerProductos()`; `agotados` (stock 0) y `criticos` (1 a 3)
  se calculan con `filter` en cada render.
- «Por reponer»: agotados primero, después críticos ordenados por stock; cada
  fila enlaza al formulario de edición.
- «Cerrar sesión» → `cerrarSesion()` y `navigate("/login")`.
- Usuarios, Pedidos y Reportes figuran como «Parcial 3».

---

## 9. CRUD de productos

### Listar y eliminar — `pages/AdminProductos.jsx`
- `cargar = () => obtenerProductos().then(setProductos)`, llamada en `useEffect`.
- Tabla con Código, Nombre (miniatura + enlace a la ficha pública en otra pestaña),
  Categoría, Precio, Stock (punto de color + número + «crítico»/«agotado») y acciones.
- `eliminar(codigo)`: `window.confirm`; si se acepta →
  `eliminarProducto(codigo).then(cargar)`.

### Crear y editar — `pages/AdminProductoForm.jsx`
- `useParams()`: sin `codigo` crea, con `codigo` edita.
- `useEffect(..., [codigo])`: carga categorías y, si edita, el producto (precio y
  stock a texto con `String`).
- `handleSubmit`: 8 reglas de validación → `producto` con `Number(precio)`,
  `Number(stock)` y `categoria` (nombre, sacado de `categoriaId`) →
  `actualizarProducto` o `crearProducto` dentro de `try/catch` →
  `navigate("/admin/productos")`. Si el servicio lanza «Ya existe…», el mensaje
  aparece en el campo Código.

### Datos — `services/productoService.js`
- Copia del catálogo en `localStorage` (clave `productos`); la primera vez parte
  de `productos.json`.
- Como `obtenerProductos` lee de esa copia, los cambios del admin se ven de
  inmediato en el catálogo, la ficha y el carrito.

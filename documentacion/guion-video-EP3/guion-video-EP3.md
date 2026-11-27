# Guion del video EP3 — Sonido Vivo

Duración objetivo: **8–10 minutos** (la guía oficial `03_DSY1104_EP3_Guia_Video_AVA` sugiere 8 a 12).
El orden sigue los bloques de esa guía: Inicio → Backend y BD → Swagger y CRUD → Integración
React REST → JWT y roles → Sesiones y restricciones → Cierre. Una sola toma por bloque; si te equivocas, corta y sigue
desde el bloque. Las capturas son del sistema real corriendo el 26/11 (React + 3
microservicios + MariaDB de XAMPP).

Lo que la pauta exige que se vea: **integración React–Spring Boot, CRUD, persistencia,
login JWT, sesión, restricciones por rol**. Cada bloque dice qué indicador cubre.

## 0. Antes de grabar (checklist)

1. XAMPP: **MySQL** y **Apache** en *Start* (Apache solo para mostrar phpMyAdmin).
2. Los tres microservicios, **de a uno** (si arrancan juntos, Maven choca al descargar):
   `cd backend\ms-usuarios` → `.\mvnw.cmd -s ..\settings-google.xml spring-boot:run`,
   esperar "Started", luego `ms-productos`, luego `ms-pedidos`.
3. `cd frontend` → `npm run dev`.
4. Chrome en ventana normal (no incógnito), zoom 100 %, sin otras pestañas. Abrir
   DevTools (F12) → pestaña **Network**, filtro **Fetch/XHR**, y acoplarlo abajo.
5. Base limpia: 51 productos, GA001 con stock 8, sin pedidos (ya quedó así).
6. Pestañas preparadas: `localhost:5173`, `localhost:8081/swagger-ui.html`,
   `localhost/phpmyadmin`, y VS Code con `frontend/src/services/api.js` abierto.

## 1. Presentación — 20 s

**Pantalla:** inicio de la tienda.

> "Soy Sol León, sección 005D. Este es Sonido Vivo, una tienda de instrumentos. El
> frontend es React con Vite y Tailwind, y el backend son tres microservicios Spring Boot
> —productos, usuarios y pedidos—, cada uno con su base de datos en MySQL de XAMPP."

![Inicio](01-inicio.jpg)

## 2. Arquitectura en el código — 40 s · *integración*

**Pantalla:** VS Code, `frontend/src/services/api.js`, y la carpeta `backend/` abierta.

> "Toda la comunicación pasa por `api.js`: es el único archivo que llama a `fetch`.
> Agrega el token en el header `Authorization: Bearer`, y si el backend responde 401
> borra la sesión. Las páginas nunca llaman a fetch, usan los servicios."

Mostrar en `backend/`: los tres `ms-*`, y en uno las capas `controller / service /
repository / model / dto / security`.

![VS Code: api.js, único lugar con fetch; agrega Authorization: Bearer (línea 28)](vscode/01-api-js.png)

## 2b. Backend y base de datos — 60 s · *IE3.1.1 backend + BD*

**Pantalla:** las tres terminales con `Started Ms...Application`, luego VS Code.

> "Los tres microservicios están levantados contra MariaDB de XAMPP." Mostrar en VS Code:
> `model/Producto.java` (entidad JPA, relación `@ManyToOne` con `Categoria`), su
> `ProductoRepository`, y en `ProductoService` una regla de negocio: el código no se repite
> (409) y el stock no puede quedar negativo. En `application.properties` mostrar solo la
> URL de la base y que la clave JWT viene de una variable de entorno (no hacer zoom al valor).
> En phpMyAdmin, las tres bases `sonidovivo_productos`, `sonidovivo_usuarios` y
> `sonidovivo_pedidos`.

![VS Code: entidad Producto con @ManyToOne a Categoria y validaciones](vscode/02-producto-entidad.png)

![VS Code: ProductoService.crear — 409 si el código ya existe](vscode/03-producto-service-409.png)

![VS Code: ProductoController — POST con @Valid, documentado para Swagger](vscode/04-producto-controller.png)

## 3. Catálogo público desde la API — 30 s · *integración*

**Pantalla:** `/catalogo` con DevTools Network abierto.

> "El catálogo es público. Los 51 productos vienen de `GET localhost:8081/api/productos`,
> sin token." → hacer clic en la petición en Network y mostrar la respuesta JSON.
> Filtrar por una categoría (chip) y mostrar que cambia a `?categoria=GA`.

![Catálogo](02-catalogo.jpg)

## 4. Ruta protegida y login JWT — 50 s · *autenticación JWT*

**Pantalla:** escribir a mano `localhost:5173/mis-pedidos` sin sesión.

> "Si intento entrar a Mis pedidos sin sesión, `RutaProtegida` me manda al login."

![Login](03-login.jpg)

Ingresar `cliente@correo.cl` / `Cliente123`.

> "Al iniciar sesión, React hace `POST /auth/login` a ms-usuarios, que valida la contraseña
> con BCrypt y devuelve un JWT firmado con el correo, el rol y el vencimiento." → mostrar en
> Network la respuesta con `token` y `rol`. Volvió solo a /mis-pedidos.

> DevTools → Application → Session Storage: mostrar que se guarda `token`, `rol`, `nombre` y
> `expiraEn`, **nunca la contraseña**. La guía pide **no mostrar tokens completos**: no hacer
> zoom al token ni pegarlo en sitios externos; basta con señalar que existe.

![Mis pedidos vacío](04-mis-pedidos-vacio.jpg)

**Para explicar JWT y roles en el código** (bloque corto, 30 s):

![VS Code: JwtService (ms-usuarios) — crea y firma el token con correo, rol y vencimiento](vscode/06-jwt-service-crea.png)

![VS Code: JwtFilter — lee el Bearer, verifica la firma y carga el rol](vscode/07-jwt-filter-verifica.png)

![VS Code: SecurityConfig — reglas por rol, 401 y 403 (líneas 38-51)](vscode/05-security-config-roles.png)

## 5. Compra que persiste y descuenta stock — 60 s · *CRUD + persistencia*

1. Abrir la ficha de **Guitarra Acústica Folk** → mostrar **"8 disponibles"**.
2. *Agregar al carrito* → carrito → *Comprar*.

![Carrito](06-carrito.jpg)

3. Nombre "Cliente", Apellidos "de Prueba", **Retiro en tienda** → *Pagar*.

![Checkout](07-checkout.jpg)

> "El pedido va a ms-pedidos con el token del cliente. Solo mando códigos y cantidades:
> el precio lo pone el servidor. ms-pedidos llama a ms-productos con un token propio de rol
> SERVICIO para descontar el stock."

![Compra realizada](08-compra-exito.jpg)

4. Volver a la ficha: ahora dice **7 disponibles**.

![Stock 7](10-stock-7.png)

![VS Code: PedidoService.crear — descuenta stock en ms-productos con token SERVICIO (línea 56)](vscode/08-pedido-service-descuenta.png)

## 6. La sesión sobrevive a F5 — 20 s · *sesiones*

**Pantalla:** `/mis-pedidos` → apretar **F5**.

> "Recargo la página y la sesión sigue: el token está en sessionStorage, y `RutaProtegida`
> lo valida con `GET /auth/me` antes de mostrar la página. Si estuviera vencido o
> alterado, me manda al login." → en Network se ve la llamada a `/auth/me`.

![Mis pedidos tras F5](09-mis-pedidos-f5.jpg)

**Sesión inválida (la guía lo pide explícitamente):** DevTools → Application → Session
Storage → clave `sesion` → en el valor, cambiar **una letra** del token → **F5**.

> "Si el token fue alterado o venció, `/auth/me` responde 401: la app borra la sesión y me
> manda al login. React no decide si el token es válido; lo decide el backend."

(Probado el 26/11: con la firma alterada, `/mis-pedidos` vuelve a `/login` y la sesión
queda en `null`.) Luego iniciar sesión de nuevo y presionar **Salir** para mostrar el cierre
de sesión.

![VS Code: sesion.js — sessionStorage y descarte del token vencido](vscode/09-sesion-js.png)

![VS Code: RutaProtegida.jsx — valida con /auth/me tras F5, Reintentar si no hay backend, roles](vscode/10-ruta-protegida.png)

## 7. Restricción por rol: cliente — 30 s · *roles (frontend + backend)*

Escribir a mano `localhost:5173/admin/productos`.

> "Un cliente no puede entrar al panel: React muestra Acceso restringido."

![Cliente restringido](05-cliente-restringido.jpg)

![VS Code: App.jsx — rutas envueltas en RutaProtegida con roles={SOLO_ADMIN} / {PERSONAL}](vscode/11-app-rutas-por-rol.png)

> "Pero la protección real está en el backend." → en Swagger de ms-productos (8081),
> *Authorize* con el token del cliente, `DELETE /api/productos/GA001` → **403
> `{"error":"Sin permisos"}`**. Sin token (*Logout* en Authorize) → **401
> `{"error":"No autenticado"}`**.

## 8. Vendedor: gestiona pedidos, nada más — 40 s · *roles*

*Salir* → login `vendedor@sonidovivo.cl` / `Vendedor123` → llega a **/admin/pedidos**.

![Pedidos del vendedor](11-vendedor-pedidos.jpg)

Cambiar el pedido #1 a **Despachado**.

![Despachado](12-despachado.jpg)

> "El vendedor ve y cambia el estado de todos los pedidos. Si cancelara uno, ms-pedidos
> repone el stock." Luego escribir `/admin/usuarios`:

![Vendedor restringido](13-vendedor-restringido.jpg)

> "Pero no puede gestionar usuarios ni productos: eso es solo del administrador."

## 9. Administrador: CRUD de productos con validaciones — 75 s · *CRUD*

*Salir* → login `admin@sonidovivo.cl` / `Admin123` → llega a **/admin**.

![Panel admin](14-admin-panel.jpg)

1. **Crear:** *Nuevo producto* → apretar *Guardar* vacío.

![Validaciones](15-validaciones.jpg)

> "React valida antes de enviar. Y el backend valida de nuevo con Bean Validation: si
> alguien salta el frontend recibe 400 con el error de cada campo."

   Llenar: `GA010`, *Guitarra Clásica de Estudio*, Yamaha, C40, Guitarras Acústicas,
   99990, stock 4, descripción → *Guardar*. La lista pasa a **52 productos**.

![Formulario](16-form-lleno.jpg)
![52 productos](17-52-productos.jpg)

2. **Editar** GA010: cambiar precio a 94990 → *Guardar* → se ve en la tabla.
3. **Eliminar** GA010 → confirmar → vuelve a 51.

> En Network: `POST`, `PUT` y `DELETE` a `:8081/api/productos` con `Authorization: Bearer`.

## 10. Persistencia en MySQL — 30 s · *persistencia*

**Pantalla:** phpMyAdmin → `sonidovivo_pedidos` → tabla `pedido` (el pedido #1,
DESPACHADO) y `sonidovivo_productos.producto` (GA001 con stock 7).

> "Todo queda en MySQL. Cada microservicio tiene su propia base: no comparten tablas,
> se comunican por REST. Si reinicio los servicios, los datos siguen."

Opcional: `sonidovivo_usuarios.usuario` → la columna `password` es un hash BCrypt.

![phpMyAdmin: sonidovivo_productos.producto (51 filas)](20-phpmyadmin-productos.jpg)

![phpMyAdmin: sonidovivo_usuarios.usuario — password guardada como hash BCrypt](21-phpmyadmin-usuarios-bcrypt.jpg)

## 11. Swagger con CRUD — 90 s · *IE3.2.1 CRUD documentado en Swagger*

La guía pide "ejemplos de lectura, creación, actualización y eliminación" en Swagger:

1. En `:8082/swagger-ui.html`, `POST /auth/login` con la cuenta admin → copiar el token
   (sin hacer zoom) → en `:8081/swagger-ui.html` botón **Authorize**.
2. `GET /api/productos/GA001` → 200.
3. `POST /api/productos` con el ejemplo de la sección 5.2 del documento de integración
   (`"categoriaId": "GA"`, código `GA010`) → **201**. Repetirlo → **409** código repetido.
   Con `"precio": -5` → **400** con `campos`.
4. `PUT /api/productos/GA010` cambiando el precio → 200.
5. `DELETE /api/productos/GA010` → **204**. **Logout** en Authorize y repetir → **401**. · *documentación de la API*

![Swagger productos](18-swagger-productos.jpg)
![Swagger usuarios](19-swagger-usuarios.jpg)

> "Cada microservicio documenta sus endpoints en Swagger, con el botón Authorize para
> probar con un token. Los candados marcan los que exigen sesión."

## 12. Cierre — 15 s

> "En resumen: React consume tres microservicios Spring Boot por REST, con JWT, roles
> validados en el backend y datos persistidos en MySQL. Los repositorios del frontend y
> del backend tienen las instrucciones para ejecutarlo, y la entrega incluye el manual de
> usuario y el documento de integración. Gracias."

## Después de grabar

- Subir el video (YouTube **no listado** o Drive con "cualquiera con el enlace") y
  **probar el enlace en una ventana de incógnito**.
- Volver a dejar la base limpia si se quiere repetir la toma (pedir el SQL a Claude).

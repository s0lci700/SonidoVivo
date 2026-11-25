# Documento de Integración Frontend–Backend — Sonido Vivo

**Proyecto Semestral · DSY1104 Desarrollo Full Stack II · Duoc UC**
Caso **Forma B — Tienda Sonido Vivo**

| | |
|---|---|
| Versión | **1.0** — etapa **Evaluación Parcial 3** |
| Fecha | 20 de noviembre de 2026 |
| Autora | Sol León |
| Sección | 005D |
| Repositorio | https://github.com/s0lci700/SonidoVivo |

> Este documento describe la integración **tal como está construida** en el
> repositorio: la arquitectura, los componentes, el flujo REST entre React y los
> microservicios, la seguridad con JWT y roles, la configuración y los pasos para
> ejecutar el sistema. Los detalles de cada endpoint también están en Swagger.

---

## 1. Propósito y alcance

En el Parcial 2 el frontend en React trabajaba con datos simulados (archivos JSON y
`localStorage`). En el Parcial 3 esos datos pasan a tres microservicios Spring Boot con
base de datos MySQL/MariaDB, y el frontend los consume por HTTP. Se agregan además el
inicio de sesión con JWT, la autorización por rol en el backend y las restricciones de
rutas y acciones por rol en React.

El documento cubre:

- La arquitectura y la responsabilidad de cada pieza (secciones 2 y 3).
- El modelo de datos de cada microservicio (sección 4).
- La API REST y el formato de errores (sección 5).
- La seguridad: JWT, roles, 401/403 y sesión en el navegador (secciones 6 y 7).
- Los flujos de datos completos entre React y el backend (sección 8).
- La configuración y los pasos para ejecutar (secciones 9 y 10).
- Las pruebas que respaldan lo anterior (sección 11).

## 2. Arquitectura general

```
             Navegador: React 19 + Vite (puerto 5173)
        services/api.js -> fetch + Authorization: Bearer <JWT>
          |                      |                      |
          v                      v                      v
   ms-usuarios :8082     ms-productos :8081     ms-pedidos :8083
   login y registro      catálogo, categorías   pedidos, estados
   EMITE el JWT          stock                  verifica el JWT
   gestión usuarios      verifica el JWT               |
          |                      ^                      |
          |                      |  REST con token      |
          |                      +-- SERVICIO ----------+
          |                      |  (descontar/reponer) |
          v                      v                      v
   sonidovivo_usuarios   sonidovivo_productos   sonidovivo_pedidos
          MySQL / MariaDB (XAMPP), puerto 3306
```

Decisiones principales:

- **Un microservicio por área del negocio** (usuarios, catálogo, pedidos), cada uno con su
  propia base de datos, su `pom.xml` y su puerto. No comparten tablas: cuando un pedido
  necesita un producto, `ms-pedidos` lo pide por REST a `ms-productos`.
- **Sin estado en el servidor.** Ningún microservicio guarda sesiones: cada solicitud trae
  su JWT y se verifica de nuevo (`SessionCreationPolicy.STATELESS`).
- **Un solo emisor de tokens.** Solo `ms-usuarios` firma tokens. Los otros dos los
  verifican con la misma clave secreta (`jwt.secret`).
- **Stack backend:** JDK 21, Spring Boot 4.1.2, Spring Data JPA, Bean Validation, Spring
  Security, jjwt 0.12.6, MariaDB Connector/J y springdoc-openapi 3.1.1 (Swagger).
- **Stack frontend:** React 19, React Router 7, Vite 8, Tailwind CSS 4, Vitest y React
  Testing Library.

## 3. Componentes

### 3.1 Backend: estructura común

Los tres microservicios siguen la misma organización en capas:

| Paquete | Responsabilidad |
|---|---|
| `model/` | Entidades JPA (tablas) y enumeraciones |
| `repository/` | Interfaces `JpaRepository` con consultas derivadas del nombre |
| `service/` | Reglas de negocio; lanza `ResponseStatusException` con el código HTTP |
| `controller/` | Endpoints REST, validación con `@Valid` y documentación Swagger |
| `controller/ApiErrores` | `@RestControllerAdvice`: todos los errores salen como `{"error": ...}` |
| `dto/` | Objetos de entrada (records) separados de las entidades |
| `security/` | `SecurityConfig` (reglas por rol, CORS, 401/403), `JwtFilter`, `JwtService` |
| `config/` | `OpenApiConfig` (botón Authorize en Swagger) y `DatosIniciales` |

### 3.2 Backend: clases por microservicio

| Microservicio | Clases principales | Qué hacen |
|---|---|---|
| ms-usuarios | `Usuario`, `Rol` | Cuenta con correo único, contraseña BCrypt, rol y estado activo |
| | `UsuarioService` | Login, registro, `/auth/me`, alta/edición/desactivación |
| | `AuthController` | `/auth/login`, `/auth/registro`, `/auth/me` |
| | `UsuarioController` | CRUD `/api/usuarios` (solo ADMINISTRADOR) |
| | `JwtService` | Crea el token (correo, rol, nombre, vencimiento) y lo verifica |
| ms-productos | `Producto`, `Categoria` | Catálogo de la planilla del caso (51 productos, 10 categorías) |
| | `ProductoService` | CRUD por código, cambio de stock, descontar y reponer |
| | `ProductoController` | `/api/productos`, `/api/categorias` |
| ms-pedidos | `Pedido`, `DetallePedido` | Pedido con sus líneas, estado y tipo de entrega |
| | `PedidoService` | Crear (con compensación), historial, cambio de estado |
| | `ProductoClient` | Cliente REST hacia `ms-productos` con token de rol SERVICIO |
| | `PedidoController` | `/api/pedidos` |

### 3.3 Frontend

| Archivo | Responsabilidad |
|---|---|
| `services/api.js` | **Único lugar que llama a `fetch`.** Agrega el token, convierte errores HTTP en `ErrorApi` y borra la sesión ante un 401 |
| `services/sesion.js` | Guarda, lee y borra la sesión en `sessionStorage`; descarta la sesión vencida |
| `services/authService.js` | Login, registro, cierre de sesión y validación con `/auth/me` tras F5 |
| `services/productoService.js` | Catálogo y CRUD; traduce la categoría del backend a la forma que usan las páginas |
| `services/pedidoService.js` | Crear pedido, historial del cliente, listado y cambio de estado |
| `services/usuarioService.js` | Gestión de usuarios para el administrador |
| `components/RutaProtegida.jsx` | Protege rutas por sesión y por rol; verifica con el backend tras F5 |
| `pages/` | Vistas: catálogo, carrito, checkout, login, registro, mis pedidos y paneles por rol |

Las páginas no llaman a `fetch` ni leen archivos de datos: siempre pasan por `services/`.
Por eso el cambio del Parcial 2 al Parcial 3 casi no tocó las páginas del catálogo y del
CRUD de productos: los servicios mantienen los mismos nombres de funciones.

## 4. Modelo de datos

Cada microservicio tiene su base. Las tablas las crea JPA desde las entidades
(`spring.jpa.hibernate.ddl-auto=update`). Las bases se crean solas al arrancar
(`createDatabaseIfNotExist=true`).

### 4.1 sonidovivo_productos

| Tabla | Columna | Tipo | Restricción |
|---|---|---|---|
| categoria | `id` | varchar(5) | PK (ej. `GA`) |
| | `nombre` | varchar(255) | NOT NULL, UNIQUE |
| producto | `id` | bigint | PK autoincremental |
| | `codigo` | varchar(10) | NOT NULL, UNIQUE (ej. `GA001`) |
| | `categoria_id` | varchar(5) | NOT NULL, FK → `categoria.id` |
| | `nombre`, `marca`, `modelo` | varchar(255) | NOT NULL |
| | `precio` | int | NOT NULL, mayor a 0 (CLP) |
| | `stock` | int | NOT NULL, 0 o más |
| | `descripcion` | varchar(500) | NOT NULL |

### 4.2 sonidovivo_usuarios

| Tabla | Columna | Tipo | Restricción |
|---|---|---|---|
| usuario | `id` | bigint | PK autoincremental |
| | `nombre` | varchar(255) | NOT NULL |
| | `correo` | varchar(255) | NOT NULL, UNIQUE |
| | `password` | varchar(255) | NOT NULL; hash BCrypt, nunca la contraseña |
| | `rol` | varchar(20) | `ADMINISTRADOR`, `VENDEDOR` o `CLIENTE` |
| | `activo` | bit(1) | Desactivar en vez de borrar |

### 4.3 sonidovivo_pedidos

| Tabla | Columna | Tipo | Restricción |
|---|---|---|---|
| pedido | `id` | bigint | PK autoincremental |
| | `correo_cliente` | varchar(255) | NOT NULL; se toma del JWT |
| | `nombre_cliente` | varchar(255) | NOT NULL |
| | `fecha` | datetime(6) | NOT NULL |
| | `estado` | varchar(20) | `EN_PREPARACION`, `DESPACHADO`, `ENTREGADO`, `CANCELADO` |
| | `entrega` | varchar(10) | `DESPACHO` o `RETIRO` |
| | `direccion` | varchar(255) | Solo para despacho |
| | `total` | int | NOT NULL; calculado en el servidor |
| detalle_pedido | `id` | bigint | PK autoincremental |
| | `pedido_id` | bigint | NOT NULL, FK → `pedido.id` |
| | `codigo_producto` | varchar(10) | NOT NULL |
| | `nombre_producto` | varchar(255) | NOT NULL; copia al momento de comprar |
| | `cantidad`, `precio_unitario`, `subtotal` | int | NOT NULL |

**Relaciones entre bases.** `pedido.correo_cliente` apunta a `usuario.correo` y
`detalle_pedido.codigo_producto` a `producto.codigo`, pero **sin clave foránea**, porque
están en bases distintas. La consistencia la cuida el código: el correo sale del token ya
verificado y el producto se consulta en `ms-productos` antes de guardar. El detalle copia
el nombre y el precio del producto para que el pedido conserve lo que se cobró aunque el
catálogo cambie después.

## 5. API REST

### 5.1 Endpoints

| Método | Ruta | Acceso | Respuesta |
|---|---|---|---|
| **ms-usuarios (8082)** | | | |
| POST | `/auth/login` | Público | 200 `{token, tipo, correo, nombre, rol, expiraEn}` · 401 |
| POST | `/auth/registro` | Público | 201 (siempre crea un CLIENTE) · 400 · 409 |
| GET | `/auth/me` | Con sesión | 200 `{correo, nombre, rol}` · 401 |
| GET, POST | `/api/usuarios` | ADMINISTRADOR | 200 · 201 · 409 |
| GET, PUT | `/api/usuarios/{id}` | ADMINISTRADOR | 200 · 404 · 409 |
| DELETE | `/api/usuarios/{id}` | ADMINISTRADOR | 200 (desactiva; no borra) |
| **ms-productos (8081)** | | | |
| GET | `/api/productos?categoria=GA` | Público | 200 |
| GET | `/api/productos/{codigo}` | Público | 200 · 404 |
| GET | `/api/categorias` | Público | 200 |
| POST | `/api/productos` | ADMINISTRADOR | 201 · 400 · 409 |
| PUT | `/api/productos/{codigo}` | ADMINISTRADOR | 200 · 400 · 404 · 409 |
| DELETE | `/api/productos/{codigo}` | ADMINISTRADOR | 204 · 404 |
| PATCH | `/api/productos/{codigo}/stock` | ADMINISTRADOR, VENDEDOR | 200 |
| POST | `/api/productos/{codigo}/descontar` | SERVICIO (ms-pedidos) | 200 · 409 sin stock |
| POST | `/api/productos/{codigo}/reponer` | SERVICIO (ms-pedidos) | 200 |
| **ms-pedidos (8083)** | | | |
| POST | `/api/pedidos` | Con sesión | 201 · 400 · 409 sin stock |
| GET | `/api/pedidos/mios` | Con sesión | 200 (historial propio) |
| GET | `/api/pedidos/{id}` | Con sesión | 200 · 403 si es de otro cliente |
| GET | `/api/pedidos?estado=` | ADMINISTRADOR, VENDEDOR | 200 |
| PATCH | `/api/pedidos/{id}/estado` | ADMINISTRADOR, VENDEDOR | 200 · 409 si ya terminó |

Swagger de cada microservicio: `http://localhost:<puerto>/swagger-ui.html`.

### 5.2 Ejemplos

Crear un producto (ADMINISTRADOR). La categoría se envía como objeto con su `id`:

```
POST http://localhost:8081/api/productos
Authorization: Bearer <token>
Content-Type: application/json

{ "codigo": "GA010", "categoria": { "id": "GA" }, "nombre": "Guitarra Clásica",
  "marca": "Yamaha", "modelo": "C40", "stock": 4, "precio": 99990,
  "descripcion": "Guitarra clásica de estudio con cuerdas de nylon." }
```

Crear un pedido (cualquier usuario con sesión). Solo se envían códigos y cantidades:

```
POST http://localhost:8083/api/pedidos
Authorization: Bearer <token>

{ "nombreCliente": "Cliente de Prueba", "entrega": "RETIRO",
  "items": [ { "codigo": "GA001", "cantidad": 2 },
             { "codigo": "PE001", "cantidad": 1 } ] }
```

### 5.3 Formato de errores

Todos los errores tienen la misma forma, para que React muestre el mensaje sin conocer
cada caso:

```
{ "error": "Datos inválidos", "campos": { "precio": "El precio no puede ser negativo" } }
{ "error": "Stock insuficiente de Guitarra Acústica Folk: quedan 6" }
{ "error": "No autenticado" }        <- 401
{ "error": "Sin permisos" }          <- 403
```

| Código | Cuándo |
|---|---|
| 400 | `@Valid` falló, JSON mal formado, o regla de negocio (ej. despacho sin dirección) |
| 401 | Falta el token, está vencido, fue alterado, o la cuenta fue desactivada |
| 403 | Token válido, pero el rol no tiene permiso |
| 404 | El recurso no existe |
| 409 | Código o correo repetido, stock insuficiente, pedido ya terminado |
| 503 | `ms-pedidos` no pudo conectarse con `ms-productos` |

## 6. Seguridad: JWT y roles

### 6.1 Flujo del token

**Paso 1.** React envía `POST /auth/login` con correo y contraseña a `ms-usuarios`.

**Paso 2.** `UsuarioService` busca el usuario activo y compara la contraseña con el hash
(`passwordEncoder.matches`). Si algo no calza responde **401 "Credenciales
incorrectas"**, con el mismo mensaje para un correo inexistente o una clave errónea, así
no se revela qué correos están registrados.

**Paso 3.** `JwtService` firma el token con HMAC-SHA y la clave `jwt.secret`. Contenido:
`sub` (correo), `rol`, `nombre`, `iat` y `exp` (60 minutos por defecto). Nunca la
contraseña.

**Paso 4.** React guarda el token y lo envía en cada solicitud: `Authorization: Bearer <token>`.

**Paso 5.** En cualquier microservicio, `JwtFilter` verifica la firma y el vencimiento. Si es
válido, registra al usuario con la autoridad `ROLE_<rol>`; si no, la solicitud sigue sin
autenticar.

**Paso 6.** `SecurityConfig` decide con las reglas de la sección 6.2: ruta pública, 401 o 403.

### 6.2 Permisos por rol

Roles del caso (§0.2): el **Administrador** gestiona todo el sistema, el **Vendedor**
actualiza stock y estado de pedidos sin gestionar usuarios, y el **Cliente** compra y ve
sus propios pedidos.

| Acción | Público | CLIENTE | VENDEDOR | ADMINISTRADOR |
|---|---|---|---|---|
| Ver catálogo y categorías | Sí | Sí | Sí | Sí |
| Registrarse | Sí | — | — | — |
| Crear pedido y ver los propios | No (401) | Sí | Sí | Sí |
| Ver todos los pedidos / cambiar estado | No (401) | No (403) | Sí | Sí |
| Cambiar stock | No (401) | No (403) | Sí | Sí |
| Crear, editar o eliminar productos | No (401) | No (403) | No (403) | Sí |
| Gestionar usuarios y roles | No (401) | No (403) | No (403) | Sí |

### 6.3 Comunicación entre microservicios

Para descontar o reponer stock, `ms-pedidos` no reenvía el token del cliente: firma un
token propio con rol **SERVICIO** y 1 minuto de vida (`JwtService.crearTokenServicio`).
`ms-productos` solo acepta `/descontar` y `/reponer` con ese rol. Así un cliente no puede
bajar el stock llamando directo a la API: solo puede hacerlo comprando (comprobado: un
CLIENTE que llama a `/descontar` recibe 403).

### 6.4 Otras medidas

- **Contraseñas con BCrypt**: hash lento y con sal aleatoria.
- **El rol no se recibe del cliente**: el registro público siempre crea un CLIENTE, y la
  entidad `Usuario` nunca se lee directo desde el JSON (se usan DTO).
- **Datos que no se aceptan del navegador**: el correo del pedido sale del token y los
  precios de `ms-productos`, no del cuerpo de la solicitud.
- **`/auth/me` consulta la base**: si el administrador desactiva una cuenta, su token
  deja de servir para restaurar la sesión aunque no haya vencido.
- **CORS** limitado al origen del frontend (`http://localhost:5173` por defecto).
- **CSRF desactivado** a propósito: la API usa tokens Bearer, no cookies.

## 7. Sesión en el frontend

| Pregunta | Respuesta |
|---|---|
| ¿Dónde se guarda? | `sessionStorage`, clave `sesion`: `{token, correo, nombre, rol, expiraEn}` |
| ¿Qué pasa con F5? | La sesión sigue en `sessionStorage`. `RutaProtegida` llama una vez a `GET /auth/me` y solo muestra la página si el servidor responde 200; el rol que vale es el que devuelve el servidor |
| ¿Y al cerrar la pestaña? | `sessionStorage` se borra: hay que iniciar sesión de nuevo |
| ¿Cómo se cierra la sesión? | Botón **Salir**: borra la sesión del navegador y vuelve al inicio |
| ¿Qué pasa si el token vence? | `sesion.js` la descarta al leerla (`expiraEn`); si el servidor responde 401, `api.js` la borra. En ambos casos se pide iniciar sesión otra vez |
| ¿Y si el backend está apagado? | No se da la sesión por válida: aparece "No pudimos verificar tu sesión" con el botón **Reintentar** |
| ¿403? | Se muestra "sin permisos" **sin** borrar la sesión |

Rutas de React por rol (`App.jsx`):

| Ruta | Acceso | Sin permiso |
|---|---|---|
| `/`, `/catalogo`, `/producto/:codigo`, `/carrito` | Público | — |
| `/checkout` | Público, pero pide iniciar sesión para confirmar | Muestra "Inicia sesión" |
| `/login`, `/registro` | Público | — |
| `/mis-pedidos` | Cualquier usuario con sesión | → `/login` |
| `/admin/pedidos` | ADMINISTRADOR, VENDEDOR | → `/sin-permiso` |
| `/admin`, `/admin/productos/**`, `/admin/usuarios/**` | ADMINISTRADOR | → `/sin-permiso` |

Después de iniciar sesión, cada rol llega a su página: Administrador a `/admin`, Vendedor
a `/admin/pedidos` y Cliente a `/mis-pedidos`. Si `RutaProtegida` lo había enviado al
login, vuelve a la página que intentaba abrir.

> Las restricciones de React solo ocultan pantallas y botones. La protección real está en
> el backend: aunque alguien escriba la URL o llame a la API a mano, recibe 401 o 403.

## 8. Flujos de datos

### 8.1 Ver el catálogo (público)

```
Catalogo.jsx -> productoService.obtenerProductos("GA")
  -> GET :8081/api/productos?categoria=GA          (sin token)
  <- 200 [{codigo, nombre, ..., categoria: {id, nombre}}]
productoService convierte categoria -> categoriaId + nombre de categoría
```

### 8.2 Iniciar sesión y recargar la página

```
Login.jsx -> authService.iniciarSesion(correo, clave)
  -> POST :8082/auth/login
  <- 200 {token, rol, nombre, expiraEn}
     (401 -> "Credenciales incorrectas")
  sesion.js guarda en sessionStorage -> navigate(ruta del rol)

F5 en /mis-pedidos
  RutaProtegida: hay sesión guardada -> "Verificando sesión..."
  -> GET :8082/auth/me   Authorization: Bearer <token>
  <- 200 {correo, nombre, rol}  -> muestra la página
  <- 401                        -> borra la sesión -> /login
  sin respuesta                 -> "Reintentar"
```

### 8.3 Comprar

```
Checkout.jsx -> pedidoService.crearPedido({nombreCliente, entrega, direccion, carrito})
  -> POST :8083/api/pedidos   Bearer <token del cliente>
     ms-pedidos, por cada producto:
       -> GET  :8081/api/productos/{codigo}       revisa stock, sin tocarlo
     si todo alcanza, por cada producto:
       -> POST :8081/api/productos/{codigo}/descontar
              Bearer <token SERVICIO>
       <- 200 {nombre, precio, stock}             el precio lo pone el servidor
     si un descuento falla a mitad de camino:
       -> POST .../reponer de lo ya descontado    (compensación) y responde 409
     guarda el pedido EN_PREPARACION con total calculado
  <- 201 {id, total, detalles, ...}
Checkout vacía el carrito -> /compra/exito con el número de pedido
```

### 8.4 Gestionar pedidos (Vendedor)

```
AdminPedidos.jsx -> GET :8083/api/pedidos?estado=...        (403 si es CLIENTE)
cambiar a DESPACHADO -> PATCH :8083/api/pedidos/{id}/estado
cambiar a CANCELADO  -> además ms-pedidos llama a /reponer por cada línea
ENTREGADO y CANCELADO son finales: otro cambio responde 409
```

### 8.5 CRUD de productos (Administrador)

```
AdminProductoForm.jsx -> crearProducto / actualizarProducto
  -> POST | PUT :8081/api/productos[/{codigo}]
     cuerpo con "categoria": {"id": "GA"}
  <- 201 | 200, o 400 con "campos", o 409 si el código ya existe
AdminProductos.jsx -> eliminarProducto
  -> DELETE :8081/api/productos/{codigo}   <- 204
```

## 9. Configuración

Los valores tienen un valor por defecto para desarrollo y se pueden cambiar con variables
de entorno, sin tocar el repositorio.

| Variable | Microservicio | Por defecto | Uso |
|---|---|---|---|
| `DB_PORT`, `DB_USER`, `DB_PASSWORD` | los tres | `3306`, `root`, vacío | Conexión a MySQL/MariaDB |
| `JWT_SECRET` | los tres (la misma) | clave de desarrollo | Firma y verificación del JWT (32+ caracteres) |
| `JWT_MINUTOS` | ms-usuarios | `60` | Duración del token |
| `FRONTEND_URL` | los tres | `http://localhost:5173` | Origen permitido por CORS |
| `PRODUCTOS_URL` | ms-pedidos | `http://localhost:8081` | Dirección de ms-productos |
| `VITE_API_PRODUCTOS`, `VITE_API_USUARIOS`, `VITE_API_PEDIDOS` | frontend (`.env`) | `http://localhost:8081` / `8082` / `8083` | URL de cada microservicio |

Notas de configuración:

- XAMPP trae MariaDB 10.4, y Hibernate 7 necesita 10.6 para crear claves foráneas y
  restricciones UNIQUE con su dialecto por defecto. Por eso se usa
  `MariaDBLegacyDialect` (`hibernate-community-dialects`).
- La clave `jwt.secret` que trae el repositorio es **solo para desarrollo**. En producción
  se define `JWT_SECRET` y no se publica.
- Las pruebas usan su propio `src/test/resources/application.properties` con una base H2
  en memoria: no necesitan XAMPP.

## 10. Pasos para ejecutar

**Requisitos:** JDK 21, Node.js (con npm), XAMPP con el módulo MySQL. Maven no hace falta:
cada microservicio trae Maven Wrapper (`mvnw.cmd`).

**Paso 1. Base de datos.** Abrir XAMPP e iniciar **MySQL** (puerto 3306, usuario `root` sin
clave). Las tres bases y sus tablas se crean solas.

**Paso 2. Microservicios.** Abrir una terminal PowerShell por microservicio, en cualquier
orden:

```
cd backend\ms-usuarios
.\mvnw.cmd -s ..\settings-google.xml spring-boot:run

cd backend\ms-productos
.\mvnw.cmd -s ..\settings-google.xml spring-boot:run

cd backend\ms-pedidos
.\mvnw.cmd -s ..\settings-google.xml spring-boot:run
```

La primera vez, `ms-productos` carga las 10 categorías y 51 productos del caso, y
`ms-usuarios` crea los usuarios de demostración. Si las tablas ya tienen datos, no se
tocan.

**Paso 3. Frontend.**

```
cd frontend
npm install
npm run dev
```

**Paso 4.** Abrir `http://localhost:5173`.

**Usuarios de demostración** (no usar en producción):

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@sonidovivo.cl` | `Admin123` | ADMINISTRADOR |
| `vendedor@sonidovivo.cl` | `Vendedor123` | VENDEDOR |
| `cliente@correo.cl` | `Cliente123` | CLIENTE |

**Probar la API en Swagger:**

- Abrir `http://localhost:8082/swagger-ui.html`, ejecutar `POST /auth/login` y copiar el
   `token` de la respuesta.
- Luego abrir el Swagger del microservicio que se quiera probar (8081 o 8083), presionar
   **Authorize** y pegar el token.
- Probar con el token de cada rol para ver las respuestas 200/201, 401 y 403.

## 11. Pruebas

### 11.1 Pruebas automatizadas

| Proyecto | Comando | Pruebas | Qué cubren |
|---|---|---|---|
| ms-productos | `.\mvnw.cmd test` | 11 | Catálogo público; 401 sin token, con token de otra clave y vencido; 403 por rol; 201/204 del administrador; 400 con errores por campo; stock del vendedor; descontar solo con rol SERVICIO; 409 sin stock |
| ms-usuarios | `.\mvnw.cmd test` | 10 | Login 200 y 401; `/auth/me` con y sin token; el registro ignora el rol enviado y no devuelve la contraseña; regla de contraseña; 403 del cliente; usuario desactivado ya no entra; cambio de rol |
| ms-pedidos | `.\mvnw.cmd test` | 10 | 401 sin token; precios del servidor; 409 sin stock sin descontar nada; compensación si falla un descuento; el cliente no ve pedidos ajenos (403); cancelar repone stock; estados finales (409) |
| frontend | `npm test` | 97 | Servicios contra un backend falso; sesión (guardar, vencer, validar tras F5, 401, sin conexión); `RutaProtegida` por rol; formularios de login, registro, checkout y usuarios |

En el backend las pruebas usan MockMvc con tokens firmados de verdad y una base H2. En
`ms-pedidos`, `ms-productos` se reemplaza por un simulacro (`@MockitoBean`). En el
frontend, `src/test/apiSimulada.js` reemplaza `fetch` y responde como los microservicios.

### 11.2 Pruebas de aceptación de extremo a extremo

Ejecutadas en un navegador (Chromium) contra los tres microservicios y MariaDB, siguiendo
las pruebas de aceptación del checklist de cierre técnico EP3:

| Prueba | Resultado |
|---|---|
| Catálogo cargado desde ms-productos | OK |
| `/admin` sin sesión redirige a `/login` y vuelve a la ruta pedida al entrar | OK |
| Cliente que abre `/admin` llega a `/sin-permiso` | OK |
| Compra: se crea el pedido y el stock baja en ms-productos | OK |
| F5 en `/mis-pedidos`: la sesión se recupera validada con `/auth/me` | OK |
| Logout y acceso directo a `/mis-pedidos`: vuelve a `/login` | OK |
| Vendedor cambia un pedido a Despachado | OK |
| Vendedor que abre `/admin/usuarios` llega a `/sin-permiso` | OK |
| Administrador crea un usuario y ese usuario puede entrar | OK |
| Contraseña incorrecta muestra "Credenciales incorrectas" | OK |
| Backend apagado + F5: "Reintentar"; al encenderlo, la sesión se recupera | OK |
| Datos siguen disponibles tras reiniciar el microservicio | OK |
| Sin token → 401; CLIENTE descontando stock → 403; stock insuficiente → 409 | OK |
| Cancelar un pedido devuelve el stock | OK |

## 12. Limitaciones y decisiones

| Tema | Decisión | Consecuencia |
|---|---|---|
| Almacenamiento de la sesión | `sessionStorage` | Sobrevive a F5, no a cerrar la pestaña. Es accesible desde JavaScript (riesgo ante XSS); en producción se evaluarían cookies `HttpOnly`/`Secure`/`SameSite` con CSRF |
| Vencimiento | Sin refresh token | Al vencer (60 min) se pide iniciar sesión otra vez |
| Logout | Solo borra el token del navegador | No revoca el token en el servidor: si alguien lo copió, sirve hasta su vencimiento. `/auth/me` sí rechaza cuentas desactivadas |
| Lectura de `exp` en React | Solo para no usar un token ya vencido | No valida la firma; eso lo hace el backend |
| Consistencia entre bases | Compensación en vez de transacción distribuida | Si falla un descuento se repone lo descontado; si además falla la reposición, queda registrado en el log para corregir a mano |
| Clave de desarrollo | Valor por defecto en `application.properties` | Debe reemplazarse con `JWT_SECRET` fuera del entorno local |
| Reportes de ventas | Pendiente | Se construirán sobre `GET /api/pedidos` en la siguiente etapa |

## Anexo: correspondencia con los indicadores EP3

| Indicador | Evidencia en este documento |
|---|---|
| IE3.1.1 Backend, base de datos y lógica de negocio | Secciones 2, 3.2, 4 y 8.3; pruebas 11.1 |
| IE3.2.1 CRUD REST y Swagger | Sección 5; Swagger en cada microservicio |
| IE3.2.2 React consume la API real | Secciones 3.3 y 8; errores HTTP en 5.3 |
| IE3.3.1 Login JWT y roles en el backend; 401 y 403 | Secciones 6.1 a 6.3 y 11 |
| IE3.3.2 Sesión persistente, expiración y logout | Sección 7 y 8.2 |
| IE3.3.3 Rutas y acciones restringidas por rol en React | Sección 7 (rutas por rol) y 11.2 |

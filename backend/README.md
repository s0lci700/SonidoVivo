# Backend Sonido Vivo

Tres microservicios Spring Boot independientes. Cada uno tiene su propio `pom.xml`, su
`application.properties` y su base de datos en MySQL.

| Microservicio | Puerto | Base de datos | Responsabilidad |
|---|---|---|---|
| `ms-productos` | 8081 | `sonidovivo_productos` | Catálogo, categorías y stock |
| `ms-usuarios` | 8082 | `sonidovivo_usuarios` | Registro, inicio de sesión y roles |
| `ms-pedidos` | 8083 | `sonidovivo_pedidos` | Pedidos y sus estados; descuenta stock en `ms-productos` |

Stack: JDK 21, Maven 3.10.0 (vía Maven Wrapper), Spring Boot 4.1.2, Spring Data JPA,
Validation, Spring Security, jjwt 0.12.6, MariaDB Connector/J y springdoc-openapi 3.1.1 (Swagger).

## Requisitos

- **JDK 21.** Comprobar con `java -version`. Si el equipo tiene otra versión por defecto,
  apuntar la terminal a JDK 21 antes de ejecutar:
  ```powershell
  $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
  $env:Path = "$env:JAVA_HOME\bin;$env:Path"
  ```
- **Maven 3.10.0.** No hace falta instalarlo: `mvnw.cmd` lo descarga la primera vez
  (`.\mvnw.cmd -v` debe mostrar Maven 3.10.0 y Java 21).
- **XAMPP con el módulo MySQL iniciado** (en XAMPP es MariaDB) en `localhost:3306`, usuario
  `root` sin clave. Si hay otro MySQL ocupando el 3306, detenerlo antes. Las bases se crean
  solas al arrancar (`createDatabaseIfNotExist=true`) y las tablas las crea JPA.
- Si el puerto, usuario o clave son otros, definirlos solo en la terminal (nunca en el repo):
  ```powershell
  $env:DB_PORT = "3306"; $env:DB_USER = "root"; $env:DB_PASSWORD = ""
  ```

## Ejecutar un microservicio

Desde la carpeta del microservicio, en PowerShell:

```powershell
.\mvnw.cmd -s ..\settings-google.xml spring-boot:run
```

`settings-google.xml` usa el espejo de Maven Central de Google (material del curso, S13)
para evitar el error HTTP 429 al descargar dependencias. Si en cambio aparece
`Could not transfer artifact ... .tmp -> ... .jar` (el archivo ya está descargado y VS Code lo
tiene abierto), ejecutar sin `-s ..\settings-google.xml`.

Las entidades usan **Lombok** (`@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`)
para no escribir getters, setters ni constructores. No se usa `@Data` en entidades JPA porque
genera `equals`, `hashCode` y `toString` con todos los campos, lo que falla con relaciones.

Swagger queda en `http://localhost:<puerto>/swagger-ui.html`.

## Estructura de cada microservicio

```
src/main/java/cl/sonidovivo/<servicio>/
├── model/        entidades JPA
├── repository/   interfaces JpaRepository
├── service/      reglas de negocio
└── controller/   endpoints REST (/api/...)
```

## Seguridad: JWT y roles

`ms-usuarios` es el único que **emite** tokens (`POST /auth/login`). `ms-productos` y
`ms-pedidos` solo los **verifican** con la misma clave (`jwt.secret`). El token lleva
`sub` (correo), `rol`, `nombre` y `exp` (60 minutos por defecto; no hay refresh token).

- La clave por defecto está en `application.properties` y es **solo para desarrollo**. Para
  cambiarla, definir la misma `JWT_SECRET` (32+ caracteres) en la terminal de los tres:
  `$env:JWT_SECRET = "..."`.
- Sin token o con token vencido/alterado: **401**. Con token válido pero rol insuficiente: **403**.
- En Swagger: hacer `POST /auth/login` en `http://localhost:8082/swagger-ui.html`, copiar el
  `token`, y pegarlo en el botón **Authorize** del microservicio que se quiera probar.
- `ms-pedidos` llama a `ms-productos` con un token propio de rol `SERVICIO` (1 minuto). Así un
  cliente no puede descontar stock directamente: solo comprando.

### Usuarios de demostración (se crean si la tabla está vacía)

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@sonidovivo.cl` | `Admin123` | ADMINISTRADOR |
| `vendedor@sonidovivo.cl` | `Vendedor123` | VENDEDOR |
| `cliente@correo.cl` | `Cliente123` | CLIENTE |

`ms-productos` carga también las 10 categorías y 51 productos de la planilla del caso la
primera vez (`src/main/resources/datos/`). Si la base ya tiene datos, no toca nada.

## Endpoints

| Método | Ruta | Quién | Notas |
|---|---|---|---|
| **ms-usuarios (8082)** | | | |
| POST | `/auth/login` | público | `{correo, password}` → `{token, rol, nombre, expiraEn}` |
| POST | `/auth/registro` | público | Siempre crea un CLIENTE |
| GET | `/auth/me` | con sesión | React lo llama tras F5; 401 si la cuenta fue desactivada |
| GET/POST | `/api/usuarios` | ADMINISTRADOR | |
| GET/PUT/DELETE | `/api/usuarios/{id}` | ADMINISTRADOR | DELETE desactiva; PUT con `password` vacía no la cambia |
| **ms-productos (8081)** | | | |
| GET | `/api/productos?categoria=GA` | público | |
| GET | `/api/productos/{codigo}` | público | |
| GET | `/api/categorias` | público | |
| POST | `/api/productos` | ADMINISTRADOR | `ProductoRequest`: `"categoriaId": "GA"` |
| PUT/DELETE | `/api/productos/{codigo}` | ADMINISTRADOR | |
| PATCH | `/api/productos/{codigo}/stock` | ADMINISTRADOR, VENDEDOR | `{cantidad}` = stock nuevo |
| POST | `/api/productos/{codigo}/descontar` · `/reponer` | SERVICIO | Solo ms-pedidos |
| **ms-pedidos (8083)** | | | |
| POST | `/api/pedidos` | con sesión | Precios y correo los pone el servidor; 409 sin stock |
| GET | `/api/pedidos/mios` | con sesión | Historial propio |
| GET | `/api/pedidos/{id}` | con sesión | Un CLIENTE solo ve los suyos (403) |
| GET | `/api/pedidos?estado=` | ADMINISTRADOR, VENDEDOR | |
| PATCH | `/api/pedidos/{id}/estado` | ADMINISTRADOR, VENDEDOR | CANCELADO repone el stock |

Errores: siempre `{"error": "mensaje"}`; con `@Valid` además `"campos": {"precio": "..."}`.

## Pruebas

```powershell
.\mvnw.cmd -s ..\settings-google.xml test
```

Usan una base H2 en memoria (`src/test/resources/application.properties`), así que no
necesitan XAMPP. Prueban 200/201/401/403/409 con tokens firmados de verdad. En `ms-pedidos`,
`ms-productos` se reemplaza por un simulacro (`@MockitoBean`).

Orden para levantar todo: XAMPP (MySQL) → los tres microservicios (cualquier orden) →
`npm run dev` en `frontend/`.

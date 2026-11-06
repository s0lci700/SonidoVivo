# Backend Sonido Vivo

Tres microservicios Spring Boot independientes. Cada uno tiene su propio `pom.xml`, su
`application.properties` y su base de datos en MySQL.

| Microservicio | Puerto | Base de datos | Responsabilidad |
|---|---|---|---|
| `ms-productos` | 8081 | `sonidovivo_productos` | Catálogo, categorías y stock |
| `ms-usuarios` | 8082 | `sonidovivo_usuarios` | Registro, inicio de sesión y roles |
| `ms-pedidos` | 8083 | `sonidovivo_pedidos` | Pedidos y sus estados; descuenta stock en `ms-productos` |

Stack: JDK 21, Maven 3.10.0 (vía Maven Wrapper), Spring Boot 4.1.2, Spring Data JPA,
Validation, MariaDB Connector/J y springdoc-openapi 3.1.1 (Swagger).

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
para evitar el error HTTP 429 al descargar dependencias.

Swagger queda en `http://localhost:<puerto>/swagger-ui.html`.

## Estructura de cada microservicio

```
src/main/java/cl/sonidovivo/<servicio>/
├── model/        entidades JPA
├── repository/   interfaces JpaRepository
├── service/      reglas de negocio
└── controller/   endpoints REST (/api/...)
```

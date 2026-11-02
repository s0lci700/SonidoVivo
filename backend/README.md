# Backend Sonido Vivo

Tres microservicios Spring Boot independientes. Cada uno tiene su propio `pom.xml`, su
`application.properties` y su base de datos en MySQL.

| Microservicio | Puerto | Base de datos | Responsabilidad |
|---|---|---|---|
| `ms-productos` | 8081 | `sonidovivo_productos` | Catálogo, categorías y stock |
| `ms-usuarios` | 8082 | `sonidovivo_usuarios` | Registro, inicio de sesión y roles |
| `ms-pedidos` | 8083 | `sonidovivo_pedidos` | Pedidos y sus estados; descuenta stock en `ms-productos` |

Stack: Java 21, Spring Boot 4.1.2, Spring Data JPA, Validation, MySQL Connector/J y
springdoc-openapi 3.1.1 (Swagger).

## Requisitos

- JDK 21 o superior (`java -version`).
- MySQL corriendo en `localhost:3306`, usuario `root` sin clave (XAMPP por defecto).
  Las bases se crean solas al arrancar (`createDatabaseIfNotExist=true`).
- Internet la primera vez, para que Maven Wrapper descargue Maven y las dependencias.

## Ejecutar un microservicio

Desde la carpeta del microservicio, en PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

Swagger queda en `http://localhost:<puerto>/swagger-ui.html`.

## Estructura de cada microservicio

```
src/main/java/cl/sonidovivo/<servicio>/
├── model/        entidades JPA
├── repository/   interfaces JpaRepository
├── service/      reglas de negocio
└── controller/   endpoints REST (/api/...)
```

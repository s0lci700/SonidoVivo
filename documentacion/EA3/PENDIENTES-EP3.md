# Pendientes EP3

Entrega: **viernes 27/11/2026** (AVA). Defensa individual: **miércoles 02/12/2026** (60% de la EP3).
Instrucciones y rúbrica: `documentacion/EA3/Instrucciones EP3 (40%)/`.

## Estado al 25/11

- `main` integra el ms-productos con DTOs (de `s14-crud-jwt`) y, desde `ccr-22852d66-4814nx`,
  ms-usuarios, ms-pedidos, el frontend con JWT/rutas por rol y la seguridad de ms-productos.
- Pruebas: ms-productos 11, ms-usuarios 10, ms-pedidos 10, frontend 97 — todas pasan.
- Probado de punta a punta con XAMPP (MariaDB 10.4): catálogo, login, CRUD, roles (401/403),
  pedido que descuenta stock, cancelación que lo repone, Swagger y la interfaz en el navegador.

## Pendiente (obligatorio)

- [ ] **Actualizar `documentacion/integracion-EP3.md`** a lo que hay en `main` y regenerar
      `.docx` y `.pdf` (`documentacion/md-a-docx.py`). Hoy describe el modelo de `ccr`:
  - `ProductoRequest`/`ProductoResponse` con `categoriaId` + `categoria` plano
    (no `"categoria": {"id": "GA"}`, líneas ~221, ~354 y ~407).
  - `exception/ManejadorErrores` (no `controller/ApiErrores`, línea ~85), forma `{error, campos}`.
  - CORS dentro de `SecurityConfig` (ya no existe `CorsConfig`).
  - Endpoints de stock: `PATCH /{codigo}/stock`, `POST /{codigo}/descontar`, `POST /{codigo}/reponer`.
- [ ] **Dos repos GitHub públicos**: uno para `frontend/` y otro para `backend/`
      (p. ej. `git subtree split --prefix=frontend` / `--prefix=backend` para conservar historial),
      cada uno con su README de ejecución.
- [ ] **ZIP de cada proyecto** (sin `node_modules/` ni `target/`).
- [ ] **Video demostrativo** (sin video, la defensa queda limitada al 60% por indicador). Mostrar:
  integración React–Spring Boot, CRUD, persistencia en MySQL/XAMPP, login JWT,
  sesión que sobrevive a F5, restricciones por rol (cliente vs. vendedor vs. admin) y Swagger.
- [ ] **Registrar en AVA** los 5 artefactos y los integrantes.

## Preparación de la defensa

- [ ] Repasar el commit `71e3c23` (cómo se adaptó ms-productos con DTOs a JWT, código en URL y stock).
- [ ] Repasar el código que vino de `ccr` (`fa73ea1`): `JwtFilter`, `JwtService`, `SecurityConfig`,
      `AuthController` (ms-usuarios), `ProductoClient` (ms-pedidos), `sesion.js`, `RutaProtegida`, `api.js`.
- [ ] Comparar con DoggySpa S14/S15 (`documentacion/EA3/…zip`): mismo patrón que enseñó el profesor.

## Opcional

- [ ] Borrar del remoto los branches `s14-crud-jwt` y `ccr-22852d66-4814nx` (todo su contenido útil está en `main`).
- [ ] `CategoriaService`, `CategoriaRequest` y `CategoriaResponse` no se usan (`CategoriaController`
      lee el repositorio directo): usarlos o eliminarlos.
- [ ] En `sonidovivo_pedidos` quedó el pedido de prueba id 1 (CANCELADO); se puede borrar antes de grabar.

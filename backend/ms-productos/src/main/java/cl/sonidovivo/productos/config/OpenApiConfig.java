package cl.sonidovivo.productos.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

// Agrega el botón "Authorize" a Swagger: se pega el token de POST /auth/login (ms-usuarios)
// y Swagger lo envía como "Authorization: Bearer <token>".
@Configuration
@OpenAPIDefinition(info = @Info(title = "Sonido Vivo - ms-productos", version = "1.0",
        description = "Catálogo, categorías y stock"))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {
}

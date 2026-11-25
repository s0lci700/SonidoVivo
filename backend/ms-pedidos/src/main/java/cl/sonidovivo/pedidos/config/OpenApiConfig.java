package cl.sonidovivo.pedidos.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

// Agrega el botón "Authorize" a Swagger: se pega el token de POST /auth/login (ms-usuarios)
// y Swagger lo envía como "Authorization: Bearer <token>".
@Configuration
@OpenAPIDefinition(info = @Info(title = "Sonido Vivo - ms-pedidos", version = "1.0",
        description = "Pedidos de la tienda online y sus estados"))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {
}

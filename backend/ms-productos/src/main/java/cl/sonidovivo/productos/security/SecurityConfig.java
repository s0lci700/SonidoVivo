package cl.sonidovivo.productos.security;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.DispatcherType;

// Reglas de acceso de ms-productos. Roles del caso (§0.2):
//   ADMINISTRADOR: acceso total.  VENDEDOR: actualiza stock.  CLIENTE: solo mira el catálogo.
//   SERVICIO: no es una persona; es ms-pedidos descontando o reponiendo stock.
@Configuration
public class SecurityConfig {

    @Value("${cors.origen}")
    private String origenFrontend;

    @Bean
    public SecurityFilterChain filtros(HttpSecurity http, JwtService jwtService) throws Exception {
        return http
                // API REST con token Bearer, sin cookies: no hay CSRF que proteger.
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                // STATELESS: el servidor no guarda sesión; cada solicitud trae su JWT.
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .dispatcherTypeMatchers(DispatcherType.ERROR, DispatcherType.FORWARD).permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/error").permitAll()
                        // Catálogo público
                        .requestMatchers(HttpMethod.GET, "/api/productos/**", "/api/categorias/**").permitAll()
                        // Stock
                        .requestMatchers(HttpMethod.PATCH, "/api/productos/*/stock").hasAnyRole("ADMINISTRADOR", "VENDEDOR")
                        .requestMatchers(HttpMethod.POST, "/api/productos/*/descontar", "/api/productos/*/reponer").hasRole("SERVICIO")
                        // Crear, editar y eliminar productos
                        .requestMatchers("/api/**").hasRole("ADMINISTRADOR")
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) -> responderError(res, 401, "No autenticado"))
                        .accessDeniedHandler((req, res, ex) -> responderError(res, 403, "Sin permisos")))
                .addFilterBefore(new JwtFilter(jwtService), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // Permite que React (localhost:5173) llame a esta API desde el navegador.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(origenFrontend));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private static void responderError(jakarta.servlet.http.HttpServletResponse res, int estado, String mensaje)
            throws java.io.IOException {
        res.setStatus(estado);
        res.setCharacterEncoding(StandardCharsets.UTF_8.name());
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.getWriter().write("{\"error\":\"" + mensaje + "\"}");
    }
}

package cl.sonidovivo.usuarios.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Lee "Authorization: Bearer <token>" en cada solicitud. Si el token es válido,
// deja autenticado al usuario con su rol (ROLE_ADMINISTRADOR, ROLE_VENDEDOR...).
// Si no hay token o no es válido, no autentica: SecurityConfig decide si la ruta
// era pública o si responde 401.
// No es @Component a propósito: así Spring Boot no lo registra dos veces
// (una como filtro del servidor y otra dentro de Spring Security).
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.validar(header.substring(7));
                String rol = claims.get("rol", String.class);
                var autenticacion = new UsernamePasswordAuthenticationToken(
                        claims.getSubject(), null, List.of(new SimpleGrantedAuthority("ROLE_" + rol)));
                SecurityContextHolder.getContext().setAuthentication(autenticacion);
            } catch (JwtException | IllegalArgumentException e) {
                // Token vencido, alterado o mal formado: se sigue sin autenticar.
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}

package cl.sonidovivo.usuarios.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import cl.sonidovivo.usuarios.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// ms-usuarios es el único que EMITE tokens. ms-productos y ms-pedidos solo los verifican
// con la misma clave (jwt.secret).
@Service
public class JwtService {

    private final SecretKey clave;
    private final long duracionMs;

    public JwtService(@Value("${jwt.secret}") String secreto,
            @Value("${jwt.expiracion-minutos}") long minutos) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.duracionMs = minutos * 60_000;
    }

    // Contenido del token: sub = correo, rol y nombre. Nunca la contraseña.
    public String crear(Usuario usuario, Date vence) {
        return Jwts.builder()
                .subject(usuario.getCorreo())
                .claim("rol", usuario.getRol().name())
                .claim("nombre", usuario.getNombre())
                .issuedAt(new Date())
                .expiration(vence)
                .signWith(clave)
                .compact();
    }

    public Date calcularVencimiento() {
        return new Date(System.currentTimeMillis() + duracionMs);
    }

    // Verifica firma y vencimiento. Si algo falla lanza JwtException.
    public Claims validar(String token) {
        return Jwts.parser().verifyWith(clave).build().parseSignedClaims(token).getPayload();
    }
}

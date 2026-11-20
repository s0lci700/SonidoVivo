package cl.sonidovivo.pedidos.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey clave;

    public JwtService(@Value("${jwt.secret}") String secreto) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
    }

    // Verifica los tokens de usuario que emite ms-usuarios.
    public Claims validar(String token) {
        return Jwts.parser().verifyWith(clave).build().parseSignedClaims(token).getPayload();
    }

    // Token propio de ms-pedidos, con rol SERVICIO y 1 minuto de vida, para llamar a
    // /descontar y /reponer de ms-productos. Así un CLIENTE no puede descontar stock
    // directamente: solo puede hacerlo creando un pedido.
    public String crearTokenServicio() {
        return Jwts.builder()
                .subject("ms-pedidos")
                .claim("rol", "SERVICIO")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(clave)
                .compact();
    }
}

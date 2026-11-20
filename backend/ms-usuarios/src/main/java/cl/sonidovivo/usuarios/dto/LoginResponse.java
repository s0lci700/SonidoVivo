package cl.sonidovivo.usuarios.dto;

// Respuesta de POST /auth/login. "expiraEn" es la fecha de vencimiento del token
// en milisegundos (la misma que viene dentro del JWT como "exp").
public record LoginResponse(String token, String tipo, String correo, String nombre, String rol, long expiraEn) {
}

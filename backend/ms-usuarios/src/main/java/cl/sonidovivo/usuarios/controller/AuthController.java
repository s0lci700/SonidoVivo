package cl.sonidovivo.usuarios.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.usuarios.dto.LoginRequest;
import cl.sonidovivo.usuarios.dto.LoginResponse;
import cl.sonidovivo.usuarios.dto.RegistroRequest;
import cl.sonidovivo.usuarios.model.Usuario;
import cl.sonidovivo.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticación", description = "Inicio de sesión, registro y verificación del token")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Operation(summary = "Iniciar sesión", description = "Público. Devuelve el JWT que se envía después como Authorization: Bearer <token>")
    @ApiResponse(responseCode = "200", description = "Token emitido")
    @ApiResponse(responseCode = "401", description = "Credenciales incorrectas o cuenta desactivada")
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest datos) {
        log.info("POST /auth/login {}", datos.correo()); // nunca se registra la contraseña
        return usuarioService.login(datos);
    }

    @Operation(summary = "Registrarse como cliente", description = "Público. Siempre crea el rol CLIENTE")
    @ApiResponse(responseCode = "201", description = "Cuenta creada")
    @ApiResponse(responseCode = "409", description = "El correo ya está registrado")
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@Valid @RequestBody RegistroRequest datos) {
        log.info("POST /auth/registro {}", datos.correo());
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.registrar(datos));
    }

    // React lo llama al recargar la página (F5) para confirmar que el token guardado
    // sigue siendo válido. Solo responde si JwtFilter ya verificó firma y vencimiento.
    @Operation(summary = "Usuario de la sesión actual", description = "Requiere token. 401 si falta, venció o la cuenta fue desactivada")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public Map<String, String> me(Authentication authentication) {
        Usuario usuario = usuarioService.usuarioActual(authentication.getName());
        return Map.of("correo", usuario.getCorreo(), "nombre", usuario.getNombre(), "rol", usuario.getRol().name());
    }
}

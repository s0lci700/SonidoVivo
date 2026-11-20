package cl.sonidovivo.usuarios.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.usuarios.dto.LoginRequest;
import cl.sonidovivo.usuarios.dto.LoginResponse;
import cl.sonidovivo.usuarios.dto.RegistroRequest;
import cl.sonidovivo.usuarios.dto.UsuarioRequest;
import cl.sonidovivo.usuarios.model.Rol;
import cl.sonidovivo.usuarios.model.Usuario;
import cl.sonidovivo.usuarios.repository.UsuarioRepository;
import cl.sonidovivo.usuarios.security.JwtService;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // ---------- Autenticación ----------

    public LoginResponse login(LoginRequest datos) {
        Usuario usuario = usuarioRepository.findByCorreo(normalizar(datos.correo()))
                .filter(Usuario::isActivo)
                // matches compara la contraseña escrita con el hash BCrypt guardado.
                .filter(u -> passwordEncoder.matches(datos.password(), u.getPassword()))
                // Mismo mensaje si no existe, está desactivado o la clave es incorrecta:
                // así no se revela qué correos están registrados.
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));
        Date vence = jwtService.calcularVencimiento();
        return new LoginResponse(jwtService.crear(usuario, vence), "Bearer", usuario.getCorreo(),
                usuario.getNombre(), usuario.getRol().name(), vence.getTime());
    }

    // GET /auth/me: el token ya fue verificado por JwtFilter; además se comprueba
    // que el usuario siga existiendo y activo, y se devuelve su rol ACTUAL de la base.
    public Usuario usuarioActual(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .filter(Usuario::isActivo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La sesión ya no es válida"));
    }

    public Usuario registrar(RegistroRequest datos) {
        String correo = normalizar(datos.correo());
        if (usuarioRepository.existsByCorreo(correo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo");
        }
        Usuario nuevo = new Usuario(null, datos.nombre().trim(), correo,
                passwordEncoder.encode(datos.password()), Rol.CLIENTE, true);
        return usuarioRepository.save(nuevo);
    }

    // ---------- Gestión de usuarios (solo ADMINISTRADOR) ----------

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario " + id + " no existe"));
    }

    public Usuario crear(UsuarioRequest datos) {
        String correo = normalizar(datos.correo());
        if (usuarioRepository.existsByCorreo(correo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo");
        }
        if (datos.password() == null || datos.password().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria");
        }
        Usuario nuevo = new Usuario(null, datos.nombre().trim(), correo,
                passwordEncoder.encode(datos.password()), datos.rol(),
                datos.activo() == null || datos.activo());
        return usuarioRepository.save(nuevo);
    }

    public Usuario actualizar(Long id, UsuarioRequest datos) {
        Usuario actual = buscar(id);
        String correo = normalizar(datos.correo());
        if (usuarioRepository.existsByCorreoAndIdNot(correo, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe otra cuenta con ese correo");
        }
        actual.setNombre(datos.nombre().trim());
        actual.setCorreo(correo);
        actual.setRol(datos.rol());
        if (datos.activo() != null) {
            actual.setActivo(datos.activo());
        }
        if (datos.password() != null && !datos.password().isBlank()) {
            actual.setPassword(passwordEncoder.encode(datos.password()));
        }
        return usuarioRepository.save(actual);
    }

    // DELETE desactiva: el usuario ya no puede iniciar sesión y /auth/me lo rechaza.
    public Usuario desactivar(Long id, String correoQuienPide) {
        Usuario actual = buscar(id);
        if (actual.getCorreo().equals(correoQuienPide)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puedes desactivar tu propia cuenta");
        }
        actual.setActivo(false);
        return usuarioRepository.save(actual);
    }

    private static String normalizar(String correo) {
        return correo.trim().toLowerCase();
    }
}

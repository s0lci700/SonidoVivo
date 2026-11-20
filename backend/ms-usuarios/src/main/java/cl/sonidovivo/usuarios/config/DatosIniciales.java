package cl.sonidovivo.usuarios.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import cl.sonidovivo.usuarios.model.Rol;
import cl.sonidovivo.usuarios.model.Usuario;
import cl.sonidovivo.usuarios.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;

// Usuarios de demostración, uno por rol (los mismos del Parcial 2, ahora con BCrypt).
// Solo se crean si la tabla está vacía. No usar estas claves en producción.
@Slf4j
@Component
public class DatosIniciales implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DatosIniciales(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }
        crear("Administrador Sonido Vivo", "admin@sonidovivo.cl", "Admin123", Rol.ADMINISTRADOR);
        crear("Vendedor Sonido Vivo", "vendedor@sonidovivo.cl", "Vendedor123", Rol.VENDEDOR);
        crear("Cliente de Prueba", "cliente@correo.cl", "Cliente123", Rol.CLIENTE);
        log.info("Datos iniciales: 3 usuarios de demostración creados");
    }

    private void crear(String nombre, String correo, String password, Rol rol) {
        usuarioRepository.save(new Usuario(null, nombre, correo, passwordEncoder.encode(password), rol, true));
    }
}

package cl.sonidovivo.usuarios.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.usuarios.dto.UsuarioRequest;
import cl.sonidovivo.usuarios.model.Usuario;
import cl.sonidovivo.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

// Todo /api/usuarios es solo para ADMINISTRADOR (ver SecurityConfig).
@Slf4j
@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Gestión de usuarios y roles (solo ADMINISTRADOR)")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Operation(summary = "Listar usuarios")
    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    @Operation(summary = "Buscar usuario por id")
    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id) {
        return usuarioService.buscar(id);
    }

    @Operation(summary = "Crear usuario con cualquier rol")
    @PostMapping
    public ResponseEntity<Usuario> crear(@Valid @RequestBody UsuarioRequest datos) {
        log.info("POST /api/usuarios {} ({})", datos.correo(), datos.rol());
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(datos));
    }

    @Operation(summary = "Editar usuario, asignar rol o reactivar", description = "password vacía = no cambiarla")
    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequest datos) {
        log.info("PUT /api/usuarios/{}", id);
        return usuarioService.actualizar(id, datos);
    }

    @Operation(summary = "Desactivar usuario", description = "No lo borra: deja de poder iniciar sesión")
    @DeleteMapping("/{id}")
    public Usuario desactivar(@PathVariable Long id, Authentication authentication) {
        log.info("DELETE /api/usuarios/{}", id);
        return usuarioService.desactivar(id, authentication.getName());
    }
}

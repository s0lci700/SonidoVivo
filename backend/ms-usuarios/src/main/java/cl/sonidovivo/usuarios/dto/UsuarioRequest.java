package cl.sonidovivo.usuarios.dto;

import cl.sonidovivo.usuarios.model.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Lo usa el ADMINISTRADOR para crear o editar usuarios (RF-58).
// Al editar, "password" puede venir vacía: significa "no cambiarla".
public record UsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        String nombre,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido")
        String correo,

        @Pattern(regexp = "^$|^(?=.*\\p{Lu}).{6,}$", message = "La contraseña debe tener al menos 6 caracteres y una mayúscula")
        String password,

        @NotNull(message = "El rol es obligatorio")
        Rol rol,

        Boolean activo) {
}

package cl.sonidovivo.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Registro público (RF-36): siempre crea un CLIENTE; el rol no se recibe.
public record RegistroRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        String nombre,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido")
        String correo,

        // Misma regla que validarPassword() del frontend: 6+ caracteres y una mayúscula.
        @NotBlank(message = "La contraseña es obligatoria")
        @Pattern(regexp = "^(?=.*\\p{Lu}).{6,}$", message = "La contraseña debe tener al menos 6 caracteres y una mayúscula")
        String password) {
}

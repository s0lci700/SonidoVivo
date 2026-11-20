package cl.sonidovivo.usuarios.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Las validaciones de entrada están en los DTO (dto/*Request): esta entidad
// nunca se recibe directo desde el JSON, para que nadie pueda enviar su propio rol.
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String correo;

    // Se guarda el hash BCrypt, nunca la contraseña. @JsonIgnore: no sale en las respuestas.
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    // "Desactivar" en vez de borrar (caso §0.1): el historial de pedidos sigue apuntando al correo.
    @Column(nullable = false)
    private boolean activo = true;
}

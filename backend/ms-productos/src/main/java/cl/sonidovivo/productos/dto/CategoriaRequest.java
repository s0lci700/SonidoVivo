package cl.sonidovivo.productos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Lo que el cliente ENVÍA para crear o editar una categoría.
// El id es el código corto de la categoría ("GA", "BT"), así que lo elige quien la crea.
public record CategoriaRequest(

        @NotBlank(message = "El id es obligatorio")
        @Size(max = 5, message = "El id tiene maximo 5 caracteres")
        String id,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre) {
}

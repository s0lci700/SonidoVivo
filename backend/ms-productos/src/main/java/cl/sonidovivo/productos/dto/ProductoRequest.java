package cl.sonidovivo.productos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// Lo que el cliente ENVÍA para crear o editar un producto.
// No trae id (lo asigna la base de datos) y la categoría llega como su id ("GA").
public record ProductoRequest(

        @NotBlank(message = "El codigo es obligatorio")
        @Size(max = 10, message = "El codigo tiene maximo 10 caracteres")
        String codigo,

        @NotBlank(message = "La categoria es obligatoria")
        String categoriaId,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "La marca es obligatoria")
        String marca,

        @NotBlank(message = "El modelo es obligatorio")
        String modelo,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock,

        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor a 0")
        Integer precio,

        @NotBlank(message = "La descripcion es obligatoria")
        @Size(max = 500, message = "La descripcion tiene maximo 500 caracteres")
        String descripcion) {
}

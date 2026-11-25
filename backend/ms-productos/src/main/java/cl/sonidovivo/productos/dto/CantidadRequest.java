package cl.sonidovivo.productos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// Cuerpo de PATCH /stock (stock nuevo) y de POST /descontar y /reponer (unidades).
public record CantidadRequest(
        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 0, message = "La cantidad no puede ser negativa")
        Integer cantidad) {
}

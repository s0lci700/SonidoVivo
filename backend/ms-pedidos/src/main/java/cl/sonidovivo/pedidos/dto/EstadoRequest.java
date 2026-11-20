package cl.sonidovivo.pedidos.dto;

import cl.sonidovivo.pedidos.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;

public record EstadoRequest(@NotNull(message = "El estado es obligatorio") EstadoPedido estado) {
}

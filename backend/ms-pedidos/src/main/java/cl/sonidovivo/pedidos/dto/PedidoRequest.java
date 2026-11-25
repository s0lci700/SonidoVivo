package cl.sonidovivo.pedidos.dto;

import java.util.List;

import cl.sonidovivo.pedidos.model.TipoEntrega;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

// Lo que envía el Checkout de React. Solo códigos y cantidades: los precios
// los pone el servidor, para que nadie pueda comprar a un precio inventado.
public record PedidoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombreCliente,

        @NotNull(message = "Elige despacho o retiro")
        TipoEntrega entrega,

        String direccion,

        @NotEmpty(message = "El pedido debe tener al menos un producto")
        List<@Valid Item> items) {

    public record Item(
            @NotBlank(message = "El código del producto es obligatorio")
            String codigo,

            @NotNull(message = "La cantidad es obligatoria")
            @Min(value = 1, message = "La cantidad mínima es 1")
            Integer cantidad) {
    }
}

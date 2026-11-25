package cl.sonidovivo.pedidos.model;

// Estados del caso (§0.1): en preparación, despachado, entregado. CANCELADO devuelve el stock.
public enum EstadoPedido {
    EN_PREPARACION,
    DESPACHADO,
    ENTREGADO,
    CANCELADO
}

package cl.sonidovivo.usuarios.model;

// Los tres roles mínimos del caso (§0.2).
public enum Rol {
    ADMINISTRADOR, // acceso total; gestiona usuarios y roles
    VENDEDOR,      // actualiza stock y estado de los pedidos
    CLIENTE        // compra y ve sus propios pedidos
}

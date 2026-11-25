package cl.sonidovivo.productos.exception;

public class NotFoundException extends RuntimeException{
    public NotFoundException(String mensaje) {
        super(mensaje);
    }
}

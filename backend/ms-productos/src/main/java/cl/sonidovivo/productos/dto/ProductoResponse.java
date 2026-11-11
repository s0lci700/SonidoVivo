package cl.sonidovivo.productos.dto;

import cl.sonidovivo.productos.model.Producto;

// Lo que la API DEVUELVE. La categoría va plana (id y nombre), que es la forma
// que ya usa el frontend: { "categoriaId": "GA", "categoria": "Guitarras Acústicas" }.
public record ProductoResponse(
        Long id,
        String codigo,
        String categoriaId,
        String categoria,
        String nombre,
        String marca,
        String modelo,
        Integer stock,
        Integer precio,
        String descripcion) {

    // Convierte la entidad JPA en la respuesta JSON.
    public static ProductoResponse desde(Producto p) {
        return new ProductoResponse(
                p.getId(),
                p.getCodigo(),
                p.getCategoria().getId(),
                p.getCategoria().getNombre(),
                p.getNombre(),
                p.getMarca(),
                p.getModelo(),
                p.getStock(),
                p.getPrecio(),
                p.getDescripcion());
    }
}

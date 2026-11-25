package cl.sonidovivo.productos.dto;

import cl.sonidovivo.productos.model.Categoria;

// Lo que la API DEVUELVE de una categoría.
public record CategoriaResponse(String id, String nombre) {

    // Convierte la entidad JPA en la respuesta JSON.
    public static CategoriaResponse desde(Categoria c) {
        return new CategoriaResponse(c.getId(), c.getNombre());
    }
}

package cl.sonidovivo.productos.config;

import java.io.InputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import cl.sonidovivo.productos.model.Categoria;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.CategoriaRepository;
import cl.sonidovivo.productos.repository.ProductoRepository;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

// Carga el catálogo del Parcial 2 (resources/datos/*.json) solo cuando las tablas
// están vacías. Así, al reiniciar, los cambios hechos con el CRUD se conservan.
@Component
public class DatosIniciales implements CommandLineRunner {

    // Forma de cada producto en productos.json. El campo "categoria" (nombre) se ignora.
    @JsonIgnoreProperties(ignoreUnknown = true)
    record ProductoJson(String codigo, String categoriaId, String nombre, String marca,
            String modelo, Integer stock, Integer precio, String descripcion) {
    }

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private JsonMapper jsonMapper;

    @Override
    public void run(String... args) throws Exception {
        if (categoriaRepository.count() == 0) {
            List<Categoria> categorias = leer("datos/categorias.json", new TypeReference<>() {});
            categoriaRepository.saveAll(categorias);
        }
        if (productoRepository.count() == 0) {
            List<ProductoJson> productos = leer("datos/productos.json", new TypeReference<>() {});
            productoRepository.saveAll(productos.stream().map(this::aEntidad).toList());
        }
    }

    private Producto aEntidad(ProductoJson p) {
        Categoria categoria = categoriaRepository.findById(p.categoriaId()).orElseThrow();
        return new Producto(null, p.codigo(), categoria, p.nombre(), p.marca(), p.modelo(),
                p.stock(), p.precio(), p.descripcion());
    }

    private <T> T leer(String ruta, TypeReference<T> tipo) throws Exception {
        try (InputStream entrada = new ClassPathResource(ruta).getInputStream()) {
            return jsonMapper.readValue(entrada, tipo);
        }
    }
}

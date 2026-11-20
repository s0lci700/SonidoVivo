package cl.sonidovivo.productos.config;

import java.io.InputStream;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import cl.sonidovivo.productos.model.Categoria;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.CategoriaRepository;
import cl.sonidovivo.productos.repository.ProductoRepository;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

// Al arrancar con la base vacía, carga el catálogo de la planilla del caso
// (resources/datos/*.json, los mismos datos que usaba el frontend en el Parcial 2).
// Si ya hay categorías no hace nada: los cambios hechos desde la API se conservan.
@Slf4j
@Component
public class DatosIniciales implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public DatosIniciales(CategoriaRepository categoriaRepository, ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    // Forma de cada producto en productos.json (trae "categoriaId", no un objeto categoría).
    @JsonIgnoreProperties(ignoreUnknown = true)
    record ProductoJson(String codigo, String categoriaId, String nombre, String marca, String modelo,
            Integer stock, Integer precio, String descripcion) {
    }

    @Override
    public void run(String... args) throws Exception {
        if (categoriaRepository.count() > 0) {
            return;
        }
        JsonMapper mapper = JsonMapper.builder().build();
        List<Categoria> categorias = leer(mapper, "datos/categorias.json", new TypeReference<>() {});
        categoriaRepository.saveAll(categorias);

        List<ProductoJson> productos = leer(mapper, "datos/productos.json", new TypeReference<>() {});
        for (ProductoJson p : productos) {
            Categoria categoria = categoriaRepository.findById(p.categoriaId()).orElseThrow();
            productoRepository.save(new Producto(null, p.codigo(), categoria, p.nombre(), p.marca(),
                    p.modelo(), p.stock(), p.precio(), p.descripcion()));
        }
        log.info("Datos iniciales: {} categorías y {} productos", categorias.size(), productos.size());
    }

    private <T> T leer(JsonMapper mapper, String ruta, TypeReference<T> tipo) throws Exception {
        try (InputStream in = new ClassPathResource(ruta).getInputStream()) {
            return mapper.readValue(in, tipo);
        }
    }
}

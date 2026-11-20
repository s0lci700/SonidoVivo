package cl.sonidovivo.productos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sonidovivo.productos.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // El frontend identifica los productos por su código (GA001), no por el id numérico.
    Optional<Producto> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, Long id);

    List<Producto> findByCategoriaId(String categoriaId);
}

package cl.sonidovivo.productos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sonidovivo.productos.model.Producto;
import java.util.List;


public interface ProductoRepository extends JpaRepository<Producto, Long>{
    
    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, Long id);

    List<Producto> findByCategoriaId(String categoriaId);
}

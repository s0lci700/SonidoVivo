package cl.sonidovivo.productos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sonidovivo.productos.model.Producto;
import java.util.List;
import java.util.Optional;


public interface ProductoRepository extends JpaRepository<Producto, Long>{
    
    boolean existsByCodigo(String codigo);

    boolean existsByCategoriaId(String categoriaId);

    //SELECT COUNT(*) > 0 FROM producto WHERE codigo = 'GA001' AND id <> 5;
    boolean existsByCodigoAndIdNot(String codigo, Long id);

    List<Producto> findByCategoriaId(String categoriaId);

    Optional<Producto> findByCodigo(String codigo);
}

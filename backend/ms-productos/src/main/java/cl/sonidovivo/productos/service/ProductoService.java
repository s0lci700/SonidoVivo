package cl.sonidovivo.productos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.productos.dto.ProductoRequest;
import cl.sonidovivo.productos.dto.ProductoResponse;
import cl.sonidovivo.productos.model.Categoria;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.CategoriaRepository;
import cl.sonidovivo.productos.repository.ProductoRepository;

// Recibe y devuelve DTOs; la entidad Producto solo se usa aquí adentro y en el repositorio.
@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<ProductoResponse> listar(String categoriaId) {
        List<Producto> productos = (categoriaId == null || categoriaId.isBlank())
                ? productoRepository.findAll()
                : productoRepository.findByCategoriaId(categoriaId);
        return productos.stream().map(ProductoResponse::desde).toList();
    }

    public ProductoResponse buscar(Long id) {
        return ProductoResponse.desde(buscarEntidad(id));
    }

    public ProductoResponse buscarPorCodigo(String codigo) {
        Producto producto = productoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto con código " + codigo + " no existe"));
        return ProductoResponse.desde(producto);
    }

    public ProductoResponse crear(ProductoRequest datos) {
        if (productoRepository.existsByCodigo(datos.codigo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe un registro con el codigo " + datos.codigo());
        }
        Producto nuevo = new Producto();
        copiarDatos(datos, nuevo);
        return ProductoResponse.desde(productoRepository.save(nuevo));
    }

    public ProductoResponse actualizar(Long id, ProductoRequest datos) {
        Producto actual = buscarEntidad(id);
        if (productoRepository.existsByCodigoAndIdNot(datos.codigo(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe otro registro con el codigo " + datos.codigo());
        }
        copiarDatos(datos, actual);
        return ProductoResponse.desde(productoRepository.save(actual));
    }

    public void eliminar(Long id) {
        productoRepository.delete(buscarEntidad(id));
    }

    // Regla de negocio: no se puede vender más de lo que hay. Lo usará ms-pedidos.
    @Transactional
    public ProductoResponse descontarStock(Long id, int cantidad) {
        if (cantidad <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a 0.");
        }
        Producto actual = buscarEntidad(id);
        if (actual.getStock() < cantidad) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Stock insuficiente: quedan " + actual.getStock() + " unidades.");
        }
        actual.setStock(actual.getStock() - cantidad);
        return ProductoResponse.desde(productoRepository.save(actual));
    }

    private Producto buscarEntidad(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe"));
    }

    // Convierte el DTO de entrada en la entidad (sirve para crear y para editar).
    private void copiarDatos(ProductoRequest datos, Producto producto) {
        producto.setCodigo(datos.codigo());
        producto.setCategoria(resolverCategoria(datos.categoriaId()));
        producto.setNombre(datos.nombre());
        producto.setMarca(datos.marca());
        producto.setModelo(datos.modelo());
        producto.setStock(datos.stock());
        producto.setPrecio(datos.precio());
        producto.setDescripcion(datos.descripcion());
    }

    private Categoria resolverCategoria(String categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La categoría " + categoriaId + " no existe"));
    }
}

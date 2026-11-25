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

    public ProductoResponse buscar(String codigo) {
        return ProductoResponse.desde(buscarEntidad(codigo));
    }

    public ProductoResponse crear(ProductoRequest datos) {
        if (productoRepository.existsByCodigo(datos.codigo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe un producto con el código " + datos.codigo());
        }
        Producto nuevo = new Producto();
        copiarDatos(datos, nuevo);
        return ProductoResponse.desde(productoRepository.save(nuevo));
    }

    public ProductoResponse actualizar(String codigo, ProductoRequest datos) {
        Producto actual = buscarEntidad(codigo);
        if (productoRepository.existsByCodigoAndIdNot(datos.codigo(), actual.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe otro producto con el código " + datos.codigo());
        }
        copiarDatos(datos, actual);
        return ProductoResponse.desde(productoRepository.save(actual));
    }

    public void eliminar(String codigo) {
        productoRepository.delete(buscarEntidad(codigo));
    }

    // El Vendedor fija el stock tras contar el inventario.
    public ProductoResponse cambiarStock(String codigo, int stock) {
        if (stock < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El stock no puede ser negativo.");
        }
        Producto actual = buscarEntidad(codigo);
        actual.setStock(stock);
        return ProductoResponse.desde(productoRepository.save(actual));
    }

    // Regla de negocio: no se puede vender más de lo que hay. Lo llama ms-pedidos al crear un pedido.
    @Transactional
    public ProductoResponse descontarStock(String codigo, int cantidad) {
        validarCantidad(cantidad);
        Producto actual = buscarEntidad(codigo);
        if (actual.getStock() < cantidad) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Stock insuficiente de " + codigo + ": quedan " + actual.getStock() + " unidades.");
        }
        actual.setStock(actual.getStock() - cantidad);
        return ProductoResponse.desde(productoRepository.save(actual));
    }

    // Lo llama ms-pedidos al cancelar un pedido, o si falla a mitad de crearlo.
    @Transactional
    public ProductoResponse reponerStock(String codigo, int cantidad) {
        validarCantidad(cantidad);
        Producto actual = buscarEntidad(codigo);
        actual.setStock(actual.getStock() + cantidad);
        return ProductoResponse.desde(productoRepository.save(actual));
    }

    private void validarCantidad(int cantidad) {
        if (cantidad <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a 0.");
        }
    }

    private Producto buscarEntidad(String codigo) {
        return productoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El producto " + codigo + " no existe"));
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

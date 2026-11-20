package cl.sonidovivo.productos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.productos.model.Categoria;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.CategoriaRepository;
import cl.sonidovivo.productos.repository.ProductoRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Producto> listar(String categoriaId) {
        if (categoriaId == null || categoriaId.isBlank()) {
            return productoRepository.findAll();
        }
        return productoRepository.findByCategoriaId(categoriaId);
    }

    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    public Producto buscar(String codigo) {
        return productoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El producto " + codigo + " no existe"));
    }

    public Producto crear(Producto nuevo) {
        if (productoRepository.existsByCodigo(nuevo.getCodigo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe un producto con el código " + nuevo.getCodigo());
        }
        nuevo.setCategoria(resolverCategoria(nuevo.getCategoria()));
        nuevo.setId(null); // el id lo genera la base de datos
        return productoRepository.save(nuevo);
    }

    public Producto actualizar(String codigo, Producto cambios) {
        Producto actual = buscar(codigo);
        if (productoRepository.existsByCodigoAndIdNot(cambios.getCodigo(), actual.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe otro producto con el código " + cambios.getCodigo());
        }
        actual.setCodigo(cambios.getCodigo());
        actual.setCategoria(resolverCategoria(cambios.getCategoria()));
        actual.setNombre(cambios.getNombre());
        actual.setMarca(cambios.getMarca());
        actual.setModelo(cambios.getModelo());
        actual.setStock(cambios.getStock());
        actual.setPrecio(cambios.getPrecio());
        actual.setDescripcion(cambios.getDescripcion());
        return productoRepository.save(actual);
    }

    public void eliminar(String codigo) {
        productoRepository.delete(buscar(codigo));
    }

    // El Vendedor actualiza el stock tras contar el inventario (caso, §0.2).
    public Producto cambiarStock(String codigo, int stock) {
        if (stock < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El stock no puede ser negativo");
        }
        Producto actual = buscar(codigo);
        actual.setStock(stock);
        return productoRepository.save(actual);
    }

    // Lo llama ms-pedidos al confirmar un pedido.
    @Transactional
    public Producto descontarStock(String codigo, int cantidad) {
        if (cantidad <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a 0");
        }
        Producto actual = buscar(codigo);
        if (actual.getStock() < cantidad) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Stock insuficiente de " + codigo + ": quedan " + actual.getStock() + " unidades");
        }
        actual.setStock(actual.getStock() - cantidad);
        return productoRepository.save(actual);
    }

    // Lo llama ms-pedidos al cancelar un pedido, o si falla a mitad de crearlo.
    @Transactional
    public Producto reponerStock(String codigo, int cantidad) {
        if (cantidad <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a 0");
        }
        Producto actual = buscar(codigo);
        actual.setStock(actual.getStock() + cantidad);
        return productoRepository.save(actual);
    }

    private Categoria resolverCategoria(Categoria enviada) {
        if (enviada == null || enviada.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoría es obligatoria");
        }
        return categoriaRepository.findById(enviada.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La categoría " + enviada.getId() + " no existe"));
    }
}

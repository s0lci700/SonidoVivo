package cl.sonidovivo.productos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.productos.model.Categoria;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.CategoriaRepository;
import cl.sonidovivo.productos.repository.ProductoRepository;
import org.springframework.transaction.annotation.Transactional;

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

    public Producto buscar(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe"));
    }

    public Producto crear(Producto nuevo) {
        if (productoRepository.existsByCodigo(nuevo.getCodigo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe un registro con el codigo " + nuevo.getCodigo());
        }
        nuevo.setCategoria(resolverCategoria(nuevo.getCategoria()));
        nuevo.setId(null);
        return productoRepository.save(nuevo);
    }

    public Producto actualizar(Long id, Producto cambios) {

        Producto actual = buscar(id);
        if (productoRepository.existsByCodigoAndIdNot(cambios.getCodigo(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe otro registro con el codigo " + cambios.getCodigo());
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

    public void eliminar(Long id) {
        productoRepository.delete(buscar(id));
    }

    // Lo usará ms-pedidos.
    @Transactional
    public Producto descontarStock(Long id, int cantidad) {
        if (cantidad <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a 0.");
        }
        Producto actual = buscar(id);
        if (actual.getStock() < cantidad) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Stock insuficiente: quedan " + actual.getStock() + " unidades.");
        }
        actual.setStock(actual.getStock() - cantidad);
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

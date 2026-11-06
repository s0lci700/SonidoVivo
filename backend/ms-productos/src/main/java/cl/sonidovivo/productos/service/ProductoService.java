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
        return productoRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe"));
    }

    public Producto crear(Producto nuevo) {
        if (productoRepository.existsByCodigo(nuevo.getCodigo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un registro con el codigo" + nuevo.getCodigo());
        }
        // TODO: esta línea no hace nada; cambiar por resolverCategoria(nuevo.getCategoria())
        nuevo.setCategoria(nuevo.getCategoria());
        nuevo.setId(null);
        return productoRepository.save(nuevo);
    }

    public Producto actualizar(Long id, Producto cambios) {
        // TODO: buscar(id); si otro producto ya usa cambios.getCodigo() -> 409 (existsByCodigoAndIdNot);
        //       copiar los campos de cambios a actual (categoría con resolverCategoria) y guardar.
        throw new UnsupportedOperationException("Pendiente: actualizar");
    }

    public void eliminar(Long id) {
        // TODO: buscar(id) (lanza 404 si no existe) y productoRepository.delete(...).
        throw new UnsupportedOperationException("Pendiente: eliminar");
    }

    // Lo usará ms-pedidos. Agregar @Transactional (org.springframework.transaction.annotation).
    public Producto descontarStock(Long id, int cantidad) {
        // TODO: cantidad <= 0 -> 400; stock < cantidad -> 409 "Stock insuficiente";
        //       restar cantidad al stock y guardar.
        throw new UnsupportedOperationException("Pendiente: descontarStock");
    }

    private Categoria resolverCategoria(Categoria enviada) {
        // TODO: si enviada o enviada.getId() es null -> 400 "La categoría es obligatoria";
        //       categoriaRepository.findById(enviada.getId()) o 400 "La categoría X no existe".
        throw new UnsupportedOperationException("Pendiente: resolverCategoria");
    }
}

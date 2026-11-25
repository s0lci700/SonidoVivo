package cl.sonidovivo.productos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.productos.dto.CategoriaRequest;
import cl.sonidovivo.productos.dto.CategoriaResponse;
import cl.sonidovivo.productos.dto.ProductoRequest;
import cl.sonidovivo.productos.dto.ProductoResponse;
import cl.sonidovivo.productos.model.Categoria;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.CategoriaRepository;
import cl.sonidovivo.productos.repository.ProductoRepository;
import jakarta.transaction.Transactional;

@Service 
public class CategoriaService {
    
    @Autowired 
    private ProductoRepository productoRepository;

    @Autowired 
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodos() {
        return categoriaRepository.findAll();
    }

    public Categoria obtenerPorId(String id) {
        return categoriaRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Categoria con código " + id + " no existe"));
    }

    @Transactional 
    public CategoriaResponse crear(CategoriaRequest datos) {
        if (categoriaRepository.existsById(datos.id())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe un registro con el codigo " + datos.id());
        }
        // La columna nombre es unique: sin esto, un nombre repetido terminaría en error 500.
        if (categoriaRepository.existsByNombre(datos.nombre())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe una categoria con el nombre " + datos.nombre());
        }
        Categoria nuevo = new Categoria();
        copiarDatos(datos, nuevo);
        return CategoriaResponse.desde(categoriaRepository.save(nuevo));
    }


    private void copiarDatos(CategoriaRequest datos, Categoria categoria) {
        categoria.setId(datos.id());
        categoria.setNombre(datos.nombre());
    }
}

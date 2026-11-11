package cl.sonidovivo.productos.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.productos.dto.ProductoRequest;
import cl.sonidovivo.productos.dto.ProductoResponse;
import cl.sonidovivo.productos.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Productos", description = "CRUD del catálogo y descuento de stock")
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Operation(summary = "Lista los productos; con ?categoria=GA filtra por categoría")
    @GetMapping
    public List<ProductoResponse> listar(@RequestParam(required = false) String categoria) {
        return productoService.listar(categoria);
    }

    @Operation(summary = "Busca un producto por id (404 si no existe)")
    @GetMapping("/{id}")
    public ProductoResponse buscar(@PathVariable Long id) {
        return productoService.buscar(id);
    }

    // El frontend identifica los productos por código (GA001) en sus URLs.
    @Operation(summary = "Busca un producto por código, p. ej. GA001 (404 si no existe)")
    @GetMapping("/codigo/{codigo}")
    public ProductoResponse buscarPorCodigo(@PathVariable String codigo) {
        return productoService.buscarPorCodigo(codigo);
    }

    @Operation(summary = "Crea un producto (201; 400 si los datos no son válidos; 409 si el código ya existe)")
    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest producto) {
        ProductoResponse creado = productoService.crear(producto);
        return ResponseEntity.created(URI.create("/api/productos/" + creado.id())).body(creado);
    }

    @Operation(summary = "Actualiza un producto (200; 404 si no existe; 409 si el código choca con otro)")
    @PutMapping("/{id}")
    public ProductoResponse actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequest producto) {
        return productoService.actualizar(id, producto);
    }

    @Operation(summary = "Elimina un producto (204; 404 si no existe)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Regla de negocio: no se puede vender más de lo que hay en bodega.
    @Operation(summary = "Descuenta stock al vender (400 si la cantidad no es positiva; 409 si no alcanza el stock)")
    @PatchMapping("/{id}/descontar-stock")
    public ProductoResponse descontarStock(@PathVariable Long id, @RequestParam int cantidad) {
        return productoService.descontarStock(id, cantidad);
    }
}

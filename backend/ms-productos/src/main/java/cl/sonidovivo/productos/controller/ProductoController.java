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

import cl.sonidovivo.productos.dto.CantidadRequest;
import cl.sonidovivo.productos.dto.ProductoRequest;
import cl.sonidovivo.productos.dto.ProductoResponse;
import cl.sonidovivo.productos.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

// El frontend identifica los productos por código (GA001) en sus URLs, así que la API
// también. Quién puede llamar a cada endpoint se define en security/SecurityConfig.
@Tag(name = "Productos", description = "CRUD del catálogo y manejo de stock")
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Operation(summary = "Lista los productos", description = "Público. Con ?categoria=GA filtra por categoría")
    @GetMapping
    public List<ProductoResponse> listar(@RequestParam(required = false) String categoria) {
        return productoService.listar(categoria);
    }

    @Operation(summary = "Busca un producto por código, p. ej. GA001", description = "Público")
    @ApiResponse(responseCode = "200", description = "El producto")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese código")
    @GetMapping("/{codigo}")
    public ProductoResponse buscar(@PathVariable String codigo) {
        return productoService.buscar(codigo);
    }

    @Operation(summary = "Crea un producto", description = "Solo ADMINISTRADOR")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "201", description = "Producto creado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos o categoría inexistente")
    @ApiResponse(responseCode = "409", description = "El código ya existe")
    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest producto) {
        ProductoResponse creado = productoService.crear(producto);
        return ResponseEntity.created(URI.create("/api/productos/" + creado.codigo())).body(creado);
    }

    @Operation(summary = "Actualiza un producto", description = "Solo ADMINISTRADOR")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese código")
    @ApiResponse(responseCode = "409", description = "El nuevo código ya lo usa otro producto")
    @PutMapping("/{codigo}")
    public ProductoResponse actualizar(@PathVariable String codigo, @Valid @RequestBody ProductoRequest producto) {
        return productoService.actualizar(codigo, producto);
    }

    @Operation(summary = "Elimina un producto", description = "Solo ADMINISTRADOR")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "204", description = "Producto eliminado")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese código")
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> eliminar(@PathVariable String codigo) {
        productoService.eliminar(codigo);
        return ResponseEntity.noContent().build();
    }

    // El Vendedor corrige el stock después de contar el inventario.
    @Operation(summary = "Fija el stock", description = "ADMINISTRADOR o VENDEDOR. Cuerpo: {\"cantidad\": 12}")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{codigo}/stock")
    public ProductoResponse cambiarStock(@PathVariable String codigo, @Valid @RequestBody CantidadRequest cuerpo) {
        return productoService.cambiarStock(codigo, cuerpo.cantidad());
    }

    // Regla de negocio: no se puede vender más de lo que hay en bodega.
    @Operation(summary = "Descuenta stock al vender", description = "Solo el rol SERVICIO (lo usa ms-pedidos)")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    @PostMapping("/{codigo}/descontar")
    public ProductoResponse descontar(@PathVariable String codigo, @Valid @RequestBody CantidadRequest cuerpo) {
        return productoService.descontarStock(codigo, cuerpo.cantidad());
    }

    @Operation(summary = "Repone stock", description = "Solo el rol SERVICIO (lo usa ms-pedidos al cancelar un pedido)")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{codigo}/reponer")
    public ProductoResponse reponer(@PathVariable String codigo, @Valid @RequestBody CantidadRequest cuerpo) {
        return productoService.reponerStock(codigo, cuerpo.cantidad());
    }
}

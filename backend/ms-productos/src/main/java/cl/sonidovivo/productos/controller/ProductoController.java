package cl.sonidovivo.productos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import cl.sonidovivo.productos.model.Categoria;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

// Quién puede llamar a cada endpoint se define en security/SecurityConfig.
@Slf4j
@RestController
@RequestMapping("/api")
@Tag(name = "Productos", description = "Catálogo, categorías y stock")
public class ProductoController {

    // Inyección por campo, como en los tutoriales del curso.
    @Autowired
    private ProductoService productoService;

    @Operation(summary = "Listar productos", description = "Público. Filtra por categoría si se envía ?categoria=GA")
    @GetMapping("/productos")
    public List<Producto> listar(@RequestParam(required = false) String categoria) {
        log.info("GET /api/productos?categoria={}", categoria);
        return productoService.listar(categoria);
    }

    @Operation(summary = "Buscar un producto por su código", description = "Público")
    @ApiResponse(responseCode = "200", description = "El producto")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese código")
    @GetMapping("/productos/{codigo}")
    public Producto buscar(@PathVariable String codigo) {
        log.info("GET /api/productos/{}", codigo);
        return productoService.buscar(codigo);
    }

    @Operation(summary = "Listar categorías", description = "Público")
    @GetMapping("/categorias")
    public List<Categoria> listarCategorias() {
        return productoService.listarCategorias();
    }

    @Operation(summary = "Crear producto", description = "Solo ADMINISTRADOR")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "201", description = "Producto creado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos o categoría inexistente")
    @ApiResponse(responseCode = "409", description = "El código ya existe")
    @PostMapping("/productos")
    public ResponseEntity<Producto> crear(@Valid @RequestBody Producto producto) {
        log.info("POST /api/productos {}", producto.getCodigo());
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(producto));
    }

    @Operation(summary = "Actualizar producto", description = "Solo ADMINISTRADOR")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/productos/{codigo}")
    public Producto actualizar(@PathVariable String codigo, @Valid @RequestBody Producto cambios) {
        log.info("PUT /api/productos/{}", codigo);
        return productoService.actualizar(codigo, cambios);
    }

    @Operation(summary = "Eliminar producto", description = "Solo ADMINISTRADOR")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "204", description = "Producto eliminado")
    @DeleteMapping("/productos/{codigo}")
    public ResponseEntity<Void> eliminar(@PathVariable String codigo) {
        log.info("DELETE /api/productos/{}", codigo);
        productoService.eliminar(codigo);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Fijar el stock", description = "ADMINISTRADOR o VENDEDOR. Cuerpo: {\"cantidad\": 12}")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/productos/{codigo}/stock")
    public Producto cambiarStock(@PathVariable String codigo, @Valid @RequestBody CantidadRequest body) {
        log.info("PATCH /api/productos/{}/stock -> {}", codigo, body.cantidad());
        return productoService.cambiarStock(codigo, body.cantidad());
    }

    @Operation(summary = "Descontar stock", description = "Solo el rol SERVICIO (lo usa ms-pedidos)")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    @PostMapping("/productos/{codigo}/descontar")
    public Producto descontar(@PathVariable String codigo, @Valid @RequestBody CantidadRequest body) {
        log.info("POST /api/productos/{}/descontar {}", codigo, body.cantidad());
        return productoService.descontarStock(codigo, body.cantidad());
    }

    @Operation(summary = "Reponer stock", description = "Solo el rol SERVICIO (lo usa ms-pedidos al cancelar)")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/productos/{codigo}/reponer")
    public Producto reponer(@PathVariable String codigo, @Valid @RequestBody CantidadRequest body) {
        log.info("POST /api/productos/{}/reponer {}", codigo, body.cantidad());
        return productoService.reponerStock(codigo, body.cantidad());
    }
}

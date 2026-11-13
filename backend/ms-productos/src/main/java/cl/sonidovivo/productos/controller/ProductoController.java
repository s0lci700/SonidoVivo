package cl.sonidovivo.productos.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

@Slf4j 
@RestController 
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Registro y gestion de productos")
public class ProductoController {

    // esta bien???
    @Autowired
    private ProductoService productoService;

    @Operation(summary = "Buscar producto", description = "Buscar un producto con el codigo indicado")
    @ApiResponse(responseCode = "200", description = "true si existe, false si no")
    @GetMapping("/{codigo}")
    public ResponseEntity<Producto> validar(@PathVariable Long codigo) {
        log.info("GET /api/productos/{}}", codigo);
        return ResponseEntity.ok(productoService.buscar(codigo));
    }
}

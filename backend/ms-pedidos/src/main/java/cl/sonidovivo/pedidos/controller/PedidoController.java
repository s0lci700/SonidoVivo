package cl.sonidovivo.pedidos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.pedidos.dto.EstadoRequest;
import cl.sonidovivo.pedidos.dto.PedidoRequest;
import cl.sonidovivo.pedidos.model.EstadoPedido;
import cl.sonidovivo.pedidos.model.Pedido;
import cl.sonidovivo.pedidos.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

// Todos los endpoints requieren token. Las reglas por rol están en SecurityConfig.
@Slf4j
@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedidos", description = "Pedidos de la tienda online y su estado")
@SecurityRequirement(name = "bearerAuth")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Operation(summary = "Crear pedido", description = "Cualquier usuario con sesión. Descuenta stock en ms-productos")
    @ApiResponse(responseCode = "201", description = "Pedido creado en estado EN_PREPARACION")
    @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    @PostMapping
    public ResponseEntity<Pedido> crear(@Valid @RequestBody PedidoRequest datos, Authentication auth) {
        log.info("POST /api/pedidos de {} ({} productos)", auth.getName(), datos.items().size());
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crear(datos, auth.getName()));
    }

    @Operation(summary = "Mis pedidos", description = "Historial del usuario de la sesión (RF-28)")
    @GetMapping("/mios")
    public List<Pedido> mios(Authentication auth) {
        return pedidoService.listarDelCliente(auth.getName());
    }

    @Operation(summary = "Todos los pedidos", description = "VENDEDOR o ADMINISTRADOR. Filtro opcional ?estado=DESPACHADO")
    @GetMapping
    public List<Pedido> listar(@RequestParam(required = false) EstadoPedido estado) {
        return pedidoService.listar(estado);
    }

    @Operation(summary = "Ver un pedido", description = "El cliente solo ve los suyos (si no, 403)")
    @GetMapping("/{id}")
    public Pedido buscar(@PathVariable Long id, Authentication auth) {
        return pedidoService.buscar(id, auth.getName(), esPersonal(auth));
    }

    @Operation(summary = "Cambiar estado", description = "VENDEDOR o ADMINISTRADOR. CANCELADO devuelve el stock")
    @PatchMapping("/{id}/estado")
    public Pedido cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoRequest datos) {
        log.info("PATCH /api/pedidos/{}/estado -> {}", id, datos.estado());
        return pedidoService.cambiarEstado(id, datos.estado());
    }

    private static boolean esPersonal(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_ADMINISTRADOR") || a.getAuthority().equals("ROLE_VENDEDOR"));
    }
}

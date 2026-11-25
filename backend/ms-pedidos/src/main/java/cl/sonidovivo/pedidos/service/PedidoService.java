package cl.sonidovivo.pedidos.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.pedidos.client.ProductoClient;
import cl.sonidovivo.pedidos.client.ProductoClient.ProductoResumen;
import cl.sonidovivo.pedidos.dto.PedidoRequest;
import cl.sonidovivo.pedidos.model.DetallePedido;
import cl.sonidovivo.pedidos.model.EstadoPedido;
import cl.sonidovivo.pedidos.model.Pedido;
import cl.sonidovivo.pedidos.model.TipoEntrega;
import cl.sonidovivo.pedidos.repository.PedidoRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoClient productoClient;

    // Crear un pedido:
    //  1. Revisa que todos los productos existan y tengan stock (sin tocar nada todavía).
    //  2. Descuenta el stock en ms-productos, producto por producto.
    //  3. Si algo falla a mitad de camino, repone lo ya descontado (compensación).
    //  4. Guarda el pedido con los precios que entregó ms-productos.
    public Pedido crear(PedidoRequest datos, String correoCliente) {
        if (datos.entrega() == TipoEntrega.DESPACHO && (datos.direccion() == null || datos.direccion().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La dirección es obligatoria para despacho");
        }

        // 1. Validación previa
        for (PedidoRequest.Item item : datos.items()) {
            ProductoResumen producto = productoClient.obtener(item.codigo());
            if (producto.stock() < item.cantidad()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Stock insuficiente de " + producto.nombre() + ": quedan " + producto.stock());
            }
        }

        // 2. Descuento, guardando qué se descontó por si hay que deshacerlo
        Pedido pedido = new Pedido();
        List<PedidoRequest.Item> descontados = new ArrayList<>();
        try {
            for (PedidoRequest.Item item : datos.items()) {
                ProductoResumen producto = productoClient.descontar(item.codigo(), item.cantidad());
                descontados.add(item);
                pedido.agregarDetalle(new DetallePedido(producto.codigo(), producto.nombre(),
                        item.cantidad(), producto.precio()));
            }
        } catch (ResponseStatusException e) {
            // 3. Compensación: otro cliente pudo comprar el último entre el paso 1 y el 2.
            reponer(descontados);
            throw e;
        }

        // 4. Guardar
        pedido.setCorreoCliente(correoCliente);
        pedido.setNombreCliente(datos.nombreCliente().trim());
        pedido.setEntrega(datos.entrega());
        pedido.setDireccion(datos.entrega() == TipoEntrega.DESPACHO ? datos.direccion().trim() : null);
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.EN_PREPARACION);
        pedido.setTotal(pedido.getDetalles().stream().mapToInt(DetallePedido::getSubtotal).sum());
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listar(EstadoPedido estado) {
        return estado == null ? pedidoRepository.findAllByOrderByFechaDesc()
                : pedidoRepository.findByEstadoOrderByFechaDesc(estado);
    }

    public List<Pedido> listarDelCliente(String correoCliente) {
        return pedidoRepository.findByCorreoClienteOrderByFechaDesc(correoCliente);
    }

    // El cliente solo puede ver sus propios pedidos; el personal ve todos.
    public Pedido buscar(Long id, String correo, boolean esPersonal) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El pedido " + id + " no existe"));
        if (!esPersonal && !pedido.getCorreoCliente().equals(correo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este pedido no es tuyo");
        }
        return pedido;
    }

    // Lo usan VENDEDOR y ADMINISTRADOR. Un pedido entregado o cancelado ya no cambia.
    public Pedido cambiarEstado(Long id, EstadoPedido nuevo) {
        Pedido pedido = buscar(id, null, true);
        EstadoPedido actual = pedido.getEstado();
        if (actual == EstadoPedido.ENTREGADO || actual == EstadoPedido.CANCELADO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "El pedido ya está " + actual + " y no puede cambiar de estado");
        }
        if (nuevo == EstadoPedido.CANCELADO) {
            for (DetallePedido d : pedido.getDetalles()) {
                productoClient.reponer(d.getCodigoProducto(), d.getCantidad());
            }
        }
        pedido.setEstado(nuevo);
        return pedidoRepository.save(pedido);
    }

    private void reponer(List<PedidoRequest.Item> items) {
        for (PedidoRequest.Item item : items) {
            try {
                productoClient.reponer(item.codigo(), item.cantidad());
            } catch (ResponseStatusException e) {
                // No se puede hacer más que dejar constancia para corregir a mano.
                log.error("No se pudo reponer {} x{}: {}", item.codigo(), item.cantidad(), e.getReason());
            }
        }
    }
}

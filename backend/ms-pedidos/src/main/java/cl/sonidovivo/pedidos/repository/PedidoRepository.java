package cl.sonidovivo.pedidos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sonidovivo.pedidos.model.EstadoPedido;
import cl.sonidovivo.pedidos.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Historial del cliente, del más reciente al más antiguo.
    List<Pedido> findByCorreoClienteOrderByFechaDesc(String correoCliente);

    List<Pedido> findByEstadoOrderByFechaDesc(EstadoPedido estado);

    List<Pedido> findAllByOrderByFechaDesc();
}

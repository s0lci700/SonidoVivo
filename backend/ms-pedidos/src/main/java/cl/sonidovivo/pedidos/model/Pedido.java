package cl.sonidovivo.pedidos.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Viene del JWT (no del cuerpo de la solicitud): nadie puede crear pedidos a nombre de otro.
    // Es el correo de ms-usuarios; no hay FK porque cada microservicio tiene su propia base.
    @Column(nullable = false)
    private String correoCliente;

    @Column(nullable = false)
    private String nombreCliente;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoPedido estado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoEntrega entrega;

    // Solo para DESPACHO: "calle, comuna, región".
    private String direccion;

    // Total en CLP, calculado en el servidor con los precios de ms-productos.
    @Column(nullable = false)
    private Integer total;

    // EAGER porque siempre se muestran juntos y open-in-view está desactivado.
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DetallePedido> detalles = new ArrayList<>();

    public void agregarDetalle(DetallePedido detalle) {
        detalle.setPedido(this);
        detalles.add(detalle);
    }
}

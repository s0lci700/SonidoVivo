package cl.sonidovivo.pedidos;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import com.jayway.jsonpath.JsonPath;

import cl.sonidovivo.pedidos.client.ProductoClient;
import cl.sonidovivo.pedidos.client.ProductoClient.ProductoResumen;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// ms-productos se reemplaza por un simulacro (@MockitoBean): así se prueba la lógica
// de pedidos sin levantar el otro microservicio.
@SpringBootTest
@AutoConfigureMockMvc
class PedidosTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ProductoClient productoClient;

    @Value("${jwt.secret}")
    private String secreto;

    private String token(String correo, String rol) {
        return "Bearer " + Jwts.builder().subject(correo).claim("rol", rol)
                .expiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    private String cliente;
    private String vendedor;

    private static final String PEDIDO = """
            {"nombreCliente":"Cliente de Prueba","entrega":"RETIRO",
             "items":[{"codigo":"GA001","cantidad":2},{"codigo":"PE001","cantidad":1}]}
            """;

    @BeforeEach
    void preparar() {
        cliente = token("cliente@correo.cl", "CLIENTE");
        vendedor = token("vendedor@sonidovivo.cl", "VENDEDOR");
        when(productoClient.obtener("GA001")).thenReturn(new ProductoResumen("GA001", "Guitarra", 100000, 5));
        when(productoClient.obtener("PE001")).thenReturn(new ProductoResumen("PE001", "Pedal", 50000, 3));
        when(productoClient.descontar("GA001", 2)).thenReturn(new ProductoResumen("GA001", "Guitarra", 100000, 3));
        when(productoClient.descontar("PE001", 1)).thenReturn(new ProductoResumen("PE001", "Pedal", 50000, 2));
    }

    private Integer crearPedido(String token) throws Exception {
        String json = mvc.perform(post("/api/pedidos").header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON).content(PEDIDO))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(json, "$.id");
    }

    @Test
    void sinTokenDa401() throws Exception {
        mvc.perform(post("/api/pedidos").contentType(MediaType.APPLICATION_JSON).content(PEDIDO))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void clienteCreaPedidoConPreciosDelServidor() throws Exception {
        mvc.perform(post("/api/pedidos").header("Authorization", cliente)
                .contentType(MediaType.APPLICATION_JSON).content(PEDIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.correoCliente").value("cliente@correo.cl"))
                .andExpect(jsonPath("$.estado").value("EN_PREPARACION"))
                .andExpect(jsonPath("$.total").value(250000))
                .andExpect(jsonPath("$.detalles.length()").value(2));
    }

    @Test
    void despachoSinDireccionDa400() throws Exception {
        mvc.perform(post("/api/pedidos").header("Authorization", cliente).contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombreCliente\":\"X\",\"entrega\":\"DESPACHO\",\"items\":[{\"codigo\":\"GA001\",\"cantidad\":1}]}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sinStockDa409YNoDescuentaNada() throws Exception {
        mvc.perform(post("/api/pedidos").header("Authorization", cliente).contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombreCliente\":\"X\",\"entrega\":\"RETIRO\",\"items\":[{\"codigo\":\"PE001\",\"cantidad\":10}]}"))
                .andExpect(status().isConflict());
        verify(productoClient, never()).descontar(anyString(), anyInt());
    }

    @Test
    void siFallaUnDescuentoSeReponeLoYaDescontado() throws Exception {
        when(productoClient.descontar("PE001", 1))
                .thenThrow(new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente de PE001"));
        mvc.perform(post("/api/pedidos").header("Authorization", cliente)
                .contentType(MediaType.APPLICATION_JSON).content(PEDIDO))
                .andExpect(status().isConflict());
        verify(productoClient).reponer("GA001", 2);
    }

    @Test
    void clienteNoVeTodosLosPedidosNiLosAjenos() throws Exception {
        Integer id = crearPedido(token("otro@correo.cl", "CLIENTE"));
        mvc.perform(get("/api/pedidos").header("Authorization", cliente)).andExpect(status().isForbidden());
        mvc.perform(get("/api/pedidos/" + id).header("Authorization", cliente)).andExpect(status().isForbidden());
        mvc.perform(get("/api/pedidos/" + id).header("Authorization", vendedor)).andExpect(status().isOk());
    }

    @Test
    void clienteVeSuHistorial() throws Exception {
        String propio = token("historial@correo.cl", "CLIENTE");
        crearPedido(propio);
        mvc.perform(get("/api/pedidos/mios").header("Authorization", propio))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void clienteNoCambiaEstados() throws Exception {
        Integer id = crearPedido(cliente);
        mvc.perform(patch("/api/pedidos/" + id + "/estado").header("Authorization", cliente)
                .contentType(MediaType.APPLICATION_JSON).content("{\"estado\":\"ENTREGADO\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void vendedorCancelaYSeDevuelveElStock() throws Exception {
        Integer id = crearPedido(cliente);
        mvc.perform(patch("/api/pedidos/" + id + "/estado").header("Authorization", vendedor)
                .contentType(MediaType.APPLICATION_JSON).content("{\"estado\":\"CANCELADO\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("CANCELADO"));
        verify(productoClient).reponer("GA001", 2);
        verify(productoClient).reponer("PE001", 1);
        // Un pedido cancelado ya no cambia
        mvc.perform(patch("/api/pedidos/" + id + "/estado").header("Authorization", vendedor)
                .contentType(MediaType.APPLICATION_JSON).content("{\"estado\":\"DESPACHADO\"}"))
                .andExpect(status().isConflict());
    }
}

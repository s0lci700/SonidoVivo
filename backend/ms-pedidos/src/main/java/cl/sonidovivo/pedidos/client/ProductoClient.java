package cl.sonidovivo.pedidos.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import cl.sonidovivo.pedidos.security.JwtService;

// Comunicación entre microservicios: ms-pedidos llama a la API REST de ms-productos
// igual que lo haría React, pero con un token de rol SERVICIO.
@Component
public class ProductoClient {

    private final RestClient rest;
    private final JwtService jwtService;

    public ProductoClient(@Value("${productos.url}") String urlProductos, JwtService jwtService) {
        this.rest = RestClient.create(urlProductos);
        this.jwtService = jwtService;
    }

    // Solo los campos que ms-pedidos necesita del producto.
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ProductoResumen(String codigo, String nombre, Integer precio, Integer stock) {
    }

    public ProductoResumen obtener(String codigo) {
        try {
            return rest.get().uri("/api/productos/{codigo}", codigo)
                    .retrieve().body(ProductoResumen.class);
        } catch (RestClientResponseException e) {
            throw traducir(e, codigo);
        } catch (ResourceAccessException e) {
            throw sinConexion();
        }
    }

    public ProductoResumen descontar(String codigo, int cantidad) {
        return moverStock(codigo, cantidad, "descontar");
    }

    public ProductoResumen reponer(String codigo, int cantidad) {
        return moverStock(codigo, cantidad, "reponer");
    }

    private ProductoResumen moverStock(String codigo, int cantidad, String accion) {
        try {
            return rest.post().uri("/api/productos/{codigo}/" + accion, codigo)
                    .header("Authorization", "Bearer " + jwtService.crearTokenServicio())
                    .body(Map.of("cantidad", cantidad))
                    .retrieve().body(ProductoResumen.class);
        } catch (RestClientResponseException e) {
            throw traducir(e, codigo);
        } catch (ResourceAccessException e) {
            throw sinConexion();
        }
    }

    // Convierte la respuesta de ms-productos en un error que React entienda.
    private ResponseStatusException traducir(RestClientResponseException e, String codigo) {
        HttpStatusCode estado = e.getStatusCode();
        if (estado.value() == 404) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto " + codigo + " no existe");
        }
        if (estado.value() == 409) {
            return new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente de " + codigo);
        }
        return new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "ms-productos respondió " + estado.value() + " para " + codigo);
    }

    private ResponseStatusException sinConexion() {
        return new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                "No se pudo conectar con ms-productos. ¿Está encendido?");
    }
}

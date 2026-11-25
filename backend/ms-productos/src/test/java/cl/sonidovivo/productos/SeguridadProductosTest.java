package cl.sonidovivo.productos;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// Pruebas de extremo a extremo dentro del microservicio (filtro JWT + reglas + controller + H2).
// Los tokens se firman aquí con la clave de pruebas, igual que lo haría ms-usuarios.
@SpringBootTest
@AutoConfigureMockMvc
class SeguridadProductosTest {

    @Autowired
    private MockMvc mvc;

    @Value("${jwt.secret}")
    private String secreto;

    private String token(String rol) {
        return "Bearer " + Jwts.builder()
                .subject(rol.toLowerCase() + "@sonidovivo.cl")
                .claim("rol", rol)
                .expiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    private static final String NUEVO = """
            {"codigo":"TS001","categoriaId":"GA","nombre":"Producto de prueba","marca":"Marca",
             "modelo":"M1","stock":5,"precio":10000,"descripcion":"Creado por la prueba"}
            """;

    @Test
    void catalogoEsPublico() throws Exception {
        mvc.perform(get("/api/productos")).andExpect(status().isOk());
        mvc.perform(get("/api/productos/GA001")).andExpect(status().isOk())
                .andExpect(jsonPath("$.codigo").value("GA001"))
                .andExpect(jsonPath("$.categoriaId").value("GA"));
        mvc.perform(get("/api/categorias")).andExpect(status().isOk());
    }

    @Test
    void productoInexistenteDa404() throws Exception {
        mvc.perform(get("/api/productos/NOEXISTE")).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void crearSinTokenDa401() throws Exception {
        mvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(NUEVO))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void crearConTokenDeOtraClaveDa401() throws Exception {
        // Un token "ADMINISTRADOR" firmado por alguien que no conoce jwt.secret.
        String falso = "Bearer " + Jwts.builder().subject("intruso").claim("rol", "ADMINISTRADOR")
                .signWith(Keys.hmacShaKeyFor("otra-clave-que-no-es-la-del-sistema-123".getBytes(StandardCharsets.UTF_8)))
                .compact();
        mvc.perform(post("/api/productos").header("Authorization", falso)
                .contentType(MediaType.APPLICATION_JSON).content(NUEVO))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenVencidoDa401() throws Exception {
        String vencido = "Bearer " + Jwts.builder().subject("admin").claim("rol", "ADMINISTRADOR")
                .expiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8)))
                .compact();
        mvc.perform(delete("/api/productos/GA001").header("Authorization", vencido))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void crearComoClienteDa403() throws Exception {
        mvc.perform(post("/api/productos").header("Authorization", token("CLIENTE"))
                .contentType(MediaType.APPLICATION_JSON).content(NUEVO))
                .andExpect(status().isForbidden());
    }

    @Test
    void administradorCreaYEliminaProducto() throws Exception {
        mvc.perform(post("/api/productos").header("Authorization", token("ADMINISTRADOR"))
                .contentType(MediaType.APPLICATION_JSON).content(NUEVO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
        mvc.perform(delete("/api/productos/TS001").header("Authorization", token("ADMINISTRADOR")))
                .andExpect(status().isNoContent());
    }

    @Test
    void datosInvalidosDa400ConMensajePorCampo() throws Exception {
        mvc.perform(post("/api/productos").header("Authorization", token("ADMINISTRADOR"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"codigo\":\"\",\"categoriaId\":\"GA\",\"precio\":-1}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.precio").exists());
    }

    @Test
    void vendedorPuedeCambiarStockPeroNoEliminar() throws Exception {
        mvc.perform(patch("/api/productos/GA002/stock").header("Authorization", token("VENDEDOR"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"cantidad\":7}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stock").value(7));
        mvc.perform(delete("/api/productos/GA002").header("Authorization", token("VENDEDOR")))
                .andExpect(status().isForbidden());
    }

    @Test
    void soloElServicioDescuentaStock() throws Exception {
        mvc.perform(post("/api/productos/GA003/descontar").header("Authorization", token("CLIENTE"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"cantidad\":1}"))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/productos/GA003/descontar").header("Authorization", token("SERVICIO"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"cantidad\":1}"))
                .andExpect(status().isOk());
        mvc.perform(post("/api/productos/GA003/descontar").header("Authorization", token("SERVICIO"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"cantidad\":999}"))
                .andExpect(status().isConflict());
    }
}

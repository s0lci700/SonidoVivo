package cl.sonidovivo.usuarios;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.hasKey;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.jayway.jsonpath.JsonPath;

// Flujo real: login contra H2 con los usuarios de DatosIniciales, token emitido por JwtService.
@SpringBootTest
@AutoConfigureMockMvc
class SeguridadUsuariosTest {

    @Autowired
    private MockMvc mvc;

    private String login(String correo, String password) throws Exception {
        String json = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"correo\":\"" + correo + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return "Bearer " + JsonPath.read(json, "$.token");
    }

    @Test
    void loginCorrectoDevuelveTokenYRol() throws Exception {
        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"correo\":\"admin@sonidovivo.cl\",\"password\":\"Admin123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.rol").value("ADMINISTRADOR"))
                .andExpect(jsonPath("$.expiraEn").isNumber());
    }

    @Test
    void loginConClaveIncorrectaDa401() throws Exception {
        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"correo\":\"admin@sonidovivo.cl\",\"password\":\"otra\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Credenciales incorrectas"));
    }

    @Test
    void meSinTokenDa401() throws Exception {
        mvc.perform(get("/auth/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void meConTokenDevuelveUsuarioYRol() throws Exception {
        mvc.perform(get("/auth/me").header("Authorization", login("vendedor@sonidovivo.cl", "Vendedor123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("vendedor@sonidovivo.cl"))
                .andExpect(jsonPath("$.rol").value("VENDEDOR"));
    }

    @Test
    void registroCreaSiempreUnCliente() throws Exception {
        mvc.perform(post("/auth/registro").contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"Ana\",\"correo\":\"ana@correo.cl\",\"password\":\"Clave123\",\"rol\":\"ADMINISTRADOR\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rol").value("CLIENTE"))
                .andExpect(jsonPath("$", not(hasKey("password"))));
    }

    @Test
    void registroConClaveDebilDa400() throws Exception {
        mvc.perform(post("/auth/registro").contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"Ana\",\"correo\":\"debil@correo.cl\",\"password\":\"abc\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.password").exists());
    }

    @Test
    void clienteNoPuedeGestionarUsuarios() throws Exception {
        mvc.perform(get("/api/usuarios").header("Authorization", login("cliente@correo.cl", "Cliente123")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminDesactivaUsuarioYEsteYaNoEntra() throws Exception {
        String admin = login("admin@sonidovivo.cl", "Admin123");
        String json = mvc.perform(post("/api/usuarios").header("Authorization", admin)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"Temporal\",\"correo\":\"temp@sonidovivo.cl\",\"password\":\"Temp123\",\"rol\":\"VENDEDOR\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Integer id = JsonPath.read(json, "$.id");
        String tokenTemporal = login("temp@sonidovivo.cl", "Temp123");

        mvc.perform(delete("/api/usuarios/" + id).header("Authorization", admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activo").value(false));

        // Su token sigue firmado y vigente, pero /auth/me consulta la base y lo rechaza.
        mvc.perform(get("/auth/me").header("Authorization", tokenTemporal)).andExpect(status().isUnauthorized());
        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"correo\":\"temp@sonidovivo.cl\",\"password\":\"Temp123\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCambiaElRolDeUnUsuario() throws Exception {
        String admin = login("admin@sonidovivo.cl", "Admin123");
        String json = mvc.perform(post("/auth/registro").contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"Luis\",\"correo\":\"luis@correo.cl\",\"password\":\"Clave123\"}"))
                .andReturn().getResponse().getContentAsString();
        Integer id = JsonPath.read(json, "$.id");
        mvc.perform(put("/api/usuarios/" + id).header("Authorization", admin).contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"Luis\",\"correo\":\"luis@correo.cl\",\"password\":\"\",\"rol\":\"VENDEDOR\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rol").value("VENDEDOR"));
        // La clave no cambió porque se envió vacía.
        login("luis@correo.cl", "Clave123");
    }
}

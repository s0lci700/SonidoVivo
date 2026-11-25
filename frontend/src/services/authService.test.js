import { describe, expect, it } from "vitest";
import {
  cerrarSesion,
  estaAutenticado,
  iniciarSesion,
  obtenerSesion,
  validarSesion,
} from "./authService";
import { guardarSesion } from "./sesion";

// fetch está reemplazado por el backend falso de src/test/apiSimulada.js.
describe("authService", () => {
  it("guarda token, nombre y rol en sessionStorage, sin la contraseña", async () => {
    expect(await iniciarSesion("admin@sonidovivo.cl", "Admin123")).toBe(true);
    const guardado = JSON.parse(sessionStorage.getItem("sesion"));
    expect(guardado).toMatchObject({ correo: "admin@sonidovivo.cl", rol: "ADMINISTRADOR" });
    expect(guardado.token).toBeTruthy();
    expect(JSON.stringify(guardado)).not.toContain("Admin123");
  });

  it("devuelve false con credenciales incorrectas", async () => {
    expect(await iniciarSesion("admin@sonidovivo.cl", "otra")).toBe(false);
    expect(estaAutenticado()).toBe(false);
  });

  it("descarta una sesión vencida sin preguntar al servidor", () => {
    guardarSesion({ token: "x", rol: "CLIENTE", expiraEn: Date.now() - 1000 });
    expect(obtenerSesion()).toBeNull();
    expect(sessionStorage.getItem("sesion")).toBeNull();
  });

  it("después de F5 valida el token con GET /auth/me", async () => {
    await iniciarSesion("vendedor@sonidovivo.cl", "Vendedor123");
    // Simula F5: la memoria de la página se pierde, sessionStorage se conserva.
    const guardada = obtenerSesion();
    cerrarSesion();
    guardarSesion(guardada);

    const sesion = await validarSesion();
    expect(sesion.rol).toBe("VENDEDOR");
    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringContaining("/auth/me"),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: `Bearer ${guardada.token}` }) }),
    );
  });

  it("si /auth/me responde 401 borra la sesión", async () => {
    guardarSesion({ token: "token-INVENTADO", rol: "ADMINISTRADOR", expiraEn: Date.now() + 60_000 });
    expect(await validarSesion()).toBeNull();
    expect(estaAutenticado()).toBe(false);
  });

  it("si el servidor no responde, no da la sesión por válida", async () => {
    await iniciarSesion("cliente@correo.cl", "Cliente123");
    const guardada = obtenerSesion();
    cerrarSesion();
    guardarSesion(guardada);
    fetch.mockImplementationOnce(() => Promise.reject(new TypeError("Failed to fetch")));
    await expect(validarSesion()).rejects.toMatchObject({ estado: 0 });
    // La sesión sigue guardada para poder reintentar.
    expect(estaAutenticado()).toBe(true);
  });

  it("cerrarSesion borra la sesión", async () => {
    await iniciarSesion("cliente@correo.cl", "Cliente123");
    cerrarSesion();
    expect(obtenerSesion()).toBeNull();
  });
});

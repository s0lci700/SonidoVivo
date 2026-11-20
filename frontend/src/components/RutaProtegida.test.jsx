import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RutaProtegida } from "./RutaProtegida";
import { cerrarSesion, iniciarSesion, obtenerSesion } from "../services/authService";
import { guardarSesion } from "../services/sesion";

function renderRuta(roles) {
  render(
    <MemoryRouter initialEntries={["/privada"]}>
      <Routes>
        <Route
          path="/privada"
          element={
            <RutaProtegida roles={roles}>
              <p>Contenido privado</p>
            </RutaProtegida>
          }
        />
        <Route path="/login" element={<p>Página de login</p>} />
        <Route path="/sin-permiso" element={<p>Sin permiso</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

// Simula F5: se conserva sessionStorage, se pierde lo que estaba en memoria.
function recargar() {
  const guardada = obtenerSesion();
  cerrarSesion();
  guardarSesion(guardada);
}

// fetch está reemplazado por el backend falso de src/test/apiSimulada.js.
describe("RutaProtegida", () => {
  it("sin sesión redirige al login", () => {
    renderRuta();
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });

  it("con sesión y rol permitido muestra el contenido", async () => {
    await iniciarSesion("admin@sonidovivo.cl", "Admin123");
    renderRuta(["ADMINISTRADOR"]);
    expect(await screen.findByText("Contenido privado")).toBeInTheDocument();
  });

  it("con un rol no permitido lleva a /sin-permiso", async () => {
    await iniciarSesion("cliente@correo.cl", "Cliente123");
    renderRuta(["ADMINISTRADOR"]);
    expect(await screen.findByText("Sin permiso")).toBeInTheDocument();
  });

  it("tras F5 confirma la sesión con /auth/me antes de mostrar", async () => {
    await iniciarSesion("vendedor@sonidovivo.cl", "Vendedor123");
    recargar();
    renderRuta(["VENDEDOR"]);
    expect(screen.getByRole("status")).toHaveTextContent("Verificando sesión");
    expect(await screen.findByText("Contenido privado")).toBeInTheDocument();
    expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining("/auth/me"), expect.anything());
  });

  it("si el servidor rechaza el token (401) vuelve al login", async () => {
    guardarSesion({ token: "token-FALSO", rol: "ADMINISTRADOR", expiraEn: Date.now() + 60_000 });
    renderRuta(["ADMINISTRADOR"]);
    expect(await screen.findByText("Página de login")).toBeInTheDocument();
    expect(obtenerSesion()).toBeNull();
  });

  it("si el servidor no responde ofrece Reintentar", async () => {
    await iniciarSesion("admin@sonidovivo.cl", "Admin123");
    recargar();
    fetch.mockImplementationOnce(() => Promise.reject(new TypeError("Failed to fetch")));
    renderRuta(["ADMINISTRADOR"]);
    fireEvent.click(await screen.findByRole("button", { name: "Reintentar" }));
    expect(await screen.findByText("Contenido privado")).toBeInTheDocument();
  });
});

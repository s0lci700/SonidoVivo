import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Admin } from "./Admin";
import { iniciarSesion, obtenerSesion } from "../services/authService";
import { actualizarProducto } from "../services/productoService";

function renderAdmin() {
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<p>Página de login</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

// Tipo: componente (render con datos asíncronos) e integración con los servicios.
describe("Admin", () => {
  beforeEach(() => {
    localStorage.clear();
    iniciarSesion("admin@sonidovivo.cl", "Admin123");
  });

  it("saluda al usuario de la sesión", () => {
    renderAdmin();
    expect(
      screen.getByRole("heading", { name: "Hola, Administrador Sonido Vivo" }),
    ).toBeInTheDocument();
  });

  it("lista en «Por reponer» un producto agotado", async () => {
    await actualizarProducto("GA001", { stock: 0 });
    renderAdmin();
    const fila = await screen.findByRole("link", {
      name: /Guitarra Acústica Folk/,
    });
    expect(fila).toHaveAttribute("href", "/admin/productos/GA001");
    expect(screen.getByText("Agotado")).toBeInTheDocument();
  });

  it("Cerrar sesión borra la sesión y lleva al login", () => {
    renderAdmin();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(obtenerSesion()).toBeNull();
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });
});

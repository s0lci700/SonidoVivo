import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AdminUsuarioForm } from "./AdminUsuarioForm";
import { iniciarSesion } from "../services/authService";

function renderForm() {
  render(
    <MemoryRouter initialEntries={["/admin/usuarios/nuevo"]}>
      <Routes>
        <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioForm />} />
        <Route path="/admin/usuarios" element={<p>Lista de usuarios</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function llenar(correo) {
  fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nueva Vendedora" } });
  fireEvent.change(screen.getByLabelText("Correo"), { target: { value: correo } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Clave123" } });
  fireEvent.change(screen.getByLabelText("Rol"), { target: { value: "VENDEDOR" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
}

// fetch está reemplazado por el backend falso de src/test/apiSimulada.js.
describe("AdminUsuarioForm", () => {
  beforeEach(() => iniciarSesion("admin@sonidovivo.cl", "Admin123"));

  it("valida antes de enviar", () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(screen.getByText("Ingresa el nombre.")).toBeInTheDocument();
    expect(screen.getByText("Mínimo 6 caracteres y una mayúscula.")).toBeInTheDocument();
    expect(screen.getByText("Elige un rol.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalledWith(expect.stringContaining("/api/usuarios"), expect.anything());
  });

  it("crea el usuario y vuelve a la lista", async () => {
    renderForm();
    llenar("nueva@sonidovivo.cl");
    expect(await screen.findByText("Lista de usuarios")).toBeInTheDocument();
  });

  it("muestra el error del backend si el correo ya existe (409)", async () => {
    renderForm();
    llenar("vendedor@sonidovivo.cl");
    expect(await screen.findByRole("alert")).toHaveTextContent("Ya existe una cuenta con ese correo");
  });
});

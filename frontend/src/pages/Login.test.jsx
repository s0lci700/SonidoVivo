import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Login } from "./Login";
import { iniciarSesion } from "../services/authService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../services/authService");

function renderLogin() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

// Tipo: estado e interacción. Login usa useNavigate: renderizar dentro de <MemoryRouter>.
describe("Login", () => {
  it("el campo correo refleja lo que escribe el usuario", () => {
    renderLogin();
    const correo = screen.getByLabelText("Correo");
    fireEvent.change(correo, { target: { value: "admin@sonidovivo.cl" } });
    expect(correo).toHaveValue("admin@sonidovivo.cl");
  });

  it("no muestra mensaje de error antes de enviar el formulario", () => {
    renderLogin();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it('muestra "Credenciales incorrectas" cuando iniciarSesion (vi.mock) devuelve false', () => {
    iniciarSesion.mockReturnValue(false);
    renderLogin();

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "otro@correo.cl" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "ClaveMala1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(iniciarSesion).toHaveBeenCalledWith("otro@correo.cl", "ClaveMala1");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Credenciales incorrectas",
    );
  });
});
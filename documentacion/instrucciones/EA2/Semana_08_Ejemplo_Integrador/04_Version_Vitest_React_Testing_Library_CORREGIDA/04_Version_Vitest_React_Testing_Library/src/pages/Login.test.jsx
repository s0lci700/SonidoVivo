import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "./Login.jsx";

function renderLogin() {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<h1>Panel de prueba</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Login", () => {
  it("muestra error cuando los campos están vacíos", () => {
    renderLogin();

    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Debe completar usuario y contraseña.",
    );
  });

  it("muestra error para credenciales incorrectas", () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText("Usuario"), {
      target: { value: "otro" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Credenciales incorrectas.");
  });

  it("guarda sesión y navega a admin con credenciales válidas", () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText("Usuario"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByRole("heading", { name: "Panel de prueba" })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("usuarioActual"))).toEqual({
      usuario: "admin",
      rol: "ADMIN",
    });
  });
});

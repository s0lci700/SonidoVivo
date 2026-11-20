import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Checkout } from "./Checkout";
import { cerrarSesion, iniciarSesion } from "../services/authService";

const carrito = [{ codigo: "GA001", nombre: "Guitarra Folk", precio: 1000, stock: 2, cantidad: 2 }];

function renderCheckout(onVaciar) {
  render(
    <MemoryRouter>
      <Checkout carrito={carrito} onVaciar={onVaciar} />
    </MemoryRouter>,
  );
}

// Tipo: formulario con validaciones e interacción, con mock de onVaciar.
describe("Checkout", () => {
  beforeEach(() => iniciarSesion("cliente@correo.cl", "Cliente123"));

  it("sin sesión pide iniciar sesión antes de comprar", () => {
    cerrarSesion();
    renderCheckout(vi.fn());
    expect(screen.getByRole("link", { name: "Ingresar" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Pagar/ })).not.toBeInTheDocument();
  });

  it("muestra el resumen con el total del carrito", () => {
    renderCheckout(vi.fn());
    expect(screen.getByText("Guitarra Folk")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pagar \$2\.000/ })).toBeInTheDocument();
  });

  it("con el formulario vacío muestra errores y no vacía el carrito", () => {
    const onVaciar = vi.fn();
    renderCheckout(onVaciar);
    fireEvent.click(screen.getByRole("button", { name: /Pagar/ }));
    expect(screen.getByText("Ingresa tu nombre.")).toBeInTheDocument();
    expect(screen.getByText("Elige una región.")).toBeInTheDocument();
    expect(onVaciar).not.toHaveBeenCalled();
  });

  it("con retiro en tienda y datos válidos crea el pedido y vacía el carrito", async () => {
    const onVaciar = vi.fn();
    renderCheckout(onVaciar);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Sol" } });
    fireEvent.change(screen.getByLabelText("Apellidos"), { target: { value: "León" } });
    fireEvent.click(screen.getByLabelText(/Retiro en tienda/));
    fireEvent.click(screen.getByRole("button", { name: /Pagar/ }));
    await waitFor(() => expect(onVaciar).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/pedidos"),
      expect.objectContaining({ method: "POST" }),
    );
  });
});

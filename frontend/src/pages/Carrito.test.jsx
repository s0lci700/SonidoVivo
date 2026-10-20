import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Carrito } from "./Carrito";

const carrito = [{ codigo: "GA001", nombre: "Guitarra Folk", precio: 1000, stock: 5, cantidad: 2 }];

function renderCarrito(lineas, onCambiarCantidad = vi.fn()) {
  render(
    <MemoryRouter>
      <Carrito carrito={lineas} onCambiarCantidad={onCambiarCantidad} />
    </MemoryRouter>,
  );
}

// Tipo: componente que solo muestra props y avisa hacia arriba (mock de onCambiarCantidad).
describe("Carrito", () => {
  it("el botón + pide la cantidad siguiente", () => {
    const onCambiarCantidad = vi.fn();
    renderCarrito(carrito, onCambiarCantidad);
    fireEvent.click(screen.getByRole("button", { name: /Aumentar cantidad/ }));
    expect(onCambiarCantidad).toHaveBeenCalledWith("GA001", 3);
  });

  it("muestra un aviso cuando el carrito está vacío", () => {
    renderCarrito([]);
    expect(screen.getByRole("heading", { name: "Tu carrito está vacío" })).toBeInTheDocument();
  });

  it("muestra el total del carrito", () => {
    renderCarrito(carrito);
    expect(screen.getByText("Total $2.000")).toBeInTheDocument();
  });
});

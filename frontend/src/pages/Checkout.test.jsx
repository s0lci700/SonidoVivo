import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Checkout } from "./Checkout";

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

  it("con retiro en tienda y datos válidos vacía el carrito", () => {
    const onVaciar = vi.fn();
    renderCheckout(onVaciar);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Sol" } });
    fireEvent.change(screen.getByLabelText("Apellidos"), { target: { value: "León" } });
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "sol@correo.cl" } });
    fireEvent.click(screen.getByLabelText(/Retiro en tienda/));
    fireEvent.click(screen.getByRole("button", { name: /Pagar/ }));
    expect(onVaciar).toHaveBeenCalledTimes(1);
  });
});

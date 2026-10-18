import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Item } from "./Item";

// Para testear
const producto = {
  codigo: "GA001",
  nombre: "Guitarra Acústica Folk",
  marca: "Yamaha",
  modelo: "F310",
  precio: 129990,
  stock: 8,
  descripcion: "Tapa de abeto.",
};

// Tipo: componente (renderizado, props, renderizado condicional) y mock.
describe("Item", () => {
  
  it("muestra nombre, marca y precio formateado en CLP", () => {
    render(<Item {...producto} />);
    expect(
      screen.getByRole("heading", { name: "Guitarra Acústica Folk" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Yamaha · F310")).toBeInTheDocument();
    expect(screen.getByText("$129.990")).toBeInTheDocument();
  });
  
  it("no muestra el botón Agregar si no recibe onAgregar", () => {
    render(<Item {...producto} />);
    expect(
      screen.queryByRole("button", { name: "Agregar" }),
    ).not.toBeInTheDocument();
  });
  
  it("deshabilita el botón Agregar cuando el stock es 0", () => {
    render(<Item {...producto} stock={0} onAgregar={() => {}} />);
    expect(screen.getByRole("button", { name: "Agregar" })).toBeDisabled();
  });

  it("llama a onAgregar (vi.fn) al hacer clic en Agregar", () => {
    const alAgregar = vi.fn();
    render(
      <Item
        {...producto}
        onAgregar={alAgregar}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(alAgregar).toHaveBeenCalledTimes(1);
    expect(alAgregar).toHaveBeenCalledWith({ codigo: producto.codigo, nombre: producto.nombre, precio: producto.precio, stock: producto.stock })
  });
});

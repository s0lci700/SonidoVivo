import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductoCard from "./ProductoCard.jsx";

const producto = {
  id: 1,
  nombre: "Mouse inalámbrico",
  precio: 19990,
  categoria: "Accesorios",
  imagen: "/images/productos/mouse-inalambrico.svg",
};

describe("ProductoCard", () => {
  it("muestra nombre y categoría", () => {
    render(<ProductoCard producto={producto} />);

    expect(screen.getByRole("heading", { name: "Mouse inalámbrico" })).toBeInTheDocument();
    expect(screen.getByText("Accesorios")).toBeInTheDocument();
  });

  it("muestra el precio formateado", () => {
    render(<ProductoCard producto={producto} />);

    expect(screen.getByText("$19.990")).toBeInTheDocument();
  });
});

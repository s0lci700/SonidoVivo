import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DetalleProducto } from "./DetalleProducto";

function renderEn(ruta, onAgregar = vi.fn()) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="producto/:codigo" element={<DetalleProducto onAgregar={onAgregar} />} />
      </Routes>
    </MemoryRouter>,
  );
}

// Tipo: página con ruta dinámica (useParams), carga asíncrona y mock de onAgregar.
describe("DetalleProducto", () => {
  it("muestra el producto del código en la URL", async () => {
    renderEn("/producto/GA001");
    expect(await screen.findByRole("heading", { name: "Guitarra Acústica Folk" })).toBeInTheDocument();
  });

  it("avisa cuando el código no existe", async () => {
    renderEn("/producto/NOEXISTE");
    expect(await screen.findByText("Producto no encontrado")).toBeInTheDocument();
  });

  it("agrega al carrito solo los campos que el carrito usa", async () => {
    const onAgregar = vi.fn();
    renderEn("/producto/GA001", onAgregar);
    fireEvent.click(await screen.findByRole("button", { name: "Agregar al carrito" }));
    expect(onAgregar).toHaveBeenCalledWith({
      codigo: "GA001",
      nombre: "Guitarra Acústica Folk",
      precio: 129990,
      stock: 8,
    });
  });
});

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminProductos } from "./AdminProductos";

function renderAdmin() {
  render(
    <MemoryRouter>
      <AdminProductos />
    </MemoryRouter>,
  );
}

describe("AdminProductos", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("muestra los productos del catálogo", async () => {
    renderAdmin();
    const producto = await screen.findByText("GA001");
    expect(producto).toBeInTheDocument();
  });

  it("Editar enlaza al formulario del producto", async () => {
    renderAdmin();
    const link = await screen.findByRole("link", {
      name: "Editar Guitarra Acústica Folk",
    });
    expect(link).toHaveAttribute("href", "/admin/productos/GA001");
  });

  it("Eliminar quita el producto de la tabla", async () => {
    renderAdmin();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const boton = await screen.findByRole("button", {
      name: "Eliminar Guitarra Acústica Folk",
    });
    fireEvent.click(boton);
    await waitFor(() =>
      expect(screen.queryByText("GA001")).not.toBeInTheDocument(),
    );
  });
  
  it("si se cancela la confirmación, el producto sigue", async () => {
    renderAdmin();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const boton = await screen.findByRole("button", {
      name: "Eliminar Guitarra Acústica Folk",
    });
    fireEvent.click(boton);
    expect(screen.queryByText("GA001")).toBeInTheDocument(),
    expect(window.confirm).toHaveBeenCalledWith("¿Eliminar GA001?");
  });
});

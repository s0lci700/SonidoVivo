import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AdminProductoForm } from "./AdminProductoForm";
import { obtenerProductoPorCodigo } from "../services/productoService";

function renderForm(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<AdminProductoForm />} />
        <Route
          path="/admin/productos/:codigo"
          element={<AdminProductoForm />}
        />
        {/* destino falso: si aparece, navigate() funcionó */}
        <Route path="/admin/productos" element={<p>Lista de productos</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), {
    target: {
      value: valor,
    },
  });
}

describe("AdminProductoForm", () => {
  beforeEach(() => localStorage.clear());

  it("precarga el producto al editar", async () => {
    renderForm("/admin/productos/GA001");
    const producto = await screen.findByDisplayValue("Guitarra Acústica Folk");
    expect(producto).toBeInTheDocument();
  });

  it("bloquea el código al editar", async () => {
    renderForm("/admin/productos/GA001");
    const codigo = await screen.findByDisplayValue("GA001");
    expect(codigo).toBeDisabled();
  });

  it("muestra un error por cada campo vacío", async () => {
    renderForm("/admin/productos/nuevo");
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(await screen.findAllByRole("alert")).toHaveLength(8);
  });

  it("guarda el precio editado y vuelve a la lista", async () => {
    renderForm("/admin/productos/GA001");
    await screen.findByDisplayValue("Guitarra Acústica Folk");
    const boton = await screen.findByRole("button", {
      name: "Guardar",
    });
    fireEvent.change(screen.getByLabelText("Precio (CLP)"), {
      target: { value: "99990" },
    });
    fireEvent.click(boton);
    await screen.findByText("Lista de productos");
    expect((await obtenerProductoPorCodigo("GA001")).precio).toBe(99990);
  });

  it("avisa si el código ya existe", async () => {
    renderForm("/admin/productos/nuevo");
    
    await screen.findByRole("option", {
      name: "Guitarras Acústicas",
    });
    
    escribir("Código", "GA001");
    escribir("Nombre", "Kazoo");
    escribir("Marca", "Test");
    escribir("Modelo", "K1");
    escribir("Categoría", "GA");
    escribir("Precio (CLP)", "5000");
    escribir("Stock", "3");
    escribir("Descripción", "Un kazoo de prueba.");
    
    const boton = await screen.findByRole("button", {
      name: "Guardar",
    });
    
    fireEvent.click(boton);
    expect (await screen.findByText(/Ya existe/)).toBeInTheDocument();
  });
});

import { beforeEach, describe, it, expect } from "vitest";
import {
  obtenerProductoPorCodigo,
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "./productoService";

// Un producto de prueba que NO está en productos.json
const nuevo = {
  codigo: "XX001",
  nombre: "Kazoo",
  marca: "Test",
  modelo: "K1",
  precio: 5000,
  stock: 3,
  categoriaId: "GA",
};

describe("productoService (CRUD)", () => {
  beforeEach(() => localStorage.clear());

  describe("CREATE", () => {
    it("crearProducto agrega el producto al catálogo", async () => {
      await crearProducto(nuevo);
      expect(await obtenerProductoPorCodigo("XX001")).toEqual(nuevo);
    });
    it("rechaza un código que ya existe", async () => {
      await expect(
        crearProducto({ ...nuevo, codigo: "GA001" }),
      ).rejects.toThrow("Ya existe");
    });
  });

  describe("READ", () => {
    it("sin datos guardados lee el catálogo de productos.json", async () => {
      const lista = await obtenerProductos();
      expect(lista.length).toBeGreaterThan(0);
    });
    it("devuelve null si el código no existe", async () => {
      expect(await obtenerProductoPorCodigo("NOPE")).toBeNull();
    });
  });

  describe("UPDATE", () => {
    it("actualizarProducto cambia solo los campos enviados", async () => {
      const actualizado = await actualizarProducto("GA001", { precio: 99990 });
      expect(actualizado.precio).toBe(99990);
      expect(actualizado.nombre).toBe("Guitarra Acústica Folk");
    });
    it("rechaza actualizar un código que no existe", async () => {
      await expect(actualizarProducto("NOPE")).rejects.toThrow(
        "No existe un producto con ese código",
      );
    });
  });
  describe("DELETE", () => {
    it("rechaza eliminar un código que no existe", async () => {
      await expect(eliminarProducto("NOPE")).rejects.toThrow(
        "No existe un producto con ese código",
      );
    });
    it("eliminarProducto lo quita del catálogo", async () => {
      await eliminarProducto("GA001");
      const eliminado = await obtenerProductoPorCodigo("GA001");
      expect(eliminado).toBeNull();
    });
  });
  describe("Persistencia", () => {
    it("guarda los cambios en localStorage", async () => {
      crearProducto(nuevo);
      const lista = await JSON.parse(localStorage.getItem("productos"));
      expect(lista.some((p) => p.codigo === "XX001")).toEqual(true);
    });
  });
});

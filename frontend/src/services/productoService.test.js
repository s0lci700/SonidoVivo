import { beforeEach, describe, it, expect } from "vitest";
import {
  obtenerProductoPorCodigo,
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "./productoService";
import { iniciarSesion } from "./authService";

// fetch está reemplazado por el backend falso de src/test/apiSimulada.js.

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

describe("productoService (API REST)", () => {
  describe("READ (público, sin sesión)", () => {
    it("lee el catálogo desde la API", async () => {
      const lista = await obtenerProductos();
      expect(lista.length).toBeGreaterThan(0);
    });
    it("convierte la categoría del backend a categoriaId + nombre", async () => {
      const p = await obtenerProductoPorCodigo("GA001");
      expect(p.categoriaId).toBe("GA");
      expect(p.categoria).toBe("Guitarras Acústicas");
    });
    it("filtra por categoría", async () => {
      const lista = await obtenerProductos("PE");
      expect(lista.every((p) => p.categoriaId === "PE")).toBe(true);
    });
    it("devuelve null si el código no existe (404)", async () => {
      expect(await obtenerProductoPorCodigo("NOPE")).toBeNull();
    });
  });

  describe("sin sesión", () => {
    it("crear responde 401", async () => {
      await expect(crearProducto(nuevo)).rejects.toMatchObject({ estado: 401 });
    });
  });

  describe("como CLIENTE", () => {
    beforeEach(() => iniciarSesion("cliente@correo.cl", "Cliente123"));
    it("crear responde 403 y la sesión se conserva", async () => {
      await expect(crearProducto(nuevo)).rejects.toMatchObject({ estado: 403 });
    });
  });

  describe("como ADMINISTRADOR", () => {
    beforeEach(() => iniciarSesion("admin@sonidovivo.cl", "Admin123"));

    it("crearProducto agrega el producto al catálogo", async () => {
      await crearProducto(nuevo);
      expect(await obtenerProductoPorCodigo("XX001")).toMatchObject(nuevo);
    });
    it("rechaza un código que ya existe (409)", async () => {
      await expect(crearProducto({ ...nuevo, codigo: "GA001" })).rejects.toThrow("Ya existe");
    });
    it("actualizarProducto cambia solo los campos enviados", async () => {
      const actualizado = await actualizarProducto("GA001", { precio: 99990 });
      expect(actualizado.precio).toBe(99990);
      expect(actualizado.nombre).toBe("Guitarra Acústica Folk");
    });
    it("rechaza actualizar un código que no existe", async () => {
      await expect(actualizarProducto("NOPE")).rejects.toThrow("No existe un producto con ese código");
    });
    it("eliminarProducto lo quita del catálogo", async () => {
      await eliminarProducto("GA001");
      expect(await obtenerProductoPorCodigo("GA001")).toBeNull();
    });
    it("rechaza eliminar un código que no existe (404)", async () => {
      await expect(eliminarProducto("NOPE")).rejects.toMatchObject({ estado: 404 });
    });
  });
});

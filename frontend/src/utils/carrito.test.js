import { describe, expect, it } from "vitest";
import {
  limitarCantidad,
  agregarProducto,
  quitarProducto,
  cambiarCantidad,
  calcularTotal,
} from "./carrito";

describe("limitarCantidad", () => {
  it("limita la cantidad del carrito con el stock del producto", () => {
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };
    expect(limitarCantidad(10, guitarra.stock)).toEqual(2);
    expect(limitarCantidad(-6, guitarra.stock)).toEqual(1);
  });
});

describe("agregarProducto", () => {
  it("agrega un producto al carrito", () => {
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };
    const car1 = agregarProducto([], guitarra);
    expect(car1).toEqual([{ ...guitarra, cantidad: 1 }]);
  });
  it("aumenta la cantidad de un producto ya existente en el carrito", () => {
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };
    const car1 = agregarProducto([], guitarra);
    const car2 = agregarProducto(car1, guitarra);
    expect(car2).toEqual([{ ...guitarra, cantidad: 2 }]);
  });
  it("no pasa del stock del producto", () => {
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };
    const car1 = agregarProducto([], guitarra);
    const car2 = agregarProducto(car1, guitarra);
    const car3 = agregarProducto(car2, guitarra);
    expect(car3).toEqual([{ ...guitarra, cantidad: 2 }]);
  });
});

describe("quitarProducto", () => {
  it("quita solo el producto indicado", () => {
    const bajo = { codigo: "BA003", precio: 2000, stock: 3 };
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };

    expect(
      quitarProducto([{ ...guitarra, cantidad: 1 }], guitarra.codigo),
    ).toHaveLength(0);

    expect(
      quitarProducto(
        [
          { ...guitarra, cantidad: 2 },
          { ...bajo, cantidad: 1 },
        ],
        guitarra.codigo,
      ),
    ).toEqual([{ ...bajo, cantidad: 1 }]);
  });

  it("no cambia nada si el código no está", () => {
    const bajo = { codigo: "BA003", precio: 2000, stock: 3 };
    expect(quitarProducto([{ ...bajo, cantidad: 1 }], "GA001")).toEqual([
      { ...bajo, cantidad: 1 },
    ]);
  });
});

describe("cambiarCantidad", () => {
  it("cambia la cantidad del producto", () => {
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };
    const car = [{ ...guitarra, cantidad: 2 }];
    expect(cambiarCantidad(car, "GA001", 1)).toEqual([
      { ...guitarra, cantidad: 1 },
    ]);
  });
  it("no pasa del stock del producto", () => {
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };
    const car = [{ ...guitarra, cantidad: 2 }];
    expect(cambiarCantidad(car, "GA001", 5)).toEqual([
      { ...guitarra, cantidad: 2 },
    ]);
  });
  it("no baja de 1", () => {
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };
    const car = [{ ...guitarra, cantidad: 2 }];
    expect(cambiarCantidad(car, "GA001", -3)).toEqual([
      { ...guitarra, cantidad: 1 },
    ]);
  });
  it("cambia solo el producto indicado", () => {
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };
    const bajo = { codigo: "BA003", precio: 2000, stock: 3 };
    const car = [
      { ...guitarra, cantidad: 2 },
      { ...bajo, cantidad: 1 },
    ];
    expect(cambiarCantidad(car, "BA003", 3)).toEqual([
      { ...guitarra, cantidad: 2 },
      { ...bajo, cantidad: 3 },
    ]);
  });
  it("no cambia nada si el código no está", () => {
    const bajo = { codigo: "BA003", precio: 2000, stock: 3 };
    const car = [{ ...bajo, cantidad: 2 }];
    expect(cambiarCantidad(car, "GA001", 5)).toEqual([
      { ...bajo, cantidad: 2 },
    ]);
  });
});

describe("calcularTotal", () => {
  it("calcula el precio total", () => {
    const bajo = { codigo: "BA003", precio: 2000, stock: 3 };
    const guitarra = { codigo: "GA001", precio: 1000, stock: 2 };
    const car = [
      { ...bajo, cantidad: 2 },
      { ...guitarra, cantidad: 1 },
    ];
    expect(calcularTotal(car)).toBe(5000);
  });
  it("devuelve 0 si el carrito está vacío", () => {
    const car = [];
    expect(calcularTotal(car)).toBe(0);
  });
});

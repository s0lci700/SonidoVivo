import { describe, it, expect } from 'vitest';
import { 
  validarTexto, 
  validarCorreo, 
  validarPassword,
  validarPrecio, 
  validarStock } from './validaciones';
// Tipo: lógica y validaciones.

// texto
describe("validarTexto", () => {
  it("acepta texto con largo mínimo", () => {
    expect(validarTexto("Ana", 3)).toBe(true);
  });

  it("rechaza texto demasiado corto", () => {
    expect(validarTexto("Al", 3)).toBe(false);
  });
});

// Correo
describe("validarCorreo", () => {
  it("acepta un correo simple válido", () => {
    expect(validarCorreo("docente@duoc.cl")).toBe(true);
  });

  it("rechaza un correo sin arroba", () => {
    expect(validarCorreo("docente.duoc.cl")).toBe(false);
  });

  it("rechaza un correo sin dominio", () => {
    expect(validarCorreo("docente@duoc")).toBe(false);
  });
});

// Password
describe("validarPassword", () => {
  it("acepta una password valida", () => {
    expect(validarPassword("Pass123")).toBe(true);
  });

  it("rechaza una password de longitud menor a 6", () => {
    expect(validarPassword("Pass1")).toBe(false);
  });

  it("rechaza una password sin mayusculas", () => {
    expect(validarPassword("pass123")).toBe(false);
  });
})

// Precio
describe('validarPrecio', () => {
  it("acepta un precio valido", () => {
    expect(validarPrecio(2500)).toBe(true);
  });

  it("rechaza un precio menor o igual a 0", () => {
    expect(validarPrecio(0)).toBe(false);
    expect(validarPrecio(-1)).toBe(false);
  });

  it("rechaza un precio que no sea un numero entero", () => {
    expect(validarPrecio(0.5)).toBe(false);
  });

  it("rechaza un precio que no sea un numero", () => {
    expect(validarPrecio("a")).toBe(false);
    expect(validarPrecio("")).toBe(false);
    expect(validarPrecio({a:0})).toBe(false);
  });
})

// Stock
describe("validarStock", () => {
  it("acepta un stock valido", () => {
    expect(validarStock(3)).toBe(true);
  });

  it("rechaza un stock menor a 0", () => {
    expect(validarStock(-1)).toBe(false);
  });
})
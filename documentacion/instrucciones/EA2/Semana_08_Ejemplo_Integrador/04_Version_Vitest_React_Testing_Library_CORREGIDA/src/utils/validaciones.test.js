import { describe, expect, it } from "vitest";
import { validarCorreo, validarTexto } from "./validaciones.js";

describe("validarTexto", () => {
  it("acepta texto con largo mínimo", () => {
    expect(validarTexto("Ana", 3)).toBe(true);
  });

  it("rechaza texto demasiado corto", () => {
    expect(validarTexto("Al", 3)).toBe(false);
  });
});

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

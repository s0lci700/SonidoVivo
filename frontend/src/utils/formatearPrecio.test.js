import { describe, expect, it } from "vitest";
import { formatearPrecio } from "./formatearPrecio";

// Tipo: unitaria (función pura).
describe("formatearPrecio", () => {
  it("antepone $ y separa los miles con punto", () => {
    expect(formatearPrecio(129990)).toBe("$129.990");
  });

  it("formatea millones", () => {
    expect(formatearPrecio(1249990)).toBe("$1.249.990");
  });

  it("deja sin separador los montos bajo mil", () => {
    expect(formatearPrecio(990)).toBe("$990");
  });

  it("formatea el cero", () => {
    expect(formatearPrecio(0)).toBe("$0");
  });
});

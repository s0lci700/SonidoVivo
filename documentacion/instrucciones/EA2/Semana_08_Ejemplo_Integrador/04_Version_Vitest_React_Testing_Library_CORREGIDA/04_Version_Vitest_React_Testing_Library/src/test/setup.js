import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Preparación común para todas las pruebas de React.
 * Cada test comienza sin una sesión almacenada.
 * Al terminar, se desmontan los componentes renderizados.
 */
beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

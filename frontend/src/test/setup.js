import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { simularApi } from './apiSimulada';
import { cerrarSesion } from '../services/authService';

// Node 25 trae su propio localStorage/sessionStorage experimental, que tapa al de jsdom y,
// sin --localstorage-file, no tiene clear() ni getItem(). Si pasa eso, se usa uno en memoria.
class AlmacenMemoria {
  #datos = new Map();
  get length() { return this.#datos.size; }
  key(i) { return [...this.#datos.keys()][i] ?? null; }
  getItem(clave) { return this.#datos.has(clave) ? this.#datos.get(clave) : null; }
  setItem(clave, valor) { this.#datos.set(clave, String(valor)); }
  removeItem(clave) { this.#datos.delete(clave); }
  clear() { this.#datos.clear(); }
}
for (const nombre of ['localStorage', 'sessionStorage']) {
  if (typeof globalThis[nombre]?.clear !== 'function') {
    Object.defineProperty(globalThis, nombre, { value: new AlmacenMemoria(), configurable: true, writable: true });
  }
}

// Cada prueba parte sin sesión y con un backend falso recién cargado.
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  cerrarSesion();
  simularApi();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

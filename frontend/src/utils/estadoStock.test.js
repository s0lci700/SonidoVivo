import { describe, it, expect } from 'vitest';
import { estadoStock } from './estadoStock.js';
describe('estadoStock', () => {
it('retorna el estado correcto para stock 0', () => {
expect(estadoStock(0)).toEqual({ texto: "Agotado", color: "text-tinta-600", punto: "bg-tinta-600" });
});
it('retorna el estado correcto para stock 3', () => {
expect(estadoStock(3)).toEqual({ texto: "Últimas 3 unidades", color: "text-cobre-600", punto: "bg-cobre-600" });
});
it('retorna el estado correcto para stock 8', () => {
expect(estadoStock(8)).toEqual({ texto: "En stock · 8 disponibles", color: "text-patina-600", punto: "bg-patina-600" });
});
});
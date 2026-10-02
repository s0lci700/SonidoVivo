import { describe, it, expect } from 'vitest';
import { sumar } from './calculos.js';
describe('sumar', () => {
it('suma dos números', () => {
expect(sumar(2, 3)).toBe(5);
});
});
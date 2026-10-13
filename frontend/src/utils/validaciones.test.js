import { describe, it } from 'vitest';

// Tipo: lógica y validaciones.
describe('validaciones', () => {
  it.todo('validarCorreo acepta un correo bien formado y rechaza uno sin @');
  it.todo('validarTexto rechaza un texto más corto que el mínimo');
  it.todo('validarPrecio rechaza 0, negativos y decimales');
});

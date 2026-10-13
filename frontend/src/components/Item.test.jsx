import { describe, it } from 'vitest';

// Tipo: componente (renderizado, props, renderizado condicional) y mock.
describe('Item', () => {
  it.todo('muestra nombre, marca y precio formateado en CLP');
  it.todo('no muestra el botón Agregar si no recibe onAgregar');
  it.todo('deshabilita el botón Agregar cuando el stock es 0');
  it.todo('llama a onAgregar (vi.fn) al hacer clic en Agregar');
});

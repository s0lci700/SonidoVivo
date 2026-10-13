import { describe, it } from 'vitest';

// Tipo: estado e interacción. Login usa useNavigate: renderizar dentro de <MemoryRouter>.
describe('Login', () => {
  it.todo('el campo correo refleja lo que escribe el usuario');
  it.todo('no muestra mensaje de error antes de enviar el formulario');
  it.todo('muestra "Credenciales incorrectas" cuando iniciarSesion (vi.mock) devuelve false');
});

// TODO: login controlado (referencia: Login.jsx de 03_Version_Login_Admin_LocalStorage).
//   - useState para correo, password y error.
//   - Al enviar: campos obligatorios -> iniciarSesion(correo, password) de services/authService
//     -> useNavigate("/admin") o mensaje "Credenciales incorrectas" con role="alert".
//   - Enlace a /registro.
export function Login() {
  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">Iniciar sesión</h1>
      <p className="text-tinta-600">Pendiente: formulario de login.</p>
    </section>
  );
}

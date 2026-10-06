/** Página equivalente a login.html. El login funcional se agrega en Versión 03. */
export default function Login() {
  return (
    <section className="form-card">
      <h2>Login administrador</h2>
      <p>En esta etapa solo migramos el formulario a JSX.</p>

      <form>
        <div className="form-group">
          <label htmlFor="usuario">Usuario</label>
          <input id="usuario" type="text" />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" />
        </div>

        <button className="primary" type="button">
          Ingresar
        </button>
      </form>
    </section>
  );
}

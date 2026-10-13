import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../auth/auth.js";

/**
 * Login controlado.
 * La validación de credenciales está encapsulada en auth.js.
 */
export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function ingresar(event) {
    event.preventDefault();
    setError("");

    if (!usuario.trim() || !password) {
      setError("Debe completar usuario y contraseña.");
      return;
    }

    if (!iniciarSesion(usuario.trim(), password)) {
      setError("Credenciales incorrectas.");
      return;
    }

    navigate("/admin");
  }

  return (
    <section className="form-card">
      <h2>Login administrador</h2>
      <p>Credenciales de prueba: <strong>admin / admin123</strong></p>

      <form onSubmit={ingresar} noValidate>
        <div className="form-group">
          <label htmlFor="usuario">Usuario</label>
          <input id="usuario" value={usuario} onChange={(event) => setUsuario(event.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button className="primary" type="submit">Ingresar</button>

        {error && <div className="mensaje error" role="alert">{error}</div>}
      </form>
    </section>
  );
}

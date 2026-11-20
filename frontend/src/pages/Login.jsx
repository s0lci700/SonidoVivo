import { useState } from "react";
import { iniciarSesion, obtenerSesion, rutaInicio } from "../services/authService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Campo } from "../components/Campo";
import { Boton } from "../components/Boton";

const usuarioVacio = { correo: "", password: "" };

export function Login() {
  const [usuario, setUsuario] = useState(usuarioVacio);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  // Si RutaProtegida lo mandó aquí, vuelve a esa página después de entrar.
  const desde = useLocation().state?.desde;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recargar la página
    setError("");
    if (!usuario.correo || !usuario.password) {
      setError("Ingrese su correo y su contraseña");
      return;
    }
    setEnviando(true);
    try {
      const entro = await iniciarSesion(usuario.correo, usuario.password);
      if (!entro) {
        setError("Credenciales incorrectas");
        return;
      }
      navigate(desde ?? rutaInicio(obtenerSesion()?.rol), { replace: true });
    } catch (err) {
      // Backend apagado u otro error: la contraseña nunca se guarda.
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="mx-auto max-w-sm">
      <h1 className="mb-4 font-display text-4xl">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Campo
          etiqueta="Correo"
          nombre="correo"
          tipo="email"
          value={usuario.correo}
          onChange={handleChange}
        />

        <Campo
          etiqueta="Contraseña"
          nombre="password"
          tipo="password"
          value={usuario.password}
          onChange={handleChange}
        />

        <Boton tipo="submit" deshabilitado={enviando}>
          {enviando ? "Ingresando…" : "Ingresar"}
        </Boton>
        {error && (
          <p role="alert" className="text-sm text-cobre-600">
            {error}
          </p>
        )}
      </form>
      <p className="mt-6 text-sm text-tinta-600">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="font-semibold text-laton-800 underline underline-offset-4">
          Crear cuenta
        </Link>
      </p>
    </section>
  );
}

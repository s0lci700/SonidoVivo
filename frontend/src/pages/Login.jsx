import { useState } from "react";
import { iniciarSesion } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Campo } from "../components/Campo";
import { Boton } from "../components/Boton";

const usuarioVacio = { correo: "", password: "" };

export function Login() {
  const [usuario, setUsuario] = useState(usuarioVacio);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita recargar la página
    setError("");
    if (!usuario.correo || !usuario.password) {
      setError("Ingrese su correo y su contraseña");
      return;
    }
    if (!iniciarSesion(usuario.correo, usuario.password)) {
      setError("Credenciales incorrectas");
      return;
    }
    navigate("/admin");
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

        <Boton tipo="submit">Ingresar</Boton>
        {error && (
          <p role="alert" className="text-sm text-cobre-600">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

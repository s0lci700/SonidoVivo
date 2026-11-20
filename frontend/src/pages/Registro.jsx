import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boton } from "../components/Boton";
import { Campo } from "../components/Campo";
import { registrarUsuario } from "../services/authService";
import { validarCorreo, validarPassword, validarTexto } from "../utils/validaciones";

const vacio = { nombre: "", correo: "", password: "", repetir: "" };

// Registro público de clientes (RF-36, Figura 3 del Anexo 1).
// El backend vuelve a validar todo y siempre crea el rol CLIENTE.
export function Registro() {
  const [datos, setDatos] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const nuevos = {};
    if (!validarTexto(datos.nombre, 2)) nuevos.nombre = "Ingresa tu nombre.";
    if (!validarCorreo(datos.correo)) nuevos.correo = "Ingresa un correo válido.";
    if (!validarPassword(datos.password))
      nuevos.password = "Mínimo 6 caracteres y una mayúscula.";
    if (datos.repetir !== datos.password) nuevos.repetir = "Las contraseñas no coinciden.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    try {
      await registrarUsuario(datos);
      navigate("/login", { state: { registrado: true } });
    } catch (err) {
      // 409 correo repetido, 400 con errores por campo, o sin conexión.
      setErrores(err.campos ?? {});
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto max-w-sm">
      <h1 className="mb-4 font-display text-4xl">Crear cuenta</h1>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Campo etiqueta="Nombre" nombre="nombre" value={datos.nombre} onChange={handleChange} error={errores.nombre} />
        <Campo etiqueta="Correo" nombre="correo" tipo="email" value={datos.correo} onChange={handleChange} error={errores.correo} />
        <Campo etiqueta="Contraseña" nombre="password" tipo="password" value={datos.password} onChange={handleChange} error={errores.password} />
        <Campo etiqueta="Repetir contraseña" nombre="repetir" tipo="password" value={datos.repetir} onChange={handleChange} error={errores.repetir} />
        <Boton tipo="submit">Crear cuenta</Boton>
        {error && (
          <p role="alert" className="text-sm text-cobre-600">
            {error}
          </p>
        )}
      </form>
      <p className="mt-6 text-sm text-tinta-600">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-semibold text-laton-800 underline underline-offset-4">
          Ingresar
        </Link>
      </p>
    </section>
  );
}

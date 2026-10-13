import { useState } from "react";
import { validarCorreo, validarTexto } from "../utils/validaciones";
import { Campo } from "../components/Campo";
const formularioVacio = { nombre: "", email: "", mensaje: "" };

export function Contacto() {
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState(formularioVacio);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita recargar la página
    const nuevosErrores = {};
    if (!validarCorreo(formData.email)) {
      nuevosErrores.email = "Email no valido.";
    }
    if (!validarTexto(formData.nombre)) {
      nuevosErrores.nombre = "Ingresa tu nombre (mínimo 3 caracteres).";
    }
    if (!validarTexto(formData.mensaje, 10)) {
      nuevosErrores.mensaje = "Ingresa tu mensaje (mínimo 10 caracteres).";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true);
      setFormData(formularioVacio)
    } else {
      setEnviado(false);
    }
  };
  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">Contacto</h1>
      <div>
        <form onSubmit={handleSubmit} noValidate>
          <Campo
            etiqueta="Nombre"
            nombre="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

          <Campo
            etiqueta="Email"
            tipo='email'
            nombre="email"
            value={formData.email}
            onChange={handleChange}
            error={errores.email}
          />

          <Campo
            multilinea
            etiqueta="Mensaje"
            nombre="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            error={errores.mensaje}
          />

          <button type="submit">Enviar</button>
          {enviado && <p role="status">Mensaje enviado.</p>}
        </form>
      </div>
    </section>
  );
}

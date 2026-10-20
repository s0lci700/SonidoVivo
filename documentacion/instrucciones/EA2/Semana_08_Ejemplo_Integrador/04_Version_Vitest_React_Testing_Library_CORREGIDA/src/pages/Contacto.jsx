import { useState } from "react";
import { validarCorreo, validarTexto } from "../utils/validaciones.js";

/** Formulario controlado con validaciones reutilizables. */
export default function Contacto() {
  const [datos, setDatos] = useState({ nombre: "", correo: "", mensaje: "" });
  const [resultado, setResultado] = useState(null);

  function actualizarCampo(event) {
    const { name, value } = event.target;
    setDatos((actual) => ({ ...actual, [name]: value }));
  }

  function enviar(event) {
    event.preventDefault();

    const esValido =
      validarTexto(datos.nombre, 3) &&
      validarCorreo(datos.correo) &&
      validarTexto(datos.mensaje, 5);

    if (!esValido) {
      setResultado({ tipo: "error", texto: "Revise los datos del formulario." });
      return;
    }

    localStorage.setItem("ultimoContacto", JSON.stringify(datos));
    setResultado({ tipo: "ok", texto: `Gracias ${datos.nombre}. Datos validados.` });
    setDatos({ nombre: "", correo: "", mensaje: "" });
  }

  return (
    <section className="form-card">
      <h2>Contacto</h2>

      <form onSubmit={enviar} noValidate>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" value={datos.nombre} onChange={actualizarCampo} />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo</label>
          <input id="correo" name="correo" type="email" value={datos.correo} onChange={actualizarCampo} />
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea id="mensaje" name="mensaje" rows="5" value={datos.mensaje} onChange={actualizarCampo} />
        </div>

        <button className="primary" type="submit">Enviar</button>

        {resultado && (
          <div className={`mensaje ${resultado.tipo}`} role="status">
            {resultado.texto}
          </div>
        )}
      </form>
    </section>
  );
}

/** Página equivalente a contacto.html. La funcionalidad completa se agrega en Versión 03. */
export default function Contacto() {
  return (
    <section className="form-card">
      <h2>Contacto</h2>
      <p>En esta etapa migramos la estructura. Luego agregaremos state y validaciones.</p>

      <form>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" type="text" />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo</label>
          <input id="correo" type="email" />
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea id="mensaje" rows="5" />
        </div>

        <button className="primary" type="button">
          Enviar
        </button>
      </form>
    </section>
  );
}

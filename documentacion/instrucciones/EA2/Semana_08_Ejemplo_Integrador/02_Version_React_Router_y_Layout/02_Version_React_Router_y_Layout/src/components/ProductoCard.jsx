/**
 * ProductoCard recibe un producto mediante props.
 * Proviene del bloque <article> generado en productos.html.
 */
export default function ProductoCard({ producto }) {
  return (
    <article className="producto-card">
      <img src={producto.imagen} alt={producto.nombre} />

      <div className="producto-body">
        <span className="categoria">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p className="precio">${producto.precio.toLocaleString("es-CL")}</p>
      </div>
    </article>
  );
}

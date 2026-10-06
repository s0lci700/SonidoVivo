/** Página equivalente a admin.html. La protección de ruta se agrega en Versión 03. */
export default function Admin() {
  return (
    <section className="panel">
      <h2>Panel administrador</h2>
      <p>Por ahora esta página es visible sin autenticación.</p>

      <div className="admin-grid">
        <article className="kpi"><strong>4</strong><span>Productos</span></article>
        <article className="kpi"><strong>1</strong><span>Administrador</span></article>
        <article className="kpi"><strong>0</strong><span>Pedidos pendientes</span></article>
      </div>
    </section>
  );
}

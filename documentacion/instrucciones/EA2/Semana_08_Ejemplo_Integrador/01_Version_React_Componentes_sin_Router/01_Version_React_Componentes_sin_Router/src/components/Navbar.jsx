/**
 * Navbar reutilizable.
 * En Versión 01 NO usa URLs: informa a App qué "página" debe mostrar.
 */
export default function Navbar({ paginaActual, onNavegar }) {
  const enlaces = [
    ["inicio", "Inicio"],
    ["productos", "Productos"],
    ["contacto", "Contacto"],
    ["login", "Login"],
    ["admin", "Admin"],
  ];

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        {enlaces.map(([id, texto]) => (
          <button
            key={id}
            className={paginaActual === id ? "active" : ""}
            type="button"
            onClick={() => onNavegar(id)}
          >
            {texto}
          </button>
        ))}
      </div>
    </nav>
  );
}

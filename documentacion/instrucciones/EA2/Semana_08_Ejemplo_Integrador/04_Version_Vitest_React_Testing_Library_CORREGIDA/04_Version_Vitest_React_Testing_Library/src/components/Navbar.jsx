import { NavLink } from "react-router-dom";

/** Navbar de la Versión 02: ahora navega mediante React Router. */
export default function Navbar() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/contacto">Contacto</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </div>
    </nav>
  );
}

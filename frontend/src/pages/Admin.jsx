import { Link } from "react-router-dom";

// TODO: panel de administración (Figura 9 del Anexo 1).
//   - Saludo con obtenerSesion() y botón Cerrar sesión (cerrarSesion + useNavigate("/login")).
//   - Indicadores: total de productos, productos con stock crítico (stock <= 3).
//   - Usuarios, pedidos y reportes quedan para el Parcial 3.
export function Admin() {
  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">Administración</h1>
      <p className="text-tinta-600">Pendiente: panel.</p>
      <Link to="/admin/productos" className="text-laton-800 underline">
        Productos
      </Link>
    </section>
  );
}

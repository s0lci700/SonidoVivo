import { Link } from "react-router-dom";

// TODO: listado de productos para el administrador (la R y la D del CRUD).
//   - Cargar con obtenerProductos() en un useEffect.
//   - Tabla: código, nombre, categoría, precio, stock, acciones (Editar / Eliminar).
//     En 360 px la tabla debe poder leerse (scroll horizontal o tarjetas).
//   - Eliminar: eliminarProducto(codigo) y volver a cargar la lista.
export function AdminProductos() {
  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">Productos</h1>
      <p className="text-tinta-600">Pendiente: tabla de productos.</p>
      <Link to="/admin/productos/nuevo" className="text-laton-800 underline">
        Nuevo producto
      </Link>
    </section>
  );
}

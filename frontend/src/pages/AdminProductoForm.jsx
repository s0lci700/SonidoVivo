import { useParams } from "react-router-dom";

// TODO: formulario de producto (la C y la U del CRUD). La misma página sirve para
//   /admin/productos/nuevo (sin codigo) y /admin/productos/:codigo (editar).
//   - Formulario controlado: código, nombre, marca, modelo, categoría (select), precio, stock, descripción.
//   - Si hay codigo, precargar con obtenerProductoPorCodigo(codigo).
//   - Validar con utils/validaciones (validarTexto, validarPrecio, validarStock).
//   - Guardar con crearProducto / actualizarProducto y volver a /admin/productos.
export function AdminProductoForm() {
  const { codigo } = useParams();

  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">
        {codigo ? `Editar ${codigo}` : "Nuevo producto"}
      </h1>
      <p className="text-tinta-600">Pendiente: formulario de producto.</p>
    </section>
  );
}

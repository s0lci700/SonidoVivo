import { useParams } from "react-router-dom";

// TODO: ficha del producto.
//   - Cargar con obtenerProductoPorCodigo(codigo) en un useEffect.
//   - Imagen, marca · modelo, descripción, precio, estadoStock y botón Agregar (props.onAgregar).
//   - Si el código no existe, mostrar un mensaje y un enlace de vuelta al catálogo.
export function DetalleProducto() {
  const { codigo } = useParams();

  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">Producto {codigo}</h1>
      <p className="text-tinta-600">Pendiente: ficha del producto.</p>
    </section>
  );
}

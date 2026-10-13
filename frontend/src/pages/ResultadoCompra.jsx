import { Link } from "react-router-dom";

// TODO: resumen del pedido (Figuras 7 y 8 del Anexo 1). props.exito decide cuál de las dos vistas.
//   - Éxito: número de pedido, datos de entrega y detalle de lo comprado.
//   - Error: mismo resumen y botón para volver a /checkout.
export function ResultadoCompra(props) {
  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">
        {props.exito ? "Compra realizada" : "No se pudo realizar el pago"}
      </h1>
      <p className="text-tinta-600">Pendiente: resumen del pedido.</p>
      <Link to={props.exito ? "/catalogo" : "/checkout"} className="text-laton-800 underline">
        {props.exito ? "Volver al catálogo" : "Volver a intentar"}
      </Link>
    </section>
  );
}

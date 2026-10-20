import { useLocation } from "react-router-dom";
import { Boton } from "../components/Boton";
import { ResumenPedido } from "../components/ResumenPedido";

// Resumen del pedido (Figuras 7 y 8 del Anexo 1). props.exito decide cuál de las dos vistas.
// El pedido llega desde Checkout en el state de la navegación.
export function ResultadoCompra(props) {
  const pedido = useLocation().state?.pedido;

  // Si se entra escribiendo la URL no hay pedido que mostrar.
  if (!pedido) {
    return (
      <section className="flex flex-col items-start gap-4">
        <h1 className="font-display text-4xl">Sin pedido</h1>
        <p className="text-tinta-600">No hay una compra reciente que mostrar.</p>
        <Boton a="/catalogo">Ir al catálogo</Boton>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">
          {props.exito ? "Compra realizada" : "No se pudo realizar el pago"}
        </h1>
        <p className={`mt-2 ${props.exito ? "text-patina-600" : "text-cobre-600"}`}>
          {props.exito
            ? `Pedido #${pedido.numero}. Te enviamos el detalle a ${pedido.correo}.`
            : "El pago fue rechazado. Tu carrito sigue guardado para que lo intentes de nuevo."}
        </p>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="font-medium">Cliente</dt>
        <dd>{pedido.cliente}</dd>
        <dt className="font-medium">Entrega</dt>
        <dd>{pedido.entrega}</dd>
      </dl>

      <ResumenPedido lineas={pedido.lineas} />

      <div>
        {props.exito ? <Boton a="/catalogo">Seguir comprando</Boton> : <Boton a="/checkout">Volver a intentar</Boton>}
      </div>
    </section>
  );
}

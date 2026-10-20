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
        <MarcaEstado exito={props.exito} />
        <h1 className="mt-5 font-display text-4xl">
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

// Sello del resultado: dos anillos, como la campana de un instrumento de bronce,
// con un visto (éxito) o un signo de exclamación (pago rechazado). El texto dice lo mismo;
// el sello no es la única señal.
function MarcaEstado(props) {
  const color = props.exito ? "text-patina-600" : "text-cobre-600";
  return (
    <svg viewBox="0 0 56 56" className={`size-14 ${color}`} aria-hidden="true" fill="none" stroke="currentColor">
      <circle cx="28" cy="28" r="26" strokeWidth="1.5" opacity="0.35" />
      <circle cx="28" cy="28" r="20" strokeWidth="2" />
      {props.exito ? (
        <path d="M19.5 28.5l6 6 11-12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <path d="M28 18.5v12" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="28" cy="36.5" r="1.6" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}

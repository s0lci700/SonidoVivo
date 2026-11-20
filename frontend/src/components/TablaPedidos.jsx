import { ESTADOS } from "../services/pedidoService";
import { formatearPrecio } from "../utils/formatearPrecio";

// Lista de pedidos reutilizable: la usan MisPedidos (cliente) y AdminPedidos (personal).
// Props: pedidos, y opcional acciones(pedido) para dibujar controles en cada pedido.
export function TablaPedidos(props) {
  if (props.pedidos.length === 0) {
    return <p className="text-tinta-600">No hay pedidos.</p>;
  }
  return (
    <ul className="flex flex-col gap-4">
      {props.pedidos.map((pedido) => (
        <li key={pedido.id} className="rounded-2xl border border-marfil-300 bg-marfil-50 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-semibold">
              Pedido #{pedido.id}
              <span className="ml-2 text-sm font-normal text-tinta-600">
                {new Date(pedido.fecha).toLocaleString("es-CL")}
              </span>
            </h2>
            <span className="rounded-full bg-marfil-200 px-3 py-1 text-xs font-semibold">
              {ESTADOS[pedido.estado] ?? pedido.estado}
            </span>
          </div>
          <p className="mt-1 text-sm text-tinta-600">
            {pedido.nombreCliente} · {pedido.correoCliente} ·{" "}
            {pedido.entrega === "DESPACHO" ? `Despacho a ${pedido.direccion}` : "Retiro en tienda"}
          </p>
          <ul className="mt-3 divide-y divide-marfil-300 text-sm tabular-nums">
            {pedido.detalles.map((d) => (
              <li key={d.id} className="flex justify-between gap-4 py-1">
                <span>
                  {d.cantidad} × {d.nombreProducto}
                </span>
                <span>{formatearPrecio(d.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <strong className="tabular-nums">Total {formatearPrecio(pedido.total)}</strong>
            {props.acciones?.(pedido)}
          </div>
        </li>
      ))}
    </ul>
  );
}

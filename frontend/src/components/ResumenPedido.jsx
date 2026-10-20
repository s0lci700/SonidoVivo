import { calcularTotal } from "../utils/carrito";

// Lista de líneas (nombre × cantidad, subtotal) y total. La usan Checkout y ResultadoCompra.
// Props: lineas (arreglo del carrito).
export function ResumenPedido(props) {
  return (
    <div className="rounded-2xl border border-marfil-300 bg-marfil-50 p-5">
      <h2 className="mb-3 font-display text-xl">Resumen</h2>
      <ul className="flex flex-col gap-2 text-sm">
        {props.lineas.map((linea) => (
          <li key={linea.codigo} className="flex justify-between gap-4">
            <span>
              {linea.nombre} <span className="text-tinta-600">× {linea.cantidad}</span>
            </span>
            <span className="tabular-nums">${(linea.precio * linea.cantidad).toLocaleString("es-CL")}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex justify-between border-t border-marfil-300 pt-3 font-semibold">
        <span>Total</span>
        <span className="tabular-nums">${calcularTotal(props.lineas).toLocaleString("es-CL")}</span>
      </p>
    </div>
  );
}

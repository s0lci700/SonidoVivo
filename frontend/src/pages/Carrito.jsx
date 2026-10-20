import { Link } from "react-router-dom";
import { Boton } from "../components/Boton";
import { calcularTotal } from "../utils/carrito";
import { imagenProducto } from "../utils/imagenProducto";

// Props desde App: carrito, onQuitar, onCambiarCantidad, onVaciar.
// No tiene estado propio: muestra el carrito y avisa hacia arriba.
export function Carrito(props) {
  if (props.carrito.length === 0) {
    return (
      <section className="flex flex-col items-start gap-4">
        <h1 className="font-display text-4xl">Tu carrito está vacío</h1>
        <p className="text-tinta-600">Agrega instrumentos desde el catálogo.</p>
        <Boton a="/catalogo">Ver el catálogo</Boton>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-4xl">Carrito</h1>

      <ul className="flex flex-col border-t border-marfil-300">
        {props.carrito.map((linea) => {
          return (
            <li key={linea.codigo} className="flex gap-4 border-b border-marfil-300 py-4">
              <img
                src={imagenProducto(linea.codigo)}
                alt=""
                className="size-16 shrink-0 rounded-xl border border-marfil-300 bg-marfil-200 object-contain p-1.5 sm:size-20"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/producto/${linea.codigo}`}
                    className="font-medium decoration-laton-700 underline-offset-4 hover:underline"
                  >
                    {linea.nombre}
                  </Link>
                  <p className="text-sm text-tinta-600 tabular-nums">
                    ${linea.precio.toLocaleString("es-CL")} c/u
                  </p>
                  <button
                    type="button"
                    onClick={() => props.onQuitar(linea.codigo)}
                    className="-ml-0.5 inline-flex min-h-11 cursor-pointer items-center px-0.5 text-sm text-cobre-600 underline underline-offset-4 hover:text-laca-900 focus-visible:outline-2 focus-visible:outline-laton-800 sm:min-h-0 sm:pt-1"
                  >
                    Quitar
                  </button>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <ControlCantidad linea={linea} onCambiarCantidad={props.onCambiarCantidad} />
                  <p className="w-28 text-right text-lg font-semibold tabular-nums">
                    ${(linea.precio * linea.cantidad).toLocaleString("es-CL")}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-2xl font-semibold tabular-nums">
          Total ${calcularTotal(props.carrito).toLocaleString("es-CL")}
        </p>
        <div className="flex flex-wrap gap-3">
          <Boton variante="secundario" onClick={props.onVaciar}>
            Vaciar
          </Boton>
          <Boton a="/checkout">Comprar</Boton>
        </div>
      </div>
    </section>
  );
}

// − cantidad + en una sola pieza. Los botones se deshabilitan en 1 y en el stock,
// que es donde limitarCantidad dejaría de cambiar el valor.
function ControlCantidad(props) {
  const { linea } = props;
  const boton =
    "flex size-11 cursor-pointer select-none items-center justify-center text-lg text-laca-900 transition-colors duration-150 ease-taller hover:bg-marfil-200 active:bg-marfil-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-laton-800 disabled:cursor-not-allowed disabled:text-tinta-600/40 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center overflow-hidden rounded-full border border-marfil-300 bg-marfil-50">
      <button
        type="button"
        aria-label={`Disminuir cantidad de ${linea.nombre}`}
        disabled={linea.cantidad <= 1}
        onClick={() => props.onCambiarCantidad(linea.codigo, linea.cantidad - 1)}
        className={boton}
      >
        −
      </button>
      <span aria-live="polite" className="w-8 overflow-hidden text-center font-semibold tabular-nums">
        {/* key nueva en cada cambio: el número entra con «asomar». */}
        <span key={linea.cantidad} className="block animate-asomar motion-reduce:animate-none">
          {linea.cantidad}
        </span>
      </span>
      <button
        type="button"
        aria-label={`Aumentar cantidad de ${linea.nombre}`}
        disabled={linea.cantidad >= linea.stock}
        onClick={() => props.onCambiarCantidad(linea.codigo, linea.cantidad + 1)}
        className={boton}
      >
        +
      </button>
    </div>
  );
}

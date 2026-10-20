import { Boton } from "../components/Boton";
import { calcularTotal } from "../utils/carrito";

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
            <li
              key={linea.codigo}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-marfil-300 py-4"
            >
              <div className="min-w-48 flex-1">
                <p className="font-medium">{linea.nombre}</p>
                <p className="text-sm text-tinta-600 tabular-nums">
                  ${linea.precio.toLocaleString("es-CL")} c/u
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Boton
                  variante="secundario"
                  ariaLabel={`Disminuir cantidad de ${linea.nombre}`}
                  deshabilitado={linea.cantidad <= 1}
                  onClick={() => props.onCambiarCantidad(linea.codigo, linea.cantidad - 1)}
                >
                  −
                </Boton>
                <span className="w-8 text-center font-semibold tabular-nums">{linea.cantidad}</span>
                <Boton
                  variante="secundario"
                  ariaLabel={`Aumentar cantidad de ${linea.nombre}`}
                  deshabilitado={linea.cantidad >= linea.stock}
                  onClick={() => props.onCambiarCantidad(linea.codigo, linea.cantidad + 1)}
                >
                  +
                </Boton>
              </div>

              <p className="w-28 text-right font-semibold tabular-nums">
                ${(linea.precio * linea.cantidad).toLocaleString("es-CL")}
              </p>

              <button
                type="button"
                onClick={() => props.onQuitar(linea.codigo)}
                className="cursor-pointer text-sm text-cobre-600 underline underline-offset-4 hover:text-laca-900"
              >
                Quitar
              </button>
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boton } from "../components/Boton";
import {
  eliminarProducto,
  obtenerProductos,
} from "../services/productoService";
import { estadoStock } from "../utils/estadoStock";
import { imagenProducto } from "../utils/imagenProducto";
import { formatearPrecio } from "../utils/formatearPrecio";

const accion =
  "inline-flex min-h-11 items-center rounded-full px-3 font-semibold underline-offset-4 transition-colors duration-150 ease-taller hover:bg-marfil-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800";

// Listado del administrador: la R y la D del CRUD. En 360 px la tabla se desplaza
// hacia el lado y la columna Código queda fija para no perder de vista la fila.
export function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const cargar = () => obtenerProductos().then(setProductos);
  useEffect(() => {
    cargar();
  }, []);

  async function eliminar(codigo) {
    if (!window.confirm(`¿Eliminar ${codigo}?`)) {
      return;
    }
    await eliminarProducto(codigo).then(cargar);
  }

  const criticos = productos.filter((p) => p.stock <= 3).length;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Productos</h1>
          <p className="mt-1 text-sm text-tinta-600">
            {productos.length} productos · {criticos} con stock crítico
          </p>
        </div>
        <Boton a="/admin/productos/nuevo">
          <Mas />
          Nuevo producto
        </Boton>
      </div>

      {/* relative: sin él, el texto sr-only de «Acciones» (absolute) escapa del scroll y ensancha la página en móvil. */}
      <div className="relative overflow-x-auto rounded-2xl border border-marfil-300 bg-marfil-50">
        <table className="w-full text-sm whitespace-nowrap tabular-nums">
          <thead className="text-left text-xs font-semibold text-tinta-600">
            <tr className="bg-marfil-200">
              <th
                scope="col"
                className="sticky left-0 bg-marfil-200 px-4 py-3 shadow-[1px_0_0_var(--color-marfil-300)]"
              >
                Código
              </th>
              <th scope="col" className="px-4 py-3">
                Nombre
              </th>
              <th scope="col" className="px-4 py-3">
                Categoría
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Precio
              </th>
              <th scope="col" className="px-4 py-3">
                Stock
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-tinta-600"
                >
                  No hay productos. Crea el primero con «Nuevo producto».
                </td>
              </tr>
            )}
            {productos.map((p) => {
              const stock = estadoStock(p.stock);
              return (
                <tr
                  key={p.codigo}
                  className="group border-t border-marfil-300 transition-colors hover:bg-marfil-100"
                >
                  <th
                    scope="row"
                    className="sticky left-0 bg-marfil-50 px-4 py-2 shadow-[1px_0_0_var(--color-marfil-300)] text-left font-medium tracking-wide text-tinta-600 transition-colors group-hover:bg-marfil-100"
                  >
                    {p.codigo}
                  </th>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      {/* Miniatura para revisar las fotos de un vistazo. Un producto nuevo no tiene foto todavía. */}
                      {imagenProducto(p.codigo) ? (
                        <img
                          src={imagenProducto(p.codigo)}
                          alt=""
                          loading="lazy"
                          className="size-11 shrink-0 rounded-lg border border-marfil-300 bg-marfil-200 object-contain p-1"
                        />
                      ) : (
                        <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-dashed border-marfil-300 text-[0.625rem] leading-tight text-tinta-600">
                          Sin foto
                        </span>
                      )}
                      <div>
                        {/* La ficha pública, tal como la ve el cliente, en otra pestaña para no perder la tabla. */}
                        <Link
                          to={`/producto/${p.codigo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-laca-900 underline-offset-4 hover:text-laton-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800"
                        >
                          {p.nombre}
                          <Externo />
                          <span className="sr-only">
                            (abre en otra pestaña)
                          </span>
                        </Link>
                        <span className="block text-xs text-tinta-600">
                          {p.marca} · {p.modelo}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-tinta-600">{p.categoria}</td>
                  <td className="px-4 py-2 text-right font-medium">
                    {formatearPrecio(p.precio)}
                  </td>
                  <td className="px-4 py-2">
                    {/* El número y la palabra dicen el estado; el punto solo lo refuerza. */}
                    <span
                      className={`inline-flex items-center gap-2 ${p.stock <= 3 ? stock.color : ""}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full ${stock.punto}`}
                      />
                      {p.stock}
                      {p.stock <= 0 && <span className="text-xs">agotado</span>}
                      {p.stock > 0 && p.stock <= 3 && (
                        <span className="text-xs">crítico</span>
                      )}
                    </span>
                  </td>
                  <td className="px-2 py-1">
                    {/* Dos acciones de texto, como «Quitar» en el carrito: 51 botones con borde recargarían la tabla. */}
                    <div className="flex justify-end">
                      <Link
                        to={`/admin/productos/${p.codigo}`}
                        aria-label={`Editar ${p.nombre}`}
                        className={`${accion} text-laton-800`}
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        aria-label={`Eliminar ${p.nombre}`}
                        onClick={() => eliminar(p.codigo)}
                        className={`${accion} cursor-pointer text-cobre-600`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Flecha de "se abre aparte": avisa antes del click que cambia de pestaña.
function Externo() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0 text-tinta-600"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2.5h4v4M13.5 2.5 7 9M12 9.5v3a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" />
    </svg>
  );
}

function Mas() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

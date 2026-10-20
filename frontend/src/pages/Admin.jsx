import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boton } from "../components/Boton";
import { cerrarSesion, obtenerSesion } from "../services/authService";
import { obtenerProductos } from "../services/productoService";

// Panel de administración (Figura 9 del Anexo 1): saludo, cierre de sesión,
// indicadores del catálogo y la lista de productos que hay que reponer.
// Usuarios, pedidos y reportes llegan en el Parcial 3, con la API.
export function Admin() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerProductos().then(setProductos);
  }, []);

  function salir() {
    cerrarSesion();
    navigate("/login");
  }

  const agotados = productos.filter((p) => p.stock <= 0);
  const criticos = productos.filter((p) => p.stock > 0 && p.stock <= 3);
  // Primero lo agotado, después lo que queda con menos unidades.
  const porReponer = [
    ...agotados,
    ...criticos.sort((a, b) => a.stock - b.stock),
  ];
  const nombre = sesion?.nombre ?? "administrador";

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Hola, {nombre}</h1>
          <p className="mt-1 text-sm text-tinta-600">
            Panel de administración de Sonido Vivo
          </p>
        </div>
        <Boton variante="secundario" onClick={salir}>
          Cerrar sesión
        </Boton>
      </div>

      {/* Indicadores en una sola franja: se leen de corrido, sin tarjetas. */}
      <dl className="grid grid-cols-3 divide-x divide-marfil-300 rounded-2xl border border-marfil-300 bg-marfil-50 tabular-nums">
        <Indicador etiqueta="Productos" valor={productos.length} />
        <Indicador
          etiqueta="Stock crítico"
          valor={criticos.length}
          detalle="3 o menos"
        />
        <Indicador etiqueta="Agotados" valor={agotados.length} />
      </dl>

      <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4">
            <h2 className="text-xl font-semibold">Por reponer</h2>
            <Link
              to="/admin/productos"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-laton-800 underline underline-offset-4 hover:text-laca-900"
            >
              Ver todos los productos
            </Link>
          </div>
          {porReponer.length === 0 ? (
            <p className="text-tinta-600">
              Todo el catálogo tiene más de 3 unidades.
            </p>
          ) : (
            <ul className="divide-y divide-marfil-300 border-y border-marfil-300">
              {porReponer.map((p) => (
                <li
                  key={p.codigo}
                  className="flex items-center justify-between gap-4 py-1"
                >
                  <Link
                    to={`/admin/productos/${p.codigo}`}
                    className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg hover:text-laton-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800"
                  >
                    <span className="w-14 shrink-0 text-sm text-tinta-600">
                      {p.codigo}
                    </span>
                    <span className="truncate font-medium">{p.nombre}</span>
                  </Link>
                  <span
                    className={`shrink-0 text-sm font-semibold tabular-nums ${p.stock <= 0 ? "text-tinta-600" : "text-cobre-600"}`}
                  >
                    {p.stock <= 0
                      ? "Agotado"
                      : `${p.stock} ${p.stock === 1 ? "unidad" : "unidades"}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Secciones de administración" className="self-start">
          <h2 className="mb-3 text-xl font-semibold">Secciones</h2>
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                to="/admin/productos"
                className="flex min-h-11 items-center justify-between rounded-lg px-3 font-semibold hover:bg-marfil-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800"
              >
                Productos
                <Flecha />
              </Link>
            </li>
            <li>
              <Link
                to="/admin/productos/nuevo"
                className="flex min-h-11 items-center justify-between rounded-lg px-3 font-semibold hover:bg-marfil-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800"
              >
                Nuevo producto
                <Flecha />
              </Link>
            </li>
            {["Usuarios", "Pedidos", "Reportes"].map((seccion) => (
              <li
                key={seccion}
                className="flex min-h-11 items-center justify-between px-3 text-tinta-600"
              >
                {seccion}
                <span className="text-xs">Parcial 3</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

function Indicador(props) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
      <dt className="text-xs font-semibold text-tinta-600">{props.etiqueta}</dt>
      <dd className="font-display text-3xl sm:text-4xl">{props.valor}</dd>
      {props.detalle && (
        <dd className="text-xs text-tinta-600">{props.detalle}</dd>
      )}
    </div>
  );
}

// Chevron de las secciones: indica que la fila lleva a otra página.
function Flecha() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4 text-laton-800"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Boton } from "../components/Boton";
import { obtenerProductoPorCodigo } from "../services/productoService";
import { estadoStock } from "../utils/estadoStock";
import { imagenProducto } from "../utils/imagenProducto";
import { formatearPrecio } from "../utils/formatearPrecio";

// Ficha de un producto: /producto/:codigo. props.onAgregar viene de App.
export function DetalleProducto(props) {
  const { codigo } = useParams();
  // undefined = cargando · null = el código no existe · objeto = el producto
  const [producto, setProducto] = useState(undefined);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    obtenerProductoPorCodigo(codigo).then(setProducto);
  }, [codigo]);

  if (producto === undefined) {
    return <p className="text-tinta-600">Cargando…</p>;
  }

  if (producto === null) {
    return (
      <section className="flex flex-col items-start gap-4">
        <h1 className="font-display text-4xl">Producto no encontrado</h1>
        <p className="text-tinta-600">
          No existe un producto con el código {codigo}.
        </p>
        <Boton a="/catalogo">Volver al catálogo</Boton>
      </section>
    );
  }

  const stock = estadoStock(producto.stock);

  function agregar() {
    props.onAgregar({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
    });
    setAgregado(true);
  }

  return (
    <section>
      <Link
        to="/catalogo"
        className="inline-flex min-h-11 items-center text-sm text-laton-800 underline underline-offset-4 hover:text-laca-900"
      >
        ← Catálogo
      </Link>

      <div className="mt-2 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-marfil-300 bg-marfil-200">
          <img
            src={imagenProducto(producto.codigo)}
            alt={producto.nombre}
            className="h-full w-full object-contain p-6"
          />
        </div>

        <div className="flex flex-col gap-3 md:pt-4">
          <p className="text-xs font-semibold tracking-[0.12em] text-laton-800 uppercase">
            {producto.marca} · {producto.modelo}
          </p>
          <h1 className="font-display text-4xl leading-tight">
            {producto.nombre}
          </h1>
          <p className="leading-relaxed text-pretty text-tinta-600">
            {producto.descripcion}
          </p>
          <p
            className={`flex items-center gap-2 text-sm font-medium ${stock.color}`}
          >
            <span className={`size-2 rounded-full ${stock.punto}`} />
            {stock.texto}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {formatearPrecio(producto.precio)}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Boton onClick={agregar} deshabilitado={producto.stock <= 0}>
              Agregar al carrito
            </Boton>
            {agregado && (
              <p role="status" className="text-sm font-medium text-patina-600">
                Agregado.{" "}
                <Link to="/carrito" className="underline">
                  Ver carrito
                </Link>
              </p>
            )}
          </div>

          {/* Ficha técnica: lo que un músico revisa antes de ir a la tienda. */}
          <dl className="mt-6 grid grid-cols-[auto_1fr] border-t border-marfil-300 text-sm">
            {[
              ["Marca", producto.marca],
              ["Modelo", producto.modelo],
              ["Categoría", producto.categoria],
              ["Código", producto.codigo],
            ].map(([dato, valor]) => (
              <div
                key={dato}
                className="col-span-2 grid grid-cols-subgrid border-b border-marfil-300 py-2.5"
              >
                <dt className="pr-8 text-tinta-600">{dato}</dt>
                <dd className="font-medium">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

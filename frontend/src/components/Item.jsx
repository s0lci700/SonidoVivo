// "codigo": "GA001",
//     "categoria": "Guitarras Acústicas",
//     "nombre": "Guitarra Acústica Folk",
//     "marca": "Yamaha",
//     "modelo": "F310",
//     "stock": 8,
//     "precio": 129990,
//     "descripcion": "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes.",
//     "categoriaId": "GA"

import { useRef, useState } from "react";
import { estadoStock } from "../utils/estadoStock.js";
import { imagenProducto } from "../utils/imagenProducto";
import { Link } from "react-router-dom";
import { Boton } from "./Boton";
import { formatearPrecio } from "../utils/formatearPrecio";

export function Item(props) {
  const imagen = imagenProducto(props.codigo);
  const stock = estadoStock(props.stock);
  // Aviso de 1,5 s en el botón después de agregar. Solo esta tarjeta lo necesita: estado local.
  const [agregado, setAgregado] = useState(false);
  const temporizador = useRef(null);

  function agregar() {
    props.onAgregar({
      codigo: props.codigo,
      nombre: props.nombre,
      precio: props.precio,
      stock: props.stock,
    });
    setAgregado(true);
    // Si se hace clic de nuevo antes de que termine, el aviso vuelve a contar desde cero.
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-marfil-300 bg-marfil-50 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(26,23,20,0.12)]">
      <div className="flex aspect-square items-center justify-center border-b border-marfil-300 bg-marfil-200">
        <img
          src={imagen}
          alt={props.nombre}
          className="h-full w-full object-contain p-4"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold tracking-[0.12em] text-laton-800 uppercase">
          {props.marca} · {props.modelo}
        </p>
        <h2 className="font-display text-[22px] leading-tight">
          <Link to={`/producto/${props.codigo}`}>{props.nombre}</Link>
        </h2>
        <p className="flex-1 text-sm leading-relaxed text-pretty text-tinta-600">
          {props.descripcion}
        </p>

        <p
          className={`flex items-center gap-2 text-[13px] font-medium ${stock.color}`}
        >
          <span className={`size-2 rounded-full ${stock.punto}`} />
          {stock.texto}
        </p>

        <div className="mt-1 flex items-center gap-3 border-t border-marfil-300 pt-3">
          <span className="flex-1 text-[22px] font-semibold tabular-nums">
            {formatearPrecio(props.precio)}
          </span>
          {props.onAgregar && (
            <Boton
              onClick={agregar}
              deshabilitado={props.stock <= 0}
              variante={agregado ? "exito" : "primario"}
              className="min-w-30"
            >
              {/* La key cambia con el estado: «Agregado» entra con la animación «asomar». */}
              <span
                key={agregado ? "si" : "no"}
                className={`flex items-center gap-1.5 ${agregado ? "animate-asomar motion-reduce:animate-none" : ""}`}
              >
                {agregado && <Visto />}
                {agregado ? "Agregado" : "Agregar"}
              </span>
            </Boton>
          )}
          {/* Lo anuncia el lector de pantalla; no se ve. */}
          <span role="status" className="sr-only">
            {agregado ? `${props.nombre} agregado al carrito` : ""}
          </span>
        </div>
      </div>
    </article>
  );
}

// Visto dibujado (no un carácter), del mismo trazo que los íconos del header.
function Visto() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

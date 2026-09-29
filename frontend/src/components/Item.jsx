// "codigo": "GA001",
//     "categoria": "Guitarras Acústicas",
//     "nombre": "Guitarra Acústica Folk",
//     "marca": "Yamaha",
//     "modelo": "F310",
//     "stock": 8,
//     "precio": 129990,
//     "descripcion": "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes.",
//     "categoriaId": "GA"
 
const imagenes = import.meta.glob("../assets/productos/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
});

function estadoStock(stock) {
  if (stock <= 0) return { texto: "Agotado", color: "text-tinta-600", punto: "bg-tinta-600" };
  if (stock <= 3) return { texto: `Últimas ${stock} unidades`, color: "text-cobre-600", punto: "bg-cobre-600" };
  return { texto: `En stock · ${stock} disponibles`, color: "text-patina-600", punto: "bg-patina-600" };
}

export function Item(props) {
  const imagen = imagenes[`../assets/productos/${props.codigo}.webp`];
  const stock = estadoStock(props.stock);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-marfil-300 bg-marfil-50 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(26,23,20,0.12)]">
      <div className="flex aspect-square items-center justify-center border-b border-marfil-300 bg-marfil-200">
        <img src={imagen} alt={props.nombre} className="h-full w-full object-contain p-4" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold tracking-[0.12em] text-laton-800 uppercase">
          {props.marca} · {props.modelo}
        </p>
        <h2 className="font-display text-[22px] leading-tight">{props.nombre}</h2>
        <p className="flex-1 text-sm leading-relaxed text-pretty text-tinta-600">{props.descripcion}</p>

        <p className={`flex items-center gap-2 text-[13px] font-medium ${stock.color}`}>
          <span className={`size-2 rounded-full ${stock.punto}`} />
          {stock.texto}
        </p>

        <div className="mt-1 flex items-center gap-3 border-t border-marfil-300 pt-3">
          <span className="flex-1 text-[22px] font-semibold tabular-nums">
            ${props.precio.toLocaleString("es-CL")}
          </span>
          {props.onAgregar && (
            <button
              type="button"
              onClick={() => props.onAgregar(props)}
              disabled={props.stock <= 0}
              className="h-11 cursor-pointer rounded-full bg-laton-500 px-4.5 text-sm font-semibold text-laca-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(26,23,20,0.25)] transition hover:-translate-y-px hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
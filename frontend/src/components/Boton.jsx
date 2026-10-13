const variantes = {
  primario:
    "bg-laton-500 text-laca-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(26,23,20,0.25)] hover:-translate-y-px hover:brightness-110 motion-reduce:hover:translate-y-0",
  secundario: "border border-marfil-300 bg-marfil-50 text-laca-900 hover:bg-marfil-200",
};

// Props: children, tipo ("button" por defecto), variante ("primario" por defecto),
//        onClick, deshabilitado.
export function Boton(props) {
  return (
    <button
      type={props.tipo ?? "button"}
      onClick={props.onClick}
      disabled={props.deshabilitado}
      className={`h-11 cursor-pointer rounded-full px-4.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800 disabled:cursor-not-allowed disabled:opacity-50 ${
        variantes[props.variante ?? "primario"]
      }`}
    >
      {props.children}
    </button>
  );
}

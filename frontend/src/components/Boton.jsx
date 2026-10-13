import { Link } from "react-router-dom";

const variantes = {
  primario:
    "bg-laton-500 text-laca-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(26,23,20,0.25)] hover:-translate-y-px hover:brightness-110 motion-reduce:hover:translate-y-0",
  secundario: "border border-marfil-300 bg-marfil-50 text-laca-900 hover:bg-marfil-200",
};

// Props: children, variante ("primario" por defecto), y una de dos formas de uso:
//   - botón: tipo ("button" por defecto), onClick, deshabilitado
//   - enlace: a="/ruta" (navega con React Router y se ve igual que el botón)
export function Boton(props) {
  const clases = `inline-flex h-11 cursor-pointer items-center justify-center rounded-full px-4.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800 disabled:cursor-not-allowed disabled:opacity-50 ${
    variantes[props.variante ?? "primario"]
  }`;

  if (props.a) {
    return (
      <Link to={props.a} className={clases}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={props.tipo ?? "button"}
      onClick={props.onClick}
      disabled={props.deshabilitado}
      className={clases}
    >
      {props.children}
    </button>
  );
}

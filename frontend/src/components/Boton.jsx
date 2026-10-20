import { Link } from "react-router-dom";

// Bisel del latón en reposo, y el mismo bisel hundido mientras se presiona.
const bisel =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(26,23,20,0.25)] active:shadow-[inset_0_2px_3px_rgba(26,23,20,0.28)]";

const variantes = {
  primario: `bg-laton-500 text-laca-900 ${bisel} hover:brightness-110 active:brightness-95`,
  secundario:
    "border border-marfil-300 bg-marfil-50 text-laca-900 hover:border-tinta-600/40 hover:bg-marfil-100 active:bg-marfil-200",
  // Confirmación breve (por ejemplo, «Agregado»): pátina en vez de latón.
  exito: `bg-patina-600 text-marfil-50 ${bisel}`,
};

// Props: children, variante ("primario" por defecto, "secundario" o "exito"), ariaLabel
// (nombre para lectores de pantalla cuando el texto visible es solo un símbolo),
// className (clases extra, por ejemplo un ancho mínimo), y una de dos formas de uso:
//   - botón: tipo ("button" por defecto), onClick, deshabilitado
//   - enlace: a="/ruta" (navega con React Router y se ve igual que el botón)
export function Boton(props) {
  const clases = `inline-flex h-11 cursor-pointer select-none items-center justify-center gap-2 rounded-full px-4.5 text-sm font-semibold transition-[translate,scale,filter,background-color,border-color,box-shadow] duration-150 ease-taller hover:-translate-y-px active:translate-y-0 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:brightness-100 disabled:active:scale-100 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 ${
    variantes[props.variante ?? "primario"]
  } ${props.className ?? ""}`;

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
      aria-label={props.ariaLabel}
      className={clases}
    >
      {props.children}
    </button>
  );
}

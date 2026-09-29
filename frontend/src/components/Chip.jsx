export function Chip(props) {
  return (
    <button
      type="button"
      aria-pressed={props.seleccionado}
      onClick={props.onClick}
      className={`h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800 ${
        props.seleccionado
          ? "border-laca-900 bg-laca-900 text-marfil-50"
          : "border-marfil-300 bg-marfil-50 text-laca-900 hover:bg-marfil-200"
      }`}
    >
      {props.children}
    </button>
  );
}
// Lista desplegable con el mismo aspecto que Campo. La usan Checkout (región y comuna)
// y AdminProductoForm (categoría).
// Props: etiqueta, nombre, value, onChange, error, opciones ([{ valor, texto }]).
export function Selector(props) {
  const idError = `${props.nombre}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={props.nombre} className="text-sm font-medium">
        {props.etiqueta}
      </label>
      <select
        id={props.nombre}
        name={props.nombre}
        value={props.value}
        onChange={props.onChange}
        aria-invalid={Boolean(props.error)}
        aria-describedby={props.error ? idError : undefined}
        className={`h-11 w-full rounded-lg border bg-marfil-50 px-3 text-laca-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800 ${
          props.error ? "border-cobre-600" : "border-marfil-300"
        }`}
      >
        <option value="">Selecciona…</option>
        {props.opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
      {props.error && (
        <p id={idError} role="alert" className="text-sm text-cobre-600">
          {props.error}
        </p>
      )}
    </div>
  );
}

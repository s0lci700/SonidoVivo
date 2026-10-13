export function Campo(props) {
  const idError = `${props.nombre}-error`;
  const clases = `w-full rounded-lg border bg-marfil-50 px-3 text-laca-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800 ${
    props.error ? "border-cobre-600" : "border-marfil-300"
  }`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={props.nombre} className="text-sm font-medium">
        {props.etiqueta}:
      </label>
      {props.multilinea ? (
        <textarea
          name={props.nombre}
          id={props.nombre}
          value={props.value}
          onChange={props.onChange}
          rows={4}
          aria-invalid={Boolean(props.error)}
          aria-describedby={props.error ? idError : undefined}
          className={`${clases} py-2`}
        />
      ) : (
        <input
          type={props.tipo ?? "text"}
          name={props.nombre}
          id={props.nombre}
          value={props.value}
          onChange={props.onChange}
          aria-invalid={Boolean(props.error)}
          aria-describedby={props.error ? idError : undefined}
          className={`${clases} h-11`}
        />
      )}
      {props.error && (
        <p id={idError} role="alert" className="text-sm text-cobre-600">
          {props.error}
        </p>
      )}
    </div>
  );
}

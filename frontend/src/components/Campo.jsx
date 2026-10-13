export function Campo(props) {
  return (
  <div>
   <label htmlFor={props.nombre}>{props.etiqueta}:</label>
    {props.multilinea ? 
    <textarea 
        name={props.nombre}
        id={props.nombre}
        value={props.value}
        onChange={props.onChange} 
        rows={4}/> : 
    <input
        type={props.tipo ?? 'text'}
        name={props.nombre}
        id={props.nombre}
        value={props.value}
        onChange={props.onChange}  
    />
    }
    {props.error && <p role="alert">{props.error}</p>}
  </div>);
}

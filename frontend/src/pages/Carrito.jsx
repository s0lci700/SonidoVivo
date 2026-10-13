// TODO: carrito de compras. Recibe props.carrito desde App.
//   - Tabla/lista: producto, precio, cantidad (+/-), subtotal, quitar.
//   - Total con toLocaleString("es-CL"); el cálculo va en utils para poder probarlo.
//   - Botones Vaciar y Comprar (lleva a /checkout). Estado vacío con enlace al catálogo.
//   - Faltan las props props.onQuitar, props.onCambiarCantidad, props.onVaciar (definirlas en App).
export function Carrito(props) {
  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">Carrito</h1>
      <p className="text-tinta-600">Pendiente: {props.carrito.length} productos en el carrito.</p>
    </section>
  );
}

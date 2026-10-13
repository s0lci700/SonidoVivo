// TODO: paso de pago (Figura 6 del Anexo 1). Recibe props.carrito desde App.
//   - Resumen del carrito y total.
//   - Formulario controlado: nombre, apellidos, correo, calle, región, comuna,
//     y despacho o retiro en tienda (lo pide el caso).
//   - Validar con utils/validaciones; si pasa, vaciar el carrito y useNavigate("/compra/exito"),
//     si el pago simulado falla, useNavigate("/compra/error").
export function Checkout(props) {
  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">Finalizar compra</h1>
      <p className="text-tinta-600">Pendiente: datos de entrega para {props.carrito.length} productos.</p>
    </section>
  );
}

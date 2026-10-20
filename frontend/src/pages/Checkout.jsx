import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Boton } from "../components/Boton";
import { Campo } from "../components/Campo";
import { ResumenPedido } from "../components/ResumenPedido";
import { obtenerRegiones } from "../services/regionService";
import { calcularTotal } from "../utils/carrito";
import { validarCorreo, validarTexto } from "../utils/validaciones";

const formularioVacio = {
  nombre: "",
  apellidos: "",
  correo: "",
  entrega: "despacho",
  calle: "",
  region: "",
  comuna: "",
};

// Paso de pago (Figura 6 del Anexo 1). Props: carrito y onVaciar, desde App.
export function Checkout(props) {
  const navigate = useNavigate();
  const [regiones, setRegiones] = useState([]);
  const [formData, setFormData] = useState(formularioVacio);
  const [errores, setErrores] = useState({});
  // Pago simulado: con esta casilla marcada el pago se rechaza, para mostrar la vista de error.
  const [rechazarPago, setRechazarPago] = useState(false);

  useEffect(() => {
    obtenerRegiones().then(setRegiones);
  }, []);

  const comunas = regiones.find((region) => region.id === formData.region)?.comunas ?? [];
  const esDespacho = formData.entrega === "despacho";

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Al cambiar de región, la comuna elegida ya no corresponde.
    setFormData((prev) => ({ ...prev, [name]: value, ...(name === "region" ? { comuna: "" } : {}) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    if (!validarTexto(formData.nombre, 2)) nuevosErrores.nombre = "Ingresa tu nombre.";
    if (!validarTexto(formData.apellidos, 2)) nuevosErrores.apellidos = "Ingresa tus apellidos.";
    if (!validarCorreo(formData.correo)) nuevosErrores.correo = "Ingresa un correo válido.";
    if (esDespacho) {
      if (!validarTexto(formData.calle, 5)) nuevosErrores.calle = "Ingresa calle y número.";
      if (!formData.region) nuevosErrores.region = "Elige una región.";
      if (!formData.comuna) nuevosErrores.comuna = "Elige una comuna.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const region = regiones.find((r) => r.id === formData.region);
    const pedido = {
      numero: String(Date.now()).slice(-6),
      cliente: `${formData.nombre} ${formData.apellidos}`,
      correo: formData.correo,
      entrega: esDespacho
        ? `Despacho a ${formData.calle}, ${formData.comuna}, ${region?.nombre}`
        : "Retiro en tienda, Viña del Mar",
      lineas: props.carrito,
      total: calcularTotal(props.carrito),
    };

    if (rechazarPago) {
      // El carrito se mantiene para poder reintentar.
      navigate("/compra/error", { state: { pedido } });
    } else {
      props.onVaciar();
      navigate("/compra/exito", { state: { pedido } });
    }
  };

  if (props.carrito.length === 0) {
    return (
      <section className="flex flex-col items-start gap-4">
        <h1 className="font-display text-4xl">Finalizar compra</h1>
        <p className="text-tinta-600">Tu carrito está vacío.</p>
        <Boton a="/catalogo">Ir al catálogo</Boton>
      </section>
    );
  }

  return (
    <section>
      <h1 className="mb-6 font-display text-4xl">Finalizar compra</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo etiqueta="Nombre" nombre="nombre" value={formData.nombre} onChange={handleChange} error={errores.nombre} />
            <Campo
              etiqueta="Apellidos"
              nombre="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              error={errores.apellidos}
            />
          </div>
          <Campo
            etiqueta="Correo"
            tipo="email"
            nombre="correo"
            value={formData.correo}
            onChange={handleChange}
            error={errores.correo}
          />

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1.5 text-sm font-medium">Entrega</legend>
            <label className="flex items-center gap-2">
              <input type="radio" name="entrega" value="despacho" checked={esDespacho} onChange={handleChange} />
              Despacho a domicilio
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="entrega" value="retiro" checked={!esDespacho} onChange={handleChange} />
              Retiro en tienda (Viña del Mar)
            </label>
          </fieldset>

          {esDespacho && (
            <>
              <Campo etiqueta="Calle y número" nombre="calle" value={formData.calle} onChange={handleChange} error={errores.calle} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Selector
                  etiqueta="Región"
                  nombre="region"
                  value={formData.region}
                  onChange={handleChange}
                  error={errores.region}
                  opciones={regiones.map((r) => ({ valor: r.id, texto: r.nombre }))}
                />
                <Selector
                  etiqueta="Comuna"
                  nombre="comuna"
                  value={formData.comuna}
                  onChange={handleChange}
                  error={errores.comuna}
                  opciones={comunas.map((c) => ({ valor: c, texto: c }))}
                />
              </div>
            </>
          )}

          <label className="flex items-center gap-2 text-sm text-tinta-600">
            <input type="checkbox" checked={rechazarPago} onChange={(e) => setRechazarPago(e.target.checked)} />
            Simular pago rechazado (demostración)
          </label>

          <div>
            <Boton tipo="submit">Pagar ${calcularTotal(props.carrito).toLocaleString("es-CL")}</Boton>
          </div>
        </form>

        <ResumenPedido lineas={props.carrito} />
      </div>
    </section>
  );
}

// Lista desplegable con el mismo aspecto que Campo. Solo la usa este formulario.
function Selector(props) {
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

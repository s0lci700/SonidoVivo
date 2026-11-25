import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boton } from "../components/Boton";
import { Campo } from "../components/Campo";
import { Selector } from "../components/Selector";
import { ResumenPedido } from "../components/ResumenPedido";
import { obtenerRegiones } from "../services/regionService";
import { obtenerSesion } from "../services/authService";
import { crearPedido } from "../services/pedidoService";
import { calcularTotal } from "../utils/carrito";
import { validarTexto } from "../utils/validaciones";
import { formatearPrecio } from "../utils/formatearPrecio";

const formularioVacio = {
  nombre: "",
  apellidos: "",
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
  const [errorEnvio, setErrorEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);
  // El pedido queda a nombre del correo de la sesión (lo toma ms-pedidos del JWT).
  const sesion = obtenerSesion();

  useEffect(() => {
    obtenerRegiones().then(setRegiones);
  }, []);

  const comunas =
    regiones.find((region) => region.id === formData.region)?.comunas ?? [];
  const esDespacho = formData.entrega === "despacho";

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Al cambiar de región, la comuna elegida ya no corresponde.
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "region" ? { comuna: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    if (!validarTexto(formData.nombre, 2))
      nuevosErrores.nombre = "Ingresa tu nombre.";
    if (!validarTexto(formData.apellidos, 2))
      nuevosErrores.apellidos = "Ingresa tus apellidos.";
    if (esDespacho) {
      if (!validarTexto(formData.calle, 5))
        nuevosErrores.calle = "Ingresa calle y número.";
      if (!formData.region) nuevosErrores.region = "Elige una región.";
      if (!formData.comuna) nuevosErrores.comuna = "Elige una comuna.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const region = regiones.find((r) => r.id === formData.region);
    const nombreCliente = `${formData.nombre} ${formData.apellidos}`;
    const direccion = esDespacho
      ? `${formData.calle}, ${formData.comuna}, ${region?.nombre}`
      : null;
    // Lo que muestra ResultadoCompra.
    const resumen = {
      cliente: nombreCliente,
      correo: sesion.correo,
      entrega: esDespacho ? `Despacho a ${direccion}` : "Retiro en tienda, Viña del Mar",
      lineas: props.carrito,
      total: calcularTotal(props.carrito),
    };

    if (rechazarPago) {
      // Pago simulado rechazado: no se crea el pedido y el carrito se mantiene.
      navigate("/compra/error", { state: { pedido: resumen } });
      return;
    }

    setErrorEnvio("");
    setEnviando(true);
    try {
      const creado = await crearPedido({
        nombreCliente,
        entrega: esDespacho ? "DESPACHO" : "RETIRO",
        direccion,
        carrito: props.carrito,
      });
      props.onVaciar();
      // El total que vale es el que calculó el servidor con sus precios.
      navigate("/compra/exito", { state: { pedido: { ...resumen, numero: creado.id, total: creado.total } } });
    } catch (error) {
      // 409 sin stock, 401 sesión vencida, 0 sin conexión...
      setErrorEnvio(error.message);
    } finally {
      setEnviando(false);
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

  if (!sesion) {
    return (
      <section className="flex flex-col items-start gap-4">
        <h1 className="font-display text-4xl">Finalizar compra</h1>
        <p className="text-tinta-600">
          Inicia sesión para confirmar tu pedido. Tu carrito se mantiene.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/login"
            state={{ desde: "/checkout" }}
            className="inline-flex h-11 items-center rounded-full bg-laton-500 px-4.5 text-sm font-semibold text-laca-900"
          >
            Ingresar
          </Link>
          <Boton a="/registro" variante="secundario">
            Crear cuenta
          </Boton>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="mb-6 font-display text-4xl">Finalizar compra</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              etiqueta="Nombre"
              nombre="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={errores.nombre}
            />
            <Campo
              etiqueta="Apellidos"
              nombre="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              error={errores.apellidos}
            />
          </div>
          <p className="text-sm text-tinta-600">
            El pedido queda asociado a tu cuenta: <strong>{sesion.correo}</strong>
          </p>

          <fieldset className="mt-2 flex flex-col border-t border-marfil-300 pt-5">
            <legend className="float-left mb-1 w-full text-sm font-medium">
              Entrega
            </legend>
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="entrega"
                value="despacho"
                checked={esDespacho}
                onChange={handleChange}
                className="size-4"
              />
              Despacho a domicilio
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="entrega"
                value="retiro"
                checked={!esDespacho}
                onChange={handleChange}
                className="size-4"
              />
              Retiro en tienda (Viña del Mar)
            </label>
          </fieldset>

          {esDespacho && (
            <>
              <Campo
                etiqueta="Calle y número"
                nombre="calle"
                value={formData.calle}
                onChange={handleChange}
                error={errores.calle}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Selector
                  etiqueta="Región"
                  nombre="region"
                  value={formData.region}
                  onChange={handleChange}
                  error={errores.region}
                  opciones={regiones.map((r) => ({
                    valor: r.id,
                    texto: r.nombre,
                  }))}
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

          <div className="mt-2 flex flex-col items-start gap-3 border-t border-marfil-300 pt-5">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-tinta-600">
              <input
                type="checkbox"
                checked={rechazarPago}
                onChange={(e) => setRechazarPago(e.target.checked)}
                className="size-4"
              />
              Simular pago rechazado (demostración)
            </label>
            <Boton tipo="submit" deshabilitado={enviando}>
              Pagar {formatearPrecio(calcularTotal(props.carrito))}
            </Boton>
            {errorEnvio && (
              <p role="alert" className="text-sm text-cobre-600">
                {errorEnvio}
              </p>
            )}
          </div>
        </form>

        {/* En móvil el resumen va primero, para ver qué se paga antes de llenar el formulario. */}
        <div className="order-first self-start lg:sticky lg:top-6 lg:order-last">
          <ResumenPedido lineas={props.carrito} />
        </div>
      </div>
    </section>
  );
}

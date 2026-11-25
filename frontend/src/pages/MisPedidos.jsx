import { useEffect, useState } from "react";
import { TablaPedidos } from "../components/TablaPedidos";
import { obtenerSesion } from "../services/authService";
import { obtenerMisPedidos } from "../services/pedidoService";

// Historial del cliente (RF-28): ve el estado de cada pedido.
export function MisPedidos() {
  const [pedidos, setPedidos] = useState(null);
  const [error, setError] = useState("");
  const sesion = obtenerSesion();

  useEffect(() => {
    obtenerMisPedidos()
      .then(setPedidos)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">Mis pedidos</h1>
        <p className="mt-1 text-sm text-tinta-600">{sesion?.nombre}</p>
      </div>
      {error && (
        <p role="alert" className="text-cobre-600">
          {error}
        </p>
      )}
      {pedidos === null && !error && <p role="status">Cargando…</p>}
      {pedidos && <TablaPedidos pedidos={pedidos} />}
    </section>
  );
}

import { useEffect, useState } from "react";
import { TablaPedidos } from "../components/TablaPedidos";
import { ESTADOS, cambiarEstadoPedido, obtenerPedidos } from "../services/pedidoService";

// Gestión de pedidos para VENDEDOR y ADMINISTRADOR (caso §0.2):
// filtrar por estado y avanzar el pedido. Cancelar devuelve el stock (lo hace el backend).
export function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerPedidos(filtro)
      .then(setPedidos)
      .catch((e) => setError(e.message));
  }, [filtro]);

  async function cambiar(pedido, estado) {
    if (estado === "CANCELADO" && !window.confirm(`¿Cancelar el pedido #${pedido.id}? Se repone el stock.`)) {
      return;
    }
    setError("");
    try {
      const actualizado = await cambiarEstadoPedido(pedido.id, estado);
      setPedidos((lista) => lista.map((p) => (p.id === actualizado.id ? actualizado : p)));
    } catch (e) {
      setError(e.message);
    }
  }

  // Entregado y cancelado son estados finales: no se ofrecen acciones.
  function acciones(pedido) {
    if (pedido.estado === "ENTREGADO" || pedido.estado === "CANCELADO") return null;
    return (
      <label className="flex items-center gap-2 text-sm">
        Cambiar a
        <select
          value=""
          onChange={(e) => cambiar(pedido, e.target.value)}
          className="min-h-11 rounded-lg border border-marfil-300 bg-white px-2"
        >
          <option value="" disabled>
            Elegir…
          </option>
          {Object.entries(ESTADOS)
            .filter(([valor]) => valor !== pedido.estado)
            .map(([valor, texto]) => (
              <option key={valor} value={valor}>
                {texto}
              </option>
            ))}
        </select>
      </label>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl">Pedidos</h1>
        <label className="flex items-center gap-2 text-sm">
          Estado
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="min-h-11 rounded-lg border border-marfil-300 bg-white px-2"
          >
            <option value="">Todos</option>
            {Object.entries(ESTADOS).map(([valor, texto]) => (
              <option key={valor} value={valor}>
                {texto}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && (
        <p role="alert" className="text-cobre-600">
          {error}
        </p>
      )}
      <TablaPedidos pedidos={pedidos} acciones={acciones} />
    </section>
  );
}

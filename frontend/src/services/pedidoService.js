// Pedidos en ms-pedidos. Todas las llamadas necesitan sesión (token).
import { API, pedirApi } from "./api";

const url = (ruta = "") => `${API.pedidos}/api/pedidos${ruta}`;

// Nombres que se muestran para cada estado del backend.
export const ESTADOS = {
  EN_PREPARACION: "En preparación",
  DESPACHADO: "Despachado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

// carrito: [{ codigo, cantidad, ... }] como lo maneja utils/carrito.
// El backend pone los precios; aquí solo van códigos y cantidades.
export async function crearPedido({ nombreCliente, entrega, direccion, carrito }) {
  return pedirApi(url(), {
    metodo: "POST",
    cuerpo: {
      nombreCliente,
      entrega, // "DESPACHO" o "RETIRO"
      direccion,
      items: carrito.map((linea) => ({ codigo: linea.codigo, cantidad: linea.cantidad })),
    },
  });
}

// CLIENTE: su historial.
export async function obtenerMisPedidos() {
  return pedirApi(url("/mios"));
}

// VENDEDOR / ADMINISTRADOR: todos, o solo los de un estado.
export async function obtenerPedidos(estado) {
  return pedirApi(url(estado ? `?estado=${estado}` : ""));
}

export async function cambiarEstadoPedido(id, estado) {
  return pedirApi(url(`/${id}/estado`), { metodo: "PATCH", cuerpo: { estado } });
}

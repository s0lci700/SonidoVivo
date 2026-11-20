// Gestión de usuarios en ms-usuarios (solo ADMINISTRADOR, RF-58).
import { API, pedirApi } from "./api";

const url = (ruta = "") => `${API.usuarios}/api/usuarios${ruta}`;

export const ROLES = ["ADMINISTRADOR", "VENDEDOR", "CLIENTE"];

export async function obtenerUsuarios() {
  return pedirApi(url());
}

// datos: { nombre, correo, password, rol, activo }
export async function crearUsuario(datos) {
  return pedirApi(url(), { metodo: "POST", cuerpo: datos });
}

// password vacía = no cambiarla.
export async function actualizarUsuario(id, datos) {
  return pedirApi(url(`/${id}`), { metodo: "PUT", cuerpo: datos });
}

// No borra: desactiva. Para reactivar se usa actualizarUsuario con activo: true.
export async function desactivarUsuario(id) {
  return pedirApi(url(`/${id}`), { metodo: "DELETE" });
}

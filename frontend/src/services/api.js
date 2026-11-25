import { borrarSesion, leerSesion } from "./sesion";

// Una URL por microservicio. Se cambian en frontend/.env (ver .env.example).
export const API = {
  productos: import.meta.env.VITE_API_PRODUCTOS ?? "http://localhost:8081",
  usuarios: import.meta.env.VITE_API_USUARIOS ?? "http://localhost:8082",
  pedidos: import.meta.env.VITE_API_PEDIDOS ?? "http://localhost:8083",
};

// Error con el código HTTP, para que cada página decida qué mostrar.
// estado 0 = no hubo respuesta (backend apagado o sin red).
export class ErrorApi extends Error {
  constructor(mensaje, estado, campos = {}) {
    super(mensaje);
    this.estado = estado;
    this.campos = campos; // errores por campo que devuelve @Valid: { precio: "..." }
  }
}

// Único lugar donde se llama a fetch. Agrega el token si hay sesión y
// convierte las respuestas de error en ErrorApi.
//   401 -> el token falta, venció o es inválido: se borra la sesión.
//   403 -> la sesión es válida pero el rol no alcanza: la sesión se conserva.
export async function pedirApi(url, opciones = {}) {
  const sesion = leerSesion();
  const headers = {};
  if (opciones.cuerpo !== undefined) headers["Content-Type"] = "application/json";
  if (sesion) headers.Authorization = `Bearer ${sesion.token}`;

  let respuesta;
  try {
    respuesta = await fetch(url, {
      method: opciones.metodo ?? "GET",
      headers,
      body: opciones.cuerpo !== undefined ? JSON.stringify(opciones.cuerpo) : undefined,
    });
  } catch {
    throw new ErrorApi("No se pudo conectar con el servidor. Intenta de nuevo.", 0);
  }

  if (respuesta.status === 204) return null;

  // Algunos errores (por ejemplo, el 401 de Spring Security) pueden venir sin cuerpo.
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    if (respuesta.status === 401 && sesion) borrarSesion();
    const mensaje =
      datos?.error ??
      (respuesta.status === 403
        ? "No tienes permisos para esta acción."
        : `Error ${respuesta.status}`);
    throw new ErrorApi(mensaje, respuesta.status, datos?.campos);
  }
  return datos;
}

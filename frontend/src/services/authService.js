// Parcial 2: sesión simulada en localStorage. En el Parcial 3 este archivo
// delega el login a la API REST (JWT), manteniendo los mismos nombres y firmas.
const CLAVE_SESION = "usuarioActual";

// TODO: iniciarSesion(correo, password) -> true/false.
//   Valida contra los usuarios simulados y guarda { correo, nombre, rol } en CLAVE_SESION.
// TODO: registrarUsuario(datos) -> agrega un Cliente a los usuarios simulados.

export function obtenerSesion() {
  return JSON.parse(localStorage.getItem(CLAVE_SESION));
}

export function estaAutenticado() {
  return obtenerSesion() !== null;
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

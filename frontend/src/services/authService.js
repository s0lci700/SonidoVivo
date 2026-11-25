import { API, ErrorApi, pedirApi } from "./api";
import { borrarSesion, guardarSesion, leerSesion } from "./sesion";

// Parcial 3: el login lo resuelve ms-usuarios y devuelve un JWT.
// Se mantienen los nombres del Parcial 2 (iniciarSesion, obtenerSesion, ...),
// pero iniciarSesion ahora es async.

// Promesa de la última verificación con /auth/me. Se guarda para preguntar
// UNA vez por carga de página (F5) y no en cada cambio de ruta.
let verificacion = null;

// true si entró; false si las credenciales son incorrectas.
// Otros errores (servidor apagado) se lanzan como ErrorApi.
export async function iniciarSesion(correo, password) {
  try {
    const r = await pedirApi(`${API.usuarios}/auth/login`, {
      metodo: "POST",
      cuerpo: { correo, password },
    });
    guardarSesion({
      token: r.token,
      correo: r.correo,
      nombre: r.nombre,
      rol: r.rol,
      expiraEn: r.expiraEn,
    });
    // Recién emitido por el servidor: no hace falta volver a preguntarle.
    verificacion = Promise.resolve(leerSesion());
    return true;
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 401) return false;
    throw error;
  }
}

// Registro público (RF-36): ms-usuarios siempre crea un CLIENTE.
export async function registrarUsuario(datos) {
  return pedirApi(`${API.usuarios}/auth/registro`, {
    metodo: "POST",
    cuerpo: { nombre: datos.nombre, correo: datos.correo, password: datos.password },
  });
}

// Lectura local y sin red: sirve para dibujar el Header o el saludo.
// Para decidir acceso a una ruta se usa validarSesion().
export function obtenerSesion() {
  return leerSesion();
}

export function estaAutenticado() {
  return leerSesion() !== null;
}

// Confirma con el backend que el token guardado sigue siendo válido (F5).
// Devuelve la sesión (con el rol que dice el servidor) o null si ya no vale.
// Si el backend no responde lanza ErrorApi con estado 0: la página ofrece Reintentar.
export function validarSesion() {
  if (!leerSesion()) return Promise.resolve(null);
  if (!verificacion) {
    verificacion = pedirApi(`${API.usuarios}/auth/me`)
      .then((yo) => {
        const actual = leerSesion();
        if (!actual) return null;
        // El rol que vale es el del servidor (pudo cambiarlo un administrador).
        const sesion = { ...actual, nombre: yo.nombre, rol: yo.rol };
        guardarSesion(sesion);
        return sesion;
      })
      .catch((error) => {
        verificacion = null; // permite reintentar
        if (error.estado === 401) return null; // pedirApi ya borró la sesión
        throw error;
      });
  }
  return verificacion;
}

// Logout: borra el token del navegador. No lo revoca en el servidor
// (seguirá siendo válido hasta su vencimiento si alguien lo copió).
export function cerrarSesion() {
  borrarSesion();
  verificacion = null;
}

// Página de inicio de cada rol después de iniciar sesión.
export function rutaInicio(rol) {
  if (rol === "ADMINISTRADOR") return "/admin";
  if (rol === "VENDEDOR") return "/admin/pedidos";
  return "/mis-pedidos";
}

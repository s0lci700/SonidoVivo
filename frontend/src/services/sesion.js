// Dónde y cómo se guarda la sesión en el navegador (IE3.3.2).
//
// sessionStorage: sobrevive a F5, pero se borra al cerrar la pestaña.
// Guarda { token, correo, nombre, rol, expiraEn }. Nunca la contraseña.
//
// Ojo: leer "expiraEn" aquí NO valida el token (React no puede verificar la firma).
// Solo evita usar un token que ya sabemos vencido; quien decide es el backend
// (JwtFilter) y, al recargar, GET /auth/me.

const CLAVE = "sesion";

export function guardarSesion(sesion) {
  sessionStorage.setItem(CLAVE, JSON.stringify(sesion));
}

// Devuelve la sesión guardada, o null si no hay o si ya venció.
export function leerSesion() {
  const texto = sessionStorage.getItem(CLAVE);
  if (!texto) return null;
  let sesion;
  try {
    sesion = JSON.parse(texto);
  } catch {
    borrarSesion();
    return null;
  }
  if (!sesion?.token || !sesion.expiraEn || Date.now() >= sesion.expiraEn) {
    borrarSesion();
    return null;
  }
  return sesion;
}

export function borrarSesion() {
  sessionStorage.removeItem(CLAVE);
}

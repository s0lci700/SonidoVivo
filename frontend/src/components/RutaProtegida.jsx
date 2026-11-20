import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Boton } from "./Boton";
import { obtenerSesion, validarSesion } from "../services/authService";

// Envuelve páginas que requieren sesión (IE3.3.2 e IE3.3.3).
// Props: children y, opcional, roles={["ADMINISTRADOR", "VENDEDOR"]}.
//
//  1. Sin sesión guardada (o vencida)  -> /login, recordando a dónde quería ir.
//  2. Con sesión: pregunta a GET /auth/me si el token sigue valiendo (una vez por F5).
//       - el servidor dice 401        -> /login
//       - el servidor no responde     -> mensaje y botón Reintentar (no se da por válida)
//  3. Rol que no está en "roles"      -> /sin-permiso
//
// Esto solo oculta pantallas: la protección real de los datos está en el backend,
// que responde 401/403 aunque alguien se salte esta comprobación.
export function RutaProtegida(props) {
  const ubicacion = useLocation();
  // "verificando" | "ok" | "sin-sesion" | "sin-conexion"
  const [estado, setEstado] = useState(obtenerSesion() ? "verificando" : "sin-sesion");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!obtenerSesion()) return;
    let vigente = true;
    validarSesion()
      .then((sesion) => vigente && setEstado(sesion ? "ok" : "sin-sesion"))
      .catch(() => vigente && setEstado("sin-conexion"));
    return () => {
      vigente = false;
    };
  }, [intento]);

  if (estado === "sin-sesion") {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (estado === "verificando") {
    return (
      <p role="status" className="py-10 text-center text-tinta-600">
        Verificando sesión…
      </p>
    );
  }

  if (estado === "sin-conexion") {
    return (
      <section className="flex flex-col items-start gap-4 py-6">
        <h1 className="font-display text-3xl">No pudimos verificar tu sesión</h1>
        <p className="text-tinta-600">
          El servidor no responde. Revisa que el backend esté encendido.
        </p>
        <Boton
          onClick={() => {
            setEstado("verificando");
            setIntento((n) => n + 1);
          }}
        >
          Reintentar
        </Boton>
      </section>
    );
  }

  const rol = obtenerSesion()?.rol;
  if (props.roles && !props.roles.includes(rol)) {
    return <Navigate to="/sin-permiso" replace />;
  }
  return props.children;
}

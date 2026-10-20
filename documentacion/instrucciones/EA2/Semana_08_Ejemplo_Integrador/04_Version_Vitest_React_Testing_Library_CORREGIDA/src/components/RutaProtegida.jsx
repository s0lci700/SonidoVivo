import { Navigate } from "react-router-dom";
import { estaAutenticado } from "../auth/auth.js";

/**
 * Envuelve páginas que requieren sesión.
 * Si no existe usuarioActual, redirige hacia /login.
 */
export default function RutaProtegida({ children }) {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

import { Navigate } from "react-router-dom";
import { estaAutenticado } from "../services/authService";

// Envuelve páginas que requieren sesión; sin sesión redirige a /login.
// TODO: recibir props.rol y comparar con obtenerSesion().rol cuando existan Vendedor y Cliente.
export function RutaProtegida(props) {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return props.children;
}

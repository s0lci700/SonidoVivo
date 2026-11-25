import { Boton } from "../components/Boton";
import { obtenerSesion, rutaInicio } from "../services/authService";

// Destino de RutaProtegida cuando hay sesión pero el rol no alcanza (equivale a un 403).
export function SinPermiso() {
  const sesion = obtenerSesion();
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="font-display text-4xl">Acceso restringido</h1>
      <p className="text-tinta-600">
        Tu cuenta{sesion ? ` (${sesion.rol.toLowerCase()})` : ""} no tiene permiso para ver esta sección.
      </p>
      <Boton a={sesion ? rutaInicio(sesion.rol) : "/"}>Volver</Boton>
    </section>
  );
}

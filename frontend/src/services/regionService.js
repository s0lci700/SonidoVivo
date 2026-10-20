// Parcial 2: regiones y comunas desde el JSON local, para el formulario de Checkout.
import regiones from "../data/regiones.json";

export async function obtenerRegiones() {
  return [...regiones];
}

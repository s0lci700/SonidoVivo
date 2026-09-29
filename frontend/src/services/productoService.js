// Parcial 2: lee el catálogo local. En el Parcial 3 este archivo pasa a usar
// fetch contra la API REST, manteniendo los mismos nombres y firmas.
import productos from "../data/productos.json";

export async function obtenerProductos() {
  return [...productos];
}

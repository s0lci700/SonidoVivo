// Parcial 2: lee el catálogo local. En el Parcial 3 este archivo pasa a usar
// fetch contra la API REST, manteniendo los mismos nombres y firmas.
import productos from "../data/productos.json";
import categorias from "../data/categorias.json";

export async function obtenerProductos(categoriaId) {
  if (!categoriaId) return [...productos];
  return productos.filter((producto) => producto.categoriaId === categoriaId);
}

export async function obtenerCategorias() {
  return [...categorias];
}
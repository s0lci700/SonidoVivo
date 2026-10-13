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

// TODO (CRUD simulado que pide el Anexo 1): hoy el catálogo es de solo lectura.
//   Para crear/editar/eliminar hay que trabajar sobre una copia mutable de
//   productos.json guardada en localStorage, y que las funciones de arriba lean de ahí.
// TODO: obtenerProductoPorCodigo(codigo)        -> lo usa DetalleProducto y AdminProductoForm
// TODO: crearProducto(producto)                 -> AdminProductoForm (nuevo)
// TODO: actualizarProducto(codigo, cambios)     -> AdminProductoForm (editar)
// TODO: eliminarProducto(codigo)                -> AdminProductos
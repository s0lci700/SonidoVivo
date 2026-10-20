// Parcial 2: lee el catálogo local. En el Parcial 3 este archivo pasa a usar
// fetch contra la API REST, manteniendo los mismos nombres y firmas.
import productos from "../data/productos.json";
import categorias from "../data/categorias.json";

const CLAVE = "productos";

// Funciones locales

function leerProductos() {
  const guardado = localStorage.getItem(CLAVE);
  return guardado ? JSON.parse(guardado) : [...productos];
}

function guardarProductos(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}


// READ
export async function obtenerProductos(categoriaId) {
  const lista = leerProductos();
  if (!categoriaId) return [...lista];
  return lista.filter((producto) => producto.categoriaId === categoriaId);
}

export async function obtenerCategorias() {
  return [...categorias];
}

// Devuelve null si el código no existe. Lee a través de obtenerProductos para
// seguir funcionando cuando el CRUD cambie de dónde salen los productos.
export async function obtenerProductoPorCodigo(codigo) {
  const lista = await obtenerProductos();
  return lista.find((producto) => producto.codigo === codigo) ?? null;
}

// CRUD simulado: las funciones escriben sobre la copia del catálogo en localStorage.
// CREATE
export async function crearProducto(producto) {
  const lista = leerProductos();
  const existe = lista.some((p) => p.codigo === producto.codigo);
  if (existe) {
    throw new Error("Ya existe un producto con ese código");
  } 
  guardarProductos([...lista, producto]);
  return producto;
}

// UPDATE
export async function actualizarProducto(codigo, cambios) {
  const lista = leerProductos();
  const actual = lista.find((p) => p.codigo === codigo);
  if (!actual) {
    throw new Error("No existe un producto con ese código");
  } 
  const actualizado = { ...actual, ...cambios };
  guardarProductos(lista.map((p) => (p.codigo === codigo ? actualizado : p)));
  return actualizado;
}

// DELETE
export async function eliminarProducto(codigo) {
  const lista = leerProductos();
  const prod = lista.find((p) => p.codigo === codigo);
  if (!prod) {
    throw new Error("No existe un producto con ese código");
  } 
  guardarProductos(lista.filter((p) => (p.codigo !== codigo)));
  return prod;
}
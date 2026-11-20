// Parcial 3: lee y modifica el catálogo en ms-productos (API REST).
// Se mantienen los nombres y firmas del Parcial 2, así las páginas no cambian.
import { API, pedirApi } from "./api";

// El backend devuelve la categoría como objeto { id, nombre }.
// Las páginas usan la forma plana del Parcial 2: categoriaId + categoria (nombre).
function aFrontend(p) {
  return {
    codigo: p.codigo,
    nombre: p.nombre,
    marca: p.marca,
    modelo: p.modelo,
    stock: p.stock,
    precio: p.precio,
    descripcion: p.descripcion,
    categoriaId: p.categoria?.id,
    categoria: p.categoria?.nombre,
  };
}

// Y al revés para POST/PUT: el backend espera "categoria": { "id": "GA" }.
function aBackend(p) {
  return {
    codigo: p.codigo,
    nombre: p.nombre,
    marca: p.marca,
    modelo: p.modelo,
    stock: p.stock,
    precio: p.precio,
    descripcion: p.descripcion,
    categoria: { id: p.categoriaId },
  };
}

const url = (ruta) => `${API.productos}/api${ruta}`;

// READ
export async function obtenerProductos(categoriaId) {
  const consulta = categoriaId ? `?categoria=${encodeURIComponent(categoriaId)}` : "";
  const lista = await pedirApi(url(`/productos${consulta}`));
  return lista.map(aFrontend);
}

export async function obtenerCategorias() {
  return pedirApi(url("/categorias"));
}

// Devuelve null si el código no existe (404).
export async function obtenerProductoPorCodigo(codigo) {
  try {
    return aFrontend(await pedirApi(url(`/productos/${encodeURIComponent(codigo)}`)));
  } catch (error) {
    if (error.estado === 404) return null;
    throw error;
  }
}

// CREATE (solo ADMINISTRADOR)
export async function crearProducto(producto) {
  return aFrontend(await pedirApi(url("/productos"), { metodo: "POST", cuerpo: aBackend(producto) }));
}

// UPDATE (solo ADMINISTRADOR). "cambios" trae el producto completo, como en el formulario.
export async function actualizarProducto(codigo, cambios) {
  const actual = await obtenerProductoPorCodigo(codigo);
  if (!actual) throw new Error("No existe un producto con ese código");
  const cuerpo = aBackend({ ...actual, ...cambios });
  return aFrontend(
    await pedirApi(url(`/productos/${encodeURIComponent(codigo)}`), { metodo: "PUT", cuerpo }),
  );
}

// DELETE (solo ADMINISTRADOR)
export async function eliminarProducto(codigo) {
  await pedirApi(url(`/productos/${encodeURIComponent(codigo)}`), { metodo: "DELETE" });
  return { codigo };
}

// Stock (ADMINISTRADOR o VENDEDOR)
export async function cambiarStock(codigo, stock) {
  return aFrontend(
    await pedirApi(url(`/productos/${encodeURIComponent(codigo)}/stock`), {
      metodo: "PATCH",
      cuerpo: { cantidad: stock },
    }),
  );
}

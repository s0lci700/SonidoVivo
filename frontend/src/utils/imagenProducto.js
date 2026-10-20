// Fotos de productos: Vite las empaqueta y entrega su URL final.
// La usan Item, DetalleProducto y Carrito, para no repetir el import.meta.glob.
const imagenes = import.meta.glob("../assets/productos/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
});

export function imagenProducto(codigo) {
  return imagenes[`../assets/productos/${codigo}.webp`];
}

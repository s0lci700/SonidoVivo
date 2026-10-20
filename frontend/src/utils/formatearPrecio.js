// Precio en pesos chilenos para mostrar: 129990 -> "$129.990".
// Un solo lugar para el formato, en vez de repetir toLocaleString en cada página.
export function formatearPrecio(precio) {
  return `$${precio.toLocaleString("es-CL")}`;
}

export function estadoStock(stock) {
  if (stock <= 0) return { texto: "Agotado", color: "text-tinta-600", punto: "bg-tinta-600" };
  if (stock <= 3) return { texto: `Últimas ${stock} unidades`, color: "text-cobre-600", punto: "bg-cobre-600" };
  return { texto: `En stock · ${stock} disponibles`, color: "text-patina-600", punto: "bg-patina-600" };
}
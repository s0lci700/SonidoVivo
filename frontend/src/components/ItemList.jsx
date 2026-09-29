import { Item } from "./Item";
import productos from "../data/productos.json";

export function ItemList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <Item key={producto.codigo} {...producto} />
      ))}
    </div>
  );
}
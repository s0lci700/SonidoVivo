import { useEffect, useState } from "react";
import { Item } from "./Item";
import { obtenerProductos } from "../services/productoService";

export function ItemList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerProductos().then(setProductos);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <Item key={producto.codigo} {...producto} />
      ))}
    </div>
  );
}

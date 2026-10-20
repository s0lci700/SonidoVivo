import { useMemo, useState } from "react";
import ProductoCard from "../components/ProductoCard.jsx";
import { productos } from "../data/productos.js";

/** Página equivalente a productos.html. */
export default function Productos() {
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(texto),
    );
  }, [busqueda]);

  return (
    <>
      <section className="hero">
        <h2>Productos</h2>
        <p>El catálogo ahora se representa con componentes y props.</p>
      </section>

      <input
        className="buscador"
        type="search"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

      <section className="grid-productos">
        {productosFiltrados.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </section>
    </>
  );
}

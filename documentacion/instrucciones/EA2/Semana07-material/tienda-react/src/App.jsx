import { useState } from "react";
import "./App.css";

const productos = [
  {
    id: 1,
    nombre: "Notebook Lenovo",
    precio: 599990,
    categoria: "Computadores",
    imagen: "https://via.placeholder.com/300x200?text=Notebook"
  },
  {
    id: 2,
    nombre: "Mouse inalámbrico",
    precio: 19990,
    categoria: "Accesorios",
    imagen: "https://via.placeholder.com/300x200?text=Mouse"
  },
  {
    id: 3,
    nombre: "Teclado mecánico",
    precio: 49990,
    categoria: "Accesorios",
    imagen: "https://via.placeholder.com/300x200?text=Teclado"
  },
  {
    id: 4,
    nombre: "Audífonos Bluetooth",
    precio: 34990,
    categoria: "Audio",
    imagen: "https://via.placeholder.com/300x200?text=Audifonos"
  }
];

function App() {
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  function agregarAlCarrito(producto) {
    setCarrito([...carrito, producto]);
  }

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="app">

      <header className="header">
        <h1>🛍️ Mi Tienda</h1>

        <div className="carrito">
          🛒 Carrito: {carrito.length}
        </div>
      </header>

      <main>

        <section className="presentacion">
          <h2>Bienvenido a Mi Tienda</h2>
          <p>Encuentra los mejores productos tecnológicos.</p>
        </section>

        <section className="buscador">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </section>

        <section className="productos">

          {productosFiltrados.map((producto) => (

            <div className="producto" key={producto.id}>

              <img
                src={producto.imagen}
                alt={producto.nombre}
              />

              <div className="producto-info">

                <span className="categoria">
                  {producto.categoria}
                </span>

                <h3>{producto.nombre}</h3>

                <p className="precio">
                  ${producto.precio.toLocaleString("es-CL")}
                </p>

                <button
                  onClick={() => agregarAlCarrito(producto)}
                >
                  Agregar al carrito
                </button>

              </div>

            </div>

          ))}

        </section>

      </main>

      <footer>
        <p>© 2026 Mi Tienda - Proyecto React</p>
      </footer>

    </div>
  );
}

export default App;


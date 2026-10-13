import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boton } from "../components/Boton";
import { Item } from "../components/Item";
import { obtenerCategorias, obtenerProductos } from "../services/productoService";
import guitarra from "../assets/productos/GE001.webp";

// Productos que se muestran en la portada, en este orden.
const DESTACADOS = ["GE001", "BT001", "TC001", "MI001"];

export function Inicio() {
  const [categorias, setCategorias] = useState([]);
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    obtenerCategorias().then(setCategorias);
    obtenerProductos().then((productos) =>
      setDestacados(
        DESTACADOS.map((codigo) => productos.find((producto) => producto.codigo === codigo)).filter(
          Boolean,
        ),
      ),
    );
  }, []);

  return (
    <>
      <section className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <h1 className="font-display text-5xl leading-[1.05] text-balance sm:text-6xl">
            Instrumentos, equipos y buen consejo.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-pretty text-tinta-600">
            Guitarras, bajos, baterías, teclados y todo lo que necesitas para tocar. Revisa
            precios y stock antes de pasar por la tienda.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Boton a="/catalogo">Ver el catálogo</Boton>
            <Boton a="/contacto" variante="secundario">
              Escríbenos
            </Boton>
          </div>
        </div>

        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-marfil-300 bg-marfil-200">
          <img
            src={guitarra}
            alt="Guitarra eléctrica Squier Affinity Stratocaster"
            className="h-full w-full object-contain p-6"
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Busca por categoría</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {categorias.map((categoria) => (
            <li key={categoria.id}>
              <Link
                to={`/catalogo?categoria=${categoria.id}`}
                className="flex h-11 items-center rounded-full border border-marfil-300 bg-marfil-50 px-4 text-sm font-medium transition-colors hover:bg-marfil-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-800"
              >
                {categoria.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl">Para empezar a mirar</h2>
          <Link
            to="/catalogo"
            className="rounded-sm text-sm font-medium text-laton-800 underline underline-offset-4 hover:text-laca-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-laton-800"
          >
            Ver todo el catálogo
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((producto) => (
            <Item key={producto.codigo} {...producto} />
          ))}
        </div>
      </section>
    </>
  );
}

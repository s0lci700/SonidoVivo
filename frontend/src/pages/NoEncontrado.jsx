import { Link } from "react-router-dom";

export function NoEncontrado() {
  return (
    <section>
      <h1 className="mb-4 font-display text-4xl">Página no encontrada</h1>
      <Link to="/catalogo" className="text-laton-800 underline">
        Ir al catálogo
      </Link>
    </section>
  );
}

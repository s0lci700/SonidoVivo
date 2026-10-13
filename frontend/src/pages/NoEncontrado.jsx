import { Boton } from "../components/Boton";

export function NoEncontrado() {
  return (
    <section className="mx-auto max-w-xl py-10 text-center">
      <h1 className="font-display text-4xl text-balance">Esta página no existe</h1>
      <p className="mt-3 text-tinta-600">
        Puede que el enlace esté mal escrito o que el producto ya no esté en el catálogo.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Boton a="/catalogo">Ir al catálogo</Boton>
        <Boton a="/" variante="secundario">
          Volver al inicio
        </Boton>
      </div>
    </section>
  );
}

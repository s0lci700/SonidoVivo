const datos = [
  { valor: "11 años", texto: "atendiendo a músicos de Viña del Mar" },
  { valor: "340", texto: "referencias en catálogo" },
  { valor: "3", texto: "personas detrás del mesón" },
];

export function Nosotros() {
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-4 font-display text-4xl">Nosotros</h1>

      <p className="mb-4 leading-relaxed text-pretty">
        Sonido Vivo es una tienda especializada en instrumentos musicales, equipos de sonido y
        accesorios para músicos, en Viña del Mar. La atienden su dueño y dos vendedores, que
        conocen cada producto que sale de la bodega.
      </p>
      <p className="mb-8 leading-relaxed text-pretty text-tinta-600">
        Trabajamos guitarras, bajos, baterías, teclados, amplificadores, micrófonos, pedales de
        efectos y accesorios, y contamos con taller de reparación de instrumentos de cuerda.
        Hace algunos años empezamos a recibir pedidos de otras ciudades; esta tienda en línea
        existe para que puedas revisar el catálogo con precios y stock al día, y comprar sin
        depender de un mensaje.
      </p>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {datos.map((dato) => (
          <div key={dato.valor} className="rounded-2xl border border-marfil-300 bg-marfil-50 p-5">
            <dt className="font-display text-3xl text-laton-800">{dato.valor}</dt>
            <dd className="text-sm text-tinta-600">{dato.texto}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

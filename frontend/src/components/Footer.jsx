import { Link } from "react-router-dom";

const enlaces = [
  { ruta: "/catalogo", texto: "Catálogo" },
  { ruta: "/nosotros", texto: "Nosotros" },
  { ruta: "/contacto", texto: "Contacto" },
  { ruta: "/login", texto: "Ingresar" },
];

const enlace =
  "rounded-sm transition-colors hover:text-laton-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-laton-500";

export function Footer() {
  return (
    <footer className="bg-laca-900 text-marfil-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-[28px] tracking-tight text-laton-500">Sonido Vivo</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-marfil-300">
            Instrumentos, equipos de sonido y accesorios para músicos de todos los niveles.
            Once años atendiendo en Viña del Mar.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="text-xs font-semibold tracking-[0.12em] text-marfil-300 uppercase">
            Tienda
          </h2>
          <ul className="mt-3 flex flex-col text-sm">
            {enlaces.map((item) => (
              <li key={item.ruta}>
                <Link to={item.ruta} className={`${enlace} inline-block py-1.5`}>
                  {item.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.12em] text-marfil-300 uppercase">
            Visítanos
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            Viña del Mar
            <br />
            Región de Valparaíso
          </p>
          <p className="mt-3 text-sm leading-relaxed text-marfil-300">
            Taller de reparación de instrumentos de cuerda.
          </p>
        </div>
      </div>

      <div className="border-t border-marfil-100/15">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-marfil-300 sm:px-6">
          Proyecto académico · DSY1104 Desarrollo Full Stack II · Duoc UC
        </p>
      </div>
    </footer>
  );
}

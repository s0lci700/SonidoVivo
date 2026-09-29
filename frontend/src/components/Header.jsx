import { Link, NavLink } from "react-router-dom";

const enlaces = [
    { ruta: "/", texto: "Inicio" },
    { ruta: "/catalogo", texto: "Catálogo" },
    { ruta: "/nosotros", texto: "Nosotros" },
    { ruta: "/contacto", texto: "Contacto" },
];

export function Header() {
  return (
    <header className="bg-laca-900 flex h-20 items-center gap-12 px-6 box-border py-4">
      <div className="flex flex-row flex-1 gap-8 items-center">
        <Link to="/" className="font-display text-[28px] tracking-tight text-laton-500">
        Sonido Vivo
      </Link>
        <nav className="flex flex-1 gap-8">
        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.ruta}
            to={enlace.ruta}
            end
            className={({ isActive }) =>
              `text-[15px] font-medium transition ${
                isActive ? "text-laton-500" : "text-marfil-100 hover:text-laton-500"
              }`
            }
          >
            {enlace.texto}
          </NavLink>
        ))}
      </nav>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-laton-500 px-4.5 py-4.5 text-sm font-semibold text-laca-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(26,23,20,0.25)] transition hover:-translate-y-px hover:brightness-110"
        ></button>
      </div>
    </header>
  );
}

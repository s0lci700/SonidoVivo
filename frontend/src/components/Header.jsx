import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const enlaces = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/catalogo", texto: "Catálogo" },
  { ruta: "/nosotros", texto: "Nosotros" },
  { ruta: "/contacto", texto: "Contacto" },
];

const foco =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-laton-500";

// Los mismos enlaces se dibujan en la barra de escritorio y en el menú móvil.
// El activo se marca con color y subrayado: no depende solo del color.
function Enlaces(props) {
  return enlaces.map((enlace) => (
    <NavLink
      key={enlace.ruta}
      to={enlace.ruta}
      end
      onClick={props.onNavegar}
      className={({ isActive }) =>
        `${props.className} ${foco} text-[15px] font-medium decoration-2 underline-offset-8 transition-colors ${
          isActive ? "text-laton-500 underline" : "text-marfil-100 hover:text-laton-500"
        }`
      }
    >
      {enlace.texto}
    </NavLink>
  ));
}

export function Header(props) {
  // Estado local: si el menú móvil está abierto solo le importa al Header.
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cantidad = props.cantidadCarrito ?? 0;

  return (
    <header className="bg-laca-900 text-marfil-100">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className={`${foco} font-display text-[28px] tracking-tight text-laton-500`}
        >
          Sonido Vivo
        </Link>

        {/* Escritorio: oculto por defecto, visible desde md (768 px). */}
        <nav aria-label="Principal" className="hidden flex-1 gap-8 pl-8 md:flex">
          <Enlaces className="" />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/login"
            className={`${foco} hidden px-3 text-[15px] font-medium text-marfil-100 transition-colors hover:text-laton-500 md:block`}
          >
            Ingresar
          </Link>

          <Link
            to="/carrito"
            aria-label={`Carrito, ${cantidad} ${cantidad === 1 ? "producto" : "productos"}`}
            className="flex h-11 items-center gap-2 rounded-full bg-laton-500 px-4 text-sm font-semibold text-laca-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(26,23,20,0.25)] transition hover:-translate-y-px hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marfil-50 motion-reduce:hover:translate-y-0"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6.2" />
              <circle cx="9.5" cy="19.5" r="1.25" />
              <circle cx="17" cy="19.5" r="1.25" />
            </svg>
            <span className="tabular-nums">{cantidad}</span>
          </Link>

          {/* Móvil: el botón desaparece desde md. aria-expanded informa a los
              lectores de pantalla si el menú está abierto. */}
          <button
            type="button"
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-marfil-100/30 text-marfil-100 transition-colors hover:border-laton-500 hover:text-laton-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laton-500 md:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuAbierto ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Renderizado condicional: el menú móvil solo existe si está abierto.
          Al elegir un enlace se cierra. */}
      {menuAbierto && (
        <nav
          id="menu-movil"
          aria-label="Principal"
          className="flex flex-col border-t border-marfil-100/15 px-4 pb-4 pt-2 md:hidden"
        >
          <Enlaces className="py-3" onNavegar={() => setMenuAbierto(false)} />
          <Link
            to="/login"
            onClick={() => setMenuAbierto(false)}
            className={`${foco} py-3 text-[15px] font-medium text-marfil-100 transition-colors hover:text-laton-500`}
          >
            Ingresar
          </Link>
        </nav>
      )}
    </header>
  );
}

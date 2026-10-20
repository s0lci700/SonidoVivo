import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// Layout común: <Outlet /> es donde React Router inserta la página activa.
export function LayoutPrincipal(props) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header cantidadCarrito={props.cantidadCarrito} pulsoCarrito={props.pulsoCarrito} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

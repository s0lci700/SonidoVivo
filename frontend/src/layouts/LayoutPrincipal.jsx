import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// Layout común: <Outlet /> es donde React Router inserta la página activa.
export function LayoutPrincipal(props) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header cantidadCarrito={props.cantidadCarrito} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

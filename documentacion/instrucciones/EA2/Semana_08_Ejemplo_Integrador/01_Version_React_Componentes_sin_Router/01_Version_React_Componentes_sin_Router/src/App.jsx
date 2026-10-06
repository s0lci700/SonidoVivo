import { useState } from "react";
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";

/**
 * Versión 01.
 * App controla manualmente qué página se muestra.
 * Esto sirve para entender componentes antes de introducir React Router.
 */
export default function App() {
  const [paginaActual, setPaginaActual] = useState("inicio");

  function renderPagina() {
    switch (paginaActual) {
      case "productos":
        return <Productos />;
      case "contacto":
        return <Contacto />;
      case "login":
        return <Login />;
      case "admin":
        return <Admin />;
      default:
        return <Inicio />;
    }
  }

  return (
    <>
      <Header />
      <Navbar paginaActual={paginaActual} onNavegar={setPaginaActual} />

      <main className="main-container">{renderPagina()}</main>

      <Footer />
    </>
  );
}

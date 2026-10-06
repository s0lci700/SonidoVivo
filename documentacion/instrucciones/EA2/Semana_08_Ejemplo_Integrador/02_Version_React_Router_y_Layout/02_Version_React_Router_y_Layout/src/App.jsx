import { Route, Routes } from "react-router-dom";
import LayoutPrincipal from "./layouts/LayoutPrincipal.jsx";
import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";

/** Versión 02: App declara las rutas de la SPA. */
export default function App() {
  return (
    <Routes>
      <Route element={<LayoutPrincipal />}>
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Productos />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="login" element={<Login />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

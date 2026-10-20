import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { LayoutPrincipal } from "./layouts/LayoutPrincipal";
import { RutaProtegida } from "./components/RutaProtegida";
import { Inicio } from "./pages/Inicio";
import { Catalogo } from "./pages/Catalogo";
import { DetalleProducto } from "./pages/DetalleProducto";
import { Nosotros } from "./pages/Nosotros";
import { Contacto } from "./pages/Contacto";
import { Carrito } from "./pages/Carrito";
import { Checkout } from "./pages/Checkout";
import { ResultadoCompra } from "./pages/ResultadoCompra";
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";
import { Admin } from "./pages/Admin";
import { AdminProductos } from "./pages/AdminProductos";
import { AdminProductoForm } from "./pages/AdminProductoForm";
import { NoEncontrado } from "./pages/NoEncontrado";
import { agregarProducto, quitarProducto, cambiarCantidad } from "./utils/carrito";

function App() {
  // El estado vive aquí porque lo comparten Header (contador), Catálogo, Carrito y Checkout.
  const [carrito, setCarrito] = useState([]);
  // Sube en cada «Agregar» (aunque el producto ya estuviera): el Header lo usa para su animación.
  const [pulsoCarrito, setPulsoCarrito] = useState(0);
  
  function agregarAlCarrito(producto) {
    setCarrito((prev) => agregarProducto(prev, producto));
    setPulsoCarrito((n) => n + 1);
  }
  function quitarDelCarrito(codigo) {
    setCarrito((prev) => quitarProducto(prev, codigo));
  }
  function cambiarCantidadCarrito(codigo, cantidad) {
    setCarrito((prev) => cambiarCantidad(prev, codigo,cantidad))
  }
  function vaciarCarrito() {
    setCarrito([]);
  }

  return (
    <Routes>
      <Route element={<LayoutPrincipal cantidadCarrito={carrito.length} pulsoCarrito={pulsoCarrito} />}>
        {/* Tienda */}
        <Route index element={<Inicio />} />
        <Route path="catalogo" element={<Catalogo onAgregar={agregarAlCarrito}/>} />
        <Route path="producto/:codigo" element={<DetalleProducto onAgregar={agregarAlCarrito} />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="contacto" element={<Contacto />} />

        {/* Compra */}
        <Route path="carrito" element={<Carrito carrito={carrito} onQuitar={quitarDelCarrito} onCambiarCantidad={cambiarCantidadCarrito} onVaciar={vaciarCarrito}/>} />
        <Route path="checkout" element={<Checkout carrito={carrito} onVaciar={vaciarCarrito} />} />
        <Route path="compra/exito" element={<ResultadoCompra exito />} />
        <Route path="compra/error" element={<ResultadoCompra />} />

        {/* Cuenta */}
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />

        {/* Administración */}
        <Route
          path="admin"
          element={
            <RutaProtegida>
              <Admin />
            </RutaProtegida>
          }
        />
        <Route
          path="admin/productos"
          element={
            <RutaProtegida>
              <AdminProductos />
            </RutaProtegida>
          }
        />
        <Route
          path="admin/productos/nuevo"
          element={
            <RutaProtegida>
              <AdminProductoForm />
            </RutaProtegida>
          }
        />
        <Route
          path="admin/productos/:codigo"
          element={
            <RutaProtegida>
              <AdminProductoForm />
            </RutaProtegida>
          }
        />

        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}

export default App;

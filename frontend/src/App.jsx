import { Routes, Route } from "react-router-dom";
import { Catalogo } from "./pages/Catalogo";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header/>
      <main className="flex-1 p-4">
        <Routes>
          {/* <Route path="/" element={<Inicio />} /> */}
          <Route path="/catalogo" element={<Catalogo />} />
          {/* <Route path="/producto/:codigo" element={<DetalleProducto />} /> */}
          {/* <Route path="*" element={<NoEncontrado />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;

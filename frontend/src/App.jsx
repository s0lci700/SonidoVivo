import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold">Sonido Vivo</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

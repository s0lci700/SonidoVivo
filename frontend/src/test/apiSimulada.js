// Backend falso para las pruebas: reemplaza fetch y responde como los microservicios
// (mismas rutas, mismos códigos HTTP), usando los datos del Parcial 2 en memoria.
// Así las pruebas de páginas no necesitan Spring Boot encendido.
import { vi } from "vitest";
import productosIniciales from "../data/productos.json";
import categorias from "../data/categorias.json";
import usuarios from "../data/usuarios.json";

const categoriaPorId = Object.fromEntries(categorias.map((c) => [c.id, c]));

// Producto en la forma del backend: categoria como objeto.
function aBackend(p) {
  const { categoriaId, ...resto } = p;
  return { ...resto, categoria: categoriaPorId[categoriaId] };
}

function respuesta(estado, cuerpo) {
  return Promise.resolve({
    ok: estado >= 200 && estado < 300,
    status: estado,
    json: () => (cuerpo === undefined ? Promise.reject(new Error("sin cuerpo")) : Promise.resolve(cuerpo)),
  });
}

export function simularApi() {
  let productos = productosIniciales.map(aBackend);

  const rolDe = (headers) => headers?.Authorization?.replace("Bearer token-", "");

  const falso = vi.fn((url, opciones = {}) => {
    const { pathname, searchParams } = new URL(url);
    const metodo = opciones.method ?? "GET";
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : undefined;
    const rol = rolDe(opciones.headers);
    const partes = pathname.split("/").filter(Boolean); // ["api","productos","GA001"]

    // ---- ms-usuarios ----
    if (pathname === "/auth/login") {
      const u = usuarios.find((x) => x.correo === cuerpo.correo && x.password === cuerpo.password);
      if (!u) return respuesta(401, { error: "Credenciales incorrectas" });
      return respuesta(200, {
        token: `token-${u.rol}`,
        tipo: "Bearer",
        correo: u.correo,
        nombre: u.nombre,
        rol: u.rol,
        expiraEn: Date.now() + 3600_000,
      });
    }
    if (pathname === "/auth/me") {
      const u = usuarios.find((x) => x.rol === rol);
      if (!u) return respuesta(401, { error: "No autenticado" });
      return respuesta(200, { correo: u.correo, nombre: u.nombre, rol: u.rol });
    }

    if (pathname === "/api/usuarios" && metodo === "POST") {
      if (!rol) return respuesta(401, { error: "No autenticado" });
      if (rol !== "ADMINISTRADOR") return respuesta(403, { error: "Sin permisos" });
      if (usuarios.some((u) => u.correo === cuerpo.correo)) {
        return respuesta(409, { error: "Ya existe una cuenta con ese correo" });
      }
      // Como el backend real, la respuesta no incluye la contraseña.
      return respuesta(201, { id: 99, nombre: cuerpo.nombre, correo: cuerpo.correo, rol: cuerpo.rol, activo: true });
    }

    // ---- ms-productos ----
    if (pathname === "/api/categorias") return respuesta(200, categorias);
    if (partes[1] === "productos") {
      const codigo = partes[2];
      const i = productos.findIndex((p) => p.codigo === codigo);
      if (metodo === "GET" && !codigo) {
        const cat = searchParams.get("categoria");
        return respuesta(200, cat ? productos.filter((p) => p.categoria.id === cat) : productos);
      }
      if (metodo === "GET") return i < 0 ? respuesta(404, { error: "No existe" }) : respuesta(200, productos[i]);
      if (!rol) return respuesta(401, { error: "No autenticado" });
      if (metodo === "PATCH" && partes[3] === "stock") {
        productos[i] = { ...productos[i], stock: cuerpo.cantidad };
        return respuesta(200, productos[i]);
      }
      if (rol !== "ADMINISTRADOR") return respuesta(403, { error: "Sin permisos" });
      const nuevo = { ...cuerpo, categoria: categoriaPorId[cuerpo?.categoria?.id] };
      if (metodo === "POST") {
        if (productos.some((p) => p.codigo === cuerpo.codigo)) {
          return respuesta(409, { error: `Ya existe un producto con el código ${cuerpo.codigo}` });
        }
        productos = [...productos, nuevo];
        return respuesta(201, nuevo);
      }
      if (i < 0) return respuesta(404, { error: "No existe" });
      if (metodo === "PUT") {
        productos[i] = nuevo;
        return respuesta(200, nuevo);
      }
      if (metodo === "DELETE") {
        productos = productos.filter((p) => p.codigo !== codigo);
        return respuesta(204);
      }
    }

    // ---- ms-pedidos (solo crear) ----
    if (pathname === "/api/pedidos" && metodo === "POST") {
      if (!rol) return respuesta(401, { error: "No autenticado" });
      const detalles = cuerpo.items.map((item) => {
        const p = productos.find((x) => x.codigo === item.codigo);
        return { codigoProducto: p.codigo, nombreProducto: p.nombre, cantidad: item.cantidad,
          precioUnitario: p.precio, subtotal: p.precio * item.cantidad };
      });
      const total = detalles.reduce((suma, d) => suma + d.subtotal, 0);
      return respuesta(201, { id: 1, estado: "EN_PREPARACION", ...cuerpo, detalles, total });
    }

    return respuesta(404, { error: `Ruta no simulada: ${metodo} ${pathname}` });
  });

  vi.stubGlobal("fetch", falso);
  return falso;
}

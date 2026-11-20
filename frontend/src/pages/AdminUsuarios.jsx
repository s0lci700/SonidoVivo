import { useEffect, useState } from "react";
import { Boton } from "../components/Boton";
import { obtenerSesion } from "../services/authService";
import {
  ROLES,
  actualizarUsuario,
  desactivarUsuario,
  obtenerUsuarios,
} from "../services/usuarioService";

// Gestión de usuarios (RF-58, solo ADMINISTRADOR): asignar rol y desactivar/reactivar.
// El alta está en AdminUsuarioForm (/admin/usuarios/nuevo).
export function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const yo = obtenerSesion()?.correo;

  useEffect(() => {
    obtenerUsuarios()
      .then(setUsuarios)
      .catch((e) => setError(e.message));
  }, []);

  async function guardar(usuario, cambios) {
    setError("");
    try {
      // password vacía: el backend conserva la actual.
      const datos = { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol,
        activo: usuario.activo, password: "", ...cambios };
      const actualizado =
        cambios.activo === false
          ? await desactivarUsuario(usuario.id)
          : await actualizarUsuario(usuario.id, datos);
      setUsuarios((lista) => lista.map((u) => (u.id === actualizado.id ? actualizado : u)));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl">Usuarios</h1>
        <Boton a="/admin/usuarios/nuevo">Nuevo usuario</Boton>
      </div>
      {error && (
        <p role="alert" className="text-cobre-600">
          {error}
        </p>
      )}
      <div className="relative overflow-x-auto rounded-2xl border border-marfil-300 bg-marfil-50">
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-marfil-200 text-left text-xs font-semibold text-tinta-600">
            <tr>
              <th scope="col" className="px-4 py-3">Nombre</th>
              <th scope="col" className="px-4 py-3">Correo</th>
              <th scope="col" className="px-4 py-3">Rol</th>
              <th scope="col" className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marfil-300">
            {usuarios.map((u) => (
              <tr key={u.id} className={u.activo ? "" : "text-tinta-600"}>
                <td className="px-4 py-2 font-medium">{u.nombre}</td>
                <td className="px-4 py-2">{u.correo}</td>
                <td className="px-4 py-2">
                  <select
                    aria-label={`Rol de ${u.nombre}`}
                    value={u.rol}
                    disabled={u.correo === yo}
                    onChange={(e) => guardar(u, { rol: e.target.value })}
                    className="min-h-11 rounded-lg border border-marfil-300 bg-white px-2"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  {u.correo === yo ? (
                    "Tu cuenta"
                  ) : (
                    <button
                      type="button"
                      onClick={() => guardar(u, { activo: !u.activo })}
                      className="min-h-11 cursor-pointer font-semibold underline underline-offset-4"
                    >
                      {u.activo ? "Desactivar" : "Reactivar"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

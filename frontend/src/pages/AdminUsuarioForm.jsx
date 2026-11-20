import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Boton } from "../components/Boton";
import { Campo } from "../components/Campo";
import { Selector } from "../components/Selector";
import { ROLES, crearUsuario } from "../services/usuarioService";
import { validarCorreo, validarPassword, validarTexto } from "../utils/validaciones";

const vacio = { nombre: "", correo: "", password: "", rol: "" };

// Alta de usuarios por el ADMINISTRADOR (RF-58), con cualquier rol.
// La edición de rol y el activar/desactivar se hacen en la tabla de AdminUsuarios.
export function AdminUsuarioForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const nuevos = {};
    if (!validarTexto(formData.nombre, 2)) nuevos.nombre = "Ingresa el nombre.";
    if (!validarCorreo(formData.correo)) nuevos.correo = "Ingresa un correo válido.";
    if (!validarPassword(formData.password))
      nuevos.password = "Mínimo 6 caracteres y una mayúscula.";
    if (!formData.rol) nuevos.rol = "Elige un rol.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    try {
      await crearUsuario({ ...formData, activo: true });
      navigate("/admin/usuarios");
    } catch (err) {
      // 409 correo repetido, 400 con errores por campo (los mismos nombres), 403, sin conexión.
      setErrores(err.campos ?? {});
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">Nuevo usuario</h1>
        <p className="mt-1 text-sm text-tinta-600">
          Podrá iniciar sesión apenas lo guardes. La contraseña se guarda cifrada (BCrypt).
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Campo etiqueta="Nombre" nombre="nombre" value={formData.nombre} onChange={handleChange} error={errores.nombre} />
        <Campo etiqueta="Correo" nombre="correo" tipo="email" value={formData.correo} onChange={handleChange} error={errores.correo} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo etiqueta="Contraseña" nombre="password" tipo="password" value={formData.password} onChange={handleChange} error={errores.password} />
          <Selector
            etiqueta="Rol"
            nombre="rol"
            value={formData.rol}
            onChange={handleChange}
            error={errores.rol}
            opciones={ROLES.map((r) => ({ valor: r, texto: r }))}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-marfil-300 pt-5">
          <Boton tipo="submit">Guardar</Boton>
          <Boton a="/admin/usuarios" variante="secundario">
            Cancelar
          </Boton>
          {error && (
            <p role="alert" className="text-sm text-cobre-600">
              {error}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

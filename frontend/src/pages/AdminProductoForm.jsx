import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  validarPrecio,
  validarStock,
  validarTexto,
} from "../utils/validaciones";
import {
  actualizarProducto,
  crearProducto,
  obtenerCategorias,
  obtenerProductoPorCodigo,
} from "../services/productoService";
import { Campo } from "../components/Campo";
import { Selector } from "../components/Selector";
import { Boton } from "../components/Boton";

const vacio = {
  codigo: "",
  nombre: "",
  marca: "",
  modelo: "",
  categoriaId: "",
  precio: "",
  stock: "",
  descripcion: "",
};

// Formulario de producto: la C y la U del CRUD. Sin código en la URL crea
// (/admin/productos/nuevo); con código edita (/admin/productos/:codigo).
export function AdminProductoForm() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [categorias, setCategorias] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    if (!validarTexto(formData.codigo, 3))
      nuevosErrores.codigo = "Ingresa un código de al menos 3 caracteres.";
    if (!validarTexto(formData.nombre, 2))
      nuevosErrores.nombre = "Ingresa el nombre.";
    if (!validarTexto(formData.marca, 2))
      nuevosErrores.marca = "Ingresa la marca.";
    if (!validarTexto(formData.modelo, 2))
      nuevosErrores.modelo = "Ingresa el modelo.";
    if (!formData.categoriaId)
      nuevosErrores.categoriaId = "Elige una categoría.";
    if (!validarPrecio(Number(formData.precio)))
      nuevosErrores.precio = "Ingresa un precio entero mayor a 0.";
    if (!validarStock(Number(formData.stock)) || formData.stock === "")
      nuevosErrores.stock = "El stock debe ser un entero de 0 o más.";
    if (!validarTexto(formData.descripcion, 10))
      nuevosErrores.descripcion =
        "Escribe una descripción de al menos 10 caracteres.";

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    const categoria = categorias.find((c) => c.id === formData.categoriaId);
    const producto = {
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      categoria: categoria.nombre,
    };

    try {
      if (codigo) await actualizarProducto(codigo, producto);
      else await crearProducto(producto);
      navigate("/admin/productos");
    } catch (error) {
      setErrores({ codigo: error.message });
    }
  };

  useEffect(() => {
    obtenerCategorias().then(setCategorias);
    if (codigo)
      obtenerProductoPorCodigo(codigo).then(
        (p) =>
          p &&
          setFormData({
            ...p,
            precio: String(p.precio),
            stock: String(p.stock),
          }),
      );
  }, [codigo]);

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">
          {codigo ? `Editar ${codigo}` : "Nuevo producto"}
        </h1>
        <p className="mt-1 text-sm text-tinta-600">
          {codigo
            ? "El código no se puede cambiar. Los cambios se ven de inmediato en el catálogo."
            : "El producto aparece en el catálogo apenas lo guardes."}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
          <Campo
            deshabilitado={Boolean(codigo)}
            etiqueta="Código"
            nombre="codigo"
            value={formData.codigo}
            onChange={handleChange}
            error={errores.codigo}
          />
          <Campo
            etiqueta="Nombre"
            nombre="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Campo
            etiqueta="Marca"
            nombre="marca"
            value={formData.marca}
            onChange={handleChange}
            error={errores.marca}
          />
          <Campo
            etiqueta="Modelo"
            nombre="modelo"
            value={formData.modelo}
            onChange={handleChange}
            error={errores.modelo}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_10rem_8rem]">
          <Selector
            etiqueta="Categoría"
            nombre="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            error={errores.categoriaId}
            opciones={categorias.map((c) => ({ valor: c.id, texto: c.nombre }))}
          />
          <Campo
            tipo="number"
            etiqueta="Precio (CLP)"
            nombre="precio"
            value={formData.precio}
            onChange={handleChange}
            error={errores.precio}
          />
          <Campo
            tipo="number"
            etiqueta="Stock"
            nombre="stock"
            value={formData.stock}
            onChange={handleChange}
            error={errores.stock}
          />
        </div>

        <Campo
          multilinea
          etiqueta="Descripción"
          nombre="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          error={errores.descripcion}
        />

        <div className="flex flex-wrap gap-3 border-t border-marfil-300 pt-5">
          <Boton tipo="submit">Guardar</Boton>
          <Boton a="/admin/productos" variante="secundario">
            Cancelar
          </Boton>
        </div>
      </form>
    </section>
  );
}

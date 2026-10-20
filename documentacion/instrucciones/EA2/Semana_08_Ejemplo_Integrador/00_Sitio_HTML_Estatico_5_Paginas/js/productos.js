// Versión 00: datos y renderizado con JavaScript tradicional.
const productos = [
  {
    id: 1,
    nombre: "Notebook Lenovo",
    precio: 599990,
    categoria: "Computadores",
    imagen: "images/productos/notebook-lenovo.svg",
  },
  {
    id: 2,
    nombre: "Mouse inalámbrico",
    precio: 19990,
    categoria: "Accesorios",
    imagen: "images/productos/mouse-inalambrico.svg",
  },
  {
    id: 3,
    nombre: "Teclado mecánico",
    precio: 49990,
    categoria: "Accesorios",
    imagen: "images/productos/teclado-mecanico.svg",
  },
  {
    id: 4,
    nombre: "Audífonos Bluetooth",
    precio: 34990,
    categoria: "Audio",
    imagen: "images/productos/audifonos-bluetooth.svg",
  },
];

const contenedor = document.querySelector("#lista-productos");
const buscador = document.querySelector("#buscador");

function renderProductos(lista) {
  contenedor.innerHTML = lista
    .map(
      (producto) => `
        <article class="producto-card">
          <img src="${producto.imagen}" alt="${producto.nombre}" />
          <div class="producto-body">
            <span class="categoria">${producto.categoria}</span>
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toLocaleString("es-CL")}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

buscador.addEventListener("input", (event) => {
  const texto = event.target.value.trim().toLowerCase();
  const filtrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(texto),
  );
  renderProductos(filtrados);
});

renderProductos(productos);

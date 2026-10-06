// Versión 00: protección simulada mediante localStorage.
const sesion = JSON.parse(localStorage.getItem("usuarioActual"));

if (!sesion) {
  window.location.href = "login.html";
} else {
  document.querySelector("#bienvenida-admin").textContent =
    `Bienvenido, ${sesion.usuario}. Rol: ${sesion.rol}`;
}

document.querySelector("#btn-cerrar-sesion").addEventListener("click", () => {
  localStorage.removeItem("usuarioActual");
  window.location.href = "login.html";
});

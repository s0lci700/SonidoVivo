// Versión 00: login simulado. NO representa seguridad real.
const form = document.querySelector("#form-login");
const resultado = document.querySelector("#resultado-login");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const usuario = form.usuario.value.trim();
  const password = form.password.value;

  if (!usuario || !password) {
    resultado.className = "mensaje error";
    resultado.textContent = "Debe completar usuario y contraseña.";
    return;
  }

  if (usuario !== "admin" || password !== "admin123") {
    resultado.className = "mensaje error";
    resultado.textContent = "Credenciales incorrectas.";
    return;
  }

  localStorage.setItem(
    "usuarioActual",
    JSON.stringify({ usuario, rol: "ADMIN" }),
  );

  window.location.href = "admin.html";
});

// Versión 00: validaciones del formulario con DOM tradicional.
const form = document.querySelector("#form-contacto");
const resultado = document.querySelector("#resultado-contacto");

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim();
  const mensaje = form.mensaje.value.trim();

  if (nombre.length < 3 || !correoValido(correo) || mensaje.length < 5) {
    resultado.className = "mensaje error";
    resultado.textContent = "Revise nombre, correo y mensaje antes de enviar.";
    return;
  }

  localStorage.setItem(
    "ultimoContacto",
    JSON.stringify({ nombre, correo, mensaje }),
  );

  resultado.className = "mensaje ok";
  resultado.textContent = `Gracias ${nombre}. El formulario fue validado correctamente.`;
  form.reset();
});

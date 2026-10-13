// Funciones puras de validación: las usan Contacto, Login, Registro, Checkout y
// AdminProductoForm, y se prueban en validaciones.test.js.
// Cada una devuelve true/false; el mensaje de error lo decide el formulario.

export function validarTexto(texto, minimo = 3) {
  return texto.trim().length >= minimo;
}

export function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

export function validarPassword(password) {
    return /^(?=.*\p{Lu}).{6,}$/u.test(password)
}

export function validarPrecio(precio) {
    return (Number.isInteger(precio) && precio > 0);
}

export function validarStock(stock) {
        return (Number.isInteger(stock) && stock >= 0);
}
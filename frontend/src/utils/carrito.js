export function limitarCantidad(cantidad, stock) {
    return Math.min(Math.max(cantidad, 1), stock)
}

export function agregarProducto(carrito, producto) {
    // Primero chequeamos si el producto existe en carrito.
    
    // Si existe, con map() aumentamos la cantidad 
    // en el carrito limitandola al stock del producto,
    // y devolvemos un carrito nuevo modificado.
    
    // Si no existe, devolvemos una copia del carrito con el producto agregado.
    return carrito.some(prod => prod.codigo === producto.codigo) 
    ? carrito.map((item) => item.codigo === producto.codigo 
        ? {...item, cantidad : limitarCantidad(item.cantidad + 1, item.stock)} 
        : item) 
    : [...carrito, {...producto, cantidad: 1}];
}

export function quitarProducto(carrito, codigo) {
    return carrito.filter((p) => p.codigo !== codigo)
}

export function cambiarCantidad(carrito, codigo, cantidad) {
    return carrito.map((item) => item.codigo === codigo 
        ? {...item, cantidad : limitarCantidad(cantidad, item.stock)} 
        : item)
}

export function calcularTotal(carrito) {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
}
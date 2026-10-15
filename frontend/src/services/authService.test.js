import { expect, test, vi } from "vitest";
import { iniciarSesion } from "./authService"
import usuarios from '../data/usuarios.json'

test("guarda el usuario en localStorage", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem")
    const usuarioTest = usuarios[0]
    iniciarSesion(usuarioTest.correo, usuarioTest.password)
    
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
        "usuarioActual",
        JSON.stringify({
         'correo': usuarioTest.correo,
         'nombre': usuarioTest.nombre,
         'rol': usuarioTest.rol
        })
    )
    spy.mockRestore();

})



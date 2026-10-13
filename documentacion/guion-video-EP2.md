# Guion del video de demostración — Sonido Vivo · EP2

Basado en `10_Guia_Video_Demostracion_EP2_DSY1104_2026-2.docx`. Duración
objetivo: **5 a 8 minutos**. Se graba la pantalla con narración por voz; no hace
falta aparecer en cámara.

> El guion supone que carrito, login, administración de productos y las 10
> pruebas ya están terminados. Si algo queda fuera de la entrega, se quita su
> línea: el video debe mostrar solo lo que funciona en la versión entregada.

## Antes de grabar

- [ ] VS Code abierto en la carpeta del proyecto, con `frontend/src` desplegado.
- [ ] Terminal 1 con `npm run dev` corriendo.
- [ ] Terminal 2 libre, ubicada en `frontend/`, para las pruebas.
- [ ] Navegador en `http://localhost:5173/`, con el carrito vacío y sin sesión
      iniciada (borrar `localStorage` desde DevTools → Application).
- [ ] Otra pestaña con https://github.com/s0lci700/SonidoVivo en la vista de commits.
- [ ] DevTools listo en modo dispositivo a 360 px.
- [ ] Archivos ya abiertos en pestañas de VS Code: `App.jsx`, `LayoutPrincipal.jsx`,
      `Item.jsx`, `Contacto.jsx`, `validaciones.js`, `Item.test.jsx`, `validaciones.test.js`.
- [ ] Notificaciones del sistema silenciadas.

## Guion

| # | Etapa | Tiempo | Dónde | Qué mostrar | Qué decir |
|---|---|---|---|---|---|
| 1 | Presentación | 0:00–0:30 | Navegador, página de inicio | La portada de la tienda | «Soy Sol León, sección 005D de Desarrollo Full Stack II. Este es Sonido Vivo, la Forma B: una tienda de instrumentos musicales de Viña del Mar. Es un proyecto individual y esta es la versión entregada para la Evaluación Parcial 2.» |
| 2 | Navegación | 0:30–1:20 | Navegador | Recorrer Inicio → Catálogo → un producto → Nosotros → Contacto. Escribir una URL inexistente para mostrar la página 404 | «El frontend es una SPA en React con Vite. La navegación la resuelve React Router: la página no se recarga, solo cambia lo que hay dentro del layout. El encabezado y el pie son los mismos en todas las vistas.» |
| 3 | Estructura | 1:20–2:20 | VS Code | Árbol de `src`. Abrir `App.jsx` (tabla de rutas), `LayoutPrincipal.jsx` (`<Outlet />`) e `Item.jsx` | «El código está separado por responsabilidad: `pages` tiene una vista por ruta, `components` las piezas reutilizables, `services` el acceso a datos y `utils` las funciones puras. `Item` es la tarjeta de producto: recibe todo por props y se reutiliza en el catálogo y en la portada. Los componentes no leen los datos directamente; pasan por `services`, que en el Parcial 3 se cambia por llamadas a la API.» |
| 4 | Catálogo y filtro | 2:20–3:00 | Navegador | Filtrar por dos categorías. Mostrar que la URL cambia a `?categoria=…` y recargar la página | «El filtro vive en la URL y no en un estado local: por eso sobrevive a recargar y se puede compartir el enlace. Cada tarjeta muestra la disponibilidad: en stock, últimas unidades o agotado.» |
| 5 | Carrito y compra | 3:00–4:10 | Navegador | Agregar dos productos, ver el contador del encabezado, abrir el carrito, cambiar una cantidad, quitar uno, ir al checkout y completar la compra | «El estado del carrito vive en `App`, que es el ancestro común del encabezado, el catálogo y el carrito, y baja por props. Al agregar un producto el contador se actualiza porque todos leen el mismo estado.» |
| 6 | Administración | 4:10–5:00 | Navegador | Entrar a `/admin` sin sesión (redirige al login). Iniciar sesión como administrador. Crear un producto, editar su stock y eliminarlo | «Las rutas de administración están envueltas en `RutaProtegida`: sin sesión redirigen al login. La sesión es simulada en `localStorage`; no es seguridad real y en el Parcial 3 se reemplaza por JWT. Desde aquí se crea, edita y elimina un producto sobre los datos simulados.» |
| 7 | Formulario y validaciones | 5:00–5:50 | Navegador y VS Code | En Contacto: enviar vacío, luego con un correo mal escrito, luego con datos válidos. Abrir `validaciones.js` | «Primero lo envío vacío: aparece el error junto a cada campo. Ahora un correo sin arroba. Y ahora con datos válidos. El formulario es controlado, cada campo vive en el estado del componente, y las reglas son funciones puras en `utils` que se reutilizan en todos los formularios.» |
| 8 | Responsivo | 5:50–6:30 | Navegador con DevTools | Pasar de 1280 px a 768 px y a 360 px. Abrir el menú hamburguesa. Mostrar la grilla del catálogo | «Uso Tailwind CSS. La grilla pasa de cuatro columnas a tres, dos y una con los prefijos `lg`, `md` y `sm`, y en 360 píxeles la navegación se colapsa en un menú hamburguesa.» |
| 9 | Pruebas | 6:30–7:40 | Terminal 2 y VS Code | `npm test`, mostrar las 10 pruebas en verde. Abrir `validaciones.test.js` y `Item.test.jsx`. Ejecutar `npm run test:coverage` | «Las pruebas usan Vitest con React Testing Library. Esta es de lógica: comprueba que `validarCorreo` rechaza un correo sin arroba. Esta otra es de interacción: renderiza la tarjeta, hace clic en Agregar y verifica con un mock, `vi.fn`, que se llamó a la función recibida por props. Y este es el reporte de cobertura.» |
| 10 | GitHub | 7:40–8:10 | Navegador, pestaña de GitHub | El repositorio público y el historial de commits | «El repositorio es público y este historial corresponde al desarrollo del proyecto.» |
| 11 | Cierre | 8:10–8:25 | Navegador, la aplicación | La página de inicio | «Esta demostración corresponde a la versión entregada para la Evaluación Parcial 2. Gracias.» |

## Si hay que acortar

El guion completo queda justo en el límite de 8 minutos. Para bajar a unos 6:

- Unir las etapas 4 y 5 en un solo recorrido de compra.
- En la etapa 6 mostrar solo crear y eliminar.
- En la etapa 9 no ejecutar la cobertura en vivo: mostrar el reporte ya generado.

## Después de grabar

- [ ] Ver el video completo una vez: que se escuche la voz y se lea el código.
- [ ] Confirmar que el commit mostrado en GitHub es el mismo que se entrega.
- [ ] Subirlo y probar el enlace en una ventana de incógnito.

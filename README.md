# Sonido Vivo

Proyecto semestral **DSY1104 · Desarrollo Full Stack II · 2026-2** — Forma B: *Tienda Sonido Vivo*.

Tienda de instrumentos y equipos musicales en Viña del Mar que necesita un catálogo en línea con stock actualizado, pedidos formales para clientes remotos y control de inventario y ventas.

## Estructura

```
SonidoVivo/
├── frontend/        App React + Vite (Parcial 2)
├── backend/         Microservicios Spring Boot (Parcial 3)
├── database/        Modelo y scripts MySQL (Parcial 3)
└── documentacion/   Instrucciones del curso, caso y catálogo
```

## Frontend

Requiere Node.js 20.19+ o 22.12+.

```
cd frontend
npm install
npm run dev
```

## Decisiones técnicas

- **Diseño responsivo: Tailwind CSS v4.** El curso acepta Bootstrap o Tailwind y pide elegir uno. Se eligió Tailwind porque sus prefijos de breakpoint (`md:`, `lg:`) permiten expresar el comportamiento responsivo directamente en cada componente, sin archivos CSS separados.
- **Navegación:** React Router (`react-router-dom`).
- **Datos:** en Parcial 2 los datos son simulados (`frontend/src/data/`) y se consumen a través de `frontend/src/services/`, para que en Parcial 3 solo cambie la capa de servicios al conectarse a la API REST.

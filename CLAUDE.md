# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SonidoVivo — semester project for DSY1104 (Desarrollo Full Stack II, 2026-2), context **Forma B: Tienda Sonido Vivo**, a musical-instrument store in Viña del Mar. Solo project. The same repo evolves across Parcial 2 (React front-end, simulated CRUD), Parcial 3 (Spring Boot microservices + MySQL) and the EFT — never restart it.

## Layout

- `frontend/` — Vite + React 19 SPA (JavaScript, not TypeScript). All npm commands run from here.
- `backend/`, `database/` — added in Parcial 3.
- `documentacion/instrucciones/` — course brief, case document (`.docx`) and product catalog (`.xlsx`). Reference material, not code.

## Commands (run in `frontend/`)

- `npm run dev` — Vite dev server
- `npm run build` — production build to `frontend/dist/`
- `npm run lint` — ESLint

No test runner yet — testing (Jasmine/Karma per the course) is covered in week 08.

## Frontend conventions

- Structure follows the course's target: `src/components/` (reusable pieces), `src/pages/` (route views), `src/data/` (P2 simulated data), `src/services/` (data access; P2 reads local data, P3 swaps to `fetch` against the REST API — components must not read `data/` directly).
- Routing: `react-router-dom`, `BrowserRouter` in `main.jsx`, `<Routes>` in `App.jsx`.
- Styling: Tailwind CSS v4 only (via `@tailwindcss/vite`; `src/index.css` is just `@import "tailwindcss"`). No Bootstrap, no per-component CSS files.
- Spanish naming for components, props, state and handlers (`ProductoCard`, `onAgregar`, `agregarAlCarrito`), matching the course tutorials. Shared state is lifted to the nearest common parent and passed via props.
- Prices are CLP integers, formatted with `toLocaleString("es-CL")`.
- Responsive targets from the brief: 360 px (hamburger menu), 768 px, 1280 px.

## Linting

ESLint flat config (`frontend/eslint.config.js`): `@eslint/js` recommended + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`, browser globals, `dist/` ignored.

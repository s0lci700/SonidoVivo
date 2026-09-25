# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SonidoVivo — a Vite + React 19 web app, built for the DSY1104 semester project ("Sonido Vivo", a music/audio store). The repo root *is* the Vite project root (there is no nested app folder).

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the project

There is no test suite configured yet.

## Architecture

- Entry point: `index.html` loads `/src/main.jsx`, which mounts `<App />` (from `src/App.jsx`) into `#root` inside `<StrictMode>`.
- `src/App.jsx` currently holds the app's markup/logic as a single component (the default Vite React template, not yet built out into the store UI). Styling is split between `src/App.css` (component styles, also linked directly in `index.html`) and `src/index.css` (global styles).
- Styling stack: Tailwind CSS v4 via the `@tailwindcss/vite` plugin (configured in `vite.config.js`), used alongside plain CSS files.
- Icons: `public/icons.svg` is an SVG sprite referenced at runtime via `<use href="/icons.svg#icon-id">`; `public/favicon.svg` is the site favicon.
- `src/assets/` holds imported image assets (e.g. `hero.png`) used directly in JSX via ES imports.
- `instrucciones/` contains the course's assignment brief and deliverables (PDFs, a `.docx`, an `.xlsx`) — reference material for the project requirements, not application code.

## Linting

ESLint (flat config in `eslint.config.js`) applies `@eslint/js` recommended rules plus `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` (Vite-flavored) to all `.js`/`.jsx` files, with browser globals. `dist/` is ignored.

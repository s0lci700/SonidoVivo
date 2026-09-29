# Brief: filtro por categoría (Catálogo)

Confirmed with Sol on 2026-09-29 via `/impeccable shape`. Sol implements this by hand; the brief is the plan, not code.

## Job and audience
Shoppers of every level on `/catalogo`, often on a 360 px phone, who know *what kind* of thing they want ("una batería", "un pedal") and need to cut 51 products down to that family fast. Visitor mode: Operate.

## Outcome and proof
- One tap narrows the grid to a category; one tap on **Todas** brings everything back.
- The result is stated in words: "5 productos en Guitarras Eléctricas".
- The filter survives a refresh and the back button, and a URL like `/catalogo?categoria=BT` opens pre-filtered (so Inicio can link straight to Baterías later).

## Selected direction
Inside the established world (DESIGN.md, "El Taller de Bronces"). A single row of category chips sits between the "Catálogo" title and the grid:
- **Order:** "Todas" first, then the 10 categories in `categorias.json` order.
- **Single-select:** tapping a chip replaces the current filter. Tapping the active chip does nothing; only "Todas" clears the filter.
- **Chip look:** the Category Chip in DESIGN.md. 44 px pills, Work Sans 500, marfil-50 with a marfil-300 border. The selected chip has a laca fill and marfil-50 text.

## Scope and boundaries
- In scope: chip row, URL state, filtered grid, result line, and the empty/invalid states below.
- Out of scope: multi-select, search, sort, price filters, side panels. Also out: the cart flow and the header/hamburger, which are separate backlog items.
- Untouched: the product card design, and the service/component separation (components never import `data/`).

## States and ranges
- 10 categories with 3–10 products each today; plan for 0 once the P3 backend can return an empty category.
- **No `?categoria`:** show everything, "Todas" selected, result line "51 productos".
- **Valid id:** filtered grid, that chip selected, and the result line names the category.
- **Unknown id** (`?categoria=XX`): don't show a blank grid. Show "No encontramos esa categoría" with a "Ver todo el catálogo" action that clears the param.
- **Category with 0 products:** "Aún no hay productos en Baterías", plus the same "Ver todo" action.
- **Loading** (matters in P3): keep the chip row visible while the grid shows a loading state.

## Interaction and layout
- **Mobile (< 768 px):** the chip row scrolls sideways. It runs to the screen edge so the last visible chip is cut off, which signals there are more; no visible scrollbar is needed. On load, scroll the selected chip into view (a `?categoria=ES` link would otherwise hide it off-screen).
- **Desktop:** the same row. It may wrap once everything fits, but keep one control shape.
- **Semantics:**
  - Each chip is a `<button type="button" aria-pressed>`.
  - Wrap the row in a group labelled "Filtrar por categoría".
  - The result line is `aria-live="polite"` so screen readers hear the new count.
- **Focus:** visible `focus-visible` ring (2 px laton-800, 2 px offset). Arrow keys aren't needed; Tab is fine for 11 chips.
- **Motion:** none beyond the chip's colour transition (≤150 ms). Respect reduced motion.

## Constraints and implementation notes
- **URL state:** `useSearchParams` from react-router-dom. Read `categoria`, and set it or delete it on chip tap. Plain navigation (push) is fine, so Back steps through previous filters.
- **Services:** add `obtenerCategorias()` (reads `categorias.json`). Either give `obtenerProductos(categoriaId)` an optional filter or add `obtenerProductosPorCategoria(id)`. Keep both async so the P3 `fetch` swap changes only the service.
- **Structure:** `Catalogo` reads the param and fetches; a new `FiltroCategorias` component receives `categorias`, `seleccionada` and `onSeleccionar` as props (Spanish naming convention). `ItemList` receives the already-filtered list.
- **Data:** products carry `categoriaId` matching `categorias.json` `id` (GA, GE, BA, BT, TC, AM, MI, PE, AC, ES).
- **Open for Sol to decide:** whether chips show per-category counts ("Baterías 5"). Optional; the result line already states the count.

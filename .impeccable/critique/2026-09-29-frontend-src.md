---
target: SonidoVivo frontend (catalogo)
slug: frontend-src
date: 2026-09-29
total_score: 18
p0_count: 0
p1_count: 2
method: dual-agent (design review + detector); browser visualization skipped (no servers)
---

# Critique — frontend/src (2026-09-29)

## Design Health Score: 18/40 (Poor, early build)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | System status | 2 | Stock status excellent (text + dot); no loading state, cart count or add feedback |
| 2 | Real-world match | 3 | Spanish/CLP/brand-model right; "iniciantes" (Portuguese) in productos.json |
| 3 | User control | 1 | No filters, detail view or 404; `/` renders empty main |
| 4 | Consistency | 2 | Cards lift on hover but aren't clickable; active nav = hover colour; header px-6 vs main p-4 |
| 5 | Error prevention | 2 | "Agregar" disables at stock 0 but never renders (no onAgregar passed) |
| 6 | Recognition | 2 | Categories exist in categorias.json but aren't shown |
| 7 | Efficiency | 1 | 51 products, no search/sort/category filter |
| 8 | Minimalist | 3 | Calm, no promo noise; monotonous grid |
| 9 | Error recovery | 1 | `obtenerProductos().then()` has no catch; missing image → broken img |
| 10 | Help | 1 | No address, hours or phone anywhere; no footer |

## Anti-patterns

- LLM: mild, not generic. No absolute bans. Tells: identical 51-card grid; tracked uppercase brand·model label on every card; hover lift on non-interactive cards; three stacked near-identical creams (card border marfil-300 on marfil-50 = 1.44:1); mockup ring motif absent.
- Detector (detect.mjs): 0 findings, exit 0, over App/main/Header/Item/ItemList/Catalogo/index.html (.jsx in scope).

## What's working

1. Contrast: all text pairs pass AA (tinta/marfil 7.13, laton-800 5.95, cobre 5.36, patina 5.75, button label 7.38).
2. Honest, accessible stock: text + dot + colour, sold-out state.
3. Sound plumbing: service layer, codigo-keyed images, tabular-nums, es-CL prices, aspect-square wells.

## Priority issues (backlog)

- **[P1] No add-to-cart path.** Item renders "Agregar" only with `onAgregar`; ItemList never passes it; header cart button empty. Fix: cart state in App, pass onAgregar down, labelled cart button with count, inline "Agregado" feedback. → `/impeccable harden`
- **[P1] Header overflows at 360 px** (~620 px min width, no breakpoint); cart button has no accessible name (WCAG 4.1.2), ~36 px target. Fix: logo + cart + hamburger below md (aria-expanded), py-3 nav hit areas, underline active indicator. → `/impeccable adapt`
- **[P2] 51-card wall, no category structure** (~600 px/card at 360 → ~30k px scroll). Fix: category chip row from categorias.json + count; compact cards on mobile; description to detail view. → `/impeccable distill`, `/impeccable shape`
- **[P2] ItemList has no loading/empty/error states** (matters for P3 fetch). Fix: cargando/error state, skeleton grid, empty + retry. → `/impeccable harden`
- **[P3] Clickable-looking cards; motion ignores reduced motion.** Drop lift until /producto/:codigo exists, then Link + focus ring; motion-reduce variants. → `/impeccable polish`

## Persona red flags

- Casey (mobile): header scrolls sideways; thumb fatigue, no filter; no address/hours.
- Riley (edge cases): `/`, `/nosotros`, `/contacto` blank, no 404; missing .webp → broken img; silent fetch failure; "Últimas 1 unidades" once stock can reach 1.
- Jordan (first-timer): no categories/search; brand·model jargon above name; header CTA is a blank brass circle.
- Sam (a11y): unlabelled cart button; no custom focus-visible; active nav colour-only; img alt duplicates h2.

## Minor

- No max-w on main; cards stretch ≥1440 px.
- Catalogo h1 lacks bottom margin; add product count.
- Card name (serif 22px) competes with price (22px); serif on product names conflicts with product register.
- DM Serif italic loaded but unused.
- 51 eager images: add loading="lazy", decoding="async", width/height.
- Disabled "Agregar" redundant with "Agotado".
- Header: box-border and h-20+py-4 redundant; empty button's px-4.5 py-4.5 = accidental circle.

## Questions

- First catalogue screen: "what do you play?" (10 categories) instead of 51 SKUs?
- Serif on every product name, or only page/category titles?
- Why is the physical shop invisible if users "look online, then walk in"?

## Agreed plan (Sol, 2026-09-29): priority = shopping flow, scope = top 3

1. `/impeccable harden` — cart state in App, onAgregar through Catalogo → ItemList → Item, labelled cart button + count badge, "Agregado" feedback; ItemList loading/empty/error states.
2. `/impeccable adapt` — mobile header: logo + cart + hamburger below md, 44 px targets, underline active state.
3. `/impeccable distill` — category chips from categorias.json + count; compact mobile cards.
4. `/impeccable polish` — final pass (reduced motion, card lift, max-w main, lazy images).

None started yet; each touches .jsx files and needs Sol's go-ahead.

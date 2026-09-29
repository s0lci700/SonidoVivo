# Product

## Register

product

## Users

Local musicians of every level in Viña del Mar and Valparaíso, all shopping in the same store: beginners and parents buying a first instrument (a 3/4 guitar, a starter keyboard), hobbyists upgrading gear, and working musicians who know brands and models and want to confirm specs, price and stock quickly. They browse on phones as often as on desktop, frequently before visiting the physical shop.

Job to be done: find the right instrument or accessory, understand what it is and whether it's in stock, compare prices in CLP, and add it to a cart.

## Product Purpose

Sonido Vivo is the online storefront of a musical-instrument shop in Viña del Mar (catalog of ~50 products across 10 categories: guitars, basses, drums, keys, amps, mics, pedals, accessories, studio gear). It lets shoppers browse by category, see product detail, and manage a cart.

It is also a semester project for DSY1104 (Desarrollo Full Stack II): a React SPA with simulated data in Parcial 2, backed by Spring Boot microservices + MySQL in Parcial 3. Success means a shopper can go from landing to "added to cart" without friction on a 360 px phone, and the codebase meets the course's structure and responsive targets (360 / 768 / 1280 px).

## Brand Personality

**Warm, artisanal, expert.** A neighborhood shop with craft and history whose staff know their gear and give honest advice. The voice is friendly Chilean Spanish, plain and specific (brand, model, what it's good for), never salesy.

The visual identity borrows from brass instruments as a *material*, not a product theme: lacquered black, ivory, aged brass, copper and verdigris patina. Warmth comes from the materials and typography; trust comes from clear prices, honest stock information and calm layouts.

## Anti-references

- **Big-box marketplaces** (Falabella, Mercado Libre): banner overload, red discount badges, dense promo clutter, urgency tricks.
- **Generic Shopify themes**: white template, stock hero, identical card grids with no identity.
- **Kitschy gold / luxury**: shiny gold gradients everywhere, casino or "premium" clichés. Brass is an accent, not a coating.
- **Dark "gamer" tech**: neon on black, RGB music-gear-store energy.

## Design Principles

1. **The gear is the hero.** Product photos, names and prices lead; the brass identity frames them and never competes.
2. **Honest shop talk.** Show real stock, real CLP prices and plain descriptions. No fake urgency, no invented scarcity.
3. **Every level welcome.** A first-time parent and a session player should both find what they need: clear categories for one, brand/model/specs up front for the other.
4. **Phone first, shop second.** Many visits happen on a phone before walking into the store; the 360 px experience is the primary one, not an afterthought.
5. **Earned familiarity.** Standard e-commerce patterns (nav, cards, cart) done carefully beat novel ones; personality lives in materials and type, not in reinvented controls.

## Accessibility & Inclusion

Target **WCAG 2.2 AA**: text contrast ≥ 4.5:1 (≥ 3:1 for large text), full keyboard operation with visible focus, labelled icon-only buttons, touch targets ≥ 44 px, and `prefers-reduced-motion` alternatives for every animation. Stock and status must never be conveyed by color alone. Gold (`laton-500`) is not a text color on light backgrounds.

---
name: Sonido Vivo
description: Tienda de instrumentos en Viña del Mar, vestida de laca, marfil y bronce.
colors:
  laca: "#1a1714"
  tinta: "#5c5247"
  marfil-50: "#fbf7ee"
  marfil-100: "#f5efe0"
  marfil-200: "#ede4d0"
  marfil-300: "#d9cfbc"
  laton-500: "#c9a227"
  laton-700: "#8c6a1f"
  laton-800: "#7a5a16"
  cobre: "#9a5424"
  patina: "#356b5e"
typography:
  display:
    fontFamily: "DM Serif Display, ui-serif, Georgia, serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.1
  logo:
    fontFamily: "DM Serif Display, ui-serif, Georgia, serif"
    fontSize: "28px"
    fontWeight: 400
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.25
  price:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    fontFeature: "tnum"
  body:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.625
  nav:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
  label:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  card: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.laton-500}"
    textColor: "{colors.laca}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  card-product:
    backgroundColor: "{colors.marfil-50}"
    textColor: "{colors.laca}"
    rounded: "{rounded.card}"
    padding: "{spacing.md}"
  card-product-media:
    backgroundColor: "{colors.marfil-200}"
  header:
    backgroundColor: "{colors.laca}"
    textColor: "{colors.marfil-100}"
    height: "80px"
    padding: "0 24px"
  nav-link:
    textColor: "{colors.marfil-100}"
    typography: "{typography.nav}"
  nav-link-active:
    textColor: "{colors.laton-500}"
  stock-in:
    textColor: "{colors.patina}"
  stock-low:
    textColor: "{colors.cobre}"
  stock-out:
    textColor: "{colors.tinta}"
---

# Design System: Sonido Vivo

## Overview

**Creative North Star: "El Taller de Bronces"**

The brass workshop behind a neighbourhood music shop: lacquered black benches, ivory cloth, brass fittings worn smooth by use. The system borrows brass as a *material*, not a theme. Instruments of every kind (guitars, drums, keys, pedals) sit on calm ivory surfaces, framed by a black lacquer bar, with brass appearing only where a hand would touch it: the logo, the active link, the button you press.

Density is moderate and honest: a product shows its brand and model, name, a short plain description, real stock and a CLP price, nothing promotional. Warmth comes from the materials and the serif; trust comes from clear numbers and stillness. The rejected worlds are explicit: no big-box marketplace clutter, no generic white Shopify template, no shiny gold-luxury coating, no neon "gamer" gear store.

**Key Characteristics:**
- Two-tone frame: laca (black) chrome, marfil (ivory) content.
- Brass as a fitting, never a coating: accents and controls only.
- Flat, tonally layered surfaces; the only relief is on brass controls.
- Serif for titles and the logo, Work Sans for everything a shopper reads to decide.
- Status spoken in words first, colour second.

## Colors

A warm, low-chroma workshop palette: one lacquer dark, four steps of ivory, a brass family, and two patina-and-copper status colours.

### Primary
- **Latón Pulido** (laton-500): the brass. Primary buttons, the logo, the active nav link. On laca it reads 7.38:1; as a button fill its laca label reads 7.38:1.
- **Latón Viejo** (laton-700): aged brass for engraved rules and decorative strokes on light surfaces.
- **Latón Oscuro** (laton-800): the brass that can be *text* on ivory (5.95:1 on marfil-50). Brand · model labels.

### Secondary
- **Pátina** (patina): verdigris green. "En stock" state (5.75:1 on marfil-50).
- **Cobre** (cobre): darkened copper. "Últimas unidades" state (5.36:1 on marfil-50).

### Neutral
- **Laca** (laca): lacquer black. Header and footer chrome, all primary text on ivory (15.5:1 against marfil-100).
- **Tinta** (tinta): warm ink grey. Descriptions and secondary text (7.13:1 on marfil-50), and the "Agotado" state.
- **Marfil 50** (marfil-50): the lightest ivory, card surfaces.
- **Marfil 100** (marfil-100): the page ground; also the text colour on laca.
- **Marfil 200** (marfil-200): recessed wells behind product photos.
- **Marfil 300** (marfil-300): hairline borders and dividers.

### Named Rules
**The Fitting Rule.** Brass (laton-500) marks what you can touch or where you are: buttons, the active link, the logo. It is never a background wash, a gradient, or body text on ivory.

**The Dark-Brass Rule.** Brass text on a light surface is always laton-800, never laton-500 (which fails contrast on ivory).

## Typography

**Display Font:** DM Serif Display (with ui-serif, Georgia)
**Body Font:** Work Sans (with ui-sans-serif, system-ui)

**Character:** a high-contrast engraved serif set against a warm, sturdy grotesque, like a hand-lettered shop sign above clearly printed price tags.

### Hierarchy
- **Display** (400, 36px, 1.1): page titles such as "Catálogo", section and category headings.
- **Logo** (400, 28px, -0.025em): the "Sonido Vivo" wordmark in the header, in brass.
- **Title** (600, 20px, 1.25): product names on cards. Provisional size; see Components.
- **Price** (600, 22px, tabular figures): CLP prices, formatted `$129.990`.
- **Body** (400, 14px, 1.625): product descriptions; cap long prose at 65–75ch.
- **Nav** (500, 15px): header links.
- **Label** (600, 12px, 0.12em, uppercase): brand · model line on cards; button labels use the same weight at 14px without tracking.

### Named Rules
**The Sign-and-Tag Rule.** The serif is the shop sign: page titles, category headings and the logo. Anything a shopper scans to decide (product names, prices, stock, buttons, nav) is Work Sans.

## Layout

Single column page: laca header bar (80px), then content on marfil-100. The catalogue is a responsive grid: 1 column, 2 from 640px, 3 from 768px, 4 from 1024px, with 24px gaps. Cards use 20px internal padding and an 8px vertical rhythm between lines (12px around the price row). Header spacing is generous (32px between links, 48px between regions).

Breakpoint targets from the course brief are 360px (hamburger navigation), 768px and 1280px; 360px is the primary experience.

## Elevation & Depth

Flat by default with tonal layering: depth is expressed by stepping through the ivory ramp (page marfil-100, card marfil-50, photo well marfil-200) and by marfil-300 hairlines. The single exception is brass controls, which carry a machined bevel as a metal fitting would.

### Shadow Vocabulary
- **Brass bevel** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(26,23,20,0.25)`): on brass buttons only, at rest.

### Named Rules
**The Flat Bench Rule.** Surfaces sit flat on the bench. Nothing floats; cards do not cast shadows. Relief belongs only to brass you can press.

## Shapes

Softly rounded containers (16px on cards) with hairline borders and clipped media; fully rounded pills for buttons and badges; small circles (8px) for status dots. The ring and circle recur as the brass-bell motif (concentric rings in the brand mockup).

## Components

### Buttons
Tactile and confident: a brass fitting you press.
- **Shape:** full pill (9999px).
- **Primary:** laton-500 fill, laca label, Work Sans 600 14px, 44px tall, 18px horizontal padding, brass bevel.
- **Hover:** brightens slightly (brightness 1.1) and rises 1px. Provide a `prefers-reduced-motion` variant with no movement.
- **Focus:** needs a visible `focus-visible` ring (not yet implemented); use a 2px laca or laton-800 outline with 2px offset on light surfaces.
- **Disabled:** 50% opacity, not-allowed cursor. When disabled because of stock, the stock line already says "Agotado".

### Cards / Containers
The product card is the core unit.
- **Corner Style:** 16px.
- **Background:** marfil-50, with a marfil-200 square photo well (image contained, 16px inset) separated by a marfil-300 hairline.
- **Shadow Strategy:** none (The Flat Bench Rule).
- **Border:** 1px marfil-300.
- **Internal Padding:** 20px; content order is brand · model label, name, description, stock line, then a hairline and the price + button row.

### Chips
Not yet implemented. Category filters, when built, should follow the button language: pills, Work Sans 500, marfil-50 with a marfil-300 border when unselected, laca fill with marfil-50 text when selected.

### Navigation
- **Style:** laca bar, 80px tall, 24px side padding; brass serif logo on the left, Work Sans 500 15px links.
- **States:** default marfil-100; hover and active laton-500. Active should also get a non-colour cue (an underline) so it isn't conveyed by colour alone.
- **Mobile:** below 768px, collapse to logo + cart + hamburger (not yet implemented).

### Stock Indicator (signature)
An 8px dot plus words, never colour alone: patina "En stock · N disponibles", cobre "Últimas N unidades" (N ≤ 3), tinta "Agotado".

**Migration note:** the current code still has serif product names and a hover lift + shadow on cards. The Sign-and-Tag and Flat Bench rules above are the agreed target (2026-09-29).

## Do's and Don'ts

### Do:
- **Do** keep chrome in laca and content on the ivory ramp (marfil-50/100/200/300).
- **Do** use laton-500 only for touchable or current-location elements, and laton-800 when brass must be text on ivory.
- **Do** state stock in words next to its coloured dot.
- **Do** format prices as CLP with `toLocaleString("es-CL")` and tabular figures.
- **Do** keep every interactive target at least 44px tall.

### Don't:
- **Don't** use brass gradients, gold washes or shiny metallic backgrounds (the gold-luxury anti-reference).
- **Don't** put laton-500 text on any ivory surface.
- **Don't** cast shadows on cards or containers; only brass controls get the bevel.
- **Don't** set product names, prices or buttons in DM Serif Display.
- **Don't** add discount badges, countdowns or promo banners.

# AGENTS.md

Static wedding-invitation site: plain HTML/CSS/JS, no framework, no backend, no build step, no git repo.

## Run / verify

- Serve locally: `python3 -m http.server 8000`, then open `http://localhost:8000`.
- There is no lint, test, or typecheck step. Verify by opening the page and checking the console.
- Files are referenced with relative paths (`./IMG_7226.JPG`), so the page must be served from the repo root or opened as a file in-place; moving assets breaks them.

## Structure

- `index.html` — all content and markup. No templating; edit HTML directly.
- `styles.css` — all styling, including `@media (prefers-reduced-motion: reduce)` rules that override animation classes.
- `script.js` — one IIFE; animations, countdown, petals, reveal logic. No exports/imports.

## Gotchas

- The wedding/countdown date lives in HTML, not JS: `data-date="2026-11-29T00:00:00+05:30"` on `.countdown` in `index.html`. Edit it there.
- Reveal animations: any element intended to fade in on scroll must have the `reveal` class (with optional `reveal-delay-N`). Without JS adding `is-visible`, content stays hidden — except under `prefers-reduced-motion`, which forces it visible.
- `index.html` contains a commented-out `<header class="nav">`; the nav-toggle/nav-menu handlers in `script.js` are therefore dead code. Don't rely on the nav working until that block is restored.
- `index.html:102` uses `./IMG_7226.JPG` as the couple photo. The README still says `assets/couple.jpg`; the JPG is what actually renders.
- The venue link is a Google Maps search query for "Happy Weddings, Nagpur" — intended to be swapped for a real destination.
- Event times are intentionally omitted (only dates were supplied) — keep it that way unless asked otherwise.

## Styling notes

- Fonts are loaded from Google Fonts (Cormorant Garamond, DM Sans, Noto Serif Devanagari); adding new font families requires updating the `<link>` in `index.html`.
- Sections opt into dark theme via `data-theme="dark"`; JS toggles `body.theme-dark` based on IntersectionObserver.

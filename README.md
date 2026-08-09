# Sonam & Shantanu — Final Wedding Invitation

A polished, mobile-first static wedding invitation built with plain HTML, CSS and JavaScript.

## Included

- Minimal Indian floral visual style
- Responsive mobile and desktop layout
- Intro loading animation
- Scroll-reveal animations
- Floating petals
- Gentle floral/parallax movement
- Scroll progress indicator
- Mobile navigation
- Animated countdown to 29 November 2026
- Haldi, Sangeet and Wedding sections
- Venue section with Google Maps link
- RSVP section
- Accessibility support for reduced-motion users
- No framework and no backend

## Files

- `index.html`
- `styles.css`
- `script.js`
- `assets/`

## Add your couple photo

In `index.html`, find the `.photo-placeholder` inside `.photo-inner`.

Replace it with:

```html
<img src="assets/couple.jpg" alt="Sonam and Shantanu">
```

Then put your image at:

```text
assets/couple.jpg
```

Recommended image:
- Portrait orientation
- Around 1000–1600px wide
- JPG or WebP
- Keep the file reasonably compressed for fast mobile loading

## RSVP

The RSVP button currently uses an empty `mailto:` placeholder.

Replace it with your preferred RSVP destination, for example:
- a Google Form
- WhatsApp link
- email address
- another RSVP service

## Venue

The "View Location" button currently searches Google Maps for:

Happy Weddings, Nagpur

If you have the exact Google Maps place link, replace the URL in `index.html`.

## Run locally

Open `index.html` directly, or use:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

1. Create a GitHub repository.
2. Upload all files and the `assets` folder.
3. Go to Settings → Pages.
4. Choose "Deploy from a branch".
5. Select your main branch and the root folder.
6. Save.

Because this is a static website, GitHub Pages can host it for free.

## Important

The site intentionally does not show event times because the wedding details supplied so far only include dates. Add the times later if you want them displayed.

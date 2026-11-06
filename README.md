# ZERO LIMITS — Mobile Portfolio

Mobile-first static portfolio inspired by the uploaded Reel: near-black canvas, purple ambient light, red signal accents, editorial typography, terminal interaction, and installable PWA shell.

## Run locally

No dependency install is required:

```bash
cd zero-limits-portfolio
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173` on the phone or desktop. The service worker requires HTTP, so do not open the HTML directly as a `file://` URL when testing PWA behavior.

## Deploy to Netlify

### Drag and drop

1. Open Netlify and choose **Add new site → Deploy manually**.
2. Upload this entire folder (or the ZIP archive).
3. Netlify detects `netlify.toml` and serves the project root.

### Git deployment

Push this folder to GitHub and import the repository in Netlify. Build settings:

- Build command: *(empty)*
- Publish directory: `.`

The contact form uses Netlify Forms (`data-netlify="true"`) and will appear in the site's Netlify dashboard after the first deploy.

## Edit your content

- `index.html`: name, biography, project cards, and contact copy.
- `css/styles.css`: colors, spacing, typography, and mobile breakpoints.
- `js/app.js`: terminal commands, particle density, and menu behavior.
- `manifest.webmanifest`: installable app name and theme.

## Design notes

The Reel was a desktop portfolio filmed on a laptop. This version keeps its visual language but restructures the content for a narrow portrait viewport: one-column hero, touch-sized controls, collapsible navigation, reduced-motion support, and lightweight canvas particles.

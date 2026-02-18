# Snake Color Studio

An RGB color exploration tool themed around the classic Snake game. A continuously animated snake slithers across the screen, its body segments each representing a color from the active palette.

## Features

- **Snake Color Explorer** — Click on snake segments to pick colors. Adjust base hue and arc spread with sliders.
- **Palette Generator** — Analogous, complementary, triadic, split-complementary, tetradic, and monochromatic modes. Lock colors, randomize, and export.
- **Contrast Checker** — WCAG 2.1 contrast ratio with AA/AAA pass/fail badges and auto-suggestions for accessible alternatives.
- **Color Blindness Simulator** — Protanopia, deuteranopia, tritanopia, and achromatopsia simulation with side-by-side comparison.
- **Accessible Palette Mode** — Auto-adjusts palettes to meet contrast and distinguishability requirements across all vision types.

## Deployment

This project deploys to GitHub Pages automatically on every push to `main`.

### Manual setup

1. Push this repo to GitHub.
2. Go to **Settings > Pages** and set the source to **GitHub Actions**.
3. The included workflow at `.github/workflows/deploy.yml` handles the rest.

### Local preview

Open `index.html` in any modern browser. No build step or server required.

## Tech Stack

Pure HTML + CSS + JavaScript. Zero dependencies.

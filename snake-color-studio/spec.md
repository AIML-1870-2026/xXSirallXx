# Snake Color Studio - Specification

## Overview

Snake Color Studio is a single-page web application that presents an RGB color exploration tool themed around the classic Snake game. A continuously animated snake slithers across a canvas, its body segments each representing a color from the active palette. Users can explore the full RGB color space, generate harmonious palettes, check WCAG contrast compliance, simulate color blindness, and produce accessibility-optimized palettes.

---

## 1. Snake-Shaped Animated Color Explorer

### Visual Design
- A `<canvas>` element renders a snake composed of circular body segments.
- The snake autonomously moves in smooth, sinusoidal curves across the viewport.
- Each segment is filled with a color sampled from the current RGB position on a virtual color wheel.
- The head segment pulses gently to indicate the "active" color.
- A glowing trail fades behind the tail.

### Interaction
- **Click on any segment** to select that segment's color as the active color.
- **Drag the hue slider** (or scroll on the canvas) to rotate the snake's color range around the hue wheel.
- **Mouse hover** over a segment shows a tooltip with HEX, RGB, and HSL values.
- The active color is displayed in a large swatch with editable HEX/RGB/HSL inputs.

### Technical Details
- Animation runs at 60 fps via `requestAnimationFrame`.
- Snake path is computed with a parametric sine function: `x(t) = t`, `y(t) = A * sin(freq * t + phase)`.
- Segment colors are evenly spaced across a configurable hue arc (default 60 degrees).
- Canvas auto-resizes on window resize.

---

## 2. Palette Generator

### Modes
| Mode           | Description |
|----------------|-------------|
| Analogous      | 5 colors within +/-30 degrees of the base hue |
| Complementary  | Base + 180-degree opposite + 3 intermediates |
| Triadic        | 3 colors 120 degrees apart + 2 tints |
| Split-Comp     | Base + two colors 150 degrees from base |
| Tetradic       | 4 colors 90 degrees apart |
| Monochromatic  | 5 lightness steps at the same hue |

### Features
- One-click copy of individual color codes (HEX, RGB, HSL, CSS variable).
- "Randomize" button picks a new random base hue.
- Export palette as JSON, CSS custom properties, SCSS variables, or a PNG swatch image.
- Lock individual colors while regenerating the rest.

---

## 3. Contrast Checker (Stretch Goal)

### WCAG 2.1 Compliance
- Computes relative luminance per WCAG 2.1 formula.
- Displays contrast ratio between any two selected colors.
- Shows pass/fail badges for:
  - **AA Normal** (>= 4.5:1)
  - **AA Large** (>= 3:1)
  - **AAA Normal** (>= 7:1)
  - **AAA Large** (>= 4.5:1)
- Live text preview panel: renders sample text with foreground/background set to the two colors.
- Suggests the nearest accessible color pair if the current pair fails.

---

## 4. Color Blindness Simulator (Stretch Goal)

### Supported Simulations
| Type             | Affected Cones | Prevalence |
|------------------|----------------|------------|
| Protanopia       | Red (L)        | ~1.3 % males |
| Deuteranopia     | Green (M)      | ~1.2 % males |
| Tritanopia       | Blue (S)        | ~0.001 % |
| Achromatopsia    | All            | ~0.003 % |

### Implementation
- Uses Brettel, Vienot & Mollon (1997) simulation matrices applied via JavaScript color math.
- Each palette color is displayed side-by-side: **original | simulated**.
- A toggle switch enables a full-page simulation overlay so users can preview the entire UI as seen by each vision type.
- The snake itself re-colors under simulation mode for a live preview.

---

## 5. Accessible Palette Mode (Stretch Goal)

### Behavior
- When enabled, the palette generator enforces:
  1. Every adjacent pair in the palette has >= 3:1 contrast.
  2. Every color against white (#FFFFFF) and black (#000000) has >= 4.5:1 contrast.
  3. No two colors in the palette are indistinguishable under any of the four simulated vision types (minimum deltaE of 20 in simulated space).
- Colors that fail are auto-adjusted (lightness shift) until they pass, with a visual diff showing the adjustment.
- A green checkmark badge appears on the palette bar when all constraints are satisfied.

---

## 6. Tech Stack

| Layer       | Technology |
|-------------|------------|
| Markup      | HTML5 |
| Styling     | CSS3 (custom properties, grid, animations) |
| Logic       | Vanilla JavaScript (ES2022, modules) |
| Canvas      | HTML5 Canvas 2D API |
| Deployment  | GitHub Pages via static files |

No build step required. The entire application is a single `index.html` file with embedded CSS and JS for maximum portability.

---

## 7. File Structure

```
snake-color-studio/
  index.html        -- Full application (HTML + CSS + JS)
  spec.md           -- This specification
  README.md         -- Deployment & usage guide
  .github/
    workflows/
      deploy.yml    -- GitHub Actions workflow for Pages deployment
```

---

## 8. Deployment

The project deploys to GitHub Pages via a GitHub Actions workflow that publishes the root directory on every push to `main`.

---

## 9. Browser Support

- Chrome / Edge 100+
- Firefox 100+
- Safari 15+
- Mobile: responsive layout with touch support for color selection.

---

## 10. Accessibility

- All interactive elements are keyboard-navigable.
- ARIA labels on canvas regions.
- Color values are always presented as text (not color-only indicators).
- Reduced-motion media query pauses the snake animation.

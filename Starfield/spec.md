# Swift Starfield — Project Specification

## Overview

An animated starfield simulation rendered on an HTML5 canvas. Stars stream toward the viewer in a warp-speed perspective effect, creating an immersive deep-space fly-through experience directly in the browser.

---

## Architecture

**Single-file static webpage** — HTML, CSS, and JS in one `index.html`. No dependencies, no server, no API calls. Pure canvas animation.

---

## Core Features

### 1. Canvas Starfield Simulation
- Hundreds of stars rendered each frame as small circles or streaks
- Perspective projection: stars appear to accelerate outward from center as they approach the viewer
- Smooth `requestAnimationFrame` render loop targeting 60fps
- Stars reset to center when they leave the viewport

### 2. Visual Style
- Deep space background: radial gradient from `#1a1a3a` to `#050510`
- Stars white/blue-white, varying brightness
- Speed and density configurable via JS constants

### 3. Title Overlay
- "Swift Starfield" title displayed centered on canvas
- Fades or persists based on implementation

---

## UI / UX Design

- **Background**: `#0a0a1a` near-black
- **Stars**: White to pale blue, depth-based sizing
- Full-viewport canvas, no scroll
- Minimal UI — the animation is the experience

---

## File Structure

```
Starfield/
├── index.html    ← Complete single-file application
└── spec.md       ← This document
```

---

## Testing Checklist

- [ ] Stars animate smoothly at 60fps
- [ ] Stars emanate from center and expand outward
- [ ] Stars reset when they reach the edge
- [ ] Canvas fills the full viewport
- [ ] No visible jank or dropped frames on resize

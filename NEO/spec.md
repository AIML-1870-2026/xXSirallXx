# NeoWatch 3D — Project Specification

## Overview

A real-time Near-Earth Object (NEO) tracker that visualizes asteroid and comet data from NASA's public API. Features a interactive 3D globe view and a sortable data table, allowing users to explore objects currently passing close to Earth.

---

## Architecture

**Single-file static webapp** — all HTML, CSS, and JS in one `index.html`. No build tools, no server. Data sourced from NASA's NeoWs API and rendered via a 3D globe library injected at runtime.

---

## Core Features

### 1. NASA NEO Data Feed
- Fetches live Near-Earth Object data from NASA's NeoWs (Near Earth Object Web Service) API
- API Key: hardcoded public demo key (`D36Q3kKCmVGaDcTt1sCY1WHCC94EJ51jHacDH7P9`)
- Displays: object name, velocity (km/s), miss distance, diameter estimate, hazard status

### 2. 3D Globe View
- Interactive 3D Earth rendered on a `<canvas>` element
- NEO fly-by paths visualized on the globe surface
- Graceful fallback message if WebGL/3D fails to load
- Smooth splash screen on initial load

### 3. Map / Table View
- Switchable between **3D Globe** and **flat map/table** modes via toolbar buttons
- Sortable table columns: name, velocity, miss distance, diameter, hazard
- Tooltip on hover showing object detail

---

## UI / UX Design

### Aesthetic: Cyberpunk Dark

- **Background**: Near-black (`#05050f`) deep space
- **Accent**: Electric cyan (`#00b4ff`)
- **Danger**: Red (`#ff3355`) for hazardous objects
- **Warning**: Orange (`#ff9922`)
- **Safe**: Green (`#22ff88`)
- **Fonts**: Orbitron (display), Share Tech Mono (data), Exo 2 (body)

### Layout

```
┌─────────────────────────────────────────┐
│  Splash screen (fades out on load)      │
├─────────────────────────────────────────┤
│  Header: NEOWATCH 3D | [Globe] [Map]   │
├─────────────────────────────────────────┤
│                                         │
│   3D Globe  /  Flat Map Canvas          │
│                                         │
├─────────────────────────────────────────┤
│  Sortable Data Table                    │
│  (Name | Velocity | Distance | Hazard)  │
└─────────────────────────────────────────┘
```

---

## File Structure

```
NEO/
├── index.html    ← Complete single-file application
└── spec.md       ← This document
```

---

## Testing Checklist

- [ ] Page loads with splash screen, then fades into main view
- [ ] NASA API call succeeds and populates the table
- [ ] 3D globe renders and shows NEO paths
- [ ] Globe error fallback message shown if WebGL unavailable
- [ ] Toggle between Globe and Map views works
- [ ] Table columns sort correctly on click
- [ ] Hazardous objects highlighted in red
- [ ] Tooltip appears on row hover with object details

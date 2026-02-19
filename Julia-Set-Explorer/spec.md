# Julia Set Explorer

## ✨ Artificial Intelligence ✨
*Rainbow-colored title banner displayed at the top of the application*

---

## Overview
An interactive web application for exploring Julia sets with real-time rendering, parameter animation, and a connected Mandelbrot set view. Built with WebGL for high-performance fractal rendering.

---

## Features

### 1. Split-View Display
- **Layout**: Side-by-side 50/50 split
  - Left panel: Mandelbrot set
  - Right panel: Julia set
- **Interaction**:
  - Click anywhere on the Mandelbrot set to generate the corresponding Julia set
  - Hover preview: Julia set updates in real-time as mouse moves over Mandelbrot
  - Crosshair marker shows current c position on the Mandelbrot set
- **Independent navigation**: Each panel supports its own zoom and pan

### 2. Navigation Controls
- **Zoom**: Mouse wheel + pinch-to-zoom on touch devices
- **Pan**: Click-and-drag to move around
- **Reset button**: Return to default view for each panel
- **Zoom level indicator**: Display current zoom depth

### 3. Parameter Morphing Animation
- **Custom paths**: Click multiple points on the Mandelbrot set to define a journey
- **Preset paths**:
  - Circle (orbits around a center point)
  - Figure-8 (infinity symbol path)
  - Spiral (inward or outward)
  - Heart shape
- **Playback controls**:
  - Play / Pause button
  - Speed slider (0.1x to 5x)
  - Loop toggle (one-shot or continuous)
  - Progress bar with scrubbing
- **Path visualization**: Show the animation path overlaid on the Mandelbrot set

### 4. Custom Color Gradient Editor
- **Gradient stops**: 2-8 adjustable control points
- **Color picker**: Full RGB/HSL color selection for each stop
- **Position control**: Drag stops along the gradient bar
- **Preset gradients**:
  - Classic (black → blue → white → orange → black)
  - Fire (black → red → orange → yellow → white)
  - Ocean (dark blue → cyan → white)
  - Neon (black → magenta → cyan → yellow)
  - Grayscale (black → white)
  - Rainbow (full spectrum)
  - Psychedelic (vibrant cycling colors)
- **Save/Load**:
  - Save custom gradients to local storage
  - Name your gradients
  - Export/import as JSON
- **Live preview**: Gradient changes apply in real-time

### 5. Rendering Controls
- **Max iterations**: Slider (50 - 2000) — controls detail level
- **Escape radius**: Default 2.0, adjustable (1.5 - 10.0)
- **Smooth coloring**: Toggle for anti-aliased gradients vs banded colors
- **Resolution scale**: 0.5x, 1x, 2x for performance vs quality tradeoff

### 6. Visual Extras
- **Color cycling animation**: Animate colors shifting through the gradient
- **Coordinate display**: Show current mouse position as complex number
- **Julia set info**: Display current c value (real, imaginary)

---

## User Interface

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│        ✨ A r t i f i c i a l   I n t e l l i g e n c e ✨      │
│                    (rainbow gradient text)                       │
├─────────────────────────────────┬───────────────────────────────┤
│                                 │                               │
│                                 │                               │
│         MANDELBROT SET          │          JULIA SET            │
│                                 │                               │
│              ┼ (crosshair)      │                               │
│                                 │                               │
├─────────────────────────────────┴───────────────────────────────┤
│  [Control Panel - Collapsible Bottom Drawer]                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Animation│ │  Colors  │ │ Rendering│ │  Presets │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Theme
- **Dark mode**: Dark background (#0a0a0a) for optimal fractal viewing
- **Accent colors**: Subtle neon accents for controls
- **Glassmorphism**: Semi-transparent control panels with blur

### Control Panel Tabs
1. **Animation Tab**
   - Path type selector (custom / presets)
   - Playback controls
   - Speed slider
   - Loop toggle

2. **Colors Tab**
   - Gradient editor canvas
   - Preset gradient buttons
   - Save/load controls
   - Color cycling toggle + speed

3. **Rendering Tab**
   - Max iterations slider
   - Escape radius slider
   - Smooth coloring toggle
   - Resolution scale dropdown

4. **Presets Tab**
   - Saved Julia set presets with thumbnails:
     - Dendrite (c = -0.8, 0.156)
     - San Marco (c = -0.75, 0)
     - Siegel Disk (c = -0.391, -0.587)
     - Douady Rabbit (c = -0.123, 0.745)
     - Lightning (c = -0.4, 0.6)
   - Save current view button
   - Load/delete saved presets

---

## Technical Specifications

### Rendering
- **Engine**: WebGL 2.0 with fragment shader for fractal computation
- **Fallback**: Canvas 2D for devices without WebGL support
- **Resolution**: Dynamic based on viewport, with supersampling option

### Performance
- **Web Workers**: Offload computation for smoother UI
- **Throttling**: Limit updates during rapid mouse movement
- **Progressive rendering**: Show low-res preview, then refine

### Mobile Support
- **Touch gestures**:
  - Single finger: pan
  - Pinch: zoom
  - Two-finger tap: reset view
- **Responsive layout**: Stack panels vertically on narrow screens
- **Performance mode**: Automatic lower resolution on mobile

### Data Persistence
- **Local storage**: Save gradients, presets, and last session state
- **URL parameters**: Encode current view for sharing

---

## File Structure
```
Julia-Set-Explorer/
├── index.html          # Single HTML file with embedded CSS/JS
├── spec.md             # This specification
└── assets/             # (optional) Any additional assets
```

---

## Implementation Priority

### Phase 1: Core
1. WebGL rendering of Julia and Mandelbrot sets
2. Split view with click-to-set-c functionality
3. Basic navigation (zoom, pan, reset)
4. Dark theme UI shell

### Phase 2: Interactivity
5. Hover preview on Mandelbrot
6. Crosshair marker
7. Preset Julia sets
8. Max iterations control

### Phase 3: Colors
9. Preset color gradients
10. Custom gradient editor
11. Smooth coloring toggle
12. Color cycling animation

### Phase 4: Animation
13. Parameter morphing along preset paths
14. Custom path drawing
15. Playback controls
16. Path visualization

### Phase 5: Polish
17. Mobile responsive layout
18. Touch gesture support
19. URL sharing
20. Performance optimizations

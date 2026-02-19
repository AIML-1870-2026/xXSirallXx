# Bee Movie Script - Accessible Reader

## Vision

A bee-themed, accessibility-focused script reader that lets users customize every aspect of text display while providing real-time feedback on contrast, luminosity, and WCAG compliance. The entire Bee Movie script is presented in a formatted, readable layout with honeycomb aesthetics.

---

## Core Concept

The reader serves two purposes: an enjoyable way to read the Bee Movie script and an educational tool for understanding color accessibility. Users adjust background and text colors and immediately see how their choices affect readability across different vision types.

---

## Features

### 1. Text Display Area
- Full Bee Movie script formatted with character names, dialogue, scene headings, and action lines
- Smooth serif typography for comfortable reading
- Honeycomb watermark pattern in the background
- Scrollable content area with centered column layout

### 2. Background Color Control
- Native color picker for visual selection
- HEX input field for precise entry
- Real-time preview updates

### 3. Text Color Control
- Native color picker for visual selection
- HEX input field for precise entry
- Real-time preview updates

### 4. Text Size Control
- Range slider from 12px to 32px
- Live numerical display of current size
- Instant font-size application

### 5. Contrast Ratio Display
- WCAG 2.1 relative luminance formula
- Real-time ratio calculation (e.g., "12.45 : 1")
- Qualitative label: Excellent / Good / Acceptable / Poor
- Color-coded value (green = good, red = poor)

### 6. Luminosity Display
- Separate readouts for background and text luminosity
- Values computed per WCAG relative luminance formula
- Range: 0.0000 (pure black) to 1.0000 (pure white)

### 7. WCAG Compliance Indicator
| Level | Requirement | Badge |
|-------|-------------|-------|
| AA Normal | >= 4.5:1 | PASS / FAIL |
| AA Large | >= 3:1 | PASS / FAIL |
| AAA Normal | >= 7:1 | PASS / FAIL |
| AAA Large | >= 4.5:1 | PASS / FAIL |

### 8. Vision Type Simulation
| Type | Description |
|------|-------------|
| Normal | No simulation |
| Protanopia | Red-blind (L-cone absent) |
| Deuteranopia | Green-blind (M-cone absent) |
| Tritanopia | Blue-blind (S-cone absent) |
| Achromatopsia | Total color blindness |

- Applies Brettel/Vienot simulation matrices to both background and text colors
- Reader area updates in real-time to show simulated appearance
- Contrast ratio and WCAG badges recalculate under simulation

### 9. Preset Color Schemes
| Preset | Background | Text | Theme |
|--------|-----------|------|-------|
| Honeycomb | #fef9e7 | #2c2c2c | Classic honey yellow |
| Royal Jelly | #1a0a2e | #e8d5f5 | Purple royalty |
| Beeswax | #f5e6c8 | #3d2b00 | Warm wax |
| Night Hive | #0a0a0a | #f5c518 | Dark with gold text |
| Pollen | #fffde7 | #33691e | Spring green |
| Stinger | #1a1a1a | #ff6f00 | Bold orange |
| Flower Field | #fce4ec | #4a148c | Pink garden |
| Bee Suit | #ffffff | #000000 | Maximum contrast |
| Amber | #3e2723 | #ffcc80 | Warm amber |
| Honey Dark | #1b1200 | #ffd54f | Deep honey |

---

## User Interface

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  [bee emoji]  BEE MOVIE SCRIPT READER                           │
│  "According to all known laws of aviation..."                   │
├──────────────────┬──────────────────────────────────────────────┤
│  SIDEBAR         │                                              │
│  ─────────       │     ┌──────────────────────────────┐         │
│  Color Controls  │     │                              │         │
│  [bg] [fg]       │     │     BEE MOVIE SCRIPT         │         │
│                  │     │     (formatted text)          │         │
│  Text Size       │     │                              │         │
│  [──●────]       │     │  BARRY: Yellow, black...     │         │
│                  │     │                              │         │
│  Presets         │     │  VANESSA: You can talk?!     │         │
│  [grid of btns]  │     │                              │         │
│                  │     └──────────────────────────────┘         │
│  Contrast Ratio  │                                              │
│  [12.45 : 1]     │                                              │
│                  │                                              │
│  Luminosity      │                                              │
│  BG: 0.9412      │                                              │
│  FG: 0.0289      │                                              │
│                  │                                              │
│  WCAG Badges     │                                              │
│  [AA ✓] [AAA ✓]  │                                              │
│                  │                                              │
│  Vision Sim      │                                              │
│  [Normal] [Prot] │                                              │
│  [Deut] [Trit]   │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

### Theme
- Dark sidebar panel with gold (#f5c518) accent colors
- Animated rainbow-gold shimmer on the header title
- Floating bee emoji with gentle bobbing animation
- Honeycomb SVG watermark on the reading area
- Glassmorphism-inspired control panels

---

## Technical Specifications

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styling | CSS3 (Grid, custom properties, animations) |
| Logic | Vanilla JavaScript (ES2022) |
| Rendering | DOM-based (no canvas) |
| Deployment | GitHub Pages |

Single `index.html` file with embedded CSS and JS. Zero dependencies.

---

## File Structure
```
Bee-Movie-Reader/
├── index.html    # Full application
└── spec.md       # This specification
```

---

## Live URL

https://aiml-1870-2026.github.io/xXSirallXx/Bee-Movie-Reader/

---

## References
- WCAG 2.1 Contrast Guidelines: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
- Brettel, Vienot & Mollon (1997) — Color blindness simulation matrices
- Bee Movie (2007) — DreamWorks Animation

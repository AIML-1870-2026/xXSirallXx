# WeatherDrop — Project Specification

## Overview

A real-time weather dashboard that displays current conditions and a 7-day forecast for any location. Uses the browser's Geolocation API for automatic location detection and the Open-Meteo API for weather data — no API key required.

---

## Architecture

**Single-file static webapp** — all HTML, CSS, and JS in one `index.html`. No build tools, no server. All data fetched from free public APIs at runtime.

### Data Flow

```
Browser Geolocation API → lat/lon
        ↓
Nominatim (OpenStreetMap) → reverse geocode → city name
        ↓
Open-Meteo API → temperature, wind, precipitation, weekly forecast
        ↓
UI renders current conditions + 7-day chart
```

User can also search by city name:
```
City name input → Nominatim forward geocode → lat/lon → Open-Meteo → render
```

---

## Core Features

### 1. Automatic Location Detection
- Requests browser geolocation on load
- Reverse geocodes coordinates to a human-readable city name via Nominatim

### 2. City Search
- Text input to search any city worldwide
- Forward geocodes via Nominatim, then fetches weather

### 3. Weather Data Display
- **Current conditions**: temperature, weather icon, wind speed, precipitation
- **7-day forecast**: daily high/low, weather code icons
- **Temperature trend chart**: canvas or CSS-based sparkline for the week

### 4. Dynamic Theming
- Background and accent colors shift based on weather condition:
  - Sunny → warm orange/red gradient
  - Cloudy → slate blue-grey
  - Rainy → deep blue
  - Snowy → icy light blue/white
  - Stormy → near-black purple

---

## APIs Used

| API | Purpose | Key Required |
|-----|---------|--------------|
| Browser Geolocation | Device location | No |
| Nominatim (OSM) | Forward + reverse geocoding | No |
| Open-Meteo | Weather forecast data | No |

---

## UI / UX Design

### Aesthetic

- **Font**: Space Grotesk
- **Base theme**: Deep purple gradient (`#0f0c29` → `#302b63` → `#24243e`)
- **Accent**: Lavender (`#a78bfa`) and sky blue (`#38bdf8`)
- **Glass-morphism** cards with backdrop blur
- Smooth fade-in animations on data load

### Layout

```
┌────────────────────────────────────┐
│  Search bar + location row         │
├────────────────────────────────────┤
│  Current conditions card           │
│  (icon, temp, wind, precip)        │
├────────────────────────────────────┤
│  7-day forecast strip              │
├────────────────────────────────────┤
│  Temperature trend chart           │
└────────────────────────────────────┘
```

---

## File Structure

```
Weather-Dashboard/
├── index.html    ← Complete single-file application
└── spec.md       ← This document
```

---

## Testing Checklist

- [ ] Geolocation prompt appears on load
- [ ] Current weather loads automatically from device location
- [ ] City search returns correct weather for typed location
- [ ] 7-day forecast displays correctly
- [ ] Temperature trend chart renders
- [ ] Background theme changes based on weather condition
- [ ] Error shown if geolocation denied and no city entered
- [ ] Works on mobile screens

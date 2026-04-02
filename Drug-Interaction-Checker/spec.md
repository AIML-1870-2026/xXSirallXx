# RxClash — Drug Interaction Checker Specification

## Overview
An interactive drug-drug interaction checker that lets users search for multiple medications and instantly visualize the danger level, mechanism, and clinical consequences of combining them. Built on free public APIs — no backend required. Goes beyond a simple lookup table by rendering a live interaction network graph when 3+ drugs are queried simultaneously.

---

## App Name & Branding
- **Title**: RxClash
- **Tagline**: *"Know before you combine."*
- **Aesthetic**: Dark clinical — deep navy/charcoal background, red/amber/green severity accents, monospace secondary font for medical data, clean sans-serif for body copy
- **Font stack**: `'Inter'` for UI, `'Courier New'` for drug names and codes

---

## Data Sources (all free, no auth required)

| Source | Usage | Endpoint |
|--------|-------|----------|
| OpenFDA Drug Label API | Interaction descriptions, warnings | `https://api.fda.gov/drug/label.json` |
| RxNorm API (NIH) | Drug name autocomplete + normalization | `https://rxnav.nlm.nih.gov/REST/` |
| OpenFDA FAERS API | Adverse event co-occurrence data | `https://api.fda.gov/drug/event.json` |

> **Disclaimer displayed in app**: "Data sourced from FDA public databases. FAERS reports are voluntarily submitted — co-occurrence is not causation. This tool is for educational purposes only. Always consult a pharmacist or physician."

---

## Features

### 1. Drug Search Bar
- Up to **5 drug slots** (add/remove dynamically)
- Each slot has a text input with **RxNorm-powered autocomplete** (debounced, 300ms)
- Autocomplete shows drug generic name + brand name (e.g. `ibuprofen (Advil)`)
- Pressing Enter or clicking a suggestion locks in the drug (shown as a colored pill/chip)
- Chips are removable with an ×

### 2. Interaction Results Panel
After submitting ≥2 drugs, show a results card for each drug **pair**:

#### Severity Badge
| Level | Color | Label |
|-------|-------|-------|
| None found | Gray | `NO DATA` |
| Minor | Green | `MINOR` |
| Moderate | Amber | `MODERATE` |
| Major | Orange | `MAJOR` |
| Contraindicated | Red pulsing | `CONTRAINDICATED` |

#### Each Card Shows
- Drug A × Drug B heading
- Severity badge
- **Mechanism** (1–2 sentences from FDA label `drug_interactions` field)
- **Clinical effect** (what symptoms/outcomes may occur)
- **Source** link to full FDA label

### 3. Interaction Network Graph (3+ drugs)
When 3 or more drugs are entered, render a **force-directed graph** using plain Canvas 2D:
- Each drug = a node (circle, labeled)
- Each known interaction = an edge colored by severity
- Nodes repel each other, edges act as springs (basic force simulation, no library needed)
- Hover a node → highlight all its edges
- Hover an edge → show a tooltip with severity + one-line summary
- No interactions = dashed gray edge

### 4. Polypharmacy Risk Score
A single computed score shown at the top of results:

```
Risk Score = Σ(severity weights) / total pairs
Weights: CONTRAINDICATED=4, MAJOR=3, MODERATE=2, MINOR=1, NO DATA=0
```

Display as a dial/arc gauge (CSS-drawn, no library):
- 0.0–0.9 → Green: "Low Risk"
- 1.0–1.9 → Amber: "Caution"
- 2.0–2.9 → Orange: "High Risk"
- 3.0–4.0 → Red pulsing: "Danger — consult a doctor"

### 5. Quick Examples (Pre-loaded Scenarios)
Clickable scenario buttons that auto-fill the drug slots:

| Label | Drugs |
|-------|-------|
| "Common Cold Kit" | ibuprofen + acetaminophen + pseudoephedrine |
| "Cardiac Cocktail" | warfarin + aspirin + atorvastatin |
| "Classic Concern" | sildenafil + nitroglycerin |
| "Grapefruit Effect" | simvastatin + clarithromycin + amiodarone |

### 6. FAERS Signal Panel (Expandable)
Collapsible section below results:
- For each drug pair, query FAERS for co-reported adverse events
- Show top 5 adverse event terms with report counts
- Bar chart (CSS-only, no library) showing relative frequency
- Label: "Adverse events co-reported in FDA voluntary reports (not causal)"

### 7. Export / Share
- **Copy Link** button: encodes current drug list in URL hash (`#drugs=warfarin,aspirin`) so queries are shareable
- On page load, if URL hash contains drugs, auto-populate and run query
- **Print View** button: simplified black-on-white layout of all results

---

## UI Layout

```
┌─────────────────────────────────────────────────┐
│  RxClash          [?] About   [⚠] Disclaimer    │
├─────────────────────────────────────────────────┤
│  [ Drug 1 ▾ ] [ Drug 2 ▾ ] [ + Add ] [ Check ] │
│  Quick: [Common Cold Kit] [Cardiac Cocktail] …  │
├─────────────────────────────────────────────────┤
│  RISK SCORE: ◐ 2.4  HIGH RISK                   │
├──────────────────┬──────────────────────────────┤
│                  │  Interaction Cards            │
│  Network Graph   │  ┌──────────────────────┐    │
│  (canvas)        │  │ Warfarin × Aspirin   │    │
│                  │  │ [MAJOR]              │    │
│                  │  │ Mechanism: ...       │    │
│                  │  └──────────────────────┘    │
│                  │  ┌──────────────────────┐    │
│                  │  │ Warfarin × Atorva... │    │
│                  │  │ [MODERATE]           │    │
│                  │  └──────────────────────┘    │
├──────────────────┴──────────────────────────────┤
│  ▶ FAERS Adverse Event Signals (expand)         │
└─────────────────────────────────────────────────┘
```

---

## Technical Details

### Technologies
- Pure HTML/CSS/JavaScript (zero dependencies, zero build tools)
- Canvas 2D for network graph and gauge
- Fetch API for OpenFDA + RxNorm calls
- URL hash for state persistence

### API Call Strategy
1. On drug chip lock-in → call RxNorm to resolve to RxCUI (canonical ID)
2. On "Check" → for each pair, call OpenFDA label API filtered by drug name, parse `drug_interactions` field
3. FAERS query runs lazily (only when section is expanded)
4. All calls debounced/throttled; loading spinners per card

### Error Handling
- If OpenFDA returns no label data → show `NO DATA` badge, suggest checking spelling
- If RxNorm can't match → show warning icon on chip, still allow submission
- Network failure → inline error message with retry button

### Performance
- Autocomplete results cached in a Map for the session
- Graph redraws throttled to 60fps via `requestAnimationFrame`
- Force simulation runs for max 300 iterations then freezes (no wasted CPU)

---

## Accessibility
- All severity badges include `aria-label` with full text
- Keyboard navigable: Tab through drug slots, Enter to confirm, Escape to clear
- Color is never the sole indicator — severity labels always accompany color
- Disclaimer is always visible (not hidden behind a click)

---

## Author
Saral Sapkota

## Version
1.0 — RxClash

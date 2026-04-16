# Blackjack AI Agent — Project Specification

## Overview

A static webpage (HTML, CSS, JavaScript) implementing a fully playable Blackjack game powered by an AI agent. The agent uses the OpenAI GPT API to analyze the current game state and recommend optimal actions. The user enters their API key directly in the header — the key is held in memory only and never persisted.

---

## Architecture

**Single-file static webapp** — all HTML, CSS, and JS in one `index.html` file. No build tools, no server, no dependencies beyond the browser and the OpenAI API.

### Data Flow

```
User types API key → verified in-memory, never stored
                ↓
Game deals cards → Game state captured (player hand, dealer up card, balance, etc.)
                ↓
"Get AI Advice" clicked (once) → fetch() POST to OpenAI Chat Completions API
                ↓
GPT returns structured JSON → { action, confidence, reasoning }
                ↓
UI displays recommendation + AI analysis below it
                ↓
User hits/stands OR clicks "Execute" → game engine acts → AI auto-advises next state
                ↓
Next hand dealt → AI advice fires automatically (no re-click needed)
```

---

## Core Requirements

### 1. Blackjack Game Engine

- Standard 52-card deck (reshuffled when fewer than 15 cards remain)
- Correct Blackjack rules: Ace = 1 or 11, face cards = 10
- Dealer stands on soft 17
- Natural Blackjack pays 3:2
- Player starts with $1,000 balance, $10 default bet
- Exact bet entry via a text input field (in addition to ±5 nudge buttons)
- Game states: `betting` → `playing` → `dealer-turn` → `round-over`

### 2. AI Agent Integration

- **API**: OpenAI Chat Completions (`https://api.openai.com/v1/chat/completions`)
- **Model**: `gpt-4o-mini`
- **Prompt Strategy**: Instructs the model to return **JSON only**:
  - `action` — `"hit"` or `"stand"`
  - `confidence` — 0–100
  - `reasoning` — plain-text explanation
- **Auto-Advice**: Once "Get AI Advice" is clicked, advice fires automatically after every hit and at the start of every subsequent hand — no re-clicking required
- **Parsing**: `JSON.parse()` on the response; errors surfaced in the UI
- **Error Handling**: Network errors, invalid JSON, missing key — all shown as toasts

### 3. API Key Input

- Password-type text field in the header (`sk-...` placeholder)
- Debounced 600ms after typing stops — verifies with a lightweight API call
- Key held in a JS variable; never written to localStorage, cookies, or the DOM
- Status badge shows: No Key → Verifying… → Connected / Auth Failed

### 4. Console Logging

- Every significant event prefixed with `[BLACKJACK]`
- Logs: game state sent to AI, raw API response, parsed recommendation, card draws, balance changes

---

## Enhancements

### Enhancement 1 — Performance Analytics

Dedicated **Analytics tab** in the AI panel:

- **Session Stats**: hands played, wins, losses, pushes, blackjacks
- **Cumulative Win Rate Chart**: canvas line chart, color-coded green/red vs. 50% threshold
- **Bankroll History Chart**: canvas line chart showing balance over time
- **Decision Quality**: tracks AI-followed vs. not-followed hands and win rates for each

### Enhancement 2 — Explainability Controls

**Detail Level Toggle** in the AI panel: Basic / Detailed / Full

| Level    | Shows |
|----------|-------|
| Basic    | Recommended action + AI analysis text |
| Detailed | + one-sentence strategy reasoning |
| Full     | + confidence score + bust probability + dealer bust probability |

### Enhancement 3 — Strategy Visualization

**Basic Strategy Matrix** displayed in the AI panel below the recommendation:

- 10×10 grid — player score rows vs. dealer up-card columns
- Switches between **Hard** and **Soft** tables automatically based on hand
- Current cell highlighted with a gold outline
- Color-coded: Hit (red) / Stand (green) / Double (gold)
- Legend and Hard/Soft badge shown below the matrix

---

## UI / UX Design

### Aesthetic: Casino Noir

Dark, atmospheric, sophisticated — a private high-roller room.

| Token | Value |
|-------|-------|
| Background | `#0f0f0f` deep charcoal |
| Felt | `#1a4a2e` green with radial glow |
| Gold accent | `#d4a843` |
| Card background | `#f8f4e8` warm white |
| Display font | Playfair Display (serif) |
| UI font | JetBrains Mono (monospace) |

### Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: Logo | API Key input | Status badge         │
├───────────────────────────┬─────────────────────────┤
│                           │  [Advisor] [Analytics]  │
│   Felt table              │  ─────────────────────  │
│   Dealer hand             │  Recommended Action     │
│   Player hand             │  AI Analysis text       │
│                           │  Confidence / Probs     │
│                           │  ─────────────────────  │
│                           │  Strategy Matrix        │
├───────────────────────────┴─────────────────────────┤
│  Action bar: Bet − [amount] + | Hit Stand Deal      │
│  Footer: Balance | Hands | Win% | Sparkline         │
└─────────────────────────────────────────────────────┘
```

### Responsiveness

- Desktop: side-by-side table + AI panel
- Mobile: stacked layout, cards scale down

---

## File Structure

```
Blackjack-AI/
├── index.html    ← Complete single-file application
└── spec.md       ← This document
```

---

## Testing Checklist

- [ ] Type a valid API key → status shows "Connected" after debounce
- [ ] Type an invalid key → "Auth Failed" shown
- [ ] Deal a hand → two cards each, dealer has one face-down
- [ ] Click "Get AI Advice" once → recommendation + AI analysis appear
- [ ] Hit → AI auto-advises updated hand without clicking again
- [ ] Deal next hand → AI advice fires automatically
- [ ] "Execute" button follows the AI recommendation correctly
- [ ] Strategy matrix highlights the correct cell for current hand
- [ ] Matrix switches between Hard and Soft tables correctly
- [ ] Blackjack pays 3:2
- [ ] Bust detected, round ends immediately
- [ ] Dealer plays correctly (hits below 17, stands on 17+)
- [ ] Exact bet amount can be typed into the bet field
- [ ] Bet field disabled during a hand, re-enabled after
- [ ] Balance updates correctly after each round
- [ ] Analytics tab shows win rate and bankroll charts after 2+ hands
- [ ] Detail level toggle changes displayed information
- [ ] Console logs prefixed `[BLACKJACK]` for every key event
- [ ] Works on mobile screens

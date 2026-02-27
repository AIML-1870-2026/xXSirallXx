# Ghoulish Gambling
## BlackJack with a spooky twist

---

## Vision

A fully functional Blackjack game set in a haunted casino where the supernatural rules. The dealer is a skeleton, the cards are cursed, and the laws of the living don't always apply. Every few rounds the player and dealer may swap souls — and if you dare to cheat, you'd better hope the dealer doesn't notice.

---

## Core Concept

Standard Blackjack with two paranormal mechanics layered on top:

1. **Soul Swap** — Player and dealer periodically switch bodies, forcing the player to make dealer decisions and vice versa.
2. **Cheating / Getting Caught** — Players can attempt to peek at the dealer's hidden card or other players' hands. Success reveals the card; failure triggers a terrifying dealer charge animation and a cracked screen effect.

---

## Features

### 1. Blackjack Rules
- Standard 52-card deck, reshuffled when depleted
- Player actions: Hit, Stand, Double Down, Split (same-value pairs)
- Dealer hits on soft 16, stands on 17+
- Blackjack (Ace + 10-value on deal) pays 3:2
- Insurance offered when dealer shows an Ace
- Bust = automatic loss; 21 = automatic stand
- Starting chips: 1000; minimum bet: 10; maximum bet: 500

### 2. Spooky Theme
- Full dark gothic aesthetic: black, deep purple, blood orange, sickly green
- Skull & bone card suit icons
- Skeleton dealer character with idle animation
- Candlelight flicker on the felt table
- Spooky ambient atmosphere via CSS animations
- Gothic serif font for titles, monospace for card values

### 3. Soul Swap Mechanic
- Triggers randomly every 3–7 rounds
- Screen shatters into a swirling soul-transfer animation
- Player now plays AS the dealer (must follow dealer rules: hit ≤16, stand ≥17)
- Dealer now plays AS the player (makes random human-like decisions)
- HUD shows "YOU ARE THE DEALER" warning
- Swap reverts after one full round
- Playing optimally as dealer earns a bonus chip reward

### 4. Cheating / Caught Mechanic

#### Cheat Options
| Action | Risk | Reward |
|--------|------|--------|
| Peek at dealer hole card | 40% catch chance | See hidden card for 3 seconds |
| Peek at other player's hand | 25% catch chance | See all their cards for 5 seconds |
| Card counting assist | 15% catch chance per round | Running count displayed |

#### Getting Caught
- The skeleton dealer's eye sockets glow red
- Dealer animates charging across the screen toward the camera
- A realistic cracked-glass CSS overlay slams onto the screen
- Creepy sound cue (described in spec; implemented via Web Audio API tones)
- Chip penalty: lose 20% of current stack
- Crack fades after 4 seconds
- Three strikes and you're "banned" (game over screen with ghost escaping)

### 5. Other Players (NPCs)
- 2 ghost NPC players sit at the table
- They play with semi-transparent cards (face-down)
- Peek mechanic can reveal their hands
- They react to player actions with floating emoji reactions

### 6. Win / Loss Conditions
- Win: beat dealer without busting
- Lose: bust or dealer has higher total
- Push: tie — bet returned
- Blackjack: 3:2 payout
- Game over when chips reach 0 — "Your soul now belongs to the house"

---

## User Interface

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  💀 GHOULISH GAMBLING  🃏                                 │
│     BlackJack with a spooky twist                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   [Ghost NPC 1]    [DEALER 💀]    [Ghost NPC 2]          │
│   ░░ ░░             🂠 🂡           ░░ ░░                  │
│                                                          │
│              ─────────────────                           │
│              PLAYER HAND: 17                             │
│              🂱 🂷                                         │
│              ─────────────────                           │
│                                                          │
│   [HIT]  [STAND]  [DOUBLE]  [SPLIT]  [👁 PEEK]          │
│                                                          │
│   Chips: 💰 840    Bet: 60    Round: 4                   │
└──────────────────────────────────────────────────────────┘
```

### Screens
1. **Title Screen** — Animated title with floating ghosts, "Deal Me In" button
2. **Bet Screen** — Chip stack, bet slider, "Place Bet" button
3. **Game Screen** — Table felt, hands, action buttons, peek button
4. **Soul Swap Screen** — Full-screen swirling purple/green transition
5. **Cracked Screen Overlay** — CSS glass crack pattern, red vignette
6. **Game Over Screen** — Ghost escaping with final chip count

---

## Technical Specifications

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styling | CSS3 (animations, custom properties, grid) |
| Logic | Vanilla JavaScript (ES2022) |
| Audio | Web Audio API (procedural tones — no files needed) |
| Deployment | GitHub Pages |

Single `index.html` file. Zero dependencies.

---

## File Structure
```
Ghoulish-Gambling/
├── index.html          # Full application
└── spec.md             # This specification
```

---

## Live URL

https://aiml-1870-2026.github.io/xXSirallXx/Ghoulish-Gambling/

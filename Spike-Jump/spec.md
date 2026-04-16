# CLAUDING IT: Spike Jump
## A spike jump platformer so gorgeous it will make lesser games weep

---

## Vision

A side-scrolling infinite spike-jump platformer built with canvas-rendered visuals so
viscerally stunning — dynamic neon parallax, bloom-glow particles, procedural lightning
skies, and death explosions that fill the screen — that every frame feels hand-crafted
by a fever dream. Every 60 seconds of survival, the world tears itself apart and
**BOSS MODE** descends: the screen erupts, the text roars, and Cecil Steadman's voice
(synthesized via Web Audio API) bellows the sacred phrase into your skull.

---

## Core Concept

A single-button (spacebar / tap) infinite-runner where the player leaps between
platforms while dodging procedurally generated spike gauntlets. Survival time is the
score. The further you go, the faster the world scrolls, the denser the spikes, and
the more the environment warps into something alien and hostile.

Every **60 seconds** a BOSS MODE wave triggers — a punishing 15-second gauntlet
designed to kill. Survive it and the world exhales. Die during it and it counts double.

---

## Features

### 1. Movement & Physics

- **One-button jump**: spacebar, up-arrow, or tap — press to jump, release early to cut
  the arc (variable jump height)
- **Double jump**: unlocked after surviving 120 seconds total
- **Wall slide / wall jump**: hug a wall while falling → hold to slow descent, press
  jump to kick off
- **Coyote time**: 80 ms grace window after walking off a ledge before jump is denied
- **Jump buffering**: 120 ms input buffer so pre-pressed jumps register on landing
- **Gravity scale**: increases with game speed — jumps feel heavier the faster things move

### 2. Procedural World Generation

- Platforms generated in segments: safe zone → spike gauntlet → breather → repeat
- Spike density tied to elapsed time:
  - 0–30 s: sparse, forgiving gaps
  - 30–60 s: medium density, some ceiling spikes
  - 60–120 s: dense floors + ceilings, moving spike walls
  - 120 s+: pure chaos — everything spikes, platforms tilt and shrink
- Platform types:
  - **Solid**: standard, no tricks
  - **Crumble**: cracks under foot after 400 ms, falls away
  - **Bounce**: sends player 1.6× normal jump height
  - **Ice**: near-zero friction, player slides off edges
  - **Void**: looks solid but is a hologram; player falls through
- Moving spikes: horizontal sweepers, vertical pistons, rotating spike arrays
- Ceiling spike curtains that lower with game progression

### 3. Breathtaking Visuals

#### Background System (5 parallax layers)
| Layer | Speed | Content |
|-------|-------|---------|
| 0 (sky) | 0% | Procedural nebula painted with radial gradients; color shifts every 30 s |
| 1 | 8% | Distant city silhouette, razor-thin neon outlines |
| 2 | 20% | Mid-ground ruined architecture, glowing windows |
| 3 | 40% | Foreground debris: floating rocks, torn banners |
| 4 (ground) | 100% | Platform layer with player + spikes |

#### Lighting & Glow
- Every spike tip has a pulsing point-light corona rendered via radial gradient overlay
- Player carries a dynamic soft-light halo that reacts to jumps (flares on takeoff)
- Platform edges: subtle rim light from below — color shifts from cyan → magenta → gold
  over time
- **Bloom pass**: every bright element is drawn twice — once sharp, once at +8px blur
  and 40% opacity — creating a genuine bloom without WebGL
- Screen vignette: dark radial gradient overlay, intensifies in Boss Mode

#### Particle Systems
| Event | Particles |
|-------|-----------|
| Jump takeoff | 8–12 sparks burst downward, fade in 0.3 s |
| Landing | Dust puff ring, 6 motes that spread laterally |
| Wall slide | Continuous friction sparks along contact edge |
| Death | 80-particle explosion: shards + embers + screen flash white then dark |
| Spike graze (near miss) | 3–5 red sparks off the spike tip |
| Boss Mode start | Full-screen shockwave ring expanding from center |

#### Character Sprite
- Drawn entirely in canvas: a sleek angular humanoid with a visor that glows
- Idle: visor pulses slowly
- Run: leaning forward, procedural limb animation via sine-wave offsets
- Jump: body stretches upward (squash & stretch)
- Death: shatters into 12 polygonal fragments that scatter with physics
- Boss Mode: visor turns red, motion trail becomes longer and more saturated

#### Environmental Effects
- **Procedural lightning**: random branching bolt drawn on background layer every 4–8 s
  (increases in Boss Mode to every 0.5 s)
- **Speed lines**: radial lines from screen center that intensify as scroll speed increases
- **Color palette**: smoothly interpolates through 6 preset palettes every 45 s
  - Midnight Neon: black + electric blue + hot pink
  - Crimson Void: dark red + ember orange + ghost white
  - Acid Rain: toxic green + deep purple + silver
  - Arctic Chrome: ice blue + steel white + void black
  - Solar Flare: gold + orange + burned red
  - Spectral: cycling rainbow with black background
- **Parallax warp**: in Boss Mode, background layers contract and expand rhythmically,
  creating a tunnel-rush illusion

### 4. BOSS MODE

**Triggers**: every 60 seconds of cumulative survival time

**Entry sequence** (2 seconds):
1. Scroll speed instantly snaps to 1.8× normal
2. A white shockwave ring expands from the player outward
3. Screen flashes red three times
4. Existing platforms briefly turn transparent — player sees what's coming
5. Giant text slams onto screen:

```
████████████████████████████████████████████████████
█                                                  █
█   BOSS MODE: I'M CLAUDING IT —                   █
█   clauding it like a GAMER                       █
█                                                  █
████████████████████████████████████████████████████
```

Text style: massive gothic display font, color-cycling between white and red, with a
drop shadow so thick it feels physical. Text shakes with the audio cue.

**Audio**: A synthesized deep-voice bark via Web Audio API (oscillator stack:
two detuned sawtooth waves + overdrive distortion + a pitch envelope that drops from
220 Hz → 80 Hz over 0.8 s, with a sharp noise burst at onset). Loud. Commanding.
Timed to land exactly as the text appears. Think: stadium announcer who has had enough.

**Boss Mode gauntlet** (15 seconds):
- 3 distinct sub-waves, 5 seconds each:
  1. **Spike Corridor**: two opposing walls of spikes close toward the center; a
     precise gap moves up and down — thread it or die
  2. **Piston Hell**: ceiling and floor alternately slam with spike pistons; pattern is
     learnable on attempt 3+, random on attempts 1–2
  3. **Void Rain**: platforms become rare; spike clusters fall from above at
     unpredictable angles; the player must chain wall-jumps to survive
- Scroll speed stays at 1.8× throughout
- Background turns pure black with only neon outlines visible
- Lightning fires every 0.5 s
- Player's trail becomes a full motion-blur smear (last 8 positions ghosted at
  decreasing opacity)

**Survival reward**: +500 score bonus, scroll speed drops back smoothly over 3 s,
a golden shimmer effect washes over the player

**Death during Boss Mode**: score penalty −200, death explosion is 1.5× larger,
respawn with a 1-second shield

### 5. Spike Physics & Lethality

- Any spike contact: instant death, no mercy frames (except respawn shield)
- Spike tips have a pixel-precise hitbox (2 px inset from visual tip — feels fair)
- Moving spikes telegraph their path with a faint ghost trail of where they've been
- After 90 seconds, some spikes gain **random drift** — they deviate slightly from their
  programmed path each cycle, removing memorization as a safety net

### 6. Scoring

| Action | Points |
|--------|--------|
| 1 second survived | +10 |
| Spike graze (within 4 px) | +25 bonus |
| Perfect landing (center of platform) | +15 |
| Boss Mode survived | +500 |
| Double jump used | +5 |
| Wall jump | +10 |

- High score persisted to `localStorage`
- Score displayed top-right in a gothic number font
- On new high score: golden burst particle effect around score counter

### 7. Other Players (Ghosts)

- Your **3 previous run paths** are recorded (position over time)
- They replay as translucent ghost silhouettes during new runs
- Ghosts die at the same moment they did in their original run — their death
  explosion plays in ghost-blue
- Teaches muscle memory; creates a sense of friendly parallel competition with yourself

### 8. Death & Respawn

- **Death**: 0.5 s freeze frame → character shatters → camera zooms out slightly →
  stats screen overlays (survival time, score, boss modes survived, spikes dodged)
- **Quick restart**: spacebar / tap skips the stats screen after 1.5 s
- **Respawn**: character assembles from fragments → 1-second invincibility shimmer →
  game resumes at the last safe checkpoint (every 8 s, invisible)

---

## User Interface

### HUD Layout
```
┌──────────────────────────────────────────────────────────────┐
│  ⏱ 1:42          ⚡ SCORE: 12,430       🏆 BEST: 18,990     │
│                                                              │
│  [==============================-------] BOSS IN: 18s        │
│                                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                   (game canvas)                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- **Boss timer bar**: glows brighter as it fills; pulses red in the last 5 seconds
- **Speed indicator**: subtle speedometer arc in the corner, fills from 0 → max
- HUD uses a thin semi-transparent panel — never obstructs gameplay

### Screens

1. **Title Screen**
   - Animated background: the game world scrolling at 0.3× speed in the background
   - Massive dripping-neon title: "CLAUDING IT"
   - Subtitle: "Spike Jump — no mercy"
   - "PRESS SPACE TO BEGIN" pulsing in sync with a heartbeat audio pulse
   - High score displayed beneath

2. **Game Screen** — full canvas, HUD overlaid

3. **Boss Mode Overlay** — text + shockwave rendered above game canvas, game still
   running beneath

4. **Death Screen** — stats overlay with semi-transparent dark fill:
   - Survival time (large)
   - Score
   - Boss modes survived
   - Spikes narrowly dodged
   - "AGAIN" button (spacebar shortcut)

5. **New High Score Screen** — golden particle shower, score counter animates up digit
   by digit

---

## Technical Specifications

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Rendering | Canvas 2D (no WebGL required) |
| Styling | CSS3 (HUD, overlays, fonts) |
| Logic | Vanilla JavaScript (ES2022) |
| Audio | Web Audio API — procedural tones only, zero audio files |
| Storage | localStorage (high score, ghost run data) |
| Deployment | GitHub Pages |

**Single `index.html` file. Zero dependencies. Zero external assets.**

### Rendering Pipeline

Each frame (requestAnimationFrame):
1. Clear canvas
2. Draw background layer 0 (nebula gradients — cached, redrawn only on palette change)
3. Draw background layers 1–3 (parallax, each offset by scroll position × layer speed)
4. Draw platforms (with glow pass: draw normal, then draw blurred at 40% opacity)
5. Draw spikes (with corona glow)
6. Draw ghost runs (translucent)
7. Draw player (with trail ghosts behind in Boss Mode)
8. Draw particles
9. Draw foreground layer 4 (ground edge effects)
10. Draw speed lines (radial, opacity tied to current speed)
11. Draw vignette overlay
12. Draw HUD (separate from canvas if using DOM overlay, or drawn last on canvas)
13. Draw Boss Mode overlay if active

### Performance Targets

- 60 fps on mid-range hardware
- Particle pool: max 200 active particles (pool-recycled, no GC pressure)
- Background layers: cached to offscreen canvas when static, only re-rendered on
  palette transition
- Spike and platform objects: object pool of 60 items, recycled as they scroll off-screen

### Mobile Support

- Touch anywhere to jump (first touch), swipe up for extra force
- Responsive canvas: fills viewport, maintains 16:9 aspect ratio with letterboxing
- HUD font sizes scale with viewport width
- Performance mode: auto-detected on mobile (particles halved, blur pass disabled)

---

## File Structure

```
Spike-Jump/
├── index.html          # Full application — HTML + CSS + JS
└── spec.md             # This specification
```

---

## Live URL

https://aiml-1870-2026.github.io/xXSirallXx/Spike-Jump/

---

## Implementation Priority

### Phase 1: Playable Core
1. Canvas setup, game loop, requestAnimationFrame
2. Player physics: gravity, jump, coyote time, jump buffer
3. Procedural platform and spike generation
4. Collision detection (platform landing, spike death)
5. Basic scroll + score counter

### Phase 2: Visuals
6. 5-layer parallax background with gradient nebula
7. Platform glow pass (double-draw blur)
8. Spike corona glow
9. Particle system: jump dust, landing puff, death explosion
10. Player squash & stretch, visor pulse

### Phase 3: Boss Mode
11. 60-second timer → Boss Mode trigger
12. Text overlay with gothic font + shake animation
13. Web Audio API bark — detuned sawtooth + pitch envelope
14. Three-wave gauntlet: spike corridor, piston hell, void rain
15. Boss Mode visual changes: black bg, lightning, motion trail

### Phase 4: Polish
16. Ghost runs (record + replay last 3 deaths)
17. Color palette interpolation (6 palettes, 45 s cycle)
18. Speed lines (radial, opacity-scaled)
19. New high score screen (golden shower, digit counter)
20. Mobile touch + responsive canvas
21. localStorage persistence (score + ghosts)

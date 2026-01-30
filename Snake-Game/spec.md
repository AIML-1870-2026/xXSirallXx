# Claude the Cobra - Game Specification

## Overview
A snake game with a unique twist: the system gradually overloads until it can no longer sustain the game, ending in an inevitable crash.

## Intro Animation

### Title Formation
- 14 snakes slither onto the screen from random edges (top, bottom, left, right)
- Each snake targets a specific letter in "Claude the Cobra"
- Snakes have wobbling motion for organic movement
- Letters appear with a red glow effect (#e94560) as each snake arrives

### Snake Appearance (Intro)
- 15 segments per snake
- Gradient coloring (head to tail)
- White eyes on head
- Random speed variation (3-5 units)

### Menu Buttons
Appear 500ms after all snakes arrive:

| Button | Action |
|--------|--------|
| "Let's Play!" | Starts the game |
| "Maybe Another Time" | Closes the tab |

## Gameplay

### Controls
| Key | Direction |
|-----|-----------|
| Arrow Up / W | Up |
| Arrow Down / S | Down |
| Arrow Left / A | Left |
| Arrow Right / D | Right |

### Game Rules
- Snake starts with 3 segments
- Eating food grows the snake by 1 segment
- Wall collision = Game Over
- Self collision = Game Over
- System overload (100%) = Game Over

### Grid
- Canvas: 600x600 pixels
- Grid size: 20x20 pixels
- Tile count: 30x30

### Snake Appearance (Game)
- Rounded rectangle segments
- Gradient color from head (#e94560) to tail
- White eyes that follow movement direction
- Glowing head effect

### Food
- Red circular pellet (#ff6b6b)
- Glowing effect
- Randomly spawns (not on snake)

## System Overload Mechanic

### Load Increase
| Event | Load Increase |
|-------|---------------|
| Eating food | +5% |
| Per game tick | +0.1% |

### Visual Degradation
| Load Level | Effect |
|------------|--------|
| 0-30% | Normal gameplay |
| 30-50% | Random glitch artifacts appear |
| 50-70% | Screen ghosting/trails increase |
| 70-100% | Heavy visual corruption, more particles |
| 100% | System crash - Game Over |

### Visual Effects
- **Ghosting**: Screen clears with decreasing alpha (more trails)
- **Glitch artifacts**: Random red rectangles flash on screen
- **Particles**: Burst from food when eaten, quantity scales with load

### Load Indicator
- Displays "System Load: X%" at bottom of screen
- Updates in real-time

## Game Over

### Trigger Conditions
1. Snake hits wall
2. Snake hits itself
3. System load reaches 100%

### Modal Display
- Title: "Unfortunately..."
- Message: "Your game is over"
- Shows final score
- "Try Again" button to restart

### Modal Animation
- Shake effect on appearance
- Dark overlay background

## Technical Details

### Technologies
- Pure HTML/CSS/JavaScript
- Canvas 2D rendering
- No external dependencies

### Game Loop
- Initial speed: 100ms per tick
- Speed increases by 2ms per food eaten
- Minimum speed: 50ms per tick

### Color Palette
| Element | Color |
|---------|-------|
| Background | #1a1a2e |
| Primary (snake/UI) | #e94560 |
| Food | #ff6b6b |
| Text | #ffffff |

## Author
Saral Sapkota

## Version
1.0 - Initial Release

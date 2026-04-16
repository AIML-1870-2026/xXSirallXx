# Stellar Web Specification

## Overview
An interactive 3D particle network visualization with customizable settings and a chaotic "Beast Mode" feature.

## Features

### Core Visualization
- **Stellar Web**: A network of glowing nodes connected by edges in 3D space
- **3D Movement**: Nodes move in all three dimensions (X, Y, Z)
- **Perspective Projection**: Closer nodes appear larger and brighter
- **Camera Rotation**: Auto-rotating camera view with vertical tilt oscillation
- **Organic Motion**: Each node has unique oscillation patterns for natural movement
- **Depth Sorting**: Proper front-to-back rendering for realistic depth

### User Interface
- **Fade-in Effect**: Web gradually becomes visible on page load
- **Hint Text**: "Double click to see advanced settings" appears after load
- **Settings Panel**: Slides in from the right on double-click

### Advanced Settings Sliders

#### Movement Section
| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Node Speed | 0.1 - 3.0 | 1.0 | Controls X/Y movement speed |
| Z-Axis Speed | 0.0 - 3.0 | 1.0 | Controls depth movement speed |
| Camera Rotation | 0.0 - 2.0 | 0.5 | Auto-rotation speed |

#### Appearance Section
| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Node Count | 20 - 300 | 120 | Number of particles |
| Node Size | 1.0 - 8.0 | 3.0 | Base size of nodes |
| Edge Thickness | 0.5 - 4.0 | 1.0 | Line width of connections |

#### 3D Space Section
| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Connectivity Radius | 50 - 400 | 180 | Max distance for edge connections |
| Depth Range | 200 - 1200 | 600 | Z-axis space extent |
| Perspective | 200 - 1000 | 500 | Perspective intensity |

### Beast Mode
A chaotic mode that randomizes all settings rapidly for 10 seconds.

#### Activation
- Button: "Click this to go Beast Mode" (pulsing red/orange)
- Located at bottom of settings panel

#### Sequence
1. Settings panel closes
2. "BEAST MODE" label appears (glowing animation)
3. Countdown timer displays (10...9...8...0)
4. All sliders randomize every 100ms
5. After countdown ends:
   - Modal appears: "Wanna see me do it again?"
   - **Yes** button: Restarts Beast Mode
   - **No** button: Closes the page

## Technical Details

### Technologies
- Pure HTML/CSS/JavaScript (no dependencies)
- Canvas 2D rendering
- CSS animations for UI effects

### 3D Math
- Y-axis rotation (horizontal camera rotation)
- X-axis rotation (vertical tilt)
- Perspective projection formula: `scale = perspective / (perspective + z + depth/2)`

### Performance
- Trail effect via semi-transparent fill (creates motion blur)
- Depth sorting for proper rendering order
- Boundary wrapping (seamless infinite space)

## Author
Saral Sapkota

## Version
1.0 - Beast Mode Edition

# Metabolic Turing Patterns Explorer
## Reaction-Diffusion Simulation of the Beta-Oxidation Pathway

### Vision
A cutting-edge web application that visualizes the beta-oxidation metabolic pathway through the lens of reaction-diffusion mathematics, showing how concentration gradients of fatty acids, enzymes, and cofactors can create emergent Turing patterns within a simulated cellular environment.

---

## Core Concept

### The Science
Beta-oxidation breaks down fatty acids into Acetyl-CoA through a cyclic 4-step process. By modeling each metabolite as a "chemical species" in a reaction-diffusion system, we can visualize:
- How enzyme localization creates concentration gradients
- How substrate availability influences spatial patterns
- How metabolic flux creates dynamic, self-organizing structures

### The Math
Uses modified Gray-Scott equations with biochemically-meaningful parameters:
```
∂A/∂t = Dₐ∇²A - k₁·A·E + feed·(1-A)
∂B/∂t = Dᵦ∇²B + k₁·A·E - k₂·B - kill·B
```
Where A, B represent metabolite concentrations, E represents enzyme activity, and diffusion/reaction rates map to real kinetic parameters.

---

## Features

### 1. Dual-View Interface
| Left Panel | Right Panel |
|------------|-------------|
| **Pathway Diagram** | **Pattern Canvas** |
| Interactive biochemical pathway | Real-time reaction-diffusion simulation |
| Click enzymes to highlight their spatial effect | GPU-accelerated WebGL rendering |
| Shows metabolite flow direction | 1024×1024 resolution minimum |

### 2. The Beta-Oxidation Pathway Model

**Metabolites (Diffusing Species):**
| Species | Color | Role |
|---------|-------|------|
| Fatty Acyl-CoA | 🔴 Red | Primary substrate |
| Enoyl-CoA | 🟠 Orange | Intermediate 1 |
| Hydroxyacyl-CoA | 🟡 Yellow | Intermediate 2 |
| Ketoacyl-CoA | 🟢 Green | Intermediate 3 |
| Acetyl-CoA | 🔵 Blue | Product |
| NADH/FADH₂ | 🟣 Purple | Energy carriers |

**Enzymes (Reaction Catalysts):**
1. Acyl-CoA Dehydrogenase (ACAD)
2. Enoyl-CoA Hydratase (ECH)
3. 3-Hydroxyacyl-CoA Dehydrogenase (HADH)
4. 3-Ketoacyl-CoA Thiolase (KAT)

### 3. Visualization Modes

#### Mode A: "Concentration Heatmap"
- Classic reaction-diffusion visualization
- Each metabolite as a separate color channel
- Blending creates complex color patterns
- Spots = high local concentration, rings = reaction fronts

#### Mode B: "Mitochondrial Matrix"
- Overlay simulation on stylized mitochondrial structure
- Inner membrane folds (cristae) as boundary conditions
- Shows realistic compartmentalization

#### Mode C: "Pathway Flow"
- Particle system showing metabolite transformation
- Particles change color as they progress through pathway
- Flow lines show dominant reaction directions

#### Mode D: "Energy Landscape"
- 3D height map where height = total energy (NADH + FADH₂)
- Peaks show where energy is being released
- Valley flows show metabolic flux

### 4. Interactive Controls

#### Parameter Sliders
```
┌─────────────────────────────────────────────────┐
│ DIFFUSION RATES                                 │
│ ├─ Fatty Acyl-CoA    [====•=========]  0.4     │
│ ├─ Intermediates     [======•=======]  0.5     │
│ └─ Acetyl-CoA        [=========•====]  0.7     │
│                                                 │
│ ENZYME KINETICS (Vmax)                         │
│ ├─ ACAD              [===•==========]  0.35    │
│ ├─ ECH               [=====•========]  0.48    │
│ ├─ HADH              [====•=========]  0.42    │
│ └─ KAT               [======•=======]  0.55    │
│                                                 │
│ FEED/KILL RATES                                │
│ ├─ Fatty Acid Input  [==•===========]  0.025   │
│ └─ Product Removal   [====•=========]  0.062   │
└─────────────────────────────────────────────────┘
```

#### Click Interactions
- **Left Click**: Inject fatty acids at cursor position
- **Right Click**: Create enzyme "hotspot" (localized high activity)
- **Middle Click/Scroll**: Zoom in/out
- **Shift+Click**: Block enzyme at location (simulate inhibitor)
- **Ctrl+Click**: Add ATP (energy boost, speeds all reactions)

### 5. Preset Scenarios

| Preset | Description | Expected Pattern |
|--------|-------------|------------------|
| **Fed State** | High substrate, normal enzymes | Stable spots (efficient processing) |
| **Fasting** | Low substrate, upregulated enzymes | Stripes (searching behavior) |
| **MCAD Deficiency** | Reduced ACAD activity | Chaotic accumulation patterns |
| **Carnitine Shuttle Block** | No new fatty acids entering | Dissolving patterns (depletion) |
| **Ketogenesis Mode** | High Acetyl-CoA accumulation | Blue-dominant labyrinth |
| **Exercise** | High throughput, fast removal | Rapid oscillating waves |

### 6. Educational Overlays

#### "Learn Mode" Toggle
When enabled, hovering over any element shows:
- Chemical structure of metabolite
- Enzyme mechanism animation
- Relevance to human disease
- Connection to Turing's original equations

#### Annotation System
- Clickable info bubbles on pathway diagram
- Links to PDB enzyme structures
- Real Km/Vmax values from literature

### 7. Advanced Features

#### A. Time-Lapse Recording
- Record simulation as WebM/GIF
- Adjustable speed (0.25x - 4x)
- Add timestamp and parameter overlay

#### B. Pattern Recognition AI
- Classify emergent patterns (spots, stripes, labyrinth, chaos)
- Compare to known biological patterns
- "This pattern resembles: Cheetah spots (87% match)"

#### C. Multi-Pathway Mode
- Add glycolysis feeding into beta-oxidation
- Add citric acid cycle consuming Acetyl-CoA
- See how interconnected pathways create complex patterns

#### D. VR/3D Mode (Stretch Goal)
- WebXR support for immersive visualization
- Walk through a 3D mitochondrion
- See patterns forming around you

### 8. Sharing & Export

- **URL Parameters**: Share exact configuration via link
- **PNG Export**: High-res pattern snapshots
- **SVG Export**: Vector pathway diagrams
- **JSON Export**: Full simulation state
- **Embed Code**: iframe for educational sites

---

## Technical Architecture

### Rendering Pipeline
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   WebGL2     │───▶│  Ping-Pong   │───▶│  Post-       │
│   Compute    │    │  Framebuffers│    │  Processing  │
│   Shaders    │    │              │    │  (Color Map) │
└──────────────┘    └──────────────┘    └──────────────┘
        │
        ▼
┌──────────────┐
│  GPU Texture │
│  (Float32)   │
│  6 channels  │
└──────────────┘
```

### Performance Targets
- 60 FPS at 1024×1024 resolution
- <100ms initial load
- Mobile-responsive (512×512 on phones)
- Works offline after first load (PWA)

### Tech Stack
- **Rendering**: WebGL2 with GLSL shaders
- **UI Framework**: Vanilla JS + CSS Grid (lightweight)
- **State Management**: URL hash for shareability
- **Math**: Custom reaction-diffusion solver in GLSL

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  🧬 Metabolic Turing Patterns                    [?] [⚙] [📤]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐│
│  │                     │    │                                 ││
│  │   PATHWAY DIAGRAM   │    │                                 ││
│  │                     │    │                                 ││
│  │   [Fatty Acid]      │    │      SIMULATION CANVAS          ││
│  │        ↓            │    │                                 ││
│  │   ══[ACAD]══        │    │     (Reaction-Diffusion         ││
│  │        ↓            │    │      Visualization)             ││
│  │   [Enoyl-CoA]       │    │                                 ││
│  │        ↓            │    │                                 ││
│  │   ══[ECH]══         │    │                                 ││
│  │        ↓            │    │                                 ││
│  │      ...            │    │                                 ││
│  │        ↓            │    │                                 ││
│  │   [Acetyl-CoA]      │    │                                 ││
│  │                     │    │                                 ││
│  └─────────────────────┘    └─────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  PRESETS: [Fed] [Fasting] [MCAD Def] [Exercise] [Custom]       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Diffusion   │ │ Enzyme Vmax │ │ Feed/Kill   │ │ Display   │ │
│  │ Rates       │ │ Parameters  │ │ Rates       │ │ Options   │ │
│  │ [sliders]   │ │ [sliders]   │ │ [sliders]   │ │ [toggles] │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  [▶ Play] [⏸ Pause] [⏮ Reset] [🎬 Record]    Speed: [====•==] │
└─────────────────────────────────────────────────────────────────┘
```

---

## Color Palette

### Metabolite Gradient (Dark Theme)
```css
--fatty-acyl:    #FF6B6B;  /* Coral Red */
--enoyl:         #FFA94D;  /* Warm Orange */
--hydroxy:       #FFE066;  /* Golden Yellow */
--keto:          #69DB7C;  /* Mint Green */
--acetyl:        #4DABF7;  /* Sky Blue */
--energy:        #DA77F2;  /* Orchid Purple */
--background:    #1A1B26;  /* Deep Navy */
--panel:         #24283B;  /* Slate */
--accent:        #7AA2F7;  /* Periwinkle */
```

---

## Interaction Flow

### First-Time User Experience
1. **Splash**: Brief animation showing Turing's original patterns morphing into metabolic visualization
2. **Tutorial Tooltip**: "Click anywhere to inject fatty acids"
3. **Auto-start**: Fed State preset runs automatically
4. **Discovery**: Hovering elements reveals educational content

### Power User Features
- Keyboard shortcuts (Space=pause, R=reset, 1-6=presets)
- Console API for programmatic control
- Import custom parameter sets via JSON

---

## Success Metrics

1. **Educational Value**: Users can explain connection between R-D math and metabolism
2. **Visual Appeal**: Patterns are beautiful enough to screenshot and share
3. **Scientific Accuracy**: Parameter ranges reflect real biochemistry
4. **Performance**: Smooth 60fps on mid-range devices
5. **Accessibility**: Works with screen readers, keyboard-only navigation

---

## Implementation Phases

### Phase 1: Core Engine
- [ ] WebGL2 reaction-diffusion solver
- [ ] Basic 2-species Gray-Scott model
- [ ] Canvas rendering with color mapping
- [ ] Play/pause/reset controls

### Phase 2: Beta-Oxidation Model
- [ ] 6-species extended model
- [ ] Pathway diagram UI
- [ ] Enzyme kinetics parameters
- [ ] Preset scenarios

### Phase 3: Interactivity
- [ ] Click to inject/perturb
- [ ] Real-time parameter adjustment
- [ ] Hover tooltips and education mode
- [ ] Recording and export

### Phase 4: Polish
- [ ] Mobile responsiveness
- [ ] PWA offline support
- [ ] Share URLs
- [ ] Pattern recognition (stretch)

---

## References

1. Turing, A.M. (1952). "The Chemical Basis of Morphogenesis"
2. Gray, P. & Scott, S.K. (1984). "Autocatalytic reactions in the CSTR"
3. Bartlett, K. & Eaton, S. (2004). "Mitochondrial β-oxidation" - Eur J Biochem
4. Pearson, J.E. (1993). "Complex Patterns in a Simple System" - Science

---

*Created for AIML 1870 - Pushing the boundaries of scientific visualization*

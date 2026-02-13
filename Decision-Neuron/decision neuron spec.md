# Decision Neuron Specification

## Overview
An interactive neural visualization tool that helps modulate decision-making when choosing between multiple advice sources (Person A, B, C, or D). The system uses weighted inputs and softmax activation to produce competitive selection.

## Architecture

### Neural Model
```
                    ┌─────────────────┐
   Expertise ──────►│                 │──────► Person A (activation)
   Availability ───►│  DECISION       │──────► Person B (activation)
   Trust ──────────►│  NEURON         │──────► Person C (activation)
   Custom* ────────►│  (softmax)      │──────► Person D (activation)
                    └─────────────────┘
```

### Input Layer
Each input factor has:
- **Importance Weight** (0-10): How much this factor matters overall
- **Per-Person Scores** (0-10): Rating for each person on this factor

### Processing Layer
1. **Weighted Sum**: For each person, compute:
   ```
   score = Σ(factor_value × factor_importance)
   ```
2. **Normalization**: Divide by total weight sum
3. **Softmax Activation**: Convert to probability distribution
   ```
   activation_i = e^(score_i) / Σ(e^(score_j))
   ```

### Output Layer
- Four output nodes (Person A-D)
- Activation values sum to 1.0
- Highest activation = recommended advice source

## Input Factors

### Core Factors
| Factor | Description | Default Weight |
|--------|-------------|----------------|
| Expertise | Domain knowledge and skill level | 8 |
| Availability | Responsiveness and accessibility | 5 |
| Trust | Reliability and relationship quality | 7 |

### Custom Factors
Users can add unlimited custom factors with:
- Custom name
- Importance weight (0-10)
- Per-person scores (0-10)

## User Interface

### Left Panel: Input Controls
- Factor importance sliders
- Per-person rating sliders for each factor
- Custom factor creation input

### Center: Visualization
- Animated central decision neuron with pulse effect
- Input nodes (red) connected to center
- Output nodes (green) with activation scores
- Winner node highlighted in gold

### Right Panel: Output Display
- Score cards for each person showing:
  - Activation value (3 decimal places)
  - Visual progress bar
  - Factor breakdown
- Winner banner showing recommended choice

## Technical Implementation

### Technologies
- Pure HTML5, CSS3, JavaScript
- No external dependencies
- SVG for connection lines
- CSS animations for visual effects

### Key Functions
- `calculate()`: Main computation loop
- `softmax(arr)`: Competitive activation function
- `addCustomFactor()`: Dynamic factor creation
- `drawConnections()`: SVG line rendering

### Styling
- Dark theme with gradient background (#1a1a2e → #0f3460)
- Color coding:
  - Input nodes: #ff6b6b (red)
  - Output nodes: #51cf66 (green)
  - Winner: #ffd93d (gold)
  - Neuron core: #00d9ff (cyan)
- Glassmorphism panels with backdrop blur
- Responsive grid layout

## Mathematical Model

### Softmax Function
The softmax function ensures:
1. All activations are positive
2. Activations sum to 1.0
3. Competitive dynamics (one winner emerges)

```javascript
function softmax(arr) {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
}
```

### Score Calculation
```javascript
score[person] = (expertise × w_exp + availability × w_avail + trust × w_trust + custom_sum)
                / total_weight
```

## Usage Example

**Scenario**: Deciding who to ask about a career decision

| Factor | Weight | Person A | Person B | Person C | Person D |
|--------|--------|----------|----------|----------|----------|
| Expertise | 8 | 9 (mentor) | 6 (peer) | 4 (friend) | 7 (coach) |
| Availability | 5 | 3 (busy) | 9 (free) | 5 (varies) | 7 (scheduled) |
| Trust | 7 | 9 (long history) | 5 (new) | 8 (close friend) | 6 (professional) |

**Result**: Person A wins with highest activation despite low availability, because expertise and trust weights dominate.

## File Structure
```
Decision-Neuron/
├── index.html    # Main application (self-contained)
└── spec.md       # This specification
```

## Future Enhancements
- Save/load configurations to localStorage
- Export decision rationale as PDF
- Multiple decision scenarios
- Sensitivity analysis visualization
- Mobile-optimized layout

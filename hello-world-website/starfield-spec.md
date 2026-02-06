# Interactive Starfield - "Stars are beautiful, aren't they?"

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Swift Starfield</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #0a0a1a;
            overflow: hidden;
            font-family: 'Arial', sans-serif;
        }

        canvas {
            display: block;
            background: radial-gradient(circle at center, #1a1a3a 0%, #050510 100%);
        }

        .title {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 48px;
            font-weight: bold;
            text-align: center;
            text-shadow: 0 0 20px #ffff00, 0 0 40px #ffaa00;
            pointer-events: none;
            z-index: 10;
            animation: pulse 2s ease-in-out infinite;
        }

        .details-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 10;
            opacity: 0;
            transition: opacity 0.5s;
        }

        .details-container.show {
            opacity: 1;
        }

        .details-toggle {
            background: rgba(255, 255, 0, 0.2);
            border: 2px solid #ffff00;
            color: #fff;
            padding: 12px 24px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 8px;
            text-shadow: 0 0 10px #ffff00;
            box-shadow: 0 0 20px rgba(255, 255, 0, 0.3);
            transition: all 0.3s;
        }

        .details-toggle:hover {
            background: rgba(255, 255, 0, 0.3);
            box-shadow: 0 0 30px rgba(255, 255, 0, 0.5);
        }

        .details-panel {
            background: rgba(10, 10, 26, 0.9);
            border: 2px solid #ffff00;
            border-radius: 12px;
            padding: 20px;
            margin-top: 10px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease-out;
            box-shadow: 0 0 30px rgba(255, 255, 0, 0.3);
        }

        .details-panel.open {
            max-height: 500px;
        }

        .control-group {
            margin-bottom: 20px;
        }

        .control-label {
            color: #ffff00;
            font-size: 16px;
            margin-bottom: 8px;
            display: block;
            text-shadow: 0 0 5px #ffff00;
        }

        .control-slider {
            width: 250px;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            outline: none;
            -webkit-appearance: none;
        }

        .control-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: #ffff00;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px #ffff00;
        }

        .control-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #ffff00;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px #ffff00;
            border: none;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
    </style>
</head>
<body>
    <canvas id="starfield"></canvas>
    <div class="title">Stars are beautiful, aren't they?</div>

    <div class="details-container" id="detailsContainer">
        <button class="details-toggle" id="detailsToggle">here are some details</button>
        <div class="details-panel" id="detailsPanel">
            <div class="control-group">
                <label class="control-label">Trail Length: <span id="trailValue">12</span></label>
                <input type="range" class="control-slider" id="trailSlider" min="0" max="20" step="1" value="12">
            </div>
            <div class="control-group">
                <label class="control-label">Star Count: <span id="countValue">150</span></label>
                <input type="range" class="control-slider" id="countSlider" min="50" max="500" step="10" value="150">
            </div>
            <div class="control-group">
                <label class="control-label">Star Speed: <span id="speedValue">15</span></label>
                <input type="range" class="control-slider" id="speedSlider" min="2" max="30" step="1" value="15">
            </div>
            <div class="control-group">
                <label class="control-label">Spawn Radius: <span id="radiusValue">2000</span></label>
                <input type="range" class="control-slider" id="radiusSlider" min="500" max="4000" step="100" value="2000">
            </div>
        </div>
    </div>

    <script>
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Control variables - Swift attack style defaults
        let maxTrailLength = 12;
        let targetStarCount = 150;
        let baseSpeed = 15;
        let spawnRadius = 2000;

        // Show details container after 3 seconds
        setTimeout(() => {
            document.getElementById('detailsContainer').classList.add('show');
        }, 3000);

        // Toggle details panel
        document.getElementById('detailsToggle').addEventListener('click', () => {
            const panel = document.getElementById('detailsPanel');
            panel.classList.toggle('open');
        });

        // Trail Length slider
        document.getElementById('trailSlider').addEventListener('input', (e) => {
            maxTrailLength = parseInt(e.target.value);
            document.getElementById('trailValue').textContent = maxTrailLength;
        });

        // Star Count slider
        document.getElementById('countSlider').addEventListener('input', (e) => {
            targetStarCount = parseInt(e.target.value);
            document.getElementById('countValue').textContent = targetStarCount;

            // Adjust star count
            if (stars.length < targetStarCount) {
                while (stars.length < targetStarCount) {
                    stars.push(new Star());
                }
            } else if (stars.length > targetStarCount) {
                stars.splice(targetStarCount);
            }
        });

        // Speed slider
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            baseSpeed = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = baseSpeed;
            stars.forEach(star => {
                const speedRatio = star.speed / star.originalSpeed;
                star.originalSpeed = baseSpeed * (0.5 + Math.random() * 1);
                star.speed = star.originalSpeed * speedRatio;
            });
        });

        // Spawn Radius slider
        document.getElementById('radiusSlider').addEventListener('input', (e) => {
            spawnRadius = parseInt(e.target.value);
            document.getElementById('radiusValue').textContent = spawnRadius;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                // Random angle for direction
                this.angle = Math.random() * Math.PI * 2;

                // Z-depth (distance from screen)
                this.z = Math.random() * 2000 + 100;

                // Position on the "far" plane
                this.px = (Math.random() - 0.5) * spawnRadius;
                this.py = (Math.random() - 0.5) * spawnRadius;

                // Speed - Swift attack style (faster, more aggressive)
                this.originalSpeed = baseSpeed * (0.7 + Math.random() * 0.8);
                this.speed = this.originalSpeed;

                // Star properties - Swift style rapid spinning
                this.baseSize = 1.5 + Math.random() * 2.5;
                this.rotation = Math.random() * Math.PI * 2;
                // Much faster rotation like Swift attack stars
                this.rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.4);

                // Swift attack color palette - predominantly golden yellow
                const colorVariation = Math.random();
                if (colorVariation < 0.5) {
                    this.color = '#ffd700'; // Gold
                } else if (colorVariation < 0.8) {
                    this.color = '#ffff00'; // Bright yellow
                } else if (colorVariation < 0.95) {
                    this.color = '#ffaa00'; // Orange-gold
                } else {
                    this.color = '#ffffaa'; // Pale yellow sparkle
                }

                // Sparkle/shimmer effect
                this.shimmerPhase = Math.random() * Math.PI * 2;
                this.shimmerSpeed = 0.2 + Math.random() * 0.3;

                // Slight wobble for more dynamic movement
                this.wobblePhase = Math.random() * Math.PI * 2;
                this.wobbleAmount = 0.5 + Math.random() * 1;
                this.wobbleSpeed = 0.1 + Math.random() * 0.1;

                this.prevX = null;
                this.prevY = null;
                this.trail = [];
            }

            update() {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                // Save previous position for trail
                this.prevX = this.x;
                this.prevY = this.y;

                // Add to trail with size info for tapering
                if (this.x !== undefined && this.y !== undefined) {
                    this.trail.push({
                        x: this.x,
                        y: this.y,
                        alpha: this.alpha,
                        size: this.size,
                        rotation: this.rotation
                    });
                    if (this.trail.length > maxTrailLength) {
                        this.trail.shift();
                    }
                }

                // Move star towards screen (decrease z) - Swift attack speed
                this.z -= this.speed;

                // Update wobble phase for sinusoidal movement
                this.wobblePhase += this.wobbleSpeed;

                // 3D to 2D projection with wobble
                const scale = 1000 / this.z;
                const wobbleOffset = Math.sin(this.wobblePhase) * this.wobbleAmount * scale;

                // Apply wobble perpendicular to movement direction
                const moveAngle = Math.atan2(this.py, this.px);
                this.x = centerX + this.px * scale + Math.cos(moveAngle + Math.PI/2) * wobbleOffset;
                this.y = centerY + this.py * scale + Math.sin(moveAngle + Math.PI/2) * wobbleOffset;
                this.size = this.baseSize * scale * 2.5;

                // Rapid rotation like Swift attack
                this.rotation += this.rotationSpeed;

                // Update shimmer
                this.shimmerPhase += this.shimmerSpeed;
                this.shimmer = 0.7 + Math.sin(this.shimmerPhase) * 0.3;

                // Calculate alpha based on distance
                this.alpha = Math.min(1, (2000 - this.z) / 400) * this.shimmer;

                // Reset if star has passed the screen
                if (this.z <= 0 || this.x < -100 || this.x > canvas.width + 100 ||
                    this.y < -100 || this.y > canvas.height + 100) {
                    this.reset();
                }
            }

            drawSwiftStar(x, y, size, rotation, alpha) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotation);

                // 4-pointed star shape like Pokemon Swift
                const outerRadius = size;
                const innerRadius = size * 0.35;
                const spikes = 4;

                ctx.beginPath();
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = (Math.PI / spikes) * i - Math.PI / 2;
                    const px = Math.cos(angle) * radius;
                    const py = Math.sin(angle) * radius;

                    if (i === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
                ctx.closePath();

                // Strong golden glow effect
                ctx.shadowBlur = 20;
                ctx.shadowColor = this.color;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = alpha;
                ctx.fill();

                // Bright white center core
                ctx.beginPath();
                ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ffffff';
                ctx.globalAlpha = alpha * 0.9;
                ctx.fill();

                ctx.restore();
            }

            draw() {
                // Draw trail of smaller stars
                if (maxTrailLength > 0 && this.trail.length > 1) {
                    ctx.save();
                    for (let i = 0; i < this.trail.length; i++) {
                        const point = this.trail[i];
                        const progress = i / this.trail.length;
                        const trailAlpha = progress * this.alpha * 0.6;
                        const trailSize = point.size * progress * 0.7;

                        if (trailSize > 0.5) {
                            this.drawTrailStar(point.x, point.y, trailSize, point.rotation, trailAlpha);
                        }
                    }
                    ctx.restore();
                }

                // Draw main star
                if (this.size > 0.5) {
                    this.drawSwiftStar(
                        this.x,
                        this.y,
                        this.size,
                        this.rotation,
                        this.alpha
                    );
                }
            }

            drawTrailStar(x, y, size, rotation, alpha) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotation);

                const outerRadius = size;
                const innerRadius = size * 0.35;
                const spikes = 4;

                ctx.beginPath();
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = (Math.PI / spikes) * i - Math.PI / 2;
                    const px = Math.cos(angle) * radius;
                    const py = Math.sin(angle) * radius;

                    if (i === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
                ctx.closePath();

                ctx.shadowBlur = 12;
                ctx.shadowColor = this.color;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = alpha;
                ctx.fill();

                ctx.restore();
            }
        }

        // Create stars
        const stars = [];
        const starCount = 150;

        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }

        // Animation loop
        function animate() {
            // Clear with fade effect for motion blur
            ctx.fillStyle = 'rgba(10, 10, 26, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw stars
            stars.forEach(star => {
                star.update();
                star.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Swift attack burst on click - rapid fire stars
        canvas.addEventListener('click', (e) => {
            // Boost all existing stars
            stars.forEach(star => {
                star.speed *= 2.5;
            });

            // Create burst of new stars from click point
            const burstCount = 20;
            for (let i = 0; i < burstCount; i++) {
                const star = new Star();
                // Position burst stars to originate from center but spread toward click
                star.z = 500 + Math.random() * 500;
                star.speed = baseSpeed * 2;
                stars.push(star);
            }

            // Remove extra stars and reset speeds after burst
            setTimeout(() => {
                stars.forEach(star => {
                    star.speed /= 2.5;
                });
                // Trim back to target count
                while (stars.length > targetStarCount) {
                    stars.pop();
                }
            }, 400);
        });
    </script>
</body>
</html>
```

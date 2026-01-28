# Interactive Loading Experience

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World - Loading Experience</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: #00ff00;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
        }

        .loading-container {
            text-align: center;
            width: 80%;
            max-width: 600px;
        }

        .loading-bar-wrapper {
            width: 100%;
            height: 30px;
            background: #1a1a1a;
            border: 2px solid #00ff00;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }

        .loading-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #00ff00, #00cc00);
            transition: width 0.1s linear;
            box-shadow: 0 0 20px #00ff00;
        }

        .loading-text {
            margin-top: 20px;
            font-size: 20px;
            letter-spacing: 2px;
        }

        .content {
            display: none;
            text-align: center;
        }

        .hello-world {
            font-size: 60px;
            font-weight: bold;
            margin-bottom: 40px;
            min-height: 80px;
        }

        .hello-world span {
            opacity: 0;
            display: inline-block;
            animation: fadeIn 0.3s forwards;
        }

        @keyframes fadeIn {
            to {
                opacity: 1;
            }
        }

        .greeting {
            font-size: 24px;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            opacity: 0;
        }

        .greeting.show {
            animation: fadeIn 1s forwards;
        }

        .epic-gamer {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 30px;
            opacity: 0;
            color: #ff00ff;
            text-shadow: 0 0 10px #ff00ff;
        }

        .epic-gamer.show {
            animation: fadeIn 0.5s forwards;
        }

        .author {
            font-size: 20px;
            margin-top: 30px;
            opacity: 0;
            color: #00cc00;
        }

        .author.show {
            animation: fadeIn 1s forwards;
        }

        .blink {
            animation: blinkEffect 0.5s;
        }

        @keyframes blinkEffect {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="loading-bar-wrapper">
            <div class="loading-bar" id="loadingBar"></div>
        </div>
        <div class="loading-text" id="loadingText">Loading... <span id="percentage">0</span>%</div>
    </div>

    <div class="content" id="content">
        <div class="epic-gamer" id="epicGamer">Epic Gamer Moment</div>
        <div class="hello-world" id="helloWorld"></div>
        <div class="greeting" id="greeting">
            Greetings inhabitants of planet Earth, let's embark on this vibe-coding adventure together
        </div>
        <div class="author" id="author">
            - Saral Sapkota
        </div>
    </div>

    <script>
        const loadingBar = document.getElementById('loadingBar');
        const percentage = document.getElementById('percentage');
        const loadingContainer = document.querySelector('.loading-container');
        const content = document.getElementById('content');
        const epicGamer = document.getElementById('epicGamer');
        const helloWorld = document.getElementById('helloWorld');
        const greeting = document.getElementById('greeting');
        const author = document.getElementById('author');

        let progress = 0;
        const duration = 15000; // 15 seconds
        const interval = 100; // Update every 100ms
        const increment = (100 / (duration / interval));

        const loadingInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                completeLoading();
            }
            loadingBar.style.width = progress + '%';
            percentage.textContent = Math.floor(progress);
        }, interval);

        function completeLoading() {
            setTimeout(() => {
                // Blink effect
                document.body.classList.add('blink');

                setTimeout(() => {
                    document.body.classList.remove('blink');
                    loadingContainer.classList.add('hidden');
                    content.style.display = 'block';

                    // Show "Epic Gamer Moment" immediately
                    epicGamer.classList.add('show');

                    // Type out "Hello World" letter by letter after Epic Gamer Moment
                    setTimeout(() => {
                        const text = 'Hello World';
                        let index = 0;

                        const typeInterval = setInterval(() => {
                            if (index < text.length) {
                                const span = document.createElement('span');
                                span.textContent = text[index];
                                span.style.animationDelay = '0s';
                                helloWorld.appendChild(span);
                                index++;
                            } else {
                                clearInterval(typeInterval);
                                // Show greeting after "Hello World" is complete
                                setTimeout(() => {
                                    greeting.classList.add('show');
                                    // Show author name after greeting
                                    setTimeout(() => {
                                        author.classList.add('show');
                                    }, 1000);
                                }, 500);
                            }
                        }, 150); // 150ms between each letter
                    }, 500);
                }, 500);
            }, 200);
        }
    </script>
</body>
</html>
```

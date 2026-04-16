# Science Experiment Generator — spec.md

## Project Overview

A single-page web application that lets users generate grade-appropriate science experiments using OpenAI's language models. The user selects a grade level, enters a list of available supplies, chooses an OpenAI model, and receives a tailored experiment rendered as formatted HTML. The goal is to make hands-on science accessible by working with materials students already have.

## Reference Implementation

The `temp/` folder contains my complete LLM Switchboard project (HTML, CSS, and JS files). This is NOT part of the current project — do not include it in the final build or deployment.

Use it as a reference for:
- How to parse a `.env` file for API keys (in-memory only)
- The `fetch()` call structure for OpenAI's chat completions API
- Error handling patterns for failed API requests
- How the code is organized across separate files
- The general approach to building a single-page LLM tool

Ignore these Switchboard features (not needed here):
- Anthropic integration (this project is OpenAI-only)
- The model selection dropdown / provider switching logic for multiple providers
- Structured output mode and JSON schema handling

This project uses unstructured (free-form) responses only. Render the model's markdown output as formatted HTML.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no framework required)
- **API:** OpenAI Chat Completions API (direct browser-to-API calls)
- **Markdown rendering:** Use a library like `marked.js` to convert markdown responses to HTML
- **Deployment:** Single `index.html` file deployed via GitHub Pages to the class GitHub Organization

## Core Features

### 1. Grade Level Selector
- A dropdown menu with grade level ranges:
  - K–2
  - 3–5
  - 6–8
  - 9–12
- Used in the prompt to ensure the generated experiment is age-appropriate in language, complexity, and safety.

### 2. Available Supplies Input
- A text input field where the user types a comma-separated list of supplies they have on hand (e.g., "baking soda, vinegar, balloons, food coloring, plastic cups").
- A clear label so the user understands what to enter.

### 3. Model Selector
- A dropdown menu populated with available OpenAI models (e.g., `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`).
- Defaults to a sensible choice (e.g., `gpt-4o-mini`).

### 4. Generate Button
- Triggers the API call when clicked.
- Disabled while a request is in progress to prevent duplicate calls.

### 5. Response Display
- Shows a loading indicator while waiting for the response.
- Renders the model's markdown output as properly formatted HTML (headings, bold, lists, etc.).
- Displays a clear error message if the API call fails.

### 6. Experiment History
- Each generated experiment is automatically saved to `localStorage`.
- A history panel displays previous experiments as clickable cards showing grade level, supplies preview, and timestamp.
- Clicking a history card restores that experiment in the output area.
- Individual experiments can be deleted, or the entire history can be cleared.
- History persists across page reloads (capped at 20 entries).

## API Key Handling

- API keys are loaded from a `.env` file using the same in-memory parsing pattern as the Switchboard.
- Keys are never persisted to localStorage or cookies.
- The `.env` file is listed in `.gitignore` and never committed.

## Architecture Constraints

- **OpenAI only.** No Anthropic or Google integration. OpenAI's API permits direct browser-to-API calls; Anthropic's does not (CORS restriction). This is a deliberate architectural choice based on the CORS lesson from the Switchboard.
- **No backend server.** The app runs entirely in the browser as a static single-file deployment.
- **Unstructured responses only.** The model returns free-form markdown text, not JSON. No schema templates are needed.
- **Single-file deployment.** The final deliverable is one `index.html` file (with CSS and JS inlined) ready for GitHub Pages.

## Prompt Design

The system prompt sent to the model instructs it to generate a safe, grade-appropriate science experiment using only the supplies the user listed:

```
You are a K-12 science education assistant. When given a grade level and a list
of available supplies, design a single hands-on science experiment that:

- Is appropriate for the specified grade level in language, complexity, and safety
- Uses ONLY the supplies the user has listed (do not require additional materials)
- Includes a clear title for the experiment
- Explains the scientific concept or principle being demonstrated
- Provides step-by-step instructions
- Describes the expected outcome or observation
- Includes safety notes where relevant
- Suggests discussion questions or extensions for further learning

Format your response in markdown with clear headings, numbered steps, and bullet
points where appropriate.
```

## File Structure

```
Science-Experiment-Generator/
├── index.html        # Single-file app (HTML, CSS, JS inlined)
├── .env              # API keys (gitignored)
├── .gitignore
└── spec.md           # This file
```

## Out of Scope

- Multi-provider support (Anthropic, Google, etc.)
- Structured/JSON output mode
- Chat history or multi-turn conversation
- User authentication
- Backend server or proxy

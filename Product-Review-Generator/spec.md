# Product Review Generator — spec.md

## Project Overview

A single-page web application that lets users generate product reviews using OpenAI's language models. The user enters a product name, selects an OpenAI model, and receives a formatted review rendered as HTML.

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
- **Deployment:** Static site deployed to the class GitHub Organization

## Core Features

### 1. Product Input
- A text input field where the user types the name of a product to review.
- A clear label so the user knows what to enter (e.g., "Enter a product name").

### 2. Model Selector
- A dropdown menu populated with available OpenAI models (e.g., `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`).
- Defaults to a sensible choice (e.g., `gpt-4o-mini`).

### 3. Generate Button
- Triggers the API call when clicked.
- Disabled while a request is in progress to prevent duplicate calls.

### 4. Response Display
- Shows a loading indicator while waiting for the response.
- Renders the model's markdown output as properly formatted HTML (headings, bold, lists, etc.).
- Displays a clear error message if the API call fails.

## API Key Handling

- API keys are loaded from a `.env` file using the same in-memory parsing pattern as the Switchboard.
- Keys are never persisted to localStorage or cookies.
- The `.env` file is listed in `.gitignore` and never committed.

## Architecture Constraints

- **OpenAI only.** No Anthropic integration. OpenAI's API permits direct browser-to-API calls; Anthropic's does not (CORS restriction).
- **No backend server.** The app runs entirely in the browser as static HTML/CSS/JS.
- **Unstructured responses only.** The model returns free-form text, not JSON. No schema templates are needed.

## Prompt Design

The system prompt sent to the model should instruct it to generate a realistic, balanced product review in markdown format. Something like:

```
You are a helpful assistant that writes detailed, balanced product reviews.
When given a product name, write a review that includes:
- A brief overview of the product
- Key pros and cons
- A rating out of 5 stars
- A final recommendation

Format your response in markdown with clear headings and bullet points.
```

## File Structure

```
project-root/
├── index.html        # Main page structure
├── style.css         # Styling
├── app.js            # API logic, DOM interaction, markdown rendering
├── .env              # API keys (gitignored)
├── .gitignore
├── spec.md           # This file
└── temp/             # Reference code from LLM Switchboard (not deployed)
    ├── index.html
    ├── style.css
    └── app.js
```

## Out of Scope

- Multi-provider support (Anthropic, Google, etc.)
- Structured/JSON output mode
- Chat history or multi-turn conversation
- User authentication
- Persistent storage of generated reviews

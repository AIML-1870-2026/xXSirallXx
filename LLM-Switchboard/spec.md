# LLM Switchboard — Specification

## Overview
A single-file browser app (`index.html`) that lets users send prompts to large language model APIs and inspect responses in both free-text and structured (JSON schema) modes.

---

## Supported Providers & Models

| Provider  | Models                                          | Browser-callable? |
|-----------|-------------------------------------------------|-------------------|
| OpenAI    | gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo | Yes (CORS open)  |
| Anthropic | claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5 | No (CORS blocked) |

---

## API Key Handling
- User pastes key directly into a password-type `<input>`, **or** uploads a `.env` file.
- Key is stored in a JS variable only — never written to `localStorage`, `sessionStorage`, cookies, or the DOM.
- Cleared automatically when the page is closed/refreshed.
- No key is ever sent anywhere except the provider's own API endpoint.

---

## UI Layout

```
┌─────────────────────────────────────────────────────┐
│  LLM Switchboard                             [Dark] │
├─────────────────────────────────────────────────────┤
│  Provider: [OpenAI ▼]   Model: [gpt-4o ▼]          │
│  API Key: [••••••••••••••••••]  [Upload .env]       │
├─────────────────────────────────────────────────────┤
│  Mode: (•) Free Text  ( ) Structured JSON           │
│                                                     │
│  Prompt:                                            │
│  ┌───────────────────────────────────────────────┐ │
│  │  (text area)                                  │ │
│  └───────────────────────────────────────────────┘ │
│  [Example prompts: chip chip chip]                  │
│                                                     │
│  ── Structured mode only ──────────────────────── │
│  JSON Schema:                                       │
│  ┌───────────────────────────────────────────────┐ │
│  │  (schema editor)                              │ │
│  └───────────────────────────────────────────────┘ │
│  [Templates: Element Info | Movie Review | Recipe]  │
├─────────────────────────────────────────────────────┤
│  [Send]                                             │
├─────────────────────────────────────────────────────┤
│  Response  (0.00s)                      [Copy] [✕] │
│  ┌───────────────────────────────────────────────┐ │
│  │  (response display, JSON highlighted)         │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Output Modes

### Free Text
- Standard chat completions request.
- Response displayed as plain text (newlines preserved).

### Structured JSON
- OpenAI `response_format: { type: "json_schema", json_schema: { … } }` parameter.
- User edits a JSON schema in a `<textarea>` or picks a built-in template.
- Response parsed and displayed with syntax highlighting (keys in blue, strings in green, numbers in orange).

---

## Example Prompts (pre-loaded chips)
1. "Explain quantum entanglement in one paragraph."
2. "Write a haiku about machine learning."
3. "List three pros and cons of remote work."
4. "Summarize the plot of Romeo and Juliet in two sentences."

---

## Schema Templates

### Element Info
```json
{
  "name": "element_info",
  "schema": {
    "type": "object",
    "properties": {
      "name":   { "type": "string" },
      "symbol": { "type": "string" },
      "atomic_number": { "type": "integer" },
      "fun_fact": { "type": "string" }
    },
    "required": ["name","symbol","atomic_number","fun_fact"],
    "additionalProperties": false
  }
}
```

### Movie Review
```json
{
  "name": "movie_review",
  "schema": {
    "type": "object",
    "properties": {
      "title":  { "type": "string" },
      "year":   { "type": "integer" },
      "rating": { "type": "number", "minimum": 0, "maximum": 10 },
      "summary": { "type": "string" }
    },
    "required": ["title","year","rating","summary"],
    "additionalProperties": false
  }
}
```

### Recipe
```json
{
  "name": "recipe",
  "schema": {
    "type": "object",
    "properties": {
      "dish":        { "type": "string" },
      "prep_minutes": { "type": "integer" },
      "ingredients": { "type": "array", "items": { "type": "string" } },
      "steps":       { "type": "array", "items": { "type": "string" } }
    },
    "required": ["dish","prep_minutes","ingredients","steps"],
    "additionalProperties": false
  }
}
```

---

## Error Handling

| Scenario | User-facing message |
|---|---|
| Empty API key | "Please enter your API key before sending." |
| Empty prompt | "Please enter a prompt." |
| Invalid JSON schema | "Schema is not valid JSON — please fix it before sending." |
| HTTP 401 | "Invalid API key. Double-check and try again." |
| HTTP 429 | "Rate limit reached. Wait a moment and try again." |
| HTTP 5xx | "The API returned a server error. Try again shortly." |
| Anthropic CORS block | Friendly educational banner (see below) |
| Network failure | "Network error — are you online?" |

---

## Anthropic CORS Banner
When the user selects Anthropic and clicks Send, the app detects the CORS failure and displays:

> **Why Anthropic doesn't work in the browser**
> Anthropic's API does not allow direct browser requests (CORS policy). This is intentional — it protects your API key from being exposed in client-side code. To use Claude, you would need a small backend server that forwards requests. OpenAI's API does allow browser calls, which is why the OpenAI panel works directly here.

---

## Stretch Goals (optional)
- Side-by-side provider comparison
- Response metrics panel (tokens, latency, cost estimate)
- Prompt library (save/load prompts to `localStorage`)
- Live JSON schema validator with error highlighting

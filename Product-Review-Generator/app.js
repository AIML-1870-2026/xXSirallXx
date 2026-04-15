// ── SYSTEM PROMPT ────────────────────────────────────────────────────────────
// ── TONE axis (1 = Heavily Critical → 6 = Enthusiastic) ──────────────────────
var TONE_LEVELS = [
  { label: 'Heavily Critical', rating: '1 star (or 1.5 at most)',
    focus: 'tear this product apart without mercy. Expose every flaw and failure in detail. Express outrage or disbelief. Make it absolutely clear no one should buy this.' },
  { label: 'Negative',         rating: '1–2 stars',
    focus: 'focus on the product\'s shortcomings and disappointments. Acknowledge any positives only reluctantly and briefly.' },
  { label: 'Critical',         rating: '2–3 stars',
    focus: 'scrutinize the product\'s flaws and missed opportunities. Be specific about what falls short and why it matters.' },
  { label: 'Balanced',         rating: 'whatever the product honestly deserves',
    focus: 'cover both strengths and weaknesses fairly and accurately.' },
  { label: 'Positive',         rating: '4–5 stars',
    focus: 'highlight the product\'s best features and benefits. Mention minor drawbacks briefly but do not dwell on them.' },
  { label: 'Enthusiastic',     rating: '4.5–5 stars',
    focus: 'express genuine excitement and passion. Use vivid language. Make the reader feel your enthusiasm and want to buy this immediately.' }
];

// ── STYLE axis (1 = Comedic → 5 = Technical) ─────────────────────────────────
var STYLE_LEVELS = [
  { label: 'Comedic',      voice: 'Write with humor, jokes, sarcasm, and wit throughout. Make it feel like a stand-up bit about the product. Use hyperbole and funny comparisons.' },
  { label: 'Casual',       voice: 'Write in a relaxed, conversational tone like you\'re recommending (or warning) a friend.' },
  { label: 'Neutral',      voice: 'Write in a clear, straightforward style — no strong personality, just honest information.' },
  { label: 'Professional', voice: 'Write in a polished, professional tone suitable for a consumer publication.' },
  { label: 'Technical',    voice: 'Write with technical precision. Reference specs, benchmarks, and industry standards where relevant.' }
];

// ── LENGTH axis (1 = Brief → 3 = Detailed) ───────────────────────────────────
var LENGTH_LEVELS = [
  { label: 'Brief',    instruction: 'Keep the review concise — 2 to 3 short paragraphs maximum.' },
  { label: 'Standard', instruction: '' },
  { label: 'Detailed', instruction: 'Make the review comprehensive, covering at least 5 distinct sections with depth.' }
];

function buildDefaultPrompt() {
  var toneIdx   = toneSlider   ? (parseInt(toneSlider.value)   - 1) : 3;
  var styleIdx  = styleSlider  ? (parseInt(styleSlider.value)  - 1) : 2;
  var lengthIdx = lengthSlider ? (parseInt(lengthSlider.value) - 1) : 1;

  var tone   = TONE_LEVELS[toneIdx];
  var style  = STYLE_LEVELS[styleIdx];
  var length = LENGTH_LEVELS[lengthIdx];

  var prompt =
    'You are a product reviewer. Your job is to ' + tone.focus + '\n\n' +
    style.voice + '\n\n' +
    'Give a rating of ' + tone.rating + '. Do not soften or adjust this rating — it must reflect the tone above.\n\n' +
    'Structure the review with markdown headings and bullet points. Include: an overview, pros, cons, your star rating, and a final recommendation.';

  if (length.instruction) prompt += '\n\n' + length.instruction;
  return prompt;
}

// ── STATE ─────────────────────────────────────────────────────────────────────
var apiKey = '';

// ── DOM REFS ──────────────────────────────────────────────────────────────────
var keyInput      = document.getElementById('api-key');
var keyStatus     = document.getElementById('key-status');
var modelSelect   = document.getElementById('model-select');
var toneSlider    = document.getElementById('tone-slider');
var toneCurrent   = document.getElementById('tone-current');
var styleSlider   = document.getElementById('style-slider');
var styleCurrent  = document.getElementById('style-current');
var lengthSlider  = document.getElementById('length-slider');
var lengthCurrent = document.getElementById('length-current');
var systemPrompt  = document.getElementById('system-prompt');
var resetPrompt   = document.getElementById('reset-prompt');
var productInput  = document.getElementById('product-input');
var generateBtn   = document.getElementById('generate-btn');
var loadingEl     = document.getElementById('loading');
var errorBox      = document.getElementById('error-box');
var metaBar       = document.getElementById('meta-bar');
var reviewOutput  = document.getElementById('review-output');
var emptyState    = document.getElementById('empty-state');
var metaModel     = document.getElementById('meta-model');
var metaTokens    = document.getElementById('meta-tokens');
var metaTime      = document.getElementById('meta-time');

// ── CUSTOMIZATION CONTROLS ────────────────────────────────────────────────────
function updateSliderLabels() {
  toneCurrent.textContent   = TONE_LEVELS[parseInt(toneSlider.value)     - 1].label;
  styleCurrent.textContent  = STYLE_LEVELS[parseInt(styleSlider.value)   - 1].label;
  lengthCurrent.textContent = LENGTH_LEVELS[parseInt(lengthSlider.value) - 1].label;
}

function onSliderChange() {
  updateSliderLabels();
  systemPrompt.value = buildDefaultPrompt();
}

toneSlider.addEventListener('input', onSliderChange);
styleSlider.addEventListener('input', onSliderChange);
lengthSlider.addEventListener('input', onSliderChange);

// Initialise on load
updateSliderLabels();
systemPrompt.value = buildDefaultPrompt();

// Reset prompt button
resetPrompt.addEventListener('click', function () {
  systemPrompt.value = buildDefaultPrompt();
});

// ── API KEY ───────────────────────────────────────────────────────────────────
keyInput.addEventListener('input', function () {
  apiKey = keyInput.value.trim();
  updateKeyStatus();
});

function updateKeyStatus() {
  if (apiKey) {
    keyStatus.textContent = 'Key loaded';
    keyStatus.classList.add('loaded');
  } else {
    keyStatus.textContent = 'Not loaded';
    keyStatus.classList.remove('loaded');
  }
}

document.getElementById('key-toggle').addEventListener('click', function () {
  var show = keyInput.type === 'password';
  keyInput.type = show ? 'text' : 'password';
  this.textContent = show ? '🙈' : '👁';
});

// ── .ENV FILE UPLOAD ──────────────────────────────────────────────────────────
document.getElementById('env-upload').addEventListener('change', function (e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (ev) {
    var lines = ev.target.result.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line || line.charAt(0) === '#' || line.indexOf('=') === -1) continue;
      var eq  = line.indexOf('=');
      var key = line.substring(0, eq).trim();
      var val = line.substring(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (/openai/i.test(key) && val.indexOf('sk-') === 0) {
        apiKey = val;
        keyInput.value = val;
        updateKeyStatus();
        break;
      }
    }
    // CSV fallback: key,value
    if (!apiKey) {
      for (var j = 0; j < lines.length; j++) {
        var parts = lines[j].split(',');
        if (parts.length >= 2) {
          var v = parts[1].trim();
          if (v.indexOf('sk-') === 0) {
            apiKey = v;
            keyInput.value = v;
            updateKeyStatus();
            break;
          }
        }
      }
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// ── GENERATE ──────────────────────────────────────────────────────────────────
generateBtn.addEventListener('click', generate);
productInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') generate();
});

function generate() {
  var product = productInput.value.trim();
  if (!product) {
    productInput.focus();
    return;
  }
  if (!apiKey) {
    showError('Please enter your OpenAI API key (or upload a .env file).');
    return;
  }

  var model  = modelSelect.value;
  var prompt = systemPrompt.value.trim() || buildDefaultPrompt();
  var t0     = Date.now();

  setLoading(true);
  hideError();
  hideResults();

  callOpenAI(apiKey, model, product, prompt)
    .then(function (data) {
      var elapsed = ((Date.now() - t0) / 1000).toFixed(2);
      renderReview(data, elapsed);
    })
    .catch(function (err) {
      showError(err.message || 'Request failed. Check your API key and try again.');
    })
    .then(function () {
      setLoading(false);
    });
}

// ── OPENAI API ────────────────────────────────────────────────────────────────
function callOpenAI(key, model, product, prompt) {
  var body = {
    model:    model,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user',   content: product }
    ]
  };

  return fetch('https://api.openai.com/v1/chat/completions', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + key
    },
    body: JSON.stringify(body)
  }).then(function (res) {
    return res.json().then(function (data) {
      if (!res.ok) {
        var msg = (data && data.error && data.error.message)
          ? data.error.message
          : 'OpenAI error ' + res.status;
        throw new Error(msg);
      }
      return {
        content: data.choices[0].message.content,
        tokens:  data.usage ? data.usage.total_tokens : null,
        model:   data.model || model
      };
    });
  });
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function renderReview(data, elapsed) {
  emptyState.style.display  = 'none';
  reviewOutput.innerHTML    = marked.parse(data.content);
  reviewOutput.classList.add('show');

  metaModel.textContent  = data.model;
  metaTokens.textContent = data.tokens !== null ? data.tokens + ' tokens' : '—';
  metaTime.textContent   = elapsed + 's';
  metaBar.classList.add('show');
}

function hideResults() {
  reviewOutput.classList.remove('show');
  reviewOutput.innerHTML = '';
  metaBar.classList.remove('show');
  emptyState.style.display = 'none';
}

// ── UI HELPERS ────────────────────────────────────────────────────────────────
function setLoading(on) {
  generateBtn.disabled = on;
  loadingEl.classList.toggle('show', on);
  if (on) emptyState.style.display = 'none';
}

function showError(msg) {
  errorBox.textContent = '⚠ ' + msg;
  errorBox.classList.add('show');
}
function hideError() {
  errorBox.classList.remove('show');
}

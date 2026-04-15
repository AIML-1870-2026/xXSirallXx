// ── SYSTEM PROMPT ────────────────────────────────────────────────────────────
var TONE_MAP = {
  balanced:          'detailed, balanced',
  positive:          'upbeat and positive',
  negative:          'negative and skeptical',
  critical:          'critical and analytical',
  'heavily-critical':'brutally and heavily critical',
  comedic:           'comedic and humorous',
  enthusiastic:      'enthusiastic and energetic',
  professional:      'professional and expert-level'
};

var LENGTH_MAP = {
  brief:    'Keep the review concise — 2 to 3 paragraphs maximum.',
  standard: '',
  detailed: 'Make the review comprehensive and thorough, covering at least 5 distinct sections.'
};

function buildDefaultPrompt() {
  var tone   = toneSelect   ? toneSelect.value   : 'balanced';
  var length = lengthSelect ? lengthSelect.value : 'standard';
  var prompt =
    'You are a helpful assistant that writes ' + TONE_MAP[tone] + ' product reviews. ' +
    'When given a product name, write a review that includes:\n' +
    '- A brief overview of the product\n' +
    '- Key pros and cons\n' +
    '- A rating out of 5 stars\n' +
    '- A final recommendation\n\n' +
    'Format your response in markdown with clear headings and bullet points.';
  if (LENGTH_MAP[length]) prompt += '\n\n' + LENGTH_MAP[length];
  return prompt;
}

// ── STATE ─────────────────────────────────────────────────────────────────────
var apiKey = '';

// ── DOM REFS ──────────────────────────────────────────────────────────────────
var keyInput      = document.getElementById('api-key');
var keyStatus     = document.getElementById('key-status');
var modelSelect   = document.getElementById('model-select');
var toneSelect    = document.getElementById('tone-select');
var lengthSelect  = document.getElementById('length-select');
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
// Initialise system prompt textarea on load
systemPrompt.value = buildDefaultPrompt();

// Rebuild prompt when tone or length changes (unless user has manually edited it)
function onPresetChange() {
  systemPrompt.value = buildDefaultPrompt();
}
toneSelect.addEventListener('change', onPresetChange);
lengthSelect.addEventListener('change', onPresetChange);

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

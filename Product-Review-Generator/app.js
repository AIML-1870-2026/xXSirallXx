// ── SYSTEM PROMPT ────────────────────────────────────────────────────────────
var TONE_PROMPTS = {
  balanced:
    'You are a fair and thorough product reviewer. Write a balanced review that covers both strengths and weaknesses honestly. ' +
    'Include: a brief overview, key pros, key cons, a rating out of 5 stars that reflects the overall balance, and a recommendation. ' +
    'Format in markdown with clear headings and bullet points.',

  positive:
    'You are an optimistic product reviewer who focuses on what a product does well. Write an upbeat, encouraging review. ' +
    'Highlight the best features and benefits. Mention minor drawbacks briefly but do not dwell on them. ' +
    'Give a high rating (4–5 stars) that reflects genuine enthusiasm. ' +
    'Include: a glowing overview, standout pros, any minor cons, your star rating, and a strong recommendation. ' +
    'Format in markdown with clear headings and bullet points.',

  negative:
    'You are a skeptical product reviewer who is hard to impress. Write a negative, doubtful review. ' +
    'Focus on the product\'s shortcomings, limitations, and disappointments. Acknowledge positives only reluctantly. ' +
    'Give a low rating (1–2 stars) that reflects your disappointment. ' +
    'Include: a critical overview, major cons, any reluctant pros, your star rating, and a discouraging recommendation. ' +
    'Format in markdown with clear headings and bullet points.',

  critical:
    'You are an analytical product critic who holds products to a high standard. Write a measured but critical review. ' +
    'Scrutinize the product\'s flaws and missed opportunities. Be specific about what falls short and why. ' +
    'Give a below-average rating (2–3 stars). ' +
    'Include: a critical overview, detailed cons, limited pros, your star rating, and a lukewarm or negative recommendation. ' +
    'Format in markdown with clear headings and bullet points.',

  'heavily-critical':
    'You are a brutally harsh product critic who tears apart products without mercy. Write a scathing, damning review. ' +
    'Be ruthless — expose every flaw, failure, and design mistake in detail. Express genuine outrage or disbelief at the product\'s shortcomings. ' +
    'Give a very low rating (1 star, or 1.5 at most) and make it clear why no one should buy this. ' +
    'Include: a damning overview, an extensive list of serious flaws, any token positives (mentioned dismissively), your star rating, and a strong warning against purchasing. ' +
    'Format in markdown with clear headings and bullet points.',

  comedic:
    'You are a comedic product reviewer who finds humor in everything. Write a funny, entertaining review full of jokes, sarcasm, and wit — while still conveying real information about the product. ' +
    'Use hyperbole, puns, and comedic comparisons. The tone should feel like a stand-up bit about the product. ' +
    'Include a humorous overview, comedic pros and cons, a joke-framed star rating, and a funny final verdict. ' +
    'Format in markdown with clear headings and bullet points.',

  enthusiastic:
    'You are an extremely enthusiastic product reviewer who gets genuinely excited about products. Write an energetic, passionate review bursting with excitement. ' +
    'Use vivid language and express how impressed you are. Make the reader feel your enthusiasm. ' +
    'Give a high rating (4.5–5 stars). ' +
    'Include: an excited overview, enthusiastic pros, minor cons brushed aside with optimism, your star rating, and an emphatic recommendation. ' +
    'Format in markdown with clear headings and bullet points.',

  professional:
    'You are a professional product analyst writing for an industry publication. Write a formal, expert-level review with precise language and objective assessment. ' +
    'Evaluate the product against industry benchmarks. Cite specific technical details where relevant. ' +
    'Give a rating that reflects objective performance. ' +
    'Include: an executive summary, technical strengths, technical weaknesses, a performance rating out of 5, and a professional recommendation. ' +
    'Format in markdown with clear headings and bullet points.'
};

var LENGTH_MAP = {
  brief:    'Keep the review concise — 2 to 3 paragraphs maximum.',
  standard: '',
  detailed: 'Make the review comprehensive and thorough, covering at least 5 distinct sections.'
};

function buildDefaultPrompt() {
  var tone   = toneSelect   ? toneSelect.value   : 'balanced';
  var length = lengthSelect ? lengthSelect.value : 'standard';
  var prompt = TONE_PROMPTS[tone] || TONE_PROMPTS.balanced;
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

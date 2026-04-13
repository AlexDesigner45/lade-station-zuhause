/* ==========================================================================
   Quiz Engine v2 — Datengetrieben mit Hard-Constraints + Soft-Weights
   --------------------------------------------------------------------------
   Design:
   - Jede Antwort-Option hat "weights" (additiv, beeinflusst Score)
   - Optional "requires": {dimension: minScore} = Hard-Filter
   - Fallback: Wenn <3 Produkte alle Constraints erfüllen, zeigen wir die
     "nächstbesten" mit transparenter Markierung, welche Kriterien fehlen
   - Icons werden inline als SVG generiert (keine externen Assets)
   ========================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-quiz]');
  if (!root) return;

  var ICONS = buildIcons();

  var state = {
    config: null,
    step: 'intro',          // 'intro' | number | 'result'
    answers: {},            // questionId -> optionIndex
    scores: {},             // dimension -> cumulative soft weight
    requires: {}            // dimension -> highest required value
  };

  // --- Config laden: 1) inline <script id="quiz-config">, 2) fetch ----------
  loadConfig()
    .then(function (cfg) {
      state.config = cfg;
      render();
    })
    .catch(function (err) {
      root.innerHTML = '<div style="padding:48px;text-align:center;color:#64748b;">Quiz konnte nicht geladen werden.</div>';
      console.error('Quiz config error:', err);
    });

  function loadConfig() {
    // Primär: inline <script type="application/json" id="quiz-config">
    var inlineEl = document.getElementById('quiz-config');
    if (inlineEl && inlineEl.textContent) {
      try {
        return Promise.resolve(JSON.parse(inlineEl.textContent));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    // Fallback: fetch (funktioniert nur mit HTTP/HTTPS, nicht bei file://)
    var url = root.getAttribute('data-quiz-url') || './quiz-config.json';
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  // =========================================================================
  // RENDER — Orchestriert Intro, Fragen, Result
  // =========================================================================
  function render() {
    var cfg = state.config;
    var total = cfg.questions.length;
    var progress = 0;
    var headerEyebrow = 'Interaktives Quiz';
    var headerTitle = cfg.intro.title;
    var headerSub = cfg.intro.sub;

    if (state.step === 'intro') {
      progress = 0;
    } else if (state.step === 'result') {
      progress = 100;
      headerEyebrow = 'Deine Empfehlung';
      headerTitle = cfg.result.title;
      headerSub = cfg.result.sub;
    } else {
      var idx = state.step;
      var q = cfg.questions[idx];
      var sectionName = extractSection(q.meta);
      progress = Math.round(((idx + 1) / total) * 100);
      headerEyebrow = 'Frage ' + (idx + 1) + ' von ' + total + (sectionName ? ' · ' + sectionName : '');
      headerTitle = 'Persönlicher Produkt-Finder';
      headerSub = 'Jede Antwort beeinflusst, welche Modelle dir am Ende empfohlen werden.';
    }

    root.innerHTML =
      '<div class="lz-quiz__header">' +
        '<span class="lz-quiz__eyebrow">' + escape(headerEyebrow) + '</span>' +
        '<h2 class="lz-quiz__title">' + escape(headerTitle) + '</h2>' +
        '<p class="lz-quiz__sub">' + escape(headerSub) + '</p>' +
      '</div>' +
      '<div class="lz-quiz__progress"><div class="lz-quiz__progress-fill" style="width:' + progress + '%"></div></div>' +
      '<div class="lz-quiz__body">' +
        (state.step === 'intro'
          ? renderIntro()
          : state.step === 'result'
            ? renderResult()
            : renderQuestion(state.step)) +
      '</div>';

    attachHandlers();
  }

  function extractSection(meta) {
    // "Frage 5 von 22 · Abschnitt 2 — Besonderheiten"
    var m = meta && meta.match(/Abschnitt\s+\d+\s*[—-]\s*([^·]+)$/);
    return m ? m[1].trim() : '';
  }

  // =========================================================================
  // INTRO SCREEN
  // =========================================================================
  function renderIntro() {
    var intro = state.config.intro;
    var stats = intro.stats.map(function (s) {
      return '<div class="lz-quiz__intro-stat"><strong>' + escape(s.value) + '</strong>' + escape(s.label) + '</div>';
    }).join('');

    return '<div class="lz-quiz__step lz-quiz__step--active"><div class="lz-quiz__intro">' +
             '<div class="lz-quiz__intro-icon">' + ICONS['sparkles'] + '</div>' +
             '<h3 class="lz-quiz__intro-title">' + escape(intro.title) + '</h3>' +
             '<p class="lz-quiz__intro-sub">' + escape(intro.sub) + '</p>' +
             '<div class="lz-quiz__intro-stats">' + stats + '</div>' +
             '<button class="lz-btn lz-btn--primary lz-btn--lg" data-action="start">' + escape(intro.cta) + '</button>' +
           '</div></div>';
  }

  // =========================================================================
  // FRAGE
  // =========================================================================
  function renderQuestion(i) {
    var q = state.config.questions[i];
    var cols = q.columns || 4;
    var opts = q.options.map(function (opt, idx) {
      var icon = ICONS[opt.icon] || ICONS['dot'];
      return '<button class="lz-quiz__option" data-action="answer" data-index="' + idx + '">' +
               '<div class="lz-quiz__option-icon">' + icon + '</div>' +
               '<div class="lz-quiz__option-label">' + escape(opt.label) + '</div>' +
               (opt.desc ? '<div class="lz-quiz__option-desc">' + escape(opt.desc) + '</div>' : '') +
             '</button>';
    }).join('');

    var back = i > 0
      ? '<button class="lz-btn lz-btn--ghost lz-btn--sm" data-action="back">&larr; Zurück</button>'
      : '<button class="lz-btn lz-btn--ghost lz-btn--sm" data-action="restart">&larr; Abbrechen</button>';

    return '<div class="lz-quiz__step lz-quiz__step--active">' +
             '<div class="lz-quiz__step-meta">' + escape(q.meta) + '</div>' +
             '<h3 class="lz-quiz__question">' + escape(q.text) + '</h3>' +
             '<div class="lz-quiz__options lz-quiz__options--' + cols + '">' + opts + '</div>' +
             '<div class="lz-quiz__nav">' + back + '<span></span></div>' +
           '</div>';
  }

  // =========================================================================
  // RESULT — Hard-Constraints zuerst, dann Soft-Scoring
  // =========================================================================
  function renderResult() {
    var cfg = state.config;
    collectScoresAndRequires();

    // --- 1) Hard-Constraint-Filterung -------------------------------------
    var matchingProducts = [];
    var nonMatchingProducts = [];

    cfg.products.forEach(function (p) {
      var missing = [];
      Object.keys(state.requires).forEach(function (dim) {
        var needed = state.requires[dim];
        var has = p.scores[dim] || 0;
        if (has < needed) {
          missing.push(dim);
        }
      });

      if (missing.length === 0) {
        matchingProducts.push({ product: p, missing: [] });
      } else {
        nonMatchingProducts.push({ product: p, missing: missing });
      }
    });

    // --- 2) Soft-Scoring -------------------------------------------------
    var scoredMatching = matchingProducts.map(function (entry) {
      return computeScore(entry);
    }).sort(function (a, b) { return b.score - a.score; });

    var scoredNonMatching = nonMatchingProducts.map(function (entry) {
      return computeScore(entry);
    }).sort(function (a, b) {
      // Erst: weniger fehlende Constraints
      if (a.entry.missing.length !== b.entry.missing.length) {
        return a.entry.missing.length - b.entry.missing.length;
      }
      // Dann: höherer Score
      return b.score - a.score;
    });

    // --- 3) Top 3 zusammenstellen ----------------------------------------
    var top;
    var isFallback = false;
    if (scoredMatching.length >= 3) {
      top = scoredMatching.slice(0, 3);
    } else {
      isFallback = scoredMatching.length < 3;
      // Mit nicht-matchenden Produkten auffüllen
      top = scoredMatching.concat(scoredNonMatching).slice(0, 3);
    }

    // --- 4) Render -------------------------------------------------------
    var title = isFallback ? cfg.result.fallbackTitle : 'Das passt zu dir.';
    var sub = isFallback ? cfg.result.fallbackSub : cfg.result.sub;

    var items = top.map(function (entry, i) {
      return renderResultItem(entry, i);
    }).join('');

    var constraintSummary = renderConstraintSummary();

    return '<div class="lz-quiz__step lz-quiz__step--active">' +
             '<h3 class="lz-quiz__result-title">' + escape(title) + '</h3>' +
             '<p class="lz-quiz__result-sub">' + escape(sub) + '</p>' +
             constraintSummary +
             '<div class="lz-quiz__result-list">' + items + '</div>' +
             '<div class="lz-quiz__nav">' +
               '<button class="lz-btn lz-btn--ghost lz-btn--sm" data-action="restart">&#x21BB; Quiz neu starten</button>' +
               '<a href="#vergleich" class="lz-btn lz-btn--secondary lz-btn--sm">Alle Wallboxen vergleichen</a>' +
             '</div>' +
           '</div>';
  }

  function renderResultItem(entry, i) {
    var cfg = state.config;
    var p = entry.entry.product;
    var missing = entry.entry.missing;
    var isTop = i === 0 && missing.length === 0;
    var topClass = isTop ? ' lz-quiz__result-item--top' : '';
    var limitedClass = missing.length > 0 ? ' lz-quiz__result-item--limited' : '';
    var rank = '#' + (i + 1);

    // --- Gründe (Top-3 stärkste Beiträge) ---
    var reasons = entry.contributions
      .filter(function (c) { return c.contrib > 0; })
      .sort(function (a, b) { return b.contrib - a.contrib; })
      .slice(0, 3)
      .map(function (c) { return cfg.reasons[c.dim] || c.dim; });

    var reasonLine = reasons.length > 0
      ? 'Empfohlen wegen: ' + reasons.join(' · ')
      : 'Solider Allrounder';

    // --- Fehlende Constraints anzeigen ---
    var missingLine = '';
    if (missing.length > 0) {
      var missingLabels = missing.map(function (dim) {
        return cfg.requireLabels[dim] || dim;
      });
      missingLine =
        '<div class="lz-quiz__result-missing">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>' +
          ' Erfüllt nicht: ' + escape(missingLabels.join(', ')) +
        '</div>';
    }

    return '<div class="lz-quiz__result-item' + topClass + limitedClass + '">' +
             '<div class="lz-quiz__result-rank">' + rank + '</div>' +
             '<div class="lz-quiz__result-body">' +
               '<div class="lz-quiz__result-name">' + escape(p.brand + ' ' + p.name) + '</div>' +
               '<div class="lz-quiz__result-reason">' + escape(reasonLine) + '</div>' +
               missingLine +
             '</div>' +
             '<a href="' + escape(p.link || '#vergleich') + '" class="lz-btn ' + (isTop ? 'lz-btn--primary' : 'lz-btn--secondary') + ' lz-btn--sm" ' + (p.link && p.link.startsWith('http') ? 'target="_blank" rel="nofollow sponsored noopener"' : '') + '>Details</a>' +
           '</div>';
  }

  function renderConstraintSummary() {
    var cfg = state.config;
    var keys = Object.keys(state.requires);
    if (keys.length === 0) return '';

    var items = keys.map(function (dim) {
      return '<span class="lz-quiz__constraint">' + escape(cfg.requireLabels[dim] || dim) + '</span>';
    }).join('');

    return '<div class="lz-quiz__constraints">' +
             '<span class="lz-quiz__constraints-label">Deine Deal-Breaker:</span>' +
             items +
           '</div>';
  }

  // =========================================================================
  // SCORING
  // =========================================================================
  function computeScore(entry) {
    var p = entry.product;
    var score = 0;
    var contributions = [];
    Object.keys(state.scores).forEach(function (dim) {
      var w = state.scores[dim];
      var s = (p.scores[dim] || 0);
      var contrib = w * s;
      score += contrib;
      if (contrib !== 0) {
        contributions.push({ dim: dim, contrib: contrib });
      }
    });
    return { entry: entry, score: score, contributions: contributions };
  }

  function collectScoresAndRequires() {
    state.scores = {};
    state.requires = {};

    state.config.questions.forEach(function (q) {
      var answeredIdx = state.answers[q.id];
      if (answeredIdx == null) return;
      var opt = q.options[answeredIdx];

      // Soft weights akkumulieren
      if (opt.weights) {
        Object.keys(opt.weights).forEach(function (dim) {
          state.scores[dim] = (state.scores[dim] || 0) + opt.weights[dim];
        });
      }

      // Hard requires: höchsten Wert pro Dimension behalten
      if (opt.requires) {
        Object.keys(opt.requires).forEach(function (dim) {
          var needed = opt.requires[dim];
          if (needed > (state.requires[dim] || 0)) {
            state.requires[dim] = needed;
          }
        });
      }
    });
  }

  // =========================================================================
  // EVENTS
  // =========================================================================
  function attachHandlers() {
    root.querySelectorAll('[data-action]').forEach(function (el) {
      el.addEventListener('click', function () {
        var action = el.getAttribute('data-action');
        if (action === 'start') {
          state.step = 0;
          render();
          scrollIntoQuiz();
        } else if (action === 'answer') {
          var idx = parseInt(el.getAttribute('data-index'), 10);
          var q = state.config.questions[state.step];
          state.answers[q.id] = idx;
          if (state.step + 1 >= state.config.questions.length) {
            state.step = 'result';
          } else {
            state.step = state.step + 1;
          }
          render();
          scrollIntoQuiz();
        } else if (action === 'back') {
          if (typeof state.step === 'number' && state.step > 0) {
            state.step = state.step - 1;
            render();
          }
        } else if (action === 'restart') {
          state.step = 'intro';
          state.answers = {};
          state.scores = {};
          state.requires = {};
          render();
        }
      });
    });
  }

  function scrollIntoQuiz() {
    var rect = root.getBoundingClientRect();
    if (rect.top < 0 || rect.top > window.innerHeight - 200) {
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // =========================================================================
  // UTILITIES
  // =========================================================================
  function escape(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // =========================================================================
  // ICONS — SVG inline (currentColor für Theming)
  // =========================================================================
  function buildIcons() {
    var s = 'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"';
    var svg = function (d) { return '<svg viewBox="0 0 24 24" ' + s + '>' + d + '</svg>'; };

    return {
      'sparkles': svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'),
      'dot':      svg('<circle cx="12" cy="12" r="3"/>'),

      // Wohnung (Größe)
      'home-sm':  svg('<path d="M5 11l7-6 7 6v9H5z"/><path d="M10 20v-5h4v5"/>'),
      'home-md':  svg('<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>'),
      'home-lg':  svg('<path d="M3 11l9-8 9 8v9H3z"/><path d="M9 20v-6h6v6"/><path d="M7 11h10"/>'),
      'home-xl':  svg('<path d="M3 12l9-9 9 9v8H3z"/><path d="M8 20v-7h8v7"/><path d="M3 20h18"/>'),

      // Etagen
      'floors-1': svg('<rect x="4" y="14" width="16" height="6" rx="1"/>'),
      'floors-2': svg('<rect x="4" y="14" width="16" height="6" rx="1"/><rect x="6" y="8" width="12" height="5" rx="1"/>'),
      'floors-3': svg('<rect x="4" y="15" width="16" height="5" rx="1"/><rect x="6" y="9" width="12" height="5" rx="1"/><rect x="8" y="3" width="8" height="5" rx="1"/>'),

      // Schwellen
      'threshold-no':  svg('<path d="M3 18h18"/>'),
      'threshold-mid': svg('<path d="M3 18h7l2-3h0l2 3h7"/>'),
      'threshold-hi':  svg('<path d="M3 18h6l3-7h0l3 7h6"/>'),

      // Böden
      'floor-hard':         svg('<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M9 6v12M15 6v12"/>'),
      'floor-mostly-hard':  svg('<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M9 6v12"/><path d="M14 9v6M17 9v6M14 9h3M14 15h3" stroke-width="1.2"/>'),
      'floor-mix':          svg('<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M12 6v12"/><path d="M15 9v6M18 9v6" stroke-width="1.2"/>'),
      'floor-carpet':       svg('<rect x="3" y="7" width="18" height="11" rx="1"/><path d="M5 10v5M8 10v5M11 10v5M14 10v5M17 10v5M20 10v5" stroke-width="1.2"/>'),

      // Hochflor
      'pile-no':   svg('<rect x="3" y="14" width="18" height="5" rx="1"/>'),
      'pile-some': svg('<rect x="3" y="13" width="18" height="6" rx="1"/><path d="M7 13v-3M11 13v-3M15 13v-3"/>'),
      'pile-many': svg('<rect x="3" y="12" width="18" height="7" rx="1"/><path d="M5 12V7M8 12V7M11 12V7M14 12V7M17 12V7M20 12V7"/>'),

      // Haustiere
      'pet-no':   svg('<circle cx="12" cy="12" r="9"/><path d="M7 17l10-10"/>'),
      'pet-cat':  svg('<path d="M5 10l2-5 3 4h4l3-4 2 5v7a3 3 0 01-3 3H8a3 3 0 01-3-3z"/><circle cx="10" cy="13" r=".6"/><circle cx="14" cy="13" r=".6"/>'),
      'pet-dog':  svg('<path d="M7 7l-2 3v8a2 2 0 002 2h10a2 2 0 002-2v-8l-2-3h-2l-1 2h-4l-1-2z"/><circle cx="10" cy="13" r=".6"/><circle cx="14" cy="13" r=".6"/>'),
      'pet-both': svg('<path d="M4 12a4 4 0 014-4h2l1-2h2l1 2h2a4 4 0 014 4v5a3 3 0 01-3 3H7a3 3 0 01-3-3z"/><circle cx="9" cy="13" r=".6"/><circle cx="15" cy="13" r=".6"/>'),

      // Hindernisse
      'obst-low':  svg('<rect x="4" y="14" width="16" height="5" rx="1"/><circle cx="18" cy="11" r="1"/>'),
      'obst-mid':  svg('<rect x="4" y="14" width="16" height="5" rx="1"/><path d="M6 14l2-3M10 14l1-2M14 14v-3"/><circle cx="17" cy="11" r="1"/>'),
      'obst-high': svg('<rect x="4" y="15" width="16" height="4" rx="1"/><path d="M6 15l1-4M9 15l3-5M15 15v-5M18 15l-1-4"/><circle cx="7" cy="10" r="1"/><circle cx="16" cy="10" r="1"/>'),

      // Frequenz
      'freq-daily': svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
      'freq-week':  svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
      'freq-adhoc': svg('<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>'),

      // Saugkraft
      'power-low':  svg('<circle cx="12" cy="12" r="3"/>'),
      'power-mid':  svg('<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>'),
      'power-max':  svg('<path d="M13 2L5 14h6l-1 8 8-12h-6z" fill="currentColor" fill-opacity="0.2"/><path d="M13 2L5 14h6l-1 8 8-12h-6z"/>'),

      // Wischen
      'mop-off':     svg('<path d="M12 4v10M8 14h8l-1 5H9z"/><path d="M5 5l14 14"/>'),
      'mop-mid':     svg('<path d="M12 4v10M8 14h8l-1 5H9z"/>'),
      'mop-on':      svg('<path d="M12 4v10M8 14h8l-1 5H9z"/><path d="M6 8l2-2M16 6l2 2"/>'),
      'mop-premium': svg('<path d="M12 4v10M8 14h8l-1 5H9z"/><path d="M5 7l2-2M17 5l2 2M4 11l2 0M18 11l2 0"/>'),

      // Lautstärke
      'sound-loud': svg('<path d="M5 9h4l4-4v14l-4-4H5z"/><path d="M16 8a5 5 0 010 8M19 5a9 9 0 010 14"/>'),
      'sound-mid':  svg('<path d="M5 9h4l4-4v14l-4-4H5z"/><path d="M16 9a4 4 0 010 6"/>'),
      'sound-low':  svg('<path d="M5 9h4l4-4v14l-4-4H5z"/><path d="M17 8l4 8M21 8l-4 8"/>'),

      // Station
      'station-off': svg('<rect x="6" y="7" width="12" height="13" rx="1"/><path d="M10 12h4"/>'),
      'station-mid': svg('<rect x="5" y="6" width="14" height="14" rx="1"/><path d="M9 12h6M9 15h6"/>'),
      'station-on':  svg('<rect x="4" y="5" width="16" height="15" rx="1"/><path d="M8 10h8M8 14h8M8 17h5"/><circle cx="17" cy="17" r="1"/>'),

      // Wartung
      'care-low': svg('<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>'),
      'care-mid': svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/>'),
      'care-ok':  svg('<circle cx="12" cy="12" r="9"/><path d="M8 13l2-2 2 2 4-4"/>'),

      // Höhe
      'height-any': svg('<path d="M6 6v12M6 6h12M6 18h12"/><path d="M14 10v4"/>'),
      'height-low': svg('<path d="M4 18h16"/><rect x="7" y="14" width="10" height="4" rx="1"/><path d="M4 6h16"/>'),
      'height-xs':  svg('<path d="M4 19h16"/><rect x="8" y="16" width="8" height="3" rx="1"/><path d="M4 5h16"/>'),

      // App
      'app-off': svg('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M12 17h.01"/>'),
      'app-mid': svg('<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 17h6M10 8h4M10 11h4"/>'),
      'app-on':  svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 17h8M8 8h8M8 11h8M8 14h8"/>'),

      // Assistant
      'voice-off':    svg('<circle cx="12" cy="12" r="9"/><path d="M7 17l10-10"/>'),
      'voice-alexa':  svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>'),
      'voice-google': svg('<path d="M21 12a9 9 0 11-3.5-7.1L12 12h9z"/>'),
      'voice-apple':  svg('<path d="M12 4c1.5 0 3 1 3 3-2 0-3-1-3-3zM7 10c2-2 5-2 7 0 2-2 5-2 7 0v6c-3 4-11 4-14 0z"/>'),

      // Privacy
      'priv-any':   svg('<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>'),
      'priv-nocam': svg('<rect x="3" y="7" width="14" height="10" rx="1"/><path d="M17 10l4-2v8l-4-2"/><path d="M3 3l18 18"/>'),
      'priv-local': svg('<path d="M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7z"/><path d="M9 12l2 2 4-4"/>'),

      // Budget
      'euro-sm': svg('<circle cx="12" cy="12" r="8"/><path d="M16 9a4 4 0 00-6 0M16 15a4 4 0 01-6 0M8 11h6M8 13h6"/>'),
      'euro-md': svg('<circle cx="12" cy="12" r="9"/><path d="M17 8a5 5 0 00-8 0M17 16a5 5 0 01-8 0M7 11h7M7 13h7"/>'),
      'euro-lg': svg('<circle cx="12" cy="12" r="10"/><path d="M17 7a6 6 0 00-9 0M17 17a6 6 0 01-9 0M6 11h8M6 13h8"/>'),
      'euro-xl': svg('<circle cx="12" cy="12" r="10"/><path d="M17 7a6 6 0 00-9 0M17 17a6 6 0 01-9 0M6 11h8M6 13h8"/><circle cx="12" cy="12" r="10" stroke-dasharray="2 2"/>'),

      // Marke
      'brand-any':     svg('<path d="M3 12h18M12 3v18"/><circle cx="12" cy="12" r="9"/>'),
      'brand-china':   svg('<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M7 10l1-2 1 2 2 0-1.5 1.5.5 2L8 12l-2 1.5.5-2L5 10z"/>'),
      'brand-western': svg('<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 8h18M3 12h18M3 16h18"/>'),

      // Priorität
      'prio-power': svg('<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>'),
      'prio-wipe':  svg('<path d="M12 4v10M8 14h8l-1 5H9z"/><path d="M6 8l2-2M16 6l2 2"/>'),
      'prio-nav':   svg('<circle cx="12" cy="12" r="9"/><path d="M16 8l-3 6-6 3 3-6z"/>'),
      'prio-care':  svg('<path d="M12 21s-8-5-8-11a5 5 0 019-3 5 5 0 019 3c0 6-8 11-8 11z"/>'),

      // Design
      'design-any':   svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>'),
      'design-white': svg('<circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity="0.05"/>'),
      'design-black': svg('<circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity="0.3"/>'),

      // Deal-Breaker
      'must-app':     svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 17h8M8 8h8M8 11h8"/>'),
      'must-station': svg('<rect x="4" y="5" width="16" height="15" rx="1"/><path d="M8 10h8M8 14h8"/>'),
      'must-nav':     svg('<circle cx="12" cy="12" r="9"/><path d="M16 8l-3 6-6 3 3-6z"/>'),
      'must-none':    svg('<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>')
    };
  }
})();

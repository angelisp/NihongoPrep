/* ==========================================================================
   Vocabulary Directory & 3D SRS Flashcards (語彙)
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.vocab = (function () {
  const POS_META = {
    all: { label: 'All Words', badge: '' },
    noun: { label: 'Nouns (名詞)', badge: 'Noun' },
    'i-adj': { label: 'い-Adj', badge: 'い-Adj' },
    'na-adj': { label: 'な-Adj', badge: 'な-Adj' },
    verb: { label: 'Verbs (動詞)', badge: 'Verb' },
    adverb: { label: 'Adverbs & Expr.', badge: 'Adv / Expr' },
    counters: { label: '🔢 Counters', badge: '' },
    dates: { label: '📅 Dates & Days', badge: '' },
    katakana: { label: 'ア Katakana', badge: '' },
    starred: { label: '★ Starred', badge: '' }
  };

  function matchesFilter(word, filterKey, starred) {
    if (filterKey === 'all') return true;
    if (filterKey === 'starred') return starred.includes(word.id);
    if (filterKey === 'counters') return word.topic === 'Counters & Numbers';
    if (filterKey === 'dates') return word.topic === 'Dates & Calendar' || word.topic === 'Time & Calendar';
    if (filterKey === 'katakana') return word.topic === 'Katakana Loanwords';
    if (filterKey === 'adj') return word.pos === 'i-adj' || word.pos === 'na-adj';
    return word.pos === filterKey;
  }

  let viewState = {
    subTab: 'directory', // 'directory' | 'flashcards'
    posFilter: 'all',
    statusFilter: 'all', // 'all' | 'new' | 'learning' | 'mastered'
    search: '',
    // Flashcard session
    deckFilter: 'due',   // 'due' | 'all' | 'noun' | 'adj' | 'verb' | 'starred'
    direction: 'jp-en',  // 'jp-en' | 'en-jp'
    queue: [],
    currentIndex: 0,
    flipped: false,
    sessionStats: { reviewed: 0, goodOrEasy: 0 }
  };

  let keyHandler = null;

  function renderKanjiDisplay(word) {
    if (word.kanji === word.kana) return word.kana;
    return `<ruby>${word.kanji}<rt>${word.kana}</rt></ruby>`;
  }

  function buildQueue(deckFilter) {
    const store = window.NihongoStore;
    const all = window.NihongoData.vocab;
    const starred = store.getState().starredVocab;

    let pool = [];
    if (deckFilter === 'due') {
      const { dueReview, fresh } = store.getDueVocabIds();
      const ids = dueReview.concat(fresh.slice(0, 15));
      pool = ids.map(id => all.find(w => w.id === id)).filter(Boolean);
      if (pool.length === 0) pool = all.slice(0, 15);
    } else if (deckFilter === 'all') {
      pool = all.slice();
    } else {
      pool = all.filter(w => matchesFilter(w, deckFilter, starred));
    }

    // Shuffle copy (except keep due reviews first if deckFilter==='due')
    if (deckFilter !== 'due') {
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }
    return pool.slice(0, 20);
  }

  function startSession(deckFilter) {
    viewState.deckFilter = deckFilter || viewState.deckFilter;
    viewState.queue = buildQueue(viewState.deckFilter);
    viewState.currentIndex = 0;
    viewState.flipped = false;
    viewState.sessionStats = { reviewed: 0, goodOrEasy: 0 };
  }

  function detachKeys() {
    if (keyHandler) {
      document.removeEventListener('keydown', keyHandler);
      keyHandler = null;
    }
  }

  function render(container, opts) {
    detachKeys();
    if (opts && opts.subTab) {
      viewState.subTab = opts.subTab;
      if (opts.subTab === 'flashcards' && viewState.queue.length === 0) {
        startSession('due');
      }
    }

    const store = window.NihongoStore;
    const { dueReview } = store.getDueVocabIds();

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Vocabulary Studio · 語彙</h2>
          <p>${window.NihongoData.vocab.length} curated JLPT N5 words across Nouns, い/な-Adjectives, Verbs &amp; Adverbs.</p>
        </div>
        <div class="segmented-tabs" role="tablist">
          <button class="segmented-tab ${viewState.subTab === 'directory' ? 'active' : ''}" data-subtab="directory">
            📖 Browse &amp; Search
          </button>
          <button class="segmented-tab ${viewState.subTab === 'flashcards' ? 'active' : ''}" data-subtab="flashcards">
            🃏 SRS Flashcards ${dueReview.length > 0 ? `(${dueReview.length})` : ''}
          </button>
        </div>
      </div>

      <div id="vocab-subview"></div>
    `;

    container.querySelectorAll('[data-subtab]').forEach(btn => {
      btn.addEventListener('click', () => {
        viewState.subTab = btn.dataset.subtab;
        if (viewState.subTab === 'flashcards' && viewState.queue.length === 0) {
          startSession(viewState.deckFilter);
        }
        render(container);
      });
    });

    const subEl = container.querySelector('#vocab-subview');
    if (viewState.subTab === 'directory') {
      renderDirectory(subEl);
    } else {
      renderFlashcards(subEl, container);
    }
  }

  function renderDirectory(subEl) {
    const store = window.NihongoStore;
    const starred = store.getState().starredVocab;
    const q = viewState.search.trim().toLowerCase();

    const filtered = window.NihongoData.vocab.filter(word => {
      if (!matchesFilter(word, viewState.posFilter, starred)) return false;

      const st = store.getVocabStatus(word.id);
      if (viewState.statusFilter !== 'all' && st !== viewState.statusFilter) {
        return false;
      }

      if (q) {
        const hay = `${word.kanji} ${word.kana} ${word.romaji} ${word.meaning} ${word.topic}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const statusBadge = st => {
      if (st === 'mastered') return '<span class="badge badge-success">✓ Mastered</span>';
      if (st === 'learning') return '<span class="badge badge-warning">● Learning</span>';
      return '<span class="badge badge-neutral">New</span>';
    };

    subEl.innerHTML = `
      <div class="filter-bar">
        <input
          type="search"
          class="search-input"
          id="vocab-search-input"
          placeholder="Search kanji, kana, romaji, or English meaning…"
          value="${viewState.search.replace(/"/g, '&quot;')}"
        />
        <div class="chip-row">
          ${['all', 'new', 'learning', 'mastered'].map(st => `
            <button class="chip ${viewState.statusFilter === st ? 'active' : ''}" data-status-filter="${st}">
              ${st === 'all' ? 'All Status' : st[0].toUpperCase() + st.slice(1)}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="chip-row scroll-row" style="margin-bottom: 18px;">
        ${Object.keys(POS_META).map(key => `
          <button class="chip ${viewState.posFilter === key ? 'active' : ''}" data-pos-filter="${key}">
            ${POS_META[key].label}
          </button>
        `).join('')}
      </div>

      <p class="muted small" style="margin: 0 0 14px;">Showing <strong>${filtered.length}</strong> word${filtered.length === 1 ? '' : 's'}</p>

      ${filtered.length === 0 ? `
        <div class="card" style="text-align:center; padding: 36px;">
          <p class="muted">No vocabulary words match your current filter.</p>
          <button class="btn btn-secondary btn-sm" id="clear-vocab-filters">Reset Filters</button>
        </div>
      ` : `
        <div class="vocab-grid">
          ${filtered.map(w => {
            const st = store.getVocabStatus(w.id);
            const isStarred = starred.includes(w.id);
            return `
              <article class="card vocab-card">
                <div class="vocab-card-top">
                  <div>
                    <div class="vocab-jp-main jp-text">${renderKanjiDisplay(w)}</div>
                    <div class="romaji">${w.romaji}</div>
                  </div>
                  <div style="display:flex; gap:4px; align-items:center;">
                    <button class="audio-btn" data-speak="${w.kana}" title="Pronounce word">🔊</button>
                    <button class="star-btn ${isStarred ? 'starred' : ''}" data-star="${w.id}" title="${isStarred ? 'Remove bookmark' : 'Bookmark word'}">
                      ${isStarred ? '★' : '☆'}
                    </button>
                  </div>
                </div>

                <div class="vocab-meaning">${w.meaning}</div>

                <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
                  <span class="badge badge-${w.pos}">${POS_META[w.pos].badge}</span>
                  <span class="badge badge-neutral">${w.topic}</span>
                </div>

                ${w.notes ? `<div class="vocab-notes">${w.notes}</div>` : ''}

                <div class="vocab-example">
                  <div style="display:flex; justify-content:space-between; gap:8px; align-items:flex-start;">
                    <div>
                      <div class="vocab-example-jp jp-text">${w.exampleJp}</div>
                      <div class="romaji" style="font-size:0.78rem;">${w.exampleRomaji}</div>
                      <div class="muted small">${w.exampleEn}</div>
                    </div>
                    <button class="audio-btn" style="width:28px; height:28px; font-size:0.78rem;" data-speak="${w.exampleKana}" title="Hear example sentence">🔊</button>
                  </div>
                </div>

                <div class="vocab-card-footer">
                  ${statusBadge(st)}
                  <button class="btn btn-xs btn-ghost" data-quick-master="${w.id}">
                    ${st === 'mastered' ? 'Review again' : 'Mark mastered ✓'}
                  </button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      `}
    `;

    // Search listener (preserve focus/caret)
    const searchInput = subEl.querySelector('#vocab-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        viewState.search = e.target.value;
        const pos = e.target.selectionStart;
        renderDirectory(subEl);
        const nextInput = subEl.querySelector('#vocab-search-input');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(pos, pos);
        }
      });
    }

    subEl.querySelectorAll('[data-pos-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        viewState.posFilter = btn.dataset.posFilter;
        renderDirectory(subEl);
      });
    });

    subEl.querySelectorAll('[data-status-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        viewState.statusFilter = btn.dataset.statusFilter;
        renderDirectory(subEl);
      });
    });

    const clearBtn = subEl.querySelector('#clear-vocab-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        viewState.posFilter = 'all';
        viewState.statusFilter = 'all';
        viewState.search = '';
        renderDirectory(subEl);
      });
    }

    subEl.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', () => window.NihongoAudio.speak(btn.dataset.speak));
    });

    subEl.querySelectorAll('[data-star]').forEach(btn => {
      btn.addEventListener('click', () => {
        const added = store.toggleStarVocab(btn.dataset.star);
        window.NihongoApp.toast(added ? 'Added to Starred words ★' : 'Removed from Starred words');
        renderDirectory(subEl);
      });
    });

    subEl.querySelectorAll('[data-quick-master]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.quickMaster;
        const st = store.getVocabStatus(id);
        if (st === 'mastered') {
          store.rateVocab(id, 1);
          window.NihongoApp.toast('Reset to Learning queue');
        } else {
          store.rateVocab(id, 4);
          store.rateVocab(id, 4);
          window.NihongoApp.toast('Marked as Mastered! (+16 XP)');
        }
        renderDirectory(subEl);
      });
    });
  }

  function renderFlashcards(subEl, rootContainer) {
    const store = window.NihongoStore;
    const deckOptions = [
      { id: 'due', label: 'Smart Due Queue' },
      { id: 'counters', label: '🔢 Counters' },
      { id: 'dates', label: '📅 Dates & Days' },
      { id: 'katakana', label: 'ア Katakana' },
      { id: 'noun', label: 'Nouns' },
      { id: 'adj', label: 'い / な Adjectives' },
      { id: 'verb', label: 'Verbs' },
      { id: 'adverb', label: 'Adverbs' },
      { id: 'starred', label: '★ Starred' },
      { id: 'all', label: 'Random 20 (All)' }
    ];

    const finished = viewState.queue.length === 0 || viewState.currentIndex >= viewState.queue.length;
    const currentWord = finished ? null : viewState.queue[viewState.currentIndex];

    subEl.innerHTML = `
      <div class="flashcard-wrapper">
        <div class="flashcard-meta">
          <div class="chip-row scroll-row">
            ${deckOptions.map(d => `
              <button class="chip ${viewState.deckFilter === d.id ? 'active' : ''}" data-deck="${d.id}">${d.label}</button>
            `).join('')}
          </div>
          <button class="btn btn-secondary btn-xs" id="toggle-card-dir">
            Mode: ${viewState.direction === 'jp-en' ? 'JP → EN' : 'EN → JP'} ⇄
          </button>
        </div>

        ${viewState.queue.length === 0 ? `
          <div class="card" style="text-align:center; padding:40px;">
            <h3>No cards in this deck yet</h3>
            <p class="muted">Star a few words in the Directory or switch to the Smart Due Queue to begin.</p>
            <button class="btn btn-primary" data-deck="due">Load Smart Due Queue</button>
          </div>
        ` : finished ? `
          <div class="card" style="text-align:center; padding:40px;">
            <div style="font-size:2.6rem; margin-bottom:8px;">🎉</div>
            <h3 style="margin:0 0 6px;">Session Complete! お疲れさまでした！</h3>
            <p class="muted">
              You reviewed <strong>${viewState.sessionStats.reviewed}</strong> cards
              (${viewState.sessionStats.goodOrEasy} rated Good or Easy).
            </p>
            <div class="btn-row" style="justify-content:center; margin-top:18px;">
              <button class="btn btn-primary" id="restart-flashcards">Study Another Set</button>
              <button class="btn btn-secondary" id="goto-drills-after-fc">Try a Quick Drill ⚡</button>
            </div>
          </div>
        ` : `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:0.84rem;">
            <span class="muted">Card <strong>${viewState.currentIndex + 1}</strong> of ${viewState.queue.length}</span>
            <span class="muted">Shortcuts: <kbd>Space</kbd> Flip · <kbd>1–4</kbd> Rate · <kbd>A</kbd> Audio</span>
          </div>
          <div class="progress-track" style="margin-bottom:16px;">
            <div class="progress-fill" style="width:${Math.round((viewState.currentIndex / viewState.queue.length) * 100)}%"></div>
          </div>

          <div class="flashcard-scene">
            <div class="flashcard-inner ${viewState.flipped ? 'is-flipped' : ''}" id="flashcard-card">
              <!-- Front Face -->
              <div class="flashcard-face flashcard-front">
                <span class="badge badge-${currentWord.pos}">${POS_META[currentWord.pos].badge} · ${currentWord.topic}</span>
                ${viewState.direction === 'jp-en' ? `
                  <div class="flashcard-front-jp jp-text">${renderKanjiDisplay(currentWord)}</div>
                  <div class="romaji" style="font-size:1.05rem;">${currentWord.romaji}</div>
                  <button class="audio-btn" style="margin-top:12px;" data-speak="${currentWord.kana}" title="Listen (A)">🔊</button>
                ` : `
                  <div style="font-size:1.85rem; font-weight:800; margin:16px 0;">${currentWord.meaning}</div>
                  <p class="muted small">Recall the Japanese word, reading &amp; kanji</p>
                `}
                <span class="flashcard-hint">Click card or press Space to reveal answer</span>
              </div>

              <!-- Back Face -->
              <div class="flashcard-face flashcard-back">
                <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
                  <span class="badge badge-${currentWord.pos}">${POS_META[currentWord.pos].badge}</span>
                  <button class="audio-btn" data-speak="${currentWord.kana}" title="Pronounce word (A)">🔊</button>
                </div>

                <div>
                  <div class="jp-text" style="font-size:2.1rem; font-weight:700; line-height:1.4;">
                    ${renderKanjiDisplay(currentWord)}
                  </div>
                  <div class="romaji">${currentWord.kana} · ${currentWord.romaji}</div>
                  <div style="font-size:1.3rem; font-weight:800; margin-top:6px;">${currentWord.meaning}</div>
                  ${currentWord.notes ? `<div class="vocab-notes" style="margin-top:10px; text-align:left;">${currentWord.notes}</div>` : ''}
                </div>

                <div style="width:100%; text-align:left; background:var(--bg-subtle); padding:10px 12px; border-radius:10px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <div class="jp-text small" style="font-weight:600;">${currentWord.exampleJp}</div>
                    <button class="audio-btn" style="width:26px; height:26px; font-size:0.75rem;" data-speak="${currentWord.exampleKana}" title="Hear example">🔊</button>
                  </div>
                  <div class="muted small">${currentWord.exampleEn}</div>
                </div>
              </div>
            </div>
          </div>

          ${viewState.flipped ? `
            <div class="srs-rating-grid">
              <button class="srs-btn again" data-rate="1">1 · Again <small>10 min</small></button>
              <button class="srs-btn hard" data-rate="2">2 · Hard <small>1 day</small></button>
              <button class="srs-btn good" data-rate="3">3 · Good <small>1–4 days</small></button>
              <button class="srs-btn easy" data-rate="4">4 · Easy <small>3+ days</small></button>
            </div>
          ` : `
            <div style="text-align:center;">
              <button class="btn btn-primary" id="flip-card-btn" style="min-width:220px;">Show Answer (Space)</button>
            </div>
          `}
        `}
      </div>
    `;

    // Bind deck selector
    subEl.querySelectorAll('[data-deck]').forEach(btn => {
      btn.addEventListener('click', () => {
        startSession(btn.dataset.deck);
        renderFlashcards(subEl, rootContainer);
      });
    });

    const dirBtn = subEl.querySelector('#toggle-card-dir');
    if (dirBtn) {
      dirBtn.addEventListener('click', () => {
        viewState.direction = viewState.direction === 'jp-en' ? 'en-jp' : 'jp-en';
        viewState.flipped = false;
        renderFlashcards(subEl, rootContainer);
      });
    }

    const restartBtn = subEl.querySelector('#restart-flashcards');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        startSession(viewState.deckFilter);
        renderFlashcards(subEl, rootContainer);
      });
    }

    const gotoDrillsBtn = subEl.querySelector('#goto-drills-after-fc');
    if (gotoDrillsBtn) {
      gotoDrillsBtn.addEventListener('click', () => window.NihongoApp.navigate('drills'));
    }

    function doFlip() {
      if (!currentWord) return;
      viewState.flipped = !viewState.flipped;
      if (viewState.flipped && store.getState().prefs.autoPlayAudio) {
        window.NihongoAudio.speak(currentWord.kana);
      }
      renderFlashcards(subEl, rootContainer);
    }

    function doRate(rating) {
      if (!currentWord) return;
      store.rateVocab(currentWord.id, rating);
      viewState.sessionStats.reviewed += 1;
      if (rating >= 3) viewState.sessionStats.goodOrEasy += 1;
      if (rating === 1) {
        // Re-insert near end of current session for extra practice
        viewState.queue.push(currentWord);
      }
      viewState.currentIndex += 1;
      viewState.flipped = false;
      renderFlashcards(subEl, rootContainer);
    }

    const cardEl = subEl.querySelector('#flashcard-card');
    if (cardEl) {
      let touchStartX = 0;
      let touchStartY = 0;
      let swiped = false;

      cardEl.addEventListener('touchstart', e => {
        if (!e.touches || !e.touches[0]) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        swiped = false;
      }, { passive: true });

      cardEl.addEventListener('touchend', e => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4 && viewState.flipped) {
          swiped = true;
          if (dx > 0) {
            window.NihongoApp.toast('Swiped right → Rated Good ✓');
            doRate(3);
          } else {
            window.NihongoApp.toast('Swiped left → Again ↻');
            doRate(1);
          }
        }
      }, { passive: true });

      cardEl.addEventListener('click', e => {
        if (swiped) { swiped = false; return; }
        if (e.target.closest('button')) return;
        doFlip();
      });
    }

    const flipBtn = subEl.querySelector('#flip-card-btn');
    if (flipBtn) flipBtn.addEventListener('click', doFlip);

    subEl.querySelectorAll('[data-rate]').forEach(btn => {
      btn.addEventListener('click', () => doRate(Number(btn.dataset.rate)));
    });

    subEl.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        window.NihongoAudio.speak(btn.dataset.speak);
      });
    });

    // Keyboard shortcuts when studying flashcards
    detachKeys();
    if (currentWord) {
      keyHandler = function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.code === 'Space') {
          e.preventDefault();
          doFlip();
        } else if (e.key.toLowerCase() === 'a') {
          window.NihongoAudio.speak(currentWord.kana);
        } else if (viewState.flipped && ['1', '2', '3', '4'].includes(e.key)) {
          doRate(Number(e.key));
        }
      };
      document.addEventListener('keydown', keyHandler);
    }
  }

  return { render, cleanup: detachKeys };
})();

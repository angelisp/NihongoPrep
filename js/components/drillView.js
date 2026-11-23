/* ==========================================================================
   Targeted Practice Drills (練習ドリル)
   Adaptive Particles, Conjugation, Vocab Quiz, ★ Star Ordering & Mistake Bank
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.drills = (function () {
  let activeSession = null;
  let keyHandler = null;

  function detachKeys() {
    if (keyHandler) {
      document.removeEventListener('keydown', keyHandler);
      keyHandler = null;
    }
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function stripHtml(html) {
    return String(html || '').replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '').trim();
  }

  function buildVocabQuestionForWord(word, idx) {
    const all = window.NihongoData.vocab;
    const kanjiWords = all.filter(w => w.kanji !== w.kana);
    const doReading = word.kanji !== word.kana && idx % 2 === 0;
    const meta = {
      _mistakeKind: 'vocab',
      _mistakeRefId: word.id,
      _mistakeLabel: `${word.kanji} (${word.meaning})`
    };

    if (doReading) {
      const distractors = shuffle(kanjiWords.filter(w => w.id !== word.id && w.kana !== word.kana))
        .slice(0, 3)
        .map(w => w.kana);
      const options = shuffle([word.kana, ...distractors]);
      return Object.assign(meta, {
        prompt: `Choose the correct hiragana reading for <strong style="font-size:1.4em;">${word.kanji}</strong>:`,
        options,
        answerIndex: options.indexOf(word.kana),
        explanation: `${word.kanji} is read ${word.kana} (${word.romaji}) and means "${word.meaning}".`
      });
    } else {
      const distractors = shuffle(all.filter(w => w.id !== word.id && w.meaning !== word.meaning))
        .slice(0, 3)
        .map(w => w.meaning);
      const options = shuffle([word.meaning, ...distractors]);
      const display = word.kanji !== word.kana
        ? `<ruby>${word.kanji}<rt>${word.kana}</rt></ruby>`
        : word.kana;
      return Object.assign(meta, {
        prompt: `What does <strong style="font-size:1.35em;">${display}</strong> mean?`,
        options,
        answerIndex: options.indexOf(word.meaning),
        explanation: `${word.kanji} (${word.kana} / ${word.romaji}) means "${word.meaning}". Example: ${word.exampleEn}`
      });
    }
  }

  function buildVocabQuestions(count) {
    const store = window.NihongoStore;
    const all = window.NihongoData.vocab;
    const missedIds = new Set(store.getMistakes('vocab').map(m => m.refId));
    const prioritized = all.filter(w => missedIds.has(w.id));
    const rest = shuffle(all.filter(w => !missedIds.has(w.id)));
    const chosen = prioritized.concat(rest).slice(0, count);

    return chosen.map((word, idx) => {
      const q = buildVocabQuestionForWord(word, idx);
      if (missedIds.has(word.id)) {
        q._mistakeKey = `vocab:${word.id}`;
        q._isRetry = true;
      }
      return q;
    });
  }

  function pickAdaptive(pool, kind, count, isStar) {
    const store = window.NihongoStore;
    const missedIds = new Set(store.getMistakes(kind).map(m => m.refId));
    const wrap = item => Object.assign({}, item, {
      isStar: Boolean(isStar),
      _mistakeKind: kind,
      _mistakeRefId: item.id,
      _mistakeLabel: isStar ? stripHtml(item.orderedText) : stripHtml(item.prompt).slice(0, 42),
      _mistakeKey: missedIds.has(item.id) ? `${kind}:${item.id}` : null,
      _isRetry: missedIds.has(item.id)
    });

    const prioritized = shuffle(pool.filter(q => missedIds.has(q.id))).map(wrap);
    const rest = shuffle(pool.filter(q => !missedIds.has(q.id))).map(wrap);
    return prioritized.concat(rest).slice(0, count);
  }

  function resolveMistakeQuestion(m, idx) {
    const drills = window.NihongoData.drills;
    if (m.kind === 'particles') {
      const found = drills.particles.find(q => q.id === m.refId);
      if (found) return Object.assign({}, found, { isStar: false, _mistakeKind: 'particles', _mistakeRefId: found.id, _mistakeLabel: m.label, _mistakeKey: m.key, _isRetry: true });
    } else if (m.kind === 'conjugation') {
      const found = drills.conjugation.find(q => q.id === m.refId);
      if (found) return Object.assign({}, found, { isStar: false, _mistakeKind: 'conjugation', _mistakeRefId: found.id, _mistakeLabel: m.label, _mistakeKey: m.key, _isRetry: true });
    } else if (m.kind === 'starOrder') {
      const found = drills.starOrder.find(q => q.id === m.refId);
      if (found) return Object.assign({}, found, { isStar: true, _mistakeKind: 'starOrder', _mistakeRefId: found.id, _mistakeLabel: m.label, _mistakeKey: m.key, _isRetry: true });
    } else if (m.kind === 'vocab') {
      const word = window.NihongoData.vocab.find(w => w.id === m.refId);
      if (word) {
        const q = buildVocabQuestionForWord(word, idx);
        q._mistakeKey = m.key;
        q._isRetry = true;
        return q;
      }
    } else if (m.kind === 'grammar') {
      const g = window.NihongoData.grammar.find(item => item.id === m.refId);
      if (g && g.quickCheck) {
        return {
          prompt: `<span class="badge badge-neutral" style="margin-bottom:8px;">Grammar · ${g.pattern}</span><br/>${g.quickCheck.prompt}`,
          options: g.quickCheck.options,
          answerIndex: g.quickCheck.answerIndex,
          explanation: g.quickCheck.explanation,
          isStar: false,
          _mistakeKind: 'grammar',
          _mistakeRefId: g.id,
          _mistakeLabel: m.label,
          _mistakeKey: m.key,
          _isRetry: true
        };
      }
    } else if (m.kind === 'exam') {
      const eq = window.NihongoData.mockExam.find(item => item.id === m.refId);
      if (eq) {
        return {
          prompt: eq.passage
            ? `<div class="reading-passage jp-text" style="font-size:0.9rem; margin-bottom:10px;"><strong>${eq.passageTitle}</strong><div>${eq.passage}</div></div>${eq.cleanPrompt}`
            : eq.cleanPrompt,
          before: eq.starBefore,
          after: eq.starAfter,
          starPos: eq.starPos,
          orderedText: eq.explanation,
          options: eq.options,
          answerIndex: eq.answerIndex,
          explanation: eq.explanation,
          isStar: Boolean(eq.isStar),
          _mistakeKind: 'exam',
          _mistakeRefId: eq.id,
          _mistakeLabel: m.label,
          _mistakeKey: m.key,
          _isRetry: true
        };
      }
    }
    return null;
  }

  function startDrill(type) {
    const drills = window.NihongoData.drills;
    const store = window.NihongoStore;
    let title = '';
    let questions = [];

    if (type === 'mistakes') {
      title = '🎯 Mistake Bank Review · 弱点克服';
      const mistakes = store.getMistakes();
      questions = mistakes.map((m, idx) => resolveMistakeQuestion(m, idx)).filter(Boolean).slice(0, 12);
      if (questions.length === 0) {
        activeSession = null;
        window.NihongoApp.toast('Your Mistake Bank is empty — nice work!');
        return;
      }
    } else if (type === 'particles') {
      title = 'Particle Fill-in Drill · 助詞ドリル';
      questions = pickAdaptive(drills.particles, 'particles', 10, false);
    } else if (type === 'conjugation') {
      title = 'Verb & Adjective Conjugation · 活用ドリル';
      questions = pickAdaptive(drills.conjugation, 'conjugation', 10, false);
    } else if (type === 'starOrder') {
      title = '★ Sentence Ordering · 並び替え (JLPT N5 Format)';
      questions = pickAdaptive(drills.starOrder, 'starOrder', drills.starOrder.length, true);
    } else {
      title = 'Vocabulary & Kanji Quiz · 語彙クイズ';
      questions = buildVocabQuestions(10);
    }

    activeSession = {
      type,
      title,
      questions,
      index: 0,
      selected: null,
      starSlots: [null, null, null, null],
      score: 0,
      combo: 0,
      bestCombo: 0,
      xpEarned: 0,
      clearedCount: 0,
      missedList: [],
      finished: false
    };
  }

  function renderStarInteractive(q, s) {
    const slots = [0, 1, 2, 3].map(i => {
      const placedIdx = s.starSlots[i];
      const isStar = i === q.starPos;
      const cls = [
        'star-slot',
        'star-slot-btn',
        isStar ? 'is-star' : '',
        placedIdx !== null ? 'is-filled' : ''
      ].filter(Boolean).join(' ');
      const label = placedIdx !== null ? q.options[placedIdx] : (isStar ? '★' : '＿');
      return `<button type="button" class="${cls}" data-slot="${i}" title="${placedIdx !== null ? 'Click to remove' : 'Drop or tap a piece to place here'}">${label}</button>`;
    }).join('');

    const placedSet = new Set(s.starSlots.filter(v => v !== null));
    const allFilled = s.starSlots.every(v => v !== null);
    const anyFilled = s.starSlots.some(v => v !== null);

    return `
      <span class="badge badge-warning">Tap or drag the 4 pieces into order — then check what lands in ★</span>
      <div class="star-sentence-box jp-text" id="star-sentence-box">${q.before} ${slots} ${q.after}</div>
      <div class="star-chip-bank" id="star-chip-bank">
        ${q.options.map((opt, idx) => {
          const used = placedSet.has(idx);
          return `
            <button type="button"
                    class="star-chip jp-text ${used ? 'is-used' : ''}"
                    data-chip="${idx}"
                    draggable="${!used}"
                    ${used ? 'disabled' : ''}>
              <span class="option-key">${idx + 1}</span>
              <span>${opt}</span>
            </button>
          `;
        }).join('')}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:12px;" id="star-actions-row">
        <button type="button" class="btn btn-xs btn-ghost" id="star-clear-btn" ${anyFilled ? '' : 'disabled'}>↺ Clear Slots</button>
        <button type="button" class="btn btn-primary btn-sm" id="star-check-btn" ${allFilled ? '' : 'disabled'}>
          Check Order (Enter) ✓
        </button>
      </div>
    `;
  }

  function render(container, opts) {
    detachKeys();
    if (opts && opts.drillType) {
      startDrill(opts.drillType);
    }

    if (!activeSession) {
      renderLobby(container);
    } else if (activeSession.finished) {
      renderSummary(container);
    } else {
      renderQuestion(container);
    }
  }

  function renderLobby(container) {
    const store = window.NihongoStore;
    const stats = store.getState().stats;
    const accuracy = stats.drillTotal > 0 ? Math.round((stats.drillCorrect / stats.drillTotal) * 100) : 0;
    const mistakeCount = store.getMistakeCount();
    const bestBadge = type => {
      const best = store.getDrillBest(type);
      return best !== null ? `<span class="badge badge-success">Best ${best}%</span>` : '';
    };

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Practice Drills · 練習ドリル</h2>
          <p>Adaptive 5-minute drills that prioritize your past misses. ${stats.drillsCompleted} completed · ${accuracy}% lifetime accuracy.</p>
        </div>
      </div>

      ${mistakeCount > 0 ? `
        <section class="card mistake-banner" style="margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap;">
            <div>
              <span class="badge badge-danger">Mistake Bank · ${mistakeCount} weak item${mistakeCount === 1 ? '' : 's'}</span>
              <h3 style="margin:6px 0 2px; font-size:1.15rem;">Fix Your Recent Mistakes</h3>
              <p class="muted small" style="margin:0;">
                Questions you missed in drills, grammar quick checks, or mock exams wait here. Answer them right to clear them!
              </p>
            </div>
            <button class="btn btn-primary" data-start-drill="mistakes">🎯 Fix My Mistakes (${Math.min(12, mistakeCount)})</button>
          </div>
        </section>
      ` : ''}

      <section class="drill-selector-grid">
        <div class="card card-interactive" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
            <span class="action-icon" style="background:var(--indigo-soft); color:var(--indigo);">助</span>
            <div style="display:flex; gap:6px; align-items:center;">
              ${bestBadge('particles')}
              <span class="badge badge-neutral">10 Questions</span>
            </div>
          </div>
          <h3 style="margin:4px 0 0;">Particle Fill-in (助詞)</h3>
          <p class="muted small" style="margin:0; flex:1;">
            Master the trickiest N5 particles: は, が, を, に, で, へ, と, や, も, から, まで.
          </p>
          <button class="btn btn-primary btn-sm" data-start-drill="particles">Start Particle Drill</button>
        </div>

        <div class="card card-interactive" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
            <span class="action-icon" style="background:var(--success-soft); color:var(--success);">活</span>
            <div style="display:flex; gap:6px; align-items:center;">
              ${bestBadge('conjugation')}
              <span class="badge badge-neutral">10 Questions</span>
            </div>
          </div>
          <h3 style="margin:4px 0 0;">Verb &amp; Adjective Forms (活用)</h3>
          <p class="muted small" style="margin:0; flex:1;">
            Drill て-form rules (行く→行って, 泳ぐ→泳いで), い-adj past/neg, and な-adj traps (きれい, 有名).
          </p>
          <button class="btn btn-primary btn-sm" data-start-drill="conjugation">Start Conjugation Drill</button>
        </div>

        <div class="card card-interactive" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
            <span class="action-icon" style="background:var(--accent-soft); color:var(--accent);">★</span>
            <div style="display:flex; gap:6px; align-items:center;">
              ${bestBadge('starOrder')}
              <span class="badge badge-warning">JLPT Exam Favorite</span>
            </div>
          </div>
          <h3 style="margin:4px 0 0;">★ Sentence Ordering (並び替え)</h3>
          <p class="muted small" style="margin:0; flex:1;">
            Practice the official JLPT grammar star-slot question format — reorder 4 fragments and pick what fits ★!
          </p>
          <button class="btn btn-primary btn-sm" data-start-drill="starOrder">Start ★ Ordering Drill</button>
        </div>

        <div class="card card-interactive" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
            <span class="action-icon" style="background:var(--purple-soft); color:var(--purple);">語</span>
            <div style="display:flex; gap:6px; align-items:center;">
              ${bestBadge('vocab')}
              <span class="badge badge-neutral">Dynamic · 10 Qs</span>
            </div>
          </div>
          <h3 style="margin:4px 0 0;">Vocab &amp; Kanji Speed Quiz</h3>
          <p class="muted small" style="margin:0; flex:1;">
            Freshly generated every run from our ${window.NihongoData.vocab.length}-word bank — prioritizing any words you missed.
          </p>
          <button class="btn btn-primary btn-sm" data-start-drill="vocab">Start Vocab Quiz</button>
        </div>
      </section>
    `;

    container.querySelectorAll('[data-start-drill]').forEach(btn => {
      btn.addEventListener('click', () => {
        startDrill(btn.dataset.startDrill);
        render(container);
      });
    });
  }

  function renderQuestion(container) {
    detachKeys();
    const s = activeSession;
    const q = s.questions[s.index];
    const pct = Math.round((s.index / s.questions.length) * 100);
    const prevPct = Math.round((Math.max(0, s.index - 1) / s.questions.length) * 100);

    container.innerHTML = `
      <div class="quiz-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:10px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <strong>${s.title}</strong>
            <span class="muted small">Question ${s.index + 1} / ${s.questions.length}</span>
            ${q._isRetry ? '<span class="badge badge-warning">↻ Past Miss</span>' : ''}
            <span class="combo-pill" id="drill-combo" ${s.combo >= 2 ? '' : 'hidden'}>🔥 ×${s.combo}</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="muted small fc-shortcuts"><kbd>1–4</kbd> Answer · <kbd>Enter</kbd> Next</span>
            <button class="btn btn-ghost btn-xs" id="exit-drill-btn">✕ Exit Drill</button>
          </div>
        </div>

        <div class="progress-track" style="margin-bottom:18px;">
          <div class="progress-fill" id="drill-progress-bar" data-from="${prevPct}%" style="width:${pct}%"></div>
        </div>

        <div class="card">
          ${q.isStar ? `
            <div id="star-builder-root">${renderStarInteractive(q, s)}</div>
          ` : `
            <div class="quiz-prompt jp-text">${q.prompt}</div>
            <div class="option-list">
              ${q.options.map((opt, idx) => `
                <button class="option-btn jp-text" data-opt="${idx}">
                  <span class="option-key">${idx + 1}</span>
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>
          `}

          <div id="drill-feedback-slot"></div>
        </div>
      </div>
    `;

    window.NihongoFx.animateIn(container);

    const optButtons = Array.from(container.querySelectorAll('[data-opt]'));
    const feedbackSlot = container.querySelector('#drill-feedback-slot');
    const comboEl = container.querySelector('#drill-combo');
    const barEl = container.querySelector('#drill-progress-bar');

    function advance() {
      if (s.selected === null) return;
      if (s.index + 1 < s.questions.length) {
        s.index += 1;
        s.selected = null;
        s.starSlots = [null, null, null, null];
        renderQuestion(container);
      } else {
        s.finished = true;
        s.xpEarned = window.NihongoStore.recordDrillResult(s.score, s.questions.length, s.type);
        detachKeys();
        renderSummary(container);
      }
    }

    function selectOption(chosenIdx) {
      if (s.selected !== null || chosenIdx < 0 || chosenIdx >= q.options.length) return;
      s.selected = chosenIdx;
      const isCorrect = chosenIdx === q.answerIndex;
      let clearedNow = false;

      if (isCorrect) {
        s.score += 1;
        s.combo += 1;
        if (s.combo > s.bestCombo) s.bestCombo = s.combo;
        if (q._mistakeKey) {
          clearedNow = window.NihongoStore.clearMistake(q._mistakeKey);
          if (clearedNow) s.clearedCount += 1;
        }
      } else {
        s.combo = 0;
        if (q._mistakeKind && q._mistakeRefId) {
          window.NihongoStore.recordMistake(q._mistakeKind, q._mistakeRefId, q._mistakeLabel);
        }
        s.missedList.push({
          label: q._mistakeLabel || stripHtml(q.prompt),
          correct: q.options[q.answerIndex],
          explanation: q.explanation
        });
      }

      if (q.isStar) {
        const starRoot = container.querySelector('#star-builder-root');
        if (starRoot) {
          starRoot.querySelectorAll('button').forEach(b => { b.disabled = true; });
          const starSlotEl = starRoot.querySelector(`[data-slot="${q.starPos}"]`);
          if (starSlotEl) {
            starSlotEl.classList.add(isCorrect ? 'slot-correct' : 'slot-incorrect');
            window.NihongoFx.pulse(starSlotEl, isCorrect ? 'fx-pop' : 'fx-shake');
          }
          const actionsRow = starRoot.querySelector('#star-actions-row');
          if (actionsRow) actionsRow.hidden = true;
        }
      } else {
        optButtons.forEach((btn, idx) => {
          btn.disabled = true;
          if (idx === q.answerIndex) {
            btn.classList.add('correct');
            if (isCorrect) window.NihongoFx.pulse(btn, 'fx-pop');
          } else if (idx === chosenIdx) {
            btn.classList.add('incorrect');
            window.NihongoFx.pulse(btn, 'fx-shake');
          }
        });
      }

      if (comboEl) {
        if (s.combo >= 2) {
          comboEl.textContent = `🔥 ×${s.combo}`;
          comboEl.hidden = false;
          window.NihongoFx.pulse(comboEl, 'fx-pop');
        } else {
          comboEl.hidden = true;
        }
      }

      if (barEl) {
        barEl.style.width = `${Math.round(((s.index + 1) / s.questions.length) * 100)}%`;
      }

      if (feedbackSlot) {
        feedbackSlot.innerHTML = `
          <div class="feedback-banner ${isCorrect ? 'correct' : 'incorrect'} feedback-enter">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
              <strong>${isCorrect ? '✓ Correct! 正解！' : '✕ Not quite — saved to Mistake Bank'}</strong>
              ${clearedNow ? '<span class="badge badge-success">✨ Mistake Cleared!</span>' : ''}
            </div>
            ${q.isStar && q.orderedText ? `<div class="jp-text" style="font-weight:700; margin:6px 0;">${q.orderedText}</div>` : ''}
            <div>${q.explanation}</div>
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:12px;">
            <button class="btn btn-primary" id="next-drill-q">
              ${s.index + 1 < s.questions.length ? 'Next Question →' : 'See Results →'}
            </button>
          </div>
        `;
        const nextBtn = feedbackSlot.querySelector('#next-drill-q');
        if (nextBtn) nextBtn.addEventListener('click', advance);
      }
    }

    container.querySelector('#exit-drill-btn').addEventListener('click', () => {
      detachKeys();
      activeSession = null;
      render(container);
    });

    optButtons.forEach(btn => {
      btn.addEventListener('click', () => selectOption(Number(btn.dataset.opt)));
    });

    // Interactive tap & drag-and-drop wiring for ★ sentence ordering
    function bindStarBuilder() {
      const starRoot = container.querySelector('#star-builder-root');
      if (!starRoot || s.selected !== null) return;
      let draggedChip = null;

      function rerenderBuilder() {
        starRoot.innerHTML = renderStarInteractive(q, s);
        bindStarBuilder();
      }

      function placeChipInSlot(chipIdx, slotIdx) {
        if (s.selected !== null) return;
        const prevSlot = s.starSlots.indexOf(chipIdx);
        if (prevSlot >= 0) s.starSlots[prevSlot] = null;
        s.starSlots[slotIdx] = chipIdx;
        rerenderBuilder();
      }

      starRoot.querySelectorAll('[data-chip]').forEach(chip => {
        const chipIdx = Number(chip.dataset.chip);
        chip.addEventListener('click', () => {
          const emptySlot = s.starSlots.indexOf(null);
          if (emptySlot >= 0) placeChipInSlot(chipIdx, emptySlot);
        });
        chip.addEventListener('dragstart', e => {
          draggedChip = chipIdx;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', String(chipIdx));
        });
      });

      starRoot.querySelectorAll('[data-slot]').forEach(slot => {
        const slotIdx = Number(slot.dataset.slot);
        slot.addEventListener('click', () => {
          if (s.starSlots[slotIdx] !== null) {
            s.starSlots[slotIdx] = null;
            rerenderBuilder();
          }
        });
        slot.addEventListener('dragover', e => {
          e.preventDefault();
          slot.classList.add('slot-dragover');
        });
        slot.addEventListener('dragleave', () => {
          slot.classList.remove('slot-dragover');
        });
        slot.addEventListener('drop', e => {
          e.preventDefault();
          slot.classList.remove('slot-dragover');
          const raw = e.dataTransfer.getData('text/plain');
          const chipIdx = raw !== '' ? Number(raw) : draggedChip;
          if (chipIdx !== null && !Number.isNaN(chipIdx)) {
            placeChipInSlot(chipIdx, slotIdx);
          }
        });
      });

      const clearBtn = starRoot.querySelector('#star-clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          s.starSlots = [null, null, null, null];
          rerenderBuilder();
        });
      }

      const checkBtn = starRoot.querySelector('#star-check-btn');
      if (checkBtn) {
        checkBtn.addEventListener('click', () => {
          if (s.starSlots.every(v => v !== null)) {
            selectOption(s.starSlots[q.starPos]);
          }
        });
      }
    }

    if (q.isStar) bindStarBuilder();

    keyHandler = function (e) {
      if (window.NihongoFx.isOverlayOpen()) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (s.selected === null) {
        if (q.isStar) {
          if (['1', '2', '3', '4'].includes(e.key)) {
            e.preventDefault();
            const chipIdx = Number(e.key) - 1;
            const emptySlot = s.starSlots.indexOf(null);
            if (!s.starSlots.includes(chipIdx) && emptySlot >= 0) {
              s.starSlots[emptySlot] = chipIdx;
              const starRoot = container.querySelector('#star-builder-root');
              if (starRoot) {
                starRoot.innerHTML = renderStarInteractive(q, s);
                bindStarBuilder();
              }
            }
          } else if (e.key === 'Backspace') {
            for (let i = 3; i >= 0; i--) {
              if (s.starSlots[i] !== null) {
                e.preventDefault();
                s.starSlots[i] = null;
                const starRoot = container.querySelector('#star-builder-root');
                if (starRoot) {
                  starRoot.innerHTML = renderStarInteractive(q, s);
                  bindStarBuilder();
                }
                break;
              }
            }
          } else if (e.key === 'Enter' && s.starSlots.every(v => v !== null)) {
            e.preventDefault();
            selectOption(s.starSlots[q.starPos]);
          }
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          e.preventDefault();
          selectOption(Number(e.key) - 1);
        }
      } else if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        advance();
      }
    };
    document.addEventListener('keydown', keyHandler);
  }

  function renderSummary(container) {
    const s = activeSession;
    const pct = Math.round((s.score / s.questions.length) * 100);
    const xpEarned = s.xpEarned;
    const remainingMistakes = window.NihongoStore.getMistakeCount();

    container.innerHTML = `
      <div class="quiz-card">
        <div class="card score-hero">
          <div class="score-circle ${pct >= 70 ? '' : 'fail'}">
            <span style="font-size:2rem; line-height:1;" data-countup="${pct}" data-suffix="%">${pct}%</span>
            <small style="font-size:0.78rem;">${s.score}/${s.questions.length}</small>
          </div>
          <h2 style="margin:0 0 6px;">${pct >= 80 ? '素晴らしい！ Excellent work!' : pct >= 60 ? 'Good progress! いい調子です！' : 'Keep practicing! 頑張りましょう！'}</h2>
          <p class="muted">
            You earned <strong>+<span data-countup="${xpEarned}">${xpEarned}</span> XP</strong> on ${s.title}
            ${s.bestCombo >= 3 ? ` · 🔥 ${s.bestCombo} in a row!` : ''}
            ${s.clearedCount > 0 ? ` · ✨ ${s.clearedCount} mistake${s.clearedCount === 1 ? '' : 's'} cleared!` : ''}
          </p>
          <div class="btn-row" style="justify-content:center; margin-top:20px;">
            ${s.missedList.length > 0 && remainingMistakes > 0 ? `<button class="btn btn-primary" id="fix-missed-btn">🎯 Fix My Mistakes (${remainingMistakes})</button>` : ''}
            <button class="btn ${s.missedList.length > 0 ? 'btn-secondary' : 'btn-primary'}" id="retry-drill-btn">Practice Again</button>
            <button class="btn btn-secondary" id="back-drill-lobby">All Drills</button>
            <button class="btn btn-indigo" id="go-mock-exam">Take Mock Exam 📝</button>
          </div>
        </div>

        ${s.missedList.length > 0 ? `
          <div class="card" style="margin-top:16px;">
            <h3 style="margin:0 0 10px; font-size:1rem;">Missed Items Saved to Mistake Bank (${s.missedList.length})</h3>
            <div class="missed-review-list">
              ${s.missedList.map(item => `
                <div class="missed-review-row">
                  <div class="jp-text" style="font-weight:700;">${item.label}</div>
                  <div class="small" style="color:var(--success); font-weight:700;">Answer: <span class="jp-text">${item.correct}</span></div>
                  <div class="small muted">${item.explanation}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    window.NihongoFx.animateIn(container);
    if (pct >= 70) {
      window.NihongoFx.confettiFrom(container.querySelector('.score-circle'), { count: 90, spread: 1 });
    }

    const fixBtn = container.querySelector('#fix-missed-btn');
    if (fixBtn) {
      fixBtn.addEventListener('click', () => {
        startDrill('mistakes');
        render(container);
      });
    }
    container.querySelector('#retry-drill-btn').addEventListener('click', () => {
      startDrill(s.type === 'mistakes' && remainingMistakes === 0 ? 'particles' : s.type);
      render(container);
    });
    container.querySelector('#back-drill-lobby').addEventListener('click', () => {
      activeSession = null;
      render(container);
    });
    container.querySelector('#go-mock-exam').addEventListener('click', () => {
      activeSession = null;
      window.NihongoApp.navigate('exam');
    });
  }

  return { render, cleanup: detachKeys };
})();

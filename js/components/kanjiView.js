/* ==========================================================================
   Kanji Explorer, Kanji Quiz & Interactive Hiragana/Katakana Heatmap (漢字・仮名)
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.kanji = (function () {
  let state = {
    subTab: 'kanji', // 'kanji' | 'quiz' | 'hiragana' | 'katakana'
    category: 'All',
    selectedId: 'k15', // 日
    kanjiQuiz: null,
    kanaDrill: null // { isKatakana, current, options, answered, chosen, combo, bestCombo, score, total }
  };

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

  function renderStars(count) {
    let out = '';
    for (let i = 1; i <= 3; i++) {
      out += `<span class="star-pip ${i <= count ? 'on' : ''}">${i <= count ? '★' : '☆'}</span>`;
    }
    return `<span class="star-rating" title="${count}/3 mastery stars">${out}</span>`;
  }

  function primaryReading(k) {
    return k.kunyomi && k.kunyomi !== '—' ? k.kunyomi : k.onyomi;
  }

  function startKanjiQuiz(category) {
    const allKanji = window.NihongoData.kanji;
    const store = window.NihongoStore;
    const pool = category && category !== 'All'
      ? allKanji.filter(k => k.category === category)
      : allKanji;

    // Prefer kanji with fewer than 3 stars
    const unmastered = shuffle(pool.filter(k => store.getKanjiStars(k.id) < 3));
    const mastered = shuffle(pool.filter(k => store.getKanjiStars(k.id) >= 3));
    const chosen = unmastered.concat(mastered).slice(0, Math.min(10, pool.length));

    const questions = chosen.map((k, idx) => {
      const askReading = idx % 2 === 1;
      if (askReading) {
        const correct = primaryReading(k);
        const distractors = shuffle(allKanji.filter(other => other.id !== k.id && primaryReading(other) !== correct))
          .slice(0, 3)
          .map(other => primaryReading(other));
        const options = shuffle([correct, ...distractors]);
        return {
          kanji: k,
          mode: 'reading',
          prompt: `Choose the reading for`,
          options,
          answerIndex: options.indexOf(correct),
          explanation: `${k.char} means "${k.meaning}". On: ${k.onyomi} · Kun: ${k.kunyomi}.`
        };
      } else {
        const distractors = shuffle(allKanji.filter(other => other.id !== k.id && other.meaning !== k.meaning))
          .slice(0, 3)
          .map(other => other.meaning);
        const options = shuffle([k.meaning, ...distractors]);
        return {
          kanji: k,
          mode: 'meaning',
          prompt: `What does this kanji mean?`,
          options,
          answerIndex: options.indexOf(k.meaning),
          explanation: `${k.char} means "${k.meaning}". Mnemonic: ${k.mnemonic}`
        };
      }
    });

    state.kanjiQuiz = {
      category: category || 'All',
      questions,
      index: 0,
      selected: null,
      score: 0,
      combo: 0,
      bestCombo: 0,
      finished: false
    };
  }

  function flatKanaList(isKatakana) {
    const idx = isKatakana ? 1 : 0;
    const list = [];
    window.NihongoData.kanaRows.forEach(r => {
      r.items.forEach(cell => {
        if (cell) list.push({ glyph: cell[idx], speak: cell[0], romaji: cell[2] });
      });
    });
    return list;
  }

  function nextKanaRound(isKatakana, prev) {
    const store = window.NihongoStore;
    const all = flatKanaList(isKatakana);
    // Weight toward untouched or lower-accuracy characters
    const needsPractice = all.filter(item => {
      const st = store.getKanaStat(item.glyph);
      return st.attempts < 2 || (st.correct / st.attempts) < 0.8;
    });
    const pool = needsPractice.length ? needsPractice : all;
    const target = pool[Math.floor(Math.random() * pool.length)];
    const distractors = shuffle(all.filter(x => x.romaji !== target.romaji)).slice(0, 3).map(x => x.romaji);
    const options = shuffle([target.romaji, ...distractors]);

    state.kanaDrill = {
      isKatakana,
      target,
      options,
      answerIndex: options.indexOf(target.romaji),
      chosen: null,
      combo: prev ? prev.combo : 0,
      bestCombo: prev ? prev.bestCombo : 0,
      score: prev ? prev.score : 0,
      total: prev ? prev.total : 0
    };
  }

  function render(container) {
    detachKeys();
    const allKanji = window.NihongoData.kanji;
    const store = window.NihongoStore;
    const studied = store.getState().studiedKanji;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Kanji &amp; Kana Reference · 漢字・仮名</h2>
          <p>${studied.length}/${allKanji.length} JLPT N5 kanji studied. Take the Kanji Quiz or Kana Speed Drill to earn stars &amp; light up your chart.</p>
        </div>
        <div class="segmented-tabs" role="tablist">
          <button class="segmented-tab ${state.subTab === 'kanji' ? 'active' : ''}" data-ktab="kanji">漢 N5 Kanji</button>
          <button class="segmented-tab ${state.subTab === 'quiz' ? 'active' : ''}" data-ktab="quiz">⚡ Kanji Quiz</button>
          <button class="segmented-tab ${state.subTab === 'hiragana' ? 'active' : ''}" data-ktab="hiragana">あ Hiragana</button>
          <button class="segmented-tab ${state.subTab === 'katakana' ? 'active' : ''}" data-ktab="katakana">ア Katakana</button>
        </div>
      </div>

      <div id="kanji-subview"></div>
    `;

    container.querySelectorAll('[data-ktab]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.subTab = btn.dataset.ktab;
        if (state.subTab === 'quiz' && !state.kanjiQuiz) {
          startKanjiQuiz(state.category);
        }
        if ((state.subTab === 'hiragana' || state.subTab === 'katakana') && state.kanaDrill) {
          const wantKata = state.subTab === 'katakana';
          if (state.kanaDrill.isKatakana !== wantKata) state.kanaDrill = null;
        }
        render(container);
      });
    });

    const subEl = container.querySelector('#kanji-subview');
    if (state.subTab === 'kanji') {
      renderKanjiExplorer(subEl, container);
    } else if (state.subTab === 'quiz') {
      renderKanjiQuiz(subEl, container);
    } else {
      renderKanaChart(subEl, state.subTab === 'katakana', container);
    }
  }

  function renderKanjiExplorer(subEl, rootContainer) {
    const allKanji = window.NihongoData.kanji;
    const store = window.NihongoStore;
    const studied = store.getState().studiedKanji;

    const categories = ['All', ...Array.from(new Set(allKanji.map(k => k.category)))];
    const filtered = state.category === 'All'
      ? allKanji
      : allKanji.filter(k => k.category === state.category);

    const active = filtered.find(k => k.id === state.selectedId) || filtered[0];
    if (active) state.selectedId = active.id;
    const isStudied = active && studied.includes(active.id);
    const activeStars = active ? store.getKanjiStars(active.id) : 0;
    const xpClaimed = active && Boolean(store.getState().xpAwarded[`kanji:${active.id}`]);

    subEl.innerHTML = `
      ${active ? `
        <section class="card kanji-detail-banner">
          <div class="kanji-hero-glyph jp-text">${active.char}</div>
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
              <div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span class="badge badge-neutral">${active.category} · ${active.strokes} strokes</span>
                  ${renderStars(activeStars)}
                </div>
                <h3 style="margin:6px 0 4px; font-size:1.35rem;">${active.meaning}</h3>
              </div>
              <button class="btn ${isStudied ? 'btn-secondary' : 'btn-primary'} btn-sm" id="toggle-kanji-studied">
                ${isStudied ? '✓ Studied (Undo)' : xpClaimed ? 'Mark as Studied' : 'Mark as Studied (+10 XP)'}
              </button>
            </div>

            <div style="display:flex; flex-wrap:wrap; gap:18px; margin:8px 0; font-size:0.9rem;">
              <div><strong>On’yomi (音読み):</strong> <span class="jp-text">${active.onyomi}</span></div>
              <div><strong>Kun’yomi (訓読み):</strong> <span class="jp-text">${active.kunyomi}</span></div>
            </div>

            <p class="small muted" style="margin:6px 0 12px;">💡 <strong>Mnemonic:</strong> ${active.mnemonic}</p>

            <div style="display:flex; flex-wrap:wrap; gap:10px;">
              ${active.words.map(w => `
                <button class="btn btn-secondary btn-sm" data-speak="${w.read}" title="Click to hear pronunciation">
                  <span class="jp-text" style="font-weight:700;">${w.jp}</span>
                  <span class="jp-text small muted">(${w.read})</span>
                  <span>— ${w.en}</span>
                  <span>🔊</span>
                </button>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:16px;">
        <div class="chip-row scroll-row">
          ${categories.map(c => {
            if (c === 'All') {
              return `<button class="chip ${state.category === c ? 'active' : ''}" data-kcat="${c}">All (${studied.length}/${allKanji.length})</button>`;
            }
            const tot = allKanji.filter(k => k.category === c).length;
            const dn = allKanji.filter(k => k.category === c && studied.includes(k.id)).length;
            return `<button class="chip ${state.category === c ? 'active' : ''}" data-kcat="${c}">${c} ${dn}/${tot}</button>`;
          }).join('')}
        </div>
        <button class="btn btn-primary btn-xs" id="quiz-this-category">
          ⚡ Quiz ${state.category === 'All' ? 'All Kanji' : state.category}
        </button>
      </div>

      <div class="kanji-grid">
        ${filtered.map(k => {
          const stars = store.getKanjiStars(k.id);
          const done = stars > 0;
          const sel = active && active.id === k.id;
          return `
            <button class="card card-interactive kanji-tile ${done ? 'studied' : ''}"
                    style="${sel ? 'border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft);' : ''}"
                    data-kid="${k.id}">
              ${done ? `<span class="kanji-tile-stars">${'★'.repeat(stars)}</span>` : ''}
              <div class="kanji-char jp-text">${k.char}</div>
              <div style="font-weight:700; font-size:0.92rem;">${k.meaning}</div>
              <div class="kanji-readings jp-text">${k.kunyomi !== '—' ? k.kunyomi : k.onyomi}</div>
            </button>
          `;
        }).join('')}
      </div>
    `;

    subEl.querySelectorAll('[data-kcat]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.category = btn.dataset.kcat;
        renderKanjiExplorer(subEl, rootContainer);
      });
    });

    const quizCatBtn = subEl.querySelector('#quiz-this-category');
    if (quizCatBtn) {
      quizCatBtn.addEventListener('click', () => {
        startKanjiQuiz(state.category);
        state.subTab = 'quiz';
        render(rootContainer);
      });
    }

    subEl.querySelectorAll('[data-kid]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedId = btn.dataset.kid;
        renderKanjiExplorer(subEl, rootContainer);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    const toggleBtn = subEl.querySelector('#toggle-kanji-studied');
    if (toggleBtn && active) {
      toggleBtn.addEventListener('click', () => {
        const hadXp = Boolean(store.getState().xpAwarded[`kanji:${active.id}`]);
        const nowDone = store.toggleStudiedKanji(active.id);
        window.NihongoApp.toast(nowDone
          ? (hadXp ? `Kanji「${active.char}」marked studied ✓` : `Kanji「${active.char}」marked studied (+10 XP)`)
          : 'Removed studied mark');
        render(rootContainer);
      });
    }

    subEl.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', () => window.NihongoAudio.speak(btn.dataset.speak));
    });
  }

  function renderKanjiQuiz(subEl, rootContainer) {
    detachKeys();
    if (!state.kanjiQuiz) startKanjiQuiz(state.category);
    const s = state.kanjiQuiz;
    const allKanji = window.NihongoData.kanji;
    const categories = ['All', ...Array.from(new Set(allKanji.map(k => k.category)))];

    if (s.finished) {
      const pct = Math.round((s.score / s.questions.length) * 100);
      subEl.innerHTML = `
        <div class="quiz-card">
          <div class="card score-hero">
            <div class="score-circle ${pct >= 70 ? '' : 'fail'}">
              <span style="font-size:2rem; line-height:1;" data-countup="${pct}" data-suffix="%">${pct}%</span>
              <small style="font-size:0.78rem;">${s.score}/${s.questions.length}</small>
            </div>
            <h2 style="margin:0 0 6px;">${pct >= 80 ? '漢字マスター！ Great recall!' : 'Nice practice! Keep building those stars.'}</h2>
            <p class="muted">
              Every right answer upgraded that kanji’s star mastery.
              ${s.bestCombo >= 3 ? `🔥 Best streak: ${s.bestCombo} in a row!` : ''}
            </p>
            <div class="btn-row" style="justify-content:center; margin-top:18px;">
              <button class="btn btn-primary" id="restart-kanji-quiz">Quiz Another 10</button>
              <button class="btn btn-secondary" id="back-kanji-grid">Back to Kanji Grid</button>
            </div>
          </div>
        </div>
      `;
      window.NihongoFx.animateIn(subEl);
      if (pct >= 70) {
        window.NihongoFx.confettiFrom(subEl.querySelector('.score-circle'), { count: 80, spread: 0.9 });
      }
      subEl.querySelector('#restart-kanji-quiz').addEventListener('click', () => {
        startKanjiQuiz(s.category);
        renderKanjiQuiz(subEl, rootContainer);
      });
      subEl.querySelector('#back-kanji-grid').addEventListener('click', () => {
        state.subTab = 'kanji';
        render(rootContainer);
      });
      return;
    }

    const q = s.questions[s.index];
    const pct = Math.round((s.index / s.questions.length) * 100);

    subEl.innerHTML = `
      <div class="quiz-card">
        <div class="chip-row scroll-row" style="margin-bottom:14px;">
          ${categories.map(c => `
            <button class="chip ${s.category === c ? 'active' : ''}" data-kqcat="${c}">${c}</button>
          `).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:8px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:8px;">
            <strong>Kanji Quiz (${s.category})</strong>
            <span class="muted small">${s.index + 1} / ${s.questions.length}</span>
            <span class="combo-pill" id="kq-combo" ${s.combo >= 2 ? '' : 'hidden'}>🔥 ×${s.combo}</span>
          </div>
          <span class="muted small fc-shortcuts"><kbd>1–4</kbd> Answer · <kbd>Enter</kbd> Next</span>
        </div>

        <div class="progress-track" style="margin-bottom:16px;">
          <div class="progress-fill purple" id="kq-bar" style="width:${pct}%"></div>
        </div>

        <div class="card" style="text-align:center;">
          <span class="badge badge-neutral">${q.mode === 'reading' ? 'Reading · 読み方' : 'Meaning · 意味'}</span>
          <p class="muted small" style="margin:8px 0 4px;">${q.prompt}</p>
          <div class="kanji-quiz-glyph jp-text">${q.kanji.char}</div>

          <div class="option-list" style="text-align:left; margin-top:16px;">
            ${q.options.map((opt, idx) => `
              <button class="option-btn ${q.mode === 'reading' ? 'jp-text' : ''}" data-kqopt="${idx}">
                <span class="option-key">${idx + 1}</span>
                <span>${opt}</span>
              </button>
            `).join('')}
          </div>

          <div id="kq-feedback" style="text-align:left;"></div>
        </div>
      </div>
    `;

    const optBtns = Array.from(subEl.querySelectorAll('[data-kqopt]'));
    const fbEl = subEl.querySelector('#kq-feedback');
    const comboEl = subEl.querySelector('#kq-combo');
    const barEl = subEl.querySelector('#kq-bar');

    subEl.querySelectorAll('[data-kqcat]').forEach(btn => {
      btn.addEventListener('click', () => {
        startKanjiQuiz(btn.dataset.kqcat);
        renderKanjiQuiz(subEl, rootContainer);
      });
    });

    function advance() {
      if (s.selected === null) return;
      if (s.index + 1 < s.questions.length) {
        s.index += 1;
        s.selected = null;
        renderKanjiQuiz(subEl, rootContainer);
      } else {
        s.finished = true;
        detachKeys();
        renderKanjiQuiz(subEl, rootContainer);
      }
    }

    function pick(idx) {
      if (s.selected !== null || idx < 0 || idx >= q.options.length) return;
      s.selected = idx;
      const isCorrect = idx === q.answerIndex;
      const stars = window.NihongoStore.recordKanjiQuiz(q.kanji.id, isCorrect);

      if (isCorrect) {
        s.score += 1;
        s.combo += 1;
        if (s.combo > s.bestCombo) s.bestCombo = s.combo;
      } else {
        s.combo = 0;
      }

      optBtns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answerIndex) {
          btn.classList.add('correct');
          if (isCorrect) window.NihongoFx.pulse(btn, 'fx-pop');
        } else if (i === idx) {
          btn.classList.add('incorrect');
          window.NihongoFx.pulse(btn, 'fx-shake');
        }
      });

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

      if (fbEl) {
        fbEl.innerHTML = `
          <div class="feedback-banner ${isCorrect ? 'correct' : 'incorrect'} feedback-enter">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">
              <strong>${isCorrect ? '✓ Correct! 正解！' : '✕ Not quite!'}</strong>
              ${renderStars(stars)}
            </div>
            <div>${q.explanation}</div>
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:12px;">
            <button class="btn btn-primary" id="kq-next">
              ${s.index + 1 < s.questions.length ? 'Next Kanji →' : 'See Results →'}
            </button>
          </div>
        `;
        const nextBtn = fbEl.querySelector('#kq-next');
        if (nextBtn) nextBtn.addEventListener('click', advance);
      }
    }

    optBtns.forEach(btn => btn.addEventListener('click', () => pick(Number(btn.dataset.kqopt))));

    keyHandler = function (e) {
      if (window.NihongoFx.isOverlayOpen()) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (s.selected === null && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        pick(Number(e.key) - 1);
      } else if (s.selected !== null && (e.key === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        advance();
      }
    };
    document.addEventListener('keydown', keyHandler);
  }

  function renderKanaChart(subEl, isKatakana, rootContainer) {
    const rows = window.NihongoData.kanaRows;
    const store = window.NihongoStore;
    const idx = isKatakana ? 1 : 0;
    const allKana = flatKanaList(isKatakana);
    const masteredCount = allKana.filter(k => {
      const st = store.getKanaStat(k.glyph);
      return st.attempts >= 2 && (st.correct / st.attempts) >= 0.8;
    }).length;
    const drill = state.kanaDrill && state.kanaDrill.isKatakana === isKatakana ? state.kanaDrill : null;

    function heatClass(glyph) {
      const st = store.getKanaStat(glyph);
      if (st.attempts === 0) return '';
      const acc = st.correct / st.attempts;
      if (st.attempts >= 2 && acc >= 0.8) return 'kana-heat-high';
      if (acc >= 0.5) return 'kana-heat-mid';
      return 'kana-heat-low';
    }

    subEl.innerHTML = `
      ${drill ? `
        <section class="card kana-drill-card" style="margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong>🎮 ${isKatakana ? 'Katakana' : 'Hiragana'} Speed Drill</strong>
              <span class="muted small">${drill.score}/${drill.total} correct</span>
              ${drill.combo >= 2 ? `<span class="combo-pill">🔥 ×${drill.combo}</span>` : ''}
            </div>
            <button class="btn btn-xs btn-ghost" id="close-kana-drill">✕ Close Drill</button>
          </div>

          <div class="kana-drill-stage">
            <div class="kana-drill-prompt">
              <div class="kana-drill-glyph jp-text">${drill.target.glyph}</div>
              <button class="audio-btn" data-speak="${drill.target.speak}" title="Hear sound">🔊</button>
            </div>
            <div class="kana-drill-options">
              ${drill.options.map((opt, oIdx) => {
                let cls = 'option-btn';
                if (drill.chosen !== null) {
                  if (oIdx === drill.answerIndex) cls += ' correct';
                  else if (oIdx === drill.chosen) cls += ' incorrect';
                }
                return `
                  <button class="${cls}" data-kanaopt="${oIdx}" ${drill.chosen !== null ? 'disabled' : ''}>
                    <span class="option-key">${oIdx + 1}</span>
                    <span>${opt}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
          <div>
            <h3 style="margin:0;">${isKatakana ? 'Katakana (カタカナ)' : 'Hiragana (ひらがな)'} Gojūon Chart</h3>
            <p class="muted small" style="margin:2px 0 0;">
              Click any character to hear it. ${masteredCount}/${allKana.length} characters mastered (green) in Speed Drill.
            </p>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            ${!drill ? `<button class="btn btn-primary btn-sm" id="start-kana-drill">🎮 Start Speed Drill</button>` : ''}
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="kana-table">
            <thead>
              <tr>
                <th>Row</th>
                <th>-a</th>
                <th>-i</th>
                <th>-u</th>
                <th>-e</th>
                <th>-o</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(r => `
                <tr>
                  <th>${r.row}</th>
                  ${r.items.map(cell => {
                    if (!cell) return '<td></td>';
                    const glyph = cell[idx];
                    const st = store.getKanaStat(glyph);
                    const tip = st.attempts > 0
                      ? `${cell[2]} · ${st.correct}/${st.attempts} (${Math.round((st.correct / st.attempts) * 100)}%)`
                      : `Pronounce ${cell[2]}`;
                    return `
                      <td>
                        <button class="kana-cell ${heatClass(glyph)}" style="width:100%;" data-speak="${cell[0]}" title="${tip}">
                          <span class="kana-glyph jp-text">${glyph}</span>
                          <span class="kana-romaji">${cell[2]}</span>
                        </button>
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    subEl.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', () => window.NihongoAudio.speak(btn.dataset.speak, 0.85));
    });

    const startBtn = subEl.querySelector('#start-kana-drill');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        nextKanaRound(isKatakana, null);
        renderKanaChart(subEl, isKatakana, rootContainer);
      });
    }

    const closeBtn = subEl.querySelector('#close-kana-drill');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        state.kanaDrill = null;
        renderKanaChart(subEl, isKatakana, rootContainer);
      });
    }

    subEl.querySelectorAll('[data-kanaopt]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!drill || drill.chosen !== null) return;
        const chosenIdx = Number(btn.dataset.kanaopt);
        const isCorrect = chosenIdx === drill.answerIndex;
        drill.chosen = chosenIdx;
        drill.total += 1;
        if (isCorrect) {
          drill.score += 1;
          drill.combo += 1;
          if (drill.combo > drill.bestCombo) drill.bestCombo = drill.combo;
        } else {
          drill.combo = 0;
        }
        store.recordKanaResult(drill.target.glyph, isCorrect);
        window.NihongoAudio.speak(drill.target.speak, 0.9);
        renderKanaChart(subEl, isKatakana, rootContainer);
        const picked = subEl.querySelector(`[data-kanaopt="${chosenIdx}"]`);
        if (picked) window.NihongoFx.pulse(picked, isCorrect ? 'fx-pop' : 'fx-shake');

        setTimeout(() => {
          if (state.kanaDrill === drill) {
            nextKanaRound(isKatakana, drill);
            if (state.subTab === (isKatakana ? 'katakana' : 'hiragana')) {
              renderKanaChart(subEl, isKatakana, rootContainer);
            }
          }
        }, isCorrect ? 620 : 1150);
      });
    });
  }

  return { render, cleanup: detachKeys };
})();

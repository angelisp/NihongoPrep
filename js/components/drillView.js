/* ==========================================================================
   Targeted Practice Drills (練習ドリル)
   Particles, Verb/Adj Conjugation, Dynamic Vocab Quiz, ★ Star Ordering
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.drills = (function () {
  let activeSession = null;

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildVocabQuestions(count) {
    const all = window.NihongoData.vocab;
    const kanjiWords = all.filter(w => w.kanji !== w.kana);
    const chosen = shuffle(all).slice(0, count);

    return chosen.map((word, idx) => {
      // Alternate between Kanji Reading (if word has kanji) and Meaning recall
      const doReading = word.kanji !== word.kana && idx % 2 === 0;
      if (doReading) {
        const distractors = shuffle(kanjiWords.filter(w => w.id !== word.id && w.kana !== word.kana))
          .slice(0, 3)
          .map(w => w.kana);
        const options = shuffle([word.kana, ...distractors]);
        return {
          prompt: `Choose the correct hiragana reading for <strong style="font-size:1.4em;">${word.kanji}</strong>:`,
          options,
          answerIndex: options.indexOf(word.kana),
          explanation: `${word.kanji} is read ${word.kana} (${word.romaji}) and means "${word.meaning}".`
        };
      } else {
        const distractors = shuffle(all.filter(w => w.id !== word.id && w.meaning !== word.meaning))
          .slice(0, 3)
          .map(w => w.meaning);
        const options = shuffle([word.meaning, ...distractors]);
        const display = word.kanji !== word.kana
          ? `<ruby>${word.kanji}<rt>${word.kana}</rt></ruby>`
          : word.kana;
        return {
          prompt: `What does <strong style="font-size:1.35em;">${display}</strong> mean?`,
          options,
          answerIndex: options.indexOf(word.meaning),
          explanation: `${word.kanji} (${word.kana} / ${word.romaji}) means "${word.meaning}". Example: ${word.exampleEn}`
        };
      }
    });
  }

  function startDrill(type) {
    const drills = window.NihongoData.drills;
    let title = '';
    let questions = [];
    let isStar = false;

    if (type === 'particles') {
      title = 'Particle Fill-in Drill · 助詞ドリル';
      questions = shuffle(drills.particles).slice(0, 10);
    } else if (type === 'conjugation') {
      title = 'Verb & Adjective Conjugation · 活用ドリル';
      questions = shuffle(drills.conjugation).slice(0, 10);
    } else if (type === 'starOrder') {
      title = '★ Sentence Ordering · 並び替え (JLPT N5 Format)';
      questions = shuffle(drills.starOrder);
      isStar = true;
    } else {
      title = 'Vocabulary & Kanji Quiz · 語彙クイズ';
      questions = buildVocabQuestions(10);
    }

    activeSession = {
      type,
      title,
      isStar,
      questions,
      index: 0,
      selected: null,
      score: 0,
      finished: false
    };
  }

  function renderStarSentence(q) {
    const slots = [0, 1, 2, 3].map(i => {
      if (i === q.starPos) {
        return `<span class="star-slot is-star">★</span>`;
      }
      return `<span class="star-slot">＿</span>`;
    }).join('');
    return `<div class="star-sentence-box jp-text">${q.before} ${slots} ${q.after}</div>`;
  }

  function render(container, opts) {
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
    const stats = window.NihongoStore.getState().stats;
    const accuracy = stats.drillTotal > 0 ? Math.round((stats.drillCorrect / stats.drillTotal) * 100) : 0;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Practice Drills · 練習ドリル</h2>
          <p>Focused 5-minute drills with instant grammatical explanations. ${stats.drillsCompleted} completed · ${accuracy}% lifetime accuracy.</p>
        </div>
      </div>

      <section class="drill-selector-grid">
        <div class="card card-interactive" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="action-icon" style="background:var(--indigo-soft); color:var(--indigo);">助</span>
            <span class="badge badge-neutral">10 Questions</span>
          </div>
          <h3 style="margin:4px 0 0;">Particle Fill-in (助詞)</h3>
          <p class="muted small" style="margin:0; flex:1;">
            Master the trickiest N5 particles: は, が, を, に, で, へ, と, や, も, から, まで.
          </p>
          <button class="btn btn-primary btn-sm" data-start-drill="particles">Start Particle Drill</button>
        </div>

        <div class="card card-interactive" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="action-icon" style="background:var(--success-soft); color:var(--success);">活</span>
            <span class="badge badge-neutral">10 Questions</span>
          </div>
          <h3 style="margin:4px 0 0;">Verb &amp; Adjective Forms (活用)</h3>
          <p class="muted small" style="margin:0; flex:1;">
            Drill て-form rules (行く→行って, 泳ぐ→泳いで), い-adj past/neg, and な-adj traps (きれい, 有名).
          </p>
          <button class="btn btn-primary btn-sm" data-start-drill="conjugation">Start Conjugation Drill</button>
        </div>

        <div class="card card-interactive" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="action-icon" style="background:var(--accent-soft); color:var(--accent);">★</span>
            <span class="badge badge-warning">JLPT Exam Favorite</span>
          </div>
          <h3 style="margin:4px 0 0;">★ Sentence Ordering (並び替え)</h3>
          <p class="muted small" style="margin:0; flex:1;">
            Practice the official JLPT grammar star-slot question format — reorder 4 fragments and pick what fits ★!
          </p>
          <button class="btn btn-primary btn-sm" data-start-drill="starOrder">Start ★ Ordering Drill</button>
        </div>

        <div class="card card-interactive" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="action-icon" style="background:var(--purple-soft); color:var(--purple);">語</span>
            <span class="badge badge-neutral">Dynamic · 10 Qs</span>
          </div>
          <h3 style="margin:4px 0 0;">Vocab &amp; Kanji Speed Quiz</h3>
          <p class="muted small" style="margin:0; flex:1;">
            Freshly generated every run from our ${window.NihongoData.vocab.length}-word bank — alternating Kanji readings and meanings.
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
    const s = activeSession;
    const q = s.questions[s.index];
    const pct = Math.round((s.index / s.questions.length) * 100);

    container.innerHTML = `
      <div class="quiz-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:10px; flex-wrap:wrap;">
          <div>
            <strong>${s.title}</strong>
            <span class="muted small" style="margin-left:8px;">Question ${s.index + 1} / ${s.questions.length}</span>
          </div>
          <button class="btn btn-ghost btn-xs" id="exit-drill-btn">✕ Exit Drill</button>
        </div>

        <div class="progress-track" style="margin-bottom:18px;">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>

        <div class="card">
          ${s.isStar ? `
            <span class="badge badge-warning">Arrange the 4 pieces &amp; pick which goes in ★</span>
            ${renderStarSentence(q)}
          ` : `
            <div class="quiz-prompt jp-text">${q.prompt}</div>
          `}

          <div class="option-list">
            ${q.options.map((opt, idx) => {
              let cls = 'option-btn jp-text';
              if (s.selected !== null) {
                if (idx === q.answerIndex) cls += ' correct';
                else if (idx === s.selected) cls += ' incorrect';
              }
              return `
                <button class="${cls}" data-opt="${idx}" ${s.selected !== null ? 'disabled' : ''}>
                  <span class="option-key">${idx + 1}</span>
                  <span>${opt}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${s.selected !== null ? `
            <div class="feedback-banner ${s.selected === q.answerIndex ? 'correct' : 'incorrect'}">
              <strong>${s.selected === q.answerIndex ? '✓ Correct! 正解！' : '✕ Not quite!'}</strong>
              ${s.isStar ? `<div class="jp-text" style="font-weight:700; margin:6px 0;">${q.orderedText}</div>` : ''}
              <div>${q.explanation}</div>
            </div>
            <div style="display:flex; justify-content:flex-end; margin-top:12px;">
              <button class="btn btn-primary" id="next-drill-q">
                ${s.index + 1 < s.questions.length ? 'Next Question →' : 'See Results →'}
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    container.querySelector('#exit-drill-btn').addEventListener('click', () => {
      activeSession = null;
      render(container);
    });

    container.querySelectorAll('[data-opt]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (s.selected !== null) return;
        s.selected = Number(btn.dataset.opt);
        if (s.selected === q.answerIndex) s.score += 1;
        renderQuestion(container);
      });
    });

    const nextBtn = container.querySelector('#next-drill-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (s.index + 1 < s.questions.length) {
          s.index += 1;
          s.selected = null;
          renderQuestion(container);
        } else {
          s.finished = true;
          window.NihongoStore.recordDrillResult(s.score, s.questions.length);
          renderSummary(container);
        }
      });
    }
  }

  function renderSummary(container) {
    const s = activeSession;
    const pct = Math.round((s.score / s.questions.length) * 100);
    const xpEarned = s.score * 10 + 10;

    container.innerHTML = `
      <div class="quiz-card">
        <div class="card score-hero">
          <div class="score-circle ${pct >= 70 ? '' : 'fail'}">
            <span style="font-size:2rem; line-height:1;">${pct}%</span>
            <small style="font-size:0.78rem;">${s.score}/${s.questions.length}</small>
          </div>
          <h2 style="margin:0 0 6px;">${pct >= 80 ? '素晴らしい！ Excellent work!' : pct >= 60 ? 'Good progress! いい調子です！' : 'Keep practicing! 頑張りましょう！'}</h2>
          <p class="muted">You earned <strong>+${xpEarned} XP</strong> on ${s.title}.</p>
          <div class="btn-row" style="justify-content:center; margin-top:20px;">
            <button class="btn btn-primary" id="retry-drill-btn">Practice Again</button>
            <button class="btn btn-secondary" id="back-drill-lobby">All Drills</button>
            <button class="btn btn-indigo" id="go-mock-exam">Take Mock Exam 📝</button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#retry-drill-btn').addEventListener('click', () => {
      startDrill(s.type);
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

  return { render };
})();

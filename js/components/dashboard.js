/* ==========================================================================
   Dashboard View (ホーム)
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.dashboard = function (container) {
  const store = window.NihongoStore;
  const state = store.getState();
  const readiness = store.getReadiness();
  const { dueReview, fresh } = store.getDueVocabIds();

  // Deterministic "of the day" spotlight
  const daySeed = Math.floor(Date.now() / 86400000);
  const vocabList = window.NihongoData.vocab;
  const grammarList = window.NihongoData.grammar;
  const spotlightWord = vocabList[daySeed % vocabList.length];
  const spotlightGrammar = grammarList[daySeed % grammarList.length];

  const posLabelMap = {
    noun: 'Noun · 名詞',
    'i-adj': 'い-Adjective',
    'na-adj': 'な-Adjective',
    verb: 'Verb · 動詞',
    adverb: 'Adverb / Expr.'
  };

  container.innerHTML = `
    <section class="hero-banner">
      <div>
        <span class="hero-eyebrow">JLPT N5 REVISION STUDIO · 日本語能力試験 N5</span>
        <h2>Keep building your N5 fluency.</h2>
        <p>
          Revise vocabulary with spaced-repetition flashcards, master core N5 grammar patterns and particles,
          and test yourself under authentic JLPT exam conditions.
        </p>
        <div class="btn-row">
          <button class="btn btn-primary" data-goto="vocab" data-sub="flashcards">
            🃏 Study Flashcards ${dueReview.length > 0 ? `(${dueReview.length} due)` : ''}
          </button>
          <button class="btn btn-secondary" data-goto="exam">
            📝 Take N5 Mock Exam
          </button>
        </div>
      </div>

      <div class="hero-stats">
        <div class="hero-stat-box">
          <div class="hero-stat-value">${readiness.overall}%</div>
          <div class="hero-stat-label">Overall N5 Readiness</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-value">🔥 ${state.stats.streak}</div>
          <div class="hero-stat-label">Day Study Streak</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-value">${readiness.vocabTouched}/${readiness.vocabTotal}</div>
          <div class="hero-stat-label">Vocab Reviewed</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-value">${state.stats.xp} XP</div>
          <div class="hero-stat-label">Total Study XP</div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions-grid">
      <button class="card card-interactive action-card" data-goto="vocab" data-sub="flashcards">
        <div class="action-card-top">
          <span class="action-icon" style="background: var(--accent-soft); color: var(--accent);">🃏</span>
          <span class="badge badge-neutral">${dueReview.length} due · ${fresh.length} new</span>
        </div>
        <h3>SRS Vocab Review</h3>
        <p>Practice nouns, い/な-adjectives, verbs &amp; adverbs with 3D flashcards.</p>
      </button>

      <button class="card card-interactive action-card" data-goto="grammar">
        <div class="action-card-top">
          <span class="action-icon" style="background: var(--indigo-soft); color: var(--indigo);">📘</span>
          <span class="badge badge-neutral">${readiness.grammarStudied}/${readiness.grammarTotal} studied</span>
        </div>
        <h3>Grammar Patterns</h3>
        <p>Core particles, て-form, comparisons, clauses &amp; inline quick checks.</p>
      </button>

      <button class="card card-interactive action-card" data-goto="listening">
        <div class="action-card-top">
          <span class="action-icon" style="background: var(--purple-soft); color: var(--purple);">🎧</span>
          <span class="badge badge-neutral">${readiness.listeningDone}/${readiness.listeningTotal} tracks</span>
        </div>
        <h3>Listening Practice</h3>
        <p>Spoken JLPT N5 dialogues with speed control &amp; revealable scripts.</p>
      </button>

      <button class="card card-interactive action-card" data-goto="drills">
        <div class="action-card-top">
          <span class="action-icon" style="background: var(--success-soft); color: var(--success);">⚡</span>
          <span class="badge badge-neutral">${state.stats.drillsCompleted} drills done</span>
        </div>
        <h3>Targeted Drills</h3>
        <p>Sharpen particles, verb conjugations, kanji readings &amp; ★ ordering.</p>
      </button>

      <button class="card card-interactive action-card" data-goto="exam">
        <div class="action-card-top">
          <span class="action-icon" style="background: var(--warning-soft); color: var(--warning);">📝</span>
          <span class="badge badge-neutral">${readiness.bestExam ? `Best: ${readiness.bestExam}%` : 'Not attempted'}</span>
        </div>
        <h3>JLPT N5 Mock Exam</h3>
        <p>Timed simulation with Vocabulary, Grammar, ★ Ordering &amp; Reading.</p>
      </button>
    </section>

    <!-- Progress Breakdown & Daily Spotlight -->
    <section class="dashboard-grid">
      <div class="card">
        <div class="section-header" style="margin-bottom: 8px;">
          <div>
            <h2 style="font-size: 1.15rem;">N5 Exam Pillar Progress</h2>
            <p class="small">Aim for 80%+ across all six pillars before test day.</p>
          </div>
        </div>

        <div class="pillar-list">
          <div>
            <div class="pillar-item-head">
              <strong>Vocabulary Mastery (語彙)</strong>
              <span class="muted">${readiness.vocabMastered} mastered · ${readiness.vocabTouched}/${readiness.vocabTotal} seen (${readiness.vocabPct}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${readiness.vocabPct}%"></div>
            </div>
          </div>

          <div>
            <div class="pillar-item-head">
              <strong>Grammar Curriculum (文法)</strong>
              <span class="muted">${readiness.grammarStudied}/${readiness.grammarTotal} patterns (${readiness.grammarPct}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill indigo" style="width: ${readiness.grammarPct}%"></div>
            </div>
          </div>

          <div>
            <div class="pillar-item-head">
              <strong>Essential N5 Kanji (漢字)</strong>
              <span class="muted">${readiness.kanjiStudied}/${readiness.kanjiTotal} characters (${readiness.kanjiPct}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill purple" style="width: ${readiness.kanjiPct}%"></div>
            </div>
          </div>

          <div>
            <div class="pillar-item-head">
              <strong>Listening Comprehension (聴解)</strong>
              <span class="muted">${readiness.listeningDone}/${readiness.listeningTotal} tracks (${readiness.listeningPct}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill indigo" style="width: ${readiness.listeningPct}%"></div>
            </div>
          </div>

          <div>
            <div class="pillar-item-head">
              <strong>Practice Drill Accuracy (練習)</strong>
              <span class="muted">${state.stats.drillTotal > 0 ? `${state.stats.drillCorrect}/${state.stats.drillTotal} correct (${readiness.drillPct}%)` : 'No drills yet'}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill success" style="width: ${readiness.drillPct}%"></div>
            </div>
          </div>

          <div>
            <div class="pillar-item-head">
              <strong>Best Mock Exam Score (模擬試験)</strong>
              <span class="muted">${readiness.bestExam ? `${readiness.bestExam}%` : 'Take your first mock'}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill warning" style="width: ${readiness.bestExam}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Spotlight -->
      <div class="card">
        <h2 style="font-size: 1.15rem; margin: 0 0 4px;">Today’s Spotlight · 今日のポイント</h2>
        <p class="muted small" style="margin: 0;">A fresh word and grammar point to reinforce daily.</p>

        <div class="spotlight-word">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <span class="badge badge-${spotlightWord.pos}">${posLabelMap[spotlightWord.pos]}</span>
            <button class="audio-btn" data-speak="${spotlightWord.kana}" title="Listen">🔊</button>
          </div>
          <div class="spotlight-jp jp-text" style="margin-top:6px;">
            ${spotlightWord.kanji !== spotlightWord.kana
              ? `<ruby>${spotlightWord.kanji}<rt>${spotlightWord.kana}</rt></ruby>`
              : spotlightWord.kana}
          </div>
          <div class="romaji">${spotlightWord.romaji}</div>
          <div style="font-weight:700; margin: 4px 0 8px;">${spotlightWord.meaning}</div>
          <div class="jp-text small">${spotlightWord.exampleJp}</div>
          <div class="muted small">${spotlightWord.exampleEn}</div>
        </div>

        <div class="spotlight-word" style="margin-top: 12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="badge badge-neutral">Grammar · ${spotlightGrammar.category}</span>
            <button class="btn btn-xs btn-ghost" data-goto="grammar" data-grammar-id="${spotlightGrammar.id}">Open →</button>
          </div>
          <div class="jp-text" style="font-weight:700; font-size:1.05rem; margin-top:6px;">${spotlightGrammar.pattern}</div>
          <div class="small muted" style="margin-top:2px;">${spotlightGrammar.meaning}</div>
        </div>
      </div>
    </section>

    ${state.examHistory.length > 0 ? `
      <section class="card">
        <div class="section-header" style="margin-bottom:12px;">
          <div>
            <h2 style="font-size:1.1rem;">Recent Mock Exam Attempts</h2>
          </div>
          <button class="btn btn-secondary btn-sm" data-goto="exam">View Exam Hall</button>
        </div>
        <div style="display:grid; gap:8px;">
          ${state.examHistory.slice(0, 4).map(h => {
            const pct = Math.round((h.score / h.total) * 100);
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:var(--bg-subtle); border-radius:8px; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong>${h.mode}</strong>
                  <span class="muted small" style="margin-left:8px;">${h.date}</span>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                  <strong>${h.score}/${h.total} (${pct}%)</strong>
                  <span class="badge ${h.passed ? 'badge-success' : 'badge-warning'}">${h.passed ? 'PASS' : 'KEEP STUDYING'}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    ` : ''}
  `;

  // Bind navigation triggers
  container.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => {
      const route = el.dataset.goto;
      const opts = {};
      if (el.dataset.sub) opts.subTab = el.dataset.sub;
      if (el.dataset.grammarId) opts.grammarId = el.dataset.grammarId;
      window.NihongoApp.navigate(route, opts);
    });
  });

  // Bind audio buttons
  container.querySelectorAll('[data-speak]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      window.NihongoAudio.speak(btn.dataset.speak);
    });
  });
};

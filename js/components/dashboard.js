/* ==========================================================================
   Dashboard View (ホーム)
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.dashboard = function (container) {
  const store = window.NihongoStore;
  const state = store.getState();
  const readiness = store.getReadiness();
  const level = store.getLevelInfo();
  const daily = store.getDailyProgress();
  const streak = store.getEffectiveStreak();
  const { dueReview, fresh } = store.getDueVocabIds();
  const nextUp = store.getNextUp();
  const quests = store.getDailyQuests();
  const mistakeCount = store.getMistakeCount();
  const history14 = store.getActivityHistory(14);
  const activeDays14 = history14.filter(d => d.xp > 0).length;
  const completedQuests = quests.filter(q => q.completed).length;

  // Deterministic "of the day" spotlight, preferring unmastered/unstudied items
  const daySeed = Math.floor(Date.now() / 86400000);
  const vocabList = window.NihongoData.vocab;
  const grammarList = window.NihongoData.grammar;
  const unmasteredVocab = vocabList.filter(w => store.getVocabStatus(w.id) !== 'mastered');
  const vocabPool = unmasteredVocab.length ? unmasteredVocab : vocabList;
  const unstudiedGrammar = grammarList.filter(g => !state.studiedGrammar.includes(g.id));
  const grammarPool = unstudiedGrammar.length ? unstudiedGrammar : grammarList;
  const spotlightWord = vocabPool[daySeed % vocabPool.length];
  const spotlightGrammar = grammarPool[daySeed % grammarPool.length];

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
        <span class="hero-eyebrow">NEXT UP · ${nextUp.eyebrow}</span>
        <h2>${nextUp.title}</h2>
        <p>${nextUp.reason}</p>
        <div class="btn-row">
          <button class="btn btn-primary"
                  data-goto="${nextUp.route}"
                  ${nextUp.opts && nextUp.opts.subTab ? `data-sub="${nextUp.opts.subTab}"` : ''}
                  ${nextUp.opts && nextUp.opts.drillType ? `data-drill-type="${nextUp.opts.drillType}"` : ''}>
            ${nextUp.cta}
          </button>
          ${mistakeCount > 0 && !(nextUp.opts && nextUp.opts.drillType === 'mistakes') ? `
            <button class="btn btn-secondary" data-goto="drills" data-drill-type="mistakes">
              🎯 Fix Mistakes (${mistakeCount})
            </button>
          ` : `
            <button class="btn btn-secondary" data-goto="exam">
              📝 Take N5 Mock Exam
            </button>
          `}
        </div>
      </div>

      <div class="hero-stats">
        <div class="hero-stat-box hero-level-box">
          <div class="hero-stat-value">Lv <span data-countup="${level.level}">${level.level}</span></div>
          <div class="hero-stat-label"><span class="jp-text">${level.rank.jp}</span> · ${level.rank.en}</div>
          <div class="progress-track hero-track">
            <div class="progress-fill" style="width: ${level.progressPct}%"></div>
          </div>
          <div class="hero-stat-label">${level.toNext} XP to Lv ${level.level + 1}</div>
        </div>
        <div class="hero-stat-box hero-goal-box">
          <div class="goal-ring lg ${daily.done ? 'done' : ''}" data-pct="${daily.pct}" style="--pct: ${daily.pct}">
            <span>${daily.done ? '✓' : `${daily.pct}%`}</span>
          </div>
          <div>
            <div class="hero-stat-value hero-goal-value"><span data-countup="${daily.xp}">${daily.xp}</span>/${daily.goal}</div>
            <div class="hero-stat-label">${daily.done ? 'Daily goal complete 🎯' : 'XP toward today’s goal'}</div>
          </div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-value"><span data-countup="${readiness.overall}" data-suffix="%">${readiness.overall}%</span></div>
          <div class="hero-stat-label">Overall N5 Readiness</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-value">🔥 <span data-countup="${streak}">${streak}</span></div>
          <div class="hero-stat-label">Day Study Streak · <span data-countup="${state.stats.xp}">${state.stats.xp}</span> XP total</div>
        </div>
      </div>
    </section>

    <!-- Daily Quests & 14-Day Study Activity -->
    <section class="dashboard-grid">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px;">
          <div>
            <h2 style="font-size:1.12rem; margin:0;">Today’s Quests · 今日のクエスト</h2>
            <p class="muted small" style="margin:2px 0 0;">Tailored daily goals based on your weakest areas.</p>
          </div>
          <span class="badge ${completedQuests === quests.length ? 'badge-success' : 'badge-neutral'}">
            ${completedQuests}/${quests.length} Done
          </span>
        </div>

        <div class="quest-list">
          ${quests.map(q => {
            const qPct = Math.round((q.progress / q.target) * 100);
            return `
              <div class="quest-item ${q.completed ? 'completed' : ''}">
                <div class="quest-top">
                  <div class="quest-title">
                    <span class="quest-check">${q.completed ? '✓' : '○'}</span>
                    <span>${q.title}</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
                    <span class="badge ${q.completed ? 'badge-success' : 'badge-warning'}">+${q.rewardXp} XP</span>
                    ${!q.completed ? `
                      <button class="btn btn-xs btn-ghost"
                              data-goto="${q.route}"
                              ${q.opts && q.opts.subTab ? `data-sub="${q.opts.subTab}"` : ''}
                              ${q.opts && q.opts.drillType ? `data-drill-type="${q.opts.drillType}"` : ''}>
                        Go →
                      </button>
                    ` : ''}
                  </div>
                </div>
                <div class="quest-progress-row">
                  <div class="progress-track" style="flex:1; height:6px;">
                    <div class="progress-fill ${q.completed ? 'success' : ''}" style="width:${qPct}%"></div>
                  </div>
                  <span class="muted small">${q.progress}/${q.target}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; gap:14px;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px;">
            <div>
              <h2 style="font-size:1.12rem; margin:0;">14-Day Activity · 学習記録</h2>
              <p class="muted small" style="margin:2px 0 0;">Active ${activeDays14} of the last 14 days</p>
            </div>
            <span class="badge badge-neutral">Goal: ${daily.goal} XP/day</span>
          </div>

          <div class="heatmap-grid" role="list" aria-label="14-day study activity">
            ${history14.map(day => `
              <div class="heatmap-cell lv-${day.level} ${day.isToday ? 'is-today' : ''}"
                   role="listitem"
                   title="${day.label}: ${day.xp} XP${day.goalMet ? ' (Goal met ✓)' : ''}">
                <span class="heatmap-day">${day.shortDay}</span>
              </div>
            `).join('')}
          </div>
          <div class="heatmap-legend small muted">
            <span>Less</span>
            <i class="lv-0"></i><i class="lv-1"></i><i class="lv-2"></i><i class="lv-3"></i><i class="lv-4"></i>
            <span>More</span>
          </div>
        </div>

        <div class="mistake-mini-bar ${mistakeCount > 0 ? 'has-items' : ''}">
          <div>
            <strong>${mistakeCount > 0 ? `🎯 ${mistakeCount} weak item${mistakeCount === 1 ? '' : 's'} in Mistake Bank` : '✨ Mistake Bank is clear'}</strong>
            <div class="small muted">
              ${mistakeCount > 0 ? 'Review missed drill, grammar & exam questions.' : 'Missed quiz questions will appear here for targeted practice.'}
            </div>
          </div>
          ${mistakeCount > 0 ? `<button class="btn btn-xs btn-primary" data-goto="drills" data-drill-type="mistakes">Fix →</button>` : ''}
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
          ${state.examHistory.slice(0, 4).map((h, i) => {
            const pct = Math.round((h.score / h.total) * 100);
            const prev = state.examHistory[i + 1];
            const delta = prev ? pct - Math.round((prev.score / prev.total) * 100) : null;
            const deltaBadge = delta !== null && delta !== 0
              ? `<span class="badge ${delta > 0 ? 'badge-success' : 'badge-danger'}">${delta > 0 ? `↑ +${delta}%` : `↓ ${delta}%`}</span>`
              : '';
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:var(--bg-subtle); border-radius:8px; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong>${h.mode}</strong>
                  <span class="muted small" style="margin-left:8px;">${h.date}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  ${deltaBadge}
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
      if (el.dataset.drillType) opts.drillType = el.dataset.drillType;
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

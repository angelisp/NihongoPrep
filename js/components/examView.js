/* ==========================================================================
   JLPT N5 Mock Exam Simulator (模擬試験)
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.exam = (function () {
  let session = null;
  let timerId = null;

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function buildExamQuestions(mode) {
    const all = window.NihongoData.mockExam;
    if (mode === 'mini') {
      const vocab = all.filter(q => q.section === 'vocab').slice(0, 5);
      const grammar = all.filter(q => q.section === 'grammar').slice(0, 4);
      const reading = all.filter(q => q.section === 'reading').slice(0, 4); // 2 full passages
      return [...vocab, ...grammar, ...reading];
    }
    return all.slice();
  }

  function startTimer(container) {
    stopTimer();
    if (!session || !session.timed || session.submitted) return;
    timerId = setInterval(() => {
      if (!session || session.submitted) {
        stopTimer();
        return;
      }
      session.remainingSec -= 1;
      const timerEl = document.getElementById('exam-timer-display');
      if (timerEl) {
        timerEl.textContent = `⏱ ${formatTime(Math.max(0, session.remainingSec))}`;
        timerEl.classList.toggle('low', session.remainingSec <= 120);
      }
      if (session.remainingSec <= 0) {
        stopTimer();
        submitExam(container);
        window.NihongoApp.toast('Time is up! Exam submitted automatically.');
      }
    }, 1000);
  }

  function startExam(mode, timed, container) {
    stopTimer();
    const questions = buildExamQuestions(mode);
    const durationSec = mode === 'mini' ? 12 * 60 : 25 * 60;

    session = {
      mode: mode === 'mini' ? 'Quick Mini-Mock (13 Qs)' : 'Full N5 Practice Exam (24 Qs)',
      modeKey: mode,
      timed,
      questions,
      answers: {}, // { [idx]: optionIdx }
      flagged: new Set(),
      index: 0,
      remainingSec: durationSec,
      submitted: false,
      reviewFilter: 'all',
      result: null
    };

    startTimer(container);
    render(container);
  }

  function submitExam(container) {
    if (!session || session.submitted) return;
    stopTimer();
    session.submitted = true;

    const sectionStats = {
      vocab: { label: 'Vocabulary & Kanji (文字・語彙)', correct: 0, total: 0 },
      grammar: { label: 'Grammar (文法)', correct: 0, total: 0 },
      reading: { label: 'Reading Comprehension (読解)', correct: 0, total: 0 }
    };

    let totalCorrect = 0;
    const store = window.NihongoStore;
    session.questions.forEach((q, idx) => {
      const sec = sectionStats[q.section];
      sec.total += 1;
      if (session.answers[idx] === q.answerIndex) {
        totalCorrect += 1;
        sec.correct += 1;
        store.clearMistake(`exam:${q.id}`);
      } else {
        store.recordMistake('exam', q.id, `Exam · ${q.sectionLabel}`);
      }
    });

    const overallPct = Math.round((totalCorrect / session.questions.length) * 100);
    const sectionalOk = Object.values(sectionStats).every(
      s => s.total === 0 || (s.correct / s.total) >= 0.45
    );
    const passed = overallPct >= 65 && sectionalOk;

    const today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    session.result = {
      score: totalCorrect,
      total: session.questions.length,
      overallPct,
      passed,
      sectionalOk,
      sections: sectionStats
    };

    const xpEarned = window.NihongoStore.recordExamResult({
      date: today,
      mode: session.mode,
      score: totalCorrect,
      total: session.questions.length,
      passed,
      sections: {
        vocab: `${sectionStats.vocab.correct}/${sectionStats.vocab.total}`,
        grammar: `${sectionStats.grammar.correct}/${sectionStats.grammar.total}`,
        reading: `${sectionStats.reading.correct}/${sectionStats.reading.total}`
      }
    });
    session.result.xpEarned = xpEarned;
    session.result.celebrated = false;

    render(container);
  }

  function renderStarBox(q) {
    const slots = [0, 1, 2, 3].map(i =>
      i === q.starPos
        ? `<span class="star-slot is-star">★</span>`
        : `<span class="star-slot">＿</span>`
    ).join('');
    return `<div class="star-sentence-box jp-text">${q.starBefore} ${slots} ${q.starAfter}</div>`;
  }

  function render(container) {
    if (!session) {
      renderLobby(container);
    } else if (session.submitted) {
      renderReport(container);
    } else {
      startTimer(container);
      renderActiveExam(container);
    }
  }

  function renderLobby(container) {
    const store = window.NihongoStore;
    const history = store.getState().examHistory;
    const readiness = store.getReadiness();

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>JLPT N5 Mock Exam Hall · 模擬試験</h2>
          <p>Simulate real JLPT N5 test structure across Kanji/Vocabulary, Grammar (including ★ Sentence Ordering), and Reading Passages.</p>
        </div>
      </div>

      ${readiness.overall < 45 ? `
        <div class="card readiness-nudge" style="margin-bottom:18px;">
          <strong>💡 Readiness is ${readiness.overall}%</strong> — You’re welcome to try the full exam anytime, or start with the <strong>13-question Mini-Mock</strong> for a quick baseline.
        </div>
      ` : ''}

      <div class="dashboard-grid">
        <div class="card">
          <span class="badge badge-noun">Recommended · Full Simulation</span>
          <h3 style="margin:10px 0 6px; font-size:1.25rem;">Full JLPT N5 Practice Exam</h3>
          <p class="muted small">
            <strong>24 Questions</strong> across all 3 written JLPT N5 domains:
          </p>
          <ul class="small muted" style="padding-left:18px; margin:8px 0 16px;">
            <li><strong>Section 1 — Vocabulary &amp; Kanji (10 Qs):</strong> Kanji reading, orthography, context &amp; paraphrases</li>
            <li><strong>Section 2 — Grammar (8 Qs):</strong> Particles, verb/adj forms &amp; ★ star sentence ordering</li>
            <li><strong>Section 3 — Reading (6 Qs):</strong> Library notice, friend’s email &amp; short essay</li>
          </ul>
          <div class="btn-row">
            <button class="btn btn-primary" data-launch="full" data-timed="1">⏱ Start Timed (25 min)</button>
            <button class="btn btn-secondary" data-launch="full" data-timed="0">Start Untimed</button>
          </div>
        </div>

        <div class="card">
          <span class="badge badge-warning">Express Checkup</span>
          <h3 style="margin:10px 0 6px; font-size:1.25rem;">Quick N5 Mini-Mock</h3>
          <p class="muted small">
            Short on time? Take a balanced <strong>13-question</strong> diagnostic covering every question style in 12 minutes.
          </p>
          <ul class="small muted" style="padding-left:18px; margin:8px 0 16px;">
            <li>5 Vocabulary &amp; Kanji questions</li>
            <li>4 Grammar questions</li>
            <li>4 Reading Comprehension questions (2 passages)</li>
          </ul>
          <div class="btn-row">
            <button class="btn btn-indigo" data-launch="mini" data-timed="1">⏱ Start Mini-Mock (12 min)</button>
            <button class="btn btn-secondary" data-launch="mini" data-timed="0">Start Untimed</button>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px;">
        <h3 style="margin:0 0 6px; font-size:1.05rem;">🎯 How JLPT N5 Passing Works</h3>
        <p class="small muted" style="margin:0;">
          The real JLPT N5 requires passing <strong>both</strong> an overall score threshold and minimum sectional scores (so you cannot pass by acing vocab while failing reading).
          In NihongoPrep, a passing mock score requires <strong>65%+ overall</strong> and at least <strong>45% in every section</strong>.
          Tip: toggle <strong>ふりがな OFF</strong> in the top bar for authentic exam difficulty!
        </p>
      </div>

      ${history.length > 0 ? `
        <div class="card">
          <h3 style="margin:0 0 12px; font-size:1.05rem;">Past Mock Exam History</h3>
          <div style="display:grid; gap:8px;">
            ${history.map((h, i) => {
              const pct = Math.round((h.score / h.total) * 100);
              const prev = history[i + 1];
              const delta = prev ? pct - Math.round((prev.score / prev.total) * 100) : null;
              const deltaBadge = delta !== null && delta !== 0
                ? `<span class="badge ${delta > 0 ? 'badge-success' : 'badge-danger'}">${delta > 0 ? `↑ +${delta}%` : `↓ ${delta}%`}</span>`
                : '';
              return `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding:10px 12px; background:var(--bg-subtle); border-radius:8px;">
                  <div>
                    <strong>${h.mode}</strong>
                    <span class="muted small" style="margin-left:8px;">${h.date}</span>
                    ${h.sections ? `<div class="muted small">Vocab ${h.sections.vocab} · Grammar ${h.sections.grammar} · Reading ${h.sections.reading}</div>` : ''}
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    ${deltaBadge}
                    <strong>${h.score}/${h.total} (${pct}%)</strong>
                    <span class="badge ${h.passed ? 'badge-success' : 'badge-warning'}">${h.passed ? 'PASS' : 'RETRY'}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    `;

    container.querySelectorAll('[data-launch]').forEach(btn => {
      btn.addEventListener('click', () => {
        startExam(btn.dataset.launch, btn.dataset.timed === '1', container);
      });
    });
  }

  function renderActiveExam(container) {
    const s = session;
    const q = s.questions[s.index];
    const answeredCount = Object.keys(s.answers).length;
    const isFlagged = s.flagged.has(s.index);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
        <div>
          <strong style="font-size:1.05rem;">${s.mode}</strong>
          <span class="muted small" style="margin-left:10px;">Answered ${answeredCount}/${s.questions.length}</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          ${s.timed ? `<span class="exam-timer ${s.remainingSec <= 120 ? 'low' : ''}" id="exam-timer-display">⏱ ${formatTime(s.remainingSec)}</span>` : '<span class="badge badge-neutral">Untimed Practice</span>'}
          <button class="btn btn-ghost btn-sm" id="quit-exam-btn">Exit</button>
        </div>
      </div>

      <div class="exam-layout">
        <!-- Active Question Card -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
            <span class="badge badge-noun">Q${s.index + 1} · ${q.sectionLabel}</span>
            <button class="btn btn-xs ${isFlagged ? 'btn-primary' : 'btn-secondary'}" id="flag-q-btn">
              ⚑ ${isFlagged ? 'Flagged' : 'Flag for Review'}
            </button>
          </div>

          <p class="muted small" style="margin:0 0 12px;">${q.instruction}</p>

          ${q.passage ? `
            <div class="reading-passage jp-text">
              <div style="font-weight:700; margin-bottom:6px; color:var(--accent);">${q.passageTitle}</div>
              <div>${q.passage}</div>
            </div>
          ` : ''}

          ${q.isStar ? renderStarBox(q) : `<div class="quiz-prompt jp-text">${q.cleanPrompt}</div>`}

          <div class="option-list">
            ${q.options.map((opt, optIdx) => `
              <button class="option-btn jp-text ${s.answers[s.index] === optIdx ? 'selected' : ''}" data-eopt="${optIdx}">
                <span class="option-key">${optIdx + 1}</span>
                <span>${opt}</span>
              </button>
            `).join('')}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:14px; border-top:1px solid var(--border);">
            <button class="btn btn-secondary btn-sm" id="prev-q-btn" ${s.index === 0 ? 'disabled' : ''}>← Previous</button>
            ${s.index + 1 < s.questions.length
              ? `<button class="btn btn-primary btn-sm" id="next-q-btn">Next Question →</button>`
              : `<button class="btn btn-primary btn-sm" id="submit-exam-inline">Finish &amp; Grade Exam ✓</button>`
            }
          </div>
        </div>

        <!-- Question Navigator Palette -->
        <aside class="card">
          <h3 style="margin:0 0 6px; font-size:0.95rem;">Question Navigator</h3>
          <p class="muted small" style="margin:0;">Jump to any question or review flagged items.</p>
          <div class="palette-grid">
            ${s.questions.map((_, i) => {
              const cls = [
                'palette-btn',
                i === s.index ? 'current' : '',
                s.answers[i] !== undefined ? 'answered' : '',
                s.flagged.has(i) ? 'flagged' : ''
              ].filter(Boolean).join(' ');
              return `<button class="${cls}" data-jump="${i}">${i + 1}</button>`;
            }).join('')}
          </div>
          <div class="small muted" style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:14px;">
            <span>■ Blue: Answered</span>
            <span>⚑ Flagged</span>
          </div>
          <button class="btn btn-primary" style="width:100%;" id="submit-exam-btn">
            Submit Exam (${answeredCount}/${s.questions.length})
          </button>
        </aside>
      </div>
    `;

    container.querySelectorAll('[data-eopt]').forEach(btn => {
      btn.addEventListener('click', () => {
        s.answers[s.index] = Number(btn.dataset.eopt);
        renderActiveExam(container);
      });
    });

    container.querySelector('#flag-q-btn').addEventListener('click', () => {
      if (s.flagged.has(s.index)) s.flagged.delete(s.index);
      else s.flagged.add(s.index);
      renderActiveExam(container);
    });

    const prevBtn = container.querySelector('#prev-q-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (s.index > 0) {
          s.index -= 1;
          renderActiveExam(container);
        }
      });
    }

    const nextBtn = container.querySelector('#next-q-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (s.index + 1 < s.questions.length) {
          s.index += 1;
          renderActiveExam(container);
        }
      });
    }

    container.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => {
        s.index = Number(btn.dataset.jump);
        renderActiveExam(container);
      });
    });

    function confirmAndSubmit() {
      const unanswered = s.questions.length - Object.keys(s.answers).length;
      if (unanswered > 0 && !window.confirm(`You have ${unanswered} unanswered question(s). Submit exam now?`)) {
        return;
      }
      submitExam(container);
    }

    const submitBtn = container.querySelector('#submit-exam-btn');
    if (submitBtn) submitBtn.addEventListener('click', confirmAndSubmit);
    const submitInline = container.querySelector('#submit-exam-inline');
    if (submitInline) submitInline.addEventListener('click', confirmAndSubmit);

    container.querySelector('#quit-exam-btn').addEventListener('click', () => {
      if (window.confirm('Leave this mock exam? Your current answers will be discarded.')) {
        stopTimer();
        session = null;
        renderLobby(container);
      }
    });
  }

  function renderReport(container) {
    const s = session;
    const r = s.result;

    const reviewItems = s.questions
      .map((q, idx) => ({ q, idx, userAns: s.answers[idx], isCorrect: s.answers[idx] === q.answerIndex }))
      .filter(item => s.reviewFilter === 'all' || !item.isCorrect);

    container.innerHTML = `
      <section class="card score-hero" style="margin-bottom:20px;">
        <div class="score-circle ${r.passed ? '' : 'fail'}">
          <span style="font-size:2.1rem; line-height:1;" data-countup="${r.overallPct}" data-suffix="%">${r.overallPct}%</span>
          <small style="font-size:0.8rem;">${r.score}/${r.total}</small>
        </div>
        <span class="badge ${r.passed ? 'badge-success' : 'badge-warning'}" style="font-size:0.85rem; padding:5px 14px;">
          ${r.passed ? '🎉 JLPT N5 PASSING BENCHMARK MET (合格ライン)' : '📚 KEEP PRACTICING — AIM FOR 65%+ & 45% PER SECTION'}
        </span>
        <h2 style="margin:12px 0 6px;">${s.mode} — Score Report</h2>
        <p class="muted small" style="max-width:540px; margin:0 auto 18px;">
          ${r.xpEarned ? `<strong>+${r.xpEarned} XP earned.</strong> ` : ''}
          ${r.passed
            ? 'Great work! You cleared both the overall threshold and every individual section minimum.'
            : !r.sectionalOk
              ? 'One or more sections fell below the 45% sectional benchmark. Review the explanations below to close those gaps.'
              : 'Review your missed questions below and reinforce weak grammar or vocabulary points before retaking.'}
        </p>

        <div style="max-width:560px; margin:0 auto 20px; text-align:left; display:grid; gap:12px;">
          ${Object.values(r.sections).map(sec => {
            const p = sec.total ? Math.round((sec.correct / sec.total) * 100) : 0;
            return `
              <div>
                <div class="pillar-item-head">
                  <strong>${sec.label}</strong>
                  <span>${sec.correct}/${sec.total} (${p}%)</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill ${p >= 65 ? 'success' : p >= 45 ? 'warning' : ''}" style="width:${p}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="btn-row" style="justify-content:center;">
          ${s.questions.length - r.score > 0 ? `<button class="btn btn-primary" id="practice-exam-misses">🎯 Fix Missed Questions (${s.questions.length - r.score})</button>` : ''}
          <button class="btn ${s.questions.length - r.score > 0 ? 'btn-secondary' : 'btn-primary'}" id="retake-exam-btn">Retake Exam</button>
          <button class="btn btn-secondary" id="back-exam-lobby">Back to Exam Hall</button>
        </div>
      </section>

      <section>
        <div class="section-header">
          <div>
            <h3 style="margin:0;">Detailed Answer Review</h3>
            <p class="small">Inspect every question with grammatical and vocabulary explanations.</p>
          </div>
          <div class="segmented-tabs">
            <button class="segmented-tab ${s.reviewFilter === 'all' ? 'active' : ''}" data-rfilter="all">All (${s.questions.length})</button>
            <button class="segmented-tab ${s.reviewFilter === 'wrong' ? 'active' : ''}" data-rfilter="wrong">Missed (${s.questions.length - r.score})</button>
          </div>
        </div>

        <div style="display:grid; gap:12px;">
          ${reviewItems.length === 0 ? `
            <div class="card" style="text-align:center; padding:30px;">
              <strong>Perfect score! Zero missed questions. 満点おめでとうございます！</strong>
            </div>
          ` : reviewItems.map(item => `
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
                <span class="badge badge-neutral">Q${item.idx + 1} · ${item.q.sectionLabel}</span>
                <span class="badge ${item.isCorrect ? 'badge-success' : 'badge-danger'}">
                  ${item.isCorrect ? '✓ Correct' : item.userAns === undefined ? '— Unanswered' : '✕ Incorrect'}
                </span>
              </div>

              ${item.q.isStar
                ? renderStarBox(item.q)
                : `<div class="jp-text" style="font-weight:700; font-size:1.05rem; margin-bottom:8px;">${item.q.cleanPrompt}</div>`
              }

              <div class="small" style="display:grid; gap:4px; margin-bottom:10px;">
                <div>
                  <strong>Your answer:</strong>
                  <span class="jp-text" style="color:${item.isCorrect ? 'var(--success)' : 'var(--danger)'};">
                    ${item.userAns !== undefined ? item.q.options[item.userAns] : '(No answer selected)'}
                  </span>
                </div>
                ${!item.isCorrect ? `
                  <div>
                    <strong>Correct answer:</strong>
                    <span class="jp-text" style="color:var(--success); font-weight:700;">${item.q.options[item.q.answerIndex]}</span>
                  </div>
                ` : ''}
              </div>

              <div class="small muted" style="background:var(--bg-subtle); padding:10px 12px; border-radius:8px;">
                💡 ${item.q.explanation}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    window.NihongoFx.animateIn(container);
    if (r.passed && !r.celebrated) {
      r.celebrated = true;
      window.NihongoFx.confettiFrom(container.querySelector('.score-circle'), { count: 120, spread: 1.2 });
    }

    const fixExamBtn = container.querySelector('#practice-exam-misses');
    if (fixExamBtn) {
      fixExamBtn.addEventListener('click', () => {
        session = null;
        window.NihongoApp.navigate('drills', { drillType: 'mistakes' });
      });
    }
    container.querySelector('#retake-exam-btn').addEventListener('click', () => {
      startExam(s.modeKey, s.timed, container);
    });
    container.querySelector('#back-exam-lobby').addEventListener('click', () => {
      session = null;
      renderLobby(container);
    });
    container.querySelectorAll('[data-rfilter]').forEach(btn => {
      btn.addEventListener('click', () => {
        s.reviewFilter = btn.dataset.rfilter;
        renderReport(container);
      });
    });
  }

  return { render, cleanup: stopTimer };
})();

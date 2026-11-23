/* ==========================================================================
   Listening Comprehension Studio (聴解)
   Spoken Multi-Turn JLPT N5 Dialogues with Speed Control & Transcript Toggle
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.listening = (function () {
  let state = {
    filter: 'all', // 'all' | 'task' | 'keypoint' | 'response'
    selectedId: 'l01',
    speed: 0.9,    // 0.75 | 0.9 | 1.0
    isPlaying: false,
    activeLineIdx: -1,
    answers: {},   // { [id]: chosenIndex }
    showScript: {}, // { [id]: boolean }
    usedHint: {},  // { [id]: boolean }
    usedRetry: {}, // { [id]: boolean }
    autoCountdown: 0
  };

  let autoTimer = null;

  function cancelAutoAdvance() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    state.autoCountdown = 0;
  }

  function cleanup() {
    cancelAutoAdvance();
    window.NihongoAudio.stop();
    state.isPlaying = false;
    state.activeLineIdx = -1;
  }

  function renderStars(count) {
    let out = '';
    for (let i = 1; i <= 3; i++) {
      out += `<span class="star-pip ${i <= count ? 'on' : ''}">${i <= count ? '★' : '☆'}</span>`;
    }
    return `<span class="star-rating" title="${count}/3 listening stars">${out}</span>`;
  }

  function render(container) {
    const allItems = window.NihongoData.listening || [];
    const store = window.NihongoStore;
    const completed = store.getState().completedListening || [];

    const filtered = state.filter === 'all'
      ? allItems
      : allItems.filter(item => item.mondai === state.filter);

    const active = filtered.find(i => i.id === state.selectedId) || filtered[0] || allItems[0];
    if (active) state.selectedId = active.id;

    const chosen = active ? state.answers[active.id] : undefined;
    const answered = chosen !== undefined;
    const scriptVisible = active ? Boolean(state.showScript[active.id] || answered) : false;

    const filterMeta = [
      { id: 'all', label: `All (${allItems.length})` },
      { id: 'task', label: 'Task-Based (課題理解)' },
      { id: 'keypoint', label: 'Key-Point (ポイント理解)' },
      { id: 'response', label: 'Quick Response (即時応答)' }
    ];

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Listening Comprehension · 聴解</h2>
          <p>${completed.length}/${allItems.length} JLPT N5 spoken dialogues completed. Train your ears first, then inspect the transcript.</p>
        </div>
        <div class="speed-control" role="group" aria-label="Playback speed">
          <span class="small muted">Speed:</span>
          ${[
            { val: 0.75, label: '0.75× Slow' },
            { val: 0.9, label: '0.9× N5' },
            { val: 1.0, label: '1.0× Natural' }
          ].map(sp => `
            <button class="chip ${state.speed === sp.val ? 'active' : ''}" data-speed="${sp.val}">${sp.label}</button>
          `).join('')}
        </div>
      </div>

      <div class="chip-row scroll-row" style="margin-bottom: 18px;">
        ${filterMeta.map(f => `
          <button class="chip ${state.filter === f.id ? 'active' : ''}" data-lfilter="${f.id}">${f.label}</button>
        `).join('')}
      </div>

      <div class="grammar-layout">
        <!-- Left Dialogue Tracklist -->
        <div class="grammar-list" role="listbox" aria-label="Listening tracks">
          ${filtered.map((item, idx) => {
            const m = store.getListeningMastery(item.id);
            return `
              <button class="grammar-list-item ${active && item.id === active.id ? 'active' : ''}" data-lid="${item.id}">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                  <span class="badge badge-neutral">Track ${idx + 1}</span>
                  <div style="display:flex; align-items:center; gap:4px;">
                    ${m.nativeSpeed ? '<span class="badge badge-indigo" title="Cleared at 1.0× natural speed">1.0×</span>' : ''}
                    ${m.stars > 0 ? renderStars(m.stars) : ''}
                  </div>
                </div>
                <div class="grammar-pattern-title">${item.title}</div>
                <div class="muted small">${item.mondaiLabel}</div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Right Audio Studio & Question -->
        ${active ? (() => {
          const activeM = store.getListeningMastery(active.id);
          return `
          <article class="card grammar-detail-panel">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
              <div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span class="badge badge-noun">${active.mondaiLabel}</span>
                  ${activeM.stars > 0 ? renderStars(activeM.stars) : ''}
                  ${activeM.nativeSpeed ? '<span class="badge badge-indigo">⚡ 1.0× Native</span>' : ''}
                </div>
                <h3 style="margin:8px 0 4px; font-size:1.3rem;">${active.title}</h3>
                <p class="muted small" style="margin:0;">${active.situation}</p>
              </div>
              <button class="btn btn-xs btn-ghost" id="listening-next-btn">Next Track →</button>
            </div>

            <!-- Spoken Dialogue Audio Player -->
            <div class="audio-stage ${state.isPlaying ? 'playing' : ''}">
              <div class="audio-stage-top">
                <button class="btn ${state.isPlaying ? 'btn-danger' : 'btn-primary'}" id="play-dialogue-btn">
                  ${state.isPlaying ? '⏹ Stop Audio' : '▶ Play Dialogue'}
                </button>
                <div class="audio-status-info">
                  <div class="audio-wave ${state.isPlaying ? 'active' : ''}" aria-hidden="true">
                    <span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <div class="small" id="listening-status-label">
                    ${state.isPlaying
                      ? (state.activeLineIdx >= 0 && state.activeLineIdx < active.dialogue.length
                          ? `Speaking turn ${state.activeLineIdx + 1}/${active.dialogue.length}: <strong>${active.dialogue[state.activeLineIdx].speaker}</strong>`
                          : 'Speaking question…')
                      : `${active.dialogue.length} spoken turn${active.dialogue.length === 1 ? '' : 's'} + question (${state.speed}×)`}
                  </div>
                </div>
              </div>
            </div>

            <!-- Question -->
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin:16px 0 14px;">
              <div>
                <div class="jp-text" style="font-size:1.12rem; font-weight:700; line-height:1.7;">${active.questionJp}</div>
                <div class="muted small">${active.questionEn}</div>
              </div>
              <button class="audio-btn" id="speak-question-btn" title="Hear the question">🔊</button>
            </div>

            <!-- 4 Answer Choices -->
            <div class="option-list">
              ${active.options.map((opt, idx) => {
                let cls = 'option-btn';
                if (answered) {
                  if (idx === active.answerIndex) cls += ' correct';
                  else if (idx === chosen) cls += ' incorrect';
                }
                return `
                  <button class="${cls}" data-lopt="${idx}" ${answered ? 'disabled' : ''}>
                    <span class="option-key">${idx + 1}</span>
                    <div>
                      <div class="jp-text">${opt.jp}</div>
                      ${answered ? `<div class="small muted" style="font-weight:500;">${opt.en}</div>` : ''}
                    </div>
                  </button>
                `;
              }).join('')}
            </div>

            ${answered ? `
              <div class="feedback-banner ${chosen === active.answerIndex ? 'correct' : 'incorrect'} feedback-enter">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
                  <strong>${chosen === active.answerIndex ? '✓ Correct! 正解！' : '✕ Not quite — listen again with the script below.'}</strong>
                  <div style="display:flex; align-items:center; gap:6px;">
                    ${state.autoCountdown > 0 ? `
                      <span class="badge badge-neutral" id="auto-adv-label">Next in ${state.autoCountdown}s…</span>
                      <button class="btn btn-xs btn-ghost" id="cancel-auto-btn">Stay</button>
                    ` : ''}
                    <button class="btn btn-xs btn-secondary" id="retry-listening-btn">Try Again</button>
                  </div>
                </div>
                <div>${active.explanation}</div>
              </div>
            ` : ''}

            <!-- Script / Transcript Toggle -->
            <div style="margin-top:16px; padding-top:14px; border-top:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <h4 style="margin:0;">Dialogue Transcript · スクリプト</h4>
                ${!answered ? `
                  <button class="btn btn-xs btn-secondary" id="toggle-script-btn">
                    ${scriptVisible ? 'Hide Script' : '👀 Show Script Hint'}
                  </button>
                ` : '<span class="badge badge-neutral">Unlocked</span>'}
              </div>

              ${scriptVisible ? `
                <div class="example-list" style="margin-top:12px;">
                  ${active.dialogue.map((line, lineIdx) => `
                    <div class="example-row ${state.isPlaying && state.activeLineIdx === lineIdx ? 'line-active' : ''}">
                      <div>
                        <span class="badge badge-neutral" style="margin-bottom:4px;">${line.speaker}</span>
                        <div class="jp-text" style="font-weight:600; line-height:1.75;">${line.jp}</div>
                        <div class="muted small">${line.en}</div>
                      </div>
                      <button class="audio-btn" data-speak-line="${lineIdx}" title="Replay this line">🔊</button>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p class="muted small" style="margin:8px 0 0;">
                  Transcript is hidden while you listen so you can practice real JLPT N5 ear comprehension. Answer the question (or click "Show Script Hint") to reveal it.
                </p>
              `}
            </div>
          </article>
        `; })() : ''}
      </div>
    `;

    // Bindings
    container.querySelectorAll('[data-speed]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.speed = Number(btn.dataset.speed);
        if (state.isPlaying) cleanup();
        render(container);
      });
    });

    container.querySelectorAll('[data-lfilter]').forEach(btn => {
      btn.addEventListener('click', () => {
        cleanup();
        state.filter = btn.dataset.lfilter;
        render(container);
      });
    });

    container.querySelectorAll('[data-lid]').forEach(btn => {
      btn.addEventListener('click', () => {
        cleanup();
        state.selectedId = btn.dataset.lid;
        render(container);
      });
    });

    const playBtn = container.querySelector('#play-dialogue-btn');
    if (playBtn && active) {
      playBtn.addEventListener('click', () => {
        if (state.isPlaying) {
          cleanup();
          render(container);
          return;
        }
        state.isPlaying = true;
        state.activeLineIdx = 0;

        const turns = active.dialogue.map(d => ({
          speaker: d.speaker,
          text: d.kana,
          pauseMs: 480
        }));
        // Append the spoken question for Task/Key-point dialogues
        if (active.mondai !== 'response') {
          turns.push({
            speaker: 'Narrator',
            text: active.questionKana,
            pauseMs: 250
          });
        }

        render(container);

        window.NihongoAudio.speakDialogue(turns, {
          rate: state.speed,
          onLineStart: idx => {
            state.activeLineIdx = idx;
            const statusEl = document.getElementById('listening-status-label');
            if (statusEl) {
              statusEl.innerHTML = idx < active.dialogue.length
                ? `Speaking turn ${idx + 1}/${active.dialogue.length}: <strong>${active.dialogue[idx].speaker}</strong>`
                : 'Speaking question…';
            }
          },
          onDone: () => {
            state.isPlaying = false;
            state.activeLineIdx = -1;
            if (document.getElementById('play-dialogue-btn')) {
              render(container);
            }
          }
        });
      });
    }

    const speakQBtn = container.querySelector('#speak-question-btn');
    if (speakQBtn && active) {
      speakQBtn.addEventListener('click', () => {
        cleanup();
        window.NihongoAudio.speak(active.questionKana, state.speed);
      });
    }

    container.querySelectorAll('[data-lopt]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!active || answered) return;
        const idx = Number(btn.dataset.lopt);
        const isCorrect = idx === active.answerIndex;
        state.answers[active.id] = idx;
        if (isCorrect) {
          const stars = Math.max(1, 3 - (state.usedHint[active.id] ? 1 : 0) - (state.usedRetry[active.id] ? 1 : 0));
          const nativeSpeed = state.speed >= 1.0;
          const res = store.markListeningCompleted(active.id, { stars, nativeSpeed });
          if (res.isNew) {
            window.NihongoApp.toast(`Listening track completed! ${'★'.repeat(stars)} (+20 XP)`);
          } else if (res.upgradedNative) {
            window.NihongoApp.toast('⚡ Native 1.0× speed badge unlocked! (+10 XP)');
          }

          // Start gentle 3s auto-advance if there's another unfinished track in this filter
          const nextUnfinished = filtered.find(item => item.id !== active.id && !store.getState().completedListening.includes(item.id));
          if (nextUnfinished) {
            cancelAutoAdvance();
            state.autoCountdown = 3;
            autoTimer = setInterval(() => {
              state.autoCountdown -= 1;
              const lbl = document.getElementById('auto-adv-label');
              if (state.autoCountdown <= 0) {
                cancelAutoAdvance();
                state.selectedId = nextUnfinished.id;
                render(container);
              } else if (lbl) {
                lbl.textContent = `Next in ${state.autoCountdown}s…`;
              }
            }, 1000);
          }
        }
        render(container);
        const picked = container.querySelector(`[data-lopt="${idx}"]`);
        if (picked) window.NihongoFx.pulse(picked, isCorrect ? 'fx-pop' : 'fx-shake');
      });
    });

    const cancelAutoBtn = container.querySelector('#cancel-auto-btn');
    if (cancelAutoBtn) {
      cancelAutoBtn.addEventListener('click', () => {
        cancelAutoAdvance();
        render(container);
      });
    }

    const retryBtn = container.querySelector('#retry-listening-btn');
    if (retryBtn && active) {
      retryBtn.addEventListener('click', () => {
        cancelAutoAdvance();
        state.usedRetry[active.id] = true;
        delete state.answers[active.id];
        state.showScript[active.id] = false;
        render(container);
      });
    }

    const toggleScriptBtn = container.querySelector('#toggle-script-btn');
    if (toggleScriptBtn && active) {
      toggleScriptBtn.addEventListener('click', () => {
        const next = !state.showScript[active.id];
        state.showScript[active.id] = next;
        if (next && !answered) state.usedHint[active.id] = true;
        render(container);
      });
    }

    container.querySelectorAll('[data-speak-line]').forEach(btn => {
      btn.addEventListener('click', () => {
        cleanup();
        const line = active.dialogue[Number(btn.dataset.speakLine)];
        if (line) window.NihongoAudio.speak(line.kana, state.speed);
      });
    });

    const nextBtn = container.querySelector('#listening-next-btn');
    if (nextBtn && filtered.length > 1) {
      nextBtn.addEventListener('click', () => {
        cleanup();
        const curIdx = filtered.findIndex(i => i.id === active.id);
        state.selectedId = filtered[(curIdx + 1) % filtered.length].id;
        render(container);
      });
    }
  }

  return { render, cleanup };
})();

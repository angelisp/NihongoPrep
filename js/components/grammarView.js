/* ==========================================================================
   Grammar Guide & Interactive Quick Checks (文法)
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.grammar = (function () {
  let state = {
    category: 'All',
    search: '',
    selectedId: 'g01',
    checkAnswers: {} // { [grammarId]: chosenOptionIndex }
  };

  function render(container, opts) {
    const allGrammar = window.NihongoData.grammar;
    const store = window.NihongoStore;
    const studied = store.getState().studiedGrammar;

    if (opts && opts.grammarId) {
      state.selectedId = opts.grammarId;
      state.category = 'All';
      state.search = '';
    }

    const categories = ['All', ...Array.from(new Set(allGrammar.map(g => g.category)))];
    const q = state.search.trim().toLowerCase();

    const filtered = allGrammar.filter(g => {
      if (state.category !== 'All' && g.category !== state.category) return false;
      if (q) {
        const hay = `${g.pattern} ${g.kana} ${g.meaning} ${g.category} ${g.explanation}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    let active = filtered.find(g => g.id === state.selectedId) || filtered[0] || allGrammar[0];
    if (active) state.selectedId = active.id;

    const isStudied = active && studied.includes(active.id);
    const chosenCheck = active ? state.checkAnswers[active.id] : undefined;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Grammar Curriculum · 文法</h2>
          <p>${studied.length} of ${allGrammar.length} core JLPT N5 patterns studied. Complete the Quick Check on each point to test yourself.</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="goto-particle-drill">⚡ Practice Particle Drill</button>
      </div>

      <div class="filter-bar">
        <input
          type="search"
          class="search-input"
          id="grammar-search"
          placeholder="Search grammar pattern, particle, or meaning…"
          value="${state.search.replace(/"/g, '&quot;')}"
        />
        <div class="chip-row">
          ${categories.map(cat => `
            <button class="chip ${state.category === cat ? 'active' : ''}" data-gcat="${cat}">${cat}</button>
          `).join('')}
        </div>
      </div>

      <div class="grammar-layout">
        <!-- Left Pattern List -->
        <div class="grammar-list" role="listbox" aria-label="Grammar points">
          ${filtered.length === 0 ? `
            <div class="card small muted">No grammar points match "${state.search}".</div>
          ` : filtered.map(g => {
            const done = studied.includes(g.id);
            return `
              <button class="grammar-list-item ${active && g.id === active.id ? 'active' : ''}" data-gid="${g.id}">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                  <span class="badge badge-neutral">${g.category}</span>
                  ${done ? '<span class="badge badge-success">✓ Studied</span>' : ''}
                </div>
                <div class="grammar-pattern-title jp-text">${g.pattern}</div>
                <div class="muted small">${g.meaning}</div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Right Detail Studio -->
        ${active ? `
          <article class="card grammar-detail-panel">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
              <div>
                <span class="badge badge-noun">${active.category}</span>
                <h3 class="jp-text" style="font-size:1.55rem; margin:8px 0 2px;">${active.pattern}</h3>
                <div style="font-size:1.05rem; font-weight:700; color:var(--text-secondary);">${active.meaning}</div>
              </div>
              <button class="btn ${isStudied ? 'btn-secondary' : 'btn-primary'} btn-sm" id="toggle-grammar-studied">
                ${isStudied ? '✓ Studied (Undo)' : 'Mark as Studied (+15 XP)'}
              </button>
            </div>

            <div class="formula-box jp-text" style="white-space: pre-line;">${active.structure}</div>

            <p style="margin: 12px 0;">${active.explanation}</p>

            <div class="tip-box">
              <strong>🎯 JLPT N5 Exam Tip:</strong> ${active.jlptTip}
            </div>

            <h4 style="margin: 18px 0 8px;">Example Sentences · 例文</h4>
            <div class="example-list">
              ${active.examples.map(ex => `
                <div class="example-row">
                  <div>
                    <div class="jp-text" style="font-size:1.06rem; font-weight:600; line-height:1.75;">${ex.jp}</div>
                    <div class="romaji">${ex.romaji}</div>
                    <div class="muted small" style="margin-top:2px;">${ex.en}</div>
                  </div>
                  <button class="audio-btn" data-speak="${ex.kana}" title="Listen to example">🔊</button>
                </div>
              `).join('')}
            </div>

            ${active.quickCheck ? `
              <div class="quick-check-box">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <h4 style="margin:0;">⚡ Quick Check</h4>
                  ${chosenCheck !== undefined ? `<button class="btn btn-xs btn-ghost" id="reset-quick-check">Try again</button>` : ''}
                </div>
                <p class="jp-text" style="font-size:1.08rem; font-weight:600; margin:10px 0 12px;">${active.quickCheck.prompt}</p>
                <div class="option-list">
                  ${active.quickCheck.options.map((opt, idx) => {
                    let cls = 'option-btn jp-text';
                    if (chosenCheck !== undefined) {
                      if (idx === active.quickCheck.answerIndex) cls += ' correct';
                      else if (idx === chosenCheck) cls += ' incorrect';
                    }
                    return `
                      <button class="${cls}" data-qcheck="${idx}" ${chosenCheck !== undefined ? 'disabled' : ''}>
                        <span class="option-key">${idx + 1}</span>
                        <span>${opt}</span>
                      </button>
                    `;
                  }).join('')}
                </div>
                ${chosenCheck !== undefined ? `
                  <div class="feedback-banner ${chosenCheck === active.quickCheck.answerIndex ? 'correct' : 'incorrect'}">
                    <strong>${chosenCheck === active.quickCheck.answerIndex ? '✓ Correct! 正解！' : '✕ Not quite!'}</strong>
                    ${active.quickCheck.explanation}
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </article>
        ` : ''}
      </div>
    `;

    // Bindings
    const searchInput = container.querySelector('#grammar-search');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        state.search = e.target.value;
        const pos = e.target.selectionStart;
        render(container);
        const next = container.querySelector('#grammar-search');
        if (next) {
          next.focus();
          next.setSelectionRange(pos, pos);
        }
      });
    }

    container.querySelectorAll('[data-gcat]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.category = btn.dataset.gcat;
        render(container);
      });
    });

    container.querySelectorAll('[data-gid]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedId = btn.dataset.gid;
        render(container);
      });
    });

    const toggleStudiedBtn = container.querySelector('#toggle-grammar-studied');
    if (toggleStudiedBtn && active) {
      toggleStudiedBtn.addEventListener('click', () => {
        const nowStudied = store.toggleStudiedGrammar(active.id);
        window.NihongoApp.toast(nowStudied ? 'Grammar point marked studied! (+15 XP)' : 'Removed studied mark');
        render(container);
      });
    }

    container.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', () => window.NihongoAudio.speak(btn.dataset.speak));
    });

    container.querySelectorAll('[data-qcheck]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.qcheck);
        state.checkAnswers[active.id] = idx;
        if (idx === active.quickCheck.answerIndex && !studied.includes(active.id)) {
          store.toggleStudiedGrammar(active.id);
          window.NihongoApp.toast('Correct! Marked pattern as studied (+15 XP)');
        }
        render(container);
      });
    });

    const resetCheckBtn = container.querySelector('#reset-quick-check');
    if (resetCheckBtn && active) {
      resetCheckBtn.addEventListener('click', () => {
        delete state.checkAnswers[active.id];
        render(container);
      });
    }

    const gotoDrillBtn = container.querySelector('#goto-particle-drill');
    if (gotoDrillBtn) {
      gotoDrillBtn.addEventListener('click', () => window.NihongoApp.navigate('drills', { drillType: 'particles' }));
    }
  }

  return { render };
})();

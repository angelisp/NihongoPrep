/* ==========================================================================
   Kanji Explorer & Interactive Hiragana/Katakana Reference (漢字・仮名)
   ========================================================================== */
window.NihongoViews = window.NihongoViews || {};

window.NihongoViews.kanji = (function () {
  let state = {
    subTab: 'kanji', // 'kanji' | 'hiragana' | 'katakana'
    category: 'All',
    selectedId: 'k15' // 日
  };

  function render(container) {
    const allKanji = window.NihongoData.kanji;
    const store = window.NihongoStore;
    const studied = store.getState().studiedKanji;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Kanji &amp; Kana Reference · 漢字・仮名</h2>
          <p>${studied.length}/${allKanji.length} high-frequency JLPT N5 kanji studied, plus clickable Hiragana &amp; Katakana sound charts.</p>
        </div>
        <div class="segmented-tabs" role="tablist">
          <button class="segmented-tab ${state.subTab === 'kanji' ? 'active' : ''}" data-ktab="kanji">漢 N5 Kanji</button>
          <button class="segmented-tab ${state.subTab === 'hiragana' ? 'active' : ''}" data-ktab="hiragana">あ Hiragana</button>
          <button class="segmented-tab ${state.subTab === 'katakana' ? 'active' : ''}" data-ktab="katakana">ア Katakana</button>
        </div>
      </div>

      <div id="kanji-subview"></div>
    `;

    container.querySelectorAll('[data-ktab]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.subTab = btn.dataset.ktab;
        render(container);
      });
    });

    const subEl = container.querySelector('#kanji-subview');
    if (state.subTab === 'kanji') {
      renderKanjiExplorer(subEl, container);
    } else {
      renderKanaChart(subEl, state.subTab === 'katakana');
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

    subEl.innerHTML = `
      ${active ? `
        <section class="card kanji-detail-banner">
          <div class="kanji-hero-glyph jp-text">${active.char}</div>
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
              <div>
                <span class="badge badge-neutral">${active.category} · ${active.strokes} strokes</span>
                <h3 style="margin:6px 0 4px; font-size:1.35rem;">${active.meaning}</h3>
              </div>
              <button class="btn ${isStudied ? 'btn-secondary' : 'btn-primary'} btn-sm" id="toggle-kanji-studied">
                ${isStudied ? '✓ Studied (Undo)' : 'Mark as Studied (+10 XP)'}
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

      <div class="chip-row" style="margin-bottom: 16px;">
        ${categories.map(c => `
          <button class="chip ${state.category === c ? 'active' : ''}" data-kcat="${c}">${c}</button>
        `).join('')}
      </div>

      <div class="kanji-grid">
        ${filtered.map(k => {
          const done = studied.includes(k.id);
          const sel = active && active.id === k.id;
          return `
            <button class="card card-interactive kanji-tile ${done ? 'studied' : ''}"
                    style="${sel ? 'border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft);' : ''}"
                    data-kid="${k.id}">
              ${done ? '<span class="badge badge-success" style="position:absolute; top:8px; right:8px; padding:2px 6px;">✓</span>' : ''}
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
        const nowDone = store.toggleStudiedKanji(active.id);
        window.NihongoApp.toast(nowDone ? `Kanji「${active.char}」marked studied (+10 XP)` : 'Removed studied mark');
        render(rootContainer);
      });
    }

    subEl.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', () => window.NihongoAudio.speak(btn.dataset.speak));
    });
  }

  function renderKanaChart(subEl, isKatakana) {
    const rows = window.NihongoData.kanaRows;
    const idx = isKatakana ? 1 : 0;

    subEl.innerHTML = `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
          <div>
            <h3 style="margin:0;">${isKatakana ? 'Katakana (カタカナ)' : 'Hiragana (ひらがな)'} Gojūon Chart</h3>
            <p class="muted small" style="margin:2px 0 0;">Click any character to hear its Japanese pronunciation.</p>
          </div>
          <span class="badge badge-neutral">46 Basic Characters</span>
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
                    return `
                      <td>
                        <button class="kana-cell" style="width:100%;" data-speak="${cell[0]}" title="Pronounce ${cell[2]}">
                          <span class="kana-glyph jp-text">${cell[idx]}</span>
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
  }

  return { render };
})();

/* ==========================================================================
   NihongoPrep App Controller & Router
   ========================================================================== */
window.NihongoApp = (function () {
  const ROUTE_TITLES = {
    dashboard: 'Dashboard',
    vocab: 'Vocabulary Studio',
    grammar: 'Grammar Curriculum',
    kanji: 'Kanji & Kana Reference',
    listening: 'Listening Comprehension',
    drills: 'Practice Drills',
    exam: 'JLPT N5 Mock Exam'
  };

  let currentRoute = 'dashboard';
  let deferredInstallPrompt = null;

  function toast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.25s ease';
      setTimeout(() => el.remove(), 260);
    }, 2600);
  }

  function applyPreferences() {
    const prefs = window.NihongoStore.getState().prefs;

    document.body.classList.toggle('hide-furigana', !prefs.showFurigana);
    document.body.classList.toggle('hide-romaji', !prefs.showRomaji);
    document.body.classList.toggle('theme-dark', prefs.theme === 'dark');

    // Sync topbar pills
    const fBtn = document.getElementById('toggle-furigana');
    const fState = document.getElementById('furigana-state');
    if (fBtn && fState) {
      fBtn.classList.toggle('is-on', prefs.showFurigana);
      fState.textContent = prefs.showFurigana ? 'ON' : 'OFF';
    }

    const rBtn = document.getElementById('toggle-romaji');
    const rState = document.getElementById('romaji-state');
    if (rBtn && rState) {
      rBtn.classList.toggle('is-on', prefs.showRomaji);
      rState.textContent = prefs.showRomaji ? 'ON' : 'OFF';
    }

    const tIcon = document.getElementById('theme-icon');
    if (tIcon) tIcon.textContent = prefs.theme === 'dark' ? '☀️' : '🌙';

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', prefs.theme === 'dark' ? '#11151b' : '#c94438');
    }

    // Sync modal switches
    const mf = document.getElementById('modal-furigana');
    const mr = document.getElementById('modal-romaji');
    const ma = document.getElementById('modal-autoplay');
    if (mf) mf.checked = prefs.showFurigana;
    if (mr) mr.checked = prefs.showRomaji;
    if (ma) ma.checked = prefs.autoPlayAudio;
    const mg = document.getElementById('modal-daily-goal');
    if (mg) mg.value = String(prefs.dailyGoalXp);
  }

  function updateSidebarStats() {
    const store = window.NihongoStore;
    const fx = window.NihongoFx;
    const state = store.getState();
    const readiness = store.getReadiness();
    const level = store.getLevelInfo();
    const daily = store.getDailyProgress();
    const streak = store.getEffectiveStreak();
    const { dueReview } = store.getDueVocabIds();

    const pctEl = document.getElementById('sidebar-readiness-pct');
    const barEl = document.getElementById('sidebar-readiness-bar');
    const streakEl = document.getElementById('sidebar-streak');
    const xpEl = document.getElementById('sidebar-xp');
    const badgeEl = document.getElementById('nav-due-badge');
    const mistakeBadgeEl = document.getElementById('nav-mistake-badge');
    const mistakeCount = store.getMistakeCount();

    if (pctEl) pctEl.textContent = `${readiness.overall}%`;
    if (barEl) barEl.style.width = `${readiness.overall}%`;
    if (streakEl) streakEl.textContent = `🔥 ${streak} day streak`;
    if (xpEl) {
      const prevXp = sidebarPrev.xp;
      if (prevXp !== null && prevXp !== state.stats.xp) {
        fx.countUp(xpEl, state.stats.xp, { from: prevXp, suffix: ' XP', duration: 700 });
      } else {
        xpEl.textContent = `${state.stats.xp.toLocaleString()} XP`;
      }
    }
    if (badgeEl) {
      if (dueReview.length > 0) {
        badgeEl.textContent = String(dueReview.length);
        badgeEl.hidden = false;
      } else {
        badgeEl.hidden = true;
      }
    }
    if (mistakeBadgeEl) {
      if (mistakeCount > 0) {
        mistakeBadgeEl.textContent = String(mistakeCount);
        mistakeBadgeEl.hidden = false;
      } else {
        mistakeBadgeEl.hidden = true;
      }
    }

    // Level card
    const levelNum = document.getElementById('sidebar-level-num');
    const rankEl = document.getElementById('sidebar-rank');
    const nextEl = document.getElementById('sidebar-level-next');
    const levelBar = document.getElementById('sidebar-level-bar');
    if (levelNum) levelNum.textContent = String(level.level);
    if (rankEl) rankEl.textContent = `${level.rank.jp} · ${level.rank.en}`;
    if (nextEl) nextEl.textContent = `${level.toNext} XP to Lv ${level.level + 1}`;
    if (levelBar) {
      // When the level changes, restart the bar from 0 instead of shrinking backwards.
      if (sidebarPrev.level !== null && level.level > sidebarPrev.level) {
        levelBar.style.transition = 'none';
        levelBar.style.width = '0%';
        void levelBar.offsetWidth;
        levelBar.style.transition = '';
      }
      levelBar.style.width = `${level.progressPct}%`;
    }

    // Daily goal rings
    const ring = document.getElementById('sidebar-goal-ring');
    const ringText = document.getElementById('sidebar-goal-text');
    const caption = document.getElementById('sidebar-goal-caption');
    const mobileRing = document.getElementById('mobile-goal-ring');
    const mobileLevel = document.getElementById('mobile-level-num');
    [ring, mobileRing].forEach(r => {
      if (!r) return;
      r.style.setProperty('--pct', daily.pct);
      r.classList.toggle('done', daily.done);
      r.title = `Daily goal: ${daily.xp}/${daily.goal} XP`;
    });
    if (ringText) ringText.textContent = daily.done ? '✓' : `${daily.pct}%`;
    if (caption) {
      caption.textContent = daily.done
        ? `🎯 Goal met · ${daily.xp} XP today`
        : `🎯 ${daily.xp} / ${daily.goal} XP today`;
    }
    if (mobileLevel) mobileLevel.textContent = String(level.level);

    sidebarPrev = { xp: state.stats.xp, level: level.level };
  }

  let sidebarPrev = { xp: null, level: null };

  function initProgressionEffects() {
    const store = window.NihongoStore;
    const fx = window.NihongoFx;

    store.on('xp', e => {
      fx.floatXp(e.amount);
      fx.pulse(document.getElementById('sidebar-level-card'));
      fx.pulse(document.getElementById('mobile-level-chip'));
    });

    store.on('levelUp', e => {
      setTimeout(() => fx.celebrateLevelUp(e), 450);
    });

    store.on('goalComplete', e => {
      toast(`🎯 Daily goal reached! ${e.goal} XP — 今日もよく頑張りました！`);
      const ring = document.getElementById('sidebar-goal-ring');
      const mobileRing = document.getElementById('mobile-goal-ring');
      fx.pulse(ring, 'fx-pop');
      fx.pulse(mobileRing, 'fx-pop');
      fx.confettiFrom(ring && ring.getBoundingClientRect().width ? ring : mobileRing, { count: 60, spread: 0.7 });
    });

    store.on('streak', e => {
      toast(`🔥 ${e.days}-day streak! Keep it going.`);
    });

    store.on('mastered', e => {
      const word = (window.NihongoData.vocab || []).find(w => w.id === e.vocabId);
      if (word) toast(`✨ Mastered「${word.kanji}」— ${word.meaning}`);
    });

    store.on('questComplete', e => {
      toast(`🏆 Quest complete: ${e.quest.title} (+${e.quest.rewardXp} XP)`);
      fx.confetti({ count: 70, spread: 0.85 });
    });
  }

  function cleanupCurrentView() {
    const mod = window.NihongoViews[currentRoute];
    if (mod && typeof mod.cleanup === 'function') mod.cleanup();
  }

  function navigate(route, opts) {
    if (!ROUTE_TITLES[route]) route = 'dashboard';
    cleanupCurrentView();
    currentRoute = route;

    // Update active nav buttons (desktop & mobile)
    document.querySelectorAll('[data-route]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === route);
    });

    const titleEl = document.getElementById('topbar-title');
    if (titleEl) titleEl.textContent = ROUTE_TITLES[route];

    const viewEl = document.getElementById('app-view');
    if (!viewEl) return;

    const viewModule = window.NihongoViews[route];
    if (typeof viewModule === 'function') {
      viewModule(viewEl, opts);
    } else if (viewModule && typeof viewModule.render === 'function') {
      viewModule.render(viewEl, opts);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    window.NihongoFx.animateIn(viewEl);
    updateSidebarStats();
  }

  function initControls() {
    const store = window.NihongoStore;

    // Navigation buttons
    document.querySelectorAll('[data-route]').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.route));
    });

    // Topbar toggles
    document.getElementById('toggle-furigana').addEventListener('click', () => {
      const next = !store.getState().prefs.showFurigana;
      store.updatePref('showFurigana', next);
      applyPreferences();
      toast(next ? 'Furigana shown (ふりがな ON)' : 'Furigana hidden — exam mode!');
    });

    document.getElementById('toggle-romaji').addEventListener('click', () => {
      const next = !store.getState().prefs.showRomaji;
      store.updatePref('showRomaji', next);
      applyPreferences();
      toast(next ? 'Romaji shown' : 'Romaji hidden');
    });

    document.getElementById('toggle-theme').addEventListener('click', () => {
      const next = store.getState().prefs.theme === 'dark' ? 'light' : 'dark';
      store.updatePref('theme', next);
      applyPreferences();
    });

    // Settings Modal
    const modal = document.getElementById('settings-modal');
    const openModal = () => {
      applyPreferences();
      const ttsEl = document.getElementById('tts-status-text');
      if (ttsEl) ttsEl.textContent = window.NihongoAudio.getStatus();
      modal.hidden = false;
    };
    const closeModal = () => { modal.hidden = true; };

    document.getElementById('open-settings').addEventListener('click', openModal);
    document.getElementById('close-settings').addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    document.getElementById('modal-furigana').addEventListener('change', e => {
      store.updatePref('showFurigana', e.target.checked);
      applyPreferences();
    });

    document.getElementById('modal-romaji').addEventListener('change', e => {
      store.updatePref('showRomaji', e.target.checked);
      applyPreferences();
    });

    document.getElementById('modal-autoplay').addEventListener('change', e => {
      store.updatePref('autoPlayAudio', e.target.checked);
      applyPreferences();
    });

    document.getElementById('modal-daily-goal').addEventListener('change', e => {
      store.updatePref('dailyGoalXp', Number(e.target.value));
      applyPreferences();
      if (currentRoute === 'dashboard') navigate('dashboard');
      toast(`Daily goal set to ${e.target.value} XP 🎯`);
    });

    document.getElementById('test-tts-btn').addEventListener('click', () => {
      window.NihongoAudio.speak('こんにちは。日本語能力試験N5の勉強を頑張りましょう！');
    });

    document.getElementById('export-progress-btn').addEventListener('click', () => {
      const blob = new Blob([store.exportJson()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nihongoprep-n5-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('Progress exported as JSON!');
    });

    document.getElementById('import-progress-input').addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          store.importJson(String(reader.result));
          applyPreferences();
          navigate(currentRoute);
          toast('Progress imported successfully!');
        } catch (err) {
          toast('Import failed: invalid backup file.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    document.getElementById('reset-progress-btn').addEventListener('click', () => {
      if (window.confirm('Reset all vocabulary mastery, streaks, grammar progress, and exam history?')) {
        store.resetAll();
        applyPreferences();
        closeModal();
        navigate('dashboard');
        toast('All progress reset.');
      }
    });

    store.subscribe(() => {
      updateSidebarStats();
    });

    initProgressionEffects();
    initPwa();
  }

  function initPwa() {
    const topInstallBtn = document.getElementById('install-pwa-btn');
    const modalInstallBtn = document.getElementById('modal-install-pwa-btn');
    const pwaStatusEl = document.getElementById('pwa-status-text');

    function setInstallButtonsVisible(visible) {
      if (topInstallBtn) topInstallBtn.hidden = !visible;
      if (modalInstallBtn) modalInstallBtn.hidden = !visible;
    }

    async function triggerInstall() {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      try {
        const choice = await deferredInstallPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          toast('Installing NihongoPrep… 📲');
        }
      } catch (err) {}
      deferredInstallPrompt = null;
      setInstallButtonsVisible(false);
    }

    if (topInstallBtn) topInstallBtn.addEventListener('click', triggerInstall);
    if (modalInstallBtn) modalInstallBtn.addEventListener('click', triggerInstall);

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredInstallPrompt = e;
      setInstallButtonsVisible(true);
      if (pwaStatusEl) {
        pwaStatusEl.textContent = 'Ready to install! Click Install to add NihongoPrep to your home screen for offline study.';
      }
    });

    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      setInstallButtonsVisible(false);
      toast('NihongoPrep installed! Works offline anytime.');
      if (pwaStatusEl) {
        pwaStatusEl.textContent = 'Installed as a standalone PWA with offline caching active.';
      }
    });

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone && pwaStatusEl) {
      pwaStatusEl.textContent = 'Running in installed standalone PWA mode with offline caching.';
    }

    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      navigator.serviceWorker.register('./sw.js').then(() => {
        if (!isStandalone && !deferredInstallPrompt && pwaStatusEl) {
          pwaStatusEl.textContent = 'Offline caching active! Use your browser menu (or Share → Add to Home Screen on iOS) to install.';
        }
      }).catch(err => {
        console.warn('Service worker registration skipped:', err);
      });
    }
  }

  function init() {
    applyPreferences();
    initControls();
    navigate('dashboard');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { navigate, toast };
})();

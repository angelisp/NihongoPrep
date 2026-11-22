/* ==========================================================================
   NihongoPrep State Store, SM-2 SRS Scheduler & Persistence
   ========================================================================== */
window.NihongoStore = (function () {
  const STORAGE_KEY = 'nihongoprep_n5_v1';

  const DEFAULT_STATE = {
    prefs: {
      showFurigana: true,
      showRomaji: true,
      theme: 'light',
      autoPlayAudio: false
    },
    stats: {
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      drillsCompleted: 0,
      drillCorrect: 0,
      drillTotal: 0
    },
    vocabSrs: {},          // { [id]: { reps, intervalDays, ease, dueTs } }
    starredVocab: [],      // string[]
    studiedGrammar: [],    // string[]
    studiedKanji: [],      // string[]
    completedListening: [], // string[]
    examHistory: []        // { date, mode, score, total, passed, sections }[]
  };

  let state = loadState();
  const listeners = new Set();

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return {
        prefs: Object.assign({}, DEFAULT_STATE.prefs, parsed.prefs || {}),
        stats: Object.assign({}, DEFAULT_STATE.stats, parsed.stats || {}),
        vocabSrs: parsed.vocabSrs || {},
        starredVocab: Array.isArray(parsed.starredVocab) ? parsed.starredVocab : [],
        studiedGrammar: Array.isArray(parsed.studiedGrammar) ? parsed.studiedGrammar : [],
        studiedKanji: Array.isArray(parsed.studiedKanji) ? parsed.studiedKanji : [],
        completedListening: Array.isArray(parsed.completedListening) ? parsed.completedListening : [],
        examHistory: Array.isArray(parsed.examHistory) ? parsed.examHistory : []
      };
    } catch (err) {
      console.warn('Could not load saved state, using defaults.', err);
      return clone(DEFAULT_STATE);
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Could not persist state.', err);
    }
    listeners.forEach(fn => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function recordActivity(xpGain) {
    const today = todayStr();
    const last = state.stats.lastStudyDate;
    if (last !== today) {
      if (last) {
        const diffDays = Math.round((new Date(today) - new Date(last)) / 86400000);
        state.stats.streak = diffDays === 1 ? state.stats.streak + 1 : 1;
      } else {
        state.stats.streak = 1;
      }
      state.stats.lastStudyDate = today;
    }
    state.stats.xp += xpGain;
  }

  // SM-2 Inspired SRS Review Rating: 1=Again, 2=Hard, 3=Good, 4=Easy
  function rateVocab(vocabId, rating) {
    const now = Date.now();
    const card = state.vocabSrs[vocabId] || { reps: 0, intervalDays: 0, ease: 2.5, dueTs: now };

    if (rating === 1) {
      card.reps = 0;
      card.intervalDays = 0;
      card.ease = Math.max(1.3, card.ease - 0.2);
      card.dueTs = now + 10 * 60 * 1000; // 10 minutes
    } else {
      card.reps += 1;
      if (rating === 2) {
        card.intervalDays = card.reps === 1 ? 1 : Math.max(1, Math.round(card.intervalDays * 1.2));
        card.ease = Math.max(1.3, card.ease - 0.15);
      } else if (rating === 3) {
        if (card.reps === 1) card.intervalDays = 1;
        else if (card.reps === 2) card.intervalDays = 4;
        else card.intervalDays = Math.round(card.intervalDays * card.ease);
      } else if (rating === 4) {
        if (card.reps === 1) card.intervalDays = 3;
        else card.intervalDays = Math.round(Math.max(4, card.intervalDays) * card.ease * 1.3);
        card.ease = Math.min(3.0, card.ease + 0.15);
      }
      card.dueTs = now + card.intervalDays * 86400000;
    }

    state.vocabSrs[vocabId] = card;
    recordActivity(rating === 1 ? 3 : 8);
    save();
    return card;
  }

  function getVocabStatus(vocabId) {
    const card = state.vocabSrs[vocabId];
    if (!card) return 'new';
    if (card.intervalDays >= 4 && card.reps >= 2) return 'mastered';
    return 'learning';
  }

  function getDueVocabIds() {
    const now = Date.now();
    const allVocab = window.NihongoData.vocab || [];
    const dueReview = [];
    const fresh = [];
    for (const item of allVocab) {
      const card = state.vocabSrs[item.id];
      if (!card) {
        fresh.push(item.id);
      } else if (card.dueTs <= now) {
        dueReview.push(item.id);
      }
    }
    return { dueReview, fresh };
  }

  function toggleStarVocab(vocabId) {
    const idx = state.starredVocab.indexOf(vocabId);
    if (idx >= 0) state.starredVocab.splice(idx, 1);
    else state.starredVocab.push(vocabId);
    save();
    return idx < 0;
  }

  function toggleStudiedGrammar(grammarId) {
    const idx = state.studiedGrammar.indexOf(grammarId);
    if (idx >= 0) {
      state.studiedGrammar.splice(idx, 1);
    } else {
      state.studiedGrammar.push(grammarId);
      recordActivity(15);
    }
    save();
    return idx < 0;
  }

  function toggleStudiedKanji(kanjiId) {
    const idx = state.studiedKanji.indexOf(kanjiId);
    if (idx >= 0) {
      state.studiedKanji.splice(idx, 1);
    } else {
      state.studiedKanji.push(kanjiId);
      recordActivity(10);
    }
    save();
    return idx < 0;
  }

  function markListeningCompleted(listeningId) {
    if (!state.completedListening.includes(listeningId)) {
      state.completedListening.push(listeningId);
      recordActivity(20);
      save();
      return true;
    }
    return false;
  }

  function recordDrillResult(correct, total) {
    state.stats.drillsCompleted += 1;
    state.stats.drillCorrect += correct;
    state.stats.drillTotal += total;
    recordActivity(correct * 10 + 10);
    save();
  }

  function recordExamResult(entry) {
    state.examHistory.unshift(entry);
    if (state.examHistory.length > 20) state.examHistory.pop();
    recordActivity(entry.score * 12 + 30);
    save();
  }

  function updatePref(key, value) {
    state.prefs[key] = value;
    save();
  }

  function getReadiness() {
    const vocabList = window.NihongoData.vocab || [];
    const grammarList = window.NihongoData.grammar || [];
    const kanjiList = window.NihongoData.kanji || [];
    const listeningList = window.NihongoData.listening || [];

    let vocabMastered = 0;
    let vocabTouched = 0;
    vocabList.forEach(v => {
      const st = getVocabStatus(v.id);
      if (st === 'mastered') vocabMastered++;
      if (st !== 'new') vocabTouched++;
    });

    const vocabPct = vocabList.length
      ? Math.min(100, Math.round(((vocabMastered + vocabTouched * 0.4) / vocabList.length) * 100))
      : 0;
    const grammarPct = grammarList.length
      ? Math.round((state.studiedGrammar.length / grammarList.length) * 100)
      : 0;
    const kanjiPct = kanjiList.length
      ? Math.round((state.studiedKanji.length / kanjiList.length) * 100)
      : 0;
    const listeningPct = listeningList.length
      ? Math.round((state.completedListening.length / listeningList.length) * 100)
      : 0;
    const drillPct = state.stats.drillTotal > 0
      ? Math.round((state.stats.drillCorrect / state.stats.drillTotal) * 100)
      : 0;
    const bestExam = state.examHistory.length
      ? Math.max(...state.examHistory.map(e => Math.round((e.score / e.total) * 100)))
      : 0;

    const overall = Math.round(
      vocabPct * 0.25 +
      grammarPct * 0.20 +
      kanjiPct * 0.15 +
      listeningPct * 0.15 +
      drillPct * 0.10 +
      bestExam * 0.15
    );

    return {
      overall,
      vocabPct,
      vocabMastered,
      vocabTouched,
      vocabTotal: vocabList.length,
      grammarPct,
      grammarStudied: state.studiedGrammar.length,
      grammarTotal: grammarList.length,
      kanjiPct,
      kanjiStudied: state.studiedKanji.length,
      kanjiTotal: kanjiList.length,
      listeningPct,
      listeningDone: state.completedListening.length,
      listeningTotal: listeningList.length,
      drillPct,
      bestExam
    };
  }

  function exportJson() {
    return JSON.stringify(state, null, 2);
  }

  function importJson(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || !parsed.prefs) {
      throw new Error('Invalid NihongoPrep backup file.');
    }
    state = {
      prefs: Object.assign({}, DEFAULT_STATE.prefs, parsed.prefs),
      stats: Object.assign({}, DEFAULT_STATE.stats, parsed.stats || {}),
      vocabSrs: parsed.vocabSrs || {},
      starredVocab: Array.isArray(parsed.starredVocab) ? parsed.starredVocab : [],
      studiedGrammar: Array.isArray(parsed.studiedGrammar) ? parsed.studiedGrammar : [],
      studiedKanji: Array.isArray(parsed.studiedKanji) ? parsed.studiedKanji : [],
      completedListening: Array.isArray(parsed.completedListening) ? parsed.completedListening : [],
      examHistory: Array.isArray(parsed.examHistory) ? parsed.examHistory : []
    };
    save();
  }

  function resetAll() {
    const preservedTheme = state.prefs.theme;
    state = clone(DEFAULT_STATE);
    state.prefs.theme = preservedTheme;
    save();
  }

  return {
    getState: () => state,
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
    updatePref,
    rateVocab,
    getVocabStatus,
    getDueVocabIds,
    toggleStarVocab,
    toggleStudiedGrammar,
    toggleStudiedKanji,
    markListeningCompleted,
    recordDrillResult,
    recordExamResult,
    getReadiness,
    exportJson,
    importJson,
    resetAll
  };
})();

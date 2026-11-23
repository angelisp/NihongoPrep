/* ==========================================================================
   NihongoPrep State Store, SM-2 SRS Scheduler, Progression & Persistence
   ========================================================================== */
window.NihongoStore = (function () {
  const STORAGE_KEY = 'nihongoprep_n5_v1';

  const DEFAULT_STATE = {
    prefs: {
      showFurigana: true,
      showRomaji: true,
      theme: 'light',
      autoPlayAudio: false,
      dailyGoalXp: 50
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
    examHistory: [],       // { date, mode, score, total, passed, sections }[]
    dailyLog: {},          // { 'YYYY-MM-DD': xpEarnedThatDay }
    xpAwarded: {},         // { 'grammar:g01': true } — one-time XP rewards already granted
    mistakes: {},          // { [key]: { key, kind, refId, misses, lastMissedTs, label } }
    drillBest: {},         // { [drillType]: bestPct }
    dailyQuests: { date: null, items: [] },
    grammarMastery: {},    // { [id]: 0..3 stars }
    kanjiMastery: {},      // { [id]: 0..3 stars }
    kanaStats: {},         // { [glyph]: { correct, attempts } }
    listeningMastery: {}   // { [id]: { stars: 1..3, nativeSpeed: boolean } }
  };

  // Levels & Ranks ----------------------------------------------------------
  const RANKS = [
    { min: 1, jp: '入門', en: 'Newcomer' },
    { min: 3, jp: '初心者', en: 'Novice' },
    { min: 6, jp: '見習い', en: 'Apprentice' },
    { min: 10, jp: '初級', en: 'Elementary' },
    { min: 15, jp: '受験生', en: 'N5 Candidate' },
    { min: 20, jp: '五級達人', en: 'N5 Master' }
  ];

  // Total XP required to reach level n (level 1 = 0 XP)
  function xpForLevel(n) {
    return n <= 1 ? 0 : Math.round(40 * Math.pow(n - 1, 1.6));
  }

  function getLevelInfo(xp) {
    const total = typeof xp === 'number' ? xp : state.stats.xp;
    let level = 1;
    while (total >= xpForLevel(level + 1)) level++;
    const floorXp = xpForLevel(level);
    const nextXp = xpForLevel(level + 1);
    const rank = RANKS.filter(r => level >= r.min).pop();
    return {
      level,
      rank,
      xp: total,
      floorXp,
      nextXp,
      toNext: nextXp - total,
      progressPct: Math.round(((total - floorXp) / (nextXp - floorXp)) * 100)
    };
  }

  // State -------------------------------------------------------------------
  let state = loadState();
  const listeners = new Set();
  const eventListeners = {};
  let pendingEvents = [];

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function normalize(parsed) {
    return {
      prefs: Object.assign({}, DEFAULT_STATE.prefs, parsed.prefs || {}),
      stats: Object.assign({}, DEFAULT_STATE.stats, parsed.stats || {}),
      vocabSrs: parsed.vocabSrs || {},
      starredVocab: Array.isArray(parsed.starredVocab) ? parsed.starredVocab : [],
      studiedGrammar: Array.isArray(parsed.studiedGrammar) ? parsed.studiedGrammar : [],
      studiedKanji: Array.isArray(parsed.studiedKanji) ? parsed.studiedKanji : [],
      completedListening: Array.isArray(parsed.completedListening) ? parsed.completedListening : [],
      examHistory: Array.isArray(parsed.examHistory) ? parsed.examHistory : [],
      dailyLog: parsed.dailyLog && typeof parsed.dailyLog === 'object' ? parsed.dailyLog : {},
      xpAwarded: parsed.xpAwarded && typeof parsed.xpAwarded === 'object' ? parsed.xpAwarded : {},
      mistakes: parsed.mistakes && typeof parsed.mistakes === 'object' ? parsed.mistakes : {},
      drillBest: parsed.drillBest && typeof parsed.drillBest === 'object' ? parsed.drillBest : {},
      dailyQuests: parsed.dailyQuests && Array.isArray(parsed.dailyQuests.items)
        ? parsed.dailyQuests
        : { date: null, items: [] },
      grammarMastery: parsed.grammarMastery && typeof parsed.grammarMastery === 'object' ? parsed.grammarMastery : {},
      kanjiMastery: parsed.kanjiMastery && typeof parsed.kanjiMastery === 'object' ? parsed.kanjiMastery : {},
      kanaStats: parsed.kanaStats && typeof parsed.kanaStats === 'object' ? parsed.kanaStats : {},
      listeningMastery: parsed.listeningMastery && typeof parsed.listeningMastery === 'object' ? parsed.listeningMastery : {}
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_STATE);
      const loaded = normalize(JSON.parse(raw));
      // Items studied before one-time XP tracking existed already earned their XP.
      loaded.studiedGrammar.forEach(id => { loaded.xpAwarded[`grammar:${id}`] = true; });
      loaded.studiedKanji.forEach(id => { loaded.xpAwarded[`kanji:${id}`] = true; });
      return loaded;
    } catch (err) {
      console.warn('Could not load saved state, using defaults.', err);
      return clone(DEFAULT_STATE);
    }
  }

  // Events ------------------------------------------------------------------
  function on(type, fn) {
    (eventListeners[type] = eventListeners[type] || new Set()).add(fn);
    return () => eventListeners[type].delete(fn);
  }

  function queueEvent(type, payload) {
    pendingEvents.push({ type, payload });
  }

  function flushEvents() {
    const events = pendingEvents;
    pendingEvents = [];
    events.forEach(({ type, payload }) => {
      (eventListeners[type] || []).forEach(fn => {
        try { fn(payload); } catch (e) { console.error(e); }
      });
    });
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
    flushEvents();
  }

  // Dates & Streaks ---------------------------------------------------------
  function dateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function todayStr() {
    return dateStr(new Date());
  }

  function daysBetween(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }

  // Streak as it should be displayed: 0 if the user missed yesterday.
  function getEffectiveStreak() {
    const last = state.stats.lastStudyDate;
    if (!last) return 0;
    return daysBetween(last, todayStr()) <= 1 ? state.stats.streak : 0;
  }

  function getDailyProgress() {
    const goal = Math.max(10, Number(state.prefs.dailyGoalXp) || 50);
    const xp = state.dailyLog[todayStr()] || 0;
    return { xp, goal, pct: Math.min(100, Math.round((xp / goal) * 100)), done: xp >= goal };
  }

  function recordActivity(xpGain, source) {
    const today = todayStr();
    const last = state.stats.lastStudyDate;
    if (last !== today) {
      state.stats.streak = last && daysBetween(last, today) === 1 ? state.stats.streak + 1 : 1;
      state.stats.lastStudyDate = today;
      if (state.stats.streak > 1) queueEvent('streak', { days: state.stats.streak });
    }

    if (!xpGain) return;

    const before = getLevelInfo(state.stats.xp);
    const goal = getDailyProgress().goal;
    const dailyBefore = state.dailyLog[today] || 0;

    state.stats.xp += xpGain;
    state.dailyLog[today] = dailyBefore + xpGain;

    const after = getLevelInfo(state.stats.xp);
    queueEvent('xp', { amount: xpGain, source, total: state.stats.xp });
    if (after.level > before.level) {
      queueEvent('levelUp', { from: before.level, to: after.level, rankChanged: after.rank !== before.rank, info: after });
    }
    if (dailyBefore < goal && dailyBefore + xpGain >= goal) {
      queueEvent('goalComplete', { goal, xp: dailyBefore + xpGain });
    }
  }

  // Grants XP for a given key only once, ever. Returns the XP awarded (0 if already claimed).
  function awardOnce(key, xp, source) {
    if (state.xpAwarded[key]) {
      recordActivity(0, source);
      return 0;
    }
    state.xpAwarded[key] = true;
    recordActivity(xp, source);
    return xp;
  }

  // SRS -----------------------------------------------------------------------
  // SM-2 Inspired SRS Review Rating: 1=Again, 2=Hard, 3=Good, 4=Easy
  function computeNextCard(prev, rating, now) {
    const card = Object.assign({ reps: 0, intervalDays: 0, ease: 2.5, dueTs: now }, prev || {});
    if (rating === 1) {
      card.reps = 0;
      card.intervalDays = 0;
      card.ease = Math.max(1.3, card.ease - 0.2);
      card.dueTs = now + 10 * 60 * 1000; // 10 minutes
      return card;
    }
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
    return card;
  }

  function formatInterval(card, rating) {
    if (rating === 1) return '10 min';
    const d = card.intervalDays;
    if (d >= 60) return `${Math.round(d / 30)} mo`;
    return `${d} day${d === 1 ? '' : 's'}`;
  }

  // Human-readable next interval for a rating, without mutating state.
  function previewInterval(vocabId, rating) {
    return formatInterval(computeNextCard(state.vocabSrs[vocabId], rating, Date.now()), rating);
  }

  function rateVocab(vocabId, rating) {
    const wasMastered = getVocabStatus(vocabId) === 'mastered';
    const card = computeNextCard(state.vocabSrs[vocabId], rating, Date.now());
    state.vocabSrs[vocabId] = card;
    const xp = rating === 1 ? 3 : 8;
    recordActivity(xp, 'flashcard');
    advanceQuest('vocabReview', 1);
    const mastered = !wasMastered && getVocabStatus(vocabId) === 'mastered';
    if (mastered) queueEvent('mastered', { vocabId });
    save();
    return { card, xp, mastered };
  }

  // Directory shortcut: mark a word as known (or send it back to learning).
  function quickMarkVocab(vocabId, mastered) {
    const now = Date.now();
    if (mastered) {
      const prev = state.vocabSrs[vocabId] || { ease: 2.5 };
      state.vocabSrs[vocabId] = { reps: 2, intervalDays: 4, ease: prev.ease || 2.5, dueTs: now + 4 * 86400000 };
      awardOnce(`vocabQuick:${vocabId}`, 10, 'vocab');
    } else {
      const prev = state.vocabSrs[vocabId] || { ease: 2.5 };
      state.vocabSrs[vocabId] = { reps: 0, intervalDays: 0, ease: prev.ease || 2.5, dueTs: now + 10 * 60 * 1000 };
    }
    save();
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
      if ((state.grammarMastery[grammarId] || 0) <= 1) delete state.grammarMastery[grammarId];
    } else {
      state.studiedGrammar.push(grammarId);
      state.grammarMastery[grammarId] = Math.max(1, state.grammarMastery[grammarId] || 0);
      awardOnce(`grammar:${grammarId}`, 15, 'grammar');
      advanceQuest('grammarStudy', 1);
    }
    save();
    return idx < 0;
  }

  function getGrammarStars(grammarId) {
    const s = state.grammarMastery[grammarId] || 0;
    return s > 0 ? s : (state.studiedGrammar.includes(grammarId) ? 1 : 0);
  }

  function recordGrammarCheck(grammarId, correct) {
    if (correct) {
      const cur = getGrammarStars(grammarId);
      const next = Math.min(3, Math.max(2, cur + 1));
      state.grammarMastery[grammarId] = next;
      if (!state.studiedGrammar.includes(grammarId)) {
        state.studiedGrammar.push(grammarId);
        advanceQuest('grammarStudy', 1);
      }
      awardOnce(`grammar:${grammarId}`, 15, 'grammar');
      if (next === 3) awardOnce(`grammarMaster:${grammarId}`, 10, 'grammar');
      save();
      return next;
    }
    save();
    return getGrammarStars(grammarId);
  }

  function toggleStudiedKanji(kanjiId) {
    const idx = state.studiedKanji.indexOf(kanjiId);
    if (idx >= 0) {
      state.studiedKanji.splice(idx, 1);
      if ((state.kanjiMastery[kanjiId] || 0) <= 1) delete state.kanjiMastery[kanjiId];
    } else {
      state.studiedKanji.push(kanjiId);
      state.kanjiMastery[kanjiId] = Math.max(1, state.kanjiMastery[kanjiId] || 0);
      awardOnce(`kanji:${kanjiId}`, 10, 'kanji');
      advanceQuest('kanjiStudy', 1);
    }
    save();
    return idx < 0;
  }

  function getKanjiStars(kanjiId) {
    const s = state.kanjiMastery[kanjiId] || 0;
    return s > 0 ? s : (state.studiedKanji.includes(kanjiId) ? 1 : 0);
  }

  function recordKanjiQuiz(kanjiId, correct) {
    if (correct) {
      const cur = getKanjiStars(kanjiId);
      const next = Math.min(3, Math.max(2, cur + 1));
      state.kanjiMastery[kanjiId] = next;
      if (!state.studiedKanji.includes(kanjiId)) {
        state.studiedKanji.push(kanjiId);
        advanceQuest('kanjiStudy', 1);
      }
      recordActivity(6, 'kanjiQuiz');
      save();
      return next;
    }
    save();
    return getKanjiStars(kanjiId);
  }

  function recordKanaResult(glyph, correct) {
    const prev = state.kanaStats[glyph] || { correct: 0, attempts: 0 };
    state.kanaStats[glyph] = {
      correct: prev.correct + (correct ? 1 : 0),
      attempts: prev.attempts + 1
    };
    if (correct) recordActivity(3, 'kanaQuiz');
    else save();
    if (correct) save();
    return state.kanaStats[glyph];
  }

  function getKanaStat(glyph) {
    return state.kanaStats[glyph] || { correct: 0, attempts: 0 };
  }

  function getListeningMastery(listeningId) {
    const m = state.listeningMastery[listeningId];
    if (m) return m;
    if (state.completedListening.includes(listeningId)) return { stars: 2, nativeSpeed: false };
    return { stars: 0, nativeSpeed: false };
  }

  function markListeningCompleted(listeningId, opts) {
    const o = opts || {};
    const stars = Math.min(3, Math.max(1, o.stars || 3));
    const nativeSpeed = Boolean(o.nativeSpeed);
    const prev = state.listeningMastery[listeningId] || { stars: 0, nativeSpeed: false };
    const isNew = !state.completedListening.includes(listeningId);
    const upgradedNative = !prev.nativeSpeed && nativeSpeed;

    state.listeningMastery[listeningId] = {
      stars: Math.max(prev.stars, stars),
      nativeSpeed: prev.nativeSpeed || nativeSpeed
    };

    if (isNew) {
      state.completedListening.push(listeningId);
      awardOnce(`listening:${listeningId}`, 20, 'listening');
      advanceQuest('listeningDone', 1);
    } else if (upgradedNative) {
      awardOnce(`listeningNative:${listeningId}`, 10, 'listening');
    }
    save();
    return { isNew, upgradedNative, mastery: state.listeningMastery[listeningId] };
  }

  function recordDrillResult(correct, total, drillType) {
    const xp = correct * 10 + 10;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    state.stats.drillsCompleted += 1;
    state.stats.drillCorrect += correct;
    state.stats.drillTotal += total;
    if (drillType && drillType !== 'mistakes') {
      const prevBest = state.drillBest[drillType] || 0;
      if (pct > prevBest) state.drillBest[drillType] = pct;
    }
    recordActivity(xp, 'drill');
    advanceQuest('drillComplete', 1);
    if (pct >= 70) advanceQuest('drillPass', 1);
    save();
    return xp;
  }

  // Mistake Bank ------------------------------------------------------------
  function recordMistake(kind, refId, label) {
    if (!kind || !refId) return;
    const key = `${kind}:${refId}`;
    const existing = state.mistakes[key];
    state.mistakes[key] = {
      key,
      kind,
      refId,
      label: label || (existing && existing.label) || refId,
      misses: (existing ? existing.misses : 0) + 1,
      lastMissedTs: Date.now()
    };
    // Nudge missed vocab words back into the SRS due queue
    if (kind === 'vocab' && state.vocabSrs[refId]) {
      state.vocabSrs[refId].dueTs = Date.now();
    }
    save();
  }

  function clearMistake(key) {
    if (!state.mistakes[key]) return false;
    delete state.mistakes[key];
    advanceQuest('clearMistakes', 1);
    queueEvent('mistakeCleared', { key, remaining: Object.keys(state.mistakes).length });
    save();
    return true;
  }

  function getMistakes(kindFilter) {
    const list = Object.values(state.mistakes);
    const filtered = kindFilter ? list.filter(m => m.kind === kindFilter) : list;
    return filtered.sort((a, b) => (b.misses - a.misses) || (b.lastMissedTs - a.lastMissedTs));
  }

  function getMistakeCount() {
    return Object.keys(state.mistakes).length;
  }

  function getDrillBest(type) {
    return typeof state.drillBest[type] === 'number' ? state.drillBest[type] : null;
  }

  // Daily Quests (3 per day, tailored to weakest pillar & mistakes) ---------
  function buildDailyQuests() {
    const r = getReadiness();
    const mistakeCount = getMistakeCount();
    const quests = [
      {
        id: 'q-vocab',
        type: 'vocabReview',
        title: 'Review 10 vocabulary flashcards',
        route: 'vocab',
        opts: { subTab: 'flashcards' },
        target: 10,
        progress: 0,
        rewardXp: 25,
        completed: false
      }
    ];

    const pillarCandidates = [
      {
        pct: r.grammarPct,
        done: r.grammarStudied >= r.grammarTotal,
        quest: {
          id: 'q-pillar',
          type: 'grammarStudy',
          title: 'Study 2 N5 grammar patterns',
          route: 'grammar',
          opts: {},
          target: Math.min(2, Math.max(1, r.grammarTotal - r.grammarStudied)),
          progress: 0,
          rewardXp: 25,
          completed: false
        }
      },
      {
        pct: r.kanjiPct,
        done: r.kanjiStudied >= r.kanjiTotal,
        quest: {
          id: 'q-pillar',
          type: 'kanjiStudy',
          title: 'Study 3 N5 kanji characters',
          route: 'kanji',
          opts: {},
          target: Math.min(3, Math.max(1, r.kanjiTotal - r.kanjiStudied)),
          progress: 0,
          rewardXp: 25,
          completed: false
        }
      },
      {
        pct: r.listeningPct,
        done: r.listeningDone >= r.listeningTotal,
        quest: {
          id: 'q-pillar',
          type: 'listeningDone',
          title: 'Complete 1 listening dialogue',
          route: 'listening',
          opts: {},
          target: 1,
          progress: 0,
          rewardXp: 25,
          completed: false
        }
      }
    ].filter(c => !c.done).sort((a, b) => a.pct - b.pct);

    if (pillarCandidates.length > 0) {
      quests.push(pillarCandidates[0].quest);
    } else {
      quests.push({
        id: 'q-pillar',
        type: 'drillComplete',
        title: 'Complete 1 practice drill',
        route: 'drills',
        opts: {},
        target: 1,
        progress: 0,
        rewardXp: 25,
        completed: false
      });
    }

    if (mistakeCount >= 2) {
      const target = Math.min(3, mistakeCount);
      quests.push({
        id: 'q-challenge',
        type: 'clearMistakes',
        title: `Clear ${target} item${target === 1 ? '' : 's'} from your Mistake Bank`,
        route: 'drills',
        opts: { drillType: 'mistakes' },
        target,
        progress: 0,
        rewardXp: 30,
        completed: false
      });
    } else {
      quests.push({
        id: 'q-challenge',
        type: 'drillPass',
        title: 'Score 70%+ on a practice drill',
        route: 'drills',
        opts: {},
        target: 1,
        progress: 0,
        rewardXp: 30,
        completed: false
      });
    }

    return quests;
  }

  function ensureDailyQuests() {
    const today = todayStr();
    if (state.dailyQuests.date !== today || !state.dailyQuests.items.length) {
      state.dailyQuests = { date: today, items: buildDailyQuests() };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }
    return state.dailyQuests.items;
  }

  function advanceQuest(type, delta) {
    const items = ensureDailyQuests();
    const step = delta || 1;
    items.forEach(q => {
      if (q.completed || q.type !== type) return;
      q.progress = Math.min(q.target, q.progress + step);
      if (q.progress >= q.target) {
        q.completed = true;
        recordActivity(q.rewardXp, 'quest');
        queueEvent('questComplete', { quest: q });
      }
    });
  }

  function getDailyQuests() {
    return ensureDailyQuests();
  }

  // Personalized "Next Up" Recommendation -----------------------------------
  function getNextUp() {
    const r = getReadiness();
    const { dueReview } = getDueVocabIds();
    const mistakeCount = getMistakeCount();
    const quests = ensureDailyQuests();
    const openQuest = quests.find(q => !q.completed);

    if (dueReview.length >= 3) {
      return {
        eyebrow: 'SRS DUE NOW',
        title: `Review ${dueReview.length} due vocabulary cards`,
        reason: 'Clearing due cards right on schedule locks them into long-term memory.',
        cta: '🃏 Start Due Review',
        route: 'vocab',
        opts: { subTab: 'flashcards' }
      };
    }

    if (mistakeCount >= 3) {
      return {
        eyebrow: 'WEAK SPOTS DETECTED',
        title: `Fix ${mistakeCount} items in your Mistake Bank`,
        reason: 'Turning recent misses into wins is the fastest way to boost your N5 score.',
        cta: '🎯 Fix My Mistakes',
        route: 'drills',
        opts: { drillType: 'mistakes' }
      };
    }

    if (openQuest) {
      return {
        eyebrow: 'TODAY’S QUEST',
        title: openQuest.title,
        reason: `${openQuest.progress}/${openQuest.target} done · Finish for a +${openQuest.rewardXp} XP bonus.`,
        cta: 'Start Quest →',
        route: openQuest.route,
        opts: openQuest.opts || {}
      };
    }

    const pillars = [
      { key: 'vocab', pct: r.vocabPct, title: 'Learn new N5 vocabulary', reason: `${r.vocabMastered}/${r.vocabTotal} mastered so far.`, cta: '🃏 Study Flashcards', route: 'vocab', opts: { subTab: 'flashcards' } },
      { key: 'grammar', pct: r.grammarPct, title: 'Build up your N5 Grammar', reason: `${r.grammarStudied}/${r.grammarTotal} patterns studied.`, cta: '📘 Open Grammar', route: 'grammar', opts: {} },
      { key: 'kanji', pct: r.kanjiPct, title: 'Expand your N5 Kanji', reason: `${r.kanjiStudied}/${r.kanjiTotal} characters studied.`, cta: '漢 Open Kanji', route: 'kanji', opts: {} },
      { key: 'listening', pct: r.listeningPct, title: 'Train your Listening comprehension', reason: `${r.listeningDone}/${r.listeningTotal} tracks completed.`, cta: '🎧 Practice Listening', route: 'listening', opts: {} },
      { key: 'drills', pct: r.drillPct, title: 'Sharpen your Drill accuracy', reason: 'Quick 10-question drills build exam speed.', cta: '⚡ Start a Drill', route: 'drills', opts: {} }
    ].sort((a, b) => a.pct - b.pct);

    if (pillars[0].pct < 80) {
      return Object.assign({ eyebrow: 'WEAKEST PILLAR' }, pillars[0]);
    }

    return {
      eyebrow: 'EXAM READY',
      title: 'Test yourself with a JLPT N5 Mock Exam',
      reason: 'All pillars are looking strong — see how you perform under timed conditions.',
      cta: '📝 Launch Mock Exam',
      route: 'exam',
      opts: {}
    };
  }

  // Activity History for Heatmap --------------------------------------------
  function getActivityHistory(days) {
    const count = days || 14;
    const goal = getDailyProgress().goal;
    const out = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = dateStr(d);
      const xp = state.dailyLog[key] || 0;
      let level = 0;
      if (xp > 0) {
        const ratio = xp / goal;
        if (ratio >= 1.5) level = 4;
        else if (ratio >= 1) level = 3;
        else if (ratio >= 0.45) level = 2;
        else level = 1;
      }
      out.push({
        date: key,
        shortDay: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        xp,
        goalMet: xp >= goal,
        level,
        isToday: i === 0
      });
    }
    return out;
  }

  function recordExamResult(entry) {
    const xp = entry.score * 12 + 30;
    state.examHistory.unshift(entry);
    if (state.examHistory.length > 20) state.examHistory.pop();
    recordActivity(xp, 'exam');
    save();
    return xp;
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
    state = normalize(parsed);
    state.studiedGrammar.forEach(id => { state.xpAwarded[`grammar:${id}`] = true; });
    state.studiedKanji.forEach(id => { state.xpAwarded[`kanji:${id}`] = true; });
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
    on,
    updatePref,
    rateVocab,
    previewInterval,
    quickMarkVocab,
    getVocabStatus,
    getDueVocabIds,
    toggleStarVocab,
    toggleStudiedGrammar,
    getGrammarStars,
    recordGrammarCheck,
    toggleStudiedKanji,
    getKanjiStars,
    recordKanjiQuiz,
    recordKanaResult,
    getKanaStat,
    getListeningMastery,
    markListeningCompleted,
    recordDrillResult,
    recordExamResult,
    recordMistake,
    clearMistake,
    getMistakes,
    getMistakeCount,
    getDrillBest,
    getDailyQuests,
    getNextUp,
    getActivityHistory,
    getReadiness,
    getLevelInfo,
    getDailyProgress,
    getEffectiveStreak,
    exportJson,
    importJson,
    resetAll
  };
})();

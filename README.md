# NihongoPrep · 日本語プレップ (JLPT N5 Study & Exam Prep PWA)

A focused, zero-dependency **Progressive Web App (PWA)** for revising **JLPT N5** Japanese concepts — covering vocabulary, grammar, all 103 N5 kanji, spoken listening comprehension dialogues, targeted exam drills, and timed mock exams.

## Features
- **Dashboard (`ホーム`)**: Overall JLPT N5 readiness score across 6 pillars, daily streak & XP, daily word/grammar spotlight, and mock exam history.
- **Vocabulary Studio (`語彙`)**: **216 curated JLPT N5 words** across Nouns, い-Adjectives, な-Adjectives, Verbs (Groups 1–3 with `ます`/`て` forms), Adverbs, plus dedicated topic decks for **Counters & Numbers**, **Dates & Days**, and **Katakana Loanwords**. Includes search, filters, Japanese TTS audio, bookmarks, and **3D SRS Flashcards** with keyboard shortcuts (`Space`, `1–4`, `A`) and mobile touch-swipe support.
- **Grammar Curriculum (`文法`)**: **24 core JLPT N5 grammar patterns** with structure formulas, exam tips, audio examples, studied tracking, and inline **Quick Checks**.
- **Kanji & Kana Reference (`漢字・仮名`)**: **103 complete JLPT N5 kanji** (On'yomi, Kun'yomi, mnemonics, compound words) + clickable Hiragana & Katakana Gojūon audio charts.
- **Listening Comprehension (`聴解`)**: **14 spoken Japanese dialogues** modeled after JLPT N5 Mondai 1 (Task-Based), Mondai 2 (Key-Point), and Mondai 3 (Quick Response) — with playback speed controls (`0.75×`, `0.9×`, `1.0×`), multi-speaker pitch differentiation, and revealable scripts with line-by-line replay.
- **Practice Drills (`練習`) & Mock Exam (`模擬試験`)**: Particle fill-in (`助詞`), Conjugation (`活用`), dynamic Vocab/Kanji quizzes, authentic **`★` Sentence Ordering (`並び替え`)**, and a Timed/Untimed JLPT N5 Mock Exam with reading passages and sectional scoring.
- **Mobile-Friendly PWA & Offline Support**: Installable on Android, iOS, and desktop with offline caching (`sw.js` + `manifest.webmanifest`), safe-area mobile navigation, horizontal scrollable filter strips, and JSON progress backup/restore.

## Getting Started

### Quick Local Open (Zero Setup)
Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Running as an Installable Offline PWA (Mobile / Desktop)
Service Workers and PWA installation require `https://` or `http://localhost`:
1. Host the folder on any static host (e.g., GitHub Pages, Netlify, Cloudflare Pages) or serve locally via VS Code Live Server.
2. **Android / Desktop Chrome / Edge**: Click the **📲 Install** button in the top bar (or browser address bar).
3. **iOS Safari**: Tap **Share → Add to Home Screen**.

## Project Structure
```text
NihongoPrep/
├── index.html
├── styles.css
├── manifest.webmanifest
├── sw.js                       # Offline-first PWA Service Worker
├── icons/                      # SVG + 180/192/512 PNG app icons
└── js/
    ├── app.js                  # Router, global toggles, PWA install & SW registration
    ├── store.js                # State persistence, SM-2 SRS, readiness engine
    ├── audio.js                # Japanese Web Speech API + multi-turn dialogue engine
    ├── data/
    │   ├── vocab.js            # 216 JLPT N5 vocabulary entries & topic decks
    │   ├── grammar.js          # 24 JLPT N5 grammar points + quick checks
    │   ├── kanji.js            # 103 complete JLPT N5 kanji + Kana charts
    │   ├── listening.js        # 14 spoken JLPT N5 listening comprehension tracks
    │   └── exam.js             # Drill pools + 24-question N5 Mock Exam
    └── components/
        ├── dashboard.js
        ├── vocabView.js
        ├── grammarView.js
        ├── kanjiView.js
        ├── listeningView.js
        ├── drillView.js
        └── examView.js
```

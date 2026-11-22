/* ==========================================================================
   Japanese Web Speech API Pronunciation & Multi-Turn Dialogue Engine
   ========================================================================== */
window.NihongoAudio = (function () {
  let cachedVoice = null;
  let activeRunId = 0;
  let pauseTimer = null;

  function findJapaneseVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    return (
      voices.find(v => v.lang && v.lang.toLowerCase() === 'ja-jp') ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ja')) ||
      null
    );
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function () {
      cachedVoice = findJapaneseVoice();
    };
    cachedVoice = findJapaneseVoice();
  }

  function stop() {
    activeRunId += 1;
    if (pauseTimer) {
      clearTimeout(pauseTimer);
      pauseTimer = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  function speak(text, rate, pitch) {
    if (!text) return false;
    if (!('speechSynthesis' in window)) {
      if (window.NihongoApp) {
        window.NihongoApp.toast('Browser speech synthesis is not supported on this device.');
      }
      return false;
    }
    stop();
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      utter.rate = rate || 0.92;
      utter.pitch = pitch || 1.0;
      const voice = cachedVoice || findJapaneseVoice();
      if (voice) {
        cachedVoice = voice;
        utter.voice = voice;
      }
      window.speechSynthesis.speak(utter);
      return true;
    } catch (err) {
      console.warn('TTS error:', err);
      return false;
    }
  }

  function pitchForSpeaker(speaker) {
    if (!speaker) return 1.0;
    const s = speaker.toLowerCase();
    if (s.includes('woman') || s.includes('女') || s.includes('staff') || s.includes('clerk') || s.includes('mother')) return 1.12;
    if (s.includes('man') || s.includes('男') || s.includes('father') || s.includes('doctor') || s.includes('teacher')) return 0.88;
    return 1.0;
  }

  /**
   * Speak an ordered array of dialogue turns:
   * lines = [{ speaker, text, pauseMs? }]
   */
  function speakDialogue(lines, opts) {
    opts = opts || {};
    if (!('speechSynthesis' in window)) {
      if (window.NihongoApp) {
        window.NihongoApp.toast('Browser speech synthesis is not supported on this device.');
      }
      if (opts.onDone) opts.onDone();
      return false;
    }

    stop();
    const runId = activeRunId;
    const rate = opts.rate || 0.9;
    const voice = cachedVoice || findJapaneseVoice();
    if (voice) cachedVoice = voice;

    function playNext(index) {
      if (runId !== activeRunId) return;
      if (index >= lines.length) {
        if (opts.onDone) opts.onDone();
        return;
      }

      const line = lines[index];
      if (opts.onLineStart) opts.onLineStart(index, line);

      const utter = new SpeechSynthesisUtterance(line.text);
      utter.lang = 'ja-JP';
      utter.rate = rate;
      utter.pitch = line.pitch || pitchForSpeaker(line.speaker);
      if (voice) utter.voice = voice;

      utter.onend = function () {
        if (runId !== activeRunId) return;
        pauseTimer = setTimeout(() => playNext(index + 1), line.pauseMs || 420);
      };

      utter.onerror = function () {
        if (runId !== activeRunId) return;
        if (opts.onDone) opts.onDone();
      };

      try {
        window.speechSynthesis.speak(utter);
      } catch (err) {
        if (opts.onDone) opts.onDone();
      }
    }

    playNext(0);
    return true;
  }

  function getStatus() {
    if (!('speechSynthesis' in window)) {
      return 'Not supported in this browser.';
    }
    const voice = cachedVoice || findJapaneseVoice();
    if (voice) {
      return `Ready — using "${voice.name}" (${voice.lang})`;
    }
    return 'Supported — using default ja-JP speech engine.';
  }

  return { speak, speakDialogue, stop, getStatus };
})();

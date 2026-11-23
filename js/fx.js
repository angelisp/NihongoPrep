/* ==========================================================================
   NihongoPrep Visual Feedback Effects (+XP floats, count-ups, confetti,
   animated bars/rings, level-up celebration). Zero dependencies.
   ========================================================================== */
window.NihongoFx = (function () {
  const CONFETTI_COLORS = ['#c94438', '#e67e45', '#294c7a', '#2a7b58', '#c47a1b', '#6b4c9a', '#f2c94c'];

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Remember where the user last tapped so XP can float up from that spot.
  let lastPointer = { x: null, y: null, t: 0 };
  document.addEventListener('pointerdown', e => {
    lastPointer = { x: e.clientX, y: e.clientY, t: Date.now() };
  }, true);

  function visibleRect(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 ? r : null;
  }

  function anchorPoint() {
    if (lastPointer.x !== null && Date.now() - lastPointer.t < 2500) {
      return { x: lastPointer.x, y: lastPointer.y };
    }
    const r = visibleRect(document.getElementById('sidebar-xp')) || visibleRect(document.getElementById('mobile-level-chip'));
    if (r) return { x: r.left + r.width / 2, y: r.top };
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }

  function floatXp(amount) {
    if (!amount) return;
    const { x, y } = anchorPoint();
    const el = document.createElement('div');
    el.className = 'xp-float';
    el.textContent = `+${amount} XP`;
    el.style.left = `${Math.min(window.innerWidth - 50, Math.max(50, x))}px`;
    el.style.top = `${Math.max(30, y - 10)}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), reducedMotion() ? 900 : 1300);
  }

  function pulse(el, cls) {
    if (!el) return;
    const name = cls || 'fx-pulse';
    el.classList.remove(name);
    void el.offsetWidth;
    el.classList.add(name);
    setTimeout(() => el.classList.remove(name), 700);
  }

  function formatNumber(n) {
    return Math.round(n).toLocaleString();
  }

  function countUp(el, to, opts) {
    if (!el) return;
    const o = Object.assign({ from: 0, duration: 900, prefix: '', suffix: '' }, opts || {});
    const token = {};
    el._countToken = token;
    if (reducedMotion() || o.from === to) {
      el.textContent = `${o.prefix}${formatNumber(to)}${o.suffix}`;
      return;
    }
    const start = performance.now();
    function frame(now) {
      if (el._countToken !== token) return;
      const t = Math.min(1, (now - start) / o.duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${o.prefix}${formatNumber(o.from + (to - o.from) * eased)}${o.suffix}`;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Animate freshly rendered progress bars, goal rings and [data-countup] numbers.
  function animateIn(root) {
    if (!root) return;
    const reduce = reducedMotion();

    root.querySelectorAll('.progress-fill').forEach(bar => {
      if (bar.hasAttribute('data-noanim') || reduce) return;
      const target = bar.style.width;
      if (!target) return;
      const from = bar.dataset.from || '0%';
      if (from === target) return;
      bar.style.transition = 'none';
      bar.style.width = from;
      void bar.offsetWidth;
      bar.style.transition = '';
      requestAnimationFrame(() => { bar.style.width = target; });
    });

    root.querySelectorAll('.goal-ring[data-pct]').forEach(ring => {
      const target = Number(ring.dataset.pct) || 0;
      if (reduce) { ring.style.setProperty('--pct', target); return; }
      ring.style.setProperty('--pct', 0);
      void ring.offsetWidth;
      requestAnimationFrame(() => ring.style.setProperty('--pct', target));
    });

    root.querySelectorAll('[data-countup]').forEach(el => {
      countUp(el, Number(el.dataset.countup) || 0, {
        from: Number(el.dataset.from) || 0,
        prefix: el.dataset.prefix || '',
        suffix: el.dataset.suffix || ''
      });
    });
  }

  function confetti(opts) {
    if (reducedMotion()) return;
    const o = Object.assign({ count: 90, x: window.innerWidth / 2, y: window.innerHeight * 0.35, spread: 1 }, opts || {});
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < o.count; i++) {
      const p = document.createElement('i');
      const angle = Math.random() * Math.PI * 2;
      const dist = (120 + Math.random() * 260) * o.spread;
      p.style.left = `${o.x}px`;
      p.style.top = `${o.y}px`;
      p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(angle) * dist * 0.6 + 220 + Math.random() * 160}px`);
      p.style.setProperty('--rot', `${(Math.random() - 0.5) * 900}deg`);
      p.style.animationDelay = `${Math.random() * 120}ms`;
      p.style.animationDuration = `${1100 + Math.random() * 700}ms`;
      if (i % 3 === 0) p.style.borderRadius = '50%';
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 2200);
  }

  function confettiFrom(el, opts) {
    const r = visibleRect(el);
    if (!r) return confetti(opts);
    confetti(Object.assign({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, opts || {}));
  }

  let overlayOpen = false;
  function isOverlayOpen() {
    return overlayOpen;
  }

  function celebrateLevelUp(evt) {
    if (overlayOpen) return;
    const info = evt.info;
    overlayOpen = true;

    const backdrop = document.createElement('div');
    backdrop.className = 'levelup-backdrop';
    backdrop.innerHTML = `
      <div class="levelup-card" role="dialog" aria-modal="true" aria-labelledby="levelup-title">
        <div class="levelup-eyebrow jp-text">レベルアップ！</div>
        <div class="levelup-badge"><small>Lv</small><span>${info.level}</span></div>
        <h2 id="levelup-title">Level ${info.level} reached!</h2>
        <p class="levelup-rank">
          ${evt.rankChanged ? '🏅 New rank unlocked: ' : 'Rank: '}
          <strong><span class="jp-text">${info.rank.jp}</span> · ${info.rank.en}</strong>
        </p>
        <div class="progress-track"><div class="progress-fill" style="width:${info.progressPct}%"></div></div>
        <p class="muted small">${info.toNext} XP to Level ${info.level + 1}</p>
        <button class="btn btn-primary" id="levelup-continue">続ける · Continue</button>
      </div>
    `;
    document.body.appendChild(backdrop);
    animateIn(backdrop);

    const btn = backdrop.querySelector('#levelup-continue');

    function close() {
      if (!overlayOpen) return;
      overlayOpen = false;
      document.removeEventListener('keydown', keyTrap, true);
      backdrop.classList.add('closing');
      setTimeout(() => backdrop.remove(), 200);
    }

    // Capture keys so shortcuts in the view underneath don't fire while open.
    function keyTrap(e) {
      e.stopPropagation();
      if (['Enter', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        close();
      }
    }

    document.addEventListener('keydown', keyTrap, true);
    btn.addEventListener('click', close);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    setTimeout(() => btn.focus(), 50);
    confettiFrom(backdrop.querySelector('.levelup-badge'), { count: 120, spread: 1.3 });
  }

  return {
    reducedMotion,
    floatXp,
    pulse,
    countUp,
    animateIn,
    confetti,
    confettiFrom,
    celebrateLevelUp,
    isOverlayOpen
  };
})();

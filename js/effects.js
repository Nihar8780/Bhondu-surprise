/* =============================================================
   EFFECTS.JS
   Lightweight floating hearts / particles. Pure DOM + CSS
   animation (see .fx-heart in animations.css) — no canvas,
   no external libraries, so it stays cheap on mobile.
   ============================================================= */

(function () {
  'use strict';

  /**
   * Spawns a single floating heart inside `container`.
   * Cleans itself up after the animation ends so the DOM
   * never accumulates stray nodes.
   */
  function spawnHeart(container, opts) {
    if (!container) return;
    opts = opts || {};

    const heart = document.createElement('span');
    heart.className = 'fx-heart';
    heart.textContent = opts.glyph || '♥';
    heart.setAttribute('aria-hidden', 'true');

    const left = opts.left != null ? opts.left : Math.random() * 100;
    const size = opts.size || (0.9 + Math.random() * 1.4);
    const duration = opts.duration || (6 + Math.random() * 5);
    const delay = opts.delay || 0;
    const drift = opts.drift != null ? opts.drift : (Math.random() * 80 - 40) + 'px';
    const opacity = opts.opacity != null ? opts.opacity : (0.35 + Math.random() * 0.4);

    heart.style.left = left + '%';
    heart.style.fontSize = size + 'rem';
    heart.style.setProperty('--drift', drift);
    heart.style.setProperty('--o', opacity);
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = delay + 's';

    container.appendChild(heart);

    // Clean up once the animation finishes (duration + delay, +buffer)
    window.setTimeout(function () {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, (duration + delay) * 1000 + 500);
  }

  /**
   * Starts a gentle, ongoing drizzle of hearts inside a container.
   * Returns a stop function.
   */
  function startAmbientHearts(container, opts) {
    if (!container) return function () {};
    opts = opts || {};
    const interval = opts.interval || 1400;
    const max = opts.max || 14;
    let count = 0;
    let stopped = false;

    const id = window.setInterval(function () {
      if (stopped) return;
      if (container.childElementCount >= max) return;
      spawnHeart(container, opts.heartOpts);
      count++;
    }, interval);

    return function stop() {
      stopped = true;
      window.clearInterval(id);
    };
  }

  /**
   * A short, denser burst of hearts — used for the "Open My Heart"
   * surprise moment.
   */
  function burstHearts(container, amount) {
    if (!container) return;
    amount = amount || 18;
    for (let i = 0; i < amount; i++) {
      window.setTimeout(function () {
        spawnHeart(container, {
          duration: 4 + Math.random() * 3,
          size: 1 + Math.random() * 1.6,
          opacity: 0.5 + Math.random() * 0.4
        });
      }, i * 90);
    }
  }

  // Expose a small public API for the other modules.
  window.FriendshipFX = {
    spawnHeart: spawnHeart,
    startAmbientHearts: startAmbientHearts,
    burstHearts: burstHearts
  };

  function initEffects() {
    const fxLayer = document.getElementById('fxLayer');
    const introParticles = document.querySelector('.intro-particles');

    // Gentle ambient hearts across the whole page, always on but sparse.
    if (fxLayer) {
      startAmbientHearts(fxLayer, { interval: 2200, max: 8 });
    }

    // A slightly denser drizzle just behind the intro screen for atmosphere.
    if (introParticles) {
      startAmbientHearts(introParticles, { interval: 1600, max: 10 });
    }
  }

  window.initEffects = initEffects;
})();

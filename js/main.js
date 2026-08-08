/* =============================================================
   MAIN.JS
   Boots every module in order, and — critically — only switches
   the page into the "gated" envelope experience once setup has
   actually succeeded. If anything throws, the site falls back to
   the always-visible, no-js layout instead of getting stuck.
   ============================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------------
     PERSONALIZATION SETTINGS
     These are optional — most text lives directly in index.html
     (search for "EDIT ME"). These two are used only to update the
     page <title> and a couple of ARIA labels, so you don't have
     to touch this file to personalize the letter itself.
     ------------------------------------------------------------- */
  const FRIEND_NAME = 'Dattvi';
  const NICKNAME = 'Bhonduuu';

  function applyPersonalization() {
    try {
      document.title = 'For ' + NICKNAME + ' — A Friendship Day Letter';
      const envelope = document.getElementById('envelope');
      if (envelope) {
        envelope.setAttribute('aria-label', 'Tap to open ' + FRIEND_NAME + "'s letter");
      }
    } catch (e) {
      /* Non-critical — never let personalization break the page. */
    }
  }

  /* ---------------- Scroll reveal ---------------- */
  function initScrollAnimations() {
    const targets = document.querySelectorAll('.reveal-on-scroll');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      // No observer support: just show everything.
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- Interactive surprise ---------------- */
  function initSurprise() {
    const btn = document.getElementById('surpriseBtn');
    const message = document.getElementById('surpriseMessage');
    const section = document.getElementById('surprise');
    const fxLayer = document.getElementById('fxLayer');

    if (!btn || !message) return;

    let revealed = false;

    btn.addEventListener('click', function () {
      if (revealed) return;
      revealed = true;

      message.hidden = false;
      // allow the browser to paint hidden=false before animating in
      requestAnimationFrame(function () {
        message.style.animation = 'fadeIn 1s ease';
      });

      if (section) section.classList.add('is-active');
      btn.setAttribute('aria-expanded', 'true');

      if (fxLayer && window.FriendshipFX) {
        window.FriendshipFX.burstHearts(fxLayer, 22);
      }
    });
  }

  /* ---------------- Boot sequence ---------------- */
  function init() {
    applyPersonalization();

    // Tentatively switch on the gated experience...
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

    try {
      if (typeof window.initEffects === 'function') window.initEffects();
      if (typeof window.initMusic === 'function') window.initMusic();
      if (typeof window.initGallery === 'function') window.initGallery();
      if (typeof window.initEnvelope === 'function') window.initEnvelope();
      initScrollAnimations();
      initSurprise();
    } catch (err) {
      // ...but if anything above failed, don't leave the visitor
      // stuck behind an envelope that will never open. Fall back
      // to the fully-visible static layout instead.
      // eslint-disable-next-line no-console
      console.error('Friendship site: falling back to static layout —', err);
      document.documentElement.classList.remove('js');
      document.documentElement.classList.add('no-js');

      const storyContent = document.getElementById('storyContent');
      if (storyContent) storyContent.classList.add('is-revealed');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

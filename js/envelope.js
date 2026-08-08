/* =============================================================
   ENVELOPE.JS
   Handles the intro -> envelope -> letter/story hand-off.
   Every step is guarded so a missing element just skips its
   step instead of leaving the page stuck.
   ============================================================= */

(function () {
  'use strict';

  function initEnvelope() {
    const intro = document.getElementById('intro');
    const introBtn = document.getElementById('introBtn');
    const envelopeSection = document.getElementById('envelopeSection');
    const envelope = document.getElementById('envelope');
    const envelopeHint = document.getElementById('envelopeHint');
    const envelopeHearts = document.getElementById('envelopeHearts');
    const storyContent = document.getElementById('storyContent');

    // If the core stage elements aren't present, there's nothing
    // to gate — the story content is already visible by default.
    if (!intro || !envelopeSection || !envelope || !storyContent) return;

    /* ---- Stage 1: intro -> envelope ---- */
    if (introBtn) {
      introBtn.addEventListener('click', function () {
        intro.classList.add('is-done');
        envelopeSection.classList.add('is-active');
      });
    }

    /* ---- Stage 2: envelope -> letter/story ---- */
    let opened = false;

    function openEnvelope() {
      if (opened) return;
      opened = true;

      envelope.classList.add('is-open');
      envelope.setAttribute('aria-label', 'Letter opened');
      if (envelopeHint) envelopeHint.textContent = 'Opening...';

      if (envelopeHearts && window.FriendshipFX) {
        window.FriendshipFX.burstHearts(envelopeHearts, 14);
      }

      // Let the CSS open animation play, then hand off to the
      // full story. Matches the ~1s flap/letter transition.
      window.setTimeout(function () {
        envelopeSection.classList.add('is-done');
        intro.classList.add('is-done');

        storyContent.classList.add('is-revealed');

        // Bring the reader straight to the letter.
        const letter = document.getElementById('letter');
        if (letter && typeof letter.scrollIntoView === 'function') {
          letter.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1100);
    }

    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  window.initEnvelope = initEnvelope;
})();

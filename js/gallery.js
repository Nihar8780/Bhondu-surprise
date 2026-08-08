/* =============================================================
   GALLERY.JS
   Photo lightbox + memory flip cards. Fully defensive — if any
   expected element is missing, that piece just skips itself
   instead of throwing.
   ============================================================= */

(function () {
  'use strict';

  function initGallery() {
    initLightbox();
    initMemoryCards();
  }

  /* ---------------- Lightbox ---------------- */
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const polaroids = document.querySelectorAll('.polaroid');

    if (!lightbox || !lightboxImg || !polaroids.length) return;

    let lastFocused = null;

    function openLightbox(polaroid) {
      const img = polaroid.querySelector('img');
      const caption = polaroid.getAttribute('data-caption') || '';
      const label = polaroid.querySelector('.polaroid__label');

      if (img && !polaroid.classList.contains('polaroid--fallback')) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightboxImg.hidden = false;
      } else {
        lightboxImg.hidden = true;
      }

      lightboxCaption.textContent = caption || (label ? label.textContent : '');

      lastFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';

      const closeBtn = lightbox.querySelector('.lightbox__close');
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    polaroids.forEach(function (p) {
      p.addEventListener('click', function () { openLightbox(p); });
    });

    lightbox.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------------- Memory flip cards ---------------- */
  function initMemoryCards() {
    const cards = document.querySelectorAll('.flip-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        const expanded = card.getAttribute('aria-expanded') === 'true';
        card.setAttribute('aria-expanded', String(!expanded));
      });
    });
  }

  window.initGallery = initGallery;
})();

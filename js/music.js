/* =============================================================
   MUSIC.JS
   Optional background music. Never autoplays (browsers block it
   anyway) and never throws if assets/music/friendship-song.mp3
   is missing — the toggle just quietly does nothing harmful.
   ============================================================= */

(function () {
  'use strict';

  function initMusic() {
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    const status = document.getElementById('musicStatus');

    if (!audio || !toggle) return;

    let isPlaying = false;
    let hasErrored = false;

    // If the mp3 doesn't exist, disable the control instead of
    // leaving it clickable-but-broken.
    audio.addEventListener('error', function () {
      hasErrored = true;
      toggle.setAttribute('aria-disabled', 'true');
      toggle.style.opacity = '0.5';
      if (status) status.textContent = 'No Music';
    });

    function setPlayingUI(playing) {
      isPlaying = playing;
      toggle.setAttribute('aria-pressed', String(playing));
      if (status) status.textContent = playing ? 'Music On' : 'Music Off';
      toggle.setAttribute(
        'aria-label',
        playing ? 'Pause background music' : 'Play background music'
      );
    }

    toggle.addEventListener('click', function () {
      if (hasErrored) return;

      if (isPlaying) {
        audio.pause();
        setPlayingUI(false);
        return;
      }

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(function () { setPlayingUI(true); })
          .catch(function () {
            // Autoplay/permission restrictions — fail silently,
            // keep the UI in the "off" state.
            setPlayingUI(false);
          });
      } else {
        setPlayingUI(true);
      }
    });
  }

  window.initMusic = initMusic;
})();

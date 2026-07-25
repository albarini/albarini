/* ============================================================
   MÓDULO · REVEAL ON SCROLL
   Intersection Observer sobre [data-reveal].

   · data-reveal            → fade-up del bloque completo
   · data-reveal="words"    → cada palabra sube tras una máscara
   · data-reveal-delay="n"  → retardo escalonado (n × 90 ms)
   ============================================================ */
SC.register('reveal', function (root) {
  'use strict';

  var U = SC.utils;
  var cfg = SC.config.reveal;
  var items = U.qsa('[data-reveal]', root);
  if (!items.length) return;

  /* Sin IntersectionObserver (navegadores antiguos): mostrar todo */
  if (!('IntersectionObserver' in window) || U.reducedMotion()) {
    items.forEach(function (el) { el.classList.add('is-inview', 'is-done'); });
    return;
  }

  /* ---- Preparación: partir en palabras cuando toca --------- */
  items.forEach(function (el) {
    var delay = el.getAttribute('data-reveal-delay');
    if (delay) el.style.setProperty('--reveal-delay', delay);

    if (el.getAttribute('data-reveal') === 'words') {
      U.splitWords(el, 'word', true);
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        if (!cfg.once) entry.target.classList.remove('is-inview');
        return;
      }

      var el = entry.target;
      el.classList.add('is-inview');

      /* Libera la capa de composición al terminar la transición */
      setTimeout(function () { el.classList.add('is-done'); }, 1800);

      if (cfg.once) observer.unobserve(el);
    });
  }, {
    root: null,
    rootMargin: cfg.rootMargin,
    threshold: cfg.threshold
  });

  /* Espera al preloader para que la primera pantalla se anime
     una vez la cortina ya está subiendo */
  function start() {
    items.forEach(function (el) { observer.observe(el); });
  }

  if (document.documentElement.classList.contains('is-loaded')) start();
  else document.addEventListener('sc:loaded', start, { once: true });

  /* Salvaguarda por si el evento no llegara nunca */
  setTimeout(start, 4200);

  return {
    destroy: function () { observer.disconnect(); }
  };
});

/* ============================================================
   MÓDULO · CONTADORES
   Cuenta ascendente al entrar en pantalla.
   Marcado: <strong data-count="140" data-count-suffix="%">0</strong>
   ============================================================ */
SC.register('counter', function (root) {
  'use strict';

  var U = SC.utils;
  var nodes = U.qsa('[data-count]', root);
  if (!nodes.length) return;

  function render(el, value) {
    el.textContent = value + (el.dataset.countSuffix || '');
  }

  if (U.reducedMotion() || !('IntersectionObserver' in window)) {
    nodes.forEach(function (el) { render(el, parseInt(el.dataset.count, 10) || 0); });
    return;
  }

  var DURATION = 1600;

  function run(el) {
    var to = parseInt(el.dataset.count, 10) || 0;
    var t0 = performance.now();

    (function step(now) {
      var p = U.clamp((now - t0) / DURATION, 0, 1);
      var eased = 1 - Math.pow(1 - p, 4);       // ease-out-quart
      render(el, Math.round(to * eased));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  nodes.forEach(function (el) { observer.observe(el); });

  return { destroy: function () { observer.disconnect(); } };
});

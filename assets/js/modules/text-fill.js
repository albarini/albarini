/* ============================================================
   MÓDULO · TEXT FILL ON SCROLL
   El titular pasa de gris a tinta palabra por palabra según el
   progreso del bloque dentro del viewport — el gesto tipográfico
   característico de la referencia.

   Marcado: <h2 data-text-fill>…</h2>
   ============================================================ */
SC.register('textFill', function (root) {
  'use strict';

  var U = SC.utils;
  var blocks = U.qsa('[data-text-fill]', root);
  if (!blocks.length || U.reducedMotion()) return;

  var SPREAD = 6;   // cuántas palabras se están rellenando a la vez

  var items = blocks.map(function (el) {
    return {
      el: el,
      words: U.splitWords(el, 'fill-word', false),
      top: 0,
      height: 0
    };
  });

  function measure() {
    items.forEach(function (it) {
      var rect = it.el.getBoundingClientRect();
      it.top = rect.top + window.scrollY;
      it.height = rect.height;
    });
  }

  function tick() {
    var vh = window.innerHeight;
    var y = SC.scroll.y;

    items.forEach(function (it) {
      /* Progreso: 0 cuando el bloque entra por abajo,
         1 cuando su base cruza el 35 % superior de la pantalla */
      var start = it.top - vh * 0.85;
      var end = it.top + it.height - vh * 0.35;
      var p = U.clamp((y - start) / Math.max(end - start, 1), 0, 1);

      var n = it.words.length;
      var head = p * (n + SPREAD);

      for (var i = 0; i < n; i++) {
        var wp = U.clamp((head - i) / SPREAD, 0, 1);
        it.words[i].style.setProperty('--p', U.round(wp, 2));
      }
    });
  }

  measure();
  var offResize = U.onResize(measure);
  var offTicker = SC.ticker.add(tick, 20);
  window.addEventListener('load', measure);

  return {
    destroy: function () { offTicker(); offResize(); }
  };
});

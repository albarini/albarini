/* ============================================================
   CORE · TICKER
   Un único requestAnimationFrame para toda la página.

   Motivo: cada módulo con su propio rAF multiplica los reflows y
   desincroniza las animaciones. Aquí se lee el scroll una sola vez
   por frame y se reparte a los suscriptores ordenados por
   prioridad (menor `order` = se ejecuta antes).
   ============================================================ */
(function (SC) {
  'use strict';

  var subs = [];
  var running = false;
  var lastTime = 0;

  function sort() {
    subs.sort(function (a, b) { return a.order - b.order; });
  }

  function frame(time) {
    var dt = Math.min((time - lastTime) / 1000, 0.064); // cap a ~15fps
    lastTime = time;

    /* --- Estado de scroll (lectura única por frame) --- */
    var s = SC.scroll;
    s.prev = s.y;
    s.y = window.scrollY || window.pageYOffset || 0;
    s.delta = s.y - s.prev;
    if (s.delta !== 0) s.direction = s.delta > 0 ? 1 : -1;
    s.limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    for (var i = 0; i < subs.length; i++) {
      subs[i].fn(dt, time);
    }

    if (running) requestAnimationFrame(frame);
  }

  SC.ticker = {
    /**
     * @param {Function} fn     callback(dt, time)
     * @param {number}   order  prioridad (por defecto 0)
     * @returns {Function} función para darse de baja
     */
    add: function (fn, order) {
      var entry = { fn: fn, order: order || 0 };
      subs.push(entry);
      sort();
      this.start();
      return function () {
        var i = subs.indexOf(entry);
        if (i > -1) subs.splice(i, 1);
      };
    },

    start: function () {
      if (running) return;
      running = true;
      lastTime = performance.now();
      requestAnimationFrame(frame);
    },

    stop: function () { running = false; }
  };

  /* Pausar el bucle cuando la pestaña no está visible */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) SC.ticker.stop();
    else SC.ticker.start();
  });

})(window.SC);

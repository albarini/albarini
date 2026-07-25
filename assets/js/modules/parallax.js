/* ============================================================
   MÓDULO · PARALLAX
   Desplaza el elemento a una velocidad distinta a la del scroll.

   Marcado: <div data-parallax="0.18"> — valor = intensidad.
   Las medidas se cachean y solo se recalculan en resize/load:
   dentro del bucle solo se escriben transforms (cero reflows).
   ============================================================ */
SC.register('parallax', function (root) {
  'use strict';

  var U = SC.utils;
  var nodes = U.qsa('[data-parallax]', root);
  if (!nodes.length || U.reducedMotion()) return;

  var max = SC.config.parallax.max;

  var items = nodes.map(function (el) {
    return {
      el: el,
      speed: parseFloat(el.getAttribute('data-parallax')) || 0.1,
      center: 0,
      current: 0,
      target: 0,
      visible: false
    };
  });

  function measure() {
    var y = window.scrollY;
    items.forEach(function (it) {
      var rect = it.el.getBoundingClientRect();
      it.center = rect.top + y + rect.height / 2;
    });
  }

  /* Solo animamos lo que está en pantalla */
  var observer = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var item = items.filter(function (i) { return i.el === entry.target; })[0];
          if (item) item.visible = entry.isIntersecting;
        });
      }, { rootMargin: '20% 0px 20% 0px' })
    : null;

  if (observer) items.forEach(function (it) { observer.observe(it.el); });
  else items.forEach(function (it) { it.visible = true; });

  function tick(dt) {
    var y = SC.scroll.y;
    var vh = window.innerHeight;

    items.forEach(function (it) {
      if (!it.visible) return;

      /* Distancia del centro del elemento al centro del viewport */
      var offset = (y + vh / 2) - it.center;
      it.target = U.clamp(offset * it.speed, -max, max);
      it.current = U.damp(it.current, it.target, 9, dt);

      it.el.style.transform = 'translate3d(0,' + U.round(it.current, 2) + 'px,0)';
    });
  }

  measure();
  var offResize = U.onResize(measure);
  var offTicker = SC.ticker.add(tick, 30);
  window.addEventListener('load', measure);

  return {
    destroy: function () {
      offTicker();
      offResize();
      if (observer) observer.disconnect();
      items.forEach(function (it) { it.el.style.transform = ''; });
    }
  };
});

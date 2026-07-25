/* ============================================================
   MÓDULO · BOTONES MAGNÉTICOS
   El elemento se desplaza hacia el cursor cuando entra en su radio
   de atracción y vuelve a su sitio al salir.

   Marcado: <a class="btn" data-magnetic>…</a>
   ============================================================ */
SC.register('magnetic', function (root) {
  'use strict';

  var U = SC.utils;
  if (U.isTouch() || U.reducedMotion()) return;

  var cfg = SC.config.magnetic;
  var nodes = U.qsa('[data-magnetic]', root);
  if (!nodes.length) return;

  var items = nodes.map(function (el) {
    return { el: el, x: 0, y: 0, tx: 0, ty: 0, active: false, rect: null };
  });

  function cache(it) { it.rect = it.el.getBoundingClientRect(); }

  function onEnter(it) {
    return function () { cache(it); it.active = true; };
  }

  function onLeave(it) {
    return function () { it.active = false; it.tx = 0; it.ty = 0; };
  }

  function onMove(it) {
    return function (e) {
      if (!it.rect) cache(it);
      var cx = it.rect.left + it.rect.width / 2;
      var cy = it.rect.top + it.rect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;

      var dist = Math.hypot(dx, dy);
      var reach = Math.max(it.rect.width, it.rect.height) / 2 + cfg.radius;
      var falloff = U.clamp(1 - dist / reach, 0, 1);

      it.tx = dx * cfg.strength * falloff;
      it.ty = dy * cfg.strength * falloff;
    };
  }

  items.forEach(function (it) {
    it._enter = onEnter(it);
    it._leave = onLeave(it);
    it._move = onMove(it);
    it.el.addEventListener('mouseenter', it._enter);
    it.el.addEventListener('mouseleave', it._leave);
    it.el.addEventListener('mousemove', it._move);
    it.el.addEventListener('blur', it._leave);
  });

  function tick(dt) {
    items.forEach(function (it) {
      var lambda = it.active ? 14 : 9;
      it.x = U.damp(it.x, it.tx, lambda, dt);
      it.y = U.damp(it.y, it.ty, lambda, dt);

      if (Math.abs(it.x) < 0.05 && Math.abs(it.y) < 0.05 && !it.active) {
        if (it.el.style.transform) it.el.style.transform = '';
        return;
      }
      it.el.style.transform = 'translate3d(' + U.round(it.x, 2) + 'px,' + U.round(it.y, 2) + 'px,0)';
    });
  }

  var offTicker = SC.ticker.add(tick, 40);
  var offResize = U.onResize(function () { items.forEach(cache); });

  return {
    destroy: function () {
      offTicker();
      offResize();
      items.forEach(function (it) {
        it.el.removeEventListener('mouseenter', it._enter);
        it.el.removeEventListener('mouseleave', it._leave);
        it.el.removeEventListener('mousemove', it._move);
        it.el.removeEventListener('blur', it._leave);
        it.el.style.transform = '';
      });
    }
  };
});

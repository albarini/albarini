/* ============================================================
   MÓDULO · CURSOR PERSONALIZADO
   Punto que sigue al ratón al instante y anillo con inercia que
   crece sobre elementos interactivos y muestra una etiqueta.

   Marcado opcional: data-cursor-label="Ver"
   ============================================================ */
SC.register('cursor', function (root) {
  'use strict';

  var U = SC.utils;
  var el = root.querySelector('#cursor');
  if (!el || U.isTouch() || U.reducedMotion()) return;

  var dot = el.querySelector('.cursor__dot');
  var ring = el.querySelector('.cursor__ring');
  var label = el.querySelector('.cursor__label');

  var lerp = SC.config.cursor.lerp;
  var lambda = -Math.log(1 - lerp) * 60;

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var rx = mx, ry = my;

  var HOVER_SEL = 'a, button, [data-cursor], input, select, textarea, label';

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!el.classList.contains('is-active')) el.classList.add('is-active');
  }

  function onOver(e) {
    var t = e.target.closest(HOVER_SEL);
    if (!t) return;
    el.classList.add('is-hover');
    var holder = t.closest('[data-cursor-label]');
    if (label) label.textContent = holder ? holder.getAttribute('data-cursor-label') : '';
  }

  function onOut(e) {
    if (e.target.closest(HOVER_SEL)) {
      el.classList.remove('is-hover');
      if (label) label.textContent = '';
    }
  }

  function onLeaveWindow() { el.classList.remove('is-active'); }
  function onEnterWindow() { el.classList.add('is-active'); }

  function tick(dt) {
    rx = U.damp(rx, mx, lambda, dt);
    ry = U.damp(ry, my, lambda, dt);

    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
    ring.style.transform = 'translate3d(' + U.round(rx, 1) + 'px,' + U.round(ry, 1) + 'px,0) translate(-50%,-50%)';
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);
  document.addEventListener('mouseleave', onLeaveWindow);
  document.addEventListener('mouseenter', onEnterWindow);

  var offTicker = SC.ticker.add(tick, 50);

  return {
    destroy: function () {
      offTicker();
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeaveWindow);
      document.removeEventListener('mouseenter', onEnterWindow);
      el.classList.remove('is-active', 'is-hover');
    }
  };
});

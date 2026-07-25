/* ============================================================
   MÓDULO · NAVBAR
   · transparente sobre el hero
   · se oculta al bajar, reaparece sólida (glass) al subir
   · submenú accesible con teclado, hover y clic
   ============================================================ */
SC.register('navbar', function (root) {
  'use strict';

  var U = SC.utils;
  var nav = root.querySelector('[data-nav]');
  if (!nav) return;

  var SOLID_AT = 60;    // px a partir de los que la barra deja de ser transparente
  var HIDE_AT = 220;    // px a partir de los que puede ocultarse
  var isSolid = false;
  var isHidden = false;

  function tick() {
    var y = SC.scroll.y;
    var dir = SC.scroll.direction;

    var solid = y > SOLID_AT;
    if (solid !== isSolid) {
      isSolid = solid;
      nav.classList.toggle('is-solid', solid);
    }

    var hide = dir > 0 && y > HIDE_AT && !document.body.classList.contains('is-locked');
    if (hide !== isHidden) {
      isHidden = hide;
      nav.classList.toggle('is-hidden', hide);
      if (hide) closeAll();
    }
  }

  /* ---- Submenús -------------------------------------------- */
  var dropdowns = U.qsa('[data-dropdown]', nav);

  function closeAll(except) {
    dropdowns.forEach(function (d) {
      if (d === except) return;
      d.classList.remove('is-open');
      var btn = d.querySelector('[aria-expanded]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function toggle(d, force) {
    var btn = d.querySelector('[aria-expanded]');
    var open = force != null ? force : !d.classList.contains('is-open');
    closeAll(d);
    d.classList.toggle('is-open', open);
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }

  dropdowns.forEach(function (d) {
    var btn = d.querySelector('[aria-expanded]');
    if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); toggle(d); });

    if (!U.isTouch()) {
      d.addEventListener('mouseenter', function () { toggle(d, true); });
      d.addEventListener('mouseleave', function () { toggle(d, false); });
    }
    d.addEventListener('focusout', function (e) {
      if (!d.contains(e.relatedTarget)) toggle(d, false);
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  document.addEventListener('sc:anchor', function () { closeAll(); });

  var offTicker = SC.ticker.add(tick, 10);
  tick();

  return {
    destroy: function () { offTicker(); }
  };
});

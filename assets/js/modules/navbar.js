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
  var isSolid = false;

  /**
   * La barra ya NO se oculta al bajar.
   *
   * Se decidía con la dirección del scroll leída en cada fotograma, sin ningún
   * umbral: con el scroll por inercia del móvil esa dirección se invierte
   * continuamente por oscilaciones de un píxel, así que la barra entraba y
   * salía sin parar. Era el parpadeo que se veía en el teléfono.
   *
   * Además la referencia mantiene la barra siempre visible: transparente sobre
   * el hero y sólida a partir del primer scroll. Quitarlo corrige el fallo y
   * acerca el diseño al original.
   */
  function tick() {
    var solid = SC.scroll.y > SOLID_AT;
    if (solid === isSolid) return;
    isSolid = solid;
    nav.classList.toggle('is-solid', solid);
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

/* ============================================================
   MÓDULO · MENÚ MÓVIL
   Overlay a pantalla completa con revelado por clip-path y
   escalonado de los enlaces. Bloquea el scroll y devuelve el foco.
   ============================================================ */
SC.register('menu', function (root) {
  'use strict';

  var burger = root.querySelector('#burger');
  var menu = root.querySelector('#menu');
  if (!burger || !menu) return;

  var isOpen = false;
  var lastFocus = null;

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;

    menu.hidden = false;
    /* Fuerza un reflow para que la transición de clip-path arranque */
    void menu.offsetHeight;

    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('is-locked');

    var first = menu.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('is-locked');

    setTimeout(function () { if (!isOpen) menu.hidden = true; }, 700);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  burger.addEventListener('click', function () { isOpen ? close() : open(); });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('[data-menu-close]')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  /* Al pasar a escritorio el overlay deja de tener sentido */
  var offResize = SC.utils.onResize(function () {
    if (isOpen && window.innerWidth > 860) close();
  });

  return {
    open: open,
    close: close,
    destroy: function () { offResize(); close(); }
  };
});

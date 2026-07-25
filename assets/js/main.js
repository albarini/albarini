/* ============================================================
   MAIN · punto de entrada
   Se carga en último lugar: para cuando se ejecuta, todos los
   módulos ya están registrados en SC.modules.
   ============================================================ */
(function (SC) {
  'use strict';

  function start() {
    /* Año dinámico del footer */
    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    /* Evita el salto de scroll del navegador al recargar */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    SC.boot(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

})(window.SC);

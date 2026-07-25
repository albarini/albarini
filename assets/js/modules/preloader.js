/* ============================================================
   MÓDULO · PRELOADER
   Cortina inicial con barra de progreso. Al terminar dispara el
   evento `sc:loaded`, que otros módulos usan para arrancar sus
   animaciones de entrada.
   ============================================================ */
SC.register('preloader', function (root) {
  'use strict';

  var el = root.querySelector('#preloader');
  if (!el) return;

  var bar = el.querySelector('.preloader__bar i');
  var progress = 0;
  var done = false;
  var raf = null;

  function setProgress(v) {
    progress = v;
    if (bar) bar.style.setProperty('--progress', v.toFixed(3));
  }

  function creep() {
    if (done) return;
    /* Avance asintótico: nunca llega al 100 % por su cuenta */
    setProgress(progress + (0.92 - progress) * 0.045);
    raf = requestAnimationFrame(creep);
  }

  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    setProgress(1);

    setTimeout(function () {
      el.classList.add('is-done');
      document.documentElement.classList.add('is-loaded');
      document.dispatchEvent(new CustomEvent('sc:loaded'));
      setTimeout(function () { el.setAttribute('hidden', ''); }, 1400);
    }, 260);
  }

  if (SC.utils.reducedMotion()) {
    finish();
  } else {
    creep();
    if (document.readyState === 'complete') setTimeout(finish, 420);
    else window.addEventListener('load', function () { setTimeout(finish, 220); });
    /* Red de seguridad: nunca bloquear la página más de 4 s */
    setTimeout(finish, 4000);
  }

  return { destroy: function () { cancelAnimationFrame(raf); } };
});

/* ============================================================
   MÓDULO · SMOOTH SCROLL (estilo Lenis, sin dependencias)

   Estrategia: se intercepta la rueda, se acumula un destino y se
   interpola hacia él con `window.scrollTo`. Al usar el scroll
   nativo se conservan la barra, position:fixed, los anclajes y la
   accesibilidad — a diferencia de las soluciones que transforman
   un wrapper.

   Se desactiva solo en táctil y con movimiento reducido, donde el
   scroll nativo ya es mejor.
   ============================================================ */
SC.register('smoothScroll', function (root) {
  'use strict';

  var U = SC.utils;
  var cfg = SC.config.smoothScroll;
  var navEl = root.querySelector('[data-nav]');

  var enabled = cfg.enabled && !U.reducedMotion() && !U.isTouch();
  var target = window.scrollY;
  var current = target;
  var lastWheel = 0;
  var lastPainted = -1;                        // último píxel entero escrito
  var lambda = -Math.log(1 - cfg.lerp) * 60;   // lerp por frame → constante temporal
  var offTicker = null;

  /* ---- Normaliza deltas de rueda / trackpad --------------- */
  function wheelDelta(e) {
    var d = e.deltaY;
    if (e.deltaMode === 1) d *= 16;                       // líneas
    else if (e.deltaMode === 2) d *= window.innerHeight;  // páginas
    return d;
  }

  function limit() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function onWheel(e) {
    if (document.body.classList.contains('is-locked')) return;
    if (e.ctrlKey) return;                                 // zoom del navegador
    e.preventDefault();
    lastWheel = performance.now();
    target = U.clamp(target + wheelDelta(e) * cfg.wheelMultiplier, 0, limit());
  }

  function tick(dt) {
    /* Re-sincroniza si el scroll lo movió otra fuente
       (barra de desplazamiento, teclado, buscador del navegador) */
    if (performance.now() - lastWheel > cfg.resyncDelay) {
      var native = window.scrollY;
      if (Math.abs(native - current) > 2) {
        current = target = native;
        SC.scroll.y = current;
        return;
      }
    }

    if (Math.abs(target - current) < 0.12) {
      current = target;
      return;
    }

    current = U.damp(current, target, lambda, dt);

    /* Se redondea a píxel entero antes de escribir. Con posiciones
       fraccionarias el navegador re-rasteriza TODO el texto en cada fotograma
       con un desfase de subpíxel distinto: eso es lo que se percibe como
       parpadeo o vibración de las letras al hacer scroll. */
    var px = Math.round(current);
    if (px !== lastPainted) {
      lastPainted = px;
      window.scrollTo(0, px);
    }
    SC.scroll.y = px;
  }

  /* ---- API pública ----------------------------------------- */
  function scrollTo(y, immediate) {
    y = U.clamp(y, 0, limit());
    target = y;
    lastWheel = performance.now();
    if (immediate || !enabled) {
      current = y;
      window.scrollTo(0, y);
    }
  }

  function offsetFor(el) {
    if (el.id === 'hero') return 0;
    var navH = navEl ? navEl.offsetHeight : 0;
    return window.scrollY + el.getBoundingClientRect().top - navH;
  }

  /* ---- Anclajes internos ----------------------------------- */
  function onClick(e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute('href');
    if (!id || id === '#') return;

    var el = document.querySelector(id);
    if (!el) return;

    e.preventDefault();
    document.dispatchEvent(new CustomEvent('sc:anchor', { detail: { id: id } }));

    var y = offsetFor(el);
    if (enabled) scrollTo(y);
    else window.scrollTo({ top: y, behavior: U.reducedMotion() ? 'auto' : 'smooth' });

    if (history.replaceState) history.replaceState(null, '', id);
  }

  document.addEventListener('click', onClick);

  if (enabled) {
    document.documentElement.classList.add('has-smooth-scroll');
    window.addEventListener('wheel', onWheel, { passive: false });
    offTicker = SC.ticker.add(tick, -100);   // se ejecuta antes que parallax/navbar
  }

  return {
    scrollTo: scrollTo,
    isEnabled: function () { return enabled; },
    destroy: function () {
      document.removeEventListener('click', onClick);
      window.removeEventListener('wheel', onWheel);
      if (offTicker) offTicker();
      document.documentElement.classList.remove('has-smooth-scroll');
    }
  };
});

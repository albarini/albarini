/* ============================================================
   CORE · UTILS
   Helpers sin dependencias, compartidos por todos los módulos.
   ============================================================ */
(function (SC) {
  'use strict';

  var resizeCallbacks = [];
  var resizeTimer = null;

  var U = {

    /* ---- Selección ------------------------------------------ */
    qs: function (sel, ctx) { return (ctx || document).querySelector(sel); },
    qsa: function (sel, ctx) {
      return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
    },

    /* ---- Matemáticas ---------------------------------------- */
    clamp: function (v, min, max) { return Math.min(Math.max(v, min), max); },

    lerp: function (a, b, t) { return a + (b - a) * t; },

    /* Interpolación independiente del framerate */
    damp: function (a, b, lambda, dt) {
      return U.lerp(a, b, 1 - Math.exp(-lambda * dt));
    },

    map: function (v, inMin, inMax, outMin, outMax) {
      return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
    },

    round: function (v, p) {
      var f = Math.pow(10, p || 3);
      return Math.round(v * f) / f;
    },

    /* ---- Entorno -------------------------------------------- */
    reducedMotion: function () {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    isTouch: function () {
      return window.matchMedia('(hover: none), (pointer: coarse)').matches;
    },

    /* ---- Eventos -------------------------------------------- */
    onResize: function (fn, delay) {
      var entry = { fn: fn, delay: delay == null ? 150 : delay };
      resizeCallbacks.push(entry);
      return function () {
        var i = resizeCallbacks.indexOf(entry);
        if (i > -1) resizeCallbacks.splice(i, 1);
      };
    },

    /* ---- DOM ------------------------------------------------ */
    /**
     * Divide el texto de un elemento en palabras envueltas en spans,
     * respetando los saltos de línea naturales del navegador.
     * @param {HTMLElement} el
     * @param {string} wordClass  clase de la palabra
     * @param {boolean} mask      envuelve cada palabra en una máscara
     */
    splitWords: function (el, wordClass, mask) {
      var text = el.textContent.replace(/\s+/g, ' ').trim();
      var words = text.split(' ');
      var frag = document.createDocumentFragment();

      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = wordClass;
        span.style.setProperty('--w', i);
        span.textContent = word;

        if (mask) {
          var wrap = document.createElement('span');
          wrap.className = 'word-mask';
          wrap.appendChild(span);
          frag.appendChild(wrap);
        } else {
          frag.appendChild(span);
        }

        if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
      });

      el.textContent = '';
      el.appendChild(frag);
      return U.qsa('.' + wordClass, el);
    }
  };

  /* Un único listener de resize para toda la aplicación */
  window.addEventListener('resize', function () {
    SC.viewport.w = window.innerWidth;
    SC.viewport.h = window.innerHeight;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resizeCallbacks.forEach(function (e) { e.fn(); });
    }, 150);
  }, { passive: true });

  SC.viewport.w = window.innerWidth;
  SC.viewport.h = window.innerHeight;

  SC.utils = U;

})(window.SC);

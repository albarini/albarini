/* ============================================================
   CORE · APP
   Registro de módulos y estado global compartido.

   Patrón deliberadamente agnóstico: cada módulo es una función
   pura `init(root)` que devuelve `{ destroy }`. Migrar a ESM es
   añadir `export`; migrar a React es llamar al mismo init dentro
   de un `useEffect` y devolver `destroy` como cleanup.
   ============================================================ */
(function (window) {
  'use strict';

  var SC = {

    /* ---- Configuración global (ajustable sin tocar módulos) ---- */
    config: {
      smoothScroll: {
        /* Desactivado. Interpolar el scroll obliga a escribir la posición en
           cada fotograma y a repintar la página entera con ella; el scroll
           nativo va sobre el compositor del navegador y nunca se atasca.
           Los anclajes siguen funcionando con desplazamiento suave nativo. */
        enabled: false,
        lerp: 0.09,          // 0 = infinito, 1 = instantáneo
        wheelMultiplier: 1,
        resyncDelay: 140     // ms sin rueda antes de re-sincronizar
      },
      reveal: {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12,
        once: true
      },
      cursor: { lerp: 0.16 },
      magnetic: { strength: 0.32, radius: 90 },
      parallax: { max: 140 }
    },

    /* ---- Estado de scroll compartido por todos los módulos ---- */
    scroll: {
      y: 0,
      prev: 0,
      delta: 0,
      direction: 1,          // 1 abajo · -1 arriba
      limit: 0
    },

    viewport: { w: 0, h: 0 },

    modules: {},
    instances: {},

    register: function (name, factory) {
      SC.modules[name] = factory;
    },

    boot: function (root) {
      root = root || document;
      Object.keys(SC.modules).forEach(function (name) {
        try {
          var instance = SC.modules[name](root);
          if (instance) SC.instances[name] = instance;
        } catch (err) {
          /* Un módulo que falla nunca debe tumbar la página */
          if (window.console) console.warn('[SC] módulo "' + name + '" no inicializado:', err);
        }
      });
      document.documentElement.classList.add('is-ready');
    },

    destroy: function () {
      Object.keys(SC.instances).forEach(function (name) {
        var i = SC.instances[name];
        if (i && typeof i.destroy === 'function') i.destroy();
      });
      SC.instances = {};
    }
  };

  window.SC = SC;

})(window);

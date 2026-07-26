/* ============================================================
   MÓDULO · DESVANECIDO DEL HERO
   El contenido del hero se esfuma a medida que se hace scroll y
   vuelve a aparecer al subir.

   Solo se tocan `opacity` y `transform`: ambas se resuelven en el
   compositor, sin recalcular estilo ni maquetación. Escribir aquí
   cualquier otra propiedad (top, height, filter…) obligaría a
   repintar en cada fotograma y es justo lo que hace pesada una
   página con efectos de scroll.
   ============================================================ */
SC.register('heroFade', function (root) {
  'use strict';

  var U = SC.utils;
  var hero = root.querySelector('.hero');
  if (!hero) return;

  var content = hero.querySelector('.hero__content');
  if (!content || U.reducedMotion()) return;

  /* Se completa el desvanecido a media pantalla: pasado ese punto el
     hero ya no se ve y no tiene sentido seguir calculando. */
  var FIN = 0.5;
  var anterior = -1;

  function tick() {
    var vh = window.innerHeight;
    var p = U.clamp(SC.scroll.y / (vh * FIN), 0, 1);

    /* Solo se escribe cuando el valor cambia de verdad: evita miles de
       asignaciones idénticas al estar quieto en la parte alta. */
    var op = U.round(1 - p, 2);
    if (op === anterior) return;
    anterior = op;

    content.style.opacity = op;
    content.style.transform = 'translate3d(0,' + U.round(p * -40, 1) + 'px,0)';
  }

  var offTicker = SC.ticker.add(tick, 15);
  tick();

  return {
    destroy: function () {
      offTicker();
      content.style.opacity = '';
      content.style.transform = '';
    }
  };
});

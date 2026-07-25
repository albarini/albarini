/* ============================================================
   MÓDULO · MEDIA FALLBACK
   Los assets se referencian con rutas relativas pensadas para ser
   sustituidas por el CMS. Mientras no existan, este módulo dibuja
   un marcador de posición para que la maqueta sea presentable
   desde el primer momento — sin peticiones externas.

   Marcado: <img data-media-fallback="Etiqueta visible">
            <video data-media-fallback="Etiqueta visible">
   ============================================================ */
SC.register('mediaFallback', function (root) {
  'use strict';

  var U = SC.utils;
  var VIDEO_TIMEOUT = 2600;

  function placeholder(label) {
    var div = document.createElement('div');
    div.className = 'media-placeholder';
    div.setAttribute('aria-hidden', 'true');
    div.textContent = label || '';
    return div;
  }

  function replace(el) {
    if (el.dataset.fallbackApplied) return;
    el.dataset.fallbackApplied = '1';
    var node = placeholder(el.dataset.mediaFallback);
    if (el.parentNode) el.parentNode.replaceChild(node, el);
  }

  /* ---- Imágenes ------------------------------------------- */
  U.qsa('img[data-media-fallback]', root).forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
      replace(img);
    } else {
      img.addEventListener('error', function () { replace(img); }, { once: true });
    }
  });

  /* ---- Vídeo ----------------------------------------------
     Un <video> con <source> rotos no dispara 'error' de forma
     fiable en todos los navegadores: se comprueba readyState.  */
  U.qsa('video[data-media-fallback]', root).forEach(function (video) {
    var settled = false;

    function ok() { settled = true; }

    video.addEventListener('loadeddata', ok, { once: true });
    video.addEventListener('canplay', ok, { once: true });

    setTimeout(function () {
      if (settled || video.readyState >= 2) return;
      replace(video);
    }, VIDEO_TIMEOUT);
  });

  return { destroy: function () {} };
});

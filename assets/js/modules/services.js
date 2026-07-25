/* ============================================================
   MÓDULO · SERVICIOS
   1) Acordeón accesible (aria-expanded + grid-template-rows).
   2) Vista previa de imagen que sigue al cursor sobre la lista.

   Marcado: <li data-service data-service-img="./assets/img/x.jpg">
   ============================================================ */
SC.register('services', function (root) {
  'use strict';

  var U = SC.utils;
  var wrap = root.querySelector('[data-services]');
  if (!wrap) return;

  var items = U.qsa('[data-service]', wrap);
  var preview = wrap.querySelector('[data-services-preview]');
  var previewImg = wrap.querySelector('[data-services-preview-img]');

  /* ---------- 1 · Acordeón ---------------------------------- */
  function close(item) {
    item.classList.remove('is-open');
    var btn = item.querySelector('[aria-expanded]');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function toggle(item) {
    var open = !item.classList.contains('is-open');
    items.forEach(close);                 // comportamiento acordeón
    if (!open) return;
    item.classList.add('is-open');
    var btn = item.querySelector('[aria-expanded]');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  items.forEach(function (item) {
    var btn = item.querySelector('.service__head');
    if (btn) btn.addEventListener('click', function () { toggle(item); });
  });

  /* Abre el primero para que la sección no arranque vacía */
  if (items[0]) toggle(items[0]);

  /* ---------- 2 · Vista previa siguiendo al cursor ---------- */
  if (!preview || !previewImg || U.isTouch() || U.reducedMotion()) {
    return { destroy: function () {} };
  }

  var mx = 0, my = 0, px = 0, py = 0;
  var visible = false;
  var offTicker = null;

  function show(item) {
    var src = item.getAttribute('data-service-img');
    if (src && previewImg.getAttribute('src') !== src) {
      previewImg.setAttribute('src', src);
      previewImg.setAttribute('alt', '');
    }
    if (!visible) {
      visible = true;
      px = mx; py = my;                   // aparece ya bajo el cursor
      preview.classList.add('is-visible');
    }
  }

  function hide() {
    visible = false;
    preview.classList.remove('is-visible');
  }

  function onMove(e) { mx = e.clientX; my = e.clientY; }

  wrap.addEventListener('mousemove', onMove);
  wrap.addEventListener('mouseleave', hide);

  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () { show(item); });
  });

  function tick(dt) {
    if (!visible && Math.abs(px - mx) < 0.5 && Math.abs(py - my) < 0.5) return;
    px = U.damp(px, mx, 10, dt);
    py = U.damp(py, my, 10, dt);
    preview.style.transform =
      'translate3d(' + U.round(px, 1) + 'px,' + U.round(py, 1) + 'px,0) translate(-50%,-50%) scale(' + (visible ? 1 : 0.9) + ')';
  }

  offTicker = SC.ticker.add(tick, 45);

  /* Si la imagen no existe todavía, marcador de posición */
  previewImg.addEventListener('error', function () {
    if (previewImg.dataset.failed) return;
    previewImg.dataset.failed = '1';
    var ph = document.createElement('div');
    ph.className = 'media-placeholder';
    ph.textContent = 'Vista previa';
    preview.appendChild(ph);
    previewImg.style.display = 'none';
  });

  return {
    destroy: function () {
      if (offTicker) offTicker();
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', hide);
    }
  };
});

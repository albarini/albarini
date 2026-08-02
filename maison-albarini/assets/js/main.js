/* ============================================================
   MAISON ALBARINI  ·  Comportamiento de la portada
   Sin dependencias externas.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     Imagenes: aplica la foto si carga, si no deja un relleno
     grafico coherente con la paleta.
     ---------------------------------------------------------- */
  var FALLBACKS = [
    'linear-gradient(135deg,#1b1b1b 0%,#2e2a20 48%,#171717 100%)',
    'linear-gradient(135deg,#232323 0%,#3a3423 52%,#1a1a1a 100%)',
    'linear-gradient(160deg,#151515 0%,#2b2b2b 55%,#101010 100%)',
    'linear-gradient(120deg,#242018 0%,#3d3628 52%,#2a2a2a 100%)'
  ];

  function paintMedia() {
    $$('[data-img]').forEach(function (el, i) {
      var src = el.getAttribute('data-img');
      var fallback = FALLBACKS[i % FALLBACKS.length];
      var probe = new Image();

      probe.onload = function () {
        el.style.backgroundImage = 'url("' + src + '")';
        el.classList.add('has-photo');
      };
      probe.onerror = function () {
        el.style.backgroundImage = fallback;
        el.classList.add('is-placeholder');
      };
      probe.src = src;
    });
  }

  /* ----------------------------------------------------------
     Cabecera pegajosa
     ---------------------------------------------------------- */
  function stickyHeader() {
    var header = $('#header');
    if (!header) return;
    var last = null;

    var onScroll = function () {
      var stuck = window.scrollY > 8;
      if (stuck !== last) {
        header.classList.toggle('is-stuck', stuck);
        last = stuck;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     Carrusel del hero
     ---------------------------------------------------------- */
  function heroSlider() {
    var track = $('#heroTrack');
    if (!track) return;

    var slides = $$('.hero__slide', track);
    var dotsBox = $('#heroDots');
    var prev = $('#heroPrev');
    var next = $('#heroNext');
    var index = 0;
    var timer = null;
    var DELAY = 6500;

    if (!slides.length) return;

    // puntos
    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.className = 'hero__dot' + (i === 0 ? ' is-active' : '');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Diapositiva ' + (i + 1));
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { go(i); restart(); });
      dotsBox.appendChild(b);
      return b;
    });

    function go(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var on = i === index;
        s.classList.toggle('is-active', on);
        if (on) { s.removeAttribute('hidden'); } else { s.setAttribute('hidden', ''); }
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === index);
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    function start() {
      if (reduced || slides.length < 2) return;
      timer = window.setInterval(function () { go(index + 1); }, DELAY);
    }
    function stop() { window.clearInterval(timer); }
    function restart() { stop(); start(); }

    prev && prev.addEventListener('click', function () { go(index - 1); restart(); });
    next && next.addEventListener('click', function () { go(index + 1); restart(); });

    // pausa al pasar el cursor o al enfocar
    var hero = $('#hero');
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);

    // teclado
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { go(index - 1); restart(); }
      if (e.key === 'ArrowRight') { go(index + 1); restart(); }
    });

    // gesto tactil
    var x0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { go(dx < 0 ? index + 1 : index - 1); }
      x0 = null;
      start();
    }, { passive: true });

    // pausa cuando la pestana no esta visible
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    go(0);
    start();
  }

  /* ----------------------------------------------------------
     Megamenu, con soporte para puntero y para toque
     ---------------------------------------------------------- */
  function megaMenu() {
    var items = $$('.nav__item[data-mega]');
    var canHover = window.matchMedia('(hover: hover)').matches;

    function closeAll(except) {
      items.forEach(function (it) {
        if (it === except) return;
        it.classList.remove('is-open');
        var a = $('.nav__link', it);
        a && a.setAttribute('aria-expanded', 'false');
      });
    }

    items.forEach(function (item) {
      var link = $('.nav__link', item);

      if (canHover) {
        item.addEventListener('mouseenter', function () {
          closeAll(item);
          item.classList.add('is-open');
          link.setAttribute('aria-expanded', 'true');
        });
        item.addEventListener('mouseleave', function () {
          item.classList.remove('is-open');
          link.setAttribute('aria-expanded', 'false');
        });
      }

      link.addEventListener('click', function (e) {
        if (canHover) return;
        e.preventDefault();
        var open = item.classList.contains('is-open');
        closeAll();
        item.classList.toggle('is-open', !open);
        link.setAttribute('aria-expanded', String(!open));
      });

      item.addEventListener('focusin', function () {
        closeAll(item);
        item.classList.add('is-open');
        link.setAttribute('aria-expanded', 'true');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav__item[data-mega]')) closeAll();
    });
  }

  /* ----------------------------------------------------------
     Cajon movil
     ---------------------------------------------------------- */
  function drawer() {
    var burger = $('#burger');
    var panel  = $('#drawer');
    var scrim  = $('#scrim');
    if (!burger || !panel) return;

    function setOpen(open) {
      burger.classList.toggle('is-active', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menu' : 'Abrir menu');
      panel.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('is-locked', open);

      if (open) { scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('is-open'); }); }
      else { scrim.classList.remove('is-open'); window.setTimeout(function () { scrim.hidden = true; }, 380); }
    }

    burger.addEventListener('click', function () {
      setOpen(!panel.classList.contains('is-open'));
    });
    scrim.addEventListener('click', function () { setOpen(false); });

    var close = $('#drawerClose');
    close && close.addEventListener('click', function () { setOpen(false); });

    $$('.drawer__link, .drawer__foot a', panel).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ----------------------------------------------------------
     Revelado progresivo
     ---------------------------------------------------------- */
  function reveal() {
    var els = $$('.reveal');
    if (!els.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var i = els.indexOf(el);
        el.style.transitionDelay = ((i % 3) * 70) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------
     Asistente flotante, marcador de posicion
     ---------------------------------------------------------- */
  function bot() {
    var btn = $('#botBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.location.hash = '#contacto';
    });
  }

  /* ---------------------------------------------------------- */
  function init() {
    paintMedia();
    stickyHeader();
    heroSlider();
    megaMenu();
    drawer();
    reveal();
    bot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

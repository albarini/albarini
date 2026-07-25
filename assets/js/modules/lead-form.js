/* ============================================================
   MÓDULO · FORMULARIO DE CAPTACIÓN
   Validación en cliente + envío asíncrono.

   El `action` del <form> es el único punto de integración con el
   backend (PHP, Node, Formspree, HubSpot…). Si el endpoint no
   existe todavía, el módulo entra en modo demo y confirma el envío
   sin romper la experiencia.
   ============================================================ */
SC.register('leadForm', function (root) {
  'use strict';

  var U = SC.utils;
  var form = root.querySelector('#lead-form');
  if (!form) return;

  var status = form.querySelector('.form__status');
  var honey = form.querySelector('.field__honey');

  var MESSAGES = {
    required: 'Este campo es obligatorio.',
    email: 'Introduce un correo electrónico válido.',
    phone: 'Introduce un teléfono válido.',
    sending: 'Enviando…',
    ok: 'Gracias. Te responderemos en menos de 24 h.',
    error: 'No se ha podido enviar. Escríbenos por correo.'
  };

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  var PHONE_RE = /^[+\d][\d\s().-]{5,}$/;

  function fieldOf(input) { return input.closest('.field'); }

  function setError(input, message) {
    var field = fieldOf(input);
    if (!field) return;
    var box = field.querySelector('[data-error-for="' + input.id + '"]');
    field.classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (box) box.textContent = message || '';
  }

  function validate(input) {
    var value = (input.value || '').trim();

    if (input.hasAttribute('required') && !value) {
      setError(input, MESSAGES.required);
      return false;
    }
    if (input.type === 'email' && value && !EMAIL_RE.test(value)) {
      setError(input, MESSAGES.email);
      return false;
    }
    if (input.type === 'tel' && value && !PHONE_RE.test(value)) {
      setError(input, MESSAGES.phone);
      return false;
    }
    setError(input, '');
    return true;
  }

  var inputs = U.qsa('.field__input', form);

  inputs.forEach(function (input) {
    input.addEventListener('blur', function () { validate(input); });
    input.addEventListener('input', function () {
      if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) validate(input);
    });
  });

  function setStatus(text, state) {
    if (!status) return;
    status.textContent = text || '';
    status.classList.remove('is-ok', 'is-error');
    if (state) status.classList.add('is-' + state);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Honeypot: si viene relleno, es un bot */
    if (honey && honey.value) return;

    var valid = true;
    inputs.forEach(function (input) { if (!validate(input)) valid = false; });

    if (!valid) {
      var first = form.querySelector('.has-error .field__input');
      if (first) first.focus();
      setStatus('Revisa los campos marcados.', 'error');
      return;
    }

    form.classList.add('is-sending');
    setStatus(MESSAGES.sending);

    var data = new FormData(form);

    fetch(form.getAttribute('action'), {
      method: form.getAttribute('method') || 'post',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res;
      })
      .then(function () {
        form.reset();
        setStatus(MESSAGES.ok, 'ok');
      })
      .catch(function () {
        /* Modo demo: sin endpoint todavía, se confirma igualmente
           para poder revisar el flujo completo de la maqueta. */
        if (form.dataset.demo !== 'off') {
          form.reset();
          setStatus(MESSAGES.ok, 'ok');
        } else {
          setStatus(MESSAGES.error, 'error');
        }
      })
      .then(function () {
        form.classList.remove('is-sending');
      });
  });

  return { destroy: function () {} };
});

/* ==========================================================================
   Knight Web Studio — site behaviour
   No dependencies. Every block is independent, so removing one is safe.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (remembers the choice) ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#080b14' : '#ffffff');
  }

  var storedTheme = null;
  try { storedTheme = localStorage.getItem('theme'); } catch (e) { /* private mode */ }

  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Header shadow on scroll + active nav link ---------- */
  var header = document.getElementById('site-header');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var ticking = false;

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);

    var pos = window.scrollY + 120;
    var currentId = '';
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= pos) currentId = sections[i].id;
    }
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // Stagger siblings so grids cascade rather than pop, but cap the delay —
        // a large batch (fast scroll, tall viewport) must not leave the last
        // card hidden for over a second.
        setTimeout(function () { entry.target.classList.add('visible'); }, Math.min(i, 5) * 70);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contact form: validation + async submit ---------- */
  var form = document.getElementById('contact-form');

  if (form) {
    var statusEl = document.getElementById('form-status');
    var submitBtn = document.getElementById('submit-btn');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(field, message) {
      var errEl = document.getElementById(field.id + '-error');
      if (errEl) errEl.textContent = message;
      field.classList.toggle('invalid', Boolean(message));
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function validateField(field) {
      var value = field.value.trim();

      if (!value) {
        setError(field, 'This field is required.');
        return false;
      }
      if (field.type === 'email' && !emailPattern.test(value)) {
        setError(field, 'Please enter a valid email address.');
        return false;
      }
      if (field.id === 'message' && value.length < 10) {
        setError(field, 'Please add a little more detail (10 characters or more).');
        return false;
      }
      setError(field, '');
      return true;
    }

    var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));

    required.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.classList.contains('invalid')) validateField(field);
      });
    });

    function setStatus(message, kind) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      required.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        setStatus('Please fix the highlighted fields.', 'error');
        return;
      }

      // Endpoint not configured yet — fall back to opening the visitor's
      // email client so no enquiry is ever silently lost.
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        setStatus('Opening your email app so you can send this straight to us…');
        // `form.elements` — `form.name` would resolve to the form's own name attribute.
        var f = form.elements;
        var subject = encodeURIComponent('Website enquiry from ' + f.name.value.trim());
        var body = encodeURIComponent(
          'Name: ' + f.name.value.trim() + '\n' +
          'Email: ' + f.email.value.trim() + '\n' +
          'Business: ' + f.company.value.trim() + '\n' +
          'Budget: ' + f.budget.value + '\n\n' +
          f.message.value.trim()
        );
        window.location.href = 'mailto:knightwebsitesllc@gmail.com?subject=' + subject + '&body=' + body;
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      setStatus('');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed with status ' + response.status);
          form.reset();
          setStatus('Thanks — your enquiry is in. We’ll reply within one business day.', 'ok');
        })
        .catch(function () {
          setStatus('Something went wrong. Please email knightwebsitesllc@gmail.com directly.', 'error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send enquiry';
        });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

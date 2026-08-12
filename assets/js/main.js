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

  // The inline script in <head> already decided the theme before first paint
  // (stored choice, else OS preference). Re-apply it here only to sync the
  // toggle's aria-label and the theme-color meta tag.
  applyTheme(root.getAttribute('data-theme') || 'dark');

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

  var navItems = nav ? Array.prototype.slice.call(nav.querySelectorAll('.nav-links li')) : [];

  function setNavOpen(open) {
    if (!nav) return;
    nav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    // Stop the page scrolling behind the overlay
    document.body.style.overflow = open ? 'hidden' : '';
    navItems.forEach(function (li, i) {
      li.style.transitionDelay = open ? (0.06 + i * 0.045) + 's' : '0s';
    });
  }
  function closeNav() { setNavOpen(false); }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('open'));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Leaving the breakpoint with the sheet open would strand the scroll lock
    window.matchMedia('(min-width: 981px)').addEventListener('change', function (e) {
      if (e.matches) closeNav();
    });
  }

  /* ---------- Header shadow on scroll + active nav link ---------- */
  var header = document.getElementById('site-header');
  var progress = document.getElementById('scroll-progress');
  var indicator = document.querySelector('.nav-indicator');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var ticking = false;

  // Desktop only: glide the pill to whichever link is active
  function moveIndicator(target) {
    if (!indicator || window.innerWidth <= 980) return;
    if (!target) { indicator.classList.remove('on'); return; }
    indicator.style.width = target.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + target.offsetLeft + 'px)';
    indicator.classList.add('on');
  }

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);

    var pos = window.scrollY + 120;
    var currentId = '';
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= pos) currentId = sections[i].id;
    }
    var activeLink = null;
    navLinks.forEach(function (link) {
      var on = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('active', on);
      if (on) activeLink = link;
    });
    if (!nav || !nav.classList.contains('open')) moveIndicator(activeLink);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
    }
    ticking = false;
  }

  // Hovering previews where the pill would go; leaving restores the active one
  navLinks.forEach(function (link) {
    link.addEventListener('mouseenter', function () { moveIndicator(link); });
  });
  var navInner = document.querySelector('.nav-inner');
  if (navInner) navInner.addEventListener('mouseleave', function () {
    moveIndicator(document.querySelector('.nav-links a.active'));
  });
  window.addEventListener('resize', function () {
    moveIndicator(document.querySelector('.nav-links a.active'));
  });

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

  /* ---------- hCaptcha, loaded on demand ----------
     Loading it with the page put a third-party iframe in the contact section
     before anyone asked for it, and captcha iframes can take focus on init,
     which drags the scroll position down the page. Fetching it only once the
     form is nearly in view keeps the widget ready without that cost. */
  var captchaSlot = document.getElementById('hcaptcha-slot');
  var captchaRequested = false;

  function loadCaptcha() {
    if (captchaRequested || !captchaSlot) return;
    captchaRequested = true;
    var sc = document.createElement('script');
    sc.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=kwsCaptchaReady';
    sc.async = true; sc.defer = true;
    document.head.appendChild(sc);
  }

  // Global callback the hCaptcha script invokes once it is parsed
  window.kwsCaptchaReady = function () {
    if (!window.hcaptcha || !captchaSlot || captchaSlot.dataset.rendered) return;
    captchaSlot.dataset.rendered = '1';
    window.hcaptcha.render(captchaSlot, { sitekey: captchaSlot.dataset.sitekey });
  };

  if (captchaSlot) {
    if ('IntersectionObserver' in window) {
      var capObs = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          loadCaptcha();
          capObs.disconnect();
        }
      }, { rootMargin: '900px' });   // ready well before the visitor reaches it
      capObs.observe(captchaSlot);
    } else {
      loadCaptcha();
    }
    // Belt and braces: any interaction with the form pulls it in immediately
    var cf = document.getElementById('contact-form');
    if (cf) cf.addEventListener('focusin', loadCaptcha, { once: true });
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

    // Used when the POST fails, so a broken endpoint never costs an enquiry.
    // `form.elements` — `form.name` would resolve to the form's own name attribute.
    function mailtoFallback() {
      var f = form.elements;
      var subject = encodeURIComponent('Website enquiry from ' + f.name.value.trim());
      var body = encodeURIComponent(
        'Name: ' + f.name.value.trim() + '\n' +
        'Email: ' + f.email.value.trim() + '\n' +
        'Business: ' + f.company.value.trim() + '\n' +
        'Budget: ' + f.budget.value + '\n\n' +
        f.message.value.trim()
      );
      return 'mailto:knightwebsitesllc@gmail.com?subject=' + subject + '&body=' + body;
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

      // hCaptcha injects h-captcha-response into the form once solved. Web3Forms
      // verifies it server-side too; this check just avoids a wasted round trip.
      var captchaEl = document.getElementById('captcha-error');
      var captchaField = form.elements['h-captcha-response'];
      if (captchaField && !captchaField.value) {
        if (captchaEl) captchaEl.textContent = 'Please confirm you are human.';
        setStatus('');
        return;
      }
      if (captchaEl) captchaEl.textContent = '';

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      setStatus('');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          // Web3Forms reports rejections (bad key, spam heuristics) inside a
          // 200 body, so response.ok alone is not proof the mail was sent.
          return response.json()
            .catch(function () { return { success: response.ok }; })
            .then(function (data) {
              if (!response.ok || data.success === false) {
                throw new Error(data.message || 'Request failed with status ' + response.status);
              }
              form.reset();
              setStatus('Thanks — your enquiry is in. We’ll reply within one business day.', 'ok');
            });
        })
        .catch(function () {
          // Never lose an enquiry: hand the visitor a pre-filled email instead.
          setStatus('Couldn’t send that. Opening your email app so nothing is lost…', 'error');
          window.location.href = mailtoFallback();
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send enquiry';
          // Tokens are single-use — without this a second send always fails.
          if (window.hcaptcha) { try { window.hcaptcha.reset(); } catch (e) { /* not rendered */ } }
        });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

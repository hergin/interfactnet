/* InterFact — Scroll Animations, Nav, Counters */

(function () {
  'use strict';

  // --- Scroll-triggered fade-in ---
  var faders = document.querySelectorAll('.fade-up');
  var fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  faders.forEach(function (el) {
    var section = el.closest('section, .hero');
    var siblings = section
      ? Array.from(section.querySelectorAll('.fade-up'))
      : [];
    var index = siblings.indexOf(el);
    el.style.transitionDelay = index >= 0 ? index * 100 + 'ms' : '0ms';
    fadeObserver.observe(el);
  });

  // --- Sticky nav background ---
  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');

  function updateNav() {
    if (window.scrollY > hero.offsetHeight - 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile menu ---
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open')
      ? 'hidden'
      : '';
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset =
        target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  // --- Stat counter animation ---
  var counters = document.querySelectorAll('.counter-value');
  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        counterObserver.unobserve(el);
        var target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        var prefix = el.dataset.prefix || '';
        var suffix = el.dataset.suffix || '';
        var duration = 1500;
        var start = performance.now();

        function easeOutCubic(t) {
          return 1 - Math.pow(1 - t, 3);
        }

        function tick(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var value = Math.round(easeOutCubic(progress) * target);
          el.textContent = prefix + value + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.3 }
  );
  counters.forEach(function (c) { counterObserver.observe(c); });

  // --- Active nav link highlight on scroll ---
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  function highlightNav() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.style.color =
            link.getAttribute('href') === '#' + id
              ? 'var(--text-primary)'
              : '';
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- Oxie: tap for a two-step whisper that ends in an email ---
  var oxie = document.getElementById('oxie');
  var oxieWrap = document.getElementById('oxieWrap');
  var bubble = document.getElementById('oxieBubble');
  var step = 0;

  function track(name) {
    if (typeof gtag === 'function') gtag('event', name);
  }

  function setStep(next) {
    step = next;
    bubble.classList.toggle('is-open', step > 0);
    bubble.classList.toggle('is-step-2', step === 2);
    bubble.setAttribute('aria-hidden', step > 0 ? 'false' : 'true');
    oxie.setAttribute('aria-expanded', step > 0 ? 'true' : 'false');
  }

  function nudge() {
    oxie.classList.remove('is-nudged');
    void oxie.offsetWidth; // restart the animation
    oxie.classList.add('is-nudged');
  }

  oxie.addEventListener('click', function () {
    nudge();
    if (step === 0) {
      setStep(1);
      track('oxie_open');
    } else if (step === 1) {
      setStep(2);
      track('oxie_more');
    } else {
      setStep(0);
    }
  });

  document.getElementById('oxieMore').addEventListener('click', function () {
    setStep(2);
    track('oxie_more');
  });

  document.getElementById('oxieClose').addEventListener('click', function () {
    setStep(0);
    oxie.focus();
  });

  document.getElementById('oxieLink').addEventListener('click', function () {
    track('oxie_email');
  });

  document.addEventListener('click', function (e) {
    if (step > 0 && !oxieWrap.contains(e.target)) setStep(0);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && step > 0) {
      setStep(0);
      oxie.focus();
    }
  });
})();

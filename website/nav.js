/* ==========================================================================
   Nischenseite — Navigation Script
   1. Scroll-Transform (transparent → weiß+blur nach 40px Scroll)
   2. Mobile-Menu-Toggle
   ========================================================================== */
(function () {
  'use strict';

  var nav = document.querySelector('.lz-nav');
  if (!nav) return;

  var toggle = nav.querySelector('.lz-nav__toggle');
  var SCROLL_THRESHOLD = 40;

  // -- 1. Scroll-Transform ----------------------------------------------------
  var scrolled = false;
  function onScroll() {
    var isScrolled = window.scrollY > SCROLL_THRESHOLD;
    if (isScrolled !== scrolled) {
      nav.classList.toggle('lz-nav--scrolled', isScrolled);
      scrolled = isScrolled;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -- 2. Mobile-Menu ---------------------------------------------------------
  if (toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('lz-nav--menu-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Schließen beim Link-Klick
    nav.querySelectorAll('.lz-nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('lz-nav--menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ==========================================================================
   Cookie Consent — Minimaler DSGVO-Hinweis
   --------------------------------------------------------------------------
   Diese Seite setzt keine Tracking-Cookies und lädt keine externen
   Drittanbieter-Ressourcen. Daher ist nur ein Info-Hinweis nötig.
   Bestätigung wird in localStorage gespeichert.
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'lz_cookie_ack_v1';
  var BANNER_ID = 'lz-cookie';

  // Wenn bereits bestätigt → nichts tun
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') return;
  } catch (e) {
    // localStorage nicht verfügbar (Private Mode) — Banner trotzdem zeigen
  }

  // Banner-HTML injizieren
  var html =
    '<div class="lz-cookie__inner">' +
      '<div class="lz-cookie__body">' +
        '<div class="lz-cookie__icon" aria-hidden="true">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M21.5 12.5A9 9 0 0 1 12.5 21.5c-5 0-9-4-9-9s4-9 9-9a7 7 0 0 1 7 7"/>' +
            '<circle cx="8" cy="13" r="1"/>' +
            '<circle cx="14" cy="8" r="1"/>' +
            '<circle cx="14" cy="16" r="1"/>' +
            '<circle cx="19" cy="12" r="1"/>' +
          '</svg>' +
        '</div>' +
        '<div class="lz-cookie__text">' +
          '<strong>Kurzer Hinweis zum Datenschutz</strong>' +
          'Diese Seite verwendet <strong style="display:inline;margin:0;">keine Tracking-Cookies und kein Analytics</strong>. ' +
          'Fonts werden lokal geladen. Beim Klick auf Amazon-Links kann Amazon eigene Cookies setzen ' +
          '— mehr dazu im <a href="/datenschutz.html">Datenschutz</a>.' +
        '</div>' +
      '</div>' +
      '<div class="lz-cookie__actions">' +
        '<button type="button" class="lz-btn lz-btn--primary lz-btn--sm" data-cookie-ack>Verstanden</button>' +
      '</div>' +
    '</div>';

  var banner = document.createElement('div');
  banner.className = 'lz-cookie';
  banner.id = BANNER_ID;
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-label', 'Datenschutz-Hinweis');
  banner.innerHTML = html;

  document.body.appendChild(banner);

  // Sichtbar machen (verzögert für CSS-Transition)
  requestAnimationFrame(function () {
    banner.classList.add('lz-cookie--visible');
    requestAnimationFrame(function () {
      banner.classList.add('lz-cookie--shown');
    });
  });

  // Klick-Handler
  banner.querySelector('[data-cookie-ack]').addEventListener('click', function () {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {}
    banner.classList.remove('lz-cookie--shown');
    setTimeout(function () {
      banner.classList.remove('lz-cookie--visible');
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 400);
  });
})();

/* ==========================================================================
   Wallbox Kostenkalkulator
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('lz-kalkulator');
  if (!form) return;

  var resultBox = document.getElementById('lz-kalkulator-result');

  // Kostendaten (Richtwerte April 2026)
  var WALLBOX_PREISE = {
    'einfach':    { label: 'Einfache 11-kW-Wallbox (z.B. ABL eMH1)',     preis: 399 },
    'mittel':     { label: 'Mittelklasse 11 kW (z.B. go-eCharger, KEBA)', preis: 699 },
    'smart':      { label: 'Smart Wallbox mit PV-Integration',             preis: 999 },
    'premium':    { label: 'Premium 22-kW-Wallbox',                        preis: 1299 }
  };

  var INSTALLATION = {
    'kurz':       { label: 'Kurzer Kabelweg (< 5 m)',     min: 300, max: 600 },
    'mittel':     { label: 'Mittlerer Kabelweg (5-15 m)', min: 500, max: 900 },
    'lang':       { label: 'Langer Kabelweg (> 15 m)',    min: 800, max: 1500 },
    'erdkabel':   { label: 'Erdkabel / Garage aussen',    min: 1200, max: 2500 }
  };

  var FI_AUFPREIS = {
    'integriert': 0,
    'typ-a':      80,
    'typ-b':      280
  };

  var FOERDERUNG = {
    'keine':      0,
    'stadtwerke': 200,
    'land':       500,
    'arbeitgeber':500
  };

  function formatEuro(val) {
    return val.toLocaleString('de-DE') + ' \u20ac';
  }

  function berechnen() {
    var wallboxKey    = document.getElementById('kalk-wallbox').value;
    var installKey    = document.getElementById('kalk-installation').value;
    var fiKey         = document.getElementById('kalk-fi').value;
    var foerderKey    = document.getElementById('kalk-foerderung').value;

    var wallbox       = WALLBOX_PREISE[wallboxKey];
    var installation  = INSTALLATION[installKey];
    var fi            = FI_AUFPREIS[fiKey];
    var foerderung    = FOERDERUNG[foerderKey];

    var summeMin      = wallbox.preis + installation.min + fi - foerderung;
    var summeMax      = wallbox.preis + installation.max + fi - foerderung;

    // Ergebnis rendern
    document.getElementById('kalk-r-wallbox').textContent   = formatEuro(wallbox.preis);
    document.getElementById('kalk-r-install').textContent   = installation.min === installation.max
      ? formatEuro(installation.min)
      : formatEuro(installation.min) + ' \u2013 ' + formatEuro(installation.max);
    document.getElementById('kalk-r-fi').textContent        = fi === 0 ? 'inklusive' : '+ ' + formatEuro(fi);
    document.getElementById('kalk-r-foerderung').textContent = foerderung === 0 ? '\u2014' : '\u2013 ' + formatEuro(foerderung);
    document.getElementById('kalk-r-total').textContent     = formatEuro(summeMin) + ' \u2013 ' + formatEuro(summeMax);

    resultBox.classList.add('lz-tool__result--visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    berechnen();
  });

  // Live-Berechnung bei Aenderung
  form.querySelectorAll('select').forEach(function (sel) {
    sel.addEventListener('change', berechnen);
  });

  // Initial berechnen
  berechnen();

})();

# Site-Ausbau lade-station-zuhause.de — Implementierungsplan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Die Seite von 5 Artikeln zu einem vollständigen Wallbox-Wissens-Hub mit 6 Themen-Hubs, 12 neuen Artikeln, 1 Kalkulator-Tool und verbesserter Navigation ausbauen.

**Architecture:** Hub & Spoke — 6 Kategorie-Landingpages (Hubs) verlinken auf 4-6 Spoke-Artikel je Hub. Bestehende 5 Artikel werden eingeordnet und mit internen Links ergänzt. Alle Seiten teilen dieselbe `style.css` und `nav.js`. Keine Frameworks, kein Build-Step.

**Tech Stack:** HTML5, Vanilla CSS (BEM-lite, `lz-*` Prefix, Design Tokens), Vanilla JS, Satoshi (Headings via Fontshare CDN), DM Sans (Body, self-hosted), Cloudflare Pages

---

## Vorab: Konventionen für alle neuen Seiten

### Pflicht-Bausteine (aus CLAUDE.md)
- Affiliate-Disclaimer sichtbar am Anfang + im Footer
- `Stand: TT.MM.JJJJ` bei Preis-/Vergleichsdaten
- Schema.org JSON-LD (Article + FAQPage auf Artikeln, CollectionPage auf Hubs)
- Interne Links zu mind. 2 anderen Artikeln
- Alt-Text auf allen Bildern

### Neue Ordnerstruktur nach Ausbau
```
website/
  assets/fonts/         ← DM Sans bleibt, Outfit raus
  blog/                 ← alle Artikel (bestehend + neu)
  ratgeber/             ← Hub-Seiten (neue Ordner)
    index.html
  installation/
    index.html
  pv-smart/
    index.html
  recht-foerderung/
    index.html
  wallbox-tests/
    index.html
  auto-ratgeber/
    index.html
  tools/
    kostenkalkulator.html
    kostenkalkulator.js
  index.html
  blog.html             ← wird umgebaut zur Artikel-Übersicht
  style.css
  nav.js
  quiz.js
  quiz-config.json
  ...
```

### Kanonische Nav-HTML (in JEDE neue Seite einfügen)
Pfadangaben relativ zur jeweiligen Tiefe anpassen (`../` für Unterordner, `../../` für 2 Ebenen tief).

```html
<!-- ========================================================================
     NAVIGATION — Kanonisch. Änderungen hier → alle Seiten aktualisieren.
     ======================================================================== -->
<nav class="lz-nav" aria-label="Hauptnavigation">
  <div class="lz-nav__inner">
    <a href="[ROOT]/index.html" class="lz-nav__logo">
      Lade<span class="lz-nav__logo-mark">Station</span>
    </a>

    <button class="lz-nav__toggle" aria-label="Menü öffnen" aria-expanded="false">
      <span class="lz-nav__toggle-bars"></span>
    </button>

    <ul class="lz-nav__menu" role="menu">

      <li class="lz-nav__item lz-nav__item--dropdown">
        <button class="lz-nav__link lz-nav__dropdown-trigger" aria-expanded="false">
          Kaufberater <span class="lz-nav__chevron" aria-hidden="true"></span>
        </button>
        <ul class="lz-nav__dropdown" role="menu">
          <li><a href="[ROOT]/ratgeber/" class="lz-nav__dropdown-link">Übersicht Kaufberater</a></li>
          <li><a href="[ROOT]/blog/wallbox-kaufberatung-2026.html" class="lz-nav__dropdown-link">Welche Wallbox passt zu dir?</a></li>
          <li><a href="[ROOT]/blog/11kw-vs-22kw.html" class="lz-nav__dropdown-link">11 kW oder 22 kW?</a></li>
          <li><a href="[ROOT]/blog/wallbox-installation-kosten.html" class="lz-nav__dropdown-link">Was kostet eine Wallbox wirklich?</a></li>
          <li><a href="[ROOT]/tools/kostenkalkulator.html" class="lz-nav__dropdown-link">Kostenkalkulator</a></li>
        </ul>
      </li>

      <li class="lz-nav__item lz-nav__item--dropdown">
        <button class="lz-nav__link lz-nav__dropdown-trigger" aria-expanded="false">
          Installation <span class="lz-nav__chevron" aria-hidden="true"></span>
        </button>
        <ul class="lz-nav__dropdown" role="menu">
          <li><a href="[ROOT]/installation/" class="lz-nav__dropdown-link">Übersicht Installation</a></li>
          <li><a href="[ROOT]/blog/wallbox-installation-kosten.html" class="lz-nav__dropdown-link">Installationskosten erklärt</a></li>
          <li><a href="[ROOT]/blog/fi-typ-a-oder-b.html" class="lz-nav__dropdown-link">FI Typ A oder Typ B?</a></li>
          <li><a href="[ROOT]/blog/wallbox-anmelden-netzbetreiber.html" class="lz-nav__dropdown-link">Wallbox anmelden</a></li>
          <li><a href="[ROOT]/blog/kabelweg-absicherung.html" class="lz-nav__dropdown-link">Kabelweg & Absicherung</a></li>
        </ul>
      </li>

      <li class="lz-nav__item lz-nav__item--dropdown">
        <button class="lz-nav__link lz-nav__dropdown-trigger" aria-expanded="false">
          PV & Smart <span class="lz-nav__chevron" aria-hidden="true"></span>
        </button>
        <ul class="lz-nav__dropdown" role="menu">
          <li><a href="[ROOT]/pv-smart/" class="lz-nav__dropdown-link">Übersicht PV & Smart</a></li>
          <li><a href="[ROOT]/blog/wallbox-pv-ueberschussladen.html" class="lz-nav__dropdown-link">Überschussladen: lohnt sich das?</a></li>
        </ul>
      </li>

      <li class="lz-nav__item lz-nav__item--dropdown">
        <button class="lz-nav__link lz-nav__dropdown-trigger" aria-expanded="false">
          Recht & Förderung <span class="lz-nav__chevron" aria-hidden="true"></span>
        </button>
        <ul class="lz-nav__dropdown" role="menu">
          <li><a href="[ROOT]/recht-foerderung/" class="lz-nav__dropdown-link">Übersicht Recht & Förderung</a></li>
          <li><a href="[ROOT]/blog/wallbox-mietrecht-554-bgb.html" class="lz-nav__dropdown-link">Wallbox im Mietrecht (§554 BGB)</a></li>
          <li><a href="[ROOT]/blog/wallbox-weg-eigentuemer.html" class="lz-nav__dropdown-link">Wallbox in der WEG</a></li>
          <li><a href="[ROOT]/blog/foerderung-2026.html" class="lz-nav__dropdown-link">Förderung 2026</a></li>
          <li><a href="[ROOT]/blog/wallbox-versicherung-haftung.html" class="lz-nav__dropdown-link">Versicherung & Haftung</a></li>
        </ul>
      </li>

      <li class="lz-nav__item lz-nav__item--dropdown">
        <button class="lz-nav__link lz-nav__dropdown-trigger" aria-expanded="false">
          Wallbox-Tests <span class="lz-nav__chevron" aria-hidden="true"></span>
        </button>
        <ul class="lz-nav__dropdown" role="menu">
          <li><a href="[ROOT]/wallbox-tests/" class="lz-nav__dropdown-link">Übersicht Tests & Vergleiche</a></li>
          <li><a href="[ROOT]/blog/go-e-vs-heidelberg-vs-abl.html" class="lz-nav__dropdown-link">go-eCharger vs. Heidelberg vs. ABL</a></li>
        </ul>
      </li>

      <li class="lz-nav__item lz-nav__item--dropdown">
        <button class="lz-nav__link lz-nav__dropdown-trigger" aria-expanded="false">
          Auto-Ratgeber <span class="lz-nav__chevron" aria-hidden="true"></span>
        </button>
        <ul class="lz-nav__dropdown" role="menu">
          <li><a href="[ROOT]/auto-ratgeber/" class="lz-nav__dropdown-link">Übersicht Auto-Ratgeber</a></li>
          <li><a href="[ROOT]/blog/wallbox-vw-id3-id4.html" class="lz-nav__dropdown-link">VW ID.3 / ID.4</a></li>
          <li><a href="[ROOT]/blog/wallbox-tesla-model-3-y.html" class="lz-nav__dropdown-link">Tesla Model 3 / Y</a></li>
          <li><a href="[ROOT]/blog/wallbox-bmw-ix-i4.html" class="lz-nav__dropdown-link">BMW iX / i4</a></li>
          <li><a href="[ROOT]/blog/wallbox-plug-in-hybrid.html" class="lz-nav__dropdown-link">Plug-in-Hybrid</a></li>
        </ul>
      </li>

      <li><a href="[ROOT]/ueber-uns.html" class="lz-nav__link">Über uns</a></li>
      <li><a href="[ROOT]/index.html#konfigurator" class="lz-btn lz-btn--primary lz-btn--sm lz-nav__cta">Quiz starten</a></li>
    </ul>
  </div>
</nav>
```

---

## Task 1: Satoshi-Font herunterladen und integrieren

**Files:**
- Download: `website/assets/fonts/satoshi-latin.woff2` (neu)
- Modify: `website/style.css` (Zeilen 27-42: Outfit ersetzen durch Satoshi)

**Schritt 1: Font-Datei herunterladen**

Satoshi ist kostenlos via Fontshare. Lade die woff2-Datei herunter:
```bash
curl -L "https://api.fontshare.com/v2/fonts/download/satoshi" -o /tmp/satoshi.zip
unzip /tmp/satoshi.zip -d /tmp/satoshi/
# Die Datei Satoshi-Variable.woff2 (oder Satoshi-Bold.woff2 + Satoshi-Medium.woff2) nach assets/fonts/ kopieren
cp /tmp/satoshi/fonts/web/variable/Satoshi-Variable.woff2 website/assets/fonts/satoshi-latin.woff2
```

Falls der Download nicht klappt, alternativ Fontshare CDN in `<head>` aller Seiten:
```html
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css2?f[]=satoshi@700,500&display=swap" rel="stylesheet">
```

**Schritt 2: style.css — Outfit-@font-face ersetzen**

In `style.css` Zeilen 26-42 (Outfit-Block) ersetzen durch:
```css
/* Satoshi — Display (Headings) */
@font-face {
  font-family: 'Satoshi';
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: url('./assets/fonts/satoshi-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

**Schritt 3: Design-Token aktualisieren**

In `style.css` Zeile 82 ändern:
```css
/* Alt: */
--lz-font-display:  'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
/* Neu: */
--lz-font-display:  'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Schritt 4: Prüfen**
Browser öffnen → `website/index.html` → Headings sollten in Satoshi erscheinen (kein Outfit mehr). DevTools → Network → Fonts prüfen.

**Schritt 5: Commit**
```bash
git add website/assets/fonts/satoshi-latin.woff2 website/style.css
git commit -m "feat: replace Outfit with Satoshi for headings"
```

---

## Task 2: CSS — Neue Komponenten ergänzen

**Files:**
- Modify: `website/style.css` (am Ende anfügen)

Folgenden Block ans Ende der `style.css` anfügen:

```css
/* ==========================================================================
   NEUE KOMPONENTEN — Site-Ausbau 2026-04-12
   ========================================================================== */

/* ---------- Breadcrumb ---------- */
.lz-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--lz-text-muted);
  padding: 12px 0;
  flex-wrap: wrap;
}

.lz-breadcrumb__item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lz-breadcrumb__item:not(:last-child)::after {
  content: '/';
  color: var(--lz-border-str);
}

.lz-breadcrumb__link {
  color: var(--lz-text-muted);
  text-decoration: none;
  transition: color var(--lz-duration) var(--lz-ease);
}

.lz-breadcrumb__link:hover {
  color: var(--lz-accent);
}

.lz-breadcrumb__current {
  color: var(--lz-text-body);
}

/* ---------- Hub-Grid ---------- */
.lz-hub-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--lz-sp);
}

@media (max-width: 900px) {
  .lz-hub-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 580px) {
  .lz-hub-grid {
    grid-template-columns: 1fr;
  }
}

/* ---------- Hub-Card ---------- */
.lz-hub-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: var(--lz-sp);
  background: var(--lz-bg);
  border: 1px solid var(--lz-border);
  border-radius: var(--lz-r-lg);
  text-decoration: none;
  color: inherit;
  transition: border-color var(--lz-duration) var(--lz-ease),
              box-shadow var(--lz-duration) var(--lz-ease),
              transform var(--lz-duration) var(--lz-ease);
}

.lz-hub-card:hover {
  border-color: var(--lz-accent);
  box-shadow: var(--lz-sh-md);
  transform: translateY(-2px);
  color: inherit;
}

.lz-hub-card__icon {
  width: 44px;
  height: 44px;
  background: var(--lz-accent-subtle);
  border-radius: var(--lz-r);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.lz-hub-card__title {
  font-family: var(--lz-font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--lz-text);
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.lz-hub-card__desc {
  font-size: 15px;
  color: var(--lz-text-muted);
  line-height: 1.5;
  flex: 1;
}

.lz-hub-card__meta {
  font-size: 13px;
  color: var(--lz-accent);
  font-weight: 600;
}

/* ---------- Nav Dropdown ---------- */
.lz-nav__item--dropdown {
  position: relative;
}

.lz-nav__dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  font-family: var(--lz-font-body);
  font-size: inherit;
  cursor: pointer;
  padding: 6px 4px;
  color: var(--lz-text-inverse);
  transition: color var(--lz-duration) var(--lz-ease);
}

.lz-nav--scrolled .lz-nav__dropdown-trigger {
  color: var(--lz-text);
}

.lz-nav__dropdown-trigger:hover,
.lz-nav__dropdown-trigger[aria-expanded="true"] {
  color: var(--lz-accent);
}

.lz-nav__chevron {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid currentColor;
  margin-top: 1px;
  transition: transform var(--lz-duration) var(--lz-ease);
}

.lz-nav__dropdown-trigger[aria-expanded="true"] .lz-nav__chevron {
  transform: rotate(180deg);
}

.lz-nav__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 240px;
  background: var(--lz-bg);
  border: 1px solid var(--lz-border);
  border-radius: var(--lz-r-lg);
  box-shadow: var(--lz-sh-lg);
  padding: 8px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity var(--lz-duration) var(--lz-ease),
              visibility var(--lz-duration) var(--lz-ease),
              transform var(--lz-duration) var(--lz-ease);
  transform: translateX(-50%) translateY(-4px);
  z-index: var(--lz-z-overlay);
  list-style: none;
}

.lz-nav__item--dropdown:hover .lz-nav__dropdown,
.lz-nav__dropdown-trigger[aria-expanded="true"] + .lz-nav__dropdown {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.lz-nav__dropdown-link {
  display: block;
  padding: 8px 12px;
  border-radius: var(--lz-r-sm);
  color: var(--lz-text-body);
  font-size: 15px;
  text-decoration: none;
  transition: background var(--lz-duration) var(--lz-ease),
              color var(--lz-duration) var(--lz-ease);
}

.lz-nav__dropdown-link:hover {
  background: var(--lz-accent-subtle);
  color: var(--lz-accent);
}

/* Mobile: Dropdowns als aufklappbare Akkordeons */
@media (max-width: 860px) {
  .lz-nav__dropdown {
    position: static;
    transform: none;
    box-shadow: none;
    border: none;
    border-top: 1px solid var(--lz-border);
    border-radius: 0;
    padding: 0;
    background: transparent;
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--lz-duration-lg) var(--lz-ease),
                opacity var(--lz-duration) var(--lz-ease);
  }

  .lz-nav__dropdown-trigger[aria-expanded="true"] + .lz-nav__dropdown {
    max-height: 400px;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .lz-nav__item--dropdown:hover .lz-nav__dropdown {
    /* Hover deaktivieren auf Mobile */
    max-height: 0;
    opacity: 0;
  }

  .lz-nav__item--dropdown:hover .lz-nav__dropdown-trigger[aria-expanded="true"] + .lz-nav__dropdown {
    max-height: 400px;
    opacity: 1;
  }

  .lz-nav__dropdown-trigger {
    width: 100%;
    justify-content: space-between;
    color: var(--lz-text-inverse);
    padding: 12px 16px;
    font-size: 17px;
  }

  .lz-nav__dropdown-link {
    padding: 10px 32px;
    font-size: 16px;
  }
}

/* ---------- TOC (Table of Contents) Sidebar ---------- */
.lz-article-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: var(--lz-sp-lg);
  align-items: start;
}

@media (max-width: 1024px) {
  .lz-article-layout {
    grid-template-columns: 1fr;
  }
}

.lz-toc {
  position: sticky;
  top: calc(var(--lz-nav-h) + 24px);
  background: var(--lz-bg-alt);
  border: 1px solid var(--lz-border);
  border-radius: var(--lz-r-lg);
  padding: var(--lz-sp);
}

.lz-toc__title {
  font-family: var(--lz-font-display);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--lz-text-muted);
  margin-bottom: 12px;
}

.lz-toc__list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lz-toc__link {
  display: block;
  padding: 6px 8px;
  border-radius: var(--lz-r-sm);
  font-size: 14px;
  color: var(--lz-text-body);
  text-decoration: none;
  transition: background var(--lz-duration) var(--lz-ease),
              color var(--lz-duration) var(--lz-ease);
  line-height: 1.4;
}

.lz-toc__link:hover,
.lz-toc__link--active {
  background: var(--lz-accent-subtle);
  color: var(--lz-accent);
}

/* ---------- Tool-Card (Kostenkalkulator) ---------- */
.lz-tool {
  background: var(--lz-bg-alt);
  border: 1px solid var(--lz-border);
  border-radius: var(--lz-r-xl);
  padding: var(--lz-sp-md);
  max-width: 680px;
  margin: 0 auto;
}

.lz-tool__title {
  font-family: var(--lz-font-display);
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 700;
  color: var(--lz-text);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.lz-tool__desc {
  color: var(--lz-text-muted);
  margin-bottom: var(--lz-sp);
  font-size: 16px;
}

.lz-tool__group {
  margin-bottom: var(--lz-sp);
}

.lz-tool__label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--lz-text);
  margin-bottom: 6px;
}

.lz-tool__label-hint {
  font-weight: 400;
  color: var(--lz-text-muted);
}

.lz-tool__input,
.lz-tool__select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--lz-border-str);
  border-radius: var(--lz-r);
  background: var(--lz-bg);
  font-size: 16px;
  color: var(--lz-text);
  transition: border-color var(--lz-duration) var(--lz-ease),
              box-shadow var(--lz-duration) var(--lz-ease);
  -webkit-appearance: none;
}

.lz-tool__input:focus,
.lz-tool__select:focus {
  outline: none;
  border-color: var(--lz-accent);
  box-shadow: 0 0 0 3px var(--lz-accent-muted);
}

.lz-tool__result {
  background: var(--lz-bg-inverse);
  color: var(--lz-text-inverse);
  border-radius: var(--lz-r-lg);
  padding: var(--lz-sp);
  margin-top: var(--lz-sp);
  display: none;
}

.lz-tool__result--visible {
  display: block;
}

.lz-tool__result-title {
  font-family: var(--lz-font-display);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--lz-text-inverse);
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.lz-tool__result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 15px;
}

.lz-tool__result-row:last-child {
  border-bottom: none;
}

.lz-tool__result-label {
  color: rgba(255, 255, 255, 0.7);
}

.lz-tool__result-value {
  font-weight: 700;
  color: var(--lz-text-inverse);
}

.lz-tool__result-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 0;
  margin-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.lz-tool__result-total-label {
  font-family: var(--lz-font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--lz-text-inverse);
}

.lz-tool__result-total-value {
  font-family: var(--lz-font-display);
  font-size: 28px;
  font-weight: 800;
  color: var(--lz-accent);
  letter-spacing: -0.02em;
}

.lz-tool__disclaimer {
  font-size: 13px;
  color: var(--lz-text-muted);
  margin-top: 12px;
  line-height: 1.5;
}

/* ---------- Hub-Seite Hero (schmäler als Startseite) ---------- */
.lz-page-hero {
  padding: clamp(48px, 6vw, 80px) 0 clamp(32px, 4vw, 56px);
  background: var(--lz-bg-alt);
  border-bottom: 1px solid var(--lz-border);
}

.lz-page-hero__eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--lz-accent);
  margin-bottom: 12px;
}

.lz-page-hero__title {
  font-family: var(--lz-font-display);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  color: var(--lz-text);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 16px;
}

.lz-page-hero__desc {
  font-size: clamp(16px, 1.8vw, 19px);
  color: var(--lz-text-body);
  max-width: 640px;
  line-height: 1.6;
}
```

**Prüfen:**
Browser öffnen → `index.html` → DevTools → Kein Fehler in Console. Nav-Dropdown CSS greift (auch wenn noch kein Trigger-JS vorhanden).

**Commit:**
```bash
git add website/style.css
git commit -m "feat: add dropdown nav, hub-grid, breadcrumb, toc, tool-card CSS components"
```

---

## Task 3: nav.js — Dropdown-Logik ergänzen

**Files:**
- Modify: `website/nav.js`

Den bestehenden Code **ergänzen** (nicht ersetzen). Nach dem bestehenden Mobile-Toggle-Block einfügen:

```javascript
  // -- 3. Dropdown-Trigger (Desktop: Hover, Mobile: Click) --------------------
  var dropdownTriggers = nav.querySelectorAll('.lz-nav__dropdown-trigger');

  dropdownTriggers.forEach(function (trigger) {
    var isMobile = function () { return window.innerWidth <= 860; };

    // Mobile: Toggle beim Click
    trigger.addEventListener('click', function (e) {
      if (!isMobile()) return;
      e.preventDefault();
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      // Alle anderen schließen
      dropdownTriggers.forEach(function (t) {
        if (t !== trigger) t.setAttribute('aria-expanded', 'false');
      });
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Dropdown schließen bei Klick außerhalb
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
      dropdownTriggers.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Dropdown schließen bei Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdownTriggers.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
    }
  });
```

**Prüfen:**
- Desktop: Dropdown-Items erscheinen beim Hover über Nav-Punkte
- Mobile: Dropdown öffnet/schließt beim Tippen auf Nav-Punkt
- Escape schließt offenes Dropdown

**Commit:**
```bash
git add website/nav.js
git commit -m "feat: add dropdown trigger logic to nav.js"
```

---

## Task 4: index.html — Nav aktualisieren

**Files:**
- Modify: `website/index.html` (Nav-Block ersetzen)
- Modify: `website/blog.html` (Nav-Block ersetzen)
- Modify: `website/ueber-uns.html` (Nav-Block ersetzen)
- Modify: `website/impressum.html` (Nav-Block ersetzen)
- Modify: `website/datenschutz.html` (Nav-Block ersetzen)
- Modify: `website/kontakt.html` (Nav-Block ersetzen)

Den bestehenden `<nav class="lz-nav">...</nav>` Block in jeder Datei durch die kanonische Nav ersetzen (aus "Vorab: Konventionen" oben). Für `index.html` und alle Dateien direkt in `website/` gilt `[ROOT] = .` (relative Pfade ohne Prefix-Änderung nötig).

**Prüfen:**
Alle 6 Seiten öffnen → Nav zeigt Dropdowns, Logo-Link führt zur Startseite, Mobile-Menü funktioniert.

**Commit:**
```bash
git add website/index.html website/blog.html website/ueber-uns.html website/impressum.html website/datenschutz.html website/kontakt.html
git commit -m "feat: update nav with dropdowns on all existing pages"
```

---

## Task 5: Bestehende Blog-Artikel — Nav aktualisieren + interne Links ergänzen

**Files:**
- Modify: `website/blog/wallbox-kaufberatung-2026.html`
- Modify: `website/blog/11kw-vs-22kw.html`
- Modify: `website/blog/wallbox-installation-kosten.html`
- Modify: `website/blog/wallbox-pv-ueberschussladen.html`
- Modify: `website/blog/go-e-vs-heidelberg-vs-abl.html`

Für alle 5 Dateien in `website/blog/`:
- `[ROOT] = ..` (eine Ebene höher)
- Nav ersetzen durch kanonische Nav
- Am Ende des Artikels (vor Footer, nach FAQ) einen Abschnitt **"Weiterführende Artikel"** ergänzen mit Links zu mindestens 2 thematisch passenden anderen Artikeln (sobald diese erstellt sind — vorerst nur bestehende verlinken)

**Interne Link-Matrix (bestehende Artikel):**
| Artikel | Verlinkt auf |
|---------|-------------|
| wallbox-kaufberatung-2026 | wallbox-installation-kosten, 11kw-vs-22kw |
| 11kw-vs-22kw | wallbox-kaufberatung-2026, wallbox-installation-kosten |
| wallbox-installation-kosten | wallbox-kaufberatung-2026, wallbox-pv-ueberschussladen |
| wallbox-pv-ueberschussladen | wallbox-kaufberatung-2026, go-e-vs-heidelberg-vs-abl |
| go-e-vs-heidelberg-vs-abl | wallbox-kaufberatung-2026, 11kw-vs-22kw |

**Commit:**
```bash
git add website/blog/
git commit -m "feat: update nav and add internal links on existing articles"
```

---

## Task 6: Hub-Seiten erstellen (6 Dateien)

**Files:**
- Create: `website/ratgeber/index.html`
- Create: `website/installation/index.html`
- Create: `website/pv-smart/index.html`
- Create: `website/recht-foerderung/index.html`
- Create: `website/wallbox-tests/index.html`
- Create: `website/auto-ratgeber/index.html`

### Template für jede Hub-Seite

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[HUB-TITEL] — Ladestation Zuhause</title>
  <meta name="description" content="[HUB-META, 120-155 Zeichen]">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://lade-station-zuhause.de/[hub-slug]/">

  <link rel="stylesheet" href="../style.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://lade-station-zuhause.de/[hub-slug]/#collectionpage",
    "name": "[HUB-TITEL]",
    "description": "[HUB-META]",
    "url": "https://lade-station-zuhause.de/[hub-slug]/",
    "inLanguage": "de-DE",
    "publisher": {
      "@type": "Person",
      "name": "Aleksej Debus",
      "url": "https://lade-station-zuhause.de/ueber-uns.html"
    }
  }
  </script>
</head>
<body>

<!-- NAV (kanonisch, [ROOT] = ..) -->
[NAV HIER]

<main>
  <!-- Page Hero -->
  <div class="lz-page-hero">
    <div class="lz-container">
      <nav aria-label="Breadcrumb" class="lz-breadcrumb">
        <span class="lz-breadcrumb__item">
          <a href="../index.html" class="lz-breadcrumb__link">Startseite</a>
        </span>
        <span class="lz-breadcrumb__item">
          <span class="lz-breadcrumb__current">[HUB-TITEL]</span>
        </span>
      </nav>
      <p class="lz-page-hero__eyebrow">[KATEGORIE]</p>
      <h1 class="lz-page-hero__title">[HUB-TITEL]</h1>
      <p class="lz-page-hero__desc">[HUB-BESCHREIBUNG, 1-2 Sätze]</p>
    </div>
  </div>

  <!-- Artikel-Grid -->
  <section class="lz-section">
    <div class="lz-container">
      <div class="lz-hub-grid">

        <!-- Card pro Artikel -->
        <a href="../blog/[artikel].html" class="lz-hub-card">
          <div class="lz-hub-card__icon" aria-hidden="true">[EMOJI]</div>
          <div class="lz-hub-card__title">[ARTIKEL-TITEL]</div>
          <p class="lz-hub-card__desc">[KURZ-BESCHREIBUNG, 1 Satz]</p>
          <span class="lz-hub-card__meta">Artikel lesen →</span>
        </a>

        <!-- weitere Cards ... -->

      </div>
    </div>
  </section>
</main>

<!-- Footer (identisch wie index.html) -->
[FOOTER HIER]

<script src="../nav.js"></script>
</body>
</html>
```

### Inhalte der 6 Hub-Seiten

**ratgeber/index.html**
- Title: `Wallbox-Kaufberater 2026 — Ladestation Zuhause`
- Eyebrow: Kaufberater
- H1: `Welche Wallbox passt zu dir?`
- Cards: wallbox-kaufberatung-2026, 11kw-vs-22kw, wallbox-installation-kosten, tools/kostenkalkulator
- Emojis: ⚡ 🔌 💰 🧮

**installation/index.html**
- Title: `Wallbox Installation: Kosten, Technik, Anmeldung — Ladestation Zuhause`
- Eyebrow: Installation & Technik
- H1: `Wallbox installieren: Was du wirklich wissen musst`
- Cards: wallbox-installation-kosten, fi-typ-a-oder-b, wallbox-anmelden-netzbetreiber, kabelweg-absicherung
- Emojis: 🔧 ⚡ 📋 📐

**pv-smart/index.html**
- Title: `Wallbox mit PV & Smart Charging — Ladestation Zuhause`
- Eyebrow: PV & Smart Charging
- H1: `Wallbox und Photovoltaik: Was wirklich funktioniert`
- Cards: wallbox-pv-ueberschussladen
- Emojis: ☀️

**recht-foerderung/index.html**
- Title: `Wallbox Recht & Förderung 2026 — Ladestation Zuhause`
- Eyebrow: Recht & Förderung
- H1: `Wallbox: Rechtsfragen und Förderung 2026`
- Cards: wallbox-mietrecht-554-bgb, wallbox-weg-eigentuemer, foerderung-2026, wallbox-versicherung-haftung
- Emojis: ⚖️ 🏢 💶 🛡️

**wallbox-tests/index.html**
- Title: `Wallbox Tests & Vergleiche 2026 — Ladestation Zuhause`
- Eyebrow: Tests & Vergleiche
- H1: `Wallbox-Tests: Ehrliche Bewertungen ohne Werbesprech`
- Cards: go-e-vs-heidelberg-vs-abl
- Emojis: 🔍

**auto-ratgeber/index.html**
- Title: `Wallbox für dein E-Auto: Ratgeber nach Modell — Ladestation Zuhause`
- Eyebrow: Auto-Ratgeber
- H1: `Welche Wallbox passt zu deinem E-Auto?`
- Cards: wallbox-vw-id3-id4, wallbox-tesla-model-3-y, wallbox-bmw-ix-i4, wallbox-plug-in-hybrid
- Emojis: 🚗 🔌 🚘 🔋

**Prüfen:** Alle 6 Hub-Seiten im Browser öffnen → Breadcrumb, Hero, Cards korrekt. Links auf (noch nicht existierende) Artikel sind Platzhalter — OK.

**Commit:**
```bash
git add website/ratgeber/ website/installation/ website/pv-smart/ website/recht-foerderung/ website/wallbox-tests/ website/auto-ratgeber/
git commit -m "feat: add 6 hub landing pages"
```

---

## Task 7: Artikel-Template (einmalig definieren)

Alle neuen Artikel folgen diesem Template. Pfad: `website/blog/[artikel-slug].html`.

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[ARTIKEL-TITLE, max 60 Zeichen] — Ladestation Zuhause</title>
  <meta name="description" content="[META, 120-155 Zeichen]">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://lade-station-zuhause.de/blog/[slug].html">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://lade-station-zuhause.de/blog/[slug].html">
  <meta property="og:title" content="[ARTIKEL-TITLE]">
  <meta property="og:description" content="[META]">
  <meta property="og:locale" content="de_DE">
  <link rel="stylesheet" href="../style.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://lade-station-zuhause.de/blog/[slug].html#article",
        "headline": "[ARTIKEL-TITLE]",
        "description": "[META]",
        "datePublished": "2026-04-12",
        "dateModified": "2026-04-12",
        "inLanguage": "de-DE",
        "author": {
          "@type": "Person",
          "name": "Aleksej Debus",
          "url": "https://lade-station-zuhause.de/ueber-uns.html"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Ladestation Zuhause",
          "url": "https://lade-station-zuhause.de/"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "[FRAGE 1]", "acceptedAnswer": { "@type": "Answer", "text": "[ANTWORT 1]" } },
          { "@type": "Question", "name": "[FRAGE 2]", "acceptedAnswer": { "@type": "Answer", "text": "[ANTWORT 2]" } }
        ]
      }
    ]
  }
  </script>
</head>
<body>

<!-- NAV (kanonisch, [ROOT] = ..) -->
[NAV]

<main>
  <div class="lz-page-hero">
    <div class="lz-container">
      <nav aria-label="Breadcrumb" class="lz-breadcrumb">
        <span class="lz-breadcrumb__item"><a href="../index.html" class="lz-breadcrumb__link">Startseite</a></span>
        <span class="lz-breadcrumb__item"><a href="../[hub-slug]/" class="lz-breadcrumb__link">[HUB-TITEL]</a></span>
        <span class="lz-breadcrumb__item"><span class="lz-breadcrumb__current">[ARTIKEL-TITEL kurz]</span></span>
      </nav>
      <h1 class="lz-page-hero__title">[ARTIKEL-H1]</h1>
      <div class="lz-blog-article__meta">
        <span class="lz-blog-article__meta-item">Stand: 12.04.2026</span>
        <span class="lz-blog-article__meta-item">Aleksej Debus</span>
        <span class="lz-blog-article__meta-item">[X] Min. Lesezeit</span>
      </div>
    </div>
  </div>

  <section class="lz-section">
    <div class="lz-container">
      <div class="lz-article-layout">

        <!-- Hauptinhalt -->
        <article class="lz-blog-article lz-prose">
          <!-- Affiliate-Disclaimer -->
          <div class="lz-disclaimer">
            <strong>Transparenz:</strong> Wir verdienen an qualifizierten Käufen über Amazon-Links auf dieser Seite. Das beeinflusst unsere Bewertung nicht.
          </div>

          <!-- Direct Answer Box (Featured Snippet) -->
          <div class="lz-answer-box">
            <strong>[FRAGE IN 1 SATZ]</strong>
            <p>[ANTWORT IN MAX 40 WÖRTERN]</p>
          </div>

          <!-- Hauptinhalt -->
          [ARTIKEL-INHALT]

          <!-- FAQ -->
          <h2>Häufige Fragen</h2>
          <dl class="lz-faq">
            <div class="lz-faq__item">
              <dt class="lz-faq__question">[FRAGE]</dt>
              <dd class="lz-faq__answer">[ANTWORT]</dd>
            </div>
          </dl>

          <!-- Weiterführende Artikel -->
          <div class="lz-related">
            <h3>Das könnte dich auch interessieren</h3>
            <ul>
              <li><a href="[LINK-1]">[ARTIKEL-TITEL-1]</a></li>
              <li><a href="[LINK-2]">[ARTIKEL-TITEL-2]</a></li>
            </ul>
          </div>
        </article>

        <!-- TOC Sidebar -->
        <aside class="lz-toc" aria-label="Inhaltsverzeichnis">
          <p class="lz-toc__title">Inhalt</p>
          <ul class="lz-toc__list">
            <li><a href="#[abschnitt-1]" class="lz-toc__link">[ABSCHNITT 1]</a></li>
            <li><a href="#[abschnitt-2]" class="lz-toc__link">[ABSCHNITT 2]</a></li>
          </ul>
        </aside>

      </div>
    </div>
  </section>
</main>

[FOOTER]
<script src="../nav.js"></script>
</body>
</html>
```

---

## Task 8: Neue Artikel — Installation & Technik (3 Artikel)

### 8a: fi-typ-a-oder-b.html

**Primär-Keyword:** `FI Typ B Wallbox` / `FI Schutzschalter Wallbox`
**Ziel-URL:** `website/blog/fi-typ-a-oder-b.html`
**Hub:** installation
**Schema:** Article + FAQPage
**Wortanzahl:** 1200–1600

**Gliederung:**
1. Direct Answer: "Typ B ist nicht immer nötig" (< 40 Wörter)
2. Was ist ein FI-Schutzschalter? (kurz, 1 Abs.)
3. Typ A vs. Typ B: Der Unterschied erklärt (Tabelle: Merkmal / Typ A / Typ B)
4. Wann reicht Typ A? (Wallboxen mit integriertem DC-Fehlerschutz — welche Modelle)
5. Wann ist Typ B Pflicht? (ältere Modelle ohne DC-Sensor)
6. Was kostet der Unterschied? (Preisbereich, Installationskosten)
7. Fazit: Welchen FI brauchst du?
8. FAQ (5 Fragen)

**Interne Links:** wallbox-installation-kosten, kabelweg-absicherung
**Weiterführend:** → Hub installation/

---

### 8b: wallbox-anmelden-netzbetreiber.html

**Primär-Keyword:** `Wallbox anmelden Netzbetreiber`
**Schema:** Article + HowTo + FAQPage
**Wortanzahl:** 1000–1400

**Gliederung:**
1. Direct Answer: "Anmeldung ist Pflicht, aber kein Hexenwerk" (< 40 Wörter)
2. Wer muss anmelden? (Rechtslage: TAB 2007, §19 NAV)
3. Was passiert ohne Anmeldung? (Risiken, Versicherung)
4. Schritt-für-Schritt: So meldest du an (HowTo-Schema)
   - Netzbetreiber ermitteln
   - Formular ausfüllen (Verlinkung Netzbetreiber-Suche)
   - Elektriker beauftragen (dieser meldet meist direkt)
   - Genehmigung abwarten
5. Was prüft der Netzbetreiber?
6. Wie lange dauert es?
7. FAQ (5 Fragen)

**Interne Links:** wallbox-installation-kosten, fi-typ-a-oder-b

---

### 8c: kabelweg-absicherung.html

**Primär-Keyword:** `Wallbox Absicherung` / `Wallbox Kabelweg Kosten`
**Schema:** Article + FAQPage
**Wortanzahl:** 1200–1600

**Gliederung:**
1. Direct Answer: "Kabelweg = der größte Kostenfaktor bei der Installation"
2. Was bestimmt den Kabelweg? (Distanz Sicherungskasten zu Stellplatz, Unterputz vs. Aufputz, Erdverlegung)
3. Leitungsquerschnitt: Was brauche ich? (Tabelle: Ladeleistung / Querschnitt / Absicherung)
4. Kosten nach Szenario (Tabelle: kurzer Weg / mittlerer Weg / langer Weg / Erdkabel)
5. Muss ich einen eigenen Stromkreis legen?
6. Brauche ich einen Zähler? (Abrechnungspflicht bei Dienstwagen)
7. FAQ (5 Fragen)

**Interne Links:** wallbox-installation-kosten, fi-typ-a-oder-b

**Commit nach allen 3 Artikeln:**
```bash
git add website/blog/fi-typ-a-oder-b.html website/blog/wallbox-anmelden-netzbetreiber.html website/blog/kabelweg-absicherung.html
git commit -m "feat: add 3 installation & technik articles"
```

---

## Task 9: Neue Artikel — Recht & Förderung (4 Artikel)

### 9a: wallbox-mietrecht-554-bgb.html

**Primär-Keyword:** `Wallbox Mietwohnung` / `Wallbox Mieter Recht`
**Schema:** Article + FAQPage
**Wortanzahl:** 1800–2200 (wichtigstes Recht-Thema im Markt)

**Gliederung:**
1. Direct Answer: "Mieter haben seit 2020 ein Recht auf Erlaubnis — wenn auch mit Einschränkungen"
2. Was sagt §554 BGB? (Gesetzestext vereinfacht erklärt)
3. Wann muss der Vermieter zustimmen?
4. Wann kann er ablehnen? (legitime Ablehnungsgründe)
5. Wer zahlt die Installation?
6. Muss ich nach Auszug rückbauen?
7. Musteranschreiben an den Vermieter (als Textblock zum Kopieren)
8. Was tun bei Ablehnung?
9. FAQ (6 Fragen)

---

### 9b: wallbox-weg-eigentuemer.html

**Primär-Keyword:** `Wallbox Eigentümergemeinschaft WEG`
**Schema:** Article + FAQPage
**Wortanzahl:** 1600–2000

**Gliederung:**
1. Direct Answer: "Seit WEG-Reform 2020 hast du ein Anspruchsrecht — aber du brauchst einen Beschluss"
2. Was hat sich 2020 geändert? (WEG-Reform)
3. Welcher Beschluss ist nötig?
4. Lastmanagement-Pflicht: Was ist das und wann gilt es?
5. Wer zahlt was? (Kostenverteilung in der WEG)
6. Was kostet Lastmanagement? (Preisbereich)
7. Was tun wenn die WEG ablehnt?
8. FAQ (5 Fragen)

---

### 9c: foerderung-2026.html

**Primär-Keyword:** `Wallbox Förderung 2026`
**Schema:** Article + FAQPage
**Wortanzahl:** 1400–1800

**Gliederung:**
1. Direct Answer: "KfW-Bundesförderung für Privatpersonen ist ausgelaufen — aber es gibt noch Alternativen"
2. Bundesebene: KfW 442 (Status: abgelaufen)
3. Bundesländer-Übersicht (Tabelle: Land / Programm / Betrag / Status)
   - Bayern, Baden-Württemberg, NRW, etc.
4. Stadtwerke & Netzbetreiber (lokale Programme, wie finden)
5. Dienstwagen & Arbeitgeber (steuerliche Förderung)
6. Was ist mit dem Umweltbonus?
7. FAQ (5 Fragen)
8. Hinweis: Stand April 2026 — regelmäßige Aktualisierung

---

### 9d: wallbox-versicherung-haftung.html

**Primär-Keyword:** `Wallbox Versicherung` / `Wallbox Haftung`
**Schema:** Article + FAQPage
**Wortanzahl:** 1200–1600

**Gliederung:**
1. Direct Answer: "Meist ist die Gebäudeversicherung zuständig — aber nicht immer"
2. Was kann an der Wallbox passieren? (Szenarien: Brand, Überspannung, Diebstahl, Schaden am Auto)
3. Versicherungs-Matrix (Tabelle: Szenario / Zuständige Versicherung / Bedingungen)
   - Gebäudeversicherung
   - Hausratversicherung
   - Kfz-Teilkasko
   - Privathaftpflicht
4. Was muss ich meiner Versicherung melden?
5. Gibt es spezielle Wallbox-Versicherungen?
6. FAQ (4 Fragen)

**Commit nach allen 4 Artikeln:**
```bash
git add website/blog/wallbox-mietrecht-554-bgb.html website/blog/wallbox-weg-eigentuemer.html website/blog/foerderung-2026.html website/blog/wallbox-versicherung-haftung.html
git commit -m "feat: add 4 recht & foerderung articles"
```

---

## Task 10: Neue Artikel — Auto-Ratgeber (4 Artikel)

Alle Auto-Ratgeber folgen demselben Muster:

**Schema:** Article + FAQPage
**Wortanzahl:** 1000–1400

**Struktur-Template:**
1. Direct Answer: "Der [AUTO] braucht [X] kW — [Modell A] oder [Modell B] sind die beste Wahl"
2. Lade-Spezifikationen des Autos (Tabelle: AC-Ladeleistung / Phasen / Ladezeit 10-80% mit 11 kW)
3. Welche Wallbox passt? (3 konkrete Empfehlungen mit Begründung)
4. Was kostet die passende Wallbox + Installation?
5. Besonderheiten dieses Autos (Kompatibilität, App, Smart Charging)
6. FAQ (4 Fragen)

### 10a: wallbox-vw-id3-id4.html
- Primär-Keyword: `Wallbox VW ID.3`
- Auto-Specs: ID.3 max 11 kW AC (dreiphasig), ID.4 max 11 kW AC
- Empfehlung: go-eCharger HOMEfix, Heidelberg Home Eco, ABL eMH1

### 10b: wallbox-tesla-model-3-y.html
- Primär-Keyword: `Wallbox Tesla Model 3`
- Auto-Specs: Model 3/Y max 11 kW AC (Europa, dreiphasig)
- Hinweis: Tesla-eigenes Ladegerät + Typ-2-Adapter

### 10c: wallbox-bmw-ix-i4.html
- Primär-Keyword: `Wallbox BMW iX`
- Auto-Specs: iX bis 22 kW AC (dreiphasig), i4 bis 11 kW
- Hinweis: Wann lohnt sich 22-kW-Wallbox für iX?

### 10d: wallbox-plug-in-hybrid.html
- Primär-Keyword: `Wallbox Plug-in-Hybrid`
- Kernthema: Die meisten PHEVs laden nur 3,7 kW oder 7,4 kW — 11-kW-Wallbox ist oft überdimensioniert
- Empfehlung: einfache 11-kW-Wallbox ohne Smart-Features, da sowieso keine schnelle Ladung

**Commit nach allen 4 Artikeln:**
```bash
git add website/blog/wallbox-vw-id3-id4.html website/blog/wallbox-tesla-model-3-y.html website/blog/wallbox-bmw-ix-i4.html website/blog/wallbox-plug-in-hybrid.html
git commit -m "feat: add 4 auto-ratgeber articles"
```

---

## Task 11: Kostenkalkulator

**Files:**
- Create: `website/tools/kostenkalkulator.html`
- Create: `website/tools/kostenkalkulator.js`

### kostenkalkulator.js

```javascript
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
    'mittel':     { label: 'Mittlerer Kabelweg (5–15 m)', min: 500, max: 900 },
    'lang':       { label: 'Langer Kabelweg (> 15 m)',    min: 800, max: 1500 },
    'erdkabel':   { label: 'Erdkabel / Garage außen',     min: 1200, max: 2500 }
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
    return val.toLocaleString('de-DE') + ' €';
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

    var installMid    = Math.round((installation.min + installation.max) / 2);
    var summe         = wallbox.preis + installMid + fi - foerderung;
    var summeMin      = wallbox.preis + installation.min + fi - foerderung;
    var summeMax      = wallbox.preis + installation.max + fi - foerderung;

    // Ergebnis rendern
    document.getElementById('kalk-r-wallbox').textContent   = formatEuro(wallbox.preis);
    document.getElementById('kalk-r-install').textContent   = installation.min === installation.max
      ? formatEuro(installation.min)
      : formatEuro(installation.min) + ' – ' + formatEuro(installation.max);
    document.getElementById('kalk-r-fi').textContent        = fi === 0 ? 'inklusive' : '+ ' + formatEuro(fi);
    document.getElementById('kalk-r-foerderung').textContent = foerderung === 0 ? '—' : '– ' + formatEuro(foerderung);
    document.getElementById('kalk-r-total').textContent     = formatEuro(summeMin) + ' – ' + formatEuro(summeMax);

    resultBox.classList.add('lz-tool__result--visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    berechnen();
  });

  // Live-Berechnung bei Änderung
  form.querySelectorAll('select').forEach(function (sel) {
    sel.addEventListener('change', berechnen);
  });

  // Initial berechnen
  berechnen();

})();
```

### kostenkalkulator.html (Kernstruktur)

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wallbox Kostenkalkulator 2026 — Ladestation Zuhause</title>
  <meta name="description" content="Berechne die Gesamtkosten für deine Wallbox: Gerät, Installation, FI-Schutz und Förderung. Ehrliche Richtwerte statt Werbung.">
  <link rel="canonical" href="https://lade-station-zuhause.de/tools/kostenkalkulator.html">
  <link rel="stylesheet" href="../style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Wallbox Gesamtkosten berechnen",
    "description": "So berechnest du die realistischen Gesamtkosten für Wallbox-Kauf und Installation",
    "step": [
      { "@type": "HowToStep", "text": "Wähle das Wallbox-Modell nach deinen Anforderungen" },
      { "@type": "HowToStep", "text": "Schätze den Kabelweg vom Sicherungskasten zur Wallbox" },
      { "@type": "HowToStep", "text": "Prüfe ob dein FI-Schutz bereits integriert ist" },
      { "@type": "HowToStep", "text": "Trage verfügbare Förderung ein" }
    ]
  }
  </script>
</head>
<body>

[NAV — ROOT = ..]

<main>
  <div class="lz-page-hero">
    <div class="lz-container">
      <nav aria-label="Breadcrumb" class="lz-breadcrumb">
        <span class="lz-breadcrumb__item"><a href="../index.html" class="lz-breadcrumb__link">Startseite</a></span>
        <span class="lz-breadcrumb__item"><a href="../ratgeber/" class="lz-breadcrumb__link">Kaufberater</a></span>
        <span class="lz-breadcrumb__item"><span class="lz-breadcrumb__current">Kostenkalkulator</span></span>
      </nav>
      <p class="lz-page-hero__eyebrow">Tool</p>
      <h1 class="lz-page-hero__title">Wallbox Kostenkalkulator</h1>
      <p class="lz-page-hero__desc">Richtwerte für Gerät, Installation und Förderung — damit du weißt, was es wirklich kostet.</p>
    </div>
  </div>

  <section class="lz-section">
    <div class="lz-container">
      <form id="lz-kalkulator" class="lz-tool">
        <p class="lz-tool__desc">Stand: April 2026 · Alle Angaben sind Richtwerte, kein verbindliches Angebot.</p>

        <div class="lz-tool__group">
          <label for="kalk-wallbox" class="lz-tool__label">Wallbox-Typ <span class="lz-tool__label-hint">(was brauchst du?)</span></label>
          <select id="kalk-wallbox" class="lz-tool__select">
            <option value="einfach">Einfache 11-kW-Wallbox (z.B. ABL eMH1) — ca. 399 €</option>
            <option value="mittel" selected>Mittelklasse 11 kW (z.B. go-eCharger, KEBA) — ca. 699 €</option>
            <option value="smart">Smart Wallbox mit PV-Integration — ca. 999 €</option>
            <option value="premium">Premium 22-kW-Wallbox — ca. 1.299 €</option>
          </select>
        </div>

        <div class="lz-tool__group">
          <label for="kalk-installation" class="lz-tool__label">Kabelweg <span class="lz-tool__label-hint">(Distanz Sicherungskasten → Wallbox)</span></label>
          <select id="kalk-installation" class="lz-tool__select">
            <option value="kurz">Kurz (unter 5 m, z.B. Garage direkt am Haus)</option>
            <option value="mittel" selected>Mittel (5–15 m)</option>
            <option value="lang">Lang (über 15 m)</option>
            <option value="erdkabel">Erdkabel / Garage außen (Gartenweg, Einfahrt)</option>
          </select>
        </div>

        <div class="lz-tool__group">
          <label for="kalk-fi" class="lz-tool__label">FI-Schutz <span class="lz-tool__label-hint">(Fehlerstromschutz)</span></label>
          <select id="kalk-fi" class="lz-tool__select">
            <option value="integriert">In Wallbox integriert (z.B. go-eCharger, Heidelberg)</option>
            <option value="typ-a" selected>FI Typ A extern nötig (ca. +80 €)</option>
            <option value="typ-b">FI Typ B nötig (ältere Wallbox, ca. +280 €)</option>
          </select>
        </div>

        <div class="lz-tool__group">
          <label for="kalk-foerderung" class="lz-tool__label">Verfügbare Förderung</label>
          <select id="kalk-foerderung" class="lz-tool__select">
            <option value="keine" selected>Keine bekannte Förderung</option>
            <option value="stadtwerke">Stadtwerke / Netzbetreiber (ca. 200 €)</option>
            <option value="land">Bundeslandprogramm (ca. 500 €)</option>
            <option value="arbeitgeber">Arbeitgeber-Zuschuss (ca. 500 €)</option>
          </select>
        </div>

        <button type="submit" class="lz-btn lz-btn--primary">Kosten berechnen</button>

        <div id="lz-kalkulator-result" class="lz-tool__result">
          <p class="lz-tool__result-title">Deine geschätzten Gesamtkosten</p>
          <div class="lz-tool__result-row">
            <span class="lz-tool__result-label">Wallbox (Gerät)</span>
            <span class="lz-tool__result-value" id="kalk-r-wallbox">—</span>
          </div>
          <div class="lz-tool__result-row">
            <span class="lz-tool__result-label">Installation (Elektriker)</span>
            <span class="lz-tool__result-value" id="kalk-r-install">—</span>
          </div>
          <div class="lz-tool__result-row">
            <span class="lz-tool__result-label">FI-Schutz</span>
            <span class="lz-tool__result-value" id="kalk-r-fi">—</span>
          </div>
          <div class="lz-tool__result-row">
            <span class="lz-tool__result-label">Förderung</span>
            <span class="lz-tool__result-value" id="kalk-r-foerderung">—</span>
          </div>
          <div class="lz-tool__result-total">
            <span class="lz-tool__result-total-label">Gesamt (Richtwert)</span>
            <span class="lz-tool__result-total-value" id="kalk-r-total">—</span>
          </div>
        </div>

        <p class="lz-tool__disclaimer">
          Richtwerte, keine Garantie. Tatsächliche Kosten variieren je nach Region, Elektriker und Hausstatus.
          Details: <a href="../blog/wallbox-installation-kosten.html">Wallbox-Installationskosten erklärt</a>.
        </p>
      </form>
    </div>
  </section>
</main>

[FOOTER]
<script src="../nav.js"></script>
<script src="./kostenkalkulator.js"></script>
</body>
</html>
```

**Prüfen:**
- Kalkulator öffnen → alle 4 Dropdowns ändern → Ergebnis aktualisiert sich live
- Werte plausibel: Mittelklasse + mittlerer Kabelweg + FI-A + keine Förderung = ca. 1.280–1.580 €

**Commit:**
```bash
git add website/tools/
git commit -m "feat: add wallbox kostenkalkulator tool"
```

---

## Task 12: blog.html — Alle-Artikel-Übersicht ausbauen

**Files:**
- Modify: `website/blog.html`

Die aktuelle blog.html durch eine vollständige Artikel-Übersicht ersetzen, die alle Hubs und alle Artikel als Cards zeigt. Struktur: Abschnitt pro Hub mit `.lz-hub-grid` und `.lz-hub-card`-Links.

Keine neuen CSS-Klassen nötig — bestehende `.lz-hub-grid` und `.lz-hub-card` aus Task 2 verwenden.

**Commit:**
```bash
git add website/blog.html
git commit -m "feat: rebuild blog.html as full article overview with hub sections"
```

---

## Task 13: sitemap.xml und _redirects aktualisieren

**Files:**
- Modify: `website/sitemap.xml` (alle 24 neuen URLs ergänzen)
- Modify: `website/_redirects` (Hub-Seiten: `/ratgeber` → `/ratgeber/` etc.)

**sitemap.xml — neue Einträge (nach bestehendem Muster):**
```xml
<url><loc>https://lade-station-zuhause.de/ratgeber/</loc><priority>0.8</priority></url>
<url><loc>https://lade-station-zuhause.de/installation/</loc><priority>0.8</priority></url>
<url><loc>https://lade-station-zuhause.de/pv-smart/</loc><priority>0.8</priority></url>
<url><loc>https://lade-station-zuhause.de/recht-foerderung/</loc><priority>0.8</priority></url>
<url><loc>https://lade-station-zuhause.de/wallbox-tests/</loc><priority>0.8</priority></url>
<url><loc>https://lade-station-zuhause.de/auto-ratgeber/</loc><priority>0.8</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/fi-typ-a-oder-b.html</loc><priority>0.7</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/wallbox-anmelden-netzbetreiber.html</loc><priority>0.7</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/kabelweg-absicherung.html</loc><priority>0.7</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/wallbox-mietrecht-554-bgb.html</loc><priority>0.9</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/wallbox-weg-eigentuemer.html</loc><priority>0.8</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/foerderung-2026.html</loc><priority>0.8</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/wallbox-versicherung-haftung.html</loc><priority>0.7</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/wallbox-vw-id3-id4.html</loc><priority>0.7</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/wallbox-tesla-model-3-y.html</loc><priority>0.7</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/wallbox-bmw-ix-i4.html</loc><priority>0.7</priority></url>
<url><loc>https://lade-station-zuhause.de/blog/wallbox-plug-in-hybrid.html</loc><priority>0.7</priority></url>
<url><loc>https://lade-station-zuhause.de/tools/kostenkalkulator.html</loc><priority>0.8</priority></url>
```

**_redirects — Trailing-Slash-Redirects:**
```
/ratgeber           /ratgeber/          301
/installation       /installation/      301
/pv-smart           /pv-smart/          301
/recht-foerderung   /recht-foerderung/  301
/wallbox-tests      /wallbox-tests/     301
/auto-ratgeber      /auto-ratgeber/     301
```

**Commit:**
```bash
git add website/sitemap.xml website/_redirects
git commit -m "feat: update sitemap and redirects for new pages"
git push origin main
```

---

## Abschluss-Checkliste

- [ ] Satoshi-Font lädt korrekt (kein Outfit-Fallback sichtbar)
- [ ] Nav-Dropdowns funktionieren Desktop und Mobile
- [ ] Alle 6 Hub-Seiten erreichbar und korrekt verlinkt
- [ ] Alle 12 neuen Artikel mit korrektem Breadcrumb, Schema.org, internen Links
- [ ] Kostenkalkulator rechnet live, Ergebnis plausibel
- [ ] blog.html zeigt alle Artikel in Hub-Abschnitten
- [ ] sitemap.xml vollständig
- [ ] Cloudflare Pages Deploy erfolgreich (kein 404 auf Hub-Seiten)

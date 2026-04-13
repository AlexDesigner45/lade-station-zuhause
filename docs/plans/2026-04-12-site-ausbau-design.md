# Design-Dokument: Site-Ausbau lade-station-zuhause.de
**Datum:** 2026-04-12
**Status:** Genehmigt
**Strategie:** Hub & Spoke (Ansatz C)

---

## Ziel

Die Seite von einer 5-Artikel-Nischenseite zu einem vollständigen Wissens-Hub für Wallbox-Kaufentscheidungen ausbauen. Primärer Wettbewerber (ladestation-zuhause.de) ist content-schwach. Größte Lücken im Markt: Rechtsfragen (§554 BGB, WEG), Versicherung/Haftung, V2H/V2G, Kostenkalkulator, Auto-spezifische Ratgeber.

---

## Navigationsstruktur

```
LadeStation | Kaufberater | Installation | PV & Smart | Recht & Förderung | Wallbox-Tests | Auto-Ratgeber | [Quiz-Button]
```

### Dropdown-Inhalte

**Kaufberater:**
- Welche Wallbox passt zu dir? (Pillar)
- 11 kW oder 22 kW?
- Was kostet eine Wallbox wirklich?
- Ladedauer-Rechner (Tool)

**Installation:**
- Installationskosten erklärt (vorhanden)
- FI Typ A oder B?
- Wallbox anmelden beim Netzbetreiber
- Kabelweg & Absicherung

**PV & Smart:**
- Überschussladen: lohnt sich das? (vorhanden)
- Welche Wallboxen können OCPP?
- Wallbox + PV + Speicher kombinieren
- Dynamische Stromtarife

**Recht & Förderung:**
- Wallbox im Mietrecht (§554 BGB)
- Wallbox in der WEG
- Förderung 2026: Was gibt es noch?
- Wallbox-Versicherung & Haftung

**Wallbox-Tests:**
- go-eCharger vs. Heidelberg vs. ABL (vorhanden)
- Heidelberg Wallbox Home Eco Test
- go-eCharger HOMEfix Test
- KEBA P30 Test

**Auto-Ratgeber:**
- VW ID.3 / ID.4
- Tesla Model 3 / Y
- BMW iX / i4
- Hyundai Ioniq 5
- Plug-in-Hybrid: lohnt sich Wallbox?

---

## Neue Seiten (18 gesamt)

### 6 Hub-Landingpages
Kategorie-Übersichtsseiten mit Teaser-Cards zu den Spoke-Artikeln. Schema: `CollectionPage`.

| URL | Titel |
|-----|-------|
| `/ratgeber/` | Wallbox-Kaufberater |
| `/installation/` | Installation & Technik |
| `/pv-smart/` | PV & Smart Charging |
| `/recht-foerderung/` | Recht & Förderung |
| `/wallbox-tests/` | Wallbox-Tests & Vergleiche |
| `/auto-ratgeber/` | Auto-Ratgeber |

### 12 neue Artikel

**Installation & Technik (3):**
| Datei | Primär-Keyword | Besonderheit |
|-------|---------------|--------------|
| `blog/fi-typ-a-oder-b.html` | FI Typ B Wallbox | Featured Snippet-fähig |
| `blog/wallbox-anmelden-netzbetreiber.html` | Wallbox anmelden | HowTo-Schema |
| `blog/kabelweg-absicherung.html` | Wallbox Absicherung | Kosten-Tabelle |

**Recht & Förderung (4) -- größte Marktlücke:**
| Datei | Primär-Keyword | Besonderheit |
|-------|---------------|--------------|
| `blog/wallbox-mietrecht-554-bgb.html` | Wallbox Mietwohnung | Musteranschreiben-Download |
| `blog/wallbox-weg-eigentuemer.html` | Wallbox WEG | Lastmanagement-Pflicht |
| `blog/foerderung-2026.html` | Wallbox Förderung 2026 | Bundesländer-Tabelle |
| `blog/wallbox-versicherung-haftung.html` | Wallbox Versicherung | Versicherungs-Matrix |

**Auto-Ratgeber (4):**
| Datei | Primär-Keyword |
|-------|---------------|
| `blog/wallbox-vw-id3-id4.html` | Wallbox VW ID.3 |
| `blog/wallbox-tesla-model-3-y.html` | Wallbox Tesla Model 3 |
| `blog/wallbox-bmw-ix-i4.html` | Wallbox BMW iX |
| `blog/wallbox-plug-in-hybrid.html` | Wallbox Plug-in-Hybrid |

**Tools (1):**
| Datei | Funktion |
|-------|---------|
| `tools/kostenkalkulator.html` | Gesamtkosten-Rechner: Gerät + Installation + Absicherung - Förderung |

### Bestehende 5 Artikel
Bleiben erhalten, werden um interne Links zu neuen Hub-Seiten ergänzt:
- `blog/wallbox-kaufberatung-2026.html`
- `blog/11kw-vs-22kw.html`
- `blog/wallbox-installation-kosten.html`
- `blog/wallbox-pv-ueberschussladen.html`
- `blog/go-e-vs-heidelberg-vs-abl.html`

---

## Technische Änderungen

### Fonts
**Satoshi** (Headings) via Fontshare CDN + **DM Sans** (Body) via Google Fonts.

```css
--lz-font-display: 'Satoshi', sans-serif;
--lz-font-body:    'DM Sans', sans-serif;
```

Fontshare-Link:
```html
<link href="https://api.fontshare.com/v2/css2?f[]=satoshi@700,500&display=swap" rel="stylesheet">
```

### Neue CSS-Komponenten (alle in `style.css`)
- `.lz-nav__dropdown` -- Desktop Dropdown, Mobile aufklappbar
- `.lz-hub-grid` -- 3-spaltige Card-Grid für Hub-Seiten
- `.lz-hub-card` -- Card mit Icon, Titel, Teaser, Link
- `.lz-tool-card` -- Kalkulator-UI (Input-Felder + Ergebnis-Box)
- `.lz-breadcrumb` -- für alle Unterseiten
- `.lz-toc` -- Sticky Table of Contents (Desktop Sidebar)

### JavaScript
- `nav.js` -- Dropdown-Logik ergänzen (Hover Desktop, Click Mobile)
- `tools/kostenkalkulator.js` -- neues File, nur auf Kalkulator-Seite geladen

### Schema.org
| Seitentyp | Schema |
|-----------|--------|
| Hub-Seiten | `CollectionPage` |
| Artikel (allgemein) | `Article` + `FAQPage` |
| Recht-Artikel | `Article` + `FAQPage` |
| Auto-Ratgeber | `HowTo` |
| Kostenkalkulator | `HowTo` mit Steps |

---

## Wettbewerbs-Differenzierung

| Was keiner der Wettbewerber gut macht | Unsere Umsetzung |
|--------------------------------------|-----------------|
| §554 BGB / WEG vollständig erklärt | 2 dedizierte Artikel mit Mustertext |
| Versicherungs-Matrix (was greift wann?) | Artikel mit Tabelle |
| Kostenkalkulator mit Förderungsabzug | Interaktives Tool |
| Auto-spezifische Empfehlungen | 4 dedizierte Seiten |
| Anmeldepflicht beim Netzbetreiber | Dedizierter HowTo-Artikel |

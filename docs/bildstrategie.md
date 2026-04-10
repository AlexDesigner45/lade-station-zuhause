# Bildstrategie für Ladestation Zuhause

**Pflichtlektüre:** `0_best-practices/19-BILDGENERIERUNG-NANO-BANANA.md`

## Die Kern-Regel

> **AI-Bilder für Atmosphäre. Hersteller-Bilder für Produkte.**

## Bild-Typen und ihre Quellen

### Mit Nano Banana (Gemini) generieren

Diese Bild-Typen sind unproblematisch mit AI:

| Bild-Typ | Beispiel-Prompt | Wo verwendet |
|---|---|---|
| **Startseite-Hero** | "Modern garage with wall-mounted EV charger, electric car plugged in, clean concrete floor" | `index.html` Hero-Bereich |
| **Blog-Kategorie-Header** | "Residential house with solar panels on roof, EV charging in driveway" | `blog.html`, Kategorieseiten |
| **Kaufberater-Atmosphäre** | "Person comparing wallbox specs on laptop in home office, charger visible through window" | Blog-Artikel-Header |
| **Szenario-Mood** | "Close-up of electrical panel with dedicated EV circuit breaker" | Inline-Sektion-Bilder |
| **Feature-Explainer** | "Split-screen visualization: solar panels feeding energy to wallbox" | Technik-Erklärungs-Artikel |
| **OG-Card / Social Preview** | "Branded card layout with charging icon, 1200x630" | `og:image` Meta-Tag |
| **Ueber-uns-Bild** | "Clean workspace, hands on keyboard, natural light" | `ueber-uns.html` |

### Nicht mit AI -- nutze echte Bilder

Für diese Bild-Typen brauchst du offizielle Quellen:

| Bild-Typ | Warum nicht AI? | Quelle |
|---|---|---|
| **Spezifisches Wallbox-Modell** | Irreführung + Markenrecht | Hersteller-Pressekits, Amazon PA-API, eigene Fotos |
| **Vergleichstabellen-Thumbnails** | Kunde muss Modell wiedererkennen | dito |
| **Produktkarten mit Modellname** | Branding-Konsistenz | dito |
| **Hero-"Top-Empfehlung"-Karte** | Trust-kritisch | dito |

## Bezugsquellen für echte Produktbilder

### 1. Hersteller-Pressekits
- Heidelberg Energy: https://www.heidelberg.com/global/de/about_heidelberg/press/press.jsp
- KEBA: https://www.keba.com/de/emobility
- go-e: https://go-e.com/de/presse
- Easee: https://easee.com/de/presse
- Wallbox (Pulsar): https://wallbox.com/de_de/newsroom
- ABL: https://www.abl.de/de/presse
- openWB: https://openwb.de
- Fronius: https://www.fronius.com/de-de/germany/presse

**Tipp:** Viele Hersteller erlauben die Nutzung für Affiliate-Seiten, wenn die Marke korrekt wiedergegeben wird. Bei Premium-Brands explizit anfragen.

### 2. Amazon PA-API (Product Advertising API)
- Offizielle Bilder, rechtlich klar
- Braucht Amazon-Partner-Qualifikation (3 Verkäufe in 180 Tagen)
- Automatisch abrufbar

### 3. Eigene Fotos
- Wenn du eine Wallbox physisch testest, mache eigene Fotos
- Deutliches E-E-A-T-Signal für Google
- Aber: nur bei Modellen, die du wirklich besitzt (sonst unehrlich)

### 4. Affiliate-Bildtausch-Netzwerke
- Awin, Tradedoubler etc. bieten manchmal Produktbilder-Pools
- Weniger zuverlässig, aber Option für Randmodelle

## Stil-Konsistenz über die Seite

Für ein einheitliches Look&Feel:

### Farb-DNA im Prompt verankern
```
"with subtle teal accents in the lighting, matching modern tech aesthetic"
```

### Licht-Konsistenz
```
"soft natural daylight, slight warm tone, golden hour feel"
```

### Perspektiv-Konsistenz
Für Wallbox-Nische:
- Hero: **Wide-angle, garage/driveway perspective** (Überblick)
- Inline: **Detail-shot, Wallbox an Wand** (Produkt-Perspektive)
- Mood: **Mid-shot, depth of field** (Haus mit E-Auto)

### Post-Processing einheitlich
```bash
# Alle Bilder nach Generierung:
magick INPUT.png \
  -resize 1920x1080^ \
  -gravity center \
  -extent 1920x1080 \
  -quality 85 \
  -define webp:method=6 \
  OUTPUT.webp
```

## Bildverzeichnis-Struktur

```
website/assets/
├── fonts/                    # Lokale Schriften (siehe 16-FONTS)
│   ├── outfit-latin.woff2
│   ├── outfit-latin-ext.woff2
│   ├── dmsans-latin.woff2
│   └── dmsans-latin-ext.woff2
├── hero/                     # Haupt-Hero-Bilder (AI-generiert)
│   ├── home-hero.webp        # 1920x1080
│   └── og-default.webp       # 1200x630
├── blog/                     # Blog-Artikel-Header (AI-generiert)
│   ├── wallbox-kaufberatung-2026-header.webp
│   ├── 11kw-vs-22kw-header.webp
│   └── ...
├── mood/                     # Atmosphärische Bilder (AI-generiert)
│   ├── garage-wallbox-evening.webp
│   ├── pv-anlage-dach.webp
│   └── ...
├── products/                 # Echte Produktbilder (Hersteller/Amazon)
│   ├── heidelberg-energy-control.webp
│   ├── keba-p30.webp
│   ├── go-e-charger-gemini.webp
│   └── ...
└── icons/                    # SVG-Icons (inline im CSS oder als Dateien)
    ├── logo.svg
    ├── favicon.ico
    └── apple-touch-icon.png
```

## Quick-Win Prompt-Library für Wallbox-Nische

Diese Prompts sind direkt einsetzbar -- Copy-Paste in Nano Banana:

### Home-Hero (Haupt-Bild der Startseite)

```
Cinematic wide-angle photograph, modern German residential garage with a sleek white wallbox
mounted on the wall, electric car plugged in with a glowing green LED indicator,
clean concrete floor, organized garage interior, soft evening light with warm golden tones,
shallow depth of field, editorial photography style, photorealistic,
16:9 aspect ratio, 2K resolution, no text, no logos, no brand names, no watermarks
```

### Blog-Header Kaufberatung

```
Overhead flat-lay photograph of a clean white desk with a laptop showing a wallbox comparison chart,
a cup of coffee, a small notebook with pen, EV charging cable coiled neatly beside the laptop,
warm natural daylight from the side, minimalist editorial composition,
slight teal tint in the color grading, photorealistic, 16:9 aspect ratio,
no text visible in the image, no logos
```

### E-Auto am Laden (Garage-Szenario)

```
Photograph of a modern German single-family home driveway at dusk,
electric vehicle connected to a wall-mounted charger, warm ambient light from the house,
suburban residential setting, photorealistic, documentary style,
16:9 aspect ratio, no text, no logos, no watermarks
```

### PV-Überschussladen (Technik-Explainer)

```
Artistic split-view photograph, top half showing solar panels on a residential roof
under bright blue sky, bottom half showing a garage interior with wallbox and glowing LED,
visual energy flow connection between both halves, cinematic lighting,
photorealistic, 16:9 aspect ratio, no text, no UI overlays
```

### Sicherungskasten / Installation

```
Close-up photograph of a modern German residential electrical panel,
dedicated EV circuit breaker labeled, clean professional installation,
shallow depth of field, soft studio-like lighting, documentary photography style,
photorealistic, 4:3 aspect ratio, no text, no logos
```

### OG-Card für Social Media

```
Minimalist hero graphic, abstract geometric composition in teal and white,
subtle wallbox and lightning bolt silhouette integrated into the design,
editorial poster style, 1200x630 exact aspect ratio,
warm neutral background, no text, no logos,
clean modern aesthetic
```

## Skalierung auf weitere Nischenseiten

Pro Seite ein **Mood-Board** mit 8-10 Bildern:

1. 1 Home-Hero (1920x1080)
2. 1 OG-Card (1200x630)
3. 3 Kategorie-Header (1600x900)
4. 3 Mood/Inline-Bilder (1200x800)
5. 1 Ueber-uns-Bild (1200x800)

**Budget:** ~$0.60-$1.00 pro Seite mit NB2 Flash 1K.

## Checkliste für jedes Bild

- [ ] 6-Komponenten-Prompt (Subject, Action, Context, Composition, Lighting, Style)
- [ ] "no text, no logos, no watermarks" am Ende
- [ ] Kein spezifischer Markenname im Prompt
- [ ] Aspect Ratio explizit ("16:9 aspect ratio")
- [ ] Nach Generierung: WebP-Konvertierung mit Quality 85
- [ ] Aussagekräftiger Alt-Text gesetzt (deutsch, beschreibend, max 125 Zeichen)
- [ ] In richtigen Ordner (hero, blog, mood, products)
- [ ] Dateiname slug-basiert, nicht `IMG_0123.webp`

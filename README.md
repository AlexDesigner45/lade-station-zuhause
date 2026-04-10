# Ladestation Zuhause

**Status:** In Entwicklung
**Domain:** lade-station-zuhause.de
**Hosting:** Cloudflare Pages (statisch)

## Was ist das?

Eine Affiliate-Nischenseite zum Thema private Wallboxen / E-Auto-Ladestationen. Feature-Set:
- Statisches HTML + CSS + Vanilla JS (kein Build-Step)
- Design-Token-System mit CSS-Variablen (`--lz-*`)
- Scroll-transformierende Nav
- Break-out-Hero mit Gradient-Overlay
- **Interaktiver Wallbox-Konfigurator** (datengetrieben via `quiz-config.json`)
- Vergleichstabelle, Produktkarten, Pro/Contra-Boxen, FAQ-Accordion
- Affiliate-Disclaimer-Pattern
- Schema.org JSON-LD (Website, FAQPage)
- 100/100 Lighthouse-Ziel

## Ordnerstruktur

```
lade-station-zuhause-de/
├── README.md                   # Diese Datei
├── CLAUDE.md                   # Workflow-Steuerung für Claude Code
├── website/                    # Die eigentliche Webseite
│   ├── index.html              # Startseite mit Konfigurator + Vergleich
│   ├── impressum.html
│   ├── datenschutz.html
│   ├── ueber-uns.html
│   ├── kontakt.html
│   ├── 404.html
│   ├── style.css               # Design-System (Prefix: lz-*)
│   ├── nav.js
│   ├── quiz.js                 # Konfigurator-Engine (generisch)
│   ├── quiz-config.json        # Konfigurator-Inhalt (8 Wallboxen)
│   ├── cookie.js
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── _headers
│   ├── _redirects
│   └── assets/
│       ├── fonts/              # Outfit + DM Sans (lokal, DSGVO)
│       ├── products/           # Wallbox-Produktbilder (TODO)
│       └── icons/              # SVG-Icons (TODO)
├── brand/                      # Brand-Kontext
│   ├── brand-context.md
│   ├── brand-voice.md
│   ├── testmethodik.md
│   ├── seo-keywords.md
│   ├── affiliate-links.md
│   ├── produkte.md
│   └── redaktionsplan.md
└── docs/                       # Dokumentation
    ├── baustein-katalog.md
    ├── bildstrategie.md
    └── quiz-config-schema.md
```

## Deployment

Git commit + push → Cloudflare Pages deployed automatisch. Produktiv-Branch: `main`.

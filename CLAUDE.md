# CLAUDE.md — Nischenseite Ladestation Zuhause

## Projekt-Typ
Statische Affiliate-Nischenseite. Hosting auf **Cloudflare Pages**. Kein WordPress, kein Build-Step.

## Domain
**lade-station-zuhause.de**

## Brand-Kontext lesen (PFLICHT bei jedem Task)
Vor jeder Content-Änderung ODER Layout-Entscheidung:
1. `brand/brand-context.md` — Wer? Warum?
2. `brand/brand-voice.md` — Wie wird geschrieben?
3. `brand/testmethodik.md` — Wie werden Wallboxen bewertet?
4. `brand/seo-keywords.md` — Welche Keywords sind Ziel?

## Tech-Stack
- HTML5, Vanilla CSS (Design-Token-System), Vanilla JS
- Google Fonts: Outfit (Display) + DM Sans (Body)
- Keine Frameworks, kein Build-Step
- Deployment: Git-Push → Cloudflare Pages (Auto-Deploy)

## CSS-Konventionen (hart durchgezogen)
- CSS-Prefix: `lz-*` (für "Ladestation Zuhause")
- BEM-lite: `.lz-nav__menu`, `.lz-card__title`
- Design Tokens als `:root`-Variablen (`--lz-*`)
- **Keine Inline-Styles** außer für wirklich einmalige Werte (z.B. Hero-Background-Image)
- **Keine Utility-Klassen** (kein Tailwind)
- Eine einzige `style.css`

## Pflicht-Bausteine (müssen in jedem Artikel/Seite berücksichtigt werden)
- Affiliate-Disclaimer am Artikelanfang + im Footer
- "Stand: TT.MM.JJJJ" bei allen Vergleichs-/Preisdaten
- Schema.org JSON-LD (Article, FAQPage, Product wo relevant)
- Interne Verlinkung zu mindestens 2 anderen Artikeln
- Alt-Text auf allen Bildern

## Content-Regeln
- Sprache: Deutsch, "Du"-Ansprache
- Tonalität: Ehrlich, direkt, keine Marketing-Floskeln. Claim der Seite ist "ohne Marketing-Bullshit" — das gilt auch für die Texte
- Bei Wallbox-Empfehlungen: IMMER Gründe nennen, nicht nur "Unser Favorit"
- Preise: Tagesaktuell dokumentieren ODER nicht nennen
- Bei fehlenden Informationen: NICHT erfinden, sondern "Information folgt" schreiben

## Rechtliche Regeln
- Betreiber: Aleksej Debus, Ziegelbergstraße 17, 97318 Kitzingen
- Impressum: §5 TMG, Einzelbetreiber
- Affiliate-Offenlegung auf jeder Produktseite sichtbar
- Keine Garantien ("100% Beste Wahl") — stattdessen "unserer Recherche nach"
- Keine Fake-Zertifikate / Pseudo-Siegel

## Quiz-Pflege
- Quiz-Einleitung: "Welche Wallbox passt zu dir?"
- Fragen + Scoring in `website/quiz-config.json` — NIE in quiz.js hardcoden
- Neue Wallboxen in der Scoring-Matrix hinzufügen = nur JSON-Edit
- Quiz-Engine (quiz.js) ist generisch und für alle Nischenseiten identisch

## Deployment
- Git commit + push → Cloudflare Pages deployed automatisch
- Produktiv-Branch: `main`
- Preview-Branches: jeder andere Branch = Preview-Deployment

## Wichtige Dateien (in Priorität)
1. `website/index.html` — Startseite mit Wallbox-Konfigurator/Quiz
2. `website/style.css` — das gesamte Design-System
3. `website/quiz-config.json` — Quiz-Inhalt (Wallbox-Matching)
4. `brand/` — Kontext für alle Claude-Sessions
5. `docs/baustein-katalog.md` — Referenz welche CSS-Komponenten existieren

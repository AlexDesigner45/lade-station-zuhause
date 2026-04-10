# Affiliate-Links -- Zentrale Pflegetabelle

**Letzte Aktualisierung:** 2026-04-10
**Amazon-Partner-Tag:** DEIN-TAG-20 (hier deinen Amazon-Partnernet-Tag eintragen)

## Anleitung

1. **Amazon-Partnernet:** https://partnernet.amazon.de -> "Tool-Links" -> "Link zu einer Produktseite" -> URL eingeben -> Partner-Link kopieren
2. **Geniuslink (optional):** https://geniuslink.com -> Dashboard -> "Create New Link" -> Amazon-URL einfuegen -> Geniuslink generieren (routet automatisch DE->COM->UK nach Besucher-Land)
3. **In HTML einsetzen:** Jeder `href="#"` mit `rel="sponsored noopener"` bekommt die URL aus dieser Tabelle
4. **In der Tabelle pflegen:** Zeile aktualisieren, in HTML einsetzen, committen, fertig

## Wann Geniuslink?

| Situation | Empfehlung |
|---|---|
| Start, nur DE-Traffic | Direkte Amazon.de-Links reichen (kostenlos) |
| AT/CH-Traffic > 5% | OneLink von Amazon (kostenlos, begrenzt) |
| International (EN, US, UK) | Geniuslink ($6/Monat) -- routet Amazon-Links nach Land |
| Mehrere Affiliate-Programme | Geniuslink -- kann auch nicht-Amazon-Links routen |

**Empfehlung fuer jetzt:** Start mit direkten Amazon.de-Links. Wenn du die Domain bei Google Search Console eintraegst und nach 2-3 Monaten siehst, dass >5% Traffic aus AT/CH/Ausland kommt -> dann Geniuslink aktivieren.

## Produkt-Tabelle

Die `id` in der Tabelle muss mit der `data-product-price` in den HTML-Dateien uebereinstimmen.

| ID | Marke | Modell | Ladeleistung | Amazon.de-Link (Partnernet) | Geniuslink (optional) | Preis (manuell) | Letztes Update |
|---|---|---|---|---|---|---|---|
| `heidelberg-home-eco` | Heidelberg | Wallbox Home Eco | 11 kW | | | ca. 495 EUR | 2026-04-10 |
| `keba-p30-c-series` | KEBA | KeContact P30 c-series | 22 kW | | | ca. 999 EUR | 2026-04-10 |
| `go-echarger-homefix-11` | go-e | go-eCharger HOMEfix 11 kW | 11 kW | | | ca. 649 EUR | 2026-04-10 |
| `easee-home` | Easee | Easee Home | 22 kW | | | ca. 849 EUR | 2026-04-10 |
| `wallbox-pulsar-plus` | Wallbox | Pulsar Plus | 22 kW | | | ca. 699 EUR | 2026-04-10 |
| `abl-emh1` | ABL | eMH1 | 11 kW | | | ca. 549 EUR | 2026-04-10 |
| `openwb-series-2` | OpenWB | Series 2 | 22 kW | | | ca. 1.199 EUR | 2026-04-10 |
| `fronius-wattpilot` | Fronius | Wattpilot | 22 kW | | | ca. 799 EUR | 2026-04-10 |

## So traegst du Links ein

### Schritt 1: Amazon-Link generieren

1. Geh zu https://partnernet.amazon.de
2. Suche das Produkt (z.B. "Heidelberg Wallbox Home Eco")
3. Klick auf "Text" bei "SiteStripe" (Toolbar oben auf Amazon, wenn eingeloggt)
4. Oder: "Tools" -> "Links erstellen" -> Produkt-URL eingeben
5. Kopierten Link hier eintragen

**Format des Links:** `https://www.amazon.de/dp/BXXXXXXXXX?tag=DEIN-TAG-20&linkCode=...`

**Hinweis:** Nicht alle Wallboxen sind auf Amazon verfuegbar. Fuer Modelle wie OpenWB oder KEBA kann ein Direktlink zum Hersteller-Shop sinnvoll sein -- dann ohne Affiliate-Tag, aber mit `rel="noopener"`.

### Schritt 2: In HTML einsetzen

Suche in den HTML-Dateien nach den Platzhalter-`#`-Links. Beispiel in `index.html`:

```html
<!-- Vorher (Platzhalter): -->
<a href="#" class="ls-btn ls-btn--primary ls-btn--sm" rel="sponsored noopener" target="_blank">Bei Amazon ansehen</a>

<!-- Nachher (mit echtem Link): -->
<a href="https://www.amazon.de/dp/B0XXXXXXXX?tag=dein-tag-20" class="ls-btn ls-btn--primary ls-btn--sm" rel="sponsored noopener" target="_blank">Bei Amazon ansehen</a>
```

### Schritt 3: Stellen wo Links eingesetzt werden muessen

| Datei | Wo? | Welches Produkt? |
|---|---|---|
| `index.html` | Top-Empfehlung Hero-Card CTA | heidelberg-home-eco |
| `index.html` | Vergleichstabelle (8 Zeilen x je 1 CTA) | alle 8 Modelle |
| `blog/wallbox-kaufberatung-2026.html` | Inline-Produktboxen | Heidelberg Home Eco, go-eCharger HOMEfix, ABL eMH1 |
| Zukuenftige Blog-Artikel | Inline-Produktboxen | je nach Artikel |

## Preise manuell aktuell halten

Bis die Preis-Sync-Pipeline (Keepa API -> products.json) gebaut ist:

1. Einmal im Monat die Preise auf Amazon / Hersteller-Shops pruefen
2. In dieser Tabelle aktualisieren
3. In den HTML-Dateien aktualisieren (Suche: `data-product-price="PRODUKT-ID"`)
4. In der Vergleichstabelle aktualisieren
5. Committen + pushen -> Cloudflare Pages deployed automatisch

**Pro-Tipp:** Die `data-product-price`-Attribute in den HTML-Dateien sind genau fuer den zukuenftigen Auto-Updater vorbereitet. Wenn die Keepa-Pipeline steht, werden die Preise automatisch ersetzt -- ohne HTML-Struktur-Aenderung.

**Wallbox-spezifisch:** Preise schwanken bei Wallboxen weniger stark als bei Consumer Electronics. Monatliche Pruefung reicht in der Regel. Achte aber auf Aktionspreise rund um IAA, E-Auto-Messen und Jahresende-Deals.

## Amazon-Partnernet-Setup Checklist

- [ ] Amazon-Partnernet-Account: https://partnernet.amazon.de
- [ ] Partner-Tag erstellt (z.B. `ladestatzuh-21`)
- [ ] SiteStripe aktiviert (Toolbar auf Amazon-Seiten)
- [ ] URL `lade-station-zuhause.de` im Account hinterlegt
- [ ] Erste 3 qualifizierte Verkaeufe innerhalb von 180 Tagen (sonst wird der Account geschlossen)
- [ ] Steuerliche Informationen im Account hinterlegt

## Besonderheiten Wallbox-Affiliate

- **Hoehere Warenkorbwerte:** Wallboxen kosten 500-1.200 EUR -> hoehere Provision pro Sale als bei Consumer Electronics
- **Saisonalitaet:** Peaks im Fruehjahr (Foerderung, PV-Saison) und Herbst (Vorbereitung Winter)
- **Cross-Selling:** Installations-Zubehoer (Kabelkanal, Standfuss, FI-Schalter) als Zusatz-Provisions-Quelle
- **Nicht bei Amazon:** Manche Wallboxen (OpenWB, teilweise KEBA) sind nur im Fachhandel erhaeltlich -- hier ggf. Hersteller-Affiliate-Programme pruefen

# Wordle-Helfer DE

Kleiner Web-App-Prototyp für deutsche 5-Buchstaben-Wörter mit Umlauten und `ß`.

## Was die App kann

- 5 Felder wie bei Wordle
- Bildschirmtastatur mit `ä`, `ö`, `ü` und `ß`
- Pro Feld Status umschalten: `grau`, `gelb`, `grün`
- Kandidatenliste und priorisierte Vorschläge
- korrekte Behandlung von doppelten Buchstaben (Wordle-Logik)
- eigene Wortlisten per `.txt`, `.json` oder Hunspell-`.dic` laden

## Starten

Am einfachsten `index.html` im Browser öffnen.

Falls du neu bauen willst:

```bash
npm run build
```

## Tastatur-Shortcuts

- Buchstaben tippen oder anklicken
- `Backspace`: löschen
- `Enter`: Tipp übernehmen
- `←` / `→`: aktives Feld wechseln
- `1` = grau, `2` = gelb, `3` = grün für das aktive Feld

## Standard-Wortliste

Die mitgelieferte Liste basiert auf `wordlists/source/de_DE_frami.dic`.

Enthalten sind aktuell **3661** eindeutige 5-Buchstaben-Einträge.

Diese Standardliste ist ein guter Start für einen Prototypen, aber nicht perfekt:

- sie basiert auf Hunspell-Headwords, nicht auf allen flektierten Vollformen
- sie kann Namen, seltene oder randständige Wörter enthalten
- laut mitgeliefertem README können zusätzliche `frami`-Einträge ungeprüft sein

## Wortliste selbst zusammensetzen

### Variante A – schnell und pragmatisch

Nimm `wordlists/source/de_DE_frami.dic` als Rohmaterial und filtere auf 5 Zeichen.

Dafür ist dieses Script dabei:

```bash
node scripts/extract-hunspell-5.mjs wordlists/source/de_DE_frami.dic wordlists/words-5.custom.txt
```

Das Script macht genau das:

1. liest die Hunspell-Datei im Latin-1-Encoding
2. entfernt Flags hinter `/`
3. normalisiert auf Kleinbuchstaben
4. behält nur `^[a-zäöüß]{5}$`
5. entfernt Duplikate

### Variante B – bessere Abdeckung

Wenn du später eine stärkere Liste willst, nimm lieber Vollformen aus einem Morphologie-Lexikon und filtere danach wieder auf 5 Zeichen.

Für bereits exportierte Text- oder JSON-Dateien liegt dieses Script bei:

```bash
node scripts/filter-5-letters.mjs dein-export.txt wordlists/words-5.fullforms.txt
```

## Eigene Liste in die App laden

In der App oben unter **Wortliste** eine Datei laden.

Akzeptiert werden:

- `.txt` – ein Wort pro Zeile
- `.json` – Array von Wörtern oder `{ "words": [...] }`
- `.dic` – Hunspell-Datei

## Projektstruktur

- `index.html` – Einstieg
- `styles.css` – Styling
- `src/defaultWords.ts` – eingebettete Standardliste
- `src/app.ts` – TypeScript-Logik
- `dist/app.js` – gebautes Bundle aus TypeScript
- `wordlists/source/` – Rohdaten und README zur LibreOffice-Liste
- `scripts/` – Helfer zum Extrahieren/Filtern von Wortlisten

## Hinweis zur Lizenz

Siehe `NOTICE_WORDLIST.md` und die Dateien in `wordlists/source/`.

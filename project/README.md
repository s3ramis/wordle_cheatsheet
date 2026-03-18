# Wordle-Cheatsheet

Cheatsheet für [deutsches Wordle](https://www.wortsuchspiel.de/).

## Features

- fünf Buchstabenfelder für die Eingabe
- Bildschirmtastatur inkl. Umlaute und ß
- Feld Status festlegen: `grau`, `gelb`, `grün`
- Vorschlagsliste mit Priorisierungslogik
- custom Wortlisten in `.txt`, `.json` oder `.dic` Format laden

## Tastatur-Shortcuts

- Buchstaben tippen oder anklicken
- `Backspace`: löschen
- `Enter`: Tipp übernehmen
- `←` / `→`: Feld wechseln
- `1` = grau, `2` = gelb, `3` = grün für das aktive Feld

## Standard-Wortliste

Die mitgelieferte Liste basiert auf 5-Letter-Words die aus Hunspell LibreOffice de_DE Wordlist extrahiert wurden. (`/scripts`)

Enthalten sind aktuell **3661** eindeutige 5-Buchstaben-Einträge.

- basiert auf Hunspell-Headwords, d.h. dekliniert bzw. konjugierte Wortformen sind nicht enthalten
- laut mitgeliefertem README können zusätzliche `frami`-Einträge ungeprüft sein

## Wortliste selbst zusammensetzen

### 1. Mitgelieferte Wortliste

Unter `wordlists/source/de_DE_frami.dic` liegt schon eine fertige Wortliste.
Diese muss noch auf 5 Zeichen gefiltert werden.

Dafür liegt dieses Script bei:

```bash
node scripts/extract-hunspell-5.mjs wordlists/source/de_DE_frami.dic wordlists/words-5.custom.txt
```

Das Script:

1. liest die Hunspell-Datei mit behindertem Latin-1 Encoding
2. entfernt Flags hinter `/`
3. normalisiert auf Kleinbuchstaben
4. behält nur `^[a-zäöüß]{5}$`
5. entfernt Dopplungen

### Variante B – bessere Abdeckung

Für eine kompetentere Liste, lieber Daten aus einem Morphologie-Lexikon nehmen und über das mitgelieferte Skript auf 5-Letter-Words filtern.

Für `.txt` oder `.json` liegt auch ein Extraction-Script bei:

```bash
node scripts/filter-5-letters.mjs dein-export.txt wordlists/words-5.fullforms.txt
```

## Eigene Liste in die App laden

In der App oben unter **Wortliste** eine Datei laden.

Akzeptiert werden:

- `.txt` – ein Wort pro Zeile
- `.json` – Array von Wörtern oder `{ "words": [...] }`
- `.dic` – Hunspell-Datei

# wordle-cheatsheet

cheatsheet for [german wordle](https://www.wortsuchspiel.de/).

## features

* five letter fields for input
* on-screen keyboard including umlauts and ß
* set field status: `grey`, `yellow`, `green`
* suggestion list with prioritization logic
* load custom word lists in `.txt`, `.json` or `.dic` format

## keyboard shortcuts

* type or click letters
* `backspace`: delete
* `enter`: submit guess
* `←` / `→`: switch field
* `1` = grey, `2` = yellow, `3` = green for the active field

## default word list

the included list is based on 5-letter words extracted from the hunspell libreoffice de_de word list. (`/scripts`)

currently contains **3661** unique 5-letter entries.

* based on hunspell headwords, i.e. declined or conjugated word forms are not included
* according to the included readme, additional `frami` entries may be unverified

## building your own word list

### 1. included word list

a ready-made word list is available at `wordlists/source/de_de_frami.dic`.
this still needs to be filtered to 5 characters.

for that, this script is included:

```bash
node scripts/extract-hunspell-5.mjs wordlists/source/de_de_frami.dic wordlists/words-5.custom.txt
```

the script:

1. reads the hunspell file using ancient latin-1 encoding
2. removes flags after `/`
3. normalizes to lowercase
4. keeps only `^[a-zäöüß]{5}$`
5. removes duplicates

### option b – better coverage

for a more complete list, it is recommended to use data from a morphology lexicon and filter it to 5-letter words using the provided script.

an extraction script for `.txt` or `.json` is also included:

```bash
node scripts/filter-5-letters.mjs your-export.txt wordlists/words-5.fullforms.txt
```

## loading a custom list into the app

in the app, load a file under **word list** at the top.

accepted formats:

* `.txt` – one word per line
* `.json` – array of words or `{ "words": [...] }`
* `.dic` – hunspell file

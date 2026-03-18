"use strict";
const STORAGE_KEY = "wordle-cheat-de.custom-wordlist.v1";
const WORD_REGEX = /^[a-zäöüß]{5}$/u;
const FEEDBACK_LABELS = {
    unknown: "offen",
    absent: "grau",
    present: "gelb",
    correct: "grün",
};
const FEEDBACK_ORDER = ["unknown", "absent", "present", "correct"];
const KEYBOARD_ROWS = [
    ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ü"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä"],
    ["y", "x", "c", "v", "b", "n", "m", "ß"],
];
let activeWordList = [...DEFAULT_WORDS];
let activeWordListLabel = DEFAULT_WORD_SOURCE_NAME;
let activeWordListNote = DEFAULT_WORD_SOURCE_NOTE;
let customWordListActive = false;
let submittedGuesses = [];
let draftLetters = Array.from({ length: 5 }, () => "");
let draftFeedback = Array.from({ length: 5 }, () => "unknown");
let activeIndex = 0;
let nextGuessId = 1;
const app = document.querySelector("#app");
if (!app) {
    throw new Error("App root not found.");
}
app.innerHTML = `
  <div class="shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Wordle-Helfer für Deutsch</p>
        <h1>5-Buchstaben-Cheat-Engine</h1>
        <p class="subtitle">Wort eintippen, Status grau/gelb/grün pro Feld festlegen und die am besten passenden Wörter werden vorgeschlagen.</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-label">Bekannte Wörter</span>
          <strong id="loaded-count">0</strong>
      </div>
    </header>

    <section class="panel">
      <div class="panel-head">
        <h2>Wortliste</h2>
        <span class="badge" id="wordlist-badge">Standardliste</span>
      </div>
      <p class="muted" id="wordlist-meta"></p>
      <div class="wordlist-actions">
        <label class="file-button">
          <input id="wordlist-file" type="file" accept=".txt,.json,.dic" />
          Wortliste laden
        </label>
        <button id="restore-defaults" type="button" class="secondary">Standardliste wiederherstellen</button>
      </div>
      <p class="tiny">Akzeptiert JSON, Textdateien und Hunspell-<code>.dic</code>. Es bleiben nur Wörter mit exakt 5 Zeichen aus <code>a-z ä ö ü ß</code>.</p>
    </section>

    <section class="layout">
      <div class="column-main">
        <section class="panel">
          <div class="panel-head">
            <h2>Bereits gesetzte Tipps</h2>
          </div>
          <div id="submitted-rows" class="submitted-rows empty-state">Noch keine Tipps übernommen.</div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Aktuelle Eingabe</h2>
            <span class="tiny">Wiederholte Buchstaben werden wie bei Wordle korrekt behandelt.</span>
          </div>
          <div id="editor-row" class="editor-row"></div>
          <div class="editor-actions">
            <button id="submit-guess" type="button">Tipp übernehmen</button>
            <button id="clear-row" type="button" class="secondary">Zeile leeren</button>
            <button id="undo-last" type="button" class="secondary">Letzten Tipp löschen</button>
            <button id="reset-all" type="button" class="secondary danger">Alles zurücksetzen</button>
          </div>
          <p id="hint" class="hint">Buchstaben per Tastatur oder Mausklick eingeben. Darunter pro Feld den Status auf grau, gelb oder grün setzen.</p>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Tastatur</h2>
            <span class="tiny">Enter übernimmt den Tipp, Backspace löscht.</span>
          </div>
          <div id="keyboard" class="keyboard"></div>
        </section>
      </div>

      <aside class="column-side">
        <section class="panel">
          <div class="panel-head">
            <h2>Beste Vorschläge</h2>
          </div>
          <ol id="suggestions" class="suggestions"></ol>
        </section>

        <section class="panel legend-panel">
          <div class="panel-head">
            <h2>Legende</h2>
          </div>
          <div class="legend-grid">
            <span class="legend-chip state-absent">grau</span>
            <p>Buchstabe kommt in der Lösung nicht vor.</p>
            <span class="legend-chip state-present">gelb</span>
            <p>Buchstabe kommt vor, aber an einer anderen Stelle.</p>
            <span class="legend-chip state-correct">grün</span>
            <p>Buchstabe steht an genau dieser Position.</p>
          </div>
        </section>
      </aside>
    </section>
  </div>
`;
const loadedCountEl = must("#loaded-count");
const wordlistBadgeEl = must("#wordlist-badge");
const wordlistMetaEl = must("#wordlist-meta");
const fileInputEl = must("#wordlist-file");
const restoreDefaultsEl = must("#restore-defaults");
const submittedRowsEl = must("#submitted-rows");
const editorRowEl = must("#editor-row");
const submitGuessEl = must("#submit-guess");
const clearRowEl = must("#clear-row");
const undoLastEl = must("#undo-last");
const resetAllEl = must("#reset-all");
const hintEl = must("#hint");
const keyboardEl = must("#keyboard");
const suggestionsEl = must("#suggestions");
function must(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
    return element;
}
function normalizeLetter(input) {
    const letter = input.toLocaleLowerCase("de-DE");
    return /^[a-zäöüß]$/u.test(letter) ? letter : null;
}
function wordToLetters(word) {
    return Array.from(word);
}
function normalizeWord(raw) {
    const value = raw.trim().toLocaleLowerCase("de-DE");
    return WORD_REGEX.test(value) ? value : null;
}
function uniqueWords(words) {
    const unique = new Set();
    for (const raw of words) {
        const normalized = normalizeWord(raw);
        if (normalized) {
            unique.add(normalized);
        }
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "de"));
}
function extractWordsFromPlainText(text) {
    const words = [];
    for (const line of text.split(/\r?\n/u)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
            continue;
        }
        if (/^\d+$/u.test(trimmed)) {
            continue;
        }
        const token = trimmed.split(/\s+/u)[0] ?? "";
        const cleaned = token.split("/")[0]?.split("\t")[0] ?? "";
        const normalized = normalizeWord(cleaned);
        if (normalized) {
            words.push(normalized);
        }
    }
    return words;
}
function parseImportedWordList(content) {
    const trimmed = content.trim();
    if (!trimmed) {
        return [];
    }
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return uniqueWords(parsed.filter((item) => typeof item === "string"));
            }
            if (parsed &&
                typeof parsed === "object" &&
                "words" in parsed &&
                Array.isArray(parsed.words)) {
                return uniqueWords(parsed.words.filter((item) => typeof item === "string"));
            }
        }
        catch {
        }
    }
    return uniqueWords(extractWordsFromPlainText(content));
}
function saveCustomWordList(words, label) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            words,
            label,
            savedAt: new Date().toISOString(),
        }));
    }
    catch {
    }
}
function loadCustomWordList() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return;
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed.words)) {
            return;
        }
        const cleaned = uniqueWords(parsed.words.filter((item) => typeof item === "string"));
        if (cleaned.length === 0) {
            return;
        }
        activeWordList = cleaned;
        activeWordListLabel = typeof parsed.label === "string" ? parsed.label : "Eigene Wortliste";
        activeWordListNote = CUSTOM_WORD_SOURCE_NOTE;
        customWordListActive = true;
    }
    catch {
    }
}
function clearCustomWordList() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    }
    catch {
    }
}
function cycleFeedback(current) {
    const index = FEEDBACK_ORDER.indexOf(current);
    return FEEDBACK_ORDER[(index + 1) % FEEDBACK_ORDER.length] ?? "unknown";
}
function feedbackRank(state) {
    switch (state) {
        case "correct":
            return 3;
        case "present":
            return 2;
        case "absent":
            return 1;
        default:
            return 0;
    }
}
function scoreGuess(guessLetters, answerLetters) {
    const result = Array.from({ length: 5 }, () => "absent");
    const remaining = new Map();
    for (let index = 0; index < 5; index += 1) {
        if (guessLetters[index] === answerLetters[index]) {
            result[index] = "correct";
        }
        else {
            const answerLetter = answerLetters[index] ?? "";
            remaining.set(answerLetter, (remaining.get(answerLetter) ?? 0) + 1);
        }
    }
    for (let index = 0; index < 5; index += 1) {
        if (result[index] === "correct") {
            continue;
        }
        const guessLetter = guessLetters[index] ?? "";
        const count = remaining.get(guessLetter) ?? 0;
        if (count > 0) {
            result[index] = "present";
            remaining.set(guessLetter, count - 1);
        }
    }
    return result;
}
function arraysEqual(left, right) {
    return left.length === right.length && left.every((item, index) => item === right[index]);
}
function getCandidates() {
    if (submittedGuesses.length === 0) {
        return [...activeWordList];
    }
    return activeWordList.filter((candidate) => {
        const answerLetters = wordToLetters(candidate);
        return submittedGuesses.every((entry) => arraysEqual(scoreGuess(entry.letters, answerLetters), entry.feedback));
    });
}
function rankCandidates(candidates) {
    const uniqueLetterFrequency = new Map();
    const positionFrequency = Array.from({ length: 5 }, () => new Map());
    for (const word of candidates) {
        const letters = wordToLetters(word);
        for (const letter of new Set(letters)) {
            uniqueLetterFrequency.set(letter, (uniqueLetterFrequency.get(letter) ?? 0) + 1);
        }
        letters.forEach((letter, index) => {
            const bucket = positionFrequency[index];
            bucket.set(letter, (bucket.get(letter) ?? 0) + 1);
        });
    }
    const diversityBonus = Math.max(1, Math.round(candidates.length / 40));
    return candidates
        .map((word) => {
        const letters = wordToLetters(word);
        const uniqueLetters = new Set(letters);
        let score = 0;
        uniqueLetters.forEach((letter) => {
            score += uniqueLetterFrequency.get(letter) ?? 0;
        });
        letters.forEach((letter, index) => {
            score += Math.round((positionFrequency[index].get(letter) ?? 0) * 0.35);
        });
        if (uniqueLetters.size === letters.length) {
            score += diversityBonus;
        }
        return { word, score };
    })
        .sort((left, right) => right.score - left.score || left.word.localeCompare(right.word, "de"));
}
function resetDraft() {
    draftLetters = Array.from({ length: 5 }, () => "");
    draftFeedback = Array.from({ length: 5 }, () => "unknown");
    activeIndex = 0;
}
function updateHint(message, tone = "default") {
    hintEl.textContent = message;
    hintEl.dataset.tone = tone;
}
function setLetter(letter) {
    const normalized = normalizeLetter(letter);
    if (!normalized) {
        return;
    }
    draftLetters[activeIndex] = normalized;
    if (draftFeedback[activeIndex] === "unknown") {
        draftFeedback[activeIndex] = "absent";
    }
    if (activeIndex < 4) {
        const nextEmpty = draftLetters.findIndex((entry, index) => index > activeIndex && entry === "");
        activeIndex = nextEmpty === -1 ? Math.min(activeIndex + 1, 4) : nextEmpty;
    }
    updateHint("Buchstabe gesetzt. Status auf grau, gelb oder grün festlegen.");
    render();
}
function backspace() {
    if (draftLetters[activeIndex]) {
        draftLetters[activeIndex] = "";
        draftFeedback[activeIndex] = "unknown";
        render();
        return;
    }
    const filledBefore = [...draftLetters.keys()].reverse().find((index) => index < activeIndex && draftLetters[index]);
    if (filledBefore !== undefined) {
        activeIndex = filledBefore;
        draftLetters[activeIndex] = "";
        draftFeedback[activeIndex] = "unknown";
        render();
    }
}
function setActiveIndex(index) {
    activeIndex = Math.max(0, Math.min(4, index));
    renderEditor();
}
function toggleFeedback(index) {
    if (!draftLetters[index]) {
        updateHint("Erst Buchstaben setzen, dann den Status festlegen.", "warning");
        return;
    }
    draftFeedback[index] = cycleFeedback(draftFeedback[index]);
    render();
}
function removeGuess(id) {
    submittedGuesses = submittedGuesses.filter((entry) => entry.id !== id);
    render();
}
function undoLastGuess() {
    if (submittedGuesses.length === 0) {
        updateHint("Es gibt noch keinen übernommenen Tipp.", "warning");
        return;
    }
    submittedGuesses = submittedGuesses.slice(0, -1);
    updateHint("Letzter Tipp entfernt.", "success");
    render();
}
function canSubmitDraft() {
    return draftLetters.every(Boolean) && draftFeedback.every((state) => state !== "unknown");
}
function submitDraft() {
    if (!draftLetters.every(Boolean)) {
        updateHint("Zuerst alle 5 Buchstaben füllen.", "warning");
        return;
    }
    if (draftFeedback.some((state) => state === "unknown")) {
        updateHint("Für jedes Feld einen Status festlegen.", "warning");
        return;
    }
    const guess = draftLetters.join("");
    submittedGuesses = [
        ...submittedGuesses,
        {
            id: nextGuessId,
            guess,
            letters: [...draftLetters],
            feedback: [...draftFeedback],
        },
    ];
    nextGuessId += 1;
    resetDraft();
    updateHint(`Tipp „${guess}“ übernommen.`, "success");
    render();
}
async function readFileContents(file) {
    const buffer = await file.arrayBuffer();
    const isHunspell = file.name.toLocaleLowerCase("de-DE").endsWith(".dic");
    if (isHunspell) {
        return new TextDecoder("iso-8859-1").decode(buffer);
    }
    const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    if (utf8.includes("�")) {
        return new TextDecoder("iso-8859-1").decode(buffer);
    }
    return utf8;
}
async function importWordList(file) {
    const content = await readFileContents(file);
    const cleaned = parseImportedWordList(content);
    if (cleaned.length === 0) {
        updateHint("In der Datei wurde keine gültige 5-Letter-Word-Liste gefunden.", "warning");
        return;
    }
    activeWordList = cleaned;
    activeWordListLabel = `${file.name} (${cleaned.length} Wörter)`;
    activeWordListNote = CUSTOM_WORD_SOURCE_NOTE;
    customWordListActive = true;
    submittedGuesses = [];
    resetDraft();
    saveCustomWordList(cleaned, activeWordListLabel);
    updateHint(`Custom Wortliste geladen: ${cleaned.length} Wörter.`, "success");
    render();
}
function restoreDefaults() {
    activeWordList = [...DEFAULT_WORDS];
    activeWordListLabel = DEFAULT_WORD_SOURCE_NAME;
    activeWordListNote = DEFAULT_WORD_SOURCE_NOTE;
    customWordListActive = false;
    submittedGuesses = [];
    resetDraft();
    clearCustomWordList();
    updateHint("Standardliste wiederhergestellt.", "success");
    render();
}
function getKeyboardStates() {
    const states = new Map();
    for (const entry of submittedGuesses) {
        entry.letters.forEach((letter, index) => {
            const nextState = entry.feedback[index] ?? "unknown";
            const currentState = states.get(letter) ?? "unknown";
            if (feedbackRank(nextState) > feedbackRank(currentState)) {
                states.set(letter, nextState);
            }
        });
    }
    return states;
}
function renderSubmittedRows() {
    if (submittedGuesses.length === 0) {
        submittedRowsEl.className = "submitted-rows empty-state";
        submittedRowsEl.innerHTML = "Noch keine Tipps übernommen.";
        return;
    }
    submittedRowsEl.className = "submitted-rows";
    submittedRowsEl.innerHTML = submittedGuesses
        .map((entry) => `
        <div class="submitted-row" data-id="${entry.id}">
          <div class="submitted-tiles">
            ${entry.letters
        .map((letter, index) => `
                  <div class="tile tile-static state-${entry.feedback[index]}">
                    ${letter}
                  </div>`)
        .join("")}
          </div>
          <button type="button" class="icon-button remove-guess" data-remove-id="${entry.id}" aria-label="Tipp löschen">×</button>
        </div>
      `)
        .join("");
}
function renderEditor() {
    editorRowEl.innerHTML = draftLetters
        .map((letter, index) => {
        const feedback = draftFeedback[index];
        const tileClasses = ["tile", "tile-editable"];
        if (index === activeIndex)
            tileClasses.push("active");
        if (letter)
            tileClasses.push("filled");
        return `
        <div class="editor-cell">
          <button type="button" class="${tileClasses.join(" ")}" data-tile-index="${index}" aria-label="Feld ${index + 1}">
            ${letter || ""}
          </button>
          <button type="button" class="feedback-toggle state-${feedback}" data-feedback-index="${index}">
            ${FEEDBACK_LABELS[feedback]}
          </button>
        </div>
      `;
    })
        .join("");
    submitGuessEl.disabled = !canSubmitDraft();
    undoLastEl.disabled = submittedGuesses.length === 0;
}
function renderKeyboard() {
    const keyboardStates = getKeyboardStates();
    keyboardEl.innerHTML = KEYBOARD_ROWS.map((row) => {
        const keys = row
            .map((letter) => {
            const state = keyboardStates.get(letter) ?? "unknown";
            const isInDraft = draftLetters.includes(letter);
            const classes = ["key", `state-${state}`];
            if (isInDraft)
                classes.push("in-draft");
            return `<button type="button" class="${classes.join(" ")}" data-key="${letter}">${letter}</button>`;
        })
            .join("");
        return `<div class="key-row">${keys}</div>`;
    }).join("") + `
    <div class="key-row key-row-actions">
      <button type="button" class="key wide secondary" data-command="left">←</button>
      <button type="button" class="key wide secondary" data-command="backspace">⌫</button>
      <button type="button" class="key wide secondary" data-command="enter">Enter</button>
    </div>
  `;
}
function renderResults() {
    const candidates = getCandidates();
    const ranked = rankCandidates(candidates);
    loadedCountEl.textContent = String(activeWordList.length);
    wordlistBadgeEl.textContent = customWordListActive ? "Eigene Liste" : "Standardliste";
    wordlistMetaEl.textContent = `${activeWordListLabel}. ${activeWordListNote}`;
    suggestionsEl.innerHTML = ranked
        .slice(0, 20)
        .map((entry) => `<li><span>${entry.word}</span><strong>${entry.score}</strong></li>`)
        .join("");
    if (ranked.length === 0) {
        suggestionsEl.innerHTML = `<li class="empty-list">Keine Treffer. Entferne einen Tipp oder prüfe die gesetzten Farben.</li>`;
    }
}
function render() {
    renderSubmittedRows();
    renderEditor();
    renderKeyboard();
    renderResults();
}
fileInputEl.addEventListener("change", async (event) => {
    const target = event.currentTarget;
    const [file] = Array.from(target.files ?? []);
    if (!file) {
        return;
    }
    await importWordList(file);
    target.value = "";
});
restoreDefaultsEl.addEventListener("click", restoreDefaults);
submitGuessEl.addEventListener("click", submitDraft);
clearRowEl.addEventListener("click", () => {
    resetDraft();
    updateHint("Aktuelle Zeile geleert.", "success");
    render();
});
undoLastEl.addEventListener("click", undoLastGuess);
resetAllEl.addEventListener("click", () => {
    submittedGuesses = [];
    resetDraft();
    updateHint("Alle gesetzten Tipps wurden entfernt.", "success");
    render();
});
editorRowEl.addEventListener("click", (event) => {
    const target = event.target;
    const tileButton = target.closest("[data-tile-index]");
    if (tileButton) {
        setActiveIndex(Number(tileButton.dataset.tileIndex));
        return;
    }
    const feedbackButton = target.closest("[data-feedback-index]");
    if (feedbackButton) {
        toggleFeedback(Number(feedbackButton.dataset.feedbackIndex));
    }
});
submittedRowsEl.addEventListener("click", (event) => {
    const target = event.target;
    const removeButton = target.closest("[data-remove-id]");
    if (!removeButton) {
        return;
    }
    removeGuess(Number(removeButton.dataset.removeId));
});
keyboardEl.addEventListener("click", (event) => {
    const target = event.target;
    const keyButton = target.closest("[data-key]");
    if (keyButton) {
        const letter = keyButton.dataset.key;
        if (letter) {
            setLetter(letter);
        }
        return;
    }
    const commandButton = target.closest("[data-command]");
    const command = commandButton?.dataset.command;
    if (!command) {
        return;
    }
    if (command === "backspace") {
        backspace();
    }
    else if (command === "enter") {
        submitDraft();
    }
    else if (command === "left") {
        setActiveIndex(activeIndex === 0 ? 4 : activeIndex - 1);
    }
    render();
});
document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
    }
    const target = event.target;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
    }
    if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
        render();
        return;
    }
    if (event.key === "Enter") {
        event.preventDefault();
        submitDraft();
        return;
    }
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex(activeIndex === 0 ? 4 : activeIndex - 1);
        return;
    }
    if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex(activeIndex === 4 ? 0 : activeIndex + 1);
        return;
    }
    if (event.key === "1" && draftLetters[activeIndex]) {
        draftFeedback[activeIndex] = "absent";
        render();
        return;
    }
    if (event.key === "2" && draftLetters[activeIndex]) {
        draftFeedback[activeIndex] = "present";
        render();
        return;
    }
    if (event.key === "3" && draftLetters[activeIndex]) {
        draftFeedback[activeIndex] = "correct";
        render();
        return;
    }
    const letter = normalizeLetter(event.key);
    if (letter) {
        event.preventDefault();
        setLetter(letter);
    }
});
loadCustomWordList();
updateHint("Standardliste geladen. Du kannst sofort loslegen oder eine eigene Liste importieren.");
render();

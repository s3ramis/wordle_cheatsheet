
type FeedbackState = "unknown" | "absent" | "present" | "correct";
type MessageTone = "default" | "warning" | "success";
interface SubmittedGuess {
  id: number;
  guess: string;
  letters: string[];
  feedback: FeedbackState[];
}

interface RankedCandidate {
  word: string;
  score: number;
}

const STORAGE_KEY = "wordle-cheat-de.custom-wordlist.v1";
const WORD_REGEX = /^[a-zäöüß]{5}$/u;
const FEEDBACK_LABELS: Record<FeedbackState, string> = {
  unknown: "open",
  absent: "grey",
  present: "orange",
  correct: "green",
};
const FEEDBACK_ORDER: FeedbackState[] = ["unknown", "absent", "present", "correct"];
const KEYBOARD_ROWS = [
  ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä"],
  ["y", "x", "c", "v", "b", "n", "m", "ß"],
];

let activeWordList: string[] = [...DEFAULT_WORDS];
let activeWordListLabel = DEFAULT_WORD_SOURCE_NAME;
let activeWordListNote = DEFAULT_WORD_SOURCE_NOTE;
let customWordListActive = false;
let submittedGuesses: SubmittedGuess[] = [];
let draftLetters: string[] = Array.from({ length: 5 }, () => "");
let draftFeedback: FeedbackState[] = Array.from({ length: 5 }, () => "unknown");
let activeIndex = 0;
let nextGuessId = 1;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("app root not found.");
}

app.innerHTML = `
  <div class="shell">
    <header class="hero">
      <div>
        <p class="eyebrow">wordle cheatsheet</p>
        <h1>5-letter-word-cheat-engine</h1>
        <p class="subtitle">input word, set status gray/orange/green for each field and get the best matching words for the wordle logic.</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-label">known words</span>
          <strong id="loaded-count">0</strong>
      </div>
    </header>

    <section class="panel">
      <div class="panel-head">
        <h2>wordlist</h2>
        <span class="badge" id="wordlist-badge">default list (german)</span>
      </div>
      <p class="muted" id="wordlist-meta"></p>
      <div class="wordlist-actions">
        <label class="file-button">
          <input id="wordlist-file" type="file" accept=".txt,.json,.dic" />
          load custom wordlist
        </label>
        <button id="restore-defaults" type="button" class="secondary">reset to default list</button>
      </div>
      <p class="tiny">accepts .json, .txt and hunspell-<code>.dic</code>. only 5-letter-words are used for the cheat engine incl. <code>a-z ä ö ü ß</code>.</p>
    </section>

    <section class="layout">
      <div class="column-main">
        <section class="panel">
          <div class="panel-head">
            <h2>attempt history</h2>
          </div>
          <div id="submitted-rows" class="submitted-rows empty-state">no attempts have been made yet.</div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>current attempt</h2>
            <span class="tiny">duplicate letters are handled the wordle way.</span>
          </div>
          <div id="editor-row" class="editor-row"></div>
          <div class="editor-actions">
            <button id="submit-guess" type="button">make attempt</button>
            <button id="clear-row" type="button" class="secondary">clear line</button>
            <button id="undo-last" type="button" class="secondary">clear last attempt</button>
            <button id="reset-all" type="button" class="secondary danger">clear all attempts</button>
          </div>
          <p id="hint" class="hint">input letters using the physical or on-screen keyboard. set field status to orange, green or gray.</p>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Tastatur</h2>
            <span class="tiny">return makes the attempt, backspace clears the last letter.</span>
          </div>
          <div id="keyboard" class="keyboard"></div>
        </section>
      </div>

      <aside class="column-side">
        <section class="panel">
          <div class="panel-head">
            <h2>matching words</h2>
          </div>
          <ol id="suggestions" class="suggestions"></ol>
        </section>

        <section class="panel legend-panel">
          <div class="panel-head">
            <h2>legend</h2>
          </div>
          <div class="legend-grid">
            <span class="legend-chip state-absent">gray</span>
            <p>word doesnt contain the letter.</p>
            <span class="legend-chip state-present">orange</span>
            <p>word does contain the letter, but not at this position.</p>
            <span class="legend-chip state-correct">green</span>
            <p>word does contain the letter at this exact position.</p>
          </div>
        </section>
      </aside>
    </section>
  </div>
`;

const loadedCountEl = must<HTMLSpanElement>("#loaded-count");
const wordlistBadgeEl = must<HTMLSpanElement>("#wordlist-badge");
const wordlistMetaEl = must<HTMLParagraphElement>("#wordlist-meta");
const fileInputEl = must<HTMLInputElement>("#wordlist-file");
const restoreDefaultsEl = must<HTMLButtonElement>("#restore-defaults");
const submittedRowsEl = must<HTMLDivElement>("#submitted-rows");
const editorRowEl = must<HTMLDivElement>("#editor-row");
const submitGuessEl = must<HTMLButtonElement>("#submit-guess");
const clearRowEl = must<HTMLButtonElement>("#clear-row");
const undoLastEl = must<HTMLButtonElement>("#undo-last");
const resetAllEl = must<HTMLButtonElement>("#reset-all");
const hintEl = must<HTMLParagraphElement>("#hint");
const keyboardEl = must<HTMLDivElement>("#keyboard");
const suggestionsEl = must<HTMLOListElement>("#suggestions");

function must<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`element not found: ${selector}`);
  }
  return element;
}

function normalizeLetter(input: string): string | null {
  const letter = input.toLocaleLowerCase("de-DE");
  return /^[a-zäöüß]$/u.test(letter) ? letter : null;
}

function wordToLetters(word: string): string[] {
  return Array.from(word);
}

function normalizeWord(raw: string): string | null {
  const value = raw.trim().toLocaleLowerCase("de-DE");
  return WORD_REGEX.test(value) ? value : null;
}

function uniqueWords(words: string[]): string[] {
  const unique = new Set<string>();
  for (const raw of words) {
    const normalized = normalizeWord(raw);
    if (normalized) {
      unique.add(normalized);
    }
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b, "de"));
}

function extractWordsFromPlainText(text: string): string[] {
  const words: string[] = [];
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

function parseImportedWordList(content: string): string[] {
  const trimmed = content.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return uniqueWords(parsed.filter((item): item is string => typeof item === "string"));
      }
      if (
        parsed &&
        typeof parsed === "object" &&
        "words" in parsed &&
        Array.isArray((parsed as { words: unknown[] }).words)
      ) {
        return uniqueWords(
          (parsed as { words: unknown[] }).words.filter((item): item is string => typeof item === "string"),
        );
      }
    } catch {
    }
  }

  return uniqueWords(extractWordsFromPlainText(content));
}

function saveCustomWordList(words: string[], label: string): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        words,
        label,
        savedAt: new Date().toISOString(),
      }),
    );
  } catch {
  }
}

function loadCustomWordList(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw) as { words?: unknown; label?: unknown };
    if (!Array.isArray(parsed.words)) {
      return;
    }
    const cleaned = uniqueWords(parsed.words.filter((item): item is string => typeof item === "string"));
    if (cleaned.length === 0) {
      return;
    }
    activeWordList = cleaned;
    activeWordListLabel = typeof parsed.label === "string" ? parsed.label : "custom wordlist";
    activeWordListNote = CUSTOM_WORD_SOURCE_NOTE;
    customWordListActive = true;
  } catch {
  }
}

function clearCustomWordList(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}

function cycleFeedback(current: FeedbackState): FeedbackState {
  const index = FEEDBACK_ORDER.indexOf(current);
  return FEEDBACK_ORDER[(index + 1) % FEEDBACK_ORDER.length] ?? "unknown";
}

function feedbackRank(state: FeedbackState): number {
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

function scoreGuess(guessLetters: string[], answerLetters: string[]): FeedbackState[] {
  const result: FeedbackState[] = Array.from({ length: 5 }, () => "absent");
  const remaining = new Map<string, number>();

  for (let index = 0; index < 5; index += 1) {
    if (guessLetters[index] === answerLetters[index]) {
      result[index] = "correct";
    } else {
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

function arraysEqual<T>(left: T[], right: T[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function getCandidates(): string[] {
  if (submittedGuesses.length === 0) {
    return [...activeWordList];
  }
  return activeWordList.filter((candidate) => {
    const answerLetters = wordToLetters(candidate);
    return submittedGuesses.every((entry) => arraysEqual(scoreGuess(entry.letters, answerLetters), entry.feedback));
  });
}

function rankCandidates(candidates: string[]): RankedCandidate[] {
  const uniqueLetterFrequency = new Map<string, number>();
  const positionFrequency = Array.from({ length: 5 }, () => new Map<string, number>());

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

function resetDraft(): void {
  draftLetters = Array.from({ length: 5 }, () => "");
  draftFeedback = Array.from({ length: 5 }, () => "unknown");
  activeIndex = 0;
}

function updateHint(message: string, tone: MessageTone = "default"): void {
  hintEl.textContent = message;
  hintEl.dataset.tone = tone;
}

function setLetter(letter: string): void {
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
  updateHint("attempt added. set status to gray, orange or green.");
  render();
}

function backspace(): void {
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

function setActiveIndex(index: number): void {
  activeIndex = Math.max(0, Math.min(4, index));
  renderEditor();
}

function toggleFeedback(index: number): void {
  if (!draftLetters[index]) {
    updateHint("first add the letters, then set the status.", "warning");
    return;
  }
  draftFeedback[index] = cycleFeedback(draftFeedback[index]);
  render();
}

function removeGuess(id: number): void {
  submittedGuesses = submittedGuesses.filter((entry) => entry.id !== id);
  render();
}

function undoLastGuess(): void {
  if (submittedGuesses.length === 0) {
    updateHint("no attempts made yet", "warning");
    return;
  }
  submittedGuesses = submittedGuesses.slice(0, -1);
  updateHint("removed last attempt", "success");
  render();
}

function canSubmitDraft(): boolean {
  return draftLetters.every(Boolean) && draftFeedback.every((state) => state !== "unknown");
}

function submitDraft(): void {
  if (!draftLetters.every(Boolean)) {
    updateHint("first add all 5 letters.", "warning");
    return;
  }
  if (draftFeedback.some((state) => state === "unknown")) {
    updateHint("set a status for every field.", "warning");
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
  updateHint(`attempt „${guess}“ made.`, "success");
  render();
}

async function readFileContents(file: File): Promise<string> {
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

async function importWordList(file: File): Promise<void> {
  const content = await readFileContents(file);
  const cleaned = parseImportedWordList(content);
  if (cleaned.length === 0) {
    updateHint("no valid 5-letter-word list found in the file.", "warning");
    return;
  }
  activeWordList = cleaned;
  activeWordListLabel = `${file.name} (${cleaned.length} words)`;
  activeWordListNote = CUSTOM_WORD_SOURCE_NOTE;
  customWordListActive = true;
  submittedGuesses = [];
  resetDraft();
  saveCustomWordList(cleaned, activeWordListLabel);
  updateHint(`custom wordlist loaded: ${cleaned.length} words.`, "success");
  render();
}

function restoreDefaults(): void {
  activeWordList = [...DEFAULT_WORDS];
  activeWordListLabel = DEFAULT_WORD_SOURCE_NAME;
  activeWordListNote = DEFAULT_WORD_SOURCE_NOTE;
  customWordListActive = false;
  submittedGuesses = [];
  resetDraft();
  clearCustomWordList();
  updateHint("reset to default wordlist.", "success");
  render();
}

function getKeyboardStates(): Map<string, FeedbackState> {
  const states = new Map<string, FeedbackState>();
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

function renderSubmittedRows(): void {
  if (submittedGuesses.length === 0) {
    submittedRowsEl.className = "submitted-rows empty-state";
    submittedRowsEl.innerHTML = "no attempts made yet.";
    return;
  }

  submittedRowsEl.className = "submitted-rows";
  submittedRowsEl.innerHTML = submittedGuesses
    .map(
      (entry) => `
        <div class="submitted-row" data-id="${entry.id}">
          <div class="submitted-tiles">
            ${entry.letters
              .map(
                (letter, index) => `
                  <div class="tile tile-static state-${entry.feedback[index]}">
                    ${letter}
                  </div>`,
              )
              .join("")}
          </div>
          <button type="button" class="icon-button remove-guess" data-remove-id="${entry.id}" aria-label="remove attempt">×</button>
        </div>
      `,
    )
    .join("");
}

function renderEditor(): void {
  editorRowEl.innerHTML = draftLetters
    .map((letter, index) => {
      const feedback = draftFeedback[index];
      const tileClasses = ["tile", "tile-editable"];
      if (index === activeIndex) tileClasses.push("active");
      if (letter) tileClasses.push("filled");
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

function renderKeyboard(): void {
  const keyboardStates = getKeyboardStates();
  keyboardEl.innerHTML = KEYBOARD_ROWS.map((row) => {
    const keys = row
      .map((letter) => {
        const state = keyboardStates.get(letter) ?? "unknown";
        const isInDraft = draftLetters.includes(letter);
        const classes = ["key", `state-${state}`];
        if (isInDraft) classes.push("in-draft");
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

function renderResults(): void {
  const candidates = getCandidates();
  const ranked = rankCandidates(candidates);
  loadedCountEl.textContent = String(activeWordList.length);
  wordlistBadgeEl.textContent = customWordListActive ? "custom wordlistlist" : "default wordlist";
  wordlistMetaEl.textContent = `${activeWordListLabel}. ${activeWordListNote}`;

  suggestionsEl.innerHTML = ranked
    .slice(0, 20)
    .map((entry) => `<li><span>${entry.word}</span><strong>${entry.score}</strong></li>`)
    .join("");
  if (ranked.length === 0) {
    suggestionsEl.innerHTML = `<li class="empty-list">no gits. reenter the attempt correctly or check if the colors have been set correctly.</li>`;
  }
}

function render(): void {
  renderSubmittedRows();
  renderEditor();
  renderKeyboard();
  renderResults();
}

fileInputEl.addEventListener("change", async (event) => {
  const target = event.currentTarget as HTMLInputElement;
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
  updateHint("cleared current line.", "success");
  render();
});
undoLastEl.addEventListener("click", undoLastGuess);
resetAllEl.addEventListener("click", () => {
  submittedGuesses = [];
  resetDraft();
  updateHint("all attempts cleared.", "success");
  render();
});

editorRowEl.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const tileButton = target.closest<HTMLButtonElement>("[data-tile-index]");
  if (tileButton) {
    setActiveIndex(Number(tileButton.dataset.tileIndex));
    return;
  }
  const feedbackButton = target.closest<HTMLButtonElement>("[data-feedback-index]");
  if (feedbackButton) {
    toggleFeedback(Number(feedbackButton.dataset.feedbackIndex));
  }
});

submittedRowsEl.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const removeButton = target.closest<HTMLButtonElement>("[data-remove-id]");
  if (!removeButton) {
    return;
  }
  removeGuess(Number(removeButton.dataset.removeId));
});

keyboardEl.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const keyButton = target.closest<HTMLButtonElement>("[data-key]");
  if (keyButton) {
    const letter = keyButton.dataset.key;
    if (letter) {
      setLetter(letter);
    }
    return;
  }
  const commandButton = target.closest<HTMLButtonElement>("[data-command]");
  const command = commandButton?.dataset.command;
  if (!command) {
    return;
  }
  if (command === "backspace") {
    backspace();
  } else if (command === "enter") {
    submitDraft();
  } else if (command === "left") {
    setActiveIndex(activeIndex === 0 ? 4 : activeIndex - 1);
  }
  render();
});

document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }
  const target = event.target as HTMLElement | null;
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
updateHint("default wordlist loaded. begin inputting attempts or import a custom wordlist.");
render();

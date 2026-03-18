#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error("Verwendung: node scripts/extract-hunspell-5.mjs <input.dic> <output.txt|output.json>");
  process.exit(1);
}

const buffer = fs.readFileSync(inputPath);
const text = new TextDecoder("latin1").decode(buffer);
const words = [];
const seen = new Set();
const lines = text.split(/\r?\n/u);
for (let index = 0; index < lines.length; index += 1) {
  if (index === 0) continue;
  const line = lines[index]?.trim();
  if (!line || line.startsWith("#") || /^\d+$/u.test(line)) continue;
  const base = (line.split("/")[0]?.split("\t")[0] ?? "").trim().toLocaleLowerCase("de-DE");
  if (/^[a-zäöüß]{5}$/u.test(base) && !seen.has(base)) {
    seen.add(base);
    words.push(base);
  }
}
words.sort((a, b) => a.localeCompare(b, "de"));

const outExt = path.extname(outputPath).toLowerCase();
const payload = outExt === ".json" ? JSON.stringify(words, null, 2) + "\n" : words.join("\n") + "\n";
fs.writeFileSync(outputPath, payload, "utf8");
console.error(`Geschrieben: ${words.length} Wörter -> ${outputPath}`);

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error("usage: node scripts/filter-5-letters.mjs <input.txt|input.json> <output.txt|output.json>");
  process.exit(1);
}

const text = fs.readFileSync(inputPath, "utf8");
let rawWords = [];
const trimmed = text.trim();
if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
  const parsed = JSON.parse(trimmed);
  if (Array.isArray(parsed)) {
    rawWords = parsed;
  } else if (parsed && Array.isArray(parsed.words)) {
    rawWords = parsed.words;
  }
}
if (rawWords.length === 0) {
  rawWords = text.split(/\r?\n/u).map((line) => line.trim());
}

const seen = new Set();
const words = [];
for (const item of rawWords) {
  if (typeof item !== "string") continue;
  const word = item.split("/")[0]?.split("\t")[0]?.trim().toLocaleLowerCase("de-DE") ?? "";
  if (/^[a-zäöüß]{5}$/u.test(word) && !seen.has(word)) {
    seen.add(word);
    words.push(word);
  }
}
words.sort((a, b) => a.localeCompare(b, "de"));

const outExt = path.extname(outputPath).toLowerCase();
const payload = outExt === ".json" ? JSON.stringify(words, null, 2) + "\n" : words.join("\n") + "\n";
fs.writeFileSync(outputPath, payload, "utf8");
console.error(`written: ${words.length} words -> ${outputPath}`);

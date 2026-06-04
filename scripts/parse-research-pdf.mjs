/**
 * Parses KRI publication export (pdfplumber spaced text) into research-items.json.
 * Source: scripts/research-pdf-extract-spaced.txt (from 연구논문제목한글파일.hwp.pdf)
 * Run: node scripts/parse-research-pdf.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pdfTextPath =
  process.env.RESEARCH_PDF_TEXT ??
  join(__dirname, "research-pdf-extract-spaced.txt");

const raw = readFileSync(pdfTextPath, "utf8");
const blocks = raw.split(/(?=^학술지구분 )/m).filter(Boolean);

const META_PREFIX =
  /^(학술지구분|논문제목|게재년월|게제년월|학술지명|발행처|연구|ISSN|관련|참여자|검증|승인|\d+\s)/;

function hasHangul(s) {
  return /[\uAC00-\uD7A3]/.test(s);
}

function parseAuthors(participant) {
  if (!participant) return undefined;
  if (participant.includes("천진호공동")) {
    const extra = participant
      .replace(/천진호공동\([^)]+\)/, "")
      .replace(/^,/, "")
      .trim();
    return extra ? `천진호, ${extra.replace(/,/g, ", ")}` : "천진호";
  }
  if (participant.startsWith("천진호")) return "천진호";
  return participant;
}

function extractTitle(lines) {
  const titleParts = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("논문제목(원어)")) {
      const rest = line.slice("논문제목(원어)".length).trim();
      if (rest) titleParts.push(rest);
      i++;
      while (i < lines.length) {
        const next = lines[i];
        if (
          next.startsWith("논문제목(타언어)") ||
          next.startsWith("게재년월") ||
          next.startsWith("게제년월")
        ) {
          break;
        }
        if (
          !META_PREFIX.test(next) &&
          hasHangul(next) &&
          !/^[A-Za-z]/.test(next)
        ) {
          titleParts.push(next.trim());
        } else {
          break;
        }
        i++;
      }
      break;
    }
    if (
      line.startsWith("학술지구분") ||
      line.startsWith("논문제목(타언어)") ||
      line.startsWith("게재") ||
      line.startsWith("게제") ||
      line.startsWith("학술지명") ||
      line.startsWith("발행처")
    ) {
      i++;
      continue;
    }
    if (!META_PREFIX.test(line) && hasHangul(line) && !/^[A-Za-z]/.test(line)) {
      titleParts.push(line.trim());
    }
    i++;
    if (i < lines.length && lines[i].startsWith("논문제목(원어)")) {
      continue;
    }
    if (titleParts.length && lines[i]?.startsWith("논문제목(타언어)")) break;
    if (titleParts.length && (lines[i]?.startsWith("게재") || lines[i]?.startsWith("게제")))
      break;
  }

  return titleParts.join(" ").replace(/\s+/g, " ").trim();
}

function extractNumber(text, lines) {
  const prefixed = text.match(/^(\d{1,2})\s+발행처/m);
  if (prefixed) return Number(prefixed[1]);

  for (const line of lines) {
    const m = line.match(/^(\d{1,2})$/);
    if (m) {
      const n = Number(m[1]);
      if (n >= 1 && n <= 83) return n;
    }
  }
  return null;
}

const results = [];

for (const block of blocks) {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const number = extractNumber(block, lines);
  if (!number) continue;

  const title = extractTitle(lines);
  if (!title) continue;

  const dateLine = lines.find(
    (l) => l.startsWith("게재년월") || l.startsWith("게제년월"),
  );
  const dateMatch = dateLine?.match(/(\d{4})\.(\d{1,2})/);
  const volMatch = dateLine?.match(/(?:게재|게제)권\/집\(호\)\s*(.+?)\s*페이지/);
  const pagesMatch = dateLine?.match(/페이지\s*(.+)$/);

  const journalLine = lines.find((l) => l.startsWith("학술지명"));
  const journal = journalLine?.replace(/^학술지명\s*/, "").trim();

  let publisher;
  const pubLine = lines.find((l) => l.startsWith("발행처"));
  if (pubLine) {
    publisher = pubLine.replace(/^발행처\s*/, "").trim();
  }
  const pubWithNum = lines.find((l) => /^\d{1,2}\s+발행처/.test(l));
  if (pubWithNum) {
    publisher = pubWithNum.replace(/^\d{1,2}\s+발행처\s*/, "").trim();
  }

  const fieldLine = lines.find((l) => l.startsWith("연구"));
  const fieldMatch = fieldLine?.match(
    /연구\s*학문분야\s+(\S+?)(?:\s+발행국가|\s+논문언어|$)/,
  );
  const rawField = fieldMatch?.[1];
  const field =
    rawField && rawField !== "발행국가" && !rawField.includes("논문")
      ? rawField
      : undefined;

  const participantLine = lines.find((l) => l.startsWith("참여자"));
  const participant = participantLine?.replace(/^참여자\s*/, "").trim();

  results.push({
    number,
    title,
    ...(dateMatch
      ? { year: Number(dateMatch[1]), month: Number(dateMatch[2]) }
      : {}),
    ...(journal ? { journal } : {}),
    ...(publisher ? { publisher } : {}),
    ...(volMatch ? { volume: volMatch[1].trim() } : {}),
    ...(pagesMatch ? { pages: pagesMatch[1].trim() } : {}),
    ...(field ? { field } : {}),
    ...(participant ? { authors: parseAuthors(participant) } : {}),
  });
}

results.sort((a, b) => a.number - b.number);

const outPath = join(__dirname, "../src/data/research-items.json");
writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");
console.log(`Parsed ${results.length} publications -> ${outPath}`);

if (results.length !== 83) {
  const nums = new Set(results.map((b) => b.number));
  const missing = [];
  for (let n = 1; n <= 83; n++) {
    if (!nums.has(n)) missing.push(n);
  }
  console.error("Missing numbers:", missing.join(", "));
  const dupes = results
    .map((b) => b.number)
    .filter((n, i, a) => a.indexOf(n) !== i);
  if (dupes.length) console.error("Duplicate numbers:", [...new Set(dupes)]);
  process.exit(1);
}

const sample = results.find((r) => r.number === 1);
console.log("Sample #1 title:", sample?.title);

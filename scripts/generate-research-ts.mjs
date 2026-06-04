/**
 * Generates src/data/research.ts from research-items.json.
 * Run: node scripts/generate-research-ts.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const items = JSON.parse(
  readFileSync(join(__dirname, "../src/data/research-items.json"), "utf8"),
);

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function itemToTs(item) {
  const parts = [
    `    number: ${item.number},`,
    `    title: "${esc(item.title)}",`,
  ];
  if (item.year !== undefined) parts.push(`    year: ${item.year},`);
  if (item.month !== undefined) parts.push(`    month: ${item.month},`);
  if (item.journal) parts.push(`    journal: "${esc(item.journal)}",`);
  if (item.publisher) parts.push(`    publisher: "${esc(item.publisher)}",`);
  if (item.volume) parts.push(`    volume: "${esc(item.volume)}",`);
  if (item.pages) parts.push(`    pages: "${esc(item.pages)}",`);
  if (item.field) parts.push(`    field: "${esc(item.field)}",`);
  const fieldArg = item.field ? `"${esc(item.field)}"` : "undefined";
  const titleArg = `"${esc(item.title)}"`;
  parts.push(
    `    category: resolveResearchCategory(${fieldArg}, ${titleArg}),`,
  );
  if (item.authors) parts.push(`    authors: "${esc(item.authors)}",`);
  return `  {\n${parts.join("\n")}\n  }`;
}

const header = `import { applyResearchFlags, resolveResearchCategory } from "@/src/lib/research";
import type { ResearchItem } from "@/src/types/research";

export const representativePaperNumbers = [
  1, 2, 6, 9, 12, 23, 57, 59,
] as const;

export const importantPaperNumbers = [
  1, 2, 3, 5, 6, 8, 9, 12, 13, 14,
  16, 17, 18, 23, 28, 29, 31, 34,
  36, 40, 41, 47, 48, 54, 57, 59,
  61, 62, 63, 67, 70, 73,
] as const;

/** Full publication archive from the professor's KRI export (83 papers). */
const researchItemSamples: ResearchItem[] = [
`;

const footer = `];

export const researchItems: ResearchItem[] = applyResearchFlags(
  researchItemSamples,
  {
    representativeNumbers: representativePaperNumbers,
    importantNumbers: importantPaperNumbers,
  },
);
`;

const body = items.map(itemToTs).join(",\n");
const out = join(__dirname, "../src/data/research.ts");
writeFileSync(out, header + body + footer, "utf8");
console.log(`Wrote ${items.length} items -> ${out}`);

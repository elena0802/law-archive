import { toPng } from "html-to-image";

export type ScholarDnaShareCardData = {
  name: string;
  scholarAlias: string;
  aiOneLiner: string;
  keywords: string[];
  scholarDna: Array<{ label: string; percentage: number }>;
};

const CARD_EXPORT_PIXEL_RATIO = 2;
const CARD_BACKGROUND = "#f8f4ea";

export function getShareCardKeywords(keywords: string[]) {
  return keywords.slice(0, 5);
}

export function getShareCardInterestLabels(
  interests: ScholarDnaShareCardData["scholarDna"],
  count = 4,
) {
  return [...interests]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, count)
    .map((item) => item.label);
}

function sanitizeFilename(name: string) {
  return name.replace(/[^\p{L}\p{N}\-_]+/gu, "-").replace(/-+/g, "-") || "scholar";
}

export async function downloadScholarDnaShareCard(
  node: HTMLElement,
  scholarName: string,
) {
  await document.fonts.ready;

  const dataUrl = await toPng(node, {
    pixelRatio: CARD_EXPORT_PIXEL_RATIO,
    cacheBust: true,
    backgroundColor: CARD_BACKGROUND,
  });

  const link = document.createElement("a");
  link.download = `scholar-dna-${sanitizeFilename(scholarName)}.png`;
  link.href = dataUrl;
  link.click();
}

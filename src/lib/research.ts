import type { ResearchCategory, ResearchItem } from "@/src/types/research";
import { researchCategoryMeta } from "@/src/types/research";

/** Display labels for the research archive UI (PR46.5-B). */
export const researchCategoryUiLabels: Record<ResearchCategory, string> = {
  "criminal-law-theory": "형법이론",
  "criminal-procedure": "형사소송법",
  "evidence-law": "증거법",
  "criminal-policy": "형사정책",
  "international-criminal-law": "국제형사법",
  "legal-education": "법학교육",
  other: "기타",
};

const categoryOrder: ResearchCategory[] = [
  "criminal-law-theory",
  "criminal-procedure",
  "evidence-law",
  "criminal-policy",
  "international-criminal-law",
  "legal-education",
  "other",
];

export type ResearchSummaryStats = {
  totalPublications: number;
  representativeCount: number;
  importantCount: number;
  areaCount: number;
};

export function getResearchSummaryStats(
  items: readonly ResearchItem[],
): ResearchSummaryStats {
  const categories = new Set(items.map((item) => item.category));

  return {
    totalPublications: items.length,
    representativeCount: items.filter((item) => item.isRepresentative).length,
    importantCount: items.filter((item) => item.isImportant).length,
    areaCount: categories.size,
  };
}

export function getResearchAreaCounts(
  items: readonly ResearchItem[],
): { category: ResearchCategory; label: string; count: number }[] {
  const counts = new Map<ResearchCategory, number>();

  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }

  return categoryOrder
    .filter((category) => counts.has(category))
    .map((category) => ({
      category,
      label: researchCategoryUiLabels[category],
      count: counts.get(category) ?? 0,
    }));
}

export function groupResearchByYear(
  items: readonly ResearchItem[],
): { year: number; items: ResearchItem[] }[] {
  const order: number[] = [];
  const byYear = new Map<number, ResearchItem[]>();

  for (const item of items) {
    if (item.year === undefined) {
      continue;
    }

    if (!byYear.has(item.year)) {
      byYear.set(item.year, []);
      order.push(item.year);
    }

    byYear.get(item.year)!.push(item);
  }

  return order
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
      items: byYear.get(year) ?? [],
    }));
}

export function formatResearchDate(year?: number, month?: number): string | null {
  if (year === undefined) {
    return null;
  }

  if (month === undefined) {
    return String(year);
  }

  return `${year}.${String(month).padStart(2, "0")}`;
}

export function getCategoryLabel(category: ResearchCategory): string {
  return researchCategoryUiLabels[category];
}

export function sortByPublicationNumber(
  items: readonly ResearchItem[],
): ResearchItem[] {
  return [...items].sort((a, b) => a.number - b.number);
}

const fieldToCategory: Partial<Record<string, ResearchCategory>> = {
  형법: "criminal-law-theory",
  형사소송법: "criminal-procedure",
  형사정책: "criminal-policy",
  법학교육: "legal-education",
};

/**
 * Assigns a research archive category from KRI-style 학문분야 and title keywords.
 */
export function resolveResearchCategory(
  field?: string,
  title?: string,
): ResearchCategory {
  const normalizedTitle = title ?? "";

  for (const [category, meta] of Object.entries(researchCategoryMeta) as [
    ResearchCategory,
    (typeof researchCategoryMeta)[ResearchCategory],
  ][]) {
    if (
      meta.keywords.some((keyword) => normalizedTitle.includes(keyword))
    ) {
      return category;
    }
  }

  if (field && fieldToCategory[field]) {
    return fieldToCategory[field];
  }

  return "other";
}

export function applyResearchFlags(
  items: readonly ResearchItem[],
  options: {
    representativeNumbers: readonly number[];
    importantNumbers: readonly number[];
  },
): ResearchItem[] {
  const representative = new Set(options.representativeNumbers);
  const important = new Set(options.importantNumbers);

  return items.map((item) => ({
    ...item,
    isRepresentative: representative.has(item.number),
    isImportant: important.has(item.number),
  }));
}

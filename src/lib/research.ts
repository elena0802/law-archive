import type { ResearchCategory, ResearchItem } from "@/src/types/research";
import { researchCategoryMeta } from "@/src/types/research";

/** Display labels for the research archive UI (PR46.5-B). */
export const researchCategoryUiLabels: Record<
  Exclude<ResearchCategory, "other">,
  string
> = {
  "criminal-law-theory": "형법 이론",
  "criminal-procedure": "형사소송법",
  "evidence-law": "증거법",
  "criminal-policy": "형사정책",
  "international-criminal-law": "국제형사법",
  "legal-education": "법학교육",
};

const categoryOrder: Exclude<ResearchCategory, "other">[] = [
  "criminal-law-theory",
  "criminal-procedure",
  "evidence-law",
  "criminal-policy",
  "international-criminal-law",
  "legal-education",
];

export type ResearchSummaryStats = {
  totalPublications: number;
  representativeCount: number;
  importantCount: number;
  areaCount: number;
  yearRange: string | null;
};

export function getResearchYearRange(
  items: readonly ResearchItem[],
): { min: number; max: number } | null {
  const years = items
    .map((item) => item.year)
    .filter((year): year is number => year !== undefined);

  if (years.length === 0) {
    return null;
  }

  return { min: Math.min(...years), max: Math.max(...years) };
}

export function formatResearchYearRange(
  range: { min: number; max: number } | null,
): string | null {
  if (!range) {
    return null;
  }

  return `${range.min}–${range.max}`;
}

export function getResearchSummaryStats(
  items: readonly ResearchItem[],
): ResearchSummaryStats {
  const categories = new Set(
    items
      .map((item) => item.category)
      .filter((category) => category !== "other"),
  );

  return {
    totalPublications: items.length,
    representativeCount: items.filter((item) => item.isRepresentative).length,
    importantCount: items.filter((item) => item.isImportant).length,
    areaCount: categories.size,
    yearRange: formatResearchYearRange(getResearchYearRange(items)),
  };
}

/** Representative first, then newest important papers (PR46.5-C.5 preview). */
export function sortImportantPublicationPreview(
  items: readonly ResearchItem[],
): ResearchItem[] {
  return [...items]
    .filter((item) => item.isImportant)
    .sort((a, b) => {
      if (a.isRepresentative !== b.isRepresentative) {
        return a.isRepresentative ? -1 : 1;
      }

      const yearA = a.year ?? 0;
      const yearB = b.year ?? 0;
      if (yearB !== yearA) {
        return yearB - yearA;
      }

      return b.number - a.number;
    });
}

export function sortByPublicationRecency(
  items: readonly ResearchItem[],
): ResearchItem[] {
  return [...items].sort((a, b) => {
    const yearA = a.year ?? 0;
    const yearB = b.year ?? 0;
    if (yearB !== yearA) {
      return yearB - yearA;
    }

    const monthA = a.month ?? 0;
    const monthB = b.month ?? 0;
    if (monthB !== monthA) {
      return monthB - monthA;
    }

    return b.number - a.number;
  });
}

/** Career-flow order for the representative milestone timeline. */
export function sortRepresentativeTimeline(
  items: readonly ResearchItem[],
): ResearchItem[] {
  return [...items]
    .filter((item) => item.isRepresentative)
    .sort((a, b) => {
      const yearA = a.year ?? 0;
      const yearB = b.year ?? 0;
      if (yearA !== yearB) {
        return yearA - yearB;
      }

      return a.number - b.number;
    });
}

export function getResearchAreaCounts(
  items: readonly ResearchItem[],
): { category: ResearchCategory; label: string; count: number }[] {
  const counts = new Map<ResearchCategory, number>();

  for (const item of items) {
    if (item.category === "other") {
      continue;
    }

    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }

  return categoryOrder.map((category) => ({
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
  if (category === "other") {
    return researchCategoryUiLabels["criminal-law-theory"];
  }

  return researchCategoryUiLabels[category];
}

export function sortByPublicationNumber(
  items: readonly ResearchItem[],
): ResearchItem[] {
  return [...items].sort((a, b) => a.number - b.number);
}

export function parseResearchPublicationNumber(
  param: string,
): number | null {
  const value = Number(param);
  if (!Number.isInteger(value) || value < 1) {
    return null;
  }

  return value;
}

export function getResearchItemByNumber(
  number: number,
  items: readonly ResearchItem[],
): ResearchItem | undefined {
  return items.find((item) => item.number === number);
}

export function formatResearchPublicationDescription(
  item: ResearchItem,
): string {
  const parts = [
    formatResearchDate(item.year, item.month),
    item.journal,
    item.publisher,
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" · ") : item.title;
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

export function getRepresentativePaperPdfFileName(number: number): string {
  return `${String(number).padStart(3, "0")}.pdf`;
}

export function getResearchPdfUrl(number: number): string {
  return `/research/papers/${getRepresentativePaperPdfFileName(number)}`;
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

  return items.map((item) => {
    const isRepresentative = representative.has(item.number);

    return {
      ...item,
      isRepresentative,
      isImportant: important.has(item.number),
      ...(isRepresentative
        ? {
            hasFullText: true,
            pdfUrl: getResearchPdfUrl(item.number),
            pdfFileName: getRepresentativePaperPdfFileName(item.number),
          }
        : {}),
    };
  });
}

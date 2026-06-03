import type { Essay } from "@/lib/essays";
import { parseOptionalSeriesOrder } from "@/lib/content/parse-series-order";

function parsePositiveInt(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** Trailing part markers such as `제목 (3)` or `제목（3）`. */
export function extractSeriesPartFromTitle(title: string) {
  const normalized = title.normalize("NFKC").trim();
  const patterns = [
    /\((\d+)\)\s*$/,
    /（(\d+)）\s*$/,
    /【(\d+)】\s*$/,
    /\[(\d+)\]\s*$/,
  ] as const;

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      return parsePositiveInt(match[1]);
    }
  }

  return null;
}

/** Trailing numeric segment in slug, e.g. `life-as-criminal-law-professor-02`. */
export function extractSeriesPartFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/);
  return match ? parsePositiveInt(match[1]) : null;
}

export function getEssaySeriesSortKey(essay: Essay) {
  const fromColumn = parseOptionalSeriesOrder(essay.seriesOrder);
  if (fromColumn !== null) {
    return fromColumn;
  }

  const fromTitle = extractSeriesPartFromTitle(essay.title);
  if (fromTitle !== null) {
    return fromTitle;
  }

  const fromSlug = extractSeriesPartFromSlug(essay.slug);
  if (fromSlug !== null) {
    return fromSlug;
  }

  return null;
}

export function sortEssaysForSeries(essays: Essay[]) {
  return [...essays].sort((a, b) => {
    const keyA = getEssaySeriesSortKey(a);
    const keyB = getEssaySeriesSortKey(b);

    if (keyA !== null && keyB !== null && keyA !== keyB) {
      return keyA - keyB;
    }

    if (keyA !== null && keyB === null) {
      return -1;
    }

    if (keyA === null && keyB !== null) {
      return 1;
    }

    const dateDiff =
      new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }

    return (
      a.title.localeCompare(b.title, "ko") || a.slug.localeCompare(b.slug)
    );
  });
}

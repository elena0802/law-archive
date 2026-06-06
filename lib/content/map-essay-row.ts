import type { Essay, EssayFrontmatter } from "@/lib/essays";
import type { EssayRow, SeriesRow } from "@/lib/content/db-types";
import { isPublishedEssayStatus } from "@/lib/content/essay-status";

/** Map Postgres `essay_date` to app `date` (YYYY-MM-DD). */
export function formatEssayDateFromRow(essayDate: string) {
  return essayDate.slice(0, 10);
}

export function mapEssayRowToEssay(
  row: EssayRow,
  seriesTitle: string,
): Essay {
  const frontmatter: EssayFrontmatter = {
    title: row.title,
    description: row.description,
    date: formatEssayDateFromRow(row.essay_date),
    category: row.category,
    series: seriesTitle,
    draft: !isPublishedEssayStatus(row.status),
    featured: row.featured,
  };

  return {
    slug: row.slug,
    content: row.content,
    status: row.status,
    updatedAt: row.updated_at,
    seriesOrder: row.series_order,
    ...frontmatter,
  };
}

export function mapEssayRowToEssayWithSeries(
  row: EssayRow,
  seriesBySlug: Map<string, SeriesRow>,
): Essay | null {
  if (!row.series_slug) {
    return null;
  }

  const series = seriesBySlug.get(row.series_slug);

  if (!series) {
    return null;
  }

  return mapEssayRowToEssay(row, series.title);
}

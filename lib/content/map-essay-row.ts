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
    coverImageUrl: row.cover_image_url ?? null,
    coverImageAlt: row.cover_image_alt ?? null,
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
    console.warn(
      `[mapEssayRowToEssayWithSeries] missing series for slug "${row.series_slug}" (essay "${row.slug}")`,
    );
    return mapEssayRowToEssay(row, row.series_slug);
  }

  return mapEssayRowToEssay(row, series.title);
}

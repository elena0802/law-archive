import type {
  EssayRepository,
  EssayRepositoryOptions,
} from "@/lib/content/essay-repository";
import {
  mapEssayRowToEssayWithSeries,
} from "@/lib/content/map-essay-row";
import {
  buildEssaySeriesList,
  type SeriesVolumeSource,
} from "@/lib/content/series-aggregation";
import type { EssayRow, SeriesRow } from "@/lib/content/db-types";
import { isPublishedEssayStatus } from "@/lib/content/essay-status";
import { getSeriesSlug } from "@/lib/content/series-slug";
import { formatSupabaseLoadError } from "@/lib/supabase/query-error";
import { requireSupabaseServiceRoleClient } from "@/lib/supabase/server";

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function isPublicSlugSafe(slug: string) {
  return !slug.includes("/") && !slug.includes("..");
}

async function loadSeriesRows(options: { activeOnly?: boolean } = {}): Promise<SeriesRow[]> {
  const supabase = requireSupabaseServiceRoleClient();
  let query = supabase.from("series").select("*");
  if (options.activeOnly) {
    query = query.eq("status", "active");
  }
  let { data, error } = await query.order("display_order", { ascending: true });

  // Backward compatibility for environments where PR19 migration is not applied yet.
  if (
    error &&
    typeof error.message === "string" &&
    error.message.includes("column series.status does not exist")
  ) {
    const fallback = await supabase
      .from("series")
      .select("*")
      .order("display_order", { ascending: true });
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    throw formatSupabaseLoadError("series", error);
  }

  return (data ?? []).map((row) => ({
    ...row,
    introduction: row.introduction ?? "",
    status: row.status ?? "active",
    featured: row.featured ?? false,
  }));
}

async function loadEssayRows(options: EssayRepositoryOptions = {}) {
  const supabase = requireSupabaseServiceRoleClient();
  let query = supabase.from("essays").select("*");

  if (!options.includeDrafts) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query.order("essay_date", { ascending: false });

  if (error) {
    throw formatSupabaseLoadError("essays", error);
  }

  return data ?? [];
}

function mapEssayRows(
  rows: EssayRow[],
  seriesBySlug: Map<string, SeriesRow>,
  options: EssayRepositoryOptions = {},
) {
  return rows
    .map((row) => mapEssayRowToEssayWithSeries(row, seriesBySlug))
    .filter((essay): essay is NonNullable<typeof essay> => essay !== null)
    .filter((essay) => options.includeDrafts || !essay.draft);
}

function seriesRowsToVolumes(rows: SeriesRow[]): SeriesVolumeSource[] {
  return rows.map((row) => ({
    title: row.title,
    slug: row.slug,
    description: row.description,
    introduction: row.introduction,
    sortKey: row.display_order,
  }));
}

export function createSupabaseEssayRepository(): EssayRepository {
  return {
    async getEssayBySlug(slug, options = {}) {
      if (!isPublicSlugSafe(slug)) {
        return null;
      }

      const supabase = requireSupabaseServiceRoleClient();
      const { data: row, error } = await supabase
        .from("essays")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        throw formatSupabaseLoadError(`essay "${slug}"`, error);
      }

      if (!row) {
        return null;
      }

      if (!options.includeDrafts && !isPublishedEssayStatus(row.status)) {
        return null;
      }

      const seriesRows = await loadSeriesRows();
      const seriesBySlug = new Map(seriesRows.map((item) => [item.slug, item]));

      return mapEssayRowToEssayWithSeries(row, seriesBySlug);
    },

    async getAllEssays(options = {}) {
      const [seriesRows, essayRows] = await Promise.all([
        loadSeriesRows(),
        loadEssayRows(options),
      ]);
      const seriesBySlug = new Map(seriesRows.map((item) => [item.slug, item]));

      return mapEssayRows(essayRows, seriesBySlug, options);
    },

    async getAllSeries(options = {}) {
      const [seriesRows, essayRows] = await Promise.all([
        loadSeriesRows({ activeOnly: true }),
        loadEssayRows(options),
      ]);
      const seriesBySlug = new Map(seriesRows.map((item) => [item.slug, item]));
      const essays = mapEssayRows(essayRows, seriesBySlug, options);

      return buildEssaySeriesList(seriesRowsToVolumes(seriesRows), essays);
    },

    async getFeaturedSeries(options = {}) {
      const [seriesRows, essayRows] = await Promise.all([
        loadSeriesRows({ activeOnly: true }),
        loadEssayRows(options),
      ]);
      const featuredRows = seriesRows.filter((row) => row.featured);
      const seriesBySlug = new Map(seriesRows.map((item) => [item.slug, item]));
      const essays = mapEssayRows(essayRows, seriesBySlug, options);

      return buildEssaySeriesList(seriesRowsToVolumes(featuredRows), essays);
    },

    async getSeriesBySlug(slug, options = {}) {
      const normalizedSlug = getSeriesSlug(decodeSlug(slug));
      const series = await this.getAllSeries(options);

      return (
        series.find((item) => item.slug === normalizedSlug) ??
        series.find((item) => getSeriesSlug(item.title) === normalizedSlug) ??
        null
      );
    },
  };
}

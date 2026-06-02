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
import { getSeriesSlug } from "@/lib/content/series-slug";
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

async function loadSeriesRows(): Promise<SeriesRow[]> {
  const supabase = requireSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("series")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load series: ${error.message}`);
  }

  return data ?? [];
}

async function loadEssayRows(options: EssayRepositoryOptions = {}) {
  const supabase = requireSupabaseServiceRoleClient();
  let query = supabase.from("essays").select("*");

  if (!options.includeDrafts) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query.order("essay_date", { ascending: false });

  if (error) {
    throw new Error(`Failed to load essays: ${error.message}`);
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
        throw new Error(`Failed to load essay "${slug}": ${error.message}`);
      }

      if (!row) {
        return null;
      }

      if (!options.includeDrafts && row.status === "draft") {
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
        loadSeriesRows(),
        loadEssayRows(options),
      ]);
      const seriesBySlug = new Map(seriesRows.map((item) => [item.slug, item]));
      const essays = mapEssayRows(essayRows, seriesBySlug, options);

      return buildEssaySeriesList(seriesRowsToVolumes(seriesRows), essays);
    },

    async getSeriesBySlug(slug, options = {}) {
      const normalizedSlug = getSeriesSlug(decodeSlug(slug));
      const series = await this.getAllSeries(options);

      return series.find((item) => item.slug === normalizedSlug) ?? null;
    },
  };
}

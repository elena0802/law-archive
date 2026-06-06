import { requireEditorSupabase } from "@/lib/admin/require-editor";
import type { SeriesRow, SeriesStatus } from "@/lib/content/db-types";

export type AdminSeriesListFilter = "all" | SeriesStatus;

export type AdminSeriesListItem = SeriesRow & {
  essay_count: number;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSeriesSlug(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseSeriesStatus(value: unknown): SeriesStatus {
  return value === "hidden" ? "hidden" : "active";
}

export function parseSeriesFilter(value: string | undefined): AdminSeriesListFilter {
  if (value === "active" || value === "hidden") {
    return value;
  }
  return "all";
}

export function isValidSeriesSlug(slug: string) {
  return SLUG_PATTERN.test(slug);
}

export async function listAdminSeriesWithCounts(
  filter: AdminSeriesListFilter = "all",
): Promise<AdminSeriesListItem[]> {
  const { supabase } = await requireEditorSupabase();
  let query = supabase.from("series").select("*");

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const [{ data: seriesRows, error: seriesError }, { data: essayRows, error: essaysError }] =
    await Promise.all([
      query.order("display_order", { ascending: true }).order("title", { ascending: true }),
      supabase.from("essays").select("series_slug"),
    ]);

  if (seriesError) {
    throw new Error(seriesError.message);
  }
  if (essaysError) {
    throw new Error(essaysError.message);
  }

  const counts = new Map<string, number>();
  for (const row of essayRows ?? []) {
    if (!row.series_slug) {
      continue;
    }

    counts.set(row.series_slug, (counts.get(row.series_slug) ?? 0) + 1);
  }

  return (seriesRows ?? []).map((row) => ({
    ...row,
    essay_count: counts.get(row.slug) ?? 0,
  }));
}

export async function getAdminSeriesById(id: string): Promise<SeriesRow | null> {
  const { supabase } = await requireEditorSupabase();
  const { data, error } = await supabase.from("series").select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function isSeriesSlugTaken(slug: string, excludeId?: string) {
  const { supabase } = await requireEditorSupabase();
  let query = supabase.from("series").select("id").eq("slug", slug);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  const { data, error } = await query.maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return Boolean(data);
}

export async function getNextSeriesDisplayOrder() {
  const { supabase } = await requireEditorSupabase();
  const { data, error } = await supabase
    .from("series")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data?.display_order ?? 0) + 1;
}


import type { EssayRow, SeriesRow } from "@/lib/content/db-types";
import { requireEditorSupabase } from "@/lib/admin/require-editor";

export type EssayListItem = EssayRow & {
  series_title: string;
};

export async function listAdminEssays(): Promise<EssayListItem[]> {
  const { supabase } = await requireEditorSupabase();

  const [{ data: essays, error: essaysError }, { data: series, error: seriesError }] =
    await Promise.all([
      supabase
        .from("essays")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase.from("series").select("*").order("display_order", { ascending: true }),
    ]);

  if (essaysError) {
    throw new Error(essaysError.message);
  }

  if (seriesError) {
    throw new Error(seriesError.message);
  }

  const seriesBySlug = new Map(
    (series ?? []).map((row) => [row.slug, row.title]),
  );

  return (essays ?? []).map((essay) => ({
    ...essay,
    series_title: seriesBySlug.get(essay.series_slug) ?? essay.series_slug,
  }));
}

export async function listAdminSeries(): Promise<SeriesRow[]> {
  const { supabase } = await requireEditorSupabase();

  const { data, error } = await supabase
    .from("series")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getAdminEssayById(id: string): Promise<EssayRow | null> {
  const { supabase } = await requireEditorSupabase();

  const { data, error } = await supabase
    .from("essays")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function isEssaySlugTaken(slug: string, excludeId?: string) {
  const { supabase } = await requireEditorSupabase();

  let query = supabase.from("essays").select("id").eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}

export function resolvePublishedAt(
  status: EssayRow["status"],
  existingPublishedAt: string | null,
) {
  if (status !== "published") {
    return existingPublishedAt;
  }

  return existingPublishedAt ?? new Date().toISOString();
}

export function formatAdminDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatAdminDateTime(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function essayRowToFormValues(essay: EssayRow) {
  return {
    title: essay.title,
    slug: essay.slug,
    description: essay.description,
    content: essay.content,
    essay_date: essay.essay_date.slice(0, 10),
    category: essay.category,
    series_slug: essay.series_slug,
    status: essay.status,
    featured: essay.featured,
  };
}

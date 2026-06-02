import type { EssayRow, SeriesRow } from "@/lib/content/db-types";
import { requireEditorSupabase } from "@/lib/admin/require-editor";

export type EssayListItem = EssayRow & {
  series_title: string;
};

export type AdminEssaySort =
  | "updated_desc"
  | "updated_asc"
  | "date_desc"
  | "date_asc"
  | "title_asc";

export type ListAdminEssaysParams = {
  status?: EssayRow["status"];
  seriesSlug?: string;
  query?: string;
  sort?: AdminEssaySort;
};

export async function listAdminEssays(
  params: ListAdminEssaysParams = {},
): Promise<EssayListItem[]> {
  const { supabase } = await requireEditorSupabase();
  const normalizedQuery = params.query?.trim();
  let essaysQuery = supabase.from("essays").select("*");

  if (params.status) {
    essaysQuery = essaysQuery.eq("status", params.status);
  }

  if (params.seriesSlug) {
    essaysQuery = essaysQuery.eq("series_slug", params.seriesSlug);
  }

  if (normalizedQuery) {
    const escaped = normalizedQuery
      .replaceAll("\\", "\\\\")
      .replaceAll(",", "\\,")
      .replaceAll("%", "\\%");
    essaysQuery = essaysQuery.or(
      `title.ilike.%${escaped}%,slug.ilike.%${escaped}%,description.ilike.%${escaped}%`,
    );
  }

  switch (params.sort ?? "updated_desc") {
    case "updated_asc":
      essaysQuery = essaysQuery.order("updated_at", { ascending: true });
      break;
    case "date_desc":
      essaysQuery = essaysQuery.order("essay_date", { ascending: false });
      break;
    case "date_asc":
      essaysQuery = essaysQuery.order("essay_date", { ascending: true });
      break;
    case "title_asc":
      essaysQuery = essaysQuery.order("title", { ascending: true });
      break;
    case "updated_desc":
    default:
      essaysQuery = essaysQuery.order("updated_at", { ascending: false });
      break;
  }

  const [{ data: essays, error: essaysError }, { data: series, error: seriesError }] =
    await Promise.all([
      essaysQuery,
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

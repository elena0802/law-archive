import type { EssayRow, SeriesRow } from "@/lib/content/db-types";
import { requireEditorSupabase } from "@/lib/admin/require-editor";

type PostgrestErrorShape = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function logSupabaseQueryError(
  functionName: string,
  context: Record<string, unknown>,
  error: PostgrestErrorShape | Error | unknown,
) {
  const postgrest =
    error && typeof error === "object" && "code" in error
      ? (error as PostgrestErrorShape)
      : null;

  console.error(`[${functionName}] Supabase query failed`, {
    ...context,
    errorCode: postgrest?.code,
    errorMessage:
      postgrest?.message ??
      (error instanceof Error ? error.message : String(error)),
    errorDetails: postgrest?.details,
    errorHint: postgrest?.hint,
  });
}

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
  } else {
    // "전체" excludes trash so deleted essays appear only under 휴지통.
    essaysQuery = essaysQuery.neq("status", "deleted");
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
    series_title:
      essay.series_slug === null
        ? "—"
        : (seriesBySlug.get(essay.series_slug) ?? essay.series_slug),
  }));
}

type ListAdminSeriesOptions = {
  activeOnly?: boolean;
  includeSlug?: string;
};

export async function listAdminSeries(
  options: ListAdminSeriesOptions = {},
): Promise<SeriesRow[]> {
  const { supabase } = await requireEditorSupabase();

  let query = supabase.from("series").select("*");

  if (options.activeOnly && options.includeSlug) {
    query = query.or(`status.eq.active,slug.eq.${options.includeSlug}`);
  } else if (options.activeOnly) {
    query = query.eq("status", "active");
  } else if (options.includeSlug) {
    query = query.eq("slug", options.includeSlug);
  }

  const { data, error } = await query
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    logSupabaseQueryError("listAdminSeries", { options }, error);
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
    logSupabaseQueryError("getAdminEssayById", { id }, error);
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
    series_slug: essay.series_slug ?? "",
    series_order: essay.series_order,
    status: essay.status,
    featured: essay.featured,
    cover_image_url: essay.cover_image_url ?? "",
    cover_image_alt: essay.cover_image_alt ?? "",
  };
}

/** Next suggested `series_order` per series slug (excludes one essay on edit). */
export async function getSeriesOrderHints(
  excludeEssayId?: string,
): Promise<Record<string, number>> {
  const { supabase } = await requireEditorSupabase();

  let query = supabase
    .from("essays")
    .select("series_slug, series_order")
    .not("series_slug", "is", null);

  if (excludeEssayId) {
    query = query.neq("id", excludeEssayId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const maxBySeries = new Map<string, number>();

  for (const row of data ?? []) {
    if (!row.series_slug || row.series_order == null) {
      continue;
    }

    maxBySeries.set(
      row.series_slug,
      Math.max(maxBySeries.get(row.series_slug) ?? 0, row.series_order),
    );
  }

  const hints: Record<string, number> = {};
  for (const [slug, max] of maxBySeries) {
    hints[slug] = max + 1;
  }

  return hints;
}

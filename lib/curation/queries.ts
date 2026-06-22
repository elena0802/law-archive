import "server-only";

import type { ProfessorCurationItemRow } from "@/lib/content/db-types";
import { resolveCurationThumbnail } from "@/lib/curation/youtube";
import { buildHomeCurationPreview } from "@/lib/curation/home-preview";
import type { CurationItem } from "@/lib/curation/types";
import { requireSupabaseServiceRoleClient } from "@/lib/supabase/server";

function mapCurationRow(row: ProfessorCurationItemRow): CurationItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    professorNote: row.professor_note?.trim() ?? "",
    url: row.url,
    source: row.source,
    thumbnailUrl: resolveCurationThumbnail(row.type, row.url, row.thumbnail_url),
    publishedAt: row.published_at,
    recommendedAt: row.recommended_at,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  };
}

function visibleItemsQuery() {
  const supabase = requireSupabaseServiceRoleClient();
  return supabase
    .from("professor_curation_items")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: false })
    .order("recommended_at", { ascending: false })
    .order("created_at", { ascending: false });
}

export async function getVisibleCurationItems(): Promise<CurationItem[]> {
  const { data, error } = await visibleItemsQuery();

  if (error) {
    console.error("[getVisibleCurationItems] query failed", { error });
    return [];
  }

  return (data ?? []).map(mapCurationRow);
}

export async function getHomeCurationPreview() {
  const items = await getVisibleCurationItems();
  return buildHomeCurationPreview(items);
}

export async function getFeaturedCuration(): Promise<CurationItem | null> {
  const supabase = requireSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("professor_curation_items")
    .select("*")
    .eq("is_visible", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: false })
    .order("recommended_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getFeaturedCuration] query failed", { error });
    return null;
  }

  return data ? mapCurationRow(data) : null;
}

export async function getHomeCurationRecent(
  excludeId?: string,
  limit = 4,
): Promise<CurationItem[]> {
  const supabase = requireSupabaseServiceRoleClient();
  let query = supabase
    .from("professor_curation_items")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: false })
    .order("recommended_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getHomeCurationRecent] query failed", { error });
    return [];
  }

  return (data ?? []).map(mapCurationRow);
}

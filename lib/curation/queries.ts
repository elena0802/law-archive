import "server-only";

import type { ProfessorCurationItemRow } from "@/lib/content/db-types";
import { resolveCurationThumbnail } from "@/lib/curation/youtube";
import type { CurationItem } from "@/lib/curation/types";
import { requireSupabaseServiceRoleClient } from "@/lib/supabase/server";

function mapCurationRow(row: ProfessorCurationItemRow): CurationItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
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

export async function getFeaturedYoutubeCuration(): Promise<CurationItem | null> {
  const supabase = requireSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("professor_curation_items")
    .select("*")
    .eq("is_visible", true)
    .eq("type", "youtube")
    .eq("is_featured", true)
    .order("sort_order", { ascending: false })
    .order("recommended_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getFeaturedYoutubeCuration] query failed", { error });
    return null;
  }

  return data ? mapCurationRow(data) : null;
}

export async function getHomeCurationLinks(
  excludeId?: string,
  limit = 3,
): Promise<CurationItem[]> {
  const supabase = requireSupabaseServiceRoleClient();
  let query = supabase
    .from("professor_curation_items")
    .select("*")
    .eq("is_visible", true)
    .neq("type", "youtube")
    .order("sort_order", { ascending: false })
    .order("recommended_at", { ascending: false })
    .limit(limit);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getHomeCurationLinks] query failed", { error });
    return [];
  }

  return (data ?? []).map(mapCurationRow);
}

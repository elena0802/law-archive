import "server-only";

import { requireEditorSupabase } from "@/lib/admin/require-editor";
import type {
  CurationType,
  ProfessorCurationItemRow,
} from "@/lib/content/db-types";

export type AdminCurationListFilter = "all" | "visible" | "hidden";

export function parseCurationFilter(value: string | undefined): AdminCurationListFilter {
  if (value === "visible" || value === "hidden") {
    return value;
  }

  return "all";
}

export function curationTypeLabel(type: CurationType) {
  switch (type) {
    case "youtube":
      return "유튜브";
    case "article":
      return "기사";
    case "blog":
      return "외부글";
    case "paper":
      return "논문";
    case "book":
      return "책";
    default:
      return type;
  }
}

export async function listAdminCurationItems(
  filter: AdminCurationListFilter = "all",
): Promise<ProfessorCurationItemRow[]> {
  const { supabase } = await requireEditorSupabase();
  let query = supabase.from("professor_curation_items").select("*");

  if (filter === "visible") {
    query = query.eq("is_visible", true);
  } else if (filter === "hidden") {
    query = query.eq("is_visible", false);
  }

  const { data, error } = await query
    .order("sort_order", { ascending: false })
    .order("recommended_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getAdminCurationItemById(
  id: string,
): Promise<ProfessorCurationItemRow | null> {
  const { supabase } = await requireEditorSupabase();
  const { data, error } = await supabase
    .from("professor_curation_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getNextCurationSortOrder() {
  const { supabase } = await requireEditorSupabase();
  const { data, error } = await supabase
    .from("professor_curation_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data?.sort_order ?? 0) + 1;
}

export function curationRowToFormValues(item: ProfessorCurationItemRow) {
  return {
    type: item.type,
    title: item.title,
    description: item.description,
    professor_note: item.professor_note ?? "",
    url: item.url,
    source: item.source,
    thumbnail_url: item.thumbnail_url ?? "",
    published_at: item.published_at?.slice(0, 10) ?? "",
    recommended_at: item.recommended_at.slice(0, 10),
    is_featured: item.is_featured,
    is_visible: item.is_visible,
    sort_order: item.sort_order,
  };
}

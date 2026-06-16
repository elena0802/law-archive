import "server-only";

import { requireEditorSupabase } from "@/lib/admin/require-editor";
import type { NewsItemRow } from "@/lib/content/db-types";

export type AdminNewsListFilter = "all" | "published" | "hidden";

export function parseNewsFilter(value: string | undefined): AdminNewsListFilter {
  if (value === "published" || value === "hidden") {
    return value;
  }
  return "all";
}

export async function listAdminNewsItems(
  filter: AdminNewsListFilter = "all",
): Promise<NewsItemRow[]> {
  const { supabase } = await requireEditorSupabase();
  let query = supabase.from("news_items").select("*");

  if (filter === "published") {
    query = query.eq("published", true);
  } else if (filter === "hidden") {
    query = query.eq("published", false);
  }

  const { data, error } = await query
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getAdminNewsItemById(id: string): Promise<NewsItemRow | null> {
  const { supabase } = await requireEditorSupabase();
  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function newsRowToFormValues(item: NewsItemRow) {
  return {
    date: item.date,
    category: item.category,
    title: item.title,
    summary: item.summary,
    image: item.image_url ?? "",
    link: item.link_url ?? "",
    featured: item.featured,
    published: item.published,
  };
}

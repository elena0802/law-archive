"use server";

import { redirect } from "next/navigation";
import { getAdminNewsItemById } from "@/lib/admin/news";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import { parseNewsForm, type NewsFormValues } from "@/lib/admin/parse-news-form";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { revalidatePublicNewsPaths } from "@/lib/content/revalidate-news-paths";

function mapFormToInsert(values: NewsFormValues) {
  return {
    date: values.date,
    category: values.category,
    title: values.title,
    summary: values.summary,
    image_url: values.image || null,
    link_url: values.link || null,
    featured: values.featured,
    published: values.published,
  };
}

async function unsetOtherFeaturedNews(currentId?: string) {
  const { supabase } = await requireEditorSupabase();
  let query = supabase
    .from("news_items")
    .update({ featured: false })
    .eq("featured", true);
  if (currentId) {
    query = query.neq("id", currentId);
  }
  const { error } = await query;
  if (error) {
    throw new Error(error.message);
  }
}

export async function createNewsItem(
  _prevState: EssayActionState,
  formData: FormData,
): Promise<EssayActionState> {
  const parsed = parseNewsForm(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.errors,
    };
  }

  const { supabase } = await requireEditorSupabase();
  const payload = mapFormToInsert(parsed.values);
  const { data, error } = await supabase
    .from("news_items")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createNewsItem] insert failed", { error });
    return {
      status: "error",
      message: "소식 항목을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  if (parsed.values.featured) {
    await unsetOtherFeaturedNews(data.id);
  }

  await revalidatePublicNewsPaths();
  redirect(`/admin/news/${data.id}?notice=saved`);
}

export async function updateNewsItem(
  itemId: string,
  _prevState: EssayActionState,
  formData: FormData,
): Promise<EssayActionState> {
  const parsed = parseNewsForm(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.errors,
    };
  }

  const existing = await getAdminNewsItemById(itemId);
  if (!existing) {
    return { status: "error", message: "소식 항목을 찾을 수 없습니다." };
  }

  const { supabase } = await requireEditorSupabase();
  const { error } = await supabase
    .from("news_items")
    .update(mapFormToInsert(parsed.values))
    .eq("id", itemId);

  if (error) {
    console.error("[updateNewsItem] update failed", { error, itemId });
    return {
      status: "error",
      message: "소식 항목을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  if (parsed.values.featured) {
    await unsetOtherFeaturedNews(itemId);
  }

  await revalidatePublicNewsPaths();
  redirect(`/admin/news/${itemId}?notice=saved`);
}

export async function deleteNewsItem(itemId: string, formData: FormData) {
  void formData;
  const existing = await getAdminNewsItemById(itemId);
  if (!existing) {
    redirect("/admin/news");
  }

  const { supabase } = await requireEditorSupabase();
  const { error } = await supabase.from("news_items").delete().eq("id", itemId);

  if (error) {
    console.error("[deleteNewsItem] delete failed", { error, itemId });
    redirect(`/admin/news/${itemId}?notice=delete_failed`);
  }

  await revalidatePublicNewsPaths();
  redirect("/admin/news?notice=deleted");
}

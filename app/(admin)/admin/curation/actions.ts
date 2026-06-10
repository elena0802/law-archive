"use server";

import { redirect } from "next/navigation";
import { getAdminCurationItemById } from "@/lib/admin/curation";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import {
  parseCurationForm,
  type CurationFormValues,
} from "@/lib/admin/parse-curation-form";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { revalidatePublicCurationPaths } from "@/lib/content/revalidate-curation-paths";

function mapFormToInsert(values: CurationFormValues) {
  return {
    type: values.type,
    title: values.title,
    description: values.description,
    url: values.url,
    source: values.source,
    thumbnail_url: values.thumbnail_url || null,
    published_at: values.published_at || null,
    recommended_at: values.recommended_at,
    is_featured: values.is_featured,
    is_visible: values.is_visible,
    sort_order: values.sort_order,
  };
}

export async function createCurationItem(
  _prevState: EssayActionState,
  formData: FormData,
): Promise<EssayActionState> {
  const parsed = parseCurationForm(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.errors,
    };
  }

  const { supabase } = await requireEditorSupabase();
  const { data, error } = await supabase
    .from("professor_curation_items")
    .insert(mapFormToInsert(parsed.values))
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createCurationItem] insert failed", { error });
    return {
      status: "error",
      message: "큐레이션 항목을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  await revalidatePublicCurationPaths();
  redirect(`/admin/curation/${data.id}?notice=saved`);
}

export async function updateCurationItem(
  itemId: string,
  _prevState: EssayActionState,
  formData: FormData,
): Promise<EssayActionState> {
  const parsed = parseCurationForm(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.errors,
    };
  }

  const existing = await getAdminCurationItemById(itemId);
  if (!existing) {
    return { status: "error", message: "큐레이션 항목을 찾을 수 없습니다." };
  }

  const { supabase } = await requireEditorSupabase();
  const { error } = await supabase
    .from("professor_curation_items")
    .update(mapFormToInsert(parsed.values))
    .eq("id", itemId);

  if (error) {
    console.error("[updateCurationItem] update failed", { error, itemId });
    return {
      status: "error",
      message: "큐레이션 항목을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  await revalidatePublicCurationPaths();
  redirect(`/admin/curation/${itemId}?notice=saved`);
}

export async function deleteCurationItem(itemId: string, formData: FormData) {
  void formData;
  const existing = await getAdminCurationItemById(itemId);
  if (!existing) {
    redirect("/admin/curation");
  }

  const { supabase } = await requireEditorSupabase();
  const { error } = await supabase
    .from("professor_curation_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("[deleteCurationItem] delete failed", { error, itemId });
    redirect(`/admin/curation/${itemId}?notice=delete_failed`);
  }

  await revalidatePublicCurationPaths();
  redirect("/admin/curation?notice=deleted");
}

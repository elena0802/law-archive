"use server";

import { resolveEssaySaveNotice } from "@/lib/admin/admin-notices";
import {
  redirectAdminEssayEdit,
  redirectAdminEssaysList,
} from "@/lib/admin/admin-redirect";
import {
  getAdminEssayById,
  isEssaySlugTaken,
  resolvePublishedAt,
} from "@/lib/admin/essays";
import { parseEssayForm } from "@/lib/admin/parse-essay-form";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import type { EssayInsert } from "@/lib/content/db-types";
import { revalidatePublicEssayPaths } from "@/lib/content/revalidate-public";

export async function createEssay(
  _prevState: EssayActionState,
  formData: FormData,
): Promise<EssayActionState> {
  const parsed = parseEssayForm(formData);

  if (!parsed.ok) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.errors,
    };
  }

  const { values } = parsed;

  if (await isEssaySlugTaken(values.slug)) {
    return {
      status: "error",
      message: "이 주소(slug)는 이미 사용 중입니다.",
      fieldErrors: { slug: "다른 주소를 입력해 주세요." },
    };
  }

  const { supabase } = await requireEditorSupabase();
  const published_at = resolvePublishedAt(values.status, null);

  console.error("[createEssay] before supabase insert", {
    slug: values.slug,
    series_slug: values.series_slug,
    category: values.category,
    status: values.status,
  });

  const row: EssayInsert = {
    ...values,
    published_at,
  };

  const { data, error } = await supabase
    .from("essays")
    .insert(row)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createEssay] supabase insert failed", { error });
    return {
      status: "error",
      message: "글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  console.error("[createEssay] after supabase insert", { essayId: data.id });

  await revalidatePublicEssayPaths({
    slug: values.slug,
    seriesSlug: values.series_slug,
  });

  const notice = resolveEssaySaveNotice("draft", values.status);
  console.error("[createEssay] before redirect", { essayId: data.id, notice });
  redirectAdminEssayEdit(data.id, notice);
}

export async function updateEssay(
  essayId: string,
  _prevState: EssayActionState,
  formData: FormData,
): Promise<EssayActionState> {
  const parsed = parseEssayForm(formData);

  if (!parsed.ok) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.errors,
    };
  }

  const existing = await getAdminEssayById(essayId);

  if (!existing) {
    return {
      status: "error",
      message: "글을 찾을 수 없습니다.",
    };
  }

  const { values } = parsed;

  if (existing.status === "published" && values.slug !== existing.slug) {
    return {
      status: "error",
      message: "공개된 글의 주소(slug)는 바꿀 수 없습니다.",
      fieldErrors: { slug: "주소를 변경할 수 없습니다." },
    };
  }

  if (await isEssaySlugTaken(values.slug, essayId)) {
    return {
      status: "error",
      message: "이 주소(slug)는 이미 사용 중입니다.",
      fieldErrors: { slug: "다른 주소를 입력해 주세요." },
    };
  }

  const { supabase } = await requireEditorSupabase();
  const published_at = resolvePublishedAt(values.status, existing.published_at);

  console.error("[updateEssay] before supabase update", {
    essayId,
    slug: values.slug,
    series_slug: values.series_slug,
    category: values.category,
    status: values.status,
    titleChars: values.title.length,
    contentChars: values.content.length,
  });

  const { error } = await supabase
    .from("essays")
    .update({
      title: values.title,
      slug: values.slug,
      description: values.description,
      content: values.content,
      essay_date: values.essay_date,
      category: values.category,
      series_slug: values.series_slug,
      status: values.status,
      featured: values.featured,
      published_at,
    })
    .eq("id", essayId);

  if (error) {
    console.error("[updateEssay] supabase update failed", { essayId, error });
    return {
      status: "error",
      message: "변경 내용을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  console.error("[updateEssay] after supabase update", { essayId });

  await revalidatePublicEssayPaths({
    slug: values.slug,
    seriesSlug: values.series_slug,
    previousSlug: existing.slug,
    previousSeriesSlug: existing.series_slug,
  });

  const notice = resolveEssaySaveNotice(existing.status, values.status);
  console.error("[updateEssay] before redirect", { essayId, notice });
  redirectAdminEssayEdit(essayId, notice);
}

export async function restoreDeletedEssay(essayId: string) {
  const existing = await getAdminEssayById(essayId);

  if (!existing || existing.status !== "deleted") {
    redirectAdminEssaysList({ status: "deleted" });
  }

  const { supabase } = await requireEditorSupabase();
  const { error } = await supabase
    .from("essays")
    .update({ status: "draft" })
    .eq("id", essayId);

  if (error) {
    throw new Error(`복원에 실패했습니다: ${error.message}`);
  }

  await revalidatePublicEssayPaths({
    slug: existing.slug,
    seriesSlug: existing.series_slug,
  });

  redirectAdminEssaysList({ status: "deleted", notice: "restored" });
}

export async function permanentlyDeleteEssay(essayId: string) {
  const existing = await getAdminEssayById(essayId);

  if (!existing || existing.status !== "deleted") {
    redirectAdminEssaysList({ status: "deleted" });
  }

  const { supabase } = await requireEditorSupabase();
  const { error } = await supabase.from("essays").delete().eq("id", essayId);

  if (error) {
    throw new Error(`영구 삭제에 실패했습니다: ${error.message}`);
  }

  await revalidatePublicEssayPaths({
    slug: existing.slug,
    seriesSlug: existing.series_slug,
  });

  redirectAdminEssaysList({ status: "deleted" });
}

"use server";

import { resolveEssaySaveNotice } from "@/lib/admin/admin-notices";
import {
  buildAdminEssayEditPath,
  redirectAdminEssaysList,
} from "@/lib/admin/admin-redirect";
import {
  formatEssaySaveErrorMessage,
  logEssaySaveError,
} from "@/lib/admin/essay-supabase-error";
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
import { normalizeEssayCoverImageSrc } from "@/lib/essay-cover-url";
import {
  type EssayImageUploadResult,
  uploadEssayImageFile,
} from "@/lib/admin/essay-image-upload";

function normalizeStoredCoverImageUrl(raw: string) {
  return normalizeEssayCoverImageSrc(raw);
}

export async function uploadEssayImage(
  formData: FormData,
): Promise<EssayImageUploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "업로드할 이미지 파일을 선택해 주세요." };
  }

  const essayId = formData.get("essayId");
  const id =
    typeof essayId === "string" && essayId.trim() ? essayId.trim() : undefined;

  return uploadEssayImageFile(file, id);
}

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

  let supabase;
  try {
    ({ supabase } = await requireEditorSupabase());
  } catch (error) {
    console.error("[createEssay] editor auth failed", { error });
    return {
      status: "error",
      message: "관리자 인증이 필요합니다. 다시 로그인한 뒤 시도해 주세요.",
    };
  }

  const published_at = resolvePublishedAt(values.status, null);

  const row: EssayInsert = {
    ...values,
    cover_image_url: normalizeStoredCoverImageUrl(values.cover_image_url),
    cover_image_alt: values.cover_image_alt.trim() || null,
    published_at,
  };

  const { data, error } = await supabase
    .from("essays")
    .insert(row)
    .select("id, status")
    .single();

  if (error || !data) {
    logEssaySaveError("createEssay", { slug: values.slug }, error);
    return {
      status: "error",
      message: error
        ? formatEssaySaveErrorMessage(error)
        : "글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  await revalidatePublicEssayPaths({
    slug: values.slug,
    seriesSlug: values.series_slug,
  });

  const notice = resolveEssaySaveNotice("draft", data.status);
  return {
    status: "success",
    redirectTo: buildAdminEssayEditPath(data.id, notice),
  };
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

  let existing;
  try {
    existing = await getAdminEssayById(essayId);
  } catch (error) {
    console.error("[updateEssay] getAdminEssayById failed", { essayId, error });
    return {
      status: "error",
      message: "글 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

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

  let supabase;
  try {
    ({ supabase } = await requireEditorSupabase());
  } catch (error) {
    console.error("[updateEssay] editor auth failed", { essayId, error });
    return {
      status: "error",
      message: "관리자 인증이 필요합니다. 다시 로그인한 뒤 시도해 주세요.",
    };
  }

  const published_at = resolvePublishedAt(values.status, existing.published_at);

  const { data: updated, error } = await supabase
    .from("essays")
    .update({
      title: values.title,
      slug: values.slug,
      description: values.description,
      content: values.content,
      essay_date: values.essay_date,
      category: values.category,
      series_slug: values.series_slug,
      series_order: values.series_order,
      status: values.status,
      featured: values.featured,
      cover_image_url: normalizeStoredCoverImageUrl(values.cover_image_url),
      cover_image_alt: values.cover_image_alt.trim() || null,
      published_at,
    })
    .eq("id", essayId)
    .select("id, status")
    .single();

  if (error || !updated) {
    logEssaySaveError(
      "updateEssay",
      { essayId, requestedStatus: values.status },
      error,
    );
    return {
      status: "error",
      message: error
        ? formatEssaySaveErrorMessage(error)
        : "변경 내용을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  await revalidatePublicEssayPaths({
    slug: values.slug,
    seriesSlug: values.series_slug,
    previousSlug: existing.slug,
    previousSeriesSlug: existing.series_slug,
  });

  const notice = resolveEssaySaveNotice(existing.status, updated.status);
  return {
    status: "success",
    redirectTo: buildAdminEssayEditPath(essayId, notice),
  };
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

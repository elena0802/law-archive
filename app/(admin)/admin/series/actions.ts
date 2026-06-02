"use server";

import { redirect } from "next/navigation";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import {
  getAdminSeriesById,
  isSeriesSlugTaken,
} from "@/lib/admin/series";
import { parseSeriesForm } from "@/lib/admin/parse-series-form";
import { requireEditorSupabase } from "@/lib/admin/require-editor";

export async function createSeries(
  _prevState: EssayActionState,
  formData: FormData,
): Promise<EssayActionState> {
  const parsed = parseSeriesForm(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.errors,
    };
  }

  const { values } = parsed;
  if (await isSeriesSlugTaken(values.slug)) {
    return {
      status: "error",
      message: "이 주소(slug)는 이미 사용 중입니다.",
      fieldErrors: { slug: "다른 주소를 입력해 주세요." },
    };
  }

  const { supabase } = await requireEditorSupabase();
  const { data, error } = await supabase
    .from("series")
    .insert(values)
    .select("id")
    .single();

  if (error || !data) {
    return {
      status: "error",
      message: "연재를 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  redirect("/admin/series");
}

export async function updateSeries(
  seriesId: string,
  _prevState: EssayActionState,
  formData: FormData,
): Promise<EssayActionState> {
  const parsed = parseSeriesForm(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.errors,
    };
  }

  const existing = await getAdminSeriesById(seriesId);
  if (!existing) {
    return { status: "error", message: "연재를 찾을 수 없습니다." };
  }

  const { values } = parsed;
  if (values.slug !== existing.slug) {
    return {
      status: "error",
      message: "주소(slug)는 생성 후 수정할 수 없습니다.",
      fieldErrors: { slug: "주소를 변경할 수 없습니다." },
    };
  }

  const { supabase } = await requireEditorSupabase();
  const { error } = await supabase
    .from("series")
    .update({
      title: values.title,
      description: values.description,
      introduction: values.introduction,
      display_order: values.display_order,
      status: values.status,
    })
    .eq("id", seriesId);

  if (error) {
    return {
      status: "error",
      message: "연재를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  redirect("/admin/series");
}


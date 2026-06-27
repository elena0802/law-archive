import "server-only";

import { requireEditorSupabase } from "@/lib/admin/require-editor";

export const ESSAY_IMAGE_BUCKET = "essays";
export const MAX_ESSAY_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_ESSAY_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedEssayImageType = (typeof ALLOWED_ESSAY_IMAGE_TYPES)[number];

export type EssayImageUploadResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

function sanitizeFilename(name: string) {
  const base = name.split(/[/\\]/).pop() ?? "image";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "image";
}

function extensionForMime(mime: AllowedEssayImageType) {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

export function buildEssayImageStoragePath(
  essayId: string | undefined,
  filename: string,
  mime: AllowedEssayImageType,
) {
  const timestamp = Date.now();
  let safeName = sanitizeFilename(filename);

  if (!/\.[a-zA-Z0-9]+$/.test(safeName)) {
    safeName = `${safeName}.${extensionForMime(mime)}`;
  }

  if (essayId?.trim()) {
    return `${essayId.trim()}/${timestamp}-${safeName}`;
  }

  return `tmp/${timestamp}-${safeName}`;
}

export function validateEssayImageFile(file: File): EssayImageUploadResult | { ok: true } {
  if (!ALLOWED_ESSAY_IMAGE_TYPES.includes(file.type as AllowedEssayImageType)) {
    return {
      ok: false,
      message: "JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.",
    };
  }

  if (file.size > MAX_ESSAY_IMAGE_BYTES) {
    return {
      ok: false,
      message: "이미지 크기는 5MB 이하여야 합니다.",
    };
  }

  return { ok: true };
}

export async function uploadEssayImageFile(
  file: File,
  essayId?: string,
): Promise<EssayImageUploadResult> {
  const validation = validateEssayImageFile(file);
  if (!validation.ok) {
    return validation;
  }

  const mime = file.type as AllowedEssayImageType;
  const fallbackName = `cover.${extensionForMime(mime)}`;
  const storagePath = buildEssayImageStoragePath(essayId, file.name || fallbackName, mime);

  const { supabase } = await requireEditorSupabase();
  const { error } = await supabase.storage.from(ESSAY_IMAGE_BUCKET).upload(storagePath, file, {
    cacheControl: "3600",
    contentType: mime,
    upsert: false,
  });

  if (error) {
    console.error("[uploadEssayImageFile] upload failed", { error, storagePath });
    return {
      ok: false,
      message: "이미지를 업로드하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  const { data } = supabase.storage.from(ESSAY_IMAGE_BUCKET).getPublicUrl(storagePath);

  if (!data.publicUrl) {
    return {
      ok: false,
      message: "업로드된 이미지 URL을 가져오지 못했습니다.",
    };
  }

  return { ok: true, url: data.publicUrl };
}

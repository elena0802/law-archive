import "server-only";

import { requireEditorSupabase } from "@/lib/admin/require-editor";

export const NEWS_IMAGE_BUCKET = "news";
export const MAX_NEWS_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_NEWS_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedNewsImageType = (typeof ALLOWED_NEWS_IMAGE_TYPES)[number];

export type NewsImageUploadResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

function sanitizeFilename(name: string) {
  const base = name.split(/[/\\]/).pop() ?? "image";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "image";
}

function extensionForMime(mime: AllowedNewsImageType) {
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

export function buildNewsImageStoragePath(
  newsItemId: string | undefined,
  filename: string,
  mime: AllowedNewsImageType,
) {
  const timestamp = Date.now();
  let safeName = sanitizeFilename(filename);

  if (!/\.[a-zA-Z0-9]+$/.test(safeName)) {
    safeName = `${safeName}.${extensionForMime(mime)}`;
  }

  if (newsItemId?.trim()) {
    return `${newsItemId.trim()}/${timestamp}-${safeName}`;
  }

  return `tmp/${timestamp}-${safeName}`;
}

export function validateNewsImageFile(file: File): NewsImageUploadResult | { ok: true } {
  if (!ALLOWED_NEWS_IMAGE_TYPES.includes(file.type as AllowedNewsImageType)) {
    return {
      ok: false,
      message: "JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.",
    };
  }

  if (file.size > MAX_NEWS_IMAGE_BYTES) {
    return {
      ok: false,
      message: "이미지 크기는 5MB 이하여야 합니다.",
    };
  }

  return { ok: true };
}

export async function uploadNewsImageFile(
  file: File,
  newsItemId?: string,
): Promise<NewsImageUploadResult> {
  const validation = validateNewsImageFile(file);
  if (!validation.ok) {
    return validation;
  }

  const mime = file.type as AllowedNewsImageType;
  const fallbackName = `poster.${extensionForMime(mime)}`;
  const storagePath = buildNewsImageStoragePath(newsItemId, file.name || fallbackName, mime);

  const { supabase } = await requireEditorSupabase();
  const { error } = await supabase.storage.from(NEWS_IMAGE_BUCKET).upload(storagePath, file, {
    cacheControl: "3600",
    contentType: mime,
    upsert: false,
  });

  if (error) {
    console.error("[uploadNewsImageFile] upload failed", { error, storagePath });
    return {
      ok: false,
      message: "이미지를 업로드하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  const { data } = supabase.storage.from(NEWS_IMAGE_BUCKET).getPublicUrl(storagePath);

  if (!data.publicUrl) {
    return {
      ok: false,
      message: "업로드된 이미지 URL을 가져오지 못했습니다.",
    };
  }

  return { ok: true, url: data.publicUrl };
}

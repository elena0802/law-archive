import type { CurationType } from "@/lib/content/db-types";
import {
  CURATION_TYPES,
  extractYouTubeVideoId,
  isValidHttpUrl,
  parseCurationType,
} from "@/lib/curation/youtube";

export type CurationFormValues = {
  type: CurationType;
  title: string;
  description: string;
  url: string;
  source: string;
  thumbnail_url: string;
  published_at: string;
  recommended_at: string;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
};

export type CurationFormFieldErrors = Partial<Record<keyof CurationFormValues, string>>;

export type ParsedCurationForm =
  | { ok: true; values: CurationFormValues }
  | { ok: false; errors: CurationFormFieldErrors; message: string };

function readString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readSortOrder(formData: FormData) {
  const raw = readString(formData, "sort_order");
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function parseCurationForm(formData: FormData): ParsedCurationForm {
  const type = parseCurationType(formData.get("type"));
  const title = readString(formData, "title");
  const description = readString(formData, "description");
  const url = readString(formData, "url");
  const source = readString(formData, "source");
  const thumbnail_url = readString(formData, "thumbnail_url");
  const published_at = readString(formData, "published_at");
  const recommended_at = readString(formData, "recommended_at");
  const is_featured = formData.get("is_featured") === "on";
  const is_visible = formData.get("is_visible") === "on";
  const sort_order = readSortOrder(formData);
  const errors: CurationFormFieldErrors = {};

  if (!type || !CURATION_TYPES.includes(type)) {
    errors.type = "콘텐츠 유형을 선택해 주세요.";
  }

  if (!title) {
    errors.title = "제목을 입력해 주세요.";
  }

  if (!url) {
    errors.url = "링크(URL)를 입력해 주세요.";
  } else if (!isValidHttpUrl(url)) {
    errors.url = "http:// 또는 https://로 시작하는 올바른 주소를 입력해 주세요.";
  } else if (type === "youtube" && !extractYouTubeVideoId(url)) {
    errors.url = "유튜브 동영상 주소를 확인해 주세요.";
  }

  if (!recommended_at) {
    errors.recommended_at = "추천 날짜를 선택해 주세요.";
  }

  if (!Number.isFinite(sort_order)) {
    errors.sort_order = "정렬 순서를 숫자로 입력해 주세요.";
  } else if (sort_order < 0) {
    errors.sort_order = "정렬 순서는 0 이상이어야 합니다.";
  }

  if (Object.keys(errors).length > 0 || !type) {
    return {
      ok: false,
      errors,
      message: "입력 내용을 확인해 주세요.",
    };
  }

  return {
    ok: true,
    values: {
      type,
      title,
      description,
      url,
      source,
      thumbnail_url,
      published_at,
      recommended_at,
      is_featured,
      is_visible,
      sort_order,
    },
  };
}

export function emptyCurationFormValues(): CurationFormValues {
  const today = new Date().toISOString().slice(0, 10);

  return {
    type: "article",
    title: "",
    description: "",
    url: "",
    source: "",
    thumbnail_url: "",
    published_at: "",
    recommended_at: today,
    is_featured: false,
    is_visible: true,
    sort_order: 0,
  };
}

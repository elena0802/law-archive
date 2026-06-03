import type { EssayStatus } from "@/lib/content/db-types";
import { resolveStatusFromForm } from "@/lib/admin/save-intent";
import { parseOptionalSeriesOrder } from "@/lib/content/parse-series-order";

export type EssayFormValues = {
  title: string;
  slug: string;
  description: string;
  content: string;
  essay_date: string;
  category: string;
  series_slug: string;
  series_order: number | null;
  status: EssayStatus;
  featured: boolean;
};

export type EssayFormFieldErrors = Partial<Record<keyof EssayFormValues, string>>;

export type ParsedEssayForm =
  | { ok: true; values: EssayFormValues }
  | { ok: false; errors: EssayFormFieldErrors; message: string };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeEssaySlug(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function parseEssayForm(formData: FormData): ParsedEssayForm {
  const title = readString(formData, "title");
  const slug = normalizeEssaySlug(readString(formData, "slug"));
  const description = readString(formData, "description");
  const content = readString(formData, "content");
  const essay_date = readString(formData, "essay_date");
  const category = readString(formData, "category");
  const series_slug = readString(formData, "series_slug");
  const series_order = parseOptionalSeriesOrder(
    readString(formData, "series_order"),
  );
  const featured = formData.get("featured") === "on";
  const errors: EssayFormFieldErrors = {};

  const status = resolveStatusFromForm(formData);

  if (!title) {
    errors.title = "제목을 입력해 주세요.";
  }

  if (!slug) {
    errors.slug = "주소(slug)를 입력해 주세요.";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug =
      "주소는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.";
  }

  if (!description) {
    errors.description = "한 줄 소개를 입력해 주세요.";
  }

  if (!content) {
    errors.content = "본문을 입력해 주세요.";
  }

  if (!essay_date) {
    errors.essay_date = "글 날짜를 선택해 주세요.";
  }

  if (!category) {
    errors.category = "분류를 입력해 주세요.";
  }

  if (!series_slug) {
    errors.series_slug = "연재를 선택해 주세요.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      message: "입력 내용을 확인해 주세요.",
    };
  }

  return {
    ok: true,
    values: {
      title,
      slug,
      description,
      content,
      essay_date,
      category,
      series_slug,
      series_order,
      status,
      featured,
    },
  };
}

export function emptyEssayFormValues(): EssayFormValues {
  const today = new Date().toISOString().slice(0, 10);

  return {
    title: "",
    slug: "",
    description: "",
    content: "",
    essay_date: today,
    category: "",
    series_slug: "",
    series_order: null,
    status: "draft",
    featured: false,
  };
}

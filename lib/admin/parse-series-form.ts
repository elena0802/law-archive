import type { SeriesStatus } from "@/lib/content/db-types";
import {
  isValidSeriesSlug,
  parseSeriesStatus,
  resolveSeriesSlug,
} from "@/lib/admin/series-slug";

export type SeriesFormValues = {
  title: string;
  slug: string;
  description: string;
  introduction: string;
  display_order: number;
  status: SeriesStatus;
};

export type SeriesFormFieldErrors = Partial<Record<keyof SeriesFormValues, string>>;

export type ParsedSeriesForm =
  | { ok: true; values: SeriesFormValues }
  | { ok: false; errors: SeriesFormFieldErrors; message: string };

function readString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readDisplayOrder(formData: FormData) {
  const raw = readString(formData, "display_order");
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function parseSeriesForm(formData: FormData): ParsedSeriesForm {
  const title = readString(formData, "title");
  const slug = resolveSeriesSlug(title, readString(formData, "slug"));
  const description = readString(formData, "description");
  const introduction = readString(formData, "introduction");
  const display_order = readDisplayOrder(formData);
  const status = parseSeriesStatus(formData.get("status"));
  const errors: SeriesFormFieldErrors = {};

  if (!title) {
    errors.title = "연재 제목을 입력해 주세요.";
  }
  if (!slug) {
    errors.slug = "주소(slug)를 입력해 주세요.";
  } else if (!isValidSeriesSlug(slug)) {
    errors.slug = "주소는 글자, 숫자, 하이픈(-)만 사용할 수 있습니다.";
  }
  if (!Number.isFinite(display_order)) {
    errors.display_order = "정렬 순서를 숫자로 입력해 주세요.";
  } else if (display_order < 1) {
    errors.display_order = "정렬 순서는 1 이상이어야 합니다.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, message: "입력 내용을 확인해 주세요." };
  }

  return {
    ok: true,
    values: {
      title,
      slug,
      description,
      introduction,
      display_order,
      status,
    },
  };
}

export function emptySeriesFormValues(): SeriesFormValues {
  return {
    title: "",
    slug: "",
    description: "",
    introduction: "",
    display_order: 1,
    status: "active",
  };
}


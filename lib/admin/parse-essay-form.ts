import type { EssayStatus } from "@/lib/content/db-types";
import { readSaveIntent, resolveStatusFromForm } from "@/lib/admin/save-intent";
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

export type EssayParsedValues = Omit<EssayFormValues, "series_slug"> & {
  series_slug: string | null;
};

export type EssayFormFieldErrors = Partial<Record<keyof EssayFormValues, string>>;

export type ParsedEssayForm =
  | { ok: true; values: EssayParsedValues }
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

/** Client-side slug hint from title (ASCII). Server fills in on save if empty. */
export function generateEssaySlugFromTitle(title: string) {
  return normalizeEssaySlug(title);
}

function readString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function buildDraftSlug(title: string, rawSlug: string) {
  const fromInput = normalizeEssaySlug(rawSlug);
  if (fromInput) {
    return fromInput;
  }

  const fromTitle = normalizeEssaySlug(title);
  if (fromTitle) {
    return fromTitle;
  }

  return `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function resolveDraftDefaults({
  title,
  slug,
  description,
  content,
  essay_date,
  category,
  series_slug,
}: {
  title: string;
  slug: string;
  description: string;
  content: string;
  essay_date: string;
  category: string;
  series_slug: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return {
    title,
    slug: buildDraftSlug(title, slug),
    description,
    content,
    essay_date: essay_date || today,
    category,
    series_slug: series_slug || null,
  };
}

export function parseEssayForm(formData: FormData): ParsedEssayForm {
  const intent = readSaveIntent(formData);
  const isPublish = intent === "publish";

  const title = readString(formData, "title");
  const rawSlug = readString(formData, "slug");
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

  if (isPublish) {
    const slug = normalizeEssaySlug(rawSlug) || buildDraftSlug(title, "");

    if (!slug) {
      errors.slug = "주소(slug)를 입력해 주세요.";
    } else if (!SLUG_PATTERN.test(slug)) {
      errors.slug =
        "주소는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.";
    }

    if (!content) {
      errors.content = "본문을 입력해 주세요.";
    }

    if (!essay_date) {
      errors.essay_date = "글 날짜를 선택해 주세요.";
    }

    if (!category) {
      errors.category = "주제를 선택해 주세요.";
    }

    if (!series_slug) {
      errors.series_slug = "연재를 선택해 주세요.";
    }

    if (Object.keys(errors).length > 0) {
      return {
        ok: false,
        errors,
        message: "공개하기 전에 입력 내용을 확인해 주세요.",
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
        series_slug: series_slug || null,
        series_order,
        status,
        featured,
      },
    };
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      message: "입력 내용을 확인해 주세요.",
    };
  }

  const draftDefaults = resolveDraftDefaults({
    title,
    slug: rawSlug,
    description,
    content,
    essay_date,
    category,
    series_slug,
  });

  if (!SLUG_PATTERN.test(draftDefaults.slug)) {
    return {
      ok: false,
      errors: {
        slug: "주소는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.",
      },
      message: "입력 내용을 확인해 주세요.",
    };
  }

  return {
    ok: true,
    values: {
      title: draftDefaults.title,
      slug: draftDefaults.slug,
      description: draftDefaults.description,
      content: draftDefaults.content,
      essay_date: draftDefaults.essay_date,
      category: draftDefaults.category,
      series_slug: draftDefaults.series_slug,
      series_order,
      status,
      featured,
    },
  };
}

export function emptyEssayFormValues(): Omit<EssayFormValues, "status"> & {
  status: EssayStatus;
} {
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

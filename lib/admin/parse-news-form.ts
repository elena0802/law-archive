import { NEWS_CATEGORIES, FEATURED_CTA_BEHAVIORS, type FeaturedCtaBehavior, type NewsCategory } from "@/lib/news/types";

export type NewsFormValues = {
  date: string;
  category: NewsCategory;
  title: string;
  summary: string;
  image: string;
  link: string;
  featured: boolean;
  published: boolean;
  featuredCtaBehavior: FeaturedCtaBehavior;
};

export type NewsFormFieldErrors = Partial<Record<keyof NewsFormValues, string>>;

export type ParsedNewsForm =
  | { ok: true; values: NewsFormValues }
  | { ok: false; errors: NewsFormFieldErrors; message: string };

function readString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isValidHttpUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseNewsForm(formData: FormData): ParsedNewsForm {
  const date = readString(formData, "date");
  const category = readString(formData, "category");
  const title = readString(formData, "title");
  const summary = readString(formData, "summary");
  const image = readString(formData, "image");
  const link = readString(formData, "link");
  const featuredCtaBehavior = readString(formData, "featured_cta_behavior");
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";

  const errors: NewsFormFieldErrors = {};

  if (!date) {
    errors.date = "날짜를 선택해 주세요.";
  }

  if (!NEWS_CATEGORIES.includes(category as NewsCategory)) {
    errors.category = "분류를 선택해 주세요.";
  }

  if (!title) {
    errors.title = "제목을 입력해 주세요.";
  }

  if (!summary) {
    errors.summary = "요약을 입력해 주세요.";
  }

  if (image && !image.startsWith("/") && !isValidHttpUrl(image)) {
    errors.image = "이미지 URL은 /images/... 또는 http(s):// 형식이어야 합니다.";
  }

  if (link && !isValidHttpUrl(link)) {
    errors.link = "링크는 http:// 또는 https:// 주소여야 합니다.";
  }

  if (
    featuredCtaBehavior &&
    !FEATURED_CTA_BEHAVIORS.includes(featuredCtaBehavior as FeaturedCtaBehavior)
  ) {
    errors.featuredCtaBehavior = "하이라이트 버튼 동작을 선택해 주세요.";
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
      date,
      category: category as NewsCategory,
      title,
      summary,
      image,
      link,
      featured,
      published,
      featuredCtaBehavior: (featuredCtaBehavior || "link") as FeaturedCtaBehavior,
    },
  };
}

export function emptyNewsFormValues(): NewsFormValues {
  const today = new Date().toISOString().slice(0, 10);

  return {
    date: today,
    category: "학회",
    title: "",
    summary: "",
    image: "",
    link: "",
    featured: false,
    published: true,
    featuredCtaBehavior: "link",
  };
}

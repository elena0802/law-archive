export const NEWS_CATEGORIES = [
  "학회",
  "학술제",
  "강연",
  "연재",
  "기고",
  "인터뷰",
  "프로젝트",
  "사이트",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const FEATURED_CTA_BEHAVIORS = ["image", "link", "none"] as const;

export type FeaturedCtaBehavior = (typeof FEATURED_CTA_BEHAVIORS)[number];

export function resolveFeaturedCtaBehavior(
  value: string | undefined | null,
): FeaturedCtaBehavior {
  if (value === "image" || value === "link" || value === "none") {
    return value;
  }
  return "link";
}

export type NewsItem = {
  id: string;
  date: string;
  category: NewsCategory;
  title: string;
  summary: string;
  featured?: boolean;
  published?: boolean;
  image?: string;
  link?: string;
  featuredCtaBehavior?: FeaturedCtaBehavior;
};

export type NewsMonthGroup = {
  monthKey: string;
  label: string;
  items: NewsItem[];
};

export const newsPagePath = "/news";

export const newsPageDescription =
  "형사법과 AI를 둘러싼 연구 활동을 기록합니다.";

export function formatNewsDisplayDate(isoDate: string) {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

/** Month group headings use YYYY.MM; timeline rows use MM.DD. */
export function formatNewsTimelineDay(isoDate: string) {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${month}.${day}`;
}

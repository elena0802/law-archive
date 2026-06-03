import { getSeriesSlug } from "@/lib/content/series-slug";

export function getCategorySlug(category: string) {
  return getSeriesSlug(category);
}

function decodeSlugParam(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/** Normalize a `/categories/[slug]` route param to the canonical category slug. */
export function resolveCategorySlugParam(slug: string) {
  return getCategorySlug(decodeSlugParam(slug));
}


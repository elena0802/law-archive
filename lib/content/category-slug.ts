import { getSeriesSlug } from "@/lib/content/series-slug";

export function getCategorySlug(category: string) {
  return getSeriesSlug(category);
}


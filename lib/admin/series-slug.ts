import type { SeriesStatus } from "@/lib/content/db-types";
import { getSeriesSlug } from "@/lib/content/series-slug";

export type AdminSeriesListFilter = "all" | SeriesStatus;

const SLUG_PATTERN = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

export function normalizeSeriesSlug(raw: string) {
  return getSeriesSlug(raw);
}

export function generateSeriesSlugFromTitle(title: string) {
  return getSeriesSlug(title);
}

export function resolveSeriesSlug(title: string, rawSlug: string) {
  const fromInput = normalizeSeriesSlug(rawSlug);
  if (fromInput) {
    return fromInput;
  }

  return normalizeSeriesSlug(title);
}

export function parseSeriesStatus(value: unknown): SeriesStatus {
  return value === "hidden" ? "hidden" : "active";
}

export function parseSeriesFilter(value: string | undefined): AdminSeriesListFilter {
  if (value === "active" || value === "hidden") {
    return value;
  }
  return "all";
}

export function isValidSeriesSlug(slug: string) {
  return SLUG_PATTERN.test(slug.normalize("NFKC"));
}

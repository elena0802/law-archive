import type { Essay } from "@/lib/essays";
import { getEssayCoverSrc } from "@/lib/home-images";

export type EssayCoverImageSource = Pick<
  Essay,
  "slug" | "title" | "coverImageUrl" | "coverImageAlt"
>;

export type EssayCoverImage = {
  src: string | null;
  alt: string;
};

const DEFAULT_COVER_ALT = "글 대표 이미지";

/**
 * Normalize CMS cover paths for site and email use.
 * Accepts `images/essays/foo.jpg` or `/images/essays/foo.jpg` or absolute URLs.
 */
export function normalizeEssayCoverImageSrc(
  raw: string | null | undefined,
): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `/${trimmed.replace(/^\/+/, "")}`;
}

/** @deprecated Use normalizeEssayCoverImageSrc */
export const normalizeCoverImagePreviewSrc = normalizeEssayCoverImageSrc;

function resolveCoverAlt(essay: EssayCoverImageSource) {
  return essay.coverImageAlt?.trim() || essay.title.trim() || DEFAULT_COVER_ALT;
}

/**
 * Resolve an essay cover image for cards, detail, newsletter, and OG.
 *
 * Priority: CMS `coverImageUrl` → slug filesystem fallback → null.
 */
export function getEssayCoverImage(essay: EssayCoverImageSource): EssayCoverImage {
  const alt = resolveCoverAlt(essay);
  const cmsSrc = normalizeEssayCoverImageSrc(essay.coverImageUrl);

  if (cmsSrc) {
    return { src: cmsSrc, alt };
  }

  const slugSrc = getEssayCoverSrc(essay.slug);
  if (slugSrc) {
    return { src: slugSrc, alt };
  }

  return { src: null, alt };
}

export function toAbsoluteCoverImageUrl(
  src: string,
  siteOrigin: string,
): string {
  const normalized = normalizeEssayCoverImageSrc(src);
  if (!normalized) {
    return src.trim();
  }

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://")
  ) {
    return normalized;
  }

  return `${siteOrigin.replace(/\/$/, "")}${normalized}`;
}

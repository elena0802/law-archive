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
  const cmsUrl = essay.coverImageUrl?.trim();

  if (cmsUrl) {
    return { src: cmsUrl, alt };
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
  const trimmed = src.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${siteOrigin.replace(/\/$/, "")}${trimmed}`;
  }

  return trimmed;
}

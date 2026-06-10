import "server-only";

import {
  normalizeEssayCoverImageSrc,
  type EssayCoverImage,
  type EssayCoverImageSource,
} from "@/lib/essay-cover-url";
import { getEssayCoverSrc } from "@/lib/home-images";

export type { EssayCoverImage, EssayCoverImageSource };

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

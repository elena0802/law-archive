import type { Essay } from "@/lib/essays";

export type EssayCoverImageSource = Pick<
  Essay,
  "slug" | "title" | "coverImageUrl" | "coverImageAlt"
>;

export type EssayCoverImage = {
  src: string | null;
  alt: string;
};

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

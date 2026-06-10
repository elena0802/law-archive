import { normalizeEssayCoverImageSrc } from "@/lib/essay-cover-image";

export function toDigestAbsoluteImageUrl(
  pathOrUrl: string | null | undefined,
  siteOrigin: string,
): string | null {
  const normalized = normalizeEssayCoverImageSrc(pathOrUrl);
  if (!normalized) {
    return null;
  }

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://")
  ) {
    return normalized;
  }

  return `${siteOrigin.replace(/\/$/, "")}${normalized}`;
}

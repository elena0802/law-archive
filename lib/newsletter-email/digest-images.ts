export function toDigestAbsoluteImageUrl(
  pathOrUrl: string | null | undefined,
  siteOrigin: string,
): string | null {
  const trimmed = pathOrUrl?.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${siteOrigin.replace(/\/$/, "")}${trimmed}`;
  }

  return null;
}

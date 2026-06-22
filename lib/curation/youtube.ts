import type { CurationType } from "@/lib/content/db-types";

const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function extractYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id && id.length === 11 ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id && id.length === 11 ? id : null;
      }

      const embedMatch = parsed.pathname.match(/^\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) {
        return embedMatch[1];
      }
    }
  } catch {
    // fall through to regex
  }

  const match = trimmed.match(YOUTUBE_ID_PATTERN);
  return match?.[1] ?? null;
}

export function buildYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function buildYouTubeThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function resolveCurationThumbnail(
  type: CurationType,
  url: string,
  thumbnailUrl: string | null,
) {
  const stored = thumbnailUrl?.trim();
  if (stored) {
    return stored;
  }

  if (type === "youtube") {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      return buildYouTubeThumbnailUrl(videoId);
    }
  }

  return null;
}

export function isValidHttpUrl(raw: string) {
  try {
    const parsed = new URL(raw.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const CURATION_TYPE_LABELS: Record<CurationType, string> = {
  youtube: "영상",
  article: "기사",
  blog: "외부글",
  paper: "논문",
  book: "책",
};

export const CURATION_TYPES: CurationType[] = [
  "youtube",
  "article",
  "blog",
  "paper",
  "book",
];

export function parseCurationType(value: unknown): CurationType | null {
  if (typeof value !== "string") {
    return null;
  }

  return CURATION_TYPES.includes(value as CurationType)
    ? (value as CurationType)
    : null;
}

import fs from "node:fs";
import path from "node:path";

const COVER_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

type HomeImageDirectory = "essays" | "series" | "ai-research";

function resolveHomeImageSrc(
  directory: HomeImageDirectory,
  basename: string,
): string | null {
  const imageDir = path.join(process.cwd(), "public", "images", directory);

  for (const extension of COVER_EXTENSIONS) {
    const filePath = path.join(imageDir, `${basename}${extension}`);
    if (fs.existsSync(filePath)) {
      return `/images/${directory}/${basename}${extension}`;
    }
  }

  return null;
}

const SERIES_COVER_BASENAME_OVERRIDES: Record<string, string> = {
  // Supabase/MDX series slugs are generated from Korean titles, but some
  // image assets use stable English basenames.
  "형사법-교수로-산다는-것": "life-as-criminal-law-professor",
  "사법시험-출제위원을-하며-느낀-것": "ai-and-criminal-law",
};

const AI_RESEARCH_COVER_BASENAME_OVERRIDES: Record<string, string> = {
  // Expected asset might be missing; fall back to an existing real cover.
  "ai-and-criminal-law": "legal-education-and-ai",
  "로스쿨-시대와-ai": "legal-education-and-ai",
};

/** Fixed editorial covers for homepage 최근 글 slots (not tied to essay slug). */
const HOME_RECENT_ESSAY_COVER_BASENAMES = [
  "life-as-criminal-law-professor-04",
  "life-as-criminal-law-professor-05",
  "life-as-criminal-law-professor-06",
] as const;

/** `public/images/essays/{slug}.{jpg|jpeg|png|webp}` */
export function getEssayCoverSrc(slug: string): string | null {
  return resolveHomeImageSrc("essays", slug);
}

/** Homepage 최근 글 card image by position (0–2), independent of essay slug. */
export function getHomeRecentEssayCoverSrc(slotIndex: number): string | null {
  const basename = HOME_RECENT_ESSAY_COVER_BASENAMES[slotIndex];
  if (!basename) {
    return null;
  }

  return resolveHomeImageSrc("essays", basename);
}

/** `public/images/series/{slug}.{jpg|jpeg|png|webp}` */
export function getSeriesCoverSrc(slug: string): string | null {
  const direct = resolveHomeImageSrc("series", slug);
  if (direct) {
    return direct;
  }

  const override = SERIES_COVER_BASENAME_OVERRIDES[slug];
  return override ? resolveHomeImageSrc("series", override) : null;
}

/** `public/images/ai-research/{imageKey}.{jpg|jpeg|png|webp}` */
export function getAiResearchCoverSrc(imageKey: string): string | null {
  const direct = resolveHomeImageSrc("ai-research", imageKey);
  if (direct) {
    return direct;
  }

  const override = AI_RESEARCH_COVER_BASENAME_OVERRIDES[imageKey];
  return override ? resolveHomeImageSrc("ai-research", override) : null;
}

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

/** `public/images/essays/{slug}.{jpg|jpeg|png|webp}` */
export function getEssayCoverSrc(slug: string): string | null {
  return resolveHomeImageSrc("essays", slug);
}

/** `public/images/series/{slug}.{jpg|jpeg|png|webp}` */
export function getSeriesCoverSrc(slug: string): string | null {
  return resolveHomeImageSrc("series", slug);
}

/** `public/images/ai-research/{imageKey}.{jpg|jpeg|png|webp}` */
export function getAiResearchCoverSrc(imageKey: string): string | null {
  return resolveHomeImageSrc("ai-research", imageKey);
}

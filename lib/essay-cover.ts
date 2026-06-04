import fs from "node:fs";
import path from "node:path";

const ESSAY_COVER_DIR = path.join(process.cwd(), "public", "images", "essays");

const COVER_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

/** Public URL for an essay cover when `public/images/essays/{slug}.{ext}` exists. */
export function getEssayCoverSrc(slug: string): string | null {
  for (const ext of COVER_EXTENSIONS) {
    const filePath = path.join(ESSAY_COVER_DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      return `/images/essays/${slug}${ext}`;
    }
  }
  return null;
}

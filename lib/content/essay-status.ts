import type { EssayStatus } from "@/lib/content/db-types";

export function isPublishedEssayStatus(status: EssayStatus) {
  return status === "published";
}

export function isPublicEssayStatus(status: EssayStatus) {
  return isPublishedEssayStatus(status);
}

export function parseEssayStatus(value: unknown): EssayStatus | null {
  if (value === "draft" || value === "published" || value === "archived") {
    return value;
  }

  return null;
}

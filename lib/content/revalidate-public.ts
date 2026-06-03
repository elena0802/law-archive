"use server";

import { revalidatePath } from "next/cache";
import { isAsciiPathSafe, isAsciiSlug } from "@/lib/content/ascii-path";

type RevalidateEssayPathsInput = {
  slug: string;
  seriesSlug: string;
  previousSlug?: string;
  previousSeriesSlug?: string;
};

const STATIC_LIST_PATHS = [
  "/",
  "/essays",
  "/series",
  "/categories",
] as const;

function revalidateAsciiPath(pathname: string) {
  if (!isAsciiPathSafe(pathname)) {
    return;
  }

  try {
    revalidatePath(pathname);
  } catch (error) {
    console.error("[revalidatePublicEssayPaths] revalidatePath failed:", {
      pathname,
      error,
    });
  }
}

function revalidateEssayDetailPath(slug: string | undefined) {
  if (!slug || !isAsciiSlug(slug)) {
    return;
  }

  revalidateAsciiPath(`/essays/${slug}`);
}

/**
 * On-demand revalidation after admin essay saves.
 * Skips Korean (non-Latin-1) series/category detail paths to avoid ByteString errors.
 */
export async function revalidatePublicEssayPaths({
  slug,
  previousSlug,
}: RevalidateEssayPathsInput) {
  for (const pathname of STATIC_LIST_PATHS) {
    revalidateAsciiPath(pathname);
  }

  revalidateEssayDetailPath(slug);
  revalidateEssayDetailPath(previousSlug);
}

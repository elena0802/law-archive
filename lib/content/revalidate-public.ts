"use server";

import { revalidatePath } from "next/cache";

type RevalidateEssayPathsInput = {
  slug: string;
  seriesSlug: string;
  previousSlug?: string;
  previousSeriesSlug?: string;
};

/**
 * On-demand revalidation for public essay and series routes after admin saves.
 */
function safeRevalidatePath(pathname: string) {
  try {
    revalidatePath(pathname);
  } catch (error) {
    // Non-ASCII path segments (e.g. Korean series slugs) can break cache tag headers.
    console.error("[revalidatePublicEssayPaths] revalidatePath failed:", {
      pathname,
      error,
    });
  }
}

export async function revalidatePublicEssayPaths({
  slug,
  seriesSlug,
  previousSlug,
  previousSeriesSlug,
}: RevalidateEssayPathsInput) {
  try {
    safeRevalidatePath("/");
    safeRevalidatePath("/essays");
    safeRevalidatePath(`/essays/${slug}`);

    if (previousSlug && previousSlug !== slug) {
      safeRevalidatePath(`/essays/${previousSlug}`);
    }

    safeRevalidatePath("/series");
    safeRevalidatePath(`/series/${seriesSlug}`);

    if (previousSeriesSlug && previousSeriesSlug !== seriesSlug) {
      safeRevalidatePath(`/series/${previousSeriesSlug}`);
    }
  } catch (error) {
    console.error("[revalidatePublicEssayPaths] failed:", {
      slug,
      seriesSlug,
      previousSlug,
      previousSeriesSlug,
      error,
    });
  }
}

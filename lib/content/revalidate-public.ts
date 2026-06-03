"use server";

import { revalidatePath } from "next/cache";

type RevalidateEssayPathsInput = {
  slug: string;
  seriesSlug: string;
  previousSlug?: string;
  previousSeriesSlug?: string;
};

/**
 * Diagnostic: revalidation is OFF by default until ByteString cause is confirmed.
 * Set ADMIN_ESSAY_REVALIDATION_ENABLED=1 in Vercel to turn revalidatePath back on.
 */
function isEssaySaveRevalidationSkipped() {
  return process.env.ADMIN_ESSAY_REVALIDATION_ENABLED !== "1";
}

function hasNonAscii(value: string) {
  for (let i = 0; i < value.length; i += 1) {
    if (value.charCodeAt(i) > 255) {
      return { index: i, codePoint: value.charCodeAt(i), char: value[i] };
    }
  }
  return null;
}

/**
 * On-demand revalidation for public essay and series routes after admin saves.
 */
function safeRevalidatePath(pathname: string) {
  const nonAscii = hasNonAscii(pathname);
  if (nonAscii) {
    console.error(
      "[revalidatePublicEssayPaths] skipping path with non-Latin-1 character:",
      { pathname, ...nonAscii },
    );
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

export async function revalidatePublicEssayPaths(
  input: RevalidateEssayPathsInput,
) {
  if (isEssaySaveRevalidationSkipped()) {
    console.error(
      "[revalidatePublicEssayPaths] SKIPPED (set ADMIN_ESSAY_REVALIDATION_ENABLED=1 to enable)",
      input,
    );
    return;
  }

  const { slug, seriesSlug, previousSlug, previousSeriesSlug } = input;

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

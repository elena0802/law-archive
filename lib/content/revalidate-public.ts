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
export async function revalidatePublicEssayPaths({
  slug,
  seriesSlug,
  previousSlug,
  previousSeriesSlug,
}: RevalidateEssayPathsInput) {
  revalidatePath("/");
  revalidatePath("/essays");
  revalidatePath(`/essays/${slug}`);

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/essays/${previousSlug}`);
  }

  revalidatePath("/series");
  revalidatePath(`/series/${seriesSlug}`);

  if (previousSeriesSlug && previousSeriesSlug !== seriesSlug) {
    revalidatePath(`/series/${previousSeriesSlug}`);
  }
}

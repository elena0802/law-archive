"use server";

import { revalidatePath } from "next/cache";
import { isAsciiPathSafe } from "@/lib/content/ascii-path";

function revalidateAsciiPath(pathname: string) {
  if (!isAsciiPathSafe(pathname)) {
    return;
  }

  try {
    revalidatePath(pathname);
  } catch (error) {
    console.error("[revalidatePublicSeriesPaths] revalidatePath failed:", {
      pathname,
      error,
    });
  }
}

/** On-demand revalidation after admin series saves. */
export async function revalidatePublicSeriesPaths(seriesSlug?: string) {
  revalidateAsciiPath("/");
  revalidateAsciiPath("/series");

  if (seriesSlug) {
    revalidateAsciiPath(`/series/${seriesSlug}`);
  }
}

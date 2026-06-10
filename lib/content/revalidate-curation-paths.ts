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
    console.error("[revalidatePublicCurationPaths] revalidatePath failed:", {
      pathname,
      error,
    });
  }
}

/** On-demand revalidation after admin curation saves. */
export async function revalidatePublicCurationPaths() {
  revalidateAsciiPath("/");
  revalidateAsciiPath("/curation");
}

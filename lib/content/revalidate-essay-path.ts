import { revalidatePath } from "next/cache";
import { isAsciiSlug } from "@/lib/content/ascii-path";

export function revalidateEssayPath(slug: string) {
  if (!slug || !isAsciiSlug(slug)) {
    return;
  }

  try {
    revalidatePath(`/essays/${slug}`);
  } catch (error) {
    console.error("[revalidateEssayPath] revalidatePath failed:", {
      slug,
      error,
    });
  }
}

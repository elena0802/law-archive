"use server";

import { revalidatePath } from "next/cache";
import { createComment } from "@/lib/comments";
import type { CommentActionState } from "@/lib/comment-action-state";

export async function submitComment(
  _prevState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const essaySlug = String(formData.get("essay_slug") ?? "").trim();
  const authorName = String(formData.get("author_name") ?? "");
  const authorAffiliation = String(formData.get("author_affiliation") ?? "");
  const content = String(formData.get("content") ?? "");

  const result = await createComment({
    essaySlug,
    authorName,
    authorAffiliation,
    content,
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  revalidatePath(`/essays/${essaySlug}`);

  return {
    status: "success",
    message: "댓글이 등록되었습니다.",
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { createComment, deleteCommentWithPassword } from "@/lib/comments";
import type {
  CommentActionState,
  CommentDeleteActionState,
} from "@/lib/comment-action-state";

export async function submitComment(
  _prevState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const essaySlug = String(formData.get("essay_slug") ?? "").trim();
  const authorName = String(formData.get("author_name") ?? "");
  const authorAffiliation = String(formData.get("author_affiliation") ?? "");
  const content = String(formData.get("content") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await createComment({
    essaySlug,
    authorName,
    authorAffiliation,
    content,
    password,
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

export async function deleteComment(
  _prevState: CommentDeleteActionState,
  formData: FormData,
): Promise<CommentDeleteActionState> {
  const essaySlug = String(formData.get("essay_slug") ?? "").trim();
  const commentId = String(formData.get("comment_id") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const result = await deleteCommentWithPassword(
    commentId,
    essaySlug,
    password,
  );

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
    };
  }

  revalidatePath(`/essays/${essaySlug}`);

  return {
    status: "success",
    message: "댓글이 삭제되었습니다.",
  };
}

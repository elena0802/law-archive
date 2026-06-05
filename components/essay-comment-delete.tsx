"use client";

import { useActionState, useState } from "react";
import { deleteComment } from "@/app/(site)/essays/[slug]/comment-actions";
import {
  commentDeleteActionIdleState,
  type CommentDeleteActionState,
} from "@/lib/comment-action-state";

const fieldClassName =
  "mt-2 w-full max-w-xs rounded border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25";

const labelClassName = "text-keep block text-sm text-ink-muted";

type EssayCommentDeleteProps = {
  commentId: string;
  essaySlug: string;
  inline?: boolean;
  className?: string;
};

export function EssayCommentDelete({
  commentId,
  essaySlug,
  inline = false,
  className,
}: EssayCommentDeleteProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deleteComment,
    commentDeleteActionIdleState satisfies CommentDeleteActionState,
  );

  const buttonClassName =
    className ??
    "text-sm text-ink-muted underline-offset-4 transition hover:text-accent hover:underline";

  if (!open) {
    return (
      <button
        className={buttonClassName}
        onClick={() => setOpen(true)}
        type="button"
      >
        삭제
      </button>
    );
  }

  return (
    <form action={formAction} className={inline ? "mt-2 max-w-xs" : "mt-3 max-w-xs"}>
      <input name="comment_id" type="hidden" value={commentId} />
      <input name="essay_slug" type="hidden" value={essaySlug} />

      {state.status === "error" ? (
        <p className="text-keep mb-2 text-sm leading-6 text-ink-muted" role="alert">
          {state.message}
        </p>
      ) : null}

      <label className={labelClassName} htmlFor={`delete-password-${commentId}`}>
        비밀번호
      </label>
      <input
        autoComplete="off"
        className={fieldClassName}
        id={`delete-password-${commentId}`}
        name="password"
        required
        type="password"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          className="border border-line px-3 py-1.5 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "삭제 중…" : "삭제"}
        </button>
        <button
          className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          onClick={() => setOpen(false)}
          type="button"
        >
          취소
        </button>
      </div>
    </form>
  );
}

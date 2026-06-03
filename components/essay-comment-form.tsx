"use client";

import { useActionState } from "react";
import { submitComment } from "@/app/(site)/essays/[slug]/comment-actions";
import {
  commentActionIdleState,
  type CommentActionState,
} from "@/lib/comment-action-state";

const fieldClassName =
  "mt-3 w-full rounded border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25";

const labelClassName = "text-keep block text-sm font-medium text-ink";

type EssayCommentFormProps = {
  essaySlug: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-keep mt-2 text-sm leading-6 text-ink-muted" role="alert">
      {message}
    </p>
  );
}

export function EssayCommentForm({ essaySlug }: EssayCommentFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitComment,
    commentActionIdleState satisfies CommentActionState,
  );

  return (
    <form action={formAction} className="mt-8 border-t border-line pt-8">
      <input name="essay_slug" type="hidden" value={essaySlug} />

      {state.status === "success" || state.status === "error" ? (
        <p
          className="text-keep mb-6 text-sm leading-7 text-ink-muted"
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-6">
        <div>
          <label className={labelClassName} htmlFor="author_name">
            이름 (선택)
          </label>
          <input
            autoComplete="name"
            className={fieldClassName}
            id="author_name"
            maxLength={80}
            name="author_name"
            type="text"
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="author_affiliation">
            소속 (선택)
          </label>
          <input
            className={fieldClassName}
            id="author_affiliation"
            maxLength={120}
            name="author_affiliation"
            type="text"
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="content">
            댓글 *
          </label>
          <textarea
            className={`${fieldClassName} min-h-32 resize-y`}
            id="content"
            maxLength={5000}
            name="content"
            required
            rows={5}
          />
          <FieldError message={state.fieldErrors?.content} />
        </div>
      </div>

      <button
        className="mt-6 border border-line px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "등록 중…" : "댓글 등록"}
      </button>
    </form>
  );
}

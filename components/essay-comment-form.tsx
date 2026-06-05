"use client";

import { useActionState, useEffect } from "react";
import { submitComment } from "@/app/(site)/essays/[slug]/comment-actions";
import {
  commentActionIdleState,
  type CommentActionState,
} from "@/lib/comment-action-state";

export const commentFieldClassName =
  "mt-3 w-full rounded border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25";

export const commentLabelClassName = "text-keep block text-sm font-medium text-ink";

type EssayCommentFormProps = {
  essaySlug: string;
  parentId?: string | null;
  formId?: string;
  variant?: "top-level" | "reply";
  onCancel?: () => void;
  onSuccess?: () => void;
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

export function EssayCommentForm({
  essaySlug,
  parentId = null,
  formId = "comment",
  variant = "top-level",
  onCancel,
  onSuccess,
}: EssayCommentFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitComment,
    commentActionIdleState satisfies CommentActionState,
  );
  const isReply = variant === "reply";

  useEffect(() => {
    if (state.status === "success") {
      onSuccess?.();
    }
  }, [state.status, onSuccess]);

  const formClassName = isReply
    ? "mt-3 border-t border-line/50 pt-3"
    : "mt-8 border-t border-line pt-8";

  return (
    <form action={formAction} className={formClassName}>
      <input name="essay_slug" type="hidden" value={essaySlug} />
      {parentId ? <input name="parent_id" type="hidden" value={parentId} /> : null}

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
          <label className={commentLabelClassName} htmlFor={`${formId}-author_name`}>
            이름 (선택)
          </label>
          <input
            autoComplete="name"
            className={commentFieldClassName}
            id={`${formId}-author_name`}
            maxLength={80}
            name="author_name"
            type="text"
          />
        </div>

        <div>
          <label
            className={commentLabelClassName}
            htmlFor={`${formId}-author_affiliation`}
          >
            소속 (선택)
          </label>
          <input
            className={commentFieldClassName}
            id={`${formId}-author_affiliation`}
            maxLength={120}
            name="author_affiliation"
            type="text"
          />
        </div>

        <div>
          <label className={commentLabelClassName} htmlFor={`${formId}-content`}>
            {isReply ? "답글 *" : "댓글 *"}
          </label>
          <textarea
            className={`${commentFieldClassName} min-h-32 resize-y`}
            id={`${formId}-content`}
            maxLength={5000}
            name="content"
            required
            rows={isReply ? 4 : 5}
          />
          <FieldError message={state.fieldErrors?.content} />
        </div>

        <div>
          <label className={commentLabelClassName} htmlFor={`${formId}-password`}>
            비밀번호 *
          </label>
          <input
            autoComplete="new-password"
            className={commentFieldClassName}
            id={`${formId}-password`}
            minLength={4}
            name="password"
            required
            type="password"
          />
          <p className="text-keep mt-2 text-sm leading-6 text-ink-muted">
            댓글을 나중에 삭제할 때 사용합니다. 공개되지 않습니다.
          </p>
          <FieldError message={state.fieldErrors?.password} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          className="border border-line px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "등록 중…" : isReply ? "답글 등록" : "댓글 등록"}
        </button>
        {onCancel ? (
          <button
            className="text-sm text-ink-muted underline-offset-4 transition hover:text-ink hover:underline"
            onClick={onCancel}
            type="button"
          >
            취소
          </button>
        ) : null}
      </div>
    </form>
  );
}

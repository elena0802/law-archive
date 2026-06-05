"use client";

import { useActionState } from "react";
import { submitGuestbookEntry } from "@/app/(site)/guestbook/actions";
import {
  commentFieldClassName,
  commentLabelClassName,
} from "@/components/essay-comment-form";
import {
  guestbookActionIdleState,
  type GuestbookActionState,
} from "@/lib/guestbook-action-state";

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

export function GuestbookForm() {
  const [state, formAction, isPending] = useActionState(
    submitGuestbookEntry,
    guestbookActionIdleState satisfies GuestbookActionState,
  );

  return (
    <form action={formAction} className="border-t border-line pt-8">
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
          <label className={commentLabelClassName} htmlFor="guestbook-name">
            이름 *
          </label>
          <input
            autoComplete="name"
            className={commentFieldClassName}
            id="guestbook-name"
            maxLength={80}
            name="name"
            required
            type="text"
          />
          <FieldError message={state.fieldErrors?.name} />
        </div>

        <div>
          <label className={commentLabelClassName} htmlFor="guestbook-affiliation">
            소속 (선택)
          </label>
          <input
            className={commentFieldClassName}
            id="guestbook-affiliation"
            maxLength={120}
            name="affiliation"
            type="text"
          />
        </div>

        <div>
          <label className={commentLabelClassName} htmlFor="guestbook-content">
            안부의 글 *
          </label>
          <textarea
            className={`${commentFieldClassName} min-h-36 resize-y`}
            id="guestbook-content"
            maxLength={5000}
            name="content"
            required
            rows={6}
          />
          <FieldError message={state.fieldErrors?.content} />
        </div>

        <div>
          <label className={commentLabelClassName} htmlFor="guestbook-password">
            비밀번호 *
          </label>
          <input
            autoComplete="new-password"
            className={commentFieldClassName}
            id="guestbook-password"
            minLength={4}
            name="password"
            required
            type="password"
          />
          <p className="text-keep mt-2 text-sm leading-6 text-ink-muted">
            글을 나중에 삭제할 때 사용합니다. 공개되지 않습니다.
          </p>
          <FieldError message={state.fieldErrors?.password} />
        </div>
      </div>

      <button
        className="mt-6 border border-line px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "등록 중…" : "안부 남기기"}
      </button>
    </form>
  );
}

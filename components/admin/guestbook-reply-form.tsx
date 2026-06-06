"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveGuestbookReplyAction } from "@/app/(admin)/admin/guestbook/actions";
import {
  guestbookReplyActionIdleState,
  type GuestbookReplyActionState,
} from "@/lib/admin/guestbook-reply-action-state";
import type { GuestbookEntryReply } from "@/lib/guestbook";

const fieldClassName =
  "mt-3 w-full rounded border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25";

const actionLinkClassName =
  "text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline";

const buttonClassName =
  "rounded border border-line bg-paper px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60";

type GuestbookReplyFormProps = {
  entryId: string;
  reply: GuestbookEntryReply | null;
};

export function GuestbookReplyForm({ entryId, reply }: GuestbookReplyFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(reply?.content ?? "");
  const [state, formAction, isPending] = useActionState(
    saveGuestbookReplyAction,
    guestbookReplyActionIdleState satisfies GuestbookReplyActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  function handleOpen() {
    setDraft(reply?.content ?? "");
    setOpen(true);
  }

  function handleCancel() {
    setDraft(reply?.content ?? "");
    setOpen(false);
  }

  const showForm = open && state.status !== "success";

  return (
    <div className="mt-4 border-t border-line/70 pt-4">
      {reply ? (
        <div className="space-y-2">
          <p className="text-keep text-sm leading-6 text-ink-muted">
            <span className="font-medium text-ink">{reply.repliedBy}</span>
            <span aria-hidden className="mx-1.5 text-line">
              ·
            </span>
            <span>답글</span>
          </p>
          <p className="text-keep whitespace-pre-wrap text-sm leading-7 text-ink">
            {reply.content}
          </p>
        </div>
      ) : null}

      {!showForm ? (
        <button className={actionLinkClassName} onClick={handleOpen} type="button">
          {reply ? "답글 수정" : "답글 작성"}
        </button>
      ) : (
        <form action={formAction} className="mt-3">
          <input name="entry_id" type="hidden" value={entryId} />

          <label className="text-keep block text-sm font-medium text-ink" htmlFor={`reply-${entryId}`}>
            답글
          </label>
          <textarea
            className={`${fieldClassName} min-h-[8rem] resize-y`}
            id={`reply-${entryId}`}
            name="reply_content"
            onChange={(event) => setDraft(event.target.value)}
            rows={4}
            value={draft}
          />

          {state.status === "error" && state.message ? (
            <p className="text-keep mt-2 text-sm leading-6 text-accent" role="alert">
              {state.message}
            </p>
          ) : null}
          {state.fieldErrors?.reply_content ? (
            <p className="text-keep mt-2 text-sm leading-6 text-accent" role="alert">
              {state.fieldErrors.reply_content}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <button className={buttonClassName} disabled={isPending} type="submit">
              {isPending ? "저장 중…" : "저장"}
            </button>
            <button
              className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              disabled={isPending}
              onClick={handleCancel}
              type="button"
            >
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

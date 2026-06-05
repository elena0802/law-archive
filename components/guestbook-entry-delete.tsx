"use client";

import { useActionState, useEffect, useState } from "react";
import { deleteGuestbookEntry } from "@/app/(site)/guestbook/actions";
import {
  guestbookDeleteActionIdleState,
  type GuestbookDeleteActionState,
} from "@/lib/guestbook-action-state";

const fieldClassName =
  "mt-3 w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25";

const deleteLinkClassName =
  "cursor-pointer font-normal text-[0.65rem] text-ink-muted/50 no-underline underline-offset-2 transition-colors hover:text-ink-muted/75 hover:underline sm:text-[0.7rem]";

type GuestbookEntryDeleteProps = {
  entryId: string;
};

export function GuestbookEntryDelete({ entryId }: GuestbookEntryDeleteProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deleteGuestbookEntry,
    guestbookDeleteActionIdleState satisfies GuestbookDeleteActionState,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        className={deleteLinkClassName}
        onClick={() => setOpen(true)}
        type="button"
      >
        삭제
      </button>

      {open ? (
        <div
          aria-labelledby={`guestbook-delete-title-${entryId}`}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 px-6"
          onClick={() => setOpen(false)}
          role="dialog"
        >
          <div
            className="w-full max-w-sm rounded border border-line bg-paper px-5 py-5 shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              className="text-keep text-sm leading-7 text-ink"
              id={`guestbook-delete-title-${entryId}`}
            >
              비밀번호를 입력해주세요.
            </p>

            <form action={formAction} className="mt-4">
              <input name="entry_id" type="hidden" value={entryId} />

              {state.status === "error" ? (
                <p
                  className="text-keep mb-3 text-sm leading-6 text-ink-muted"
                  role="alert"
                >
                  {state.message}
                </p>
              ) : null}

              <label className="sr-only" htmlFor={`guestbook-delete-password-${entryId}`}>
                비밀번호
              </label>
              <input
                autoComplete="off"
                autoFocus
                className={fieldClassName}
                id={`guestbook-delete-password-${entryId}`}
                name="password"
                required
                type="password"
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  className="border border-line px-3 py-1.5 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? "삭제 중…" : "삭제하기"}
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
          </div>
        </div>
      ) : null}
    </>
  );
}

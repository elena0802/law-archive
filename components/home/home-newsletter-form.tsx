"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/(site)/newsletter-actions";
import {
  commentFieldClassName,
  commentLabelClassName,
} from "@/components/essay-comment-form";
import {
  newsletterActionIdleState,
  type NewsletterActionState,
} from "@/lib/newsletter-action-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function HomeNewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    subscribeNewsletter,
    newsletterActionIdleState satisfies NewsletterActionState,
  );

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-keep mt-8 text-sm leading-7 text-ink-muted">
        구독 기능을 준비 중입니다.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8 max-w-md">
      <input name="source" type="hidden" value="homepage" />

      {state.status === "success" ? (
        <p
          className="text-keep mb-6 whitespace-pre-wrap text-sm leading-7 text-ink-muted"
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      {state.status === "error" ? (
        <p
          className="text-keep mb-6 text-sm leading-7 text-ink-muted"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      {state.status !== "success" ? (
        <>
          <div>
            <label
              className={commentLabelClassName}
              htmlFor="home-newsletter-email"
            >
              이메일 주소
            </label>
            <input
              autoComplete="email"
              className={commentFieldClassName}
              id="home-newsletter-email"
              maxLength={320}
              name="email"
              required
              type="email"
            />
          </div>

          <button
            className="mt-6 border border-line px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "처리 중…" : "구독하기"}
          </button>
        </>
      ) : null}
    </form>
  );
}

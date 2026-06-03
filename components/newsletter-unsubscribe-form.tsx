"use client";

import { useActionState } from "react";
import { unsubscribeNewsletter } from "@/app/(site)/newsletter-unsubscribe-actions";
import {
  NewsletterAlreadyUnsubscribedPanel,
  newsletterFieldClassName,
  newsletterLabelClassName,
  NewsletterNotFoundPanel,
  newsletterSubmitButtonClassName,
  NewsletterUnsubscribeErrorPanel,
  NewsletterUnsubscribeSuccessPanel,
  NewsletterValidationPanel,
} from "@/components/newsletter-feedback-panels";
import {
  newsletterUnsubscribeActionIdleState,
  type NewsletterUnsubscribeActionState,
} from "@/lib/newsletter-unsubscribe-action-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function NewsletterUnsubscribeForm() {
  const [state, formAction, isPending] = useActionState(
    unsubscribeNewsletter,
    newsletterUnsubscribeActionIdleState satisfies NewsletterUnsubscribeActionState,
  );

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-keep mt-6 text-sm leading-7 text-ink-muted">
        구독 해지 기능을 준비 중입니다.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8">
      {state.status === "success" && state.feedbackKind === "unsubscribed" ? (
        <NewsletterUnsubscribeSuccessPanel />
      ) : null}

      {state.status === "info" &&
      state.feedbackKind === "already_unsubscribed" ? (
        <NewsletterAlreadyUnsubscribedPanel />
      ) : null}

      {state.status === "info" && state.feedbackKind === "not_found" ? (
        <NewsletterNotFoundPanel />
      ) : null}

      {state.status === "error" && state.feedbackKind === "validation" ? (
        <NewsletterValidationPanel />
      ) : null}

      {state.status === "error" &&
      state.feedbackKind === "general" &&
      state.message ? (
        <NewsletterUnsubscribeErrorPanel message={state.message} />
      ) : null}

      <div>
        <label className={newsletterLabelClassName} htmlFor="newsletter-unsubscribe-email">
          이메일
        </label>
        <input
          autoComplete="email"
          className={newsletterFieldClassName}
          id="newsletter-unsubscribe-email"
          maxLength={320}
          name="email"
          required
          type="email"
        />
      </div>

      <button
        className={newsletterSubmitButtonClassName}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "처리 중…" : "구독 해지"}
      </button>
    </form>
  );
}

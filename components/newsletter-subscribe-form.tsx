"use client";

import Link from "next/link";
import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/(site)/newsletter-actions";
import {
  newsletterFieldClassName,
  newsletterLabelClassName,
  NewsletterSubscribeDuplicatePanel,
  NewsletterSubscribeErrorPanel,
  NewsletterSubscribeSuccessPanel,
  newsletterSubmitButtonClassName,
  NewsletterValidationPanel,
} from "@/components/newsletter-feedback-panels";
import {
  newsletterActionIdleState,
  type NewsletterActionState,
} from "@/lib/newsletter-action-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type NewsletterSubscribeFormProps = {
  source?: string;
};

export function NewsletterSubscribeForm({
  source = "homepage",
}: NewsletterSubscribeFormProps) {
  const [state, formAction, isPending] = useActionState(
    subscribeNewsletter,
    newsletterActionIdleState satisfies NewsletterActionState,
  );

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-keep mt-6 text-sm leading-7 text-ink-muted">
        구독 기능을 준비 중입니다.
      </p>
    );
  }

  const showValidationPanel =
    state.status === "error" && state.errorKind === "validation";
  const emailPlaceholder =
    state.status === "success"
      ? "다른 이메일 주소를 입력할 수 있습니다."
      : undefined;

  return (
    <form action={formAction} className="mt-8">
      <input name="source" type="hidden" value={source} />

      {state.status === "success" && state.submittedEmail ? (
        <NewsletterSubscribeSuccessPanel email={state.submittedEmail} />
      ) : null}

      {state.status === "error" && state.errorKind === "duplicate" ? (
        <NewsletterSubscribeDuplicatePanel />
      ) : null}

      {showValidationPanel ? <NewsletterValidationPanel /> : null}

      {state.status === "error" && state.errorKind === "general" && state.message ? (
        <NewsletterSubscribeErrorPanel message={state.message} />
      ) : null}

      <div>
        <label className={newsletterLabelClassName} htmlFor="newsletter-email">
          이메일
        </label>
        <input
          autoComplete="email"
          className={newsletterFieldClassName}
          id="newsletter-email"
          maxLength={320}
          name="email"
          placeholder={emailPlaceholder}
          required
          type="email"
        />
      </div>

      <button
        className={newsletterSubmitButtonClassName}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "처리 중…" : "구독하기"}
      </button>

      <p className="text-keep mt-6 text-sm leading-7 text-ink-muted">
        이메일은 새 글 알림 외의 목적으로 사용하지 않습니다.{" "}
        <Link
          className="text-accent underline-offset-4 hover:underline"
          href="/newsletter/unsubscribe"
        >
          구독 해지는 여기에서 할 수 있습니다.
        </Link>
      </p>
    </form>
  );
}

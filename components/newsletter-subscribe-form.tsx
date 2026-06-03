"use client";

import { useActionState, type ReactNode } from "react";
import { subscribeNewsletter } from "@/app/(site)/newsletter-actions";
import {
  newsletterActionIdleState,
  type NewsletterActionState,
} from "@/lib/newsletter-action-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const fieldClassName =
  "mt-3 w-full max-w-md rounded border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25";

const labelClassName = "text-keep block text-sm font-medium text-ink";

const panelClassName =
  "text-keep mb-8 max-w-md rounded border border-line bg-paper-muted px-5 py-6";

type NewsletterSubscribeFormProps = {
  source?: string;
};

type NewsletterFeedbackPanelProps = {
  headline: string;
  role: "status" | "alert";
  children: ReactNode;
  panelClassName?: string;
};

function NewsletterFeedbackPanel({
  headline,
  role,
  children,
  panelClassName: extraPanelClassName,
}: NewsletterFeedbackPanelProps) {
  return (
    <div
      className={
        extraPanelClassName
          ? `${panelClassName} ${extraPanelClassName}`
          : panelClassName
      }
      role={role}
    >
      <p className="text-lg font-medium leading-8 text-ink">{headline}</p>
      <div className="mt-4 space-y-4 text-base leading-7">{children}</div>
    </div>
  );
}

function NewsletterSuccessPanel({ email }: { email: string }) {
  return (
    <NewsletterFeedbackPanel
      headline="✓ 구독 신청이 완료되었습니다."
      role="status"
    >
      <p className="text-ink">
        구독 이메일:
        <br />
        <span className="font-medium">{email}</span>
      </p>
      <p className="text-ink-muted">
        앞으로 새 글이 발행되면 이메일로 알려드립니다.
      </p>
    </NewsletterFeedbackPanel>
  );
}

function NewsletterDuplicatePanel() {
  return (
    <NewsletterFeedbackPanel
      headline="ℹ 이미 구독 중인 이메일입니다."
      panelClassName="border-line"
      role="status"
    >
      <p className="text-ink-muted">
        해당 이메일은 이미 뉴스레터를 받고 있습니다.
      </p>
    </NewsletterFeedbackPanel>
  );
}

function NewsletterValidationPanel() {
  return (
    <NewsletterFeedbackPanel
      headline="⚠ 이메일 주소를 확인해주세요."
      panelClassName="border-accent/30"
      role="alert"
    >
      <p className="text-ink-muted">
        예:
        <br />
        name@example.com
      </p>
    </NewsletterFeedbackPanel>
  );
}

function NewsletterGeneralErrorPanel({ message }: { message: string }) {
  return (
    <NewsletterFeedbackPanel
      headline="⚠ 구독 신청을 완료하지 못했습니다."
      panelClassName="border-accent/30"
      role="alert"
    >
      <p className="text-ink-muted">{message}</p>
    </NewsletterFeedbackPanel>
  );
}

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
        <NewsletterSuccessPanel email={state.submittedEmail} />
      ) : null}

      {state.status === "error" && state.errorKind === "duplicate" ? (
        <NewsletterDuplicatePanel />
      ) : null}

      {showValidationPanel ? <NewsletterValidationPanel /> : null}

      {state.status === "error" && state.errorKind === "general" && state.message ? (
        <NewsletterGeneralErrorPanel message={state.message} />
      ) : null}

      <div>
        <label className={labelClassName} htmlFor="newsletter-email">
          이메일
        </label>
        <input
          autoComplete="email"
          className={fieldClassName}
          id="newsletter-email"
          maxLength={320}
          name="email"
          placeholder={emailPlaceholder}
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

      <p className="text-keep mt-6 text-sm leading-7 text-ink-muted">
        이메일은 새 글 알림 외의 목적으로 사용하지 않습니다.
      </p>
    </form>
  );
}

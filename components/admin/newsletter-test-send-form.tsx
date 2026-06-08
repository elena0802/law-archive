"use client";

import { useActionState } from "react";
import { sendNewsletterTestEmailAction } from "@/app/(admin)/admin/newsletter/actions";
import {
  adminFieldClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import { AdminFieldError } from "@/components/admin/admin-field-error";
import {
  newsletterTestSendActionIdleState,
  type NewsletterTestSendActionState,
} from "@/lib/newsletter-test-send-action-state";

type NewsletterTestSendFormProps = {
  deliveryConfigured: boolean;
  fromEmail: string;
};

export function NewsletterTestSendForm({
  deliveryConfigured,
  fromEmail,
}: NewsletterTestSendFormProps) {
  const [state, formAction, isPending] = useActionState(
    sendNewsletterTestEmailAction,
    newsletterTestSendActionIdleState satisfies NewsletterTestSendActionState,
  );

  return (
    <section className="mt-10 border-t border-line pt-8">
      <h2 className="text-sm tracking-[0.14em] text-accent uppercase">
        테스트 발송
      </h2>
      <p className="text-keep mt-4 max-w-2xl text-base leading-8 text-ink-muted">
        한 명의 수신자에게 테스트 메일을 보냅니다. 구독자 목록에 있는 활성
        이메일이면 구독 해지 링크가 자동으로 포함됩니다.
      </p>
      <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
        발신 주소: {fromEmail}
      </p>

      {!deliveryConfigured ? (
        <p className="text-keep mt-4 text-sm leading-7 text-accent" role="alert">
          RESEND_API_KEY가 설정되지 않았습니다. Vercel 환경 변수를 확인해
          주세요.
        </p>
      ) : null}

      {state.status === "success" && state.message ? (
        <p className="text-keep mt-4 text-sm leading-7 text-ink" role="status">
          {state.message}
        </p>
      ) : null}

      {state.status === "error" && state.message ? (
        <p className="text-keep mt-4 text-sm leading-7 text-accent" role="alert">
          {state.message}
        </p>
      ) : null}

      <form action={formAction} className="mt-6 max-w-xl space-y-6">
        <div>
          <label className={adminLabelClassName} htmlFor="recipient_email">
            수신 이메일
          </label>
          <input
            autoComplete="email"
            className={adminFieldClassName}
            id="recipient_email"
            name="recipient_email"
            required
            type="email"
          />
          <AdminFieldError message={state.fieldErrors?.recipientEmail} />
        </div>

        <div>
          <label className={adminLabelClassName} htmlFor="subject">
            제목
          </label>
          <input
            className={adminFieldClassName}
            id="subject"
            maxLength={200}
            name="subject"
            required
            type="text"
          />
          <AdminFieldError message={state.fieldErrors?.subject} />
        </div>

        <div>
          <label className={adminLabelClassName} htmlFor="message">
            본문
          </label>
          <textarea
            className={`${adminFieldClassName} min-h-[10rem] resize-y leading-8`}
            id="message"
            name="message"
            required
            rows={6}
          />
          <AdminFieldError message={state.fieldErrors?.message} />
        </div>

        <button
          className={adminPrimaryButtonClassName}
          disabled={isPending || !deliveryConfigured}
          type="submit"
        >
          {isPending ? "발송 중…" : "테스트 발송"}
        </button>
      </form>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useCallback, useRef, useState } from "react";
import { sendNewsletterAction } from "@/app/(admin)/admin/newsletter/actions";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminFieldError } from "@/components/admin/admin-field-error";
import {
  adminFieldClassName,
  adminLabelClassName,
  adminOutlineButtonClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import {
  newsletterSendActionIdleState,
  type NewsletterSendActionState,
} from "@/lib/newsletter-send-action-state";
import {
  DEFAULT_NEWSLETTER_TEMPLATE,
  NEWSLETTER_TEMPLATES,
  newsletterTemplateLabel,
  type NewsletterTemplate,
} from "@/lib/newsletter-email/templates";

type NewsletterSendFormProps = {
  deliveryConfigured: boolean;
  fromEmail: string;
  deliverableSubscriberCount: number;
};

export function NewsletterSendForm({
  deliveryConfigured,
  fromEmail,
  deliverableSubscriberCount,
}: NewsletterSendFormProps) {
  const [state, formAction, isPending] = useActionState(
    sendNewsletterAction,
    newsletterSendActionIdleState satisfies NewsletterSendActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const testButtonRef = useRef<HTMLButtonElement>(null);
  const broadcastButtonRef = useRef<HTMLButtonElement>(null);
  const broadcastConfirmedRef = useRef(false);
  const broadcastConfirmedInputRef = useRef<HTMLInputElement>(null);
  const [broadcastConfirmOpen, setBroadcastConfirmOpen] = useState(false);
  const [template, setTemplate] = useState<NewsletterTemplate>(
    DEFAULT_NEWSLETTER_TEMPLATE,
  );
  const isDigestTemplate = template === "archive-digest";

  const readSubmitIntent = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    const submitter = event.nativeEvent as SubmitEvent;
    const intent = submitter.submitter?.getAttribute("value");
    return intent === "broadcast" ? "broadcast" : "test";
  }, []);

  const submitWithIntent = useCallback(
    (intent: "test" | "broadcast") => {
      const button =
        intent === "broadcast" ? broadcastButtonRef.current : testButtonRef.current;
      formRef.current?.requestSubmit(button ?? undefined);
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      const intent = readSubmitIntent(event);

      if (
        intent === "broadcast" &&
        !broadcastConfirmedRef.current &&
        deliverableSubscriberCount > 0
      ) {
        event.preventDefault();
        setBroadcastConfirmOpen(true);
        return;
      }

      queueMicrotask(() => {
        broadcastConfirmedRef.current = false;
        if (broadcastConfirmedInputRef.current) {
          broadcastConfirmedInputRef.current.value = "no";
        }
      });
    },
    [deliverableSubscriberCount, readSubmitIntent],
  );

  const handleBroadcastConfirm = useCallback(() => {
    setBroadcastConfirmOpen(false);
    broadcastConfirmedRef.current = true;
    if (broadcastConfirmedInputRef.current) {
      broadcastConfirmedInputRef.current.value = "yes";
    }
    submitWithIntent("broadcast");
  }, [submitWithIntent]);

  const handleBroadcastCancel = useCallback(() => {
    setBroadcastConfirmOpen(false);
  }, []);

  const broadcastDisabled =
    !deliveryConfigured || isPending || deliverableSubscriberCount === 0;

  return (
    <section className="mt-10 border-t border-line pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm tracking-[0.14em] text-accent uppercase">
          뉴스레터 발송
        </h2>
        <Link
          className={adminOutlineButtonClassName}
          href="/admin/newsletter/preview"
          target="_blank"
        >
          Archive Digest 미리보기
        </Link>
      </div>
      <p className="text-keep mt-4 text-sm leading-7 text-ink-muted">
        발신 주소: {fromEmail}
      </p>
      <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
        발송 가능한 활성 구독자: {deliverableSubscriberCount}명
      </p>

      {!deliveryConfigured ? (
        <p className="text-keep mt-4 text-sm leading-7 text-accent" role="alert">
          RESEND_API_KEY가 설정되지 않았습니다. Vercel 환경 변수를 확인해
          주세요.
        </p>
      ) : null}

      {deliverableSubscriberCount === 0 && deliveryConfigured ? (
        <p className="text-keep mt-4 text-sm leading-7 text-ink-muted" role="status">
          발송 가능한 활성 구독자가 없습니다. 이메일 주소와 수신 거부 토큰이
          유효한 구독자만 포함됩니다.
        </p>
      ) : null}

      {state.status === "success" && state.message ? (
        <div className="mt-4" role="status">
          <p className="text-keep whitespace-pre-line text-sm leading-7 text-ink">
            {state.message}
          </p>
          {state.intent === "broadcast" &&
          state.broadcastResult &&
          state.broadcastResult.failureCount > 0 ? (
            <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
              일부 수신자에게 발송하지 못했습니다. 잠시 후 다시 시도하거나
              Resend 설정을 확인해 주세요.
            </p>
          ) : null}
        </div>
      ) : null}

      {state.status === "error" && state.message ? (
        <p className="text-keep mt-4 text-sm leading-7 text-accent" role="alert">
          {state.message}
        </p>
      ) : null}

      <form
        action={formAction}
        className="mt-6 max-w-xl space-y-6"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <input
          defaultValue="no"
          name="broadcast_confirmed"
          ref={broadcastConfirmedInputRef}
          type="hidden"
        />

        <div>
          <label className={adminLabelClassName} htmlFor="template">
            이메일 템플릿
          </label>
          <select
            className={adminFieldClassName}
            id="template"
            name="template"
            onChange={(event) =>
              setTemplate(event.target.value as NewsletterTemplate)
            }
            value={template}
          >
            {NEWSLETTER_TEMPLATES.map((option) => (
              <option key={option} value={option}>
                {newsletterTemplateLabel(option)}
              </option>
            ))}
          </select>
          <AdminFieldError message={state.fieldErrors?.template} />
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
            {isDigestTemplate ? "인사말" : "본문"}
          </label>
          <textarea
            className={`${adminFieldClassName} min-h-[10rem] resize-y leading-8`}
            id="message"
            name="message"
            placeholder={
              isDigestTemplate
                ? "이번 호 인사말을 짧게 작성해 주세요."
                : undefined
            }
            required
            rows={6}
          />
          <AdminFieldError message={state.fieldErrors?.message} />
        </div>

        <div>
          <label className={adminLabelClassName} htmlFor="related_url">
            {isDigestTemplate ? "이번 글 URL (선택)" : "관련 글 URL (선택)"}
          </label>
          <input
            className={adminFieldClassName}
            id="related_url"
            maxLength={2048}
            name="related_url"
            placeholder={
              isDigestTemplate
                ? "https://…/essays/글-slug (비우면 최신 글)"
                : "https://"
            }
            type="url"
          />
          <AdminFieldError message={state.fieldErrors?.relatedUrl} />
          {isDigestTemplate ? (
            <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
              비우면 최신 공개 글이 이번 글 카드로 들어갑니다.
            </p>
          ) : null}
        </div>

        <div className="border-t border-line/70 pt-6">
          <p className="text-keep text-sm font-medium text-ink-muted">
            테스트 발송
          </p>
          <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
            아래 수신 이메일 한 명에게만 보냅니다.
          </p>
          <div className="mt-4">
            <label className={adminLabelClassName} htmlFor="recipient_email">
              수신 이메일
            </label>
            <input
              autoComplete="email"
              className={adminFieldClassName}
              id="recipient_email"
              name="recipient_email"
              type="email"
            />
            <AdminFieldError message={state.fieldErrors?.recipientEmail} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className={adminSecondaryButtonClassName}
            disabled={isPending || !deliveryConfigured}
            name="intent"
            ref={testButtonRef}
            type="submit"
            value="test"
          >
            {isPending ? "발송 중…" : "테스트 발송"}
          </button>
          <button
            className={adminPrimaryButtonClassName}
            disabled={broadcastDisabled}
            name="intent"
            ref={broadcastButtonRef}
            type="submit"
            value="broadcast"
          >
            {isPending ? "발송 중…" : "활성 구독자에게 발송"}
          </button>
        </div>
      </form>

      <AdminConfirmDialog
        confirmLabel="발송하기"
        message={`활성 구독자 ${deliverableSubscriberCount}명에게 뉴스레터를 발송하시겠습니까? 이 작업은 실제 이메일을 발송합니다.`}
        onCancel={handleBroadcastCancel}
        onConfirm={handleBroadcastConfirm}
        open={broadcastConfirmOpen}
        title="뉴스레터를 발송하시겠습니까?"
      />
    </section>
  );
}

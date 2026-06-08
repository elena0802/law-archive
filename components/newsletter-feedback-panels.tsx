import type { ReactNode } from "react";

export const newsletterFieldClassName =
  "mt-3 w-full max-w-md rounded border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25";

export const newsletterLabelClassName =
  "text-keep block text-sm font-medium text-ink";

export const newsletterPanelClassName =
  "text-keep mb-8 max-w-md rounded border border-line bg-paper-muted px-5 py-6";

export const newsletterSubmitButtonClassName =
  "mt-6 border border-line px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60";

type NewsletterFeedbackPanelProps = {
  headline: string;
  role: "status" | "alert";
  children?: ReactNode;
  panelClassName?: string;
};

export function NewsletterFeedbackPanel({
  headline,
  role,
  children,
  panelClassName: extraPanelClassName,
}: NewsletterFeedbackPanelProps) {
  return (
    <div
      className={
        extraPanelClassName
          ? `${newsletterPanelClassName} ${extraPanelClassName}`
          : newsletterPanelClassName
      }
      role={role}
    >
      <p className="text-lg font-medium leading-8 text-ink">{headline}</p>
      {children ? (
        <div className="mt-4 space-y-4 text-base leading-7">{children}</div>
      ) : null}
    </div>
  );
}

export function NewsletterSubscribeSuccessPanel({ email }: { email: string }) {
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

export function NewsletterSubscribeDuplicatePanel() {
  return (
    <NewsletterFeedbackPanel
      headline="ℹ 이미 구독 중인 이메일입니다."
      role="status"
    >
      <p className="text-ink-muted">
        해당 이메일은 이미 뉴스레터를 받고 있습니다.
      </p>
    </NewsletterFeedbackPanel>
  );
}

export function NewsletterValidationPanel() {
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

export function NewsletterSubscribeErrorPanel({ message }: { message: string }) {
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

export function NewsletterUnsubscribeSuccessPanel() {
  return (
    <NewsletterFeedbackPanel
      headline="✓ 구독 해지가 완료되었습니다."
      role="status"
    >
      <p className="text-ink-muted">
        더 이상 형사법 아카이브의 새 글 알림을 받지 않습니다.
      </p>
    </NewsletterFeedbackPanel>
  );
}

export function NewsletterAlreadyUnsubscribedPanel() {
  return (
    <NewsletterFeedbackPanel
      headline="ℹ 이미 구독 해지된 이메일입니다."
      role="status"
    >
      <p className="text-ink-muted">
        해당 이메일은 이미 뉴스레터 수신 목록에서 제외되어 있습니다.
      </p>
    </NewsletterFeedbackPanel>
  );
}

export function NewsletterNotFoundPanel() {
  return (
    <NewsletterFeedbackPanel
      headline="ℹ 해당 이메일로 등록된 구독 정보를 찾을 수 없습니다."
      role="status"
    >
      <p className="text-ink-muted">
        입력하신 이메일 주소를 다시 확인해 주세요.
      </p>
    </NewsletterFeedbackPanel>
  );
}

export function NewsletterInvalidTokenPanel() {
  return (
    <NewsletterFeedbackPanel
      headline="ℹ 유효하지 않은 구독 해지 링크입니다."
      role="status"
    >
      <p className="text-ink-muted">
        링크가 만료되었거나 잘못되었을 수 있습니다. 이메일로 구독 해지를
        진행해 주세요.
      </p>
    </NewsletterFeedbackPanel>
  );
}

export function NewsletterUnsubscribeErrorPanel({ message }: { message: string }) {
  return (
    <NewsletterFeedbackPanel
      headline="⚠ 구독 해지를 완료하지 못했습니다."
      panelClassName="border-accent/30"
      role="alert"
    >
      <p className="text-ink-muted">{message}</p>
    </NewsletterFeedbackPanel>
  );
}

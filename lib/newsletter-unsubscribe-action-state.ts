export type NewsletterUnsubscribeFeedbackKind =
  | "unsubscribed"
  | "already_unsubscribed"
  | "not_found"
  | "validation"
  | "general";

export type NewsletterUnsubscribeActionState = {
  status: "idle" | "success" | "info" | "error";
  feedbackKind?: NewsletterUnsubscribeFeedbackKind;
  message?: string;
};

export const newsletterUnsubscribeActionIdleState: NewsletterUnsubscribeActionState =
  {
    status: "idle",
  };

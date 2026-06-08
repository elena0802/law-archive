export type NewsletterTestSendActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    recipientEmail?: string;
    subject?: string;
    message?: string;
  };
};

export const newsletterTestSendActionIdleState: NewsletterTestSendActionState = {
  status: "idle",
};

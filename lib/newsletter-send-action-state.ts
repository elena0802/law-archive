import type { NewsletterSendFieldErrors } from "@/lib/newsletter-email/validate";

export type NewsletterSendActionState = {
  status: "idle" | "success" | "error";
  intent?: "test" | "broadcast";
  message?: string;
  fieldErrors?: NewsletterSendFieldErrors;
  broadcastResult?: {
    successCount: number;
    failureCount: number;
  };
};

export const newsletterSendActionIdleState: NewsletterSendActionState = {
  status: "idle",
};

export type NewsletterActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  submittedEmail?: string;
  errorKind?: "duplicate" | "validation" | "general";
  fieldErrors?: {
    email?: string;
  };
};

export const newsletterActionIdleState: NewsletterActionState = {
  status: "idle",
};

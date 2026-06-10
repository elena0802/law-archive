export type EssayActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Client navigates here after a successful save (avoids redirect() + useActionState errors). */
  redirectTo?: string;
};

export const essayActionIdleState: EssayActionState = { status: "idle" };

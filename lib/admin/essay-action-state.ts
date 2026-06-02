export type EssayActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const essayActionIdleState: EssayActionState = { status: "idle" };

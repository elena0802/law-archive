export type CommentActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    content?: string;
  };
};

export const commentActionIdleState: CommentActionState = { status: "idle" };

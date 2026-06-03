export type CommentActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    content?: string;
    password?: string;
  };
};

export const commentActionIdleState: CommentActionState = { status: "idle" };

export type CommentDeleteActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const commentDeleteActionIdleState: CommentDeleteActionState = {
  status: "idle",
};

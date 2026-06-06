export type GuestbookReplyActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    reply_content?: string;
  };
};

export const guestbookReplyActionIdleState: GuestbookReplyActionState = {
  status: "idle",
};

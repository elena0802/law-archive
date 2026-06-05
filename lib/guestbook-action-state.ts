export type GuestbookActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    name?: string;
    content?: string;
    password?: string;
  };
};

export const guestbookActionIdleState: GuestbookActionState = { status: "idle" };

export type GuestbookDeleteActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const guestbookDeleteActionIdleState: GuestbookDeleteActionState = {
  status: "idle",
};

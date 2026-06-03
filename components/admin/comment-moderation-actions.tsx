"use client";

import {
  approveComment,
  deleteComment,
  rejectComment,
} from "@/app/(admin)/admin/comments/actions";
import type { CommentListFilter } from "@/lib/admin/comments";
import type { CommentStatus } from "@/lib/content/db-types";

type CommentModerationActionsProps = {
  commentId: string;
  status: CommentStatus;
  returnStatus: CommentListFilter;
};

const actionButtonClassName =
  "text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const deleteButtonClassName =
  "text-keep text-ink-muted underline-offset-4 hover:text-ink hover:underline";

export function CommentModerationActions({
  commentId,
  status,
  returnStatus,
}: CommentModerationActionsProps) {
  const returnStatusValue = returnStatus === "all" ? "" : returnStatus;

  return (
    <div className="flex flex-col gap-2">
      {status !== "approved" ? (
        <form action={approveComment.bind(null, commentId)}>
          <input name="return_status" type="hidden" value={returnStatusValue} />
          <button className={actionButtonClassName} type="submit">
            승인
          </button>
        </form>
      ) : null}
      {status !== "rejected" ? (
        <form action={rejectComment.bind(null, commentId)}>
          <input name="return_status" type="hidden" value={returnStatusValue} />
          <button className={actionButtonClassName} type="submit">
            거절
          </button>
        </form>
      ) : null}
      <form action={deleteComment.bind(null, commentId)}>
        <input name="return_status" type="hidden" value={returnStatusValue} />
        <button
          className={deleteButtonClassName}
          onClick={(event) => {
            if (!confirm("이 댓글을 삭제하시겠습니까?")) {
              event.preventDefault();
            }
          }}
          type="submit"
        >
          삭제
        </button>
      </form>
    </div>
  );
}

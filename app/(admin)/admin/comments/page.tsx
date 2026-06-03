import type { Metadata } from "next";
import Link from "next/link";
import { CommentModerationActions } from "@/components/admin/comment-moderation-actions";
import { CommentStatusFilters } from "@/components/admin/comment-status-filters";
import {
  commentStatusLabel,
  isAdminCommentsAvailable,
  listAdminComments,
  type CommentListFilter,
} from "@/lib/admin/comments";
import { formatAdminDateTime } from "@/lib/admin/essays";
import { getCommentAuthorDisplayName } from "@/lib/comments";
import type { CommentStatus } from "@/lib/content/db-types";

export const metadata: Metadata = {
  title: "댓글 관리",
};

type AdminCommentsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function parseListFilter(status: string | undefined): CommentListFilter {
  if (status === "approved" || status === "pending" || status === "rejected") {
    return status;
  }

  return "all";
}

function statusQueryForFilter(filter: CommentListFilter): CommentStatus | undefined {
  return filter === "all" ? undefined : filter;
}

export default async function AdminCommentsPage({
  searchParams,
}: AdminCommentsPageProps) {
  const { status } = await searchParams;
  const listFilter = parseListFilter(status);

  if (!isAdminCommentsAvailable()) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm tracking-[0.18em] text-accent uppercase">댓글</p>
        <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
          댓글 관리
        </h1>
        <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
          댓글 관리를 사용하려면 Supabase URL과 서비스 역할 키가 필요합니다.
        </p>
      </div>
    );
  }

  const comments = await listAdminComments({
    status: statusQueryForFilter(listFilter),
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">댓글</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        댓글 관리
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        공개 글에 달린 댓글을 검토하고 승인·거절·삭제할 수 있습니다. 공개
        서재에는 승인된 댓글만 표시됩니다.
      </p>

      <CommentStatusFilters current={listFilter} />

      {comments.length > 0 ? (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-muted">
                <th className="py-4 pr-4 font-medium" scope="col">
                  내용
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  작성자
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  글
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  상태
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  등록일
                </th>
                <th className="py-4 font-medium" scope="col">
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr className="border-b border-line" key={comment.id}>
                  <td className="text-keep max-w-xs py-4 pr-4 align-top text-base leading-7 text-ink">
                    {comment.content}
                  </td>
                  <td className="text-keep py-4 pr-4 align-top">
                    <p className="text-base text-ink">
                      {getCommentAuthorDisplayName(comment.authorName)}
                    </p>
                    {comment.authorAffiliation ? (
                      <p className="mt-1 text-sm leading-6 text-ink-muted">
                        {comment.authorAffiliation}
                      </p>
                    ) : null}
                  </td>
                  <td className="py-4 pr-4 align-top">
                    <Link
                      className="text-keep text-ink-muted underline-offset-4 hover:text-accent hover:underline"
                      href={`/essays/${comment.essaySlug}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {comment.essaySlug}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 align-top">
                    <span
                      className={
                        comment.status === "approved"
                          ? "text-keep font-medium text-ink"
                          : "text-keep text-ink-muted"
                      }
                    >
                      {commentStatusLabel(comment.status)}
                    </span>
                  </td>
                  <td className="py-4 pr-4 align-top text-ink-muted">
                    {formatAdminDateTime(comment.createdAt)}
                  </td>
                  <td className="py-4 align-top">
                    <CommentModerationActions
                      commentId={comment.id}
                      returnStatus={listFilter}
                      status={comment.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-10 rounded border border-line bg-paper-muted px-4 py-6">
          <p className="text-keep text-base leading-8 text-ink-muted">
            조건에 맞는 댓글이 없습니다.
          </p>
          {listFilter !== "all" ? (
            <Link
              className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
              href="/admin/comments"
            >
              전체 댓글 보기
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}

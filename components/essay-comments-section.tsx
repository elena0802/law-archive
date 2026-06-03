import { EssayCommentDelete } from "@/components/essay-comment-delete";
import { EssayCommentForm } from "@/components/essay-comment-form";
import {
  formatCommentDate,
  getCommentAuthorDisplayName,
  listApprovedCommentsByEssaySlug,
  type Comment,
} from "@/lib/comments";

type EssayCommentsSectionProps = {
  essaySlug: string;
};

function CommentItem({
  comment,
  essaySlug,
}: {
  comment: Comment;
  essaySlug: string;
}) {
  const authorName = getCommentAuthorDisplayName(comment.authorName);
  const affiliation = comment.authorAffiliation?.trim();

  return (
    <li className="border-t border-line py-6 first:border-t-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-keep font-serif text-lg leading-snug text-ink">
          {authorName}
        </p>
        {affiliation ? (
          <p className="text-sm leading-6 text-ink-muted">{affiliation}</p>
        ) : null}
        <p className="text-sm leading-6 text-ink-muted">
          {formatCommentDate(comment.createdAt)}
        </p>
        {comment.authorDeleteSupported ? (
          <EssayCommentDelete commentId={comment.id} essaySlug={essaySlug} />
        ) : null}
      </div>
      <p className="text-keep mt-4 whitespace-pre-wrap text-base leading-8 text-ink">
        {comment.content}
      </p>
    </li>
  );
}

export async function EssayCommentsSection({ essaySlug }: EssayCommentsSectionProps) {
  const comments = await listApprovedCommentsByEssaySlug(essaySlug);

  return (
    <section aria-labelledby="essay-comments-heading">
      <h2
        className="text-xs tracking-[0.14em] text-accent uppercase"
        id="essay-comments-heading"
      >
        댓글
      </h2>

      {comments.length > 0 ? (
        <ul className="mt-6 list-none p-0">
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              essaySlug={essaySlug}
              key={comment.id}
            />
          ))}
        </ul>
      ) : (
        <p className="text-keep mt-6 text-base leading-8 text-ink-muted">
          아직 댓글이 없습니다.
        </p>
      )}

      <EssayCommentForm essaySlug={essaySlug} />
    </section>
  );
}

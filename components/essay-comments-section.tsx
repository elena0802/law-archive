import { EssayCommentForm } from "@/components/essay-comment-form";
import { EssayCommentThreadList } from "@/components/essay-comment-thread-list";
import {
  listApprovedCommentThreadsByEssaySlug,
  type CommentThread,
} from "@/lib/comments";

type EssayCommentsSectionProps = {
  essaySlug: string;
};

export async function EssayCommentsSection({ essaySlug }: EssayCommentsSectionProps) {
  let threads: CommentThread[] = [];
  let loadFailed = false;

  try {
    threads = await listApprovedCommentThreadsByEssaySlug(essaySlug);
  } catch (error) {
    console.error(`Failed to load comments for "${essaySlug}":`, error);
    loadFailed = true;
  }

  return (
    <section aria-labelledby="essay-comments-heading">
      <h2
        className="text-xs tracking-[0.14em] text-accent uppercase"
        id="essay-comments-heading"
      >
        댓글
      </h2>

      {loadFailed ? (
        <p className="text-keep mt-6 text-base leading-8 text-ink-muted">
          댓글을 불러오지 못했습니다.
        </p>
      ) : threads.length > 0 ? (
        <EssayCommentThreadList essaySlug={essaySlug} threads={threads} />
      ) : (
        <>
          <p className="text-keep mt-6 text-base leading-8 text-ink-muted">
            이 글에 대한 생각을 남겨 주세요.
          </p>
          <p className="text-keep mt-2 text-base leading-8 text-ink-muted">
            아직 댓글이 없습니다. 첫 번째 의견을 남겨 주세요.
          </p>
        </>
      )}

      <EssayCommentForm essaySlug={essaySlug} />
    </section>
  );
}

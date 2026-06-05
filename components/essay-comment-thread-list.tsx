"use client";

import { useState } from "react";
import { EssayCommentDelete } from "@/components/essay-comment-delete";
import { EssayCommentForm } from "@/components/essay-comment-form";
import {
  formatCommentDate,
  getCommentAuthorDisplayName,
  isArchiveAuthorComment,
} from "@/lib/comment-display";
import { MAX_COMMENT_DEPTH, type CommentThread } from "@/lib/comment-types";

type EssayCommentThreadListProps = {
  threads: CommentThread[];
  essaySlug: string;
};

type EssayCommentThreadItemProps = {
  thread: CommentThread;
  essaySlug: string;
  depth: number;
  replyToId: string | null;
  onReplyToggle: (commentId: string | null) => void;
};

const actionLinkBaseClassName =
  "cursor-pointer font-normal no-underline underline-offset-2 transition-colors hover:underline";

function getActionLinkClassName(depth: number, isTopLevel: boolean) {
  if (depth === MAX_COMMENT_DEPTH) {
    return `${actionLinkBaseClassName} text-[0.6rem] text-ink-muted/40 hover:text-ink-muted/60 sm:text-[0.625rem]`;
  }

  if (isTopLevel) {
    return `${actionLinkBaseClassName} text-[0.65rem] text-ink-muted/50 hover:text-ink-muted/75 sm:text-[0.7rem]`;
  }

  return `${actionLinkBaseClassName} text-[0.6rem] text-ink-muted/45 hover:text-ink-muted/70 sm:text-[0.65rem]`;
}

function MetadataDot() {
  return (
    <span aria-hidden className="mx-1 text-line">
      ·
    </span>
  );
}

function EssayCommentThreadItem({
  thread,
  essaySlug,
  depth,
  replyToId,
  onReplyToggle,
}: EssayCommentThreadItemProps) {
  const authorName = getCommentAuthorDisplayName(thread.authorName);
  const affiliation = thread.authorAffiliation?.trim();
  const isAuthor = isArchiveAuthorComment(thread.authorName);
  const canReply = depth < MAX_COMMENT_DEPTH;
  const isReplyOpen = replyToId === thread.id;
  const isTopLevel = depth === 1;
  const formattedDate = formatCommentDate(thread.createdAt);

  const line1ClassName = isTopLevel
    ? "text-keep font-serif text-lg leading-snug text-ink"
    : "text-keep font-serif text-base leading-snug text-ink";

  const line2ClassName = isTopLevel
    ? "text-keep text-xs leading-5 text-ink-muted/90"
    : "text-keep text-[0.7rem] leading-5 text-ink-muted/90 sm:text-xs";

  const actionLinkClassName = getActionLinkClassName(depth, isTopLevel);

  return (
    <article className={isTopLevel ? "border-t border-line py-5 first:border-t-0" : "pt-2"}>
      <div className="space-y-0.5">
        <p className={line1ClassName}>
          <span>{authorName}</span>
          {isAuthor ? (
            <>
              <MetadataDot />
              <span className="text-ink-muted">저자</span>
            </>
          ) : null}
          {affiliation ? (
            <>
              <MetadataDot />
              <span className="text-ink-muted">{affiliation}</span>
            </>
          ) : null}
        </p>
        <p className={line2ClassName}>{formattedDate}</p>
      </div>

      <p
        className={`text-keep whitespace-pre-wrap text-ink ${
          isTopLevel
            ? "mt-2.5 text-base leading-8"
            : "mt-1.5 text-[0.9375rem] leading-7"
        }`}
      >
        {thread.content}
      </p>

      {canReply || thread.authorDeleteSupported ? (
        <div className="text-keep mt-1.5 leading-5">
          {canReply ? (
            <button
              aria-expanded={isReplyOpen}
              className={actionLinkClassName}
              onClick={() => onReplyToggle(isReplyOpen ? null : thread.id)}
              type="button"
            >
              답글
            </button>
          ) : null}
          {canReply && thread.authorDeleteSupported ? <MetadataDot /> : null}
          {thread.authorDeleteSupported ? (
            <EssayCommentDelete
              className={actionLinkClassName}
              commentId={thread.id}
              essaySlug={essaySlug}
              inline
            />
          ) : null}
        </div>
      ) : null}

      {isReplyOpen ? (
        <EssayCommentForm
          essaySlug={essaySlug}
          formId={`reply-${thread.id}`}
          onCancel={() => onReplyToggle(null)}
          onSuccess={() => onReplyToggle(null)}
          parentId={thread.id}
          variant="reply"
        />
      ) : null}

      {thread.replies.length > 0 ? (
        <div
          aria-label="답글"
          className={
            isTopLevel
              ? "mt-2 space-y-0 border-l border-line/40 pl-2 sm:pl-3"
              : "mt-1.5 space-y-0 pl-2 sm:pl-2.5"
          }
          role="list"
        >
          {thread.replies.map((reply) => (
            <div key={reply.id} role="listitem">
              <EssayCommentThreadItem
                depth={depth + 1}
                essaySlug={essaySlug}
                onReplyToggle={onReplyToggle}
                replyToId={replyToId}
                thread={reply}
              />
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function EssayCommentThreadList({
  threads,
  essaySlug,
}: EssayCommentThreadListProps) {
  const [replyToId, setReplyToId] = useState<string | null>(null);

  return (
    <div className="mt-5">
      {threads.map((thread) => (
        <EssayCommentThreadItem
          depth={1}
          essaySlug={essaySlug}
          key={thread.id}
          onReplyToggle={setReplyToId}
          replyToId={replyToId}
          thread={thread}
        />
      ))}
    </div>
  );
}

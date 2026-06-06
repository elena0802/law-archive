import type { GuestbookEntryReply } from "@/lib/guestbook";
import { siteConfig } from "@/lib/site";

type GuestbookEntryReplyProps = {
  reply: GuestbookEntryReply;
};

export function GuestbookEntryReplyDisplay({ reply }: GuestbookEntryReplyProps) {
  return (
    <div className="mt-4 border-l border-line/50 pl-3 sm:pl-4">
      <p className="text-keep text-sm leading-6 text-ink-muted">
        <span aria-hidden className="mr-1.5 text-line">
          ㄴ
        </span>
        <span className="font-medium text-ink">
          {reply.repliedBy || siteConfig.authorName}
        </span>
      </p>
      <p className="text-keep mt-1.5 whitespace-pre-wrap text-[0.9375rem] leading-7 text-ink">
        {reply.content}
      </p>
    </div>
  );
}

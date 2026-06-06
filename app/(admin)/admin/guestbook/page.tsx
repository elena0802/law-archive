import type { Metadata } from "next";
import Link from "next/link";
import { GuestbookReplyForm } from "@/components/admin/guestbook-reply-form";
import { ADMIN_GUESTBOOK_UNAVAILABLE } from "@/lib/admin/admin-messages";
import { formatAdminDateTime } from "@/lib/admin/essays";
import {
  isAdminGuestbookAvailable,
  listAdminGuestbookEntries,
} from "@/lib/admin/guestbook";

export const metadata: Metadata = {
  title: "안부의 글 관리",
};

export default async function AdminGuestbookPage() {
  if (!isAdminGuestbookAvailable()) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm tracking-[0.18em] text-accent uppercase">안부의 글</p>
        <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
          안부의 글 관리
        </h1>
        <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
          {ADMIN_GUESTBOOK_UNAVAILABLE}
        </p>
      </div>
    );
  }

  const entries = await listAdminGuestbookEntries();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">안부의 글</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        안부의 글 관리
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        방문자가 남긴 안부를 읽고, 조용한 답글을 남길 수 있습니다. 공개 서재에는
        승인된 안부와 답글이 함께 표시됩니다.
      </p>

      {entries.length > 0 ? (
        <div className="mt-10 space-y-0">
          {entries.map((entry) => {
            const affiliation = entry.affiliation?.trim();

            return (
              <article className="border-t border-line py-8 first:border-t-0" key={entry.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-keep font-serif text-lg leading-snug text-ink">
                    {entry.name}
                  </p>
                  <p className="text-keep text-sm leading-6 text-ink-muted">
                    {formatAdminDateTime(entry.createdAt)}
                  </p>
                </div>
                {affiliation ? (
                  <p className="text-keep mt-1 text-sm leading-6 text-ink-muted">
                    {affiliation}
                  </p>
                ) : null}
                <p className="text-keep mt-4 whitespace-pre-wrap text-base leading-8 text-ink">
                  {entry.content}
                </p>
                <GuestbookReplyForm
                  entryId={entry.id}
                  key={entry.reply?.repliedAt ?? `${entry.id}-no-reply`}
                  reply={entry.reply}
                />
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 rounded border border-line bg-paper-muted px-4 py-6">
          <p className="text-keep text-base leading-8 text-ink-muted">
            아직 등록된 안부가 없습니다.
          </p>
          <Link
            className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
            href="/guestbook"
            rel="noopener noreferrer"
            target="_blank"
          >
            공개 안부의 글 보기
          </Link>
        </div>
      )}
    </div>
  );
}

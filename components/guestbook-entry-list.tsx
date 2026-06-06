import { GuestbookEntryDelete } from "@/components/guestbook-entry-delete";
import { formatGuestbookDate, type GuestbookEntry } from "@/lib/guestbook";
import { siteConfig } from "@/lib/site";

type GuestbookEntryListProps = {
  entries: GuestbookEntry[];
};

function GuestbookEntryItem({ entry }: { entry: GuestbookEntry }) {
  const affiliation = entry.affiliation?.trim();

  return (
    <article className="border-t border-line py-6 first:border-t-0">
      <p className="text-keep font-serif text-lg leading-snug text-ink">{entry.name}</p>
      {affiliation ? (
        <p className="text-keep mt-1 text-sm leading-6 text-ink-muted">{affiliation}</p>
      ) : null}
      <p className="text-keep mt-4 whitespace-pre-wrap text-base leading-8 text-ink">
        {entry.content}
      </p>

      {entry.reply ? (
        <div className="mt-4 border-l border-line/50 pl-3 sm:pl-4">
          <p className="text-keep text-sm leading-6 text-ink-muted">
            <span aria-hidden className="mr-1.5 text-line">
              ㄴ
            </span>
            <span className="font-medium text-ink">
              {entry.reply.repliedBy || siteConfig.authorName}
            </span>
          </p>
          <p className="text-keep mt-1.5 whitespace-pre-wrap text-[0.9375rem] leading-7 text-ink">
            {entry.reply.content}
          </p>
        </div>
      ) : null}

      <div className="text-keep mt-4 text-sm leading-6 text-ink-muted">
        <span>{formatGuestbookDate(entry.createdAt)}</span>
        {entry.authorDeleteSupported ? (
          <>
            <span aria-hidden className="mx-1.5 text-line">
              ·
            </span>
            <GuestbookEntryDelete entryId={entry.id} />
          </>
        ) : null}
      </div>
    </article>
  );
}

export function GuestbookEntryList({ entries }: GuestbookEntryListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-keep mt-6 text-base leading-8 text-ink-muted">
        아직 남겨진 안부가 없습니다.
      </p>
    );
  }

  return (
    <div className="mt-6">
      {entries.map((entry) => (
        <GuestbookEntryItem entry={entry} key={entry.id} />
      ))}
    </div>
  );
}

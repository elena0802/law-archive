import { GuestbookEntryDelete } from "@/components/guestbook-entry-delete";
import { formatGuestbookDate, type GuestbookEntry } from "@/lib/guestbook";

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

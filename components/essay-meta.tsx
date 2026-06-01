import Link from "next/link";
import { formatEssayDate, getSeriesSlug } from "@/lib/essays";

type EssayMetaProps = {
  category: string;
  date: string;
  seriesTitle: string;
  readingMinutes: number;
  partLabel: string | null;
};

export function EssayDetailNav() {
  return (
    <Link
      className="text-sm tracking-[0.1em] text-accent underline-offset-4 hover:underline"
      href="/essays"
    >
      ← 글 목록
    </Link>
  );
}

export function EssayBreadcrumb({ seriesTitle }: { seriesTitle: string }) {
  const seriesSlug = getSeriesSlug(seriesTitle);

  return (
    <p className="mt-10 text-sm text-ink-muted">
      <Link
        className="text-accent underline-offset-4 hover:underline"
        href="/series"
      >
        연재
      </Link>
      <span aria-hidden="true"> › </span>
      <Link
        className="text-accent underline-offset-4 hover:underline"
        href={`/series/${seriesSlug}`}
      >
        {seriesTitle}
      </Link>
    </p>
  );
}

export function EssayMetaRow({
  category,
  date,
  seriesTitle,
  readingMinutes,
  partLabel,
}: EssayMetaProps) {
  const items = [
    category,
    formatEssayDate(date),
    `약 ${readingMinutes}분`,
    ...(partLabel ? [partLabel] : []),
  ];

  return (
    <p className="mt-4 text-sm leading-6 text-ink-muted">
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 ? (
            <span aria-hidden="true" className="mx-2 text-line">
              ·
            </span>
          ) : null}
          {item}
        </span>
      ))}
      <span className="sr-only">, 연재: {seriesTitle}</span>
    </p>
  );
}

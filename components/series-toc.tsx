import Link from "next/link";
import {
  formatEssayDate,
  sortEssaysForSeries,
  type Essay,
} from "@/lib/essays";

type SeriesTocProps = {
  essays: Essay[];
};

export function SeriesToc({ essays }: SeriesTocProps) {
  const ordered = sortEssaysForSeries(essays);

  if (ordered.length === 0) {
    return (
      <p className="border-t border-line py-8 text-base leading-8 text-ink-muted">
        이 연재에 공개된 글이 아직 없습니다.
      </p>
    );
  }

  return (
    <nav aria-labelledby="series-toc-heading">
      <div className="border-t border-line pt-10">
        <h2
          className="font-serif text-2xl leading-tight text-ink sm:text-3xl"
          id="series-toc-heading"
        >
          목차
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          아래 순서는 연재 편 순서입니다. 처음부터 읽으시면 흐름을 따라가기
          쉽습니다.
        </p>
      </div>

      <ol className="mt-6 list-none p-0">
        {ordered.map((essay, index) => (
          <li key={essay.slug}>
            <Link
              className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-4 border-t border-line py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:grid-cols-[2.5rem_1fr_auto] sm:gap-x-6"
              href={`/essays/${essay.slug}`}
            >
              <span className="text-sm tabular-nums text-accent">{index + 1}</span>
              <span className="text-keep font-serif text-lg leading-snug text-ink group-hover:text-accent sm:text-xl">
                {essay.title}
              </span>
              <span className="text-xs text-ink-muted sm:text-sm">
                {formatEssayDate(essay.date)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import Link from "next/link";
import {
  formatSeriesDateRange,
  sortEssaysForSeries,
  type EssaySeries,
} from "@/lib/essays";

type HomeSeriesPanelProps = {
  series: EssaySeries;
};

export function HomeSeriesPanel({ series }: HomeSeriesPanelProps) {
  const essaysInOrder = sortEssaysForSeries(series.essays);
  const dateRange = formatSeriesDateRange(series.essays);

  return (
    <div className="mt-5 border-t border-line/80 pt-5">
      <p className="text-xs tracking-[0.14em] text-accent">지금 읽는 연재</p>
      <h2 className="text-keep mt-1.5 font-serif text-[clamp(1.5rem,3vw,1.95rem)] leading-tight text-ink">
        {series.title}
      </h2>
      <p className="text-keep mt-2 text-[0.9375rem] leading-7 text-ink-muted">
        {series.description}
      </p>
      <p className="mt-2.5 text-sm text-ink-muted">
        {series.count}편
        {dateRange ? ` · ${dateRange}` : null}
      </p>
      <Link
        className="mt-4 inline-block border-b border-accent pb-0.5 text-[0.9375rem] text-accent hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href={`/series/${series.slug}`}
      >
        연재 읽기
      </Link>

      {essaysInOrder.length > 0 ? (
        <div className="mt-4">
          <p className="mb-3 text-xs tracking-[0.14em] text-ink-muted">목차</p>
          <ol className="list-none p-0">
            {essaysInOrder.map((essay, index) => (
              <li
                key={essay.slug}
                className="flex gap-4 border-b border-line py-2.5 text-base"
              >
                <span className="min-w-5 text-sm text-accent">{index + 1}</span>
                <Link
                  className="font-serif text-[1.0625rem] leading-snug text-ink hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href={`/essays/${essay.slug}`}
                >
                  {essay.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

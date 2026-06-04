import Link from "next/link";
import { formatEssayDate, type EssaySeries } from "@/lib/essays";

type SeriesEditorialCardProps = {
  series: EssaySeries;
};

function SeriesVolumeIcon() {
  return (
    <svg
      aria-hidden
      className="h-7 w-7 text-accent/80"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 6h12l6 4v16H8V6z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M20 6v4h6" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M11 14h10M11 18h10M11 22h7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function SeriesEditorialCard({ series }: SeriesEditorialCardProps) {
  return (
    <Link
      className="group flex h-full gap-5 border border-line/80 bg-paper p-5 transition-colors hover:border-ink-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-6"
      href={`/series/${series.slug}`}
    >
      <div
        aria-hidden
        className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center border border-line/80 bg-paper-muted"
      >
        <SeriesVolumeIcon />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs tracking-[0.08em] text-ink-muted">
          {series.count}편 · 최근 {formatEssayDate(series.latestDate)}
        </p>
        <h3 className="text-keep mt-2 font-serif text-xl leading-snug text-ink group-hover:text-accent sm:text-[1.35rem]">
          {series.title}
        </h3>
        <p className="text-keep mt-2 line-clamp-2 text-sm leading-[1.75] text-ink-muted">
          {series.description}
        </p>
      </div>
    </Link>
  );
}

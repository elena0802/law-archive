import Image from "next/image";
import Link from "next/link";
import { formatEssayDate, type EssaySeries } from "@/lib/essays";
import { getSeriesCoverSrc } from "@/lib/home-images";

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

function SeriesCover({ series }: { series: EssaySeries }) {
  const coverSrc = getSeriesCoverSrc(series.slug);

  if (coverSrc) {
    return (
      <div className="relative aspect-[5/2] overflow-hidden border-b border-line/60 bg-paper-muted">
        <Image
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          fill
          sizes="(min-width: 640px) 320px, 100vw"
          src={coverSrc}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="flex aspect-[5/2] items-center justify-center border-b border-line/60 bg-paper-muted"
    >
      <SeriesVolumeIcon />
    </div>
  );
}

export function SeriesEditorialCard({ series }: SeriesEditorialCardProps) {
  return (
    <Link
      className="group flex h-full flex-col overflow-hidden border border-line/80 bg-paper transition-colors hover:border-ink-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      href={`/series/${series.slug}`}
    >
      <SeriesCover series={series} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs tracking-[0.08em] text-ink-muted">
          {series.count}편 · 최근 {formatEssayDate(series.latestDate)}
        </p>
        <h3 className="text-keep mt-2 font-serif text-xl leading-snug text-ink group-hover:text-accent sm:text-[1.35rem]">
          {series.title}
        </h3>
        <p className="text-keep mt-2 line-clamp-2 flex-1 text-sm leading-[1.75] text-ink-muted">
          {series.description}
        </p>
      </div>
    </Link>
  );
}

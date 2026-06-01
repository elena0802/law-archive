import Link from "next/link";
import { formatEssayDate, type EssaySeries } from "@/lib/essays";

type SeriesVolumeLinkProps = {
  series: EssaySeries;
};

export function SeriesVolumeLink({ series }: SeriesVolumeLinkProps) {
  return (
    <Link
      className="block border-t border-line py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      href={`/series/${series.slug}`}
    >
      <p className="text-xs tracking-[0.08em] text-ink-muted">
        {series.count}편 · 최근 {formatEssayDate(series.latestDate)}
      </p>
      <h3 className="text-keep mt-3 font-serif text-2xl leading-tight text-ink sm:text-[1.65rem]">
        {series.title}
      </h3>
      <p className="text-keep mt-3 max-w-2xl text-[0.9375rem] leading-8 text-ink-muted">
        {series.description}
      </p>
    </Link>
  );
}

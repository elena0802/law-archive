import Link from "next/link";
import { SeriesVolumeStats } from "@/components/series-volume-stats";
import type { EssaySeries } from "@/lib/essays";

type SeriesVolumeCardProps = {
  series: EssaySeries;
};

export function SeriesVolumeCard({ series }: SeriesVolumeCardProps) {
  return (
    <article className="border-t border-line py-10 first:border-t-0 first:pt-0">
      <p className="text-xs tracking-[0.14em] text-accent uppercase">연재 권</p>
      <h2 className="text-keep mt-3 font-serif text-3xl leading-tight text-ink sm:text-[2rem]">
        <Link
          className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href={`/series/${series.slug}`}
        >
          {series.title}
        </Link>
      </h2>
      <p className="text-keep mt-4 text-base leading-8 text-ink-muted">
        {series.introduction}
      </p>
      <div className="mt-5">
        <SeriesVolumeStats
          count={series.count}
          firstDate={series.firstDate}
          latestDate={series.latestDate}
          layout="inline"
        />
      </div>
      <Link
        className="mt-6 inline-block border-b border-accent pb-0.5 text-sm text-accent hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href={`/series/${series.slug}`}
      >
        연재 읽기
      </Link>
    </article>
  );
}

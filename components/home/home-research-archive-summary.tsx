import Link from "next/link";
import type { ResearchSummaryStats } from "@/src/lib/research";

type HomeResearchArchiveSummaryProps = {
  stats: ResearchSummaryStats;
};

const summaryItems: {
  key: keyof Pick<
    ResearchSummaryStats,
    "totalPublications" | "representativeCount" | "importantCount"
  >;
  label: string;
  suffix: string;
}[] = [
  { key: "totalPublications", label: "전체 논문", suffix: "편" },
  { key: "representativeCount", label: "대표 논문", suffix: "편" },
  { key: "importantCount", label: "주요 논문", suffix: "편" },
];

export function HomeResearchArchiveSummary({
  stats,
}: HomeResearchArchiveSummaryProps) {
  return (
    <section aria-labelledby="home-research-summary-heading">
      <h2
        id="home-research-summary-heading"
        className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl"
      >
        연구 아카이브
      </h2>
      <p className="text-keep mt-4 text-base leading-[1.85] text-ink-muted">
        1991년부터 이어온 형사법 연구의 기록입니다.
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {summaryItems.map((entry) => (
          <div
            key={entry.key}
            className="border border-line/80 bg-paper px-5 py-4"
          >
            <dt className="text-sm text-ink-muted">{entry.label}</dt>
            <dd className="mt-2 font-serif text-3xl tabular-nums text-ink">
              {stats[entry.key]}
              <span className="ml-1 text-base font-sans text-ink-muted">
                {entry.suffix}
              </span>
            </dd>
          </div>
        ))}
        {stats.yearRange ? (
          <div className="border border-line/80 bg-paper px-5 py-4 sm:col-span-2">
            <dt className="text-sm text-ink-muted">연구 기간</dt>
            <dd className="mt-2 font-serif text-3xl tabular-nums text-ink">
              {stats.yearRange}
            </dd>
          </div>
        ) : null}
      </dl>
      <Link
        className="mt-6 inline-block text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href="/research"
      >
        연구업적 보기
      </Link>
    </section>
  );
}

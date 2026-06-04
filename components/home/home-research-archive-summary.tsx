import Link from "next/link";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import {
  formatResearchDate,
  getCategoryLabel,
  type ResearchSummaryStats,
} from "@/src/lib/research";
import type { ResearchItem } from "@/src/types/research";

type HomeResearchArchiveSummaryProps = {
  previewItems: readonly ResearchItem[];
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
  previewItems,
  stats,
}: HomeResearchArchiveSummaryProps) {
  return (
    <section aria-labelledby="home-research-summary-heading">
      <HomeSectionHeader
        description="1991년부터 이어온 형사법 연구의 기록입니다."
        headingId="home-research-summary-heading"
        title="연구 아카이브"
      />

      <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryItems.map((entry) => (
          <div
            key={entry.key}
            className="border border-line/80 bg-paper px-4 py-3"
          >
            <dt className="text-xs text-ink-muted">{entry.label}</dt>
            <dd className="mt-1.5 font-serif text-2xl tabular-nums text-ink">
              {stats[entry.key]}
              <span className="ml-0.5 text-sm font-sans text-ink-muted">
                {entry.suffix}
              </span>
            </dd>
          </div>
        ))}
        {stats.yearRange ? (
          <div className="border border-line/80 bg-paper px-4 py-3">
            <dt className="text-xs text-ink-muted">연구 기간</dt>
            <dd className="mt-1.5 font-serif text-2xl tabular-nums text-ink">
              {stats.yearRange}
            </dd>
          </div>
        ) : null}
      </dl>

      {previewItems.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-xs tracking-[0.1em] text-ink-muted uppercase">
            대표 논문
          </h3>
          <ul className="mt-4 list-none divide-y divide-line/80 border-y border-line/80 p-0">
            {previewItems.map((item) => {
              const yearLabel = formatResearchDate(item.year, item.month);
              const fieldLabel = getCategoryLabel(item.category);

              return (
                <li key={item.number}>
                  <Link
                    className="group flex flex-col gap-1.5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    href={`/research/${item.number}`}
                  >
                    <span className="text-keep min-w-0 font-serif text-base leading-snug text-ink group-hover:text-accent">
                      {item.title}
                    </span>
                    <span className="text-keep shrink-0 text-sm text-ink-muted">
                      {[yearLabel, fieldLabel].filter(Boolean).join(" · ")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <Link
        className="mt-8 inline-block text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href="/research"
      >
        연구업적 보기
      </Link>
    </section>
  );
}

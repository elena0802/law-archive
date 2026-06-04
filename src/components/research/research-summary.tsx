import type { ResearchSummaryStats } from "@/src/lib/research";

type ResearchSummaryProps = {
  stats: ResearchSummaryStats;
};

const countSummaryItems: {
  key: "totalPublications" | "representativeCount" | "importantCount" | "areaCount";
  label: string;
  suffix: string;
}[] = [
  { key: "totalPublications", label: "전체 논문", suffix: "편" },
  { key: "representativeCount", label: "대표 논문", suffix: "편" },
  { key: "importantCount", label: "주요 논문", suffix: "편" },
  { key: "areaCount", label: "연구 분야", suffix: "개" },
];

export function ResearchSummary({ stats }: ResearchSummaryProps) {
  return (
    <section aria-labelledby="research-summary-heading">
      <h2
        id="research-summary-heading"
        className="font-serif text-2xl leading-tight text-ink sm:text-[1.75rem]"
      >
        연구 개요
      </h2>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {countSummaryItems.map((entry) => (
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
    </section>
  );
}

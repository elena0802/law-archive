import type { ReactNode } from "react";
import { ScholarDnaShareActions } from "@/components/scholar-dna-share-actions";
import type { ScholarDnaAnalysis } from "@/lib/scholar-dna";

type ScholarDnaResultViewProps = {
  analysis: ScholarDnaAnalysis;
  shareUrl: string;
};

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs tracking-[0.14em] text-accent uppercase">{children}</h2>
  );
}

export function ScholarDnaResultView({
  analysis,
  shareUrl,
}: ScholarDnaResultViewProps) {
  return (
    <div className="space-y-14">
      <section aria-labelledby="scholar-dna-story-heading">
        <SectionHeading>AI가 읽은 나의 학문 인생</SectionHeading>
        <div className="text-keep mt-6 space-y-5 text-base leading-8 text-ink sm:text-lg sm:leading-9">
          {analysis.academicLifeStory.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="scholar-dna-keywords-heading"
        className="border-t border-line pt-10"
      >
        <SectionHeading>핵심 키워드</SectionHeading>
        <ul
          className="text-keep mt-5 flex flex-wrap gap-2.5"
          id="scholar-dna-keywords-heading"
        >
          {analysis.keywords.map((keyword) => (
            <li
              className="rounded border border-line bg-paper-muted/40 px-3 py-1.5 text-sm text-ink"
              key={keyword}
            >
              {keyword}
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="scholar-dna-interests-heading"
        className="border-t border-line pt-10"
      >
        <SectionHeading>연구 관심사 지도</SectionHeading>
        <p className="text-keep mt-3 text-sm leading-7 text-ink-muted">
          대표 논문을 바탕으로 읽어본 연구 관심사의 분포입니다.
        </p>
        <ul className="mt-6 space-y-4" id="scholar-dna-interests-heading">
          {analysis.scholarDna.map((topic) => (
            <li key={topic.label}>
              <div className="text-keep mb-2 flex items-baseline justify-between gap-4 text-sm text-ink">
                <span>{topic.label}</span>
                <span className="tabular-nums text-ink-muted">
                  {topic.percentage}%
                </span>
              </div>
              <div
                aria-hidden="true"
                className="h-2 overflow-hidden rounded-full bg-paper-muted"
              >
                <div
                  className="h-full rounded-full bg-accent/70"
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="scholar-dna-oneliner-heading"
        className="border-t border-line pt-10"
      >
        <SectionHeading>AI 한 문장</SectionHeading>
        <p
          className="text-keep mt-5 font-serif text-xl leading-relaxed text-ink sm:text-2xl"
          id="scholar-dna-oneliner-heading"
        >
          {analysis.aiOneLiner}
        </p>
      </section>

      <section
        aria-labelledby="scholar-dna-share-heading"
        className="border-t border-line pt-10"
      >
        <SectionHeading>공유하기</SectionHeading>
        <div className="mt-5">
          <ScholarDnaShareActions shareUrl={shareUrl} />
        </div>
      </section>
    </div>
  );
}

import { ArticleCard } from "@/components/article-card";
import { Section } from "@/components/section";

export default function SeriesPage() {
  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
          Series
        </p>
        <h1 className="font-serif text-5xl leading-[1.1] text-ink">
          연재
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          하나의 주제를 여러 편으로 나누어 읽을 수 있도록 준비하는
          공간입니다. 아직 실제 연재 데이터는 연결하지 않았습니다.
        </p>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="mx-auto max-w-reading">
          <ArticleCard
            eyebrow="Placeholder"
            title="형사법 강의 노트"
            description="연재 상세 페이지와 글 목록을 붙이기 전의 기본 카드 형태입니다."
            meta="준비 중"
          />
          <ArticleCard
            eyebrow="Placeholder"
            title="쟁점별 판례 읽기"
            description="시리즈 목록의 폭, 행간, 구분선을 점검하기 위한 임시 항목입니다."
            meta="준비 중"
          />
        </div>
      </Section>
    </>
  );
}

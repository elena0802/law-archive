import { ArticleCard } from "@/components/article-card";
import { Section } from "@/components/section";

export default function Home() {
  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
          Digital Study
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.18] text-ink sm:text-5xl lg:text-[3.6rem]">
          형사법의 오래된 질문을 차분히 보관하는 서재
        </h1>
        <p className="text-keep mt-8 text-xl leading-9 text-ink-muted">
          판례, 논문, 강의 노트, 그리고 사유의 흔적을 긴 호흡으로 읽을 수
          있도록 정돈하는 원로 형사법학자의 개인 아카이브입니다.
        </p>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="grid gap-12 lg:grid-cols-[18rem_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">
              Reading Notes
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">
              곧 채워질 기록
            </h2>
          </div>
          <div>
            <ArticleCard
              eyebrow="Essay"
              title="형사책임의 경계에 관한 메모"
              description="긴 글을 위한 목록 자리입니다. 다음 단계에서 MDX 글이 연결되면 이 영역이 실제 에세이 카드로 대체됩니다."
              meta="Placeholder"
            />
            <ArticleCard
              eyebrow="Series"
              title="강의실에서 이어진 질문들"
              description="연속 글과 강의 노트를 담기 위한 자리입니다. 아직 데이터나 글 목록은 연결하지 않았습니다."
              meta="Placeholder"
            />
          </div>
        </div>
      </Section>
    </>
  );
}

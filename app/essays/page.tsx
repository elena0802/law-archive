import { ArticleCard } from "@/components/article-card";
import { Section } from "@/components/section";
import { formatEssayDate, getAllEssays } from "@/lib/essays";

export default async function EssaysPage() {
  const essays = await getAllEssays();

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
          Essays
        </p>
        <h1 className="font-serif text-5xl leading-[1.1] text-ink">
          에세이
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          형사법의 쟁점과 사유를 긴 글로 정리하는 공간입니다. 공개 상태의
          원고만 최신순으로 표시됩니다.
        </p>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="mx-auto max-w-reading">
          {essays.map((essay) => (
            <ArticleCard
              key={essay.slug}
              eyebrow={`${formatEssayDate(essay.date)} · ${essay.category}`}
              title={essay.title}
              description={essay.description}
              meta={`연재: ${essay.series}`}
              href={`/essays/${essay.slug}`}
            />
          ))}
        </div>
      </Section>
    </>
  );
}

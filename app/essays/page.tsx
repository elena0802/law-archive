import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { Section } from "@/components/section";
import { formatEssayDate, getAllEssays } from "@/lib/essays";

export const metadata: Metadata = {
  title: "Essays",
  description: "형사법과 인간, 책임과 사회에 관한 에세이를 최신순으로 모았습니다.",
  alternates: {
    canonical: "/essays",
  },
  openGraph: {
    title: "Essays",
    description:
      "형사법과 인간, 책임과 사회에 관한 에세이를 최신순으로 모았습니다.",
    url: "/essays",
  },
};

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
          {essays.length > 0 ? (
            essays.map((essay) => (
              <ArticleCard
                key={essay.slug}
                eyebrow={`${formatEssayDate(essay.date)} · ${essay.category}`}
                title={essay.title}
                description={essay.description}
                meta={`연재: ${essay.series}`}
                href={`/essays/${essay.slug}`}
              />
            ))
          ) : (
            <p className="border-t border-line py-8 text-base leading-8 text-ink-muted">
              아직 공개된 에세이가 없습니다. 새 글의 draft 값을 false로 바꾸면
              이 목록에 표시됩니다.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}

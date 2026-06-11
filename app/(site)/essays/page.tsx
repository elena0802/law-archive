import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { Section } from "@/components/section";
import { formatEssayDate, getAllEssays } from "@/lib/essays";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "글",
  description: "형사법과 인간, 책임과 사회에 관한 글을 최신순으로 모았습니다.",
  alternates: {
    canonical: "/essays",
  },
  openGraph: {
    title: `글 | ${siteConfig.name}`,
    description:
      "형사법과 인간, 책임과 사회에 관한 글을 최신순으로 모았습니다.",
    url: "/essays",
    locale: "ko_KR",
    siteName: siteConfig.name,
  },
};

export default async function EssaysPage() {
  const essays = await getAllEssays();

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
          글
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          글
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          형사법의 쟁점과 사유를 긴 글로 정리하는 공간입니다. 공개된 글을
          최신순으로 모았습니다.
        </p>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="mx-auto max-w-reading">
          {essays.length > 0 ? (
            essays.map((essay) => (
              <ArticleCard
                key={essay.slug}
                description={essay.description}
                eyebrow={`${formatEssayDate(essay.date)} · ${essay.category}`}
                href={`/essays/${essay.slug}`}
                meta={`연재: ${essay.series}`}
                title={essay.title}
              />
            ))
          ) : (
            <p className="text-keep border-t border-line py-8 text-base leading-8 text-ink-muted">
              아직 공개된 글이 없습니다.
              <br />
              곧 새로운 글이 이곳에 기록됩니다.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}

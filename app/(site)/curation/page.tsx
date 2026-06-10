import type { Metadata } from "next";
import { CurationList } from "@/components/curation/curation-list";
import { Section } from "@/components/section";
import { getVisibleCurationItems } from "@/lib/curation/queries";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const pageDescription =
  "천진호 교수가 직접 추천하는 유튜브, 기사, 외부글, 논문, 책과 그 이유를 모았습니다.";

export const metadata: Metadata = {
  title: "요즘의 시선",
  description: pageDescription,
  alternates: {
    canonical: "/curation",
  },
  openGraph: {
    title: `요즘의 시선 | ${siteConfig.name}`,
    description: pageDescription,
    url: "/curation",
    locale: "ko_KR",
    siteName: siteConfig.name,
  },
};

export default async function CurationPage() {
  const items = await getVisibleCurationItems();

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          큐레이션
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          요즘의 시선
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          {pageDescription} 외부 콘텐츠의 본문은 저장하지 않으며, 제목·추천 이유·
          출처·링크만 기록합니다.
        </p>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="mx-auto max-w-reading">
          <CurationList items={items} />
        </div>
      </Section>
    </>
  );
}

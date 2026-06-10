import type { Metadata } from "next";
import { CurationList } from "@/components/curation/curation-list";
import { Section } from "@/components/section";
import { getVisibleCurationItems } from "@/lib/curation/queries";
import { curationSectionDescription } from "@/lib/curation/types";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const pageDescription = curationSectionDescription;

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
      <Section size="reading" className="pt-page pb-8 sm:pb-10">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          큐레이션
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          요즘의 시선
        </h1>
        <p className="text-keep mt-6 text-lg leading-9 text-ink-muted sm:mt-7">
          {pageDescription} 외부 콘텐츠의 본문은 저장하지 않으며, 제목·추천 이유·
          출처·링크만 기록합니다.
        </p>
      </Section>

      <Section size="wide" className="pt-0 pb-section">
        <div className="mx-auto max-w-reading">
          <CurationList items={items} />
        </div>
      </Section>
    </>
  );
}

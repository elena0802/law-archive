import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScholarDnaResultView } from "@/components/scholar-dna-result-view";
import { Section } from "@/components/section";
import { getScholarDnaAnalysisById } from "@/lib/scholar-dna";
import { getSiteOrigin, siteConfig } from "@/lib/site";

type ScholarDnaResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ScholarDnaResultPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const analysis = await getScholarDnaAnalysisById(id);

    if (!analysis) {
      return {};
    }

    const description = analysis.aiOneLiner.trim() || undefined;

    return {
      title: analysis.scholarAlias,
      description,
      alternates: {
        canonical: `/scholar-dna/${id}`,
      },
      openGraph: {
        title: `${analysis.scholarAlias} | ${siteConfig.name}`,
        description: description ?? "Scholar DNA 학문 인생 분석",
        url: `/scholar-dna/${id}`,
        locale: "ko_KR",
        siteName: siteConfig.name,
      },
    };
  } catch {
    return {};
  }
}

export default async function ScholarDnaResultPage({
  params,
}: ScholarDnaResultPageProps) {
  const { id } = await params;

  let analysis;

  try {
    analysis = await getScholarDnaAnalysisById(id);
  } catch (error) {
    console.error("Failed to load scholar DNA analysis:", error);
    throw error;
  }

  if (!analysis) {
    notFound();
  }

  const shareUrl = `${getSiteOrigin()}/scholar-dna/${analysis.id}`;

  return (
    <Section size="reading" className="py-page">
      <header>
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          Scholar DNA
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.12] text-ink sm:text-5xl">
          {analysis.name} 교수의 학문 인생
        </h1>
        <p className="text-keep mt-5 text-base leading-8 text-ink-muted">
          {analysis.affiliation} · {analysis.fieldOfStudy}
        </p>

        <div className="mt-12 border-t border-line pt-10">
          <p
            className="text-keep font-serif text-3xl leading-[1.2] text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.18]"
            id="scholar-dna-alias-heading"
          >
            {analysis.scholarAlias}
          </p>
          <p className="text-keep mt-4 text-sm leading-7 text-ink-muted">
            AI가 읽은 연구자 별칭
          </p>
        </div>
      </header>

      <div className="mt-14">
        <ScholarDnaResultView analysis={analysis} shareUrl={shareUrl} />
      </div>

      <p className="text-keep mt-14 text-sm leading-7 text-ink-muted">
        <Link
          className="text-ink underline-offset-4 hover:text-accent"
          href="/scholar-dna"
        >
          새 분석 시작하기
        </Link>
      </p>
    </Section>
  );
}

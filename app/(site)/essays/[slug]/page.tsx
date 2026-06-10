import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayArticleView } from "@/components/essay-article-view";
import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { getAllEssays, getEssayBySlug } from "@/lib/essays";
import { buildArticleJsonLd, buildEssayOpenGraphImages } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type EssayPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const essays = await getAllEssays();

  return essays.map((essay) => ({
    slug: essay.slug,
  }));
}

export async function generateMetadata({
  params,
}: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getEssayBySlug(slug);

  if (!essay || essay.draft) {
    return {};
  }

  const description = essay.description.trim() || undefined;

  return {
    title: essay.title,
    description,
    alternates: {
      canonical: `/essays/${essay.slug}`,
    },
    openGraph: {
      title: essay.title,
      description: description ?? essay.title,
      url: `/essays/${essay.slug}`,
      type: "article",
      publishedTime: essay.date,
      modifiedTime: essay.updatedAt ?? essay.date,
      section: essay.category,
      locale: "ko_KR",
      siteName: siteConfig.name,
      images: buildEssayOpenGraphImages(essay),
    },
  };
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const essay = await getEssayBySlug(slug);

  if (!essay || essay.draft) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildArticleJsonLd(essay)} />
      <Section size="reading" className="py-page">
        <EssayArticleView essay={essay} mode="public" />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { Section } from "@/components/section";
import { formatEssayDate, getAllCategories, getCategoryBySlug } from "@/lib/essays";
import { resolveCategorySlugParam } from "@/lib/content/category-slug";
import { siteConfig } from "@/lib/site";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = resolveCategorySlugParam(slug);
  const category = await getCategoryBySlug(resolvedSlug);

  if (!category) {
    return {};
  }

  return {
    title: category.title,
    description: `${category.title} 주제의 공개 글 ${category.count}편`,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.title} | ${siteConfig.name}`,
      description: `${category.title} 주제의 공개 글 ${category.count}편`,
      url: `/categories/${category.slug}`,
      locale: "ko_KR",
      siteName: siteConfig.name,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSlug = resolveCategorySlugParam(slug);
  const category = await getCategoryBySlug(resolvedSlug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">주제</p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          {category.title}
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          이 주제에 속한 글 {category.count}편을 모았습니다.
        </p>
        {category.firstDate && category.latestDate ? (
          <dl className="mt-7 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs tracking-[0.12em] text-accent uppercase">첫 글</dt>
              <dd className="mt-1 text-base text-ink">{formatEssayDate(category.firstDate)}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.12em] text-accent uppercase">최근 글</dt>
              <dd className="mt-1 text-base text-ink">{formatEssayDate(category.latestDate)}</dd>
            </div>
          </dl>
        ) : null}
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="mx-auto max-w-reading">
          <p className="border-t border-line py-8 text-xs tracking-[0.14em] text-accent uppercase">
            전체 글
          </p>
          {category.essays.length > 0 ? (
            category.essays.map((essay) => (
              <ArticleCard
                key={essay.slug}
                description={essay.description}
                eyebrow={formatEssayDate(essay.date)}
                href={`/essays/${essay.slug}`}
                meta={`연재: ${essay.series}`}
                title={essay.title}
              />
            ))
          ) : (
            <p className="border-t border-line py-8 text-base leading-8 text-ink-muted">
              이 주제에 공개된 글이 없습니다.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}


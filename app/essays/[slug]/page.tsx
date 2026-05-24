import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Section } from "@/components/section";
import { formatEssayDate, getAllEssays, getEssayBySlug } from "@/lib/essays";

type EssayPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

  return {
    title: essay.title,
    description: essay.description,
    alternates: {
      canonical: `/essays/${essay.slug}`,
    },
    openGraph: {
      title: essay.title,
      description: essay.description,
      url: `/essays/${essay.slug}`,
      type: "article",
      publishedTime: essay.date,
      section: essay.category,
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
    <Section size="reading" className="py-page">
      <Link
        className="text-sm uppercase tracking-[0.16em] text-accent underline-offset-4 hover:underline"
        href="/essays"
      >
        Essays로 돌아가기
      </Link>

      <article className="mt-12">
        <header className="border-b border-line pb-10">
          <p className="text-sm uppercase tracking-[0.18em] text-accent">
            {essay.category}
          </p>
          <h1 className="text-keep mt-5 font-serif text-4xl leading-[1.18] text-ink sm:text-5xl">
            {essay.title}
          </h1>
          <p className="text-keep mt-6 text-lg leading-9 text-ink-muted">
            {essay.description}
          </p>
          <dl className="mt-7 grid gap-3 text-sm leading-6 text-ink-muted sm:grid-cols-2">
            <div>
              <dt className="sr-only">작성일</dt>
              <dd>{formatEssayDate(essay.date)}</dd>
            </div>
            <div>
              <dt className="sr-only">연재</dt>
              <dd>연재: {essay.series}</dd>
            </div>
          </dl>
        </header>

        <div className="archive-prose mt-12">
          <MDXRemote source={essay.content} />
        </div>
      </article>
    </Section>
  );
}

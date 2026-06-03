import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";
import { getCategoryDescription } from "@/lib/content/category-descriptions";
import { getAllCategories } from "@/lib/essays";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "주제",
  description: "공개된 글의 주제별 분류와 글 수를 확인합니다.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: `주제 | ${siteConfig.name}`,
    description: "공개된 글의 주제별 분류와 글 수를 확인합니다.",
    url: "/categories",
    locale: "ko_KR",
    siteName: siteConfig.name,
  },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">주제</p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          주제
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          공개된 글을 주제별로 모아 볼 수 있습니다.
        </p>
      </Section>

      <Section size="reading" className="border-t border-line">
        {categories.length > 0 ? (
          <ul className="list-none p-0">
            {categories.map((category) => (
              <li className="border-t border-line py-6 first:border-t-0" key={category.slug}>
                <Link
                  className="group block rounded-sm px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href={`/categories/${category.slug}`}
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="text-keep font-serif text-2xl leading-tight text-ink group-hover:text-accent">
                      {category.title}
                    </span>
                    <span className="text-sm text-ink-muted">{category.count}편</span>
                  </div>
                  <p className="text-keep mt-3 text-base leading-8 text-ink-muted">
                    {getCategoryDescription(category.title)}
                  </p>
                  <p className="mt-5 text-sm text-accent underline-offset-4 group-hover:underline">
                    주제 보기 →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-base leading-8 text-ink-muted">
            아직 공개된 주제 분류가 없습니다.
          </p>
        )}
      </Section>
    </>
  );
}


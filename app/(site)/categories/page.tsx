import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";
import { getAllCategories } from "@/lib/essays";

export const metadata: Metadata = {
  title: "주제",
  description: "공개된 글의 주제별 분류와 글 수를 확인합니다.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">Categories</p>
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
                  className="group flex items-baseline justify-between gap-6 underline-offset-4 hover:underline"
                  href={`/categories/${category.slug}`}
                >
                  <span className="text-keep font-serif text-2xl leading-tight text-ink group-hover:text-accent">
                    {category.title}
                  </span>
                  <span className="text-sm text-ink-muted">{category.count}편</span>
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


import Link from "next/link";
import {
  formatResearchDate,
  getCategoryLabel,
} from "@/src/lib/research";
import type { ResearchItem } from "@/src/types/research";

type HomeRepresentativeResearchProps = {
  items: readonly ResearchItem[];
};

export function HomeRepresentativeResearch({
  items,
}: HomeRepresentativeResearchProps) {
  return (
    <section aria-labelledby="home-representative-research-heading">
      <h2
        id="home-representative-research-heading"
        className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl"
      >
        대표 연구
      </h2>
      <p className="text-keep mt-4 text-base leading-[1.85] text-ink-muted">
        오랜 연구 가운데 대표적인 논문을 소개합니다.
      </p>
      <ul className="mt-8 list-none space-y-0 p-0">
        {items.map((item) => {
          const dateLabel = formatResearchDate(item.year, item.month);

          return (
            <li
              key={item.number}
              className="border-t border-line py-5 first:border-t-0 first:pt-0"
            >
              <Link
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                href={`/research/${item.number}`}
              >
                <h3 className="text-keep font-serif text-lg leading-snug text-ink group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="text-keep mt-2 text-sm text-ink-muted">
                  {[dateLabel, getCategoryLabel(item.category)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      {items.length === 0 ? (
        <p className="mt-6 text-base leading-8 text-ink-muted">
          등록된 대표 논문이 없습니다.
        </p>
      ) : null}
      <Link
        className="mt-6 inline-block text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href="/research"
      >
        전체 연구업적 보기
      </Link>
    </section>
  );
}

import Link from "next/link";
import type { Essay } from "@/lib/essays";

type SeriesSiblingsProps = {
  essays: Essay[];
  currentSlug: string;
};

export function SeriesSiblings({ essays, currentSlug }: SeriesSiblingsProps) {
  const siblings = essays.filter((essay) => essay.slug !== currentSlug);

  if (siblings.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="essay-siblings-heading">
      <h2
        className="text-xs tracking-[0.14em] text-accent uppercase"
        id="essay-siblings-heading"
      >
        같은 연재
      </h2>
      <ul className="mt-3 list-none space-y-2 p-0">
        {siblings.map((essay) => (
          <li key={essay.slug}>
            <Link
              className="font-serif text-[1.0625rem] leading-snug text-ink underline-offset-4 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              href={`/essays/${essay.slug}`}
            >
              {essay.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

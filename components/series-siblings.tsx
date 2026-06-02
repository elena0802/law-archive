import Link from "next/link";
import type { Essay } from "@/lib/essays";

type SeriesSiblingsProps = {
  essays: Essay[];
  currentSlug: string;
  /** When true, sibling links use /preview/[slug] for editor preview. */
  previewMode?: boolean;
};

function siblingHref(essay: Essay, previewMode: boolean) {
  if (previewMode) {
    return `/preview/${essay.slug}`;
  }

  return `/essays/${essay.slug}`;
}

export function SeriesSiblings({
  essays,
  currentSlug,
  previewMode = false,
}: SeriesSiblingsProps) {
  if (essays.length <= 1) {
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
      <ol className="mt-3 list-none space-y-2 p-0">
        {essays.map((essay, index) => (
          <li key={essay.slug}>
            <span className="mr-2 text-sm text-ink-muted tabular-nums">
              {index + 1}.
            </span>
            {essay.slug === currentSlug ? (
              <span
                aria-current="page"
                className="font-serif text-[1.0625rem] leading-snug text-accent"
              >
                {essay.title}
                <span className="ml-2 text-sm text-ink-muted">(현재 글)</span>
              </span>
            ) : (
              <Link
                className="font-serif text-[1.0625rem] leading-snug text-ink underline-offset-4 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                href={siblingHref(essay, previewMode)}
              >
                {essay.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

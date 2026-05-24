import Link from "next/link";

type ArticleCardProps = {
  title: string;
  description: string;
  eyebrow?: string;
  meta?: string;
  href?: string;
};

export function ArticleCard({
  title,
  description,
  eyebrow,
  meta,
  href,
}: ArticleCardProps) {
  const content = (
    <article className="group border-t border-line py-7">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[10rem_1fr] sm:gap-8">
        <div className="text-xs uppercase tracking-[0.16em] text-ink-muted">
          {eyebrow}
        </div>
        <div>
          <h3 className="font-serif text-2xl leading-tight text-ink sm:text-[1.7rem]">
            {title}
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-8 text-ink-muted">
            {description}
          </p>
          {meta ? (
            <p className="mt-4 text-sm leading-6 text-accent">{meta}</p>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      href={href}
    >
      {content}
    </Link>
  );
}

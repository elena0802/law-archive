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
    <article className="group border-t border-line py-8">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-8">
        {eyebrow ? (
          <div className="text-sm leading-6 text-ink-muted">{eyebrow}</div>
        ) : null}
        <div className={eyebrow ? "" : "sm:col-start-2"}>
          <h3 className="text-keep font-serif text-2xl leading-tight text-ink sm:text-[1.65rem]">
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
      className="block hover:[&_h3]:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      href={href}
    >
      {content}
    </Link>
  );
}

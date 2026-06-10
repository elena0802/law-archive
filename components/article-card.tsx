import Image from "next/image";
import Link from "next/link";

type ArticleCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: string;
  href?: string;
  coverSrc?: string;
  coverAlt?: string;
};

export function ArticleCard({
  title,
  description,
  eyebrow,
  meta,
  href,
  coverSrc,
  coverAlt = "글 대표 이미지",
}: ArticleCardProps) {
  const content = (
    <article className="group border-t border-line py-8">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-8">
        {eyebrow ? (
          <div className="text-sm leading-6 text-ink-muted">{eyebrow}</div>
        ) : null}
        {coverSrc ? (
          <div className="relative aspect-[5/3] overflow-hidden bg-paper-muted sm:col-start-2">
            <Image
              alt={coverAlt}
              className="h-full w-full object-cover"
              fill
              sizes="(min-width: 640px) 320px, 100vw"
              src={coverSrc}
            />
          </div>
        ) : null}
        <div className={eyebrow ? "" : "sm:col-start-2"}>
          <h3 className="text-keep font-serif text-2xl leading-tight text-ink sm:text-[1.65rem]">
            {title}
          </h3>
          {description?.trim() ? (
            <p className="mt-3 max-w-2xl text-base leading-8 text-ink-muted">
              {description}
            </p>
          ) : null}
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

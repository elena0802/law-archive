import Image from "next/image";
import Link from "next/link";
import { formatEssayDate, type Essay } from "@/lib/essays";
import { getEssayCoverSrc } from "@/lib/home-images";

type EssayEditorialCardProps = {
  essay: Essay;
};

function EssayThumbnail({ essay }: { essay: Essay }) {
  const coverSrc = getEssayCoverSrc(essay.slug);
  const categoryLabel = essay.category.trim() || "글";

  if (coverSrc) {
    return (
      <div className="relative aspect-[5/3] overflow-hidden bg-paper-muted">
        <Image
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
          src={coverSrc}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="relative flex aspect-[5/3] flex-col justify-between overflow-hidden border-b border-line/60 bg-[linear-gradient(145deg,var(--paper-muted)_0%,var(--paper)_55%)] p-5"
    >
      <span className="text-[0.6875rem] tracking-[0.12em] text-ink-muted/80 uppercase">
        {categoryLabel}
      </span>
      <span className="font-serif text-4xl leading-none text-line/90">稿</span>
    </div>
  );
}

export function EssayEditorialCard({ essay }: EssayEditorialCardProps) {
  return (
    <Link
      className="group flex h-full flex-col overflow-hidden border border-line/80 bg-paper transition-colors hover:border-ink-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      href={`/essays/${essay.slug}`}
    >
      <EssayThumbnail essay={essay} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <time
          className="text-xs tracking-wide text-ink-muted"
          dateTime={essay.date}
        >
          {formatEssayDate(essay.date)}
        </time>
        <h3 className="text-keep mt-3 font-serif text-xl leading-snug text-ink group-hover:text-accent sm:text-[1.35rem]">
          {essay.title}
        </h3>
        <p className="text-keep mt-3 line-clamp-3 flex-1 text-sm leading-[1.75] text-ink-muted">
          {essay.description}
        </p>
      </div>
    </Link>
  );
}

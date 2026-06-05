import Image from "next/image";
import Link from "next/link";
import { homeSectionLinkClassName } from "@/components/home/home-section-link";
import type { AiResearchTrack } from "@/lib/home-ai-research-tracks";
import { getAiResearchCoverSrc } from "@/lib/home-images";

type AiCurrentResearchCardProps = {
  track: AiResearchTrack;
};

function AiResearchTrackIcon() {
  return (
    <svg
      aria-hidden
      className="h-6 w-6 text-accent/75"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 8h14l4 3v13H6V8z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M9 14h10M9 17.5h8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <circle cx="23" cy="11" fill="currentColor" r="1.25" />
    </svg>
  );
}

function AiResearchVisualHeader({ track }: { track: AiResearchTrack }) {
  const coverSrc = getAiResearchCoverSrc(track.imageKey);

  if (coverSrc) {
    return (
      <div className="relative h-28 overflow-hidden rounded-t-sm bg-paper-muted sm:h-32">
        <Image
          alt=""
          className="h-full w-full object-cover object-center"
          fill
          sizes="(min-width: 640px) 320px, 100vw"
          src={coverSrc}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="flex h-28 items-center justify-center rounded-t-sm bg-paper-muted/80 sm:h-32"
    >
      <AiResearchTrackIcon />
    </div>
  );
}

export function AiCurrentResearchCard({ track }: AiCurrentResearchCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden border border-line bg-paper/90">
      <AiResearchVisualHeader track={track} />
      <div className="flex flex-1 flex-col px-6 py-5 sm:px-7 sm:py-6">
        <p className="text-xs tracking-[0.12em] text-accent uppercase">
          현재 진행 중
        </p>
        <h3 className="text-keep mt-2 font-serif text-2xl leading-snug text-ink">
          {track.title}
        </h3>
        <div className="text-keep mt-3 flex-1 space-y-3 text-sm leading-[1.85] text-ink-muted">
          {track.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link className={`mt-5 ${homeSectionLinkClassName}`} href={track.href}>
          연재 보기 →
        </Link>
      </div>
    </article>
  );
}

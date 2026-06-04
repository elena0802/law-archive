import Link from "next/link";
import type { AiResearchTrack } from "@/lib/home-ai-research-tracks";

type AiCurrentResearchCardProps = {
  track: AiResearchTrack;
};

export function AiCurrentResearchCard({ track }: AiCurrentResearchCardProps) {
  return (
    <article className="flex h-full flex-col border border-line bg-paper/90 px-6 py-6 sm:px-8 sm:py-7">
      <p className="text-xs tracking-[0.12em] text-accent uppercase">
        현재 진행 중
      </p>
      <h3 className="text-keep mt-3 font-serif text-2xl leading-snug text-ink">
        {track.title}
      </h3>
      <div className="text-keep mt-4 flex-1 space-y-3 text-sm leading-[1.85] text-ink-muted">
        {track.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <Link
        className="mt-6 inline-block border-b border-accent/70 pb-0.5 text-sm text-accent transition-colors hover:border-accent hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href={track.href}
      >
        연재 보기 →
      </Link>
    </article>
  );
}

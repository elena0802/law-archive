import { AboutSection } from "@/components/about-section";
import {
  formatResearchPublicationLine,
  type ResearchPublication,
} from "@/lib/research-record";

type ResearchPublicationsProps = {
  heading: string;
  publications: readonly ResearchPublication[];
  id?: string;
  intro?: string;
  numbered?: boolean;
};

export function ResearchPublications({
  heading,
  publications,
  id = "research-publications",
  intro,
  numbered = false,
}: ResearchPublicationsProps) {
  return (
    <AboutSection heading={heading} id={id}>
      {intro ? (
        <p className="text-keep text-ink-muted">{intro}</p>
      ) : null}
      <ul
        className={`list-none space-y-0 p-0 ${intro ? "mt-6" : ""}`}
        aria-label={heading}
      >
        {publications.map((publication, index) => (
          <li
            key={publication.id}
            className="text-keep border-t border-line/70 py-5 first:border-t-0 first:pt-0 last:pb-0"
          >
            <div className="flex gap-4 sm:gap-6">
              {numbered ? (
                <span
                  className="shrink-0 font-serif text-lg tabular-nums text-accent"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              ) : null}
              <div className="min-w-0">
                <p className="font-serif text-lg leading-snug text-ink">
                  「{publication.title}」
                </p>
                <p className="mt-1 text-sm tracking-wide text-ink-muted">
                  {formatResearchPublicationLine(publication)}
                </p>
                {publication.note ? (
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {publication.note}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </AboutSection>
  );
}

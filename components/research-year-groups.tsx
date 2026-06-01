import { AboutSection } from "@/components/about-section";
import {
  formatResearchPublicationLine,
  type ResearchYearGroup,
} from "@/lib/research-record";

type ResearchYearGroupsProps = {
  heading: string;
  groups: readonly ResearchYearGroup[];
  id?: string;
};

export function ResearchYearGroups({
  heading,
  groups,
  id = "research-by-year",
}: ResearchYearGroupsProps) {
  return (
    <AboutSection heading={heading} id={id}>
      <div className="space-y-12">
        {groups.map((group) => (
          <div key={group.id}>
            <h3 className="font-serif text-xl leading-tight text-ink">
              {group.label}
            </h3>
            {group.intro ? (
              <p className="text-keep mt-2 text-sm leading-relaxed text-ink-muted">
                {group.intro}
              </p>
            ) : null}
            <ul
              className={`list-none space-y-0 p-0 ${group.intro ? "mt-5" : "mt-4"}`}
              aria-label={`${group.label} 연구 목록`}
            >
              {group.entries.map((publication) => (
                <li
                  key={publication.id}
                  className="text-keep border-t border-line/70 py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <p className="font-serif text-base leading-snug text-ink sm:text-lg">
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
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AboutSection>
  );
}

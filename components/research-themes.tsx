import { AboutSection } from "@/components/about-section";
import type { ResearchTheme } from "@/lib/research-record";

type ResearchThemesProps = {
  heading: string;
  themes: readonly ResearchTheme[];
  id?: string;
};

export function ResearchThemes({
  heading,
  themes,
  id = "research-themes",
}: ResearchThemesProps) {
  return (
    <AboutSection heading={heading} id={id}>
      <ol className="list-none space-y-0 p-0">
        {themes.map((theme, index) => (
          <li
            key={theme.id}
            className="text-keep flex gap-4 border-t border-line/70 py-4 first:border-t-0 first:pt-0 last:pb-0 sm:gap-6"
          >
            <span
              className="shrink-0 font-serif text-lg tabular-nums text-accent"
              aria-hidden
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-serif text-lg leading-snug text-ink">
              {theme.title}
            </span>
          </li>
        ))}
      </ol>
    </AboutSection>
  );
}

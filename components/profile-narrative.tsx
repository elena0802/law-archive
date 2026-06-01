import { AboutSection } from "@/components/about-section";
import type { ProfileNarrativeSection } from "@/lib/profile";

type ProfileNarrativeProps = {
  section: ProfileNarrativeSection;
};

export function ProfileNarrative({ section }: ProfileNarrativeProps) {
  return (
    <AboutSection heading={section.heading} id={section.id}>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-keep not-first:mt-5">
          {paragraph}
        </p>
      ))}
    </AboutSection>
  );
}

import type { ReactNode } from "react";

type AboutSectionProps = {
  children: ReactNode;
  heading: string;
  id?: string;
};

export function AboutSection({ id, heading, children }: AboutSectionProps) {
  return (
    <section
      className="border-t border-line pt-10 first:border-t-0 first:pt-0"
      id={id}
    >
      <h2 className="font-serif text-2xl leading-tight text-ink sm:text-[1.75rem]">
        {heading}
      </h2>
      <div className="mt-5 text-base leading-[1.85] text-ink">{children}</div>
    </section>
  );
}

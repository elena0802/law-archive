import { Section } from "@/components/section";

type ArchiveStatePanelProps = {
  variant: "public" | "admin";
  eyebrow: string;
  title: string;
  supporting: string;
};

export function ArchiveStatePanel({
  variant,
  eyebrow,
  title,
  supporting,
}: ArchiveStatePanelProps) {
  const body = (
    <>
      <p
        className="mb-6 text-sm uppercase tracking-[0.18em] text-accent"
        role="status"
        aria-live="polite"
      >
        {eyebrow}
      </p>
      <h1 className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="text-keep mt-6 text-lg leading-8 text-ink-muted">
        {supporting}
      </p>
    </>
  );

  if (variant === "admin") {
    return <div className="mx-auto max-w-5xl px-6 py-12">{body}</div>;
  }

  return (
    <Section size="reading" className="py-page">
      {body}
    </Section>
  );
}

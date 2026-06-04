type HomeSectionHeaderProps = {
  description?: string;
  headingId: string;
  title: string;
};

export function HomeSectionHeader({
  description,
  headingId,
  title,
}: HomeSectionHeaderProps) {
  return (
    <header className="max-w-2xl">
      <h2
        id={headingId}
        className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-keep mt-3 text-base leading-[1.85] text-ink-muted">
          {description}
        </p>
      ) : null}
    </header>
  );
}

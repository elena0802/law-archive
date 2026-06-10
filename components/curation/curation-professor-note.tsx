type CurationProfessorNoteProps = {
  note: string;
  className?: string;
  lines?: 2 | 3;
};

export function CurationProfessorNote({
  note,
  className = "",
  lines = 2,
}: CurationProfessorNoteProps) {
  const trimmed = note.trim();

  if (!trimmed) {
    return null;
  }

  const lineClampClass = lines === 3 ? "line-clamp-3" : "line-clamp-2";

  return (
    <p
      className={`text-keep text-sm leading-[1.75] text-ink-muted ${lineClampClass} ${className}`}
    >
      {trimmed}
    </p>
  );
}

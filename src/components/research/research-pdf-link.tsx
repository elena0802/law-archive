import type { ResearchItem } from "@/src/types/research";

type ResearchPdfLinkProps = {
  item: ResearchItem;
};

export function ResearchPdfLink({ item }: ResearchPdfLinkProps) {
  if (!item.pdfUrl) {
    return null;
  }

  return (
    <p className="mt-4">
      <a
        className="text-sm text-accent underline-offset-4 hover:underline"
        href={item.pdfUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        PDF 열기
      </a>
    </p>
  );
}
